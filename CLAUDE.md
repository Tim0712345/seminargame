# Projekt-Notiz für Claude Code – „Die Lücke – Ein europäischer Fall“

3D-Lernspiel über den Gender Pay Gap in Europa, Beitrag zum „Europäischen Wettbewerb“
(Oberstufe, Jury). Spielsprache: **nur Deutsch**. Zielgruppe 16–20 Jahre, Spielzeit 15–25 Minuten.
Alle Antworten an den User auf Deutsch.

## Arbeitsweise (zwingend)
- Entwicklung in 5 Phasen. Nach jeder Phase: lauffähiger Stand + kurze Zusammenfassung, dann **auf OK warten**.
- Keine Features außerhalb des Konzepts ohne Rückfrage.
- **Keine erfundenen Zahlen:** Alle Zahlen stehen nur in `data/facts.js`, markiert mit
  `// TODO: verifizieren – Quelle: …` und `verifiziert: false`. Texte nutzen Platzhalter `{fakt:id}`.
  `QUELLEN.md` bei jeder neuen Zahl ergänzen.
- Alle Texte und Aussehens-Daten liegen ausschließlich in `data/` (der User bearbeitet sie selbst).

## Technische Vorgaben
- Vanilla JavaScript **ohne ES6-Module** (file:// blockiert sie), normale `<script>`-Tags in fester Reihenfolge (siehe `index.html`).
- Reines **WebGL 1**, eigene Engine in `js/engine/`. Keine Bibliotheken, CDNs, Webfonts, Bilder, Sounds oder Modelle von außen.
- Kein `fetch`/XHR, keine Cookies. localStorage nur optional mit try/catch.
- Muss offline per Doppelklick auf `index.html` in Edge, Chrome, Firefox (Windows) laufen. Gesamtgröße < 5 MB.
- Ziel: 60 FPS normaler Laptop, ≥ 30 FPS Schul-Laptop. Qualitätsstufe „Niedrig“ = Renderskala 0,75, ohne Zusatzeffekte.
- Namensräume: `DATA` (Daten), `ENG` (Engine), `GAME` (Spiel). Code-Bezeichner und Kommentare auf Deutsch.
- Debug: `index.html?debug=1` (FPS, Draw-Calls, Taste G = Raster/Kollision, Konsole listet ungeprüfte Fakten).

## Grafikstil (vom User festgelegt – wichtig!)
Phase 1 sah „extrem wie Animal Crossing“ aus. Deshalb eigener Stil **„Tusche & Aquarell“**
(wie ein illustriertes Bilderbuch). Der User hat ausdrücklich erlaubt, dafür vom ursprünglichen
Prompt abzuweichen. **Nichts darf nach Animal Crossing oder einem anderen bestehenden Spiel aussehen.**
- Tusche-Konturen um Welt und Figuren (Inverted Hull, `opt.kontur` in `ENG.renderer.mesh`)
- Zwei Lichtstufen, Schraffur im Schatten, Kreuzschraffur im Kernschatten, schraffierte Bodenschatten
- Aquarell-Flecken und Papierkorn (Textur `ENG.textures.papier`), gezeichnete Wasserwellen
- Figuren: ca. 3 Kopflängen, Strichaugen mit Brauen und kleiner Nase, **keine** Glanzpunkt-Augen, **keine** rosa Wangen
- **Keine** gekrümmte Welt
- Kamera: frontal von Süden, 46° Neigung (der User wollte ausdrücklich diesen Winkel, nicht diagonal)
- Oberfläche im Skizzenbuch-Stil (Papierkarten, krakelige Tusche-Ränder, Handschrift-Überschriften)

## Inhaltliche Entscheidungen (bestätigt)
- Kim = Praktikant*in, geschlechtsneutral, **keine Pronomen** für Kim. Alle duzen Kim, Abgeordnete siezen. Genderstern.
- Vier Viertel: DE (Teilzeit & Kinderbetreuung), SE (Elternzeit), EE (Branchen & Berufswahl),
  LU (Verhandlung & Beförderung – der niedrige/negative unbereinigte GPG wird selbst Thema:
  „Ein Durchschnitt zeigt nicht alles“), dazu Brüssel (Archiv „Unerklärter Rest“ + Sitzungssaal).
- Intro auf dem Europaplatz: Dr. Marie Laurent übergibt den Auftrag, Anna & Jonas kurz dabei.
- Archiv: kleine Aufgabe mit Archivarin (Aktenfächer, bereinigt vs. unbereinigt), kein Extra-Minispiel.
- Argumentationsduell: Pflichtfakten kommen über die Hauptquests, kein Game Over; Punkte ändern nur einen Epilog-Satz.
- Epilog modular: ein Baustein je gewählter Maßnahme + 3 Grundstimmungen.
- Sprechlaute (abschaltbar), Touch-Joystick (Phase 5), Autosave in einem Slot.
- Dateien zusätzlich zum Konzept: `js/main.js`, `js/debug.js` (genehmigt). Menütexte in `DATA.texte` (`data/dialogues.js`).

## Stand
- **Phase 1 fertig:** Engine, Test-Insel (`DATA.maps.testinsel`), Kim mit Animationen, Probefiguren,
  Pausemenü, Steuerungshinweis, Debug-Modus, danach Umbau auf „Tusche & Aquarell“.
- **Als Nächstes – Phase 2 (wartet auf OK des Users):** NPCs mit Tagesroutinen, Dialogsystem mit
  Optionen/Flags und 3D-Portrait (Framebuffer + readPixels im selben Kontext), Emote-Blasen,
  Kartenwechsel mit Abblende und Innenräumen, Intro, Europaplatz und Deutschland-Viertel komplett,
  automatischer Check aller Dialog-`next`-Referenzen im Debug-Modus.
- Danach Phase 3 (restliche Viertel, Notizbuch, Questlog, Beweisstücke, Minispiele),
  Phase 4 (Brüssel-Finale, Enden, Reflexion, Titelbildschirm, Speichern),
  Phase 5 (Sound, Partikel, Touch, Barrierefreiheit, Performance, Bugfixes).

## Testen
Mit einem einfachen lokalen Server im Projektordner, z. B. `python3 -m http.server 8765`,
dann `http://localhost:8765/index.html?debug=1`. Der eigentliche Zielweg bleibt der Doppelklick (file://).
