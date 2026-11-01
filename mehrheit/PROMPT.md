# Prompt: „Mehrheit – Ein Gesetz gegen die Lohnlücke“

*Konzept- und Bauanleitung für ein Lernspiel zum Gender Pay Gap · Beitrag zum Schülerwettbewerb „Europäischer Wettbewerb“ · Stand: 31. Oktober 2026*

Alles ab hier ist der Prompt. Er beschreibt ein **komplett neues Spiel**. Es ersetzt nichts und übernimmt nichts: Die Spiele „Die Lücke“ (Hauptordner) und „Funkloch“ (Ordner `funkloch/`) bleiben unverändert liegen. Aus ihrem Code, ihren Daten, ihren Figuren, ihrem Grafikstil und ihren Texten wird **nichts** übernommen – nicht einmal einzelne Hilfsfunktionen. Das neue Spiel entsteht im Ordner `mehrheit/`. Gemeinsam ist nur das Thema: der Gender Pay Gap in Europa.

---

## 0. Deine Rolle und wie du arbeitest

Du bist erfahrene*r Spieleentwickler*in, Interaktionsdesigner*in, Informationsgrafiker*in und Autor*in für politische Bildung. Du baust mit mir (Schüler*in der Oberstufe) ein Lernspiel für den Schülerwettbewerb „Europäischer Wettbewerb“. Eine Jury aus Lehrkräften bewertet es. Sie achtet auf drei Dinge: inhaltliche Richtigkeit, einen echten europäischen Bezug und darauf, ob das Spiel etwas zeigt, das ein Referat nicht zeigen könnte. Das Spiel soll sich anfühlen wie eine spannende Nacht im Parlament – nicht wie ein Arbeitsblatt und nicht wie ein bekanntes Spiel.

**Sprache:** Das Spiel, alle Antworten an mich, alle Code-Bezeichner und alle Kommentare sind auf Deutsch. Englische Fachbegriffe nur dort, wo sie wirklich üblich sind („Gender Pay Gap“, „Trilog“ ist ohnehin deutsch). Wenn du einen Fachbegriff benutzt, erklärst du ihn im Spiel beim ersten Auftreten in einem Satz.

**Arbeitsweise (zwingend):**

1. Du arbeitest in **fünf Phasen** (Abschnitt 12). Nach jeder Phase lieferst du einen lauffähigen Stand ohne Konsolenfehler, eine kurze deutsche Zusammenfassung und wartest dann auf mein OK. Ohne OK beginnst du die nächste Phase nicht.
2. Du baust nichts, was nicht in diesem Konzept steht, ohne vorher zu fragen. Wenn dir eine Idee kommt, schreibst du sie in die Zusammenfassung unter „Vorschläge“ – du baust sie nicht einfach.
3. Du erfindest **niemals** echte Statistiken, Daten, Paragrafen oder Zitate echter Personen. Alle Regeln dazu stehen in Abschnitt 2.
4. Alle Texte, alle Zahlen, alle Farben, alle Abstände und alle Spielwerte liegen in `mehrheit/data/`, gut kommentiert und so aufgebaut, dass ich sie ohne Programmierkenntnisse ändern kann.
5. Du testest nach jeder größeren Änderung im Browser (automatisiert mit Playwright/Chromium per `file://` und über einen lokalen Server). Du sagst ehrlich, was du nicht testen konntest – zum Beispiel ein echtes iPad, Safari, Firefox oder einen echten Windows-Schul-Laptop.
6. Wenn etwas im Konzept unklar ist oder sich widerspricht, fragst du nach, statt zu raten. Vor Phase 2 stellst du mir die Fragen aus Abschnitt 12.5.
7. Du arbeitest auf dem Git-Branch, den ich dir nenne, committest mit klaren deutschen Commit-Nachrichten und pushst am Ende jeder Phase.

---

## 1. Das Spiel in einem Satz und das Ziel

**„Mehrheit“** ist ein ruhiges Entscheidungs- und Verhandlungsspiel. Man schreibt ein europäisches Gesetz gegen die Lohnlücke zwischen Frauen und Männern – und muss dafür eine Mehrheit finden.

Man spielt **eine neu gewählte abgeordnete Person im Europäischen Parlament**, die zum ersten Mal „Berichterstatter*in“ ist, also die Person, die für das Parlament einen Gesetzesvorschlag bearbeitet. Die Spielfigur hat einen frei wählbaren Vornamen (Vorschlag: „Sam“). **Für die Spielfigur werden nie Pronomen benutzt** – weder im Text noch in Kommentaren im Code. Alle anderen Figuren sprechen die Spielfigur mit Vornamen an und siezen sie (es ist ein Parlament), außer der eigenen Mitarbeiterin, die duzt.

**Zielgruppe:** 16–20 Jahre. **Spielzeit:** 15–25 Minuten für einen Durchgang. **Kein Game Over.** Das Gesetz kann im Plenum scheitern – dann gibt es trotzdem einen Epilog, eine Erklärung, warum es gescheitert ist, und die Möglichkeit eines „Neuen Anlaufs“, der nur noch die letzten Schritte wiederholt (ca. 5 Minuten).

**Die Kernidee:** In den meisten Lernspielen zum Gender Pay Gap sammelt man Fakten und erfährt, wie ungerecht etwas ist. Hier dreht sich die Perspektive: Man weiß schon, dass es eine Lücke gibt. Die spannende Frage ist: **Was kann ein Gesetz eigentlich dagegen tun – und was nicht?** Und: **Wie bekommt man in einem Parlament mit sehr unterschiedlichen Meinungen überhaupt eine Mehrheit?** Dabei lernt man nebenbei, wie die EU Gesetze macht (Kommission, Parlament, Rat, Trilog), was Lohntransparenz bedeutet und warum ein Gesetz nur einen Teil der Lohnlücke erreichen kann.

**Der Aha-Moment am Ende:** Nach dem Spiel sieht man die eigene Fassung des Gesetzes **neben der echten Richtlinie (EU) 2023/970 zur Lohntransparenz** – Artikel für Artikel. Man erkennt, wo man ähnlich entschieden hat wie das echte Parlament, wo man mutiger oder vorsichtiger war und warum die echten Abgeordneten so entschieden haben. Dieser Vergleich ist das Herzstück für die Jury.

### 1.1 Lernziele (für die Jury, steht auch in der README)

Nach dem Spiel können die Spielenden …

1. erklären, dass der Gender Pay Gap den Unterschied der **durchschnittlichen Bruttostundenlöhne** von Frauen und Männern misst;
2. den **unbereinigten** und den **bereinigten** Gender Pay Gap unterscheiden und sagen, warum ein „unerklärter Rest“ nicht automatisch Diskriminierung bedeutet, aber auch nicht automatisch keine;
3. mindestens drei Ursachen der Lohnlücke nennen (z. B. Teilzeit, Berufswahl/Branchen, Elternzeit und Karrierebrüche, unterschiedliche Bewertung von Arbeit, fehlende Transparenz bei Gehältern);
4. erklären, welche dieser Ursachen ein **Transparenzgesetz** erreichen kann und welche andere Werkzeuge brauchen (Kitas, Elternzeitregeln, Tarifverträge, nationale Politik);
5. das **ordentliche Gesetzgebungsverfahren** der EU in groben Schritten beschreiben (Vorschlag der Kommission → Parlament und Rat → Trilog → Abstimmung → Umsetzung in nationales Recht);
6. Argumente unterschiedlicher politischer Richtungen fair wiedergeben, ohne sie lächerlich zu machen;
7. eine eigene begründete Meinung formulieren, welche Maßnahmen sie selbst für sinnvoll halten.

### 1.2 Was das Spiel ausdrücklich NICHT ist

- Kein Quiz mit richtigen und falschen Antworten. Es gibt bessere und schlechtere Begründungen, aber keine „richtige“ Gesetzesfassung.
- Keine Parteiwerbung. Alle Fraktionen sind erfunden und haben nachvollziehbare, respektvoll dargestellte Gründe. Keine Fraktion ist „die Bösen“.
- Kein Wirtschaftssimulator mit erfundenen Prognosezahlen. Wirkungen werden qualitativ gezeigt und deutlich als vereinfachtes Spielmodell gekennzeichnet.
- Keine Nachbildung eines bestehenden Spiels – weder im Aussehen noch in der Bedienung.

---

## 2. Fachlicher Hintergrund und Fakten-Regeln

### 2.1 Fakten-Regeln (sehr wichtig, gilt für alles)

- **Alle Zahlen und alle Fakten über die echte Welt** stehen ausschließlich in `data/fakten.js`. Jeder Eintrag hat die Felder `wert`, `einheit`, `jahr`, `text` (kurze Beschreibung), `quelle`, `link_hinweis` (wo man es nachschlägt, als Text, kein echter Link nötig) und `verifiziert: false`. Über jedem Eintrag steht der Kommentar `// TODO: verifizieren – Quelle: …`.
- Texte im Spiel enthalten **nie direkt eine Zahl**, sondern Platzhalter: `{fakt:gpg_eu}` setzt „Wert + Einheit“ ein, `{jahr:gpg_eu}` das Jahr, `{quelle:gpg_eu}` die Quelle. Ausnahmen sind nur Ziffern, die keine Fakten sind und im Code selbst entstehen (z. B. Sitzzähler, Seitenzahlen, Tastaturkürzel) – die stehen dann aber auch nicht in den Texten in `data/`.
- **Spielwerte sind keine Fakten.** Das Spiel hat auch Zahlen, die zur Spielmechanik gehören: Schwellenwerte, die die Spielfigur in ihr Gesetz schreiben kann („Berichtspflicht ab 50 Beschäftigten“), die Sitzzahl der erfundenen Fraktionen, die Zahl der Termine. Diese stehen in `data/spielwerte.js`, werden in Texten mit `{wert:id}` eingesetzt und sind dort als „Spielwert, frei gewählt“ kommentiert. Wo ein Spielwert zufällig einem echten Wert entspricht (z. B. eine Schwelle, die so auch in der echten Richtlinie steht), wird das im Vergleich am Ende über `{fakt:…}` gezeigt, nicht über den Spielwert.
- Jede Zahl und jeder Fakt kommt zusätzlich in `QUELLEN.md` in eine Tabelle: Feld, Schätzwert, vorgeschlagene Quelle, „verifiziert: nein“.
- **Im Debug-Modus** werden ungeprüfte Fakten im Spiel rot unterstrichen, und die Konsole listet sie auf. Die Reflexionsseite am Ende listet alle Quellen automatisch aus `data/fakten.js`.
- **Erfundenes wird gekennzeichnet.** Alle Figuren, Fraktionen, Firmen und Geschichten sind erfunden; das steht im Spiel auf der Titelseite („Alle Personen und Fraktionen sind erfunden. Die Richtlinie und die Zahlen sind echt – Quellen am Ende.“) und in den Credits. Wirkungsanzeigen tragen immer den Hinweis „vereinfachtes Spielmodell, keine Prognose“.
- **Echte Personen** (echte Abgeordnete, Kommissar*innen, Minister*innen) kommen im Spiel nicht vor und werden auch im Vergleich am Ende nicht namentlich zitiert. Echte Institutionen (Europäisches Parlament, Rat der EU, Europäische Kommission, Eurostat, Destatis) dürfen genannt werden. Ihre echten Logos werden nicht nachgebaut.

### 2.2 Was das Spiel inhaltlich richtig darstellen muss

**Was der Gender Pay Gap misst.** Der (unbereinigte) Gender Pay Gap vergleicht die durchschnittlichen **Bruttostundenlöhne** von Frauen und Männern und gibt den Unterschied in Prozent des Männerlohns an. Er vergleicht also nicht Monatsgehälter und nicht Jahreseinkommen. Teilzeit wirkt deshalb nicht direkt über „weniger Stunden“, sondern darüber, dass Teilzeitstellen oft schlechter bezahlte Stundenlöhne, seltenere Beförderungen und flachere Gehaltsentwicklung haben. Das muss mindestens einmal klar im Spiel stehen (in der Anhörung, Abschnitt 4.2).

**Unbereinigt und bereinigt.** Der bereinigte Gender Pay Gap rechnet heraus, was sich durch messbare Unterschiede erklären lässt (Beruf, Branche, Arbeitszeit, Berufserfahrung, Führungsposition usw.). Der Rest heißt „unerklärter Teil“. Er ist ein Hinweis auf mögliche Diskriminierung, aber kein Beweis – er kann auch von Dingen kommen, die nicht gemessen wurden. Umgekehrt kann auch der „erklärte“ Teil ungerecht sein, wenn zum Beispiel Berufe mit vielen Frauen grundsätzlich schlechter bezahlt werden. Diese doppelte Vorsicht ist ein Lernziel und kommt im Spiel mindestens zweimal vor.

**Was ein Transparenzgesetz kann.** Ein Gesetz über Lohntransparenz zielt vor allem auf (a) ungleiche Bezahlung für gleiche oder gleichwertige Arbeit im selben Betrieb, (b) fehlendes Wissen der Beschäftigten über Gehälter, (c) die Bewertung von Arbeit (was ist „gleichwertig“?), (d) die Durchsetzung von Rechten (Beweislast, Entschädigung). Es erreicht **nicht direkt** Ursachen wie fehlende Kitaplätze, Elternzeitverteilung oder Berufswahl. Das Spiel zeigt das ehrlich über den „Juristischen Dienst“ (Abschnitt 3.3), der Vorschläge außerhalb der Zuständigkeit oder außerhalb des Themas markiert.

**Zuständigkeit der EU.** Die EU darf nur dort Gesetze machen, wo die Verträge es erlauben. Für gleiches Entgelt gibt es eine eigene Rechtsgrundlage im Vertrag über die Arbeitsweise der EU (Artikel 157 AEUV – als Fakt eintragen und prüfen). Für viele andere Themen (z. B. wie Kitas organisiert werden) sind vor allem die Mitgliedstaaten zuständig. „Subsidiarität“ wird im Spiel in einem Satz erklärt: Die EU soll nur handeln, wenn ein Ziel auf europäischer Ebene besser erreicht werden kann als von den Ländern allein.

**Richtlinie vs. Verordnung.** Eine Richtlinie muss von jedem Mitgliedstaat in eigenes Recht übertragen werden („Umsetzung“), meist mit einer Frist. Das Spiel erklärt das im Trilog (Streit um die Umsetzungsfrist) und im Epilog.

**Das Verfahren (vereinfacht, aber korrekt).** Die Kommission schlägt vor. Das Parlament bildet eine Position (im Ausschuss vorbereitet, im Plenum beschlossen). Der Rat (die Regierungen der Mitgliedstaaten) bildet eine eigene Position. In informellen Verhandlungen zu dritt („Trilog“) wird ein Kompromiss gesucht. Parlament und Rat müssen diesem Kompromiss zustimmen. Das Spiel vereinfacht: Es gibt eine Ausschussabstimmung, einen Trilog und eine Schlussabstimmung im Plenum. Am Ende erklärt eine Seite „So ist es wirklich“, was vereinfacht wurde (Lesungen, Ratsabstimmung mit qualifizierter Mehrheit, Rolle der Fraktionen usw.).

### 2.3 Fakten, die das Spiel braucht (alle vor der Abgabe prüfen!)

Die folgenden Werte sind **nach meinem bisherigen Kenntnisstand** eingetragen und müssen mit der Quelle abgeglichen werden. Du trägst sie mit `verifiziert: false` in `data/fakten.js` und in `QUELLEN.md` ein. Wenn du dir bei einem Wert unsicher bist, trägst du ihn trotzdem als Schätzwert ein und schreibst „unsicher“ in den Kommentar – du lässt ihn nicht einfach weg.

