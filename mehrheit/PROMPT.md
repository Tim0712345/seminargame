# Prompt: „Mehrheit – Ein Gesetz gegen die Lohnlücke“

*Konzept- und Bauanleitung für ein Lernspiel zum Gender Pay Gap · Beitrag zum Schülerwettbewerb „Europäischer Wettbewerb“ · Stand: 31. Oktober 2026*

Alles ab hier ist der Prompt. Er beschreibt ein **komplett neues Spiel**. Es ersetzt nichts und übernimmt nichts: Die Spiele „Die Lücke“ (Hauptordner) und „Funkloch“ (Ordner `funkloch/`) bleiben unverändert liegen. Aus ihrem Code, ihren Daten, ihren Figuren, ihrem Grafikstil und ihren Texten wird **nichts** übernommen – nicht einmal einzelne Hilfsfunktionen. Das neue Spiel entsteht im Ordner `mehrheit/`. Gemeinsam ist nur das Thema: der Gender Pay Gap in Europa.

---

## 0. Deine Rolle und wie du arbeitest

Du bist erfahrene*r Spieleentwickler*in, Interaktionsdesigner*in, Informationsgrafiker*in und Autor*in für politische Bildung. Du baust mit mir (Schüler*in der Oberstufe) ein Lernspiel für den Schülerwettbewerb „Europäischer Wettbewerb“. Eine Jury aus Lehrkräften bewertet es. Sie achtet auf drei Dinge: inhaltliche Richtigkeit, einen echten europäischen Bezug und darauf, ob das Spiel etwas zeigt, das ein Referat nicht zeigen könnte. Das Spiel soll sich anfühlen wie eine spannende Nacht im Parlament – nicht wie ein Arbeitsblatt und nicht wie ein bekanntes Spiel.

**Sprache:** Das Spiel, alle Antworten an mich, alle Code-Bezeichner und alle Kommentare sind auf Deutsch. Englische Fachbegriffe nur dort, wo sie wirklich üblich sind („Gender Pay Gap“, „Trilog“ ist ohnehin deutsch). Wenn du einen Fachbegriff benutzt, erklärst du ihn im Spiel beim ersten Auftreten in einem Satz.

**Arbeitsweise (zwingend):**

1. Du arbeitest in **vier Phasen** (Abschnitt 12). Nach jeder Phase lieferst du einen lauffähigen Stand ohne Konsolenfehler, eine kurze deutsche Zusammenfassung und wartest dann auf mein OK. Ohne OK beginnst du die nächste Phase nicht.
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

**Dr. Hanna Lindqvist (Schweden), Juristischer Dienst des Parlaments.** Prüft jede Formulierung der Spielfigur auf Rechtssicherheit und Zuständigkeit. Sie ist die Stimme, die ehrlich sagt: „Das ist politisch verständlich, aber nicht Teil dieses Gesetzes“ oder „So formuliert landet das vor Gericht und verliert.“ Sie ist nie parteiisch. Ihre Hinweise erscheinen als Randbemerkungen im Text (Abschnitt 7.5). Humor über Kommas („Ein Komma an der falschen Stelle hat schon mehr Gesetze gekippt als jede Opposition.“).

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

Alle Figuren werden **ohne Gesichtszüge** dargestellt (siehe Abschnitt 7.6): abstrakte Porträts aus wenigen Grundformen, erkennbar an Silhouette, Frisur, Kleidung, Accessoire und Fraktionsfarbe. Große Vielfalt bei Alter, Körperbau, Hautton, Haarform, Kopfbedeckung (Kopftuch, Kippa, Turban sind möglich), Brille, Hörgerät, Rollstuhl, Gehstock. Diversität ist selbstverständlich, sie wird nicht kommentiert.

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

Das Herzstück. Die Spielfigur sitzt am **Entwurfstisch** (Abschnitt 7.3): links der Gesetzestext, rechts das Halbrund und die Wirkungsanzeige, unten das Dossier mit den gesammelten Karten.

