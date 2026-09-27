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
      { text: "Erzähl Dr. Laurent am Brunnen, was du in Deutschland gelernt hast", fertigWenn: "hub_laurent_de|beweis_se|beweis_ee|beweis_lu" },
      { text: "Untersuche das Schweden-Viertel (Weg nach Osten)", fertigWenn: "beweis_se" },
      { text: "Untersuche das Estland-Viertel (Weg nach Südwesten)", fertigWenn: "beweis_ee" },
      { text: "Untersuche das Luxemburg-Viertel (Weg nach Südosten)", fertigWenn: "beweis_lu" },
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
  },

  se: {
    titel: "Elternzeit-Aufteilung",
    viertel: "se",
    sichtbarWenn: "war_in_se",
    schritte: [
      { text: "Frag im Familienamt, wie Elternzeit in Schweden funktioniert", fertigWenn: "se_amt_fertig" },
      { text: "Sprich mit der Familie am See", fertigWenn: "beweis_se" }
    ],
    belohnung: { beweis: "se" }
  },

  ee: {
    titel: "Branchen & Berufswahl",
    viertel: "ee",
    sichtbarWenn: "war_in_ee",
    schritte: [
      { text: "Frag an allen vier Messeständen nach dem Gehalt", fertigWenn: "ee_stand_it&ee_stand_pflege&ee_stand_bau&ee_stand_soziales" },
      { text: "Spiel bei Kadri „Welche Branche zahlt mehr?“", fertigWenn: "ee_minispiel" },
      { text: "Hol dir Kadris Gehaltstabelle", fertigWenn: "beweis_ee" }
    ],
    belohnung: { beweis: "ee" }
  },

  lu: {
    titel: "Gehaltsverhandlung & Beförderung",
    viertel: "lu",
    sichtbarWenn: "war_in_lu",
    schritte: [
      { text: "Sprich mit Dr. Hoffmann auf der Brücke", fertigWenn: "lu_hoffmann_fertig" },
      { text: "Fahr im Hochhaus in die 2. Etage und übe mit Herrn Schmit eine Gehaltsverhandlung", fertigWenn: "lu_verhandelt" },
      { text: "Frag Herrn Schmit nach den Beförderungen", fertigWenn: "beweis_lu" }
    ],
    belohnung: { beweis: "lu" }
  }
};
