# Quellen und zu prüfende Fakten

Alle Zahlen im Spiel stehen in `data/facts.js`. **Keine davon ist bisher geprüft.**
Die eingetragenen Werte sind Schätzwerte und müssen vor der Abgabe mit der
genannten Quelle abgeglichen werden. Nach der Prüfung in `facts.js` den Wert
korrigieren, `verifiziert: true` setzen und hier „ja“ eintragen.

| Feld | Platzhalter (Schätzwert) | Vorgeschlagene Quelle | verifiziert |
|---|---|---|---|
| `gpg_eu` | 12,0 % (2023) | Eurostat, Tabelle `sdg_05_20` (Gender Pay Gap in unadjusted form) | nein |
| `gpg_de` | 17,6 % (2023) | Eurostat `sdg_05_20`; zum Vergleich Destatis (Statistisches Bundesamt) | nein |
| `gpg_se` | 11,2 % (2023) | Eurostat `sdg_05_20` | nein |
| `gpg_ee` | 17,7 % (2023) | Eurostat `sdg_05_20` | nein |
| `gpg_lu` | −0,7 % (2023) | Eurostat `sdg_05_20` | nein |
| `gpg_de_bereinigt` | 6 % (2023) | Destatis, Pressemitteilung zum Gender Pay Gap | nein |
| `de_gpg_unbereinigt_destatis` | 18 % (2023) | Destatis, Pressemitteilung zum Gender Pay Gap (unbereinigt, gleiches Jahr wie bereinigt) | nein |
| `de_gpg_erklaert_anteil` | 64 % (2023) | Destatis, Pressemitteilung zum Gender Pay Gap (erklärter Anteil der Lücke) | nein |
| `gpg_be` | 0,7 % (2023) | Eurostat `sdg_05_20` (Belgien, Infoschild in Brüssel) | nein |
| `de_teilzeit_frauen` | 50 % (2023) | Destatis (Mikrozensus) bzw. Eurostat `lfsa_eppgan` – Teilzeitquote Frauen | nein |
| `de_teilzeit_maenner` | 13 % (2023) | Destatis (Mikrozensus) bzw. Eurostat `lfsa_eppgan` – Teilzeitquote Männer | nein |
| `de_teilzeit_grund_betreuung` | 28 % (2023) | Eurostat `lfsa_epgar` – Hauptgrund Teilzeit: Betreuung von Kindern/Angehörigen (Frauen, DE) | nein |
| `de_kita_fehlende_plaetze` | 300.000 Plätze (2023) | IW Köln, Kurzbericht zur Kita-Lücke; alternativ Bertelsmann Stiftung, Ländermonitor Frühkindliche Bildungssysteme | nein |
| `de_gender_pension_gap` | 27 % (2023) | Destatis, Gender Pension Gap | nein |
| `de_frauen_fuehrung` | 29 % (2023) | Destatis, Frauen in Führungspositionen | nein |
| `se_elterngeld_tage` | 480 Tage (2024) | Försäkringskassan – föräldrapenning | nein |
| `se_reservierte_tage` | 90 Tage (2024) | Försäkringskassan – reservierte Tage pro Elternteil | nein |
| `se_vaeter_anteil_tage` | 30 % (2023) | Försäkringskassan – Anteil der von Vätern genutzten Elterngeldtage | nein |
| `de_partnermonate` | 2 Monate (2024) | BMFSFJ / Bundeselterngeld- und Elternzeitgesetz (BEEG) | nein |
| `de_vaeter_elterngeld_anteil` | 46 % (2022) | Destatis, Elterngeldstatistik (Väterbeteiligung) | nein |
| `de_vaeter_bezugsdauer` | 3,6 Monate (2022) | Destatis, Elterngeldstatistik | nein |
| `de_muetter_bezugsdauer` | 14,6 Monate (2022) | Destatis, Elterngeldstatistik | nein |
| `ee_lohn_it` | 3.300 € (2023) | Statistikaamet (Statistik Estland) – Bruttomonatslohn nach Wirtschaftszweig | nein |
| `ee_lohn_bau` | 1.900 € (2023) | Statistikaamet | nein |
| `ee_lohn_pflege` | 1.800 € (2023) | Statistikaamet | nein |
| `ee_lohn_bildung` | 1.600 € (2023) | Statistikaamet | nein |
| `ee_frauen_it` | 30 % (2023) | Eurostat `lfsa_egan2` – Beschäftigte nach Geschlecht und Wirtschaftszweig (EE) | nein |
| `ee_frauen_bau` | 12 % (2023) | Eurostat `lfsa_egan2` | nein |
| `ee_frauen_pflege` | 85 % (2023) | Eurostat `lfsa_egan2` | nein |
| `ee_frauen_bildung` | 80 % (2023) | Eurostat `lfsa_egan2` | nein |
| `lu_frauen_fuehrung` | 22 % (2023) | Eurostat `lfsa_egais` bzw. EIGE Gender Statistics Database | nein |
| `eu_frauen_fuehrung` | 35 % (2023) | Eurostat `lfsa_egais` bzw. EIGE Gender Statistics Database | nein |
| `eu_richtlinie_jahr` | 2023 | EUR-Lex, Richtlinie (EU) 2023/970 (CELEX 32023L0970) | nein |
| `eu_richtlinie_frist` | 7. Juni 2026 | Richtlinie (EU) 2023/970, Art. 34 (Umsetzungsfrist) | nein |

