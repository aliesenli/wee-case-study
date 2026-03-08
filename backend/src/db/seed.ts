import "dotenv/config";
import { db, pool } from "./index.js";
import { flights } from "./schema.js";

const sampleFlights = [
  {
    flightNumber: "LX100",
    airline: "SWISS",
    origin: "Zürich (ZRH)",
    destination: "London (LHR)",
    departureTime: new Date("2026-04-10T07:30:00Z"),
    arrivalTime: new Date("2026-04-10T09:00:00Z"),
    price: "189.00",
    availableTickets: 45,
  },
  {
    flightNumber: "LX200",
    airline: "SWISS",
    origin: "Zürich (ZRH)",
    destination: "New York (JFK)",
    departureTime: new Date("2026-04-12T10:00:00Z"),
    arrivalTime: new Date("2026-04-12T13:30:00Z"),
    price: "620.00",
    availableTickets: 12,
  },
  {
    flightNumber: "OS301",
    airline: "Austrian Airlines",
    origin: "Wien (VIE)",
    destination: "Zürich (ZRH)",
    departureTime: new Date("2026-04-11T06:15:00Z"),
    arrivalTime: new Date("2026-04-11T07:45:00Z"),
    price: "149.00",
    availableTickets: 0,
  },
  {
    flightNumber: "LH440",
    airline: "Lufthansa",
    origin: "Frankfurt (FRA)",
    destination: "Barcelona (BCN)",
    departureTime: new Date("2026-04-15T14:20:00Z"),
    arrivalTime: new Date("2026-04-15T17:00:00Z"),
    price: "210.00",
    availableTickets: 30,
  },
  {
    flightNumber: "LH441",
    airline: "Lufthansa",
    origin: "Barcelona (BCN)",
    destination: "Frankfurt (FRA)",
    departureTime: new Date("2026-04-22T18:30:00Z"),
    arrivalTime: new Date("2026-04-22T21:10:00Z"),
    price: "205.00",
    availableTickets: 28,
  },
  {
    flightNumber: "KL1234",
    airline: "KLM",
    origin: "Amsterdam (AMS)",
    destination: "Rome (FCO)",
    departureTime: new Date("2026-04-18T09:45:00Z"),
    arrivalTime: new Date("2026-04-18T13:05:00Z"),
    price: "175.00",
    availableTickets: 60,
  },
  {
    flightNumber: "LX350",
    airline: "SWISS",
    origin: "Zürich (ZRH)",
    destination: "Dubai (DXB)",
    departureTime: new Date("2026-04-20T22:00:00Z"),
    arrivalTime: new Date("2026-04-21T06:15:00Z"),
    price: "480.00",
    availableTickets: 5,
  },
  {
    flightNumber: "BA726",
    airline: "British Airways",
    origin: "London (LHR)",
    destination: "Vienna (VIE)",
    departureTime: new Date("2026-04-25T13:00:00Z"),
    arrivalTime: new Date("2026-04-25T16:20:00Z"),
    price: "230.00",
    availableTickets: 22,
  },
  {
    flightNumber: "FR9001",
    airline: "Ryanair",
    origin: "Dublin (DUB)",
    destination: "Barcelona (BCN)",
    departureTime: new Date("2026-05-01T06:00:00Z"),
    arrivalTime: new Date("2026-05-01T09:30:00Z"),
    price: "49.99",
    availableTickets: 80,
  },
  {
    flightNumber: "EK42",
    airline: "Emirates",
    origin: "Dubai (DXB)",
    destination: "New York (JFK)",
    departureTime: new Date("2026-04-30T03:30:00Z"),
    arrivalTime: new Date("2026-04-30T11:00:00Z"),
    price: "850.00",
    availableTickets: 3,
  },
];

async function main() {
  console.log("Seeding database...");

  await db.delete(flights);
  await db.insert(flights).values(sampleFlights);

  console.log(`Seeded ${sampleFlights.length} flights.`);
  console.log(
    "Demo user: register via the app UI or POST /api/auth/sign-up/email"
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
