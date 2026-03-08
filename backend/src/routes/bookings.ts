import { Router, type Router as ExpressRouter, type Request, type Response } from "express";
import { db } from "../db/index.js";
import { bookings, flights } from "../db/schema.js";
import { and, eq, desc, sql, ilike, asc, type SQL } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";

const router: ExpressRouter = Router();

const createBookingSchema = z.object({
  flightId: z.string().uuid(),
  passengerName: z.string().min(2).max(100),
  passengerEmail: z.string().email(),
  paymentDetails: z
    .object({
      cardLastFour: z.string().length(4),
      cardHolder: z.string().min(2),
      method: z.enum(["credit_card", "debit_card"]),
    })
    .optional(),
});

const bookingQuerySchema = z.object({
  airline: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z
    .enum(["booked_asc", "booked_desc", "price_asc", "price_desc"])
    .optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// GET /api/bookings – current user's booking history
router.get(
  "/",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = bookingQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { airline, minPrice, maxPrice, sortBy, page, limit } = parsed.data;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [eq(bookings.userId, session.user.id)];

    if (airline) {
      conditions.push(ilike(flights.airline, `%${airline}%`));
    }
    if (minPrice !== undefined)
      conditions.push(sql`${bookings.totalPrice} >= ${String(minPrice)}`);
    if (maxPrice !== undefined)
      conditions.push(sql`${bookings.totalPrice} <= ${String(maxPrice)}`);

    const orderBy =
      sortBy === "booked_asc"
        ? asc(bookings.bookedAt)
        : sortBy === "price_asc"
          ? asc(bookings.totalPrice)
          : sortBy === "price_desc"
            ? desc(bookings.totalPrice)
            : desc(bookings.bookedAt); // default: newest first

    const [rows, countResult] = await Promise.all([
      db
        .select({
          booking: bookings,
          flight: flights,
        })
        .from(bookings)
        .innerJoin(flights, eq(bookings.flightId, flights.id))
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(bookings)
        .innerJoin(flights, eq(bookings.flightId, flights.id))
        .where(and(...conditions)),
    ]);

    res.json({
      data: rows,
      pagination: {
        total: countResult[0]?.count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((countResult[0]?.count ?? 0) / limit),
      },
    });
  }
);

// POST /api/bookings – create a new booking
router.post(
  "/",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }

    const { flightId, passengerName, passengerEmail, paymentDetails } =
      parsed.data;

    // Run inside a transaction: check & decrement ticket count atomically
    const result = await db.transaction(async (tx) => {
      const [flight] = await tx
        .select()
        .from(flights)
        .where(eq(flights.id, flightId))
        .limit(1)
        .for("update"); // row-level lock

      if (!flight) {
        throw new Error("FLIGHT_NOT_FOUND");
      }

      if (flight.availableTickets < 1) {
        throw new Error("NO_TICKETS_AVAILABLE");
      }

      // Decrement available tickets
      await tx
        .update(flights)
        .set({ availableTickets: flight.availableTickets - 1 })
        .where(eq(flights.id, flightId));

      const [booking] = await tx
        .insert(bookings)
        .values({
          userId: session.user.id,
          flightId,
          passengerName,
          passengerEmail,
          paymentDetails: paymentDetails ?? null,
          totalPrice: flight.price,
          status: "confirmed",
        })
        .returning();

      return { booking, flight };
    });

    res.status(201).json(result);
  }
);

// GET /api/bookings/:id – get single booking (owner only)
router.get(
  "/:id",
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const id = String(req.params.id);

    const [row] = await db
      .select({ booking: bookings, flight: flights })
      .from(bookings)
      .innerJoin(flights, eq(bookings.flightId, flights.id))
      .where(and(eq(bookings.id, id), eq(bookings.userId, session.user.id)))
      .limit(1);

    if (!row) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json(row);
  }
);

export default router;