## Hinweise zur Prüfung

- **Jahr beachten:** Eurostat aktualisiert die Werte jährlich. Am besten
  überall dasselbe, neueste verfügbare Jahr verwenden und im Spiel nennen.
- **Unbereinigt und bereinigt nicht verwechseln:** Eurostat `sdg_05_20` ist
  der *unbereinigte* Wert. Der *bereinigte* Wert (der „unerklärte Rest“)
  kommt von nationalen Statistikämtern und ist nicht zwischen allen Ländern
  vergleichbar.
- **Luxemburg:** Der unbereinigte Wert liegt nahe null oder darunter. Im
  Spiel wird genau das thematisiert: Ein Durchschnitt zeigt nicht alles.
  Bitte besonders sorgfältig prüfen.

- **Kita-Lücke:** Verschiedene Institute schätzen unterschiedlich (je nach Methode und
  Jahr). Im Spiel steht „rund … fehlende Plätze“ – bitte eine Quelle wählen und im Text
  (`DATA.notes.kita_luecke` in `facts.js`) nennen.
- **Estland-Minispiel:** Die vier Gehälter müssen sich unterscheiden, sonst ist das
  Zuordnen nicht eindeutig. Bitte dieselbe Quelle und dasselbe Jahr für alle vier nehmen.
- **Hinweis zu Spielinhalten:** Angaben wie „Lea arbeitet 20 Stunden“ oder „Frau Okafor
  arbeitet 30 Stunden“ sind erfundene Geschichten der Figuren, keine Statistiken. Das gilt
  auch für die „8 Prozent“ in der Verhandlungsübung und die Beförderungsliste in Luxemburg.

- **Archiv in Brüssel:** Die drei Werte `de_gpg_unbereinigt_destatis`, `de_gpg_erklaert_anteil`
  und `gpg_de_bereinigt` müssen aus **derselben** Destatis-Veröffentlichung (gleiches Jahr)
  stammen. Das Spiel erklärt, dass Eurostat (`gpg_de`) etwas anders rechnet – beide Werte
  bitte prüfen.
- **Reflexionsseite:** Sie listet automatisch alle Quellen aus `facts.js` auf und markiert
  ungeprüfte als „noch nicht geprüft“. Sobald alle Werte `verifiziert: true` haben,
  verschwindet der Hinweis.

*(Diese Liste wird in jeder Phase ergänzt, sobald neue Zahlen dazukommen.)*
