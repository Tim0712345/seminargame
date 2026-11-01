# Quellen und zu prüfende Fakten – „Mehrheit“

Alle echten Zahlen und Fakten stehen nur in `data/fakten.js`. **Keiner davon ist bisher geprüft.**
Die Werte sind Schätzwerte nach bisherigem Kenntnisstand und müssen vor der Abgabe mit der
genannten Quelle abgeglichen werden. Danach in `data/fakten.js` den Wert korrigieren,
`verifiziert: true` setzen und hier „ja“ eintragen. Werte mit „unsicher“ unbedingt nachschlagen.

| Feld | Inhalt | Schätzwert | Vorgeschlagene Quelle | Wo nachschlagen | verifiziert |
|---|---|---|---|---|---|
| `gpg_eu` | Unbereinigter Gender Pay Gap in der EU | 12,0 % (2023) | Eurostat, Tabelle sdg_05_20 | ec.europa.eu/eurostat – Datenbank – Suche „sdg_05_20“ | nein |
| `gpg_de` | Unbereinigter Gender Pay Gap Deutschland (EU-Methode) | 17,6 % (2023) | Eurostat, Tabelle sdg_05_20 | ec.europa.eu/eurostat – Datenbank – Suche „sdg_05_20“ | nein |
| `gpg_de_destatis` | Unbereinigter Gender Pay Gap Deutschland (Destatis) | 16 % (2024) | Destatis, Pressemitteilung zum Gender Pay Gap | destatis.de – Presse – Suche „Gender Pay Gap“ | nein |
| `gpg_de_bereinigt` | Bereinigter Gender Pay Gap Deutschland | 6 % (2024) | Destatis, Pressemitteilung zum Gender Pay Gap | destatis.de – Presse – Suche „bereinigter Gender Pay Gap“ | nein |
| `gpg_land_min` | EU-Land mit dem niedrigsten unbereinigten Gender Pay Gap | -0,9 % (Luxemburg) (2023) – unsicher | Eurostat, Tabelle sdg_05_20 | ec.europa.eu/eurostat – sdg_05_20 – Länder sortieren | nein |
| `gpg_land_max` | EU-Land mit dem höchsten unbereinigten Gender Pay Gap | 19,0 % (Lettland) (2023) – unsicher | Eurostat, Tabelle sdg_05_20 | ec.europa.eu/eurostat – sdg_05_20 – Länder sortieren | nein |
| `rl_nummer` | Richtlinie zur Stärkung der Anwendung des Grundsatzes des gleichen Entgelts für Männer und Frauen bei gleicher oder gleichwertiger Arbeit durch Entgelttransparenz und Durchsetzungsmechanismen | Richtlinie (EU) 2023/970 (2023) | EUR-Lex | eur-lex.europa.eu – Suche „2023/970“ | nein |
| `rl_datum` | Datum der Annahme der Richtlinie | 10. Mai 2023 (2023) | EUR-Lex | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Dokumentinformationen | nein |
| `rl_frist` | Umsetzungsfrist für die Mitgliedstaaten | 7. Juni 2026 (2026) | EUR-Lex, Richtlinie (EU) 2023/970, Art. 34 | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 34 | nein |
| `rl_vorschlag` | Vorschlag der Europäischen Kommission | März 2021 (2021) | EUR-Lex, COM(2021) 93 | eur-lex.europa.eu – Suche „COM(2021) 93“ | nein |
| `rl_bericht_250` | Berichtspflicht für Arbeitgeber ab 250 Beschäftigten: jährlich | ab 2027 (für 2026), danach jährlich (2027) | Richtlinie (EU) 2023/970, Art. 9 | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 9 | nein |
| `rl_bericht_150` | Berichtspflicht für Arbeitgeber mit 150 bis 249 Beschäftigten | ab 2027, alle drei Jahre (2027) | Richtlinie (EU) 2023/970, Art. 9 | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 9 | nein |
| `rl_bericht_100` | Berichtspflicht für Arbeitgeber mit 100 bis 149 Beschäftigten | ab 2031, alle drei Jahre (2031) | Richtlinie (EU) 2023/970, Art. 9 | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 9 | nein |
| `rl_schwelle_bewertung` | Gemeinsame Entgeltbewertung, wenn ein nicht begründeter Unterschied von mindestens diesem Wert besteht und nicht innerhalb von sechs Monaten behoben wird | 5 % (2023) | Richtlinie (EU) 2023/970, Art. 10 | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 10 | nein |
| `rl_stellenanzeige` | Entgelttransparenz vor der Beschäftigung | Information über Einstiegsgehalt oder Spanne vor dem Vorstellungsgespräch (2023) | Richtlinie (EU) 2023/970, Art. 5 | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 5 | nein |
| `rl_vorgehalt` | Frage nach dem bisherigen Entgelt | Verbot, nach dem bisherigen Gehalt zu fragen (2023) | Richtlinie (EU) 2023/970, Art. 5 | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 5 | nein |
| `rl_auskunft` | Auskunftsrecht der Beschäftigten | Auskunftsrecht über die durchschnittliche Entgelthöhe nach Geschlecht für gleiche oder gleichwertige Arbeit (2023) | Richtlinie (EU) 2023/970, Art. 7 | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 7 | nein |
| `rl_beweislast` | Beweislast bei Verdacht auf Entgeltdiskriminierung | Verlagerung der Beweislast auf den Arbeitgeber (2023) | Richtlinie (EU) 2023/970, Art. 18 | eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 18 | nein |
| `aeuv_157` | Gleiches Entgelt für Männer und Frauen bei gleicher oder gleichwertiger Arbeit (Rechtsgrundlage) | Artikel 157 AEUV (2009) | EUR-Lex, AEUV | eur-lex.europa.eu – Vertrag über die Arbeitsweise der Europäischen Union – Artikel 157 | nein |
| `rv_1957` | Grundsatz des gleichen Entgelts seit den Römischen Verträgen | 1957 (1957) | EUR-Lex / Geschichte der EU | european-union.europa.eu – Geschichte der EU – Römische Verträge | nein |
| `wlb_rl` | Vereinbarkeitsrichtlinie (Elternzeit, Vaterschaftsurlaub) | Richtlinie (EU) 2019/1158 (2019) | EUR-Lex | eur-lex.europa.eu – Suche „2019/1158“ | nein |
| `eu_mitgliedstaaten` | Zahl der EU-Mitgliedstaaten | 27 (2026) | Europäische Union, offizielle Website | european-union.europa.eu – Länder | nein |
| `ep_sitze` | Sitze im Europäischen Parlament (Wahlperiode ab 2024) | 720 (2024) | Europäisches Parlament | europarl.europa.eu – Abgeordnete | nein |
| `entgtranspg` | Deutsches Entgelttransparenzgesetz: Auskunftsanspruch in Betrieben ab dieser Zahl von Beschäftigten (seit 2017) | 200 Beschäftigten (2017) | Bundesgesetzblatt / BMFSFJ | gesetze-im-internet.de – EntgTranspG | nein |
| `teilzeit_frauen_eu` | Teilzeitquote der erwerbstätigen Frauen in der EU | 27,9 % (2023) | Eurostat, Tabelle lfsa_eppgan | ec.europa.eu/eurostat – Datenbank – Suche „lfsa_eppgan“ | nein |
| `teilzeit_maenner_eu` | Teilzeitquote der erwerbstätigen Männer in der EU | 7,7 % (2023) | Eurostat, Tabelle lfsa_eppgan | ec.europa.eu/eurostat – Datenbank – Suche „lfsa_eppgan“ | nein |
| `amtssprachen` | Zahl der Amtssprachen der EU | 24 (2026) | Europäische Union, offizielle Website | european-union.europa.eu – Sprachen | nein |

Im Spiel erscheinen alle Fakten am Ende auf der Seite „So ist es wirklich“ in einer automatisch erzeugten
Quellenliste mit Prüfstatus („noch nicht geprüft“ / „geprüft“). Ungeprüfte Zahlen sind im Debug-Modus
rot unterstrichen.

## Spielwerte (keine Fakten)

Zahlen der Spielmechanik stehen in `data/spielwerte.js` und sind dort als „Spielwert, frei gewählt“ markiert
(z. B. 60 Ausschusssitze, 120 Punkte im Plenarsaal, sechs Termine, Schwellen in Artikel 5).
Sie werden im Spiel nie als echte Zahlen ausgegeben. Wo ein Spielwert zufällig der echten Regelung entspricht,
zeigt der Vergleich am Ende den echten Wert aus `data/fakten.js`.

## Erfundenes

Alle Personen, Fraktionen, Firmen, Räume und Geschichten sind erfunden. Echte Abgeordnete oder Kommissar*innen
kommen nicht vor; echte Logos werden nicht nachgebaut.
