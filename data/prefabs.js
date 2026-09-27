/* =====================================================================
   Die Lücke – Bausteine der Welt (Prefabs)
   ---------------------------------------------------------------------
   Jedes Prefab besteht aus „teilen“ (Grundformen). Maße in Welteinheiten
   (1 = eine Kachel). pos = Mitte der Form, y = Höhe über dem Boden.

   Formen und ihre Maße:
     box      groesse:[breite, hoehe, tiefe], rund: Kantenradius
     kugel    r  oder  radien:[rx, ry, rz]
     zylinder r, h, rOben (optional, für schräge Seiten)
     kegel    r, h
     kapsel   r, h  (h = Gesamthöhe)
     torus    R (Ringradius), r (Dicke) – liegt in der Ebene x/y

   Weitere Angaben pro Teil:
     rot:[x,y,z] in Grad · farbe (Name aus palette.js)
     textur: "gras" | "pflaster" | "holz" | "kopfstein"
     wind: 0…1 (wiegt sich im Wind, z. B. Baumkronen)

   Pro Prefab:
     kollision: { kreis: r }  oder  { box: [breite, tiefe] }  oder weglassen
     schatten:  Radius des runden Schattens (0 = keiner)
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.prefabs = {

  // ---------------- Bäume & Pflanzen ----------------
  baum_rund: {
    teile: [
      { form: "zylinder", r: 0.15, rOben: 0.11, h: 1.1, pos: [0, 0.55, 0], farbe: "rinde", textur: "holz" },
      { form: "kugel", r: 0.85, pos: [0, 1.75, 0], farbe: "laub", wind: 1 },
      { form: "kugel", r: 0.6, pos: [0.5, 1.45, 0.25], farbe: "laub", wind: 1 },
      { form: "kugel", r: 0.55, pos: [-0.45, 1.5, -0.2], farbe: "laub_dunkel", wind: 1 },
      { form: "kugel", r: 0.45, pos: [0.1, 2.35, -0.1], farbe: "laub_hell", wind: 1 }
    ],
    kollision: { kreis: 0.3 },
    schatten: 1.2
  },

  birke: {
    teile: [
      { form: "zylinder", r: 0.1, rOben: 0.07, h: 2.3, pos: [0, 1.15, 0], farbe: "birke_rinde" },
      { form: "box", groesse: [0.06, 0.05, 0.03], rund: 0.012, pos: [0.02, 0.6, 0.09], farbe: "birke_fleck" },
      { form: "box", groesse: [0.05, 0.04, 0.03], rund: 0.01, pos: [-0.05, 1.1, 0.07], farbe: "birke_fleck" },
      { form: "box", groesse: [0.06, 0.04, 0.03], rund: 0.01, pos: [0.04, 1.5, 0.06], farbe: "birke_fleck" },
      { form: "kugel", radien: [0.7, 1.05, 0.7], pos: [0, 2.55, 0], farbe: "birke_laub", wind: 1 },
      { form: "kugel", r: 0.45, pos: [0.35, 2.05, 0.2], farbe: "birke_laub", wind: 1 }
    ],
    kollision: { kreis: 0.2 },
    schatten: 0.9
  },

  kiefer: {
    teile: [
      { form: "zylinder", r: 0.12, rOben: 0.09, h: 0.9, pos: [0, 0.45, 0], farbe: "rinde", textur: "holz" },
      { form: "kegel", r: 0.85, h: 1.1, pos: [0, 1.15, 0], farbe: "kiefer", wind: 0.4 },
      { form: "kegel", r: 0.66, h: 0.95, pos: [0, 1.7, 0], farbe: "kiefer", wind: 0.6 },
      { form: "kegel", r: 0.45, h: 0.8, pos: [0, 2.2, 0], farbe: "kiefer", wind: 0.8 }
    ],
    kollision: { kreis: 0.28 },
    schatten: 1.0
  },

  busch: {
    teile: [
      { form: "kugel", r: 0.45, pos: [0, 0.35, 0], farbe: "laub_dunkel", wind: 0.4 },
      { form: "kugel", r: 0.35, pos: [0.35, 0.28, 0.1], farbe: "laub", wind: 0.4 },
      { form: "kugel", r: 0.32, pos: [-0.3, 0.26, 0.12], farbe: "laub", wind: 0.4 }
    ],
    kollision: { kreis: 0.5 },
    schatten: 0.75
  },

  blumenbeet: {
    teile: [
      { form: "box", groesse: [1.7, 0.2, 1.0], rund: 0.08, pos: [0, 0.1, 0], farbe: "stein_hell" },
      { form: "box", groesse: [1.5, 0.08, 0.8], rund: 0.04, pos: [0, 0.19, 0], farbe: "erde" },
      { form: "kugel", r: 0.12, pos: [-0.55, 0.36, -0.2], farbe: "bluete_koralle", wind: 0.6 },
      { form: "kugel", r: 0.11, pos: [-0.25, 0.34, 0.15], farbe: "bluete_gelb", wind: 0.6 },
      { form: "kugel", r: 0.12, pos: [0.05, 0.37, -0.15], farbe: "bluete_lila", wind: 0.6 },
      { form: "kugel", r: 0.1, pos: [0.3, 0.33, 0.18], farbe: "bluete_weiss", wind: 0.6 },
      { form: "kugel", r: 0.12, pos: [0.55, 0.36, -0.1], farbe: "bluete_koralle", wind: 0.6 },
      { form: "kugel", r: 0.16, pos: [-0.4, 0.28, 0.2], farbe: "laub", wind: 0.4 },
      { form: "kugel", r: 0.16, pos: [0.4, 0.28, -0.22], farbe: "laub", wind: 0.4 }
    ],
    kollision: { box: [1.7, 1.0] },
    schatten: 0
  },

  stein: {
    teile: [
      { form: "kugel", radien: [0.45, 0.28, 0.38], pos: [0, 0.12, 0], farbe: "stein" },
      { form: "kugel", radien: [0.25, 0.18, 0.22], pos: [0.35, 0.08, 0.2], farbe: "stein_hell" }
    ],
    kollision: { kreis: 0.45 },
    schatten: 0.55
  },

  // ---------------- Möbel & Stadt ----------------
  bank: {
    teile: [
      { form: "box", groesse: [1.4, 0.08, 0.44], rund: 0.03, pos: [0, 0.42, 0], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [1.4, 0.26, 0.07], rund: 0.03, pos: [0, 0.72, -0.22], rot: [-12, 0, 0], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [0.07, 0.42, 0.4], rund: 0.025, pos: [-0.6, 0.21, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.07, 0.42, 0.4], rund: 0.025, pos: [0.6, 0.21, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.06, 0.4, 0.06], rund: 0.02, pos: [-0.6, 0.62, -0.2], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.06, 0.4, 0.06], rund: 0.02, pos: [0.6, 0.62, -0.2], farbe: "metall_dunkel" }
    ],
    kollision: { box: [1.45, 0.55] },
    schatten: 0.85
  },

  laterne: {
    teile: [
      { form: "zylinder", r: 0.14, rOben: 0.1, h: 0.25, pos: [0, 0.125, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.05, h: 2.2, pos: [0, 1.3, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.3, 0.36, 0.3], rund: 0.06, pos: [0, 2.55, 0], farbe: "laterne_licht" },
      { form: "kegel", r: 0.26, h: 0.2, pos: [0, 2.83, 0], farbe: "metall_dunkel" },
      { form: "kugel", r: 0.05, pos: [0, 2.96, 0], farbe: "metall_dunkel" }
    ],
    kollision: { kreis: 0.16 },
    schatten: 0.35
  },

  zaun: {
    teile: [
      { form: "box", groesse: [0.12, 0.7, 0.12], rund: 0.04, pos: [-0.44, 0.35, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.12, 0.7, 0.12], rund: 0.04, pos: [0.44, 0.35, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [1.0, 0.1, 0.06], rund: 0.03, pos: [0, 0.5, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [1.0, 0.1, 0.06], rund: 0.03, pos: [0, 0.25, 0], farbe: "holz_hell", textur: "holz" }
    ],
    kollision: { box: [1.0, 0.18] },
    schatten: 0
  },

  briefkasten: {
    teile: [
      { form: "zylinder", r: 0.05, h: 0.8, pos: [0, 0.4, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.34, 0.3, 0.46], rund: 0.1, pos: [0, 0.9, 0], farbe: "terrakotta" },
      { form: "box", groesse: [0.03, 0.14, 0.05], rund: 0.01, pos: [0.19, 1.02, -0.1], farbe: "creme" }
    ],
    kollision: { kreis: 0.22 },
    schatten: 0.35
  },

  wegweiser: {
    teile: [
      { form: "zylinder", r: 0.06, h: 2.0, pos: [0, 1.0, 0], farbe: "holz_dunkel", textur: "holz" },
      { form: "box", groesse: [0.8, 0.2, 0.05], rund: 0.05, pos: [0.3, 1.7, 0], rot: [0, 10, 0], farbe: "senf" },
      { form: "box", groesse: [0.8, 0.2, 0.05], rund: 0.05, pos: [-0.28, 1.42, 0], rot: [0, -25, 0], farbe: "petrol" },
      { form: "box", groesse: [0.7, 0.2, 0.05], rund: 0.05, pos: [0.25, 1.14, 0], rot: [0, 50, 0], farbe: "koralle" },
      { form: "kugel", r: 0.08, pos: [0, 2.02, 0], farbe: "holz_dunkel" }
    ],
    kollision: { kreis: 0.15 },
    schatten: 0.3
  },

  // ---------------- Gebäude ----------------
  haus_klein: {
    teile: [
      { form: "box", groesse: [3.0, 2.0, 2.4], rund: 0.12, pos: [0, 1.0, 0], farbe: "putz_creme" },
      { form: "box", groesse: [3.4, 0.14, 1.75], rund: 0.06, pos: [0, 2.42, 0.62], rot: [38, 0, 0], farbe: "dach_rot" },
      { form: "box", groesse: [3.4, 0.14, 1.75], rund: 0.06, pos: [0, 2.42, -0.62], rot: [-38, 0, 0], farbe: "dach_rot" },
      { form: "box", groesse: [2.9, 1.25, 1.25], rund: 0.05, pos: [0, 2.0, 0], rot: [45, 0, 0], farbe: "putz_creme" },
      { form: "box", groesse: [0.34, 0.7, 0.34], rund: 0.05, pos: [0.8, 3.0, -0.4], farbe: "stein" },
      { form: "box", groesse: [0.7, 1.3, 0.12], rund: 0.08, pos: [-0.6, 0.65, 1.2], farbe: "tuer", textur: "holz" },
      { form: "kugel", r: 0.05, pos: [-0.38, 0.65, 1.28], farbe: "senf" },
      { form: "box", groesse: [0.8, 0.65, 0.1], rund: 0.08, pos: [0.65, 1.15, 1.2], farbe: "fenster" },
      { form: "box", groesse: [0.95, 0.08, 0.18], rund: 0.03, pos: [0.65, 0.8, 1.24], farbe: "weiss" },
      { form: "box", groesse: [0.1, 0.65, 0.8], rund: 0.08, pos: [1.5, 1.15, 0], farbe: "fenster" },
      { form: "box", groesse: [0.1, 0.65, 0.8], rund: 0.08, pos: [-1.5, 1.15, 0], farbe: "fenster" },
      { form: "box", groesse: [0.9, 0.12, 0.5], rund: 0.04, pos: [-0.6, 0.06, 1.45], farbe: "stein_hell" }
    ],
    kollision: { box: [3.1, 2.5] },
    schatten: 0
  },

  // ---------------- Nur für die Test-Insel ----------------
  testfund_sockel: {
    teile: [
      { form: "zylinder", r: 0.34, rOben: 0.28, h: 0.5, pos: [0, 0.25, 0], farbe: "stein_hell" },
      { form: "zylinder", r: 0.38, h: 0.08, pos: [0, 0.54, 0], farbe: "stein" }
    ],
    kollision: { kreis: 0.38 },
    schatten: 0.5
  }
};
