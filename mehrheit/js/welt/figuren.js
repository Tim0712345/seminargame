/* =====================================================================
   js/welt/figuren.js – Gliederfiguren aus dem Modellbau (Abschnitt 7.7)
   ---------------------------------------------------------------------
   Starre Teile an einer Knochen-Hierarchie (keine Haut-Verformung).
   Pro Material entsteht ein Puffer; jeder Eckpunkt kennt seinen Knochen.
   Gelenke sind dezent sichtbar (kleine Fugen) – das ist Teil des Stils.
   Figur schaut in lokaler +z-Richtung, +x ist ihre linke Seite.
   ===================================================================== */
var WELT = window.WELT || {};

WELT.figuren = (function () {
  var F = {};
  var M = MOTOR.m, Geo = MOTOR.geo, GR = M.GRAD;

  var KNOCHEN = ["becken", "brust", "hals", "kopf", "oberarmL", "unterarmL", "handL", "oberarmR", "unterarmR", "handR",
                 "oberschenkelL", "unterschenkelL", "fussL", "oberschenkelR", "unterschenkelR", "fussR", "handL_zeigen", "handR_zeigen"];
  var ELTERN = [-1, 0, 1, 2, 1, 4, 5, 1, 7, 8, 0, 10, 11, 0, 13, 14, 5, 8];
  var K = {}; KNOCHEN.forEach(function (n, i) { K[n] = i; });
  F.KNOCHEN = KNOCHEN;

  function trs(p, sk) { var m = M.m4(); m[12] = p[0]; m[13] = p[1]; m[14] = p[2]; if (sk) { m[0] = sk[0]; m[5] = sk[1]; m[10] = sk[2]; } return m; }
  function rot(e) { return M.ausQuat(M.m4(), M.quatEuler(e)); }
  function mul() { var r = arguments[0]; for (var i = 1; i < arguments.length; i++) r = M.mul(M.m4(), r, arguments[i]); return r; }

  /* ---------- Kopfform: Ellipsoid mit modellierten Formen ---------- */
  function kopfPunkt(d, kb) {
    var rx = 0.076, ry = 0.1, rz = 0.093;
    var x = d[0], y = d[1], z = d[2];
    var kiefer = M.glatt(-0.05, -0.8, y);
    var sx = 1 - 0.14 * kiefer, sz = 1 - 0.06 * kiefer * M.glatt(0.0, 0.8, z);
    var gesicht = M.glatt(0.55, 1.0, z) * M.glatt(-0.9, -0.2, y);
    var p = [x * rx * sx, y * ry, z * rz * sz * (1 - 0.07 * gesicht)];
    var b = 0;
    function g(a, mitte, breite) { var dx = (x - mitte[0]) / breite[0], dy = (y - mitte[1]) / breite[1], dz = (z - mitte[2]) / breite[2]; return a * Math.exp(-(dx * dx + dy * dy + dz * dz)); }
    b += g(0.010, [0, -0.8, 0.58], [0.2, 0.13, 0.2]);                          // Kinn
    b += g(0.016, [0, -0.08, 1.0], [0.055, 0.16, 0.25]) + g(0.006, [0, -0.24, 1], [0.08, 0.06, 0.25]);  // Nasenrücken und -spitze
    b += g(0.005, [0, 0.2, 0.98], [0.38, 0.07, 0.3]);                          // Brauenbogen
    b -= g(0.007, [0.36, 0.08, 0.92], [0.12, 0.07, 0.2]) + g(0.007, [-0.36, 0.08, 0.92], [0.12, 0.07, 0.2]);   // Augenhöhlen
    b += g(0.004, [0.62, -0.1, 0.74], [0.18, 0.15, 0.2]) + g(0.004, [-0.62, -0.1, 0.74], [0.18, 0.15, 0.2]); // Wangenknochen
    b += g(0.012, [0, 0.4, -0.88], [0.65, 0.45, 0.3]);                         // Hinterkopf
    b -= g(0.003, [0, -0.47, 0.88], [0.22, 0.05, 0.2]);                        // Mundlinie (ganz leicht)
    b += (kb || 0);
    return [p[0] + x * b, p[1] + y * b + 0.112, p[2] + z * b + 0.006];
  }
  function kugelRichtung(th, ph) { return [Math.sin(th) * Math.sin(ph), Math.cos(th), Math.sin(th) * Math.cos(ph)]; }

  function kopfGeo(ringe, seg) {
    var g = Geo.leer();
    for (var i = 0; i <= ringe; i++) for (var j = 0; j <= seg; j++) {
      var th = Math.PI * i / ringe, ph = Math.PI * 2 * j / seg;
      var p = kopfPunkt(kugelRichtung(th, ph));
      g.p.push(p[0], p[1], p[2]); g.n.push(0, 1, 0); g.uv.push(ph * 0.08, th * 0.1);
    }
    for (i = 0; i < ringe; i++) for (j = 0; j < seg; j++) {
      var a = i * (seg + 1) + j, b = a + 1, c = a + seg + 2, d = a + seg + 1;
      g.i.push(a, d, c, a, c, b);
    }
    Geo.normalenNeu(g);
    return Geo.windung(g);
  }

  /* Haarkappe: Teil der Kopfform, etwas größer; grenze(ph) = Polarwinkel des Haaransatzes */
  function haarKappe(grenze, dicke, ringe, seg, wellen) {
    var g = Geo.leer();
    for (var i = 0; i <= ringe; i++) for (var j = 0; j <= seg; j++) {
      var ph = Math.PI * 2 * j / seg, th = grenze(ph) * i / ringe;
      var d = kugelRichtung(th, ph);
      var rand = M.glatt(0.82, 1.0, i / ringe);
      var w = wellen ? Math.sin(ph * wellen) * 0.0015 * (1 - rand) : 0;
      var p = kopfPunkt(d, dicke * (1 - rand * 0.85) + w);
      g.p.push(p[0], p[1], p[2]); g.n.push(0, 1, 0); g.uv.push(ph * 0.1, th * 0.12);
    }
    for (i = 0; i < ringe; i++) for (j = 0; j < seg; j++) {
      var a = i * (seg + 1) + j, b = a + 1, c = a + seg + 2, dd = a + seg + 1;
      g.i.push(a, dd, c, a, c, b);
    }
    Geo.normalenNeu(g);
    return Geo.windung(g);
  }

  /* Glied: verjüngter Drehkörper von 0 nach -laenge */
  function glied(r0, r1, laenge, seg, wulst) {
    var p = [], n = 10;
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      var r = M.lerp(r0, r1, t) + (wulst ? wulst * Math.sin(Math.PI * Math.min(1, t * 1.3)) : 0);
      var rund = 1;
      if (i === 0) rund = 0.55; if (i === n) rund = 0.55;
      p.push([r * rund, -t * laenge]);
    }
    p.unshift([0, r0 * 0.25]); p.push([0, -laenge - r1 * 0.25]);
    return Geo.drehkoerper(p.reverse(), seg, {});
  }
  function ellipsoid(rx, ry, rz, seg) {
    var g = Geo.kugel(1, seg || 16, Math.round((seg || 16) / 2));
    return Geo.transform(g, trs([0, 0, 0], [rx, ry, rz]));
  }

  /* Rumpf als elliptischer Drehkörper (Profil [radius, y]) */
  function rumpf(profil, tiefe, seg, falten) {
    var g = Geo.drehkoerper(profil, seg, {});
    Geo.verformen(g, function (p) {
      var f = falten ? Math.sin(p[1] * 90) * 0.0015 * falten : 0;
      return [p[0] * (1 + f), p[1], p[2] * tiefe];
    });
    return g;
  }

  /* Hand (kanonisch: hängt nach unten, Handfläche nach +z, Daumen bei +x) */
  function handGeo(zeigen, spiegel) {
    var g = Geo.leer(), s = spiegel ? -1 : 1;
    Geo.anhaengen(g, Geo.box(0.072, 0.085, 0.026, 0.011, 2), trs([0, -0.05, 0]));
    var fx = [-0.026, -0.009, 0.009, 0.026], fl = [0.055, 0.068, 0.072, 0.064];
    for (var i = 0; i < 4; i++) {
      var kr = zeigen ? (i === 2 ? -4 : -95) : -18 - i * 4;
      if (zeigen && i === 2) kr = -2;
      var basis = mul(trs([fx[i] * s, -0.09, 0.002]), rot([kr * 0.55, 0, 0]));
      var r = 0.0078 - i * 0.0004;
      Geo.anhaengen(g, Geo.kapsel(r, fl[i] * 0.5, 8, 3), mul(basis, rot([180, 0, 0])));
      var mitte = mul(basis, trs([0, -fl[i] * 0.5, 0]), rot([kr * 0.6, 0, 0]));
      Geo.anhaengen(g, Geo.kapsel(r * 0.92, fl[i] * 0.45, 8, 3), mul(mitte, rot([180, 0, 0])));
    }
    var daumen = mul(trs([0.034 * s, -0.035, 0.012]), rot([-35, 0, 28 * s]));
    Geo.anhaengen(g, Geo.kapsel(0.0092, 0.035, 8, 3), mul(daumen, rot([180, 0, 0])));
    Geo.anhaengen(g, Geo.kapsel(0.0085, 0.028, 8, 3), mul(daumen, trs([0, -0.04, 0]), rot([-20, 0, 0]), rot([180, 0, 0])));
    return g;
  }

  /* ---------- Figur bauen ---------- */
  F.bauen = function (B, def, eintrag, sz) {
    var bau = DATA.figuren.koerperbau[def.bau] || DATA.figuren.koerperbau.mittel;
    var skala = (def.groesse || 1.7) / 1.7;
    var haut = DATA.figuren.hauttoene[def.haut || 2];
    var fr = null; DATA.fraktionen.forEach(function (f) { if (f.id === def.fraktion) fr = f; });
    var akzentFarbe = (def.akzent && def.akzent.farbe) || (fr ? fr.farbe : "#00a2ad");
    var kl = def.kleidung || {};
    var teile = {};   // Material-Schlüssel → { mat, geo }
    function teil(schl, matName, extra, geo, m, knochen) {
      if (!teile[schl]) teile[schl] = { mat: WELT.material(matName, extra), geo: Geo.leer() };
      Geo.anhaengen(teile[schl].geo, geo, m, K[knochen]);
    }
    function h(geo, m, kn) { teil("haut", "haut", { farbe: haut }, geo, m, kn); }
    var oben = kl.oben || { farbe: "#555" }, hemd = kl.hemd || { farbe: "#eee" }, unten = kl.unten || { farbe: "#333" }, schuhe = kl.schuhe || { farbe: "#222" };
    function stoffOben(geo, m, kn) { teil("oben", "stoff", { farbe: oben.farbe, strukturSkala: 22 }, geo, m, kn); }
    function stoffHemd(geo, m, kn) { teil("hemd", "stoff", { farbe: hemd.farbe, strukturSkala: 30, rauheit: 0.75 }, geo, m, kn); }
    function stoffUnten(geo, m, kn) { teil("unten", "stoff", { farbe: unten.farbe, strukturSkala: 22 }, geo, m, kn); }

    var sch = bau.schulter, hu = bau.huefte, ta = bau.taille, bt = bau.brustTiefe;
    var ar = bau.arm, be = bau.bein, ha = bau.hals;
    var formen = def.formen || 0;

    /* Ruhe-Versatz der Knochen (bei 1,70 m) */
    var ruhe = {
      becken: [0, 0.95, 0], brust: [0, 0.1, 0], hals: [0, 0.338, -0.004], kopf: [0, 0.052, 0.01],
      oberarmL: [sch * 0.95, 0.318, -0.012], unterarmL: [0, -0.285, 0], handL: [0, -0.252, 0],
      oberarmR: [-sch * 0.95, 0.318, -0.012], unterarmR: [0, -0.285, 0], handR: [0, -0.252, 0],
      oberschenkelL: [hu * 0.58, -0.075, 0.004], unterschenkelL: [0, -0.415, 0], fussL: [0, -0.392, 0],
      oberschenkelR: [-hu * 0.58, -0.075, 0.004], unterschenkelR: [0, -0.415, 0], fussR: [0, -0.392, 0],
      handL_zeigen: [0, -0.252, 0], handR_zeigen: [0, -0.252, 0]
    };

    /* Haut: Kopf, Hals, Hände, (Unter-)Arme an Ärmelenden, Ohren */
    h(kopfGeo(30, 40), null, "kopf");
    [-1, 1].forEach(function (s) {
      h(ellipsoid(0.011, 0.028, 0.019, 12), mul(trs([s * 0.076, 0.106, -0.006]), rot([0, s * 18, 0])), "kopf");
    });
    h(Geo.drehkoerper([[ha * 0.92, 0], [ha * 0.86, 0.05], [ha * 0.84, 0.1]], 20, {}), trs([0, -0.03, 0]), "hals");
    // Augen: matte dunkle Einlagen
    [-1, 1].forEach(function (s) {
      var d = M.norm([0.36 * s, 0.08, 0.93]);
      var p = kopfPunkt(d);
      teil("auge", "auge", null, ellipsoid(0.0125, 0.0068, 0.005, 14), mul(trs([p[0] + d[0] * 0.0006, p[1], p[2] + d[2] * 0.0006]), rot([0, s * 18, 0])), "kopf");
    });
    // Hände
    h(Geo.transform(handGeo(false, false), rot([0, -90, 0])), null, "handL");
    h(Geo.transform(handGeo(false, true), rot([0, 90, 0])), null, "handR");
    h(Geo.transform(handGeo(true, false), rot([0, -90, 0])), null, "handL_zeigen");
    h(Geo.transform(handGeo(true, true), rot([0, 90, 0])), null, "handR_zeigen");
    // Handgelenke (Fugen)
    h(Geo.kugel(ar * 0.6, 12, 6), trs([0, 0.004, 0]), "handL");
    h(Geo.kugel(ar * 0.6, 12, 6), trs([0, 0.004, 0]), "handR");

    /* Oberkörper: Kleidung (Sakko/Blazer) mit offenem Kragen */
    var rumpfProfil = [[0, -0.03], [ta * 0.95, -0.03], [ta * 0.93, 0.03], [ta * 0.98, 0.1], [sch * 0.88, 0.18], [sch * 0.99, 0.25], [sch * 1.04, 0.29], [sch * 0.97, 0.322], [sch * 0.64, 0.346], [ha * 1.3, 0.356], [0, 0.36]];
    stoffOben(rumpf(rumpfProfil.map(function (q) { return [q[0] * 1.06, q[1]]; }), bt / sch * 0.95, 40, 0), null, "brust");
    if (formen > 0) {
      [-1, 1].forEach(function (s) { stoffOben(ellipsoid(0.055, 0.05, 0.035 * formen + 0.01, 14), trs([s * 0.055, 0.2, bt * 0.88]), "brust"); });
    }
    var mitJacke = oben.art === "blazer" || oben.art === "sakko";
    if (mitJacke) {
      // Hemd/Bluse im V-Ausschnitt
      var v = Geo.leer();
      Geo.anhaengen(v, Geo.box(0.11, 0.17, 0.02, 0.008, 2), mul(trs([0, 0.27, bt * 0.98 + 0.004]), rot([-14, 0, 0])));
      Geo.verformen(v, function (p) { var t = M.klemme((0.36 - p[1]) / 0.18, 0, 1); return [p[0] * (0.25 + 0.75 * (1 - t)) + 0.0, p[1], p[2]]; });
      stoffHemd(v, null, "brust");
      // Revers (Lapels)
      [-1, 1].forEach(function (s) {
        var rv = Geo.box(0.045, 0.16, 0.012, 0.005, 2);
        stoffOben(rv, mul(trs([s * 0.05, 0.27, bt * 1.04 + 0.006]), rot([-12, 0, s * 18])), "brust");
      });
      // Kragen
      stoffHemd(Geo.drehkoerper([[ha * 1.1, 0], [ha * 1.08, 0.035], [ha * 1.02, 0.055]], 22, {}), trs([0, 0.33, 0.004]), "brust");
    } else {
      // Pullover: Rundkragen mit Rippen
      stoffOben(Geo.drehkoerper([[ha * 1.18, 0], [ha * 1.14, 0.025], [ha * 1.06, 0.04]], 22, {}), trs([0, 0.33, 0.004]), "brust");
    }
    // Schultern (Fugen in Stoff)
    [-1, 1].forEach(function (s) { stoffOben(Geo.kugel(ar * 1.1, 16, 8), trs([s * sch * 0.95, 0.318, -0.012]), "brust"); });
    var rock = unten.art === "rock";
    function stoffBein(geo, m, kn) { if (rock) teil("beine", "stoff", { farbe: unten.strumpf || haut, strukturSkala: 40, rauheit: 0.6 }, geo, m, kn); else stoffUnten(geo, m, kn); }
    if (rock) stoffUnten(Geo.drehkoerper([[hu * 1.42, -0.44], [hu * 1.42, -0.44], [hu * 1.3, -0.3], [hu * 1.1, -0.1], [ta * 1.05, 0.06], [ta * 1.0, 0.11], [0, 0.11]], 36, { deckelUnten: false }), trs([0, 0, 0.004], [1, 1, bt / sch * 1.1]), "becken");
    // Becken (Hose) und Saum des Sakkos
    stoffUnten(rumpf([[0, -0.12], [hu * 0.7, -0.125], [hu * 0.98, -0.07], [hu * 1.0, 0.0], [ta * 1.02, 0.09], [ta * 0.98, 0.11], [0, 0.11]], bt / sch * 1.04, 32, 0), null, "becken");
    var saum = Math.max(hu, ta) * 1.1;
    if (mitJacke) stoffOben(rumpf([[saum * 0.97, -0.13], [saum * 0.96, -0.13], [saum * 1.0, -0.08], [saum * 1.02, 0.02], [saum * 0.98, 0.11], [saum * 0.95, 0.12]], bt / sch * 1.05, 32, 0), null, "becken");

    /* Arme: Ärmel über Ober- und Unterarm */
    ["L", "R"].forEach(function (s) {
      stoffOben(glied(ar * 1.1, ar * 0.98, 0.27, 16, 0.0), null, "oberarm" + s);
      stoffOben(Geo.kugel(ar * 0.97, 14, 7), trs([0, -0.285, 0]), "unterarm" + s);
      stoffOben(glied(ar * 0.98, ar * 0.88, 0.205, 16, 0.0), null, "unterarm" + s);
      stoffHemd(Geo.zylinder(ar * 0.8, 0.02, 14, false), trs([0, -0.225, 0]), "unterarm" + s);
      h(glied(ar * 0.72, ar * 0.62, 0.06, 12, 0), trs([0, -0.2, 0]), "unterarm" + s);
    });

    /* Beine: Hose, Knie-Fugen, Schuhe */
    ["L", "R"].forEach(function (s) {
      stoffBein(glied(be * (rock ? 0.95 : 1.05), be * 0.8, 0.41, 18, 0.0), null, "oberschenkel" + s);
      stoffBein(Geo.kugel(be * 0.8, 14, 7), trs([0, -0.415, 0]), "unterschenkel" + s);
      stoffBein(glied(be * (rock ? 0.72 : 0.78), be * (rock ? 0.56 : 0.64), 0.37, 18, 0.004), null, "unterschenkel" + s);
      var schuh = Geo.box(0.088, 0.07, 0.255, 0.03, 3);
      Geo.verformen(schuh, function (p) { var vorne = M.glatt(0.0, 0.12, p[2]); return [p[0] * (1 - vorne * 0.12), p[1] - vorne * Math.max(0, p[1]) * 0.45, p[2]]; });
      teil("schuhe", "leder", { farbe: schuhe.farbe }, schuh, trs([0, -0.035, 0.055]), "fuss" + s);
    });

    /* Haare */
    var hr = def.haare || { form: "kurz" };
    var haarMat = { farbe: hr.farbe || "#3a2a22" };
    if (hr.form === "kopftuch") {
      var tuch = { farbe: hr.farbe, strukturSkala: 30, samt: 0.4, rauheit: 0.8 };
      teil("haar", "stoff", tuch, haarKappe(function (ph) { var vorn = Math.cos(ph); return vorn > 0.55 ? 0.95 + (1 - vorn) * 1.6 : 1.7 + (1 - vorn) * 0.5; }, 0.011, 24, 56, 0), null, "kopf");
      teil("haar", "stoff", tuch, Geo.drehkoerper([[ha * 1.75, -0.02], [ha * 1.5, 0.05], [ha * 1.35, 0.1]], 28, {}), trs([0, -0.035, -0.006], [1, 1, 1.05]), "hals");
    } else if (hr.form !== "glatze") {
      var grenze;
      if (hr.form === "dutt" || hr.form === "lang" || hr.form === "zopf") grenze = function (ph) { var vorn = Math.cos(ph); return Math.min(2.15, 0.76 + 1.2 * (1 - vorn) * 0.5 + (vorn < 0 ? -vorn * 0.3 : 0)); };
      else if (hr.form === "locken") grenze = function (ph) { var vorn = Math.cos(ph); return Math.min(2.2, 0.78 + 1.25 * (1 - vorn) * 0.5 + (vorn < 0 ? -vorn * 0.3 : 0)); };
      else grenze = function (ph) { var vorn = Math.cos(ph); return Math.min(2.0, 0.82 + 1.0 * (1 - vorn) * 0.5 + (vorn < 0 ? -vorn * 0.25 : 0)); };
      teil("haar", "haar", haarMat, haarKappe(grenze, hr.form === "kurz" ? 0.0055 : (hr.form === "locken" ? 0.012 : 0.0085), 20, 48, 0), null, "kopf");
      if (hr.form === "dutt") {
        teil("haar", "haar", haarMat, ellipsoid(0.047, 0.04, 0.043, 20), trs([0, 0.17, -0.095]), "kopf");
        teil("haar", "haar", haarMat, Geo.zylinder(0.028, 0.03, 16, true), mul(trs([0, 0.16, -0.075]), rot([-60, 0, 0])), "kopf");
      }
      if (hr.form === "lang") {
        var lang = Geo.box(0.17, 0.24, 0.055, 0.025, 3);
        Geo.verformen(lang, function (p) { return [p[0] * (1 + Math.max(0, -p[1]) * 0.6), p[1], p[2] + p[1] * p[1] * 0.6]; });
        teil("haar", "haar", haarMat, lang, trs([0, -0.015, -0.068]), "kopf");
      }
      if (hr.form === "zopf") {
        var z = [];
        for (var zi = 0; zi <= 8; zi++) z.push([Math.sin(zi * 1.3) * 0.006, 0.07 - zi * 0.03, -0.1 - zi * 0.006]);
        teil("haar", "haar", haarMat, Geo.rohr(z, function (t) { return 0.022 - t * 0.01; }, 10), null, "kopf");
      }
      if (hr.form === "locken") {
        var rz = M.zufall(31);
        for (var li = 0; li < 70; li++) {
          var th = rz() * 1.9, ph = rz() * Math.PI * 2;
          if (Math.cos(ph) > 0.4 && th > 0.75) continue;
          var d = kugelRichtung(th, ph), lp = kopfPunkt(d, 0.012);
          teil("haar", "haar", haarMat, Geo.kugel(0.017 + rz() * 0.01, 10, 5), trs(lp), "kopf");
        }
      }
    }
    if (def.bart) {
      var bartGrenze = function () { return Math.PI; };
      var bart = Geo.leer();
      var bg = haarKappe(function () { return Math.PI; }, 0.0024, 22, 48, 0);
      // nur Kinn und Wangen behalten
      var keep = Geo.leer();
      for (var t = 0; t < bg.i.length; t += 3) {
        var ok = true;
        for (var k = 0; k < 3; k++) {
          var vi = bg.i[t + k], y = bg.p[vi * 3 + 1] - 0.118, z = bg.p[vi * 3 + 2], ax = Math.abs(bg.p[vi * 3]);
          if (!(y < -0.04 && z > -0.03 && !(y > -0.078 && z > 0.06 && ax < 0.032))) ok = false;
        }
        if (ok) keep.i.push(bg.i[t], bg.i[t + 1], bg.i[t + 2]);
      }
      keep.p = bg.p; keep.n = bg.n; keep.uv = bg.uv;
      teil("bart", "haar", { farbe: def.bart.farbe || haarMat.farbe, rauheit: 0.8, strukturSkala: 60 }, keep, null, "kopf");
    }

    /* Brille */
    if (def.brille) {
      var rahmen = { farbe: def.brille.rahmen || "#444" };
      [-1, 1].forEach(function (s) {
        var d = M.norm([0.36 * s, 0.08, 0.93]), p = kopfPunkt(d);
        var ring = [];
        for (var i = 0; i <= 20; i++) { var w = i / 20 * Math.PI * 2; ring.push([p[0] + Math.cos(w) * 0.021, p[1] + Math.sin(w) * 0.015, p[2] + 0.017]); }
        teil("brille", "aluminium", rahmen, Geo.rohr(ring, 0.0011, 5), null, "kopf");
        teil("brille", "aluminium", rahmen, Geo.rohr([[p[0] + s * 0.021, p[1] + 0.004, p[2] + 0.015], [s * 0.078, 0.124, 0.0], [s * 0.079, 0.112, -0.04]], 0.0014, 4), null, "kopf");
      });
      var nb = kopfPunkt(M.norm([0, 0.1, 1]));
      teil("brille", "aluminium", rahmen, Geo.rohr([[-0.012, nb[1] - 0.002, nb[2] + 0.004], [0, nb[1] + 0.002, nb[2] + 0.006], [0.012, nb[1] - 0.002, nb[2] + 0.004]], 0.0016, 4), null, "kopf");
    }

    /* Akzent in Fraktionsfarbe */
    var ak = def.akzent && def.akzent.art;
    if (ak === "schal") {
      var schal = [];
      for (var i = 0; i <= 24; i++) { var w = i / 24 * Math.PI * 2; schal.push([Math.sin(w) * (ha * 1.55), 0.335 + Math.cos(w * 2) * 0.004, Math.cos(w) * (ha * 1.35) + 0.004]); }
      teil("akzent", "stoff", { farbe: akzentFarbe, strukturSkala: 26, samt: 0.5 }, Geo.rohr(schal, 0.016, 10), null, "brust");
      [[0.03, -4], [-0.012, 6]].forEach(function (e) {
        var ende = Geo.box(0.05, 0.2, 0.014, 0.006, 2);
        teil("akzent", "stoff", { farbe: akzentFarbe, strukturSkala: 26, samt: 0.5 }, ende, mul(trs([e[0], 0.23, bt * 1.05 + 0.02]), rot([-10, 0, e[1]])), "brust");
      });
    } else if (ak === "krawatte") {
      var kr = Geo.box(0.038, 0.2, 0.008, 0.003, 2);
      Geo.verformen(kr, function (p) { var t = M.klemme((0.1 - p[1]) / 0.2, 0, 1); return [p[0] * (0.6 + t * 0.7), p[1], p[2]]; });
      teil("akzent", "lack", { farbe: akzentFarbe, rauheit: 0.45, klarlack: 0.2 }, kr, mul(trs([0, 0.25, bt * 1.0 + 0.012]), rot([-13, 0, 0])), "brust");
      teil("akzent", "lack", { farbe: akzentFarbe, rauheit: 0.45 }, Geo.box(0.026, 0.02, 0.014, 0.005, 2), trs([0, 0.345, bt * 0.6 + 0.012]), "brust");
    } else if (ak === "anstecker") {
      teil("akzent", "lack", { farbe: akzentFarbe }, Geo.zylinder(0.008, 0.004, 12, true), mul(trs([0.06, 0.29, bt * 1.05 + 0.008]), rot([90, 0, 0])), "brust");
    }

    /* Rollstuhl (Aluminium und Stoff, Räder drehen sich) */
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

    /* Puffer hochladen */
    var knochenDaten = new Float32Array(60 * 4);
    var figur = {
      def: def, skala: skala, ruhe: ruhe, knochenDaten: knochenDaten, objekte: [],
      pos: eintrag.pos.slice(), dreh: eintrag.dreh || 0, haltung: eintrag.haltung || "stehen",
      geste: null, gesteNaechste: null, blickZiel: null, blick: [0, 0], blickGeschw: [0, 0], spricht: 0,
      zeitVersatz: Math.random() * 10, welt: [], lokal: []
    };
    for (var schl in teile) {
      var tg = teile[schl];
      var o = B.objekt(tg.geo, tg.mat, M.m4(), { knochen: true, schatten: true });
      o.knochen = knochenDaten;
      o.festeKugel = true;
      o.kugelWelt = { m: [figur.pos[0], (figur.pos[1] || 0) + 0.9, figur.pos[2]], r: 1.3 };
      figur.objekte.push(o);
    }
    F.aktualisieren(figur, 0, 0);
    return figur;
  };

  /* ---------- Pose berechnen ---------- */
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
    erg._zeigen = (a.handformR === "zeigen" && b.handformR === "zeigen") || (u < 0.5 ? a.handformR === "zeigen" : b.handformR === "zeigen");
    return erg;
  }

  F.geste = function (figur, name) {
    if (!DATA.figuren.gesten[name]) return;
    if (MOTOR.bewegungReduziert && name !== "nicken") { figur.geste = { name: name, t: 0, langsam: 0.5 }; return; }
    figur.geste = { name: name, t: 0, langsam: 1 };
  };

  F.aktualisieren = function (figur, dt, zeit) {
    var A = DATA.figuren;
    var pose = poseAus(figur), g = pose.gelenke;
    var zz = zeit + figur.zeitVersatz;
    // Geste
    var zeigen = false;
    if (figur.geste) {
      figur.geste.t += dt * (figur.geste.langsam || 1);
      var gw = gestenWerte(figur.geste, figur.geste.t);
      if (gw) {
        for (var n in gw) if (n[0] !== "_") { g[n] = g[n] || [0, 0, 0]; for (var k = 0; k < 3; k++) g[n][k] += gw[n][k] * (MOTOR.bewegungReduziert ? 0.6 : 1); }
        zeigen = gw._zeigen;
      }
      if (figur.geste.t > A.gesten[figur.geste.name].dauer / (figur.geste.langsam || 1) * (figur.geste.langsam || 1)) figur.geste = null;
    }
    // Atmen
    var at = Math.sin(zz * A.atmen.tempo * 6.283) * A.atmen.staerke;
    g.brust = g.brust || [0, 0, 0]; g.brust[0] -= at * 0.9;
    g.hals = g.hals || [0, 0, 0]; g.hals[0] += at * 0.6;
    g.oberarmL = g.oberarmL || [0, 0, 0]; g.oberarmL[2] += at * 0.5;
    g.oberarmR = g.oberarmR || [0, 0, 0]; g.oberarmR[2] -= at * 0.5;
    // Gewicht verlagern (nur im Stehen)
    var versatz = [0, 0, 0];
    if (figur.haltung === "stehen") {
      var gv = A.gewichtVerlagern, w = Math.sin(zz * gv.tempo * 6.283);
      versatz[0] = w * gv.staerke;
      g.becken = g.becken || [0, 0, 0]; g.becken[2] += w * 1.6;
      g.brust[2] -= w * 1.2;
      g.oberschenkelL = g.oberschenkelL || [0, 0, 0]; g.oberschenkelL[2] -= w * 1.4;
      g.oberschenkelR = g.oberschenkelR || [0, 0, 0]; g.oberschenkelR[2] -= w * 1.4;
    }
    // Gehen
    if (figur.gehen > 0.01) {
      var GH = A.gehen, gp = figur.schrittPhase = (figur.schrittPhase || 0) + dt * GH.schritte * Math.PI * figur.gehen;
      var sn = Math.sin(gp), cs = Math.cos(gp), k = figur.gehen;
      ["oberschenkelL", "oberschenkelR", "unterschenkelL", "unterschenkelR", "oberarmL", "oberarmR", "unterarmL", "unterarmR"].forEach(function (n) { g[n] = g[n] || [0, 0, 0]; });
      g.oberschenkelL[0] -= sn * GH.bein * k; g.oberschenkelR[0] += sn * GH.bein * k;
      g.unterschenkelL[0] += Math.max(0, -cs) * GH.knie * k; g.unterschenkelR[0] += Math.max(0, cs) * GH.knie * k;
      g.oberarmL[0] += sn * GH.arm * k; g.oberarmR[0] -= sn * GH.arm * k;
      g.unterarmL[0] -= 10 * k; g.unterarmR[0] -= 10 * k;
      versatz[1] = Math.abs(cs) * 0.018 * k;
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
      var weltKopf = [figur.pos[0], figur.pos[1] + (figur.haltung === "sitzen" ? 1.15 : 1.55) * figur.skala, figur.pos[2]];
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
    g.kopf[0] += figur.blick[0] * 0.65; g.kopf[1] += figur.blick[1] * 0.6;
    g.hals[0] += figur.blick[0] * 0.35; g.hals[1] += figur.blick[1] * 0.4;

    // Knochen-Matrizen
    var wurzel = M.trs(M.m4(), [figur.pos[0] + versatz[0], figur.pos[1] + pose.beckenHoehe * figur.skala + (versatz[1] || 0), figur.pos[2]], figur.dreh, figur.skala);
    var W = figur.welt;
    for (var i = 0; i < KNOCHEN.length; i++) {
      var name = KNOCHEN[i], e = ELTERN[i];
      var r0 = figur.ruhe[name];
      var winkel = g[name.replace("_zeigen", "")] || [0, 0, 0];
      var lokal = M.mul(M.m4(), trs(r0), rot(winkel));
      var sichtbarFaktor = 1;
      if (name === "handR") sichtbarFaktor = zeigen ? 0 : 1;
      if (name === "handR_zeigen") sichtbarFaktor = zeigen ? 1 : 0;
      if (name === "handL_zeigen") sichtbarFaktor = 0;
      if (sichtbarFaktor === 0) { lokal[0] = lokal[1] = lokal[2] = lokal[4] = lokal[5] = lokal[6] = lokal[8] = lokal[9] = lokal[10] = 0; }
      W[i] = e < 0 ? M.mul(M.m4(), wurzel, lokal) : M.mul(M.m4(), W[e], lokal);
      var m = W[i], o = i * 12, kd2 = figur.knochenDaten;
      kd2[o] = m[0]; kd2[o + 1] = m[4]; kd2[o + 2] = m[8]; kd2[o + 3] = m[12];
      kd2[o + 4] = m[1]; kd2[o + 5] = m[5]; kd2[o + 6] = m[9]; kd2[o + 7] = m[13];
      kd2[o + 8] = m[2]; kd2[o + 9] = m[6]; kd2[o + 10] = m[10]; kd2[o + 11] = m[14];
    }
    figur.kopfWelt = M.punktMal(W[K.kopf], [0, 0.112, 0.02]);
    figur.schulterL = M.punktMal(W[K.oberarmL], [0, 0.04, 0]);
    figur.schulterR = M.punktMal(W[K.oberarmR], [0, 0.04, 0]);
    figur.objekte.forEach(function (o) { o.kugelWelt.m = [figur.pos[0], (figur.pos[1] || 0) + 0.9, figur.pos[2]]; });
  };

  /* Schlichte weiße Modellfiguren (wie im Architekturmodell) für Plenum, Ausschuss und Ränge.
     Ein Netz, mit Instancing vielfach gezeichnet. */
  F.modellFigur = function (sitzend) {
    var g = Geo.leer();
    var hb = sitzend ? 0.52 : 0.95;
    Geo.anhaengen(g, ellipsoid(0.085, 0.11, 0.09, 14), trs([0, hb + 0.62, 0.01]));
    Geo.anhaengen(g, Geo.zylinder(0.045, 0.1, 10, false), trs([0, hb + 0.46, 0]));
    Geo.anhaengen(g, rumpf([[0, 0], [0.15, 0], [0.16, 0.2], [0.19, 0.42], [0.08, 0.49], [0, 0.5]], 0.62, 18, 0), trs([0, hb - 0.02, 0]));
    [-1, 1].forEach(function (s) {
      if (sitzend) {
        Geo.anhaengen(g, Geo.kapsel(0.06, 0.4, 10, 3), mul(trs([s * 0.095, hb + 0.0, 0.0]), rot([90, 0, 0])));
        Geo.anhaengen(g, Geo.kapsel(0.05, 0.42, 10, 3), mul(trs([s * 0.095, 0.04, 0.42]), rot([0, 0, 0])));
        Geo.anhaengen(g, Geo.kapsel(0.042, 0.26, 8, 3), mul(trs([s * 0.19, hb + 0.42, 0.0]), rot([180 - 25, 0, 0])));
        Geo.anhaengen(g, Geo.kapsel(0.036, 0.24, 8, 3), mul(trs([s * 0.17, hb + 0.2, 0.12]), rot([95, 0, 0])));
      } else {
        Geo.anhaengen(g, Geo.kapsel(0.06, 0.86, 10, 3), trs([s * 0.095, 0.06, 0]));
        Geo.anhaengen(g, Geo.kapsel(0.042, 0.52, 8, 3), mul(trs([s * 0.2, hb + 0.44, 0]), rot([180, 0, s * -6])));
      }
    });
    return g;
  };

  F.K = K;
  return F;
})();
