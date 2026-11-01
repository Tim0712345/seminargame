/* =====================================================================
   data/gespraeche.js – alle Gespräche (Abschnitt 5.5)
   ---------------------------------------------------------------------
   Jedes Gespräch ist ein Netz aus Knoten:
     sprecher:  Figur (aus data/figuren.js)
     text:      Satz (Platzhalter erlaubt: {name}, {fakt:id}, {wert:id} …)
     geste:     Geste aus data/figuren.js (hand_heben, auf_papier_zeigen,
                arme_verschraenken, nicken)
     kamera:    "schuss" (Standard: über die Schulter auf die sprechende Figur)
                oder "totale"
     weiter:    nächster Knoten (wenn es keine Antworten gibt)
     antworten: zwei bis drei Antworten mit Ziel-Knoten; "ende" beendet
   Mira duzt die Spielfigur, alle anderen siezen.
   Für die Spielfigur werden nie Pronomen benutzt.
   ===================================================================== */
var DATA = window.DATA || {};

DATA.gespraeche = {

  /* Phase 1: kurzes Beispiel-Gespräch im Büro (Stil-Prototyp) */
  probe_luca: {
    ort: "buero",
    teilnehmer: ["mira", "luca"],
    start: "k1",
    knoten: {
      k1: { sprecher: "mira", text: "Besuch für dich, {name}. Luca Bianchi, Allianz für Soziale Gerechtigkeit. Er hat den Stapel schon gelesen. Natürlich.",
            geste: "nicken", weiter: "k2" },
      k2: { sprecher: "luca", text: "Guten Morgen, {name}. Ich mache es kurz: Wer nicht weiß, was die anderen verdienen, kann nicht einmal fragen, ob es fair ist.",
            geste: "hand_heben",
            antworten: [
              { text: "Was genau wollen Sie im Gesetz sehen?", ziel: "k3" },
              { text: "Und was sagen die kleinen Betriebe dazu?", ziel: "k4" }
            ] },
      k3: { sprecher: "luca", text: "Ein Auskunftsrecht, das man wirklich nutzen kann. Für alle Beschäftigten – nicht nur in großen Firmen.",
            geste: "auf_papier_zeigen", weiter: "k5" },
      k4: { sprecher: "luca", text: "Ich war Gewerkschaftssekretär in einer Fabrik. Ich weiß, was ein Formular kostet. Aber Schweigen kostet auch etwas.",
            geste: "arme_verschraenken", weiter: "k5" },
      k5: { sprecher: "mira", text: "Pieter de Wit wird dir heute noch erklären, was das für eine Firma mit zehn Leuten bedeutet. Beide haben einen Punkt.",
            geste: "arme_verschraenken", weiter: "k6" },
      k6: { sprecher: "luca", text: "Und bevor Sie fragen: Nein, den Espressoautomaten im dritten Stock habe ich nicht kaputt gemacht. Diesmal nicht.",
            geste: "nicken",
            antworten: [
              { text: "Danke. Ich denke darüber nach.", ziel: "ende" },
              { text: "Ich höre mir auch die andere Seite an.", ziel: "ende" }
            ] }
    }
  }
};