| id | Inhalt | Schätzwert | Vorgeschlagene Quelle |
|---|---|---|---|
| `gpg_eu` | Unbereinigter Gender Pay Gap EU | 12,0 % (2023) | Eurostat, Tabelle `sdg_05_20` |
| `gpg_de` | Unbereinigter Gender Pay Gap Deutschland (EU-Methode) | 17,6 % (2023) | Eurostat `sdg_05_20` |
| `gpg_de_destatis` | Unbereinigter Gender Pay Gap Deutschland (Destatis) | 16 % (2024) | Destatis, Pressemitteilung |
| `gpg_de_bereinigt` | Bereinigter Gender Pay Gap Deutschland | 6 % (2024) | Destatis, Pressemitteilung |
| `gpg_land_min` / `gpg_land_max` | Land mit dem niedrigsten und höchsten Wert in der EU (Name + Wert) | nachschlagen | Eurostat `sdg_05_20` |
| `rl_nummer` | Richtlinie (EU) 2023/970 zur Stärkung der Anwendung des Grundsatzes des gleichen Entgelts durch Entgelttransparenz | – | EUR-Lex |
| `rl_datum` | Datum der Annahme | 10. Mai 2023 | EUR-Lex |
| `rl_frist` | Umsetzungsfrist für die Mitgliedstaaten | 7. Juni 2026 | EUR-Lex, Art. 34 der Richtlinie |
| `rl_vorschlag` | Vorschlag der Kommission | März 2021 | EUR-Lex, COM(2021) 93 |
| `rl_bericht_250` | Berichtspflicht für Arbeitgeber ab 250 Beschäftigten: jährlich | ab 2027 (für 2026) | Richtlinie, Art. 9 |
| `rl_bericht_150` | Arbeitgeber mit 150–249 Beschäftigten: alle drei Jahre | ab 2027 | Richtlinie, Art. 9 |
| `rl_bericht_100` | Arbeitgeber mit 100–149 Beschäftigten: alle drei Jahre | ab 2031 | Richtlinie, Art. 9 |
| `rl_schwelle_bewertung` | Gemeinsame Entgeltbewertung, wenn ein nicht begründeter Unterschied von mindestens … besteht und nicht innerhalb von sechs Monaten behoben wird | 5 % | Richtlinie, Art. 10 |
| `rl_stellenanzeige` | Information über Einstiegsgehalt bzw. Spanne vor dem Vorstellungsgespräch | – | Richtlinie, Art. 5 |
| `rl_vorgehalt` | Verbot, nach dem bisherigen Gehalt zu fragen | – | Richtlinie, Art. 5 |
| `rl_auskunft` | Auskunftsrecht über durchschnittliche Entgelthöhe nach Geschlecht für gleiche/gleichwertige Arbeit | – | Richtlinie, Art. 7 |
| `rl_beweislast` | Verlagerung der Beweislast auf den Arbeitgeber | – | Richtlinie, Art. 18 |
| `aeuv_157` | Artikel 157 AEUV: gleiches Entgelt für gleiche oder gleichwertige Arbeit | – | EUR-Lex, AEUV |
| `rv_1957` | Grundsatz des gleichen Entgelts seit den Römischen Verträgen | 1957 | EUR-Lex / Geschichte der EU |
| `wlb_rl` | Vereinbarkeitsrichtlinie (EU) 2019/1158 (Elternzeit, Vaterschaftsurlaub) | 2019 | EUR-Lex |
| `eu_mitgliedstaaten` | Zahl der EU-Mitgliedstaaten | 27 (2026) | Europäische Union, offizielle Website |
| `ep_sitze` | Sitze im Europäischen Parlament (Wahlperiode ab 2024) | 720 | Europäisches Parlament |
| `entgtranspg` | Deutsches Entgelttransparenzgesetz, Auskunftsanspruch in Betrieben ab … Beschäftigten | 200 (seit 2017) | Bundesgesetzblatt / BMFSFJ |
| `teilzeit_frauen_eu` / `teilzeit_maenner_eu` | Teilzeitquote Frauen / Männer EU | nachschlagen | Eurostat `lfsa_eppgan` |

Wenn du für eine Szene einen weiteren Fakt brauchst, fragst du mich vorher, ob ich ihn haben möchte, und trägst ihn dann nach denselben Regeln ein.

### 2.4 Inhaltliche Regeln für alle Texte

- Genderstern in allen Texten („Abgeordnete*r“, „Expert*innen“, „Arbeitgeber*innen“ nur dort, wo Personen gemeint sind; „Arbeitgeber“ als Institution darf bleiben).
- Keine Stereotype, keine Schuldzuweisungen an Frauen („die verhandeln halt schlechter“) oder Männer. Wenn eine Figur so etwas sagt, widerspricht im selben Gespräch eine andere Figur mit Begründung – oder die Figur relativiert es selbst.
- Jede Figur hat genau **einen** trockenen Humor-Satz pro Auftritt, nicht mehr. Humor über Bürokratie, Kaffee, Sitzungen, Übersetzungen, Akronyme ist erlaubt; Humor über Betroffene nicht.
- Jede Fraktion hat ein **stärkstes Argument**, das das Spiel ernst nimmt und an mindestens einer Stelle sichtbar recht gibt.
- Es wird immer klar gemacht, ob eine Aussage eine **Erfahrung** (eine Person erzählt), eine **Meinung** (eine Bewertung) oder ein **Fakt** (mit Quelle) ist. Das ist auch eine Spielmechanik (Abschnitt 5.4).

---

## 3. Rahmenhandlung und Figuren

### 3.1 Die Ausgangslage

Die Spielfigur ist seit drei Monaten abgeordnete Person im Europäischen Parlament und gehört keiner der großen Fraktionen an, sondern einer kleinen, neuen Gruppe junger Abgeordneter, die sich „Brücke“ nennt (erfunden; ihre Rolle: Vermittlung zwischen allen Seiten). Weil sich die großen Fraktionen nicht auf eine*n Berichterstatter*in einigen konnten, bekommt ausgerechnet die Spielfigur den Auftrag: Sie soll im (erfundenen) **Ausschuss für Beschäftigung und Gleichstellung** den Vorschlag der Kommission für eine **Lohntransparenz-Richtlinie** bearbeiten.

Der Vorschlag liegt als dicker Stapel Papier auf dem Schreibtisch. Die Spielfigur hat **eine Sitzungswoche** (Montag bis Donnerstag, im Spiel in Tagesabschnitte geteilt) bis zur Ausschussabstimmung, danach folgen der Trilog und die Abstimmung im Plenum.

**Der Einstieg (ca. 2 Minuten):** Die Spielfigur kommt morgens ins Büro. Auf dem Bildschirm des Büro-Computers wartet eine Mail der Büroleiterin Mira mit dem Betreff „Glückwunsch. Und Beileid.“ Darunter: der Auftrag. Danach eine kurze, persönliche Szene, die das Thema erdet: Eine Besucher*innengruppe aus einer Berufsschule (erfunden, aus Lyon) war am Vortag im Parlament, und eine Auszubildende hat eine Frage auf einen Zettel geschrieben, der jetzt auf dem Schreibtisch liegt: „Meine Kollegin und ich machen dieselbe Arbeit. Ich habe zufällig gesehen, dass sie mehr verdient – oder ich weniger? Ich weiß es nicht mal. Wie soll ich das überhaupt herausfinden?“ Dieser Zettel begleitet das ganze Spiel als Leitfrage und kommt im Epilog zurück.

### 3.2 Die Hauptfiguren (alle erfunden)

Alle Figuren werden mit Name, Herkunftsland, Rolle, Haltung, stärkstem Argument, wunden Punkt, Humor-Satz-Art und Sprechweise beschrieben. Diese Beschreibungen liegen in `data/figuren.js` (Aussehen) und `data/gespraeche.js` (Texte).

**Mira Kovács (Ungarn), Büroleiterin der Spielfigur.** Ende 30, war früher Gewerkschaftsjuristin, dann sechs Jahre im Parlamentsbetrieb. Duzt die Spielfigur, spricht schnell, kennt jede Abkürzung und erklärt sie trotzdem jedes Mal, weil sie weiß, dass niemand sie kennt. Rolle im Spiel: Tutorial, Kalender, Hinweise, Zusammenfassungen am Abend. Stellt am Ende jedes Tages eine Frage („Und – wofür würdest du deine Hand ins Feuer legen?“), auf die man frei antworten kann (eine von drei Haltungen), was später den Ton des Epilogs beeinflusst. Humor: trocken über Kaffee und Parlamentsaufzüge („Die Aufzüge hier sind das einzige, was in allen Amtssprachen gleich langsam ist.“).

**Tiago Esteves (Portugal), Vertreter der Kommission.** Höflich, präzise, verteidigt den Vorschlag der Kommission wie ein Elternteil sein Kind. Erklärt im Spiel, warum die Kommission handelt (Grundsatz seit Jahrzehnten im Vertrag, aber kaum durchgesetzt; viele Beschäftigte wissen nicht, ob sie fair bezahlt werden). Im Trilog vermittelt er. Stärkstes Argument: „Ein Recht, das niemand nachprüfen kann, ist ein Recht auf dem Papier.“ Humor über Fußnoten.

**Dr. Hanna Lindqvist (Schweden), Juristischer Dienst des Parlaments.** Prüft jede Formulierung der Spielfigur auf Rechtssicherheit und Zuständigkeit. Sie ist die Stimme, die ehrlich sagt: „Das ist politisch verständlich, aber nicht Teil dieses Gesetzes“ oder „So formuliert landet das vor Gericht und verliert.“ Sie ist nie parteiisch. Ihre Hinweise erscheinen als Haftnotizen auf dem Gesetzentwurf (Abschnitt 7.8). Humor über Kommas („Ein Komma an der falschen Stelle hat schon mehr Gesetze gekippt als jede Opposition.“).

**Botschafterin Elena Marinescu (Rumänien), Vertreterin der Ratspräsidentschaft.** Verhandelt im Trilog für die Mitgliedstaaten. Ihr Mandat: Die Regierungen wollen das Ziel, aber weniger Aufwand für kleine Betriebe, längere Fristen und Spielraum für nationale Lösungen. Sie ist freundlich, unnachgiebig in Details und hat immer eine Liste. Stärkstes Argument: „Siebenundzwanzig Länder, siebenundzwanzig Arbeitsmärkte. Was in einem Land einfach ist, ist im anderen ein Umbau.“ (Die Zahl der Mitgliedstaaten als `{fakt:eu_mitgliedstaaten}` eintragen und prüfen.)

### 3.3 Die Schattenberichterstatter*innen (eine Person je Fraktion)

Im Europäischen Parlament benennt jede Fraktion eine Person, die das Gesetz für sie verfolgt („Schattenberichterstatter*in“). Mit diesen Personen verhandelt die Spielfigur. Die Fraktionen sind **erfunden** und orientieren sich nur grob an politischen Grundrichtungen, damit niemand eine echte Partei wiedererkennt. Jede bekommt eine Farbe **und** ein Muster (für Farbsehschwäche, Abschnitt 9).

1. **Bündnis Freie Wirtschaft (BFW)** – wirtschaftsliberal. Schattenberichterstatter: **Pieter de Wit (Niederlande)**, früher Gründer eines Software-Start-ups. Haltung: Gleiche Bezahlung ja, aber Berichtspflichten kosten gerade kleine Firmen Zeit und Geld; lieber freiwillige Siegel und digitale Werkzeuge. Stärkstes Argument: „Jede Stunde, die eine Zehn-Personen-Firma mit Formularen verbringt, fehlt für die Arbeit, die die Gehälter überhaupt bezahlt.“ Wunder Punkt: Er hat selbst erlebt, dass in seiner Firma eine Entwicklerin weniger verdiente, und es erst beim Verkauf der Firma bemerkt. Humor: über Excel.
2. **Europäische Volksmitte (EVM)** – bürgerlich-konservativ. Schattenberichterstatterin: **Maria Kowalska (Polen)**, frühere Bürgermeisterin einer Kleinstadt. Haltung: Fairness ja, aber Familien und Betriebe nicht überfordern; Subsidiarität wichtig; Sozialpartner (Gewerkschaften und Arbeitgeber) sollen viel selbst regeln. Stärkstes Argument: „Gute Regeln entstehen da, wo man die Menschen kennt – in der Region, im Tarifvertrag, nicht nur in Brüssel.“ Wunder Punkt: ihre Tochter, die als Pflegekraft ins Ausland gegangen ist. Humor: über Dorffeste und Sitzungslängen.
3. **Allianz für Soziale Gerechtigkeit (ASG)** – sozialdemokratisch, gewerkschaftsnah. Schattenberichterstatter: **Luca Bianchi (Italien)**, früher Gewerkschaftssekretär in einer Fabrik. Haltung: weitreichende Transparenz, starke Klagerechte, Beteiligung der Betriebsräte, alle Betriebe einbeziehen. Stärkstes Argument: „Wer nicht weiß, was die anderen verdienen, kann nicht einmal fragen, ob es fair ist.“ Wunder Punkt: Er unterschätzt manchmal, was Kleinbetriebe leisten können. Humor: über Espresso-Automaten.
4. **Grüne Zukunftsliste (GZL)** – ökologisch-progressiv. Schattenberichterstatterin: **Aoife Byrne (Irland)**, frühere Sozialarbeiterin. Haltung: Transparenz plus Aufwertung von Sorge- und Pflegeberufen, geschlechtsneutrale Bewertung von Arbeit, Berücksichtigung von Mehrfachdiskriminierung (z. B. Frauen mit Migrationsgeschichte, Frauen mit Behinderung). Stärkstes Argument: „Warum ist es eigentlich mehr wert, Maschinen zu reparieren als Menschen zu pflegen?“ Wunder Punkt: Sie will manchmal mehr in ein Gesetz packen, als es tragen kann. Humor: über Fahrradwege im Regen.
5. **Bund Souveräner Nationen (BSN)** – EU-skeptisch. Schattenberichterstatter: **Jaroslav Novák (Tschechien)**, früher Lehrer. Haltung: Gleicher Lohn ist richtig, aber das sollen die Länder selbst regeln; die EU greift zu sehr ein. Stärkstes Argument: „Ein Gesetz, das zu Hause niemand versteht, macht die Menschen nicht gleicher, sondern wütender.“ Er ist kein Gegner der Gleichstellung, sondern der Zentralisierung. Wunder Punkt: Seine Partei zu Hause hat sehr unterschiedliche Meinungen dazu. Humor: über Übersetzungsfehler.
6. **Fraktionslose und Unabhängige (FU)** – keine Fraktion, sehr gemischt. Sprecherin: **Sofia Andreou (Griechenland)**, frühere Krankenschwester, als Unabhängige gewählt. Haltung: entscheidet nach Einzelfrage und nach dem, was sie von Betroffenen hört. Stärkstes Argument: „Ich frage immer: Was ändert sich am Montagmorgen für die Kollegin im Schichtdienst?“ Humor: über Nachtschichten im Parlament.

Die Fraktion der Spielfigur (**Brücke**) ist klein und stimmt immer mit der Spielfigur.

### 3.4 Die Stimmen in der Anhörung (erfunden)

In der Anhörung (Abschnitt 4.2) treten fünf Personen auf. Jede vertritt eine andere Perspektive; mindestens eine ist eine **respektvolle Gegenstimme** zu einem stärkeren Gesetz.

