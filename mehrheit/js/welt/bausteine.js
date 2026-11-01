/* =====================================================================
   js/welt/bausteine.js – Möbel, Räume, Halbrund, Glasmodell …
   ---------------------------------------------------------------------
   Alle Räume sind erfunden und entstehen aus Grundkörpern.
   Statische Teile werden pro Material zu wenigen großen Puffern
   zusammengefasst. Die Verdeckung in Ecken wird beim Laden pro Eckpunkt
   vorberechnet (Abstandsfeld aus einfachen Körpern).
   ===================================================================== */
var WELT = window.WELT || {};

/* ---------- Materialien auflösen ---------- */
WELT.material = function (name, extra) {
  var M = MOTOR.m;
  var basis = DATA.stil.materialien[name] || DATA.stil.materialien.modellharz;
  var q = {};
  for (var k in basis) q[k] = basis[k];
  if (extra) for (k in extra) q[k] = extra[k];
  var em = q.emission || 0;
  var emFarbe = q.emissionFarbe ? M.farbe(q.emissionFarbe) : (Array.isArray(em) ? em : [1, 1, 1]);
  var emStaerke = Array.isArray(em) ? 1 : em;
  return {
    name: name + (extra ? JSON.stringify(extra) : ""),
    farbe: M.farbe(q.farbe || "#ffffff"),
    rauheit: q.rauheit === undefined ? 0.5 : q.rauheit,
    metall: q.metall || 0,
    durchscheinen: q.durchscheinen || 0,
    klarlack: q.klarlack || 0,
    struktur: q.struktur || "glatt",
    strukturSkala: q.strukturSkala || 1,
    strukturStaerke: q.strukturStaerke === undefined ? 0.5 : q.strukturStaerke,
    samt: q.samt || 0,
    emission: [emFarbe[0] * emStaerke, emFarbe[1] * emStaerke, emFarbe[2] * emStaerke],
    glas: !!q.glas, alpha: q.alpha === undefined ? 1 : q.alpha, brechung: q.brechung || 0.02,
    doppelseitig: !!q.doppelseitig, spiegelt: !!q.spiegelt, himmel: name === "himmel"
  };
};

/* ---------- Bauer: sammelt Geometrie einer Szene ---------- */
WELT.Bauer = function (opt) {
  var M = MOTOR.m, Geo = MOTOR.geo;
  var B = this;
  opt = opt || {};
  B.gruppen = {};
  B.objekte = [];
  B.lichter = [];
  B.verdecker = [];
  B.aoReichweite = opt.aoReichweite || 0.4;

  /* statisches Teil: geo + Material + Matrix */
  B.teil = function (geo, mat, matrix, o) {
    o = o || {};
    var m = typeof mat === "string" ? WELT.material(mat) : mat;
    var schl = m.name + (o.schatten === false ? "|ns" : "") + (o.kein_ao ? "|na" : "");
    var g = B.gruppen[schl];
    if (!g) g = B.gruppen[schl] = { mat: m, geo: Geo.leer(), schatten: o.schatten !== false, keinAo: !!o.kein_ao, nichtImSpiegel: !!o.nichtImSpiegel };
    Geo.anhaengen(g.geo, geo, matrix || null, 0);
    return B;
  };

  /* Box mit Matrix als Teil und zugleich als Verdecker */
  B.box = function (b, h, t, fase, mat, pos, drehY, o) {
    var m = M.trs(M.m4(), pos, drehY || 0, 1);
    B.teil(Geo.box(b, h, t, fase, (o && o.seg) || 2), mat, m, o);
    if (!o || o.verdecker !== false) B.verdecker.push({ typ: "box", inv: M.invert(M.m4(), m), h: [b / 2, h / 2, t / 2], m: pos, r: Math.hypot(b, h, t) / 2 });
    return m;
  };

  B.ringVerdecker = function (mitte, rI, rA, w0, w1, y0, y1) {
    B.verdecker.push({ typ: "ring", c: mitte, rI: rI, rA: rA, w0: w0, w1: w1, y0: y0, y1: y1, m: [mitte[0], (y0 + y1) / 2, mitte[2]], r: rA + (y1 - y0) });
  };

  /* dynamisches Objekt mit eigener Matrix */
  B.objekt = function (geo, mat, matrix, o) {
    var m = typeof mat === "string" ? WELT.material(mat) : mat;
    o = o || {};
    var netz = o.netz || MOTOR.netz(geo, { knochen: o.knochen, instanzen: o.instanzen, dynamisch: o.dynamisch });
    var obj = { netz: netz, mat: m, matrix: matrix || M.m4(), schatten: o.schatten !== false, statisch: !!o.statisch, sichtbar: true };
    for (var k in o) if (!(k in obj) && k !== "netz") obj[k] = o[k];
    B.objekte.push(obj);
    return obj;
  };

  B.licht = function (L) {
    L.farbe = L.kelvin ? M.kelvin(L.kelvin) : M.farbe(L.farbe || "#ffffff");
    B.lichter.push(L);
    return L;
  };

  /* Abstandsfeld der Verdecker */
  function sdfBox(v, p) {
    var q = M.punktMal(v.inv, p);
    var dx = Math.abs(q[0]) - v.h[0], dy = Math.abs(q[1]) - v.h[1], dz = Math.abs(q[2]) - v.h[2];
    var ax = Math.max(dx, 0), ay = Math.max(dy, 0), az = Math.max(dz, 0);
    return Math.sqrt(ax * ax + ay * ay + az * az) + Math.min(Math.max(dx, Math.max(dy, dz)), 0);
  }
  function sdfRing(v, p) {
    var x = p[0] - v.c[0], z = p[2] - v.c[2];
    var r = Math.sqrt(x * x + z * z), w = Math.atan2(z, x);
    if (w < -Math.PI / 2) w += Math.PI * 2;
    var wm = (v.w0 + v.w1) / 2, wh = (v.w1 - v.w0) / 2;
    var dr = Math.abs(r - (v.rI + v.rA) / 2) - (v.rA - v.rI) / 2;
    var dw = (Math.abs(w - wm) - wh) * r;
    var dy = Math.abs(p[1] - (v.y0 + v.y1) / 2) - (v.y1 - v.y0) / 2;
    var a = Math.max(dr, 0), b = Math.max(dw, 0), c = Math.max(dy, 0);
    return Math.sqrt(a * a + b * b + c * c) + Math.min(Math.max(dr, Math.max(dw, dy)), 0);
  }

  function aoBerechnen(g) {
    var p = g.geo.p, n = g.geo.n, anz = p.length / 3, R = B.aoReichweite;
    var ao = g.geo.ao;
    var V = B.verdecker;
    for (var v = 0; v < anz; v++) {
      var px = p[v * 3], py = p[v * 3 + 1], pz = p[v * 3 + 2];
      var nah = [];
      for (var j = 0; j < V.length; j++) {
        var c = V[j];
        if (Math.abs(c.m[0] - px) > c.r + R || Math.abs(c.m[1] - py) > c.r + R || Math.abs(c.m[2] - pz) > c.r + R) continue;
        nah.push(c);
      }
      var occ = 0;
      if (nah.length) {
        for (var i = 1; i <= 5; i++) {
          var h = R * i / 5;
          var q = [px + n[v * 3] * h, py + n[v * 3 + 1] * h, pz + n[v * 3 + 2] * h];
          var d = 1e9;
          for (j = 0; j < nah.length; j++) d = Math.min(d, nah[j].typ === "box" ? sdfBox(nah[j], q) : sdfRing(nah[j], q));
          occ += Math.max(0, h - d) / R * Math.pow(0.7, i - 1);
        }
      }
      ao[v] = M.klemme(1 - occ * 1.1, 0.15, 1);
    }
  }

  /* Alles hochladen */
  B.fertig = function () {
    var liste = [];
    for (var s in B.gruppen) {
      var g = B.gruppen[s];
      if (!g.geo.p.length) continue;
      if (!g.keinAo && !g.mat.glas) aoBerechnen(g);
      var netz = MOTOR.netz(g.geo);
      liste.push({ netz: netz, mat: g.mat, matrix: M.m4(), schatten: g.schatten && !g.mat.glas, statisch: true, sichtbar: true, nichtImSpiegel: g.nichtImSpiegel });
    }
    return liste.concat(B.objekte);
  };
};

/* =====================================================================
   Einzelne Bausteine
   ===================================================================== */
