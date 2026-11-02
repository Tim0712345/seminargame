# Mehrheit – Ein Gesetz gegen die Lohnlücke

Lernspiel zum Gender Pay Gap in Europa · Beitrag zum Schülerwettbewerb „Europäischer Wettbewerb“
(Oberstufe, Zielgruppe 16–20 Jahre, Spielzeit 15–25 Minuten, Sprache Deutsch).

Man spielt eine neu gewählte abgeordnete Person im Europäischen Parlament, die zum ersten Mal
Berichterstatter*in ist, und schreibt ein europäisches Gesetz gegen die Lohnlücke – und muss dafür
eine Mehrheit finden. Am Ende steht die eigene Fassung neben der echten Richtlinie (EU) 2023/970.

> **Stand: alle fünf Phasen umgesetzt – vollständig spielbar** (Titel, sieben Kapitel, Epilog,
> „So ist es wirklich“). Alle Zahlen sind noch **ungeprüft** (siehe `QUELLEN.md`), die Credits-Namen fehlen.

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
| `?debug=1&kapitel=4` | direkt in ein Kapitel springen (1–9, mit Beispielstand „Mitte“) |
| `?webgl=1` | Rückfall auf WebGL 1 testen |
| `?modus=dokument` | Dokumentmodus ohne 3D testen |

Debug-Tasten: **G** Ansicht wechseln (Bild, nur Licht, Normalen, Tiefe, Verdeckung, Schattenkarte,
Drahtgitter) · **L** Lichtquellen zeigen · **C** freie Kamera (WASD, Q/E, Maus ziehen) · **P** Standbild
als PNG · **K** Titel ↔ Kapitel 1 · **V** Vertrauen auf 0 · **F** Flags in der Konsole.

**Admin-Menü** (für Lehrkräfte und Jury, auch ohne Debug-Modus): im Titel **fünfmal schnell auf das Bild
tippen** oder **„admin“ eintippen**. Dort: zu jedem Kapitel springen, Beispielfassung laden („mutig“,
„Mitte“, „schlank“), alle Karten ins Dossier, direkt zu „So ist es wirklich“, Mehrheiten der Beispielfassungen.
Das Admin-Menü verändert den gespeicherten Spielstand nicht, außer man schaltet „Spielstand speichern“
ausdrücklich ein (mit Rückfrage).

## Ablauf des Spiels

| Kapitel | Ort | Was passiert |
|---|---|---|
| Titel | leerer Plenarsaal | Kamerafahrt, Weiterspielen / Neue Legislatur / Einstellungen / Über das Spiel |
| 1 – Der Stapel | Büro | Vorname, Mira, Zettel von Inès, Probe-Änderung im Gesetz, Abendnotiz |
| 2 – Die Anhörung | Ausschusssaal | vier von sechs Fragen an fünf Gäste → Karten im Dossier |
| 3 – Der Entwurf | Büro | sieben Artikel mit je einer Kernentscheidung, Wunschzettel, Mehrheitsanzeige, Wirkung, Einreichen mit Stempel |
| 4 – Die Flure | Schnittmodell des Gebäudes | sechs Termine: Fraktionsbüros (Karte vorlegen, Zugeständnis, Versprechen), Bibliothek, Cafeteria |
| 5 – Die Ausschussabstimmung | Ausschusssaal | Abstimmung im Glasmodell; bei Niederlage zwei Zusatztermine, beim zweiten Mal Kompromiss der Kommission |
| 6 – Der Trilog | Verhandlungsraum bei Nacht | Vier-Spalten-Tabelle, Spielraum des Rates, Mittelwege, Brücke, Dolmetscher |
| 7 – Das Plenum | voller Plenarsaal | Rede in drei Teilen, Abstimmung mit Kranfahrt, Stempel; bei Niederlage „Neuer Anlauf“ |
| Epilog | Collage | „Fünf Jahre später“ – Bausteine je nach Fassung und Grundstimmung |
| So ist es wirklich | Seite | eigene Fassung neben der echten Richtlinie, Vereinfachungen, Zeitleiste, Fragen, Quellen, Credits |

