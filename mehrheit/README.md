# Mehrheit – Ein Gesetz gegen die Lohnlücke

Lernspiel zum Gender Pay Gap in Europa · Beitrag zum Schülerwettbewerb „Europäischer Wettbewerb“
(Oberstufe, Zielgruppe 16–20 Jahre, Spielzeit 15–25 Minuten, Sprache Deutsch).

Man spielt eine neu gewählte abgeordnete Person im Europäischen Parlament, die zum ersten Mal
Berichterstatter*in ist, und schreibt ein europäisches Gesetz gegen die Lohnlücke – und muss dafür
eine Mehrheit finden. Am Ende steht die eigene Fassung neben der echten Richtlinie (EU) 2023/970.

> **Stand: Phase 1 von 5 – 3D-Stil-Prototyp.** Noch kein vollständiges Spiel. Siehe „Stand“ unten.

## Starten

- **Doppelklick auf `index.html`** (Edge, Chrome, Firefox unter Windows; Safari auf iPad/macOS).
  Es wird nichts aus dem Internet geladen.
- Zum Testen mit einem lokalen Server im Ordner über `mehrheit/`:
  `python3 -m http.server 8765` → `http://localhost:8765/mehrheit/index.html?debug=1`

Adressleisten-Parameter zum Testen:

| Parameter | Wirkung |
|---|---|
| `?debug=1` | Debug-Modus (Feld oben links, Tasten, Prüfungen in der Konsole) |
| `?stufe=ultra` / `hoch` / `mittel` / `niedrig` | Grafikstufe fest einstellen |
| `?szene=buero` | direkt ins Büro (Stil-Prototyp) |
| `?webgl=1` | Rückfall auf WebGL 1 testen |
| `?modus=dokument` | Dokumentmodus ohne 3D testen |

Debug-Tasten: **G** Ansicht wechseln (Bild, nur Licht, Normalen, Tiefe, Verdeckung, Schattenkarte,
Drahtgitter) · **L** Lichtquellen zeigen · **C** freie Kamera (WASD, Q/E, Maus ziehen) · **P** Standbild
als PNG · **K** Titel ↔ Büro · **V** Vertrauen auf 0 · **F** Flags in der Konsole.

## Lernziele (für die Jury)

Nach dem Spiel können die Spielenden …

1. erklären, dass der Gender Pay Gap den Unterschied der **durchschnittlichen Bruttostundenlöhne** von Frauen und Männern misst;
2. den **unbereinigten** und den **bereinigten** Gender Pay Gap unterscheiden und sagen, warum ein „unerklärter Rest“ nicht automatisch Diskriminierung bedeutet, aber auch nicht automatisch keine;
3. mindestens drei Ursachen der Lohnlücke nennen (z. B. Teilzeit, Berufswahl/Branchen, Elternzeit und Karrierebrüche, unterschiedliche Bewertung von Arbeit, fehlende Transparenz bei Gehältern);
4. erklären, welche dieser Ursachen ein **Transparenzgesetz** erreichen kann und welche andere Werkzeuge brauchen (Kitas, Elternzeitregeln, Tarifverträge, nationale Politik);
5. das **ordentliche Gesetzgebungsverfahren** der EU in groben Schritten beschreiben (Vorschlag der Kommission → Parlament und Rat → Trilog → Abstimmung → Umsetzung in nationales Recht);
6. Argumente unterschiedlicher politischer Richtungen fair wiedergeben, ohne sie lächerlich zu machen;
7. eine eigene begründete Meinung formulieren, welche Maßnahmen sie selbst für sinnvoll halten.

## Wo kann ich etwas ändern? (ohne Programmierkenntnisse)

Alle Texte, Zahlen, Farben und Spielwerte liegen in `data/`:

| Datei | Inhalt |
|---|---|
| `data/stil.js` | Materialien (Farbe, Rauheit, Glanz), Lichtstimmungen je Kapitel, Grafikstufen, Oberfläche |
| `data/kameras.js` | Brennweiten, Kamerafahrt im Titel, Kameraeinstellungen im Büro |
| `data/szenen.js` | Aufbau der Räume (Positionen, Größen, Möbel, Zusatzlichter) |
| `data/texte.js` | Menüs, Kapitelkarten, Mail, Zettel von Inès, Kopf des Gesetzentwurfs |
| `data/fakten.js` | **alle echten Zahlen und Fakten** (ungeprüft, `verifiziert: false`) |
| `data/spielwerte.js` | Zahlen der Spielmechanik (Sitze, Termine, Schwellen – keine Fakten) |
| `data/fraktionen.js` | die sechs erfundenen Fraktionen und die Brücke |
| `data/figuren.js` | Figuren-Baukasten (Hauttöne, Körperbau, Kleidung, Haare, Gesten) |
| `data/artikel.js` | Artikel und Optionen des Gesetzentwurfs (Phase 1: nur Artikel 4) |
| `data/gespraeche.js` | Gespräche (Phase 1: Beispiel-Gespräch mit Luca und Mira) |

Texte benutzen Platzhalter statt Zahlen: `{fakt:gpg_eu}`, `{jahr:gpg_eu}`, `{quelle:gpg_eu}`,
`{wert:termine_flure}`, `{name}`. `**fett**` wird fett gedruckt. Der Debug-Modus prüft beim Start,
ob irgendwo eine Ziffer direkt im Text steht.

## Technik

- Vanilla JavaScript ohne Module, feste `<script>`-Reihenfolge, läuft per `file://`.
- Eigene 3D-Maschine (`js/motor/`, Namensraum `MOTOR`) mit WebGL 2:
  HDR-Rendering, physikalisch basiertes Licht (GGX, Fresnel, Klarlack, Durchscheinen, Samtglanz),
  Schattenkarte mit abstandsabhängig weichen Kanten, Umgebungslicht aus einer beim Laden aufgenommenen
  Raum-Würfeltextur (mit zweitem Lichtweg), Spiegel-Ebene für Tischplatten und polierte Böden,
  Glas mit Brechung, vorberechnete Verdeckung in Ecken, Instancing für Sitze und Glaswürfel.
- Nachbearbeitung: Umgebungsverdeckung im Bildraum → Lichtstrahlen im Staub (Strahlenverfolgung mit
  der Schattenkarte) → Tiefenschärfe mit runden Bokeh-Formen → Bloom → filmische Tonwertkurve →
  Farbkorrektur (im Code erzeugte 3D-Farbtabelle) → zeitliche Kantenglättung bzw. FXAA → Korn,
  Vignette, Farbsaum.
- Alle Geometrie, Texturen (Holzmaserung, Gewebe, Papierfaser, Kratzer …) und Töne entstehen im Code.
- Rückfall: WebGL 1 mit Stufe „Niedrig“; ohne WebGL der **Dokumentmodus** (alles als HTML/SVG).
- Namensräume: `DATA` (Daten), `MOTOR` (3D-Maschine), `WELT` (Szenen, Figuren, Bausteine),
  `ANSICHT` (HTML-Oberfläche), `LOGIK` (Spielstand, Berechnungen, Ablauf).

## Stand

**Phase 1 – 3D-Stil-Prototyp (wartet auf Abnahme):**
Titelbildschirm im leeren Plenarsaal (120 Plätze mit Sitzlampen, Glasdach mit Stahlträgern,
Lichtstrahl, Präsidium, Rednerpult) mit Kamerafahrt, Tinte und geprägtem Titel; Büro mit Schreibtisch,
3D-Papierstapel (echte Seite, Umblättern, Füllfeder-Änderung), Glasmodell des Halbrunds mit 60 Sitzen,
Schreibtischlampe, Becher mit Dampf, Fenster mit Stadt; Mira und Luca als Gliederfiguren mit
Kleidung, Haaren, Atmen und vier Gesten; Beispiel-Gespräch mit Schuss/Gegenschuss und Tiefenschärfe;
Stempel mit Abdruck; Grafikstufen mit automatischer Wahl.

Credits: Konzept und Texte: [Dein Name] · Umsetzung mit KI-Unterstützung (siehe `KI-DOKUMENTATION.md`).