- **Inès Moreau (Frankreich), 19, Auszubildende Mechatronikerin** – die Verfasserin des Zettels. Erfahrung: Sie weiß nicht, was andere verdienen, weil im Arbeitsvertrag eine Verschwiegenheitsklausel steht. Sie ist nervös, spricht zum ersten Mal vor Abgeordneten. Humor: „Ich hab vorher geübt. Vor meinem Spiegel. Der war einverstanden.“
- **Prof. Dr. Jakob Weiß (Österreich), Arbeitsmarktökonom** – erklärt unbereinigt/bereinigt, Bruttostundenlöhne und den unerklärten Rest, sachlich und mit Vorsicht vor vorschnellen Schlüssen. Er zeigt eine einfache Tafel (gezeichnet, keine erfundenen Zahlen: nur Platzhalter-Fakten). Humor über Durchschnittswerte („Wenn ich mit einem Fuß im Eis und mit dem anderen im Feuer stehe, geht es mir im Durchschnitt prima.“).
- **Karin Hofstetter (Deutschland), Personalleiterin eines Maschinenbaubetriebs mit 140 Beschäftigten** (die Zahl ist ein Spielwert der Geschichte, kein Fakt) – respektvolle Gegenstimme zu sehr strengen Pflichten. Erfahrung: Sie würde gern fair bezahlen und weiß nicht, wie man „gleichwertige Arbeit“ zwischen Lagerlogistik und Buchhaltung vergleicht, ohne einen teuren Beratungsvertrag. Sie wünscht sich Vorlagen und Zeit. Humor über Software-Updates.
- **Nadia El Amrani (Belgien), Pflegefachkraft und Betriebsrätin in einem Krankenhaus** – Erfahrung: Pflege ist körperlich und emotional schwer, wird aber schlechter bewertet als technische Berufe mit ähnlicher Verantwortung. Sie spricht über Bewertungskriterien. Humor über Schichtpläne.
- **Mateusz Zieliński (Polen), Vater in Teilzeit, Lagerist** – zeigt, dass Teilzeit über den Stundenlohn und die Beförderung wirkt, und dass viele Ursachen außerhalb eines Transparenzgesetzes liegen (Kitas, Elternzeit). Er ist die Stimme, die sagt: „Gut, dass ihr das macht. Aber mein Problem löst ihr damit nur zur Hälfte.“ Humor über Kinderlieder im Kopf.

### 3.5 Weitere Nebenfiguren

- **Der Saaldiener** (ohne Namen) im Plenum, der mit unbewegter Miene „Ruhe bitte“ sagt – kommt genau zweimal vor.
- **Ein Dolmetscher in der Kabine**, den man bei einem Gespräch kurz sieht und der die Spielfigur später einmal rettet, weil er eine Doppeldeutigkeit bemerkt (kleine Szene im Trilog).
- **Die Journalistin Clara Vogt (Luxemburg)**, die nach jeder Abstimmung eine Frage stellt; ihre Schlagzeilen erscheinen im Epilog.

### 3.6 Darstellung aller Figuren

Alle Figuren sind hochwertige **3D-Gliederfiguren im Stil eines Architekturmodells** (siehe Abschnitt 7.7): realistische Proportionen, fein modellierte, ruhige Köpfe ohne gemalte Mimik, Gefühle über Körpersprache und Gesten, erkennbar an Silhouette, Frisur, Kleidung, Accessoire und einem Element in Fraktionsfarbe. Große Vielfalt bei Alter, Körperbau, Hautton, Haarform, Kopfbedeckung (Kopftuch, Kippa, Turban sind möglich), Brille, Hörgerät, Rollstuhl, Gehstock. Diversität ist selbstverständlich, sie wird nicht kommentiert.

---

## 4. Spielablauf, Kapitel für Kapitel

Das Spiel hat sieben Kapitel. Jedes Kapitel beginnt mit einer **Kapitelkarte** (großer Titel, Wochentag, eine Zeile, worum es geht) und endet mit einer kurzen **Abendnotiz** von Mira, die zusammenfasst, was passiert ist. Zwischen den Kapiteln wird automatisch gespeichert.

| Kapitel | Titel | Ort | Dauer | Kernhandlung |
|---|---|---|---|---|
| 1 | Der Stapel | Büro | 2 min | Einstieg, Auftrag, Zettel von Inès, Tutorial |
| 2 | Die Anhörung | Ausschusssaal | 4 min | Fünf Stimmen hören, Belege und Stimmen sammeln |
| 3 | Der Entwurf | Büro, Schreibtisch | 5 min | Den Gesetzestext Artikel für Artikel festlegen |
| 4 | Die Flure | Gänge, Cafeteria, Büros der Fraktionen | 5 min | Mit Schattenberichterstatter*innen verhandeln |
| 5 | Die Ausschussabstimmung | Ausschusssaal | 1 min | Erste Mehrheit – oder Nacharbeiten |
| 6 | Der Trilog | Verhandlungsraum, nachts | 4 min | Mit Rat und Kommission einen Kompromiss finden |
| 7 | Das Plenum | Plenarsaal, Straßburg | 2 min | Schlussabstimmung, Rede, Ergebnis |
| – | Epilog: „Fünf Jahre später“ | Collage | 2 min | Folgen der eigenen Fassung, Inès’ Antwort |
| – | „So ist es wirklich“ | Dokument | 2 min | Vergleich mit der echten Richtlinie, Reflexion, Quellen |

### 4.1 Kapitel 1 – Der Stapel (Tutorial)

- Die Spielfigur gibt ihren Vornamen ein (Standard „Sam“, höchstens 16 Zeichen, nur Buchstaben, Bindestrich und Leerzeichen; wird bereinigt).
- Mira erklärt in **höchstens fünf kurzen Sprechblasen**: Was ein*e Berichterstatter*in tut; dass man eine Mehrheit braucht; dass der Kalender begrenzt ist; dass alles, was man hört, im **Dossier** landet; dass es keine richtige Lösung gibt, nur gut begründete.
- Der Zettel von Inès wird gezeigt und in die Ecke des Bildschirms „geheftet“, wo er ab jetzt als kleine Leitfrage sichtbar bleibt (antippen → Zettel groß).
- Ein **Mini-Tutorial**: Die Spielfigur legt probehalber im ersten Artikel eine Option fest und sieht, wie sich das Halbrund (die Sitzverteilung) bewegt. Mira kommentiert: „Siehst du? Jedes Wort hat Freund*innen und Feind*innen.“ Danach wird die Probe zurückgesetzt.
- Ende: Kapitelkarte „Dienstag, 9 Uhr – Anhörung“ (Uhrzeit als Spielwert im Text: `{wert:uhr_anhoerung}`; da Uhrzeiten keine Fakten sind, ist das erlaubt).

### 4.2 Kapitel 2 – Die Anhörung

Ort: ein Ausschusssaal mit hufeisenförmigem Tisch, Namensschildern, Kabinen für die Dolmetscher*innen. Die fünf Gäste aus 3.4 sitzen nebeneinander. Die Spielfigur hat **sechs Fragekarten**, kann aber nur **vier Fragen** stellen (Spielwert `fragen_anhoerung`). Jede Frage richtet sich an eine Person und bringt eine Antwort von drei bis sechs Sätzen.

Jede Antwort enthält eine **Kernaussage**, die als Karte ins Dossier fliegt. Karten haben eine von drei Arten:
- **Stimme** (Erfahrung einer Person, z. B. „Ich weiß nicht, was meine Kollegin verdient – es steht im Vertrag, dass wir nicht darüber reden dürfen.“),
- **Beleg** (Fakt mit Quelle aus `data/fakten.js`, z. B. „Unbereinigter Gender Pay Gap in der EU: {fakt:gpg_eu} ({jahr:gpg_eu}, {quelle:gpg_eu})“),
- **Einwand** (ein begründeter Gegenpunkt, z. B. „Ohne Vorlagen ist eine Entgeltbewertung für Betriebe mit hundert Beschäftigten kaum machbar.“).

**Pflichtinhalte**, die unabhängig von der Fragenwahl vorkommen (über die Einführungsrede des Ökonomen am Anfang der Anhörung, nicht über eine Frage):
1. Bruttostundenlöhne als Grundlage, Teilzeit wirkt über Stundenlohn, Beförderung, Gehaltsentwicklung.
2. Unbereinigt vs. bereinigt mit `{fakt:gpg_de_destatis}` und `{fakt:gpg_de_bereinigt}` als Beispiel, plus der Hinweis, dass der unerklärte Teil kein Beweis, aber ein ernster Hinweis ist.

**Feedback beim Fragen:** Wählt man vier Fragen an Personen mit derselben Haltung, sagt Mira nach der Anhörung: „Du hast heute vor allem Leute gehört, die dir zustimmen. Die anderen sind nicht weg, nur weil du nicht gefragt hast.“ – kein Strafpunkt, aber eine fehlende Einwand-Karte, die später in den Fluren nützlich gewesen wäre.

**Die Gegenstimme bekommt Recht:** Wenn man Karin Hofstetter fragt, erhält man die Karte „Vorlagen und Fristen“, die in Kapitel 4 bei zwei Fraktionen (BFW, EVM) Vertrauen schafft und im Trilog bei der Ratspräsidentschaft hilft.

### 4.3 Kapitel 3 – Der Entwurf

Das Herzstück. Die Spielfigur sitzt am **Schreibtisch im Büro** (Abschnitte 7.6, 7.8, 7.9): vorne der 3D-Gesetzentwurf mit scharfer Text-Ebene, daneben das leuchtende Glasmodell des Halbrunds, am Rand Fraktionsleiste und Wirkungsanzeige, unten das Dossier mit den gesammelten Karten.

- Der Text hat **sieben Artikel** (Abschnitt 6). Jeder Artikel hat eine oder zwei **Stellschrauben** mit drei bis fünf Optionen. Eine Option ist immer „Streichen“ (der Artikel fällt weg), außer bei Artikel 1 (Zweck).
- Wählt man eine Option, **tippt sich der neue Wortlaut** in den Text (Schreibmaschinen-Effekt, abschaltbar), der alte wird farbig durchgestrichen – wie im Änderungsmodus eines Textprogramms.
- Sofort reagieren: (a) die **Punkte im Halbrund** (Zustimmung je Fraktion), (b) die **Wirkungsanzeige** (vier Achsen, qualitativ), (c) **Randbemerkungen** des Juristischen Dienstes, wenn eine Formulierung rechtlich wackelig ist oder außerhalb der Zuständigkeit liegt.
- Zu jeder Option gibt es eine aufklappbare **„Dafür / Dagegen“-Karte** mit je zwei Sätzen und der Angabe, welche Fraktionen sie mögen und welche nicht. Kein Raten im Dunkeln: Das Spiel zeigt die Haltungen offen, die Schwierigkeit liegt im Abwägen, nicht im Erraten.
- Es gibt **keinen Zeitdruck** in diesem Kapitel. Man kann beliebig umentscheiden. Erst mit „Entwurf einreichen“ ist der Stand fest; danach kann man nur noch über Verhandlungen (Kapitel 4) oder im Trilog (Kapitel 6) ändern.
- Zusätzlich gibt es einen **Sonderbereich „Wunschzettel“**: Zwei Vorschläge, die nicht in dieses Gesetz gehören (europaweite Kita-Garantie mit festen Plätzen; Pflicht zur gleichen Aufteilung der Elternzeit). Zieht man sie in den Text, markiert der Juristische Dienst sie rot: „Nicht Gegenstand dieser Richtlinie / Zuständigkeit überwiegend bei den Mitgliedstaaten bzw. anderes Instrument (siehe {fakt:wlb_rl}).“ Lässt man sie trotzdem drin, sinkt die Zustimmung bei EVM und BSN stark, und im Trilog streicht der Rat sie sicher. Das ist der Moment, in dem das Spiel zeigt: **Nicht jede gute Idee gehört in jedes Gesetz.** Im Epilog kommen diese Themen als „Was es außerdem bräuchte“ zurück – positiv, nicht als Fehler.

### 4.4 Kapitel 4 – Die Flure

Jetzt wird verhandelt. Die Ansicht wechselt zu einem **aufgeschnittenen 3D-Modell des Parlamentsgebäudes** (Abschnitt 7.6) mit Büros der Fraktionen, Cafeteria, Bibliothek, Ausschusssaal. Darin sind die Schattenberichterstatter*innen als Figuren zu sehen, die durch die Flure gehen oder in ihren Büros arbeiten.

- Die Spielfigur hat **sechs Termine** (Spielwert `termine_flure`). Jedes Gespräch kostet einen Termin. Eine Uhr am Rand zeigt den Tag vergehen (Mittwoch 9 Uhr bis Donnerstag 13 Uhr). Wenn die Termine aufgebraucht sind, ruft Mira zur Ausschussabstimmung.
- Die Bibliothek kostet ebenfalls einen Termin und gibt eine zusätzliche **Beleg-Karte** nach Wahl (aus drei angebotenen). So kann man fehlende Argumente nachholen.
- Die Cafeteria ist **kostenlos** und einmal pro Tag besuchbar: Dort hört man im Vorbeigehen Gerüchte („Novák soll mit seiner Delegation telefoniert haben …“), die Hinweise auf Wünsche einzelner Fraktionen geben.

**Ein Verhandlungsgespräch** (Abschnitt 5.5) hat immer denselben Ablauf in drei Zügen:
1. **Anliegen hören:** Die Person nennt ihr wichtigstes Problem mit dem aktuellen Entwurf (aus den Daten: der Artikel, bei dem die Fraktion am meisten verliert).
2. **Antworten:** Die Spielfigur legt eine Karte aus dem Dossier (Stimme, Beleg oder Einwand) – oder bietet ein **Zugeständnis** an (eine konkrete Textänderung).
3. **Ergebnis:** Die Person reagiert. Passt die Karte zum Anliegen, steigt das **Vertrauen** der Fraktion; manche Fraktionen ändern daraufhin ihre Stimme auch ohne Textänderung. Ein Zugeständnis ändert den Text sofort (im Änderungsmodus sichtbar) – und kann andere Fraktionen verärgern; das Spiel zeigt das vorher als Vorschau im Halbrund.

**Versprechen:** Manche Zugeständnisse sind Versprechen für später („Im Trilog werde ich mich für eine längere Frist einsetzen“). Sie landen in einer Liste. Hält man sie im Trilog nicht, sinkt das Vertrauen dieser Fraktion vor dem Plenum deutlich. Das zeigt im Kleinen, warum Verlässlichkeit in der Politik zählt.

**Respekt-Regel:** Es gibt in keinem Gespräch eine „fiese“ Option. Die Spielfigur kann bestimmt, vorsichtig oder humorvoll antworten, aber nie herablassend.

### 4.5 Kapitel 5 – Die Ausschussabstimmung

- Der Ausschuss hat **sechzig Sitze** (Spielwert `sitze_ausschuss`), verteilt nach Spielwerten auf die Fraktionen (Abschnitt 5.3). Gebraucht wird eine einfache Mehrheit der abgegebenen Stimmen.
- Die Abstimmung wird als kurze Szene im Ausschusssaal gezeigt: Hände gehen hoch, die Sitzlampen an den Plätzen leuchten nacheinander auf – Ja (hell, aufrecht), Nein (gedimmt) oder Enthaltung (halb) – und das Glasmodell zeigt das Ergebnis.
- **Bei Mehrheit:** weiter zum Trilog, die Journalistin stellt eine Frage, man wählt eine von drei Antworten (sie erscheint im Epilog als Zitat).
- **Ohne Mehrheit:** Kein Game Over. Mira sagt, was gefehlt hat (die zwei Fraktionen, die am knappsten dagegen waren, und warum). Die Spielfigur bekommt **zwei Extra-Termine** und kehrt in die Flure zurück. Scheitert es ein zweites Mal, greift die Kommission ein und schlägt einen Kompromisstext vor (aus den Daten), den man annehmen muss; das Spiel geht weiter, der Epilog vermerkt es.

### 4.6 Kapitel 6 – Der Trilog

Nachts in einem fensterlosen Verhandlungsraum. Am Tisch: Botschafterin Marinescu (Rat), Tiago Esteves (Kommission), die Spielfigur (Parlament). Auf dem Tisch liegt eine **Vier-Spalten-Tabelle** – genau so arbeitet man auch im echten Trilog: Spalte 1 Kommissionsvorschlag, Spalte 2 Position des Parlaments (= Entwurf der Spielfigur), Spalte 3 Position des Rates, Spalte 4 Kompromiss (leer).