Bedienung: Maus, Finger oder Tastatur (Tab, Enter, Esc, Pfeiltasten, Zahlen 1–9 für Antworten,
Leertaste zeigt den Text sofort, **D** öffnet das Dossier, **Q/E** oder Ziehen dreht das Gebäudemodell).

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
| `data/kameras.js` | Brennweiten, Kamerafahrten (Titel, Anhörung, Plenum), Kameraeinstellungen je Ort |
| `data/szenen.js` | Aufbau der Räume (Büro, Ausschusssaal, Gebäude, Trilog, Plenum, Epilog) |
| `data/texte.js` | Menüs, Kapitelkarten, Aufgabenkarte (`aufgaben`), Miras Hinweise (`fuehrung`), Mehrheitsanzeige, Oberfläche, Einstellungen, Admin-Menü |
| `data/fakten.js` | **alle echten Zahlen und Fakten** (ungeprüft, `verifiziert: false`) |
| `data/spielwerte.js` | Zahlen der Spielmechanik (Sitze, Termine, Schwellen – keine Fakten) |
| `data/fraktionen.js` | die sechs erfundenen Fraktionen und die Brücke: Sitze, Schwellen, Anliegen |
| `data/figuren.js` | alle Personen: Geschlecht, Größe, Körperbau, Hautton, Augenfarbe, Gesichtszüge, Frisur, Kleidung und Farben; dazu Haltungen und Gesten |
| `data/artikel.js` | sieben Artikel mit je einer Kernentscheidung und ihren Optionen (Haltung je Fraktion, Wirkung, Jurist*in), Wunschzettel, Umsetzungsfrist |
| `data/gespraeche.js` | alle Gesprächszeilen je Kapitel (`DATA.zeilen`), Abendnotizen, Presse |
| `data/karten.js` | Karten im Dossier (Stimme, Beleg, Einwand) und Bibliothek |
| `data/trilog.js` | Positionen des Rates, Mittelwege, Kompromiss der Kommission |
| `data/epilog.js` | Epilog-Bausteine mit Bedingungen, Miras Schlusssätze je Grundstimmung |
| `data/vergleich.js` | „So ist es wirklich“: echte Richtlinie je Artikel, Vereinfachungen, Zeitleiste, Fragen, Credits |
| `data/glossar.js` | Erklärungen der Fachbegriffe (kleines „?“ neben dem Wort) |

Texte benutzen Platzhalter statt Zahlen: `{fakt:gpg_eu}`, `{jahr:gpg_eu}`, `{quelle:gpg_eu}`,
`{wert:termine_flure}`, `{name}`, `{g:begriff}` (Glossar), `{info:id}`. `**fett**` wird fett gedruckt.
Der Debug-Modus prüft beim Start: alle Gesprächs- und Datenverweise, keine Ziffer direkt im Text,
Textlänge pro Durchgang (Ziel höchstens 6000 Wörter, derzeit etwa 3600) und die **Balance**: Er rechnet
alle 11.520 Fassungen des Gesetzes durch und meldet, ob es mindestens drei
verschiedene Wege zur Mehrheit gibt, ob die Maximalfassungen beider Seiten und „fast alles gestrichen“
scheitern und ob eine Fraktion unverzichtbar ist.

## Technik

- Vanilla JavaScript ohne Module, feste `<script>`-Reihenfolge, läuft per `file://`.
- Eigene 3D-Maschine (`js/motor/`, Namensraum `MOTOR`) mit WebGL 2:
  HDR-Rendering, physikalisch basiertes Licht (GGX, Fresnel, Klarlack, Durchscheinen, Samtglanz),
  Schattenkarte mit abstandsabhängig weichen Kanten, Umgebungslicht aus einer beim Laden aufgenommenen
  Raum-Würfeltextur (mit zweitem Lichtweg), Spiegel-Ebene für Tischplatten und polierte Böden,
  Glas mit Brechung, vorberechnete Verdeckung in Ecken, Instancing für Sitze und Glaswürfel.
- Nachbearbeitung: Umgebungsverdeckung im Bildraum → Lichtstrahlen im Staub (Strahlenverfolgung mit
  der Schattenkarte) → (Tiefenschärfe ist im Code vorhanden, aber auf Wunsch ausgeschaltet) → Bloom → filmische Tonwertkurve →
  Farbkorrektur (im Code erzeugte 3D-Farbtabelle) → zeitliche Kantenglättung bzw. FXAA → Korn,
  Vignette, Farbsaum.
