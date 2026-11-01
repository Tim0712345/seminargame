# Bildzeiten Phase 1

Gemessen in **headless Chromium mit SwiftShader** (Software-Rendering auf der CPU, keine Grafikkarte).
Die Werte sind nur als **Verhältnis zwischen den Grafikstufen** brauchbar, nicht als echte Bildrate.
Echte Messung: `index.html?debug=1` auf dem Ziel-Laptop öffnen (Feld oben links: FPS, CPU- und GPU-Zeit).

| Stufe | Ansicht | Puffer | titel_flug | titel_ende | buero_totale | gespraech | gesetz | halbrund | stempel |
|---|---|---|---|---|---|---|---|---|---|
| hoch | 1280x720 | 1280x720 | 3136 ms / 38 Aufr. | 3200 ms / 29 Aufr. | 5061 ms / 220 Aufr. | 2820 ms / 138 Aufr. | 12397 ms / 128 Aufr. | 4584 ms / 126 Aufr. | 6842 ms / 152 Aufr. |
| hoch | 1920x1080 | 1920x1080 | 5744 ms / 38 Aufr. | 6339 ms / 29 Aufr. | 11093 ms / 220 Aufr. | 6295 ms / 138 Aufr. | 14026 ms / 128 Aufr. | 5463 ms / 126 Aufr. | 8265 ms / 152 Aufr. |
| mittel | 820x1180 | 697x1003 | 1693 ms / 39 Aufr. | 1671 ms / 31 Aufr. | 2368 ms / 220 Aufr. | 1596 ms / 140 Aufr. | 5264 ms / 130 Aufr. | 2712 ms / 125 Aufr. | 3114 ms / 149 Aufr. |
| mittel | 1180x820 | 1003x697 | 1596 ms / 39 Aufr. | 1706 ms / 29 Aufr. | 2718 ms / 220 Aufr. | 1618 ms / 138 Aufr. | 7257 ms / 128 Aufr. | 2798 ms / 124 Aufr. | 4464 ms / 145 Aufr. |
| mittel | 1280x720 | 1088x612 | 1598 ms / 38 Aufr. | 1573 ms / 29 Aufr. | 3073 ms / 220 Aufr. | 1711 ms / 138 Aufr. | 7598 ms / 128 Aufr. | 2957 ms / 126 Aufr. | 4197 ms / 152 Aufr. |
| mittel | 1920x1080 | 1632x918 | 3500 ms / 38 Aufr. | 3913 ms / 29 Aufr. | 5861 ms / 220 Aufr. | 2911 ms / 138 Aufr. | 13592 ms / 128 Aufr. | 5734 ms / 126 Aufr. | 8133 ms / 152 Aufr. |
| niedrig | 1280x720 | 896x504 | 402 ms / 19 Aufr. | 445 ms / 15 Aufr. | 1758 ms / 148 Aufr. | 641 ms / 105 Aufr. | 3636 ms / 98 Aufr. | 2551 ms / 99 Aufr. | 2106 ms / 111 Aufr. |
| niedrig | 1920x1080 | 1344x756 | 1548 ms / 19 Aufr. | 1795 ms / 15 Aufr. | 3857 ms / 148 Aufr. | 1600 ms / 105 Aufr. | 8023 ms / 98 Aufr. | 3186 ms / 99 Aufr. | 4272 ms / 111 Aufr. |
| ultra | 1280x720 | 1280x720 | 3922 ms / 38 Aufr. | 4292 ms / 29 Aufr. | 5968 ms / 220 Aufr. | 4145 ms / 138 Aufr. | 14685 ms / 128 Aufr. | 6229 ms / 126 Aufr. | 8515 ms / 152 Aufr. |
| ultra | 1920x1080 | 1920x1080 | 9092 ms / 38 Aufr. | 8512 ms / 29 Aufr. | 14376 ms / 220 Aufr. | 8454 ms / 138 Aufr. | 32007 ms / 128 Aufr. | 12821 ms / 126 Aufr. | 18600 ms / 152 Aufr. |
