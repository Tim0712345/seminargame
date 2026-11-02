/* =====================================================================
   data/figuren.js – die Menschen im Spiel (Aussehen, Haltungen, Gesten)
   ---------------------------------------------------------------------
   Alle Personen sind erfunden. Die Formen (Kopf, Hände, Kleidung, Frisuren)
   kommen aus js/welt/menschen_netze.js; hier steht, wie jede Person aussieht.
   geschlecht: "m", "w" oder "n" (die Spielfigur: dazwischen, ohne Festlegung)
   groesse:  Körpergröße in Metern
   bau:      schmal / mittel / kraeftig
   haut:     Nummer des Hauttons (0 = sehr hell … 7 = sehr dunkel)
   augen:    Augenfarbe (ohne Angabe: zufällig aus augenFarben, aber immer gleich)
   gesicht:  Gesichtszüge von -1 bis 1: nase, kinn, wangen, lippen; alter 0 bis 1
             (ohne Angabe: aus dem Namen abgeleitet, damit niemand gleich aussieht)
   haare.form: kurz, dutt, lang, locken, zopf, glatze, kopftuch
   kleidung.oben.art: sakko, blazer, pullover · kleidung.unten.art: hose, rock
   akzent:   ein Element in Fraktionsfarbe (schal, krawatte, anstecker)
   brille:   Rahmenfarbe · stimme: Tonhöhe der Sprechgeräusche
   ===================================================================== */
var DATA = window.DATA || {};

