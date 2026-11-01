# Projekt-Notiz für Claude Code – „Mehrheit – Ein Gesetz gegen die Lohnlücke“

Komplett neues Spiel im Ordner `mehrheit/`. Es übernimmt **nichts** aus „Die Lücke“ (Hauptordner) oder
„Funkloch“ – kein Code, keine Daten, kein Stil. Gemeinsam ist nur das Thema.
Grundlage ist das Konzept „Mehrheit – Prompt“ (PDF des Users, Stand 31. Oktober 2026).
Spielsprache und alle Antworten an den User: **Deutsch**. Code-Bezeichner und Kommentare auf Deutsch.

## Arbeitsweise (zwingend)
- Fünf Phasen. Nach jeder Phase: lauffähiger Stand ohne Konsolenfehler, kurze Zusammenfassung,
  Standbilder, **auf OK warten**. Ohne OK keine nächste Phase.
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
- Parameter: `?stufe=…`, `?szene=buero`, `?webgl=1`, `?modus=dokument`.
- Headless-Chromium nutzt SwiftShader (Software): Hoch braucht dort mehrere Sekunden pro Bild.
  Für Standbilder `MEHRHEIT.test.anhalten()`, `MEHRHEIT.test.rendern(n)`, dann Screenshot;
  `MEHRHEIT.test.oberflaeche(false)` blendet die Oberfläche aus. Bildzeiten aus SwiftShader sind
  **nicht** aussagekräftig – echte Messung auf echter Hardware (Debug-Feld zeigt FPS/GPU-Zeit).
- Debug-Konsole: Prüfungen (Gespräche, Daten, Ziffern, Textlänge) und Tabelle der ungeprüften Fakten.

## Stand
- **Phase 1 (3D-Stil-Prototyp) fertig – wartet auf Stil-Abnahme durch den User.**
  Plenarsaal-Titel mit Kamerafahrt, Tinte, geprägtem Titel; Büro mit Papierstapel (Umblättern,
  Füllfeder), Glasmodell (60 Sitze, Lichtlinie der Mehrheit, Lichtfleck), Mira und Luca, Beispiel-Gespräch
  (Schuss/Gegenschuss), Stempel; alle Effekte aus Abschnitt 7.5; Grafikstufen; Rückfälle.
  Phase-1-Bedienleiste („Stil-Prototyp“) wird in Phase 2 durch die echte Oberfläche ersetzt.
- Entscheidungen in Phase 1: Fraktion „Brücke“ bekommt das Muster „Rauten“ (das Konzept nennt nur sechs Muster).
  Modellmaßstab für die Tiefenschärfe 1:1,6 (stärker wirkt bei Nahaufnahmen unscharf).
- Offen: Test auf echtem iPad/Windows-Laptop/Firefox/Safari, Zahlen verifizieren, Credits-Namen.
