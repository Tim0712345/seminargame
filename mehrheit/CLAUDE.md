# Projekt-Notiz für Claude Code – „Mehrheit – Ein Gesetz gegen die Lohnlücke“

Komplett neues Spiel im Ordner `mehrheit/`. Es übernimmt **nichts** aus „Die Lücke“ (Hauptordner) oder
„Funkloch“ – kein Code, keine Daten, kein Stil. Gemeinsam ist nur das Thema.
Grundlage ist das Konzept „Mehrheit – Prompt“ (PDF des Users, Stand 31. Oktober 2026).
Spielsprache und alle Antworten an den User: **Deutsch**. Code-Bezeichner und Kommentare auf Deutsch.

## Arbeitsweise (zwingend)
- Fünf Phasen. Nach jeder Phase: lauffähiger Stand ohne Konsolenfehler, kurze Zusammenfassung,
  Standbilder, **auf OK warten**. Ohne OK keine nächste Phase.
  (Am 1. November 2026 hat der User ausdrücklich gesagt: „Mache weiter und gehe alle Phasen direkt durch“ –
  deshalb wurden die Phasen 2 bis 5 ohne Zwischenabnahme gebaut. Für neue Änderungen gilt wieder: fragen.)
- Nichts bauen, was nicht im Konzept steht; Ideen unter „Vorschläge“ nennen.
- **Nie** echte Statistiken, Paragrafen oder Zitate erfinden. Alle echten Zahlen nur in `data/fakten.js`
  (`// TODO: verifizieren – Quelle: …`, `verifiziert: false`), Texte nutzen `{fakt:id}`, `{jahr:id}`,
  `{quelle:id}`. Spielwerte nur in `data/spielwerte.js` (`{wert:id}`). `QUELLEN.md` bei jeder neuen Zahl ergänzen.
  Neuer Fakt für eine Szene → vorher den User fragen.
- Alle Texte, Zahlen, Farben, Spielwerte in `data/`, kommentiert, ohne Programmierkenntnisse änderbar.
- Nach Änderungen im Browser testen (Playwright/Chromium, `file://` und lokaler Server) und ehrlich sagen,
  was nicht getestet werden konnte (echtes iPad, Safari, Firefox, Windows-Schul-Laptop, echte GPU).
- Vor Phase 2 die Fragen aus Abschnitt 12.6 des Konzepts stellen.
- Für die Spielfigur **nie Pronomen** (auch nicht in Kommentaren). Alle siezen sie, nur Mira duzt.
  Genderstern. Keine Stereotype. Jede Fraktion respektvoll mit stärkstem Argument.

## Technik
- Vanilla JS ohne Module, feste Script-Reihenfolge in `index.html`, kein fetch/XHR, keine Cookies,
  localStorage nur mit try/catch. Keine Bibliotheken, CDNs, Bilder, Schriften, Töne von außen. < 3 MB.
- Namensräume: `DATA`, `MOTOR` (js/motor/), `WELT` (js/welt/), `ANSICHT` (js/ansicht/), `LOGIK` (js/logik/).
- 3D: WebGL 2, HDR (RGBA16F), PBR. Rückfall WebGL 1 (Stufe Niedrig, Tonwertkurve im Hauptshader,
  keine Bildraum-Effekte, Define `DIREKT`), ohne WebGL Dokumentmodus (`js/ansicht/dokumentmodus.js`).
- Shader in `js/motor/shader.js` als Zeichenketten, Makros `TEX`, `TEXCUBE`, `TEXCUBELOD`, `ATTR`, `VAR`
  (gl.js setzt sie je nach WebGL-Version). PBR- und Tiefen-Shader müssen GLSL ES 1.0-tauglich bleiben.
- Hauptdurchgang mit MRT: Ziel 0 = HDR-Farbe (Alpha = Anteil Umgebungslicht für die Verdeckung),
  Ziel 1 = Sicht-Normale + Rauheit. Glas danach mit `drawBuffers([C0, NONE])`.
- Umgebungslicht: Raum wird beim Laden in eine Würfeltextur aufgenommen (2 Durchgänge = zweiter Lichtweg),
  zuerst mit einem Himmel-Würfel aus der Stimmung. Spiegel-Ebene (`sz.spiegelEbene`) für Material `spiegelt`.
- Statische Teile über `WELT.Bauer` pro Material zusammengefasst; Verdeckung pro Eckpunkt aus Abstandsfeld
  der Verdecker (`B.box`, `B.ringVerdecker`). Figuren: starre Teile, ein Knochen pro Eckpunkt (`uKnochen`).
- Grafikstufen in `data/stil.js` (`grafikstufen`), automatische Wahl in `js/motor/qualitaet.js`.
- Touch-Regeln: Hover nur über `ANSICHT.hover` (pointerType "mouse"), **nie** Knöpfe beim Überfahren neu
  bauen, `touch-action: manipulation`, ≥ 44 px, Ziehen muss auch per Antippen gehen.

