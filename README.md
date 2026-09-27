# Die Lücke – Ein europäischer Fall

Ein kleines, gemütliches 3D-Spiel über den Gender Pay Gap in Europa.
Beitrag zum „Europäischen Wettbewerb“.

## Starten

1. Den ganzen Ordner `Die-Luecke` auf den Rechner kopieren (z. B. vom USB-Stick).
2. **Doppelklick auf `index.html`.** Das Spiel öffnet sich im Standardbrowser.
3. Getestete Browser: aktuelle Versionen von Edge, Chrome und Firefox.

Es gibt keine Installation, kein Internet, keinen Server und keine Cookies.
Nur die Einstellungen und der Spielstand werden, wenn möglich, im Browser
gespeichert (localStorage). Das Spiel läuft auch ohne diese Speicherung.

## Ablauf

1. **Titelbildschirm** – der Europaplatz dreht sich als kleines Diorama.
   „Neues Spiel“, „Weiterspielen“ (nur wenn es einen Spielstand gibt), „Steuerung“, „Credits“.
2. **Intro** auf dem Europaplatz, dann die vier Viertel (Deutschland, Schweden, Estland, Luxemburg).
3. Mit allen vier Beweisstücken öffnet sich das **Tor im Norden** nach **Brüssel**:
   Archiv (5. Beweisstück „Unerklärter Rest“), dann der **Sitzungssaal**.
4. **Finale** am Rednerpult: Beweisstücke präsentieren → drei Fragen der Abgeordneten
   (mit Notizen aus dem Notizbuch antworten) → drei von sechs Maßnahmen wählen.
5. **Epilog** „Zehn Jahre später …“ und **Reflexion** (Fragen, Quellen, Credits).
   Danach kann man weiter herumlaufen oder zum Titel zurück.

**Speichern:** automatisch in einem Spielstand – bei jedem Kartenwechsel und nach jeder
Änderung im Fortschritt. „Zum Titelbildschirm“ im Pausemenü speichert ebenfalls.

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
| N | Notizbuch (Reiter mit ← →) |
| Q | Aufgaben |

Im Pausemenü lässt sich die **Grafik** (Hoch/Niedrig) umschalten.
„Niedrig“ ist für langsame Schul-Laptops gedacht.

## Debug-Modus (für die Entwicklung)

`index.html?debug=1` in die Adresszeile schreiben (bei `file://` hinten anhängen).
Dann erscheinen unten links FPS, Draw-Calls und Position.
- **G**: Kachel-Raster und Kollisionsformen ein/aus
- **T**: Teleport zu jeder Karte
- **F**: Flags setzen (Intro überspringen, Viertel erledigen, Brüssel-Archiv erledigen,
  Epilog ansehen, Spielstand löschen, alles zurücksetzen)
- `&karte=de` in der Adresse startet direkt auf einer Karte (ohne Titelbildschirm),
  z. B. `index.html?debug=1&karte=bxl_saal`

Die Konsole (F12) prüft beim Start automatisch alle Dialoge (fehlende Knoten, nicht
erreichbare Knoten, fehlende Fakten) und alle Karten (erreichbare Ausgänge, NPCs,
Objekte) und listet alle Zahlen auf, die noch nicht geprüft sind (im Dialog rot).

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

### Dialoge schreiben (Kurzfassung – Details oben in `data/dialogues.js`)
```js
DATA.dialogues.de_lea = {
  einstieg: [ { wenn: "de_lea_fertig", knoten: "danach" }, { knoten: "start" } ],
  knoten: {
    start: { speaker: "Lea", emotion: "froehlich", text: "Hallo!",
             options: [ { label: "Warum?", next: "warum", addNote: "teilzeit_quote" } ] },
    warum: { speaker: "Lea", emotion: "nachdenklich", text: "…", setFlag: "de_lea_fertig", next: "ende" }
  }
};
```
- Emotionen: froehlich, nachdenklich, ueberrascht, skeptisch, neutral
- `aktion: "beweis:de"` gibt ein Beweisstück, `emote: "gluehbirne"` zeigt ein Symbol
- Wer spricht, wird über `speaker` angezeigt; `"Kim"` ist die Spielfigur

### Minispiele und Finale
- `data/dialogues.js` → `DATA.minispiele`: Texte, Antworten und Punkte der Minispiele.
  Gestartet werden sie aus einem Dialog mit `aktion: "minispiel:branchen"`.
- Finale im Sitzungssaal, ebenfalls in `DATA.minispiele`:
  - `praesentation`: Text zu jedem der fünf Beweisstücke
  - `duell`: die drei Fragen der Abgeordneten. `passend` = Liste der Notizen
    (aus `DATA.notes` in `facts.js`), die als gute Antwort zählen
  - `massnahmen`: die sechs Maßnahmen mit Kurztext, „Dafür“ und „Dagegen“
- `DATA.epilog` (am Ende von `dialogues.js`): Texte und Figuren des Epilogs –
  eine Grundstimmung, ein Baustein je gewählter Maßnahme, ein Satz je nach Punkten
- Credits und Reflexionsfragen: `DATA.texte.credits` und `DATA.texte.reflexion`
  (**Hier bitte deinen Namen eintragen** – dort steht noch `[Dein Name]`.)

### NPCs
- `data/npcs.js`: Karte, Startplatz, Dialog und Tagesablauf (gehen, warten, sitzen, gießen, schauen)

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
- Unter `DATA.stimmungen` stehen Himmel, Sonnenlicht, Schattenfarbe und
  Tuschefarbe pro Ort.

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
  Mit `wenn: "alle_beweise"` gibt es ein Objekt nur unter dieser Bedingung
  (so wird das Tor am Europaplatz geöffnet).
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
- Eigener Zeichenstil „Tusche & Aquarell“: Tusche-Konturen um alle Formen
  (Inverted Hull), zwei Lichtstufen mit Schraffur im Schatten, schraffierte
  Bodenschatten, Aquarell-Flecken, Papierkorn und gezeichnete Wasserwellen
- Farbe der Tusche und des Papiers: `tusche` und `papier` in `data/palette.js`
