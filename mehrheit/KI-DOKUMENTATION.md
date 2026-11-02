# Dokumentation des KI-Einsatzes

*Projekt: „Mehrheit – Ein Gesetz gegen die Lohnlücke“*

## Eigene Leistung

<!-- Was habe ich selbst gemacht? (Idee, Konzept, Figuren, Fraktionen, Texte, Recherche, Prüfung der Fakten, Tests …) -->
- Konzept und Bauanleitung („Mehrheit – Prompt“, Stand 31. Oktober 2026)


## Einsatz von KI

<!-- Welche KI-Werkzeuge wurden wofür eingesetzt? In welchen Arbeitsschritten? -->
- Phase 1 (3D-Stil-Prototyp): Programmierung der 3D-Maschine, der Räume, Figuren und Oberfläche
  mit Claude Code nach meinem Konzept. Alle Zahlen wurden als ungeprüfte Schätzwerte eingetragen.
- Phasen 2 bis 5 (ganzes Spiel): Programmierung aller Kapitel, der Oberfläche, des Dokumentmodus,
  der Töne, des Admin-Menüs und der Prüfwerkzeuge mit Claude Code nach meinem Konzept.
  Die Spieltexte (Gespräche, Gesetzesoptionen, Karten, Epilog, Vergleich) hat die KI nach den Vorgaben
  im Konzept entworfen; sie müssen von mir gelesen und überarbeitet werden.
- Überarbeitung am 2. November 2026 (meine Rückmeldung: Menschen wie Pappfiguren, 21:9, Sprüche, dunkler Trilog):
  Die KI hat ein Python-Werkzeug geschrieben (`werkzeuge/`), das Köpfe, Hände, Kleidung und Frisuren aus
  mathematischen Formen (Abstandsfeldern) erzeugt, und den Figurenbau im Spiel neu programmiert. Keine fremden
  3D-Modelle, Bilder oder Bibliotheken im Spiel; das Werkzeug nutzt beim Erzeugen die freien Python-Pakete
  numpy, scipy, scikit-image und fast-simplification. Außerdem: Bildformate, Texte ohne Witzsätze, neuer Trilog-Raum.
- Die Spielwerte (Schwellen der Fraktionen, Haltungen zu den Optionen) hat die KI mit einer
  Balance-Prüfung abgestimmt, die alle Fassungen des Gesetzes durchrechnet.
- Getestet wurde automatisch in einem Browser ohne Grafikkarte (drei komplette Durchläufe, Dokumentmodus,
  Tastatur). Nicht getestet: echte Geräte (iPad, Schul-Laptop), Safari, Firefox.


## Von mir geprüft/geändert

<!-- Was habe ich kontrolliert, korrigiert, ergänzt oder verworfen? Welche Fakten habe ich geprüft? -->
- [ ] Alle 27 Fakten in `data/fakten.js` mit der Quelle abgeglichen (Liste in `QUELLEN.md`)
- [ ] Gesetzestexte und Vergleich mit der echten Richtlinie (EU) 2023/970 abgeglichen
- [ ] Alle Gespräche gelesen (Sprechweise der Figuren, keine Stereotype, jede Fraktion fair)
- [ ] Credits-Namen eingetragen (`data/vergleich.js`, `README.md`)

