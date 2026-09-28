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
- Schlagschatten (Schattenkarte) schraffiert statt dunkel; Nachbearbeitung: wackelnde Linien,
  Pigmentränder, Papierfaser, ausfransender Papierrand (nur Grafik „Hoch“)
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
- **Phase 1 fertig:** Engine, Test-Insel (`?debug=1&karte=testinsel`), Figuren-Baukasten, Umbau auf „Tusche & Aquarell“.
- **Phase 2 fertig (wartet auf OK des Users):**
  - NPCs mit Tagesabläufen (`js/game/npc.js`: gehen, warten, sitzen, giessen, schauen; `routineWenn`, `hinweis` = „!“)
  - Dialogsystem (`js/game/dialogue.js`): Schreibmaschine, Optionen, Flags, Notizen, Aktionen, Platzhalter
    `{fakt:id}`/`{wert:id}`/`{jahr:id}`, `**fett**`, 3D-Portrait (Framebuffer + readPixels), Emote-Blasen
  - Spielstand/Flags/Quests (`js/game/quests.js`), HUD-Aufgabenhinweis
  - Kartenwechsel mit Abblende, Türen (E oder hineinlaufen), Ausgänge am Kartenrand, Innenräume (Wände, feste Kamera)
  - Karten: `europaplatz` (Intro startet automatisch), `de`, `de_kita_innen`, `de_buero_innen`
  - Debug: T = Teleport, F = Flags, automatische Prüfung aller Dialoge und Karten (Erreichbarkeit) in der Konsole
- **Phase 3 fertig (wartet auf OK des Users):**
  - Viertel `se` (+ `se_amt_innen`), `ee` (Berufsmesse), `lu` (+ Hochhaus `lu_etage_1..3` mit Aufzug)
  - Notizbuch (N) und Aufgabenliste (Q) in `js/game/notebook.js`, Beweisstück-Leiste im HUD
  - Minispiele in `js/game/minigames.js` (Zuordnen, Verhandlung), Daten in `DATA.minispiele` (dialogues.js),
    Start per Dialog-Aktion `minispiel:id`, danach Folgedialog `danach`
  - Kim hält gefundene Beweisstücke beim Jubeln hoch; Kinderwagen als Figuren-Extra
- **Phase 4 fertig (wartet auf OK des Users):**
  - Tor am Europaplatz: Objekte mit `wenn` (geschlossen/`tor_offen`), Ausgang nach Norden bei `alle_beweise`
  - Karten `bxl` (Jugendstil, Archiv, Parlament, Comicwand), `bxl_archiv` (Fächer A/B/C, Frau Peeters,
    Quiz → Beweis `bxl`), `bxl_saal` (3 Abgeordnete, Rednerpult, Anna/Jonas/Laurent)
  - Finale als Minispiele in `minigames.js`: `praesentation`, `duell` (Notizen als Antworten, Live-Portrait,
    2/1/0 Punkte, kein Game Over), `massnahmen` (3 aus 6); danach Dialog → Aktion `epilog`
  - `GAME.Titelszene` (drehendes Diorama, Logo im Canvas gezeichnet), `GAME.Epilogszene` (Bausteine aus `DATA.epilog`),
    Reflexion (`GAME.ui.reflexionZeigen`), Credits (Platzhalter `[Dein Name]` in `DATA.texte.credits`)
  - `GAME.speicher` (quests.js): Autosave in einem Slot, Weiterspielen, Neues Spiel mit Rückfrage
  - Dialog-Aktionen `reise:karte,spawn`, `epilog`, `reflexion`; Platzhalter auch in Antwortoptionen
  - Innenraum-Kamera pro Karte: `kamera: { x, z, abstand }`; Türen mit `wenn`/`gesperrt`
