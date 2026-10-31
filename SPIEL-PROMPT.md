# Prompt: „Die Lücke – Ein europäischer Fall“

*Dieser Text beschreibt das komplette Spiel so, wie es im Repository steht – Idee, Geschichte,
Figuren, Karten, Systeme, Grafik, Technik und alle Entscheidungen, die unterwegs getroffen wurden.
Er ist als Prompt für eine KI geschrieben: Wer ihn einer Programmier-KI gibt, sollte damit das
Spiel neu bauen, fortsetzen oder verstehen können. Alles ab der nächsten Überschrift ist der Prompt.*

---

## 0. Deine Rolle und wie du arbeitest

Du bist ein erfahrener Spieleentwickler und Grafikprogrammierer. Du baust zusammen mit mir
(Schüler*in der Oberstufe) ein 3D-Lernspiel für den Schülerwettbewerb **„Europäischer Wettbewerb“**.
Eine Jury bewertet das Spiel. Es soll sich anfühlen wie ein liebevoll illustriertes Bilderbuch,
das man begehen kann – nicht wie ein Lernprogramm und nicht wie ein bestehendes Spiel.

**Sprache:** Das Spiel ist **ausschließlich auf Deutsch**. Antworte mir immer auf Deutsch.
Code-Bezeichner und Kommentare schreibst du ebenfalls auf Deutsch (z. B. `zeichnen`, `welt`,
`hoeheBei`, `lichterSetzen`).

**Arbeitsweise (zwingend):**
- Entwickle in **fünf Phasen**. Nach jeder Phase gibt es einen lauffähigen Stand und eine kurze
  Zusammenfassung auf Deutsch. Danach wartest du auf mein OK.
- Baue keine Features außerhalb dieses Konzepts, ohne vorher zu fragen.
- **Erfinde niemals Zahlen.** Alle Zahlen stehen ausschließlich in `data/facts.js`, jede mit
  `verifiziert: false` und einem Kommentar `// TODO: verifizieren – Quelle: …`. Texte enthalten nie
  direkt eine Zahl, sondern Platzhalter wie `{fakt:gpg_de}`. Jede neue Zahl kommt zusätzlich in
  `QUELLEN.md` (Tabelle mit Feld, Schätzwert, vorgeschlagener Quelle, „verifiziert: nein“).
- **Alle Texte und alle Aussehens-Daten** (Farben, Figuren, Karten, Prefabs, Licht, Bildstil)
  liegen nur im Ordner `data/`. Ich bearbeite diese Dateien später selbst mit einem Texteditor,
  deshalb müssen sie gut kommentiert und für Laien lesbar sein (Kopfkommentar in jeder Datei, der
  alle Felder erklärt).
- Nach jeder Änderung testest du im Browser. Im Debug-Modus darf die Konsole keine Fehler zeigen,
  und die automatische Karten- und Dialogprüfung muss „alles erreichbar ✓“ melden.
- Ehrlich berichten: Wenn etwas nicht getestet werden konnte (z. B. echtes iPad), sagst du das.

---

## 1. Das Spiel in einem Absatz

**„Die Lücke – Ein europäischer Fall“** ist ein gemütliches 3D-Erkundungsspiel ohne Kämpfe über den
**Gender Pay Gap in Europa**. Zielgruppe: 16–20 Jahre, Spielzeit 15–25 Minuten. Man spielt **Kim**,
Praktikant*in im fiktiven **„EU-Büro für Gleichstellung“**. Die Geschwister **Anna und Jonas** haben
die gleiche Ausbildung und arbeiten in ähnlichen Firmen – trotzdem verdient Anna deutlich weniger.
Kim soll herausfinden, warum. Dazu reist Kim vom **Europaplatz** aus in vier Viertel, die je ein
EU-Land und je eine Ursache der Lohnlücke zeigen: **Deutschland** (Teilzeit & Kinderbetreuung),
**Schweden** (Aufteilung der Elternzeit), **Estland** (Branchen & Berufswahl) und **Luxemburg**
(Gehaltsverhandlung & Beförderung – dort ist der Durchschnitt fast null, und genau das wird Thema:
„Ein Durchschnitt zeigt nicht alles“). Aus jedem Viertel bringt Kim ein **Beweisstück** mit. Mit allen
vier öffnet sich das Tor nach **Brüssel**. Dort findet Kim im **Archiv** den „unerklärten Rest“
(bereinigte vs. unbereinigte Lücke) und überzeugt im **Sitzungssaal** drei Abgeordnete mit Fakten aus
dem Notizbuch. Am Ende wählt Kim **drei von sechs Maßnahmen**. Ein modularer **Epilog „Zehn Jahre
später …“** zeigt Anna und Jonas – je nach gewählten Maßnahmen. Es gibt kein Game Over und kein
„richtiges“ Ende. Zum Schluss kommt eine **Reflexionsseite** mit offenen Fragen, allen Quellen und Credits.

---

## 2. Harte technische Vorgaben

- **Vanilla JavaScript ohne ES6-Module.** Die Datei muss per **Doppelklick auf `index.html`**
  (Protokoll `file://`) laufen – dort blockieren Browser Module. Deshalb normale `<script>`-Tags in
  fester Reihenfolge, alles in drei globalen Namensräumen:
  - `DATA` – alle Daten (Texte, Farben, Karten, Figuren …)
  - `ENG` – die eigene Engine
  - `GAME` – die Spiellogik
- **Reines WebGL 1** mit einer **selbst geschriebenen Engine** in `js/engine/`. Keine Bibliotheken,
  keine CDNs, keine Webfonts, keine Bilddateien, keine Sounddateien, keine 3D-Modelle von außen.
  Alle Modelle werden im Code aus Grundformen gebaut, alle Texturen zur Laufzeit gezeichnet, alle
  Töne mit der Web-Audio-API erzeugt.
- **Kein `fetch`/XHR, keine Cookies.** `localStorage` nur optional und immer in `try/catch` (im
  privaten Fenster läuft das Spiel trotzdem, nur ohne Speichern).
- Muss offline in **Edge, Chrome und Firefox unter Windows** laufen, außerdem auf dem **iPad (Safari)**
  und als **GitHub-Pages-Web-App** (`https://<name>.github.io/seminargame/`, gebaut aus `main`).
- **Gesamtgröße < 5 MB.**
- **Leistung:** 60 FPS auf einem normalen Laptop, mindestens 30 FPS auf einem Schul-Laptop. Drei
  Grafikstufen (siehe Abschnitt 11). „Niedrig“ = Renderskala 0,75 ohne Zusatzeffekte.
- **Debug-Modus:** `index.html?debug=1` (FPS, Draw-Calls, Dreiecke, Zahl der Lichter, Kachel-Position;
  Taste G = Raster/Kollision/Lichtreichweiten; T = Teleport; F = Flags; Konsole listet ungeprüfte
  Fakten und prüft alle Dialoge und Karten). `&karte=<id>` startet direkt auf einer Karte.

---

## 3. Grafikstil „Tusche & Aquarell“ (vom User festgelegt – sehr wichtig)

Die erste Version sah „extrem wie Animal Crossing“ aus. Deshalb gibt es einen **eigenen Stil**, für
den ausdrücklich vom ursprünglichen Konzept abgewichen werden durfte: **wie ein illustriertes
Bilderbuch, gezeichnet mit Tusche und koloriert mit Aquarell.**
**Nichts darf nach Animal Crossing oder einem anderen bestehenden Spiel aussehen.**

Grundregeln:
- **Tusche-Konturen** um Welt und Figuren (Inverted-Hull-Verfahren: Rückseiten entlang der Normalen
  aufblähen und in Tuschefarbe füllen; Linienbreite wächst mit dem Abstand, damit sie auf dem
  Bildschirm gleich dick wirkt). Gesichter und Wasser bekommen keine Kontur.
- **Zwei klare Lichtstufen** statt weicher Verläufe, **diagonale Schraffur im Schatten**,
  **Kreuzschraffur im Kernschatten**, **schraffierte Bodenschatten** in Tusche statt dunkler Flecken.
- **Aquarell-Flecken** (große unregelmäßige Farbschwankungen in Weltkoordinaten), **Papierkorn**,
  **gezeichnete Wasserwellen** (Tuschelinien mit Lücken), Pigment sammelt sich an Kanten.
- **Figuren:** etwa **3 Kopflängen** hoch, schlank, **Strichaugen mit Brauen und kleiner Nase**,
  **keine** Glanzpunkt-Augen, **keine** rosa Wangen. Große Vielfalt bei Alter, Hautton, Körperbau,
  Frisur, Kopftuch, Rollstuhl, Gehstock, Kinderwagen. Kleidung ohne Zuordnung nach Geschlecht.
