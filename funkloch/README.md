# Funkloch – Stimmen aus Europa

Ein ruhiges Erzähl- und Erkundungsspiel über den Gender Pay Gap in Europa,
im Stil eines Risograph-gedruckten Hefts (Zine). Beitrag zum „Europäischen Wettbewerb“.

> **Stand: Phase 1 von 4 – Stil-Prototyp.** Es gibt eine Testszene (Bahnhof Kiel)
> mit Robin, zwei Figuren und einer kleinen Gesprächs-Stilprobe.
> Das alte Spiel „Die Lücke“ liegt unverändert im Ordner darüber (`../index.html`).

## Starten

- **Doppelklick auf `index.html`** in diesem Ordner. Keine Installation, kein Internet.
- Läuft in Edge, Chrome, Firefox (Windows) und Safari (iPad); auch auf GitHub Pages
  unter `…/funkloch/`.
- Debug-Modus: `index.html?debug=1`
- „Bewegung reduzieren“ zum Testen erzwingen: `index.html?ruhig=1`
  (sonst gilt die Einstellung des Betriebssystems)

## Steuerung

| Eingabe | Funktion |
|---|---|
| A / D oder ← → | laufen |
| E, Leertaste oder Enter | ansprechen, Text sofort fertig, einzelnen Zettel wählen |
| 1 / 2 / 3 | Antwort-Zettel wählen |
| Esc oder ✕ | Gespräch beenden |
| Tippen / Klicken | dorthin laufen; auf eine Figur tippen = hinlaufen und ansprechen |
| Ziehen (Finger/Maus gedrückt halten) | Robin folgt dem Finger |
| R oder Knopf unten rechts | Aufnahmegerät (kommt in Phase 2) |

**Debug (`?debug=1`):** Tasten 1–5 wechseln die Stimmung (Kiel-Abend, Kopenhagen-Vormittag,
Wien-Mittag, Bukarest-Dämmerung, Brüssel-Nacht), P zeigt die Figuren-Parade
(Rollstuhl, Gehstock, Kopftuch, Kind …). Die Konsole listet ungeprüfte Fakten und
prüft Dialoge, Stationen und Texte (keine Zahlen direkt im Text).

## Was du selbst ändern kannst (alles in `data/`)

| Datei | Inhalt |
|---|---|
| `data/stil.js` | Druckfarben, Papier, Rasterpunkte, Fehlpasser, Druckfehler, Figurengröße, **Materialien** (Farbe von Backstein, Wasser, Fenster …) und **Stimmungen** je Station |
| `data/stationen.js` | Aufbau der Straßenszenen: Ebenen, Gebäude, Schilder-Texte, wo Figuren stehen |
| `data/figuren.js` | Aussehen der Figuren (Frisur, Kleidung, Hautton, Rollstuhl, Kinderwagen …) |
| `data/dialoge.js` | Gespräche (Phase 1: nur Stilprobe) |
| `data/fakten.js` | **alle Zahlen** (mit Quelle, `verifiziert: false`) |
| `data/texte.js` | Texte der Oberfläche |

Farben werden immer als **Dichte der vier Druckfarben** angegeben, z. B.
`{ pink: 0.6, gelb: 1 }` = volles Gelb mit 60 % pinken Rasterpunkten.

## Aufbau des Codes

- `js/zeichnen/` (Namensraum `ZINE`) – das eigene Zeichensystem:
  `raster.js` (Rasterpunkte), `druck.js` (Aussparen, Multiplizieren, Fehlpasser, Zittern,
  Druckfehler, Papierkorn), `sammler.js` (Formen), `objekte.js` (Gebäude & Dinge),
  `figur.js` (Figuren-Baukasten), `ebenen.js` (Parallaxe und Kachel-Zwischenspeicher)
- `js/spiel/` (Namensraum `SPIEL`) – Eingabe, Szene (Robin, Figuren, Kamera), Sprechblasen
- `js/debug.js`, `js/start.js`
- Daten im Namensraum `DATA`

Technik: Canvas 2D, Vanilla JavaScript ohne Module, keine Bibliotheken, keine Dateien von außen.
Alles wird im Code gezeichnet. Feste Teile jeder Ebene werden einmal in Kacheln gedruckt
und zwischengespeichert, damit es auch auf Schul-Laptops flüssig läuft.

## Phasen

1. **Stil-Prototyp** ← jetzt
2. Kern: Zug als Hub, Gesprächssystem, Aufnahmegerät, Speichern, Station Kiel komplett mit Minispiel
3. Alle Stationen: Kopenhagen, Wien, Bukarest
4. Finale (Brüssel-Studio), Epilog, Reflexion, Credits, Titel, Einstellungen, Admin-Menü, Touch-Test