- **Feedback-Runde + Phase 5 (2026-09-28):**
  - Klick/Tippen: `ENG.input.zeigerInit` (Tippen → `I.klick`, Ziehen → Joystick), `Spieler.laufZiel` mit
    A*-Wegsuche `Welt.weg()`; Klick auf NPC/Objekt → hinlaufen + ansprechen; Klick im Dialog = weiter,
    Antworten nur per direktem Klick; ✕/Esc beendet Gespräch (`abbrechbar: false` beim Intro)
  - Runde HUD-Knöpfe (Notizbuch/Aufgaben/Pause), Joystick-Anzeige, Fokus-Schutz für Buttons
  - Zuordnen-Spiel mit Ziehen & Ablegen (auch antippen → Stand antippen), Fahrstuhl listet nur andere Etagen
  - Lohnbezug gestärkt (Notizen `teilzeit_lohn`, `elternzeit_lohn`), HUD zeigt GPG des Landes (`map.fakt`/`countries.fakt`)
  - Flaggen, Wimpel, Wahrzeichen (siehe README), neues Familienamt + `amtsschild`, Wege dunkler + Kiesel,
    schwebende Ausgangsschilder, Türblasen mit Gebäudenamen
  - Verstecktes Admin-Menü `GAME.admin` (debug.js): „admin“ tippen oder 5× aufs Titel-Logo
  - Audio (`js/engine/audio.js`): Sprechlaute je Figur (`stimme.tonhoehe`), Klick, Notiz, Fanfare, Tür, richtig/falsch
  - Einstellungen: Grafik, Ton, Sprechlaute, Schriftgröße, hoher Kontrast, Bewegung reduzieren (auch im Titel);
    automatische Absenkung auf „Niedrig“ bei < 28 FPS; Deko nur bei „Hoch“; Sichtfeld im Hochformat breiter
  - Speichern zusätzlich bei pagehide/visibilitychange und alle 15 s
  - Debug-Kartenprüfung testet jetzt auch, ob alle NPCs/Objekte ansprechbar sind
- **Licht (2026-09-28, wartet auf OK des Users):** Punktlichter (max. 8, `R.lichter`, Auswahl in
  `Welt.lichterSetzen`), Prefab-`licht` / Karten-`lichter`, Teil-`leuchten` (Muster 6), Fenster (Muster 7,
  automatisch bei farbe "fenster"), Lichthöfe (`R.lichthof`), Wolkenschatten (Papier-Textur Kanal B),
  Rücklicht; Werte je Stimmung + `DATA.lichtStandard` (palette.js). Neue Prefab `stehlampe`,
  Schreibtischlampe. Bei „Niedrig“ keine Punktlichter/Wolken (`ENG.renderer.licht`).
- **Grafik-Ausbau (2026-09-28, wartet auf OK des Users):** Schlagschatten per Schattenkarte
  (`R.mesh` sammelt bei aktiven Schatten, `R.ende` zeichnet Schattenkarte + Bild; runde Schatten dann nur
  als Kontaktschatten), Nachbearbeitung (`nachbearbeiten`, Bild per copyTexSubImage2D, `DATA.bildStil`),
  Sonne kommt von links vorn (`sonnen_richtung`), Pollen/Staub (`dioramaHilfen.schweben`).
  Grafikstufen Hoch/Mittel/Niedrig, Auto-Absenkung stufenweise.
- **Grafik-Ausbau 2 (2026-09-28, wartet auf OK des Users):** Kontaktschatten (`Welt.verdeckung`,
  Builder-Option `bodenY`/`bodenAO`), Lichtkante (`uLichtkante`), Wasser mit Uferschaum (UV.x = Ufernähe),
  Spiegelung, nasser Sand (`sand_nass`), Lichtschleier in der Nachbearbeitung, fallende Blätter
  (Prefab `blaetter`), weichere Schattenkanten, Innenräume `schlagschatten: 0.6`.
- **iPad-Fix:** Hover-Markierung von Dialog-Antworten, Menüs und Verhandlung nur bei `pointerType === "mouse"`
  (sonst verschluckt Safari den ersten Tipp, weil sich beim emulierten mouseenter die Knöpfe ändern);
  Knöpfe mit `touch-action: manipulation`. **Nie** auf Hover Knöpfe neu bauen.
- **Offen:** Test auf echtem iPad/Windows-Schul-Laptop, Zahlen verifizieren, Credits-Namen eintragen.

## Gestaltungsregeln für Karten (aus Erfahrung)
- **Türen müssen nach Süden (zur Kamera) zeigen**, sonst sieht man sie nicht. Gebäude deshalb nördlich von Wegen platzieren.
- Karten werden mit einem Python-Skript erzeugt, dürfen aber von Hand bearbeitet werden (`data/maps.js`).
- Nach Änderungen im Debug-Modus die Konsole prüfen (Karten- und Dialog-Prüfung).

## Testen
Mit einem einfachen lokalen Server im Projektordner, z. B. `python3 -m http.server 8765`,
dann `http://localhost:8765/index.html?debug=1` (Titelbildschirm) oder `…&karte=bxl_saal` (direkt).
Der eigentliche Zielweg bleibt der Doppelklick (file://).