- Für jeden Artikel, bei dem Parlament und Rat verschieden sind, muss die Spielfigur einen Kompromiss wählen: die eigene Position halten, die Ratsposition übernehmen oder einen Mittelweg (falls vorhanden).
- Der Rat hat ein **Verhandlungsbudget**: Er kann nur bei einer begrenzten Zahl von Artikeln nachgeben (Spielwert `rat_nachgeben`, z. B. drei). Hält die Spielfigur an mehr Stellen fest, sagt Marinescu: „Dafür habe ich kein Mandat.“ Dann muss man priorisieren: Welche zwei, drei Punkte sind einem am wichtigsten?
- **Tiago** kann einmal eine „Brücke bauen“: Er schlägt bei einem festgefahrenen Artikel einen Kompromisstext vor.
- **Die Uhr läuft symbolisch** (es wird 2 Uhr, 3 Uhr, 4 Uhr), aber ohne echten Zeitdruck. Der Raum wird dunkler, die Kaffeebecher mehr. Humor-Moment: Um 4 Uhr fragt Tiago, ob „gleichwertig“ mit oder ohne Bindestrich geschrieben wird, und alle lachen müde.
- **Der Dolmetscher-Moment:** Bei einem Artikel weist der Dolmetscher darauf hin, dass ein Wort in zwei Sprachen Unterschiedliches bedeuten kann. Die Spielfigur kann die Formulierung präzisieren und bekommt dafür einen Bonus bei der Rechtssicherheit. Das zeigt, dass EU-Gesetze in allen Amtssprachen gleich verbindlich sind (als Fakt `amtssprachen` eintragen und prüfen).
- Versprechen aus Kapitel 4 werden hier eingelöst oder gebrochen – das Spiel erinnert mit einem kleinen Post-it daran.

### 4.7 Kapitel 7 – Das Plenum

- Der Plenarsaal in Straßburg als großes Halbrund mit **einhundertzwanzig Punkten** (Spielwert `sitze_plenum_darstellung`; deutlich als vereinfachte Darstellung gekennzeichnet, mit dem Hinweis auf die echte Zahl `{fakt:ep_sitze}`).
- Die Spielfigur hält eine **kurze Rede** aus drei Bausteinen: Einstieg (Zettel von Inès / ein Beleg / ein Einwand, den man ernst nimmt), Kern (einer der eigenen Artikel), Schluss (ein Appell aus drei Möglichkeiten). Die Rede wird Satz für Satz eingeblendet, während das Halbrund leise reagiert (einzelne Punkte, die noch unentschlossen sind, kippen je nach Passung der Bausteine zu Fraktionen mit unklarer Haltung).
- Dann die **Abstimmung**: Erst die Ja-Stimmen von links nach rechts, dann Nein, dann Enthaltungen; ein großer Zähler; der Saaldiener sagt „Ruhe bitte“. Das Ergebnis wird mit einem Stempel auf das Dokument gedrückt: „ANGENOMMEN“ oder „ABGELEHNT“.
- **Bei Ablehnung:** Kein Game Over. Eine Seite erklärt, welche Fraktionen gefehlt haben und warum. Es folgen trotzdem der Epilog (in der Variante „Das Gesetz kam nicht“) und der Vergleich. Danach wird ein **„Neuer Anlauf“** angeboten: Man startet bei Kapitel 6 mit einer neuen Ratsposition.

### 4.8 Epilog – „Fünf Jahre später“

Eine Collage aus Zeitungsausschnitten, Chatnachrichten, einem Lohnzettel-Ausschnitt und einer Postkarte – zusammengesetzt aus Bausteinen je nach Gesetzesfassung (Abschnitt 5.8):

- **Inès antwortet** auf ihren eigenen Zettel – fünf Jahre später, inzwischen Gesellin/Technikerin. Je nach Fassung: Sie hat über das Auskunftsrecht erfahren, dass sie weniger bekam, und wurde nachbezahlt; oder sie weiß es immer noch nicht, weil der Betrieb zu klein war; oder sie hat es erfahren, aber konnte nichts tun, weil die Durchsetzung schwach war.
- **Karin Hofstetter** berichtet, wie der Aufwand wirklich war (je nach Schwellenwert und Vorlagen: „überraschend machbar“ oder „ein Jahr Kopfschmerzen“).
- **Nadia El Amrani** schreibt, ob die Bewertungskriterien etwas für Pflegeberufe verändert haben.
- **Mateusz** erinnert daran, was das Gesetz nicht lösen konnte (Kitas, Elternzeit), und dass da „noch ein anderes Gesetz fehlt“ – egal welche Fassung.
- **Schlagzeilen** von Clara Vogt, je nach Mehrheit und Inhalt.
- Eine **Abschlusszeile von Mira**, abhängig von den Abendantworten (Grundstimmung „mutig“, „pragmatisch“ oder „vorsichtig“).

Wichtig: Der Epilog behauptet **keine erfundenen Zahlen** über Wirkungen („Die Lücke sank um 3 Prozent“ ist verboten). Er erzählt Geschichten einzelner erfundener Menschen und markiert das: „Erfundene Geschichten – so könnte es aussehen.“

### 4.9 „So ist es wirklich“ – Vergleich, Reflexion, Quellen

1. **Vergleichstabelle:** Für jeden der sieben Artikel: „Deine Fassung“ | „Echte Richtlinie (EU) 2023/970“ | „Warum so entschieden wurde“ (zwei Sätze, sachlich). Gleiche Entscheidungen bekommen ein kleines Häkchen, abweichende einen Pfeil („mutiger“ / „vorsichtiger“ / „anders“), ohne Wertung.
2. **Was vereinfacht wurde:** Eine kurze Liste (echte Lesungen, Rat stimmt mit qualifizierter Mehrheit ab, echte Fraktionen, echte Sitzverteilung, echter Trilog dauert Monate).
3. **Zeitleiste der echten Richtlinie:** Vorschlag `{fakt:rl_vorschlag}` → Annahme `{fakt:rl_datum}` → Umsetzungsfrist `{fakt:rl_frist}` → erste Berichte `{fakt:rl_bericht_250}`. Dazu ein Satz: „Wie es in Deutschland umgesetzt wurde, kannst du selbst recherchieren.“ (Weil der Stand der Umsetzung sich ändern kann, behauptet das Spiel dazu nichts.)
4. **Offene Fragen** zum Nachdenken und für den Unterricht (mindestens sechs, z. B. „Welche Ursache der Lohnlücke findest du am wichtigsten – und welches Gesetz bräuchte es dafür?“, „Wann ist Transparenz gut, wann wird sie zur Belastung?“, „Was wäre in deinem Ausbildungsbetrieb anders?“).
5. **Quellen** – automatisch aus `data/fakten.js`, sortiert nach Quelle, mit Prüfstatus.
6. **Credits** – mit Platzhaltern `[Dein Name]`, „Konzept und Texte“, „Umsetzung mit KI-Unterstützung (siehe KI-Dokumentation)“.

---

## 5. Spielsysteme

### 5.1 Der Spielstand (zentraler Zustand)

Alles, was das Spiel weiß, steht in einem Objekt `LOGIK.stand`, das automatisch gespeichert wird:

- `name` (Vorname der Spielfigur), `kapitel`, `termineUebrig`,
- `entwurf`: je Artikel die gewählte Option (`null` = gestrichen), plus Wunschzettel-Einträge,
- `vertrauen`: je Fraktion ein Wert von −3 bis +3 (Start aus `data/fraktionen.js`),
- `dossier`: Liste der Karten-IDs,
- `versprechen`: Liste offener Versprechen,
- `abendantworten`: drei Haltungen,
- `ergebnis`: Ausschuss, Trilog-Kompromiss, Plenum,
- `flags`: freie Merker für Gespräche (z. B. `karin_gefragt`).

### 5.2 Artikel und Optionen (Daten in `data/artikel.js`)

Jeder Artikel hat: `id`, `titel` (z. B. „Artikel 4 – Berichtspflicht“), `einleitung` (ein Satz, worum es geht), `schrauben` (eine oder zwei Stellschrauben). Jede Stellschraube hat Optionen mit:

- `text` – der Wortlaut, der in den Gesetzestext getippt wird (juristisch klingend, aber verständlich; höchstens drei Zeilen),
- `kurz` – Kurzname für Knöpfe (höchstens vier Wörter),
- `dafuer`, `dagegen` – je zwei Sätze,
- `haltung` – je Fraktion ein Wert von −2 (lehnt stark ab) bis +2 (will das unbedingt),
- `wirkung` – je Achse ein Wert von −2 bis +2 (Abschnitt 5.6),
- `jurist` – optionale Randbemerkung des Juristischen Dienstes,
- `vergleich` – ID des passenden Fakts, falls diese Option der echten Richtlinie entspricht (`echt: true`).

### 5.3 Das Fraktionsmodell (Daten in `data/fraktionen.js`)

Jede Fraktion hat: `name`, `kurz`, `farbe`, `muster` (Streifen, Punkte, Karo, Wellen, Dreiecke, voll), `sitzeAusschuss`, `sitzePlenum`, `startVertrauen`, `schwelle` (ab welcher Punktzahl sie zustimmt), `geschlossenheit` (0 bis 1: wie einheitlich sie abstimmt), `kernanliegen` (Liste von Artikel-IDs, die ihr besonders wichtig sind; dort zählt die Haltung doppelt).

**Berechnung der Zustimmung** (einfach, nachvollziehbar, im Debug sichtbar):
```
punkte(Fraktion) = Summe über alle Artikel (haltung der gewählten Option × Gewicht)
                 + vertrauen(Fraktion)
                 + Bonus für passende Karten in Gesprächen (schon im Vertrauen enthalten)
Gewicht = 2 für Kernanliegen, sonst 1
```
Aus `punkte − schwelle` wird ein Anteil der Ja-Stimmen berechnet: Liegt die Fraktion deutlich darüber, stimmen fast alle mit Ja; liegt sie knapp, spaltet sie sich entsprechend der `geschlossenheit` in Ja, Enthaltung und Nein. Diese Formel steht kommentiert in `js/logik/mehrheit.js`; die Zahlenwerte in `data/spielwerte.js`.

**Balance-Ziele** (vom Debug-Werkzeug geprüft, Abschnitt 11):
- Es gibt **mindestens drei sehr verschiedene Wege** zu einer Mehrheit (z. B. Mitte-links-Bündnis mit starkem Gesetz, breite Mitte mit moderatem Gesetz, Mitte-rechts mit schlankem Gesetz).
- Eine Fassung, die alle Maximalforderungen einer Seite enthält, findet **keine** Mehrheit.
- Eine Fassung, in der fast alles gestrichen ist, findet ebenfalls **keine** Mehrheit (dann sagen auch die Wirtschaftsliberalen: „Wenn wir schon ein Gesetz machen, dann eins, das man ernst nehmen kann.“).
- Keine Fraktion ist für eine Mehrheit zwingend nötig.

### 5.4 Karten im Dossier (Daten in `data/karten.js`)

Jede Karte hat `id`, `art` („stimme“, „beleg“, „einwand“), `von` (Figur), `text`, optional `fakt` (ID in `fakten.js`), `wirktBei` (Liste von Anliegen-IDs, bei denen sie überzeugt) und `staerke` (1 oder 2).

**Wichtige Spielregel zur Unterscheidung:** Bei manchen Fraktionen zählen bestimmte Kartenarten mehr. Die Wirtschaftsliberalen überzeugen Belege und Einwände, die Aufwand ernst nehmen; die Gewerkschaftsnahen überzeugen Stimmen von Betroffenen; die EU-Skeptischen überzeugen vor allem Einwände, die nationale Spielräume betreffen. Legt man eine reine Meinung, wo ein Beleg gebraucht wird, sagt die Person freundlich: „Das glaube ich Ihnen. Aber können Sie es auch zeigen?“ – so lernt man spielerisch den Unterschied zwischen Erfahrung, Meinung und Fakt.

### 5.5 Gespräche (Daten in `data/gespraeche.js`)

Gespräche sind Knoten-Netze: Jeder Knoten hat `sprecher`, `text`, optional `bedingung` (Flag, Karte im Dossier, Vertrauen ≥ x, Option im Entwurf), `aktionen` (Flag setzen, Karte geben, Vertrauen ändern, Termin verbrauchen, Versprechen anlegen, Textänderung) und `antworten` (zwei bis drei, jeweils mit Ziel-Knoten). Platzhalter: `{name}`, `{fakt:id}`, `{jahr:id}`, `{quelle:id}`, `{wert:id}`, `{option:artikel}` (aktueller Wortlaut-Kurzname). Hervorhebung mit `**fett**`.

**Nachfrage-Antworten:** Manche Antworten erscheinen nur, wenn eine bestimmte Karte im Dossier liegt; sie sind mit einem kleinen Büroklammer-Symbol markiert („Sie haben in der Anhörung gesagt, dass …“).

**Darstellung:** Gespräche laufen in einer **Gesprächsleiste** am unteren Rand (Abschnitt 7.10), nicht in Sprechblasen; darüber sieht man die Figuren im 3D-Bild in Halbnah mit Gesten. Jeder Satz kann in den Daten eine Geste und eine Kameraeinstellung bekommen. Text erscheint zügig (Schreibmaschine, abschaltbar), ein Klick zeigt den Rest sofort.

### 5.6 Die Wirkungsanzeige (qualitativ!)

Vier Achsen, jeweils als fünfstufige Leiste aus Kästchen, mit dem festen Untertitel „Einschätzung im Spiel – vereinfacht, keine Prognose“:

1. **Wissen** – Erfahren Beschäftigte, ob sie fair bezahlt werden?
2. **Durchsetzung** – Können sie ihr Recht auch bekommen?
3. **Aufwand** – Wie viel Arbeit macht das Gesetz für Betriebe, besonders kleine? (hier ist „mehr“ schlechter; die Leiste ist deshalb anders gefärbt und beschriftet)
4. **Rechtssicherheit** – Hält der Text vor Gericht, passt er zur Zuständigkeit der EU?

Daneben eine fünfte, **graue, nicht beeinflussbare** Leiste: „Ursachen außerhalb dieses Gesetzes (Kitas, Elternzeit, Berufswahl)“. Sie bleibt immer gleich und erinnert daran, was ein Transparenzgesetz nicht leisten kann. Tippt man sie an, erklärt Mateusz in zwei Sätzen, warum.

### 5.7 Der Trilog als System

Daten in `data/trilog.js`: Für jeden Artikel die **Ratsposition** (eine Option-ID) und ggf. ein **Mittelweg**-Text. Die Ratsposition orientiert sich grob an den Interessen der Mitgliedstaaten (längere Fristen, höhere Schwellenwerte, Spielraum bei Sanktionen) – aber sie ist ein Spielwert, nicht die echte Ratsposition, und wird im Vergleich auch nicht als echte Ratsposition ausgegeben.

Regeln: Der Rat gibt bei höchstens `rat_nachgeben` Artikeln nach. Bei Mittelwegen gibt er immer nach, das kostet aber einen halben Punkt seines Budgets. Am Ende muss der Kompromiss sowohl die Wirkungsachse „Rechtssicherheit“ mindestens auf Stufe 3 haben als auch im Parlament (Plenum-Berechnung, Vorschau sichtbar) eine Chance haben.

### 5.8 Epilog-Bausteine (Daten in `data/epilog.js`)

Bausteine mit Bedingungen, z. B. `{ bedingung: "auskunft >= 2 && durchsetzung >= 2", figur: "ines", text: "…" }`. Es gibt pro Figur drei bis vier Varianten, eine Rückfall-Variante ohne Bedingung und drei Grundstimmungen für Miras Schlusszeile. Die Auswahl ist deterministisch (gleiche Fassung = gleicher Epilog), damit Lehrkräfte Ergebnisse vergleichen können.

### 5.9 Speichern

- Automatisch nach jedem Kapitel, nach jeder Entwurfsänderung (mit einer kurzen Verzögerung) und bei `pagehide`/`visibilitychange`.
- `localStorage` nur in `try/catch`; wenn es nicht geht (z. B. bestimmte Browser-Einstellungen bei `file://`), läuft das Spiel trotzdem, und das Titelmenü zeigt dezent „Speichern nicht möglich“.
- Ein Spielstand. Titelmenü: „Weiterspielen“ (nur wenn vorhanden), „Neue Legislatur“ (mit Rückfrage), „Einstellungen“, „Über das Spiel“.
- Spielstand-Version im Objekt; bei inkompatibler Version freundliche Meldung statt Absturz.