WELT.bausteine = (function () {
  var W = {};
  var M = MOTOR.m, Geo = MOTOR.geo;
  var GR = M.GRAD;

  function mat(pos, dreh, sk) { return M.trs(M.m4(), pos, dreh || 0, sk || 1); }
  function mal(a, b) { return M.mul(M.m4(), a, b); }

  /* --- Schreibtisch --- */
  W.schreibtisch = function (B, e) {
    var g = e.groesse || [1.7, 0.75, 0.85], basis = mat(e.pos, e.dreh);
    var b = g[0], h = g[1], t = g[2];
    B.teil(Geo.box(b, 0.036, t, 0.012, 3), WELT.material("eiche", { spiegelt: true }), mal(basis, M.trs(M.m4(), [0, h - 0.018, 0])));
    B.verdecker.push({ typ: "box", inv: M.invert(M.m4(), mal(basis, M.trs(M.m4(), [0, h - 0.018, 0]))), h: [b / 2, 0.018, t / 2], m: M.punktMal(basis, [0, h, 0]), r: b / 2 });
    var bein = Geo.box(0.045, h - 0.036, 0.045, 0.01, 2);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (s) {
      B.teil(bein, "aluminium", mal(basis, M.trs(M.m4(), [s[0] * (b / 2 - 0.06), (h - 0.036) / 2, s[1] * (t / 2 - 0.06)])));
    });
    B.teil(Geo.box(b - 0.16, 0.05, 0.03, 0.008, 2), "aluminium", mal(basis, M.trs(M.m4(), [0, h - 0.06, -t / 2 + 0.06])));
    B.teil(Geo.box(b - 0.2, 0.42, 0.018, 0.006, 2), "eiche_matt", mal(basis, M.trs(M.m4(), [0, h - 0.3, -t / 2 + 0.09])));
  };

  W.tisch_klein = function (B, e) {
    W.schreibtisch(B, { pos: e.pos, dreh: e.dreh, groesse: [0.9, 0.72, 0.62] });
  };

  /* --- Bürostuhl --- */
  W.stuhl = function (B, e) {
    var basis = mat(e.pos, e.dreh);
    B.teil(Geo.box(0.48, 0.08, 0.46, 0.035, 3), "stoff_sitz", mal(basis, M.trs(M.m4(), [0, 0.375, 0])));
    var lehne = M.mul(M.m4(), M.trs(M.m4(), [0, 0.7, -0.22]), (function () { var r = M.m4(); var c = Math.cos(-8 * GR), s = Math.sin(-8 * GR); r[5] = c; r[6] = s; r[9] = -s; r[10] = c; return r; })());
    B.teil(Geo.box(0.46, 0.5, 0.07, 0.03, 3), "stoff_sitz", mal(basis, lehne));
    B.teil(Geo.zylinder(0.025, 0.28, 12, true), "aluminium", mal(basis, M.trs(M.m4(), [0, 0.07, 0])));
    for (var i = 0; i < 5; i++) {
      var w = i * 72;
      B.teil(Geo.box(0.04, 0.03, 0.3, 0.01, 1), "aluminium", mal(basis, mal(M.trs(M.m4(), [0, 0.06, 0], w), M.trs(M.m4(), [0, 0, 0.15]))));
      B.teil(Geo.kugel(0.025, 8, 4), "gummi", mal(basis, mal(M.trs(M.m4(), [0, 0.025, 0], w), M.trs(M.m4(), [0, 0, 0.29]))));
    }
    B.verdecker.push({ typ: "box", inv: M.invert(M.m4(), mal(basis, M.trs(M.m4(), [0, 0.375, 0]))), h: [0.24, 0.04, 0.23], m: M.punktMal(basis, [0, 0.375, 0]), r: 0.35 });
  };

  /* --- Schreibtischlampe mit Milchglasschirm --- */
  W.schreibtischlampe = function (B, e) {
    var basis = mat(e.pos, e.dreh);
    B.teil(Geo.zylinder(0.075, 0.018, 24, true, 0.006), "aluminium", basis);
    var arm = [[0, 0.018, 0], [0, 0.2, 0.02], [0, 0.38, 0.06], [0, 0.44, 0.14], [0, 0.43, 0.22]];
    B.teil(Geo.rohr(arm.map(function (p) { return p; }), 0.008, 8), "aluminium", basis);
    var schirm = Geo.drehkoerper([[0.012, 0.06], [0.04, 0.05], [0.07, 0.015], [0.085, -0.02]], 28, {});
    var sm = mal(basis, M.trs(M.m4(), [0, 0.42, 0.24]));
    var an = e.an !== false;
    B.objekt(schirm, WELT.material("milchglas", { doppelseitig: true, emission: 3.2, emissionFarbe: "#ffd9a8" }), sm, { statisch: true, schatten: true, keineBrechung: true, lampe: true });
    B.objekt(Geo.kugel(0.02, 12, 6), WELT.material("milchglas", { emission: 14, emissionFarbe: "#ffe2b8", glas: false }), mal(sm, M.trs(M.m4(), [0, 0.02, 0])), { statisch: true, schatten: false, lampe: true });
    B.licht({ pos: M.punktMal(sm, [0, -0.01, 0]), kelvin: 2900, staerke: e.staerke || 0.55, reichweite: 2.2, richtung: [0, -1, 0], kegelAussen: 75, kegelInnen: 45, lampe: true });
  };

  /* --- Bildschirm mit Miras Mail --- */
  W.bildschirm = function (B, e) {
    var basis = mat(e.pos, e.dreh);
    B.teil(Geo.box(0.22, 0.012, 0.16, 0.005, 2), "aluminium", basis);
    B.teil(Geo.box(0.04, 0.24, 0.02, 0.006, 2), "aluminium", mal(basis, M.trs(M.m4(), [0, 0.13, -0.03])));
    var gm = mal(basis, M.trs(M.m4(), [0, 0.33, 0]));
    B.teil(Geo.box(0.56, 0.34, 0.022, 0.006, 2), "bildschirm", gm);
    var lw = MOTOR.texturen.leinwand(512, 300), c = lw.getContext("2d");
    var T = DATA.texte.mail;
    c.fillStyle = "#f4f4f2"; c.fillRect(0, 0, 512, 300);
    c.fillStyle = "#dfe3e8"; c.fillRect(0, 0, 512, 34);
    c.fillStyle = "#00a2ad"; c.fillRect(0, 34, 6, 266);
    c.fillStyle = "#3a3f47"; c.font = "bold 17px " + DATA.stil.oberflaeche.schriftUI;
    c.fillText(T.von, 20, 23);
    c.fillStyle = "#16181c"; c.font = "bold 24px " + DATA.stil.oberflaeche.schriftUI;
    c.fillText(T.betreff, 22, 78);
    c.font = "18px " + DATA.stil.oberflaeche.schriftUI; c.fillStyle = "#30343b";
    T.zeilen.forEach(function (z, i) { c.fillText(z, 22, 118 + i * 30); });
    var tex = MOTOR.gl.textur({ quelle: lw, mip: true, aniso: 8, drehen: true });
    var schirm = Geo.ebene(0.53, 0.31, 1, 1);
    var sm = mal(gm, (function () { var r = M.m4(); r[5] = 0; r[6] = 1; r[9] = -1; r[10] = 0; r[14] = 0.0115; return r; })());
    B.objekt(schirm, WELT.material("bildschirm", { klarlack: 1, rauheit: 0.2 }), sm, { statisch: true, farbTex: tex, emission: [0, 1.3, 0], schatten: false });
    B.licht({ pos: M.punktMal(gm, [0, 0, 0.25]), farbe: "#dfe9ff", staerke: 0.12, reichweite: 1.2 });
  };

  /* --- Becher mit Kaffee (und Dampf) --- */
  W.becher = function (B, e, sz) {
    var basis = mat(e.pos, e.dreh);
    var prof = [[0, 0], [0.032, 0], [0.034, 0.004], [0.036, 0.09], [0.039, 0.098], [0.036, 0.099], [0.033, 0.092], [0.031, 0.012], [0, 0.012]];
    B.teil(Geo.drehkoerper(prof, 32, {}), "keramik", basis);
    var henkel = [];
    for (var i = 0; i <= 12; i++) { var w = -Math.PI / 2 + Math.PI * i / 12; henkel.push([0.036 + Math.cos(w) * 0.022, 0.05 + Math.sin(w) * 0.026, 0]); }
    B.teil(Geo.rohr(henkel, 0.0055, 8), "keramik", basis);
    B.teil(Geo.zylinder(0.031, 0.001, 24, true), "kaffee", mal(basis, M.trs(M.m4(), [0, 0.078, 0])), { kein_ao: true });
    if (e.dampf && sz) sz.dampfQuellen.push({ pos: M.punktMal(basis, [0, 0.085, 0]), hoehe: 0.22, radius: 0.012, groesse: 0.018, dichte: 0.32 });
  };

  /* --- Aktenstapel mit farbigen Mappen --- */
  W.aktenstapel = function (B, e) {
    var basis = mat(e.pos, e.dreh);
    var farben = DATA.fraktionen.map(function (f) { return f.farbe; });
    for (var i = 0; i < 4; i++) {
      var y = 0.006 + i * 0.016, d = (i % 2 ? 4 : -3);
      var m = mal(basis, M.trs(M.m4(), [(i % 3 - 1) * 0.006, y, (i % 2) * 0.008], d));
      B.teil(Geo.box(0.235, 0.004, 0.315, 0.0018, 1), WELT.material("lack", { farbe: farben[(i * 2 + 1) % farben.length], rauheit: 0.35 }), m);
      B.teil(Geo.box(0.225, 0.008, 0.302, 0.001, 1), "papier", mal(m, M.trs(M.m4(), [0.003, 0.006, 0])));
      B.teil(Geo.box(0.235, 0.004, 0.315, 0.0018, 1), WELT.material("lack", { farbe: farben[(i * 2 + 1) % farben.length], rauheit: 0.35 }), mal(m, M.trs(M.m4(), [0, 0.012, 0])));
    }
    B.verdecker.push({ typ: "box", inv: M.invert(M.m4(), basis), h: [0.12, 0.035, 0.16], m: e.pos, r: 0.2 });
  };

  /* --- Pflanze mit großen Blättern --- */
  W.pflanze = function (B, e) {
    var basis = mat(e.pos, e.dreh);
    var topf = [[0, 0], [0.16, 0], [0.17, 0.01], [0.2, 0.42], [0.21, 0.43], [0.19, 0.43], [0.18, 0.4], [0, 0.4]];
    B.teil(Geo.drehkoerper(topf, 32, {}), WELT.material("keramik", { farbe: "#e6e1d8", rauheit: 0.5 }), basis);
    B.teil(Geo.zylinder(0.18, 0.005, 24, true), "erde", mal(basis, M.trs(M.m4(), [0, 0.39, 0])));
    var r = M.zufall(e.saat || 21);
    for (var i = 0; i < 11; i++) {
      var w = i * 137.5 * GR + r() * 0.3, neig = 0.35 + r() * 0.45, laenge = 0.55 + r() * 0.6;
      var stiel = [];
      for (var k = 0; k <= 6; k++) {
        var t = k / 6;
        var rad = Math.sin(neig) * laenge * t * (0.4 + 0.6 * t);
        stiel.push([Math.cos(w) * rad, 0.4 + Math.cos(neig) * laenge * t - t * t * 0.18, Math.sin(w) * rad]);
      }
      B.teil(Geo.rohr(stiel, function (t) { return 0.007 - t * 0.003; }, 6), WELT.material("blatt_pflanze", { farbe: "#5a7a46" }), basis);
      // Blatt: gewölbte Ellipse
      var bl = Geo.ebene(0.26 + r() * 0.08, 0.4 + r() * 0.12, 6, 10);
      Geo.verformen(bl, function (p) {
        var u = p[0] / 0.17, v = p[2] / 0.26 + 0.5;
        var breite = Math.sin(Math.PI * M.klemme(v, 0, 1)) * (1 - v * 0.25);
        var x = p[0] * breite;
        return [x, -x * x * 2.2 - Math.pow(v, 2) * 0.12, p[2]];
      });
      var ende = stiel[stiel.length - 1];
      var bm = M.mul(M.m4(), M.trs(M.m4(), ende, -w / GR + 90), (function () { var q = M.m4(); var a = -(0.5 + r() * 0.4); q[5] = Math.cos(a); q[6] = Math.sin(a); q[9] = -Math.sin(a); q[10] = Math.cos(a); return q; })());
      B.teil(bl, "blatt_pflanze", mal(basis, mal(bm, M.trs(M.m4(), [0, 0, 0.2]))));
    }
    B.verdecker.push({ typ: "box", inv: M.invert(M.m4(), mal(basis, M.trs(M.m4(), [0, 0.21, 0]))), h: [0.19, 0.21, 0.19], m: [e.pos[0], 0.21, e.pos[2]], r: 0.3 });
  };

  /* --- Regal mit Ordnern in Fraktionsfarben --- */
  W.regal = function (B, e) {
    var basis = mat(e.pos, e.dreh), L = e.laenge || 2.2, H = 2.0, T = 0.34;
    B.box(0.025, H, T, 0.006, "eiche_matt", M.punktMal(basis, [-L / 2, H / 2, 0]), e.dreh);
    B.box(0.025, H, T, 0.006, "eiche_matt", M.punktMal(basis, [L / 2, H / 2, 0]), e.dreh);
    B.teil(Geo.box(L, H, 0.012, 0.004, 1), "modellharz", mal(basis, M.trs(M.m4(), [0, H / 2, -T / 2 + 0.006])));
    var r = M.zufall(9);
    var farben = DATA.fraktionen.map(function (f) { return f.farbe; });
    for (var b = 0; b < 5; b++) {
      var y = 0.05 + b * 0.47;
      B.box(L, 0.025, T, 0.006, "eiche_matt", M.punktMal(basis, [0, y, 0]), e.dreh);
      if (b === 4) break;
      var x = -L / 2 + 0.04;
      while (x < L / 2 - 0.1) {
        var br = 0.05 + r() * 0.03, hh = 0.31 + r() * 0.03;
        if (r() < 0.12) { x += 0.08 + r() * 0.12; continue; }
        var f = farben[Math.floor(r() * farben.length)];
        var kipp = (r() < 0.07) ? 8 : 0;
        var m = mal(basis, M.trs(M.m4(), [x + br / 2, y + 0.0125 + hh / 2, 0.02]));
        if (kipp) m = mal(m, (function () { var q = M.m4(); var a = kipp * GR; q[0] = Math.cos(a); q[1] = Math.sin(a); q[4] = -Math.sin(a); q[5] = Math.cos(a); return q; })());
        B.teil(Geo.box(br, hh, 0.28, 0.005, 1), WELT.material("lack", { farbe: f, rauheit: 0.4, klarlack: 0.3 }), m);
        B.teil(Geo.box(br * 0.55, 0.06, 0.004, 0.002, 1), "papier", mal(m, M.trs(M.m4(), [0, hh * 0.18, 0.141])), { kein_ao: true });
        x += br + 0.003;
      }
    }
  };

  /* --- Pinnwand mit Inès' Zettel --- */
  W.pinnwand = function (B, e, sz) {
    var basis = mat(e.pos, e.dreh);
    B.teil(Geo.box(1.1, 0.75, 0.02, 0.004, 1), "kork", basis);
    [[0, 0.385], [0, -0.385]].forEach(function (p) { B.teil(Geo.box(1.14, 0.025, 0.03, 0.006, 1), "aluminium", mal(basis, M.trs(M.m4(), [p[0], p[1], 0.004]))); });
    [[-0.56, 0], [0.56, 0]].forEach(function (p) { B.teil(Geo.box(0.025, 0.79, 0.03, 0.006, 1), "aluminium", mal(basis, M.trs(M.m4(), [p[0], p[1], 0.004]))); });
    // Zettel von Inès
    var lw = MOTOR.texturen.leinwand(512, 512), c = lw.getContext("2d");
    c.fillStyle = "#f7f3e8"; c.fillRect(0, 0, 512, 512);
    c.strokeStyle = "rgba(90,120,170,0.25)"; c.lineWidth = 2;
    for (var y = 70; y < 512; y += 40) { c.beginPath(); c.moveTo(20, y); c.lineTo(492, y); c.stroke(); }
    c.fillStyle = "#24304a"; c.font = "italic 25px Georgia, serif";
    var woerter = DATA.texte.zettel.split(" "), zeile = "", zy = 62;
    woerter.forEach(function (w) { var t = zeile ? zeile + " " + w : w; if (c.measureText(t).width > 450) { c.fillText(zeile, 30, zy); zy += 40; zeile = w; } else zeile = t; });
    c.fillText(zeile, 30, zy);
    c.font = "italic 28px Georgia, serif"; c.fillText("– " + DATA.texte.zettelUnterschrift, 330, Math.min(490, zy + 52));
    var tex = MOTOR.gl.textur({ quelle: lw, mip: true, aniso: 8, drehen: true });
    var zm = mal(basis, mal(M.trs(M.m4(), [-0.18, 0.02, 0.014], 0), (function () { var q = M.m4(); var a = -4 * GR; q[0] = Math.cos(a); q[1] = Math.sin(a); q[4] = -Math.sin(a); q[5] = Math.cos(a); return q; })()));
    var zettel = Geo.ebene(0.2, 0.2, 4, 4);
    Geo.verformen(zettel, function (p) { return [p[0], p[2] * p[2] * 0.4 + 0.002, p[2]]; });
    var aufrecht = (function () { var q = M.m4(); q[5] = 0; q[6] = 1; q[9] = -1; q[10] = 0; return q; })();
    B.objekt(zettel, "papier", mal(zm, aufrecht), { statisch: true, farbTex: tex });
    B.teil(Geo.kugel(0.008, 10, 5), WELT.material("lack", { farbe: "#d6453a" }), mal(zm, M.trs(M.m4(), [0, 0.085, 0.006])), { kein_ao: true });
    // weitere Notizen
    [[0.22, 0.12, "#f2e3a0", 6], [0.3, -0.16, "#cfe3e6", -3], [-0.38, -0.2, "#f6f3ea", 2]].forEach(function (n, i) {
      var nm = mal(basis, mal(M.trs(M.m4(), [n[0], n[1], 0.013]), (function () { var q = M.m4(); var a = n[3] * GR; q[0] = Math.cos(a); q[1] = Math.sin(a); q[4] = -Math.sin(a); q[5] = Math.cos(a); return q; })()));
      B.teil(Geo.box(0.12 + i * 0.02, 0.12, 0.002, 0.0008, 1), WELT.material("haftnotiz", { farbe: n[2] }), nm, { kein_ao: true });
      B.teil(Geo.kugel(0.007, 10, 5), WELT.material("lack", { farbe: ["#3a6fd1", "#2f9a5a", "#e0a526"][i] }), mal(nm, M.trs(M.m4(), [0, 0.045, 0.005])), { kein_ao: true });
    });
  };

  /* --- Deckenleuchte (Milchglasfeld) --- */
  W.deckenleuchte = function (B, e) {
    var basis = mat(e.pos, e.dreh);
    B.teil(Geo.box(1.3, 0.04, 0.32, 0.008, 2), "aluminium", mal(basis, M.trs(M.m4(), [0, -0.02, 0])), { kein_ao: true });
    B.teil(Geo.box(1.24, 0.012, 0.26, 0.004, 1), WELT.material("milchglas", { glas: false, emission: e.an ? 6 : 0.4, emissionFarbe: "#f4f1ea", rauheit: 0.5 }), mal(basis, M.trs(M.m4(), [0, -0.045, 0])), { schatten: false, kein_ao: true });
  };

  /* =====================================================================
     Weitere Einrichtung, damit die Räume bewohnt wirken
     (Wunsch des Users, 1. November 2026: „Räume leer/steril“)
     ===================================================================== */
  /* --- Teppich (flach, liegt auf dem Boden) --- */
  W.teppich = function (B, e) {
    var g = e.groesse || [2, 1.4];
    B.teil(Geo.box(g[0], 0.01, g[1], 0.004, 1), WELT.material("teppich", { farbe: e.farbe || "#8a7058" }), mal(mat(e.pos, e.dreh), M.trs(M.m4(), [0, 0.006, 0])), { kein_ao: true });
    B.teil(Geo.box(g[0] - 0.12, 0.012, g[1] - 0.12, 0.004, 1), WELT.material("teppich", { farbe: e.innen || "#a68b6e" }), mal(mat(e.pos, e.dreh), M.trs(M.m4(), [0, 0.008, 0])), { kein_ao: true });
  };

  /* --- Garderobe mit Mantel und Schal --- */
  W.garderobe = function (B, e) {
    var b = mat(e.pos, e.dreh);
    B.teil(Geo.zylinder(0.2, 0.02, 24, true), "aluminium", mal(b, M.trs(M.m4(), [0, 0.01, 0])));
    B.teil(Geo.zylinder(0.016, 1.72, 10, false), "aluminium", mal(b, M.trs(M.m4(), [0, 0.02, 0])));
    for (var i = 0; i < 4; i++) {
      var w = i * Math.PI / 2;
      B.teil(Geo.rohr([[0, 1.64, 0], [Math.cos(w) * 0.1, 1.7, Math.sin(w) * 0.1], [Math.cos(w) * 0.12, 1.75, Math.sin(w) * 0.12]], 0.007, 6), "aluminium", b, { kein_ao: true });
    }
    var farben = e.mantel || ["#3a4150", "#7a5a3c"];
    farben.forEach(function (f, k) {
      var w = k * 2.2 + 0.4, mant = Geo.drehkoerper([[0.03, 0.0], [0.13, -0.06], [0.16, -0.35], [0.19, -0.85], [0.17, -0.9], [0, -0.9]], 20, {});
      Geo.verformen(mant, function (q) { return [q[0], q[1], q[2] * 0.55]; });
      B.teil(mant, WELT.material("stoff", { farbe: f, strukturSkala: 20 }), mal(b, M.trs(M.m4(), [Math.cos(w) * 0.17, 1.72, Math.sin(w) * 0.17], -w / GR + 90)));
    });
    if (e.schal) B.teil(Geo.rohr([[0.1, 1.7, 0.05], [0.13, 1.45, 0.08], [0.12, 1.2, 0.07]], 0.03, 8), WELT.material("stoff", { farbe: e.schal, strukturSkala: 26 }), b, { kein_ao: true });
  };

  /* --- Bild an der Wand: ruhige, abstrakte Komposition im Rahmen --- */
  W.bild = function (B, e) {
    var b = mat(e.pos, e.dreh), g = e.groesse || [0.9, 0.62];
    B.teil(Geo.box(g[0], g[1], 0.03, 0.006, 1), WELT.material("lack", { farbe: e.rahmen || "#2a2b2e", rauheit: 0.4 }), mal(b, M.trs(M.m4(), [0, 0, 0.015])));
    B.teil(Geo.box(g[0] - 0.08, g[1] - 0.08, 0.01, 0.002, 0), WELT.material("papier", { farbe: "#f3efe6" }), mal(b, M.trs(M.m4(), [0, 0, 0.032])), { kein_ao: true });
    var r = M.zufall(e.saat || 5), farben = e.farben || ["#c7684a", "#2f5f73", "#d9b25a", "#8aa38c"];
    for (var i = 0; i < 4; i++) {
      var w = (0.15 + r() * 0.3) * g[0], h = (0.2 + r() * 0.45) * g[1];
      var x = (r() - 0.5) * (g[0] - 0.12 - w), y = (r() - 0.5) * (g[1] - 0.12 - h);
      B.teil(Geo.box(w, h, 0.004, 0.001, 0), WELT.material("lack", { farbe: farben[i % farben.length], rauheit: 0.8, klarlack: 0 }), mal(b, M.trs(M.m4(), [x, y, 0.038 + i * 0.001])), { kein_ao: true, schatten: false });
    }
  };

  /* --- Papierkorb mit ein paar zerknüllten Blättern --- */
  W.papierkorb = function (B, e) {
    var b = mat(e.pos, e.dreh);
    B.teil(Geo.drehkoerper([[0, 0], [0.11, 0], [0.135, 0.3], [0.13, 0.3], [0.105, 0.006], [0, 0.006]], 28, {}), WELT.material("lack", { farbe: e.farbe || "#3a3d42", rauheit: 0.45, doppelseitig: true }), b);
    var r = M.zufall(9);
    for (var i = 0; i < 4; i++) B.teil(Geo.kugel(0.035 + r() * 0.015, 8, 5), "papier", mal(b, M.trs(M.m4(), [(r() - 0.5) * 0.1, 0.24 + r() * 0.05, (r() - 0.5) * 0.1])), { kein_ao: true });
  };

  /* --- Sideboard mit Thermoskanne, Tassen und Büchern --- */
  W.sideboard = function (B, e, sz) {
    var b = mat(e.pos, e.dreh), l = e.laenge || 1.4;
    B.teil(Geo.box(l, 0.68, 0.45, 0.012, 2), "eiche_matt", mal(b, M.trs(M.m4(), [0, 0.36, 0])));
    B.teil(Geo.box(l + 0.02, 0.03, 0.47, 0.008, 2), "eiche", mal(b, M.trs(M.m4(), [0, 0.715, 0])));
    for (var i = 0; i < 3; i++) B.teil(Geo.box(0.012, 0.6, 0.004, 0.002, 0), "aluminium", mal(b, M.trs(M.m4(), [-l / 2 + (i + 1) * l / 4, 0.36, 0.226])), { kein_ao: true });
    B.teil(Geo.drehkoerper([[0, 0], [0.055, 0], [0.058, 0.2], [0.04, 0.23], [0.02, 0.26], [0, 0.26]], 24, {}), WELT.material("lack", { farbe: e.kanne || "#9a2f2a", rauheit: 0.25, klarlack: 0.8 }), mal(b, M.trs(M.m4(), [-l / 2 + 0.2, 0.73, 0])));
    [0.42, 0.55, 0.68].forEach(function (x, k) { W.becher(B, { pos: M.punktMal(b, [-l / 2 + x, 0.73, -0.06 + k * 0.05]), dreh: k * 50 }, null); });
    var buecher = ["#5a6e8a", "#a8553a", "#d6c49a", "#3f5a4a", "#7a6a8a"];
    buecher.forEach(function (f, k) { B.teil(Geo.box(0.035, 0.22 + (k % 2) * 0.03, 0.17, 0.003, 1), WELT.material("lack", { farbe: f, rauheit: 0.6 }), mal(b, M.trs(M.m4(), [l / 2 - 0.3 + k * 0.04, 0.84 + (k % 2) * 0.015, -0.05])), { kein_ao: true }); });
  };

  /* --- Stehlampe mit warmem Licht --- */
  W.stehlampe = function (B, e) {
    var b = mat(e.pos, e.dreh);
    B.teil(Geo.zylinder(0.16, 0.025, 24, true), "aluminium", b);
    B.teil(Geo.zylinder(0.012, 1.45, 8, false), "aluminium", mal(b, M.trs(M.m4(), [0, 0.02, 0])));
    B.teil(Geo.drehkoerper([[0.1, 0.0], [0.19, -0.02], [0.2, -0.24], [0.19, -0.25]], 32, {}), WELT.material("milchglas", { glas: false, emission: e.an ? 2.2 : 0, emissionFarbe: "#ffd9a8", rauheit: 0.6, doppelseitig: true }), mal(b, M.trs(M.m4(), [0, 1.72, 0])), { schatten: false });
    if (e.an) B.licht({ pos: M.punktMal(b, [0, 1.55, 0]), kelvin: 2900, staerke: e.staerke || 1.4, reichweite: 3.2 });
  };

  /* --- Wanduhr --- */
  W.wanduhr = function (B, e) {
    var b = mat(e.pos, e.dreh), auf = mal(b, (function () { var q = M.m4(); q[5] = 0; q[6] = 1; q[9] = -1; q[10] = 0; return q; })());
    B.teil(Geo.zylinder(0.16, 0.03, 32, true), WELT.material("lack", { farbe: "#26282c", rauheit: 0.3 }), auf);
    B.teil(Geo.zylinder(0.145, 0.032, 32, true), WELT.material("papier", { farbe: "#f4f1ea" }), auf, { kein_ao: true });
    B.teil(Geo.box(0.012, 0.09, 0.004, 0.002, 0), WELT.material("lack", { farbe: "#1b1c1f" }), mal(b, mal(M.trs(M.m4(), [0, 0.03, 0.035]), M.trs(M.m4(), [0, 0, 0], 0))), { kein_ao: true });
    B.teil(Geo.box(0.01, 0.12, 0.004, 0.002, 0), WELT.material("lack", { farbe: "#1b1c1f" }), mal(b, M.trs(M.m4(), [0.04, -0.02, 0.036])), { kein_ao: true });
  };

  /* =====================================================================
     Büro-Raum mit Fensterwand und Stadt dahinter
     ===================================================================== */
  W.bueroRaum = function (B, d, sz) {
    var r = d.raum, f = d.fenster;
    var bx = r.rechts - r.links, tz = r.vorne - r.hinten;
    var mx = (r.links + r.rechts) / 2, mz = (r.hinten + r.vorne) / 2;
    B.box(bx + 0.3, 0.1, tz + 0.3, 0.0, "teppich", [mx, -0.05, mz], 0);
    B.box(bx + 0.3, 0.12, tz + 0.3, 0.0, "modellharz", [mx, r.hoehe + 0.06, mz], 0);
    B.box(0.14, r.hoehe, tz, 0.0, "modellharz", [r.links - 0.07, r.hoehe / 2, mz], 0);
    B.box(0.14, r.hoehe, tz, 0.0, "modellharz", [r.rechts + 0.07, r.hoehe / 2, mz], 0);
    // Sockelleisten
    B.box(0.02, 0.07, tz, 0.004, "eiche_matt", [r.links + 0.01, 0.035, mz], 0, { verdecker: false });
    B.box(0.02, 0.07, tz, 0.004, "eiche_matt", [r.rechts - 0.01, 0.035, mz], 0, { verdecker: false });
    // Fensterwand: Pfosten, Riegel, Glas
    var z = r.hinten;
    var anzahl = Math.round(bx / f.pfostenAbstand);
    for (var i = 0; i <= anzahl; i++) {
      var x = r.links + i * bx / anzahl;
      B.box(0.06, r.hoehe, 0.14, 0.008, "aluminium", [x, r.hoehe / 2, z], 0, { verdecker: i === 0 || i === anzahl });
    }
    B.box(bx, 0.07, 0.14, 0.008, "aluminium", [mx, f.riegelHoehe, z], 0, { verdecker: false });
    B.box(bx, f.bruestung * 2, 0.16, 0.008, "aluminium", [mx, f.bruestung, z], 0, { verdecker: false });
    B.box(bx, 0.1, 0.14, 0.008, "aluminium", [mx, r.hoehe - 0.05, z], 0, { verdecker: false });
    // Fensterbank innen
    B.box(bx, 0.03, 0.22, 0.008, "modellharz", [mx, 0.42, z + 0.13], 0, { verdecker: false });
    B.box(bx, 0.36, 0.06, 0.008, "modellharz", [mx, 0.22, z + 0.04], 0, { verdecker: false });
    for (i = 0; i < anzahl; i++) {
      var xm = r.links + (i + 0.5) * bx / anzahl;
      B.teil(Geo.box(bx / anzahl - 0.06, f.riegelHoehe - 0.45, 0.012, 0, 0), "fensterglas", M.trs(M.m4(), [xm, 0.45 + (f.riegelHoehe - 0.45) / 2, z]), { schatten: false, kein_ao: true });
      B.teil(Geo.box(bx / anzahl - 0.06, r.hoehe - f.riegelHoehe - 0.13, 0.012, 0, 0), "fensterglas", M.trs(M.m4(), [xm, (r.hoehe - 0.1 + f.riegelHoehe) / 2, z]), { schatten: false, kein_ao: true });
    }
    // Stadt dahinter: helle Blöcke im Dunst (keine echten Wahrzeichen)
    var zz = M.zufall(d.stadt.saat || 7);
    var stadt = Geo.leer();
    for (i = 0; i < d.stadt.bloecke; i++) {
      var ent = 18 + Math.pow(zz(), 0.8) * 150;
      var sx = (zz() - 0.5) * (40 + ent * 1.6);
      var hb = 6 + zz() * 18 + (zz() < 0.15 ? 25 : 0);
      var bb = 6 + zz() * 16, tb = 6 + zz() * 14;
      var bm = M.trs(M.m4(), [sx, -14 + hb / 2, z - ent], (zz() - 0.5) * 20);
      Geo.anhaengen(stadt, Geo.box(bb, hb, tb, 0.3, 1), bm);
      if (zz() < 0.4) Geo.anhaengen(stadt, Geo.box(bb * 0.6, 2.5, tb * 0.6, 0.2, 1), M.trs(M.m4(), [sx, -14 + hb + 1.25, z - ent]));
    }
    B.objekt(stadt, WELT.material("modellharz_kuehl", { durchscheinen: 0 }), M.m4(), { statisch: true, schatten: false, nichtImSpiegel: true });
    B.objekt(Geo.box(600, 1, 600, 0, 0), "modellharz_kuehl", M.trs(M.m4(), [0, -14.5, z - 150]), { statisch: true, schatten: false, nichtImSpiegel: true });
    var himmel = Geo.kugel(380, 32, 16);
    B.objekt(himmel, WELT.material("himmel", { doppelseitig: true }), M.m4(), { statisch: true, schatten: false, immerZeichnen: true, nichtImSpiegel: true });
  };

  /* =====================================================================
     Plenarsaal
     ===================================================================== */
  W.plenarsaal = function (B, d, sz) {
    var H = d.halbrund, raum = d.raum;
    var gaenge = H.gaenge.map(function (g) { return g * GR; }), gb = H.gangBreite * GR;
    var w0 = H.winkelVon * GR, w1 = H.winkelBis * GR;
    // Boden (polierter Stein)
    B.box(34, 0.2, 28, 0, "steinboden", [0, -0.1, 3], 0);
    // Blöcke zwischen den Gängen
    var bloecke = [], start = w0;
    gaenge.concat([w1 + gb / 2]).forEach(function (g) { bloecke.push([start, g - gb / 2]); start = g + gb / 2; });
    var sitze = [], tischGeo = Geo.leer(), stufenGeo = Geo.leer(), kanteGeo = Geo.leer();
    var rStart = H.radiusStart, rA = H.reihenAbstand;
    for (var reihe = 0; reihe < H.sitzeProReihe.length; reihe++) {
      var rr = rStart + reihe * rA, hBoden = (reihe + 1) * H.stufenHoehe;
      // Stufe (Teppich) – der vordere Rand in heller Eiche
      Geo.anhaengen(stufenGeo, Geo.ringsegment(rr - rA * 0.5, rr + rA * 0.5, w0 - 3 * GR, w1 + 3 * GR, hBoden, 64, 0.0));
      Geo.anhaengen(kanteGeo, Geo.ringsegment(rr - rA * 0.5 - 0.012, rr - rA * 0.5 + 0.05, w0 - 3 * GR, w1 + 3 * GR, hBoden + 0.006, 64, 0.004));
      B.ringVerdecker([0, 0, 0], rr - rA * 0.5, rr + rA * 0.5, w0 - 3 * GR, w1 + 3 * GR, 0, hBoden);
      // Tische je Block
      bloecke.forEach(function (bl) {
        Geo.anhaengen(tischGeo, Geo.ringsegment(rr - 0.5, rr - 0.12, bl[0], bl[1], 0.04, 24, 0.012), M.trs(M.m4(), [0, hBoden + 0.72, 0]));
        Geo.anhaengen(tischGeo, Geo.ringsegment(rr - 0.5, rr - 0.47, bl[0], bl[1], 0.72, 24, 0.008), M.trs(M.m4(), [0, hBoden, 0]));
        B.ringVerdecker([0, 0, 0], rr - 0.5, rr - 0.12, bl[0], bl[1], hBoden + 0.7, hBoden + 0.76);
      });
      // Sitze gleichmäßig in den Blöcken verteilen
      var n = H.sitzeProReihe[reihe], gesamt = 0;
      bloecke.forEach(function (bl) { gesamt += bl[1] - bl[0]; });
      var proBlock = bloecke.map(function (bl) { return (bl[1] - bl[0]) / gesamt * n; });
      var verteilt = proBlock.map(Math.floor), rest = n - verteilt.reduce(function (a, b) { return a + b; }, 0);
      var reste = proBlock.map(function (x, i) { return [x - Math.floor(x), i]; }).sort(function (a, b) { return b[0] - a[0]; });
      for (var k = 0; k < rest; k++) verteilt[reste[k][1]]++;
      bloecke.forEach(function (bl, bi) {
        var m = verteilt[bi];
        for (var s = 0; s < m; s++) {
          var w = bl[0] + (bl[1] - bl[0]) * (s + 0.5) / m;
          sitze.push({ w: w, r: rr, y: hBoden, reihe: reihe });
        }
      });
    }
    B.teil(stufenGeo, "teppich", null);
    B.teil(kanteGeo, "eiche", null, { kein_ao: true });
    B.teil(tischGeo, "eiche", null);
    sitze.sort(function (a, b) { return b.w - a.w || a.r - b.r; });
    sz.sitze = sitze;
    // Stühle, Mikrofone, Sitzlampen als Instanzen
    var stuhlGeo = Geo.leer();
    Geo.anhaengen(stuhlGeo, Geo.box(0.5, 0.09, 0.46, 0.035, 2), M.trs(M.m4(), [0, 0.46, 0]));
    Geo.anhaengen(stuhlGeo, Geo.box(0.5, 0.56, 0.08, 0.035, 2), M.mul(M.m4(), M.trs(M.m4(), [0, 0.82, 0.24]), (function () { var q = M.m4(); var a = 10 * GR; q[5] = Math.cos(a); q[6] = Math.sin(a); q[9] = -Math.sin(a); q[10] = Math.cos(a); return q; })()));
    var fussGeo = Geo.leer();
    Geo.anhaengen(fussGeo, Geo.zylinder(0.03, 0.42, 10, true), M.trs(M.m4(), [0, 0.0, 0]));
    Geo.anhaengen(fussGeo, Geo.zylinder(0.2, 0.02, 20, true, 0.006), M.m4());
    var mikroGeo = Geo.leer();
    var hals = []; for (var i = 0; i <= 10; i++) { var t = i / 10; hals.push([0, 0.02 + t * 0.26, t * t * 0.14]); }
    Geo.anhaengen(mikroGeo, Geo.rohr(hals, 0.005, 6), null);
    Geo.anhaengen(mikroGeo, Geo.zylinder(0.03, 0.015, 14, true, 0.004), null);
    var ringGeo = Geo.zylinder(0.0085, 0.03, 10, true);
    var lampeGeo = Geo.box(0.07, 0.022, 0.035, 0.006, 2);
    var anz = sitze.length;
    var stuehle = B.objekt(stuhlGeo, "stoff_sitz", M.m4(), { instanzen: anz, festeKugel: true });
    var fuesse = B.objekt(fussGeo, "aluminium", M.m4(), { instanzen: anz, festeKugel: true });
    var mikros = B.objekt(mikroGeo, "aluminium", M.m4(), { instanzen: anz, festeKugel: true, schatten: false });
    var ringe = B.objekt(ringGeo, WELT.material("lack", { farbe: "#7a1a14" }), M.m4(), { instanzen: anz, festeKugel: true, schatten: false });
    var lampen = B.objekt(lampeGeo, WELT.material("milchglas", { glas: false, rauheit: 0.4 }), M.m4(), { instanzen: anz, festeKugel: true, schatten: false });
    [stuehle, fuesse, mikros, ringe, lampen].forEach(function (o) { o.kugelWelt = { m: [0, 2, 6], r: 16 }; });
    function inst(o, i, pos, dreh, farbe, leucht, sk) {
      var d = o.netz.instanzDaten, q = i * 12;
      d[q] = pos[0]; d[q + 1] = pos[1]; d[q + 2] = pos[2]; d[q + 3] = dreh;
      d[q + 4] = farbe[0]; d[q + 5] = farbe[1]; d[q + 6] = farbe[2]; d[q + 7] = leucht;
      d[q + 8] = sk ? sk[0] : 1; d[q + 9] = sk ? sk[1] : 1; d[q + 10] = sk ? sk[2] : 1; d[q + 11] = 0;
    }
    sitze.forEach(function (s, i) {
      var c = Math.cos(s.w), sn = Math.sin(s.w);
      var dreh = Math.atan2(c, sn);   // Lehne nach außen, Blick zur Mitte
      var rs = s.r + 0.12;
      inst(stuehle, i, [c * rs, s.y, sn * rs], dreh, [1, 1, 1], 0);
      inst(fuesse, i, [c * rs, s.y, sn * rs], dreh, [1, 1, 1], 0);
      var rm = s.r - 0.36, seite = 0.17;
      var mp = [c * rm - sn * seite, s.y + 0.76, sn * rm + c * seite];
      inst(mikros, i, mp, dreh, [1, 1, 1], 0);
      var cw = Math.cos(dreh), sw = Math.sin(dreh), lz = 0.14, ly = 0.28;
      inst(ringe, i, [mp[0] + sw * lz, mp[1] + ly - 0.015, mp[2] + cw * lz], dreh, [1, 0.25, 0.2], 0);
      var rl = s.r - 0.46;
      var lp = [c * rl + sn * 0.12, s.y + 0.772, sn * rl - c * 0.12];
      inst(lampen, i, lp, dreh, [1, 0.86, 0.66], 0.1);
      s.lampenPos = lp;
    });
    [stuehle, fuesse, mikros, ringe, lampen].forEach(function (o) { MOTOR.netzInstanzen(o.netz, anz); });
    sz.sitzlampen = lampen;
    sz.mikroRinge = ringe;

    // Präsidium
    var pr = d.praesidium;
    var pt = pr.vorne - pr.hinten, pz = (pr.vorne + pr.hinten) / 2;
    B.box(pr.breite, pr.hoehe, pt, 0.02, "eiche", [0, pr.hoehe / 2, pz], 0);
    B.box(pr.breite + 0.1, 0.04, pt + 0.06, 0.012, "modellharz", [0, pr.hoehe + 0.02, pz], 0, { verdecker: false });
    // Stufen vor dem Präsidium
    for (i = 0; i < 2; i++) B.box(5.0 - i * 0.6, (i + 1) * pr.hoehe / 3, 0.36, 0.01, "steinboden", [0, (i + 1) * pr.hoehe / 6, pr.vorne + 0.36 * (2 - i) - 0.18], 0);
    // Präsidiumstisch mit Stühlen
    B.box(8.4, 0.05, 0.9, 0.015, "eiche", [0, pr.hoehe + 0.75, pz + 0.2], 0);
    B.box(8.4, 0.72, 0.04, 0.01, "eiche", [0, pr.hoehe + 0.38, pz + 0.62], 0);
    for (i = -1; i <= 1; i++) W.stuhl(B, { pos: [i * 1.6, pr.hoehe + 0.04, pz - 0.55], dreh: 0 });
    // Lichtwand
    B.box(raum.breiteVorne * 2, raum.hoehe, 0.3, 0, "modellharz", [0, raum.hoehe / 2, raum.vorne - 0.15], 0);
    B.box(11, 5.4, 0.08, 0.02, WELT.material("milchglas", { glas: false, farbe: "#ece9e2", rauheit: 0.5, emission: 0.12, emissionFarbe: "#cfd8e8" }), [0, 4.6, raum.vorne + 0.04], 0, { verdecker: false });
    // Seitenwände (vorne gerade) und Rückwand (Halbrund)
    B.box(0.4, raum.hoehe, -raum.vorne, 0, "modellharz", [-raum.radius - 0.2, raum.hoehe / 2, raum.vorne / 2], 0);
    B.box(0.4, raum.hoehe, -raum.vorne, 0, "modellharz", [raum.radius + 0.2, raum.hoehe / 2, raum.vorne / 2], 0);
    B.teil(Geo.ringsegment(raum.radius, raum.radius + 0.4, 0, Math.PI, raum.hoehe, 64, 0), "modellharz", null);
    B.ringVerdecker([0, 0, 0], raum.radius, raum.radius + 0.4, 0, Math.PI, 0, raum.hoehe);
    // senkrechte Lisenen an der Rückwand (Rhythmus, Lichtkanten)
    for (i = 0; i <= 16; i++) {
      var wl = i / 16 * Math.PI;
      B.box(0.18, raum.hoehe, 0.22, 0.02, "modellharz", [Math.cos(wl) * (raum.radius - 0.08), raum.hoehe / 2, Math.sin(wl) * (raum.radius - 0.08)], -wl / GR + 90, { verdecker: false });
    }
    // Umgang hinter der letzten Reihe und Wandverkleidung aus Eiche
    var letzte = rStart + (H.sitzeProReihe.length - 1) * rA + rA * 0.5, hOben = H.sitzeProReihe.length * H.stufenHoehe;
    B.teil(Geo.ringsegment(letzte, raum.radius, 0, Math.PI, hOben, 64, 0), "teppich", null);
    B.ringVerdecker([0, 0, 0], letzte, raum.radius, 0, Math.PI, 0, hOben);
    B.teil(Geo.ringsegment(raum.radius - 0.06, raum.radius, 0.02, Math.PI - 0.02, 2.3, 96, 0.01), "eiche", M.trs(M.m4(), [0, hOben, 0]), { kein_ao: false });
    [-1, 1].forEach(function (sx) {
      B.box(0.06, 3.2, -raum.vorne - 0.3, 0.01, "eiche", [sx * (raum.radius - 0.03), 1.6, raum.vorne / 2], 0, { verdecker: false });
      for (var k = 0; k < 6; k++) B.box(0.12, raum.hoehe - 3.2, 0.2, 0.02, "modellharz", [sx * (raum.radius - 0.06), 3.2 + (raum.hoehe - 3.2) / 2, raum.vorne + 0.9 + k * 1.55], 0, { verdecker: false });
    });
    // Rang (Galerie) mit Glasbrüstung
    var rg = d.rang;
    B.teil(Geo.ringsegment(rg.radius, raum.radius, 14 * GR, 166 * GR, 0.35, 64, 0.02), "modellharz", M.trs(M.m4(), [0, rg.hoehe - 0.35, 0]));
    B.ringVerdecker([0, 0, 0], rg.radius, raum.radius, 14 * GR, 166 * GR, rg.hoehe - 0.35, rg.hoehe);
    B.teil(Geo.ringsegment(rg.radius, rg.radius + 0.015, 14 * GR, 166 * GR, 0.95, 64, 0), "klarglas", M.trs(M.m4(), [0, rg.hoehe, 0]), { schatten: false, kein_ao: true });
    B.teil(Geo.ringsegment(rg.radius - 0.03, rg.radius + 0.045, 14 * GR, 166 * GR, 0.05, 64, 0.01), "aluminium", M.trs(M.m4(), [0, rg.hoehe + 0.95, 0]), { kein_ao: true });
    for (i = 0; i < 3; i++) {
      B.teil(Geo.ringsegment(rg.radius + 0.4 + i * 0.6, raum.radius, 16 * GR, 164 * GR, 0.3 * (i + 1), 48, 0.01), "teppich", M.trs(M.m4(), [0, rg.hoehe, 0]));
    }
    // Decke mit Glasdach
    var gd = d.glasdach, hx = gd.groesse[0] / 2, hz = gd.groesse[1] / 2;
    var gx0 = gd.mitte[0] - hx, gx1 = gd.mitte[0] + hx, gz0 = gd.mitte[1] - hz, gz1 = gd.mitte[1] + hz;
    var dx0 = -raum.radius - 0.4, dx1 = raum.radius + 0.4, dz0 = raum.vorne - 0.3, dz1 = raum.radius + 0.4;
    var dh = raum.hoehe + 0.25;
    B.box(gx0 - dx0, 0.5, dz1 - dz0, 0, "modellharz", [(dx0 + gx0) / 2, dh, (dz0 + dz1) / 2], 0);
    B.box(dx1 - gx1, 0.5, dz1 - dz0, 0, "modellharz", [(gx1 + dx1) / 2, dh, (dz0 + dz1) / 2], 0);
    B.box(gx1 - gx0, 0.5, gz0 - dz0, 0, "modellharz", [(gx0 + gx1) / 2, dh, (dz0 + gz0) / 2], 0);
    B.box(gx1 - gx0, 0.5, dz1 - gz1, 0, "modellharz", [(gx0 + gx1) / 2, dh, (gz1 + dz1) / 2], 0);
    // Unterzüge (Deckenträger) für Tiefe
    for (i = -3; i <= 3; i++) {
      if (i * 4.2 > gx0 - 0.5 && i * 4.2 < gx1 + 0.5) continue;
      B.box(0.35, 0.6, dz1 - dz0, 0.03, "modellharz", [i * 4.2, raum.hoehe - 0.3, (dz0 + dz1) / 2], 0, { verdecker: false });
    }
    // Stahlträger und Glasfelder
    var fx = gd.felder[0], fz = gd.felder[1];
    for (i = 0; i <= fx; i++) B.box(0.1, 0.42, gz1 - gz0, 0.01, "stahl", [gx0 + i * (gx1 - gx0) / fx, raum.hoehe + 0.2, (gz0 + gz1) / 2], 0, { verdecker: false });
    for (i = 0; i <= fz; i++) B.box(gx1 - gx0, 0.32, 0.08, 0.01, "stahl", [(gx0 + gx1) / 2, raum.hoehe + 0.3, gz0 + i * (gz1 - gz0) / fz], 0, { verdecker: false });
    B.teil(Geo.box(gx1 - gx0, 0.02, gz1 - gz0, 0, 0), "fensterglas", M.trs(M.m4(), [(gx0 + gx1) / 2, raum.hoehe + 0.5, (gz0 + gz1) / 2]), { schatten: false, kein_ao: true });
    // Himmel über dem Glasdach
    B.objekt(Geo.kugel(300, 32, 16), WELT.material("himmel", { doppelseitig: true }), M.m4(), { statisch: true, schatten: false, immerZeichnen: true });
    // Rednerpult
    W.rednerpult(B, d.rednerpult, sz);
  };

  /* --- Rednerpult mit Pultleuchte --- */
  W.rednerpult = function (B, e, sz) {
    var basis = mat(e.pos, e.dreh);
    B.teil(Geo.box(0.86, 1.02, 0.5, 0.02, 3), "eiche", mal(basis, M.trs(M.m4(), [0, 0.51, 0])));
    B.verdecker.push({ typ: "box", inv: M.invert(M.m4(), mal(basis, M.trs(M.m4(), [0, 0.51, 0]))), h: [0.43, 0.51, 0.25], m: M.punktMal(basis, [0, 0.51, 0]), r: 0.7 });
    B.teil(Geo.box(0.9, 0.06, 0.54, 0.02, 2), "aluminium", mal(basis, M.trs(M.m4(), [0, 0.03, 0])));
    // schräge Lesefläche (fällt zum Redner hin ab)
    var neig = -16 * GR;
    var schraeg = M.mul(M.m4(), M.trs(M.m4(), [0, 1.08, -0.02]), (function () { var q = M.m4(); q[5] = Math.cos(neig); q[6] = Math.sin(neig); q[9] = -Math.sin(neig); q[10] = Math.cos(neig); return q; })());
    var pultM = mal(basis, schraeg);
    B.teil(Geo.box(0.7, 0.03, 0.52, 0.01, 2), "eiche", pultM);
    B.teil(Geo.box(0.7, 0.025, 0.02, 0.006, 1), "aluminium", mal(pultM, M.trs(M.m4(), [0, 0.022, -0.25])));
    sz.pultFlaeche = mal(pultM, M.trs(M.m4(), [0, 0.0155, 0]));
    // Mikrofon am Pult
    var hals = []; for (var i = 0; i <= 10; i++) { var t = i / 10; hals.push([0.3, 1.13 + Math.sin(t * 1.5) * 0.17, 0.21 - t * 0.12]); }
    B.teil(Geo.rohr(hals, 0.005, 6), "aluminium", basis);
    // Pultleuchte: streifendes warmes Licht über das Blatt
    var lm = mal(basis, M.trs(M.m4(), [-0.24, 1.33, 0.24]));
    var arm = [[-0.24, 1.12, 0.22], [-0.24, 1.26, 0.25], [-0.2, 1.35, 0.22]];
    B.teil(Geo.rohr(arm, 0.006, 6), "aluminium", basis);
    B.teil(Geo.zylinder(0.03, 0.1, 16, true, 0.005), "aluminium", mal(lm, (function () { var q = M.m4(); var a = 70 * GR; q[0] = Math.cos(a); q[1] = Math.sin(a); q[4] = -Math.sin(a); q[5] = Math.cos(a); return q; })()));
    B.licht({ pos: M.punktMal(lm, [0.06, -0.04, -0.02]), kelvin: 2700, staerke: 0.06, reichweite: 1.4, richtung: M.norm(M.richtungMal(basis, [0.6, -0.55, -0.6])), kegelAussen: 70, kegelInnen: 35 });
  };

  /* =====================================================================
     Glasmodell des Ausschusses (60 Würfel) – Abschnitt 7.9
     ===================================================================== */
  W.glasmodell = function (B, e, sz) {
    var basis = mat(e.pos, e.dreh);
    var reihen = [11, 14, 16, 19], radien = [0.075, 0.104, 0.133, 0.162], stufe = 0.009, wuerfel = 0.0145;
    // Sockel aus Milchglas und gestufte Glasebenen
    B.teil(Geo.ringsegment(0.0, 0.19, Math.PI, Math.PI * 2, 0.012, 48, 0.003), WELT.material("milchglas", { glas: false, rauheit: 0.45, durchscheinen: 0.6 }), basis);
    for (var r = 0; r < 4; r++) {
      var mt = mal(basis, M.trs(M.m4(), [0, 0.012, 0]));
      B.objekt(Geo.ringsegment(radien[r] - 0.0145, radien[r] + 0.0145, Math.PI + 0.06, Math.PI * 2 - 0.06, stufe * (r + 1), 40, 0.002), "klarglas", mt, { statisch: true, schatten: false });
    }
    var plaetze = [];
    for (r = 0; r < 4; r++) {
      for (var s = 0; s < reihen[r]; s++) {
        var w = Math.PI + 0.16 + (Math.PI - 0.32) * (s + 0.5) / reihen[r];
        plaetze.push({ w: w, r: radien[r], y: 0.012 + stufe * (r + 1), reihe: r });
      }
    }
    plaetze.sort(function (a, b) { return b.w - a.w || a.r - b.r; });
    plaetze.reverse();
    var n = plaetze.length;
    var huelle = B.objekt(Geo.box(wuerfel, wuerfel, wuerfel, 0.0025, 2), WELT.material("klarglas", { alpha: 0.18, brechung: 0.02 }), basis, { instanzen: n, schatten: false, keineBrechung: false });
    var kern = B.objekt(Geo.box(wuerfel * 0.62, wuerfel * 0.62, wuerfel * 0.62, 0.0015, 2), WELT.material("milchglas", { glas: false, rauheit: 0.35, farbe: "#ffffff" }), basis, { instanzen: n, schatten: true });
    var sockel = B.objekt(Geo.box(wuerfel * 1.1, 0.0016, wuerfel * 1.1, 0.0004, 1), WELT.material("lack", { rauheit: 0.5, klarlack: 0.2, farbe: "#ffffff" }), basis, { instanzen: n, muster: true, schatten: false });
    // Lichtlinie der Mehrheit (60 kleine Striche entlang der Vorderkante)
    var strich = B.objekt(Geo.box(0.004, 0.0016, 0.0024, 0.0006, 1), WELT.material("milchglas", { glas: false, rauheit: 0.3 }), basis, { instanzen: n + 1, schatten: false });
    [huelle, kern, sockel, strich].forEach(function (o) { o.kugelWelt = { m: e.pos, r: 0.25 }; o.festeKugel = true; });
    sz.glasmodell = { basis: basis, plaetze: plaetze, huelle: huelle, kern: kern, sockel: sockel, strich: strich, wuerfel: wuerfel, zustand: [], anzeige: [] };
    for (var i = 0; i < n; i++) sz.glasmodell.anzeige.push({ licht: 0, kipp: 0, farbe: [1, 1, 1], muster: 5, halb: 0 });
    // Lichtfleck auf dem Tisch
    var lw = MOTOR.texturen.leinwand(128, 128);
    sz.glasmodell.leinwand = lw;
    sz.fleck = { tex: MOTOR.gl.textur({ quelle: lw }), mitte: [e.pos[0], e.pos[2]], groesse: [0.62, 0.62], staerke: 0.0, y: e.pos[1], abfall: 25 };
  };

  return W;
})();

