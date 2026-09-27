/* =====================================================================
   Die Lücke – Quests
   ---------------------------------------------------------------------
   Wird ab Phase 2 gefüllt. Ein Schritt gilt als erledigt, sobald sein
   Flag gesetzt ist. Aufbau:

   DATA.quests.de = {
     titel: "Teilzeit & Kinderbetreuung", viertel: "de",
     schritte: [
       { text: "Befrage Lea vor der Kita", fertigWenn: "de_lea_fertig" }
     ],
     belohnung: { beweis: "de" }
   };
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.quests = {};
