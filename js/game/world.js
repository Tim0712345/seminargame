/* =====================================================================
   Die Lücke – Welt: baut aus den Map-Daten die 3D-Szene
   ---------------------------------------------------------------------
   * Boden in Blöcken (Chunks) zusammengefasst → wenige Draw-Calls
   * Höhen: jede Ecke ist der Mittelwert der angrenzenden Kacheln → weiche Hügel
   * Wasser mit Seegrund und bewegter Oberfläche, Holzstege
   * Objekte aus prefabs.js, Kollision, Schatten, Deko (Grasbüschel, Blumen)
   * Lichtquellen aus Prefabs (licht) und Karten (lichter), je Bild die
     nächsten an der Kamera
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.Welt = (function () {
  "use strict";
  var MM = ENG.math;
  var WASSER_Y = -0.15;
  var STEG_Y = 0.1;
  var CHUNK = 12;

  function Welt(id) {
    var map = DATA.maps[id];
    if (!map) throw new Error("Karte fehlt in maps.js: " + id);
    this.id = id;
    this.map = map;
    this.h = map.boden.length;
    this.w = map.boden[0].length;
    this.fehler = [];
    this.pruefen();

    var w = this.w, h = this.h, x, z;
    this.arten = new Array(w * h);
    this.artNamen = new Array(w * h);
    this.hoehen = new Float32Array(w * h);
    for (z = 0; z < h; z++) {
      for (x = 0; x < w; x++) {
        var zeichen = (map.boden[z] || "").charAt(x);
        var name = map.legende[zeichen] || "gras";
        this.artNamen[x + z * w] = name;
        this.arten[x + z * w] = DATA.bodenarten[name] || DATA.bodenarten.gras;
        var hz = map.hoehe && map.hoehe[z] ? parseInt(map.hoehe[z].charAt(x), 10) : 0;
        this.hoehen[x + z * w] = isNaN(hz) ? 0 : hz * 0.5;
      }
    }
    this.aussen = DATA.bodenarten[map.aussen || "gras"] || DATA.bodenarten.gras;
    this.eckenBerechnen();

    this.koll = new ENG.Kollision(w, h);
    this.kollisionAufbauen();

    this.chunks = [];
    this.statSchatten = [];
    this.lichtQuellen = [];
    this.blattQuellen = [];
    this.interaktionen = [];
    this.objekte = {};
    this.belegt = new Uint8Array(w * h);
    this.stimmung = GAME.Welt.umgebung(DATA.stimmungen[map.stimmung] || DATA.stimmungen.test);
    this.bauen();
  }

  // ---------------- Prüfung der Kartendaten ----------------
  Welt.prototype.pruefen = function () {
    var m = this.map, self = this;
    function f(t) { self.fehler.push(t); console.warn("[Karte " + self.id + "] " + t); }
    m.boden.forEach(function (z, i) { if (z.length !== self.w) f("Boden-Zeile " + i + " hat " + z.length + " statt " + self.w + " Zeichen."); });
    if (m.hoehe) {
      if (m.hoehe.length !== self.h) f("Höhen-Layer hat " + m.hoehe.length + " statt " + self.h + " Zeilen.");
      m.hoehe.forEach(function (z, i) { if (z.length !== self.w) f("Höhen-Zeile " + i + " hat " + z.length + " statt " + self.w + " Zeichen."); });
    }
    if (m.kollision) m.kollision.forEach(function (z, i) { if (z.length !== self.w) f("Kollisions-Zeile " + i + " hat die falsche Länge."); });
    m.boden.forEach(function (z, i) {
      for (var k = 0; k < z.length; k++) {
        var c = z.charAt(k);
        if (!m.legende[c]) f("Unbekanntes Boden-Zeichen \"" + c + "\" in Zeile " + i + ", Spalte " + k + ".");
        else if (!DATA.bodenarten[m.legende[c]]) f("Bodenart \"" + m.legende[c] + "\" fehlt in DATA.bodenarten.");
      }
    });
    (m.objekte || []).forEach(function (o, i) { if (!DATA.prefabs[o.p]) f("Objekt " + i + ": Prefab \"" + o.p + "\" gibt es nicht."); });
  };

  // ---------------- Kachel-Hilfen ----------------
  Welt.prototype.art = function (x, z) {
    if (x < 0 || z < 0 || x >= this.w || z >= this.h) return this.aussen;
    return this.arten[x + z * this.w];
  };
  Welt.prototype.kachelHoehe = function (x, z) {
    if (x < 0 || z < 0 || x >= this.w || z >= this.h) return 0;
    return this.hoehen[x + z * this.w];
  };
  function nass(a) { return !!(a.wasser || a.steg); }

  Welt.prototype.eckenBerechnen = function () {
    var w = this.w, h = this.h;
    this.ecken = new Float32Array((w + 1) * (h + 1));
    for (var cz = 0; cz <= h; cz++) {
      for (var cx = 0; cx <= w; cx++) {
        var land = 0, landS = 0, see = 0, seeS = 0;
        for (var dz = -1; dz <= 0; dz++) {
          for (var dx = -1; dx <= 0; dx++) {
            var a = this.art(cx + dx, cz + dz), hh = this.kachelHoehe(cx + dx, cz + dz);
            if (nass(a)) { see++; seeS += hh - 0.55; } else { land++; landS += hh; }
          }
        }
        this.ecken[cx + cz * (w + 1)] = land > 0 ? landS / land : seeS / see;
      }
    }
  };
  Welt.prototype.ecke = function (cx, cz) {
    cx = MM.clamp(cx, 0, this.w); cz = MM.clamp(cz, 0, this.h);
    return this.ecken[cx + cz * (this.w + 1)];
  };

  // Bodenhöhe an einer beliebigen Stelle
  Welt.prototype.hoeheBei = function (x, z) {
    var tx = Math.floor(x), tz = Math.floor(z);
    if (tx >= 0 && tz >= 0 && tx < this.w && tz < this.h && this.arten[tx + tz * this.w].steg) return STEG_Y;
    var fx = MM.clamp(x - tx, 0, 1), fz = MM.clamp(z - tz, 0, 1);
    var a = this.ecke(tx, tz), b = this.ecke(tx + 1, tz), c = this.ecke(tx, tz + 1), d = this.ecke(tx + 1, tz + 1);
    return MM.lerp(MM.lerp(a, b, fx), MM.lerp(c, d, fx), fz);
  };

  function eckNormale(welt, cx, cz) {
    var l = welt.ecke(cx - 1, cz), r = welt.ecke(cx + 1, cz), o = welt.ecke(cx, cz - 1), u = welt.ecke(cx, cz + 1);
    var nx = (l - r) / 2, ny = 1, nz = (o - u) / 2;
    var len = Math.sqrt(nx * nx + ny * ny + nz * nz);
    return [nx / len, ny / len, nz / len];
  }

  // ---------------- Kollision ----------------
  Welt.prototype.kollisionAufbauen = function () {
    var m = this.map;
    for (var z = 0; z < this.h; z++) {
      for (var x = 0; x < this.w; x++) {
        var a = this.arten[x + z * this.w];
        var gesperrt = !!a.wasser || !!a.wand;
        if (!a.wasser && !a.steg && !a.wand) {
          var e = [this.ecke(x, z), this.ecke(x + 1, z), this.ecke(x, z + 1), this.ecke(x + 1, z + 1)];
          if (Math.max.apply(null, e) - Math.min.apply(null, e) > 0.8) gesperrt = true;
        }
        var k = m.kollision && m.kollision[z] ? m.kollision[z].charAt(x) : " ";
        if (k === "X") gesperrt = true;
        if (k === "o") gesperrt = false;
        if (gesperrt) this.koll.sperren(x, z);
      }
    }
  };

  // ---------------- Aufbau der Geometrie ----------------
  Welt.prototype.bauen = function () {
    var self = this, w = this.w, h = this.h;
    var nx = Math.ceil(w / CHUNK), nz = Math.ceil(h / CHUNK);
    // Pro Block zwei Meshes: Welt (mit Tusche-Kontur) und Deko (Gras, Blumen – ohne Kontur)
    var builder = [], deko = [];
    for (var i = 0; i < nx * nz; i++) { builder.push(ENG.mesh.neu()); deko.push(ENG.mesh.neu()); }
    function dekoVon(x, z) {
      var cx = MM.clamp(Math.floor(x / CHUNK), 0, nx - 1), cz = MM.clamp(Math.floor(z / CHUNK), 0, nz - 1);
      return deko[cx + cz * nx];
    }
    function chunkVon(x, z) {
      var cx = MM.clamp(Math.floor(x / CHUNK), 0, nx - 1), cz = MM.clamp(Math.floor(z / CHUNK), 0, nz - 1);
      return builder[cx + cz * nx];
    }

    // Objekte zuerst (markieren belegte Kacheln für die Deko)
    (this.map.objekte || []).forEach(function (o) {
      var pf = DATA.prefabs[o.p];
      if (!pf) return;
      // Objekte mit Bedingung (z. B. offenes Tor) nur bauen, wenn sie erfüllt ist
      if (o.wenn && !GAME.flags.pruefen(o.wenn)) return;
      var wx = o.x + 0.5, wz = o.y + 0.5, wy = self.hoeheBei(wx, wz);
      GAME.Welt.prefabEinbauen(chunkVon(wx, wz), pf, wx, wy, wz, o.rot || 0);
      var kol = pf.kollision;
      var rr = (o.rot || 0) * MM.DEG, c = Math.cos(rr), sn = Math.sin(rr);
      if (kol && kol.kreis) self.koll.kreis(wx, wz, kol.kreis, { objekt: o });
      else if (kol && kol.box) self.koll.rechteck(wx, wz, kol.box[0] / 2, kol.box[1] / 2, o.rot || 0, { objekt: o });
      else if (kol && kol.boxen) kol.boxen.forEach(function (k) {
        self.koll.rechteck(wx + k[0] * c + k[1] * sn, wz - k[0] * sn + k[1] * c, k[2] / 2, k[3] / 2, o.rot || 0, { objekt: o });
      });
      if (pf.schatten) self.statSchatten.push({ x: wx, z: wz, r: pf.schatten });
      if (pf.blaetter) self.blattQuellen.push({ x: wx, y: wy + pf.blaetter.hoehe, z: wz,
        farben: pf.blaetter.farben.map(function (f) { return GAME.farbe(f); }) });
      if (pf.licht) [].concat(pf.licht).forEach(function (l) {
        var p = l.pos || [0, 1, 0];
        self.lichtHinzufuegen(l, wx + p[0] * c + p[2] * sn, wy + p[1], wz - p[0] * sn + p[2] * c);
      });
      var eintrag = { id: o.id, x: wx, y: wy, z: wz, rot: rr, objekt: o, prefab: pf };
      if (o.id) self.objekte[o.id] = eintrag;
      if (o.tuer && pf.tuer) {
        // Tür: Interaktionspunkt vor der Tür (lokaler Versatz aus dem Prefab, mitgedreht)
        var tx0 = pf.tuer[0], tz0 = pf.tuer[1] + 0.35;
        self.interaktionen.push({ art: "tuer", id: o.id, x: wx + tx0 * c + tz0 * sn, y: wy, z: wz - tx0 * sn + tz0 * c,
          radius: 0.35, ziel: o.tuer.ziel, spawn: o.tuer.spawn, wenn: o.tuer.wenn, gesperrt: o.tuer.gesperrt, hoehe: 1.6 });
      } else if (o.aufzug) {
        self.interaktionen.push({ art: "aufzug", id: o.id, x: wx, y: wy, z: wz, radius: (kolRadius(pf) || 0.4) + 0.15,
          etagen: o.aufzug, hoehe: pf.hoehe || 2.3 });
      } else if (o.dialog) {
        self.interaktionen.push({ art: "dialog", id: o.id, x: wx, y: wy, z: wz, radius: (kolRadius(pf) || 0.3) + 0.1,
          dialog: o.dialog, hoehe: pf.hoehe || 1.4, text: o.text });
      } else if (o.id) {
        self.interaktionen.push({ art: "objekt", id: o.id, x: wx, y: wy, z: wz, objekt: o, prefab: pf });
      }
      var rad = kolRadius(pf) || 0.4;
      for (var tz = Math.floor(wz - rad); tz <= Math.floor(wz + rad); tz++)
        for (var tx = Math.floor(wx - rad); tx <= Math.floor(wx + rad); tx++)
          if (tx >= 0 && tz >= 0 && tx < w && tz < h) self.belegt[tx + tz * w] = 1;
    });

    // Lichter, die direkt in der Karte stehen (ohne sichtbare Lampe)
    (this.map.lichter || []).forEach(function (l) {
      if (l.wenn && !GAME.flags.pruefen(l.wenn)) return;
      var lx = l.x + 0.5, lz = l.y + 0.5;
      self.lichtHinzufuegen(l, lx, self.hoeheBei(lx, lz) + (l.h === undefined ? 1.5 : l.h), lz);
    });

    // Wände (zu langen Stücken zusammengefasst, damit keine Fugen-Konturen entstehen)
    this.waendeBauen(chunkVon);

    // Boden
    for (var z = 0; z < h; z++) {
      for (var x = 0; x < w; x++) this.kachelBauen(chunkVon(x + 0.5, z + 0.5), x, z, dekoVon(x + 0.5, z + 0.5));
    }

    builder.forEach(function (b) { if (!b.leer()) self.chunks.push(b.fertig()); });
    this.dekoChunks = [];
    deko.forEach(function (b) { if (!b.leer()) self.dekoChunks.push(b.fertig()); });

    if (this.map.aussen === "wasser") this.meer = this.meerBauen();
    else if (!this.map.innen && this.map.aussen !== "leer") this.meer = this.randBauen();

    // Ausgänge zu anderen Karten
    this.ausgaenge = (this.map.uebergaenge || []).map(function (u) {
      return { x0: u.x, z0: u.y, x1: u.x + (u.b || 1), z1: u.y + (u.h || 1), ziel: u.ziel, spawn: u.spawn,
               richtung: u.richtung, wenn: u.wenn, gesperrt: u.gesperrt };
    });

    // Kamera-Grenzen (Innenräume: Kamera bleibt über dem Raum)
    // (optional pro Karte: kamera: { x, z, abstand } für Innenräume)
    var kx = this.map.kamera && this.map.kamera.x !== undefined ? this.map.kamera.x : w / 2;
    var kz = this.map.kamera && this.map.kamera.z !== undefined ? this.map.kamera.z : h / 2 - 0.4;
    this.kameraGrenzen = this.map.innen ? [kx, kz, kx, kz] : [5, 4, w - 5, h - 2];
  };

  /* Lichtquelle anlegen. l: { farbe, radius, staerke, art: "lampe" | "tag", hof } */
  Welt.prototype.lichtHinzufuegen = function (l, x, y, z) {
    this.lichtQuellen.push({
      x: x, y: y, z: z, radius: l.radius || 4, staerke: l.staerke === undefined ? 1 : l.staerke,
      grund: GAME.farbe(l.farbe || "laterne_licht"), lampe: l.art !== "tag", hof: l.hof || 0,
      farbe: [0, 0, 0], d: 0
    });
  };

  function kolRadius(pf) {
    var k = pf.kollision;
    if (!k) return 0;
    if (k.kreis) return k.kreis;
    if (k.box) return Math.max(k.box[0], k.box[1]) / 2;
    if (k.boxen) return k.boxen.reduce(function (m, b) { return Math.max(m, Math.abs(b[0]) + b[2] / 2, Math.abs(b[1]) + b[3] / 2); }, 0);
    return 0;
  }

  Welt.prototype.waendeBauen = function (chunkVon) {
    var w = this.w, h = this.h, benutzt = new Uint8Array(w * h), F = GAME.farbe;
    for (var z = 0; z < h; z++) {
      for (var x = 0; x < w; x++) {
        var k = x + z * w, a = this.arten[k];
        if (!a.wand || benutzt[k]) continue;
        var name = this.artNamen[k], lx = 1, lz = 1;
        while (x + lx < w && this.artNamen[k + lx] === name && !benutzt[k + lx]) lx++;
        if (lx === 1) while (z + lz < h && this.artNamen[k + lz * w] === name && !benutzt[k + lz * w]) lz++;
        for (var j = 0; j < lz; j++) for (var i = 0; i < lx; i++) benutzt[k + i + j * w] = 1;
        var fa = F(a.farbe);
        chunkVon(x + lx / 2, z + lz / 2).add(ENG.mesh.form("box", { groesse: [lx, a.wand, lz], rund: 0.04 }), {
          pos: [x + lx / 2, a.wand / 2, z + lz / 2], farbe: fa,
          muster: a.textur ? (ENG.mesh.MUSTER[a.textur] || 0) : 0, texSkal: 0.5,
          bodenY: 0, bodenAO: ((DATA.bildStil && DATA.bildStil.kontaktschatten !== undefined) ? DATA.bildStil.kontaktschatten : 0.3) * 0.9
        });
      }
    }
  };

  Welt.prototype.kachelBauen = function (b, x, z, deko) {
    var a = this.arten[x + z * this.w];
    if (a.wand) return;
    var F = GAME.farbe;
    var jitter = 1 + (MM.hash2(x, z) - 0.5) * 0.05;
    var y00 = this.ecke(x, z), y10 = this.ecke(x + 1, z), y01 = this.ecke(x, z + 1), y11 = this.ecke(x + 1, z + 1);
    var n00 = eckNormale(this, x, z), n10 = eckNormale(this, x + 1, z), n01 = eckNormale(this, x, z + 1), n11 = eckNormale(this, x + 1, z + 1);
    var self = this;

    function viereck(ya, yb, yc, yd, farbe, muster, na, nb, nc, nd) {
      var fa = farbe, t = 0.5;
      var up = [0, 1, 0];
      na = na || up; nb = nb || up; nc = nc || up; nd = nd || up;
      // Ecken: (x,z) (x+1,z) (x,z+1) (x+1,z+1)
      var v = [
        [x, ya, z, na[0], na[1], na[2], fa[0], fa[1], fa[2], x * t, z * t, 0, 0, 0, muster],
        [x + 1, yb, z, nb[0], nb[1], nb[2], fa[0], fa[1], fa[2], (x + 1) * t, z * t, 0, 0, 0, muster],
        [x, yc, z + 1, nc[0], nc[1], nc[2], fa[0], fa[1], fa[2], x * t, (z + 1) * t, 0, 0, 0, muster],
        [x + 1, yd, z + 1, nd[0], nd[1], nd[2], fa[0], fa[1], fa[2], (x + 1) * t, (z + 1) * t, 0, 0, 0, muster]
      ];
      b.roh(v, [2, 3, 1, 2, 1, 0]);
    }

    if (a.wasser || a.steg) {
      var grund = F("seegrund"), wf = F(a.wasser ? a.farbe : "wasser"), nsand = F("sand_nass");
      // Seegrund: was über die Wasserlinie ragt, ist nasser Sand
      var gf = function (y) {
        var t = MM.clamp((y - WASSER_Y + 0.12) / 0.2, 0, 1);
        return [MM.lerp(grund[0], nsand[0], t) * jitter, MM.lerp(grund[1], nsand[1], t) * jitter, MM.lerp(grund[2], nsand[2], t) * jitter];
      };
      var g00 = gf(y00), g10 = gf(y10), g01 = gf(y01), g11 = gf(y11);
      b.roh([
        [x, y00, z, n00[0], n00[1], n00[2], g00[0], g00[1], g00[2], x * 0.5, z * 0.5, 0, 0, 0, 0],
        [x + 1, y10, z, n10[0], n10[1], n10[2], g10[0], g10[1], g10[2], (x + 1) * 0.5, z * 0.5, 0, 0, 0, 0],
        [x, y01, z + 1, n01[0], n01[1], n01[2], g01[0], g01[1], g01[2], x * 0.5, (z + 1) * 0.5, 0, 0, 0, 0],
        [x + 1, y11, z + 1, n11[0], n11[1], n11[2], g11[0], g11[1], g11[2], (x + 1) * 0.5, (z + 1) * 0.5, 0, 0, 0, 0]
      ], [2, 3, 1, 2, 1, 0]);
      // Wasseroberfläche: UV.x = Nähe zum Ufer (für Schaumlinien und flaches, helles Wasser)
      var ufer = function (cx, cz) {
        for (var dz = -1; dz <= 0; dz++) for (var dx = -1; dx <= 0; dx++) {
          var tx = cx + dx, tz = cz + dz;
          if (tx < 0 || tz < 0 || tx >= self.w || tz >= self.h) continue;
          if (!nass(self.arten[tx + tz * self.w])) return 1;
        }
        return 0;
      };
      b.roh([
        [x, WASSER_Y, z, 0, 1, 0, wf[0], wf[1], wf[2], ufer(x, z), 0, 0, 0, 0, 5],
        [x + 1, WASSER_Y, z, 0, 1, 0, wf[0], wf[1], wf[2], ufer(x + 1, z), 0, 0, 0, 0, 5],
        [x, WASSER_Y, z + 1, 0, 1, 0, wf[0], wf[1], wf[2], ufer(x, z + 1), 0, 0, 0, 0, 5],
        [x + 1, WASSER_Y, z + 1, 0, 1, 0, wf[0], wf[1], wf[2], ufer(x + 1, z + 1), 0, 0, 0, 0, 5]
      ], [2, 3, 1, 2, 1, 0]);
      if (a.steg) {
        var holz = F(a.farbe);
        b.add(ENG.mesh.form("box", { groesse: [1.0, 0.16, 0.98], rund: 0.03 }), {
          pos: [x + 0.5, STEG_Y - 0.08, z + 0.5], farbe: [holz[0] * jitter, holz[1] * jitter, holz[2] * jitter],
          muster: ENG.mesh.MUSTER[a.textur] || 0, texSkal: 0.5
        });
        // Pfosten an den Seiten, die ans Wasser grenzen
        var pfosten = F("holz_dunkel");
        [[-1, 0], [1, 0]].forEach(function (d) {
          if (a.pfosten === false || !self.art(x + d[0], z).wasser) return;
          b.add(ENG.mesh.form("zylinder", { r: 0.06, h: 0.8, seg: 8 }), { pos: [x + 0.5 + d[0] * 0.46, -0.32, z + 0.5], farbe: pfosten });
        });
      }
      return;
    }

    // Land: 4×4 Unterteilung. Weiche Bodenarten (Gras, Weg, Sand) blenden
    // ihre Farben an den Rändern ineinander, harte (Pflaster) bleiben scharf.
    var eigene = this.kachelFarbe(x, z), hart = !!a.hart;
    var muster = a.textur ? (ENG.mesh.MUSTER[a.textur] || 0) : 0;
    var vs = [], ts = [];
    var N = 4;
    for (var j = 0; j <= N; j++) {
      for (var i = 0; i <= N; i++) {
        var px = x + i / N, pz = z + j / N;
        var fa = hart ? eigene : this.mischFarbe(x, z, i === 0 ? 0 : (i === N ? 2 : 1), j === 0 ? 0 : (j === N ? 2 : 1), eigene);
        var ao = this.verdeckung(px, pz);
        if (ao < 1) fa = [fa[0] * ao, fa[1] * ao, fa[2] * ao * (0.96 + ao * 0.04)];
        var hy = this.hoeheBei(px, pz);
        var nl = this.hoeheBei(px - 0.5, pz), nr = this.hoeheBei(px + 0.5, pz);
        var no = this.hoeheBei(px, pz - 0.5), nu = this.hoeheBei(px, pz + 0.5);
        var nx = nl - nr, ny = 1, nz = no - nu, nlen = Math.sqrt(nx * nx + ny * ny + nz * nz);
        vs.push([px, hy, pz, nx / nlen, ny / nlen, nz / nlen, fa[0], fa[1], fa[2], px * 0.5, pz * 0.5, 0, 0, 0, muster]);
      }
    }
    for (j = 0; j < N; j++) {
      for (i = 0; i < N; i++) {
        var q = j * (N + 1) + i;
        ts.push(q + N + 1, q + N + 2, q + 1, q + N + 1, q + 1, q);
      }
    }
    b.roh(vs, ts);

    // Deko: Grasbüschel und kleine Blumen, auf Wegen ein paar Kiesel
    if (this.artNamen[x + z * this.w] === "gras" && !this.belegt[x + z * this.w]) this.dekoBauen(deko || b, x, z);
    else if (this.artNamen[x + z * this.w] === "weg") this.kieselBauen(deko || b, x, z);
  };

  /* Kontaktschatten am Boden: Wo Wände, Häuser und Möbel den Boden berühren,
     sammelt sich Farbe (wie Pigment in einer Ecke). 1 = frei, kleiner = dunkler. */
  Welt.prototype.verdeckung = function (px, pz) {
    var staerke = (DATA.bildStil && DATA.bildStil.kontaktschatten !== undefined) ? DATA.bildStil.kontaktschatten : 0.3;
    if (staerke <= 0) return 1;
    var WEIT = 0.85, nah = WEIT;
    var formen = this.koll.formenNahe(px, pz, WEIT + 0.5);
    for (var i = 0; i < formen.length; i++) {
      var f = formen[i], d;
      if (f.typ === "kreis") d = Math.sqrt((px - f.x) * (px - f.x) + (pz - f.z) * (pz - f.z)) - f.r;
      else {
        var wx = px - f.x, wz = pz - f.z;
        var lx = Math.abs(wx * f.c - wz * f.s) - f.hb, lz = Math.abs(wx * f.s + wz * f.c) - f.ht;
        d = Math.sqrt(Math.max(lx, 0) * Math.max(lx, 0) + Math.max(lz, 0) * Math.max(lz, 0)) + Math.min(Math.max(lx, lz), 0);
      }
      if (d < nah) nah = d;
    }
    // Wände (Innenräume)
    for (var tz = Math.floor(pz - 1); tz <= Math.floor(pz + 1); tz++) {
      for (var tx = Math.floor(px - 1); tx <= Math.floor(px + 1); tx++) {
        if (tx < 0 || tz < 0 || tx >= this.w || tz >= this.h || !this.arten[tx + tz * this.w].wand) continue;
        var dx = Math.max(tx - px, 0, px - tx - 1), dz = Math.max(tz - pz, 0, pz - tz - 1);
        var dw = Math.sqrt(dx * dx + dz * dz);
        if (dw < nah) nah = dw;
      }
    }
    var t = MM.clamp(1 - nah / WEIT, 0, 1);
    return 1 - staerke * t * t;
  };

  // Grundfarbe einer Landkachel (mit leichter Streuung), null bei Wasser
  Welt.prototype.kachelFarbe = function (x, z) {
    if (x < 0 || z < 0 || x >= this.w || z >= this.h) return null;
    var k = x + z * this.w;
    if (this.farbCache && this.farbCache[k] !== undefined) return this.farbCache[k];
    if (!this.farbCache) this.farbCache = {};
    var a = this.arten[k], F = GAME.farbe;
    if (a.wasser || a.steg) return (this.farbCache[k] = null);
    var farbe = F(a.farbe);
    if (this.artNamen[k] === "gras") {
      var hell = F("gras_hell");
      var n = 0.5 + 0.5 * Math.sin(x * 0.45 + Math.sin(z * 0.3) * 1.5) * Math.cos(z * 0.38 - x * 0.12);
      farbe = [MM.lerp(farbe[0], hell[0], n * 0.6), MM.lerp(farbe[1], hell[1], n * 0.6), MM.lerp(farbe[2], hell[2], n * 0.6)];
    }
    var jitter = 1 + (MM.hash2(x, z) - 0.5) * 0.05;
    return (this.farbCache[k] = [farbe[0] * jitter, farbe[1] * jitter, farbe[2] * jitter]);
  };

  // Mischfarbe an Unterpunkt (i, j ∈ 0…2) einer weichen Kachel
  Welt.prototype.mischFarbe = function (x, z, i, j, eigene) {
    if (i === 1 && j === 1) return eigene;
    var xs = i === 0 ? [x - 1, x] : (i === 2 ? [x, x + 1] : [x]);
    var zs = j === 0 ? [z - 1, z] : (j === 2 ? [z, z + 1] : [z]);
    var r = 0, g = 0, bl = 0, n = 0;
    for (var a = 0; a < xs.length; a++) {
      for (var c = 0; c < zs.length; c++) {
        var tx = xs[a], tz = zs[c];
        var art = this.art(tx, tz);
        if (art.hart && !(tx === x && tz === z)) continue;
        var f = this.kachelFarbe(tx, tz);
        if (!f) continue;
        r += f[0]; g += f[1]; bl += f[2]; n++;
      }
    }
    return n ? [r / n, g / n, bl / n] : eigene;
  };

  Welt.prototype.dekoBauen = function (b, x, z) {
    var r = MM.rng(x * 7919 + z * 104729 + 13);
    var F = GAME.farbe;
    if (r() < 0.38) {
      var bx = x + 0.2 + r() * 0.6, bz = z + 0.2 + r() * 0.6, by = this.hoeheBei(bx, bz);
      var gruen = [F("laub"), F("laub_dunkel"), F("laub_hell")];
      for (var i = 0; i < 3; i++) {
        var hh = 0.14 + r() * 0.1;
        b.add(ENG.mesh.form("kegel", { r: 0.035, h: hh, seg: 5 }), {
          pos: [bx + (r() - 0.5) * 0.12, by + hh / 2 - 0.01, bz + (r() - 0.5) * 0.12],
          rot: [(r() - 0.5) * 30, 0, (r() - 0.5) * 30], farbe: gruen[i % 3], wind: 0.5
        });
      }
    }
    if (r() < 0.07) {
      var fx = x + 0.2 + r() * 0.6, fz = z + 0.2 + r() * 0.6, fy = this.hoeheBei(fx, fz);
      var bluete = ["bluete_koralle", "bluete_gelb", "bluete_lila", "bluete_weiss"][Math.floor(r() * 4)];
      b.add(ENG.mesh.form("zylinder", { r: 0.012, h: 0.2, seg: 4 }), { pos: [fx, fy + 0.1, fz], farbe: F("laub_dunkel"), wind: 0.6 });
      b.add(ENG.mesh.form("kugel", { r: 0.055, seg: 7, ring: 5 }), { pos: [fx, fy + 0.22, fz], farbe: F(bluete), wind: 0.6 });
      b.add(ENG.mesh.form("kugel", { r: 0.025, seg: 6, ring: 4 }), { pos: [fx, fy + 0.25, fz + 0.035], farbe: F("bluete_gelb"), wind: 0.6 });
    }
  };

  // Kleine flache Steine auf Feldwegen – so heben sich Wege besser vom Gras ab
  Welt.prototype.kieselBauen = function (b, x, z) {
    var r = MM.rng(x * 3571 + z * 7919 + 5), F = GAME.farbe;
    var farben = [F("stein"), F("stein_hell"), F("holz_hell")];
    var n = r() < 0.5 ? 1 : 2;
    for (var i = 0; i < n; i++) {
      var kx = x + 0.15 + r() * 0.7, kz = z + 0.15 + r() * 0.7, ky = this.hoeheBei(kx, kz);
      b.add(ENG.mesh.form("kugel", { radien: [0.06 + r() * 0.04, 0.025, 0.05 + r() * 0.03], seg: 6, ring: 4 }), {
        pos: [kx, ky + 0.01, kz], rot: [0, r() * 180, 0], farbe: farben[Math.floor(r() * 3)]
      });
    }
  };

  // Offenes Meer rund um die Karte (eigenes Mesh)
  Welt.prototype.meerBauen = function () {
    var b = ENG.mesh.neu(), R = 44, s = 2, wf = GAME.farbe("wasser");
    for (var z = -R; z < this.h + R; z += s) {
      for (var x = -R; x < this.w + R; x += s) {
        if (x >= 0 && z >= 0 && x + s <= this.w && z + s <= this.h) continue;
        var v = [
          [x, WASSER_Y, z, 0, 1, 0, wf[0], wf[1], wf[2], 0, 0, 0, 0, 0, 5],
          [x + s, WASSER_Y, z, 0, 1, 0, wf[0], wf[1], wf[2], 0, 0, 0, 0, 0, 5],
          [x, WASSER_Y, z + s, 0, 1, 0, wf[0], wf[1], wf[2], 0, 0, 0, 0, 0, 5],
          [x + s, WASSER_Y, z + s, 0, 1, 0, wf[0], wf[1], wf[2], 0, 0, 0, 0, 0, 5]
        ];
        b.roh(v, [2, 3, 1, 2, 1, 0]);
      }
    }
    return b.fertig();
  };

  // Umgebung außerhalb einer Landkarte (flacher Boden in der Farbe von "aussen")
  Welt.prototype.randBauen = function () {
    var b = ENG.mesh.neu(), R = 30, s = 2, a = this.aussen, F = GAME.farbe;
    var f = F(a.farbe), mu = a.textur ? (ENG.mesh.MUSTER[a.textur] || 0) : 0;
    for (var z = -R; z < this.h + R; z += s) {
      for (var x = -R; x < this.w + R; x += s) {
        if (x >= 0 && z >= 0 && x + s <= this.w && z + s <= this.h) continue;
        var j = 1 + (MM.hash2(x, z) - 0.5) * 0.05, c = [f[0] * j, f[1] * j, f[2] * j];
        var v = [
          [x, -0.01, z, 0, 1, 0, c[0], c[1], c[2], x * 0.5, z * 0.5, 0, 0, 0, mu],
          [x + s, -0.01, z, 0, 1, 0, c[0], c[1], c[2], (x + s) * 0.5, z * 0.5, 0, 0, 0, mu],
          [x, -0.01, z + s, 0, 1, 0, c[0], c[1], c[2], x * 0.5, (z + s) * 0.5, 0, 0, 0, mu],
          [x + s, -0.01, z + s, 0, 1, 0, c[0], c[1], c[2], (x + s) * 0.5, (z + s) * 0.5, 0, 0, 0, mu]
        ];
        b.roh(v, [2, 3, 1, 2, 1, 0]);
      }
    }
    return b.fertig();
  };

  // In welchem Ausgang steht (x, z)?
  Welt.prototype.ausgangBei = function (x, z) {
    for (var i = 0; i < this.ausgaenge.length; i++) {
      var a = this.ausgaenge[i];
      if (x >= a.x0 && x <= a.x1 && z >= a.z0 && z <= a.z1) return a;
    }
    return null;
  };

  // ---------------- Zeichnen ----------------
  // Die nächsten Lichtquellen an der Kamera auswählen und an den Renderer geben
  var auswahl = [];
  function naeher(a, b) { return a.d - b.d; }
  Welt.prototype.lichterSetzen = function (kam) {
    var R = ENG.renderer, st = this.stimmung, cx = kam.ziel[0], cz = kam.ziel[2];
    auswahl.length = 0;
    if (R.licht) {
      for (var i = 0; i < this.lichtQuellen.length; i++) {
        var l = this.lichtQuellen[i], s = l.staerke * (l.lampe ? st.lampen : 1);
        var dx = l.x - cx, dz = l.z - cz, weit = 24 + l.radius;
        if (s <= 0.01 || dx * dx + dz * dz > weit * weit) continue;
        l.d = dx * dx + dz * dz;
        l.farbe[0] = l.grund[0] * s; l.farbe[1] = l.grund[1] * s; l.farbe[2] = l.grund[2] * s;
        auswahl.push(l);
      }
      auswahl.sort(naeher);
      if (auswahl.length > R.MAX_LICHTER) auswahl.length = R.MAX_LICHTER;
      // Lichthöfe um die Lampen (gemalter Schein)
      for (i = 0; i < auswahl.length; i++) {
        var q = auswahl[i];
        if (q.hof && q.lampe) R.lichthof(q.x, q.y, q.z, q.hof, q.grund, st.hof * Math.min(1, q.staerke));
      }
    }
    R.lichter(auswahl);
  };

  Welt.prototype.zeichnen = function (kam) {
    var R = ENG.renderer;
    this.lichterSetzen(kam);
    if (this.meer) R.mesh(this.meer);
    for (var i = 0; i < this.chunks.length; i++) {
      var c = this.chunks[i];
      if (R.sichtbar(c.min, c.max)) R.mesh(c, null, { kontur: Welt.KONTUR });
    }
    for (i = 0; R.deko !== false && i < this.dekoChunks.length; i++) {
      var d = this.dekoChunks[i];
      if (R.sichtbar(d.min, d.max)) R.mesh(d);
    }
  };

  Welt.prototype.schattenZeichnen = function (kam) {
    if (ENG.renderer.schattenAktiv()) return;   // echte Schlagschatten ersetzen die runden
    var self = this, hf = function (x, z) { return self.hoeheBei(x, z); };
    for (var i = 0; i < this.statSchatten.length; i++) {
      var s = this.statSchatten[i];
      var dx = s.x - kam.ziel[0], dz = s.z - kam.ziel[2];
      if (dx * dx + dz * dz > 900) continue;
      ENG.renderer.schatten(s.x, s.z, s.r, 0.3, hf);
    }
  };

  // ---------------- Wegsuche (für Klicken/Tippen) ----------------
  // Welche Kachelmitten sind begehbar? (einmal pro Karte berechnet)
  Welt.prototype.freiRaster = function () {
    if (this._frei) return this._frei;
    var w = this.w, h = this.h, frei = new Uint8Array(w * h);
    for (var z = 0; z < h; z++) for (var x = 0; x < w; x++) {
      if (this.koll.istGesperrt(x, z)) continue;
      var p = { x: x + 0.5, z: z + 0.5 };
      this.koll.aufloesen(p, 0.26);
      if (Math.abs(p.x - x - 0.5) < 0.3 && Math.abs(p.z - z - 0.5) < 0.3) frei[x + z * w] = 1;
    }
    return (this._frei = frei);
  };
  Welt.prototype.istFrei = function (x, z) {
    var tx = Math.floor(x), tz = Math.floor(z);
    if (tx < 0 || tz < 0 || tx >= this.w || tz >= this.h) return false;
    return !!this.freiRaster()[tx + tz * this.w];
  };
  function sichtFrei(welt, x0, z0, x1, z1) {
    var dx = x1 - x0, dz = z1 - z0, n = Math.ceil(Math.sqrt(dx * dx + dz * dz) / 0.2);
    for (var i = 1; i < n; i++) {
      var t = i / n, px = x0 + dx * t, pz = z0 + dz * t;
      if (!welt.istFrei(px, pz) || !welt.istFrei(px + 0.22, pz) || !welt.istFrei(px - 0.22, pz) ||
          !welt.istFrei(px, pz + 0.22) || !welt.istFrei(px, pz - 0.22)) return false;
    }
    return true;
  }
  /* A*-Suche von (x0, z0) nach (x1, z1). Gibt Wegpunkte zurück (ohne Start),
     oder null, wenn es keinen Weg gibt. Ist das Ziel selbst blockiert
     (z. B. ein Schild), endet der Weg auf der nächsten freien Kachel.     */
  Welt.prototype.weg = function (x0, z0, x1, z1) {
    var w = this.w, h = this.h, frei = this.freiRaster();
    var sx = MM.clamp(Math.floor(x0), 0, w - 1), sz = MM.clamp(Math.floor(z0), 0, h - 1);
    var zx = MM.clamp(Math.floor(x1), 0, w - 1), zz = MM.clamp(Math.floor(z1), 0, h - 1);
    if (!frei[zx + zz * w]) {
      var best = -1, bestD = 1e9;
      for (var dz = -3; dz <= 3; dz++) for (var dx = -3; dx <= 3; dx++) {
        var tx = zx + dx, tz = zz + dz;
        if (tx < 0 || tz < 0 || tx >= w || tz >= h || !frei[tx + tz * w]) continue;
        var dd = Math.pow(tx + 0.5 - x0, 2) * 0.05 + Math.pow(tx + 0.5 - x1, 2) + Math.pow(tz + 0.5 - z1, 2);
        if (dd < bestD) { bestD = dd; best = tx + tz * w; }
      }
      if (best < 0) return null;
      zx = best % w; zz = (best - zx) / w;
    }
    if (sichtFrei(this, x0, z0, x1, z1) && frei[Math.floor(x1) + Math.floor(z1) * w]) return [{ x: x1, z: z1 }];
    var start = sx + sz * w, ziel = zx + zz * w;
    var g = new Float32Array(w * h), von = new Int32Array(w * h), zu = new Uint8Array(w * h);
    for (var i = 0; i < w * h; i++) { g[i] = 1e9; von[i] = -1; }
    g[start] = 0;
    var offen = [start];
    function hz(k) { var kx = k % w, kz = (k - kx) / w; return Math.sqrt((kx - zx) * (kx - zx) + (kz - zz) * (kz - zz)); }
    var schritte = 0;
    while (offen.length && schritte++ < 4000) {
      var bi = 0;
      for (i = 1; i < offen.length; i++) if (g[offen[i]] + hz(offen[i]) < g[offen[bi]] + hz(offen[bi])) bi = i;
      var k = offen.splice(bi, 1)[0];
      if (k === ziel) break;
      zu[k] = 1;
      var kx = k % w, kz = (k - kx) / w;
      for (var nz = -1; nz <= 1; nz++) for (var nx = -1; nx <= 1; nx++) {
        if (!nx && !nz) continue;
        var ax = kx + nx, az = kz + nz;
        if (ax < 0 || az < 0 || ax >= w || az >= h) continue;
        var n = ax + az * w;
        if (zu[n] || (!frei[n] && n !== start)) continue;
        if (nx && nz && (!frei[kx + nx + kz * w] || !frei[kx + (kz + nz) * w])) continue;   // keine Ecken schneiden
        var ng = g[k] + (nx && nz ? 1.414 : 1);
        if (ng < g[n]) { g[n] = ng; von[n] = k; if (offen.indexOf(n) < 0) offen.push(n); }
      }
    }
    if (von[ziel] < 0 && ziel !== start) return null;
    var pfad = [];
    for (var p = ziel; p !== start && p >= 0; p = von[p]) pfad.unshift({ x: p % w + 0.5, z: Math.floor(p / w) + 0.5 });
    if (frei[Math.floor(x1) + Math.floor(z1) * w] && ziel === Math.floor(x1) + Math.floor(z1) * w) pfad[pfad.length - 1] = { x: x1, z: z1 };
    // Pfad glätten: Punkte überspringen, zu denen man direkt laufen kann
    var glatt = [], ax0 = x0, az0 = z0, j = 0;
    while (j < pfad.length) {
      var weit = j;
      for (var q = pfad.length - 1; q > j; q--) if (sichtFrei(this, ax0, az0, pfad[q].x, pfad[q].z)) { weit = q; break; }
      glatt.push(pfad[weit]);
      ax0 = pfad[weit].x; az0 = pfad[weit].z;
      j = weit + 1;
    }
    return glatt;
  };

  Welt.prototype.spawn = function (name) {
    var sp = (this.map.spawns || {})[name] || (this.map.spawns || {}).start || { x: this.w / 2, y: this.h / 2, blick: 0 };
    return { x: sp.x + 0.5, z: sp.y + 0.5, rot: (sp.blick || 0) * MM.DEG };
  };

  // ======================================================================
  //  Statische Hilfen
  // ======================================================================
  var tmpA = MM.m4(), tmpB = MM.m4(), tmpC = MM.m4();

  /* Prefab in einen Builder einbauen (Weltposition, Drehung in Grad) */
  Welt.prefabEinbauen = function (b, pf, x, y, z, rotGrad) {
    var bodenAO = ((DATA.bildStil && DATA.bildStil.kontaktschatten !== undefined) ? DATA.bildStil.kontaktschatten : 0.3) * 0.9;
    MM.m4compose(tmpA, x, y, z, 0, rotGrad * MM.DEG, 0, 1, 1, 1);
    for (var i = 0; i < pf.teile.length; i++) {
      var t = pf.teile[i];
      var p = t.pos || [0, 0, 0], r = t.rot || [0, 0, 0];
      MM.m4compose(tmpB, p[0], p[1], p[2], r[0] * MM.DEG, r[1] * MM.DEG, r[2] * MM.DEG, 1, 1, 1);
      MM.m4mul(tmpC, tmpA, tmpB);
      b.add(ENG.mesh.form(t.form, t), {
        m: tmpC,
        farbe: GAME.farbe(t.farbe || "grau"),
        wind: t.wind || 0,
        // leuchtende Teile (Lampen) und Fensterscheiben bekommen eigene Muster-Nummern für den Shader
        muster: t.leuchten ? ENG.mesh.MUSTER.leuchten
          : (t.farbe === "fenster" && t.fenster !== false) ? ENG.mesh.MUSTER.fenster
          : t.textur ? (ENG.mesh.MUSTER[t.textur] || 0) : 0,
        texSkal: 0.6,
        bodenY: y, bodenAO: bodenAO
      });
    }
  };

  /* Umgebung (Licht, Himmel) aus einer Stimmung in palette.js.
     Fehlende Lichtwerte kommen aus DATA.lichtStandard (ebenfalls palette.js). */
  Welt.umgebung = function (st) {
    var F = GAME.farbe, L = DATA.lichtStandard || {}, B = DATA.bildStil || {};
    function w(n) { return st[n] !== undefined ? st[n] : L[n]; }
    function zahl(n, s) { return B[n] !== undefined ? B[n] : s; }
    var sonne = F(st.sonne);
    var r = w("sonnen_richtung") || [-0.25, 0.85, 0.62], l = Math.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
    return {
      oben: F(st.himmel_oben), horizont: F(st.horizont), dunst: F(st.dunst),
      sonne: [sonne[0] * 1.02, sonne[1] * 1.02, sonne[2] * 1.02],
      schatten: F(st.schatten),
      sonnenRichtung: [r[0] / l, r[1] / l, r[2] / l],
      dunstWeite: [26, 60],
      kruemmung: st.kruemmung || 0,
      schattenFarbe: [0.3, 0.27, 0.45],
      tusche: F(st.tusche || "tusche"),
      papier: F(st.papier || "papier"),
      // Licht
      rueck: F(w("rueckstrahl") || st.schatten), rueckStaerke: w("rueckstrahl_staerke") || 0,
      wolken: w("wolken") || 0,
      lampen: w("lampen") || 0,
      hof: w("lichthof") || 0,
      fenster: w("fenster") || 0,
      fensterLicht: F(w("fenster_licht") || "laterne_licht"),
      schlagschatten: w("schlagschatten") || 0,
      lichtkante: zahl("lichtkante", 0.6),
      pollen: w("pollen") || 0, pollenFarbe: F(w("pollen_farbe") || "pollen"),
      // Nachbearbeitung (DATA.bildStil in palette.js)
      bild: {
        wackeln: zahl("wackeln", 1), kante: zahl("pigmentrand", 1.2), rand: zahl("papierrand", 1),
        faser: zahl("papierfaser", 1), saettigung: zahl("saettigung", 1.06),
        lichterTon: F(B.lichter_ton || [1, 1, 1]), schattenTon: F(B.schatten_ton || [1, 1, 1]),
        schleier: zahl("lichtschleier", 0.3), schleierFarbe: F(B.lichtschleier_farbe || "lichtschleier")
      }
    };
  };

  Welt.WASSER_Y = WASSER_Y;
  Welt.KONTUR = 0.0021;   // Linienbreite der Tusche-Konturen (relativ zum Abstand)
  return Welt;
})();
