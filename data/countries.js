/* =====================================================================
   Die Lücke – Länder und Viertel
   ---------------------------------------------------------------------
   Pro Viertel: Name, Ursache der Lohnlücke, Beweisstück und die
   Fakt-ID für das Infoschild. Wird ab Phase 2 im Spiel verwendet.
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.countries = {
  de: {
    name: "Deutschland",
    viertel: "Deutschland-Viertel",
    ursache: "Teilzeit & Kinderbetreuung",
    fakt: "gpg_de",
    beweis: { name: "Kita-Warteliste", kurz: "Wer keinen Betreuungsplatz findet, arbeitet oft weniger Stunden." }
  },
  se: {
    name: "Schweden",
    viertel: "Schweden-Viertel",
    ursache: "Aufteilung der Elternzeit",
    fakt: "gpg_se",
    beweis: { name: "Elternzeit-Kalender", kurz: "Wie Eltern die Elternzeit aufteilen, prägt die Jahre danach." }
  },
  ee: {
    name: "Estland",
    viertel: "Estland-Viertel",
    ursache: "Branchen & Berufswahl",
    fakt: "gpg_ee",
    beweis: { name: "Gehaltstabelle der Messe", kurz: "Branchen zahlen sehr unterschiedlich – und sind unterschiedlich besetzt." }
  },
  lu: {
    name: "Luxemburg",
    viertel: "Luxemburg-Viertel",
    ursache: "Gehaltsverhandlung & Beförderung",
    fakt: "gpg_lu",
    beweis: { name: "Beförderungsliste", kurz: "Ein kleiner Durchschnittswert zeigt nicht alles." }
  },
  bxl: {
    name: "Belgien",
    viertel: "Brüssel",
    ursache: "Unerklärter Rest",
    fakt: "gpg_de_bereinigt",
    beweis: { name: "Akte „Unerklärter Rest“", kurz: "Ein Teil der Lücke lässt sich nicht durch Beruf, Branche oder Arbeitszeit erklären." }
  }
};
