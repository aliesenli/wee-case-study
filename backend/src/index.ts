import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import flightsRouter from "./routes/flights.js";
import bookingsRouter from "./routes/bookings.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/flights", flightsRouter);
app.use("/api/bookings", bookingsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    const message =
      err.message === "FLIGHT_NOT_FOUND"
        ? "Flight not found"
        : err.message === "NO_TICKETS_AVAILABLE"
          ? "No tickets available for this flight"
          : "Internal server error";

    const status =
      err.message === "FLIGHT_NOT_FOUND"
        ? 404
        : err.message === "NO_TICKETS_AVAILABLE"
          ? 409
          : 500;

    if (status === 500) {
      console.error(err);
    }

    res.status(status).json({ error: message });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
