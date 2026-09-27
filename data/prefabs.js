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
     tuer:      [x, z] Lage der Tür (für Karten-Objekte mit tuer: { ziel, spawn })
     sitz, sitzHoehe: Sitzpunkt für NPCs (Bänke, Stühle)
     hoehe:     wie hoch die „E“-Blase über dem Objekt schwebt
     spritzer:  Höhe, aus der Wassertropfen spritzen (Brunnen)
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.prefabs = {

  // ---------------- Bäume & Pflanzen ----------------
  baum_rund: {
    teile: [
      { form: "zylinder", r: 0.13, rOben: 0.09, h: 1.3, pos: [0, 0.65, 0], farbe: "rinde", textur: "holz" },
      { form: "zylinder", r: 0.05, rOben: 0.03, h: 0.5, pos: [0.2, 1.25, 0], rot: [0, 0, -40], farbe: "rinde" },
      // Krone als „Wolke“ aus flachen Klecksen
      { form: "kugel", radien: [0.62, 0.48, 0.6], pos: [0, 1.6, 0], farbe: "laub", wind: 1 },
      { form: "kugel", radien: [0.5, 0.4, 0.5], pos: [0.5, 1.78, 0.1], farbe: "laub", wind: 1 },
      { form: "kugel", radien: [0.48, 0.38, 0.48], pos: [-0.45, 1.75, -0.08], farbe: "laub_dunkel", wind: 1 },
      { form: "kugel", radien: [0.5, 0.4, 0.5], pos: [0.05, 2.1, -0.05], farbe: "laub_hell", wind: 1 },
      { form: "kugel", radien: [0.42, 0.34, 0.42], pos: [0.12, 1.52, 0.45], farbe: "laub", wind: 1 },
      { form: "kugel", radien: [0.4, 0.32, 0.4], pos: [-0.22, 1.55, -0.42], farbe: "laub_dunkel", wind: 1 }
    ],
    kollision: { kreis: 0.3 },
    schatten: 1.1
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
    schatten: 0.85,
    sitz: [0, 0.02], sitzHoehe: 0.47     // Sitzpunkt (x, z) und Sitzhöhe für NPCs
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
    schatten: 0,
    tuer: [-0.6, 1.2]
  },

  // ================= Europaplatz & Stadt =================

  // Brunnen (plätschert: Wassertropfen aus "spritzer")
  brunnen: {
    teile: [
      { form: "zylinder", r: 1.45, h: 0.44, rOben: 1.4, pos: [0, 0.22, 0], farbe: "stein_hell" },
      { form: "torus", r: 0.1, R: 1.38, pos: [0, 0.46, 0], rot: [90, 0, 0], farbe: "stein" },
      { form: "zylinder", r: 1.3, h: 0.04, pos: [0, 0.36, 0], farbe: "wasser", textur: "wasser" },
      { form: "zylinder", r: 0.26, h: 0.9, rOben: 0.2, pos: [0, 0.75, 0], farbe: "stein_hell" },
      { form: "zylinder", r: 0.45, h: 0.18, rOben: 0.62, pos: [0, 1.2, 0], farbe: "stein_hell" },
      { form: "zylinder", r: 0.55, h: 0.03, pos: [0, 1.3, 0], farbe: "wasser", textur: "wasser" },
      { form: "kugel", r: 0.13, pos: [0, 1.42, 0], farbe: "stein" },
      { form: "kegel", r: 0.07, h: 0.3, pos: [0, 1.62, 0], farbe: "stein_hell" }
    ],
    kollision: { kreis: 1.5 },
    schatten: 0,
    spritzer: 1.7
  },

  // Wegweiser mit vier Farbschildern (Viertel)
  wegweiser_hub: {
    teile: [
      { form: "zylinder", r: 0.07, h: 2.2, pos: [0, 1.1, 0], farbe: "holz_dunkel", textur: "holz" },
      { form: "box", groesse: [0.85, 0.2, 0.05], rund: 0.05, pos: [0.45, 1.9, 0], rot: [0, 0, 0], farbe: "terrakotta" },
      { form: "box", groesse: [0.05, 0.2, 0.85], rund: 0.05, pos: [0.05, 1.62, 0.4], farbe: "himmelblau" },
      { form: "box", groesse: [0.75, 0.2, 0.05], rund: 0.05, pos: [-0.3, 1.34, 0.3], rot: [0, -40, 0], farbe: "petrol" },
      { form: "box", groesse: [0.75, 0.2, 0.05], rund: 0.05, pos: [0.3, 1.06, 0.3], rot: [0, 40, 0], farbe: "koralle" },
      { form: "kugel", r: 0.09, pos: [0, 2.24, 0], farbe: "holz_dunkel" }
    ],
    kollision: { kreis: 0.2 },
    schatten: 0.35,
    hoehe: 2.4
  },

  // Tor nach Brüssel (geschlossen)
  tor: {
    teile: [
      { form: "box", groesse: [0.6, 2.6, 0.6], rund: 0.08, pos: [-1.5, 1.3, 0], farbe: "stein_hell" },
      { form: "box", groesse: [0.6, 2.6, 0.6], rund: 0.08, pos: [1.5, 1.3, 0], farbe: "stein_hell" },
      { form: "box", groesse: [0.72, 0.2, 0.72], rund: 0.06, pos: [-1.5, 2.7, 0], farbe: "stein" },
      { form: "box", groesse: [0.72, 0.2, 0.72], rund: 0.06, pos: [1.5, 2.7, 0], farbe: "stein" },
      { form: "torus", r: 0.07, R: 1.2, pos: [0, 2.2, 0], rot: [0, 0, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [2.4, 0.08, 0.08], rund: 0.02, pos: [0, 1.05, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [2.4, 0.08, 0.08], rund: 0.02, pos: [0, 2, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.2, pos: [-0.95, 1.2, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.2, pos: [-0.57, 1.2, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.2, pos: [-0.19, 1.2, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.2, pos: [0.19, 1.2, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.2, pos: [0.57, 1.2, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.2, pos: [0.95, 1.2, 0], farbe: "metall_dunkel" },
      { form: "kugel", r: 0.16, pos: [0, 3.35, 0], farbe: "senf" }
    ],
    kollision: { box: [3.6, 0.7] },
    schatten: 0,
    hoehe: 2.8
  },

  // Absperrung mit Hinweisschild
  absperrung: {
    teile: [
      { form: "box", groesse: [0.08, 0.8, 0.4], rund: 0.03, pos: [-0.9, 0.4, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.08, 0.8, 0.4], rund: 0.03, pos: [0.9, 0.4, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.332, 0.2, 0.06], rund: 0.01, pos: [-0.83, 0.68, 0], farbe: "koralle" },
      { form: "box", groesse: [0.332, 0.2, 0.06], rund: 0.01, pos: [-0.498, 0.68, 0], farbe: "weiss" },
      { form: "box", groesse: [0.332, 0.2, 0.06], rund: 0.01, pos: [-0.166, 0.68, 0], farbe: "koralle" },
      { form: "box", groesse: [0.332, 0.2, 0.06], rund: 0.01, pos: [0.166, 0.68, 0], farbe: "weiss" },
      { form: "box", groesse: [0.332, 0.2, 0.06], rund: 0.01, pos: [0.498, 0.68, 0], farbe: "koralle" },
      { form: "box", groesse: [0.332, 0.2, 0.06], rund: 0.01, pos: [0.83, 0.68, 0], farbe: "weiss" },
      { form: "box", groesse: [0.7, 0.45, 0.04], rund: 0.04, pos: [0, 1.1, 0.02], farbe: "creme" },
      { form: "zylinder", r: 0.03, h: 0.2, pos: [0, 0.88, 0.02], farbe: "metall_dunkel" }
    ],
    kollision: { box: [2, 0.5] },
    schatten: 0,
    hoehe: 1.5
  },

  // Heckenstück (1 Kachel)
  hecke: {
    teile: [
      { form: "box", groesse: [1, 0.8, 0.7], rund: 0.25, pos: [0, 0.4, 0], farbe: "laub_dunkel", wind: 0.15 },
      { form: "kugel", radien: [0.3, 0.18, 0.3], pos: [0.25, 0.78, 0.05], farbe: "laub", wind: 0.2 }
    ],
    kollision: { box: [1, 0.7] },
    schatten: 0
  },

  // Infoschild (Text über "dialog" am Objekt)
  infoschild: {
    teile: [
      { form: "box", groesse: [0.08, 1.1, 0.08], rund: 0.02, pos: [-0.45, 0.55, 0], farbe: "holz_dunkel", textur: "holz" },
      { form: "box", groesse: [0.08, 1.1, 0.08], rund: 0.02, pos: [0.45, 0.55, 0], farbe: "holz_dunkel", textur: "holz" },
      { form: "box", groesse: [1.1, 0.75, 0.08], rund: 0.04, pos: [0, 1.15, 0], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [0.95, 0.6, 0.02], rund: 0.02, pos: [0, 1.15, 0.05], farbe: "creme" },
      { form: "box", groesse: [0.4, 0.08, 0.01], rund: 0.004, pos: [-0.2, 1.3, 0.065], farbe: "terrakotta" },
      { form: "box", groesse: [0.6, 0.05, 0.01], rund: 0.004, pos: [0.1, 1.12, 0.065], farbe: "grau" },
      { form: "box", groesse: [0.5, 0.05, 0.01], rund: 0.004, pos: [0.05, 1, 0.065], farbe: "grau" }
    ],
    kollision: { box: [1.1, 0.3] },
    schatten: 0.3,
    hoehe: 1.8
  },

  // ================= Deutschland-Viertel =================

  // Altbau mit Erker (warmes Ocker)
  altbau_ocker: {
    teile: [
      { form: "box", groesse: [4, 3.2, 3], rund: 0.08, pos: [0, 1.6, 0], farbe: "putz_ocker" },
      { form: "box", groesse: [4.08, 0.7, 3.08], rund: 0.05, pos: [0, 0.35, 0], farbe: "stein_hell" },
      { form: "box", groesse: [4.4, 0.16, 1.95], rund: 0.05, pos: [0, 3.62, 0.74], rot: [40, 0, 0], farbe: "dach_rot" },
      { form: "box", groesse: [4.4, 0.16, 1.95], rund: 0.05, pos: [0, 3.62, -0.74], rot: [-40, 0, 0], farbe: "dach_rot" },
      { form: "box", groesse: [3.9, 1.5, 1.5], rund: 0.05, pos: [0, 3.2, 0], rot: [45, 0, 0], farbe: "putz_ocker" },
      { form: "box", groesse: [0.35, 0.8, 0.35], rund: 0.04, pos: [1.2, 4.1, -0.3], farbe: "backstein" },
      { form: "box", groesse: [1.3, 1.7, 0.5], rund: 0.06, pos: [0.85, 2, 1.72], farbe: "putz_ocker" },
      { form: "box", groesse: [1.45, 0.14, 0.62], rund: 0.04, pos: [0.85, 2.9, 1.72], farbe: "dach_rot" },
      { form: "box", groesse: [1.35, 0.14, 0.55], rund: 0.04, pos: [0.85, 1.1, 1.72], farbe: "stein_hell" },
      { form: "box", groesse: [0.9, 0.9, 0.05], rund: 0.03, pos: [0.85, 2.05, 1.98], farbe: "fenster" },
      { form: "box", groesse: [0.06, 0.9, 0.03], rund: 0.01, pos: [0.85, 2.05, 2], farbe: "weiss" },
      { form: "box", groesse: [0.8, 1.4, 0.1], rund: 0.08, pos: [-1.15, 0.72, 1.52], farbe: "tuer", textur: "holz" },
      { form: "box", groesse: [0.95, 0.12, 0.14], rund: 0.03, pos: [-1.15, 1.5, 1.53], farbe: "stein_hell" },
      { form: "box", groesse: [1, 0.12, 0.45], rund: 0.03, pos: [-1.15, 0.06, 1.75], farbe: "stein_hell" },
      { form: "box", groesse: [0.55, 0.75, 0.05], rund: 0.03, pos: [-1.15, 2.35, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.68, 0.08, 0.08], rund: 0.02, pos: [-1.15, 1.95, 1.53], farbe: "weiss" },
      { form: "box", groesse: [0.55, 0.75, 0.05], rund: 0.03, pos: [-0.1, 2.35, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.68, 0.08, 0.08], rund: 0.02, pos: [-0.1, 1.95, 1.53], farbe: "weiss" },
      { form: "box", groesse: [0.5, 0.65, 0.05], rund: 0.03, pos: [0, 1.2, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.05, 0.7, 0.5], rund: 0.03, pos: [-2.01, 2.3, -0.6], farbe: "fenster" },
      { form: "box", groesse: [0.05, 0.7, 0.5], rund: 0.03, pos: [-2.01, 2.3, 0.6], farbe: "fenster" },
      { form: "box", groesse: [0.05, 0.7, 0.5], rund: 0.03, pos: [2.01, 2.3, -0.6], farbe: "fenster" },
      { form: "box", groesse: [0.05, 0.7, 0.5], rund: 0.03, pos: [2.01, 2.3, 0.6], farbe: "fenster" }
    ],
    kollision: { box: [4.1, 3.1] },
    schatten: 0,
    tuer: [-1.15, 1.5]
  },

  // Altbau mit Erker (Backstein)
  altbau_rot: {
    teile: [
      { form: "box", groesse: [4, 3.2, 3], rund: 0.08, pos: [0, 1.6, 0], farbe: "backstein" },
      { form: "box", groesse: [4.08, 0.7, 3.08], rund: 0.05, pos: [0, 0.35, 0], farbe: "stein_hell" },
      { form: "box", groesse: [4.4, 0.16, 1.95], rund: 0.05, pos: [0, 3.62, 0.74], rot: [40, 0, 0], farbe: "dach_grau" },
      { form: "box", groesse: [4.4, 0.16, 1.95], rund: 0.05, pos: [0, 3.62, -0.74], rot: [-40, 0, 0], farbe: "dach_grau" },
      { form: "box", groesse: [3.9, 1.5, 1.5], rund: 0.05, pos: [0, 3.2, 0], rot: [45, 0, 0], farbe: "backstein" },
      { form: "box", groesse: [0.35, 0.8, 0.35], rund: 0.04, pos: [1.2, 4.1, -0.3], farbe: "backstein" },
      { form: "box", groesse: [1.3, 1.7, 0.5], rund: 0.06, pos: [0.85, 2, 1.72], farbe: "backstein" },
      { form: "box", groesse: [1.45, 0.14, 0.62], rund: 0.04, pos: [0.85, 2.9, 1.72], farbe: "dach_grau" },
      { form: "box", groesse: [1.35, 0.14, 0.55], rund: 0.04, pos: [0.85, 1.1, 1.72], farbe: "stein_hell" },
      { form: "box", groesse: [0.9, 0.9, 0.05], rund: 0.03, pos: [0.85, 2.05, 1.98], farbe: "fenster" },
      { form: "box", groesse: [0.06, 0.9, 0.03], rund: 0.01, pos: [0.85, 2.05, 2], farbe: "weiss" },
      { form: "box", groesse: [0.8, 1.4, 0.1], rund: 0.08, pos: [-1.15, 0.72, 1.52], farbe: "tuer", textur: "holz" },
      { form: "box", groesse: [0.95, 0.12, 0.14], rund: 0.03, pos: [-1.15, 1.5, 1.53], farbe: "stein_hell" },
      { form: "box", groesse: [1, 0.12, 0.45], rund: 0.03, pos: [-1.15, 0.06, 1.75], farbe: "stein_hell" },
      { form: "box", groesse: [0.55, 0.75, 0.05], rund: 0.03, pos: [-1.15, 2.35, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.68, 0.08, 0.08], rund: 0.02, pos: [-1.15, 1.95, 1.53], farbe: "weiss" },
      { form: "box", groesse: [0.55, 0.75, 0.05], rund: 0.03, pos: [-0.1, 2.35, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.68, 0.08, 0.08], rund: 0.02, pos: [-0.1, 1.95, 1.53], farbe: "weiss" },
      { form: "box", groesse: [0.5, 0.65, 0.05], rund: 0.03, pos: [0, 1.2, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.05, 0.7, 0.5], rund: 0.03, pos: [-2.01, 2.3, -0.6], farbe: "fenster" },
      { form: "box", groesse: [0.05, 0.7, 0.5], rund: 0.03, pos: [-2.01, 2.3, 0.6], farbe: "fenster" },
      { form: "box", groesse: [0.05, 0.7, 0.5], rund: 0.03, pos: [2.01, 2.3, -0.6], farbe: "fenster" },
      { form: "box", groesse: [0.05, 0.7, 0.5], rund: 0.03, pos: [2.01, 2.3, 0.6], farbe: "fenster" }
    ],
    kollision: { box: [4.1, 3.1] },
    schatten: 0,
    tuer: [-1.15, 1.5]
  },

  // Kita (Tür vorne rechts)
  kita: {
    teile: [
      { form: "box", groesse: [5, 2.2, 3], rund: 0.1, pos: [0, 1.1, 0], farbe: "putz_creme" },
      { form: "box", groesse: [5.5, 0.16, 1.95], rund: 0.05, pos: [0, 2.62, 0.74], rot: [38, 0, 0], farbe: "senf" },
      { form: "box", groesse: [5.5, 0.16, 1.95], rund: 0.05, pos: [0, 2.62, -0.74], rot: [-38, 0, 0], farbe: "senf" },
      { form: "box", groesse: [4.9, 1.35, 1.35], rund: 0.05, pos: [0, 2.2, 0], rot: [45, 0, 0], farbe: "putz_creme" },
      { form: "kugel", r: 0.28, pos: [-2.46, 2.45, 0], radien: [0.05, 0.28, 0.28], farbe: "fenster" },
      { form: "kugel", r: 0.28, pos: [2.46, 2.45, 0], radien: [0.05, 0.28, 0.28], farbe: "fenster" },
      { form: "box", groesse: [5.06, 0.24, 3.06], rund: 0.04, pos: [0, 0.12, 0], farbe: "stein_hell" },
      { form: "box", groesse: [0.95, 1.5, 0.1], rund: 0.1, pos: [1.4, 0.78, 1.52], farbe: "tuer", textur: "holz" },
      { form: "box", groesse: [1.2, 0.3, 0.08], rund: 0.08, pos: [1.4, 1.75, 1.55], farbe: "koralle" },
      { form: "kugel", r: 0.07, pos: [1.1, 1.75, 1.6], farbe: "senf" },
      { form: "kugel", r: 0.07, pos: [1.4, 1.75, 1.6], farbe: "mint" },
      { form: "kugel", r: 0.07, pos: [1.7, 1.75, 1.6], farbe: "himmelblau" },
      { form: "box", groesse: [1.1, 0.12, 0.5], rund: 0.03, pos: [1.4, 0.06, 1.8], farbe: "stein_hell" },
      { form: "box", groesse: [0.9, 0.8, 0.05], rund: 0.12, pos: [-1.7, 1.2, 1.51], farbe: "fenster" },
      { form: "box", groesse: [1.02, 0.92, 0.03], rund: 0.14, pos: [-1.7, 1.2, 1.53], farbe: "koralle" },
      { form: "box", groesse: [0.9, 0.8, 0.05], rund: 0.12, pos: [-0.4, 1.2, 1.51], farbe: "fenster" },
      { form: "box", groesse: [1.02, 0.92, 0.03], rund: 0.14, pos: [-0.4, 1.2, 1.53], farbe: "mint" },
      { form: "box", groesse: [0.05, 0.8, 1.2], rund: 0.1, pos: [-2.51, 1.2, 0], farbe: "fenster" },
      { form: "box", groesse: [0.05, 0.8, 1.2], rund: 0.1, pos: [2.51, 1.2, 0], farbe: "fenster" }
    ],
    kollision: { box: [5.1, 3.1] },
    schatten: 0,
    tuer: [1.4, 1.5]
  },

  // Bürohaus (Glasfront, Tür vorne Mitte)
  buero: {
    teile: [
      { form: "box", groesse: [4, 4.2, 3], rund: 0.06, pos: [0, 2.1, 0], farbe: "putz_salbei" },
      { form: "box", groesse: [4.15, 0.18, 3.15], rund: 0.04, pos: [0, 4.28, 0], farbe: "anthrazit" },
      { form: "box", groesse: [4.06, 0.24, 3.06], rund: 0.03, pos: [0, 0.12, 0], farbe: "stein_hell" },
      { form: "box", groesse: [1.7, 0.9, 0.05], rund: 0.02, pos: [-0.9, 1, 1.51], farbe: "glas" },
      { form: "box", groesse: [0.9, 0.9, 0.05], rund: 0.02, pos: [1.35, 1, 1.51], farbe: "glas" },
      { form: "box", groesse: [3.9, 0.1, 0.08], rund: 0.02, pos: [0, 0.5, 1.54], farbe: "anthrazit" },
      { form: "box", groesse: [3.6, 0.8, 0.05], rund: 0.02, pos: [0, 2.3, 1.51], farbe: "glas" },
      { form: "box", groesse: [3.9, 0.1, 0.08], rund: 0.02, pos: [0, 1.8, 1.54], farbe: "anthrazit" },
      { form: "box", groesse: [3.6, 0.8, 0.05], rund: 0.02, pos: [0, 3.5, 1.51], farbe: "glas" },
      { form: "box", groesse: [3.9, 0.1, 0.08], rund: 0.02, pos: [0, 3, 1.54], farbe: "anthrazit" },
      { form: "box", groesse: [0.85, 1.5, 0.08], rund: 0.02, pos: [0.35, 0.78, 1.52], farbe: "glas" },
      { form: "box", groesse: [0.05, 1.5, 0.02], rund: 0.005, pos: [0.35, 0.78, 1.56], farbe: "anthrazit" },
      { form: "box", groesse: [1.1, 0.12, 0.25], rund: 0.03, pos: [0.35, 1.65, 1.6], farbe: "anthrazit" }
    ],
    kollision: { box: [4.1, 3.1] },
    schatten: 0,
    tuer: [0.35, 1.5]
  },

  // Fahrradständer mit zwei Rädern
  fahrradstaender: {
    teile: [
      { form: "box", groesse: [2.2, 0.06, 0.3], rund: 0.02, pos: [0, 0.03, 0], farbe: "metall" },
      { form: "torus", r: 0.025, R: 0.25, pos: [-0.8, 0.3, 0], rot: [0, 90, 0], farbe: "metall" },
      { form: "torus", r: 0.025, R: 0.25, pos: [0, 0.3, 0], rot: [0, 90, 0], farbe: "metall" },
      { form: "torus", r: 0.025, R: 0.25, pos: [0.8, 0.3, 0], rot: [0, 90, 0], farbe: "metall" },
      { form: "torus", r: 0.025, R: 0.27, pos: [-0.68, 0.3, -0.38], rot: [0, 90, 0], farbe: "anthrazit" },
      { form: "torus", r: 0.025, R: 0.27, pos: [-0.68, 0.3, 0.38], rot: [0, 90, 0], farbe: "anthrazit" },
      { form: "box", groesse: [0.04, 0.04, 0.7], rund: 0.012, pos: [-0.68, 0.52, 0], rot: [-8, 0, 0], farbe: "petrol" },
      { form: "box", groesse: [0.04, 0.36, 0.04], rund: 0.012, pos: [-0.68, 0.42, -0.12], rot: [30, 0, 0], farbe: "petrol" },
      { form: "box", groesse: [0.09, 0.04, 0.18], rund: 0.02, pos: [-0.68, 0.66, -0.2], farbe: "schwarz" },
      { form: "box", groesse: [0.4, 0.03, 0.03], rund: 0.01, pos: [-0.68, 0.72, 0.34], farbe: "anthrazit" },
      { form: "torus", r: 0.025, R: 0.27, pos: [0.12, 0.3, -0.38], rot: [0, 90, 0], farbe: "anthrazit" },
      { form: "torus", r: 0.025, R: 0.27, pos: [0.12, 0.3, 0.38], rot: [0, 90, 0], farbe: "anthrazit" },
      { form: "box", groesse: [0.04, 0.04, 0.7], rund: 0.012, pos: [0.12, 0.52, 0], rot: [-8, 0, 0], farbe: "senf" },
      { form: "box", groesse: [0.04, 0.36, 0.04], rund: 0.012, pos: [0.12, 0.42, -0.12], rot: [30, 0, 0], farbe: "senf" },
      { form: "box", groesse: [0.09, 0.04, 0.18], rund: 0.02, pos: [0.12, 0.66, -0.2], farbe: "schwarz" },
      { form: "box", groesse: [0.4, 0.03, 0.03], rund: 0.01, pos: [0.12, 0.72, 0.34], farbe: "anthrazit" }
    ],
    kollision: { box: [2.3, 1] },
    schatten: 0.6
  },

  // Sandkasten
  sandkasten: {
    teile: [
      { form: "box", groesse: [1.6, 0.24, 0.14], rund: 0.04, pos: [0, 0.12, -0.72], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [1.6, 0.24, 0.14], rund: 0.04, pos: [0, 0.12, 0.72], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.14, 0.24, 1.3], rund: 0.04, pos: [-0.73, 0.12, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.14, 0.24, 1.3], rund: 0.04, pos: [0.73, 0.12, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [1.34, 0.12, 1.34], rund: 0.05, pos: [0, 0.1, 0], farbe: "sand" },
      { form: "zylinder", r: 0.1, h: 0.18, rOben: 0.13, pos: [0.3, 0.25, 0.2], farbe: "koralle" },
      { form: "kugel", radien: [0.22, 0.12, 0.2], pos: [-0.3, 0.2, -0.2], farbe: "sand" }
    ],
    kollision: { box: [1.6, 1.6] },
    schatten: 0
  },

  // Zwei Pfosten eines offenen Gartentors
  torpfosten: {
    teile: [
      { form: "box", groesse: [0.16, 0.9, 0.16], rund: 0.05, pos: [-0.6, 0.45, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.16, 0.9, 0.16], rund: 0.05, pos: [0.6, 0.45, 0], farbe: "holz_hell", textur: "holz" },
      { form: "kugel", r: 0.09, pos: [-0.6, 0.95, 0], farbe: "senf" },
      { form: "kugel", r: 0.09, pos: [0.6, 0.95, 0], farbe: "senf" }
    ],
    schatten: 0
  },

  // ================= Innenräume =================

  // Bücherregal
  regal: {
    teile: [
      { form: "box", groesse: [1.6, 1.8, 0.45], rund: 0.04, pos: [0, 0.9, 0], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [1.5, 0.05, 0.42], rund: 0.01, pos: [0, 0.62, 0.02], farbe: "holz_dunkel" },
      { form: "box", groesse: [1.5, 0.05, 0.42], rund: 0.01, pos: [0, 1.22, 0.02], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.12, 0.34, 0.3], rund: 0.02, pos: [-0.65, 0.82, 0.05], farbe: "koralle" },
      { form: "box", groesse: [0.12, 0.38, 0.3], rund: 0.02, pos: [-0.49, 0.82, 0.05], farbe: "senf" },
      { form: "box", groesse: [0.12, 0.42, 0.3], rund: 0.02, pos: [-0.33, 0.82, 0.05], farbe: "petrol" },
      { form: "box", groesse: [0.12, 0.34, 0.3], rund: 0.02, pos: [-0.17, 0.82, 0.05], farbe: "lavendel" },
      { form: "box", groesse: [0.12, 0.38, 0.3], rund: 0.02, pos: [-0.01, 0.82, 0.05], farbe: "mint" },
      { form: "box", groesse: [0.12, 0.42, 0.3], rund: 0.02, pos: [0.15, 0.82, 0.05], farbe: "terrakotta" },
      { form: "box", groesse: [0.12, 0.34, 0.3], rund: 0.02, pos: [0.31, 0.82, 0.05], farbe: "himmelblau" },
      { form: "box", groesse: [0.12, 0.38, 0.3], rund: 0.02, pos: [0.47, 0.82, 0.05], farbe: "oliv" },
      { form: "box", groesse: [0.15, 0.3, 0.3], rund: 0.02, pos: [-0.6, 1.42, 0.05], farbe: "lavendel" },
      { form: "box", groesse: [0.15, 0.35, 0.3], rund: 0.02, pos: [-0.4, 1.42, 0.05], farbe: "mint" },
      { form: "box", groesse: [0.15, 0.3, 0.3], rund: 0.02, pos: [-0.2, 1.42, 0.05], farbe: "terrakotta" },
      { form: "box", groesse: [0.15, 0.35, 0.3], rund: 0.02, pos: [0, 1.42, 0.05], farbe: "himmelblau" },
      { form: "box", groesse: [0.15, 0.3, 0.3], rund: 0.02, pos: [0.2, 1.42, 0.05], farbe: "oliv" },
      { form: "box", groesse: [0.15, 0.35, 0.3], rund: 0.02, pos: [0.4, 1.42, 0.05], farbe: "koralle" }
    ],
    kollision: { box: [1.6, 0.5] },
    schatten: 0
  },

  // Tisch
  tisch: {
    teile: [
      { form: "box", groesse: [1.4, 0.07, 0.8], rund: 0.03, pos: [0, 0.72, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.07, 0.72, 0.07], rund: 0.02, pos: [-0.62, 0.36, -0.32], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.07, 0.72, 0.07], rund: 0.02, pos: [-0.62, 0.36, 0.32], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.07, 0.72, 0.07], rund: 0.02, pos: [0.62, 0.36, -0.32], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.07, 0.72, 0.07], rund: 0.02, pos: [0.62, 0.36, 0.32], farbe: "holz_dunkel" }
    ],
    kollision: { box: [1.4, 0.8] },
    schatten: 0.7
  },

  // Kleiner Kindertisch mit Bauklötzen
  kindertisch: {
    teile: [
      { form: "box", groesse: [1, 0.05, 0.6], rund: 0.02, pos: [0, 0.42, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.06, 0.4, 0.06], rund: 0.02, pos: [-0.44, 0.2, -0.24], farbe: "koralle" },
      { form: "box", groesse: [0.06, 0.4, 0.06], rund: 0.02, pos: [-0.44, 0.2, 0.24], farbe: "koralle" },
      { form: "box", groesse: [0.06, 0.4, 0.06], rund: 0.02, pos: [0.44, 0.2, -0.24], farbe: "koralle" },
      { form: "box", groesse: [0.06, 0.4, 0.06], rund: 0.02, pos: [0.44, 0.2, 0.24], farbe: "koralle" },
      { form: "box", groesse: [0.12, 0.12, 0.12], rund: 0.02, pos: [-0.2, 0.5, 0], farbe: "senf" },
      { form: "box", groesse: [0.12, 0.12, 0.12], rund: 0.02, pos: [0.15, 0.5, 0.1], farbe: "petrol" }
    ],
    kollision: { box: [1, 0.6] },
    schatten: 0.5
  },

  // Runder Spielteppich mit Klötzen
  spielteppich: {
    teile: [
      { form: "zylinder", r: 1.1, h: 0.02, pos: [0, 0.01, 0], farbe: "lavendel" },
      { form: "zylinder", r: 0.7, h: 0.02, pos: [0, 0.02, 0], farbe: "mint" },
      { form: "box", groesse: [0.14, 0.14, 0.14], rund: 0.02, pos: [0.3, 0.08, 0.2], farbe: "koralle" },
      { form: "box", groesse: [0.14, 0.14, 0.14], rund: 0.02, pos: [0.45, 0.08, 0.05], farbe: "senf" },
      { form: "box", groesse: [0.14, 0.14, 0.14], rund: 0.02, pos: [0.37, 0.22, 0.12], farbe: "himmelblau" },
      { form: "kugel", r: 0.12, pos: [-0.35, 0.12, -0.2], farbe: "terrakotta" }
    ],
    schatten: 0
  },

  // Pinnwand (hängt an einer Wand)
  pinnwand: {
    teile: [
      { form: "box", groesse: [1.6, 1, 0.06], rund: 0.03, pos: [0, 1.45, 0], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [1.45, 0.85, 0.02], rund: 0.02, pos: [0, 1.45, 0.035], farbe: "kork" },
      { form: "box", groesse: [0.35, 0.42, 0.01], rund: 0.005, pos: [-0.45, 1.6, 0.05], rot: [0, 0, -4], farbe: "weiss" },
      { form: "box", groesse: [0.4, 0.5, 0.01], rund: 0.005, pos: [0.05, 1.55, 0.05], rot: [0, 0, 3], farbe: "creme" },
      { form: "box", groesse: [0.28, 0.28, 0.01], rund: 0.005, pos: [0.5, 1.62, 0.05], farbe: "bluete_gelb" },
      { form: "box", groesse: [0.3, 0.25, 0.01], rund: 0.005, pos: [0.45, 1.2, 0.05], rot: [0, 0, 5], farbe: "rosa" },
      { form: "box", groesse: [0.32, 0.2, 0.01], rund: 0.005, pos: [-0.4, 1.18, 0.05], farbe: "mint" }
    ],
    schatten: 0,
    hoehe: 2.2
  },

  // Topfpflanze
  pflanze: {
    teile: [
      { form: "zylinder", r: 0.2, h: 0.4, rOben: 0.24, pos: [0, 0.2, 0], farbe: "terrakotta" },
      { form: "kugel", radien: [0.32, 0.34, 0.32], pos: [0, 0.62, 0], farbe: "laub", wind: 0.2 },
      { form: "kugel", r: 0.2, pos: [0.18, 0.82, 0.05], farbe: "laub_hell", wind: 0.3 },
      { form: "kugel", r: 0.18, pos: [-0.15, 0.85, -0.05], farbe: "laub_dunkel", wind: 0.3 }
    ],
    kollision: { kreis: 0.3 },
    schatten: 0.35
  },

  // Schreibtisch mit Bildschirm
  schreibtisch: {
    teile: [
      { form: "box", groesse: [1.6, 0.07, 0.8], rund: 0.02, pos: [0, 0.74, 0], farbe: "weiss" },
      { form: "box", groesse: [0.06, 0.74, 0.7], rund: 0.02, pos: [-0.72, 0.37, 0], farbe: "anthrazit" },
      { form: "box", groesse: [0.06, 0.74, 0.7], rund: 0.02, pos: [0.72, 0.37, 0], farbe: "anthrazit" },
      { form: "box", groesse: [0.7, 0.45, 0.04], rund: 0.02, pos: [0, 1.08, -0.2], farbe: "anthrazit" },
      { form: "box", groesse: [0.62, 0.37, 0.01], rund: 0.01, pos: [0, 1.08, -0.18], farbe: "glas" },
      { form: "box", groesse: [0.08, 0.12, 0.06], rund: 0.01, pos: [0, 0.83, -0.2], farbe: "anthrazit" },
      { form: "box", groesse: [0.45, 0.02, 0.15], rund: 0.005, pos: [0, 0.79, 0.12], farbe: "grau" },
      { form: "zylinder", r: 0.05, h: 0.12, pos: [0.55, 0.83, 0.15], farbe: "koralle" }
    ],
    kollision: { box: [1.6, 0.8] },
    schatten: 0.7
  },

  // Bürostuhl
  stuhl: {
    teile: [
      { form: "box", groesse: [0.5, 0.08, 0.5], rund: 0.03, pos: [0, 0.45, 0], farbe: "petrol" },
      { form: "box", groesse: [0.48, 0.55, 0.07], rund: 0.03, pos: [0, 0.75, -0.22], farbe: "petrol" },
      { form: "zylinder", r: 0.04, h: 0.44, pos: [0, 0.22, 0], farbe: "anthrazit" },
      { form: "zylinder", r: 0.22, h: 0.04, pos: [0, 0.02, 0], farbe: "anthrazit" }
    ],
    kollision: { kreis: 0.25 },
    schatten: 0.3,
    sitz: [0, 0.02],
    sitzHoehe: 0.49
  },

  // Whiteboard an der Wand
  whiteboard: {
    teile: [
      { form: "box", groesse: [1.8, 1, 0.06], rund: 0.03, pos: [0, 1.35, 0], farbe: "weiss" },
      { form: "box", groesse: [1.9, 1.1, 0.03], rund: 0.03, pos: [0, 1.35, -0.035], farbe: "anthrazit" },
      { form: "box", groesse: [0.6, 0.04, 0.01], rund: 0.005, pos: [-0.4, 1.55, 0.035], farbe: "petrol" },
      { form: "box", groesse: [0.8, 0.03, 0.01], rund: 0.005, pos: [-0.3, 1.4, 0.035], farbe: "grau" },
      { form: "box", groesse: [0.05, 0.4, 0.01], rund: 0.005, pos: [0.45, 1.3, 0.035], farbe: "koralle" },
      { form: "box", groesse: [0.05, 0.24, 0.01], rund: 0.005, pos: [0.6, 1.22, 0.035], farbe: "koralle" },
      { form: "box", groesse: [0.05, 0.16, 0.01], rund: 0.005, pos: [0.3, 1.18, 0.035], farbe: "koralle" }
    ],
    schatten: 0,
    hoehe: 2.1
  },

  // Fenster an der Innenwand
  fenster_innen: {
    teile: [
      { form: "box", groesse: [1.2, 1, 0.06], rund: 0.04, pos: [0, 1.3, 0], farbe: "fenster" },
      { form: "box", groesse: [0.07, 1, 0.04], rund: 0.01, pos: [0, 1.3, 0.02], farbe: "weiss" },
      { form: "box", groesse: [1.35, 0.07, 0.18], rund: 0.02, pos: [0, 0.78, 0.06], farbe: "weiss" }
    ],
    schatten: 0
  },

  // Teppich
  teppich: {
    teile: [
      { form: "box", groesse: [1.5, 0.1, 0.9], rund: 0.05, pos: [0, 0.05, 0], farbe: "lavendel" }
    ],
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
