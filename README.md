# Die Lücke – Ein europäischer Fall

Ein kleines, gemütliches 3D-Spiel über den Gender Pay Gap in Europa.
Beitrag zum „Europäischen Wettbewerb“.

## Starten

1. Den ganzen Ordner `Die-Luecke` auf den Rechner kopieren (z. B. vom USB-Stick).
2. **Doppelklick auf `index.html`.** Das Spiel öffnet sich im Standardbrowser.
3. Getestete Browser: aktuelle Versionen von Edge, Chrome und Firefox.

Es gibt keine Installation, kein Internet, keinen Server und keine Cookies.
Nur die Einstellungen (und ab Phase 4 der Spielstand) werden, wenn möglich,
im Browser gespeichert. Das Spiel läuft auch ohne diese Speicherung.

**Falls nur ein Hinweis statt der 3D-Welt erscheint:** Der Browser kann gerade
kein WebGL nutzen. Dann in den Browser-Einstellungen die
„Hardwarebeschleunigung“ einschalten oder einen anderen Browser probieren.

## Steuerung

| Taste | Funktion |
|---|---|
| W A S D oder Pfeiltasten | laufen (8 Richtungen) |
| E oder Leertaste | sprechen, untersuchen, weiter |
| Enter | Auswahl bestätigen |
| Esc | Pause und Einstellungen |
| N | Notizbuch (ab Phase 3) |
| Q | Aufgaben (ab Phase 3) |

Im Pausemenü lassen sich die **Grafik** (Hoch/Niedrig) und die
**gekrümmte Welt** umschalten. „Niedrig“ ist für langsame Schul-Laptops gedacht.

## Debug-Modus (für die Entwicklung)

`index.html?debug=1` in die Adresszeile schreiben (bei `file://` hinten anhängen).
Dann erscheinen unten links FPS, Draw-Calls und Position.
Mit **G** schaltest du das Kachel-Raster und die Kollisionsformen ein und aus.
Die Konsole (F12) listet alle Zahlen auf, die noch nicht geprüft sind.

## Dateistruktur

```
index.html          Startseite, lädt alle Skripte in fester Reihenfolge
css/style.css       Aussehen der Menüs, Blasen und Hinweise
data/               ALLE Inhalte – hier darfst du frei ändern
  palette.js        Farben und Farbstimmungen (Himmel, Licht)
  facts.js          alle Zahlen mit Quelle (+ Notizbuch-Einträge)
  countries.js      Länder, Ursachen, Beweisstücke
  characters.js     Aussehen aller Figuren, Gesichtsausdrücke
  prefabs.js        Bausteine der Welt (Bäume, Bänke, Häuser …)
  maps.js           Karten (Raster) und Bodenarten
  npcs.js           Figuren in der Welt und ihre Tagesabläufe (ab Phase 2)
  dialogues.js      Menütexte und Gespräche
  quests.js         Aufgaben (ab Phase 2)
js/engine/          selbst gebaute WebGL-Engine (Mathe, Shader, Formen …)
js/game/            Spiellogik (Kim, Welt, Oberfläche, Szenen …)
js/debug.js         Debug-Modus
js/main.js          Start
```

## Selbst ändern – so geht's

Du musst dafür nur Dateien im Ordner `data/` mit einem Texteditor öffnen
(z. B. Notepad++, VS Code oder der Windows-Editor). Nach dem Speichern die
Seite im Browser neu laden (F5).

**Wichtig:** Texte stehen in Anführungszeichen `"…"`. Nach jedem Eintrag
steht ein Komma. Wenn nach einer Änderung nichts mehr geht, fehlt meist ein
Komma oder ein Anführungszeichen. Die Konsole (F12) zeigt die Zeile an.

### Texte und Dialoge
- Menü- und Hinweistexte: `data/dialogues.js` → `DATA.texte`
- Gespräche: ebenfalls `data/dialogues.js` → `DATA.dialogues` (ab Phase 2)
- Zahlen **nie** direkt in einen Text schreiben, sondern als Platzhalter:
  `{fakt:gpg_de}`. Der Wert kommt dann aus `data/facts.js`.

### Zahlen und Quellen
- `data/facts.js`: Wert, Jahr und Quelle eintragen, `verifiziert: true` setzen
  und den `// TODO`-Kommentar löschen. Danach auch `QUELLEN.md` anpassen.

### Farben
- `data/palette.js`: Farben als `"#rrggbb"`. Alle anderen Dateien benutzen nur
  die Namen (z. B. `"salbei"`). Eine Farbe hier zu ändern, ändert sie überall.
- Unter `DATA.stimmungen` stehen Himmel, Sonnenlicht, Schattenfarbe und die
  Stärke der gekrümmten Welt pro Ort.

### Aussehen der Figuren
- `data/characters.js`: Jede Figur wird aus Bausteinen zusammengesetzt
  (Haut, Kopfform, Frisur, Oberteil, Unterteil, Schuhe, Extras). Oben in der
  Datei steht die Liste aller möglichen Bausteine.
  Beispiel: `haare: { stil: "locken", farbe: "haar_schwarz" }`

### Karten
- `data/maps.js`: Jede Karte ist ein Raster aus Zeichen. Ein Zeichen = ein
  Feld. Welche Bodenart ein Zeichen bedeutet, steht in `legende`.
- `hoehe`: eine Ziffer pro Feld (0–9). Nebeneinanderliegende Felder sollten
  sich höchstens um 1 unterscheiden, sonst wird der Hang zu steil zum Laufen.
- `objekte`: `{ p: "baum_rund", x: 5, y: 13, rot: 90 }` stellt einen Baum auf
  Spalte 5, Zeile 13, um 90° gedreht. Die Namen stehen in `data/prefabs.js`.
- Alle Zeilen einer Karte müssen gleich lang sein. Im Debug-Modus meldet die
  Konsole Fehler wie falsche Zeilenlängen oder unbekannte Zeichen.

### Neue Bausteine (Prefabs)
- `data/prefabs.js`: Ein Prefab besteht aus Grundformen (Kugel, Box,
  Zylinder, Kegel, Kapsel, Torus) mit Position, Größe, Farbe und optional
  Muster (Holz, Pflaster …) oder Wind (für Blätter).

## Technik in Kürze

- Reines WebGL 1 mit einer selbst geschriebenen Mini-Engine, ohne Bibliotheken
- Alle Modelle werden im Code aus Grundformen gebaut und pro Bereich zu einem
  Mesh zusammengefasst (wenige Draw-Calls). Jede Figur ist ein einziger Draw-Call.
- Alle Texturen (Gras, Pflaster, Holz, Kopfstein, Gesichter) werden beim Start
  im Code gezeichnet. Es gibt keine Bilddateien.
- Toon-Shading mit drei weichen Lichtstufen, runde Blob-Schatten, Dunst und
  eine optionale gekrümmte Welt
