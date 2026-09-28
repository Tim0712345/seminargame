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
     leuchten: true (leuchtet selbst, z. B. Lampenschirm – ohne Schatten)
     Teile mit farbe "fenster" werden automatisch zu Fensterscheiben
     (Glanzstrich, abends warmes Licht); fenster: false schaltet das ab.

   Pro Prefab:
     kollision: { kreis: r }  oder  { box: [breite, tiefe] }  oder
                { boxen: [[x, z, breite, tiefe], …] } (mehrere Kästen)  oder weglassen
     schatten:  Radius des runden Schattens (0 = keiner)
     tuer:      [x, z] Lage der Tür (für Karten-Objekte mit tuer: { ziel, spawn })
     sitz, sitzHoehe: Sitzpunkt für NPCs (Bänke, Stühle)
     hoehe:     wie hoch die „E“-Blase über dem Objekt schwebt
     spritzer:  Höhe, aus der Wassertropfen spritzen (Brunnen)
     blaetter:  { hoehe, farben: [...] } – ab und zu fällt ein Blatt aus der Krone
     licht:     Lichtquelle (oder Liste davon):
                { pos: [x, y, z], farbe, radius, staerke, hof, art }
                radius = wie weit das Licht reicht, staerke = 0…1,
                hof = Größe des gemalten Scheins um die Lampe (0 = keiner),
                art: "lampe" (hängt von „lampen“ der Stimmung ab, Standard)
                     oder "tag" (Tageslicht, z. B. durchs Fenster)
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
    schatten: 1.1,
    blaetter: { hoehe: 1.7, farben: ["laub", "laub_hell", "laub_dunkel"] }
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
    schatten: 0.9,
    blaetter: { hoehe: 2.2, farben: ["birke_laub", "bluete_gelb"] }
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
      { form: "box", groesse: [0.3, 0.36, 0.3], rund: 0.06, pos: [0, 2.55, 0], farbe: "laterne_licht", leuchten: true },
      { form: "kegel", r: 0.26, h: 0.2, pos: [0, 2.83, 0], farbe: "metall_dunkel" },
      { form: "kugel", r: 0.05, pos: [0, 2.96, 0], farbe: "metall_dunkel" }
    ],
    kollision: { kreis: 0.16 },
    schatten: 0.35,
    licht: { pos: [0, 2.45, 0], farbe: "lampe_warm", radius: 4.6, staerke: 1, hof: 1.4 }
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
      { form: "zylinder", r: 0.05, h: 0.12, pos: [0.55, 0.83, 0.15], farbe: "koralle" },
      // Schreibtischlampe
      { form: "zylinder", r: 0.08, h: 0.03, pos: [-0.6, 0.79, -0.2], farbe: "anthrazit" },
      { form: "zylinder", r: 0.014, h: 0.3, pos: [-0.6, 0.94, -0.2], farbe: "anthrazit" },
      { form: "zylinder", r: 0.13, rOben: 0.06, h: 0.13, pos: [-0.6, 1.14, -0.2], farbe: "lampe_schirm", leuchten: true }
    ],
    kollision: { box: [1.6, 0.8] },
    schatten: 0.7,
    licht: { pos: [-0.55, 1.05, -0.05], farbe: "lampe_warm", radius: 2.5, staerke: 1, hof: 0.6 }
  },

  // Stehlampe (Innenräume)
  stehlampe: {
    teile: [
      { form: "zylinder", r: 0.18, rOben: 0.14, h: 0.05, pos: [0, 0.025, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.025, h: 1.45, pos: [0, 0.75, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.25, rOben: 0.16, h: 0.32, pos: [0, 1.58, 0], farbe: "lampe_schirm", leuchten: true },
      { form: "kugel", r: 0.035, pos: [0, 1.76, 0], farbe: "metall_dunkel" }
    ],
    kollision: { kreis: 0.2 },
    schatten: 0.25,
    hoehe: 2,
    licht: { pos: [0, 1.45, 0], farbe: "lampe_warm", radius: 3.6, staerke: 0.9, hof: 0.9 }
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
    schatten: 0,
    licht: { pos: [0, 0.5, 1.5], farbe: "tageslicht", radius: 3.2, staerke: 0.9, art: "tag" }
  },

  // Teppich
  teppich: {
    teile: [
      { form: "box", groesse: [1.5, 0.1, 0.9], rund: 0.05, pos: [0, 0.05, 0], farbe: "lavendel" }
    ],
    schatten: 0
  },

  // ================= Schweden-Viertel =================

  // Schwedisches Holzhaus (rot mit weißen Ecken)
  haus_schweden: {
    teile: [
      { form: "box", groesse: [4, 2.6, 3], rund: 0.05, pos: [0, 1.3, 0], farbe: "schwedenrot", textur: "holz" },
      { form: "box", groesse: [4.08, 0.24, 3.08], rund: 0.04, pos: [0, 0.12, 0], farbe: "stein" },
      { form: "box", groesse: [0.16, 2.6, 0.16], rund: 0.03, pos: [-2, 1.3, -1.5], farbe: "weiss" },
      { form: "box", groesse: [0.16, 2.6, 0.16], rund: 0.03, pos: [-2, 1.3, 1.5], farbe: "weiss" },
      { form: "box", groesse: [0.16, 2.6, 0.16], rund: 0.03, pos: [2, 1.3, -1.5], farbe: "weiss" },
      { form: "box", groesse: [0.16, 2.6, 0.16], rund: 0.03, pos: [2, 1.3, 1.5], farbe: "weiss" },
      { form: "box", groesse: [4.4, 0.16, 2.288], rund: 0.05, pos: [0, 3.225, 0.75], rot: [42, 0, 0], farbe: "dach_dunkel" },
      { form: "box", groesse: [4.4, 0.16, 2.288], rund: 0.05, pos: [0, 3.225, -0.75], rot: [-42, 0, 0], farbe: "dach_dunkel" },
      { form: "box", groesse: [3.9, 1.797, 1.797], rund: 0.05, pos: [0, 2.6, 0], rot: [45, 0, 0], farbe: "schwedenrot" },
      { form: "box", groesse: [0.95, 1.5, 0.1], rund: 0.06, pos: [-1.2, 0.75, 1.52], farbe: "weiss" },
      { form: "box", groesse: [0.72, 1.35, 0.06], rund: 0.06, pos: [-1.2, 0.72, 1.56], farbe: "petrol", textur: "holz" },
      { form: "box", groesse: [1, 0.12, 0.5], rund: 0.03, pos: [-1.2, 0.06, 1.8], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [0.55, 0.75, 0.05], rund: 0.03, pos: [0.2, 1.55, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [0.2, 1.135, 1.53], farbe: "weiss" },
      { form: "box", groesse: [0.55, 0.75, 0.05], rund: 0.03, pos: [1.3, 1.55, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [1.3, 1.135, 1.53], farbe: "weiss" },
      { form: "box", groesse: [0.35, 0.8, 0.35], rund: 0.04, pos: [1.2, 2.9, -0.3], farbe: "stein" }
    ],
    kollision: { box: [4.1, 3.1] },
    schatten: 0,
    tuer: [-1.2, 1.5]
  },

  // Schwedisches Holzhaus (rot mit weißen Ecken)
  haus_schweden_gelb: {
    teile: [
      { form: "box", groesse: [4, 2.6, 3], rund: 0.05, pos: [0, 1.3, 0], farbe: "senf", textur: "holz" },
      { form: "box", groesse: [4.08, 0.24, 3.08], rund: 0.04, pos: [0, 0.12, 0], farbe: "stein" },
      { form: "box", groesse: [0.16, 2.6, 0.16], rund: 0.03, pos: [-2, 1.3, -1.5], farbe: "weiss" },
      { form: "box", groesse: [0.16, 2.6, 0.16], rund: 0.03, pos: [-2, 1.3, 1.5], farbe: "weiss" },
      { form: "box", groesse: [0.16, 2.6, 0.16], rund: 0.03, pos: [2, 1.3, -1.5], farbe: "weiss" },
      { form: "box", groesse: [0.16, 2.6, 0.16], rund: 0.03, pos: [2, 1.3, 1.5], farbe: "weiss" },
      { form: "box", groesse: [4.4, 0.16, 2.288], rund: 0.05, pos: [0, 3.225, 0.75], rot: [42, 0, 0], farbe: "dach_dunkel" },
      { form: "box", groesse: [4.4, 0.16, 2.288], rund: 0.05, pos: [0, 3.225, -0.75], rot: [-42, 0, 0], farbe: "dach_dunkel" },
      { form: "box", groesse: [3.9, 1.797, 1.797], rund: 0.05, pos: [0, 2.6, 0], rot: [45, 0, 0], farbe: "senf" },
      { form: "box", groesse: [0.95, 1.5, 0.1], rund: 0.06, pos: [-1.2, 0.75, 1.52], farbe: "weiss" },
      { form: "box", groesse: [0.72, 1.35, 0.06], rund: 0.06, pos: [-1.2, 0.72, 1.56], farbe: "petrol", textur: "holz" },
      { form: "box", groesse: [1, 0.12, 0.5], rund: 0.03, pos: [-1.2, 0.06, 1.8], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [0.55, 0.75, 0.05], rund: 0.03, pos: [0.2, 1.55, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [0.2, 1.135, 1.53], farbe: "weiss" },
      { form: "box", groesse: [0.55, 0.75, 0.05], rund: 0.03, pos: [1.3, 1.55, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [1.3, 1.135, 1.53], farbe: "weiss" },
      { form: "box", groesse: [0.35, 0.8, 0.35], rund: 0.04, pos: [1.2, 2.9, -0.3], farbe: "stein" }
    ],
    kollision: { box: [4.1, 3.1] },
    schatten: 0,
    tuer: [-1.2, 1.5]
  },

  // Einfache Holzbank ohne Lehne
  steg_bank: {
    teile: [
      { form: "box", groesse: [1.4, 0.08, 0.5], rund: 0.03, pos: [0, 0.45, 0], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [0.08, 0.44, 0.44], rund: 0.03, pos: [-0.6, 0.22, 0], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.08, 0.44, 0.44], rund: 0.03, pos: [0.6, 0.22, 0], farbe: "holz_dunkel" }
    ],
    kollision: { box: [1.4, 0.5] },
    schatten: 0.6,
    sitz: [0, 0],
    sitzHoehe: 0.49
  },

  // ================= Estland-Viertel =================

  // Messestand (it)
  messestand_it: {
    teile: [
      { form: "box", groesse: [2.2, 2.1, 0.1], rund: 0.04, pos: [0, 1.05, -0.55], farbe: "petrol" },
      { form: "box", groesse: [0.08, 2.1, 1.2], rund: 0.03, pos: [-1.05, 1.05, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.08, 2.1, 1.2], rund: 0.03, pos: [1.05, 1.05, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [2.4, 0.4, 1.3], rund: 0.06, pos: [0, 2.2, 0], farbe: "petrol" },
      { form: "box", groesse: [1.6, 0.26, 0.03], rund: 0.03, pos: [0, 2.2, 0.66], farbe: "creme" },
      { form: "box", groesse: [1.9, 1, 0.5], rund: 0.04, pos: [0, 0.5, 0.35], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [2, 0.06, 0.6], rund: 0.02, pos: [0, 1.02, 0.35], farbe: "creme" },
      { form: "box", groesse: [0.9, 0.6, 0.05], rund: 0.03, pos: [0, 1.35, -0.47], farbe: "anthrazit" },
      { form: "box", groesse: [0.8, 0.5, 0.02], rund: 0.02, pos: [0, 1.35, -0.44], farbe: "glas" },
      { form: "box", groesse: [0.4, 0.03, 0.28], rund: 0.01, pos: [-0.5, 1.1, 0.4], farbe: "anthrazit" },
      { form: "box", groesse: [0.4, 0.25, 0.02], rund: 0.01, pos: [-0.5, 1.22, 0.28], rot: [-15, 0, 0], farbe: "anthrazit" },
      { form: "box", groesse: [0.18, 0.12, 0.02], rund: 0.01, pos: [-0.45, 2.2, 0.68], farbe: "petrol" },
      { form: "box", groesse: [0.18, 0.12, 0.02], rund: 0.01, pos: [0.45, 2.2, 0.68], farbe: "petrol" }
    ],
    kollision: { box: [2.3, 1.3] },
    schatten: 0,
    hoehe: 2.6
  },

  // Messestand (pflege)
  messestand_pflege: {
    teile: [
      { form: "box", groesse: [2.2, 2.1, 0.1], rund: 0.04, pos: [0, 1.05, -0.55], farbe: "mint" },
      { form: "box", groesse: [0.08, 2.1, 1.2], rund: 0.03, pos: [-1.05, 1.05, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.08, 2.1, 1.2], rund: 0.03, pos: [1.05, 1.05, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [2.4, 0.4, 1.3], rund: 0.06, pos: [0, 2.2, 0], farbe: "mint" },
      { form: "box", groesse: [1.6, 0.26, 0.03], rund: 0.03, pos: [0, 2.2, 0.66], farbe: "creme" },
      { form: "box", groesse: [1.9, 1, 0.5], rund: 0.04, pos: [0, 0.5, 0.35], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [2, 0.06, 0.6], rund: 0.02, pos: [0, 1.02, 0.35], farbe: "creme" },
      { form: "kugel", radien: [0.2, 0.2, 0.06], pos: [-0.12, 1.5, -0.46], farbe: "koralle" },
      { form: "kugel", radien: [0.2, 0.2, 0.06], pos: [0.12, 1.5, -0.46], farbe: "koralle" },
      { form: "kegel", r: 0.28, h: 0.34, pos: [0, 1.3, -0.46], rot: [180, 0, 0], farbe: "koralle" },
      { form: "zylinder", r: 0.08, h: 0.18, pos: [0.5, 1.13, 0.4], farbe: "weiss" },
      { form: "kugel", r: 0.06, pos: [-0.45, 2.2, 0.68], farbe: "koralle" },
      { form: "kugel", r: 0.06, pos: [0.45, 2.2, 0.68], farbe: "koralle" }
    ],
    kollision: { box: [2.3, 1.3] },
    schatten: 0,
    hoehe: 2.6
  },

  // Messestand (handwerk)
  messestand_handwerk: {
    teile: [
      { form: "box", groesse: [2.2, 2.1, 0.1], rund: 0.04, pos: [0, 1.05, -0.55], farbe: "ocker" },
      { form: "box", groesse: [0.08, 2.1, 1.2], rund: 0.03, pos: [-1.05, 1.05, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.08, 2.1, 1.2], rund: 0.03, pos: [1.05, 1.05, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [2.4, 0.4, 1.3], rund: 0.06, pos: [0, 2.2, 0], farbe: "ocker" },
      { form: "box", groesse: [1.6, 0.26, 0.03], rund: 0.03, pos: [0, 2.2, 0.66], farbe: "creme" },
      { form: "box", groesse: [1.9, 1, 0.5], rund: 0.04, pos: [0, 0.5, 0.35], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [2, 0.06, 0.6], rund: 0.02, pos: [0, 1.02, 0.35], farbe: "creme" },
      { form: "box", groesse: [0.08, 0.7, 0.05], rund: 0.02, pos: [0.1, 1.45, -0.46], rot: [0, 0, -30], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.35, 0.14, 0.08], rund: 0.03, pos: [-0.1, 1.72, -0.46], rot: [0, 0, -30], farbe: "metall" },
      { form: "box", groesse: [0.5, 0.14, 0.3], rund: 0.02, pos: [-0.5, 1.12, 0.4], farbe: "holz", textur: "holz" },
      { form: "zylinder", r: 0.05, h: 0.2, pos: [0.5, 1.15, 0.4], farbe: "metall" },
      { form: "box", groesse: [0.2, 0.1, 0.02], rund: 0.01, pos: [-0.45, 2.2, 0.68], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.2, 0.1, 0.02], rund: 0.01, pos: [0.45, 2.2, 0.68], farbe: "holz_dunkel" }
    ],
    kollision: { box: [2.3, 1.3] },
    schatten: 0,
    hoehe: 2.6
  },

  // Messestand (soziales)
  messestand_soziales: {
    teile: [
      { form: "box", groesse: [2.2, 2.1, 0.1], rund: 0.04, pos: [0, 1.05, -0.55], farbe: "koralle" },
      { form: "box", groesse: [0.08, 2.1, 1.2], rund: 0.03, pos: [-1.05, 1.05, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [0.08, 2.1, 1.2], rund: 0.03, pos: [1.05, 1.05, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [2.4, 0.4, 1.3], rund: 0.06, pos: [0, 2.2, 0], farbe: "koralle" },
      { form: "box", groesse: [1.6, 0.26, 0.03], rund: 0.03, pos: [0, 2.2, 0.66], farbe: "creme" },
      { form: "box", groesse: [1.9, 1, 0.5], rund: 0.04, pos: [0, 0.5, 0.35], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [2, 0.06, 0.6], rund: 0.02, pos: [0, 1.02, 0.35], farbe: "creme" },
      { form: "kugel", r: 0.13, pos: [-0.25, 1.62, -0.46], farbe: "senf" },
      { form: "box", groesse: [0.3, 0.35, 0.05], rund: 0.06, pos: [-0.25, 1.3, -0.46], farbe: "senf" },
      { form: "kugel", r: 0.1, pos: [0.22, 1.55, -0.46], farbe: "petrol" },
      { form: "box", groesse: [0.24, 0.3, 0.05], rund: 0.06, pos: [0.22, 1.28, -0.46], farbe: "petrol" },
      { form: "box", groesse: [0.14, 0.14, 0.14], rund: 0.02, pos: [-0.5, 1.12, 0.4], farbe: "koralle" },
      { form: "box", groesse: [0.14, 0.14, 0.14], rund: 0.02, pos: [-0.33, 1.12, 0.42], farbe: "senf" },
      { form: "box", groesse: [0.14, 0.14, 0.14], rund: 0.02, pos: [-0.42, 1.26, 0.41], farbe: "himmelblau" }
    ],
    kollision: { box: [2.3, 1.3] },
    schatten: 0,
    hoehe: 2.6
  },

  // Runder Infotresen der Messe
  infotresen: {
    teile: [
      { form: "zylinder", r: 0.85, h: 1, rOben: 0.8, pos: [0, 0.5, 0], farbe: "holz_hell", textur: "holz" },
      { form: "zylinder", r: 0.9, h: 0.06, pos: [0, 1.03, 0], farbe: "creme" },
      { form: "zylinder", r: 0.05, h: 1.7, pos: [0, 1.9, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [1.2, 0.5, 0.06], rund: 0.05, pos: [0, 2.5, 0], farbe: "petrol" },
      { form: "box", groesse: [1, 0.34, 0.02], rund: 0.03, pos: [0, 2.5, 0.04], farbe: "creme" }
    ],
    kollision: { kreis: 0.9 },
    schatten: 0.8,
    hoehe: 2.9
  },

  // Moderner Glasbau
  glasbau: {
    teile: [
      { form: "box", groesse: [4, 4.8, 3], rund: 0.04, pos: [0, 2.4, 0], farbe: "glas" },
      { form: "box", groesse: [4.1, 0.12, 3.1], rund: 0.03, pos: [0, 4.86, 0], farbe: "anthrazit" },
      { form: "box", groesse: [4.1, 0.16, 3.1], rund: 0.03, pos: [0, 0.08, 0], farbe: "anthrazit" },
      { form: "box", groesse: [4.06, 0.1, 3.06], rund: 0.02, pos: [0, 1.6, 0], farbe: "anthrazit" },
      { form: "box", groesse: [4.06, 0.1, 3.06], rund: 0.02, pos: [0, 3.2, 0], farbe: "anthrazit" },
      { form: "box", groesse: [0.08, 4.8, 0.08], rund: 0.02, pos: [-2, 2.4, 1.5], farbe: "anthrazit" },
      { form: "box", groesse: [0.08, 4.8, 0.08], rund: 0.02, pos: [-0.67, 2.4, 1.5], farbe: "anthrazit" },
      { form: "box", groesse: [0.08, 4.8, 0.08], rund: 0.02, pos: [0.67, 2.4, 1.5], farbe: "anthrazit" },
      { form: "box", groesse: [0.08, 4.8, 0.08], rund: 0.02, pos: [2, 2.4, 1.5], farbe: "anthrazit" },
      { form: "box", groesse: [0.9, 1.4, 0.06], rund: 0.02, pos: [0, 0.75, 1.52], farbe: "anthrazit" }
    ],
    kollision: { box: [4.1, 3.1] },
    schatten: 0
  },

  // Estnisches Holzhaus mit grünem Dach
  holzhaus: {
    teile: [
      { form: "box", groesse: [3, 2.2, 2.6], rund: 0.05, pos: [0, 1.1, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [3.06, 0.2, 2.66], rund: 0.03, pos: [0, 0.1, 0], farbe: "stein" },
      { form: "box", groesse: [3.4, 0.16, 1.904], rund: 0.05, pos: [0, 2.658, 0.65], rot: [38, 0, 0], farbe: "kiefer" },
      { form: "box", groesse: [3.4, 0.16, 1.904], rund: 0.05, pos: [0, 2.658, -0.65], rot: [-38, 0, 0], farbe: "kiefer" },
      { form: "box", groesse: [2.9, 1.323, 1.323], rund: 0.05, pos: [0, 2.2, 0], rot: [45, 0, 0], farbe: "holz_hell" },
      { form: "box", groesse: [0.75, 1.4, 0.1], rund: 0.06, pos: [-0.7, 0.72, 1.32], farbe: "tuer", textur: "holz" },
      { form: "box", groesse: [0.55, 0.75, 0.05], rund: 0.03, pos: [0.6, 1.3, 1.31], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [0.6, 0.885, 1.33], farbe: "weiss" }
    ],
    kollision: { box: [3.1, 2.7] },
    schatten: 0
  },

  // ================= Luxemburg-Viertel =================

  // Luxemburger Sandsteinhaus mit Fensterläden
  sandstein_haus: {
    teile: [
      { form: "box", groesse: [4, 4, 3], rund: 0.05, pos: [0, 2, 0], farbe: "sandstein" },
      { form: "box", groesse: [4.08, 0.6, 3.08], rund: 0.04, pos: [0, 0.3, 0], farbe: "stein" },
      { form: "box", groesse: [4.14, 0.14, 3.14], rund: 0.03, pos: [0, 4.02, 0], farbe: "stein_hell" },
      { form: "box", groesse: [4.4, 0.16, 2.404], rund: 0.05, pos: [0, 4.75, 0.75], rot: [45, 0, 0], farbe: "schiefer" },
      { form: "box", groesse: [4.4, 0.16, 2.404], rund: 0.05, pos: [0, 4.75, -0.75], rot: [-45, 0, 0], farbe: "schiefer" },
      { form: "box", groesse: [3.9, 2.008, 2.008], rund: 0.05, pos: [0, 4.05, 0], rot: [45, 0, 0], farbe: "sandstein" },
      { form: "box", groesse: [0.8, 1.5, 0.1], rund: 0.1, pos: [-1.2, 0.82, 1.52], farbe: "tuer", textur: "holz" },
      { form: "box", groesse: [0.55, 0.8, 0.05], rund: 0.03, pos: [-1.2, 2.9, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [-1.2, 2.46, 1.53], farbe: "stein_hell" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [-1.56, 2.9, 1.53], farbe: "salbei" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [-0.84, 2.9, 1.53], farbe: "salbei" },
      { form: "box", groesse: [0.55, 0.8, 0.05], rund: 0.03, pos: [0, 1.6, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [0, 1.16, 1.53], farbe: "stein_hell" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [-0.36, 1.6, 1.53], farbe: "salbei" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [0.36, 1.6, 1.53], farbe: "salbei" },
      { form: "box", groesse: [0.55, 0.8, 0.05], rund: 0.03, pos: [0, 2.9, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [0, 2.46, 1.53], farbe: "stein_hell" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [-0.36, 2.9, 1.53], farbe: "salbei" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [0.36, 2.9, 1.53], farbe: "salbei" },
      { form: "box", groesse: [0.55, 0.8, 0.05], rund: 0.03, pos: [1.2, 1.6, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [1.2, 1.16, 1.53], farbe: "stein_hell" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [0.84, 1.6, 1.53], farbe: "salbei" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [1.56, 1.6, 1.53], farbe: "salbei" },
      { form: "box", groesse: [0.55, 0.8, 0.05], rund: 0.03, pos: [1.2, 2.9, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.69, 0.08, 0.09], rund: 0.02, pos: [1.2, 2.46, 1.53], farbe: "stein_hell" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [0.84, 2.9, 1.53], farbe: "salbei" },
      { form: "box", groesse: [0.12, 0.8, 0.04], rund: 0.02, pos: [1.56, 2.9, 1.53], farbe: "salbei" }
    ],
    kollision: { box: [4.1, 3.1] },
    schatten: 0
  },

  // Bürohochhaus (Tür vorne Mitte)
  hochhaus: {
    teile: [
      { form: "box", groesse: [5, 8, 4], rund: 0.06, pos: [0, 4, 0], farbe: "putz_salbei" },
      { form: "box", groesse: [5.1, 0.2, 4.1], rund: 0.04, pos: [0, 8.1, 0], farbe: "anthrazit" },
      { form: "box", groesse: [5.06, 0.24, 4.06], rund: 0.03, pos: [0, 0.12, 0], farbe: "stein_hell" },
      { form: "box", groesse: [1.2, 0.8, 1], rund: 0.05, pos: [1.2, 8.6, -0.6], farbe: "metall" },
      { form: "box", groesse: [4.6, 0.9, 0.05], rund: 0.02, pos: [0, 2.5, 2.01], farbe: "glas" },
      { form: "box", groesse: [4.9, 0.12, 0.08], rund: 0.02, pos: [0, 1.95, 2.04], farbe: "anthrazit" },
      { form: "box", groesse: [4.6, 0.9, 0.05], rund: 0.02, pos: [0, 3.9, 2.01], farbe: "glas" },
      { form: "box", groesse: [4.9, 0.12, 0.08], rund: 0.02, pos: [0, 3.35, 2.04], farbe: "anthrazit" },
      { form: "box", groesse: [4.6, 0.9, 0.05], rund: 0.02, pos: [0, 5.3, 2.01], farbe: "glas" },
      { form: "box", groesse: [4.9, 0.12, 0.08], rund: 0.02, pos: [0, 4.75, 2.04], farbe: "anthrazit" },
      { form: "box", groesse: [4.6, 0.9, 0.05], rund: 0.02, pos: [0, 6.7, 2.01], farbe: "glas" },
      { form: "box", groesse: [4.9, 0.12, 0.08], rund: 0.02, pos: [0, 6.15, 2.04], farbe: "anthrazit" },
      { form: "box", groesse: [1.6, 1.2, 0.05], rund: 0.02, pos: [-1.4, 1, 2.01], farbe: "glas" },
      { form: "box", groesse: [1.4, 1.2, 0.05], rund: 0.02, pos: [1.5, 1, 2.01], farbe: "glas" },
      { form: "box", groesse: [1, 1.6, 0.08], rund: 0.02, pos: [0, 0.85, 2.02], farbe: "glas" },
      { form: "box", groesse: [0.05, 1.6, 0.02], rund: 0.005, pos: [0, 0.85, 2.07], farbe: "anthrazit" },
      { form: "box", groesse: [1.6, 0.12, 0.5], rund: 0.03, pos: [0, 1.85, 2.2], farbe: "anthrazit" },
      { form: "box", groesse: [1.4, 0.12, 0.6], rund: 0.03, pos: [0, 0.06, 2.35], farbe: "stein_hell" }
    ],
    kollision: { box: [5.1, 4.1] },
    schatten: 0,
    tuer: [0, 2]
  },

  // Steingeländer einer Brücke (1 Kachel)
  gelaender: {
    teile: [
      { form: "box", groesse: [1, 0.9, 0.28], rund: 0.06, pos: [0, 0.45, 0], farbe: "stein_hell" },
      { form: "box", groesse: [1.06, 0.12, 0.34], rund: 0.04, pos: [0, 0.95, 0], farbe: "stein" }
    ],
    kollision: { box: [1, 0.3] },
    schatten: 0
  },

  // Café-Tisch mit Sonnenschirm
  cafe_tisch: {
    teile: [
      { form: "zylinder", r: 0.42, h: 0.05, pos: [0, 0.72, 0], farbe: "weiss" },
      { form: "zylinder", r: 0.04, h: 0.72, pos: [0, 0.36, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.025, h: 1.2, pos: [0, 1.3, 0], farbe: "metall_dunkel" },
      { form: "kegel", r: 0.95, h: 0.45, pos: [0, 1.95, 0], farbe: "koralle" },
      { form: "box", groesse: [0.36, 0.05, 0.36], rund: 0.02, pos: [-0.55, 0.45, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.36, 0.05, 0.36], rund: 0.02, pos: [0.55, 0.45, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.05, h: 0.1, pos: [0.12, 0.8, 0.1], farbe: "creme" }
    ],
    kollision: { kreis: 0.55 },
    schatten: 0.9
  },

  // ================= Innenräume (Amt, Hochhaus) =================

  // Schalter/Tresen mit Glasscheibe
  schalter: {
    teile: [
      { form: "box", groesse: [3, 1.1, 0.6], rund: 0.04, pos: [0, 0.55, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [3.1, 0.06, 0.7], rund: 0.02, pos: [0, 1.12, 0], farbe: "creme" },
      { form: "box", groesse: [2.8, 0.8, 0.03], rund: 0.02, pos: [0, 1.55, 0.1], farbe: "glas" },
      { form: "box", groesse: [0.3, 0.02, 0.22], rund: 0.005, pos: [0.8, 1.2, 0.15], farbe: "weiss" },
      { form: "box", groesse: [0.4, 0.3, 0.03], rund: 0.02, pos: [-0.6, 1.22, 0.1], farbe: "anthrazit" }
    ],
    kollision: { box: [3, 0.7] },
    schatten: 0,
    hoehe: 2
  },

  // Empfangstresen
  empfangstresen: {
    teile: [
      { form: "box", groesse: [2.4, 1.1, 0.7], rund: 0.06, pos: [0, 0.55, 0], farbe: "weiss" },
      { form: "box", groesse: [2.5, 0.06, 0.8], rund: 0.02, pos: [0, 1.12, 0], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [2.2, 0.3, 0.02], rund: 0.01, pos: [0, 0.55, 0.36], farbe: "lavendel" },
      { form: "zylinder", r: 0.07, h: 0.1, pos: [0.7, 1.2, 0], farbe: "senf" }
    ],
    kollision: { box: [2.5, 0.8] },
    schatten: 0,
    hoehe: 2
  },

  // Sofa
  sofa: {
    teile: [
      { form: "box", groesse: [1.8, 0.35, 0.8], rund: 0.1, pos: [0, 0.3, 0], farbe: "petrol" },
      { form: "box", groesse: [1.8, 0.5, 0.2], rund: 0.08, pos: [0, 0.65, -0.32], farbe: "petrol" },
      { form: "box", groesse: [0.2, 0.4, 0.8], rund: 0.08, pos: [-0.85, 0.5, 0], farbe: "petrol" },
      { form: "box", groesse: [0.2, 0.4, 0.8], rund: 0.08, pos: [0.85, 0.5, 0], farbe: "petrol" },
      { form: "box", groesse: [0.4, 0.3, 0.12], rund: 0.08, pos: [-0.4, 0.52, 0.02], rot: [-10, 0, 0], farbe: "senf" }
    ],
    kollision: { box: [1.9, 0.85] },
    schatten: 0.6,
    sitz: [0, 0.05],
    sitzHoehe: 0.48
  },

  // Aufzug an der Wand (Objekt braucht aufzug: [Karten])
  aufzug: {
    teile: [
      { form: "box", groesse: [1.4, 2.5, 0.14], rund: 0.04, pos: [0, 1.25, 0], farbe: "metall" },
      { form: "box", groesse: [0.5, 2, 0.04], rund: 0.02, pos: [-0.27, 1.1, 0.06], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.5, 2, 0.04], rund: 0.02, pos: [0.27, 1.1, 0.06], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.5, 0.16, 0.02], rund: 0.02, pos: [0, 2.3, 0.08], farbe: "anthrazit" },
      { form: "kugel", r: 0.035, pos: [0, 2.3, 0.1], farbe: "senf" },
      { form: "box", groesse: [0.14, 0.3, 0.04], rund: 0.02, pos: [0.85, 1.2, 0.05], farbe: "anthrazit" },
      { form: "kugel", r: 0.03, pos: [0.85, 1.28, 0.08], farbe: "weiss" },
      { form: "kugel", r: 0.03, pos: [0.85, 1.14, 0.08], farbe: "weiss" }
    ],
    kollision: { box: [1.4, 0.3] },
    schatten: 0,
    hoehe: 2.6
  },

  // Plakat an der Wand
  plakat: {
    teile: [
      { form: "box", groesse: [0.9, 1.2, 0.03], rund: 0.02, pos: [0, 1.4, 0], farbe: "creme" },
      { form: "box", groesse: [0.7, 0.3, 0.01], rund: 0.01, pos: [0, 1.72, 0.02], farbe: "himmelblau" },
      { form: "kugel", radien: [0.1, 0.1, 0.01], pos: [-0.15, 1.3, 0.02], farbe: "senf" },
      { form: "kugel", radien: [0.1, 0.1, 0.01], pos: [0.15, 1.3, 0.02], farbe: "petrol" },
      { form: "box", groesse: [0.6, 0.05, 0.01], rund: 0.005, pos: [0, 1.02, 0.02], farbe: "grau" }
    ],
    schatten: 0,
    hoehe: 2.1
  },

  // Wartestühle
  stuhlreihe: {
    teile: [
      { form: "box", groesse: [0.5, 0.06, 0.45], rund: 0.03, pos: [-0.9, 0.42, 0], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.45, 0.06], rund: 0.03, pos: [-0.9, 0.68, -0.2], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.06, 0.45], rund: 0.03, pos: [-0.3, 0.42, 0], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.45, 0.06], rund: 0.03, pos: [-0.3, 0.68, -0.2], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.06, 0.45], rund: 0.03, pos: [0.3, 0.42, 0], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.45, 0.06], rund: 0.03, pos: [0.3, 0.68, -0.2], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.06, 0.45], rund: 0.03, pos: [0.9, 0.42, 0], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.45, 0.06], rund: 0.03, pos: [0.9, 0.68, -0.2], farbe: "senf" },
      { form: "box", groesse: [2.3, 0.05, 0.3], rund: 0.02, pos: [0, 0.2, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.05, 0.4, 0.3], rund: 0.02, pos: [-1.1, 0.2, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.05, 0.4, 0.3], rund: 0.02, pos: [1.1, 0.2, 0], farbe: "metall_dunkel" }
    ],
    kollision: { box: [2.4, 0.5] },
    schatten: 0.5,
    sitz: [-0.3, 0],
    sitzHoehe: 0.45
  },


  // ---------------- Brüssel ----------------

  // Das Tor am Europaplatz, geöffnet (erscheint, sobald alle vier Beweisstücke da sind)
  tor_offen: {
    teile: [
      { form: "box", groesse: [0.6, 2.6, 0.6], rund: 0.08, pos: [-1.5, 1.3, 0], farbe: "stein_hell" },
      { form: "box", groesse: [0.6, 2.6, 0.6], rund: 0.08, pos: [1.5, 1.3, 0], farbe: "stein_hell" },
      { form: "box", groesse: [0.72, 0.2, 0.72], rund: 0.06, pos: [-1.5, 2.7, 0], farbe: "stein" },
      { form: "box", groesse: [0.72, 0.2, 0.72], rund: 0.06, pos: [1.5, 2.7, 0], farbe: "stein" },
      { form: "torus", r: 0.07, R: 1.2, pos: [0, 2.2, 0], rot: [0, 0, 0], farbe: "metall_dunkel" },
      // linker Flügel (nach Norden aufgeschwungen)
      { form: "box", groesse: [1.2, 0.08, 0.08], rund: 0.02, pos: [-1.1, 1.05, -0.59], rot: [0, 80, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [1.2, 0.08, 0.08], rund: 0.02, pos: [-1.1, 2.0, -0.59], rot: [0, 80, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.1, pos: [-1.148, 1.15, -0.295], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.1, pos: [-1.098, 1.15, -0.59], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.1, pos: [-1.047, 1.15, -0.886], farbe: "metall_dunkel" },
      // rechter Flügel
      { form: "box", groesse: [1.2, 0.08, 0.08], rund: 0.02, pos: [1.1, 1.05, -0.59], rot: [0, 100, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [1.2, 0.08, 0.08], rund: 0.02, pos: [1.1, 2.0, -0.59], rot: [0, 100, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.1, pos: [1.148, 1.15, -0.295], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.1, pos: [1.098, 1.15, -0.59], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.035, h: 2.1, pos: [1.047, 1.15, -0.886], farbe: "metall_dunkel" },
      // vier gefüllte Mulden im Schlussstein
      { form: "kugel", r: 0.16, pos: [0, 3.35, 0], farbe: "senf" },
      { form: "kugel", r: 0.07, pos: [-0.3, 2.2, 0.05], farbe: "terrakotta" },
      { form: "kugel", r: 0.07, pos: [-0.1, 2.2, 0.05], farbe: "himmelblau" },
      { form: "kugel", r: 0.07, pos: [0.1, 2.2, 0.05], farbe: "petrol" },
      { form: "kugel", r: 0.07, pos: [0.3, 2.2, 0.05], farbe: "koralle" }
    ],
    kollision: { boxen: [[-1.5, 0, 0.7, 0.7], [1.5, 0, 0.7, 0.7]] },
    schatten: 0,
    hoehe: 2.8
  },

  // Archiv: Backstein mit Rundbogenfenstern (Tür vorne Mitte)
  archiv: {
    teile: [
      { form: "box", groesse: [5, 4, 3.4], rund: 0.05, pos: [0, 2, 0], farbe: "backstein" },
      { form: "box", groesse: [5.1, 0.5, 3.5], rund: 0.04, pos: [0, 0.25, 0], farbe: "stein" },
      { form: "box", groesse: [5.2, 0.2, 3.6], rund: 0.04, pos: [0, 4.05, 0], farbe: "stein_hell" },
      { form: "box", groesse: [4.6, 0.9, 3.0], rund: 0.12, pos: [0, 4.6, 0], farbe: "schiefer" },
      { form: "box", groesse: [4.9, 0.12, 0.12], rund: 0.03, pos: [0, 2.2, 1.72], farbe: "stein_hell" },
      // Tür mit Rundbogen
      { form: "box", groesse: [1.0, 1.6, 0.1], rund: 0.03, pos: [0, 0.8, 1.72], farbe: "tuer", textur: "holz" },
      { form: "zylinder", r: 0.5, h: 0.1, pos: [0, 1.6, 1.72], rot: [90, 0, 0], farbe: "tuer" },
      { form: "torus", R: 0.56, r: 0.06, pos: [0, 1.6, 1.74], farbe: "stein_hell" },
      // Schild über der Tür
      { form: "box", groesse: [1.3, 0.34, 0.06], rund: 0.03, pos: [0, 2.6, 1.73], farbe: "creme" },
      { form: "box", groesse: [0.9, 0.06, 0.02], rund: 0.01, pos: [0, 2.6, 1.77], farbe: "tusche" },
      // Rundbogenfenster
      { form: "box", groesse: [0.6, 0.9, 0.05], rund: 0.02, pos: [-1.6, 1.2, 1.71], farbe: "fenster" },
      { form: "zylinder", r: 0.3, h: 0.05, pos: [-1.6, 1.65, 1.71], rot: [90, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [0.6, 0.9, 0.05], rund: 0.02, pos: [1.6, 1.2, 1.71], farbe: "fenster" },
      { form: "zylinder", r: 0.3, h: 0.05, pos: [1.6, 1.65, 1.71], rot: [90, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [0.6, 0.9, 0.05], rund: 0.02, pos: [-1.6, 2.9, 1.71], farbe: "fenster" },
      { form: "zylinder", r: 0.3, h: 0.05, pos: [-1.6, 3.35, 1.71], rot: [90, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [0.6, 0.9, 0.05], rund: 0.02, pos: [1.6, 2.9, 1.71], farbe: "fenster" },
      { form: "zylinder", r: 0.3, h: 0.05, pos: [1.6, 3.35, 1.71], rot: [90, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [0.6, 0.9, 0.05], rund: 0.02, pos: [0, 3.2, 1.71], farbe: "fenster" },
      { form: "zylinder", r: 0.3, h: 0.05, pos: [0, 3.65, 1.71], rot: [90, 0, 0], farbe: "fenster" },
      // Stufe
      { form: "box", groesse: [1.6, 0.12, 0.5], rund: 0.03, pos: [0, 0.06, 1.95], farbe: "stein_hell" }
    ],
    kollision: { box: [5.1, 3.5] },
    schatten: 0,
    tuer: [0, 1.7]
  },

  // Parlamentsgebäude: Glas und heller Stein, Kuppel, Säulen
  parlament: {
    teile: [
      { form: "box", groesse: [7, 4.6, 4], rund: 0.06, pos: [0, 2.3, 0], farbe: "stein_hell" },
      { form: "box", groesse: [6.2, 3.4, 0.05], rund: 0.02, pos: [0, 2.2, 2.01], farbe: "glas" },
      { form: "box", groesse: [6.3, 0.1, 0.08], rund: 0.02, pos: [0, 2.0, 2.04], farbe: "anthrazit" },
      { form: "zylinder", r: 0.18, h: 4.4, pos: [-2.8, 2.2, 2.35], farbe: "stein_hell" },
      { form: "zylinder", r: 0.18, h: 4.4, pos: [-1.4, 2.2, 2.35], farbe: "stein_hell" },
      { form: "zylinder", r: 0.18, h: 4.4, pos: [1.4, 2.2, 2.35], farbe: "stein_hell" },
      { form: "zylinder", r: 0.18, h: 4.4, pos: [2.8, 2.2, 2.35], farbe: "stein_hell" },
      { form: "box", groesse: [7.4, 0.25, 1.0], rund: 0.05, pos: [0, 4.5, 2.2], farbe: "stein" },
      { form: "box", groesse: [7.2, 0.2, 4.2], rund: 0.04, pos: [0, 4.7, 0], farbe: "stein" },
      { form: "kugel", radien: [1.6, 1.1, 1.6], pos: [0, 4.8, -0.2], farbe: "glas" },
      { form: "torus", R: 1.6, r: 0.06, pos: [0, 4.85, -0.2], rot: [90, 0, 0], farbe: "metall" },
      { form: "kugel", r: 0.14, pos: [0, 5.95, -0.2], farbe: "senf" },
      // Glastür
      { form: "box", groesse: [1.3, 1.9, 0.08], rund: 0.02, pos: [0, 0.95, 2.05], farbe: "glas" },
      { form: "box", groesse: [0.05, 1.9, 0.04], rund: 0.01, pos: [0, 0.95, 2.1], farbe: "anthrazit" },
      { form: "box", groesse: [1.45, 0.1, 0.1], rund: 0.02, pos: [0, 1.95, 2.08], farbe: "anthrazit" },
      // zwei Fahnen-Banner (stilisiert, keine echte Flagge)
      { form: "box", groesse: [0.7, 1.5, 0.04], rund: 0.02, pos: [-2.1, 3.1, 2.06], farbe: "petrol" },
      { form: "torus", R: 0.2, r: 0.035, pos: [-2.1, 3.3, 2.09], farbe: "senf" },
      { form: "box", groesse: [0.7, 1.5, 0.04], rund: 0.02, pos: [2.1, 3.1, 2.06], farbe: "petrol" },
      { form: "torus", R: 0.2, r: 0.035, pos: [2.1, 3.3, 2.09], farbe: "senf" },
      // Treppe
      { form: "box", groesse: [3.2, 0.14, 0.7], rund: 0.03, pos: [0, 0.07, 2.7], farbe: "stein_hell" }
    ],
    kollision: { box: [7.2, 4.8] },
    schatten: 0,
    tuer: [0, 2.45]
  },

  // Schmales Jugendstil-Haus mit rundem Giebel (zwei Farbvarianten)
  jugendstil_a: {
    teile: [
      { form: "box", groesse: [3.4, 4.4, 3], rund: 0.05, pos: [0, 2.2, 0], farbe: "putz_salbei" },
      // runder Giebel: Halbkreis über dem Haus (vorne leicht zurückgesetzt), Zierbogen aus Stücken
      { form: "zylinder", r: 1.7, h: 2.94, pos: [0, 4.4, -0.03], rot: [90, 0, 0], farbe: "putz_salbei" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [1.696, 4.787, 1.53], rot: [0, 0, 102.9], farbe: "petrol" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [1.360, 5.485, 1.53], rot: [0, 0, 128.6], farbe: "petrol" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [0.755, 5.968, 1.53], rot: [0, 0, 154.3], farbe: "petrol" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [0.000, 6.140, 1.53], rot: [0, 0, 180.0], farbe: "petrol" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [-0.755, 5.968, 1.53], rot: [0, 0, 205.7], farbe: "petrol" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [-1.360, 5.485, 1.53], rot: [0, 0, 231.4], farbe: "petrol" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [-1.696, 4.787, 1.53], rot: [0, 0, 257.1], farbe: "petrol" },
      { form: "box", groesse: [3.5, 0.45, 3.1], rund: 0.04, pos: [0, 0.22, 0], farbe: "stein" },
      { form: "zylinder", r: 0.42, h: 0.06, pos: [0, 4.75, 1.56], rot: [90, 0, 0], farbe: "fenster" },
      { form: "torus", R: 0.45, r: 0.05, pos: [0, 4.75, 1.58], farbe: "petrol" },
      { form: "box", groesse: [2.0, 1.2, 0.05], rund: 0.02, pos: [-0.35, 1.1, 1.51], farbe: "glas" },
      { form: "box", groesse: [2.3, 0.1, 0.55], rund: 0.03, pos: [-0.35, 1.9, 1.72], rot: [20, 0, 0], farbe: "petrol" },
      { form: "box", groesse: [0.6, 1.5, 0.08], rund: 0.03, pos: [1.15, 0.8, 1.52], farbe: "tuer", textur: "holz" },
      { form: "box", groesse: [0.55, 0.9, 0.05], rund: 0.02, pos: [-0.8, 2.95, 1.51], farbe: "fenster" },
      { form: "zylinder", r: 0.275, h: 0.05, pos: [-0.8, 3.4, 1.51], rot: [90, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [0.55, 0.9, 0.05], rund: 0.02, pos: [0.8, 2.95, 1.51], farbe: "fenster" },
      { form: "zylinder", r: 0.275, h: 0.05, pos: [0.8, 3.4, 1.51], rot: [90, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [2.4, 0.1, 0.4], rund: 0.03, pos: [0, 2.4, 1.7], farbe: "petrol" },
      { form: "box", groesse: [2.4, 0.32, 0.04], rund: 0.02, pos: [0, 2.6, 1.88], farbe: "petrol" },
      { form: "kugel", r: 0.13, pos: [-1.3, 3.95, 1.52], farbe: "koralle" },
      { form: "kugel", r: 0.13, pos: [1.3, 3.95, 1.52], farbe: "koralle" }
    ],
    kollision: { box: [3.5, 3.1] },
    schatten: 0
  },
  jugendstil_b: {
    teile: [
      { form: "box", groesse: [3.4, 4.4, 3], rund: 0.05, pos: [0, 2.2, 0], farbe: "putz_creme" },
      // runder Giebel: Halbkreis über dem Haus (vorne leicht zurückgesetzt), Zierbogen aus Stücken
      { form: "zylinder", r: 1.7, h: 2.94, pos: [0, 4.4, -0.03], rot: [90, 0, 0], farbe: "putz_creme" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [1.696, 4.787, 1.53], rot: [0, 0, 102.9], farbe: "weinrot" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [1.360, 5.485, 1.53], rot: [0, 0, 128.6], farbe: "weinrot" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [0.755, 5.968, 1.53], rot: [0, 0, 154.3], farbe: "weinrot" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [0.000, 6.140, 1.53], rot: [0, 0, 180.0], farbe: "weinrot" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [-0.755, 5.968, 1.53], rot: [0, 0, 205.7], farbe: "weinrot" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [-1.360, 5.485, 1.53], rot: [0, 0, 231.4], farbe: "weinrot" },
      { form: "box", groesse: [0.82, 0.12, 0.08], rund: 0.03, pos: [-1.696, 4.787, 1.53], rot: [0, 0, 257.1], farbe: "weinrot" },
      { form: "box", groesse: [3.5, 0.45, 3.1], rund: 0.04, pos: [0, 0.22, 0], farbe: "stein" },
      { form: "zylinder", r: 0.42, h: 0.06, pos: [0, 4.75, 1.56], rot: [90, 0, 0], farbe: "fenster" },
      { form: "torus", R: 0.45, r: 0.05, pos: [0, 4.75, 1.58], farbe: "weinrot" },
      { form: "box", groesse: [2.0, 1.2, 0.05], rund: 0.02, pos: [0.35, 1.1, 1.51], farbe: "glas" },
      { form: "box", groesse: [2.3, 0.1, 0.55], rund: 0.03, pos: [0.35, 1.9, 1.72], rot: [20, 0, 0], farbe: "weinrot" },
      { form: "box", groesse: [0.6, 1.5, 0.08], rund: 0.03, pos: [-1.15, 0.8, 1.52], farbe: "tuer", textur: "holz" },
      { form: "box", groesse: [0.55, 0.9, 0.05], rund: 0.02, pos: [-0.8, 2.95, 1.51], farbe: "fenster" },
      { form: "zylinder", r: 0.275, h: 0.05, pos: [-0.8, 3.4, 1.51], rot: [90, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [0.55, 0.9, 0.05], rund: 0.02, pos: [0.8, 2.95, 1.51], farbe: "fenster" },
      { form: "zylinder", r: 0.275, h: 0.05, pos: [0.8, 3.4, 1.51], rot: [90, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [2.4, 0.1, 0.4], rund: 0.03, pos: [0, 2.4, 1.7], farbe: "weinrot" },
      { form: "box", groesse: [2.4, 0.32, 0.04], rund: 0.02, pos: [0, 2.6, 1.88], farbe: "weinrot" },
      { form: "kugel", r: 0.13, pos: [-1.3, 3.95, 1.52], farbe: "senf" },
      { form: "kugel", r: 0.13, pos: [1.3, 3.95, 1.52], farbe: "senf" }
    ],
    kollision: { box: [3.5, 3.1] },
    schatten: 0
  },

  // Wand mit halb fertigem Comic (Brüssel ist eine Comic-Stadt)
  comicwand: {
    teile: [
      { form: "box", groesse: [3.2, 2.2, 0.3], rund: 0.04, pos: [0, 1.1, 0], farbe: "backstein" },
      { form: "box", groesse: [3.3, 0.12, 0.36], rund: 0.03, pos: [0, 2.24, 0], farbe: "stein_hell" },
      { form: "box", groesse: [0.9, 0.85, 0.03], rund: 0.02, pos: [-1.0, 1.6, 0.16], farbe: "himmelblau" },
      { form: "kugel", radien: [0.2, 0.2, 0.02], pos: [-1.05, 1.62, 0.18], farbe: "senf" },
      { form: "box", groesse: [0.9, 0.85, 0.03], rund: 0.02, pos: [0, 1.6, 0.16], farbe: "creme" },
      { form: "kugel", radien: [0.16, 0.16, 0.02], pos: [-0.15, 1.55, 0.18], farbe: "koralle" },
      { form: "kugel", radien: [0.16, 0.16, 0.02], pos: [0.18, 1.55, 0.18], farbe: "petrol" },
      { form: "box", groesse: [0.9, 0.85, 0.03], rund: 0.02, pos: [1.0, 1.6, 0.16], farbe: "mint" },
      { form: "box", groesse: [0.3, 0.3, 0.02], rund: 0.08, pos: [1.1, 1.75, 0.18], farbe: "creme" },
      { form: "box", groesse: [0.9, 0.85, 0.03], rund: 0.02, pos: [-1.0, 0.62, 0.16], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.08, 0.02], rund: 0.02, pos: [-1.0, 0.62, 0.18], farbe: "weinrot" },
      { form: "box", groesse: [0.9, 0.85, 0.03], rund: 0.02, pos: [0, 0.62, 0.16], farbe: "lavendel" },
      { form: "box", groesse: [0.9, 0.85, 0.03], rund: 0.02, pos: [1.0, 0.62, 0.16], farbe: "creme" },
      { form: "zylinder", r: 0.1, h: 0.16, pos: [0.9, 0.08, 0.5], farbe: "koralle" },
      { form: "zylinder", r: 0.09, h: 0.14, pos: [1.15, 0.07, 0.42], farbe: "himmelblau" },
      { form: "zylinder", r: 0.02, h: 0.3, pos: [0.92, 0.2, 0.5], rot: [0, 0, 20], farbe: "holz" }
    ],
    kollision: { box: [3.3, 0.4] },
    schatten: 0,
    hoehe: 2.5
  },

  // Hohes Archivregal mit Aktenordnern
  // Hohes Archivregal mit Aktenordnern
  archivregal: {
    teile: [
      { form: "box", groesse: [2, 2.2, 0.55], rund: 0.03, pos: [0, 1.1, 0], farbe: "holz_dunkel", textur: "holz" },
      { form: "box", groesse: [1.9, 0.05, 0.5], rund: 0.01, pos: [0, 0.55, 0.04], farbe: "holz" },
      { form: "box", groesse: [1.9, 0.05, 0.5], rund: 0.01, pos: [0, 1.1, 0.04], farbe: "holz" },
      { form: "box", groesse: [1.9, 0.05, 0.5], rund: 0.01, pos: [0, 1.65, 0.04], farbe: "holz" },
      { form: "box", groesse: [0.55, 0.42, 0.4], rund: 0.02, pos: [-0.6, 0.79, 0.1], farbe: "kork" },
      { form: "box", groesse: [0.5, 0.4, 0.4], rund: 0.02, pos: [0.05, 0.78, 0.1], farbe: "grau_hell" },
      { form: "box", groesse: [0.5, 0.42, 0.4], rund: 0.02, pos: [0.62, 0.79, 0.1], farbe: "oliv" },
      { form: "box", groesse: [0.6, 0.42, 0.4], rund: 0.02, pos: [-0.55, 1.34, 0.1], farbe: "grau_hell" },
      { form: "box", groesse: [0.45, 0.4, 0.4], rund: 0.02, pos: [0.1, 1.33, 0.1], farbe: "weinrot" },
      { form: "box", groesse: [0.5, 0.42, 0.4], rund: 0.02, pos: [0.62, 1.34, 0.1], farbe: "kork" },
      { form: "box", groesse: [0.5, 0.4, 0.4], rund: 0.02, pos: [-0.6, 1.88, 0.1], farbe: "petrol" },
      { form: "box", groesse: [0.6, 0.42, 0.4], rund: 0.02, pos: [0.05, 1.89, 0.1], farbe: "kork" },
      { form: "box", groesse: [0.45, 0.4, 0.4], rund: 0.02, pos: [0.65, 1.88, 0.1], farbe: "grau_hell" },
      { form: "box", groesse: [0.6, 0.4, 0.4], rund: 0.02, pos: [-0.5, 0.27, 0.1], farbe: "kork" },
      { form: "box", groesse: [0.6, 0.4, 0.4], rund: 0.02, pos: [0.4, 0.27, 0.1], farbe: "grau_hell" }
    ],
    kollision: { box: [2, 0.6] },
    schatten: 0
  },

  // Aktenfach (zum Untersuchen): Regal mit großem farbigem Schild und herausgezogener Box
  aktenfach_a: {
    teile: [
      { form: "box", groesse: [1.7, 1.8, 0.55], rund: 0.03, pos: [0, 0.9, 0], farbe: "holz_dunkel", textur: "holz" },
      { form: "box", groesse: [1.6, 0.05, 0.5], rund: 0.01, pos: [0, 0.62, 0.04], farbe: "holz" },
      { form: "box", groesse: [1.6, 0.05, 0.5], rund: 0.01, pos: [0, 1.22, 0.04], farbe: "holz" },
      { form: "box", groesse: [1.4, 0.48, 0.4], rund: 0.02, pos: [0, 0.9, 0.1], farbe: "kork" },
      { form: "box", groesse: [1.4, 0.48, 0.4], rund: 0.02, pos: [0, 0.32, 0.1], farbe: "grau_hell" },
      { form: "box", groesse: [0.6, 0.4, 0.5], rund: 0.02, pos: [0.2, 1.48, 0.3], farbe: "himmelblau" },
      { form: "box", groesse: [0.5, 0.36, 0.4], rund: 0.02, pos: [-0.4, 1.46, 0.1], farbe: "kork" },
      { form: "box", groesse: [1.0, 0.34, 0.05], rund: 0.03, pos: [0, 1.98, 0.22], farbe: "himmelblau" },
      { form: "box", groesse: [0.3, 0.2, 0.02], rund: 0.03, pos: [0, 1.98, 0.25], farbe: "creme" }
    ],
    kollision: { box: [1.7, 0.6] },
    schatten: 0,
    hoehe: 2.5
  },
  aktenfach_b: {
    teile: [
      { form: "box", groesse: [1.7, 1.8, 0.55], rund: 0.03, pos: [0, 0.9, 0], farbe: "holz_dunkel", textur: "holz" },
      { form: "box", groesse: [1.6, 0.05, 0.5], rund: 0.01, pos: [0, 0.62, 0.04], farbe: "holz" },
      { form: "box", groesse: [1.6, 0.05, 0.5], rund: 0.01, pos: [0, 1.22, 0.04], farbe: "holz" },
      { form: "box", groesse: [1.4, 0.48, 0.4], rund: 0.02, pos: [0, 0.9, 0.1], farbe: "kork" },
      { form: "box", groesse: [1.4, 0.48, 0.4], rund: 0.02, pos: [0, 0.32, 0.1], farbe: "grau_hell" },
      { form: "box", groesse: [0.6, 0.4, 0.5], rund: 0.02, pos: [0.2, 1.48, 0.3], farbe: "mint" },
      { form: "box", groesse: [0.5, 0.36, 0.4], rund: 0.02, pos: [-0.4, 1.46, 0.1], farbe: "kork" },
      { form: "box", groesse: [1.0, 0.34, 0.05], rund: 0.03, pos: [0, 1.98, 0.22], farbe: "mint" },
      { form: "box", groesse: [0.26, 0.2, 0.02], rund: 0.03, pos: [-0.17, 1.98, 0.25], farbe: "creme" },
      { form: "box", groesse: [0.26, 0.2, 0.02], rund: 0.03, pos: [0.17, 1.98, 0.25], farbe: "creme" }
    ],
    kollision: { box: [1.7, 0.6] },
    schatten: 0,
    hoehe: 2.5
  },
  aktenfach_c: {
    teile: [
      { form: "box", groesse: [1.7, 1.8, 0.55], rund: 0.03, pos: [0, 0.9, 0], farbe: "holz_dunkel", textur: "holz" },
      { form: "box", groesse: [1.6, 0.05, 0.5], rund: 0.01, pos: [0, 0.62, 0.04], farbe: "holz" },
      { form: "box", groesse: [1.6, 0.05, 0.5], rund: 0.01, pos: [0, 1.22, 0.04], farbe: "holz" },
      { form: "box", groesse: [1.4, 0.48, 0.4], rund: 0.02, pos: [0, 0.9, 0.1], farbe: "grau_hell" },
      { form: "box", groesse: [1.4, 0.48, 0.4], rund: 0.02, pos: [0, 0.32, 0.1], farbe: "grau_hell" },
      { form: "box", groesse: [0.6, 0.4, 0.5], rund: 0.02, pos: [0.2, 1.48, 0.3], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.36, 0.4], rund: 0.02, pos: [-0.4, 1.46, 0.1], farbe: "kork" },
      { form: "box", groesse: [1.0, 0.34, 0.05], rund: 0.03, pos: [0, 1.98, 0.22], farbe: "senf" },
      { form: "kugel", radien: [0.08, 0.08, 0.02], pos: [0, 1.98, 0.25], farbe: "tusche" }
    ],
    kollision: { box: [1.7, 0.6] },
    schatten: 0,
    hoehe: 2.5
  },

  // Aktenstapel auf dem Boden
  aktenstapel: {
    teile: [
      { form: "box", groesse: [0.5, 0.3, 0.38], rund: 0.02, pos: [0, 0.15, 0], farbe: "kork" },
      { form: "box", groesse: [0.48, 0.28, 0.36], rund: 0.02, pos: [0.03, 0.44, -0.02], rot: [0, 12, 0], farbe: "grau_hell" },
      { form: "box", groesse: [0.44, 0.26, 0.34], rund: 0.02, pos: [-0.02, 0.71, 0.01], rot: [0, -8, 0], farbe: "kork" }
    ],
    kollision: { kreis: 0.3 },
    schatten: 0.3
  },

  // Leiter, an ein Regal gelehnt
  leiter: {
    teile: [
      { form: "zylinder", r: 0.03, h: 2.4, pos: [-0.22, 1.2, 0.25], rot: [-12, 0, 0], farbe: "holz" },
      { form: "zylinder", r: 0.03, h: 2.4, pos: [0.22, 1.2, 0.25], rot: [-12, 0, 0], farbe: "holz" },
      { form: "box", groesse: [0.44, 0.04, 0.05], rund: 0.01, pos: [0, 0.3, 0.44], farbe: "holz" },
      { form: "box", groesse: [0.44, 0.04, 0.05], rund: 0.01, pos: [0, 0.7, 0.36], farbe: "holz" },
      { form: "box", groesse: [0.44, 0.04, 0.05], rund: 0.01, pos: [0, 1.1, 0.27], farbe: "holz" },
      { form: "box", groesse: [0.44, 0.04, 0.05], rund: 0.01, pos: [0, 1.5, 0.19], farbe: "holz" },
      { form: "box", groesse: [0.44, 0.04, 0.05], rund: 0.01, pos: [0, 1.9, 0.1], farbe: "holz" }
    ],
    kollision: { box: [0.6, 0.5] },
    schatten: 0
  },

  // Tisch der Abgeordneten im Sitzungssaal
  abgeordnetenpult: {
    teile: [
      { form: "box", groesse: [2.0, 0.62, 0.6], rund: 0.04, pos: [0, 0.31, 0], farbe: "holz_dunkel", textur: "holz" },
      { form: "box", groesse: [2.1, 0.06, 0.72], rund: 0.02, pos: [0, 0.65, -0.02], farbe: "holz" },
      { form: "box", groesse: [2.0, 0.1, 0.02], rund: 0.01, pos: [0, 0.45, 0.31], farbe: "petrol" },
      { form: "box", groesse: [0.5, 0.14, 0.05], rund: 0.02, pos: [0, 0.75, 0.25], rot: [-20, 0, 0], farbe: "creme" },
      { form: "zylinder", r: 0.015, h: 0.3, pos: [0.45, 0.82, 0.05], rot: [20, 0, 0], farbe: "anthrazit" },
      { form: "kugel", r: 0.04, pos: [0.45, 0.97, 0.1], farbe: "anthrazit" },
      { form: "box", groesse: [0.35, 0.02, 0.25], rund: 0.005, pos: [-0.4, 0.69, -0.05], rot: [0, 10, 0], farbe: "weiss" }
    ],
    kollision: { box: [2.0, 0.65] },
    schatten: 0.4
  },

  // Rednerpult (Kim stellt sich davor)
  rednerpult: {
    teile: [
      { form: "box", groesse: [0.8, 1.0, 0.5], rund: 0.04, pos: [0, 0.5, 0], farbe: "holz", textur: "holz" },
      { form: "box", groesse: [0.9, 0.06, 0.6], rund: 0.02, pos: [0, 1.06, 0.02], rot: [-15, 0, 0], farbe: "holz_dunkel" },
      { form: "torus", R: 0.14, r: 0.025, pos: [0, 0.62, 0.26], farbe: "senf" },
      { form: "zylinder", r: 0.015, h: 0.35, pos: [0, 1.2, -0.2], rot: [-25, 0, 0], farbe: "anthrazit" },
      { form: "kugel", r: 0.045, pos: [0, 1.36, -0.13], farbe: "anthrazit" }
    ],
    kollision: { box: [0.8, 0.5] },
    schatten: 0.3,
    hoehe: 1.7
  },

  // Wandbehang im Sitzungssaal (stilisiert, keine echte Flagge)
  saalbanner: {
    teile: [
      { form: "box", groesse: [2.4, 1.7, 0.05], rund: 0.03, pos: [0, 1.95, 0], farbe: "petrol" },
      { form: "box", groesse: [2.6, 0.08, 0.08], rund: 0.02, pos: [0, 2.85, 0], farbe: "holz_dunkel" },
      { form: "torus", R: 0.5, r: 0.05, pos: [0, 1.95, 0.04], farbe: "senf" },
      { form: "kugel", radien: [0.12, 0.12, 0.02], pos: [0, 1.95, 0.04], farbe: "senf" }
    ],
    schatten: 0
  },

  // ---------------- Flaggen und landestypische Wahrzeichen ----------------
  // Fahnenmast mit der Flagge: Deutschland
  flagge_de: {
    teile: [
      { form: "zylinder", r: 0.05, h: 3.4, pos: [0, 1.7, 0], farbe: "metall" },
      { form: "kugel", r: 0.08, pos: [0, 3.45, 0], farbe: "senf" },
      { form: "zylinder", r: 0.2, h: 0.12, pos: [0, 0.06, 0], farbe: "stein_hell" },
      { form: "box", groesse: [1.3, 0.283, 0.03], rund: 0.005, pos: [0.73, 3.133, 0], farbe: "flagge_schwarz", wind: 1.4 },
      { form: "box", groesse: [1.3, 0.283, 0.03], rund: 0.005, pos: [0.73, 2.85, 0], farbe: "flagge_rot", wind: 1.4 },
      { form: "box", groesse: [1.3, 0.283, 0.03], rund: 0.005, pos: [0.73, 2.567, 0], farbe: "flagge_gold", wind: 1.4 }
    ],
    kollision: { kreis: 0.2 },
    schatten: 0.2
  },

  // Fahnenmast mit der Flagge: Estland
  flagge_ee: {
    teile: [
      { form: "zylinder", r: 0.05, h: 3.4, pos: [0, 1.7, 0], farbe: "metall" },
      { form: "kugel", r: 0.08, pos: [0, 3.45, 0], farbe: "senf" },
      { form: "zylinder", r: 0.2, h: 0.12, pos: [0, 0.06, 0], farbe: "stein_hell" },
      { form: "box", groesse: [1.3, 0.283, 0.03], rund: 0.005, pos: [0.73, 3.133, 0], farbe: "ee_blau", wind: 1.4 },
      { form: "box", groesse: [1.3, 0.283, 0.03], rund: 0.005, pos: [0.73, 2.85, 0], farbe: "flagge_schwarz", wind: 1.4 },
      { form: "box", groesse: [1.3, 0.283, 0.03], rund: 0.005, pos: [0.73, 2.567, 0], farbe: "weiss", wind: 1.4 }
    ],
    kollision: { kreis: 0.2 },
    schatten: 0.2
  },

  // Fahnenmast mit der Flagge: Luxemburg
  flagge_lu: {
    teile: [
      { form: "zylinder", r: 0.05, h: 3.4, pos: [0, 1.7, 0], farbe: "metall" },
      { form: "kugel", r: 0.08, pos: [0, 3.45, 0], farbe: "senf" },
      { form: "zylinder", r: 0.2, h: 0.12, pos: [0, 0.06, 0], farbe: "stein_hell" },
      { form: "box", groesse: [1.3, 0.283, 0.03], rund: 0.005, pos: [0.73, 3.133, 0], farbe: "lu_rot", wind: 1.4 },
      { form: "box", groesse: [1.3, 0.283, 0.03], rund: 0.005, pos: [0.73, 2.85, 0], farbe: "weiss", wind: 1.4 },
      { form: "box", groesse: [1.3, 0.283, 0.03], rund: 0.005, pos: [0.73, 2.567, 0], farbe: "lu_blau", wind: 1.4 }
    ],
    kollision: { kreis: 0.2 },
    schatten: 0.2
  },

  // Fahnenmast mit der Flagge: Belgien
  flagge_be: {
    teile: [
      { form: "zylinder", r: 0.05, h: 3.4, pos: [0, 1.7, 0], farbe: "metall" },
      { form: "kugel", r: 0.08, pos: [0, 3.45, 0], farbe: "senf" },
      { form: "zylinder", r: 0.2, h: 0.12, pos: [0, 0.06, 0], farbe: "stein_hell" },
      { form: "box", groesse: [0.433, 0.85, 0.03], rund: 0.005, pos: [0.297, 2.85, 0], farbe: "flagge_schwarz", wind: 1.4 },
      { form: "box", groesse: [0.433, 0.85, 0.03], rund: 0.005, pos: [0.73, 2.85, 0], farbe: "be_gelb", wind: 1.4 },
      { form: "box", groesse: [0.433, 0.85, 0.03], rund: 0.005, pos: [1.163, 2.85, 0], farbe: "be_rot", wind: 1.4 }
    ],
    kollision: { kreis: 0.2 },
    schatten: 0.2
  },

  // Fahnenmast mit der Flagge: Schweden
  flagge_se: {
    teile: [
      { form: "zylinder", r: 0.05, h: 3.4, pos: [0, 1.7, 0], farbe: "metall" },
      { form: "kugel", r: 0.08, pos: [0, 3.45, 0], farbe: "senf" },
      { form: "zylinder", r: 0.2, h: 0.12, pos: [0, 0.06, 0], farbe: "stein_hell" },
      { form: "box", groesse: [1.3, 0.85, 0.03], rund: 0.005, pos: [0.73, 2.85, 0], farbe: "se_blau", wind: 1.4 },
      { form: "box", groesse: [0.16, 0.85, 0.035], rund: 0.004, pos: [0.548, 2.85, 0], farbe: "se_gelb", wind: 1.4 },
      { form: "box", groesse: [1.3, 0.16, 0.035], rund: 0.004, pos: [0.73, 2.85, 0], farbe: "se_gelb", wind: 1.4 }
    ],
    kollision: { kreis: 0.2 },
    schatten: 0.2
  },

  // Fahnenmast mit der Flagge: Europäische Union
  flagge_eu: {
    teile: [
      { form: "zylinder", r: 0.05, h: 3.4, pos: [0, 1.7, 0], farbe: "metall" },
      { form: "kugel", r: 0.08, pos: [0, 3.45, 0], farbe: "senf" },
      { form: "zylinder", r: 0.2, h: 0.12, pos: [0, 0.06, 0], farbe: "stein_hell" },
      { form: "box", groesse: [1.3, 0.85, 0.03], rund: 0.005, pos: [0.73, 2.85, 0], farbe: "eu_blau", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [1, 2.85, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.964, 2.985, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.865, 3.084, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.73, 3.12, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.595, 3.084, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.496, 2.985, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.46, 2.85, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.496, 2.715, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.595, 2.616, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.73, 2.58, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.865, 2.616, 0.02], farbe: "eu_gelb", wind: 1.4 },
      { form: "kugel", radien: [0.045, 0.045, 0.02], pos: [0.964, 2.715, 0.02], farbe: "eu_gelb", wind: 1.4 }
    ],
    kollision: { kreis: 0.2 },
    schatten: 0.2
  },

  // Schweden: großes, bemaltes Holzpferd (Dalapferd)
  dalapferd: {
    teile: [
      { form: "box", groesse: [1.2, 0.5, 0.4], rund: 0.06, pos: [0, 0.28, 0], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.9, 0.55, 0.34], rund: 0.14, pos: [0, 1, 0], farbe: "schwedenrot" },
      { form: "box", groesse: [0.18, 0.55, 0.3], rund: 0.06, pos: [-0.32, 0.62, 0], farbe: "schwedenrot" },
      { form: "box", groesse: [0.18, 0.55, 0.3], rund: 0.06, pos: [0.32, 0.62, 0], farbe: "schwedenrot" },
      { form: "box", groesse: [0.28, 0.7, 0.26], rund: 0.1, pos: [0.42, 1.45, 0], rot: [0, 0, -25], farbe: "schwedenrot" },
      { form: "box", groesse: [0.42, 0.26, 0.24], rund: 0.1, pos: [0.62, 1.78, 0], rot: [0, 0, -10], farbe: "schwedenrot" },
      { form: "box", groesse: [0.08, 0.2, 0.1], rund: 0.03, pos: [0.5, 1.98, 0.06], farbe: "schwedenrot" },
      { form: "box", groesse: [0.08, 0.2, 0.1], rund: 0.03, pos: [0.5, 1.98, -0.06], farbe: "schwedenrot" },
      { form: "box", groesse: [0.12, 0.5, 0.2], rund: 0.05, pos: [-0.48, 1.05, 0], rot: [0, 0, 30], farbe: "schwedenrot" },
      { form: "box", groesse: [0.4, 0.3, 0.36], rund: 0.1, pos: [0, 1.2, 0], farbe: "se_blau" },
      { form: "box", groesse: [0.5, 0.08, 0.36], rund: 0.03, pos: [0, 1.02, 0], farbe: "se_gelb" },
      { form: "kugel", radien: [0.07, 0.07, 0.02], pos: [0.28, 1, 0.175], farbe: "se_gelb" },
      { form: "kugel", radien: [0.07, 0.07, 0.02], pos: [-0.28, 1, 0.175], farbe: "se_gelb" },
      { form: "kugel", radien: [0.07, 0.07, 0.02], pos: [0.28, 1, -0.175], farbe: "se_gelb" },
      { form: "kugel", radien: [0.07, 0.07, 0.02], pos: [-0.28, 1, -0.175], farbe: "se_gelb" },
      { form: "kugel", radien: [0.04, 0.04, 0.015], pos: [0.66, 1.82, 0.125], farbe: "weiss" },
      { form: "kugel", radien: [0.04, 0.04, 0.015], pos: [0.66, 1.82, -0.125], farbe: "weiss" }
    ],
    kollision: { box: [1.3, 0.6] },
    schatten: 0.5,
    hoehe: 2.3
  },

  // Schweden: geschmückte Mittsommerstange
  mittsommerstange: {
    teile: [
      { form: "zylinder", r: 0.08, h: 4.2, pos: [0, 2.1, 0], farbe: "holz" },
      { form: "box", groesse: [2, 0.12, 0.12], rund: 0.03, pos: [0, 3.3, 0], farbe: "holz" },
      { form: "torus", R: 0.45, r: 0.08, pos: [-0.75, 2.8, 0], farbe: "laub" },
      { form: "torus", R: 0.45, r: 0.08, pos: [0.75, 2.8, 0], farbe: "laub" },
      { form: "zylinder", r: 0.1, h: 1, rOben: 0.12, pos: [0, 3.55, 0], farbe: "laub" },
      { form: "kugel", radien: [0.12, 0.1, 0.12], pos: [0.1, 0.9, 0], farbe: "bluete_gelb" },
      { form: "kugel", radien: [0.12, 0.1, 0.12], pos: [0.027, 1.35, 0.096], farbe: "bluete_lila" },
      { form: "kugel", radien: [0.12, 0.1, 0.12], pos: [-0.086, 1.8, 0.052], farbe: "bluete_weiss" },
      { form: "kugel", radien: [0.12, 0.1, 0.12], pos: [-0.073, 2.25, -0.069], farbe: "bluete_koralle" },
      { form: "kugel", radien: [0.12, 0.1, 0.12], pos: [0.047, 2.7, -0.088], farbe: "bluete_gelb" },
      { form: "kugel", radien: [0.12, 0.1, 0.12], pos: [0.098, 3.15, 0.022], farbe: "bluete_lila" },
      { form: "kugel", r: 0.07, pos: [-0.3, 2.8, 0.06], farbe: "bluete_weiss" },
      { form: "kugel", r: 0.07, pos: [-0.977, 3.188, 0.06], farbe: "bluete_gelb" },
      { form: "kugel", r: 0.07, pos: [-0.971, 2.408, 0.06], farbe: "bluete_koralle" },
      { form: "kugel", r: 0.07, pos: [1.2, 2.8, 0.06], farbe: "bluete_weiss" },
      { form: "kugel", r: 0.07, pos: [0.523, 3.188, 0.06], farbe: "bluete_gelb" },
      { form: "kugel", r: 0.07, pos: [0.529, 2.408, 0.06], farbe: "bluete_koralle" },
      { form: "box", groesse: [0.03, 0.9, 0.02], rund: 0.005, pos: [-0.4, 2.8, 0.05], farbe: "se_blau", wind: 1.5 },
      { form: "box", groesse: [0.03, 0.9, 0.02], rund: 0.005, pos: [0.4, 2.8, 0.05], farbe: "se_gelb", wind: 1.5 }
    ],
    kollision: { kreis: 0.3 },
    schatten: 0.4,
    hoehe: 4.3
  },

  // Schweden: rotes Ruderboot (liegt im Wasser)
  ruderboot: {
    teile: [
      { form: "box", groesse: [1.8, 0.3, 0.7], rund: 0.15, pos: [0, 0.05, 0], farbe: "schwedenrot", textur: "holz" },
      { form: "box", groesse: [1.6, 0.06, 0.55], rund: 0.02, pos: [0, 0.18, 0], farbe: "holz_hell" },
      { form: "box", groesse: [0.12, 0.06, 0.6], rund: 0.02, pos: [0.2, 0.2, 0], farbe: "holz" },
      { form: "zylinder", r: 0.03, h: 1.2, pos: [0.3, 0.25, 0.35], rot: [0, 0, 75], farbe: "holz" }
    ],
    schatten: 0
  },

  // Deutschland: Fachwerkhaus mit roten Ziegeln und Blumenkasten
  fachwerkhaus: {
    teile: [
      { form: "box", groesse: [4, 3.2, 3], rund: 0.04, pos: [0, 1.6, 0], farbe: "putz_creme" },
      { form: "box", groesse: [4.08, 0.3, 3.08], rund: 0.03, pos: [0, 0.15, 0], farbe: "stein" },
      { form: "box", groesse: [4.5, 0.16, 2.35], rund: 0.05, pos: [0, 3.95, 0.8], rot: [45, 0, 0], farbe: "dach_rot" },
      { form: "box", groesse: [4.5, 0.16, 2.35], rund: 0.05, pos: [0, 3.95, -0.8], rot: [-45, 0, 0], farbe: "dach_rot" },
      { form: "box", groesse: [3.9, 1.9, 1.9], rund: 0.03, pos: [0, 3.2, 0], rot: [45, 0, 0], farbe: "putz_creme" },
      { form: "box", groesse: [0.14, 3.1, 0.06], rund: 0.01, pos: [-1.95, 1.65, 1.52], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.14, 3.1, 0.06], rund: 0.01, pos: [-0.65, 1.65, 1.52], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.14, 3.1, 0.06], rund: 0.01, pos: [0.65, 1.65, 1.52], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.14, 3.1, 0.06], rund: 0.01, pos: [1.95, 1.65, 1.52], farbe: "holz_dunkel" },
      { form: "box", groesse: [4, 0.14, 0.06], rund: 0.01, pos: [0, 0.3, 1.52], farbe: "holz_dunkel" },
      { form: "box", groesse: [4, 0.14, 0.06], rund: 0.01, pos: [0, 1.6, 1.52], farbe: "holz_dunkel" },
      { form: "box", groesse: [4, 0.14, 0.06], rund: 0.01, pos: [0, 3.1, 1.52], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.12, 1.6, 0.05], rund: 0.01, pos: [-1.3, 0.95, 1.53], rot: [0, 0, 40], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.12, 1.6, 0.05], rund: 0.01, pos: [1.3, 0.95, 1.53], rot: [0, 0, -40], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.12, 1.6, 0.05], rund: 0.01, pos: [-1.3, 2.35, 1.53], rot: [0, 0, -40], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.12, 1.6, 0.05], rund: 0.01, pos: [1.3, 2.35, 1.53], rot: [0, 0, 40], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.6, 0.7, 0.05], rund: 0.02, pos: [0, 2.35, 1.52], farbe: "fenster" },
      { form: "box", groesse: [0.5, 0.6, 0.05], rund: 0.02, pos: [1.3, 2.35, 1.49], farbe: "fenster" },
      { form: "box", groesse: [0.8, 1.25, 0.08], rund: 0.03, pos: [0, 0.95, 1.54], farbe: "tuer", textur: "holz" },
      { form: "box", groesse: [0.5, 0.5, 0.05], rund: 0.02, pos: [-1.3, 0.95, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.5, 0.5, 0.05], rund: 0.02, pos: [1.3, 0.95, 1.51], farbe: "fenster" },
      { form: "box", groesse: [0.6, 0.12, 0.25], rund: 0.02, pos: [-1.3, 0.62, 1.6], farbe: "holz_dunkel" },
      { form: "kugel", radien: [0.1, 0.08, 0.08], pos: [-1.45, 0.72, 1.68], farbe: "bluete_koralle" },
      { form: "kugel", radien: [0.1, 0.08, 0.08], pos: [-1.15, 0.72, 1.68], farbe: "bluete_gelb" }
    ],
    kollision: { box: [4.1, 3.1] },
    schatten: 0
  },

  // Deutschland: Litfaßsäule mit Plakaten
  litfasssaeule: {
    teile: [
      { form: "zylinder", r: 0.45, h: 2.2, pos: [0, 1.1, 0], farbe: "putz_ocker" },
      { form: "zylinder", r: 0.5, h: 0.18, pos: [0, 2.3, 0], farbe: "metall_dunkel" },
      { form: "kegel", r: 0.5, h: 0.4, pos: [0, 2.58, 0], farbe: "metall_dunkel" },
      { form: "kugel", r: 0.08, pos: [0, 2.82, 0], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.52, h: 0.2, pos: [0, 0.1, 0], farbe: "metall_dunkel" },
      { form: "box", groesse: [0.5, 0.75, 0.03], rund: 0.02, pos: [-0.37, 1.35, 0.265], rot: [0, -54.431, 0], farbe: "himmelblau" },
      { form: "box", groesse: [0.34, 0.08, 0.02], rund: 0.01, pos: [-0.382, 1.5, 0.273], rot: [0, -54.431, 0], farbe: "tusche" },
      { form: "box", groesse: [0.5, 0.75, 0.03], rund: 0.02, pos: [0, 1.35, 0.455], rot: [0, 0, 0], farbe: "koralle" },
      { form: "box", groesse: [0.34, 0.08, 0.02], rund: 0.01, pos: [0, 1.5, 0.47], rot: [0, 0, 0], farbe: "tusche" },
      { form: "box", groesse: [0.5, 0.75, 0.03], rund: 0.02, pos: [0.37, 1.35, 0.265], rot: [0, 54.431, 0], farbe: "mint" },
      { form: "box", groesse: [0.34, 0.08, 0.02], rund: 0.01, pos: [0.382, 1.5, 0.273], rot: [0, 54.431, 0], farbe: "tusche" },
      { form: "box", groesse: [0.5, 0.75, 0.03], rund: 0.02, pos: [0.001, 1.35, -0.455], rot: [0, 179.909, 0], farbe: "senf" },
      { form: "box", groesse: [0.34, 0.08, 0.02], rund: 0.01, pos: [0.001, 1.5, -0.47], rot: [0, 179.909, 0], farbe: "tusche" }
    ],
    kollision: { kreis: 0.5 },
    schatten: 0.5
  },

  // Estland: runder Stadtturm mit roter Spitze (wie in Tallinns Altstadt)
  stadtturm: {
    teile: [
      { form: "zylinder", r: 1.1, h: 4.2, rOben: 1, pos: [0, 2.1, 0], farbe: "stein_hell" },
      { form: "zylinder", r: 1.15, h: 0.3, pos: [0, 4.35, 0], farbe: "stein" },
      { form: "kegel", r: 1.3, h: 2.3, pos: [0, 5.65, 0], farbe: "dach_rot" },
      { form: "kugel", r: 0.1, pos: [0, 6.85, 0], farbe: "senf" },
      { form: "box", groesse: [0.22, 0.28, 0.2], rund: 0.02, pos: [0, 4.55, 1.08], rot: [0, 0, 0], farbe: "stein" },
      { form: "box", groesse: [0.22, 0.28, 0.2], rund: 0.02, pos: [0.764, 4.55, 0.764], rot: [0, 45, 0], farbe: "stein" },
      { form: "box", groesse: [0.22, 0.28, 0.2], rund: 0.02, pos: [1.08, 4.55, 0], rot: [0, 90, 0], farbe: "stein" },
      { form: "box", groesse: [0.22, 0.28, 0.2], rund: 0.02, pos: [0.764, 4.55, -0.764], rot: [0, 135, 0], farbe: "stein" },
      { form: "box", groesse: [0.22, 0.28, 0.2], rund: 0.02, pos: [0, 4.55, -1.08], rot: [0, 180, 0], farbe: "stein" },
      { form: "box", groesse: [0.22, 0.28, 0.2], rund: 0.02, pos: [-0.764, 4.55, -0.764], rot: [0, 225, 0], farbe: "stein" },
      { form: "box", groesse: [0.22, 0.28, 0.2], rund: 0.02, pos: [-1.08, 4.55, 0], rot: [0, 270, 0], farbe: "stein" },
      { form: "box", groesse: [0.22, 0.28, 0.2], rund: 0.02, pos: [-0.764, 4.55, 0.764], rot: [0, 315, 0], farbe: "stein" },
      { form: "box", groesse: [0.3, 0.55, 0.05], rund: 0.02, pos: [0, 1.4, 1.06], rot: [0, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [0.3, 0.55, 0.05], rund: 0.02, pos: [0, 3, 1.06], rot: [0, 0, 0], farbe: "fenster" },
      { form: "box", groesse: [0.3, 0.55, 0.05], rund: 0.02, pos: [0.76, 2.2, 0.739], rot: [0, 45.837, 0], farbe: "fenster" },
      { form: "box", groesse: [0.3, 0.55, 0.05], rund: 0.02, pos: [-0.76, 2.2, 0.739], rot: [0, -45.837, 0], farbe: "fenster" },
      { form: "box", groesse: [0.7, 1.2, 0.1], rund: 0.05, pos: [0, 0.6, 1.08], farbe: "tuer", textur: "holz" }
    ],
    kollision: { kreis: 1.15 },
    schatten: 0
  },

  // Estland: kleine hölzerne Windmühle (wie auf den Inseln)
  windmuehle: {
    teile: [
      { form: "zylinder", r: 0.75, h: 2.6, rOben: 0.6, pos: [0, 1.3, 0], farbe: "holz" },
      { form: "kegel", r: 0.8, h: 1, pos: [0, 3.1, 0], farbe: "dach_dunkel" },
      { form: "box", groesse: [0.5, 0.9, 0.06], rund: 0.03, pos: [0, 0.45, 0.72], farbe: "tuer" },
      { form: "kugel", r: 0.15, pos: [0, 2.6, 0.72], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.18, 1.6, 0.04], rund: 0.02, pos: [0.291, 3.399, 0.8], rot: [0, 0, -20], farbe: "creme" },
      { form: "box", groesse: [0.04, 1.7, 0.05], rund: 0.01, pos: [0.291, 3.399, 0.78], rot: [0, 0, -20], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.18, 1.6, 0.04], rund: 0.02, pos: [0.799, 2.309, 0.8], rot: [0, 0, -110], farbe: "creme" },
      { form: "box", groesse: [0.04, 1.7, 0.05], rund: 0.01, pos: [0.799, 2.309, 0.78], rot: [0, 0, -110], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.18, 1.6, 0.04], rund: 0.02, pos: [-0.291, 1.801, 0.8], rot: [0, 0, -200], farbe: "creme" },
      { form: "box", groesse: [0.04, 1.7, 0.05], rund: 0.01, pos: [-0.291, 1.801, 0.78], rot: [0, 0, -200], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.18, 1.6, 0.04], rund: 0.02, pos: [-0.799, 2.891, 0.8], rot: [0, 0, -290], farbe: "creme" },
      { form: "box", groesse: [0.04, 1.7, 0.05], rund: 0.01, pos: [-0.799, 2.891, 0.78], rot: [0, 0, -290], farbe: "holz_dunkel" }
    ],
    kollision: { kreis: 0.8 },
    schatten: 0
  },

  // Luxemburg: Stück Festungsmauer mit Bögen und Turm
  festung: {
    teile: [
      { form: "box", groesse: [6, 2.2, 1], rund: 0.04, pos: [0, 1.1, 0], farbe: "sandstein" },
      { form: "box", groesse: [6.1, 0.2, 1.1], rund: 0.03, pos: [0, 2.25, 0], farbe: "stein" },
      { form: "box", groesse: [0.5, 0.4, 1], rund: 0.03, pos: [-2.7, 2.55, 0], farbe: "sandstein" },
      { form: "box", groesse: [0.5, 0.4, 1], rund: 0.03, pos: [-1.8, 2.55, 0], farbe: "sandstein" },
      { form: "box", groesse: [0.5, 0.4, 1], rund: 0.03, pos: [-0.9, 2.55, 0], farbe: "sandstein" },
      { form: "box", groesse: [0.5, 0.4, 1], rund: 0.03, pos: [0, 2.55, 0], farbe: "sandstein" },
      { form: "box", groesse: [0.5, 0.4, 1], rund: 0.03, pos: [0.9, 2.55, 0], farbe: "sandstein" },
      { form: "box", groesse: [0.5, 0.4, 1], rund: 0.03, pos: [1.8, 2.55, 0], farbe: "sandstein" },
      { form: "box", groesse: [0.5, 0.4, 1], rund: 0.03, pos: [2.7, 2.55, 0], farbe: "sandstein" },
      { form: "box", groesse: [0.9, 1.1, 0.06], rund: 0.02, pos: [-1.5, 0.55, 0.51], farbe: "schiefer" },
      { form: "zylinder", r: 0.45, h: 0.06, pos: [-1.5, 1.1, 0.51], rot: [90, 0, 0], farbe: "schiefer" },
      { form: "box", groesse: [0.9, 1.1, 0.06], rund: 0.02, pos: [0, 0.55, 0.51], farbe: "schiefer" },
      { form: "zylinder", r: 0.45, h: 0.06, pos: [0, 1.1, 0.51], rot: [90, 0, 0], farbe: "schiefer" },
      { form: "box", groesse: [0.9, 1.1, 0.06], rund: 0.02, pos: [1.5, 0.55, 0.51], farbe: "schiefer" },
      { form: "zylinder", r: 0.45, h: 0.06, pos: [1.5, 1.1, 0.51], rot: [90, 0, 0], farbe: "schiefer" },
      { form: "zylinder", r: 1, h: 3.6, pos: [3.4, 1.8, 0], farbe: "sandstein" },
      { form: "zylinder", r: 1.08, h: 0.25, pos: [3.4, 3.7, 0], farbe: "stein" },
      { form: "kegel", r: 1.15, h: 1.6, pos: [3.4, 4.6, 0], farbe: "schiefer" },
      { form: "box", groesse: [0.3, 0.5, 0.05], rund: 0.02, pos: [3.4, 2.5, 1], farbe: "fenster" }
    ],
    kollision: { boxen: [[0, 0, 6, 1.1], [3.4, 0, 2.1, 2.1]] },
    schatten: 0
  },

  // Luxemburg: Säule mit goldener Figur (Denkmal)
  goldsaeule: {
    teile: [
      { form: "box", groesse: [1.1, 0.5, 1.1], rund: 0.04, pos: [0, 0.25, 0], farbe: "stein" },
      { form: "zylinder", r: 0.3, h: 3.2, rOben: 0.25, pos: [0, 2.1, 0], farbe: "sandstein" },
      { form: "box", groesse: [0.7, 0.2, 0.7], rund: 0.03, pos: [0, 3.8, 0], farbe: "stein" },
      { form: "zylinder", r: 0.18, h: 0.7, rOben: 0.1, pos: [0, 4.25, 0], farbe: "senf" },
      { form: "kugel", r: 0.12, pos: [0, 4.72, 0], farbe: "senf" },
      { form: "box", groesse: [0.5, 0.08, 0.12], rund: 0.03, pos: [0.2, 4.7, 0], rot: [0, 0, 40], farbe: "senf" },
      { form: "kugel", radien: [0.12, 0.08, 0.05], pos: [0.4, 4.9, 0], farbe: "senf" }
    ],
    kollision: { kreis: 0.6 },
    schatten: 0.5
  },

  // Brüssel: kleine Skulptur aus neun Kugeln (Modell eines bekannten Wahrzeichens)
  atomskulptur: {
    teile: [
      { form: "box", groesse: [2.2, 0.3, 2.2], rund: 0.05, pos: [0, 0.15, 0], farbe: "stein_hell" },
      { form: "kugel", r: 0.28, pos: [0, 2.2, 0], farbe: "metall" },
      { form: "kugel", r: 0.28, pos: [-0.6, 1.6, -0.6], farbe: "metall" },
      { form: "kugel", r: 0.28, pos: [-0.6, 1.6, 0.6], farbe: "metall" },
      { form: "kugel", r: 0.28, pos: [-0.6, 2.8, -0.6], farbe: "metall" },
      { form: "kugel", r: 0.28, pos: [-0.6, 2.8, 0.6], farbe: "metall" },
      { form: "kugel", r: 0.28, pos: [0.6, 1.6, -0.6], farbe: "metall" },
      { form: "kugel", r: 0.28, pos: [0.6, 1.6, 0.6], farbe: "metall" },
      { form: "kugel", r: 0.28, pos: [0.6, 2.8, -0.6], farbe: "metall" },
      { form: "kugel", r: 0.28, pos: [0.6, 2.8, 0.6], farbe: "metall" },
      { form: "zylinder", r: 0.06, h: 1.039, pos: [-0.3, 1.9, -0.3], rot: [125.264, -135, 0], farbe: "metall" },
      { form: "zylinder", r: 0.06, h: 1.039, pos: [-0.3, 1.9, 0.3], rot: [125.264, -45, 0], farbe: "metall" },
      { form: "zylinder", r: 0.06, h: 1.039, pos: [-0.3, 2.5, -0.3], rot: [54.736, -135, 0], farbe: "metall" },
      { form: "zylinder", r: 0.06, h: 1.039, pos: [-0.3, 2.5, 0.3], rot: [54.736, -45, 0], farbe: "metall" },
      { form: "zylinder", r: 0.06, h: 1.039, pos: [0.3, 1.9, -0.3], rot: [125.264, 135, 0], farbe: "metall" },
      { form: "zylinder", r: 0.06, h: 1.039, pos: [0.3, 1.9, 0.3], rot: [125.264, 45, 0], farbe: "metall" },
      { form: "zylinder", r: 0.06, h: 1.039, pos: [0.3, 2.5, -0.3], rot: [54.736, 135, 0], farbe: "metall" },
      { form: "zylinder", r: 0.06, h: 1.039, pos: [0.3, 2.5, 0.3], rot: [54.736, 45, 0], farbe: "metall" },
      { form: "zylinder", r: 0.1, h: 1.6, pos: [0, 0.95, 0], farbe: "metall" }
    ],
    kollision: { kreis: 1.0 },
    schatten: 0.8,
    hoehe: 3.2
  },

  // Brüssel: Waffelstand mit Markise
  waffelstand: {
    teile: [
      { form: "box", groesse: [1.6, 1, 0.8], rund: 0.05, pos: [0, 0.5, 0], farbe: "creme" },
      { form: "box", groesse: [1.7, 0.08, 0.9], rund: 0.02, pos: [0, 1.04, 0], farbe: "holz" },
      { form: "zylinder", r: 0.04, h: 1.2, pos: [-0.75, 1.6, 0.35], farbe: "metall_dunkel" },
      { form: "zylinder", r: 0.04, h: 1.2, pos: [0.75, 1.6, 0.35], farbe: "metall_dunkel" },
      { form: "box", groesse: [1.9, 0.12, 1.1], rund: 0.04, pos: [0, 2.25, 0.1], rot: [-12, 0, 0], farbe: "koralle" },
      { form: "box", groesse: [1.9, 0.25, 0.04], rund: 0.02, pos: [0, 2.1, 0.66], farbe: "weiss" },
      { form: "box", groesse: [0.36, 0.05, 0.26], rund: 0.02, pos: [-0.35, 1.1, 0.1], farbe: "senf" },
      { form: "box", groesse: [0.36, 0.05, 0.26], rund: 0.02, pos: [0.1, 1.1, 0.1], farbe: "senf" },
      { form: "box", groesse: [0.3, 0.03, 0.2], rund: 0.01, pos: [-0.35, 1.14, 0.1], farbe: "holz" },
      { form: "box", groesse: [1.2, 0.35, 0.03], rund: 0.02, pos: [0, 0.6, 0.41], farbe: "senf" }
    ],
    kollision: { box: [1.7, 0.9] },
    schatten: 0.5
  },

  // Schild „hier geht es weiter“ am Rand einer Karte (zeigt nach rechts, drehbar)
  ausgangsschild: {
    teile: [
      { form: "zylinder", r: 0.06, h: 1.6, pos: [0, 0.8, 0], farbe: "holz_dunkel" },
      { form: "box", groesse: [1, 0.3, 0.06], rund: 0.03, pos: [0.3, 1.4, 0], farbe: "creme" },
      { form: "kegel", r: 0.18, h: 0.25, pos: [0.88, 1.4, 0], rot: [0, 0, -90], farbe: "creme" },
      { form: "box", groesse: [0.6, 0.05, 0.02], rund: 0.01, pos: [0.25, 1.4, 0.04], farbe: "tusche" }
    ],
    kollision: { kreis: 0.15 },
    schatten: 0.15,
    hoehe: 1.9
  },

  // Schweden: Familienamt – heller Holzbau mit Glasfront, Gründach und großem Familien-Schild
  familienamt: {
    teile: [
      { form: "box", groesse: [5, 2.9, 3], rund: 0.06, pos: [0, 1.45, 0], farbe: "holz_hell", textur: "holz" },
      { form: "box", groesse: [5.4, 0.22, 3.4], rund: 0.04, pos: [0, 3, 0.1], farbe: "weiss" },
      { form: "box", groesse: [5.2, 0.12, 3.1], rund: 0.04, pos: [0, 3.17, 0], farbe: "laub" },
      { form: "box", groesse: [5.06, 0.24, 3.06], rund: 0.03, pos: [0, 0.12, 0], farbe: "stein_hell" },
      { form: "box", groesse: [2.6, 1.8, 0.05], rund: 0.02, pos: [-1, 1.25, 1.51], farbe: "glas" },
      { form: "box", groesse: [2.7, 0.1, 0.08], rund: 0.02, pos: [-1, 2.2, 1.54], farbe: "weiss" },
      { form: "box", groesse: [0.08, 1.8, 0.06], rund: 0.01, pos: [-1, 1.25, 1.54], farbe: "weiss" },
      { form: "box", groesse: [1.1, 1.7, 0.08], rund: 0.03, pos: [1.35, 0.85, 1.52], farbe: "glas" },
      { form: "box", groesse: [0.05, 1.7, 0.02], rund: 0.005, pos: [1.35, 0.85, 1.57], farbe: "anthrazit" },
      { form: "box", groesse: [1.8, 0.12, 0.9], rund: 0.03, pos: [1.35, 1.95, 1.9], farbe: "se_blau" },
      { form: "zylinder", r: 0.04, h: 1.9, pos: [0.6, 0.95, 2.25], farbe: "metall" },
      { form: "zylinder", r: 0.04, h: 1.9, pos: [2.1, 0.95, 2.25], farbe: "metall" },
      { form: "box", groesse: [1.4, 0.12, 0.5], rund: 0.03, pos: [1.35, 0.06, 1.85], farbe: "stein_hell" },
      { form: "box", groesse: [2.4, 0.95, 0.1], rund: 0.08, pos: [-0.6, 2.75, 1.6], farbe: "weiss" },
      { form: "box", groesse: [2.44, 0.14, 0.11], rund: 0.03, pos: [-0.6, 2.28, 1.6], farbe: "se_blau" },
      { form: "kugel", r: 0.13, pos: [-1.25, 3, 1.67], farbe: "se_blau" },
      { form: "box", groesse: [0.26, 0.34, 0.05], rund: 0.1, pos: [-1.25, 2.66, 1.67], farbe: "se_blau" },
      { form: "kugel", r: 0.13, pos: [-0.8, 3, 1.67], farbe: "se_gelb" },
      { form: "box", groesse: [0.26, 0.34, 0.05], rund: 0.1, pos: [-0.8, 2.66, 1.67], farbe: "se_gelb" },
      { form: "kugel", r: 0.09, pos: [-0.43, 2.86, 1.67], farbe: "koralle" },
      { form: "box", groesse: [0.18, 0.24, 0.05], rund: 0.08, pos: [-0.43, 2.62, 1.67], farbe: "koralle" },
      { form: "torus", R: 0.18, r: 0.03, pos: [0.15, 2.78, 1.67], farbe: "koralle" },
      { form: "kugel", radien: [0.08, 0.08, 0.02], pos: [0.15, 2.78, 1.66], farbe: "koralle" }
    ],
    kollision: { box: [5.1, 3.1] },
    schatten: 0,
    tuer: [1.35, 1.5]
  },

  // Schweden: großes Hinweisschild am Weg zum Familienamt (Familien-Symbol)
  amtsschild: {
    teile: [
      { form: "zylinder", r: 0.06, h: 1.2, pos: [-0.45, 0.6, 0], farbe: "metall" },
      { form: "zylinder", r: 0.06, h: 1.2, pos: [0.45, 0.6, 0], farbe: "metall" },
      { form: "box", groesse: [1.5, 1.2, 0.1], rund: 0.08, pos: [0, 1.75, 0], farbe: "se_blau" },
      { form: "box", groesse: [1.3, 0.95, 0.04], rund: 0.06, pos: [0, 1.8, 0.06], farbe: "weiss" },
      { form: "kugel", r: 0.12, pos: [-0.35, 2.05, 0.1], farbe: "se_blau" },
      { form: "box", groesse: [0.24, 0.36, 0.05], rund: 0.1, pos: [-0.35, 1.72, 0.1], farbe: "se_blau" },
      { form: "kugel", r: 0.12, pos: [0.05, 2.05, 0.1], farbe: "se_gelb" },
      { form: "box", groesse: [0.24, 0.36, 0.05], rund: 0.1, pos: [0.05, 1.72, 0.1], farbe: "se_gelb" },
      { form: "kugel", r: 0.09, pos: [0.38, 1.9, 0.1], farbe: "koralle" },
      { form: "box", groesse: [0.18, 0.26, 0.05], rund: 0.08, pos: [0.38, 1.66, 0.1], farbe: "koralle" },
      { form: "box", groesse: [1.3, 0.1, 0.05], rund: 0.02, pos: [0, 1.42, 0.08], farbe: "se_gelb" }
    ],
    kollision: { box: [1.2, 0.3] },
    schatten: 0.3,
    hoehe: 2.6
  },

  // Schweden: abgestellte Kinderwagen vor dem Familienamt
  kinderwagen_parkplatz: {
    teile: [
      { form: "box", groesse: [1.6, 0.08, 0.7], rund: 0.02, pos: [0, 0.04, 0], farbe: "stein_hell" },
      { form: "zylinder", r: 0.03, h: 0.9, pos: [-0.7, 0.45, -0.3], farbe: "metall" },
      { form: "zylinder", r: 0.03, h: 0.9, pos: [0.7, 0.45, -0.3], farbe: "metall" },
      { form: "box", groesse: [1.5, 0.25, 0.03], rund: 0.02, pos: [0, 0.8, -0.3], farbe: "se_blau" },
      { form: "box", groesse: [0.5, 0.35, 0.55], rund: 0.12, pos: [-0.35, 0.45, 0], farbe: "petrol" },
      { form: "torus", R: 0.1, r: 0.025, pos: [-0.55, 0.15, 0.2], rot: [0, 90, 0], farbe: "anthrazit" },
      { form: "torus", R: 0.1, r: 0.025, pos: [-0.15, 0.15, 0.2], rot: [0, 90, 0], farbe: "anthrazit" },
      { form: "box", groesse: [0.5, 0.35, 0.55], rund: 0.12, pos: [0.4, 0.45, 0], farbe: "senf" },
      { form: "torus", R: 0.1, r: 0.025, pos: [0.2, 0.15, 0.2], rot: [0, 90, 0], farbe: "anthrazit" },
      { form: "torus", R: 0.1, r: 0.025, pos: [0.6, 0.15, 0.2], rot: [0, 90, 0], farbe: "anthrazit" }
    ],
    kollision: { box: [1.6, 0.7] },
    schatten: 0.5
  },

  // Wimpelketten zwischen zwei Masten (Länge 6), in Landesfarben
  wimpel_de: {
    teile: [
      { form: "zylinder", r: 0.05, h: 2.7, pos: [-3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "zylinder", r: 0.05, h: 2.7, pos: [3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-2.625, 2.502, 0], rot: [0, 0, -14.708], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.875, 2.333, 0], rot: [0, 0, -10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.125, 2.22, 0], rot: [0, 0, -6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-0.375, 2.164, 0], rot: [0, 0, -2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [0.375, 2.164, 0], rot: [0, 0, 2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.125, 2.22, 0], rot: [0, 0, 6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.875, 2.333, 0], rot: [0, 0, 10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [2.625, 2.502, 0], rot: [0, 0, 14.708], farbe: "tusche" },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2.5, 2.273, 0], rot: [180, 0, 0], farbe: "flagge_schwarz", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2, 2.16, 0], rot: [180, 0, 0], farbe: "flagge_rot", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1.5, 2.073, 0], rot: [180, 0, 0], farbe: "flagge_gold", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1, 2.01, 0], rot: [180, 0, 0], farbe: "flagge_schwarz", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-0.5, 1.973, 0], rot: [180, 0, 0], farbe: "flagge_rot", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0, 1.96, 0], rot: [180, 0, 0], farbe: "flagge_gold", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0.5, 1.973, 0], rot: [180, 0, 0], farbe: "flagge_schwarz", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1, 2.01, 0], rot: [180, 0, 0], farbe: "flagge_rot", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1.5, 2.073, 0], rot: [180, 0, 0], farbe: "flagge_gold", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2, 2.16, 0], rot: [180, 0, 0], farbe: "flagge_schwarz", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2.5, 2.273, 0], rot: [180, 0, 0], farbe: "flagge_rot", wind: 1.2 }
    ],
    kollision: { boxen: [[-3, 0, 0.3, 0.3], [3, 0, 0.3, 0.3]] },
    schatten: 0
  },

  wimpel_se: {
    teile: [
      { form: "zylinder", r: 0.05, h: 2.7, pos: [-3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "zylinder", r: 0.05, h: 2.7, pos: [3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-2.625, 2.502, 0], rot: [0, 0, -14.708], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.875, 2.333, 0], rot: [0, 0, -10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.125, 2.22, 0], rot: [0, 0, -6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-0.375, 2.164, 0], rot: [0, 0, -2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [0.375, 2.164, 0], rot: [0, 0, 2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.125, 2.22, 0], rot: [0, 0, 6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.875, 2.333, 0], rot: [0, 0, 10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [2.625, 2.502, 0], rot: [0, 0, 14.708], farbe: "tusche" },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2.5, 2.273, 0], rot: [180, 0, 0], farbe: "se_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2, 2.16, 0], rot: [180, 0, 0], farbe: "se_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1.5, 2.073, 0], rot: [180, 0, 0], farbe: "se_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1, 2.01, 0], rot: [180, 0, 0], farbe: "se_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-0.5, 1.973, 0], rot: [180, 0, 0], farbe: "se_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0, 1.96, 0], rot: [180, 0, 0], farbe: "se_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0.5, 1.973, 0], rot: [180, 0, 0], farbe: "se_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1, 2.01, 0], rot: [180, 0, 0], farbe: "se_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1.5, 2.073, 0], rot: [180, 0, 0], farbe: "se_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2, 2.16, 0], rot: [180, 0, 0], farbe: "se_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2.5, 2.273, 0], rot: [180, 0, 0], farbe: "se_blau", wind: 1.2 }
    ],
    kollision: { boxen: [[-3, 0, 0.3, 0.3], [3, 0, 0.3, 0.3]] },
    schatten: 0
  },

  wimpel_ee: {
    teile: [
      { form: "zylinder", r: 0.05, h: 2.7, pos: [-3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "zylinder", r: 0.05, h: 2.7, pos: [3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-2.625, 2.502, 0], rot: [0, 0, -14.708], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.875, 2.333, 0], rot: [0, 0, -10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.125, 2.22, 0], rot: [0, 0, -6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-0.375, 2.164, 0], rot: [0, 0, -2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [0.375, 2.164, 0], rot: [0, 0, 2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.125, 2.22, 0], rot: [0, 0, 6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.875, 2.333, 0], rot: [0, 0, 10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [2.625, 2.502, 0], rot: [0, 0, 14.708], farbe: "tusche" },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2.5, 2.273, 0], rot: [180, 0, 0], farbe: "ee_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2, 2.16, 0], rot: [180, 0, 0], farbe: "flagge_schwarz", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1.5, 2.073, 0], rot: [180, 0, 0], farbe: "weiss", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1, 2.01, 0], rot: [180, 0, 0], farbe: "ee_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-0.5, 1.973, 0], rot: [180, 0, 0], farbe: "flagge_schwarz", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0, 1.96, 0], rot: [180, 0, 0], farbe: "weiss", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0.5, 1.973, 0], rot: [180, 0, 0], farbe: "ee_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1, 2.01, 0], rot: [180, 0, 0], farbe: "flagge_schwarz", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1.5, 2.073, 0], rot: [180, 0, 0], farbe: "weiss", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2, 2.16, 0], rot: [180, 0, 0], farbe: "ee_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2.5, 2.273, 0], rot: [180, 0, 0], farbe: "flagge_schwarz", wind: 1.2 }
    ],
    kollision: { boxen: [[-3, 0, 0.3, 0.3], [3, 0, 0.3, 0.3]] },
    schatten: 0
  },

  wimpel_lu: {
    teile: [
      { form: "zylinder", r: 0.05, h: 2.7, pos: [-3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "zylinder", r: 0.05, h: 2.7, pos: [3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-2.625, 2.502, 0], rot: [0, 0, -14.708], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.875, 2.333, 0], rot: [0, 0, -10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.125, 2.22, 0], rot: [0, 0, -6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-0.375, 2.164, 0], rot: [0, 0, -2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [0.375, 2.164, 0], rot: [0, 0, 2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.125, 2.22, 0], rot: [0, 0, 6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.875, 2.333, 0], rot: [0, 0, 10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [2.625, 2.502, 0], rot: [0, 0, 14.708], farbe: "tusche" },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2.5, 2.273, 0], rot: [180, 0, 0], farbe: "lu_rot", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2, 2.16, 0], rot: [180, 0, 0], farbe: "weiss", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1.5, 2.073, 0], rot: [180, 0, 0], farbe: "lu_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1, 2.01, 0], rot: [180, 0, 0], farbe: "lu_rot", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-0.5, 1.973, 0], rot: [180, 0, 0], farbe: "weiss", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0, 1.96, 0], rot: [180, 0, 0], farbe: "lu_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0.5, 1.973, 0], rot: [180, 0, 0], farbe: "lu_rot", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1, 2.01, 0], rot: [180, 0, 0], farbe: "weiss", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1.5, 2.073, 0], rot: [180, 0, 0], farbe: "lu_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2, 2.16, 0], rot: [180, 0, 0], farbe: "lu_rot", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2.5, 2.273, 0], rot: [180, 0, 0], farbe: "weiss", wind: 1.2 }
    ],
    kollision: { boxen: [[-3, 0, 0.3, 0.3], [3, 0, 0.3, 0.3]] },
    schatten: 0
  },

  wimpel_eu: {
    teile: [
      { form: "zylinder", r: 0.05, h: 2.7, pos: [-3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "zylinder", r: 0.05, h: 2.7, pos: [3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-2.625, 2.502, 0], rot: [0, 0, -14.708], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.875, 2.333, 0], rot: [0, 0, -10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.125, 2.22, 0], rot: [0, 0, -6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-0.375, 2.164, 0], rot: [0, 0, -2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [0.375, 2.164, 0], rot: [0, 0, 2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.125, 2.22, 0], rot: [0, 0, 6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.875, 2.333, 0], rot: [0, 0, 10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [2.625, 2.502, 0], rot: [0, 0, 14.708], farbe: "tusche" },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2.5, 2.273, 0], rot: [180, 0, 0], farbe: "eu_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2, 2.16, 0], rot: [180, 0, 0], farbe: "eu_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1.5, 2.073, 0], rot: [180, 0, 0], farbe: "eu_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1, 2.01, 0], rot: [180, 0, 0], farbe: "eu_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-0.5, 1.973, 0], rot: [180, 0, 0], farbe: "eu_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0, 1.96, 0], rot: [180, 0, 0], farbe: "eu_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0.5, 1.973, 0], rot: [180, 0, 0], farbe: "eu_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1, 2.01, 0], rot: [180, 0, 0], farbe: "eu_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1.5, 2.073, 0], rot: [180, 0, 0], farbe: "eu_blau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2, 2.16, 0], rot: [180, 0, 0], farbe: "eu_gelb", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2.5, 2.273, 0], rot: [180, 0, 0], farbe: "eu_blau", wind: 1.2 }
    ],
    kollision: { boxen: [[-3, 0, 0.3, 0.3], [3, 0, 0.3, 0.3]] },
    schatten: 0
  },

  wimpel_bunt: {
    teile: [
      { form: "zylinder", r: 0.05, h: 2.7, pos: [-3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "zylinder", r: 0.05, h: 2.7, pos: [3, 1.35, 0], farbe: "holz_dunkel" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-2.625, 2.502, 0], rot: [0, 0, -14.708], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.875, 2.333, 0], rot: [0, 0, -10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-1.125, 2.22, 0], rot: [0, 0, -6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [-0.375, 2.164, 0], rot: [0, 0, -2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [0.375, 2.164, 0], rot: [0, 0, 2.148], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.125, 2.22, 0], rot: [0, 0, 6.419], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [1.875, 2.333, 0], rot: [0, 0, 10.62], farbe: "tusche" },
      { form: "box", groesse: [0.77, 0.025, 0.025], rund: 0.005, pos: [2.625, 2.502, 0], rot: [0, 0, 14.708], farbe: "tusche" },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2.5, 2.273, 0], rot: [180, 0, 0], farbe: "koralle", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-2, 2.16, 0], rot: [180, 0, 0], farbe: "senf", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1.5, 2.073, 0], rot: [180, 0, 0], farbe: "himmelblau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-1, 2.01, 0], rot: [180, 0, 0], farbe: "mint", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [-0.5, 1.973, 0], rot: [180, 0, 0], farbe: "lavendel", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0, 1.96, 0], rot: [180, 0, 0], farbe: "koralle", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [0.5, 1.973, 0], rot: [180, 0, 0], farbe: "senf", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1, 2.01, 0], rot: [180, 0, 0], farbe: "himmelblau", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [1.5, 2.073, 0], rot: [180, 0, 0], farbe: "mint", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2, 2.16, 0], rot: [180, 0, 0], farbe: "lavendel", wind: 1.2 },
      { form: "kegel", r: 0.16, h: 0.34, pos: [2.5, 2.273, 0], rot: [180, 0, 0], farbe: "koralle", wind: 1.2 }
    ],
    kollision: { boxen: [[-3, 0, 0.3, 0.3], [3, 0, 0.3, 0.3]] },
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