- Alle Geometrie, Texturen (Holzmaserung, Gewebe, Papierfaser, Kratzer …) und Töne entstehen im Code.
- Rückfall: WebGL 1 mit Stufe „Niedrig“; ohne WebGL der **Dokumentmodus**: das ganze Spiel als
  HTML-Seite (Gesetzestext, Halbrund als SVG, Gespräche mit Namen, Räume als Liste) mit Hinweis,
  wie man die Hardwarebeschleunigung einschaltet.
- Lesbarkeit: Über dem 3D-Papier liegt deckungsgleich eine scharfe HTML-Seite (perspektivisch
  per Homografie verzerrt), damit der Gesetzestext immer gestochen scharf und für Bildschirmleser lesbar ist.
- Töne aus dem Code (Web Audio): Raumhall je Ort, Papier, Füllfeder, Stempel, Hammer, Schritte,
  Gemurmel, Regen, ein kurzes Musik-Motiv.
- Namensräume: `DATA` (Daten), `MOTOR` (3D-Maschine), `WELT` (Szenen, Figuren, Bausteine),
  `ANSICHT` (HTML-Oberfläche), `LOGIK` (Spielstand, Berechnungen, Ablauf).
- **Menschen:** eigene Modelle, mit dem Werkzeug `werkzeuge/menschen.py` aus Abstandsfeldern erzeugt
  (Kopf mit Gesicht für Frau und Mann, Augen, Brauen, Hände mit Fingern, Sakko, Blazer, Hemd, Bluse, Pullover,
  Hose, Rock, Schuhe, Krawatte, Schal, Kopftuch und sieben Frisuren). Ablauf: Feld abtasten → Marching Cubes →
  glätten → vereinfachen → Formvarianten (Körperbau, Nase, Kinn, Wangen, Lippen, Alter) → Knochen-Gewichte.
  Die fertigen Netze liegen komprimiert in `js/welt/menschen_netze.js` (eigener Entpacker `js/motor/inflate.js`).
  Im Spiel werden sie je Person zusammengesetzt, eingefärbt und weich verformt (bis zu vier Knochen pro Punkt,
  28 Knochen mit Fingern und Augen). Ärmel und Rumpf der Kleidung sind getrennte Körper, damit sich beim Bewegen
  nichts dehnt. Neu erzeugen (nur nötig, wenn man die Formen ändert): `cd werkzeuge && python3 menschen.py`
  (braucht numpy, scipy, scikit-image, fast-simplification; dauert etwa 20 Minuten).
- **Bildformate:** Auf sehr breiten Bildschirmen (z. B. 21:9) wird die Spielfläche mittig auf höchstens
  2,05 : 1 begrenzt (`DATA.stil.bildformat`); 16:9, MacBook (16:10) und iPad (4:3) nutzen den ganzen Bildschirm.

## Überarbeitung nach Rückmeldung (1. November 2026)

Rückmeldung: „Es fehlt das direkte Verstehen, es ist unnötig kompliziert. Die Aufgaben sollen schwer sein, aber
mit Leitfaden. Die Personen sehen nicht gut aus, vieles passt vom Aussehen nicht. Die Unschärfe muss weg.“

- **Leitfaden:** Aufgabenkarte oben links (Kapitel, Ziel, nächster Schritt, Fortschritt) und Mira erklärt jeden neuen
  Bildschirm einmal mit Hervorhebung („Verstanden“).
- **Weniger gleichzeitig:** große Mehrheitsanzeige („Dir fehlen 3 Stimmen“), Einzelheiten je Fraktion erst auf Antippen;
  das Entwurfsfeld zeigt nur einen Artikel mit einer Frage, Optionen als Karten mit „mögen / lehnen ab“;
  Wirkung im Entwurfsfeld; Trilog nur mit den strittigen Punkten.
- **Eine Kernentscheidung pro Artikel** (7 statt 13). Was wegfiel, steckt jetzt in den Optionen oder im festen Text.
  Schwer bleibt es: Ohne Verhandlung findet nur jede dreißigste Fassung eine Mehrheit, der unveränderte Vorschlag der
  Kommission scheitert knapp.
