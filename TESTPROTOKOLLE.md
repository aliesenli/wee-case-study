# Testprotokolle – WEE Case Study Flugbuchungssystem

## Epic 1: Flugübersicht & Filter – UI-Tests Suchmaske

| TC-ID | Testfall | Eingabe | Erwartetes Ergebnis | Aktuelles Ergebnis | Status |
|-------|----------|---------|---------------------|-------------------|--------|
| TC-1.1 | Suchmaske wird korrekt geladen | Seite aufrufen | Alle Eingabefelder (Abreiseort, Zielort, Datum, Zeit, Fluggesellschaft, Preis, Verfügbarkeit) sind sichtbar | Alle Felder angezeigt | ✅ PASS |
| TC-1.2 | Filter nach Abreiseort | Eingabe: "Zürich" | Nur Flüge ab Zürich werden angezeigt | Korrekt gefiltert | ✅ PASS |
| TC-1.3 | Filter nach Zielort | Eingabe: "Berlin" | Nur Flüge nach Berlin werden angezeigt | Korrekt gefiltert | ✅ PASS |
| TC-1.4 | Filter nach Datum | Eingabe: "2026-04-15" | Nur Flüge am 15.04.2026 werden angezeigt | Korrekt gefiltert | ✅ PASS |
| TC-1.5 | Filter nach Preis (Min-Max) | Min: 150, Max: 400 | Flüge zwischen CHF 150–400 werden angezeigt | Ergebnisse korrekt | ✅ PASS |
| TC-1.6 | Filter nach Ticketverfügbarkeit | availableOnly: true | Nur Flüge mit verfügbaren Tickets | Korrekt gefiltert | ✅ PASS |
| TC-1.7 | Sortierung nach Preis (aufsteigend) | sortBy: price_asc | Ergebnisse nach Preis aufsteigend sortiert | Sortierung korrekt | ✅ PASS |
| TC-1.8 | Mehrere Filter kombinieren | Abreiseort: "Zürich", Zielort: "Paris", Preis: 200–500 | Flüge ab Zürich nach Paris, CHF 200–500 | Alle Filter kombiniert | ✅ PASS |
| TC-1.9 | Pagination (Seite 1, Limit 10) | page: 1, limit: 10 | 10 Flüge pro Seite | 10 Flüge angezeigt | ✅ PASS |
| TC-1.10 | Keine Ergebnisse | Filter mit unrealistischen Werten | Leer-Nachricht angezeigt | "Keine Flüge gefunden" | ✅ PASS |

---

## Epic 2: Buchungssystem – End-to-End-Tests Buchungsprozess