- Der Text hat **sieben Artikel** (Abschnitt 6). Jeder Artikel hat eine oder zwei **Stellschrauben** mit drei bis fünf Optionen. Eine Option ist immer „Streichen“ (der Artikel fällt weg), außer bei Artikel 1 (Zweck).
- Wählt man eine Option, **tippt sich der neue Wortlaut** in den Text (Schreibmaschinen-Effekt, abschaltbar), der alte wird farbig durchgestrichen – wie im Änderungsmodus eines Textprogramms.
- Sofort reagieren: (a) die **Punkte im Halbrund** (Zustimmung je Fraktion), (b) die **Wirkungsanzeige** (vier Achsen, qualitativ), (c) **Randbemerkungen** des Juristischen Dienstes, wenn eine Formulierung rechtlich wackelig ist oder außerhalb der Zuständigkeit liegt.
- Zu jeder Option gibt es eine aufklappbare **„Dafür / Dagegen“-Karte** mit je zwei Sätzen und der Angabe, welche Fraktionen sie mögen und welche nicht. Kein Raten im Dunkeln: Das Spiel zeigt die Haltungen offen, die Schwierigkeit liegt im Abwägen, nicht im Erraten.
- Es gibt **keinen Zeitdruck** in diesem Kapitel. Man kann beliebig umentscheiden. Erst mit „Entwurf einreichen“ ist der Stand fest; danach kann man nur noch über Verhandlungen (Kapitel 4) oder im Trilog (Kapitel 6) ändern.
- Zusätzlich gibt es einen **Sonderbereich „Wunschzettel“**: Zwei Vorschläge, die nicht in dieses Gesetz gehören (europaweite Kita-Garantie mit festen Plätzen; Pflicht zur gleichen Aufteilung der Elternzeit). Zieht man sie in den Text, markiert der Juristische Dienst sie rot: „Nicht Gegenstand dieser Richtlinie / Zuständigkeit überwiegend bei den Mitgliedstaaten bzw. anderes Instrument (siehe {fakt:wlb_rl}).“ Lässt man sie trotzdem drin, sinkt die Zustimmung bei EVM und BSN stark, und im Trilog streicht der Rat sie sicher. Das ist der Moment, in dem das Spiel zeigt: **Nicht jede gute Idee gehört in jedes Gesetz.** Im Epilog kommen diese Themen als „Was es außerdem bräuchte“ zurück – positiv, nicht als Fehler.

### 4.4 Kapitel 4 – Die Flure

Jetzt wird verhandelt. Die Ansicht wechselt zu einer **Gebäudekarte** (Abschnitt 7.4): ein stilisierter Grundriss des Parlamentsgebäudes mit Büros der Fraktionen, Cafeteria, Bibliothek, Ausschusssaal. Auf der Karte sind die Schattenberichterstatter*innen als Porträt-Marken zu sehen.

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
- Die Abstimmung wird als kurze Animation gezeigt: Die Punkte im Halbrund kippen nacheinander auf Ja (gefüllt), Nein (leer mit Rand) oder Enthaltung (halb).
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

**Darstellung:** Gespräche laufen in einer **Gesprächsleiste** am unteren Rand (Abschnitt 7.7), nicht in Sprechblasen. Text erscheint zügig (Schreibmaschine, abschaltbar), ein Klick zeigt den Rest sofort.

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

## 7. Grafikstil und Oberfläche: „Änderungsmodus“

### 7.1 Die Grundidee des Stils

Kein 3D, kein Bilderbuch, kein Riso-Zine, kein Pixel-Look. „Mehrheit“ sieht aus wie **ein lebendiges Arbeitsdokument**: ein Gesetzentwurf auf hellem Papier, in dem gerade gearbeitet wird. Farbige Einfügungen und Streichungen wie im Änderungsmodus eines Textprogramms, Randbemerkungen, Haftnotizen, Büroklammern, Stempel, Aktenzeichen. Dazu kommt eine zweite, klare Bildsprache: **Informationsgrafik** – das Halbrund aus Punkten, Leisten aus Kästchen, ein Grundriss. Die Kombination aus „Papier, auf dem gerungen wird“ und „präziser Datengrafik“ ist der Stil.

