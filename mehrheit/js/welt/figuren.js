/* =====================================================================
   js/welt/figuren.js – Menschen (neu modelliert, November 2026)
   ---------------------------------------------------------------------
   Auf Wunsch des Users: Die Figuren sollen wie echte Menschen aussehen.
   Die Netze (Kopf mit Gesicht, Augen, Brauen, Hände mit Fingern, Kleidung,
   Frisuren) entstehen offline mit werkzeuge/menschen.py aus Abstandsfeldern
   und liegen komprimiert in js/welt/menschen_netze.js.
   Hier wird je Person zusammengesetzt:
     - Teile wählen (Frisur, Oberteil, Hemd, Hose/Rock, Schuhe, Krawatte, Schal)
     - Formvarianten mischen (Geschlecht, Körperbau, Nase, Kinn, Wangen, Lippen, Alter)
     - Farben je Punkt (Haut, Lippen, Wimpernlinie, Augen, Stoffe …)
     - weiche Verformung: bis zu vier Knochen je Punkt (Shader-Define SKIN4)
   Bindehaltung der Netze: Arme 35° abgespreizt, Beine 4° gespreizt.
   Ruhehaltung im Spiel: Arme hängen. Figur schaut in lokaler +z-Richtung.
   Alle Farben und Personenwerte: data/figuren.js.
   ===================================================================== */
var WELT = window.WELT || {};

