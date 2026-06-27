import { hashPassword } from "../lib/password";
import { db, DB_PATH } from "./index";
import { defects, type NewDefect, type NewUser, users } from "./schema";

/**
 * Seeds the database with realistic example defects so the list (and later the
 * dashboard) looks populated right after `git clone`. Run with `npm run db:seed`.
 *
 * The script is idempotent: it clears the table first, then re-inserts.
 */

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * DAY);
const inDays = (n: number) => new Date(now + n * DAY);

const seedData: NewDefect[] = [
  {
    title: "Spaltmaß an Frontklappe zu groß",
    description:
      "Bei Charge 2024-14 ist das Spaltmaß zwischen Frontklappe und Kotflügel rechts deutlich über Toleranz (3,8 mm statt 2,5 mm).",
    category: "Mechanik",
    status: "open",
    priority: "high",
    assignee: "Anna Becker",
    createdAt: daysAgo(2),
    dueAt: inDays(5),
  },
  {
    title: "Login schlägt nach Passwort-Reset fehl",
    description:
      "Nutzer können sich nach einem Passwort-Reset nicht anmelden. Vermutlich wird der alte Hash nicht invalidiert.",
    category: "Software",
    status: "in_progress",
    priority: "high",
    assignee: "Tobias Mayer",
    createdAt: daysAgo(4),
    dueAt: inDays(2),
  },
  {
    title: "Lackoberfläche mit Einschlüssen",
    description:
      "Auf der Motorhaube sind kleine Staubeinschlüsse im Klarlack sichtbar. Tritt vermehrt in Lackierkabine 2 auf.",
    category: "Oberfläche",
    status: "open",
    priority: "medium",
    assignee: "Sandra Klein",
    createdAt: daysAgo(5),
    dueAt: inDays(9),
  },
  {
    title: "Schraubverbindung löst sich bei Vibration",
    description:
      "Im Dauerlauftest lösen sich die M6-Schrauben der Halterung. Schraubensicherung fehlt laut Stückliste.",
    category: "Montage",
    status: "in_progress",
    priority: "high",
    assignee: "Markus Wolf",
    createdAt: daysAgo(6),
    dueAt: inDays(1),
  },
  {
    title: "Falsche Bauteile vom Lieferant geliefert",
    description:
      "Lieferung enthielt Dichtungen in der falschen Härte (70 ShA statt 60 ShA). Reklamation läuft.",
    category: "Lieferant",
    status: "open",
    priority: "high",
    assignee: "Julia Schäfer",
    createdAt: daysAgo(3),
    dueAt: inDays(7),
  },
  {
    title: "Display flackert bei niedriger Temperatur",
    description:
      "Unter 5 °C beginnt das Bedien-Display zu flackern. Reproduzierbar in der Klimakammer.",
    category: "Elektrik",
    status: "open",
    priority: "medium",
    assignee: "Peter Hofmann",
    createdAt: daysAgo(8),
    dueAt: inDays(12),
  },
  {
    title: "Verpackung beschädigt bei Anlieferung",
    description:
      "Kartons der Charge KW18 kamen eingedrückt an. Transportschäden an ca. 8 % der Teile.",
    category: "Verpackung",
    status: "done",
    priority: "low",
    assignee: "Lena Vogel",
    createdAt: daysAgo(22),
    dueAt: daysAgo(15),
  },
  {
    title: "Stückliste weicht von Zeichnung ab",
    description:
      "In der Stückliste fehlt die Unterlegscheibe, die in der technischen Zeichnung vorgesehen ist.",
    category: "Dokumentation",
    status: "done",
    priority: "medium",
    assignee: "Daniel Braun",
    createdAt: daysAgo(25),
    dueAt: daysAgo(18),
  },
  {
    title: "CSV-Export enthält doppelte Zeilen",
    description:
      "Beim Export der Prüfdaten erscheinen einzelne Datensätze doppelt. Tritt nur bei großen Exporten auf.",
    category: "Software",
    status: "in_progress",
    priority: "medium",
    assignee: "Tobias Mayer",
    createdAt: daysAgo(7),
    dueAt: inDays(4),
  },
  {
    title: "Kabelbaum scheuert an Gehäusekante",
    description:
      "Der Kabelbaum liegt an einer scharfen Gehäusekante an. Gefahr der Isolationsbeschädigung.",
    category: "Elektrik",
    status: "open",
    priority: "high",
    assignee: "Peter Hofmann",
    createdAt: daysAgo(1),
    dueAt: inDays(3),
  },
  {
    title: "Gewinde in Aluminiumteil ausgerissen",
    description:
      "Beim Anziehen mit Soll-Drehmoment reißt das Gewinde aus. Wandstärke evtl. zu gering.",
    category: "Mechanik",
    status: "open",
    priority: "medium",
    assignee: "Anna Becker",
    createdAt: daysAgo(9),
    dueAt: inDays(10),
  },
  {
    title: "Falsche Beschriftung auf Typenschild",
    description:
      "Auf dem Typenschild ist eine veraltete Artikelnummer aufgedruckt.",
    category: "Dokumentation",
    status: "done",
    priority: "low",
    assignee: "Sandra Klein",
    createdAt: daysAgo(30),
    dueAt: daysAgo(24),
  },
  {
    title: "Lüfter zu laut im Normalbetrieb",
    description:
      "Geräuschmessung ergibt 52 dB(A) statt zulässiger 45 dB(A). Lagerung des Lüfters prüfen.",
    category: "Mechanik",
    status: "in_progress",
    priority: "medium",
    assignee: "Markus Wolf",
    createdAt: daysAgo(11),
    dueAt: inDays(6),
  },
  {
    title: "Dichtung undicht nach Temperaturwechsel",
    description:
      "Nach Wechseltest (−20 °C / +60 °C) tritt an der Hauptdichtung Wasser ein.",
    category: "Qualitätssicherung",
    status: "open",
    priority: "high",
    assignee: "Julia Schäfer",
    createdAt: daysAgo(10),
    dueAt: inDays(8),
  },
  {
    title: "App stürzt beim Scannen langer Barcodes ab",
    description:
      "Barcodes mit mehr als 24 Zeichen führen reproduzierbar zum Absturz der Scanner-App.",
    category: "Software",
    status: "open",
    priority: "high",
    assignee: "Tobias Mayer",
    createdAt: daysAgo(2),
    dueAt: inDays(2),
  },
  {
    title: "Pulverbeschichtung blättert ab",
    description:
      "An Kanten löst sich die Pulverbeschichtung. Vorbehandlung (Entfettung) wird geprüft.",
    category: "Oberfläche",
    status: "in_progress",
    priority: "medium",
    assignee: "Sandra Klein",
    createdAt: daysAgo(13),
    dueAt: inDays(5),
  },
  {
    title: "Toleranz Bohrungsabstand überschritten",
    description:
      "Bohrungsabstand bei Trägerblech um 0,4 mm außerhalb der Toleranz. Vorrichtung nachjustieren.",
    category: "Mechanik",
    status: "done",
    priority: "medium",
    assignee: "Anna Becker",
    createdAt: daysAgo(28),
    dueAt: daysAgo(20),
  },
  {
    title: "Falsche Sprache in Benutzeroberfläche",
    description:
      "Nach Update erscheint die Oberfläche teilweise auf Englisch statt Deutsch.",
    category: "Software",
    status: "done",
    priority: "low",
    assignee: "Tobias Mayer",
    createdAt: daysAgo(19),
    dueAt: daysAgo(12),
  },
  {
    title: "Steckverbinder rastet nicht hörbar ein",
    description:
      "Der Steckverbinder X12 rastet nicht spürbar ein, Gefahr der losen Verbindung in der Montage.",
    category: "Elektrik",
    status: "open",
    priority: "medium",
    assignee: "Peter Hofmann",
    createdAt: daysAgo(12),
    dueAt: inDays(11),
  },
  {
    title: "Palettenetiketten nicht scanbar",
    description:
      "Die aufgebrachten Etiketten haben zu geringen Kontrast und werden vom Scanner nicht erkannt.",
    category: "Logistik",
    status: "in_progress",
    priority: "low",
    assignee: "Lena Vogel",
    createdAt: daysAgo(15),
    dueAt: inDays(3),
  },
  {
    title: "Schweißnaht mit Poren",
    description:
      "Röntgenprüfung zeigt Porenbildung in der Längsnaht. Schutzgasmenge prüfen.",
    category: "Montage",
    status: "open",
    priority: "high",
    assignee: "Markus Wolf",
    createdAt: daysAgo(3),
    dueAt: inDays(4),
  },
  {
    title: "Akkulaufzeit unter Spezifikation",
    description:
      "Gemessene Laufzeit 6,2 h statt spezifizierter 8 h. Stromaufnahme im Standby zu hoch.",
    category: "Elektrik",
    status: "in_progress",
    priority: "high",
    assignee: "Peter Hofmann",
    createdAt: daysAgo(14),
    dueAt: inDays(2),
  },
  {
    title: "Oberfläche mit Kratzern nach Transport",
    description:
      "Sichtbauteile weisen nach innerbetrieblichem Transport Kratzer auf. Schutzfolie fehlt.",
    category: "Oberfläche",
    status: "open",
    priority: "low",
    assignee: null,
    createdAt: daysAgo(6),
    dueAt: inDays(14),
  },
  {
    title: "Maßabweichung bei Spritzgussteil",
    description:
      "Spritzgussgehäuse schrumpft stärker als erwartet. Werkzeugtemperatur dokumentieren.",
    category: "Lieferant",
    status: "open",
    priority: "medium",
    assignee: "Julia Schäfer",
    createdAt: daysAgo(7),
    dueAt: inDays(9),
  },
  {
    title: "Notausschalter ohne Funktion",
    description:
      "Bei Abnahmeprüfung löst der Notausschalter an Station 4 nicht aus. Sicherheitsrelevant.",
    category: "Elektrik",
    status: "done",
    priority: "high",
    assignee: "Markus Wolf",
    createdAt: daysAgo(33),
    dueAt: daysAgo(31),
  },
  {
    title: "Prüfprotokoll unvollständig",
    description:
      "Im Prüfprotokoll fehlen die Messwerte der Endprüfung für mehrere Seriennummern.",
    category: "Qualitätssicherung",
    status: "in_progress",
    priority: "medium",
    assignee: "Daniel Braun",
    createdAt: daysAgo(16),
    dueAt: inDays(1),
  },
  {
    title: "Tür schließt nicht bündig",
    description:
      "Schrankentür schließt oben nicht bündig, Spalt von ca. 2 mm. Scharnier nachstellen.",
    category: "Mechanik",
    status: "open",
    priority: "low",
    assignee: "Anna Becker",
    createdAt: daysAgo(5),
    dueAt: inDays(13),
  },
  {
    title: "Firmware-Update bricht ab",
    description:
      "Das OTA-Firmware-Update bricht bei ca. 80 % ab und setzt das Gerät zurück.",
    category: "Software",
    status: "open",
    priority: "high",
    assignee: "Tobias Mayer",
    createdAt: daysAgo(1),
    dueAt: inDays(2),
  },
  {
    title: "Falsche Drehmomentangabe in Arbeitsanweisung",
    description:
      "Die Arbeitsanweisung nennt 12 Nm, korrekt sind laut Konstruktion 8 Nm.",
    category: "Dokumentation",
    status: "done",
    priority: "medium",
    assignee: "Daniel Braun",
    createdAt: daysAgo(40),
    dueAt: daysAgo(35),
  },
  {
    title: "Kühlmittel tritt an Verschraubung aus",
    description:
      "An der Verschraubung der Kühlleitung bilden sich Tropfen. Dichtring prüfen.",
    category: "Mechanik",
    status: "in_progress",
    priority: "high",
    assignee: "Markus Wolf",
    createdAt: daysAgo(9),
    dueAt: inDays(1),
  },
  {
    title: "Bedienknopf wackelt",
    description:
      "Der Drehknopf am Bedienfeld hat zu viel Spiel und wirkt minderwertig.",
    category: "Montage",
    status: "open",
    priority: "low",
    assignee: null,
    createdAt: daysAgo(4),
    dueAt: inDays(18),
  },
  {
    title: "Lieferung verspätet, Linie steht",
    description:
      "Zukaufteil verspätet sich um 3 Tage, dadurch Stillstand an Linie 2. Zweitlieferant prüfen.",
    category: "Lieferant",
    status: "done",
    priority: "high",
    assignee: "Julia Schäfer",
    createdAt: daysAgo(36),
    dueAt: daysAgo(34),
  },
  {
    title: "Sensorwert driftet über Zeit",
    description:
      "Der Drucksensor zeigt nach mehreren Stunden Betrieb eine Drift von 3 %. Kalibrierung prüfen.",
    category: "Elektrik",
    status: "open",
    priority: "medium",
    assignee: "Peter Hofmann",
    createdAt: daysAgo(11),
    dueAt: inDays(7),
  },
  {
    title: "Etikett löst sich bei Feuchtigkeit",
    description:
      "Produktetiketten lösen sich in feuchter Umgebung. Klebstoff oder Material wechseln.",
    category: "Verpackung",
    status: "open",
    priority: "low",
    assignee: "Lena Vogel",
    createdAt: daysAgo(8),
    dueAt: inDays(16),
  },
  {
    title: "Grat an Stanzteil",
    description:
      "Stanzteile weisen scharfen Grat an der Schnittkante auf. Verletzungsgefahr bei Montage.",
    category: "Mechanik",
    status: "in_progress",
    priority: "medium",
    assignee: "Anna Becker",
    createdAt: daysAgo(13),
    dueAt: inDays(3),
  },
  {
    title: "Dashboard lädt sehr langsam",
    description:
      "Die Auswertungsseite braucht über 10 Sekunden zum Laden. Datenbankabfrage optimieren.",
    category: "Software",
    status: "done",
    priority: "medium",
    assignee: "Tobias Mayer",
    createdAt: daysAgo(27),
    dueAt: daysAgo(21),
  },
];

// Example users. The same demo password is hashed for every account; there is
// no login yet, so this is only so the list looks populated after a seed.
const DEMO_PASSWORD = "passwort123";

const seedUsers: NewUser[] = [
  {
    name: "Anna Becker",
    email: "anna.becker@example.com",
    role: "admin",
    passwordHash: hashPassword(DEMO_PASSWORD),
  },
  {
    name: "Tobias Mayer",
    email: "tobias.mayer@example.com",
    role: "user",
    passwordHash: hashPassword(DEMO_PASSWORD),
  },
  {
    name: "Sandra Klein",
    email: "sandra.klein@example.com",
    role: "viewer",
    passwordHash: hashPassword(DEMO_PASSWORD),
  },
  {
    name: "IPA",
    email: "ipa@pickert.io",
    role: "admin",
    passwordHash: hashPassword("ipapickertio"),
  },
];

async function seed() {
  await db.delete(defects);
  await db.insert(defects).values(seedData);

  await db.delete(users);
  await db.insert(users).values(seedUsers);

  console.log(
    `Seeded ${seedData.length} defects and ${seedUsers.length} users into ${DB_PATH}`,
  );
}

seed();
