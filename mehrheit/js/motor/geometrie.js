/* =====================================================================
   js/motor/geometrie.js – Grundkörper aus Code
   ---------------------------------------------------------------------
   Box mit Fase (abgerundete Kanten), Drehkörper aus Profil, Kugel,
   Kapsel, Ringsegment, Rohr entlang Kurve, unterteilte Ebene.
   Ein „geo“ ist { p:[], n:[], uv:[], i:[], ao:[], k:[] } (einfache Arrays).
   UV-Koordinaten sind in Metern, damit Strukturen überall gleich groß sind.
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.geo = (function () {
  var G = {};
  var M = MOTOR.m;

  G.leer = function () { return { p: [], n: [], uv: [], i: [], ao: [], k: [] }; };

  function vert(g, x, y, z, nx, ny, nz, u, v) {
    g.p.push(x, y, z); g.n.push(nx, ny, nz); g.uv.push(u, v);
    return g.p.length / 3 - 1;
  }

  /* Dreiecke so drehen, dass sie nach außen zeigen (Vergleich mit den Normalen) */
  G.windung = function (g) {
    var p = g.p, n = g.n, ix = g.i;
    for (var t = 0; t < ix.length; t += 3) {
      var a = ix[t] * 3, b = ix[t + 1] * 3, c = ix[t + 2] * 3;
      var e1x = p[b] - p[a], e1y = p[b + 1] - p[a + 1], e1z = p[b + 2] - p[a + 2];
      var e2x = p[c] - p[a], e2y = p[c + 1] - p[a + 1], e2z = p[c + 2] - p[a + 2];
      var fx = e1y * e2z - e1z * e2y, fy = e1z * e2x - e1x * e2z, fz = e1x * e2y - e1y * e2x;
      var sx = n[a] + n[b] + n[c], sy = n[a + 1] + n[b + 1] + n[c + 1], sz = n[a + 2] + n[b + 2] + n[c + 2];
      if (fx * sx + fy * sy + fz * sz < 0) { var h = ix[t + 1]; ix[t + 1] = ix[t + 2]; ix[t + 2] = h; }
    }
    return g;
  };

  /* ---------- Box mit Fase ---------- */
  G.box = function (b, h, t, fase, seg) {
    var g = G.leer();
    var E = [b / 2, h / 2, t / 2];
    fase = Math.max(0, Math.min(fase || 0, E[0] * 0.99, E[1] * 0.99, E[2] * 0.99));
    seg = fase > 0 ? (seg || 2) : 0;
    var I = [E[0] - fase, E[1] - fase, E[2] - fase];
    function liste(ax) {
      if (!seg) return [-E[ax], E[ax]];
      var L = [], i;
      for (i = seg; i >= 1; i--) L.push(-I[ax] - fase * i / seg);
      L.push(-I[ax]); L.push(I[ax]);
      for (i = 1; i <= seg; i++) L.push(I[ax] + fase * i / seg);
      return L;
    }
    var flaechen = [[0, 2, 1], [1, 0, 2], [2, 0, 1]];
    for (var f = 0; f < 3; f++) {
      var ax = flaechen[f][0], au = flaechen[f][1], av = flaechen[f][2];
      var Lu = liste(au), Lv = liste(av);
      for (var sg = -1; sg <= 1; sg += 2) {
        var start = g.p.length / 3;
        for (var iv = 0; iv < Lv.length; iv++) {
          for (var iu = 0; iu < Lu.length; iu++) {
            var pt = [0, 0, 0];
            pt[ax] = sg * E[ax]; pt[au] = Lu[iu]; pt[av] = Lv[iv];
            var c = [M.klemme(pt[0], -I[0], I[0]), M.klemme(pt[1], -I[1], I[1]), M.klemme(pt[2], -I[2], I[2])];
            var d = [pt[0] - c[0], pt[1] - c[1], pt[2] - c[2]];
            var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
            var nn, pos;
            if (l > 1e-9 && fase > 0) { nn = [d[0] / l, d[1] / l, d[2] / l]; pos = [c[0] + nn[0] * fase, c[1] + nn[1] * fase, c[2] + nn[2] * fase]; }
            else { nn = [0, 0, 0]; nn[ax] = sg; pos = pt; }
            vert(g, pos[0], pos[1], pos[2], nn[0], nn[1], nn[2], pos[au], pos[av]);
          }
        }
        var nu = Lu.length;
        for (iv = 0; iv < Lv.length - 1; iv++) for (iu = 0; iu < nu - 1; iu++) {
          var a = start + iv * nu + iu, bb = a + 1, cc = a + nu + 1, dd = a + nu;
          g.i.push(a, bb, cc, a, cc, dd);
        }
      }
    }
    return G.windung(g);
  };

  /* ---------- Drehkörper ----------
     profil: [[r, y], …] von unten nach oben. Doppelte Punkte = scharfe Kante.
     opt: { winkel:[von,bis] (Bogenmaß), deckelUnten, deckelOben, enden (Schnittflächen bei Teilwinkel), sx, sz } */
  G.drehkoerper = function (profil, seg, opt) {
    opt = opt || {};
    var g = G.leer();
    var w0 = opt.winkel ? opt.winkel[0] : 0, w1 = opt.winkel ? opt.winkel[1] : Math.PI * 2;
    var sx = opt.sx || 1, sz = opt.sz || 1;
    var n = profil.length;
    // Normalen im Profil (2D)
    var pn = [], bogen = [0];
    for (var i = 0; i < n; i++) {
      var vor = i > 0 && !(profil[i - 1][0] === profil[i][0] && profil[i - 1][1] === profil[i][1]) ? profil[i - 1] : null;
      var nach = i < n - 1 && !(profil[i + 1][0] === profil[i][0] && profil[i + 1][1] === profil[i][1]) ? profil[i + 1] : null;
      var a = vor || profil[i], b = nach || profil[i];
      var tr = b[0] - a[0], ty = b[1] - a[1];
      var l = Math.sqrt(tr * tr + ty * ty) || 1;
      pn.push([ty / l, -tr / l]);
      if (i > 0) bogen.push(bogen[i - 1] + Math.hypot(profil[i][0] - profil[i - 1][0], profil[i][1] - profil[i - 1][1]));
    }
    var rMittel = 0; for (i = 0; i < n; i++) rMittel += profil[i][0]; rMittel = rMittel / n;
    for (i = 0; i < n; i++) {
      for (var j = 0; j <= seg; j++) {
        var w = w0 + (w1 - w0) * j / seg, c = Math.cos(w), s = Math.sin(w);
        var r = profil[i][0];
        var nx = pn[i][0] * c / sx, nz = pn[i][0] * s / sz, ny = pn[i][1];
        var nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        vert(g, r * c * sx, profil[i][1], r * s * sz, nx / nl, ny / nl, nz / nl, (w - w0) * Math.max(rMittel, 0.02), bogen[i]);
      }
    }
    var reihe = seg + 1;
    for (i = 0; i < n - 1; i++) {
      if (profil[i][0] === profil[i + 1][0] && profil[i][1] === profil[i + 1][1]) continue;
      for (j = 0; j < seg; j++) {
        var A = i * reihe + j, B = A + 1, C = A + reihe + 1, D = A + reihe;
        g.i.push(A, D, C, A, C, B);
      }
    }
    function deckel(idx, richtung) {
      var r = profil[idx][0], y = profil[idx][1];
      if (r <= 1e-6) return;
      var mitte = vert(g, 0, y, 0, 0, richtung, 0, 0, 0);
      var st = g.p.length / 3;
      for (var j = 0; j <= seg; j++) {
        var w = w0 + (w1 - w0) * j / seg;
        vert(g, r * Math.cos(w) * sx, y, r * Math.sin(w) * sz, 0, richtung, 0, r * Math.cos(w) * sx, r * Math.sin(w) * sz);
      }
      for (j = 0; j < seg; j++) g.i.push(mitte, st + j, st + j + 1);
    }
    if (opt.deckelUnten) deckel(0, -1);
    if (opt.deckelOben) deckel(n - 1, 1);
    if (opt.enden && opt.winkel) {
      [w0, w1].forEach(function (w, k) {
        var c = Math.cos(w), s = Math.sin(w);
        var nrm = k === 0 ? [s, 0, -c] : [-s, 0, c];
        var st = g.p.length / 3;
        var cy = 0, cr = 0;
        for (var i = 0; i < n; i++) { cr += profil[i][0]; cy += profil[i][1]; }
        cr /= n; cy /= n;
        var mitte = vert(g, cr * c * sx, cy, cr * s * sz, nrm[0], nrm[1], nrm[2], cr, cy);
        st = g.p.length / 3;
        for (i = 0; i < n; i++) vert(g, profil[i][0] * c * sx, profil[i][1], profil[i][0] * s * sz, nrm[0], nrm[1], nrm[2], profil[i][0], profil[i][1]);
        for (i = 0; i < n - 1; i++) g.i.push(mitte, st + i, st + i + 1);
      });
    }
    return G.windung(g);
  };

  G.kugel = function (r, seg, ringe) {
    var p = [], R = ringe || Math.max(4, Math.round(seg / 2));
    for (var i = 0; i <= R; i++) { var a = -Math.PI / 2 + Math.PI * i / R; p.push([Math.cos(a) * r, Math.sin(a) * r]); }
    p[0][0] = 0; p[R][0] = 0;
    return G.drehkoerper(p, seg);
  };

  G.kapsel = function (r, laenge, seg, ringe) {
    var p = [], R = ringe || 4, i, a;
    for (i = 0; i <= R; i++) { a = -Math.PI / 2 + Math.PI / 2 * i / R; p.push([Math.cos(a) * r, Math.sin(a) * r]); }
    for (i = 0; i <= R; i++) { a = Math.PI / 2 * i / R; p.push([Math.cos(a) * r, laenge + Math.sin(a) * r]); }
    p[0][0] = 0; p[p.length - 1][0] = 0;
    return G.drehkoerper(p, seg);
  };

  G.zylinder = function (r, h, seg, deckel, fase) {
    var f = fase || 0, p;
    if (f > 0) p = [[r - f, 0], [r - f, 0], [r, f], [r, f], [r, h - f], [r, h - f], [r - f, h], [r - f, h]];
    else p = [[r, 0], [r, 0], [r, h], [r, h]];
    p = p.filter(function (x, i) { return true; });
    var opt = { deckelUnten: deckel !== false, deckelOben: deckel !== false };
    return G.drehkoerper(p, seg, opt);
  };

  /* Ringsegment (gebogener Tisch, Stufe): Querschnitt mit Fase an der Oberkante */
  G.ringsegment = function (rI, rA, w0, w1, h, seg, fase) {
    var f = Math.min(fase || 0, (rA - rI) / 3, h / 3);
    var p = [[rI, 0], [rI, 0], [rA, 0], [rA, 0], [rA, h - f], [rA, h - f]];
    if (f > 0) p.push([rA - f, h], [rA - f, h]); else p.push([rA, h], [rA, h]);
    if (f > 0) p.push([rI + f, h], [rI + f, h], [rI, h - f], [rI, h - f]); else p.push([rI, h], [rI, h]);
    p.push([rI, 0]);
    return G.drehkoerper(p, seg, { winkel: [w0, w1], enden: true });
  };

  /* Rohr entlang einer Punktliste */
  G.rohr = function (punkte, r, seg, offen) {
    var g = G.leer(), n = punkte.length;
    var vorN = null, laenge = 0;
    for (var i = 0; i < n; i++) {
      var a = punkte[Math.max(0, i - 1)], b = punkte[Math.min(n - 1, i + 1)];
      var t = M.norm(M.minus(b, a));
      var nn;
      if (!vorN) { nn = M.kreuz(t, Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]); }
      else { nn = M.minus(vorN, M.mal(t, M.punkt(vorN, t))); }
      nn = M.norm(nn); vorN = nn;
      var bn = M.kreuz(t, nn);
      if (i > 0) laenge += M.abstand(punkte[i], punkte[i - 1]);
      var rr = typeof r === "function" ? r(i / (n - 1)) : r;
      for (var j = 0; j <= seg; j++) {
        var w = Math.PI * 2 * j / seg, c = Math.cos(w), s = Math.sin(w);
        var d = [nn[0] * c + bn[0] * s, nn[1] * c + bn[1] * s, nn[2] * c + bn[2] * s];
        vert(g, punkte[i][0] + d[0] * rr, punkte[i][1] + d[1] * rr, punkte[i][2] + d[2] * rr, d[0], d[1], d[2], w * rr, laenge);
      }
    }
    for (i = 0; i < n - 1; i++) for (j = 0; j < seg; j++) {
      var A = i * (seg + 1) + j, B = A + 1, C = A + seg + 2, D = A + seg + 1;
      g.i.push(A, B, C, A, C, D);
    }
    return G.windung(g);
  };

  /* Unterteilte Ebene (Normale nach oben), Mitte im Ursprung */
  G.ebene = function (b, t, nx, nz) {
    var g = G.leer(); nx = nx || 1; nz = nz || 1;
    for (var iz = 0; iz <= nz; iz++) for (var ix = 0; ix <= nx; ix++) {
      var u = ix / nx, v = iz / nz;
      vert(g, (u - 0.5) * b, 0, (v - 0.5) * t, 0, 1, 0, u, 1 - v);
    }
    for (iz = 0; iz < nz; iz++) for (ix = 0; ix < nx; ix++) {
      var a = iz * (nx + 1) + ix;
      g.i.push(a, a + nx + 1, a + nx + 2, a, a + nx + 2, a + 1);
    }
    return G.windung(g);
  };

  /* ---------- Werkzeuge ---------- */
  G.transform = function (g, m) {
    var r = { p: [], n: [], uv: g.uv.slice(), i: g.i.slice(), ao: g.ao.slice(), k: g.k.slice() };
    for (var v = 0; v < g.p.length; v += 3) {
      var x = g.p[v], y = g.p[v + 1], z = g.p[v + 2];
      r.p.push(m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]);
      var nx = g.n[v], ny = g.n[v + 1], nz = g.n[v + 2];
      var tx = m[0] * nx + m[4] * ny + m[8] * nz, ty = m[1] * nx + m[5] * ny + m[9] * nz, tz = m[2] * nx + m[6] * ny + m[10] * nz;
      var l = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;
      r.n.push(tx / l, ty / l, tz / l);
    }
    return r;
  };

  /* Verformen: fn(p, n) liefert neue Position; Normalen werden danach neu berechnet */
  G.verformen = function (g, fn, normalenNeu) {
    for (var v = 0; v < g.p.length; v += 3) {
      var q = fn([g.p[v], g.p[v + 1], g.p[v + 2]], [g.n[v], g.n[v + 1], g.n[v + 2]]);
      g.p[v] = q[0]; g.p[v + 1] = q[1]; g.p[v + 2] = q[2];
    }
    if (normalenNeu !== false) G.normalenNeu(g);
    return g;
  };

  /* Glatte Normalen neu berechnen; gleiche Positionen werden verschweißt */
  G.normalenNeu = function (g) {
    var anz = g.p.length / 3, acc = new Float32Array(anz * 3);
    var schluessel = {}, gruppe = new Int32Array(anz);
    for (var v = 0; v < anz; v++) {
      var k = Math.round(g.p[v * 3] * 1e4) + "," + Math.round(g.p[v * 3 + 1] * 1e4) + "," + Math.round(g.p[v * 3 + 2] * 1e4);
      if (schluessel[k] === undefined) schluessel[k] = v;
      gruppe[v] = schluessel[k];
    }
    for (var t = 0; t < g.i.length; t += 3) {
      var a = g.i[t], b = g.i[t + 1], c = g.i[t + 2];
      var e1 = [g.p[b * 3] - g.p[a * 3], g.p[b * 3 + 1] - g.p[a * 3 + 1], g.p[b * 3 + 2] - g.p[a * 3 + 2]];
      var e2 = [g.p[c * 3] - g.p[a * 3], g.p[c * 3 + 1] - g.p[a * 3 + 1], g.p[c * 3 + 2] - g.p[a * 3 + 2]];
      var f = M.kreuz(e1, e2);
      [a, b, c].forEach(function (x) { var q = gruppe[x] * 3; acc[q] += f[0]; acc[q + 1] += f[1]; acc[q + 2] += f[2]; });
    }
    for (v = 0; v < anz; v++) {
      var q = gruppe[v] * 3, l = Math.hypot(acc[q], acc[q + 1], acc[q + 2]) || 1;
      g.n[v * 3] = acc[q] / l; g.n[v * 3 + 1] = acc[q + 1] / l; g.n[v * 3 + 2] = acc[q + 2] / l;
    }
    return g;
  };

  /* An eine Sammlung anhängen (mit Matrix, Knochen-Nummer und Verdeckungswert) */
  G.anhaengen = function (ziel, g, m, knochen) {
    var t = m ? G.transform(g, m) : g;
    var basis = ziel.p.length / 3;
    for (var v = 0; v < t.p.length; v++) { ziel.p.push(t.p[v]); ziel.n.push(t.n[v]); }
    for (v = 0; v < t.uv.length; v++) ziel.uv.push(t.uv[v]);
    var anz = t.p.length / 3;
    for (v = 0; v < anz; v++) { ziel.ao.push(t.ao.length ? t.ao[v] : 1); ziel.k.push(knochen || 0); }
    for (v = 0; v < t.i.length; v++) ziel.i.push(t.i[v] + basis);
    return ziel;
  };

  /* Kugelhülle (für Sichtbarkeitsprüfung) */
  G.huelle = function (g) {
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    for (var v = 0; v < g.p.length; v += 3) for (var k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], g.p[v + k]); mx[k] = Math.max(mx[k], g.p[v + k]); }
    var m = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2, (mn[2] + mx[2]) / 2];
    var r = 0;
    for (v = 0; v < g.p.length; v += 3) r = Math.max(r, Math.hypot(g.p[v] - m[0], g.p[v + 1] - m[1], g.p[v + 2] - m[2]));
    return { m: m, r: r, min: mn, max: mx };
  };

  return G;
})();