- **Keine gekrümmte Welt** (ein früher eingebauter „Weltkrümmungs“-Effekt bleibt aus).
- **Kamera:** **frontal von Süden** mit **46° Neigung**, folgt Kim weich mit kleinem Vorausblick.
  Der User wollte ausdrücklich diesen Winkel, **nicht diagonal**. Keine freie Drehung. Innenräume
  haben eine feste Kamera über dem Raum.
- **Oberfläche im Skizzenbuch-Stil:** Papierkarten, krakelige Tusche-Ränder (unregelmäßige
  `border-radius`-Werte, z. B. `14px 22px 12px 26px / 24px 12px 22px 14px`), Überschriften in
  Handschrift-Systemschriften („Segoe Print“, „Bradley Hand“, „Chalkboard SE“, „Comic Sans MS“,
  `cursive` als Rückfall), Fließtext in der Systemschrift.
- **Farbpalette** (Auszug, alles in `data/palette.js` als `"#rrggbb"`): Tusche `#2e2934`, Papier
  `#f4ecdb`, Gras `#a8c27c`, Weg `#d5ab72`, Pflaster `#e3dac7`, Wasser `#8ab8cc`, Laub `#8db06a`,
  Putz creme `#f5e8d2`, Dachrot `#dc8a72`, Fenster `#a6d6e4`, Laternenlicht `#fff3bd`; dazu sechs
  Hauttöne, sieben Haarfarben, ~20 Kleidungsfarben und kräftige Flaggenfarben. Überall sonst
  werden Farben nur über ihren Namen benutzt (`farbe: "salbei"`).
- **Farbstimmungen pro Ort** (`DATA.stimmungen`): Himmel oben, Horizont, Dunst, Sonnenfarbe,
  Schattenfarbe (kühles Lila-Blau), Tuschefarbe – plus alle Lichtwerte (Abschnitt 10). Orte:
  `hub` (Europaplatz, hell), `de` (warmes Ocker, späte Nachmittagssonne), `se` (kühles klares
  Nordlicht), `ee` (frisches Grün, Kiefern, Wind), `lu` (warmer Sandstein, goldenes Licht), `bxl`
  (leicht bewölkt), `abend` (Epilog, warmes Abendlicht, Lampen voll an), `innen_warm`,
  `innen_kuehl`, `innen_archiv`.

---

## 4. Geschichte und Ablauf

### 4.1 Intro auf dem Europaplatz (startet automatisch, kann nicht abgebrochen werden)
Dr. Marie Laurent begrüßt Kim als neue Chefin im EU-Büro für Gleichstellung. Kim: „Ich bin bereit.
Glaube ich. Ich habe sogar ein neues Notizbuch dabei.“ Laurent stellt **Anna und Jonas** vor:
Geschwister, gleiche Ausbildung, ähnliche Firmen. Sie haben „eigentlich als Witz“ ihre Gehaltszettel
verglichen – „und dann war es plötzlich gar nicht mehr witzig“. Laurent erklärt den unbereinigten
Gender Pay Gap der EU (`{fakt:gpg_eu}`). Antwortmöglichkeit „Was heißt ‚unbereinigt‘?“ erklärt den
Unterschied und führt den Begriff **„unerklärter Rest“** ein. Auftrag: vier Viertel besuchen, aus
jedem ein Beweisstück mitbringen, dann öffnet sich das Tor nach Brüssel. Kim: „Vier Länder, ein Tor,
ein Ausschuss. Also kein Druck.“ Laurent: „Fang am besten im Deutschland-Viertel an: der Weg nach
Westen.“ → Flag `intro_fertig`, Kim zeigt eine Glühbirnen-Sprechblase.

### 4.2 Der Europaplatz (Hub)
Brunnen in der Mitte (mit Münzen aus ganz Europa, spritzendes Wasser), Bänke, acht Laternen,
Blumenbeete, Bäume, ein Wegweiser, ein Infoschild mit dem EU-Wert, Flaggen aller vier Länder und
zwei EU-Flaggen, eine bunte Wimpelkette. Richtungen: **Deutschland im Westen, Schweden im Osten,
Estland im Südwesten, Luxemburg im Südosten, Brüssel im Norden** (Tor, anfangs verschlossen mit vier
runden Mulden für die Beweisstücke). Figuren: Dr. Laurent (reagiert auf jedes neue Beweisstück und
fragt Kims Meinung ab), Anna, Jonas, Postbotin Sanne („Dann ist das hier deine Werbung für
Gartenzwerge“), Herr Dimitriou auf der Bank (Witz über frisch gestrichene Bank), Emil im Rollstuhl
(„trainiere für den Stadtlauf. Beziehungsweise Stadtroll“). Laurent fragt nach jedem Viertel mit zwei
Antwortmöglichkeiten, z. B. „Teilzeit ist oft keine ganz freie Wahl“ vs. „Viele entscheiden sich
bewusst für Teilzeit“ – beide Antworten werden respektvoll eingeordnet, keine ist „falsch“.

### 4.3 Deutschland-Viertel – Teilzeit & Kinderbetreuung
Altbauten (ocker, Backstein mit Erker), Fachwerkhäuser, Litfaßsäule, Kita „Kleine Wolke“, Büro
„Nordlicht Software“, Fahrradständer, Sandkasten, Hecken, deutsche Flaggen und Wimpel.
- **Lea** wartet vor der Kita: Tochter hat nur einen Halbtagsplatz, Ganztag erst, wenn jemand auf der
  Warteliste abspringt. Bauingenieurin, früher Vollzeit, jetzt 20 Stunden. Erklärt den **Lohnbezug**:
  Der Gender Pay Gap vergleicht Stundenlöhne – aber Teilzeitstellen werden pro Stunde oft schlechter
  bezahlt, und wer reduziert, wird seltener befördert. „Mein Mann verdient mehr. Also haben wir
  gerechnet.“ / „Frei entscheiden kann ich erst, wenn es überhaupt eine Wahl gibt.“
- **Tobias** am Fahrradständer (Kette springt jeden Morgen ab): Er und seine Partnerin haben beide auf
  30 Stunden reduziert. Sein Chef fragte, ob er „noch Karriere machen will“ – seine Partnerin hat das
  nie jemand gefragt. Bei der nächsten Beförderungsrunde war er nicht mehr im Gespräch.
- **Herr Brandt** (Gegenstimme, älterer Herr mit Brille, pflegt seine Tulpen): „Früher hat das auch geklappt. Einer
  arbeitet, einer kümmert sich.“ Jede Familie soll selbst entscheiden. Aber: Die Rente seiner Frau ist
  viel kleiner als seine – „dabei hat sie genauso viel gearbeitet. Nur eben ohne Lohn.“
- **Jana** (Maschinenbau-Studentin), Kinder **Mia** und **Ben** in der Kita.
- **Frau Yılmaz** (Kita-Leiterin, „Wir haben nur Kinderstühle“): zu wenige Fachkräfte; zeigt die
  dreiseitige **Warteliste** – „Fast überall steht dabei: Ein Elternteil arbeitet so lange weniger.
  Du darfst raten, welches meistens.“ → **Beweisstück „Kita-Warteliste“**.
- **Frau Okafor** im Büro leitet das Entwicklungsteam in 30 Stunden („Bevor du fragst: Das fragen
  alle“), erwähnt die kommende **EU-Entgelttransparenzrichtlinie**.
- Pinnwand: „Ganztagsplätze leider alle belegt. Warteliste bei Frau Yılmaz.“

### 4.4 Schweden-Viertel – Aufteilung der Elternzeit
Schwedenrote und gelbe Holzhäuser, **Familienamt („Familjekontoret“)** mit Amtsschild, See mit Steg und
Ruderboot, Birken, **Dalapferd**, **Mittsommerstange**, schwedische Flaggen und Wimpel.
- **Frau Lindqvist** im Familienamt: Eltern bekommen zusammen `{fakt:se_elterngeld_tage}` Elterngeld,
  `{fakt:se_reservierte_tage}` pro Elternteil sind fest reserviert und verfallen sonst. Väter nehmen
  heute etwa `{fakt:se_vaeter_anteil_tage}` der Tage. Erklärt die **„Kinderstrafe“**: Nach dem ersten
  Kind steigt das Gehalt von Müttern oft viel langsamer – teilen beide die Pause, verteilt sich der
  Knick. Vergleich mit Deutschland (`{fakt:de_partnermonate}` Partnermonate,
  `{fakt:de_vaeter_elterngeld_anteil}` der Väter, im Schnitt viel kürzer).
- **Lars und Nora** am See mit Baby Ella im Kinderwagen: haben die Elternzeit genau halbiert. Nora:
  Ihr Gehalt stieg danach normal weiter – bei ihrer Schwester, die zwei Jahre allein zu Hause war, war
  das anders. → **Beweisstück „Elternzeit-Kalender“** („Grün ist Nora, orange bin ich … aber bring ihn
  wieder mit“).
