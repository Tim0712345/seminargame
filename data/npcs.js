/* =====================================================================
   Die Lücke – NPCs (Nicht-Spieler-Figuren)
   ---------------------------------------------------------------------
   Wird ab Phase 2 gefüllt. Aufbau eines Eintrags:

   DATA.npcs.de_lea = {
     figur: "lea",            // Aussehen aus characters.js
     karte: "de",             // auf welcher Karte
     start: [12, 8],          // Kachel x, y
     dialog: "de_lea",        // Dialog aus dialogues.js
     quest: true,             // Quest-Figur (bekommt „!“)
     routine: [               // Tagesablauf, läuft in Schleife
       { tun: "gehen",   weg: [[12, 8], [18, 8]] },
       { tun: "warten",  s: 3 },
       { tun: "sitzen",  an: "bank_1", s: 8 },
       { tun: "giessen", an: "beet_2", s: 5 }
     ]
   };
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.npcs = {};
