/* =====================================================================
   Die Lücke – NPCs (Nicht-Spieler-Figuren)
   ---------------------------------------------------------------------
   figur        Aussehen aus characters.js
   karte        auf welcher Karte (maps.js)
   start        Startkachel [x, y] (Kommazahlen erlaubt)
   blick        Blickrichtung in Grad (0 = Süden/zur Kamera, 180 = Norden)
   dialog       Dialog aus dialogues.js
   hinweis      Bedingung: solange erfüllt, schwebt ein „!“ über dem Kopf
   nurWenn      Bedingung: NPC ist nur dann da
   routineWenn  Bedingung: Tagesablauf startet erst dann (vorher steht der NPC)
   routine      Tagesablauf (läuft in Schleife):
     { tun: "gehen",   weg: [[x, y], …] }
     { tun: "warten",  s: 3 }
     { tun: "sitzen",  an: "objekt_id", s: 8 }
     { tun: "giessen", an: "objekt_id", s: 5 }
     { tun: "schauen", richtung: 90, s: 4 }
   Bedingungen: "flag", "!flag", "a&b", "a|b"
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.npcs = {

  // ======================= Europaplatz =======================
  laurent: {
    figur: "laurent", karte: "europaplatz", start: [17.5, 21.1], blick: 0,
    dialog: "hub_laurent", hinweis: "beweis_de&!hub_laurent_de",
    routineWenn: "intro_fertig",
    routine: [
      { tun: "gehen", weg: [[17.5, 20.3], [15.5, 19.8]] },
      { tun: "schauen", richtung: 160, s: 6 },
      { tun: "gehen", weg: [[19.5, 19.8]] },
      { tun: "schauen", richtung: -160, s: 6 }
    ]
  },
  anna: {
    figur: "anna", karte: "europaplatz", start: [16.1, 21.6], blick: 30,
    dialog: "hub_anna",
    routineWenn: "intro_fertig",
    routine: [
      { tun: "gehen", weg: [[15.2, 19.2]] },
      { tun: "sitzen", an: "hub_bank_4", s: 40 },
      { tun: "schauen", richtung: 45, s: 4 }
    ]
  },
  jonas: {
    figur: "jonas", karte: "europaplatz", start: [18.9, 21.6], blick: -30,
    dialog: "hub_jonas",
    routineWenn: "intro_fertig",
    routine: [
      { tun: "gehen", weg: [[20.8, 19.2]] },
      { tun: "sitzen", an: "hub_bank_3", s: 40 },
      { tun: "schauen", richtung: -45, s: 4 }
    ]
  },
  sanne: {
    figur: "sanne", karte: "europaplatz", start: [23.9, 14], blick: 0,
    dialog: "hub_sanne",
    routine: [
      { tun: "gehen", weg: [[20.7, 19.5], [14.3, 19.5], [11.1, 14], [14.3, 8.5], [20.7, 8.5], [23.9, 14]] },
      { tun: "warten", s: 2 }
    ]
  },
  dimitriou: {
    figur: "dimitriou", karte: "europaplatz", start: [21, 9.6], blick: 0,
    dialog: "hub_dimitriou",
    routine: [
      { tun: "sitzen", an: "hub_bank_1", s: 45 },
      { tun: "schauen", richtung: -120, s: 5 }
    ]
  },
  emil: {
    figur: "emil", karte: "europaplatz", start: [11.5, 14.6], blick: -90,
    dialog: "hub_emil",
    routine: [
      { tun: "gehen", weg: [[5, 14.6], [3, 14]] },
      { tun: "warten", s: 3 },
      { tun: "gehen", weg: [[11.5, 14.4]] },
      { tun: "schauen", richtung: 90, s: 5 }
    ]
  },

  // ==================== Deutschland-Viertel ====================
  lea: {
    figur: "lea", karte: "de", start: [12.4, 9.1], blick: 180,
    dialog: "de_lea", hinweis: "!de_lea_fertig",
    routine: [
      { tun: "schauen", richtung: 180, s: 6 },
      { tun: "gehen", weg: [[10.5, 9.1]] },
      { tun: "warten", s: 2 },
      { tun: "gehen", weg: [[15.5, 9.1]] },
      { tun: "schauen", richtung: 170, s: 4 },
      { tun: "gehen", weg: [[12.4, 9.1]] }
    ]
  },
  tobias: {
    figur: "tobias", karte: "de", start: [26.5, 17.6], blick: 180,
    dialog: "de_tobias", hinweis: "de_lea_fertig&!de_tobias_fertig",
    routine: [
      { tun: "warten", s: 7 },
      { tun: "gehen", weg: [[24.5, 17.6], [23, 14.6], [19.6, 10.4], [18.35, 6.9]] },
      { tun: "schauen", richtung: 180, s: 3 },
      { tun: "gehen", weg: [[19.6, 10.4], [23, 14.6], [24.5, 17.6], [26.5, 17.6]] },
      { tun: "schauen", richtung: 180, s: 4 }
    ]
  },
  brandt: {
    figur: "brandt", karte: "de", start: [14.5, 16.3], blick: 180,
    dialog: "de_brandt",
    routine: [
      { tun: "sitzen", an: "de_bank_1", s: 22 },
      { tun: "giessen", an: "de_beet_1", s: 7 },
      { tun: "warten", s: 2 }
    ]
  },
  jana: {
    figur: "jana", karte: "de", start: [3, 13.75], blick: 90,
    dialog: "de_jana",
    routine: [
      { tun: "gehen", weg: [[29, 13.75]] },
      { tun: "schauen", richtung: 0, s: 3 },
      { tun: "gehen", weg: [[3, 13.75]] },
      { tun: "warten", s: 3 }
    ]
  },

  // ---- Kita (innen) ----
  yilmaz: {
    figur: "yilmaz", karte: "de_kita_innen", start: [6.2, 3.2], blick: 0,
    dialog: "de_yilmaz", hinweis: "!beweis_de",
    routine: [
      { tun: "warten", s: 4 },
      { tun: "gehen", weg: [[3, 2.6], [3, 5.4]] },
      { tun: "schauen", richtung: 90, s: 3 },
      { tun: "gehen", weg: [[6.2, 3.2]] },
      { tun: "schauen", richtung: 0, s: 3 }
    ]
  },
  mia: {
    figur: "mia", karte: "de_kita_innen", start: [4.2, 4.3], blick: 0,
    dialog: "de_mia",
    routine: [
      { tun: "gehen", weg: [[2, 4], [2, 5.6], [4.4, 5.6], [4.4, 4]] },
      { tun: "warten", s: 2 }
    ]
  },
  ben: {
    figur: "ben", karte: "de_kita_innen", start: [9.4, 4.3], blick: -90,
    dialog: "de_ben",
    routine: [
      { tun: "warten", s: 3 },
      { tun: "gehen", weg: [[9.6, 4.3], [6.9, 4.3]] },
      { tun: "warten", s: 2 },
      { tun: "gehen", weg: [[9.4, 4.3]] }
    ]
  },

  // ---- Büro (innen) ----
  okafor: {
    figur: "okafor", karte: "de_buero_innen", start: [2.5, 3.8], blick: 180,
    dialog: "de_okafor",
    routine: [
      { tun: "sitzen", an: "buero_stuhl_1", s: 12 },
      { tun: "gehen", weg: [[5.5, 1.9]] },
      { tun: "schauen", richtung: 180, s: 5 },
      { tun: "gehen", weg: [[3.6, 4.4]] }
    ]
  }
};
