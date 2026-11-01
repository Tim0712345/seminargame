/* =====================================================================
   data/karten.js – Karten im Dossier (Abschnitt 5.4)
   ---------------------------------------------------------------------
   art:      "stimme" (Erfahrung einer Person), "beleg" (Fakt mit Quelle),
             "einwand" (begründeter Gegenpunkt)
   von:      Figur aus data/figuren.js
   text:     Kernaussage (Platzhalter {fakt:…} für Zahlen)
   fakt:     ID in data/fakten.js (nur bei Belegen)
   wirktBei: bei welchen Anliegen (Fraktion_Artikel) die Karte überzeugt
   staerke:  1 oder 2
   ===================================================================== */
var DATA = window.DATA || {};

DATA.karten = {
  /* Pflichtinhalte aus der Einführung von Prof. Weiß (immer im Dossier) */
  weiss_stundenlohn: { art: "beleg", von: "weiss", fakt: "gpg_eu",
    text: "Der Gender Pay Gap vergleicht durchschnittliche Bruttostundenlöhne. In der EU liegt er bei {fakt:gpg_eu} ({jahr:gpg_eu}, {quelle:gpg_eu}).",
    wirktBei: ["ASG_bericht", "GZL_auskunft", "EVM_bericht", "FU_auskunft"], staerke: 1 },
  weiss_bereinigt: { art: "beleg", von: "weiss", fakt: "gpg_de_bereinigt",
    text: "Deutschland: unbereinigt {fakt:gpg_de_destatis}, bereinigt {fakt:gpg_de_bereinigt} ({jahr:gpg_de_bereinigt}, {quelle:gpg_de_bereinigt}). Der unerklärte Teil ist ein Hinweis, kein Beweis.",
    wirktBei: ["BFW_bericht", "EVM_folgen", "GZL_folgen", "ASG_auskunft"], staerke: 1 },

  /* Anhörung (Kapitel 2) */
  ines_vertrag: { art: "stimme", von: "ines",
    text: "„Ich weiß nicht, was meine Kollegin verdient – es steht im Vertrag, dass wir nicht darüber reden dürfen.“",
    wirktBei: ["ASG_auskunft", "GZL_auskunft", "FU_auskunft"], staerke: 2 },
  ines_gespraech: { art: "stimme", von: "ines",
    text: "„Im Vorstellungsgespräch habe ich einfach die erste Zahl genommen. Ich wusste ja nicht, was üblich ist.“",
    wirktBei: ["FU_vorher", "GZL_auskunft", "BFW_vorher"], staerke: 1 },
  weiss_unerklaert: { art: "einwand", von: "weiss",
    text: "Unerklärt heißt nicht automatisch Diskriminierung. Wer eine Lücke findet, sollte sie erst prüfen – und dann beheben.",
    wirktBei: ["BFW_bericht", "EVM_folgen", "BSN_durchsetzung", "GZL_folgen"], staerke: 2 },
  karin_vorlagen: { art: "einwand", von: "karin",
    text: "Vorlagen und Fristen: Ohne kostenlose Vorlagen und genug Zeit ist eine faire Entgeltbewertung für Betriebe ohne große Personalabteilung kaum machbar.",
    wirktBei: ["BFW_bericht", "BFW_bewertung", "EVM_bericht", "EVM_bewertung"], staerke: 2, trilog: true },
  nadia_pflege: { art: "stimme", von: "nadia",
    text: "„Pflege ist körperlich und emotional schwer. Trotzdem wird sie schlechter bewertet als technische Berufe mit ähnlicher Verantwortung.“",
    wirktBei: ["GZL_bewertung", "BSN_bewertung", "FU_auskunft", "EVM_bewertung"], staerke: 2 },
  mateusz_haelfte: { art: "einwand", von: "mateusz",
    text: "Teilzeit wirkt über den Stundenlohn und die Beförderung. Viele Ursachen – Kitas, Elternzeit – liegen außerhalb eines Transparenzgesetzes.",
    wirktBei: ["BSN_durchsetzung", "BSN_bericht", "EVM_folgen"], staerke: 1 },

  /* Bibliothek (Kapitel 4): drei zur Auswahl, eine kann man nehmen */
  bib_entgtranspg: { art: "beleg", von: "bibliothek", fakt: "entgtranspg",
    text: "In Deutschland gilt ein Auskunftsanspruch bisher erst in Betrieben ab {fakt:entgtranspg} ({quelle:entgtranspg}).",
    wirktBei: ["ASG_auskunft", "FU_auskunft", "GZL_auskunft", "ASG_bericht"], staerke: 2 },
  bib_vertrag: { art: "beleg", von: "bibliothek", fakt: "aeuv_157",
    text: "Gleiches Entgelt bei gleicher oder gleichwertiger Arbeit ist seit {fakt:rv_1957} ein Grundsatz der Gemeinschaft. Rechtsgrundlage: {fakt:aeuv_157}.",
    wirktBei: ["BSN_durchsetzung", "BSN_bewertung", "BSN_bericht", "EVM_folgen"], staerke: 2 },
  bib_teilzeit: { art: "beleg", von: "bibliothek", fakt: "teilzeit_frauen_eu",
    text: "In der EU arbeiten {fakt:teilzeit_frauen_eu} der erwerbstätigen Frauen in Teilzeit, aber nur {fakt:teilzeit_maenner_eu} der Männer ({jahr:teilzeit_frauen_eu}, {quelle:teilzeit_frauen_eu}).",
    wirktBei: ["EVM_bericht", "FU_vorher", "GZL_bewertung", "BFW_vorher"], staerke: 1 }
};

/* Welche Karten die Bibliothek anbietet */
DATA.bibliothek = ["bib_entgtranspg", "bib_vertrag", "bib_teilzeit"];
