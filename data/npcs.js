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
    dialog: "hub_laurent", hinweis: "beweis_de&!hub_laurent_de|beweis_se&!hub_laurent_se|beweis_ee&!hub_laurent_ee|beweis_lu&!hub_laurent_lu|alle_beweise&!hub_laurent_alle",
    nurWenn: "!beweis_bxl|finale_fertig",   // während des Finales sind sie im Sitzungssaal
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
    nurWenn: "!beweis_bxl|finale_fertig",   // während des Finales sind sie im Sitzungssaal
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
    nurWenn: "!beweis_bxl|finale_fertig",   // während des Finales sind sie im Sitzungssaal
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
  },

  // ==================== Schweden-Viertel ====================
  lars: {
    figur: "lars", karte: "se", start: [18.2, 15.6], blick: 0,
    dialog: "se_familie", hinweis: "se_amt_fertig&!beweis_se",
    routine: [
      { tun: "schauen", richtung: 20, s: 8 },
      { tun: "gehen", weg: [[18.5, 13.9], [14.5, 14.2]] },
      { tun: "warten", s: 3 },
      { tun: "gehen", weg: [[18.5, 13.9], [18.2, 15.6]] }
    ]
  },
  nora: {
    figur: "nora", karte: "se", start: [16.5, 14.6], blick: 0,
    dialog: "se_familie", hinweis: "se_amt_fertig&!beweis_se",
    routine: [
      { tun: "sitzen", an: "se_bank_see", s: 30 },
      { tun: "schauen", richtung: 30, s: 4 }
    ]
  },
  birgit: {
    figur: "birgit", karte: "se", start: [8.5, 15.2], blick: 180,
    dialog: "se_birgit",
    routine: [
      { tun: "sitzen", an: "se_bank_weg", s: 25 },
      { tun: "giessen", an: "se_beet", s: 6 }
    ]
  },
  erik: {
    figur: "erik", karte: "se", start: [3, 12], blick: 90,
    dialog: "se_erik",
    routine: [
      { tun: "gehen", weg: [[26, 12], [27.5, 15], [16, 14.2], [3, 12]] },
      { tun: "warten", s: 2 }
    ]
  },
  alva: {
    figur: "alva", karte: "se", start: [7, 9.8], blick: 0,
    dialog: "se_alva",
    routine: [
      { tun: "schauen", richtung: 180, s: 6 },
      { tun: "gehen", weg: [[10, 10.2]] },
      { tun: "warten", s: 4 },
      { tun: "gehen", weg: [[7, 9.8]] }
    ]
  },
  lindqvist: {
    figur: "lindqvist", karte: "se_amt_innen", start: [5.5, 1.6], blick: 0,
    dialog: "se_lindqvist", hinweis: "!se_amt_fertig",
    routine: [
      { tun: "warten", s: 8 },
      { tun: "gehen", weg: [[3.5, 1.6]] },
      { tun: "schauen", richtung: 180, s: 3 },
      { tun: "gehen", weg: [[5.5, 1.6]] }
    ]
  },

  // ==================== Estland-Viertel ====================
  kadri: {
    figur: "kadri", karte: "ee", start: [17, 17.9], blick: 0,
    dialog: "ee_kadri", hinweis: "!beweis_ee",
    routine: [
      { tun: "warten", s: 6 },
      { tun: "gehen", weg: [[15.2, 18]] },
      { tun: "schauen", richtung: 0, s: 3 },
      { tun: "gehen", weg: [[17, 17.9]] }
    ]
  },
  mart: {
    figur: "mart", karte: "ee", start: [7, 10.9], blick: 0,
    dialog: "ee_mart", hinweis: "!ee_stand_it",
    routine: [ { tun: "warten", s: 5 }, { tun: "gehen", weg: [[6.5, 10.9]] }, { tun: "warten", s: 3 }, { tun: "gehen", weg: [[7, 10.9]] } ]
  },
  liis: {
    figur: "liis", karte: "ee", start: [12.5, 10.9], blick: 0,
    dialog: "ee_liis", hinweis: "!ee_stand_pflege",
    routine: [ { tun: "warten", s: 6 }, { tun: "gehen", weg: [[13, 10.9]] }, { tun: "warten", s: 3 }, { tun: "gehen", weg: [[12.5, 10.9]] } ]
  },
  kertu: {
    figur: "kertu", karte: "ee", start: [20.5, 10.9], blick: 0,
    dialog: "ee_kertu", hinweis: "!ee_stand_bau",
    routine: [ { tun: "warten", s: 4 }, { tun: "gehen", weg: [[20, 10.9]] }, { tun: "warten", s: 4 }, { tun: "gehen", weg: [[20.5, 10.9]] } ]
  },
  priit: {
    figur: "priit", karte: "ee", start: [26, 10.9], blick: 0,
    dialog: "ee_priit", hinweis: "!ee_stand_soziales",
    routine: [ { tun: "warten", s: 7 }, { tun: "gehen", weg: [[26.5, 10.9]] }, { tun: "warten", s: 2 }, { tun: "gehen", weg: [[26, 10.9]] } ]
  },
  anu: {
    figur: "anu", karte: "ee", start: [10, 14], blick: 180,
    dialog: "ee_anu",
    routine: [
      { tun: "gehen", weg: [[10, 13.2]] },
      { tun: "schauen", richtung: 180, s: 4 },
      { tun: "gehen", weg: [[22, 13.2]] },
      { tun: "schauen", richtung: 180, s: 4 },
      { tun: "gehen", weg: [[16, 15]] },
      { tun: "warten", s: 3 }
    ]
  },

  // ==================== Luxemburg-Viertel ====================
  hoffmann: {
    figur: "hoffmann", karte: "lu", start: [17.5, 18.8], blick: 90,
    dialog: "lu_hoffmann", hinweis: "!lu_hoffmann_fertig",
    routine: [
      { tun: "schauen", richtung: 90, s: 8 },
      { tun: "gehen", weg: [[17, 19.8]] },
      { tun: "schauen", richtung: -90, s: 6 },
      { tun: "gehen", weg: [[17.5, 18.8]] }
    ]
  },
  marc: {
    figur: "marc", karte: "lu", start: [23.5, 10.2], blick: 0,
    dialog: "lu_marc",
    routine: [
      { tun: "gehen", weg: [[21.3, 10.3]] },
      { tun: "warten", s: 3 },
      { tun: "gehen", weg: [[24.2, 11.3]] },
      { tun: "warten", s: 3 },
      { tun: "gehen", weg: [[27.3, 10]] },
      { tun: "warten", s: 3 }
    ]
  },
  paul: {
    figur: "paul", karte: "lu_etage_1", start: [5, 2.2], blick: 0,
    dialog: "lu_paul",
    routine: [ { tun: "warten", s: 8 }, { tun: "gehen", weg: [[4, 2.2]] }, { tun: "schauen", richtung: 180, s: 3 }, { tun: "gehen", weg: [[5, 2.2]] } ]
  },
  chloe: {
    figur: "chloe", karte: "lu_etage_2", start: [2.5, 4.4], blick: 180,
    dialog: "lu_chloe",
    routine: [ { tun: "sitzen", an: "lu2_stuhl_1", s: 18 }, { tun: "gehen", weg: [[4, 1.8]] }, { tun: "schauen", richtung: 180, s: 4 }, { tun: "gehen", weg: [[2.8, 4.6]] } ]
  },
  tom: {
    figur: "tom", karte: "lu_etage_2", start: [5.5, 4.4], blick: 180,
    dialog: "lu_tom",
    routine: [ { tun: "sitzen", an: "lu2_stuhl_2", s: 22 }, { tun: "gehen", weg: [[8, 5]] }, { tun: "warten", s: 3 }, { tun: "gehen", weg: [[5.8, 4.6]] } ]
  },
  schmit: {
    figur: "schmit", karte: "lu_etage_3", start: [3, 4.4], blick: 180,
    dialog: "lu_schmit", hinweis: "!beweis_lu",
    routine: [ { tun: "sitzen", an: "lu3_stuhl", s: 20 }, { tun: "gehen", weg: [[5.2, 4.5]] }, { tun: "schauen", richtung: 90, s: 4 }, { tun: "gehen", weg: [[3.4, 4.6]] } ]
  },

  // ======================= Brüssel =======================
  janssens: {
    figur: "janssens", karte: "bxl", start: [23.2, 5.7], blick: -20,
    dialog: "bxl_janssens",
    routine: [
      { tun: "schauen", richtung: -20, s: 7 },
      { tun: "gehen", weg: [[24.4, 6.2]] },
      { tun: "schauen", richtung: -60, s: 4 },
      { tun: "gehen", weg: [[23.2, 5.7]] }
    ]
  },
  lotte: {
    figur: "lotte", karte: "bxl", start: [3.8, 9.9], blick: 180,
    dialog: "bxl_lotte",
    routine: [
      { tun: "schauen", richtung: 180, s: 8 },
      { tun: "gehen", weg: [[2.7, 10.2]] },
      { tun: "schauen", richtung: 160, s: 5 },
      { tun: "gehen", weg: [[3.8, 9.9]] }
    ]
  },
  samir: {
    figur: "samir", karte: "bxl", start: [14, 11], blick: 90,
    dialog: "bxl_samir",
    routine: [
      { tun: "gehen", weg: [[20, 11.2], [24, 9.6]] },
      { tun: "warten", s: 3 },
      { tun: "gehen", weg: [[18, 9.2], [10, 10.8]] },
      { tun: "schauen", richtung: 0, s: 4 }
    ]
  },
  peeters: {
    figur: "peeters", karte: "bxl_archiv", start: [6.5, 4.25], blick: 0,
    dialog: "bxl_peeters", hinweis: "!beweis_bxl&!bxl_peeters_auftrag|bxl_fach_a&bxl_fach_b&bxl_fach_c&!beweis_bxl",
    routine: [
      { tun: "schauen", richtung: 0, s: 9 },
      { tun: "gehen", weg: [[4.5, 4.2]] },
      { tun: "schauen", richtung: 180, s: 4 },
      { tun: "gehen", weg: [[6.5, 4.25]] }
    ]
  },

  // Sitzungssaal
  laurent_saal: {
    figur: "laurent", karte: "bxl_saal", start: [12, 6.3], blick: -90,
    dialog: "saal_laurent", hinweis: "!finale_praesentiert"
  },
  anna_saal: {
    figur: "anna", karte: "bxl_saal", start: [2.4, 5.5], blick: 90,
    dialog: "saal_anna",
    routine: [ { tun: "sitzen", an: "saal_stuhl_1", s: 9999 } ]
  },
  jonas_saal: {
    figur: "jonas", karte: "bxl_saal", start: [2.4, 6.7], blick: 90,
    dialog: "saal_jonas",
    routine: [ { tun: "sitzen", an: "saal_stuhl_2", s: 9999 } ]
  },
  vella: {
    figur: "vella", karte: "bxl_saal", start: [3.125, 2.35], blick: 30,
    dialog: "saal_vella"
  },
  nowicki: {
    figur: "nowicki", karte: "bxl_saal", start: [7.5, 1.55], blick: 0,
    dialog: "saal_nowicki"
  },
  dewit: {
    figur: "dewit", karte: "bxl_saal", start: [11.875, 2.35], blick: -30,
    dialog: "saal_dewit"
  }
};