Leitsätze für jede Gestaltungsentscheidung:
1. **Der Text ist der Held.** Das Wichtigste auf dem Bildschirm ist fast immer ein Satz im Gesetz. Alles andere ordnet sich unter.
2. **Jede Farbe bedeutet etwas.** Farben werden nur für Fraktionen, Zustände (eingefügt, gestrichen, Hinweis) und Akzente benutzt – nie als Dekoration.
3. **Ruhe statt Spektakel.** Bewegung ist knapp, sachlich und hat immer einen Grund (etwas ändert sich).
4. **Nichts sieht aus wie ein bekanntes Spiel** und nichts sieht aus wie eine echte EU-Website: keine echten Logos, kein Sternenkranz als Logo, keine Nachbildung offizieller Layouts.

### 7.2 Farben, Schrift, Raster (alle Werte in `data/stil.js`)

**Grundfarben:**
- Papier: gebrochenes Weiß `#f6f3ec`, Papier dunkler (für Ränder, zweite Ebene): `#ebe6da`
- Tinte (Text): fast Schwarz mit Blaustich `#1d2233`
- Graphit (Nebentext, Linien): `#5b6070`
- Akzent „Entwurf“ (Hervorhebungen der Spielfigur, Brücke): Petrol `#00707a`
- Hinweis Juristischer Dienst: Bernstein `#c98a00` (Randbemerkung), Warnung Ziegelrot `#b83a2a`
- Einfügung: Unterstreichung in der Farbe der Fraktion, die die Änderung wollte (bei eigenen Änderungen Petrol); Streichung: Durchstreichung in Graphit

**Fraktionsfarben** (jede mit Muster für Farbsehschwäche, Kontrast zu Papier mindestens 3:1 für Flächen):
- BFW: Gelbocker `#d9a21b`, Muster: diagonale Streifen
- EVM: Mittelblau `#3567b5`, Muster: Punkte
- ASG: Rot `#c8382f`, Muster: waagerechte Streifen
- GZL: Grün `#3b8a4a`, Muster: Wellen
- BSN: Violettbraun `#7a4b6b`, Muster: Karo
- FU: Grau `#8a8f99`, Muster: kleine Dreiecke
- Brücke: Petrol `#00707a`, Muster: voll

**Schriften (nur Systemschriften, nichts laden):**
- Gesetzestext: Serifenschrift – `Georgia, "Times New Roman", serif`. Groß (Grundgröße 19 px am Desktop), Zeilenabstand 1,55, Spaltenbreite höchstens 62 Zeichen.
- Oberfläche: `system-ui, "Segoe UI", -apple-system, "Helvetica Neue", Arial, sans-serif`.
- Aktenzeichen, Uhrzeiten, Zähler: `ui-monospace, Consolas, "Courier New", monospace`.
- Kapiteltitel: Georgia fett, sehr groß (bis 72 px), mit engem Zeilenabstand, linksbündig.

**Raster:** 12-Spalten-Raster mit 24 px Abstand am Desktop, 8-px-Grundraster für alle Abstände. Ecken: Papierelemente 2 px, Knöpfe 6 px, Haftnotizen 0 px (mit leicht gebogener Ecke als Schatten).

**Papier-Details:** sehr feines Papierkorn (im Code erzeugtes Rauschen, Deckkraft unter 5 %), dünne blaue Linien wie Konzeptpapier nur am Rand des Dokuments, eine Lochung am linken Rand. Keine Kaffeeflecken, keine Knitterfalten – das würde in Kitsch kippen. Ausnahme: der Trilog, dort dürfen sich im Laufe der Nacht Becherringe auf der Tabelle sammeln (genau drei).

### 7.3 Der Entwurfstisch (Kapitel 3 – wichtigster Bildschirm)

Aufteilung am Desktop (Querformat):
- **Links, 7 von 12 Spalten: das Dokument.** Kopf mit Aktenzeichen (erfunden, z. B. „Entwurf · Berichterstattung {name}“), Titel der Richtlinie, dann die Artikel als Abschnitte. Jeder Artikel hat am linken Rand eine kleine Nummer-Marke. Der aktive Artikel ist hervorgehoben (Petrol-Balken links); die anderen sind leicht ausgegraut, aber lesbar.
- **Rechts oben, 5 Spalten: das Halbrund** (Ausschuss, 60 Punkte) mit Zähler „Ja / Nein / Enthaltung“ und einer gestrichelten Mehrheitslinie. Darunter die **Fraktionsleiste**: sechs Zeilen mit Porträt-Marke, Kurzname, Vertrauen (Punkte −3…+3) und Tendenz (Pfeil).
- **Rechts unten: die Wirkungsanzeige** (vier Leisten plus die graue Leiste, Abschnitt 5.6).
- **Unten über die ganze Breite: das Dossier** als Kartenreihe (seitlich verschiebbar), die Karten leicht überlappend wie auf einem Tisch.
- **Oben rechts: Kalender** (Wochentag, Uhrzeit, Termine als Kästchen) und Knöpfe „Dossier“, „Pause“.