/* =====================================================================
   Netz: Geometrie auf die Grafikkarte laden
   ===================================================================== */
MOTOR.netz = function (g, opt) {
  opt = opt || {};
  var G = MOTOR.gl, gl = G.gl;
  var anz = g.p.length / 3, mitK = !!opt.knochen;
  var stride = mitK ? 10 : 9;
  var d = new Float32Array(anz * stride);
  for (var v = 0; v < anz; v++) {
    var o = v * stride;
    d[o] = g.p[v * 3]; d[o + 1] = g.p[v * 3 + 1]; d[o + 2] = g.p[v * 3 + 2];
    d[o + 3] = g.n[v * 3]; d[o + 4] = g.n[v * 3 + 1]; d[o + 5] = g.n[v * 3 + 2];
    d[o + 6] = g.uv[v * 2] || 0; d[o + 7] = g.uv[v * 2 + 1] || 0;
    d[o + 8] = g.ao.length ? g.ao[v] : 1;
    if (mitK) d[o + 9] = g.k[v] || 0;
  }
  var gross = anz > 65535;
  var idx = gross ? new Uint32Array(g.i) : new Uint16Array(g.i);
  var vao = G.vao();
  G.bindeVao(vao);
  var vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, d, opt.dynamisch ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
  var A = G.ATTR, s = stride * 4;
  gl.enableVertexAttribArray(A.aPos); gl.vertexAttribPointer(A.aPos, 3, gl.FLOAT, false, s, 0);
  gl.enableVertexAttribArray(A.aNor); gl.vertexAttribPointer(A.aNor, 3, gl.FLOAT, false, s, 12);
  gl.enableVertexAttribArray(A.aUv); gl.vertexAttribPointer(A.aUv, 2, gl.FLOAT, false, s, 24);
  gl.enableVertexAttribArray(A.aAo); gl.vertexAttribPointer(A.aAo, 1, gl.FLOAT, false, s, 32);
  if (mitK) { gl.enableVertexAttribArray(A.aKnochen); gl.vertexAttribPointer(A.aKnochen, 1, gl.FLOAT, false, s, 36); }
  var ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  G.bindeVao(null);
  var h = MOTOR.geo.huelle(g);
  var netz = {
    vao: vao, vb: vb, ib: ib, anzahl: idx.length, typ: gross ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT,
    dreiecke: idx.length / 3, kugel: { m: h.m, r: h.r }, min: h.min, max: h.max, stride: stride, daten: opt.dynamisch ? d : null,
    instanzen: 0, ib2: null
  };
  /* Instanzen: je 12 Zahlen (iA, iB, iC) */
  if (opt.instanzen) {
    G.bindeVao(vao);
    netz.instanzPuffer = gl.createBuffer();
    netz.instanzDaten = new Float32Array(opt.instanzen * 12);
    gl.bindBuffer(gl.ARRAY_BUFFER, netz.instanzPuffer);
    gl.bufferData(gl.ARRAY_BUFFER, netz.instanzDaten, gl.DYNAMIC_DRAW);
    [A.iA, A.iB, A.iC].forEach(function (ort, k) {
      gl.enableVertexAttribArray(ort);
      gl.vertexAttribPointer(ort, 4, gl.FLOAT, false, 48, k * 16);
      G.teiler(ort, 1);
    });
    G.bindeVao(null);
    netz.maxInstanzen = opt.instanzen;
  }
  return netz;
};

