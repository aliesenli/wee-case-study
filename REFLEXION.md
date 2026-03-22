# Reflexion (WEE Case Study Flugbuchungssystem)

## Technische Umsetzung und Lessons Learned

Das Flugbuchungssystem wurde erfolgreich als moderne Single Page Application mit Node.js/Express-Backend und PostgreSQL-Datenbank umgesetzt. Nachfolgend eine Reflexion über Herausforderungen, Learnings und Designentscheidungen.

### Architekturentscheidungen

Die Wahl von **React mit TypeScript (Frontend)**, **Express.js mit TypeScript (Backend)** und **PostgreSQL 18 (Datenbank)** hat sich als optimal erwiesen. React ermöglichte eine komponentenbasierte, wartbare UI, während TypeScript Typensicherheit über alle Layer garantierte. Das Node.js/Express-Stack bot maximale Flexibilität und schnelle Entwicklung.

Besonders wertvoll war die Verwendung von **Drizzle ORM**, das SQL-Injection verhindert und gleichzeitig Type-safe Datenbankabfragen ermöglicht. Ein grosser Sicherheitsvorteil gegenüber Raw SQL oder unsicheren Query-Builder.

### Herausforderungen und Lösungen

**Authentifizierung & Session-Management**
Die Integration von **better-auth** vereinfachte complex Auth-Flows erheblich. HTTP-Only Cookies mit SameSite=Strict schützen vor CSRF, während Argon2-Hashing die Passwortsicherheit garantiert. Dies war deutlich robuster als Manual-JWT-Implementierungen.

### Best Practices und Standards

1. **Umgebungsvariablen**: Docker Compose bezieht Werte aus `.env` in definierter Reihenfolge (Shell > .env > Fallback im Compose-File). Die Dokumentation hierzu im README ist essentiell.

2. **Responsives Design (SCSS Modules)**: Die CSS-Module-Strategie vermied globale Style-Konflikte und ermöglichte BEM-Konventionen pro Komponente.

3. **API-Error-Handling**: Strukturierte Error-Responses mit HTTP-Status-Codes (404 Flight Not Found, 401 Unauthorized) ermöglichen Client-seitige Fehleraufbereitung.

4. **Pagination & Performance**: Das System wurde ab Anfang mit Pagination (10 Flüge/Seite) ausgelegt. Response-Zeiten liegen unter 300ms auch bei 100+ Flügen – ein Produktionsstandard.

### Testing und Qualitätssicherung

Die umfassenden Testprotokolle decken alle funktionale Anforderungen ab.

### Lessons Learned

1. Monorepo-Struktur (pnpm/Workspaces) ermöglichte Code-Sharing und einheitliches Build-Tooling.

2. Docker Compose für lokales Development hat sich bewährt – die Produktivität stieg durch automatisiertes Datenbanksetup.

3. TypeScript über alle Layer bot frühe Fehler-Erkennung und verbesserte Code-Wartbarkeit.

---