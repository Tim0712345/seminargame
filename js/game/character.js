/* =====================================================================
   Die Lücke – Figuren-Baukasten und Animation
   ---------------------------------------------------------------------
   Baut aus den Angaben in data/characters.js ein Mesh mit „Knochen“.
   Jede Form hängt an genau einem Knochen (Körper, Kopf, Arme, Beine …).
   Pro Bild werden nur die Knochen-Matrizen berechnet → 1 Draw-Call
   pro Figur. Gesichter: Augen- und Mund-Flächen auf dem Kopf, deren
   Bild aus dem Gesichts-Atlas gewählt wird (Emotionen, Blinzeln).
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

/* ---------- gemeinsame Hilfe: Farbname -> [r,g,b] ---------- */
(function () {
  "use strict";
  var cache = {};
  GAME.farbe = function (f) {
    if (!f) return [1, 0, 1];
    if (Array.isArray(f)) return f;
    if (cache[f]) return cache[f];
    var h = DATA.palette[f];
    if (!h) {
      if (f.charAt(0) === "#") return (cache[f] = ENG.math.hex(f));
      console.warn("Unbekannte Farbe in den Daten: \"" + f + "\"");
      return [1, 0, 1];
    }
    return (cache[f] = ENG.math.hex(h));
  };
})();