**Stellschrauben:** Klickt/tippt man einen Artikel an, öffnet sich unter dem Artikeltext eine **Optionsleiste**: die Optionen als nebeneinanderliegende Karteikarten-Reiter mit Kurznamen. Darunter, aufklappbar, die Dafür/Dagegen-Karte. Wählt man eine Option, passiert in dieser Reihenfolge (zusammen höchstens 1,2 Sekunden): alter Text wird durchgestrichen → neuer Text tippt sich ein → Punkte im Halbrund wandern (jeder Punkt einzeln, leicht versetzt, wie ein Schwarm) → Leisten der Wirkung füllen sich → ggf. erscheint eine Randbemerkung. Bei „Bewegung reduzieren“ passiert alles sofort ohne Animation.

**Vorschau beim Überfahren:** Nur mit der Maus (`pointerType === "mouse"`) zeigt das Halbrund beim Überfahren einer Option eine **gestrichelte Vorschau**, wohin die Punkte wandern würden. Auf Touch-Geräten gibt es stattdessen einen kleinen Knopf „Vorschau“ an jeder Option. Die Optionsknöpfe werden beim Überfahren **niemals** neu aufgebaut (siehe Touch-Regel, Abschnitt 10.3).

**Hochformat (iPad, Handy):** Dokument oben, darunter eine einklappbare Leiste mit Halbrund und Wirkung („Mehrheit: 34 von 60“ als Zusammenfassung, antippen zum Aufklappen), Dossier als Knopf unten.

### 7.4 Die Gebäudekarte (Kapitel 4)

Ein **Grundriss** im Stil eines Architekturplans: dünne Graphit-Linien auf Papier, Räume als Rechtecke mit Beschriftung in Versalien (Monospace), Flure als breitere helle Bänder, Treppen als Linienstapel. Die Büros der Fraktionen sind mit einer schmalen Fläche in Fraktionsfarbe und -muster markiert. Die Spielfigur ist eine Petrol-Marke mit Initiale. Die Schattenberichterstatter*innen stehen als Porträt-Marken in ihren Büros (oder in der Cafeteria, je nach Uhrzeit – feste Abfolge aus den Daten).

Bedienung: Raum antippen → die Spielfigur-Marke gleitet entlang der Flure dorthin (einfache, vorgegebene Wege, keine Wegsuche nötig) → Gespräch beginnt. Nicht verfügbare Personen haben eine kleine Haftnotiz „Bin in einer Sitzung, zurück um …“. Der Grundriss ist erfunden und ähnelt keinem echten Gebäude im Detail; Raumnamen sind allgemein („Büro BFW“, „Cafeteria“, „Bibliothek“, „Saal 3“).

### 7.5 Randbemerkungen und Stempel

- **Randbemerkungen** des Juristischen Dienstes erscheinen rechts neben dem Dokument (am Desktop) bzw. als aufklappbare Fußnote (Hochformat): ein schmaler Bernstein-Strich, Initialen „HL“ (Hanna Lindqvist), ein bis zwei Sätze. Rote Bemerkungen (Warnung) haben ein kleines Paragrafenzeichen und einen Text, der erklärt, was das Problem ist und welche Option es löst.
- **Stempel** (im Code als SVG gezeichnet, leicht schräg, mit unregelmäßiger Deckkraft wie echte Stempelfarbe): „EINGEREICHT“, „ANGENOMMEN“, „ABGELEHNT“, „KOMPROMISS“, „VERTRAULICH“ (über dem Trilog-Dokument). Ein Stempel kommt mit einem kurzen „Plopp“-Ton und einer Bewegung von 120 ms.
- **Haftnotizen**: quadratisch, Gelb `#f2d25a` (Mira) oder Petrol hell (eigene Versprechen), Handschrift wird NICHT imitiert (keine Schriftart dafür vorhanden) – stattdessen Systemschrift kursiv.

