# WEE Flugbuchungssystem

Ein Flugbuchungssystem als Single Page Application (SPA) mit RESTful Web Service und PostgreSQL-Datenbank.

## Technologie-Stack

| Schicht | Technologie |
|---------|-------------|
| Frontend | React 19 · TypeScript · Vite · SCSS Modules |
| Backend | Node.js · Express.js · TypeScript |
| Auth | better-auth 1.x (Email + Passwort) |
| ORM | Drizzle ORM |
| Datenbank | PostgreSQL 18 |
| Laufzeitumgebung | Node.js ≥ 20 · pnpm ≥ 9 · Docker |

---

## Voraussetzungen

| Software | Version (getestet) | Download |
|----------|--------------------|----------|
| Node.js  | ≥ 20 LTS           | https://nodejs.org |
| pnpm     | ≥ 9                | `npm i -g pnpm` |
| Docker & Docker Compose | Desktop | https://www.docker.com/products/docker-desktop |

---

## Installation & Start

### 1. Repository klonen / entpacken

```bash
cd wee-case-study
```

### 2. Abhängigkeiten installieren (Monorepo)

```bash
pnpm install
```

### 3. Umgebungsvariablen konfigurieren

Kopieren Sie die Beispieldatei und passen Sie die Werte an:

```bash
# Werte für PostgreSQL, Secret etc. anpassen
cp backend/.env.example backend/.env   # bereits vorhanden mit Standardwerten
cp frontend/.env.example frontend/.env # (optional, Standard passt für local dev)
```

**Wichtige Variablen in `backend/.env`:**

| Variable | Standard | Beschreibung |
|----------|----------|--------------|
| `DATABASE_URL` | `postgresql://wee_user:wee_password@localhost:5432/wee_flights` | PostgreSQL-Verbindung |
| `BETTER_AUTH_URL` | `http://localhost:3001` | Backend-URL (für Cookie-Domain) |
| `FRONTEND_URL` | `http://localhost:5173` | CORS-Origin |
| `PORT` | `3001` | Serverport |

### 4. PostgreSQL-Datenbank starten (Docker)

```bash
docker compose up -d
# Warten bis health check grün: docker compose ps
```

### 5. Datenbank-Tabellen erstellen (Drizzle Migrate)

```bash
# Migrationen generieren (nur nötig wenn Schema geändert wurde)
pnpm --filter backend db:generate

# Migrationen auf der DB anwenden
pnpm --filter backend db:migrate
```

### 6. Seed-Daten einspielen (Beispielflüge)

```bash
pnpm --filter backend db:seed
```

Dieser Schritt legt **10 Beispielflüge** an und gibt einen Hinweis aus, wie der Demo-User erstellt werden kann.

### 7. Entwicklungsserver starten

```bash
# Frontend + Backend parallel starten
pnpm dev
```

| Dienst   | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3001 |
| DB Admin (optional) | `pnpm --filter backend db:studio` → http://local.drizzle.studio |

---

## Demo-Benutzer anlegen

Registrieren Sie sich direkt über die Weboberfläche unter http://localhost:5173/register

oder via REST:

```bash
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"name":"Felix Huber","email":"felix@example.com","password":"password123"}'
```

**Vorgeschlagene Demo-Credentials:**
- E-Mail: `felix@example.com`
- Passwort: `password123`

---

## API-Endpunkte

### Authentifizierung (better-auth)

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| `POST` | `/api/auth/sign-up/email` | Registrierung |
| `POST` | `/api/auth/sign-in/email` | Anmeldung |
| `POST` | `/api/auth/sign-out` | Abmeldung |
| `GET`  | `/api/auth/get-session` | Aktive Session abfragen |

### Flüge

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| `GET` | `/api/flights` | Flüge suchen & filtern |
| `GET` | `/api/flights/:id` | Einzelnen Flug abrufen |

**Query-Parameter für `GET /api/flights`:**

| Parameter | Typ | Beschreibung |
|-----------|-----|--------------|
| `origin` | string | Abreiseort (Teilstring, case-insensitive) |
| `destination` | string | Zielort |
| `date` | `YYYY-MM-DD` | Abflugdatum |
| `airline` | string | Fluggesellschaft |
| `minPrice` | number | Mindestpreis in CHF |
| `maxPrice` | number | Höchstpreis in CHF |
| `availableOnly` | boolean | Nur verfügbare Flüge |
| `sortBy` | `price_asc` \| `price_desc` \| `departure_asc` \| `departure_desc` | Sortierung |
| `page` | number | Seitennummer (Start: 1) |
| `limit` | number | Ergebnisse pro Seite (max. 100) |

### Buchungen (Authentifizierung erforderlich)

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| `GET` | `/api/bookings` | Eigene Buchungshistorie |
| `POST` | `/api/bookings` | Neue Buchung erstellen |
| `GET` | `/api/bookings/:id` | Einzelne Buchung abrufen |

---

## Datenbankschema

```
user          – Benutzerkonten (better-auth)
session       – Aktive Sessions (better-auth)
account       – OAuth-/Passwort-Accounts (better-auth)
verification  – E-Mail-Verifikationen (better-auth)

flights       – Flüge (flightNumber, airline, origin, destination, departureTime, arrivalTime, price, availableTickets)
bookings      – Buchungen (userId, flightId, passengerName, passengerEmail, paymentDetails, totalPrice, status)
```

### Datenbankschema manuell erstellen (ohne Docker)

Falls Sie eine bestehende PostgreSQL-Instanz verwenden, passen Sie `DATABASE_URL` in `backend/.env` an und führen Sie aus:

```bash
pnpm --filter backend db:migrate
```

---

## Projektstruktur

```
wee-case-study/
├── docker-compose.yml          # PostgreSQL Container
├── pnpm-workspace.yaml         # pnpm Monorepo-Konfiguration
├── package.json                # Root-Scripts (dev, build)
├── .env.example                # Dokumentation aller Env-Variablen
│
├── backend/
│   ├── .env                    # Env-Variablen (nicht in Git)
│   ├── drizzle.config.ts       # Drizzle ORM Konfiguration
│   ├── drizzle/                # Generierte Migrations-SQL
│   └── src/
│       ├── index.ts            # Express-App Einstiegspunkt
│       ├── auth.ts             # better-auth Konfiguration
│       ├── db/
│       │   ├── index.ts        # Drizzle/pg-Verbindung
│       │   ├── schema.ts       # Datenbankschema (Tabellen & Typen)
│       │   ├── migrate.ts      # Migrations-Runner
│       │   └── seed.ts         # Seed-Daten
│       ├── middleware/
│       │   └── requireAuth.ts  # Auth-Middleware
│       └── routes/
│           ├── flights.ts      # GET /api/flights, GET /api/flights/:id
│           └── bookings.ts     # GET/POST /api/bookings
│
└── frontend/
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx             # Router & Provider
        ├── api/                # API-Client-Funktionen
        ├── components/         # Navbar, FlightCard, SearchForm, …
        ├── contexts/           # AuthContext
        ├── pages/              # SearchPage, BookingsPage, LoginPage, …
        ├── styles/             # SCSS Variablen, Mixins, Global
        └── types/              # TypeScript-Interfaces
```

---

## Sicherheit

- Passwörter werden von better-auth mit **Argon2** gehasht
- Sessions via **HTTP-Only Cookies** (CSRF-sicher)
- Alle Datenbankabfragen via **Drizzle ORM** (parametrisiert – kein SQL-Injection-Risiko)
- CORS auf Frontend-Origin beschränkt
- Buchungen prüfen Ticket-Verfügbarkeit **innerhalb einer Transaktion** (Row-Level-Lock)
