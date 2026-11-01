/* =====================================================================
   data/figuren.js – Baukasten für die Gliederfiguren (Abschnitt 3.6, 7.7)
   ---------------------------------------------------------------------
   Alle Figuren sind erfunden. Sie sind Gliederfiguren wie aus einem
   Architekturmodell: Körper aus Modellharz, Kleidung als eigene Hülle.
   groesse:  Körpergröße in Metern
   bau:      schmal / mittel / kraeftig
   haut:     Nummer des Hauttons (0 = sehr hell … 7 = sehr dunkel)
   haare.form: kurz, dutt, lang, locken, glatze
   akzent:   ein Element in Fraktionsfarbe (schal, krawatte, anstecker)
   stimme:   für spätere Sprechgeräusche (Phase 5)
   ===================================================================== */
var DATA = window.DATA || {};

DATA.figuren = {

  /* Acht natürliche Hauttöne (Modellharz, eingefärbt) */
  hauttoene: ["#f0dccd", "#e6c8ad", "#d8b193", "#c49879", "#a87a5c", "#8a5f45", "#6a4532", "#4a3024"],

  /* Körperbau: Maße in Metern bei 1,70 m Körpergröße (werden mitskaliert) */
  koerperbau: {
    schmal:   { schulter: 0.175, huefte: 0.155, brustTiefe: 0.105, taille: 0.125, arm: 0.040, bein: 0.062, hals: 0.048 },
    mittel:   { schulter: 0.188, huefte: 0.165, brustTiefe: 0.118, taille: 0.140, arm: 0.045, bein: 0.068, hals: 0.054 },
    kraeftig: { schulter: 0.200, huefte: 0.180, brustTiefe: 0.135, taille: 0.165, arm: 0.052, bein: 0.076, hals: 0.060 }
  },

  /* Die Personen (alle erfunden). Weitere Figuren folgen in Phase 2 und 3. */
  personen: {
    mira: {
      name: "Mira Kovács", rolle: "Büroleiterin", land: "Ungarn", fraktion: "BRUECKE",
      groesse: 1.67, bau: "schmal", haut: 1, alter: 38, formen: 0.8,
      haare: { form: "dutt", farbe: "#4d362a" },
      brille: { rahmen: "#4a4f57" },
      kleidung: {
        oben: { art: "blazer", farbe: "#3d4452" },
        hemd: { art: "bluse", farbe: "#ebe6dc" },
        unten: { art: "hose", farbe: "#272a31" },
        schuhe: { farbe: "#1f1c1a" }
      },
      akzent: { art: "schal" },
      stimme: { tonhoehe: 1.15 }
    },
    luca: {
      name: "Luca Bianchi", rolle: "Schattenberichterstatter der ASG", land: "Italien", fraktion: "ASG",
      groesse: 1.77, bau: "mittel", haut: 3, alter: 54, formen: 0.0,
      haare: { form: "kurz", farbe: "#6e6862" },
      kleidung: {
        oben: { art: "sakko", farbe: "#6b5a49" },
        hemd: { art: "hemd", farbe: "#dfe6ee" },
        unten: { art: "hose", farbe: "#343943" },
        schuhe: { farbe: "#3a2a20" }
      },
      akzent: { art: "krawatte" },
      stimme: { tonhoehe: 0.85 }
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
    nicken: { dauer: 0.9, schluessel: [
      { t: 0 }, { t: 0.25, kopf: [14, 0, 0] }, { t: 0.5, kopf: [-2, 0, 0] }, { t: 0.72, kopf: [9, 0, 0] }, { t: 1 }
    ]}
  },

  /* Animation */
  atmen: { tempo: 0.23, staerke: 1.0 },       // Atemzüge pro Sekunde, Stärke
  gewichtVerlagern: { tempo: 0.06, staerke: 0.012 },
  kopfDrehen: { maxSeite: 55, maxHoch: 22, tempo: 3.0 }
};
