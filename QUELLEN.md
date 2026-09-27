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

*(Diese Liste wird in jeder Phase ergänzt, sobald neue Zahlen dazukommen.)*