- **Birgit** (Gegenstimme): Jede Familie soll selbst bestimmen – „aber mein Enkel wickelt besser als
  sein Vater“. **Erik** mit Kinderwagen („Der Kleine schläft nur, solange der Wagen rollt“), **Alva**
  (Jugendliche, deren Vater ein Jahr zu Hause war).

### 4.5 Estland-Viertel – Branchen & Berufswahl (Berufsmesse)
Moderne Glasbauten und Holzhäuser, **Stadtturm** und **Windmühle**, viele Kiefern, Messestände.
- Vier Messestände mit je einer Person, die das Gehalt nennt: **Mart** (IT), **Liis** (Pflege),
  **Kertu** (Tischlerin, Bau & Handwerk – „ich muss den Hammer nicht erst suchen“), **Priit** (Erzieher,
  „Onkel Priit“). **Anu** (Abiturientin) will in die Pflege, ihre Tante rät zur IT – „wegen des Geldes“.
- **Kadri** leitet die Messe und startet das **Minispiel „Welche Branche zahlt mehr?“** (Abschnitt 6.1).
  Danach: „Wo viele Frauen arbeiten, ist der Lohn im Schnitt oft niedriger.“ Frage: „Warum ist Pflege
  weniger wert als Programmieren?“ → **Beweisstück „Gehaltstabelle der Messe“**.

### 4.6 Luxemburg-Viertel – Gehaltsverhandlung & Beförderung
Sandsteinhäuser, Brücke mit Geländer über einen Fluss, Café, **Festung**, **goldene Säule**, Hochhaus
**„Capitol“** mit drei Etagen und Aufzug.
- Infoschild: GPG Luxemburg `{fakt:gpg_lu}` – „Also fast keine Lücke? Frag mal Dr. Hoffmann.“
- **Dr. Hoffmann** (Ökonomin im Ruhestand, zählt Boote und Durchschnitte): „Ein Durchschnitt ist wie
  dieser Fluss: Oben sieht er ruhig aus. Was darunter passiert, sieht man nicht.“ Niedriger Wert kann
  viele Gründe haben (welche Berufe, wer überhaupt erwerbstätig ist); innerhalb einer Firma kann es
  trotzdem große Unterschiede geben.
- Hochhaus: **Paul** am Empfang (Etage 1), **Chloé** (zweimal für Teamleitung beworben, „noch nicht so
  weit“) und **Tom** (seit drei Monaten Teamleiter, vorgeschlagen „beim Fußball am Wochenende“) in
  Etage 2, **Herr Schmit** (Personalabteilung) in Etage 3 mit dem **Minispiel „Gehaltsverhandlung“**
  (Abschnitt 6.2). Danach: Wenn Frauen hart verhandeln, gilt das manchmal als „fordernd“, bei Männern
  als „selbstbewusst“. Die Beförderungsliste: im Team etwa gleich viele Frauen und Männer, auf der Liste
  fast nur Männer; Führungsanteil Luxemburg `{fakt:lu_frauen_fuehrung}`, EU `{fakt:eu_frauen_fuehrung}`.
  → **Beweisstück „Beförderungsliste“**. **Marc** im Café („Espresso, Cappuccino und ungefragte
  Meinungen“).
- Der Aufzug zeigt nur die **anderen** Etagen zur Auswahl.

### 4.7 Brüssel – Archiv und Sitzungssaal
Jugendstilhäuser, Backstein-**Archiv** mit runden Fenstern, **Parlament** mit Glaskuppel,
**Atom-Skulptur**, Waffelstand, halb fertige **Comicwand** (zwei Geschwister vergleichen
Gehaltszettel, „im letzten Bild fehlt noch das Ende“), belgische und EU-Flaggen.
- **Herr Janssens** vor dem Saal: Ohne Beweisstück aus dem Archiv kein Zutritt (Tür `gesperrt`).
- **Lotte** malt die Comicwand, **Samir** ist Dolmetscher-Praktikant („Mein Kopf klingelt“).
- **Archiv:** **Frau Peeters** erklärt, dass man verstehen muss, wie gerechnet wird. Drei Aktenfächer an
  der Rückwand: **A „Unbereinigt“** (blau, alle Stundenlöhne), **B „Erklärt“** (grün, Balken für
  Teilzeit, Branche, Beruf, Führung), **C „Bereinigt“** (gelb, Fragezeichen: nur Vergleichbare). Danach
  ihre Prüfungsfrage mit drei Antworten (`{fakt:de_gpg_unbereinigt_destatis}`,
  `{fakt:de_gpg_erklaert_anteil}`, `{fakt:gpg_de_bereinigt}`); falsche Antworten werden freundlich
  erklärt, man darf neu wählen. Richtig ist die bereinigte Lücke. Wichtiger Satz: **„‚Unerklärt‘ heißt
  nicht automatisch Diskriminierung. Die Statistik misst nicht alles. Ungleiche Behandlung kann aber ein
  Teil davon sein.“** → **Beweisstück „Akte ‚Unerklärter Rest‘“**. Kein Extra-Minispiel.
- **Sitzungssaal:** drei Abgeordnetenpulte, Rednerpult, Saalbanner. **Abg. Lucia Vella**
  (wirtschaftsliberal: „viel von freien Entscheidungen und wenig von neuen Vorschriften“), **Abg. Piotr
  Nowicki** (gewerkschaftsnah, früher Betriebsrat: „Belege sehen, keine Parolen“), **Abg. Anneke de Wit**
  (EU-skeptisch: „Muss das wirklich in Brüssel geregelt werden?“). Dazu Laurent, Anna und Jonas
  („Ich rede ab jetzt offen über mein Gehalt. Zumindest mit Anna.“). Abgeordnete werden **gesiezt**.
- **Finale** am Rednerpult (Abschnitt 6.3–6.5): Präsentation → Duell → Maßnahmen → Abschluss → Epilog.

### 4.8 Epilog „Zehn Jahre später …“
Abendstimmung auf dem Europaplatz, langsam schwenkende Kamera, Textseiten wie im Bilderbuch.
Zusammengesetzt aus Bausteinen (alle in `DATA.epilog`):
1. **Eine von drei Grundstimmungen** (je nach Wahl: „keine Eingriffe“ / Kita oder Partnermonate dabei /
   sonst).
2. **Ein Baustein je gewählter Maßnahme**, z. B. Kita: Anna bekam für Tochter Lina gleich einen Platz –
   „in manchen Städten fehlen allerdings noch immer Erzieher*innen“. Jede Maßnahme hat auch eine
   Kehrseite.
3. **Ein Satz je nach Überzeugungspunkten** aus dem Duell (ab 5 / ab 3 / darunter).
4. **Schlussgespräch:** Anna: „Weißt du noch, wie wir damals unsere Gehaltszettel verglichen haben?“ –
   Jonas: „Klar. Und weißt du, was das Beste ist? Heute reden wir einfach darüber.“
Die Figuren in der Szene hängen von der Wahl ab (Anna im Blazer bei Quote/Transparenz, Jonas mit
Kinderwagen bei Partnermonaten, Kind Lina bei Kita, Anu als Pflegerin bei Aufwertung, Herr Dimitriou
allein auf der Bank bei „keine Eingriffe“).

### 4.9 Reflexion und Credits
- „Die Geschichte ist erfunden – die Fragen sind echt.“ Drei offene Fragen: Welche Ursache hat dich am
  meisten überrascht? Ab wann ist eine Entscheidung wirklich frei? Welche Maßnahme würdest du in deinem
  Land zuerst umsetzen – und wer müsste dafür etwas abgeben?
- Übersicht der eigenen Vorschläge und der Duell-Punkte.
- **Automatische Quellenliste** aus `facts.js`; ungeprüfte Werte werden als „noch nicht geprüft“
  markiert (Hinweis verschwindet, wenn alles `verifiziert: true` ist).
- **Credits** mit Platzhaltern `[Dein Name / eure Namen]`, „Programmierung: [Dein Name] mit
  Unterstützung durch KI“, „Beitrag für: Europäischer Wettbewerb“, KI-Hinweis (Verweis auf
  `KI-DOKUMENTATION.md`) und „Alle Figuren, Firmen und Orte sind erfunden.“
- Danach: zum Titelbildschirm oder weiter erkunden.

---

## 5. Inhaltliche Regeln (bestätigt)

- **Kim** ist geschlechtsneutral. **Für Kim werden nie Pronomen benutzt** – Sätze werden so gebaut,
  dass keine nötig sind. Alle duzen Kim, Kim duzt Gleichaltrige, **Abgeordnete werden gesiezt**.
- **Genderstern** in Texten (Erzieher*innen, Kolleg*innen).
- **Keine Stereotype, keine Schuldzuweisungen.** Zu jedem Thema gibt es eine respektvolle
  Gegenstimme (Brandt, Birgit, Vella, de Wit), die ernst genommen wird.