### 7.6 Porträts ohne Gesichter

Alle Figuren werden als **abstrakte Porträt-Büsten aus Grundformen** gezeichnet (SVG im Code, Daten in `data/figuren.js`):
- Kopf als Kreis oder Oval in einem von acht Hauttönen (eigene, natürliche Palette, keine Fantasiefarben),
- Haare als eine bis drei Formen (Kurzhaar, Locken, Zopf, Dutt, Glatze, Afro, Kopftuch, Turban, Kippa, Mütze),
- Schultern als Halbkreis in Kleidungsfarbe mit Kragen-Form (Hemd, Rollkragen, Blazer, Pullover, Kittel),
- ein Detail: Brille, Ohrring, Hörgerät, Bart, Schal, Namensschild, Rollstuhllehne angedeutet,
- **keine Augen, kein Mund, keine Nase.** Gefühle werden über Haltung gezeigt: Kopf leicht geneigt (nachdenklich), Schultern hochgezogen (angespannt), kleines Nicken (zustimmend) – als sanfte Transformation von 2–4 Grad bzw. Pixeln.
- Um das Porträt ein dünner Ring in Fraktionsfarbe (bei Fraktionslosen grau, bei Kommission/Rat/Dienst Graphit).
- Größen: Marke (32 px), Leiste (48 px), Gespräch (120 px), Epilog (180 px).

Dieser Stil ist bewusst sachlich – wie Piktogramme auf einer Konferenz-Namensliste – und hebt sich klar von Figuren in Spielen ab.

### 7.7 Gespräche: die Gesprächsleiste

Gespräche erscheinen in einer **Leiste am unteren Bildschirmrand**, die wie ein Ausschnitt aus einem Sitzungsprotokoll aussieht: links das Porträt (120 px), daneben Name in Versalien (Monospace, klein), Rolle und Fraktion, darunter der Text in der Oberflächenschrift (Grundgröße 18 px). Antworten der Spielfigur sind **Protokoll-Zeilen** mit vorangestelltem Namen der Spielfigur und einem kleinen Pfeil – zwei bis drei untereinander, jede ein großer Knopf (mindestens 48 px hoch). Kartenantworten (aus dem Dossier) erscheinen als kleine Karten, die man in ein Feld „Vorlegen“ zieht oder antippt.

Das Protokoll scrollt nach oben weg, die letzten drei Wortwechsel bleiben lesbar. Ein Knopf „Protokoll“ öffnet den ganzen Verlauf des Gesprächs.

### 7.8 Szenen-Bilder

Jedes Kapitel hat ein ruhiges **Hintergrundbild aus Linien und Flächen** (im Code gezeichnet, SVG oder Canvas 2D), das hinter dem Dokument liegt und an den Rändern sichtbar ist:
- Büro: Fensterband mit angedeuteter Stadt (Brüssel, nur Silhouetten von generischen Gebäuden), Regal, Pflanze,
- Ausschusssaal: Hufeisen-Tisch von oben, Mikrofone als kleine Kreise, Dolmetschkabinen als Fensterreihe,
- Flure: der Grundriss (7.4),
- Trilog: Tisch von oben mit der Vier-Spalten-Tabelle, Becher, Lampe; im Laufe der Nacht wird der Rand dunkler (Papier → Dämmerblau `#2b3350`),
- Plenum: das große Halbrund von vorn, Reihen als Bögen, Präsidiumspult als Rechteck.
Alle Hintergründe in gedeckten Tönen (Papier, Graphit, eine Akzentfarbe), damit der Text im Vordergrund immer lesbar bleibt (Kontrast Text/Hintergrund mindestens 4,5:1).

### 7.9 Bewegung und Ton

**Bewegung:** Seitenwechsel als horizontales Blättern (300 ms), Kapitelkarten blenden ein (400 ms), Punkte im Halbrund wandern mit leichter Verzögerung pro Punkt, Stempel mit kurzem Aufsetzen. Keine wackelnden Kameras, keine Partikel, kein Konfetti – auch nicht bei Erfolg. Bei Erfolg: Stempel, ein kurzer Akkord, Applaus als leises Rauschen im Plenum.

