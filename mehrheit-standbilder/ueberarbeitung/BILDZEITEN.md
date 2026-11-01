# Standbilder nach der Überarbeitung (1. November 2026)

Keine Tiefenschärfe, schlichte Modellfiguren, Aufgabenkarte, Mira-Hinweise, große Mehrheitsanzeige, ein Artikel pro Ansicht.

Gerechnet in **headless Chromium mit SwiftShader** (Software-Grafik auf der CPU, keine Grafikkarte).
Die Zeiten pro Bild sind deshalb **nicht** aussagekräftig für echte Geräte – sie zeigen nur, welche Szenen relativ teuer sind.
Zeichenaufrufe und Dreiecke sind dagegen echte Werte (Budget „Hoch“: höchstens 300 Aufrufe, 1,5 Mio. Dreiecke).

| Szene | ms/Bild (SwiftShader) | Zeichenaufrufe | Dreiecke | Auflösung |
|---|---|---|---|---|
| Titel – leerer Plenarsaal | 1571 | 29 | 453k | 1280×720 |
| Kapitel 1 – Mira erklärt den Auftrag (Aufgabenkarte oben links) | 1815 | 185 | 272k | 1280×720 |
| Kapitel 2 – Gespräch mit Inès (Schulterblick) | 1608 | 124 | 761k | 1280×720 |
| Kapitel 3 – Mira zeigt Schritt für Schritt | 6932 | 160 | 243k | 1280×720 |
| Kapitel 3 – ein Artikel, eine Frage, große Mehrheitsanzeige | 6934 | 166 | 244k | 1280×720 |
| Kapitel 4 – Schnittmodell mit Räumen | 1276 | 263 | 639k | 1280×720 |
| Kapitel 4 – Verhandlung im Büro der EVM | 2198 | 173 | 527k | 1280×720 |
| Kapitel 5 – Ausschussabstimmung | 1172 | 53 | 444k | 1280×720 |
| Kapitel 6 – Trilog: Vier-Spalten-Tabelle | 1410 | 194 | 273k | 1280×720 |
| Kapitel 6 – Trilog-Raum bei Nacht | 1403 | 191 | 272k | 1280×720 |
| Kapitel 7 – Plenum | 2477 | 79 | 1590k | 1280×720 |
| Kapitel 7 – Rede am Pult | 1491 | 87 | 1635k | 1280×720 |
| Kapitel 7 – Abstimmung im Plenum | 2397 | 79 | 1590k | 1280×720 |
| Epilog – Fünf Jahre später | 1070 | 11 | 2k | 1280×720 |

Stufe „Hoch“, 1280×720. Zusätzlich: iPad hochkant (820×1180, Stufe Niedrig) und Dokumentmodus (ohne WebGL). Plenum nach Vereinfachung der Menge: 1415 Tsd. Dreiecke.
Nicht getestet: echtes iPad/Safari, Firefox, Windows-Schul-Laptop, echte Grafikkarte.