- **Leichter Humor** in fast jeder Figur (ein trockener Satz pro Person), damit es nicht nach
  Unterricht klingt.
- **Lohnbezug immer klar machen:** Der Gender Pay Gap vergleicht Bruttostundenlöhne. Teilzeit und
  Elternzeit wirken über schlechtere Stundenlöhne, seltenere Beförderung und langsamer steigende
  Gehälter („Kinderstrafe“).
- Erfundene Geschichten der Figuren („Lea arbeitet 20 Stunden“, „8 Prozent mehr“ in der Verhandlung,
  die Beförderungsliste) sind ausdrücklich **keine Statistik** und brauchen keine Quelle.
- **Europabezug:** Vergleich von vier EU-Ländern, die **EU-Entgelttransparenzrichtlinie (EU) 2023/970**
  (Umsetzungsfrist im Juni 2026), Maßnahmen auf EU- und Länderebene.
- **Argumentationsduell ohne Game Over;** Punkte ändern nur einen Satz im Epilog.

---

## 6. Minispiele und Finale (`js/game/minigames.js`, Daten in `DATA.minispiele`)

Minispiele werden aus Dialogen mit der Aktion `minispiel:<id>` gestartet; danach läuft der Folgedialog
`danach`. Alle Minispiele funktionieren mit Tastatur, Maus und Touch.

### 6.1 „Welche Branche zahlt mehr?“ (Estland, Art `zuordnen`)
Vier Stände (IT & Kommunikation, Bau & Handwerk, Gesundheit & Pflege, Bildung & Soziales) und vier
Gehälter (Fakten `ee_lohn_*`). Gehälter **per Ziehen & Ablegen** auf die Stände ziehen – oder erst ein
Gehalt antippen, dann den Stand. Tastatur: ↑↓ Stand, ←→ Gehalt, Enter prüfen. Nach dem Prüfen
erscheint unter jedem Gehalt der **Frauenanteil** (`ee_frauen_*`): „Was fällt dir auf?“

### 6.2 „Gehaltsverhandlung (Übung)“ (Luxemburg, Art `verhandlung`)
Kim spielt Anna, Herr Schmit ihren Chef. Vier Runden („Warum sollten wir über Ihr Gehalt sprechen?“,
„Und an welche Summe haben Sie gedacht?“, „Das Budget ist dieses Jahr leider knapp.“, „Was bringen Sie
im nächsten Jahr ein?“), je vier Antworten mit Punkten und Reaktion. Ein **Überzeugungs-Balken**
(Start 35, Ziel 70). Gute Argumente: eigene Erfolge, recherchierte Zahl, Lösungen statt Drohungen;
schwach: Entschuldigungen, „was Sie für angemessen halten“. Drei Ergebnisstufen, „Noch mal üben“
möglich, Lehre am Ende, gibt die Notiz `verhandlung_tipps`.

### 6.3 Präsentation (Art `praesentation`)
Fünf Karten, eine pro Beweisstück, mit je einem Satz voller Fakten-Platzhalter. „Beweisstück n von 5“.

### 6.4 Argumentationsduell (Art `duell`)
Jede*r Abgeordnete stellt eine Frage passend zur Haltung:
- **Vella:** „Viele Frauen entscheiden sich doch bewusst für Teilzeit … Warum sollte die Politik da
  eingreifen?“
- **Nowicki:** „Die Arbeitgeber sagen: Die Lücke erklärt sich komplett durch Beruf, Branche und
  Arbeitszeit – also ist alles fair. Was antworten Sie?“
- **de Wit:** „Luxemburg hat im Durchschnitt fast keine Lohnlücke. Die Länder schaffen das also allein.
  Warum sollte sich Brüssel einmischen?“
Kim antwortet, indem Kim eine **Notiz aus dem eigenen Notizbuch vorlegt** (Reiter wechseln, Notiz
wählen). Jede Frage hat eine Liste passender Notizen. Richtig beim 1. Versuch = 2 Punkte, beim
2. Versuch = 1 Punkt, sonst 0; drei Versuche, dann ein Tipp und eine freundliche Auflösung. Während der
Frage zeigt ein **Live-3D-Portrait** die fragende Person. Kein Game Over.

### 6.5 Maßnahmen (Art `massnahmen`)
Genau **drei von sechs** wählen, jede mit Kurztext, „Dafür“ und „Dagegen“:
Kita-Ausbau · Mehr Partnermonate · Lohntransparenz (Richtlinie 2023/970) · Soziale Berufe aufwerten ·
Frauenquote für Führungsposten · Keine Eingriffe – freie Entscheidung. „Eine einzig richtige Lösung gibt
es nicht.“ Die Wahl setzt Flags `massnahme_<id>` für den Epilog.

---

## 7. Spielsysteme

- **Dialogsystem** (`js/game/dialogue.js`): Knoten mit `speaker`, `wer` (Figur für das Portrait),
  `emotion` (froehlich, nachdenklich, ueberrascht, skeptisch, neutral), `text`, `next`, `options`
  (`label`, `next`, `setFlag`, `requiresFlag`, `addNote`, `aktion`), `setFlag`, `addNote`, `aktion`,
  `emote`. `einstieg`-Liste wählt den Startknoten nach Flags. **Schreibmaschinen-Effekt** mit
  Sprechlauten pro Silbe. Platzhalter `{fakt:id}`, `{wert:id}`, `{jahr:id}` (auch in Antworten),
  `**fett**`. **3D-Portrait** der sprechenden Figur (Framebuffer → `readPixels` → 2D-Canvas), Kim und
  Gegenüber leicht zueinander gedreht. Bereits gesehene Antworten werden blasser. ✕ oder Esc beendet
  ein Gespräch (außer beim Intro: `abbrechbar: false`). Klick/Tippen auf den Text = weiter; Antworten
  nur per direktem Klick, mit Tastatur erst nach kurzer Pause (damit schnelles Drücken nichts
  überspringt).
- **Dialog-Aktionen:** `beweis:<land>`, `minispiel:<id>`, `emoteKim:<symbol>`, `reise:<karte>,<spawn>`,
  `epilog`, `reflexion`.
- **Emote-Blasen** (gezeichnete SVG-Symbole): Glühbirne, Herz, Schweißtropfen, Fragezeichen, „!“ usw.
  NPCs mit offenem Auftrag zeigen ein schwebendes „!“ (`hinweis`-Bedingung).
- **Flags und Bedingungen:** `"flag"`, `"!flag"`, `"a&b"`, `"a|b"`.
- **Notizbuch (N)** mit sechs Reitern: Teilzeit, Elternzeit, Branchen, Verhandlung & Beförderung,
  Unerklärter Rest, EU-Recht. Rund 40 Notizen (u. a. `teilzeit_quote`, `teilzeit_lohn`, `rechnet_sich`,
  `kita_luecke`, `rente`, `meinung_frei`, `meinung_strukturen`, `se_modell`, `se_vaeter`,
  `elternzeit_lohn`, `elternzeit_geteilt`, `branchen_muster`, `durchschnitt`, `befoerderung`,
  `verhandlung_fair`, `rest_bereinigt`, `rest_bedeutung`, `eu_richtlinie`, `eu_umsetzung`). Jede Notiz
  hat Text (mit Platzhaltern) und Quelle. Auch Meinungen werden notiert – als Meinung gekennzeichnet.
- **Aufgaben (Q):** Hauptquest „Die Lücke“ plus eine Quest pro Viertel mit Schritten und
  `fertigWenn`-Bedingungen. Der **HUD-Hinweis** zeigt immer den ersten offenen Schritt, bevorzugt aus
  dem aktuellen Viertel.
- **Beweisstücke:** fünf (Kita-Warteliste, Elternzeit-Kalender, Gehaltstabelle der Messe,
  Beförderungsliste, Akte „Unerklärter Rest“). **Beweisstück-Leiste** im HUD. Beim Finden jubelt Kim
  und hält das Beweisstück (kleine Akte in Landesfarbe) mit Funkeln hoch, dazu eine Fanfare.
- **HUD:** Ortsname auf Papierplakette mit **Gender Pay Gap des Landes** (`map.fakt` →
  `countries.fakt`), Aufgabenhinweis, Beweisstück-Leiste, drei runde Knöpfe unten rechts (Notizbuch,
  Aufgaben, Pause), schwebende **Ausgangsschilder** („→ Europaplatz“), Blasen über Türen mit dem
  Gebäudenamen („Kita ‚Kleine Wolke‘ – Hineingehen“) und über ansprechbaren Figuren/Objekten.
- **NPC-Tagesabläufe** (`js/game/npc.js`): `gehen` (Wegpunkte), `warten`, `sitzen` (an einer Bank oder
  einem Stuhl mit Sitzpunkt), `giessen`, `schauen`; `routineWenn` (startet erst ab einem Flag),
  `nurWenn` (NPC ist nur dann da, z. B. Laurent während des Finales im Saal). NPCs drehen sich zu Kim,
  wenn Kim sie anspricht.