**Ton (Web Audio API, im Code erzeugt, nichts laden):** Tipp-Geräusch (sehr leise, kurze Rauschimpulse), Papierrascheln beim Blättern (gefiltertes Rauschen), Stempel-Plopp (tiefer, kurzer Ton), Hammer der Sitzungsleitung (zwei Schläge), Gemurmel im Plenum (gefiltertes Rauschen mit langsamer Lautstärkeänderung), Abstimmungs-Klick pro Punkt (sehr leise), Akkord bei Annahme, gedämpfter Ton bei Ablehnung. Keine Sprechlaute für Figuren. Alle Töne in den Einstellungen abschaltbar, Lautstärke regelbar, Standard: leise. Ton startet erst nach der ersten Nutzereingabe (Browser-Regel).

### 7.10 Titelbildschirm

Ein leeres Blatt Papier. Langsam erscheint, Wort für Wort getippt: „Richtlinie über …“ – dann wird „über“ durchgestrichen, „gegen die Lohnlücke“ eingefügt, und darüber legt sich groß der Titel **MEHRHEIT** in Georgia fett. Darunter ein kleines Halbrund, dessen Punkte sich ruhig hin und her bewegen. Menü links unten als Liste schlichter Textknöpfe. Unten der Hinweis: „Alle Personen und Fraktionen sind erfunden. Die Richtlinie und die Zahlen sind echt – Quellen am Ende.“

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
- **Bildschirmleser:** echte Knöpfe (`<button>`), Überschriften-Hierarchie, `aria-live` für Abstimmungsergebnisse und neue Karten, Halbrund mit Textalternative („Ja: 34, Nein: 20, Enthaltung: 6 – Mehrheit erreicht“).
- **Farbsehschwäche:** Jede Fraktion hat ein Muster; Zustände (Ja/Nein/Enthaltung) unterscheiden sich durch Form (voll/leer/halb), nicht nur durch Farbe.
- **Einstellungen** (im Titel und im Pausemenü): Ton an/aus und Lautstärke, Schriftgröße (100/120/140 %), hoher Kontrast (reines Weiß/Schwarz, dickere Linien, keine Papierstruktur), Bewegung reduzieren (keine Animationen, keine Schreibmaschine; Betriebssystem-Einstellung wird übernommen), Schreibmaschinen-Tempo, „Lesehilfe“ (zeigt bei jedem Artikel eine Ein-Satz-Zusammenfassung in einfacher Sprache).
- Kein Zeitdruck in Echtzeit, keine Reaktionsaufgaben.

---

## 10. Technik

### 10.1 Grundsätze

- **Vanilla JavaScript ohne Module**, normale `<script>`-Tags in fester Reihenfolge, damit das Spiel per **Doppelklick auf `mehrheit/index.html`** läuft (`file://`). Kein `fetch`, kein XHR, keine Cookies.
- **DOM + CSS für Oberfläche und Text**, **SVG** (im Code erzeugt) für Halbrund, Porträts, Stempel, Grundriss und Leisten. Canvas 2D nur, wenn nötig (z. B. Papierkorn als einmal erzeugtes Bild, das per `toDataURL` als CSS-Hintergrund dient).
- **Keine Bibliotheken, keine CDNs, keine Schriften, Bilder, Töne oder Daten von außen.** Alles wird im Code erzeugt.
- Läuft offline in aktuellen Versionen von Edge, Chrome, Firefox (Windows), Safari (iPad, macOS) und auf GitHub Pages. Gesamtgröße unter 2 MB.
- Leistung: flüssig (60 FPS bei Animationen) auf einem normalen Laptop, mindestens 30 FPS auf einem Schul-Laptop und einem älteren iPad. Animationen nur mit `transform` und `opacity`; das Halbrund mit höchstens 120 SVG-Kreisen.
- Namensräume: `DATA` (Daten), `ANSICHT` (Darstellung, DOM/SVG), `LOGIK` (Spielzustand, Berechnungen, Ablauf). Code-Bezeichner und Kommentare auf Deutsch.

### 10.2 Dateien