DATA.figuren = {

  /* Acht natürliche Hauttöne */
  hauttoene: ["#e9c6ae", "#ddb293", "#cd9c7b", "#b9845f", "#9b6848", "#7e5038", "#603b29", "#45291d"],

  /* Augenfarben (Iris) */
  augenFarben: ["#5a3b26", "#4a3020", "#6b4a2c", "#3f5a6e", "#4e6a5a", "#6a7a86", "#3a2a1e"],

  /* Die Personen (alle erfunden). Länder wie im Konzept (Abschnitt 3). */
  personen: {
    sam: {
      name: "{name}", rolle: "Berichterstatter*in, Brücke", land: "", fraktion: "BRUECKE",
      geschlecht: "n", gesicht: { nase: -0.2, kinn: -0.2, wangen: 0.1, lippen: 0.0 }, augen: "#4e5a48", 
      groesse: 1.71, bau: "schmal", haut: 2,
      haare: { form: "kurz", farbe: "#3b2c24" },
      kleidung: { oben: { art: "blazer", farbe: "#2f3a48" }, hemd: { art: "hemd", farbe: "#e9e7e2" }, unten: { art: "hose", farbe: "#2a2d33" }, schuhe: { farbe: "#1f1c1a" } },
      akzent: { art: "anstecker" }, stimme: { tonhoehe: 1.0 }
    },
    mira: {
      name: "Mira Kovács", rolle: "Büroleiterin", land: "Ungarn", fraktion: "BRUECKE",
      geschlecht: "w", gesicht: { nase: 0.2, kinn: -0.1, wangen: -0.2, lippen: 0.2, alter: 0.25 }, augen: "#5a4632", 
      groesse: 1.67, bau: "schmal", haut: 1,
      haare: { form: "dutt", farbe: "#4d362a" }, brille: { rahmen: "#4a4f57" },
      kleidung: { oben: { art: "blazer", farbe: "#3d4452" }, hemd: { art: "bluse", farbe: "#ebe6dc" }, unten: { art: "hose", farbe: "#272a31" }, schuhe: { farbe: "#1f1c1a" } },
      akzent: { art: "schal" }, stimme: { tonhoehe: 1.15 }
    },
    luca: {
      name: "Luca Bianchi", rolle: "Schattenberichterstatter der ASG", land: "Italien", fraktion: "ASG",
      geschlecht: "m", gesicht: { nase: 0.7, kinn: 0.4, wangen: -0.1, lippen: 0.0, alter: 0.55 }, augen: "#4a3020", 
      groesse: 1.77, bau: "mittel", haut: 3,
      haare: { form: "kurz", farbe: "#6e6862" },
      kleidung: { oben: { art: "sakko", farbe: "#6b5a49" }, hemd: { art: "hemd", farbe: "#dfe6ee" }, unten: { art: "hose", farbe: "#343943" }, schuhe: { farbe: "#3a2a20" } },
      akzent: { art: "krawatte" }, stimme: { tonhoehe: 0.85 }
    },
    pieter: {
      name: "Pieter de Wit", rolle: "Schattenberichterstatter des BFW", land: "Niederlande", fraktion: "BFW",
      geschlecht: "m", gesicht: { nase: 0.1, kinn: 0.6, wangen: -0.3, lippen: -0.3, alter: 0.2 }, augen: "#4f6c86", 
      groesse: 1.88, bau: "mittel", haut: 0,
      haare: { form: "kurz", farbe: "#b89462" },
      kleidung: { oben: { art: "pullover", farbe: "#2e3b52" }, hemd: { art: "hemd", farbe: "#f0f0ee" }, unten: { art: "hose", farbe: "#8c8574" }, schuhe: { farbe: "#5a3e2a" } },
      akzent: { art: "anstecker" }, stimme: { tonhoehe: 0.9 }
    },
    maria: {
      name: "Maria Kowalska", rolle: "Schattenberichterstatterin der EVM", land: "Polen", fraktion: "EVM",
      geschlecht: "w", gesicht: { nase: -0.3, kinn: -0.2, wangen: 0.5, lippen: 0.3, alter: 0.4 }, augen: "#6a5a40", 
      groesse: 1.64, bau: "mittel", haut: 1,
      haare: { form: "lang", farbe: "#7a4632" },
      kleidung: { oben: { art: "blazer", farbe: "#5f6670" }, hemd: { art: "bluse", farbe: "#f1ece4" }, unten: { art: "rock", farbe: "#2c3038", strumpf: "#3a3532" }, schuhe: { farbe: "#26201c" } },
      akzent: { art: "schal" }, stimme: { tonhoehe: 1.1 }
    },
    aoife: {
      name: "Aoife Byrne", rolle: "Schattenberichterstatterin der GZL", land: "Irland", fraktion: "GZL",
      geschlecht: "w", gesicht: { nase: -0.4, kinn: -0.3, wangen: 0.0, lippen: 0.1, alter: 0.05 }, augen: "#4e6a5a", 
      groesse: 1.70, bau: "schmal", haut: 0,
      haare: { form: "locken", farbe: "#9c4a2c" },
      kleidung: { oben: { art: "pullover", farbe: "#c9c1ae" }, hemd: { art: "bluse", farbe: "#c9c1ae" }, unten: { art: "hose", farbe: "#3a4234" }, schuhe: { farbe: "#3b302a" } },
      akzent: { art: "schal" }, stimme: { tonhoehe: 1.2 }
    },
    jaroslav: {
      name: "Jaroslav Novák", rolle: "Schattenberichterstatter des BSN", land: "Tschechien", fraktion: "BSN",
      geschlecht: "m", gesicht: { nase: 0.5, kinn: 0.2, wangen: 0.6, lippen: -0.2, alter: 0.7 }, augen: "#5a6a76", 
      groesse: 1.80, bau: "kraeftig", haut: 1,
      haare: { form: "kurz", farbe: "#8f8984" }, brille: { rahmen: "#2b2a28" },
      kleidung: { oben: { art: "sakko", farbe: "#5a5048" }, hemd: { art: "hemd", farbe: "#e6e2d8" }, unten: { art: "hose", farbe: "#3f3a36" }, schuhe: { farbe: "#2a201a" } },
      akzent: { art: "krawatte" }, stimme: { tonhoehe: 0.8 }
    },
    sofia: {
      name: "Sofia Andreou", rolle: "Sprecherin der Fraktionslosen", land: "Griechenland", fraktion: "FU",
      geschlecht: "w", gesicht: { nase: 0.4, kinn: 0.0, wangen: 0.2, lippen: 0.5, alter: 0.3 }, augen: "#3a2a1e", 
      groesse: 1.62, bau: "mittel", haut: 2,
      haare: { form: "zopf", farbe: "#241b17" },
      kleidung: { oben: { art: "blazer", farbe: "#e2ddd2" }, hemd: { art: "bluse", farbe: "#3b4354" }, unten: { art: "hose", farbe: "#2b2f37" }, schuhe: { farbe: "#1f1c1a" } },
      akzent: { art: "anstecker" }, stimme: { tonhoehe: 1.1 }
    },
    tiago: {
      name: "Tiago Esteves", rolle: "Vertreter der Kommission", land: "Portugal", fraktion: null,
      geschlecht: "m", gesicht: { nase: 0.3, kinn: 0.1, wangen: -0.4, lippen: 0.2, alter: 0.35 }, augen: "#3a2a1e", 
      groesse: 1.75, bau: "schmal", haut: 3,
      haare: { form: "kurz", farbe: "#1e1816" },
      kleidung: { oben: { art: "sakko", farbe: "#262e3c" }, hemd: { art: "hemd", farbe: "#f2f2f0" }, unten: { art: "hose", farbe: "#262e3c" }, schuhe: { farbe: "#151312" } },
      akzent: { art: "krawatte", farbe: "#6a7488" }, stimme: { tonhoehe: 0.95 }
    },
    hanna: {
      name: "Dr. Hanna Lindqvist", rolle: "Juristischer Dienst des Parlaments", land: "Schweden", fraktion: null,
      geschlecht: "w", gesicht: { nase: 0.0, kinn: 0.3, wangen: -0.4, lippen: -0.2, alter: 0.5 }, augen: "#6a7a86", 
      groesse: 1.73, bau: "schmal", haut: 0,
      haare: { form: "dutt", farbe: "#d1b98a" }, brille: { rahmen: "#1d1d1f" },
      kleidung: { oben: { art: "blazer", farbe: "#202226" }, hemd: { art: "bluse", farbe: "#f4f2ee" }, unten: { art: "hose", farbe: "#202226" }, schuhe: { farbe: "#151312" } },
      akzent: null, stimme: { tonhoehe: 1.05 }
    },
    marinescu: {
      name: "Botschafterin Elena Marinescu", rolle: "Ratspräsidentschaft", land: "Rumänien", fraktion: null,
      geschlecht: "w", gesicht: { nase: 0.2, kinn: 0.1, wangen: 0.1, lippen: 0.2, alter: 0.6 }, augen: "#4a3020", 
      groesse: 1.66, bau: "mittel", haut: 1,
      haare: { form: "lang", farbe: "#33241f" },
      kleidung: { oben: { art: "blazer", farbe: "#5b2a35" }, hemd: { art: "bluse", farbe: "#ece6dc" }, unten: { art: "hose", farbe: "#2a2226" }, schuhe: { farbe: "#1a1514" } },
      akzent: null, stimme: { tonhoehe: 1.05 }
    },
    ines: {
      name: "Inès Moreau", rolle: "Auszubildende Mechatronikerin, neunzehn", land: "Frankreich", fraktion: null,
      geschlecht: "w", gesicht: { nase: 0.1, kinn: -0.4, wangen: 0.2, lippen: 0.8, alter: 0.0 }, augen: "#3a2418", 
      groesse: 1.63, bau: "schmal", haut: 5,
      haare: { form: "locken", farbe: "#1b1513" },
      kleidung: { oben: { art: "pullover", farbe: "#3d5a80" }, hemd: { art: "hemd", farbe: "#3d5a80" }, unten: { art: "hose", farbe: "#2b3140" }, schuhe: { farbe: "#e8e4dc" } },
      akzent: null, stimme: { tonhoehe: 1.25 }
    },
    weiss: {
      name: "Prof. Dr. Jakob Weiß", rolle: "Arbeitsmarktökonom", land: "Österreich", fraktion: null,
      geschlecht: "m", gesicht: { nase: 0.6, kinn: -0.1, wangen: 0.1, lippen: -0.4, alter: 0.95 }, augen: "#5a6a76", 
      groesse: 1.78, bau: "mittel", haut: 0,
      haare: { form: "glatze", farbe: "#a8a29a" }, brille: { rahmen: "#6a5a3a" }, rollstuhl: true,
      kleidung: { oben: { art: "sakko", farbe: "#7a6e5a" }, hemd: { art: "hemd", farbe: "#e8eef2" }, unten: { art: "hose", farbe: "#4a4740" }, schuhe: { farbe: "#3a2a20" } },
      akzent: null, stimme: { tonhoehe: 0.85 }
    },
    karin: {
      name: "Karin Hofstetter", rolle: "Personalleiterin eines Maschinenbaubetriebs", land: "Deutschland", fraktion: null,
      geschlecht: "w", gesicht: { nase: 0.3, kinn: 0.2, wangen: 0.1, lippen: 0.0, alter: 0.6 }, augen: "#4e6a5a", 
      groesse: 1.70, bau: "mittel", haut: 1,
      haare: { form: "kurz", farbe: "#8a6a4a" },
      kleidung: { oben: { art: "blazer", farbe: "#6d7378" }, hemd: { art: "bluse", farbe: "#f0eee9" }, unten: { art: "hose", farbe: "#30343a" }, schuhe: { farbe: "#26201c" } },
      akzent: null, stimme: { tonhoehe: 1.0 }
    },
    nadia: {
      name: "Nadia El Amrani", rolle: "Pflegefachkraft und Betriebsrätin", land: "Belgien", fraktion: null,
      geschlecht: "w", gesicht: { nase: 0.2, kinn: -0.1, wangen: 0.3, lippen: 0.5, alter: 0.3 }, augen: "#3a2418", 
      groesse: 1.66, bau: "mittel", haut: 4,
      haare: { form: "kopftuch", farbe: "#4f6a8a" },
      kleidung: { oben: { art: "pullover", farbe: "#e6e3dc" }, hemd: { art: "bluse", farbe: "#e6e3dc" }, unten: { art: "hose", farbe: "#2c3342" }, schuhe: { farbe: "#2a2420" } },
      akzent: null, stimme: { tonhoehe: 1.1 }
    },
    mateusz: {
      name: "Mateusz Zieliński", rolle: "Lagerist, Vater in Teilzeit", land: "Polen", fraktion: null,
      geschlecht: "m", gesicht: { nase: 0.0, kinn: 0.7, wangen: 0.3, lippen: 0.0, alter: 0.3 }, augen: "#4f6c86", 
      groesse: 1.83, bau: "kraeftig", haut: 1,
      haare: { form: "kurz", farbe: "#5a4636" },
      kleidung: { oben: { art: "pullover", farbe: "#3f5246" }, hemd: { art: "hemd", farbe: "#3f5246" }, unten: { art: "hose", farbe: "#34445e" }, schuhe: { farbe: "#3a3430" } },
      akzent: null, stimme: { tonhoehe: 0.85 }
    },
    clara: {
      name: "Clara Vogt", rolle: "Journalistin", land: "Luxemburg", fraktion: null,
      geschlecht: "w", gesicht: { nase: -0.1, kinn: 0.0, wangen: -0.2, lippen: 0.3, alter: 0.2 }, augen: "#5a4632", 
      groesse: 1.68, bau: "schmal", haut: 2,
      haare: { form: "lang", farbe: "#6a4a32" },
      kleidung: { oben: { art: "blazer", farbe: "#b39c74" }, hemd: { art: "bluse", farbe: "#2c2c30" }, unten: { art: "hose", farbe: "#2c2c30" }, schuhe: { farbe: "#1f1c1a" } },
      akzent: null, stimme: { tonhoehe: 1.15 }
    },
    dolmetscher: {
      name: "Dolmetscher", rolle: "in der Kabine", land: "", fraktion: null,
      geschlecht: "m", gesicht: { nase: 0.4, kinn: 0.3, wangen: 0.0, lippen: 0.6, alter: 0.4 }, augen: "#2a1c14", 
      groesse: 1.76, bau: "mittel", haut: 6,
      haare: { form: "kurz", farbe: "#161211" },
      kleidung: { oben: { art: "pullover", farbe: "#4a5466" }, hemd: { art: "hemd", farbe: "#4a5466" }, unten: { art: "hose", farbe: "#2a2d33" }, schuhe: { farbe: "#1f1c1a" } },
      akzent: null, stimme: { tonhoehe: 0.9 }
    },
    saaldiener: {
      name: "Saaldiener", rolle: "Plenarsaal", land: "", fraktion: null,
      geschlecht: "m", gesicht: { nase: 0.2, kinn: 0.5, wangen: 0.2, lippen: 0.0, alter: 0.5 }, augen: "#3a2a1e", 
      groesse: 1.80, bau: "mittel", haut: 2,
      haare: { form: "glatze", farbe: "#3a302a" },
      kleidung: { oben: { art: "sakko", farbe: "#17191d" }, hemd: { art: "hemd", farbe: "#f4f4f2" }, unten: { art: "hose", farbe: "#17191d" }, schuhe: { farbe: "#0f0e0d" } },
      akzent: { art: "krawatte", farbe: "#17191d" }, stimme: { tonhoehe: 0.8 }
    }
  },

  /* Grundhaltungen. Winkel in Grad [x, y, z] je Gelenk.
     x: nach vorn/hinten beugen, y: drehen, z: seitlich */
  haltungen: {
    stehen: {
      beckenHoehe: 0.0,
      gelenke: { oberarmL: [3, 0, 3], oberarmR: [3, 0, -3], unterarmL: [-14, 0, 0], unterarmR: [-14, 0, 0], handL: [0, 0, -2], handR: [0, 0, 2] }
    },
    sitzen: {
      beckenHoehe: -0.41,
      gelenke: { brust: [4, 0, 0], oberschenkelL: [-86, 0, 4], oberschenkelR: [-86, 0, -4], unterschenkelL: [84, 0, 0], unterschenkelR: [84, 0, 0],
        oberarmL: [-22, 0, 8], oberarmR: [-22, 0, -8], unterarmL: [-58, -12, 0], unterarmR: [-58, 12, 0] }
    }
  },

  /* Gesten (Abschnitt 7.7). t = Anteil der Dauer (0 bis 1).
     Leere Schlüssel {} bedeuten „Grundhaltung“.
     handformR: "zeigen" streckt den Zeigefinger der rechten Hand. */
  gesten: {
    hand_heben: { dauer: 1.4, schluessel: [
      { t: 0 },
      { t: 0.3,  oberarmR: [-28, 10, -18], unterarmR: [-82, 0, 0], handR: [-10, 0, 0], brust: [0, -4, 0] },
      { t: 0.72, oberarmR: [-32, 12, -20], unterarmR: [-86, 0, 0], handR: [-14, 0, 0], brust: [0, -4, 0] },
      { t: 1 }
    ]},
    auf_papier_zeigen: { dauer: 1.5, schluessel: [
      { t: 0 },
      { t: 0.32, oberarmR: [-46, 0, -6], unterarmR: [-28, 0, 0], handR: [12, 0, 0], brust: [9, 0, 0], kopf: [16, 0, 0], handformR: "zeigen" },
      { t: 0.74, oberarmR: [-48, 0, -6], unterarmR: [-24, 0, 0], handR: [12, 0, 0], brust: [9, 0, 0], kopf: [18, 0, 0], handformR: "zeigen" },
      { t: 1 }
    ]},
    arme_verschraenken: { dauer: 1.5, schluessel: [
      { t: 0 },
      { t: 0.3,  oberarmL: [-24, -64, -2], unterarmL: [-104, 0, 0], oberarmR: [-30, 64, 2], unterarmR: [-100, 0, 0], kopf: [-4, 0, 0] },
      { t: 0.8,  oberarmL: [-24, -64, -2], unterarmL: [-104, 0, 0], oberarmR: [-30, 64, 2], unterarmR: [-100, 0, 0], kopf: [-5, 0, 0] },
      { t: 1 }
    ]},
    zuruecklehnen: { dauer: 1.5, schluessel: [
      { t: 0 }, { t: 0.35, brust: [-8, 0, 0], kopf: [-6, 0, 0], oberarmL: [6, 0, 6], oberarmR: [6, 0, -6] },
      { t: 0.75, brust: [-8, 0, 0], kopf: [-6, 0, 0], oberarmL: [6, 0, 6], oberarmR: [6, 0, -6] }, { t: 1 }
    ]},
    nicken: { dauer: 0.9, schluessel: [
      { t: 0 }, { t: 0.25, kopf: [14, 0, 0] }, { t: 0.5, kopf: [-2, 0, 0] }, { t: 0.72, kopf: [9, 0, 0] }, { t: 1 }
    ]}
  },

  /* Fingerhaltung (Grad): locker hängend und „zeigen“ (Zeigefinger gestreckt) */
  hand: {
    locker: { zeige1: 6, zeige2: 8, finger1: 10, finger2: 14, daumen: 0 },
    zeigen: { zeige1: -10, zeige2: -20, finger1: 62, finger2: 78, daumen: 25, daumenDreh: 20 }
  },
  /* Augen: wie weit sie sich zusätzlich zum Kopf drehen (Grad) */
  augen: { maxHoch: 14, maxSeite: 22 },

  /* Gehen: Schritte pro Sekunde und Schwung von Beinen und Armen (Grad) */
  gehen: { schritte: 1.8, bein: 24, knie: 38, arm: 14, geschwindigkeit: 1.15 },

  /* Animation */
  atmen: { tempo: 0.23, staerke: 1.0 },       // Atemzüge pro Sekunde, Stärke
  gewichtVerlagern: { tempo: 0.06, staerke: 0.012 },
  kopfDrehen: { maxSeite: 55, maxHoch: 22, tempo: 3.0 }
};