- **Kartenwechsel** mit Abblende; **Türen** (E oder hineinlaufen; Türen haben `wenn` und `gesperrt`);
  **Ausgänge am Kartenrand** mit Richtung; **Innenräume** mit Wänden und fester Kamera
  (`kamera: { x, z, abstand }` pro Karte); **Aufzug** im Hochhaus.
- **Tor am Europaplatz:** Objekte mit `wenn` (geschlossenes Tor / `tor_offen`), Ausgang nach Norden erst
  bei `alle_beweise`.
- **Speichern** (`GAME.speicher`, Schlüssel `dieLuecke.spielstand`): automatisch in **einem Slot**,
  sobald sich etwas ändert und Ruhe ist, zusätzlich alle 15 s und bei `pagehide`/`visibilitychange`.
  Titel: „Weiterspielen“ (nur wenn Spielstand vorhanden) und „Neues Spiel“ (mit Rückfrage, wenn ein
  Spielstand überschrieben würde).
- **Titelbildschirm** (`GAME.Titelszene`): der Europaplatz als **langsam drehendes Diorama** mit
  laufenden NPCs; das **Logo wird im Canvas gezeichnet**: „Die“ klein, „Lücke“ groß in Handschrift mit
  einer **Lücke zwischen „Lü“ und „cke“**, die mit einem roten Maßpfeil markiert ist, darunter
  „Ein europäischer Fall“ mit roter Unterstreichung, Aquarell-Kleckse dahinter. Menü: Neues Spiel /
  Weiterspielen, Einstellungen, Steuerung, Credits.
- **Verstecktes Admin-Menü** (`GAME.admin` in `js/debug.js`) zum Testen und Vorführen vor der Jury:
  auf der Tastatur **„admin“ tippen** oder im Titelbildschirm **fünfmal schnell aufs Logo tippen**
  (innerhalb von 2,5 s, für das iPad). Funktionen: alles freischalten (Beweisstücke, Notizen,
  Aufgaben-Flags), direkt zum Finale, Epilog ansehen, zu jeder Karte reisen, Spielstand löschen.
  Im Titelbildschirm wird Freigeschaltetes als Spielstand gesichert, damit „Weiterspielen“ es lädt.

---

## 8. Steuerung und Touch (iPad!)

- **Tastatur:** WASD/Pfeiltasten laufen, E/Leertaste sprechen & untersuchen, Enter bestätigen,
  Esc Pause, N Notizbuch, Q Aufgaben. Eingaben werden über **Aktionen** abgefragt
  (`input.gedrueckt("aktion")`), nicht über Tasten; Tastendrücke können „verbraucht“ werden, damit
  zwei Systeme nicht im selben Bild reagieren.
- **Maus und Finger auf dem Spielbild** (`ENG.input.zeigerInit`, Pointer Events):
  - **Kurz tippen/klicken** → Kim läuft per **A*-Wegsuche** (`Welt.weg()`, 8 Richtungen, keine Ecken
    schneiden, Pfad wird geglättet) zum Punkt. Tippen auf eine Figur oder ein Objekt → hinlaufen und
    ansprechen. Tippen im Dialog = weiter.
  - **Ziehen** (ab 14 px) → **virtueller Joystick** (Mitte = Startpunkt, Radius 60 px), mit sichtbarer
    Joystick-Anzeige.
  - Das Canvas hat `touch-action: none`; Viewport `user-scalable=no`.
- **Wichtige iPad-Lektion:** Auf Touch-Geräten löst der erste Fingertipp zuerst ein **emuliertes
  `mouseenter`** aus. Wenn sich dabei Knöpfe ändern (z. B. Markierung durch Neuaufbau per
  `innerHTML`), **verwirft Safari den Klick** – Antworten ließen sich auf dem iPad nicht antippen.
  Lösung (gilt für Dialog-Antworten, alle Menüs und die Verhandlung): Hover-Markierung **nur bei
  `pointerType === "mouse"`** (`pointerenter`), und dabei **nur Klassen umschalten, nie Knöpfe neu
  bauen**. Alle Knöpfe bekommen `touch-action: manipulation` und keine Tap-Hervorhebung.
  **Regel: Niemals auf Hover Knöpfe neu bauen.**
- **Fokus-Schutz:** Nach einem Klick auf einen HUD-Knopf darf die Leertaste nicht den Knopf erneut
  auslösen.
- Das Zuordnen-Spiel funktioniert mit Ziehen & Ablegen **und** mit „antippen → Ziel antippen“.

---

## 9. Barrierefreiheit und Einstellungen

Einstellungen (Pause → Einstellungen oder im Titel), gespeichert unter `dieLuecke.einstellungen`:
- **Grafik:** Hoch / Mittel / Niedrig (Abschnitt 11)
- **Ton** an/aus, **Sprechlaute** an/aus
- **Schriftgröße:** Normal / Groß / Sehr groß
- **Hoher Kontrast** (schwarze Ränder, gelbe Markierung)
- **Bewegung reduzieren** (keine Kameraschwenks, kein Wind, ruhige Kamera; wird aus
  `prefers-reduced-motion` übernommen, wenn noch nichts gespeichert ist)
- Werte ändern mit ← → oder Enter. Hinweis: Die Kantenglättung ändert sich erst nach dem Neuladen.
- **Hochformat:** Bei schmalen Bildschirmen wird das Sichtfeld breiter, damit seitlich gleich viel
  zu sehen ist.

---

## 10. Licht (Engine + Daten)

Alles im Stil gemalter Bilderbuch-Beleuchtung, nicht fotorealistisch:

- **Punktlichter:** bis zu **8 pro Bild**. Die Welt sammelt alle Lichtquellen (aus Prefabs mit
  `licht` und aus Karten mit `lichter`) und gibt jedes Bild die **8 nächsten am Kameraziel** an den
  Renderer (`Welt.lichterSetzen` → `R.lichter`). Im Shader als **gemalte Lichtpfützen in zwei Stufen**
  mit **unruhigem Aquarell-Rand** (Rauschen aus der Papiertextur – multiplikativ, damit außerhalb des
  Radius nichts aufleuchtet), Aufhellung per „Screen“-Mischung (nie grell weiß) plus **warme Lasur**
  in der Lichtfarbe (damit Licht auch auf hellem Boden sichtbar ist). In voller Sonne wirkt
  Lampenlicht schwächer. **Licht radiert die Schraffur weg.**
- **Lichtquellen-Arten:** `"lampe"` (Stärke hängt vom Stimmungswert `lampen` ab: Tag schwach, Abend
  voll, innen kräftig) und `"tag"` (Tageslicht durchs Fenster, unabhängig von `lampen`).
- **Leuchtende Teile** (`leuchten: true` an einem Prefab-Teil, Muster 6): Laternenglas,
  Lampenschirme – ohne Schatten und Schraffur, abends heller und wärmer.
- **Fenster** (automatisch für Teile mit `farbe: "fenster"`, Muster 7): tagsüber ein **diagonaler
  Glanzstrich wie mit Deckweiß**, abends (Stimmungswert `fenster`) **warmes Licht von innen**.
- **Lichthöfe:** weicher gemalter Schein (Billboard) um Lampen (`hof`-Größe am Licht, Deckkraft
  `lichthof` aus der Stimmung).
- **Wolkenschatten:** große weiche Flecken ziehen langsam über die Außenkarten (eigener
  Rauschkanal B der Papiertextur; bei „Bewegung reduzieren“ stehen sie still).
- **Rücklicht:** Flächen, die nach unten oder zur Seite zeigen, fangen **warmen Widerschein vom Boden**
  in ihrer Schattenfarbe.
- **Lampen im Spiel:** Laterne (warm, Radius 4,6, mit Lichthof), **Stehlampe** (neues Prefab, in
  Kita, Familienamt, Hochhaus-Lobby, Personalabteilung und Archiv), **Schreibtischlampe** an jedem
  Schreibtisch, **Fensterlicht** vor jedem Innenfenster (Tageslicht-Pfütze auf dem Boden).
- **Daten:** `DATA.lichtStandard` in `palette.js` mit Standardwerten
  (`lampen`, `lichthof`, `wolken`, `fenster`, `fenster_licht`, `rueckstrahl`, `rueckstrahl_staerke`,
  `schlagschatten`, `sonnen_richtung`, `pollen`, `pollen_farbe`); jede Stimmung darf einzelne Werte
  überschreiben (z. B. Innenräume `lampen: 1.3`, `wolken: 0`, `schlagschatten: 0.6`; Abend
  `lampen: 1`, `fenster: 0.8`). Lichtfarben: `lampe_warm`, `lampe_schirm`, `tageslicht`,
  `fensterglanz`, `rueckstrahl`.
