/* =====================================================================
   Die Lücke – Quests
   ---------------------------------------------------------------------
   titel         Überschrift im Questlog
   viertel       Länderkürzel (für den Hinweis im HUD), null = Hauptquest
   sichtbarWenn  Bedingung, ab wann die Quest erscheint
   schritte      { text, fertigWenn: Bedingung }
   Der HUD-Hinweis zeigt immer den ersten offenen Schritt – bevorzugt aus
   dem Viertel, in dem Kim gerade ist.
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.quests = {

  haupt: {
    titel: "Die Lücke",
    viertel: null,
    sichtbarWenn: "intro_fertig",
    schritte: [
      { text: "Geh ins Deutschland-Viertel (Weg nach Westen)", fertigWenn: "war_in_de|beweis_de" },
      { text: "Bring das Beweisstück aus Deutschland zu Dr. Laurent", fertigWenn: "hub_laurent_de" },
      { text: "Untersuche das Schweden-Viertel", fertigWenn: "beweis_se" },
      { text: "Untersuche das Estland-Viertel", fertigWenn: "beweis_ee" },
      { text: "Untersuche das Luxemburg-Viertel", fertigWenn: "beweis_lu" },
      { text: "Öffne das Tor nach Brüssel", fertigWenn: "finale_fertig" }
    ]
  },

  de: {
    titel: "Teilzeit & Kinderbetreuung",
    viertel: "de",
    sichtbarWenn: "intro_fertig",
    schritte: [
      { text: "Sprich mit Lea vor der Kita", fertigWenn: "de_lea_fertig" },
      { text: "Frag Tobias am Fahrradständer, wie seine Familie es macht", fertigWenn: "de_tobias_fertig" },
      { text: "Frag in der Kita nach der Warteliste", fertigWenn: "beweis_de" }
    ],
    belohnung: { beweis: "de" }
  }
};