/* Instanzdaten hochladen */
MOTOR.netzInstanzen = function (netz, n) {
  var gl = MOTOR.gl.gl;
  netz.instanzen = n;
  gl.bindBuffer(gl.ARRAY_BUFFER, netz.instanzPuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, netz.instanzDaten.subarray(0, n * 12));
};

/* Positionen eines dynamischen Netzes neu hochladen (z. B. umblätterndes Papier) */
MOTOR.netzPositionen = function (netz, pos, nor) {
  var gl = MOTOR.gl.gl, d = netz.daten, s = netz.stride, anz = pos.length / 3;
  for (var v = 0; v < anz; v++) {
    d[v * s] = pos[v * 3]; d[v * s + 1] = pos[v * 3 + 1]; d[v * s + 2] = pos[v * 3 + 2];
    if (nor) { d[v * s + 3] = nor[v * 3]; d[v * s + 4] = nor[v * 3 + 1]; d[v * s + 5] = nor[v * 3 + 2]; }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, netz.vb);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, d);
};

MOTOR.netzLoeschen = function (netz) {
  if (!netz) return;
  var G = MOTOR.gl, gl = G.gl;
  G.loescheVao(netz.vao); gl.deleteBuffer(netz.vb); gl.deleteBuffer(netz.ib);
  if (netz.instanzPuffer) gl.deleteBuffer(netz.instanzPuffer);
};