- Prefab-Format: `licht: { pos: [x, y, z], farbe: "lampe_warm", radius: 4, staerke: 1, hof: 1,
  art: "lampe" | "tag" }` (auch als Liste). Karten-Format:
  `lichter: [{ x, y, h, farbe, radius, staerke, art, wenn }]` für Lichter ohne sichtbare Lampe.

---

## 11. Grafik-Pipeline im Detail (Renderer `js/engine/renderer.js`)

### 11.1 Grundaufbau
- Ein großer **Haupt-Shader** für alles Feste, ein **Kontur-Shader** (Inverted Hull), ein Shader für
  **Bodenschatten + Partikel in einem gemeinsamen Draw-Call**, ein **Himmelsverlauf** (Vollbild-Dreieck
  mit inverser View-Projection), Debug-Linien.
- **Eckpunkt-Format (15 Floats):** Position(3), Normale(3), Farbe(3), UV(2), Extra(4) mit
  Extra = [Knochen-Index, Wind-Stärke, Gesicht (0 / 1 Augen / 2 Mund), Muster].
  **Muster:** 0 keins, 1 Gras, 2 Pflaster, 3 Holz, 4 Kopfstein, 5 Wasser, 6 leuchtend, 7 Fenster.
- **Mesh-Builder** (`js/engine/mesh.js`) fasst beliebig viele Grundformen (Kugel, abgerundete Box,
  Zylinder mit `rOben`, Kegel, Kapsel, Torus) zu **einem Mesh** zusammen (wenige Draw-Calls, Teile bei
  65 000 Eckpunkten getrennt, 16-Bit-Indizes). Planare UV-Projektion nach Hauptnormale. Optionen:
  `bodenY`/`bodenAO` für Kontaktschatten am Fuß.
- **Welt** (`js/game/world.js`) baut den Boden in **12×12-Kachel-Blöcken** (Chunks) mit 4×4
  Unterteilung pro Kachel, weichen Höhen (jede Ecke = Mittelwert der Nachbarkacheln), weich
  ineinanderlaufenden Bodenfarben (harte Böden wie Pflaster bleiben scharf), Wänden als zusammengefasste
  lange Stücke (keine Fugen-Konturen), Objekten aus Prefabs, Wasser mit Seegrund, Holzstegen mit
  Pfosten, offenem Meer oder flachem Umland am Kartenrand. Pro Block zwei Meshes: Welt (mit Kontur)
  und Deko (Grasbüschel, Blumen, Kiesel – ohne Kontur, nur bei Mittel/Hoch). Sichtbarkeit per
  Frustum-Test pro Block.
- **Figuren** (`js/game/character.js`): aus Bausteinen zusammengesetzt, **starre Knochen** (bis 12) –
  eine ganze Figur ist **ein Draw-Call**. Animationen: Laufen mit Staubwölkchen, Hüpfen, Jubeln,
  Sitzen, Gießen, Blinzeln, Sprechen (Mund wechselt), Emotionen über einen gezeichneten
  Gesichts-Atlas (Augen- und Mundformen).
- **Texturen** (`js/engine/textures.js`, alle zur Laufzeit gezeichnet): Detailtextur (je ein Muster
  pro Farbkanal: Gras, Pflaster, Holz, Kopfstein), Gesichts-Atlas, weicher Kreis, **Papiertextur**
  (R = feines Papierkorn, G = große Aquarell-Flecken, B = Wolken).

### 11.2 Haupt-Shader (Reihenfolge)
1. Grundfarbe × Muster aus der Detailtextur × Aquarell-Flecken.
2. Wasser: gezeichnete Wellenlinien in Tusche; **Ufer** (UV.x = Ufernähe pro Ecke): flaches Wasser
   heller, **zwei gezeichnete Schaumlinien**, die sanft hin und her laufen.
3. Gesichter aus dem Atlas.
4. Sonne in **zwei Stufen** (+ Kernschatten), **Schlagschatten** aus der Schattenkarte,
   **Wolkenschatten**, Schattenfarbe mit **Rücklicht**.
5. **Punktlichter** (s. o.).
6. **Schraffur** im Schatten (diagonal, in Bildschirmpixeln), **Kreuzschraffur** im Kernschatten,
   reduziert durch Licht und in Gesichtern.
7. **Pigmentrand** (Kanten etwas dunkler), **Lichtkante** (auf der Sonnenseite bleibt am Umriss das
   Papier weiß ausgespart), Wasser-**Himmelsspiegelung** zum flachen Winkel hin und Schaum in
   Papierweiß, **Fenster** (Glanzstrich bzw. warmes Licht), **leuchtende Teile**.
8. Tusche-Mischung (Schraffur/Wellen), **Papierkorn**, **Dunst** in der Ferne.
- Wind: Teile mit `wind` (Baumkronen, Gras) wiegen sich im Vertex-Shader; Wasser hebt und senkt sich.

### 11.3 Schlagschatten (nur „Hoch“)
- **Schattenkarte aus Sonnensicht**: orthografisch, um das Kameraziel herum (Größe aus dem
  Kameraabstand), **2048²** (oder maximal mögliche Größe), Tiefe **in RGBA verpackt** (WebGL 1 ohne
  Erweiterungen), am **Texel-Raster ausgerichtet**, damit beim Laufen nichts flimmert. Rückseiten
  werden in die Karte gezeichnet (weniger Schattenakne), Abtastpunkt leicht entlang der Normale
  versetzt, Bias abhängig vom Winkel.
- Damit die Karte vor dem Bild fertig ist, **sammelt `R.mesh` alle Meshes eines Bildes** und
  **`R.ende` zeichnet erst die Schattenkarte, dann das Bild**. **Schatten werfen alle Meshes mit
  Tusche-Kontur** (`opt.kontur`) – Deko und Wasser nicht.
- Im Shader: 5 Abtastungen (PCF), weicher, aber klar umrissener Rand mit leichtem **Wackeln aus der
  Papiertextur**. **Geworfene Schatten werden schraffiert** wie die Schattenseiten (passt zum Stil).
- Die alten runden Schatten bleiben nur als leichter **Kontaktschatten** unter Figuren; runde
  Schatten von Bäumen entfallen.
- Die Sonne kommt **von links vorn** (`sonnen_richtung: [-0.5, 0.78, 0.45]`), damit Schatten sichtbar
  zur Seite und nach hinten fallen (vorher verschwanden sie hinter den Objekten).
- Das 3D-Portrait im Dialog zeichnet sofort (ohne Sammeln) und ohne Wolkenschatten.

### 11.4 Kontaktschatten (alle Stufen, kostet im Spiel nichts)
- Beim Aufbau der Welt wird für jeden Bodenpunkt der Abstand zu Kollisionsformen (Häuser, Möbel,
  Stämme) und Wänden berechnet (`Welt.verdeckung`): nahe dran wird die Farbe dunkler – **wie Pigment,
  das sich in einer Ecke sammelt**.
- Zusätzlich werden **Wände und Objekte dicht über dem Boden** dunkler (Mesh-Builder-Option
  `bodenY`/`bodenAO`).
- Stärke: `DATA.bildStil.kontaktschatten` (Standard 0,3).

### 11.5 Nachbearbeitung (nur „Hoch“)
Das fertige Bild (mit Kantenglättung) wird per `copyTexSubImage2D` in eine Textur kopiert und in einem
Vollbild-Durchgang überarbeitet:
- **Gezeichnete Linien:** Bild leicht und unregelmäßig verschieben (wie freihand).
- **Pigmentränder:** an Farbkanten sammelt sich dunklere Farbe.
- **Farbabstimmung:** etwas mehr Farbkraft, helle Töne wärmer, dunkle kühler.
- **Lichtschleier:** warmer, weicher Schimmer von der Sonnenseite her.
- **Papierfaser und Körnung.**
- **Ausfransender Papierrand:** zum Bildrand hin läuft die Farbe ins Papier aus (schmal genug, dass
  nichts Wichtiges verdeckt wird).
- Werte in `DATA.bildStil`: `wackeln`, `pigmentrand`, `papierrand`, `papierfaser`, `saettigung`,
  `lichter_ton`, `schatten_ton`, `lichtschleier`, `lichtschleier_farbe`, `kontaktschatten`,
  `lichtkante`.

### 11.6 Leben in der Welt
- **Pollen** draußen und **Staubkörnchen** drinnen schweben langsam im Licht (Stimmungswert `pollen`).
- **Fallende Blätter** aus Baumkronen in der Nähe (Prefab `blaetter: { hoehe, farben }`).
- **Brunnen** spritzen (Prefab `spritzer`), Laufstaub unter den Füßen, Funkeln beim Beweisstück.
- Alle Partikel laufen über ein gemeinsames System (max. 400) und werden mit den Bodenschatten in
  einem Draw-Call gezeichnet; bei „Niedrig“ oder „Bewegung reduzieren“ entfallen sie.