```
mehrheit/
  index.html
  css/stil.css
  data/stil.js          Farben, Schriften, Abstände, Animationsdauern
  data/texte.js         Oberflächentexte, Kapitelkarten, Menüs
  data/fakten.js        alle echten Zahlen und Fakten (verifiziert: false)
  data/spielwerte.js    Spielmechanik-Zahlen (Sitze, Termine, Schwellen-Optionen)
  data/fraktionen.js    Fraktionen, Sitze, Haltungen, Schwellen
  data/figuren.js       Aussehen der Porträts
  data/artikel.js       Artikel, Optionen, Wortlaute, Haltungen, Wirkungen
  data/karten.js        Dossier-Karten
  data/gespraeche.js    alle Gespräche (Anhörung, Flure, Trilog, Mira)
  data/trilog.js        Ratsposition, Mittelwege
  data/epilog.js        Epilog-Bausteine, Schlagzeilen
  data/vergleich.js     Vergleichstexte „Deine Fassung / echte Richtlinie / warum“
  data/glossar.js       Fachbegriffe
  js/logik/stand.js     Spielstand, Speichern
  js/logik/mehrheit.js  Zustimmung, Abstimmung, Wirkung
  js/logik/ablauf.js    Kapitel, Termine, Übergänge
  js/logik/gespraech.js Gesprächsknoten, Bedingungen, Aktionen
  js/ansicht/dokument.js   Gesetzestext, Änderungsmodus, Optionsleisten
  js/ansicht/halbrund.js   Sitzgrafik, Vorschau, Abstimmungsanimation
  js/ansicht/portrait.js   Porträts aus Grundformen
  js/ansicht/karte.js      Gebäudekarte
  js/ansicht/leiste.js     Gesprächsleiste, Dossier
  js/ansicht/szenen.js     Hintergründe, Kapitelkarten, Titel, Epilog, Vergleich
  js/ansicht/ton.js        Web-Audio-Töne
  js/debug.js
  js/start.js
  README.md, QUELLEN.md, KI-DOKUMENTATION.md, CLAUDE.md
```

### 10.3 Touch-Regeln aus Erfahrung (zwingend)

- Knöpfe werden **nie** beim Überfahren (Hover) neu aufgebaut oder ausgetauscht. Hover-Effekte nur, wenn `pointerType === "mouse"` (per Klasse setzen, nicht per `:hover` allein), sonst verschluckt Safari auf dem iPad den ersten Tipp.
- Alle Knöpfe und tippbaren Flächen: `touch-action: manipulation`, mindestens 44 × 44 px.
- Ziehen (Karten ins Feld „Vorlegen“) muss immer auch per Antippen gehen (Karte antippen → Feld antippen).
- Kein Text-Markieren bei Doppeltipp auf Knöpfe (`user-select: none` dort, aber nicht im Gesetzestext und nicht in der Vergleichstabelle – die soll man kopieren können).

### 10.4 Datenformat-Beispiel (zur Orientierung, nicht wörtlich übernehmen)

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

**Automatische Prüfungen beim Start (Konsole):**
1. **Dialogprüfung:** Alle Gesprächsknoten sind erreichbar, jeder Verweis zeigt auf einen existierenden Knoten, jede Bedingung nutzt existierende Flags/Karten/Optionen. Ergebnis: „Gespräche: alle Knoten erreichbar ✓“.
2. **Datenprüfung:** Jede Option hat eine Haltung für **jede** Fraktion und eine Wirkung für jede Achse; jede Karte, jeder Fakt und jeder Spielwert, auf den verwiesen wird, existiert.
3. **Ziffernprüfung:** Kein Text in `data/` enthält eine Ziffer außerhalb von Platzhaltern (Ausnahmen nur über eine ausdrückliche Liste, z. B. Aktenzeichen-Muster).
4. **Balance-Prüfung:** Das Werkzeug probiert alle Kombinationen der Optionen durch (bei sieben Artikeln mit bis zu fünf Optionen sind das einige zehntausend – das schafft der Browser in unter einer Sekunde) und meldet: Anzahl der Fassungen mit Mehrheit im Ausschuss und im Plenum (bei Vertrauen 0), Anzahl unterschiedlicher Mehrheitskoalitionen, ob die Maximalfassungen jeder Seite scheitern, ob „alles gestrichen“ scheitert, ob eine Fraktion unverzichtbar ist. Diese Ziele stehen in 5.3.
5. **Textlängen-Prüfung:** Wörter Spieltext pro typischem Durchgang (Schätzung) und längste Sprechblase/Zeile.