- **Keine Tiefenschärfe** mehr – die Unschärfe ist ganz ausgeschaltet.
- **Schlichte Modellfiguren:** glatt, ohne Gesicht und ohne sichtbare Gelenke; Menschenmengen in gedeckten Farben
  mit natürlichen Hauttönen.
- **Räume und Licht:** mehr Einrichtung (Teppiche, Garderoben, Bilder, Sideboard, Stehlampe, Uhr, Akten),
  Wandlicht im Ausschusssaal, Plenum nicht mehr überstrahlt, Trilog-Raum heller, Raumlicht in den Fraktionsbüros.
- **Oberfläche:** ruhiges Papierweiß statt Milchglas, kräftigeres Petrol, einheitliche Karten und Knöpfe.

## Zweite Überarbeitung nach Rückmeldung (2. November 2026)

Rückmeldung: „Die Menschen sehen aus wie Pappfiguren und sollen wie echte Menschen aussehen. Auf 21:9 sieht es
schlecht aus. Die blöden Sprüche wirken nach KI. Das private Gespräch nach der Abstimmung ist unterbelichtet.“

- **Menschen komplett neu:** echte Gesichter (Augen mit Iris und Pupille, Lider, Brauen, Nase, Lippen, Ohren),
  Hände mit Fingern, Kleidung mit Revers, Kragen, Manschetten und Knöpfen, sieben Frisuren und ein Kopftuch.
  Jede Person hat eigene Gesichtszüge, Augenfarbe und Körperbau. Weiche Verformung an den Gelenken, die Augen
  schauen mit. Auch die Menschenmengen im Plenum sind jetzt grobe Fassungen dieser Menschen.
- **Bildformate:** 21:9 wird mittig begrenzt; die Trilog-Tabelle ist nur so groß wie nötig.
- **Texte:** Witzsätze und Sprüche entfernt, Kapitelkarten und Begrüßungen schlicht und sachlich.
- **Trilog neu:** heller Besprechungsraum mit Eichenpaneel, großem Deckenlicht, Fensterband zur Stadt bei Nacht
  und einer Dolmetschkabine hinter Glas; Stühle unter allen Sitzenden.

## Stand

- **Phase 1 – 3D-Stil-Prototyp:** Plenarsaal-Titel, Büro mit 3D-Papierstapel, Glasmodell, Figuren, Stempel, Grafikstufen.
- **Phase 2 – Kern:** Kapitel 1 bis 3, Entwurf mit allen sieben Artikeln, Fraktionsleiste, Wirkungsanzeige,
  Wunschzettel, Juristischer Dienst, Speichern in einem Spielstand.
- **Phase 3 – Verhandeln:** Kapitel 4 und 5, Gebäudemodell mit Räumen, Dossier mit Karten, Zugeständnisse und
  Versprechen, Ausschussabstimmung mit Zusatzterminen und Kompromiss der Kommission.
- **Phase 4 – Trilog, Plenum, Epilog:** Vier-Spalten-Tabelle, Rede, Plenumsabstimmung mit Kranfahrt,
  „Neuer Anlauf“, Epilog-Collage, „So ist es wirklich“ mit automatisch erzeugter Quellenliste.
- **Phase 5 – Feinschliff:** Glossar, Töne und Musik-Motiv, Tastaturbedienung, Dokumentmodus für das ganze Spiel,
  Admin-Menü, Balance-Prüfung, Textlängen-Prüfung.

Getestet (headless Chromium mit Software-Grafik): kompletter Durchlauf in drei Varianten (Mehrheit beim ersten Mal;
Ausschuss scheitert zweimal → Kompromiss; Plenum scheitert), Dokumentmodus komplett, Doppelklick-Start (`file://`)
mit WebGL 1, Tastatur bis Kapitel 4, Bildformate 21:9, 16:9, MacBook und iPad 4:3, keine Konsolenfehler. **Nicht getestet:** echtes iPad/Safari, Firefox, Windows-Schul-Laptop,
echte Grafikkarte (Bildzeiten aus der Software-Grafik sind nicht aussagekräftig).

Credits: Konzept und Texte: [Dein Name] · Umsetzung mit KI-Unterstützung (siehe `KI-DOKUMENTATION.md`).