### 11.7 Grafikstufen
| Stufe | Inhalt |
|---|---|
| **Hoch** | alles: Schlagschatten, Nachbearbeitung, Licht, Wolken, Deko, Partikel, Kantenglättung |
| **Mittel** | wie bisheriger Look: Licht, Wolken, Deko, Partikel, runde Schatten – ohne Schlagschatten und Nachbearbeitung |
| **Niedrig** | Renderskala 0,75, ohne Lampenlicht, Wolken, Deko, Wind und Partikel |

Läuft das Spiel länger als einige Sekunden unter 28 FPS, schaltet es **automatisch eine Stufe tiefer**
(Hoch → Mittel → Niedrig) und blendet einen Hinweis ein. Pixeldichte höchstens 2.

---

## 12. Audio (`js/engine/audio.js`, nur Web Audio, keine Dateien)
Startet erst nach der ersten Taste oder Berührung. **Sprechlaute** je Figur (Silben mit eigener
Tonhöhe aus `stimme.tonhoehe`), Klick, Notiz (zwei helle Töne), Fanfare beim Beweisstück, Tür,
richtig/falsch. Ton und Sprechlaute getrennt abschaltbar.

---

## 13. Karten (`data/maps.js`, erzeugt mit einem Python-Skript, von Hand bearbeitbar)

Jede Karte ist ein **Zeichenraster** (`boden`, ein Zeichen = eine Kachel, Bedeutung in `legende`), dazu
optional `hoehe` (Ziffern 0–9 je Kachel, Nachbarn höchstens 1 Unterschied), `kollision` (`X`
gesperrt, `o` frei), `objekte` (`{ p: "prefab", x, y, rot, id, dialog, text, tuer, aufzug, wenn }`),
`spawns`, `uebergaenge` (Kartenrand-Ausgänge mit `ziel`, `spawn`, `richtung`, `wenn`), `stimmung`,
`land`, `fakt`, `innen`, `kamera`, `aussen` (Umland: gras/wasser/leer), `lichter`.
**Bodenarten:** gras, weg, pflaster, kopfstein, sand, wasser, steg, bruecke, holzboden, teppichboden,
saalteppich, wand, wand_niedrig.

| Karte | Größe | Inhalt |
|---|---|---|
| `europaplatz` | 36×30 | Hub, Brunnen, Tor, 8 Laternen, Flaggen, Wimpel |
| `de` | 34×26 | Kita, Büro, Altbauten, Fachwerk, Litfaßsäule |
| `de_kita_innen`, `de_buero_innen` | 12×9 | Innenräume |
| `se` | 34×26 | Familienamt, See mit Steg, Dalapferd, Mittsommerstange |
| `se_amt_innen` | 12×9 | Familienamt innen |
| `ee` | 34×26 | Berufsmesse, Stadtturm, Windmühle |
| `lu` | 34×28 | Brücke, Café, Hochhaus, Festung, goldene Säule |
| `lu_etage_1..3` | 12×9 | Hochhaus mit Aufzug |
| `bxl` | 32×20 | Archiv, Parlament, Jugendstil, Comicwand, Skulptur |
| `bxl_archiv` | 14×10 | Fächer A/B/C, Frau Peeters |
| `bxl_saal` | 16×11 | Sitzungssaal |
| `testinsel` | 36×30 | nur zum Testen (`?debug=1&karte=testinsel`) |

**Gestaltungsregeln aus Erfahrung:**
- **Türen müssen nach Süden (zur Kamera) zeigen**, sonst sieht man sie nicht. Gebäude deshalb nördlich
  von Wegen platzieren.
- Wege dunkler als Gras und mit Kieseln, damit man sie erkennt.
- Jedes Land erkennbar an **Flaggen, Wimpelketten und Wahrzeichen**.
- Nach jeder Kartenänderung im Debug-Modus prüfen: Die automatische Prüfung testet, ob alle Startpunkte,
  Ausgänge, NPCs und Objekte erreichbar **und** ansprechbar sind.

**Prefabs** (`data/prefabs.js`, ~100 Stück): Jedes Prefab besteht aus `teile` (Grundformen mit `pos`,
`rot`, Maßen, `farbe`, optional `textur`, `wind`, `leuchten`) und optional `kollision` (`kreis`, `box`
oder `boxen`), `schatten`, `tuer` (Lage der Tür), `sitz`/`sitzHoehe`, `hoehe` (für die Sprechblase),
`spritzer`, `licht`, `blaetter`. Beispiele: Bäume (rund, Birke, Kiefer), Laterne, Stehlampe, Bank,
Brunnen, Häuser jedes Landes, Messestände, Aufzug, Archivregale, Aktenfächer, Abgeordnetenpult,
Rednerpult, alle Flaggen und Wimpel, Wahrzeichen.

---

## 14. Figuren (`data/characters.js`)

Baukasten: `haut` (haut_1 … haut_6), `kopf` (rund/oval/breit), `koerper` (schmal/mittel/kraeftig),
`alter` (kind/jung/erwachsen/alt – Kinder kleiner), `haare` { stil: kurz, mittellang, bob, lang, zopf,
dutt, locken, afro, glatze, kopftuch; farbe }, `oberteil` { typ: hoodie, pullover, tshirt, hemd,
blazer, strickjacke, kleid; farbe; innen }, `unterteil` { typ: hose, rock, shorts, latzhose },
`schuhe`, `extras` (umhaengetasche, brille, gehstock, rollstuhl, muetze, schal, ohrringe, bart,
kinderwagen), `stimme` { tonhoehe }. Gesichtsausdrücke in `DATA.gesichter` (Augen, Mund, zwei
Sprech-Münder).

**Kim:** haut_3, runder Kopf, mittellanges kastanienbraunes Haar, salbeigrüner Hoodie, cremefarbene
Latzhose, terrakotta Schuhe, senfgelbe Umhängetasche.
Weitere Figuren (mit eigener Kleidung und Stimme): Laurent, Anna, Jonas, Sanne, Dimitriou, Emil;
Lea, Tobias, Brandt, Jana, Yılmaz, Mia, Ben, Okafor; Lindqvist, Lars, Nora, Birgit, Erik, Alva; Kadri,
Mart, Liis, Kertu, Priit, Anu; Hoffmann, Marc, Paul, Chloé, Tom, Schmit; Janssens, Lotte, Samir,
Peeters; Vella, Nowicki, de Wit; Epilog-Varianten (Anna/Jonas zehn Jahre älter, Lina, Anu als
Pflegerin) und weitere Passant*innen.

NPC-Einträge (`data/npcs.js`): `figur`, `karte`, `start`, `blick`, `dialog`, `hinweis`, `nurWenn`,
`routineWenn`, `routine`.

---

## 15. Fakten (`data/facts.js`) – alles Schätzwerte, alle `verifiziert: false`

Jeder Eintrag: `{ wert, einheit, jahr, verifiziert: false, beschreibung, quelle }` plus
`// TODO: verifizieren – Quelle: …`. Im Debug-Modus erscheinen ungeprüfte Werte im Dialog rot, und die
Konsole listet sie auf. Die folgenden Werte sind **Platzhalter**, die vor der Abgabe mit der Quelle
abgeglichen werden müssen (Tabelle wie in `QUELLEN.md`):

| Feld | Platzhalter | Vorgeschlagene Quelle |
|---|---|---|
| `gpg_eu` | 12,0 % (2023) | Eurostat `sdg_05_20` (unbereinigt) |
| `gpg_de` | 17,6 % (2023) | Eurostat `sdg_05_20`; Vergleich Destatis |
| `gpg_se` | 11,2 % (2023) | Eurostat `sdg_05_20` |
| `gpg_ee` | 17,7 % (2023) | Eurostat `sdg_05_20` |
| `gpg_lu` | −0,7 % (2023) | Eurostat `sdg_05_20` |
| `gpg_be` | 0,7 % (2023) | Eurostat `sdg_05_20` |
| `gpg_de_bereinigt` | 6 % (2023) | Destatis, Pressemitteilung Gender Pay Gap |
| `de_gpg_unbereinigt_destatis` | 18 % (2023) | Destatis (gleiches Jahr wie bereinigt) |
| `de_gpg_erklaert_anteil` | 64 % (2023) | Destatis (erklärter Anteil) |
| `de_teilzeit_frauen` / `_maenner` | 50 % / 13 % (2023) | Destatis Mikrozensus bzw. Eurostat `lfsa_eppgan` |
| `de_teilzeit_grund_betreuung` | 28 % (2023) | Eurostat `lfsa_epgar` |
| `de_kita_fehlende_plaetze` | 300.000 (2023) | IW Köln bzw. Bertelsmann Stiftung |
| `de_gender_pension_gap` | 27 % (2023) | Destatis |
| `de_frauen_fuehrung` | 29 % (2023) | Destatis |
| `se_elterngeld_tage` | 480 Tage (2024) | Försäkringskassan |
| `se_reservierte_tage` | 90 Tage (2024) | Försäkringskassan |
| `se_vaeter_anteil_tage` | 30 % (2023) | Försäkringskassan |
| `de_partnermonate` | 2 Monate (2024) | BMFSFJ / BEEG |
| `de_vaeter_elterngeld_anteil` | 46 % (2022) | Destatis Elterngeldstatistik |
| `de_vaeter_bezugsdauer` / `de_muetter_bezugsdauer` | 3,6 / 14,6 Monate (2022) | Destatis |
| `ee_lohn_it` / `_bau` / `_pflege` / `_bildung` | 3.300 / 1.900 / 1.800 / 1.600 € (2023) | Statistikaamet |
| `ee_frauen_it` / `_bau` / `_pflege` / `_bildung` | 30 / 12 / 85 / 80 % (2023) | Eurostat `lfsa_egan2` |
| `lu_frauen_fuehrung` / `eu_frauen_fuehrung` | 22 % / 35 % (2023) | Eurostat `lfsa_egais` bzw. EIGE |
| `eu_richtlinie_jahr` / `eu_richtlinie_frist` | 2023 / 7. Juni 2026 | EUR-Lex, Richtlinie (EU) 2023/970 |