---

## 6. Die sieben Artikel im Detail

Die Wortlaute hier sind **Vorschläge**. Du formulierst sie in `data/artikel.js` vollständig aus, juristisch klingend, aber für 16-Jährige verständlich. Wo eine Option der echten Richtlinie entspricht, setzt du `echt: true` und verweist auf den passenden Fakt. Wo ich unten eine Zahl als Option nenne, ist das ein **Spielwert** (in `data/spielwerte.js`), auch wenn er zufällig der echten Regelung gleicht – der Vergleich am Ende nimmt die echte Zahl aus `fakten.js`.

### Artikel 1 – Zweck (keine Stellschraube, aber eine Wahl der Begründung)
Der Zweck steht fest: gleiches Entgelt für gleiche oder gleichwertige Arbeit durchsetzen. Die Spielfigur wählt nur, welcher von drei Erwägungsgründen (die einleitenden Begründungen eines EU-Gesetzes, kurz erklärt) vorangestellt wird: (a) Gerechtigkeit für einzelne Beschäftigte, (b) Wettbewerbsgleichheit im Binnenmarkt, (c) Vertrauen in die europäischen Grundrechte. Wirkt leicht auf die Fraktionen (BFW mag b, ASG mag a, GZL mag c, BSN mag keinen besonders) und bestimmt den Ton der Rede in Kapitel 7.

### Artikel 2 – Gehalt vor der Einstellung
Stellschraube A: Was müssen Arbeitgeber vor dem Vorstellungsgespräch sagen? Optionen: nichts (Streichen) · Einstiegsgehalt oder Gehaltsspanne auf Nachfrage · Einstiegsgehalt oder Spanne vor dem Vorstellungsgespräch (entspricht etwa der echten Richtlinie) · Gehaltsspanne verpflichtend in jeder Stellenanzeige.
Stellschraube B: Darf nach dem bisherigen Gehalt gefragt werden? Optionen: ja · nur, wenn die bewerbende Person es von sich aus sagt · nein, verboten (echt).
Dafür/Dagegen: Wer sein bisheriges Gehalt nennen muss, nimmt eine alte Lücke in den neuen Job mit. Dagegen: Arbeitgeber wollen einschätzen, ob die Erwartungen realistisch sind.

### Artikel 3 – Kriterien für gleichwertige Arbeit
Stellschraube: Wie wird „gleichwertig“ festgestellt? Optionen: Das regelt jeder Betrieb selbst · Betriebe müssen geschlechtsneutrale Kriterien verwenden (Kompetenzen, Belastung, Verantwortung, Arbeitsbedingungen – entspricht etwa der echten Richtlinie) · zusätzlich EU-weit einheitliches Bewertungsraster · Mitgliedstaaten stellen kostenlose Werkzeuge und Vorlagen bereit (kombinierbar mit Option 2, als zweite Schraube „Unterstützung: ja/nein“).
Hier hilft die Karte von Karin Hofstetter („Vorlagen und Fristen“) und die Stimme von Nadia El Amrani (Pflege).

### Artikel 4 – Auskunftsrecht und Verschwiegenheit
Stellschraube A: Was dürfen Beschäftigte erfahren? Optionen: nichts · auf Antrag die durchschnittliche Entgelthöhe, aufgeschlüsselt nach Geschlecht, für Gruppen mit gleicher oder gleichwertiger Arbeit (echt) · zusätzlich jährliche Information aller Beschäftigten über dieses Recht (echt, als Teil) · vollständig offene Gehaltslisten im Betrieb.
Stellschraube B: Verschwiegenheitsklauseln über das eigene Gehalt: erlaubt · verboten (echt).
Inès’ Zettel hängt direkt an diesem Artikel; wählt man „nichts“, fällt der Zettel im Epilog zu Boden.

### Artikel 5 – Berichtspflicht der Arbeitgeber
Stellschraube A: Ab welcher Größe müssen Betriebe ihre Entgeltlücke berichten? Optionen: keine Pflicht · ab `{wert:schwelle_gross}` Beschäftigten · gestaffelt ab `{wert:schwelle_mittel}` (größere häufiger, kleinere seltener; entspricht etwa der echten Staffelung) · ab `{wert:schwelle_klein}` · alle Betriebe.
Stellschraube B: Wer bekommt den Bericht? Optionen: nur die Behörde · Behörde und Beschäftigte · öffentlich.
Dies ist der umstrittenste Artikel (Kernanliegen von BFW, EVM und ASG). Der Juristische Dienst merkt bei „alle Betriebe“ an, dass Kleinstbetriebe mit wenigen Beschäftigten kaum aussagekräftige Durchschnitte haben (Datenschutz, kleine Gruppen).

### Artikel 6 – Was passiert, wenn eine Lücke gefunden wird
Stellschraube: Optionen: nichts weiter · Arbeitgeber müssen die Lücke begründen · wenn ein nicht begründeter Unterschied ab `{wert:schwelle_bewertung}` besteht und nicht in einer Frist behoben wird, folgt eine gemeinsame Entgeltbewertung mit der Arbeitnehmervertretung (entspricht etwa der echten Richtlinie) · automatische Nachzahlung an alle Betroffenen.
Hier zeigt Prof. Weiß’ Karte („Unerklärt heißt nicht automatisch Diskriminierung“) ihre Wirkung: Mit ihr kann man BFW und EVM von der Begründungs-Lösung überzeugen, ohne das Gesetz zahnlos zu machen.

### Artikel 7 – Durchsetzung
Stellschraube A: Beweislast: Beschäftigte müssen Diskriminierung beweisen · Wenn Beschäftigte Indizien vorlegen, muss der Arbeitgeber beweisen, dass keine Diskriminierung vorliegt (echt) · Beweislast generell beim Arbeitgeber.
Stellschraube B: Folgen: nur Nachzahlung · Nachzahlung plus Entschädigung und abschreckende Sanktionen, festgelegt von den Mitgliedstaaten (entspricht etwa der echten Richtlinie) · EU-weit einheitliche Mindestbußgelder.
Stellschraube C (optional, falls es nicht zu viel wird – frag mich in Phase 2): Dürfen Verbände und Gleichstellungsstellen für Beschäftigte klagen? nein · ja.

### Der Wunschzettel (zwei Extra-Vorschläge, siehe 4.3)
„Europaweite Kita-Garantie mit festem Platzanspruch“ und „Pflicht zur gleichen Aufteilung der Elternzeit“. Beide sind sinnvolle politische Ideen, aber nicht Teil dieses Gesetzes. Der Juristische Dienst erklärt es freundlich. Im Vergleich am Ende erscheint ein Kasten „Was es außerdem bräuchte“, der diese Themen würdigt und auf andere Instrumente verweist (z. B. `{fakt:wlb_rl}`), ohne zu behaupten, wie sie wirken.

### Umsetzungsfrist (nur im Trilog)
Im Trilog kommt eine achte Frage hinzu: Wie viel Zeit bekommen die Mitgliedstaaten für die Umsetzung? Optionen als Spielwerte (`frist_kurz`, `frist_mittel`, `frist_lang`). Der Rat will lang, ASG und GZL kurz. Im Vergleich: die echte Frist `{fakt:rl_frist}` ab `{fakt:rl_datum}`.

---

## 7. Grafikstil: „Kammerspiel im Modell“ – kinoreifes 3D

> **Anspruch:** „Mehrheit“ soll grafisch das Beeindruckendste sein, was die Jury je in einem Schülerprojekt gesehen hat. Echtes, aufwendiges 3D mit Kinolicht, weichen Schatten, Spiegelungen, Tiefenschärfe und Lichtstrahlen im Staub – und trotzdem ruhig, edel und gut lesbar. Gib dir hier richtig Mühe. Jede Szene wird so lange verfeinert, bis sie auf einem Standbild wie ein Filmstill aussieht. „Geht so“ ist bei der Grafik kein Zwischenstand, den du mir zeigst.

### 7.1 Die Grundidee

Die ganze Welt von „Mehrheit“ sieht aus wie **ein extrem hochwertiges Architekturmodell, das wie ein Kinofilm ausgeleuchtet ist**. Stell dir vor, ein Architekturbüro hätte das Europäische Parlament im Maßstab 1:20 aus mattweißem Kunstharz, hellem Eichenholz, gebürstetem Aluminium, Milchglas und Stoff gebaut – mit winzigen, beweglichen Gliederfiguren – und ein Kamerateam filmt darin mit Makro-Objektiven, Nebelmaschine und echten Lampen.

Daraus folgen drei Eigenschaften, die überall gelten:

1. **Materialien statt Farben.** Die Welt ist überwiegend hell und zurückhaltend (Weiß, Holz, Glas, Metall). Farbe kommt fast nur über **Licht** (warmes Lampenlicht, kühles Morgenlicht, Abendsonne) und über die **Fraktionsfarben**, die als lackierte Akzente, leuchtende Sitzlampen, Schals, Mappen und Namensschilder auftauchen. Dadurch sieht man auf einen Blick, „wer wo steht“.
2. **Licht ist die Hauptfigur der Grafik.** Jede Szene hat eine klare Lichtidee (7.3): Woher kommt das Licht, welche Farbe hat es, wo fallen die Schatten, wo glänzt etwas. Weiche Schatten, Kontaktschatten, Spiegelungen auf polierten Böden und Lichtstrahlen in der Luft machen den „Wow“-Effekt.
3. **Makro-Gefühl.** Durch Tiefenschärfe mit weichem Bokeh, leichte Vignette und eine Kamera, die sich langsam wie auf einer Schiene bewegt, wirkt alles kostbar und greifbar – wie ein Modell, über das man sich beugt.

**Was es ausdrücklich nicht sein darf:** kein Comic-3D, kein Knuddel-Look mit großen Köpfen, kein Low-Poly, keine Voxel, kein Plastik-Spielzeug-Look, keine Lebenssimulation, nichts, was an ein bekanntes Spiel erinnert. Auch kein Fotorealismus mit echten Gesichtern (das wirkt in einem Lernspiel schnell gruselig). Die Modell-Ästhetik ist der Kompromiss: hochwertig und realistisch beleuchtet, aber erkennbar gebaut und stilisiert.

### 7.2 Materialien (alle Werte in `data/stil.js`)

Alle Materialien folgen einem physikalisch basierten Modell (Grundfarbe, Rauheit, Metallanteil, optional Durchscheinen, Klarlack, Struktur). Texturen werden **beim Start im Code erzeugt** (Rauschen, Maserung, Faser, Gewebe) – es werden keine Bilder geladen.

| Material | Einsatz | Eigenschaften |
|---|---|---|
| **Modellharz** | Wände, Säulen, Treppen, Figuren-Grundkörper | sehr helles Warmweiß `#efece6`, Rauheit 0,55, minimales Durchscheinen an dünnen Kanten (Kanten leuchten im Gegenlicht leicht auf) |
| **Eiche hell** | Tische, Pulte, Wandverkleidung, Rednerpult | im Code erzeugte Maserung (verzerrtes Ringmuster + Poren), Rauheit 0,45, dünner Klarlack mit schwacher Spiegelung |
| **Aluminium gebürstet** | Stuhlbeine, Mikrofone, Geländer, Lampen | Metall 1, Rauheit 0,3, anisotrop gebürstet (Streifen in eine Richtung) |
| **Milchglas** | Trennwände, Lampenschirme, Fassaden-Innenseite | durchscheinend, Licht dahinter wird weich gestreut |
| **Klarglas** | Fenster, Dolmetschkabinen, Wassergläser, Glasmodell des Halbrunds | Spiegelung + Brechung genähert, Fresnel-Rand, feine Kratzer im Gegenlicht |
| **Teppich** | Plenarsaal, Büros | tiefes Graublau `#2f3a52`, Rauheit 0,95, feines Gewebe-Rauschen, schluckt Licht |
| **Polierter Steinboden** | Flure, Eingangshalle | hellgrau, Rauheit 0,15 – hier entstehen die schönen Spiegelungen |
| **Papier** | Gesetzentwurf, Akten, Haftnotizen | Faserstruktur, leichtes Durchscheinen (Gegenlicht zeigt die Rückseite schwach), Rauheit 0,8 |
| **Stoff** | Kleidung, Flaggen, Vorhänge | Gewebe-Struktur, Samt-Glanz am Rand (Schein bei flachem Winkel) |
| **Lack in Fraktionsfarbe** | Mappen, Namensschilder, Sitzlampen, Schals | Grundfarbe aus 7.9, Rauheit 0,25, Klarlack |
| **Kaffee, Wasser** | Becher, Gläser | dunkle, leicht spiegelnde Oberfläche, Dampf als weiche Teilchen |

Jedes Material hat in `data/stil.js` einen kommentierten Eintrag, damit ich Farben und Glanz selbst ändern kann.

### 7.3 Licht und Stimmung je Kapitel

Jedes Kapitel hat eine eigene **Lichtstimmung**, die die Geschichte erzählt – von hoffnungsvollem Morgen über konzentrierten Tag bis zur durchwachten Nacht und dem feierlichen Finale. Alle Werte (Farbtemperatur, Helligkeit, Nebeldichte, Sonnenrichtung) stehen in `data/stil.js` unter `stimmungen`.

| Kapitel | Licht | Wirkung |
|---|---|---|
| Titel | Morgendämmerung im leeren Plenarsaal, ein einzelner Sonnenstrahl durch das Glasdach, Staub tanzt darin | Stille vor dem Sturm |
| 1 Der Stapel | Kühles Morgenlicht durch große Fenster, Schreibtischlampe noch an, Stadt draußen im Dunst | Anfang, Respekt vor der Aufgabe |
| 2 Anhörung | Gleichmäßiges, helles Saallicht von oben (Flächenleuchten), warme Spots auf die Gäste | Sachlich, aufmerksam |
| 3 Entwurf | Später Vormittag, Sonne fällt schräg über den Schreibtisch, harte Fensterkreuz-Schatten auf dem Papier, Lichtflecken | Konzentration |
| 4 Flure | Nachmittag: lange Sonnenbahnen im Flur, Spiegelungen im Steinboden, Gegenlicht an den Figuren | Bewegung, Begegnungen |
| 5 Ausschuss | Kunstlicht, leicht kühl; bei der Abstimmung leuchten die Sitzlampen in Fraktionsfarben auf | Spannung |
| 6 Trilog | Nacht. Nur eine große, warme Pendelleuchte über dem Tisch, alles andere fast schwarz; Regen auf den Fenstern, Stadtlichter verschwommen im Hintergrund; gegen Ende wird es draußen langsam blau | Erschöpfung, Nähe, Durchbruch |
| 7 Plenum | Festliches, helles Licht; Glasdach mit Tageslicht, das langsam von Wolken gedimmt wird, während abgestimmt wird; beim Ergebnis bricht die Sonne durch | Feierlich |
| Epilog | Weicher, leicht überbelichteter „Erinnerungs“-Look, Kamerafahrt über die Collage auf einem Tisch | Nachdenklich |

Lichtquellen pro Szene: eine Hauptlichtquelle mit weichem Schatten (Sonne oder große Leuchte), ein Himmels-/Umgebungslicht aus einer im Code erzeugten Umgebung (für Spiegelungen und weiches Füllicht), bis zu **acht kleinere Lichter** (Lampen, Sitzlampen) ohne eigene Schattenkarte, plus „leuchtende“ Materialien (Bildschirme, Lampenschirme, Sitzlampen), die über Bloom strahlen.

### 7.4 Kamera und Bildsprache

Die Kamera ist ein **Kamerateam**, keine freie Spielkamera:

- **Brennweiten:** Totale mit etwa 35 mm (Übersicht über einen Raum), Halbnah mit 50 mm (Gespräche), Nah mit 85 mm (Gesicht/Hände), Makro (Dokument, Stempel, Kaffeetasse). Die Werte stehen als Kameravorlagen in `data/kameras.js`.
- **Tiefenschärfe:** Immer dort, wo die Aufmerksamkeit liegen soll. Bei Gesprächen liegt die Schärfe auf der sprechenden Person, der Hintergrund verschwimmt in weichem Bokeh mit runden Lichtpunkten. Bei Entscheidungen wandert die Schärfe („Schärfe ziehen“) vom Papier zum Glasmodell des Halbrunds, wenn sich die Mehrheit ändert.
- **Bewegung:** Langsame Fahrten (Dolly), sanfte Schwenks, ganz leichtes „Atmen“ der Kamera (wenige Millimeter, im Modellmaßstab). Keine wackelnde Handkamera, keine schnellen Schnitte außer bei der Abstimmung.
- **Schnitte:** Beim Gespräch klassisch Schuss/Gegenschuss über die Schulter. Beim Wechsel zwischen Orten eine kurze Fahrt oder eine weiche Abblende über Schwarz mit Papiergeräusch.
- **Bildaufbau:** Drittelregel, viel Luft über den Köpfen in großen Räumen, Linien des Raums (Reihen im Plenum, Flurfluchten) führen den Blick.
- **Kamerafahrten (Pflicht):** (a) Titel: Flug durch den leeren Plenarsaal; (b) Kapitel 2: Fahrt am Hufeisentisch entlang an allen Gästen vorbei; (c) Kapitel 4: Draufsicht auf das Schnittmodell, Zoom in einen Raum; (d) Kapitel 6: Kamera kreist langsam um den Tisch, während die Stunden vergehen; (e) Kapitel 7: Abstimmung als Kranfahrt über das Halbrund, Sitzlampe für Sitzlampe leuchtet auf.
- Bei **„Bewegung reduzieren“** werden alle Fahrten durch ruhige Standbilder mit weicher Überblendung ersetzt; die Tiefenschärfe bleibt.

### 7.5 Bildeffekte (Nachbearbeitung) und Grafikstufen

Die Bildqualität entsteht zu einem großen Teil in der Nachbearbeitung. Alle Effekte selbst geschrieben (WebGL 2, Abschnitt 10):

| Effekt | Ultra | Hoch | Mittel | Niedrig |
|---|---|---|---|---|
| Rendern in HDR (Gleitkomma-Puffer), filmische Tonwertkurve | ✓ | ✓ | ✓ | ✓ (vereinfacht) |
| Weiche Schatten der Hauptlichtquelle (Schattenkarte, gefiltert, weiche Kanten je nach Abstand) | 4096 px, sehr weich | 2048 px | 1024 px | 1024 px, hart |
| Umgebungsverdeckung (Kontaktschatten in Ecken und unter Gegenständen, im Bildraum berechnet) | hohe Qualität | normal | halbe Auflösung | nur vorberechnet in den Ecken der Modelle |
| Spiegelungen auf Böden und Tischen (Spiegel-Ebene bzw. Bildraum-Spiegelung) | ✓ | ✓ | nur Boden, halbe Auflösung | Umgebungsspiegelung |
| Lichtstrahlen im Staub (volumetrisches Licht) | ✓ | ✓ | vereinfacht | – |
| Bloom (Leuchten heller Stellen) | ✓ | ✓ | ✓ | schwach |
| Tiefenschärfe mit Bokeh | ✓ (runde Bokeh-Formen) | ✓ | einfache Unschärfe | – |
| Kantenglättung (zeitlich oder FXAA-ähnlich) | zeitlich | zeitlich | FXAA-ähnlich | FXAA-ähnlich |
| Farbkorrektur je Stimmung (Farbtabelle im Code erzeugt) | ✓ | ✓ | ✓ | ✓ |
| Filmkorn, leichte Vignette, minimale chromatische Aberration am Rand | ✓ | ✓ | ✓ | nur Vignette |
| Teilchen (Staub, Dampf, Regen auf Glas) | viele | normal | wenige | nur Dampf |
| Renderskala | 1,0 (bis 1,5 auf großen Bildschirmen) | 1,0 | 0,85 | 0,7 |

**Automatische Wahl:** Beim ersten Start misst das Spiel einige Sekunden lang die Bildrate im Titelbildschirm und wählt die passende Stufe. Fällt die Bildrate im Spiel länger unter 28 FPS, sinkt die Stufe einen Schritt (mit kleinem Hinweis). In den Einstellungen kann man die Stufe von Hand wählen.

**Ziel:** „Ultra“ auf einem guten Laptop mit eigener Grafikkarte sieht aus wie ein Filmstill. „Niedrig“ läuft mit mindestens 30 FPS auf einem Schul-Laptop mit Onboard-Grafik und einem älteren iPad – und sieht trotzdem noch gepflegt aus (gute Materialien und vorberechnete Schatten tragen dort das Bild).

### 7.6 Die Schauplätze im Detail

Alle Räume sind **erfunden** und an keinen echten Raum im Detail angelehnt; die Form (Halbrund, Ausschusssaal, Glasdach) ist allgemein parlamentarisch. Alles wird im Code aus Bausteinen erzeugt (Abschnitt 10.4).

**Das Büro (Kapitel 1 und 3).** Ein schmaler Raum mit einer Fensterwand aus Glas und Aluminiumprofilen, dahinter eine dunstige Stadtsilhouette aus einfachen, hellen Blöcken (keine echten Wahrzeichen). Schreibtisch aus heller Eiche, darauf: der Gesetzentwurf (7.8), ein Stapel Akten mit farbigen Reitern, eine Schreibtischlampe mit Milchglasschirm, ein Becher mit Dampf, ein Bildschirm (leuchtend, zeigt Miras Mail), eine Pflanze mit großen Blättern, das **Glasmodell des Halbrunds** (7.9). An der Wand eine Pinnwand mit Inès’ Zettel. Regal mit Ordnern, deren Rücken Fraktionsfarben haben. Mira sitzt an einem kleinen Tisch daneben.

**Der Ausschusssaal (Kapitel 2 und 5).** Hufeisenförmiger Tisch aus Eiche mit Mikrofonen (gebürstetes Aluminium, rote Leuchtringe am Mikrofon, wenn jemand spricht), Namensschilder in Fraktionsfarben, Wasserflaschen und Gläser, die das Licht brechen. An der Rückwand hinter Glas die Dolmetschkabinen mit warmem Licht und Silhouetten. Flaggen an Ständern: die Europaflagge und Flaggen der Mitgliedstaaten als Stoff (sanft bewegt), aber **keine Logos von Institutionen**. Decke mit großen, leuchtenden Milchglasfeldern.

**Die Flure (Kapitel 4) – das Schnittmodell.** Statt eines flachen Grundrisses ist das Gebäude ein **aufgeschnittenes Architekturmodell** auf einer dunklen Tischplatte: drei Etagen, die vordere Wand und das Dach fehlen, man sieht wie in ein Puppenhaus aus edlem Material hinein. Flure mit Steinboden, Büros der Fraktionen (an Möbeln und Mappen in Fraktionsfarbe erkennbar), eine Cafeteria mit Hochtischen und Kaffeemaschine (Dampf), eine Bibliothek mit Regalwänden, Treppen, Aufzug mit leuchtender Anzeige. Die Kamera schaut schräg von oben (Draufsicht mit etwa 40° Neigung, langsam drehbar um die Mittelachse mit zwei Fingern oder Q/E). Die Spielfigur und die Schattenberichterstatter*innen sind als Gliederfiguren sichtbar und gehen sichtbar durch die Flure (vorgegebene Wege). Beim Antippen eines Raums fährt die Kamera in den Raum hinein, bis die Wand „verschwindet“ und das Gespräch in Halbnah beginnt. Lichtstimmung: Nachmittagssonne, die durch die Fenster der Rückseite in langen Bahnen über die Böden fällt.

**Der Trilog-Raum (Kapitel 6).** Fensterloser Raum mit einem langen, dunklen Tisch, darauf die Vier-Spalten-Tabelle als großes Papier, Laptops mit leuchtenden Bildschirmen, Kaffeebecher, die sich im Laufe der Nacht vermehren, Wassergläser mit Kondenstropfen. Einzige Lichtquelle: eine große Pendelleuchte (warm) – die Gesichter der Figuren liegen halb im Schatten. An einer Seite doch ein Fenster mit Regentropfen, die herunterlaufen (Brechung der Stadtlichter dahinter). Gegen Morgen färbt sich das Fenster blau.

**Der Plenarsaal (Kapitel 7 und Titel).** Ein großes Halbrund mit ansteigenden Sitzreihen aus heller Eiche, Teppich in Graublau, **einhundertzwanzig Plätze** mit Pult, Stuhl, Mikrofon und einer kleinen **Sitzlampe**, die bei der Abstimmung in der Farbe der Stimme leuchtet (Ja, Nein, Enthaltung – zusätzlich durch Form unterscheidbar, 9). Oben ein Glasdach mit Stahlträgern, durch das Tageslicht in Strahlen fällt. Vorne das Präsidium und das Rednerpult, dahinter eine große, leere helle Wand. Auf den Rängen Besucher*innen als kleinere Gliederfiguren. Bei der Abstimmung: Gemurmel, Lichter springen in Wellen an, Kranfahrt.

**Titelbildschirm.** Siehe 7.12.

### 7.7 Figuren in 3D: Gliederfiguren aus dem Modellbau

Alle Figuren sind **edle Gliederfiguren**, wie man sie aus Architekturmodellen und Zeichenmodellen kennt – aber mit Persönlichkeit:

- **Bauweise:** Der Körper besteht aus einzelnen, sauber modellierten Teilen (Kopf, Hals, Brustkorb, Becken, Ober-/Unterarm, Hand, Ober-/Unterschenkel, Fuß), die an Gelenken verbunden sind. Die Gelenke sind dezent sichtbar (kleine Fugen) – das ist gewollt und Teil des Stils. Dadurch braucht es keine aufwendige Haut-Verformung: Jedes Teil ist starr und wird nur gedreht. Teile werden im Code aus abgerundeten Grundkörpern (Kapseln, verformte Kugeln, gedrehte Profile) erzeugt.
- **Proportionen:** realistisch schlank, etwa siebeneinhalb Kopflängen; keine großen Köpfe, keine Kulleraugen.
- **Material:** Körper in **Modellharz**, eingefärbt in einem von acht natürlichen Hauttönen (matt, mit ganz leichtem Durchscheinen an Ohren und Fingern im Gegenlicht). Kleidung als **separate Hülle** aus Stoff-Material (Jackett, Blazer, Pullover, Hemd, Bluse, Kleid, Hose, Rock, Kittel), mit eigenen Faltenkanten aus der Geometrie.
- **Gesichter:** Ein fein modellierter, ruhiger Kopf: Nasenrücken, Augenbrauenbogen, Wangenknochen und Kinn als sanfte Formen; **Augen als zwei kleine, matte, dunkle Einlagen ohne Glanzpunkt**, kein gemalter Mund (der Kiefer bewegt sich beim Sprechen minimal). Gefühle zeigen sich über **Körpersprache**, nicht über Mimik.
- **Haare und Kopfbedeckungen** als eigene, plastisch geformte Teile (glatt gekämmt, Locken als Gruppe kleiner Kugeln, Zopf, Dutt, Kurzhaar mit Struktur, Glatze, Bart, Kopftuch aus Stoff mit Faltenwurf, Turban, Kippa, Mütze), Brillen aus feinem Metall mit Glas, Ohrringe, Hörgeräte, Uhren.
- **Vielfalt:** Alter (20 bis 70), Körperbau (schmal bis kräftig), Größe, Hautton, Rollstuhl (aus Aluminium und Stoff, Räder drehen sich), Gehstock, Prothese. Alle Werte in `data/figuren.js` als Baukasten.
- **Fraktions-Erkennung:** Jede Figur trägt ein Element in der Fraktionsfarbe (Schal, Mappe, Krawatte, Brillenrahmen, Anstecker) – nie das ganze Outfit.
- **Animation (prozedural, im Code):** Atmen (Brustkorb hebt sich), Gewicht verlagern, Kopf zur sprechenden Person drehen, Blick nachführen, Gesten aus einer kleinen Bibliothek: Hand heben, auf das Papier zeigen, Arme verschränken, nicken, Kopf neigen, Brille abnehmen, Kaffeebecher anheben, sich zurücklehnen, aufstehen, gehen (Gehzyklus mit Fuß-Bodenkontakt per einfacher Bein-Lösung, damit nichts rutscht). Jede Geste dauert 0,6–1,5 s und wird weich überblendet. Gesten werden in den Gesprächsdaten pro Satz angegeben (z. B. `geste: "arme_verschraenken"`).
- **Detailstufen:** Nah (alle Teile, Kleidung mit Falten, Finger einzeln), mittel (Finger als Fäustlinge), fern (vereinfachter Körper, für Besucher*innen und Plenum). Die Stufen wechseln weich nach Entfernung.

### 7.8 Das Gesetz: ein echtes 3D-Dokument – und gut lesbar

Der Gesetzentwurf ist ein **3D-Papierstapel** auf dem Schreibtisch: einzelne Blätter mit leichter Wölbung, Büroklammer, Eselsohr, farbigen Klebe-Reitern an den Artikeln. Die Seiten zeigen den echten aktuellen Text, gerendert als hochauflösende Textur (im Code mit Canvas 2D gesetzt, in Georgia/Times, mit Änderungsmarkierungen in Fraktionsfarben). Beim Umblättern biegt sich das Blatt physikalisch glaubwürdig (Blatt als fein unterteiltes Netz, das sich um eine wandernde Achse krümmt) – mit Papiergeräusch.

**Lesbarkeit geht vor:** Sobald man einen Artikel bearbeitet, fährt die Kamera in eine Makro-Ansicht auf die Seite, und **über die 3D-Seite legt sich deckungsgleich eine scharfe HTML-Ebene** mit demselben Text (für perfekte Schrift, Bildschirmleser, Kopieren und Schriftgrößen-Einstellung). In der Totalen sieht man nur die 3D-Textur. Der Übergang ist eine weiche Überblendung, man soll ihn nicht bemerken.

**Änderungsmodus in 3D:** Wählt man eine Option, zieht eine **Füllfeder-Spitze** (kleines 3D-Objekt) einen Strich durch den alten Text, und der neue Text erscheint, als würde Tinte ins Papier sinken (Textur-Animation von dunkel-nass zu trocken-matt, kurzes Glänzen). Randbemerkungen des Juristischen Dienstes erscheinen als **Haftnotiz**, die auf das Blatt fällt und sich leicht wölbt; Warnungen tragen einen kleinen Bernstein-Stempel mit Paragrafenzeichen.

**Stempel** sind echte 3D-Stempel (Holzgriff, Gummiplatte), die von oben ins Bild kommen, mit Schwung aufsetzen (Kamera wackelt einmal minimal), und einen Abdruck mit unregelmäßiger Stempelfarbe hinterlassen: „EINGEREICHT“, „ANGENOMMEN“, „ABGELEHNT“, „KOMPROMISS“, „VERTRAULICH“.

### 7.9 Das Halbrund: ein Glasmodell mit Licht

Auf dem Schreibtisch steht ein **Modell des Ausschusses als gläsernes Halbrund** (etwa unterarmlang im Modellmaßstab) mit **sechzig kleinen Glaswürfeln** als Sitze. Jeder Würfel leuchtet von innen in der Farbe der Fraktion, und seine **Form** zeigt die Stimme: aufrecht leuchtend = Ja, gedimmt und gekippt = Nein, halb leuchtend = Enthaltung (für Farbsehschwäche zusätzlich Muster auf dem Sockel, 9). Ändert sich die Mehrheit, wandern die Lichter mit kurzer Verzögerung von Würfel zu Würfel, und das ganze Modell wirft farbiges, gebrochenes Licht auf Papier und Tisch (Kaustik genähert über eine Lichttextur). Eine feine Linie aus Licht markiert die Mehrheit.

Darunter steht die **Fraktionsleiste** als HTML-Oberfläche (scharf, lesbar), die Wirkungsanzeige ebenfalls als HTML (Abschnitt 5.6), beide auf halbtransparentem, mattiertem „Glas“ mit weichem Schatten.