GAME.character = (function () {
  "use strict";
  var MM = ENG.math, D = MM.DEG;
  var C = {};

  var K = C.KNOCHEN = { WURZEL: 0, KOERPER: 1, KOPF: 2, ARM_L: 3, ARM_R: 4, BEIN_L: 5, BEIN_R: 6, RAD_L: 7, RAD_R: 8, HAND: 9 };
  var ANZ_KNOCHEN = 12;

  // Der Kopf wird in einem „Bauraum“ (Radius 0.25, Mitte y 0.95) gebaut und
  // danach verkleinert und angehoben. Der Körper wird schlanker und länger
  // gezogen. Ergebnis: Figuren mit ca. 3 Kopflängen.
  var KOPF_R = 0.25;
  var KOPF_Y = 0.95;
  var KOPF_SKAL = 0.8;          // echter Kopfradius = 0.2
  var KOPF_Y_NEU = 1.04;        // echte Kopfmitte
  var KS = [0.88, 1.2, 0.88];   // Streckung des Körpers (Breite, Höhe, Tiefe)
  var MMk = ENG.math;
  var mS = MMk.m4(), mT = MMk.m4(), mE = MMk.m4();
  function bauMatrix(o, knochen) {
    var p = o.pos || [0, 0, 0], r = o.rot || [0, 0, 0], sk = o.skal || [1, 1, 1];
    var D = MMk.DEG;
    MMk.m4compose(mT, p[0], p[1], p[2], r[0] * D, r[1] * D, r[2] * D, sk[0], sk[1], sk[2]);
    if (knochen === K.KOPF) {
      // T(0, neu) · S(k) · T(0, -alt)
      MMk.m4compose(mS, 0, KOPF_Y_NEU - KOPF_Y * KOPF_SKAL, 0, 0, 0, 0, KOPF_SKAL, KOPF_SKAL, KOPF_SKAL);
      return MMk.m4mul(mE, mS, mT);
    }
    if (knochen === K.RAD_L || knochen === K.RAD_R) return MMk.m4copy(mE, mT);
    if (knochen === K.WURZEL) {
      // Rollstuhl: nur die Position anpassen, Formen nicht verzerren
      MMk.m4copy(mE, mT);
      mE[13] = p[1] < 0.3 ? p[1] : p[1] * KS[1];
      return mE;
    }
    MMk.m4compose(mS, 0, 0, 0, 0, 0, 0, KS[0], KS[1], KS[2]);
    return MMk.m4mul(mE, mS, mT);
  }
  var KOPF_FORM = { rund: [1, 1, 1], oval: [0.95, 1.07, 0.97], breit: [1.08, 0.96, 1.0] };
  var KOERPER = {
    schmal:   { b: 0.32, t: 0.24 },
    mittel:   { b: 0.36, t: 0.26 },
    kraeftig: { b: 0.44, t: 0.31 }
  };

  var meshCache = {};

  /* Baut eine Figur. Rückgabe: { mesh, info } */
  C.bauen = function (id) {
    if (meshCache[id]) return meshCache[id];
    var def = DATA.characters[id];
    if (!def) throw new Error("Figur fehlt in characters.js: " + id);
    var b = ENG.mesh.neu();
    var F = GAME.farbe;
    var haut = F(def.haut || "haut_3");
    var ks = KOPF_FORM[def.kopf] || KOPF_FORM.rund;
    var kp = KOERPER[def.koerper] || KOERPER.mittel;
    var oben = def.oberteil || { typ: "pullover", farbe: "grau" };
    var unten = def.unterteil || { typ: "hose", farbe: "jeans" };
    var extras = def.extras || [];
    var hat = function (t) { for (var i = 0; i < extras.length; i++) if (extras[i].typ === t) return extras[i]; return null; };
    var rollstuhl = hat("rollstuhl"), gehstock = hat("gehstock");
    var kleid = oben.typ === "kleid";

    function teil(form, masse, o) {
      var kn = o.knochen || 0;
      var o2 = {};
      for (var k in o) if (k !== "pos" && k !== "rot" && k !== "skal") o2[k] = o[k];
      o2.m = bauMatrix(o, kn);
      b.add(ENG.mesh.form(form, masse, true), o2);
    }

    var W = kp.b, T = kp.t;
    var oFarbe = F(oben.farbe), uFarbe = F(unten.farbe);
    var schuh = F(def.schuhe || "anthrazit");
    var armX = W / 2 + 0.035;
    var kurzeAermel = oben.typ === "tshirt" || kleid;

    // ---------- Beine & Schuhe ----------
    [[-1, K.BEIN_R], [1, K.BEIN_L]].forEach(function (s) {
      var x = s[0] * (W * 0.25);
      var beinFarbe = uFarbe;
      if (kleid || unten.typ === "rock" || unten.typ === "shorts") beinFarbe = unten.beine ? F(unten.beine) : haut;
      if (kleid && unten.typ === "hose") beinFarbe = uFarbe;
      teil("kapsel", { r: 0.072, h: 0.32 }, { pos: [x, 0.21, 0], farbe: beinFarbe, knochen: s[1] });
      if (unten.typ === "shorts") teil("kapsel", { r: 0.08, h: 0.17 }, { pos: [x, 0.3, 0], farbe: uFarbe, knochen: s[1] });
      teil("box", { groesse: [0.15, 0.09, 0.21], rund: 0.045 }, { pos: [x, 0.045, 0.025], farbe: schuh, knochen: s[1] });
    });

    // ---------- Hüfte / Rock ----------
    teil("box", { groesse: [W * 0.94, 0.14, T * 0.94], rund: 0.06 }, { pos: [0, 0.4, 0], farbe: kleid ? oFarbe : uFarbe, knochen: K.KOERPER });
    if (kleid) teil("zylinder", { r: W * 0.72, rOben: W * 0.5, h: 0.24 }, { pos: [0, 0.33, 0], farbe: oFarbe, knochen: K.KOERPER });
    else if (unten.typ === "rock") teil("zylinder", { r: W * 0.68, rOben: W * 0.5, h: 0.2 }, { pos: [0, 0.34, 0], farbe: uFarbe, knochen: K.KOERPER });

    // ---------- Oberkörper ----------
    teil("box", { groesse: [W, 0.32, T], rund: 0.1 }, { pos: [0, 0.56, 0], farbe: oFarbe, knochen: K.KOERPER });
    var vorne = T / 2;
    switch (oben.typ) {
      case "hoodie":
        teil("torus", { R: 0.13, r: 0.055 }, { pos: [0, 0.705, -0.02], rot: [90, 0, 0], skal: [1.15, 1, 1], farbe: oFarbe, knochen: K.KOERPER });
        teil("box", { groesse: [W * 0.58, 0.1, 0.05], rund: 0.02 }, { pos: [0, 0.49, vorne - 0.005], farbe: oFarbe, knochen: K.KOERPER });
        teil("kapsel", { r: 0.012, h: 0.1 }, { pos: [-0.04, 0.64, vorne + 0.01], farbe: F("creme"), knochen: K.KOERPER });
        teil("kapsel", { r: 0.012, h: 0.1 }, { pos: [0.04, 0.64, vorne + 0.01], farbe: F("creme"), knochen: K.KOERPER });
        break;
      case "pullover":
        teil("torus", { R: 0.1, r: 0.03 }, { pos: [0, 0.71, 0], rot: [90, 0, 0], farbe: oFarbe, knochen: K.KOERPER });
        break;
      case "hemd":
        teil("box", { groesse: [0.09, 0.05, 0.03], rund: 0.012 }, { pos: [-0.05, 0.69, vorne - 0.01], rot: [0, 0, -25], farbe: oFarbe, knochen: K.KOERPER });
        teil("box", { groesse: [0.09, 0.05, 0.03], rund: 0.012 }, { pos: [0.05, 0.69, vorne - 0.01], rot: [0, 0, 25], farbe: oFarbe, knochen: K.KOERPER });
        [0.62, 0.55, 0.48].forEach(function (y) { teil("kugel", { r: 0.013 }, { pos: [0, y, vorne + 0.003], farbe: F("creme"), knochen: K.KOERPER }); });
        break;
      case "blazer":
      case "strickjacke":
        teil("box", { groesse: [0.1, 0.16, 0.02], rund: 0.01 }, { pos: [0, 0.62, vorne + 0.002], farbe: F(oben.innen || "creme"), knochen: K.KOERPER });
        if (oben.typ === "blazer") {
          teil("box", { groesse: [0.05, 0.16, 0.025], rund: 0.01 }, { pos: [-0.055, 0.62, vorne + 0.006], rot: [0, 0, 18], farbe: oFarbe, knochen: K.KOERPER });
          teil("box", { groesse: [0.05, 0.16, 0.025], rund: 0.01 }, { pos: [0.055, 0.62, vorne + 0.006], rot: [0, 0, -18], farbe: oFarbe, knochen: K.KOERPER });
        } else {
          [0.52, 0.46].forEach(function (y) { teil("kugel", { r: 0.014 }, { pos: [0, y, vorne + 0.003], farbe: F("creme"), knochen: K.KOERPER }); });
        }
        break;
    }
    if (unten.typ === "latzhose") {
      teil("box", { groesse: [W * 0.56, 0.17, 0.03], rund: 0.02 }, { pos: [0, 0.545, vorne - 0.006], farbe: uFarbe, knochen: K.KOERPER });
      teil("box", { groesse: [0.035, 0.025, T + 0.03], rund: 0.01 }, { pos: [-W * 0.22, 0.705, 0], farbe: uFarbe, knochen: K.KOERPER });
      teil("box", { groesse: [0.035, 0.025, T + 0.03], rund: 0.01 }, { pos: [W * 0.22, 0.705, 0], farbe: uFarbe, knochen: K.KOERPER });
      teil("kugel", { r: 0.016 }, { pos: [-W * 0.22, 0.615, vorne + 0.012], farbe: F("senf"), knochen: K.KOERPER });
      teil("kugel", { r: 0.016 }, { pos: [W * 0.22, 0.615, vorne + 0.012], farbe: F("senf"), knochen: K.KOERPER });
    }

    // ---------- Arme & Hände ----------
    [[-1, K.ARM_R], [1, K.ARM_L]].forEach(function (s) {
      var x = s[0] * armX;
      if (kurzeAermel) {
        teil("kapsel", { r: 0.066, h: 0.15 }, { pos: [x, 0.615, 0], rot: [0, 0, s[0] * 8], farbe: oFarbe, knochen: s[1] });
        teil("kapsel", { r: 0.055, h: 0.2 }, { pos: [x + s[0] * 0.012, 0.52, 0], rot: [0, 0, s[0] * 8], farbe: haut, knochen: s[1] });
      } else {
        teil("kapsel", { r: 0.062, h: 0.27 }, { pos: [x + s[0] * 0.006, 0.555, 0], rot: [0, 0, s[0] * 8], farbe: oFarbe, knochen: s[1] });
      }
      teil("kugel", { r: 0.058 }, { pos: [x + s[0] * 0.028, 0.415, 0.005], farbe: haut, knochen: s[1] });
    });

    // ---------- Kopf ----------
    var kSkal = [KOPF_R * ks[0], KOPF_R * ks[1], KOPF_R * ks[2]];
    teil("kugel", { r: 1, seg: 16, ring: 12 }, { pos: [0, KOPF_Y, 0], skal: kSkal, farbe: haut, knochen: K.KOPF });
    // Gesichtsflächen (Augen, Mund) – knapp über der Kopfoberfläche
    var gs = [kSkal[0] * 1.012, kSkal[1] * 1.012, kSkal[2] * 1.012];
    teil("kugel", { r: 1, seg: 14, ring: 8, lat0: 1.2, lat1: 2.1, lon0: -0.8, lon1: 0.8 },
      { pos: [0, KOPF_Y, 0], skal: gs, farbe: haut, knochen: K.KOPF, gesicht: 1, uvGeo: true });
    teil("kugel", { r: 1, seg: 8, ring: 5, lat0: 1.88, lat1: 2.28, lon0: -0.36, lon1: 0.36 },
      { pos: [0, KOPF_Y, 0], skal: gs, farbe: haut, knochen: K.KOPF, gesicht: 2, uvGeo: true });

    // ---------- Haare ----------
    haareBauen(teil, def.haare || { stil: "kurz", farbe: "haar_dunkelbraun" }, kSkal);

    // ---------- Extras ----------
    extras.forEach(function (ex) { extraBauen(teil, ex, { W: W, T: T, kSkal: kSkal, armX: armX, haut: haut, def: def }); });

    var info = {
      rollstuhl: !!rollstuhl,
      gehstock: !!gehstock,
      groesse: def.alter === "kind" ? 0.78 : 1,
      radius: rollstuhl ? 0.4 : 0.28,
      armX: armX * KS[0],
      kopfHoehe: KOPF_Y_NEU + KOPF_R * KOPF_SKAL * ks[1] + 0.12
    };
    var ergebnis = { mesh: b.fertig(), info: info };
    meshCache[id] = ergebnis;
    return ergebnis;
  };

  function haareBauen(teil, h, ks) {
    var f = GAME.farbe(h.farbe);
    var P = Math.PI;
    function kappe(vorneBis, hintenBis, k, grenze) {
      grenze = grenze || 1.0;
      var sk = [ks[0] * k, ks[1] * k, ks[2] * k];
      teil("kugel", { r: 1, seg: 12, ring: 8, lat0: 0, lat1: vorneBis - 0.1, lon0: -grenze, lon1: grenze },
        { pos: [0, KOPF_Y, 0], skal: sk, farbe: f, knochen: K.KOPF });
      teil("kugel", { r: 1, seg: 16, ring: 10, lat0: 0, lat1: hintenBis, lon0: grenze, lon1: 2 * P - grenze },
        { pos: [0, KOPF_Y, 0], skal: sk, farbe: f, knochen: K.KOPF });
    }
    function straehne(x, y, z, sx, sy, sz, rz) {
      teil("kugel", { r: 1 }, { pos: [x, y, z], skal: [sx, sy, sz], rot: [0, 0, rz || 0], farbe: f, knochen: K.KOPF });
    }
    var kx = ks[0], ky = ks[1];
    switch (h.stil) {
      case "glatze":
        teil("kugel", { r: 1, seg: 14, ring: 4, lat0: 1.45, lat1: 1.95, lon0: 1.3, lon1: 2 * P - 1.3 },
          { pos: [0, KOPF_Y, 0], skal: [ks[0] * 1.04, ks[1] * 1.04, ks[2] * 1.04], farbe: f, knochen: K.KOPF });
        break;
      case "kurz":
        kappe(1.22, 1.85, 1.07);
        straehne(0.05, KOPF_Y + 0.17 * ky, 0.17, 0.12, 0.05, 0.08, -12);
        break;
      case "mittellang":
        kappe(1.3, 2.1, 1.08);
        straehne(0.06, KOPF_Y + 0.165 * ky, 0.175, 0.17, 0.065, 0.1, -14);
        straehne(-0.1, KOPF_Y + 0.15 * ky, 0.16, 0.1, 0.06, 0.08, 18);
        straehne(-0.235 * kx, KOPF_Y - 0.08, 0.02, 0.065, 0.13, 0.1);
        straehne(0.235 * kx, KOPF_Y - 0.08, 0.02, 0.065, 0.13, 0.1);
        straehne(0, KOPF_Y - 0.1, -0.13, 0.22, 0.12, 0.12);
        break;
      case "bob":
        kappe(1.3, 2.25, 1.12);
        straehne(0.05, KOPF_Y + 0.17 * ky, 0.18, 0.18, 0.07, 0.1, -10);
        straehne(-0.25 * kx, KOPF_Y - 0.07, 0.03, 0.08, 0.15, 0.13);
        straehne(0.25 * kx, KOPF_Y - 0.07, 0.03, 0.08, 0.15, 0.13);
        break;
      case "lang":
        kappe(1.3, 2.25, 1.1);
        straehne(0.05, KOPF_Y + 0.17 * ky, 0.18, 0.17, 0.065, 0.1, -12);
        straehne(-0.24 * kx, KOPF_Y - 0.12, 0.02, 0.07, 0.2, 0.11);
        straehne(0.24 * kx, KOPF_Y - 0.12, 0.02, 0.07, 0.2, 0.11);
        teil("box", { groesse: [0.42 * kx, 0.42, 0.1], rund: 0.05 }, { pos: [0, 0.74, -0.16], farbe: f, knochen: K.KOPF });
        break;
      case "zopf":
        kappe(1.28, 1.95, 1.07);
        straehne(0.05, KOPF_Y + 0.17 * ky, 0.17, 0.15, 0.06, 0.09, -12);
        teil("torus", { R: 0.035, r: 0.018 }, { pos: [0, KOPF_Y + 0.02, -0.27], farbe: GAME.farbe("senf"), knochen: K.KOPF });
        teil("kapsel", { r: 0.065, h: 0.26 }, { pos: [0, KOPF_Y - 0.07, -0.32], rot: [25, 0, 0], farbe: f, knochen: K.KOPF });
        break;
      case "dutt":
        kappe(1.25, 1.9, 1.06);
        teil("kugel", { r: 0.1 }, { pos: [0, KOPF_Y + 0.2 * ky, -0.14], farbe: f, knochen: K.KOPF });
        break;
      case "locken":
        kappe(1.25, 1.9, 1.08);
        for (var i = 0; i < 22; i++) {
          // Fibonacci-Verteilung auf der oberen Kopfhälfte
          var t = (i + 0.5) / 22, th = Math.acos(1 - t * 0.95), ph = i * 2.39996;
          if (th > 1.05 && Math.cos(ph) > 0.2) continue;
          var r = KOPF_R * 1.1;
          teil("kugel", { r: 0.072 }, {
            pos: [Math.sin(th) * Math.sin(ph) * r * kx, KOPF_Y + Math.cos(th) * r * ky, Math.sin(th) * Math.cos(ph) * r * ks[2]],
            farbe: f, knochen: K.KOPF
          });
        }
        break;
      case "afro":
        kappe(1.22, 2.0, 1.32);
        for (var j = 0; j < 14; j++) {
          var tt = (j + 0.5) / 14, th2 = Math.acos(1 - tt * 1.1), ph2 = j * 2.39996;
          if (th2 > 1.1 && Math.cos(ph2) > 0.3) continue;
          var r2 = KOPF_R * 1.3;
          teil("kugel", { r: 0.09 }, {
            pos: [Math.sin(th2) * Math.sin(ph2) * r2 * kx, KOPF_Y + Math.cos(th2) * r2 * ky, Math.sin(th2) * Math.cos(ph2) * r2 * ks[2]],
            farbe: f, knochen: K.KOPF
          });
        }
        break;
      case "kopftuch":
        kappe(1.35, 2.55, 1.1, 1.15);
        teil("zylinder", { r: 0.25, rOben: 0.17, h: 0.14 }, { pos: [0, 0.71, -0.01], farbe: f, knochen: K.KOERPER });
        break;
      default:
        kappe(1.22, 1.85, 1.07);
    }
  }

  function extraBauen(teil, ex, m) {
    var F = GAME.farbe;
    var W = m.W, T = m.T, ks = m.kSkal;
    switch (ex.typ) {
      case "umhaengetasche": {
        var tf = F(ex.farbe || "senf");
        teil("box", { groesse: [0.035, 0.46, 0.015], rund: 0.007 }, { pos: [0, 0.56, T / 2 + 0.008], rot: [0, 0, 38], farbe: tf, knochen: K.KOERPER });
        teil("box", { groesse: [0.035, 0.46, 0.015], rund: 0.007 }, { pos: [0, 0.56, -T / 2 - 0.008], rot: [0, 0, -38], farbe: tf, knochen: K.KOERPER });
        teil("box", { groesse: [0.1, 0.045, 0.06], rund: 0.01 }, { pos: [W / 2 + 0.045, 0.5, 0.02], farbe: F("creme"), knochen: K.KOERPER });
        teil("box", { groesse: [0.08, 0.16, 0.18], rund: 0.03 }, { pos: [W / 2 + 0.05, 0.42, 0.02], farbe: tf, knochen: K.KOERPER });
        teil("box", { groesse: [0.088, 0.07, 0.185], rund: 0.025 }, { pos: [W / 2 + 0.053, 0.47, 0.02], farbe: tf, knochen: K.KOERPER });
        break;
      }
      case "brille": {
        var bf = F(ex.farbe || "brille");
        var ey = KOPF_Y - 0.012 * (ks[1] / KOPF_R), ez = ks[2] * 0.96 + 0.025;
        teil("torus", { R: 0.064, r: 0.011 }, { pos: [-0.083 * (ks[0] / KOPF_R), ey, ez], farbe: bf, knochen: K.KOPF });
        teil("torus", { R: 0.064, r: 0.011 }, { pos: [0.083 * (ks[0] / KOPF_R), ey, ez], farbe: bf, knochen: K.KOPF });
        teil("box", { groesse: [0.04, 0.012, 0.012], rund: 0.004 }, { pos: [0, ey + 0.015, ez + 0.005], farbe: bf, knochen: K.KOPF });
        teil("box", { groesse: [0.012, 0.012, 0.2], rund: 0.004 }, { pos: [-0.15 * (ks[0] / KOPF_R), ey + 0.01, ez - 0.1], rot: [0, -8, 0], farbe: bf, knochen: K.KOPF });
        teil("box", { groesse: [0.012, 0.012, 0.2], rund: 0.004 }, { pos: [0.15 * (ks[0] / KOPF_R), ey + 0.01, ez - 0.1], rot: [0, 8, 0], farbe: bf, knochen: K.KOPF });
        break;
      }
      case "gehstock": {
        var sf = F(ex.farbe || "holz_dunkel");
        var hx = -(m.armX + 0.03);
        teil("zylinder", { r: 0.018, h: 0.44 }, { pos: [hx, 0.2, 0.08], rot: [8, 0, 0], farbe: sf, knochen: K.ARM_R });
        teil("kapsel", { r: 0.02, h: 0.12 }, { pos: [hx, 0.415, 0.06], rot: [90, 0, 0], farbe: sf, knochen: K.ARM_R });
        break;
      }
      case "rollstuhl": {
        var mf = F(ex.farbe || "petrol"), gf = F("anthrazit"), sitz = F("anthrazit");
        teil("box", { groesse: [0.46, 0.06, 0.42], rund: 0.02 }, { pos: [0, 0.34, 0.02], farbe: sitz, knochen: K.WURZEL });
        teil("box", { groesse: [0.44, 0.34, 0.05], rund: 0.03 }, { pos: [0, 0.56, -0.2], rot: [-8, 0, 0], farbe: sitz, knochen: K.WURZEL });
        [-1, 1].forEach(function (s) {
          teil("box", { groesse: [0.03, 0.03, 0.44], rund: 0.012 }, { pos: [s * 0.24, 0.32, 0.02], farbe: mf, knochen: K.WURZEL });
          teil("box", { groesse: [0.03, 0.46, 0.03], rund: 0.012 }, { pos: [s * 0.22, 0.52, -0.22], farbe: mf, knochen: K.WURZEL });
          teil("kapsel", { r: 0.018, h: 0.1 }, { pos: [s * 0.22, 0.76, -0.27], rot: [90, 0, 0], farbe: gf, knochen: K.WURZEL });
          teil("box", { groesse: [0.03, 0.28, 0.03], rund: 0.012 }, { pos: [s * 0.18, 0.2, 0.22], rot: [-15, 0, 0], farbe: mf, knochen: K.WURZEL });
          teil("zylinder", { r: 0.045, h: 0.035 }, { pos: [s * 0.18, 0.045, 0.27], rot: [0, 0, 90], farbe: gf, knochen: K.WURZEL });
          var rk = s < 0 ? K.RAD_R : K.RAD_L;
          teil("torus", { R: 0.23, r: 0.022, seg: 20 }, { pos: [s * 0.29, 0.25, -0.03], rot: [0, 90, 0], farbe: gf, knochen: rk });
          teil("torus", { R: 0.2, r: 0.01, seg: 20 }, { pos: [s * 0.31, 0.25, -0.03], rot: [0, 90, 0], farbe: mf, knochen: rk });
          teil("box", { groesse: [0.012, 0.4, 0.012], rund: 0.004 }, { pos: [s * 0.29, 0.25, -0.03], farbe: F("grau"), knochen: rk });
          teil("box", { groesse: [0.012, 0.012, 0.4], rund: 0.004 }, { pos: [s * 0.29, 0.25, -0.03], farbe: F("grau"), knochen: rk });
          teil("zylinder", { r: 0.035, h: 0.05 }, { pos: [s * 0.29, 0.25, -0.03], rot: [0, 0, 90], farbe: mf, knochen: rk });
        });
        teil("box", { groesse: [0.34, 0.03, 0.12], rund: 0.012 }, { pos: [0, 0.1, 0.32], farbe: mf, knochen: K.WURZEL });
        break;
      }
      case "muetze": {
        var mfb = F(ex.farbe || "senf");
        var s2 = [ks[0] * 1.14, ks[1] * 1.14, ks[2] * 1.14];
        teil("kugel", { r: 1, seg: 14, ring: 7, lat0: 0, lat1: 1.2 }, { pos: [0, KOPF_Y + 0.01, 0], skal: s2, farbe: mfb, knochen: K.KOPF });
        teil("torus", { R: KOPF_R * 1.06, r: 0.03, seg: 20 }, { pos: [0, KOPF_Y + 0.085, 0], rot: [90, 0, 0], skal: [ks[0] / KOPF_R, ks[2] / KOPF_R, 1], farbe: mfb, knochen: K.KOPF });
        teil("kugel", { r: 0.06 }, { pos: [0, KOPF_Y + ks[1] * 1.14 + 0.02, 0], farbe: F("creme"), knochen: K.KOPF });
        break;
      }
      case "schal": {
        var scf = F(ex.farbe || "koralle");
        teil("torus", { R: 0.14, r: 0.05 }, { pos: [0, 0.71, 0], rot: [90, 0, 0], farbe: scf, knochen: K.KOERPER });
        teil("box", { groesse: [0.08, 0.2, 0.04], rund: 0.02 }, { pos: [0.07, 0.6, T / 2 + 0.03], rot: [0, 0, 8], farbe: scf, knochen: K.KOERPER });
        break;
      }
      case "ohrringe": {
        var of = F(ex.farbe || "senf");
        teil("kugel", { r: 0.018 }, { pos: [-ks[0] * 0.98, KOPF_Y - 0.08, 0], farbe: of, knochen: K.KOPF });
        teil("kugel", { r: 0.018 }, { pos: [ks[0] * 0.98, KOPF_Y - 0.08, 0], farbe: of, knochen: K.KOPF });
        break;
      }
      case "bart": {
        var hf = GAME.farbe((m.def.haare && m.def.haare.farbe) || "haar_dunkelbraun");
        teil("kugel", { r: 1, seg: 14, ring: 5, lat0: 2.3, lat1: 2.8, lon0: -1.35, lon1: 1.35 },
          { pos: [0, KOPF_Y, 0], skal: [ks[0] * 1.04, ks[1] * 1.04, ks[2] * 1.04], farbe: hf, knochen: K.KOPF });
        break;
      }
    }
  }

  // ======================================================================
  //  Figur (Instanz mit Animation)
  // ======================================================================
  function Figur(id) {
    var gebaut = C.bauen(id);
    this.id = id;
    this.def = DATA.characters[id];
    this.mesh = gebaut.mesh;
    this.info = gebaut.info;
    this.x = 0; this.y = 0; this.z = 0;
    this.rot = 0;                  // Blickrichtung (Bogenmaß), 0 = nach Süden
    this.tempo = 0;                // aktuelle Geschwindigkeit (für die Animation)
    this.laufMix = 0;
    this.phase = 0;
    this.zeit = Math.random() * 10;
    this.blinzelIn = 1 + Math.random() * 3;
    this.blinzelt = 0;
    this.emotion = "neutral";
    this.spricht = false;
    this.radWinkel = 0;
    this.jubelZeit = 0;
    this.huepfer = 0;
    this.letzteSchrittSeite = 0;
    this.staub = true;
    this.knochen = new Float32Array(16 * ANZ_KNOCHEN);
    for (var k = 0; k < ANZ_KNOCHEN; k++) MM.m4identity(this.knochen.subarray(k * 16, k * 16 + 16));
    this.model = MM.m4();
    this.tmp = MM.m4();
    this.tmp2 = MM.m4();
  }
  C.Figur = Figur;

  Figur.prototype.jubeln = function () {
    this.jubelZeit = 1.6;
  };
  Figur.prototype.huepfen = function () {
    this.huepfer = 0.45;
  };

  // Knochen k = Eltern * Pivot-Transformation
  Figur.prototype.setzeKnochen = function (k, eltern, px, py, pz, rx, ry, rz, sx, sy, sz, tx, ty, tz) {
    var ziel = this.knochen.subarray(k * 16, k * 16 + 16);
    MM.m4pivot(this.tmp2, px, py, pz, rx, ry, rz, sx, sy, sz, tx, ty, tz);
    if (eltern) MM.m4mul(ziel, eltern, this.tmp2);
    else MM.m4copy(ziel, this.tmp2);
    return ziel;
  };

  Figur.prototype.update = function (dt) {
    this.zeit += dt;
    var t = this.zeit;
    var info = this.info;
    var geh = MM.clamp(this.tempo / 3.2, 0, 1);
    this.laufMix = MM.damp(this.laufMix, this.tempo > 0.15 ? 1 : 0, 10, dt);
    var lm = this.laufMix;

    // Schrittfrequenz passt sich der Geschwindigkeit an
    this.phase += dt * (4 + this.tempo * 3.4) * (lm > 0.02 ? 1 : 0);
    var s = Math.sin(this.phase);

    // Blinzeln
    this.blinzelIn -= dt;
    if (this.blinzelIn <= 0) { this.blinzelt = 0.13; this.blinzelIn = 2 + Math.random() * 3.5; }
    if (this.blinzelt > 0) this.blinzelt -= dt;

    // Jubeln / Hüpfen
    var jub = 0, sprungY = 0, arme = 0;
    if (this.jubelZeit > 0) {
      this.jubelZeit -= dt;
      var jt = 1 - this.jubelZeit / 1.6;
      jub = MM.smoothstep(0, 0.12, jt) * (1 - MM.smoothstep(0.85, 1, jt));
      sprungY = Math.max(0, Math.sin(jt * Math.PI * 3)) * 0.22 * jub;
      arme = jub;
    }
    if (this.huepfer > 0) {
      this.huepfer -= dt;
      sprungY = Math.max(sprungY, Math.sin((1 - this.huepfer / 0.45) * Math.PI) * 0.16);
    }

    // Grundbewegung
    var atmen = Math.sin(t * 2.2) * 0.014 * (1 - lm);
    var federn = info.rollstuhl ? 0 : Math.abs(s) * 0.065 * lm * (0.6 + geh * 0.4);
    var quetsch = info.rollstuhl ? 0 : (0.5 - Math.abs(s)) * 0.05 * lm;
    var hochY = federn + sprungY;
    var neig = info.rollstuhl ? 0.04 * lm : 0.09 * lm * geh;
    var wiegen = info.rollstuhl ? 0 : Math.sin(this.phase) * 0.035 * lm;
    var kopfNick = Math.sin(t * 1.3) * 0.025 * (1 - lm) - neig * 0.5;
    var kopfNeig = Math.sin(t * 0.7) * 0.03 * (1 - lm) - wiegen * 0.5;

    var Kb = this.setzeKnochen(K.KOERPER, null, 0, 0.36 * KS[1], 0, neig, 0, wiegen, 1 - quetsch * 0.5, 1 + atmen + quetsch, 1 - quetsch * 0.5, 0, hochY, 0);
    this.setzeKnochen(K.KOPF, Kb, 0, 0.7 * KS[1], 0, kopfNick + (this.spricht ? Math.sin(t * 9) * 0.02 : 0), 0, kopfNeig, 1, 1, 1, 0, 0, 0);

    // Arme
    var armS = info.rollstuhl ? 0 : s * 0.8 * lm;
    var armL = armS, armR = -armS;
    var armRz = 0.12 * lm;
    if (info.gehstock) armR = -armS * 0.25 - 0.15 * lm;
    if (info.rollstuhl) {
      var schub = Math.sin(this.phase * 0.8);
      armL = armR = -0.35 - 0.35 * lm - schub * 0.4 * lm;
    }
    if (arme > 0) {
      armL = MM.lerp(armL, -2.7, arme);
      armR = MM.lerp(armR, -2.7, arme);
      armRz = MM.lerp(armRz, 0.35 + Math.sin(t * 14) * 0.08, arme);
    }
    this.setzeKnochen(K.ARM_L, Kb, (this.info.armX || 0.2), 0.66 * KS[1], 0, armL, 0, armRz, 1, 1, 1, 0, 0, 0);
    this.setzeKnochen(K.ARM_R, Kb, -(this.info.armX || 0.2), 0.66 * KS[1], 0, armR, 0, -armRz, 1, 1, 1, 0, 0, 0);

    // Beine
    if (info.rollstuhl) {
      this.setzeKnochen(K.BEIN_L, null, 0, 0.36 * KS[1], 0, -1.15, 0, 0, 1, 1, 1, 0, 0, 0);
      this.setzeKnochen(K.BEIN_R, null, 0, 0.36 * KS[1], 0, -1.15, 0, 0, 1, 1, 1, 0, 0, 0);
      this.radWinkel += this.tempo * dt / 0.23;
      this.setzeKnochen(K.RAD_L, null, 0, 0.25, -0.03, this.radWinkel, 0, 0, 1, 1, 1, 0, 0, 0);
      this.setzeKnochen(K.RAD_R, null, 0, 0.25, -0.03, this.radWinkel, 0, 0, 1, 1, 1, 0, 0, 0);
    } else {
      var bein = s * 0.7 * lm;
      this.setzeKnochen(K.BEIN_L, null, 0, 0.36 * KS[1], 0, -bein, 0, 0, 1, 1, 1, 0, hochY, 0);
      this.setzeKnochen(K.BEIN_R, null, 0, 0.36 * KS[1], 0, bein, 0, 0, 1, 1, 1, 0, hochY, 0);
    }

    // Staubwölkchen bei jedem Schritt
    var seite = s >= 0 ? 1 : -1;
    if (seite !== this.letzteSchrittSeite && lm > 0.5 && this.staub && this.tempo > 0.8) {
      this.staubwolke(seite);
    }
    this.letzteSchrittSeite = seite;

    // Modellmatrix
    var g = info.groesse;
    MM.m4compose(this.model, this.x, this.y, this.z, 0, this.rot, 0, g, g, g);
  };

  Figur.prototype.staubwolke = function (seite) {
    var c = Math.cos(this.rot), sn = Math.sin(this.rot);
    var ox = seite * 0.1 * c, oz = -seite * 0.1 * sn;
    for (var i = 0; i < 2; i++) {
      ENG.partikel.neu({
        x: this.x + ox - sn * 0.1 + (Math.random() - 0.5) * 0.1,
        y: this.y + 0.06,
        z: this.z + oz - c * 0.1 + (Math.random() - 0.5) * 0.1,
        vx: -sn * 0.4 + (Math.random() - 0.5) * 0.5, vy: 0.35 + Math.random() * 0.2, vz: -c * 0.4 + (Math.random() - 0.5) * 0.5,
        leben: 0.5 + Math.random() * 0.2, groesse: 0.14, wachsen: 0.16,
        farbe: [1, 0.98, 0.93], alpha: 0.55
      });
    }
  };

  Figur.prototype.gesicht = function () {
    var e = DATA.gesichter[this.emotion] || DATA.gesichter.neutral;
    var augen = this.blinzelt > 0 ? "zu" : e.augen;
    var mund = e.mund;
    if (this.spricht) mund = e.sprechen[Math.floor(this.zeit * 8) % 2];
    return { augen: ENG.textures.augen(augen), mund: ENG.textures.mund(mund) };
  };

  Figur.prototype.zeichnen = function (hoeheFn) {
    var ge = this.gesicht();
    ENG.renderer.mesh(this.mesh, this.model, { knochen: this.knochen, augen: ge.augen, mund: ge.mund, kontur: 0.0017 });
  };

  Figur.prototype.schatten = function (hoeheFn) {
    var r = (this.info.rollstuhl ? 0.46 : 0.34) * this.info.groesse;
    ENG.renderer.schatten(this.x, this.z, r, 0.45, hoeheFn);
  };

  return C;
})();
