# Standbilder Phasen 2–5

Gerechnet in **headless Chromium mit SwiftShader** (Software-Grafik auf der CPU, keine Grafikkarte).
Die Zeiten pro Bild sind deshalb **nicht** aussagekräftig für echte Geräte – sie zeigen nur, welche Szenen relativ teuer sind.
Zeichenaufrufe und Dreiecke sind dagegen echte Werte (Budget „Hoch“: höchstens 300 Aufrufe, 1,5 Mio. Dreiecke).

| Szene | ms/Bild (SwiftShader) | Zeichenaufrufe | Dreiecke | Auflösung |
|---|---|---|---|---|
| Kapitel 1 – Büro: Mira und die Spielfigur | 4456 | 220 | 405k | 1280×720 |
| Kapitel 2 – Anhörung im Ausschusssaal | 1333 | 179 | 846k | 1280×720 |
| Kapitel 2 – Gespräch mit Inès (Schulterblick) | 1609 | 127 | 725k | 1280×720 |
| Kapitel 3 – Entwurf: HTML-Seite über dem 3D-Blatt | 8219 | 128 | 238k | 1280×720 |
| Kapitel 3 – Füllfeder ändert Artikel 4, Haftnotiz | 6400 | 135 | 239k | 1280×720 |
| Kapitel 4 – Schnittmodell mit Räumen | 1381 | 259 | 678k | 1280×720 |
| Kapitel 4 – Verhandlung im Büro der EVM | 2121 | 169 | 538k | 1280×720 |
| Kapitel 5 – Ausschussabstimmung | 1237 | 49 | 382k | 1280×720 |
| Kapitel 6 – Trilog: Vier-Spalten-Tabelle | 1468 | 162 | 348k | 1280×720 |
| Kapitel 6 – Trilog-Raum bei Nacht | 1443 | 162 | 348k | 1280×720 |
| Kapitel 7 – Plenum | 2539 | 73 | 1370k | 1280×720 |
| Kapitel 7 – Rede am Pult | 1632 | 81 | 1415k | 1280×720 |
| Kapitel 7 – Abstimmung im Plenum | 2594 | 73 | 1370k | 1280×720 |
| Epilog – Fünf Jahre später | 1251 | 11 | 2k | 1280×720 |

Stufe „Hoch“, 1280×720. Zusätzlich: iPad hochkant (820×1180, Stufe Niedrig), Dokumentmodus (ohne WebGL) und Stufe Niedrig.
Nicht getestet: echtes iPad/Safari, Firefox, Windows-Schul-Laptop, echte Grafikkarte.