WELT.figuren = (function () {
  var F = {};
  var M = MOTOR.m, Geo = MOTOR.geo, GR = M.GRAD;
  var D = null, KNOCHEN = [], ELTERN = [], K = {};

  /* ---------- Daten einmalig entpacken ---------- */
  function daten() {
    if (D) return D;
    var R = WELT.menschenDaten;
    var bin = MOTOR.inflate(MOTOR.base64(R.block), R.groesse), buf = bin.buffer;
    KNOCHEN = R.knochen; ELTERN = R.eltern;
    KNOCHEN.forEach(function (n, i) { K[n] = i; });
    D = { teile: {}, R: R };
    function u8(o) { return new Uint8Array(buf, o[0], o[1]); }
    for (var name in R.teile) {
      var t = R.teile[name];
      var e = { name: name, n: t.n, d: t.d, w0: t.w0, art: t.art, lo: t.lo, sk: t.sk,
        pos: new Uint16Array(buf, t.pos[0], t.pos[1] / 2), idx: new Uint16Array(buf, t.idx[0], t.idx[1] / 2),
        kn: u8(t.kn), gw: u8(t.gw), schicht: u8(t.schicht), maske: u8(t.maske), ao: u8(t.ao),
        nor: new Int8Array(buf, t.nor[0], t.nor[1]), morph: {} };
      for (var m in t.morph) e.morph[m] = { s: t.morph[m].s, p: new Int8Array(buf, t.morph[m].p[0], t.morph[m].p[1]), n: new Int8Array(buf, t.morph[m].n[0], t.morph[m].n[1]) };
      D.teile[name] = e;
    }
    return D;
  }
  F.daten = daten;

  function rot(e) { return M.ausQuat(M.m4(), M.quatEuler(e)); }
  function verschieb(v) { var m = M.m4(); m[12] = v[0]; m[13] = v[1]; m[14] = v[2]; return m; }
  function mul(a, b) { return M.mul(M.m4(), a, b); }
  function farbe(h) { return M.farbe(h); }
  function misch(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function mal(a, k) { return [a[0] * k[0], a[1] * k[1], a[2] * k[2]]; }

  /* Pseudo-Zufall aus dem Namen (für Gesichtszüge ohne Angabe) */
  function namensZufall(text) {
    var h = 2166136261;
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return M.zufall(h >>> 0);
  }

  /* ---------- Skelett einer Person ---------- */
  function skelett(w, wk) {
    var R = daten().R, n = KNOCHEN.length;
    var gel = [], ruhe = [], bind = [], inv = [];
    for (var i = 0; i < n; i++) {
      var a = R.gelenke_m[i], b = R.gelenke_w[i];
      var t = KNOCHEN[i].indexOf("auge") === 0 && wk !== undefined ? wk : w;   // Augen passen zum gewählten Kopf
      gel.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
    }
    for (i = 0; i < n; i++) {
      var e = ELTERN[i];
      ruhe.push(e < 0 ? gel[i].slice() : [gel[i][0] - gel[e][0], gel[i][1] - gel[e][1], gel[i][2] - gel[e][2]]);
      var lok = mul(verschieb(ruhe[i]), rot([0, 0, R.bind[KNOCHEN[i]] || 0]));
      bind.push(e < 0 ? lok : mul(bind[e], lok));
      inv.push(M.invert(M.m4(), bind[i]));
    }
    return { gelenke: gel, ruhe: ruhe, bindInv: inv };
  }

  /* ---------- Ein Teil mit Formvarianten in Bindehaltung ---------- */
  function teilPunkte(t, gewichte) {
    var n = t.n, p = new Float32Array(n * 3), lo = t.lo, sk = t.sk;
    for (var v = 0; v < n; v++) for (var k = 0; k < 3; k++) p[v * 3 + k] = lo[k] + t.pos[v * 3 + k] * sk[k];
    for (var m in t.morph) {
      var g = gewichte(m, t);
      if (!g) continue;
      var md = t.morph[m], s = md.s * g;
      for (v = 0; v < n * 3; v++) p[v] += md.p[v] * s;
    }
    return p;
  }
  /* Normalen aus den gespeicherten Feldnormalen (Oktaeder, 2 Bytes) plus Formvarianten */
  function teilNormalen(t, gewichte) {
    var n = t.n, out = new Float32Array(n * 3);
    for (var v = 0; v < n; v++) {
      var x = t.nor[v * 2] / 127, y = t.nor[v * 2 + 1] / 127, z = 1 - Math.abs(x) - Math.abs(y);
      if (z < 0) { var ox = x; x = (1 - Math.abs(y)) * (ox >= 0 ? 1 : -1); y = (1 - Math.abs(ox)) * (y >= 0 ? 1 : -1); }
      out[v * 3] = x; out[v * 3 + 1] = y; out[v * 3 + 2] = z;
    }
    for (var v2 = 0; v2 < n * 3; v2 += 3) { var l0 = Math.hypot(out[v2], out[v2 + 1], out[v2 + 2]) || 1; out[v2] /= l0; out[v2 + 1] /= l0; out[v2 + 2] /= l0; }
    for (var m in t.morph) {
      var g = gewichte(m, t); if (!g) continue;
      var md = t.morph[m], k = g / 127;
      for (v = 0; v < n * 3; v++) out[v] += md.n[v] * k;
    }
    for (v = 0; v < n * 3; v += 3) { var l = Math.hypot(out[v], out[v + 1], out[v + 2]) || 1; out[v] /= l; out[v + 1] /= l; out[v + 2] /= l; }
    return out;
  }
  function normalen(p, idx) {
    var n = new Float32Array(p.length);
    for (var t = 0; t < idx.length; t += 3) {
      var a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
      var e1x = p[b] - p[a], e1y = p[b + 1] - p[a + 1], e1z = p[b + 2] - p[a + 2];
      var e2x = p[c] - p[a], e2y = p[c + 1] - p[a + 1], e2z = p[c + 2] - p[a + 2];
      var nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
      n[a] += nx; n[a + 1] += ny; n[a + 2] += nz; n[b] += nx; n[b + 1] += ny; n[b + 2] += nz; n[c] += nx; n[c + 1] += ny; n[c + 2] += nz;
    }
    for (var v = 0; v < n.length; v += 3) {
      var l = Math.hypot(n[v], n[v + 1], n[v + 2]) || 1;
      n[v] /= l; n[v + 1] /= l; n[v + 2] /= l;
    }
    return n;
  }
  function gruppeNeu() { return { p: [], n: [], uv: [], ao: [], kn: [], gw: [], farbe: [], i: [] }; }
  function anhaengen(gr, t, p, nor, farbFn) {
    var basis = gr.p.length / 3;
    for (var v = 0; v < t.n; v++) {
      var v3 = v * 3, v4 = v * 4;
      gr.p.push(p[v3], p[v3 + 1], p[v3 + 2]);
      gr.n.push(nor[v3], nor[v3 + 1], nor[v3 + 2]);
      // Strukturkoordinaten: Zylinder um die Körperachse (stetig, ganzzahlig viele Wiederholungen rundherum)
      gr.uv.push(Math.atan2(p[v3], p[v3 + 2]) * 0.1224, p[v3 + 1]);
      gr.ao.push(t.ao[v] / 255);
      gr.kn.push(t.kn[v4], t.kn[v4 + 1], t.kn[v4 + 2], t.kn[v4 + 3]);
      gr.gw.push(t.gw[v4] / 255, t.gw[v4 + 1] / 255, t.gw[v4 + 2] / 255, t.gw[v4 + 3] / 255);
      var f = farbFn(v, p, nor);
      gr.farbe.push(f[0], f[1], f[2]);
    }
    for (var i = 0; i < t.idx.length; i++) gr.i.push(t.idx[i] + basis);
  }

  /* ---------- Hauttöne: Lippen, Wangen, Ohren ---------- */
  function hautFarben(hex) {
    var h = farbe(hex);
    var dunkel = 1 - Math.min(1, (h[0] + h[1] + h[2]) / 2.2);
    return {
      haut: h,
      lippe: mal(h, [0.86 - 0.1 * dunkel, 0.6 - 0.05 * dunkel, 0.6 - 0.02 * dunkel]),
      rot: mal(h, [1.0, 0.9, 0.88]),
      handInnen: mal(h, [1.06 + 0.2 * dunkel, 1.0 + 0.22 * dunkel, 0.98 + 0.22 * dunkel])
    };
  }

  /* ---------- Teile je Person ---------- */
  function teilListe(def) {
    var kl = def.kleidung || {}, hr = def.haare || { form: "kurz" };
    var w = F.geschlechtWert(def);
    var wk = F.kopfWert(def);
    var liste = [wk ? "kopf_w" : "kopf", "augen", wk ? "brauen_w" : "brauen", "haende"];
    var oben = (kl.oben && kl.oben.art) || "pullover";
    if (oben === "sakko" || oben === "blazer") { liste.push(oben === "sakko" && w < 0.75 ? "sakko" : "blazer"); liste.push(w >= 0.5 ? "bluse" : "hemd"); }
    else liste.push("pullover");
    var unten = (kl.unten && kl.unten.art) || "hose";
    if (unten === "rock") { liste.push("rock"); liste.push("beine"); } else liste.push("hose");
    liste.push(w > 0.6 ? "schuhe_w" : "schuhe_m");
    var ak = def.akzent && def.akzent.art;
    if (ak === "krawatte") liste.push("krawatte");
    if (ak === "schal") liste.push("schal");
    var form = hr.form || "kurz";
    if (form === "kopftuch") liste.push("kopftuch");
    else if (form === "kurz") liste.push(w > 0.25 ? "haar_kurz_w" : "haar_kurz");
    else liste.push("haar_" + form);
    return liste;
  }
  F.geschlechtWert = function (def) { return def.geschlecht === "w" ? 1 : (def.geschlecht === "n" ? 0.5 : 0); };
  /* Kopf: eigenes Netz für Mann und Frau (0 oder 1); die Spielfigur bekommt den feineren Kopf mit kräftigerem Kinn */
  F.kopfWert = function (def) { return F.geschlechtWert(def) >= 0.5 ? 1 : 0; };

  /* ---------- Figur bauen ---------- */
  F.bauen = function (B, def, eintrag, sz) {
    daten();
    var A = DATA.figuren;
    var w = F.geschlechtWert(def);
    var fuelle = def.bau === "kraeftig" ? 1 : (def.bau === "schmal" ? -1 : 0);
    var zuf = namensZufall(def.name || "x");
    var gs = def.gesicht || {};
    var zug = {
      nase: gs.nase !== undefined ? gs.nase : zuf() * 1.3 - 0.55, kinn: gs.kinn !== undefined ? gs.kinn : zuf() * 1.2 - 0.6,
      wangen: gs.wangen !== undefined ? gs.wangen : zuf() * 1.1 - 0.5, lippen: gs.lippen !== undefined ? gs.lippen : zuf() * 1.1 - 0.5,
      alter: gs.alter || 0
    };
    var wk = F.kopfWert(def);
    function morphGewicht(m, t) {
      if (m === "w") return (t.name === "augen" || t.name.indexOf("haar_") === 0 || t.name === "kopftuch" ? wk : w) - t.w0;
      if (m === "voll") return Math.max(0, fuelle);
      if (m === "schmal") return Math.max(0, -fuelle);
      return zug[m] || 0;
    }
    var skala = (def.groesse || 1.7) / 1.7;
    var hf = hautFarben(A.hauttoene[def.haut === undefined ? 2 : def.haut]);
    var kl = def.kleidung || {}, hr = def.haare || { form: "kurz", farbe: "#3a2a22" };
    var haarF = farbe(hr.farbe || "#3a2a22");
    var augenF = farbe(def.augen || A.augenFarben[Math.floor(zuf() * A.augenFarben.length)]);
    var fr = null; DATA.fraktionen.forEach(function (f) { if (f.id === def.fraktion) fr = f; });
    var akzentF = farbe((def.akzent && def.akzent.farbe) || (fr ? fr.farbe : "#00a2ad"));
    var obenF = farbe((kl.oben && kl.oben.farbe) || "#4a4f58"), hemdF = farbe((kl.hemd && kl.hemd.farbe) || "#ecebe7");
    var untenF = farbe((kl.unten && kl.unten.farbe) || "#2c2f35"), schuhF = farbe((kl.schuhe && kl.schuhe.farbe) || "#211c19");
    var strumpfF = kl.unten && kl.unten.strumpf ? farbe(kl.unten.strumpf) : null;
    var T = daten().R.kopf.tragion;

    var gruppen = {};
    function gruppe(art) { if (!gruppen[art]) gruppen[art] = gruppeNeu(); return gruppen[art]; }
    teilListe(def).forEach(function (name) {
      var t = D.teile[name]; if (!t) return;
      var p = teilPunkte(t, morphGewicht), nor = teilNormalen(t, morphGewicht);
      var fn, art = t.art;
      if (name === "kopf" || name === "kopf_w") fn = function (v) {
        var x = p[v * 3] - T[0], y = p[v * 3 + 1] - T[1], z = p[v * 3 + 2] - T[2], ax = Math.abs(x);
        // Wangen, Nase und Ohren etwas rötlicher
        var r = Math.exp(-((ax - 0.042) * (ax - 0.042) / 0.0004 + (y + 0.015) * (y + 0.015) / 0.0006 + (z - 0.07) * (z - 0.07) / 0.002)) * 0.8 +
                Math.exp(-(x * x / 0.0002 + (y + 0.02) * (y + 0.02) / 0.0003 + (z - 0.11) * (z - 0.11) / 0.0006)) * 0.7 +
                Math.exp(-((ax - 0.078) * (ax - 0.078) / 0.0002 + y * y / 0.002 + (z + 0.01) * (z + 0.01) / 0.001)) * 0.6;
        var c = misch(hf.haut, hf.rot, Math.min(1, r));
        c = misch(c, hf.lippe, t.maske[v] / 255);
        if (t.schicht[v] === 1) c = misch(c, mal(haarF, [0.35, 0.33, 0.32]), 0.7);
        return c;
      };
      else if (name === "haende") fn = function (v) { return hf.haut; };
      else if (name === "beine") fn = function () { return strumpfF || hf.haut; };
      else if (name === "augen") fn = function (v) {
        var s = t.schicht[v];
        if (s === 2) return [0.02, 0.018, 0.016];
        if (s === 1) return misch(mal(augenF, [0.5, 0.5, 0.5]), mal(augenF, [1.15, 1.12, 1.1]), t.maske[v] / 255);
        var k = 0.5 + 0.5 * Math.min(1, t.maske[v] / 214);
        return [0.5 * k, 0.47 * k, 0.43 * k];
      };
      else if (name === "brauen" || name === "brauen_w") fn = function (v) { return misch(hf.haut, mal(haarF, [0.78, 0.76, 0.74]), t.maske[v] / 255); };
      else if (name.indexOf("haar_") === 0) fn = function (v) { return misch(misch(hf.haut, haarF, 0.55), haarF, t.maske[v] / 255); };
      else if (name === "kopftuch") fn = function () { return haarF; };
      else if (name === "sakko" || name === "blazer" || name === "pullover") fn = function (v) { return t.schicht[v] === 3 ? [0.05, 0.045, 0.04] : obenF; };
      else if (name === "hemd" || name === "bluse") fn = function () { return hemdF; };
      else if (name === "krawatte" || name === "schal") fn = function () { return akzentF; };
      else if (name === "hose" || name === "rock") fn = function () { return untenF; };
      else if (name.indexOf("schuhe") === 0) fn = function (v) { return t.schicht[v] === 1 ? mal(schuhF, [0.55, 0.55, 0.55]) : schuhF; };
      else fn = function () { return [0.7, 0.7, 0.7]; };
      if (name === "kopftuch") art = "stoff";
      anhaengen(gruppe(art), t, p, nor, fn);
    });

    /* Brille: dünner Rahmen um beide Augen, Bügel bis zu den Ohren */
    if (def.brille) {
      var s = 1 + (daten().R.kopf.s_w - 1) * wk, mg = Geo.leer();
      [-1, 1].forEach(function (sx) {
        var ax = 0.0315 * sx * s + T[0], ay = 0.013 * s + T[1], az = 0.071 * s + T[2] + 0.0265;
        var ring = [];
        for (var i = 0; i <= 24; i++) { var a = i / 24 * Math.PI * 2; ring.push([ax + Math.cos(a) * 0.0235 * s, ay + Math.sin(a) * 0.0165 * s - 0.002, az - Math.abs(Math.cos(a)) * 0.004 * sx * sx]); }
        Geo.anhaengen(mg, Geo.rohr(ring, 0.0013, 5), null, 0);
        Geo.anhaengen(mg, Geo.rohr([[ax + sx * 0.0235 * s, ay + 0.004, az - 0.004], [sx * 0.074 * s + T[0], ay + 0.006, T[2] + 0.02], [sx * 0.078 * s + T[0], ay - 0.004, T[2] - 0.035]], 0.0012, 4), null, 0);
      });
      Geo.anhaengen(mg, Geo.rohr([[-0.008 * s + T[0], 0.017 * s + T[1], 0.1 * s + T[2]], [T[0], 0.02 * s + T[1], 0.102 * s + T[2]], [0.008 * s + T[0], 0.017 * s + T[1], 0.1 * s + T[2]]], 0.0013, 4), null, 0);
      var bt = { n: mg.p.length / 3, idx: mg.i, ao: [], kn: [], gw: [] };
      for (var bv = 0; bv < bt.n; bv++) { bt.ao.push(255); bt.kn.push(K.kopf, 0, 0, 0); bt.gw.push(255, 0, 0, 0); }
      var rf = farbe((def.brille && def.brille.rahmen) || "#333");
      anhaengen(gruppe("metall"), bt, mg.p, mg.n, function () { return rf; });
    }

    /* Anstecker in Fraktionsfarbe auf dem linken Revers */
    if (def.akzent && def.akzent.art === "anstecker" && gruppen.stoff) {
      var gs2 = gruppen.stoff, best = -1, bz = -1;
      for (var v = 0; v < gs2.p.length / 3; v++) {
        var px = gs2.p[v * 3], py = gs2.p[v * 3 + 1], pz = gs2.p[v * 3 + 2];
        if (Math.abs(px - 0.085) < 0.012 && Math.abs(py - 1.31) < 0.012 && pz > bz) { bz = pz; best = v; }
      }
      if (best >= 0) {
        var ag = Geo.transform(Geo.zylinder(0.0075, 0.003, 12, true), mul(verschieb([gs2.p[best * 3], gs2.p[best * 3 + 1], bz + 0.001]), rot([90, 0, 0])));
        var at = { n: ag.p.length / 3, idx: ag.i, ao: [], kn: [], gw: [] };
        for (var av = 0; av < at.n; av++) { at.ao.push(255); at.kn.push(K.brust, 0, 0, 0); at.gw.push(255, 0, 0, 0); }
        anhaengen(gruppe("lack"), at, ag.p, ag.n, function () { return akzentF; });
      }
    }

    /* Rollstuhl (Aluminium und Stoff) */
    if (def.rollstuhl) {
      var rb = M.trs(M.m4(), eintrag.pos, eintrag.dreh || 0, 1);
      var rg = Geo.leer(), rad = [];
      for (var ri = 0; ri <= 32; ri++) { var rw = ri / 32 * Math.PI * 2; rad.push([0, Math.sin(rw) * 0.3, Math.cos(rw) * 0.3]); }
      [-1, 1].forEach(function (sx) {
        Geo.anhaengen(rg, Geo.rohr(rad, 0.014, 8), M.trs(M.m4(), [sx * 0.29, 0.31, -0.05]));
        Geo.anhaengen(rg, Geo.rohr(rad.map(function (q) { return [q[0], q[1] * 0.88, q[2] * 0.88]; }), 0.005, 6), M.trs(M.m4(), [sx * 0.32, 0.31, -0.05]));
        Geo.anhaengen(rg, Geo.rohr([[sx * 0.24, 0.08, 0.3], [sx * 0.24, 0.47, 0.26], [sx * 0.24, 0.47, -0.2], [sx * 0.24, 0.9, -0.24]], 0.012, 6), null);
        Geo.anhaengen(rg, Geo.zylinder(0.045, 0.025, 12, true), M.mul(M.m4(), M.trs(M.m4(), [sx * 0.24, 0.045, 0.3]), rot([0, 0, 90])));
      });
      B.objekt(rg, "aluminium", rb, { statisch: true });
      var sitz = Geo.leer();
      Geo.anhaengen(sitz, Geo.box(0.46, 0.04, 0.44, 0.015, 2), M.trs(M.m4(), [0, 0.47, 0.02]));
      Geo.anhaengen(sitz, Geo.box(0.46, 0.4, 0.03, 0.012, 2), M.trs(M.m4(), [0, 0.72, -0.22]));
      B.objekt(sitz, WELT.material("stoff_sitz", { farbe: "#2a2e36" }), rb, { statisch: true });
    }

    /* Hochladen: ein Objekt je Material */
    var sk = skelett(w, wk);
    var knochenDaten = new Float32Array(84 * 4);
    var figur = {
      def: def, skala: skala, sk: sk, knochenDaten: knochenDaten, objekte: [],
      pos: eintrag.pos.slice(), dreh: eintrag.dreh || 0, haltung: eintrag.haltung || "stehen",
      geste: null, blickZiel: null, blick: [0, 0], blickGeschw: [0, 0], spricht: 0,
      zeitVersatz: namensZufall((def.name || "") + "t")() * 10, welt: [], augen: [0, 0], augenZiel: [0, 0], sakkadeZeit: 0
    };
    var mats = {
      haut: WELT.material("haut", { farbe: "#ffffff" }), auge: WELT.material("auge", {}), haar: WELT.material("haar", { farbe: "#ffffff", rauheit: 0.78, strukturStaerke: 0.14, samt: 0.25 }),
      stoff: WELT.material("stoff", { farbe: "#ffffff", strukturSkala: 26, strukturStaerke: 0.22 }), leder: WELT.material("leder", { farbe: "#ffffff" }),
      metall: WELT.material("aluminium", { farbe: "#ffffff", metall: 0.6, rauheit: 0.35 }), lack: WELT.material("lack", { farbe: "#ffffff" })
    };
    for (var art in gruppen) {
      var gr = gruppen[art];
      if (!gr.p.length) continue;
      var o = B.objekt(null, mats[art] || mats.stoff, M.m4(), { netz: MOTOR.netzFigur(gr), knochen: true, skin4: true, schatten: true });
      o.knochen = knochenDaten;
      o.festeKugel = true;
      o.kugelWelt = { m: [figur.pos[0], (figur.pos[1] || 0) + 0.9, figur.pos[2]], r: 1.3 };
      figur.objekte.push(o);
    }
    F.aktualisieren(figur, 0, 0);
    return figur;
  };

  /* ---------- Pose ---------- */
  function poseAus(figur) {
    var hal = DATA.figuren.haltungen[figur.haltung] || DATA.figuren.haltungen.stehen;
    var p = {};
    for (var n in hal.gelenke) p[n] = hal.gelenke[n].slice();
    return { gelenke: p, beckenHoehe: hal.beckenHoehe || 0 };
  }

  function gestenWerte(geste, t) {
    var g = DATA.figuren.gesten[geste.name]; if (!g) return null;
    var S = g.schluessel, x = Math.min(1, t / g.dauer);
    var i = 0; while (i < S.length - 2 && S[i + 1].t <= x) i++;
    var a = S[i], b = S[i + 1];
    var u = M.weich((x - a.t) / Math.max(0.001, b.t - a.t));
    var erg = {}, namen = {};
    for (var n in a) if (n !== "t" && n.indexOf("handform") < 0) namen[n] = 1;
    for (n in b) if (n !== "t" && n.indexOf("handform") < 0) namen[n] = 1;
    for (n in namen) {
      var va = a[n] || [0, 0, 0], vb = b[n] || [0, 0, 0];
      erg[n] = [M.lerp(va[0], vb[0], u), M.lerp(va[1], vb[1], u), M.lerp(va[2], vb[2], u)];
    }
    // Handform „zeigen“ weich ein- und ausblenden
    var za = a.handformR === "zeigen" ? 1 : 0, zb = b.handformR === "zeigen" ? 1 : 0;
    erg._zeigen = M.lerp(za, zb, u);
    return erg;
  }

  F.geste = function (figur, name) {
    if (!DATA.figuren.gesten[name]) return;
    if (MOTOR.bewegungReduziert && name !== "nicken") { figur.geste = { name: name, t: 0, langsam: 0.5 }; return; }
    figur.geste = { name: name, t: 0, langsam: 1 };
  };

  /* Fingerhaltung: locker gekrümmt; „zeigen“ streckt den Zeigefinger der rechten Hand */
  function finger(g, seite, zeigen) {
    var s = seite === "L" ? -1 : 1, H = DATA.figuren.hand;
    function setz(n, wert) { g[n + seite] = [0, 0, s * wert]; }
    setz("zeige1", M.lerp(H.locker.zeige1, H.zeigen.zeige1, zeigen));
    setz("zeige2", M.lerp(H.locker.zeige2, H.zeigen.zeige2, zeigen));
    setz("finger1", M.lerp(H.locker.finger1, H.zeigen.finger1, zeigen));
    setz("finger2", M.lerp(H.locker.finger2, H.zeigen.finger2, zeigen));
    g["daumen" + seite] = [0, -s * M.lerp(0, H.zeigen.daumenDreh, zeigen), s * M.lerp(H.locker.daumen, H.zeigen.daumen, zeigen)];
  }

  F.aktualisieren = function (figur, dt, zeit) {
    var A = DATA.figuren;
    var pose = poseAus(figur), g = pose.gelenke;
    var zz = zeit + figur.zeitVersatz;
    var zeigen = 0;
    if (figur.geste) {
      figur.geste.t += dt * (figur.geste.langsam || 1);
      var gw = gestenWerte(figur.geste, figur.geste.t);
      if (gw) {
        for (var n in gw) if (n[0] !== "_") { g[n] = g[n] || [0, 0, 0]; for (var k = 0; k < 3; k++) g[n][k] += gw[n][k] * (MOTOR.bewegungReduziert ? 0.6 : 1); }
        zeigen = gw._zeigen;
      }
      if (figur.geste.t > A.gesten[figur.geste.name].dauer) figur.geste = null;
    }
    finger(g, "L", 0); finger(g, "R", zeigen);
    // Atmen
    var at = Math.sin(zz * A.atmen.tempo * 6.283) * A.atmen.staerke;
    g.brust = g.brust || [0, 0, 0]; g.brust[0] -= at * 0.9;
    g.hals = g.hals || [0, 0, 0]; g.hals[0] += at * 0.6;
    g.oberarmL = g.oberarmL || [0, 0, 0]; g.oberarmL[2] += at * 0.5;
    g.oberarmR = g.oberarmR || [0, 0, 0]; g.oberarmR[2] -= at * 0.5;
    // Gewicht verlagern (nur im Stehen)
    var versatz = [0, 0, 0];
    if (figur.haltung === "stehen") {
      var gv = A.gewichtVerlagern, ww = Math.sin(zz * gv.tempo * 6.283);
      versatz[0] = ww * gv.staerke;
      g.becken = g.becken || [0, 0, 0]; g.becken[2] += ww * 1.6;
      g.brust[2] -= ww * 1.2;
      g.oberschenkelL = g.oberschenkelL || [0, 0, 0]; g.oberschenkelL[2] -= ww * 1.4;
      g.oberschenkelR = g.oberschenkelR || [0, 0, 0]; g.oberschenkelR[2] -= ww * 1.4;
    }
    // Gehen
    if (figur.gehen > 0.01) {
      var GH = A.gehen, gp = figur.schrittPhase = (figur.schrittPhase || 0) + dt * GH.schritte * Math.PI * figur.gehen;
      var sn = Math.sin(gp), cs = Math.cos(gp), kk = figur.gehen;
      ["oberschenkelL", "oberschenkelR", "unterschenkelL", "unterschenkelR", "oberarmL", "oberarmR", "unterarmL", "unterarmR"].forEach(function (nn) { g[nn] = g[nn] || [0, 0, 0]; });
      g.oberschenkelL[0] -= sn * GH.bein * kk; g.oberschenkelR[0] += sn * GH.bein * kk;
      g.unterschenkelL[0] += Math.max(0, -cs) * GH.knie * kk; g.unterschenkelR[0] += Math.max(0, cs) * GH.knie * kk;
      g.oberarmL[0] += sn * GH.arm * kk; g.oberarmR[0] -= sn * GH.arm * kk;
      g.unterarmL[0] -= 10 * kk; g.unterarmR[0] -= 10 * kk;
      versatz[1] = Math.abs(cs) * 0.018 * kk;
    }
    // Sprechen: kleine Kopfbewegungen
    if (figur.spricht > 0) {
      figur.spricht = Math.max(0, figur.spricht - dt);
      g.kopf = g.kopf || [0, 0, 0];
      g.kopf[0] += Math.sin(zz * 7.3) * 1.4 + Math.sin(zz * 3.1) * 1.0;
      g.kopf[1] += Math.sin(zz * 2.3) * 1.2;
    }
    // Blick zur sprechenden Person
    var kd = A.kopfDrehen, ziel = [0, 0];
    if (figur.blickZiel) {
      var weltKopf = [figur.pos[0], figur.pos[1] + (figur.haltung === "sitzen" ? 1.18 : 1.59) * figur.skala, figur.pos[2]];
      var d = M.minus(figur.blickZiel, weltKopf);
      var dr = -figur.dreh * GR, c = Math.cos(dr), s = Math.sin(dr);
      var lx = c * d[0] + s * d[2], lz = -s * d[0] + c * d[2];
      var gier = Math.atan2(lx, lz) / GR, nick = -Math.atan2(d[1], Math.hypot(lx, lz)) / GR;
      ziel = [M.klemme(nick, -kd.maxHoch, kd.maxHoch), M.klemme(gier, -kd.maxSeite, kd.maxSeite)];
    }
    for (k = 0; k < 2; k++) {
      var r = M.feder(figur.blick[k], ziel[k], figur.blickGeschw[k], dt, kd.tempo);
      figur.blick[k] = r.wert; figur.blickGeschw[k] = r.geschw;
    }
    g.kopf = g.kopf || [0, 0, 0]; g.hals = g.hals || [0, 0, 0];
    g.kopf[0] += figur.blick[0] * 0.55; g.kopf[1] += figur.blick[1] * 0.5;
    g.hals[0] += figur.blick[0] * 0.3; g.hals[1] += figur.blick[1] * 0.35;
    // Augen: folgen dem Ziel schneller als der Kopf, dazu kleine Blicksprünge
    figur.sakkadeZeit -= dt;
    if (figur.sakkadeZeit <= 0) {
      figur.sakkadeZeit = 0.6 + Math.abs(Math.sin(zz * 12.9898) * 43758.5453 % 1) * 2.2;
      figur.augenZiel = [(Math.sin(zz * 3.7) * 2.2), (Math.sin(zz * 5.3) * 3.5)];
    }
    var ae = A.augen;
    var aNick = M.klemme(ziel[0] - figur.blick[0] * 0.85 + figur.augenZiel[0], -ae.maxHoch, ae.maxHoch);
    var aGier = M.klemme(ziel[1] - figur.blick[1] * 0.85 + figur.augenZiel[1], -ae.maxSeite, ae.maxSeite);
    var ak = Math.min(1, dt * 18);
    figur.augen[0] += (aNick - figur.augen[0]) * ak; figur.augen[1] += (aGier - figur.augen[1]) * ak;
    g.augeL = [figur.augen[0], figur.augen[1], 0]; g.augeR = [figur.augen[0], figur.augen[1], 0];

    // Knochen-Matrizen: Welt = Eltern · Verschiebung(Ruhe) · Drehung; Haut = Welt · Bindehaltung⁻¹
    var SK = figur.sk;
    var wurzel = M.trs(M.m4(), [figur.pos[0] + versatz[0], figur.pos[1] + pose.beckenHoehe * figur.skala + (versatz[1] || 0), figur.pos[2]], figur.dreh, figur.skala);
    var W = figur.welt, kd2 = figur.knochenDaten;
    for (var i = 0; i < KNOCHEN.length; i++) {
      var name = KNOCHEN[i], e = ELTERN[i];
      var lokal = mul(verschieb(SK.ruhe[i]), rot(g[name] || [0, 0, 0]));
      W[i] = e < 0 ? mul(wurzel, lokal) : mul(W[e], lokal);
      var m = mul(W[i], SK.bindInv[i]), o = i * 12;
      kd2[o] = m[0]; kd2[o + 1] = m[4]; kd2[o + 2] = m[8]; kd2[o + 3] = m[12];
      kd2[o + 4] = m[1]; kd2[o + 5] = m[5]; kd2[o + 6] = m[9]; kd2[o + 7] = m[13];
      kd2[o + 8] = m[2]; kd2[o + 9] = m[6]; kd2[o + 10] = m[10]; kd2[o + 11] = m[14];
    }
    var T = D.R.kopf.tragion, jk = SK.gelenke[K.kopf];
    figur.kopfWelt = M.punktMal(W[K.kopf], [T[0] - jk[0], T[1] - jk[1] + 0.012, T[2] - jk[2] + 0.025]);
    figur.schulterL = M.punktMal(W[K.oberarmL], [0, 0.03, 0]);
    figur.schulterR = M.punktMal(W[K.oberarmR], [0, 0.03, 0]);
    figur.objekte.forEach(function (o) { o.kugelWelt.m = [figur.pos[0], (figur.pos[1] || 0) + 0.9, figur.pos[2]]; });
  };

  /* ---------- Menschenmengen: grobe Figuren, einmal in die Haltung gerechnet ----------
     variante: 0 = Anzug mit Kurzhaar, 1 = Blazer mit Dutt, 2 = Pullover mit langem Haar
     teil: "koerper" (Kleidung), "haut" (Kopf und Hände), "haar" oder leer (alles) */
  var mengenCache = {};
  F.modellFigur = function (sitzend, teil, variante) {
    variante = variante || 0;
    var schl = (sitzend ? "s" : "t") + (teil || "alle") + variante;
    if (mengenCache[schl]) return mengenCache[schl];
    daten();
    var w = variante === 0 ? 0 : 1;
    var namen = { koerper: [], haut: [variante === 0 ? "kopf_lo" : "kopf_w_lo", "haende_lo"], haar: [] };
    if (variante === 0) { namen.koerper = ["sakko_lo", "hemd_lo", "hose_lo", "schuhe_m_lo"]; namen.haar = ["haar_kurz_lo"]; }
    else if (variante === 1) { namen.koerper = ["blazer_lo", "bluse_lo", "hose_lo", "schuhe_w_lo"]; namen.haar = ["haar_dutt_lo"]; }
    else { namen.koerper = ["pullover_lo", "hose_lo", "schuhe_w_lo"]; namen.haar = ["haar_lang_lo"]; }
    var liste = teil ? namen[teil] : namen.koerper.concat(namen.haut, namen.haar);
    var fig = { pos: [0, 0, 0], dreh: 0, skala: 1, haltung: sitzend ? "sitzen" : "stehen", sk: skelett(w, w), knochenDaten: new Float32Array(84 * 4),
      geste: null, blickZiel: null, blick: [0, 0], blickGeschw: [0, 0], spricht: 0, zeitVersatz: 0, welt: [], objekte: [], augen: [0, 0], augenZiel: [0, 0], sakkadeZeit: 1 };
    F.aktualisieren(fig, 0, 0);
    var kd = fig.knochenDaten, g = Geo.leer();
    liste.forEach(function (name) {
      var t = D.teile[name]; if (!t) return;
      var p = teilPunkte(t, function (m, tt) { return m === "w" ? w - tt.w0 : 0; });
      var basis = g.p.length / 3;
      for (var v = 0; v < t.n; v++) {
        var x = p[v * 3], y = p[v * 3 + 1], z = p[v * 3 + 2], ox = 0, oy = 0, oz = 0;
        for (var j = 0; j < 4; j++) {
          var gw = t.gw[v * 4 + j] / 255; if (!gw) continue;
          var o = t.kn[v * 4 + j] * 12;
          ox += gw * (kd[o] * x + kd[o + 1] * y + kd[o + 2] * z + kd[o + 3]);
          oy += gw * (kd[o + 4] * x + kd[o + 5] * y + kd[o + 6] * z + kd[o + 7]);
          oz += gw * (kd[o + 8] * x + kd[o + 9] * y + kd[o + 10] * z + kd[o + 11]);
        }
        g.p.push(ox, oy, oz); g.n.push(0, 1, 0); g.uv.push(x, y); g.ao.push(t.ao[v] / 255); g.k.push(0);
      }
      for (var i = 0; i < t.idx.length; i++) g.i.push(t.idx[i] + basis);
    });
    var nn = normalen(g.p, g.i);
    for (var q = 0; q < nn.length; q++) g.n[q] = nn[q];
    mengenCache[schl] = g;
    return g;
  };

  F.K = K;
  return F;
})();
