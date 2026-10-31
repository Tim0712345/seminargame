# Projekt-Notiz für Claude Code – „Funkloch – Stimmen aus Europa“

Neues Spiel (ersetzt inhaltlich „Die Lücke“, das alte Spiel bleibt unverändert im Ordner darüber).
Lernspiel über den Gender Pay Gap in Europa, Beitrag zum „Europäischen Wettbewerb“ (Jury).
Zielgruppe 16–20, Spielzeit 15–25 Minuten, kein Game Over. **Spiel, Antworten, Code-Bezeichner
und Kommentare auf Deutsch.** Nichts aus dem alten Code/den alten Daten übernehmen.

## Arbeitsweise (zwingend)
- 4 Phasen. Nach jeder Phase: lauffähig, keine Konsolenfehler, grüne Dialogprüfung, kurze
  Zusammenfassung (neu / wo in data/ änderbar / getestet / nicht getestet), README, QUELLEN,
  CLAUDE.md aktualisieren – dann **auf OK warten**.
- Nichts außerhalb des Konzepts ohne Rückfrage. Nach jeder Änderung im Browser testen
  (Playwright/Chromium, file://). Ehrlich sagen, was nicht testbar war (echtes iPad, Windows).
- **Keine erfundenen Statistiken:** Zahlen nur in `data/fakten.js` (wert, einheit, jahr, quelle,
  `verifiziert: false`, Kommentar `// TODO: verifizieren – Quelle: …`), zusätzlich in `QUELLEN.md`.
  Texte nur mit Platzhaltern `{fakt:id}` – die Debug-Prüfung meldet Ziffern in Texten.
- Alle Texte und Gestaltungswerte in `data/`, kommentiert für Laien.

## Konzept (Kurzfassung)
- Robin (keine Pronomen!), neu im Jugend-Podcast „Funkloch“. Hörernachricht von Defne und Malte
  (gleiche Ausbildung, gleicher Arbeitgeber, Defne verdient weniger): „Liegt das an uns – oder am System?“
- Nachtzug durch Europa, Aufnahmegerät: Tonschnipsel (Erfahrung/Meinung) + Faktenkarten.
  Zug = Hub, Menü, Karte, Speicherpunkt; Zugbegleiterin Ilka (trocken, fragt nach).
- Stationen frei wählbar: Kiel (Teilzeit/Minijob/Kita, Abend), Kopenhagen (Elternzeit, Vormittag),
  Wien (Branchen, Markthalle, Mittag), Bukarest („Kleiner Durchschnitt, große Fragen“, Dämmerung),
  Brüssel (Lohntransparenz, Radiostudio, Nacht; erst ab 3 Stationen). **Vor Phase 2 die
  endgültige Länderwahl beim User erfragen.**
- Je Station 4–6 Figuren inkl. respektvoller Gegenstimme, genau ein Minispiel
  (Lohnzettel lesen / Lebenslinie (Modell!) / Messestände sortieren / Durchschnitt-Waage).
- Finale „Die Folge schneiden“: Zeitleiste 5 Plätze, 3 Live-Anrufe, 2 von 6 Forderungen,
  Epilog „Ein Jahr später“ aus Bausteinen, Reflexion mit Quellen, Credits.
- Inhalt: Genderstern, keine Stereotype/Schuldzuweisungen, ein trockener Humor-Satz pro Figur,
  GPG = Bruttostundenlöhne; unbereinigt vs. bereinigt sauber; „unerklärt“ ≠ automatisch Diskriminierung.

## Grafikstil „Risograph-Zine in 2D“ (vom User vorgegeben)
- Nur 4 Druckfarben (blau, pink, gelb, gruen) + Papier; Mischtöne nur durch Multiplizieren.
- Rasterpunkte statt Verläufe, feste Bildschirmgröße; Fehlpasser (Versatz je Farbe, Zittern);
  Papierkorn, Druckfehler. Seitenansicht mit 4–6 Parallaxe-Ebenen, keine Draufsicht.
- Figuren: flache Formen (Kopf Kreis, Körper Trapez), Gesicht = zwei Punkte + ein Strich,
  Bewegung durch Wackeln/Stauchen. Papierrand um Figuren (wie ausgeschnitten).
  **Keine rosa Wangen, nichts, das nach einem bekannten Spiel aussieht.**
- Oberfläche wie Heftseiten: Sprechblasen über den Figuren, Antworten als Zettel,
  Arial Black/Impact für Überschriften, Klebeband, Stempel.

## Technik
- Canvas 2D, Vanilla JS ohne Module, `<script>`-Reihenfolge in `index.html`. Namensräume
  `DATA`, `ZINE` (Zeichnen, `js/zeichnen/`), `SPIEL` (Logik, `js/spiel/`).
- Keine Bibliotheken/CDNs/Bilder/Schriften/Sounds von außen. Töne später per Web Audio.
- Offline per Doppelklick (file://), Edge/Chrome/Firefox Windows, iPad Safari, GitHub Pages.
  < 3 MB, ≥ 30 FPS Schul-Laptop.
- **Touch-Regel:** Knöpfe nie bei Hover neu bauen; Hover nur bei `pointerType === "mouse"`
  (Klasse `maus-hover`); alle Knöpfe `touch-action: manipulation`.
- Druckverfahren (`js/zeichnen/druck.js`): aussparende Fläche = Papier einsetzen, dann jede
  Druckfarbe per `multiply` mit Rastermuster (gedrehte `CanvasPattern`, `setTransform`) und
  Versatz. Feste Ebenen-Teile werden in 512-px-Kacheln vorgedruckt (`ZINE.ebenen.kachelBauen`,
  Werkbank-Canvas), bewegte Bausteine (`.animiert = true`) und Figuren werden live gedruckt –
  NACH den festen Teilen ihrer Ebene. Lichtkegel u. Ä. über `S.nachFiguren()`.
  Gemessen (Chromium ohne GPU): ~12 ms/Bild bei 1280×720, ~20 ms bei 1,8 Mio. Pixeln.
- Debug `?debug=1`: FPS, Flächen/Bild, Tasten 1–5 Stimmung, P Figuren-Parade, Konsole:
  ungeprüfte Fakten + Prüfung (Dialoge, Stationen, Ziffern in Texten). `?ruhig=1` erzwingt
  „Bewegung reduzieren“, `?station=id` startet eine Station.

## Stand
- **Phase 1 fertig (wartet auf Stil-Abnahme durch den User):** Zeichensystem, Testszene
  Bahnhof Kiel (5 Ebenen: Himmel, Förde/Kräne/Fähre/Windräder, Innenstadt, Straße mit Bahnhof,
  Kita, Markt, Vordergrund), Robin + Birte (Minijob) + Jannik (Teilzeit, Kinderwagen),
  Stilprobe Sprechblase/Zettel/Schnipsel-Flug, 5 Stimmungen in `data/stil.js`, Figuren-Parade.
- Offen: Länderwahl (vor Phase 2 fragen), Test auf echtem iPad / Windows-Schul-Laptop / Firefox,
  Zahlen verifizieren.

## Testen
`python3 -m http.server 8765` im Repo, dann `http://localhost:8765/funkloch/index.html?debug=1`,
oder direkt per file://. Playwright: `require('playwright')`, `chromium.launch()`.