| TC-ID | Testfall | Voraussetzung | Schritte | Erwartetes Ergebnis | Aktuelles Ergebnis | Status |
|-------|----------|---------------|----------|---------------------|-------------------|--------|
| TC-2.1 | Benutzer registriert sich | – | 1. Auf "Registrieren" klicken 2. Name, Email, Passwort eingeben 3. Formular absenden | Benutzer erstellt, zur Login-Seite weitergeleitet | Benutzer erfolgreich registriert | ✅ PASS |
| TC-2.2 | Benutzer loggt sich ein | Benutzer registriert | 1. Email und Passwort eingeben 2. "Anmelden" klicken | Benutzer authentifiziert, zur Flugsuche weitergeleitet | Authentifizierung erfolgreich | ✅ PASS |
| TC-2.3 | Flug wird ausgewählt | Benutzer angemeldet, Flüge geladen | 1. Flug anklicken 2. Details anschauen 3. "Buchen" klicken | Buchungsformular wird geöffnet | Formular angezeigt | ✅ PASS |
| TC-2.4 | Gültige Buchung durchführen | Benutzer angemeldet, Flug ausgewählt | 1. Passengiername eingeben (z.B. "Felix Huber") 2. Email eingeben 3. Zahlungsdetails bestätigen 4. "Buchen" klicken | Buchung erfolgreich, Bestätigungsmeldung, Ticketdaten angezeigt | Erfolgreiches Booking-Response (200 OK) | ✅ PASS |
| TC-2.5 | Tickets prüfen vor Buchung | Flug mit nur 1 verfügbarem Ticket | 1. Zwei Benutzer versuchen gleichzeitig zu buchen | Nur erste Buchung erfolgreich, zweite erhält "Keine Tickets verfügbar" | Fehlerbehandlung korrekt | ✅ PASS |
| TC-2.6 | Ungültige Eingaben | Passengiername leer | 1. Formular ohne Passengiername absenden | Validierungsfehler, Formular wird nicht gesendet | Fehler angezeigt: "Passengiername erforderlich" | ✅ PASS |
| TC-2.7 | Bereits gebuchter Flug (nicht möglich) | Flug mit 0 Tickets | Versuch zu buchen | Fehlermeldung "Keine Tickets mehr verfügbar", keine Buchung erstellt | Error 409 Conflict | ✅ PASS |
| TC-2.8 | Buchungsbestätigung wird angezeigt | Gültige Buchung abgeschlossen | 1. Auf "Buchungen anschauen" klicken | Buchung in der Liste, mit allen Details | Booking angezeigt | ✅ PASS |
| TC-2.9 | Benutzer abmelden | Benutzer angemeldet | 1. "Abmelden" klicken | Session gelöscht, zur Login-Seite weitergeleitet | Logout erfolgreich | ✅ PASS |

---

## Epic 3: Buchungshistorie – API- und UI-Tests

| TC-ID | Testfall | Voraussetzung | Eingabe/Aktion | Erwartetes Ergebnis | Aktuelles Ergebnis | Status |
|-------|----------|---------------|-----------------|---------------------|-------------------|--------|
| TC-3.1 | GET /api/bookings (authentifiziert) | Benutzer mit 3 Buchungen angemeldet | Request an /api/bookings ohne Parameter | Array mit 3 Buchungen (JSON) | 200 OK, alle Buchungen zurückgegeben | ✅ PASS |
| TC-3.2 | GET /api/bookings ohne Auth | – | cURL ohne Session-Cookie | 401 Unauthorized | 401 Unauthorized | ✅ PASS |
| TC-3.3 | Buchungshistorie in UI laden | Benutzer angemeldet mit Buchungen | 1. Zu "Meine Buchungen" navigieren | Liste mit allen bisherigen Buchungen | Alle Buchungen angezeigt | ✅ PASS |
| TC-3.4 | Buchungsdaten vollständig | Eine Buchung vorhanden | Auf Buchung klicken | Flugdaten, Passagier, Datum, Preis, Status | Alle Felder vorhanden | ✅ PASS |
| TC-3.5 | Sortierung nach Datum (absteigend) | ≥2 Buchungen mit verschiedenen Daten | Spalte "Datum" sortieren | Jüngste Buchung oben | Korrekt sortiert | ✅ PASS |
| TC-3.6 | Filter nach Fluggesellschaft | ≥3 Buchungen verschiedener Airlines | Filter: Lufthansa | Nur Lufthansa-Flüge | Korrekt gefiltert | ✅ PASS |
| TC-3.7 | Pagination bei vielen Buchungen | >10 Buchungen | Seite 2 aufrufen | Buchungen 11–20 werden angezeigt | Pagination funktioniert | ✅ PASS |
| TC-3.8 | Keine Buchungen vorhanden | Neuer Benutzer ohne Buchungen | Zu "Meine Buchungen" navigieren | Hinweismeldung "Keine Buchungen vorhanden" | Leere Meldung angezeigt | ✅ PASS |
| TC-3.9 | Buchung anzeigen nach längerer Inaktivität | Session aktiv >1 Stunde | Zu Buchungshistorie navigieren | Daten werden geladen | Daten korrekt | ✅ PASS |

---
