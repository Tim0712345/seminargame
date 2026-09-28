/* =====================================================================
   Die Lücke – Engine: Grundformen und Mesh-Zusammenfassung
   ---------------------------------------------------------------------
   Grundformen: kugel, box (abgerundet), zylinder, kegel, kapsel, torus.
   Der Builder fasst beliebig viele Formen zu EINEM Mesh zusammen
   (wenige Draw-Calls). Eckpunkt-Format (15 Floats):
     Position(3) Normale(3) Farbe(3) UV(2) Extra(4)
     Extra = [Knochen, Wind, Gesicht (0/1 Augen/2 Mund), Muster]
     Muster: 0 keins, 1 Gras, 2 Pflaster, 3 Holz, 4 Kopfstein, 5 Wasser,
             6 leuchtend (Lampe), 7 Fenster
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.mesh = (function () {
  "use strict";
  var MM = ENG.math;
  var M = {};
  var cache = {};
  M.STRIDE = 15;
  M.MUSTER = { gras: 1, pflaster: 2, holz: 3, kopfstein: 4, wasser: 5, leuchten: 6, fenster: 7 };

  function geo() { return { p: [], n: [], uv: [], i: [] }; }
  function r3(v) { return Math.round(v * 1000) / 1000; }

  // ---------------- Kugel (auch Teilstücke) ----------------
  // Koordinaten: x = sinθ·sinφ, y = cosθ, z = sinθ·cosφ  (φ = 0 zeigt nach vorn, +Z)
  function kugel(seg, ring, lat0, lat1, lon0, lon1) {
    var g = geo();
    for (var r = 0; r <= ring; r++) {
      var th = lat0 + (lat1 - lat0) * r / ring;
      var st = Math.sin(th), ct = Math.cos(th);
      for (var s = 0; s <= seg; s++) {
        var ph = lon0 + (lon1 - lon0) * s / seg;
        var x = st * Math.sin(ph), y = ct, z = st * Math.cos(ph);
        g.p.push(x, y, z); g.n.push(x, y, z); g.uv.push(s / seg, r / ring);
      }
    }
    for (r = 0; r < ring; r++) {
      for (s = 0; s < seg; s++) {
        var a = r * (seg + 1) + s, b = a + seg + 1;
        g.i.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    return g;
  }

  // ---------------- Kapsel ----------------
  function kapsel(radius, laenge, seg, ring) {
    var g = geo(), zeilen = [], k, half = ring / 2;
    for (k = 0; k <= half; k++) zeilen.push([Math.PI * k / ring, laenge / 2]);
    for (k = half; k <= ring; k++) zeilen.push([Math.PI * k / ring, -laenge / 2]);
    for (var r = 0; r < zeilen.length; r++) {
      var th = zeilen[r][0], off = zeilen[r][1], st = Math.sin(th), ct = Math.cos(th);
      for (var s = 0; s <= seg; s++) {
        var ph = Math.PI * 2 * s / seg;
        var nx = st * Math.sin(ph), ny = ct, nz = st * Math.cos(ph);
        g.p.push(nx * radius, ny * radius + off, nz * radius);
        g.n.push(nx, ny, nz);
        g.uv.push(s / seg, r / (zeilen.length - 1));
      }
    }
    for (r = 0; r < zeilen.length - 1; r++) {
      for (s = 0; s < seg; s++) {
        var a = r * (seg + 1) + s, b = a + seg + 1;
        g.i.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    return g;
  }

  // ---------------- Zylinder / Kegel ----------------
  function zylinder(rUnten, rOben, h, seg, deckel) {
    var g = geo(), s, ph;
    var neig = (rUnten - rOben) / h;
    for (var ring = 0; ring < 2; ring++) {
      var y = ring === 0 ? -h / 2 : h / 2, rad = ring === 0 ? rUnten : rOben;
      for (s = 0; s <= seg; s++) {
        ph = Math.PI * 2 * s / seg;
        var sx = Math.sin(ph), sz = Math.cos(ph);
        var l = Math.sqrt(1 + neig * neig);
        g.p.push(sx * rad, y, sz * rad);
        g.n.push(sx / l, neig / l, sz / l);
        g.uv.push(s / seg, ring);
      }
    }
    for (s = 0; s < seg; s++) {
      var a = s, b = s + 1, c = s + seg + 1, d = s + seg + 2;
      g.i.push(a, b, c, b, d, c);
    }
    if (deckel) {
      [[h / 2, rOben, 1], [-h / 2, rUnten, -1]].forEach(function (dk) {
        if (dk[1] <= 0.0001) return;
        var start = g.p.length / 3;
        g.p.push(0, dk[0], 0); g.n.push(0, dk[2], 0); g.uv.push(0.5, 0.5);
        for (var k = 0; k <= seg; k++) {
          var p2 = Math.PI * 2 * k / seg;
          g.p.push(Math.sin(p2) * dk[1], dk[0], Math.cos(p2) * dk[1]);
          g.n.push(0, dk[2], 0); g.uv.push(0, 0);
        }
        for (k = 0; k < seg; k++) {
          if (dk[2] > 0) g.i.push(start, start + 1 + k, start + 2 + k);
          else g.i.push(start, start + 2 + k, start + 1 + k);
        }
      });
    }
    return g;
  }

  // ---------------- Abgerundete Box ----------------
  function box(w, h, d, rad, ecke) {
    var g = geo();
    var half = [w / 2, h / 2, d / 2];
    rad = Math.max(0, Math.min(rad, half[0], half[1], half[2]));
    var inner = [half[0] - rad, half[1] - rad, half[2] - rad];
    // Koordinaten je Achse: dichter an den Kanten, damit die Rundung glatt wird
    function koords(a) {
      var list = [], k;
      if (rad <= 0) return [-half[a], half[a]];
      for (k = ecke; k >= 1; k--) list.push(-(inner[a] + rad * Math.tan(k / ecke * Math.PI / 4)));
      list.push(-inner[a]);
      if (inner[a] > 0.0001) list.push(inner[a]);
      for (k = 1; k <= ecke; k++) list.push(inner[a] + rad * Math.tan(k / ecke * Math.PI / 4));
      return list;
    }
    var K = [koords(0), koords(1), koords(2)];
    // Flächen: [Normalen-Achse, Vorzeichen, u-Achse, v-Achse] mit u × v = Normale
    var flaechen = [[0, 1, 1, 2], [0, -1, 2, 1], [1, 1, 2, 0], [1, -1, 0, 2], [2, 1, 0, 1], [2, -1, 1, 0]];
    flaechen.forEach(function (f) {
      var ax = f[0], sg = f[1], ua = f[2], va = f[3];
      var U = K[ua], V = K[va], start = g.p.length / 3;
      for (var j = 0; j < V.length; j++) {
        for (var i = 0; i < U.length; i++) {
          var p = [0, 0, 0];
          p[ax] = sg * half[ax]; p[ua] = U[i]; p[va] = V[j];
          var q = [MM.clamp(p[0], -inner[0], inner[0]), MM.clamp(p[1], -inner[1], inner[1]), MM.clamp(p[2], -inner[2], inner[2])];
          var nx = p[0] - q[0], ny = p[1] - q[1], nz = p[2] - q[2];
          var l = Math.sqrt(nx * nx + ny * ny + nz * nz);
          if (l < 1e-6 || rad <= 0) { nx = 0; ny = 0; nz = 0; if (ax === 0) nx = sg; else if (ax === 1) ny = sg; else nz = sg; l = 1; }
          nx /= l; ny /= l; nz /= l;
          if (rad > 0) g.p.push(q[0] + nx * rad, q[1] + ny * rad, q[2] + nz * rad);
          else g.p.push(p[0], p[1], p[2]);
          g.n.push(nx, ny, nz);
          g.uv.push(i / (U.length - 1), j / (V.length - 1));
        }
      }
      for (j = 0; j < V.length - 1; j++) {
        for (i = 0; i < U.length - 1; i++) {
          var a = start + j * U.length + i, b = a + 1, c = a + U.length, d = c + 1;
          g.i.push(a, b, c, b, d, c);
        }
      }
    });
    return g;
  }

  // ---------------- Torus (Ring in der x/y-Ebene) ----------------
  function torus(R, r, seg, rohr) {
    var g = geo();
    for (var j = 0; j <= rohr; j++) {
      var b = Math.PI * 2 * j / rohr;
      for (var i = 0; i <= seg; i++) {
        var a = Math.PI * 2 * i / seg;
        var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
        g.p.push((R + r * cb) * ca, (R + r * cb) * sa, r * sb);
        g.n.push(cb * ca, cb * sa, sb);
        g.uv.push(i / seg, j / rohr);
      }
    }
    for (j = 0; j < rohr; j++) {
      for (i = 0; i < seg; i++) {
        var p0 = j * (seg + 1) + i, p1 = p0 + 1, p2 = p0 + seg + 1, p3 = p2 + 1;
        g.i.push(p0, p1, p2, p1, p3, p2);
      }
    }
    return g;
  }

  /* Form mit Maßen holen (zwischengespeichert).
     Liefert { g: Geometrie, s: [sx, sy, sz] zusätzliche Skalierung }  */
  M.form = function (name, t, fein) {
    // Automatische Detailstufe: kleine Formen bekommen weniger Dreiecke
    function stufe(v, a, b) { return Math.max(a, Math.min(b, Math.round(v))); }
    var key, s = [1, 1, 1];
    switch (name) {
      case "kugel": {
        var rr = t.radien || [t.r || 0.5, t.r || 0.5, t.r || 0.5];
        s = rr;
        var la0 = t.lat0 || 0, la1 = t.lat1 === undefined ? Math.PI : t.lat1;
        var lo0 = t.lon0 || 0, lo1 = t.lon1 === undefined ? Math.PI * 2 : t.lon1;
        var rmax = Math.max(rr[0], rr[1], rr[2]);
        var seg = t.seg || stufe((6 + rmax * 26) * (fein && rmax > 0.12 ? 1.2 : 1) * Math.max(0.35, (lo1 - lo0) / (Math.PI * 2)), 4, 18);
        var ring = t.ring || stufe((4 + rmax * 18) * Math.max(0.35, (la1 - la0) / Math.PI), 2, 13);
        key = "k" + seg + "_" + ring + "_" + r3(la0) + "_" + r3(la1) + "_" + r3(lo0) + "_" + r3(lo1);
        if (!cache[key]) cache[key] = kugel(seg, ring, la0, la1, lo0, lo1);
        break;
      }
      case "box": {
        var gr = t.groesse || [1, 1, 1], rund = t.rund === undefined ? 0.04 : t.rund;
        var ecke = rund <= 0 ? 0 : (rund <= 0.016 ? 1 : (rund >= 0.06 && fein ? 3 : 2));
        key = "b" + r3(gr[0]) + "_" + r3(gr[1]) + "_" + r3(gr[2]) + "_" + r3(rund) + "_" + ecke;
        if (!cache[key]) cache[key] = box(gr[0], gr[1], gr[2], rund, ecke);
        break;
      }
      case "zylinder":
      case "kegel": {
        var ru = t.r || 0.5, ro = name === "kegel" ? 0 : (t.rOben === undefined ? ru : t.rOben);
        var zs = t.seg || stufe(7 + Math.max(ru, ro) * 24, 5, 16);
        key = "z" + r3(ru) + "_" + r3(ro) + "_" + r3(t.h || 1) + "_" + zs;
        if (!cache[key]) cache[key] = zylinder(ru, ro, t.h || 1, zs, true);
        break;
      }
      case "kapsel": {
        var kr = t.r || 0.2, kh = Math.max(0, (t.h || 0.6) - 2 * kr);
        var ks = t.seg || stufe(7 + kr * 30, 6, 14), kring = t.ring || stufe(4 + kr * 16, 4, 8);
        if (kring % 2) kring++;
        key = "c" + r3(kr) + "_" + r3(kh) + "_" + ks + "_" + kring;
        if (!cache[key]) cache[key] = kapsel(kr, kh, ks, kring);
        break;
      }
      case "torus": {
        var R0 = t.R || 0.3, r0 = t.r || 0.05;
        var ts = t.seg || stufe(8 + R0 * 40, 8, 24), tr = t.rohr || stufe(4 + r0 * 60, 4, 8);
        key = "t" + r3(R0) + "_" + r3(r0) + "_" + ts + "_" + tr;
        if (!cache[key]) cache[key] = torus(R0, r0, ts, tr);
        break;
      }
      default:
        throw new Error("Unbekannte Form: " + name);
    }
    return { g: cache[key], s: s };
  };

  // ---------------- Builder ----------------
  function Builder() {
    this.teile = [];
    this.v = [];
    this.idx = [];
    this.n = 0;
    this.min = [Infinity, Infinity, Infinity];
    this.max = [-Infinity, -Infinity, -Infinity];
  }
  var tmpM = MM.m4(), tmpN = new Float32Array(9);

  Builder.prototype.abschliessenTeil = function () {
    if (this.n === 0) return;
    this.teile.push({ v: this.v, i: this.idx, n: this.n });
    this.v = []; this.idx = []; this.n = 0;
  };

  /* Form hinzufügen.
     o: { m (Matrix) | pos, rot (Grad), skal } , farbe [r,g,b],
        knochen, wind, gesicht, muster, uvGeo (UV der Form behalten),
        texSkal (Muster-Maßstab)                                      */
  Builder.prototype.add = function (form, o) {
    var g = form.g, s = form.s;
    var nv = g.p.length / 3;
    if (this.n + nv > 65000) this.abschliessenTeil();
    var m = tmpM;
    if (o.m) {
      MM.m4copy(m, o.m);
      if (s[0] !== 1 || s[1] !== 1 || s[2] !== 1) {
        for (var c = 0; c < 3; c++) { m[c] *= s[0]; m[4 + c] *= s[1]; m[8 + c] *= s[2]; }
      }
    } else {
      var p = o.pos || [0, 0, 0], r = o.rot || [0, 0, 0], sk = o.skal || [1, 1, 1];
      MM.m4compose(m, p[0], p[1], p[2], r[0] * MM.DEG, r[1] * MM.DEG, r[2] * MM.DEG, sk[0] * s[0], sk[1] * s[1], sk[2] * s[2]);
    }
    MM.m3normal(tmpN, m);
    var farbe = o.farbe || [1, 1, 1];
    var kn = o.knochen || 0, wind = o.wind || 0, gs = o.gesicht || 0, mu = o.muster || 0;
    var ts = o.texSkal || 0.5;
    var basis = this.n, v = this.v;
    for (var i = 0; i < nv; i++) {
      var px = g.p[i * 3], py = g.p[i * 3 + 1], pz = g.p[i * 3 + 2];
      var nx = g.n[i * 3], ny = g.n[i * 3 + 1], nz = g.n[i * 3 + 2];
      var wx = m[0] * px + m[4] * py + m[8] * pz + m[12];
      var wy = m[1] * px + m[5] * py + m[9] * pz + m[13];
      var wz = m[2] * px + m[6] * py + m[10] * pz + m[14];
      var tx = tmpN[0] * nx + tmpN[3] * ny + tmpN[6] * nz;
      var ty = tmpN[1] * nx + tmpN[4] * ny + tmpN[7] * nz;
      var tz = tmpN[2] * nx + tmpN[5] * ny + tmpN[8] * nz;
      var l = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
      tx /= l; ty /= l; tz /= l;
      var u, w;
      if (o.uvGeo) { u = g.uv[i * 2]; w = g.uv[i * 2 + 1]; }
      else {
        // Planare Projektion entlang der Hauptrichtung der Normale
        var ax = Math.abs(tx), ay = Math.abs(ty), az = Math.abs(tz);
        if (ay >= ax && ay >= az) { u = wx * ts; w = wz * ts; }
        else if (ax >= az) { u = wz * ts; w = wy * ts; }
        else { u = wx * ts; w = wy * ts; }
      }
      v.push(wx, wy, wz, tx, ty, tz, farbe[0], farbe[1], farbe[2], u, w, kn, wind, gs, mu);
      if (wx < this.min[0]) this.min[0] = wx; if (wx > this.max[0]) this.max[0] = wx;
      if (wy < this.min[1]) this.min[1] = wy; if (wy > this.max[1]) this.max[1] = wy;
      if (wz < this.min[2]) this.min[2] = wz; if (wz > this.max[2]) this.max[2] = wz;
    }
    for (i = 0; i < g.i.length; i++) this.idx.push(g.i[i] + basis);
    this.n += nv;
  };

  /* Rohe Eckpunkte direkt hinzufügen (z. B. Boden).
     verts: Liste von [x,y,z, nx,ny,nz, r,g,b, u,v, knochen,wind,gesicht,muster]
     tris: Indizes relativ zu verts                                      */
  Builder.prototype.roh = function (verts, tris) {
    if (this.n + verts.length > 65000) this.abschliessenTeil();
    var basis = this.n;
    for (var i = 0; i < verts.length; i++) {
      var q = verts[i];
      for (var k = 0; k < 15; k++) this.v.push(q[k]);
      if (q[0] < this.min[0]) this.min[0] = q[0]; if (q[0] > this.max[0]) this.max[0] = q[0];
      if (q[1] < this.min[1]) this.min[1] = q[1]; if (q[1] > this.max[1]) this.max[1] = q[1];
      if (q[2] < this.min[2]) this.min[2] = q[2]; if (q[2] > this.max[2]) this.max[2] = q[2];
    }
    for (i = 0; i < tris.length; i++) this.idx.push(tris[i] + basis);
    this.n += verts.length;
  };

  Builder.prototype.leer = function () { return this.teile.length === 0 && this.n === 0; };

  // GPU-Buffer erzeugen
  Builder.prototype.fertig = function () {
    this.abschliessenTeil();
    var gl = ENG.gl.gl;
    var mesh = { teile: [], min: this.min.slice(), max: this.max.slice(), dreiecke: 0 };
    for (var t = 0; t < this.teile.length; t++) {
      var tl = this.teile[t];
      mesh.teile.push({
        vbo: ENG.gl.buffer(new Float32Array(tl.v), gl.ARRAY_BUFFER),
        ibo: ENG.gl.buffer(new Uint16Array(tl.i), gl.ELEMENT_ARRAY_BUFFER),
        anzahl: tl.i.length
      });
      mesh.dreiecke += tl.i.length / 3;
    }
    this.teile = [];
    return mesh;
  };

  M.Builder = Builder;
  M.neu = function () { return new Builder(); };

  return M;
})();
