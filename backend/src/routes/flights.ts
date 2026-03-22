import { Router, type Router as ExpressRouter, type Request, type Response } from "express";
import { db } from "../db/index.js";
import { flights } from "../db/schema.js";
import {
  and,
  gte,
  lte,
  ilike,
  eq,
  sql,
  asc,
  desc,
  type SQL,
} from "drizzle-orm";
import { z } from "zod";

const router: ExpressRouter = Router();

const flightQuerySchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(), // YYYY-MM-DD
  airline: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  availableOnly: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "departure_asc", "departure_desc"])
    .optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

// GET /api/flights
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const parsed = flightQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const {
    origin,
    destination,
    date,
    airline,
    minPrice,
    maxPrice,
    availableOnly,
    sortBy,
    page,
    limit,
  } = parsed.data;

  const conditions: SQL[] = [];

  if (origin) conditions.push(ilike(flights.origin, `%${origin}%`));
  if (destination)
    conditions.push(ilike(flights.destination, `%${destination}%`));
  if (airline) conditions.push(ilike(flights.airline, `%${airline}%`));
  if (minPrice !== undefined)
    conditions.push(gte(flights.price, String(minPrice)));
  if (maxPrice !== undefined)
    conditions.push(lte(flights.price, String(maxPrice)));
  if (availableOnly) conditions.push(gte(flights.availableTickets, 1));

  if (date) {
    const start = new Date(`${date}T00:00:00Z`);
    const end = new Date(`${date}T23:59:59Z`);
    conditions.push(
      gte(flights.departureTime, start),
      lte(flights.departureTime, end)
    );
  }

  const orderBy =
    sortBy === "price_asc"
      ? asc(flights.price)
      : sortBy === "price_desc"
        ? desc(flights.price)
        : sortBy === "departure_desc"
          ? desc(flights.departureTime)
          : asc(flights.departureTime); // default: departure_asc

  const offset = (page - 1) * limit;

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(flights)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(flights)
      .where(conditions.length > 0 ? and(...conditions) : undefined),
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
});

// GET /api/flights/:id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);
  const [flight] = await db
    .select()
    .from(flights)
    .where(eq(flights.id, id))
    .limit(1);

  if (!flight) {
    res.status(404).json({ error: "Flight not found" });
    return;
  }

  res.json(flight);
});

export default router;