**Fraktionsfarben** (lackierte Akzente und Licht; für Licht etwas gesättigter):
- BFW: Bernstein `#e0a526`
- EVM: Kobaltblau `#3a6fd1`
- ASG: Signalrot `#d6453a`
- GZL: Smaragd `#2f9a5a`
- BSN: Pflaume `#8a4f7d`
- FU: Silbergrau `#9aa0aa`
- Brücke (Spielfigur): Petrol `#00a2ad`

### 7.10 Oberfläche über dem 3D-Bild

Die eigentliche Bedienung bleibt **HTML über dem 3D-Bild** – gestochen scharf, barrierefrei, unabhängig von der Grafikstufe:

- Stil der Oberfläche: **mattiertes Glas** (halbtransparente Fläche mit Unschärfe des Hintergrunds per `backdrop-filter`, wo verfügbar, sonst helle deckende Fläche), dünne helle Ränder, weiche Schatten, abgerundete Ecken (8 px). Schrift für die Oberfläche: `system-ui, "Segoe UI", -apple-system, "Helvetica Neue", Arial, sans-serif`; Gesetzestext und Kapiteltitel: `Georgia, "Times New Roman", serif`; Zahlen/Uhrzeiten: `ui-monospace, Consolas, monospace`.
- **Gesprächsleiste** unten (Abschnitt 5.5): Name und Rolle der sprechenden Figur, Text, zwei bis drei Antwortknöpfe; die Figur selbst sieht man im 3D-Bild darüber in Halbnah. Kein Porträt-Bild nötig – das 3D-Bild ist das Porträt.
- **Kapitelkarten** als große Georgia-Titel, die über dem langsam unscharf werdenden 3D-Bild einblenden.
- **Kalender, Dossier, Pause** als kleine Glasknöpfe oben rechts.
- **Dossier**: Die Karten sind im 3D-Bild als echte Karteikarten auf dem Tisch zu sehen; in der Bedienung öffnet sich eine HTML-Kartenreihe (wischen, antippen, vorlegen).
- Die Oberfläche verdeckt nie mehr als ein Drittel des Bildes; im Hochformat wird sie unten gestapelt und das 3D-Bild rückt nach oben (Kamera passt den Bildausschnitt an).

### 7.11 Bewegung und Ton

**Bewegung:** Alles bewegt sich mit Gewicht und Dämpfung (weiche Beschleunigung, kein lineares Gleiten). Figuren reagieren auf Ereignisse: Wenn eine Fraktion zustimmt, nickt ihre Schattenberichterstatterin im Hintergrund; wenn sie verärgert ist, lehnt sie sich zurück. Stempel und Abstimmung sind die einzigen „lauten“ Momente. Kein Konfetti, keine Explosionen.

**Ton (Web Audio API, alles im Code erzeugt):** Raumhall je Ort (kleiner Raum, Saal, großes Plenum – Hall per im Code erzeugter Impulsantwort), Papierrascheln, Füllfeder auf Papier, Stempel, Holzhammer der Sitzungsleitung, Schritte auf Stein und Teppich (räumlich, je nach Position), Kaffeemaschine, Regen am Fenster, Gemurmel im Plenum (gefiltertes Rauschen in mehreren Schichten), leises Summen der Sitzlampen, ein ruhiges, im Code erzeugtes Klavier-/Synthesizer-Motiv für Titel und Epilog (wenige Töne, kein Ohrwurm). Keine Sprachausgabe. Alles abschaltbar, getrennte Regler für Musik und Geräusche, Standard leise. Ton startet erst nach der ersten Eingabe.

### 7.12 Titelbildschirm

Schwarz. Ein tiefer, warmer Ton. Ein einzelner Sonnenstrahl fällt durch das Glasdach in den **leeren Plenarsaal im Morgengrauen**, Staub schwebt darin. Die Kamera gleitet langsam in einer großen Kurve über die Sitzreihen, an einer Sitzlampe vorbei, die kurz aufflackert. Unten auf dem Rednerpult liegt ein Blatt; die Kamera senkt sich darauf, Tinte erscheint: „Richtlinie über …“ – „über“ wird durchgestrichen, „gegen die Lohnlücke“ eingefügt. Darüber hebt sich der Titel **MEHRHEIT** als geprägte, plastische Buchstaben aus dem Papier (Prägung mit Licht und Schatten). Menü als schlichte Glasknöpfe links unten: „Weiterspielen“, „Neue Legislatur“, „Einstellungen“, „Über das Spiel“. Unten klein: „Alle Personen und Fraktionen sind erfunden. Die Richtlinie und die Zahlen sind echt – Quellen am Ende.“ Die Fahrt läuft als Schleife weiter, solange das Menü offen ist (bei „Bewegung reduzieren“: Standbild).

### 7.13 Qualitätsregeln für die Grafik (bei jeder Phase prüfen)

- Jede Szene hat **ein klares Licht-Konzept**, sichtbare weiche Schatten und Kontaktschatten – nichts „schwebt“.
- Keine flachen, einfarbigen, unbeleuchteten Flächen; jede Fläche hat Materialstruktur (Maserung, Korn, Gewebe).
- Kanten haben eine kleine Rundung (Fase), damit Licht darauf glänzt – das ist der wichtigste Trick für den hochwertigen Modell-Look.
- Keine Treppchen an Kanten (Kantenglättung), kein Flimmern bei Bewegung, keine sichtbaren Schatten-Artefakte (Streifen, „Peter-Panning“).
- Text ist immer gestochen scharf (HTML-Ebene), auch wenn der Hintergrund unscharf ist.
- Jede Phase liefert **Standbilder in Filmqualität** von jeder neuen Szene (Ultra und Niedrig nebeneinander) und ein kurzes Vorher/Nachher, wenn Grafik verbessert wurde.
- Wenn ein Effekt auf „Niedrig“ das Bild verschlechtert statt verbessert, wird er dort abgeschaltet.

---

## 8. Ton und Sprache der Texte

- Sätze kurz (höchstens 20 Wörter), aktiv, konkret. Fachbegriffe beim ersten Auftreten erklären (Tooltip/aufklappbar: kleines „?“ neben dem Wort, Erklärungen in `data/glossar.js`).
- Jede Figur hat eine eigene Sprechweise: Mira schnell und flapsig, Tiago höflich und lang, Hanna knapp und genau, Marinescu freundlich und listenartig, Pieter mit Gründer-Vokabular, Maria mit Bildern aus dem Dorf, Luca mit Fabrikbeispielen, Aoife mit Fragen, Jaroslav mit Geschichten aus dem Klassenzimmer, Sofia mit Schichtdienst.
- Gesetzestexte klingen nach Gesetz („Die Mitgliedstaaten stellen sicher, dass …“), bleiben aber verständlich; jedes Fachwort im Gesetzestext hat einen Glossar-Eintrag.
- Kein Moralisieren. Das Spiel kommentiert Entscheidungen nicht mit „gut“ oder „schlecht“, sondern zeigt Folgen und Gegenargumente.
- Alle Texte zusammen sollen in 15–25 Minuten lesbar sein: Grob höchstens 6.000 Wörter Spieltext pro Durchgang. Du zählst das im Debug-Modus und meldest es in jeder Phase.

---

## 9. Barrierefreiheit und Einstellungen

- **Vollständig mit Tastatur spielbar:** Tab-Reihenfolge logisch, sichtbarer Fokusrahmen (Petrol, 3 px), Pfeiltasten wechseln Optionen, Enter wählt, Esc schließt Fenster, Zahlen 1–3 wählen Antworten, D öffnet das Dossier, Leertaste zeigt Text sofort vollständig.
- **Bildschirmleser:** echte Knöpfe (`<button>`), Überschriften-Hierarchie, `aria-live` für Abstimmungsergebnisse und neue Karten, Halbrund mit Textalternative („Ja: 34, Nein: 20, Enthaltung: 6 – Mehrheit erreicht“), das 3D-Bild selbst als `aria-hidden` mit einer kurzen Szenenbeschreibung pro Kapitel als Text.
- **Farbsehschwäche:** Jede Fraktion hat ein Muster; Zustände (Ja/Nein/Enthaltung) unterscheiden sich durch Form (voll/leer/halb), nicht nur durch Farbe.
- **Einstellungen** (im Titel und im Pausemenü): Ton an/aus und Lautstärke, Schriftgröße (100/120/140 %), hoher Kontrast (reines Weiß/Schwarz, dickere Linien, keine Papierstruktur), Bewegung reduzieren (keine Animationen, keine Schreibmaschine; Betriebssystem-Einstellung wird übernommen), Schreibmaschinen-Tempo, „Lesehilfe“ (zeigt bei jedem Artikel eine Ein-Satz-Zusammenfassung in einfacher Sprache).
- **Grafik-Einstellungen:** Grafikstufe (Automatisch, Ultra, Hoch, Mittel, Niedrig), Tiefenschärfe an/aus, Filmkorn an/aus, Bildschirmhelligkeit. „Hoher Kontrast“ schaltet zusätzlich Tiefenschärfe, Korn und Vignette ab und legt hinter alle Texte deckende Flächen.
- **Bewegung reduzieren** ersetzt alle Kamerafahrten durch weiche Überblendungen, schaltet das Kamera-Atmen ab und lässt Figuren nur noch langsam gestikulieren.
- Kein Zeitdruck in Echtzeit, keine Reaktionsaufgaben.

---

## 10. Technik

### 10.1 Grundsätze

- **Vanilla JavaScript ohne Module**, normale `<script>`-Tags in fester Reihenfolge, damit das Spiel per **Doppelklick auf `mehrheit/index.html`** läuft (`file://`). Kein `fetch`, kein XHR, keine Cookies. Shader stehen als Zeichenketten in eigenen `.js`-Dateien (nicht als externe Dateien, die geladen werden müssten).
- **3D mit WebGL 2 und einer eigenen 3D-Maschine** im Namensraum `MOTOR` (Ordner `js/motor/`). Keine Bibliotheken, keine CDNs, keine Modelle, Texturen, Schriften, Töne oder Daten von außen. Alle Geometrie, alle Texturen und alle Töne werden im Code erzeugt.
- **Oberfläche und Text als HTML/CSS über dem 3D-Bild** (Namensraum `ANSICHT`), damit Text immer scharf, barrierefrei und unabhängig von der Grafikstufe ist.
- **Rückfallebenen:** (1) WebGL 2 mit allen Effekten je nach Grafikstufe; (2) wenn WebGL 2 fehlt: WebGL 1 mit Stufe „Niedrig“ (ohne Gleitkomma-Puffer: einfache Tonwertkurve im Hauptshader, keine Bildraum-Effekte); (3) wenn gar kein WebGL geht: **„Dokumentmodus“** – das Spiel ist vollständig als HTML spielbar (Gesetzestext, Halbrund als SVG, Gespräche mit Namen), mit einem freundlichen Hinweis, wie man die Hardwarebeschleunigung einschaltet. Kein Spielinhalt darf nur im 3D-Bild stecken.
- Läuft offline in aktuellen Versionen von Edge, Chrome, Firefox (Windows), Safari (iPad, macOS) und auf GitHub Pages. Gesamtgröße unter 3 MB.
- **Leistung:** Ultra flüssig auf einem Laptop mit eigener Grafikkarte; „Niedrig“ mit mindestens 30 FPS auf einem Schul-Laptop mit Onboard-Grafik und einem älteren iPad. Ziel-Budgets pro Bild auf „Hoch“: höchstens 300 Zeichenaufrufe, höchstens 1,5 Mio. Dreiecke, Schattenkarte nur neu berechnen, wenn sich etwas bewegt hat. Viele gleiche Objekte (Sitze, Stühle, Mikrofone, Bücher) immer per Instancing in einem Aufruf.
- **Speicher:** Texturen im Code erzeugt und wiederverwendet; beim Szenenwechsel Puffer und Texturen freigeben; Verlust des WebGL-Kontexts (passiert auf Tablets) abfangen und alles neu aufbauen.
- Namensräume: `DATA` (Daten), `MOTOR` (3D-Maschine), `WELT` (Szenen, Figuren, Bausteine), `ANSICHT` (HTML-Oberfläche), `LOGIK` (Spielzustand, Berechnungen, Ablauf). Code-Bezeichner und Kommentare auf Deutsch.

### 10.2 Dateien

```
mehrheit/
  index.html
  css/stil.css
  data/stil.js          Materialien, Stimmungen, Fraktionsfarben, Grafikstufen, Oberfläche
  data/kameras.js       Kameravorlagen und Kamerafahrten je Szene
  data/szenen.js        Aufbau der Räume aus Bausteinen (Positionen, Maße, Materialien)
  data/texte.js         Oberflächentexte, Kapitelkarten, Menüs
  data/fakten.js        alle echten Zahlen und Fakten (verifiziert: false)
  data/spielwerte.js    Spielmechanik-Zahlen (Sitze, Termine, Schwellen-Optionen)
  data/fraktionen.js    Fraktionen, Sitze, Haltungen, Schwellen
  data/figuren.js       Figuren-Baukasten (Körper, Kleidung, Haare, Farben, Gesten)
  data/artikel.js       Artikel, Optionen, Wortlaute, Haltungen, Wirkungen
  data/karten.js        Dossier-Karten
  data/gespraeche.js    alle Gespräche inkl. Gesten und Kameraeinstellungen pro Satz
  data/trilog.js        Ratsposition, Mittelwege
  data/epilog.js        Epilog-Bausteine, Schlagzeilen
  data/vergleich.js     Vergleichstexte „Deine Fassung / echte Richtlinie / warum“
  data/glossar.js       Fachbegriffe
  js/motor/gl.js           WebGL-2-Kontext, Erweiterungen, Kontextverlust, Rückfall
  js/motor/mathe.js        Vektoren, Matrizen, Quaternionen
  js/motor/shader.js       Shader-Quelltexte (PBR, Schatten, Nachbearbeitung) und Kompilierung
  js/motor/geometrie.js    Grundkörper und Werkzeuge: Box mit Fase, Kapsel, Drehkörper, Extrusion, Unterteilung
  js/motor/texturen.js     prozedurale Texturen (Maserung, Korn, Gewebe, Kratzer, Umgebung)
  js/motor/renderer.js     Szene zeichnen, Instancing, Lichter, Schattenkarte, Sichtbarkeit
  js/motor/nachbearbeitung.js  HDR, Umgebungsverdeckung, Spiegelung, Bloom, Tiefenschärfe, Lichtstrahlen, Kantenglättung, Farbkorrektur, Korn
  js/motor/teilchen.js     Staub, Dampf, Regen auf Glas
  js/motor/kamera.js       Kamera, Fahrten, Schärfe ziehen
  js/motor/qualitaet.js    Grafikstufen, Messung, automatische Anpassung
  js/welt/bausteine.js     Möbel, Räume, Halbrund, Glasmodell, Papier, Stempel, Flaggen …
  js/welt/figuren.js       Gliederfiguren, Kleidung, Haare, Gesten, Gehen
  js/welt/dokument3d.js    3D-Papier, Textur aus Text, Umblättern, Tinte, Füllfeder
  js/welt/szenen.js        Büro, Ausschusssaal, Schnittmodell, Trilog, Plenum, Titel, Epilog
  js/logik/stand.js     Spielstand, Speichern
  js/logik/mehrheit.js  Zustimmung, Abstimmung, Wirkung
  js/logik/ablauf.js    Kapitel, Termine, Übergänge
  js/logik/gespraech.js Gesprächsknoten, Bedingungen, Aktionen
  js/ansicht/dokument.js   HTML-Ebene des Gesetzestexts, Änderungsmodus, Optionsleisten
  js/ansicht/leiste.js     Gesprächsleiste, Dossier, Fraktionsleiste, Wirkungsanzeige
  js/ansicht/menues.js     Titelmenü, Einstellungen, Pause, Vergleich, Reflexion, Credits
  js/ansicht/dokumentmodus.js  Rückfall ohne WebGL (HTML/SVG)
  js/ansicht/ton.js        Web-Audio-Töne, Raumhall, Musik-Motiv
  js/debug.js
  js/start.js
  README.md, QUELLEN.md, KI-DOKUMENTATION.md, CLAUDE.md
```