## Testen
- Server im Repo-Hauptordner: `python3 -m http.server 8765` → `http://localhost:8765/mehrheit/index.html?debug=1`.
- Parameter: `?stufe=…`, `?debug=1&kapitel=1..9`, `?webgl=1`, `?modus=dokument`.
- Automatischer Durchlauf: die Testskripte (Playwright) klicken sich vom Titel bis zum Vergleich durch
  (Varianten: normal, Ausschuss scheitert, Plenum scheitert), außerdem Dokumentmodus und Tastatur.
  `MEHRHEIT.test.festesDt`, `rendern(n, dt)`, `oberflaeche(false)`, `LOGIK.ablauf.START[n].laden()` für Standbilder.
- Headless-Chromium nutzt SwiftShader (Software): Hoch braucht dort mehrere Sekunden pro Bild.
  Für Standbilder `MEHRHEIT.test.anhalten()`, `MEHRHEIT.test.rendern(n)`, dann Screenshot;
  `MEHRHEIT.test.oberflaeche(false)` blendet die Oberfläche aus. Bildzeiten aus SwiftShader sind
  **nicht** aussagekräftig – echte Messung auf echter Hardware (Debug-Feld zeigt FPS/GPU-Zeit).
- Debug-Konsole: Prüfungen (Gespräche, Daten, Ziffern, Textlänge) und Tabelle der ungeprüften Fakten.

## Aufbau des Spiels (Phase 2 bis 5)
- `js/logik/ablauf.js`: Titel, Kapitel 1–7 (`START[n].laden/los`), Epilog (8), Vergleich (9). Abendnotizen,
  Presse, Flure (Termine, Verhandeln: Karte/Zugeständnis/Versprechen), Ausschuss (Zusatztermine, Kompromiss),
  Trilog (Spielraum des Rates, Mittelweg, Brücke, Dolmetscher, Versprechen gehalten/gebrochen), Plenum (Rede-Bonus,
  neuer Anlauf). `A.ohne3D` = Dokumentmodus (gleicher Ablauf, keine Welt; Kamera-Ersatz aus dokumentmodus.js).
- `js/logik/mehrheit.js`: Punkte, Stimmen, Wirkung (Formel kommentiert). `LOGIK.entwurf()` = aktuelle Fassung.
- `js/ansicht/dokument.js`: Entwurf-Bedienfeld + HTML-Seite deckungsgleich über dem 3D-Blatt (Homografie).
- `js/ansicht/leiste.js`: Gesprächsleiste, Fraktionsleiste, Wirkungsanzeige, Dossier, Auswahlfeld `ANSICHT.wahl`.
- `js/ansicht/menues.js`: Titel, Einstellungen, Fenster/Rückfrage, Kalender, Name, Zettel, Abendnotiz,
  Hotspots im Gebäude, Zähler, Trilog-Tabelle, Epilog, Vergleich, Glossar-Blase.
- `js/debug.js`: Prüfungen (Gespräche, Daten, Ziffern, Textlänge pro Durchgang, Balance über alle Fassungen)
  und verstecktes Admin-Menü (`DEBUG.admin`, speichert nur nach Bestätigung).
- Fraktionen haben `lager` ("links"/"rechts") nur für die Balance-Prüfung.

## Stand
- **Phase 1 (3D-Stil-Prototyp) fertig.** Plenarsaal-Titel mit Kamerafahrt, Tinte, geprägtem Titel; Büro mit
  Papierstapel (Umblättern, Füllfeder), Glasmodell (60 Sitze), Figuren, Stempel; alle Effekte aus 7.5; Grafikstufen; Rückfälle.
- Entscheidungen in Phase 1: Fraktion „Brücke“ bekommt das Muster „Rauten“ (das Konzept nennt nur sechs Muster).
  Modellmaßstab für die Tiefenschärfe 1:1,6 (stärker wirkt bei Nahaufnahmen unscharf).
- **Phasen 2–5 fertig (2026-11-01, ohne Zwischenabnahme auf Wunsch des Users)** – wartet auf Abnahme.
  Standard-Antworten auf die Fragen aus 12.6 (User hat nicht einzeln geantwortet): sechs Fraktionen + Brücke wie im
  Konzept; Spielfigur = neu gewählte abgeordnete Person; sieben Artikel inklusive Stellschraube Verbandsklage;
  Wunschzettel (Kita-Garantie, Elternzeit) wie im Konzept; Länder wie im Konzept.
- Prüfungen grün: Gespräche, Daten, Ziffern, Textlänge (≈ 3550 Wörter pro Durchgang), Balance (alle vier Ziele).
- Zeichenaufrufe auf „Hoch“ (1280×720): höchstens ≈ 260 (Gebäudemodell), Budget 300 eingehalten.
- Offen: Test auf echtem iPad/Windows-Laptop/Firefox/Safari, Zahlen verifizieren (27 Fakten), Credits-Namen.