Hinweise: überall dasselbe, neueste Jahr verwenden; unbereinigt (Eurostat) und bereinigt (nationale
Ämter) nicht verwechseln; die drei Archiv-Werte aus **derselben** Destatis-Veröffentlichung; die vier
estnischen Gehälter müssen sich unterscheiden (sonst ist das Zuordnen nicht eindeutig); Luxemburg
besonders sorgfältig prüfen.

---

## 16. Dateistruktur und Ladereihenfolge

```
index.html          Canvas + UI-Schichten (HUD, Knöpfe, Joystick, Blasen, Dialog, Buch,
                    Minispiel, Menü, Blende, Debug, Fehler, noscript) und alle Skripte
css/style.css       Skizzenbuch-Oberfläche, Schriftgrößen, Kontrast, Touch-Regeln
data/palette.js     Farben, Farbstimmungen, DATA.lichtStandard, DATA.bildStil
data/facts.js       alle Zahlen + Notizbuch-Einträge (DATA.notes)
data/countries.js   Länder, Ursachen, Beweisstücke
data/characters.js  Figuren-Baukasten, Gesichtsausdrücke
data/prefabs.js     Bausteine der Welt
data/maps.js        Karten und Bodenarten
data/npcs.js        NPCs und Tagesabläufe
data/dialogues.js   DATA.texte (alle Menütexte), DATA.dialogues, DATA.minispiele, DATA.epilog
data/quests.js      Aufgaben
js/engine/          math, gl, textures, mesh, renderer (+ Partikel), camera, collision,
                    input, audio, loop
js/game/            character, world, npc, player, quests (+ speicher), dialogue,
                    notebook, minigames, ui (+ einstellungen), scenes
js/debug.js         Debug-Modus und verstecktes Admin-Menü
js/main.js          Start und Game-Loop
README.md           Anleitung zum Spielen und Selbst-Ändern (für Laien)
QUELLEN.md          Fakten-Tabelle zum Prüfen
SPIELBESCHREIBUNG.md  Gliederung für die Jury (Stichpunkte)
KI-DOKUMENTATION.md   Vorlage: eigene Leistung, KI-Einsatz, selbst geprüft
CLAUDE.md           Projekt-Notiz für die KI (Stand, Regeln, Lektionen)
```
Reihenfolge der Skripte: erst alle `data/`-Dateien, dann Engine (math → gl → textures → mesh →
renderer → camera → collision → input → audio → loop), dann Spiel, dann `debug.js`, zuletzt `main.js`.
Zusätzliche Dateien neben dem ursprünglichen Konzept (genehmigt): `js/main.js`, `js/debug.js`.

---

## 17. Die fünf Phasen (so ist das Spiel entstanden)

1. **Phase 1 – Engine und Stil:** WebGL-Engine, Grundformen, Test-Insel, Figuren-Baukasten, Kamera,
   Kollision. Danach Umbau auf „Tusche & Aquarell“, weil es zu sehr nach Animal Crossing aussah;
   Kamera wieder frontal von Süden mit 46°.
2. **Phase 2 – Kern:** NPCs mit Tagesabläufen, Dialogsystem mit Portrait, Flags/Quests/Notizen,
   Kartenwechsel, Türen, Innenräume, Europaplatz mit automatischem Intro, Deutschland-Viertel mit Kita
   und Büro, Debug-Prüfungen.
3. **Phase 3 – Viertel:** Schweden, Estland, Luxemburg (mit Hochhaus und Aufzug), Notizbuch und
   Aufgabenliste, Beweisstück-Leiste, Minispiele Zuordnen und Verhandlung.
4. **Phase 4 – Finale:** Tor, Brüssel, Archiv, Sitzungssaal, Präsentation/Duell/Maßnahmen, Epilog,
   Reflexion, Credits, Titelbildschirm mit Diorama und gezeichnetem Logo, automatisches Speichern.
5. **Feedback-Runde + Phase 5 – Feinschliff:** Klick-/Tippsteuerung mit Wegsuche, Ziehen als Joystick,
   runde HUD-Knöpfe, Ziehen & Ablegen, stärkerer Lohnbezug, GPG im HUD, Flaggen/Wimpel/Wahrzeichen,
   neues Familienamt, sichtbarere Wege, Ausgangsschilder, verstecktes Admin-Menü, Audio, Einstellungen
   (Schrift, Kontrast, Bewegung), automatische Qualitätsabsenkung, Hochformat, mehrfaches Speichern.

**Danach – großer Grafik-Ausbau:**
- **Licht:** Punktlichter, leuchtende Lampen, Fenster, Lichthöfe, Wolkenschatten, Rücklicht,
  Stehlampe, Schreibtischlampe.
- **Grafik-Ausbau 1:** Schlagschatten per Schattenkarte, Nachbearbeitung im Papier-Stil, Sonne von
  links vorn, Pollen/Staub, Grafikstufe „Mittel“, stufenweise Auto-Absenkung.
- **Grafik-Ausbau 2:** Kontaktschatten, Lichtkante, Wasser mit Uferschaum, Spiegelung und nassem
  Sand, Lichtschleier, fallende Blätter, weichere Schattenkanten, schwächere Schatten in Innenräumen.
- **iPad-Korrektur:** Antworten, Menüs und Verhandlung lassen sich per Tippen wählen (Hover nur mit
  Maus, Knöpfe nie auf Hover neu bauen).

---

## 18. Testen und Veröffentlichen

- **Lokal:** im Projektordner `python3 -m http.server 8765`, dann
  `http://localhost:8765/index.html?debug=1` (Titel) oder `…&karte=bxl_saal` (direkt).
  Der eigentliche Zielweg bleibt der **Doppelklick** auf `index.html` (`file://`).
- **Automatisch testen** mit Playwright/Chromium (Software-WebGL): Screenshots aller Karten, Konsole
  auf Fehler prüfen, Grafikstufen über `localStorage` setzen, **Touch-Test** mit `hasTouch`/`isMobile`
  (Antwort im Intro antippen → das Gespräch muss weitergehen; Titel → Einstellungen → Grafik
  umschalten per Tippen).
- **Debug-Konsole muss melden:** „Dialog-Prüfung: alle next-Referenzen gültig, alle Knoten erreichbar ✓“
  und „Karten-Prüfung: alle Startpunkte, Ausgänge, NPCs und Objekte erreichbar ✓“.
- **Veröffentlichen:** Das Repository liegt auf GitHub; **GitHub Pages baut die Web-App aus `main`**.
  Änderungen kommen erst nach dem Merge in `main` auf der Seite an. Auf dem iPad danach den Tab
  schließen und neu öffnen (Safari speichert alte Dateien zwischen).
- **Noch offen:** Test auf echtem iPad und Windows-Schul-Laptop (Leistung bei „Hoch“), **alle Zahlen
  verifizieren**, **Credits-Namen eintragen**, `KI-DOKUMENTATION.md` ausfüllen, `SPIELBESCHREIBUNG.md`
  ausformulieren.

---

## 19. Was du am Ende jeder Arbeitsrunde lieferst

- Lauffähigen Stand ohne Konsolenfehler, Karten- und Dialogprüfung grün.
- Kurze deutsche Zusammenfassung: was neu ist, wo man es selbst anpassen kann (Datei + Feldname),
  was getestet wurde und was nicht.
- `README.md`, `QUELLEN.md` und `CLAUDE.md` (Abschnitt „Stand“) aktualisieren.
- Dann auf mein OK warten.