### 10.3 Touch-Regeln aus Erfahrung (zwingend)

- Knöpfe werden **nie** beim Überfahren (Hover) neu aufgebaut oder ausgetauscht. Hover-Effekte nur, wenn `pointerType === "mouse"` (per Klasse setzen, nicht per `:hover` allein), sonst verschluckt Safari auf dem iPad den ersten Tipp.
- Alle Knöpfe und tippbaren Flächen: `touch-action: manipulation`, mindestens 44 × 44 px.
- Ziehen (Karten ins Feld „Vorlegen“) muss immer auch per Antippen gehen (Karte antippen → Feld antippen).
- Kein Text-Markieren bei Doppeltipp auf Knöpfe (`user-select: none` dort, aber nicht im Gesetzestext und nicht in der Vergleichstabelle – die soll man kopieren können).

### 10.4 Die eigene 3D-Maschine – Anforderungen im Detail

- **Rendering:** Vorwärts-Rendering in einen HDR-Puffer (RGBA16F, wo verfügbar), physikalisch basiertes Licht (GGX-Glanz, Fresnel, energieerhaltend), Umgebungslicht aus einer beim Start im Code erzeugten Umgebungs-Würfeltextur (Himmel/Raum je Stimmung, vorgefiltert für verschiedene Rauheiten), Hauptlicht mit Schattenkarte (gefiltert für weiche Kanten, Abstand-abhängige Weichheit), bis zu acht Zusatzlichter ohne Schatten, leuchtende Materialien.
- **Geometrie aus Code:** Alle Möbel, Räume und Figuren entstehen aus Bausteinen: Box mit abgerundeten Kanten (Fase), Kapsel, Drehkörper aus Profil (Lampen, Gläser, Becher), Extrusion aus 2D-Umriss (Pulte, Halbrund-Reihen), Rohr entlang Kurve (Geländer, Kabel), unterteilte Ebene (Papier, Stoff). Normalen sauber, Kanten mit Fase, damit Licht darauf glänzt. Statische Teile einer Szene werden pro Material zu wenigen großen Puffern zusammengefasst.
- **Vorberechnete Verdeckung:** Für statische Szenen wird beim Laden pro Eckpunkt eine einfache Umgebungsverdeckung berechnet (Strahlen gegen die Szene, im Hintergrund in kleinen Portionen), damit auch „Niedrig“ Kontaktschatten hat.
- **Spiegelungen:** Spiegel-Ebene für den Steinboden und Tischplatten (Szene gespiegelt in halbe Auflösung rendern, mit Rauheit verwischen) auf Hoch/Ultra; sonst Umgebungs-Würfeltextur.
- **Nachbearbeitung:** in dieser Reihenfolge – Umgebungsverdeckung im Bildraum → Lichtstrahlen (Strahlenverfolgung entlang des Lichts im Bildraum mit Schattenkarte) → Tiefenschärfe (Streukreis aus Tiefe, Bokeh) → Bloom (mehrstufig herunter- und hochgerechnet) → Tonwertkurve (filmisch) → Farbkorrektur (Farbtabelle) → Kantenglättung → Korn, Vignette, chromatische Aberration.
- **Text auf 3D-Papier:** Canvas 2D setzt die Seite in hoher Auflösung (Georgia/Times, Änderungsmarkierungen), daraus wird eine Textur mit Mip-Stufen; nur geänderte Seiten werden neu gesetzt.
- **Teilchen:** GPU-Teilchen (Instancing) für Staub in Lichtstrahlen, Dampf über Bechern, Regentropfen am Fenster (Tropfen + Laufspuren als Brechung in einer kleinen Textur).
- **Figuren:** starre Teile an einer Knochen-Hierarchie (keine Haut-Verformung nötig), Gesten als kleine Schlüsselbild-Folgen in `data/figuren.js`, Kopf- und Blicksteuerung, Gehzyklus mit einfacher Zwei-Gelenk-Lösung für die Beine.
- **Sichtbarkeit:** Kegelstumpf-Prüfung pro Objekt, Detailstufen nach Entfernung, Schattenkarte nur mit schattenwerfenden Objekten.
- **Zuverlässigkeit:** Jeder Shader wird beim Start kompiliert und geprüft; scheitert ein Effekt-Shader auf einem Gerät, wird nur dieser Effekt abgeschaltet (mit Konsolenhinweis), nicht das ganze Spiel.

### 10.5 Datenformat-Beispiel (zur Orientierung, nicht wörtlich übernehmen)

```js
// data/artikel.js
DATA.artikel = [
  {
    id: "auskunft",
    titel: "Artikel 4 – Auskunftsrecht",
    einleitung: "Was dürfen Beschäftigte über die Bezahlung in ihrem Betrieb erfahren?",
    schrauben: [
      {
        id: "auskunft_umfang",
        optionen: [
          { id: "nichts", kurz: "Kein Auskunftsrecht", text: "", streichen: true,
            haltung: { BFW: 1, EVM: 1, ASG: -2, GZL: -2, BSN: 1, FU: -1 },
            wirkung: { wissen: -2, durchsetzung: -1, aufwand: 1, recht: 0 } },
          { id: "durchschnitt", kurz: "Auskunft über Durchschnitte", echt: true, vergleich: "rl_auskunft",
            text: "Die Arbeitnehmer*innen haben das Recht, Auskunft über ihre individuelle Entgelthöhe und über die durchschnittliche Entgelthöhe zu verlangen, aufgeschlüsselt nach Geschlecht, für Gruppen, die gleiche oder gleichwertige Arbeit verrichten.",
            dafuer: "…", dagegen: "…",
            haltung: { BFW: 0, EVM: 1, ASG: 1, GZL: 1, BSN: -1, FU: 1 },
            wirkung: { wissen: 1, durchsetzung: 1, aufwand: -1, recht: 1 } }
        ]
      }
    ]
  }
];
```

---

## 11. Debug, Prüfungen und Admin-Menü

**Debug-Modus `index.html?debug=1`:**
- Kleines Feld oben rechts: Kapitel, Termine, Punkte je Fraktion, Schwellen, aktuelle Mehrheit, Flags.
- Taste K: springt zum nächsten Kapitel; Taste V: setzt alle Vertrauenswerte auf 0; Taste F: zeigt alle Flags.
- Ungeprüfte Fakten werden im Spiel rot unterstrichen; die Konsole listet sie als Tabelle.
- **Grafik-Debug:** FPS, Bildzeit (CPU und, wo verfügbar, GPU per Zeitmessungs-Erweiterung), Zeichenaufrufe, Dreiecke, Grafikstufe; Taste G schaltet Ansichten durch (fertiges Bild, nur Licht, Normalen, Tiefe, Umgebungsverdeckung, Schattenkarte, Drahtgitter); Taste L zeigt Lichtquellen als Symbole; Taste C löst die Kamera (frei fliegen mit WASD + Maus) für Standbilder; Taste P speichert ein Standbild als PNG-Download.

**Automatische Prüfungen beim Start (Konsole):**
1. **Dialogprüfung:** Alle Gesprächsknoten sind erreichbar, jeder Verweis zeigt auf einen existierenden Knoten, jede Bedingung nutzt existierende Flags/Karten/Optionen. Ergebnis: „Gespräche: alle Knoten erreichbar ✓“.
2. **Datenprüfung:** Jede Option hat eine Haltung für **jede** Fraktion und eine Wirkung für jede Achse; jede Karte, jeder Fakt und jeder Spielwert, auf den verwiesen wird, existiert.
3. **Ziffernprüfung:** Kein Text in `data/` enthält eine Ziffer außerhalb von Platzhaltern (Ausnahmen nur über eine ausdrückliche Liste, z. B. Aktenzeichen-Muster).
4. **Balance-Prüfung:** Das Werkzeug probiert alle Kombinationen der Optionen durch (bei sieben Artikeln mit bis zu fünf Optionen sind das einige zehntausend – das schafft der Browser in unter einer Sekunde) und meldet: Anzahl der Fassungen mit Mehrheit im Ausschuss und im Plenum (bei Vertrauen 0), Anzahl unterschiedlicher Mehrheitskoalitionen, ob die Maximalfassungen jeder Seite scheitern, ob „alles gestrichen“ scheitert, ob eine Fraktion unverzichtbar ist. Diese Ziele stehen in 5.3.
5. **Textlängen-Prüfung:** Wörter Spieltext pro typischem Durchgang (Schätzung) und längste Sprechblase/Zeile.

**Admin-Menü für die Jury-Vorführung** (versteckt: im Titel fünfmal auf das Halbrund tippen oder „admin“ tippen): direkt zu jedem Kapitel springen, eine fertige Beispielfassung laden („mutig“, „Mitte“, „schlank“), alle Karten ins Dossier, direkt zum Vergleich. Das Admin-Menü verändert nicht den gespeicherten Spielstand, außer man bestätigt es.

---

## 12. Phasen, Abnahme und Fragen

### 12.1 Phase 1 – 3D-Stil-Prototyp (danach Stil-Abnahme durch mich)
- Die 3D-Maschine mit PBR-Licht, Schattenkarte, Umgebungslicht, HDR, Nachbearbeitung (alle Effekte aus 7.5), Grafikstufen mit automatischer Wahl, Rückfall auf WebGL 1 und Dokumentmodus.
- **Der Plenarsaal** vollständig mit 120 Plätzen und Sitzlampen, Glasdach, Lichtstrahlen, Teppich, Präsidium – als Titelbildschirm mit Kamerafahrt.
- **Das Büro** mit Schreibtisch, 3D-Papierstapel (eine Seite mit echtem Text, Umblättern, Füllfeder-Änderung), Glasmodell des Halbrunds (60 Sitze), Schreibtischlampe, Becher mit Dampf, Fenster mit Stadt.
- **Zwei Gliederfiguren** (Mira und Luca) mit Kleidung, Haaren, Atmen und drei Gesten; eine kurze Beispiel-Gesprächsleiste mit Schuss/Gegenschuss und Tiefenschärfe.
- Ein Stempel mit Abdruck.
- Standbilder jeder Szene auf Ultra, Hoch, Mittel und Niedrig (1280×720 und 1920×1080) und im iPad-Format (quer und hoch); gemessene Bildzeiten pro Stufe.
- **Danach fragst du mich, ob der Stil passt, bevor du weiterbaust.** Wenn ich „mehr Wow“ sage, verbesserst du Licht, Materialien und Kamera, bevor es weitergeht.

### 12.2 Phase 2 – Kern
- Spielstand, Speichern, Kapitelablauf, Kapitel 1 (Tutorial) und Kapitel 3 (Entwurf) vollständig mit allen sieben Artikeln, Wunschzettel, HTML-Ebene über dem 3D-Papier, Glasmodell reagiert live, Fraktionsleiste, Wirkungsanzeige, Dossier, Glossar, Fraktionsmodell mit Balance-Prüfung.

### 12.3 Phase 3 – Anhörung und Flure
- Kapitel 2 (Ausschusssaal mit allen fünf Gästen als Figuren, Kamerafahrt am Tisch), Kapitel 4 (Schnittmodell des Gebäudes mit drei Etagen, gehende Figuren, alle sechs Schattenberichterstatter*innen, Bibliothek, Cafeteria, Versprechen), Kapitel 5 (Ausschussabstimmung inkl. Nacharbeit).

### 12.4 Phase 4 – Trilog und Plenum
- Kapitel 6 (Nachtszene mit Pendelleuchte, Regen am Fenster, Vier-Spalten-Tabelle, kreisende Kamera, Dolmetscher-Moment, Umsetzungsfrist), Kapitel 7 (Plenum mit Rede, Abstimmungs-Kranfahrt, Sitzlampen, Stempel, Neuer Anlauf).

### 12.5 Phase 5 – Finale und Feinschliff
- Epilog als 3D-Collage, Vergleich mit der echten Richtlinie, Reflexion, Quellen, Credits, Einstellungen, Ton mit Raumhall und Musik-Motiv, Admin-Menü, Barrierefreiheits-Durchgang, Touch-Test, Leistungstest auf allen Grafikstufen, letzter Grafik-Feinschliff (jede Szene noch einmal als Filmstill prüfen).

**Am Ende jeder Phase lieferst du:** lauffähigen Stand ohne Konsolenfehler, grüne Prüfungen (Gespräche, Daten, Ziffern, ab Phase 2 Balance), eine kurze deutsche Zusammenfassung (Was ist neu? Wo kann ich es in `data/` ändern? Was wurde getestet, was nicht?), aktualisierte `README.md`, `QUELLEN.md` und `CLAUDE.md` (mit Stand, Entscheidungen und Regeln aus Erfahrung), Standbilder und Bildzeiten – dann wartest du auf mein OK.

### 12.6 Fragen, die du mir vor Phase 2 stellst
1. Sind die sechs erfundenen Fraktionen und ihre Namen in Ordnung, oder möchte ich andere Namen/Schwerpunkte?
2. Bleibt die Spielfigur ein*e junge abgeordnete Person, oder lieber eine Rolle mit mehr Nähe zur Zielgruppe (z. B. Mitglied einer Jugend-Delegation, die einen Tag lang mitverhandeln darf)?
3. Sollen es sieben Artikel bleiben, oder lieber fünf (kürzere Spielzeit)? Soll Stellschraube C in Artikel 7 (Verbandsklage) hinein?
4. Ist der Wunschzettel (Kita-Garantie, Elternzeit-Pflicht) in Ordnung, oder sollen es andere Ideen sein?
5. Welche Länder sollen bei den Figuren auf jeden Fall vertreten sein?

---

## 13. Checkliste (vor jeder Abgabe einer Phase durchgehen)

- [ ] Läuft per Doppelklick (`file://`) und über einen lokalen Server, keine Konsolenfehler.
- [ ] Keine Datei von außen geladen, keine Bibliothek, keine Schrift, kein Bild.
- [ ] Alle Zahlen und Fakten nur in `data/fakten.js` bzw. Spielwerte in `data/spielwerte.js`; Ziffernprüfung grün; `QUELLEN.md` aktuell.
- [ ] Keine Pronomen für die Spielfigur, Genderstern überall, keine Stereotype, jede Fraktion respektvoll mit stärkstem Argument.
- [ ] Wirkungsanzeigen tragen den Hinweis „vereinfachtes Spielmodell, keine Prognose“; Epilog behauptet keine Zahlen.
- [ ] Erfundenes ist als erfunden gekennzeichnet; echte Personen kommen nicht vor; keine echten Logos.
- [ ] Touch-Regeln eingehalten; mit Tastatur vollständig spielbar; Bewegung reduzieren und hoher Kontrast funktionieren.
- [ ] Gespräche-, Daten-, Ziffern- und Balance-Prüfung grün.
- [ ] Grafik: jede Szene als Filmstill geprüft (Licht-Konzept, weiche Schatten, Kontaktschatten, Materialstruktur, Kantenglättung, kein Flimmern); Bildzeiten aller Grafikstufen gemessen; „Niedrig“ ≥ 30 FPS-Ziel plausibel; Rückfall WebGL 1 und Dokumentmodus getestet.
- [ ] Testbilder Desktop und iPad (quer/hoch) angesehen; ehrlich aufgeschrieben, was nicht getestet werden konnte.
- [ ] README, QUELLEN, CLAUDE.md, KI-DOKUMENTATION aktualisiert; committet und gepusht.

**Und zum Schluss das Wichtigste:** Das Spiel soll zeigen, dass Gesetze von Menschen gemacht werden, die sich nicht einig sind – und dass man trotzdem etwas erreichen kann, wenn man zuhört, begründet und Kompromisse eingeht. Wenn eine Spielerin oder ein Spieler nach 20 Minuten sagt: „Ich hätte nicht gedacht, dass ein einziger Schwellenwert so viel Streit auslöst“ – dann hat „Mehrheit“ funktioniert.