**Admin-Menü für die Jury-Vorführung** (versteckt: im Titel fünfmal auf das Halbrund tippen oder „admin“ tippen): direkt zu jedem Kapitel springen, eine fertige Beispielfassung laden („mutig“, „Mitte“, „schlank“), alle Karten ins Dossier, direkt zum Vergleich. Das Admin-Menü verändert nicht den gespeicherten Spielstand, außer man bestätigt es.

---

## 12. Phasen, Abnahme und Fragen

### 12.1 Phase 1 – Stil-Prototyp (danach Stil-Abnahme durch mich)
- Grundgerüst, `data/stil.js`, Papier, Schriften.
- **Der Entwurfstisch mit genau einem Artikel** (Artikel 4, Auskunftsrecht) mit allen Optionen, Änderungsmodus-Animation, Halbrund (60 Punkte) mit Vorschau, Fraktionsleiste, Wirkungsanzeige, einer Randbemerkung des Juristischen Dienstes.
- Drei Porträts (Mira, Luca, Hanna) in allen Größen und eine kurze Beispiel-Gesprächsleiste mit zwei Antworten.
- Ein Stempel, der Titelbildschirm als Skizze.
- Testbilder am Desktop (1280×720, 1920×1080) und iPad (quer und hoch).
- **Danach fragst du mich, ob der Stil passt, bevor du weiterbaust.**

### 12.2 Phase 2 – Kern
- Spielstand, Speichern, Kapitelablauf, Kapitel 1 (Tutorial), Kapitel 2 (Anhörung) und Kapitel 3 (Entwurf) vollständig mit allen sieben Artikeln und dem Wunschzettel, Dossier, Glossar, Fraktionsmodell mit Balance-Prüfung.

### 12.3 Phase 3 – Verhandeln
- Kapitel 4 (Flure mit Gebäudekarte, alle sechs Schattenberichterstatter*innen, Bibliothek, Cafeteria, Versprechen), Kapitel 5 (Ausschussabstimmung inkl. Nacharbeit), Kapitel 6 (Trilog mit Vier-Spalten-Tabelle, Dolmetscher-Moment, Umsetzungsfrist).

### 12.4 Phase 4 – Finale und Feinschliff
- Kapitel 7 (Plenum, Rede, Abstimmung, Neuer Anlauf), Epilog, Vergleich mit der echten Richtlinie, Reflexion, Quellen, Credits, Titelbildschirm, Einstellungen, Ton, Admin-Menü, Barrierefreiheits-Durchgang, Touch-Test, Leistungstest.

**Am Ende jeder Phase lieferst du:** lauffähigen Stand ohne Konsolenfehler, grüne Prüfungen (Gespräche, Daten, Ziffern, ab Phase 2 Balance), eine kurze deutsche Zusammenfassung (Was ist neu? Wo kann ich es in `data/` ändern? Was wurde getestet, was nicht?), aktualisierte `README.md`, `QUELLEN.md` und `CLAUDE.md` (mit Stand, Entscheidungen und Regeln aus Erfahrung), Testbilder – dann wartest du auf mein OK.

### 12.5 Fragen, die du mir vor Phase 2 stellst
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
- [ ] Testbilder Desktop und iPad (quer/hoch) angesehen; ehrlich aufgeschrieben, was nicht getestet werden konnte.
- [ ] README, QUELLEN, CLAUDE.md, KI-DOKUMENTATION aktualisiert; committet und gepusht.

**Und zum Schluss das Wichtigste:** Das Spiel soll zeigen, dass Gesetze von Menschen gemacht werden, die sich nicht einig sind – und dass man trotzdem etwas erreichen kann, wenn man zuhört, begründet und Kompromisse eingeht. Wenn eine Spielerin oder ein Spieler nach 20 Minuten sagt: „Ich hätte nicht gedacht, dass ein einziger Schwellenwert so viel Streit auslöst“ – dann hat „Mehrheit“ funktioniert.