/* =====================================================================
   Räume für Kapitel 2 bis 7 und den Epilog
   ===================================================================== */
(function (W) {
  var M = MOTOR.m, Geo = MOTOR.geo, GR = M.GRAD;
  function mal(a, b) { return M.mul(M.m4(), a, b); }
  function rotX(g) { var q = M.m4(), a = g * GR; q[5] = Math.cos(a); q[6] = Math.sin(a); q[9] = -Math.sin(a); q[10] = Math.cos(a); return q; }
  function rotZ(g) { var q = M.m4(), a = g * GR; q[0] = Math.cos(a); q[1] = Math.sin(a); q[4] = -Math.sin(a); q[5] = Math.cos(a); return q; }
  function aufrecht() { var q = M.m4(); q[5] = 0; q[6] = 1; q[9] = -1; q[10] = 0; return q; }
  function fraktion(id) { var r = null; DATA.fraktionen.forEach(function (f) { if (f.id === id) r = f; }); return r; }

  /* Instanzdaten schreiben */
  function inst(o, i, pos, dreh, farbe, leucht, sk, w) {
    var d = o.netz.instanzDaten, q = i * 12;
    d[q] = pos[0]; d[q + 1] = pos[1]; d[q + 2] = pos[2]; d[q + 3] = dreh;
    d[q + 4] = farbe[0]; d[q + 5] = farbe[1]; d[q + 6] = farbe[2]; d[q + 7] = leucht || 0;
    d[q + 8] = sk ? sk[0] : 1; d[q + 9] = sk ? sk[1] : 1; d[q + 10] = sk ? sk[2] : 1; d[q + 11] = w || 0;
  }
  W.inst = inst;

  /* weiße Modellfiguren als Instanzen */
  /* Menschenmengen als schlichte Modellfiguren: Kleidung in gedeckten Farben, Kopf und Hände
     in natürlichen Hauttönen (zwei Instanz-Puffer, zufällig, aber immer gleich) */
  var KLEIDUNG_MENGE = ["#2f3a48", "#3d4452", "#5a4a3c", "#6b6f76", "#7a3f3a", "#2e4a44", "#8c8574", "#454a52", "#b9b2a4", "#1f2329", "#4b3f55", "#6d5a3a"];
  W.modellFiguren = function (B, plaetze, sitzend, kugel) {
    if (!plaetze.length) return null;
    var r = M.zufall(plaetze.length * 7 + 3);
    var koerper = B.objekt(WELT.figuren.modellFigur(sitzend, "koerper"), WELT.material("stoff", { farbe: "#ffffff", strukturSkala: 18 }), M.m4(), { instanzen: plaetze.length, instFarbe: true });
    var haut = B.objekt(WELT.figuren.modellFigur(sitzend, "haut"), WELT.material("haut", { farbe: "#ffffff" }), M.m4(), { instanzen: plaetze.length, instFarbe: true });
    plaetze.forEach(function (p, i) {
      var sk = [p.skala || 1, p.skala || 1, p.skala || 1];
      var kl = M.farbe(p.kleidung || KLEIDUNG_MENGE[Math.floor(r() * KLEIDUNG_MENGE.length)]);
      var hf = M.farbe(DATA.figuren.hauttoene[Math.floor(r() * DATA.figuren.hauttoene.length)]);
      inst(koerper, i, p.pos, p.dreh, kl, 0, sk);
      inst(haut, i, p.pos, p.dreh, hf, 0, sk);
    });
    MOTOR.netzInstanzen(koerper.netz, plaetze.length); MOTOR.netzInstanzen(haut.netz, plaetze.length);
    koerper.festeKugel = true; koerper.kugelWelt = kugel; haut.festeKugel = true; haut.kugelWelt = kugel;
    return koerper;
  };

  /* Flaggen als Stoff (Europaflagge und Flaggen von Mitgliedstaaten) */
  function flaggeTextur(art) {
    var lw = MOTOR.texturen.leinwand(128, 192), c = lw.getContext("2d");
    var streifen = {
      frankreich: [["#1f3f8f", "#f4f4f2", "#d23b37"], "v"], italien: [["#2f8a4e", "#f4f4f2", "#cf3a36"], "v"],
      belgien: [["#1d1d1f", "#f2cf3a", "#d33a36"], "v"], irland: [["#2f8a4e", "#f4f4f2", "#e88a3a"], "v"],
      oesterreich: [["#c8333a", "#f4f4f2", "#c8333a"], "h"], deutschland: [["#1d1d1f", "#d0322c", "#f0c43a"], "h"]
    };
    if (art === "eu") {
      c.fillStyle = "#1f3e94"; c.fillRect(0, 0, 128, 192);
      c.fillStyle = "#f2cb3a";
      for (var i = 0; i < 12; i++) {
        var w = i / 12 * Math.PI * 2, x = 64 + Math.cos(w) * 38, y = 96 + Math.sin(w) * 38;
        c.beginPath();
        for (var k = 0; k < 10; k++) { var r = k % 2 ? 2.6 : 6.2, a = -Math.PI / 2 + k * Math.PI / 5; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
        c.closePath(); c.fill();
      }
    } else {
      var s = streifen[art] || streifen.frankreich;
      for (i = 0; i < 3; i++) { c.fillStyle = s[0][i]; if (s[1] === "v") c.fillRect(0, i * 64, 128, 64); else c.fillRect(i * 128 / 3, 0, 128 / 3 + 1, 192); }
    }
    return MOTOR.gl.textur({ quelle: lw, mip: true, drehen: true });
  }
  W.flagge = function (B, pos, art, phase) {
    B.teil(Geo.zylinder(0.02, 2.4, 10, true), "aluminium", M.trs(M.m4(), pos));
    B.teil(Geo.zylinder(0.16, 0.03, 16, true, 0.008), "aluminium", M.trs(M.m4(), pos));
    var tuch = Geo.ebene(0.62, 1.15, 8, 14);
    Geo.verformen(tuch, function (p) { var u = p[0] / 0.62 + 0.5; return [p[0], Math.sin(u * 5 + phase) * 0.035 * u + Math.sin(p[2] * 6 + phase) * 0.01, p[2]]; });
    var m = mal(M.trs(M.m4(), [pos[0] + 0.33, pos[1] + 1.72, pos[2]]), aufrecht());
    B.objekt(tuch, WELT.material("stoff", { farbe: "#ffffff", doppelseitig: true, strukturSkala: 24, samt: 0.5 }), m, { statisch: true, farbTex: flaggeTextur(art) });
  };

  /* Mikrofon-Geometrie (Schwanenhals) */
  function mikroGeo() {
    var g = Geo.leer(), hals = [];
    for (var i = 0; i <= 10; i++) { var t = i / 10; hals.push([0, 0.02 + t * 0.26, t * t * 0.14]); }
    Geo.anhaengen(g, Geo.rohr(hals, 0.005, 6), null);
    Geo.anhaengen(g, Geo.zylinder(0.03, 0.015, 14, true, 0.004), null);
    return g;
  }

  /* Glas und Wasserflasche */
  function wasser(B, pos) {
    B.teil(Geo.drehkoerper([[0, 0], [0.032, 0], [0.034, 0.18], [0.03, 0.22], [0.014, 0.26], [0.014, 0.29], [0, 0.29]], 20, {}), "klarglas", M.trs(M.m4(), pos), { schatten: false, kein_ao: true });
    B.teil(Geo.drehkoerper([[0, 0], [0.027, 0], [0.03, 0.1], [0.028, 0.1]], 20, {}), "klarglas", M.trs(M.m4(), [pos[0] + 0.1, pos[1], pos[2] + 0.04]), { schatten: false, kein_ao: true });
  }

  /* =====================================================================
     Ausschusssaal (Kapitel 2 und 5)
     ===================================================================== */
  W.ausschusssaal = function (B, d, sz) {
    var r = d.raum, t = d.tisch, H = r.hoehe;
    var z0 = r.hinten, z1 = z0 + r.tiefe, bx = r.breite;
    B.box(bx + 0.4, 0.1, r.tiefe + 0.4, 0, "teppich", [0, -0.05, (z0 + z1) / 2], 0);
    B.box(bx + 0.4, 0.2, r.tiefe + 0.4, 0, "modellharz", [0, H + 0.1, (z0 + z1) / 2], 0);
    B.box(bx, H, 0.3, 0, "modellharz", [0, H / 2, z0 - 0.15], 0);
    B.box(0.3, H, r.tiefe, 0, "modellharz", [-bx / 2 - 0.15, H / 2, (z0 + z1) / 2], 0);
    B.box(0.3, H, r.tiefe, 0, "modellharz", [bx / 2 + 0.15, H / 2, (z0 + z1) / 2], 0);
    // Wandverkleidung aus Eiche und Lisenen
    B.box(bx, 1.25, 0.04, 0.008, "eiche", [0, 0.625, z0 + 0.02], 0, { verdecker: false });
    [-1, 1].forEach(function (s) { B.box(0.04, 1.25, r.tiefe, 0.008, "eiche", [s * (bx / 2 - 0.02), 0.625, (z0 + z1) / 2], 0, { verdecker: false }); });
    for (var i = -3; i <= 3; i++) B.box(0.14, H - 1.25, 0.16, 0.02, "modellharz", [i * 2.3, 1.25 + (H - 1.25) / 2, z0 + 0.08], 0, { verdecker: false });
    // Deckenfelder aus Milchglas (leuchten)
    for (var ix = -1; ix <= 1; ix++) for (var iz = 0; iz < 3; iz++)
      B.teil(Geo.box(3.4, 0.03, 2.4, 0.01, 1), WELT.material("milchglas", { glas: false, emission: 2.4, emissionFarbe: "#f4f1ea", rauheit: 0.5 }), M.trs(M.m4(), [ix * 4.6, H - 0.02, z0 + 2.4 + iz * 3.6]), { schatten: false, kein_ao: true });
    // Dolmetschkabinen über den Gästen
    var kab = [];
    for (i = 0; i < 5; i++) {
      var kx = -4.4 + i * 2.2;
      B.teil(Geo.box(1.9, 1.0, 0.6, 0.01, 1), WELT.material("milchglas", { glas: false, emission: 1.6, emissionFarbe: "#ffd9a8", rauheit: 0.6 }), M.trs(M.m4(), [kx, 3.25, z0 - 0.32]), { schatten: false, kein_ao: true });
      B.teil(Geo.box(1.9, 1.0, 0.02, 0, 0), "klarglas", M.trs(M.m4(), [kx, 3.25, z0 + 0.04]), { schatten: false, kein_ao: true });
      B.box(2.0, 0.05, 0.08, 0.01, "aluminium", [kx, 2.73, z0 + 0.05], 0, { verdecker: false });
      kab.push({ pos: [kx + 0.3, 2.2, z0 - 0.45], dreh: 0, skala: 0.95 });
    }
    W.modellFiguren(B, kab, true, { m: [0, 3, z0], r: 6 });
    // Hufeisentisch aus Eiche (Tischplatte spiegelt)
    var eiche = WELT.material("eiche", { spiegelt: true });
    B.teil(Geo.box(t.querBreite, 0.04, 0.85, 0.012, 3), eiche, M.trs(M.m4(), [0, 0.74, t.querZ]));
    B.box(t.querBreite, 0.7, 0.03, 0.008, "eiche_matt", [0, 0.37, t.querZ + 0.4], 0);
    var armL = t.armBis - t.armVon;
    [-1, 1].forEach(function (s) {
      B.teil(Geo.box(0.85, 0.04, armL, 0.012, 3), eiche, M.trs(M.m4(), [s * t.armX, 0.74, (t.armVon + t.armBis) / 2]));
      B.box(0.03, 0.7, armL, 0.008, "eiche_matt", [s * (t.armX - 0.4), 0.37, (t.armVon + t.armBis) / 2], 0);
      // Podest für die zweite Reihe
      B.box(1.0, 0.24, armL, 0.02, "teppich", [s * (t.armX + 1.75), 0.12, (t.armVon + t.armBis) / 2], 0);
    });
    // Gäste: Stühle, Mikrofone, Wasser, Namensschilder
    d.gaeste.forEach(function (g) {
      var p = DATA.figuren.personen[g.person];
      if (!p.rollstuhl) W.stuhl(B, { pos: g.pos, dreh: g.dreh });
      B.teil(mikroGeo(), "aluminium", M.trs(M.m4(), [g.pos[0] + 0.2, 0.76, t.querZ + 0.1], 180));
      wasser(B, [g.pos[0] - 0.25, 0.76, t.querZ + 0.05]);
      B.teil(Geo.box(0.24, 0.07, 0.02, 0.005, 1), WELT.material("lack", { farbe: "#f2f0ea", rauheit: 0.4 }), mal(M.trs(M.m4(), [g.pos[0], 0.795, t.querZ + 0.36]), rotX(-12)), { kein_ao: true });
    });
    // Abgeordnete: 60 Plätze an den Armen, in Fraktionsblöcken
    var fr = DATA.fraktionen.slice().sort(function (a, b) { return a.sitzordnung - b.sitzordnung; });
    var sitze = [], n = DATA.spielwerte.sitze_ausschuss, proArm = n / 2, proReihe = proArm / 2;
    for (i = 0; i < n; i++) {
      var arm = i < proArm ? -1 : 1, k = i < proArm ? i : n - 1 - i;
      var reihe = k % 2, idx = Math.floor(k / 2);
      var z = t.armBis - 0.35 - idx * (armL - 0.6) / (proReihe - 1);
      var x = arm * (t.armX + 0.78 + reihe * 0.95);
      sitze.push({ pos: [x, reihe * 0.24, z], dreh: arm < 0 ? Math.PI / 2 : -Math.PI / 2, reihe: reihe, arm: arm });
    }
    var j = 0;
    fr.forEach(function (f) { for (var k = 0; k < f.sitzeAusschuss; k++) { sitze[j].fraktion = f.id; sitze[j].farbe = M.farbe(f.farbe); j++; } });
    sz.ausschussSitze = sitze;
    var stuhlGeo = Geo.leer();
    Geo.anhaengen(stuhlGeo, Geo.box(0.48, 0.08, 0.46, 0.03, 2), M.trs(M.m4(), [0, 0.42, 0]));
    Geo.anhaengen(stuhlGeo, Geo.box(0.48, 0.5, 0.07, 0.03, 2), mal(M.trs(M.m4(), [0, 0.74, 0.23]), rotX(8)));
    Geo.anhaengen(stuhlGeo, Geo.zylinder(0.025, 0.38, 8, true), M.m4());
    var stuehle = B.objekt(stuhlGeo, "stoff_sitz", M.m4(), { instanzen: n });
    var schilder = B.objekt(Geo.box(0.22, 0.06, 0.02, 0.005, 1), WELT.material("lack", { farbe: "#ffffff", rauheit: 0.35, klarlack: 0.6 }), M.m4(), { instanzen: n, instFarbe: true, schatten: false });
    var lampen = B.objekt(Geo.box(0.06, 0.02, 0.035, 0.005, 2), WELT.material("milchglas", { glas: false, rauheit: 0.4 }), M.m4(), { instanzen: n, schatten: false });
    var mikros = B.objekt(mikroGeo(), "aluminium", M.m4(), { instanzen: n, schatten: false });
    var figuren = [];
    sitze.forEach(function (s, i) {
      var c = Math.cos(s.dreh), sn = Math.sin(s.dreh);
      inst(stuehle, i, [s.pos[0] - sn * 0.0, s.pos[1], s.pos[2]], s.dreh + Math.PI, [1, 1, 1], 0);
      var tx = s.arm * (t.armX + 0.1);
      if (s.reihe === 0) {
        inst(schilder, i, [s.arm * (t.armX - 0.3), 0.79, s.pos[2]], s.dreh, s.farbe, 0);
        inst(lampen, i, [s.arm * (t.armX - 0.15), 0.77, s.pos[2] + 0.15], s.dreh, [1, 0.9, 0.75], 0.1);
        inst(mikros, i, [s.arm * (t.armX - 0.05), 0.76, s.pos[2] - 0.12], s.dreh + Math.PI, [1, 1, 1], 0);
      } else {
        inst(schilder, i, [s.pos[0] - s.arm * 0.4, 0.5, s.pos[2]], s.dreh, s.farbe, 0, [1, 1, 1]);
        inst(lampen, i, [s.pos[0] - s.arm * 0.42, 0.56, s.pos[2] + 0.15], s.dreh, [1, 0.9, 0.75], 0.1);
        inst(mikros, i, [s.pos[0] - s.arm * 0.42, 0.5, s.pos[2] - 0.12], s.dreh + Math.PI, [1, 1, 1], 0, [0, 0, 0]);
      }
      figuren.push({ pos: [s.pos[0], s.pos[1], s.pos[2]], dreh: s.dreh, farbe: [1, 1, 1] });
    });
    // zweite Reihe: schmale Ablage
    [-1, 1].forEach(function (s) { B.box(0.3, 0.5, armL, 0.01, "eiche_matt", [s * (t.armX + 1.25), 0.25, (t.armVon + t.armBis) / 2], 0, { verdecker: false }); });
    [stuehle, schilder, lampen, mikros].forEach(function (o) { MOTOR.netzInstanzen(o.netz, n); o.festeKugel = true; o.kugelWelt = { m: [0, 1, 1.5], r: 9 }; });
    sz.ausschussLampen = lampen;
    sz.mitgliederFiguren = W.modellFiguren(B, figuren, true, { m: [0, 1, 1.5], r: 9 });
    // Flaggen
    d.flaggen.forEach(function (a, i) { W.flagge(B, [-4.6 + i * 1.4 + (i > 2 ? 1.6 : 0), 0, z0 + 0.6], a, i * 1.3); });
  };

  /* =====================================================================
     Büro einer Fraktion im Schnittmodell
     ===================================================================== */
  function fraktionsBuero(B, x0, x1, y, fid) {
    var xm = (x0 + x1) / 2, f = fraktion(fid), farbe = f ? f.farbe : "#00a2ad";
    W.schreibtisch(B, { pos: [xm - 0.6, y, -2.4], dreh: 0, groesse: [1.6, 0.75, 0.8] });
    W.stuhl(B, { pos: [xm - 0.6, y, -3.0], dreh: 0 });
    // Regal an der Seitenwand mit Ordnern in Fraktionsfarbe
    B.teil(Geo.box(0.36, 1.9, 1.6, 0.01, 1), "eiche_matt", M.trs(M.m4(), [x0 + 0.25, y + 0.95, -2.9]));
    for (var e = 0; e < 4; e++) for (var o = 0; o < 9; o++)
      B.teil(Geo.box(0.26, 0.3, 0.06 + (o % 3) * 0.01, 0.004, 1), WELT.material("lack", { farbe: o % 4 === 3 ? "#e6e2d8" : farbe, rauheit: 0.4, klarlack: 0.3 }), M.trs(M.m4(), [x0 + 0.27, y + 0.2 + e * 0.45, -3.6 + o * 0.15]), { kein_ao: true });
    // Mappen auf dem Tisch, Lampe, Pflanze
    B.teil(Geo.box(0.24, 0.02, 0.32, 0.004, 1), WELT.material("lack", { farbe: farbe, rauheit: 0.35 }), M.trs(M.m4(), [xm - 0.95, y + 0.77, -2.35], 8), { kein_ao: true });
    W.pflanze(B, { pos: [x1 - 0.55, y, -3.5], saat: Math.floor(x0 * 7 + y * 3 + 40) });
    // Fraktionsfarbe als lackierter Akzent an der Wand
    B.teil(Geo.box(1.4, 0.06, 0.02, 0.01, 1), WELT.material("lack", { farbe: farbe, rauheit: 0.3, klarlack: 0.8 }), M.trs(M.m4(), [xm, y + 2.5, -3.97]), { kein_ao: true });
    // bewohnt: Teppich, Bild, Besucherstuhl
    W.teppich(B, { pos: [xm - 0.3, y, -2.1], groesse: [2.6, 1.8], farbe: "#6f6458", innen: "#8c8070" });
    W.bild(B, { pos: [xm + 0.9, y + 1.6, -3.97], dreh: 0, groesse: [0.8, 0.55], saat: Math.floor(x0 * 3 + y * 7 + 20), farben: [farbe, "#d9cdb4", "#3f4650", "#b08a5a"] });
    W.stuhl(B, { pos: [xm - 0.2, y, -1.55], dreh: 160 });
  }

  /* =====================================================================
     Schnittmodell des Parlamentsgebäudes (Kapitel 4)
     ===================================================================== */
  W.gebaeude = function (B, d, sz) {
    var H = d.etagenHoehe, bx = d.breite, tz = d.tiefe, sock = 0.25;
    var hz = tz / 2;
    // dunkle Tischplatte, auf der das Modell steht (spiegelt)
    // groß genug, dass man auch im Hochformat (Kamera flach von vorn) keine Tischkante sieht
    B.teil(Geo.box(70, 0.6, 64, 0.05, 2), WELT.material("lack", { farbe: "#1c1d21", rauheit: 0.28, klarlack: 0.9, spiegelt: true }), M.trs(M.m4(), [0, -0.3, 12]));
    B.verdecker.push({ typ: "box", inv: M.invert(M.m4(), M.trs(M.m4(), [0, -0.3, 12])), h: [35, 0.3, 32], m: [0, -0.3, 12], r: 48 });
    sz.raumGlas = {}; sz.hotspots = []; sz.raumPos = {};
    for (var e = 0; e < d.etagen; e++) {
      var y0 = sock + e * H;
      // Decke/Boden-Platte
      B.box(bx + 0.3, 0.24, tz + 0.3, 0.03, "modellharz", [0, y0 - 0.12, 0], 0);
      // Flur mit poliertem Steinboden
      B.teil(Geo.box(bx, 0.02, hz - 0.1, 0, 0), WELT.material("steinboden", { spiegelt: e === 0 }), M.trs(M.m4(), [0, y0 + 0.01, hz / 2 + 0.05]), { kein_ao: false });
      // Rückwand mit Fenstern pro Raum
      d.raeume.filter(function (r) { return r.etage === e; }).forEach(function (r) {
        var w = r.bis - r.von, xm = (r.von + r.bis) / 2, fw = w * 0.55;
        B.box(w, 0.95, 0.24, 0, "modellharz", [xm, y0 + 0.475, -hz], 0);
        B.box(w, H - 2.75, 0.24, 0, "modellharz", [xm, y0 + 2.75 + (H - 2.75) / 2, -hz], 0);
        B.box((w - fw) / 2, 1.8, 0.24, 0, "modellharz", [r.von + (w - fw) / 4, y0 + 1.85, -hz], 0);
        B.box((w - fw) / 2, 1.8, 0.24, 0, "modellharz", [r.bis - (w - fw) / 4, y0 + 1.85, -hz], 0);
        B.teil(Geo.box(fw, 1.8, 0.02, 0, 0), "fensterglas", M.trs(M.m4(), [xm, y0 + 1.85, -hz]), { schatten: false, kein_ao: true });
        for (var k = 0; k <= 3; k++) B.box(0.05, 1.8, 0.1, 0.008, "aluminium", [xm - fw / 2 + k * fw / 3, y0 + 1.85, -hz + 0.02], 0, { verdecker: false });
        // Trennwand zum Nachbarraum
        if (r.von > -bx / 2 + 0.1 && r.art !== "halle") B.box(0.14, H - 0.02, hz, 0, "modellharz", [r.von, y0 + H / 2, -hz / 2], 0);
        // Bodenbelag im Raum
        var belag = r.art === "buero" ? "teppich" : (r.art === "bibliothek" ? "eiche_matt" : "steinboden");
        B.teil(Geo.box(w - 0.14, 0.02, hz - 0.12, 0, 0), belag, M.trs(M.m4(), [xm, y0 + 0.01, -hz / 2]));
        // Glaswand zum Flur (wird beim Hineinfahren ausgeblendet)
        if (r.art === "buero" || r.art === "bibliothek" || r.art === "cafeteria") {
          var gw = Geo.leer();
          Geo.anhaengen(gw, Geo.box(w - 1.5, H - 0.3, 0.02, 0, 0), M.trs(M.m4(), [xm + 0.6, y0 + (H - 0.3) / 2, 0]));
          var go = B.objekt(gw, "klarglas", M.m4(), { statisch: true, schatten: false });
          var rahmen = Geo.leer();
          for (k = 0; k <= 3; k++) Geo.anhaengen(rahmen, Geo.box(0.05, H - 0.3, 0.07, 0.008, 1), M.trs(M.m4(), [r.von + 1.35 + k * (w - 1.5) / 3, y0 + (H - 0.3) / 2, 0]));
          Geo.anhaengen(rahmen, Geo.box(w - 1.4, 0.06, 0.07, 0.008, 1), M.trs(M.m4(), [xm + 0.6, y0 + H - 0.3, 0]));
          var ro = B.objekt(rahmen, "aluminium", M.m4(), { statisch: true });
          sz.raumGlas[r.id] = [go, ro];
        }
        // Einrichtung
        if (r.art === "buero") fraktionsBuero(B, r.von, r.bis, y0, r.fraktion);
        else if (r.art === "bibliothek") {
          for (k = 0; k < 3; k++) W.regal(B, { pos: [r.von + 1.6 + k * 2.6, y0, -hz + 0.35], dreh: 0, laenge: 2.2 });
          W.schreibtisch(B, { pos: [xm, y0, -1.2], dreh: 0, groesse: [2.2, 0.75, 1.0] });
          W.schreibtischlampe(B, { pos: [xm + 0.6, y0 + 0.75, -1.4], dreh: 200, an: true, staerke: 0.3 });
        } else if (r.art === "cafeteria") {
          for (k = 0; k < 3; k++) {
            var tx = r.von + 1.6 + k * 2.2;
            B.teil(Geo.zylinder(0.035, 1.05, 10, true), "aluminium", M.trs(M.m4(), [tx, y0, -1.3]));
            B.teil(Geo.zylinder(0.38, 0.035, 24, true, 0.01), "eiche", M.trs(M.m4(), [tx, y0 + 1.05, -1.3]));
            W.becher(B, { pos: [tx + 0.12, y0 + 1.085, -1.25] }, sz);
          }
          B.box(3.0, 1.05, 0.7, 0.02, "eiche", [r.von + 2.2, y0 + 0.525, -hz + 0.6], 0);
          B.teil(Geo.box(0.45, 0.6, 0.4, 0.04, 2), "chrom", M.trs(M.m4(), [r.von + 1.4, y0 + 1.35, -hz + 0.6]));
          sz.dampfQuellen.push({ pos: [r.von + 1.4, y0 + 1.68, -hz + 0.6], hoehe: 0.4, radius: 0.02, groesse: 0.04, dichte: 0.3 });
        } else if (r.art === "halle") {
          // Aufzug mit leuchtender Anzeige, Treppe
          B.box(1.6, d.etagen * H, 1.4, 0.02, "modellharz", [-2.6, sock + d.etagen * H / 2, -hz + 0.75], 0);
          for (k = 0; k < 8; k++) B.box(1.4, 0.18, 0.38, 0.01, "steinboden", [1.4, y0 + 0.09 + k * (H / 8), -hz + 0.4 + k * 0.38], 0, { verdecker: false });
        }
        sz.raumPos[r.id] = { x: xm, y: y0, z: -1.2, etage: e, von: r.von, bis: r.bis };
        if (r.art !== "leer" && r.art !== "halle") sz.hotspots.push({ id: r.id, art: r.art, fraktion: r.fraktion, pos: [xm, y0 + H - 0.55, 0.6] });
      });
      // Aufzugtüren und Anzeige je Etage
      B.box(0.9, 2.1, 0.04, 0.01, "aluminium", [-2.6, y0 + 1.05, -hz + 1.47], 0, { verdecker: false });
      B.teil(Geo.box(0.36, 0.1, 0.02, 0.005, 1), WELT.material("milchglas", { glas: false, emission: 6, emissionFarbe: "#ffb45a" }), M.trs(M.m4(), [-2.6, y0 + 2.3, -hz + 1.48]), { schatten: false, kein_ao: true });
      // Seitenwände
      B.box(0.24, H, tz, 0, "modellharz", [-bx / 2, y0 + H / 2, 0], 0);
      B.box(0.24, H, tz, 0, "modellharz", [bx / 2, y0 + H / 2, 0], 0);
      // Geländer an der offenen Vorderkante (Glas)
      if (e > 0) B.teil(Geo.box(bx, 0.9, 0.02, 0, 0), "klarglas", M.trs(M.m4(), [0, y0 + 0.45, hz]), { schatten: false, kein_ao: true });
    }
    // Himmel hinter dem Modell
    B.objekt(Geo.kugel(300, 32, 16), WELT.material("himmel", { doppelseitig: true }), M.m4(), { statisch: true, schatten: false, immerZeichnen: true, nichtImSpiegel: true });
  };

  /* =====================================================================
     Trilog-Raum (Kapitel 6)
     ===================================================================== */
  W.trilog = function (B, d, sz) {
    var r = d.raum, H = r.hoehe, hx = r.breite / 2, hz = r.tiefe / 2;
    var wand = WELT.material("modellharz", { farbe: "#8a8c90" });
    B.box(r.breite + 0.4, 0.1, r.tiefe + 0.4, 0, WELT.material("teppich", { farbe: "#262a34" }), [0, -0.05, 0], 0);
    B.box(r.breite + 0.4, 0.2, r.tiefe + 0.4, 0, wand, [0, H + 0.1, 0], 0);
    B.box(r.breite, H, 0.3, 0, wand, [0, H / 2, -hz - 0.15], 0);
    B.box(0.3, H, r.tiefe, 0, wand, [hx + 0.15, H / 2, 0], 0);
    // Westwand mit Fenster (Regen, Stadtlichter)
    B.box(0.3, 0.9, r.tiefe, 0, wand, [-hx - 0.15, 0.45, 0], 0);
    B.box(0.3, H - 2.5, r.tiefe, 0, wand, [-hx - 0.15, 2.5 + (H - 2.5) / 2, 0], 0);
    B.box(0.3, 1.6, hz - 1.2, 0, wand, [-hx - 0.15, 1.7, -hz + (hz - 1.2) / 2], 0);
    B.box(0.3, 1.6, hz - 1.2, 0, wand, [-hx - 0.15, 1.7, hz - (hz - 1.2) / 2], 0);
    var lw = MOTOR.texturen.leinwand(256, 256);
    var tex = MOTOR.gl.textur({ quelle: lw, mip: true, drehen: true });
    var fenster = Geo.ebene(2.4, 1.6, 1, 1);
    var fm = mal(M.trs(M.m4(), [-hx + 0.01, 1.7, 0]), mal((function () { var q = M.m4(); q[0] = 0; q[2] = -1; q[8] = 1; q[10] = 0; return q; })(), aufrecht()));
    var fo = B.objekt(fenster, WELT.material("bildschirm", { klarlack: 1, rauheit: 0.05 }), fm, { statisch: true, farbTex: tex, emission: [0, 1.2, 0], schatten: false });
    for (var k = 0; k <= 3; k++) B.box(0.06, 1.6, 0.06, 0.008, "aluminium", [-hx + 0.03, 1.7, -1.2 + k * 0.8], 0, { verdecker: false });
    sz.fenster = { lw: lw, tex: tex, obj: fo, tropfen: [] };
    // Dolmetschkabine in der Nordwand
    B.teil(Geo.box(1.6, 0.8, 0.6, 0.01, 1), WELT.material("milchglas", { glas: false, emission: 1.2, emissionFarbe: "#ffcf96" }), M.trs(M.m4(), [-1.2, 2.3, -hz - 0.6]), { schatten: false });
    B.teil(Geo.box(1.6, 0.8, 0.02, 0, 0), "klarglas", M.trs(M.m4(), [-1.2, 2.3, -hz + 0.02]), { schatten: false, kein_ao: true });
    B.box(1.7, 0.06, 0.1, 0.01, "aluminium", [-1.2, 1.88, -hz + 0.03], 0, { verdecker: false });
    B.licht({ pos: [-1.2, 2.6, -hz - 0.3], kelvin: 3000, staerke: 0.35, reichweite: 1.5 });
    // langer dunkler Tisch
    var tisch = WELT.material("eiche", { farbe: "#5a4636", spiegelt: true, klarlack: 0.7 });
    B.teil(Geo.box(5.0, 0.05, 1.6, 0.015, 3), tisch, M.trs(M.m4(), [0, 0.74, 0]));
    B.verdecker.push({ typ: "box", inv: M.invert(M.m4(), M.trs(M.m4(), [0, 0.74, 0])), h: [2.5, 0.025, 0.8], m: [0, 0.74, 0], r: 2.7 });
    [[-2.1, -0.55], [2.1, -0.55], [-2.1, 0.55], [2.1, 0.55]].forEach(function (p) { B.teil(Geo.box(0.06, 0.72, 0.06, 0.01, 1), "aluminium", M.trs(M.m4(), [p[0], 0.36, p[1]])); });
    // Stühle
    [[-1.4, -1.05, 0], [0.9, -1.05, 0], [-0.9, 1.05, 180], [1.5, 1.05, 180]].forEach(function (p) { W.stuhl(B, { pos: [p[0], 0, p[1]], dreh: p[2] }); });
    // Pendelleuchte
    B.teil(Geo.rohr([[0, H, 0], [0, 2.45, 0]], 0.006, 6), "chrom", null, { kein_ao: true });
    B.teil(Geo.drehkoerper([[0.04, 0.22], [0.3, 0.12], [0.42, 0.0], [0.41, -0.01]], 40, {}), WELT.material("lack", { farbe: "#1d1e20", rauheit: 0.3, doppelseitig: true }), M.trs(M.m4(), [0, 2.24, 0]), { schatten: false, kein_ao: true });
    B.teil(Geo.zylinder(0.4, 0.01, 40, true), WELT.material("milchglas", { glas: false, emission: 9, emissionFarbe: "#ffd7a0" }), M.trs(M.m4(), [0, 2.235, 0]), { schatten: false, kein_ao: true });
    // Vier-Spalten-Tabelle als großes Papier
    var tw = MOTOR.texturen.leinwand(1600, 800);
    var tc = tw.getContext("2d"); tc.fillStyle = "#fbfaf6"; tc.fillRect(0, 0, 1600, 800);   // leeres Blatt, bis die Tabelle steht
    var tt = MOTOR.gl.textur({ quelle: tw, mip: true, aniso: 16, drehen: true });
    var bl = Geo.ebene(1.3, 0.65, 8, 4);
    var bo = B.objekt(bl, "papier", M.trs(M.m4(), [-0.25, 0.768, 0.12], 0), { statisch: true, farbTex: tt });
    sz.trilogBlatt = { lw: tw, tex: tt, obj: bo };
    // Laptops mit leuchtenden Bildschirmen
    [[-1.6, -0.35, 15], [1.0, -0.4, -10], [1.9, 0.35, 170]].forEach(function (p) {
      var lm = M.trs(M.m4(), [p[0], 0.765, p[1]], p[2]);
      B.teil(Geo.box(0.34, 0.012, 0.24, 0.004, 1), "aluminium", lm);
      var dm = mal(lm, mal(M.trs(M.m4(), [0, 0.0, -0.12]), rotX(-105)));
      B.teil(Geo.box(0.34, 0.01, 0.23, 0.004, 1), "aluminium", mal(dm, M.trs(M.m4(), [0, 0, 0.115])));
      B.teil(Geo.box(0.31, 0.002, 0.2, 0, 0), WELT.material("bildschirm", { emission: 1.6, emissionFarbe: "#a8c0e8" }), mal(dm, M.trs(M.m4(), [0, 0.006, 0.115])), { schatten: false, kein_ao: true });
    });
    // Kaffeebecher (es werden im Laufe der Nacht mehr) und Wassergläser
    sz.trilogBecher = [];
    var pl = [[-1.1, 0.4], [-0.7, -0.45], [0.6, 0.5], [1.4, -0.2], [-1.9, 0.1], [0.2, -0.55], [1.8, 0.55], [-0.3, 0.6], [2.2, -0.5]];
    pl.forEach(function (p, i) {
      var b = new WELT.Bauer({});
      W.becher(b, { pos: [p[0], 0.765, p[1]], dreh: i * 40 }, null);
      var teile = b.fertig();
      teile.forEach(function (o) { o.sichtbar = i < 2; B.objekte.push(o); });
      sz.trilogBecher.push(teile);
    });
    wasser(B, [-2.0, 0.765, -0.3]); wasser(B, [0.4, 0.765, 0.45]);
    // bewohnt: Akten, Sideboard mit Kaffee, Garderobe, Uhr, Bild, zwei warme Wandleuchten
    [[-1.3, 0.765, -0.2, 12], [1.25, 0.765, 0.15, -8], [2.15, 0.765, -0.25, 30]].forEach(function (p) { W.aktenstapel(B, { pos: [p[0], p[1], p[2]], dreh: p[3] }); });
    W.sideboard(B, { pos: [2.6, 0, -hz + 0.25], dreh: 0, laenge: 1.8, kanne: "#2f3a48" }, sz);
    W.garderobe(B, { pos: [hx - 0.45, 0, -hz + 0.5], dreh: 0, mantel: ["#2e3138", "#6a5240", "#3d4b5c"], schal: "#a8443a" });
    W.wanduhr(B, { pos: [0.6, 2.35, -hz + 0.02], dreh: 0 });
    W.bild(B, { pos: [hx - 0.02, 1.6, 0.6], dreh: -90, groesse: [1.2, 0.8], saat: 12, farben: ["#2f5f73", "#c99a4a", "#7a8f7c", "#b85a42"] });
    [[-3.6, -1], [3.6, -1]].forEach(function (p) {
      B.teil(Geo.box(0.32, 0.18, 0.06, 0.02, 2), WELT.material("milchglas", { glas: false, emission: 2.4, emissionFarbe: "#ffcf96", rauheit: 0.5 }), M.trs(M.m4(), [p[0], 2.2, -hz + 0.04]), { schatten: false, kein_ao: true });
      B.licht({ pos: [p[0], 2.1, -hz + 0.35], kelvin: 2800, staerke: 1.6, reichweite: 4.5 });
    });
    B.objekt(Geo.kugel(200, 24, 12), WELT.material("himmel", { doppelseitig: true }), M.m4(), { statisch: true, schatten: false, immerZeichnen: true });
  };

  /* Regen und Stadtlichter im Fenster (Canvas, im Code gezeichnet) */
  W.fensterZeichnen = function (f, zeit, morgen) {
    var c = f.lw.getContext("2d"), r = M.zufall(3);
    var oben = M.mix([6, 9, 20], [70, 110, 170], morgen), unten = M.mix([14, 16, 26], [120, 140, 170], morgen);
    var g = c.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "rgb(" + oben.map(Math.round).join(",") + ")"); g.addColorStop(1, "rgb(" + unten.map(Math.round).join(",") + ")");
    c.fillStyle = g; c.fillRect(0, 0, 256, 256);
    // verschwommene Stadtlichter (Bokeh hinter nassem Glas)
    for (var i = 0; i < 60; i++) {
      var x = r() * 256, y = 120 + r() * 136, rad = 3 + r() * 9, a = (0.25 + r() * 0.5) * (1 - morgen * 0.7);
      var warm = r() < 0.7;
      var gr = c.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, warm ? "rgba(255,190,110," + a + ")" : "rgba(170,200,255," + a + ")"); gr.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = gr; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // Tropfen und Laufspuren
    var rt = M.zufall(9);
    for (i = 0; i < 70; i++) {
      var tx = rt() * 256, ty = ((rt() * 256 + zeit * (8 + rt() * 30)) % 300) - 20, tr = 1 + rt() * 2.4;
      c.strokeStyle = "rgba(200,220,255,0.10)"; c.lineWidth = tr * 0.7;
      c.beginPath(); c.moveTo(tx, ty - 30 * rt()); c.lineTo(tx + Math.sin(ty * 0.05) * 2, ty); c.stroke();
      c.fillStyle = "rgba(220,235,255,0.35)"; c.beginPath(); c.arc(tx, ty, tr, 0, Math.PI * 2); c.fill();
      c.fillStyle = "rgba(255,255,255,0.5)"; c.beginPath(); c.arc(tx - tr * 0.3, ty - tr * 0.3, tr * 0.35, 0, Math.PI * 2); c.fill();
    }
    MOTOR.gl.texturNeu(f.tex, f.lw);
  };

  /* =====================================================================
     Plenum (Kapitel 7): Abgeordnete, Besucher*innen, Präsidium
     ===================================================================== */
  W.plenumBelebt = function (B, d, sz) {
    var plaetze = sz.sitze.map(function (s) {
      var c = Math.cos(s.w), sn = Math.sin(s.w), rs = s.r + 0.12;
      return { pos: [c * rs, s.y, sn * rs], dreh: Math.atan2(-c, -sn) };
    });
    sz.abgeordnete = W.modellFiguren(B, plaetze, true, { m: [0, 2, 6], r: 16 });
    var rg = DATA.szenen.plenarsaal.rang, raum = DATA.szenen.plenarsaal.raum, bes = [], r = M.zufall(5);
    for (var i = 0; i < (d.besucher || 40); i++) {
      var reihe = i % 3, w = (16 + r() * 148) * GR, rr = rg.radius + 0.55 + reihe * 0.6;
      bes.push({ pos: [Math.cos(w) * rr, rg.hoehe + 0.3 * (reihe + 1) - 0.1, Math.sin(w) * rr], dreh: Math.atan2(-Math.cos(w), -Math.sin(w)), skala: 0.92 + r() * 0.12 });
    }
    sz.besucher = W.modellFiguren(B, bes, true, { m: [0, rg.hoehe, 6], r: 16 });
    var pr = DATA.szenen.plenarsaal.praesidium;
    W.modellFiguren(B, [-1.6, 0, 1.6].map(function (x) { return { pos: [x, pr.hoehe + 0.04, (pr.vorne + pr.hinten) / 2 - 0.55], dreh: 0 }; }), true, { m: [0, 1, -4], r: 4 });
  };

  /* =====================================================================
     Epilog: Collage auf einem Tisch
     ===================================================================== */
  function stueckTextur(art, text, name) {
    var b = art === "zeitung" ? 900 : 700, h = art === "postkarte" ? 470 : (art === "chat" ? 900 : 640);
    var lw = MOTOR.texturen.leinwand(b, h), c = lw.getContext("2d");
    var S = DATA.stil.oberflaeche;
    c.fillStyle = art === "postkarte" ? "#f6efe0" : "#fbf9f4"; c.fillRect(0, 0, b, h);
    function zeilen(t, x, y, br, lh, font, farbe) {
      c.font = font; c.fillStyle = farbe;
      var w = t.split(" "), z = "";
      w.forEach(function (wort) { var tt = z ? z + " " + wort : wort; if (c.measureText(tt).width > br && z) { c.fillText(z, x, y); y += lh; z = wort; } else z = tt; });
      if (z) c.fillText(z, x, y);
      return y + lh;
    }
    if (art === "zeitung") {
      c.fillStyle = "#1d1c1a"; c.font = "bold 30px " + S.schriftGesetz; c.fillText("TAGEBLATT", 40, 60);
      c.fillRect(40, 74, b - 80, 3);
      var y = zeilen(text, 40, 140, b - 80, 62, "bold 52px " + S.schriftGesetz, "#141312");
      c.fillStyle = "#9a958c";
      for (var i = 0; i < 9; i++) { c.fillRect(40, y + i * 26, (b - 120) / 2, 10); c.fillRect(b / 2 + 20, y + i * 26, (b - 120) / 2, 10); }
      c.fillStyle = "#3a3936"; c.font = "italic 24px " + S.schriftGesetz; c.fillText("Clara Vogt", 40, h - 30);
    } else if (art === "chat") {
      c.fillStyle = "#e9edf2"; c.fillRect(0, 0, b, h);
      c.fillStyle = "#3a3f47"; c.font = "bold 34px " + S.schriftUI; c.fillText(name, 40, 70);
      c.fillStyle = "#ffffff"; c.beginPath(); c.roundRect ? c.roundRect(40, 110, b - 120, h - 220, 28) : c.rect(40, 110, b - 120, h - 220); c.fill();
      zeilen(text, 70, 170, b - 180, 46, "34px " + S.schriftUI, "#1c1e22");
    } else {
      c.strokeStyle = "rgba(90,110,150,0.18)"; c.lineWidth = 2;
      if (art === "brief") for (var yy = 120; yy < h - 40; yy += 44) { c.beginPath(); c.moveTo(40, yy); c.lineTo(b - 40, yy); c.stroke(); }
      if (art === "postkarte") { c.fillStyle = "#c9b48a"; c.fillRect(b - 150, 30, 110, 130); c.strokeStyle = "#8a7a5a"; c.strokeRect(b - 150, 30, 110, 130); }
      zeilen(text, 50, 110, b - (art === "postkarte" ? 230 : 100), 44, "italic 32px Georgia, serif", "#24304a");
      c.font = "italic 34px Georgia, serif"; c.fillStyle = "#24304a"; c.fillText("– " + name, b - 300, h - 40);
    }
    return MOTOR.gl.textur({ quelle: lw, mip: true, aniso: 8, drehen: true });
  }

  W.epilog = function (B, d, sz, extra) {
    B.box(3.2, 0.06, 2.0, 0.015, "eiche", [0, 0.72, 0], 0);
    B.box(8, 0.1, 8, 0, "teppich", [0, -0.05, 0], 0);
    var stuecke = (extra && extra.stuecke) || [];
    var lagen = [[-0.75, -0.25, -8], [-0.15, 0.25, 6], [0.5, -0.3, -4], [0.95, 0.3, 10], [-0.4, 0.55, 3], [0.2, -0.6, -10]];
    sz.collage = [];
    stuecke.forEach(function (s, i) {
      var L = lagen[i % lagen.length];
      var gr = s.art === "zeitung" ? [0.42, 0.3] : (s.art === "postkarte" ? [0.3, 0.2] : (s.art === "chat" ? [0.16, 0.3] : [0.3, 0.27]));
      var tex = stueckTextur(s.art, LOGIK.text.ersetzen(s.text, true), s.name);
      var g = Geo.ebene(gr[0], gr[1], 6, 4);
      Geo.verformen(g, function (p) { return [p[0], Math.sin((p[0] / gr[0] + 0.5) * Math.PI) * 0.004 + 0.002 * i, p[2]]; });
      var m = M.trs(M.m4(), [L[0], 0.752 + i * 0.0008, L[1]], L[2]);
      if (s.art === "chat") B.teil(Geo.box(gr[0] + 0.02, 0.012, gr[1] + 0.03, 0.01, 2), WELT.material("bildschirm", { farbe: "#1a1b1e" }), M.trs(M.m4(), [L[0], 0.756, L[1]], L[2]));
      var o = B.objekt(g, s.art === "chat" ? WELT.material("bildschirm", { klarlack: 1 }) : "papier", s.art === "chat" ? mal(m, M.trs(M.m4(), [0, 0.012, 0])) : m, { statisch: true, farbTex: tex, emission: s.art === "chat" ? [0, 1.1, 0] : null });
      sz.collage.push({ pos: [L[0], 0.75, L[1]], text: s.text, name: s.name, art: s.art });
    });
    W.becher(B, { pos: [1.25, 0.75, -0.55] }, sz);
    W.schreibtischlampe(B, { pos: [-1.3, 0.75, -0.7], dreh: 120, an: true, staerke: 0.4 });
    B.objekt(Geo.kugel(100, 24, 12), WELT.material("himmel", { doppelseitig: true }), M.m4(), { statisch: true, schatten: false, immerZeichnen: true });
  };
})(WELT.bausteine);
