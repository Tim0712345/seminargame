/* =====================================================================
   js/motor/nachbearbeitung.js – Bildeffekte (nur WebGL 2)
   ---------------------------------------------------------------------
   Reihenfolge (Abschnitt 10.4): Umgebungsverdeckung → Lichtstrahlen →
   Tiefenschärfe → Bloom → Tonwertkurve → Farbkorrektur →
   Kantenglättung → Korn, Vignette, chromatische Aberration.
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.post = (function () {
  var P = { taaIndex: 0, alt: 0, altDauer: 0, einstellungen: { tiefe: true, korn: true, helligkeit: 1 } };
  var G, gl, M, R;
  var progs = {}, ziele = {}, groesse = { b: 0, h: 0 };

  var DEBUG_FS = "out vec4 aus0; in vec2 vUv; uniform sampler2D uQ; uniform float uModus; uniform vec2 uLin;\n" +
    "void main() { vec4 c = texture(uQ, vUv);\n" +
    "  if (uModus < 2.5) aus0 = vec4(c.rgb, 1.0);\n" +
    "  else if (uModus < 3.5) { float z = uLin.y / (c.r * 2.0 - 1.0 + uLin.x); aus0 = vec4(vec3(1.0 - exp(-z * 0.12)), 1.0); }\n" +
    "  else if (uModus < 4.5) aus0 = vec4(c.rrr, 1.0);\n" +
    "  else aus0 = vec4(vec3(pow(c.r, 6.0)), 1.0); }";

  P.init = function () {
    G = MOTOR.gl; gl = G.gl; M = MOTOR.m; R = MOTOR.renderer;
    progs = {}; ziele = {}; groesse = { b: 0, h: 0 };
  };

  function prog(name) {
    if (progs[name] === undefined) {
      var S = MOTOR.shader;
      var fs = name === "debug" ? DEBUG_FS : S[name + "_fs"];
      progs[name] = G.programm(S.voll_vs, fs, [], "Nachbearbeitung " + name);
      if (!progs[name]) console.warn("Effekt „" + name + "“ wird abgeschaltet (Shader ließ sich nicht übersetzen).");
    }
    return progs[name];
  }
  P.vorkompilieren = function () {
    ["kopie", "ssao", "bilateral", "strahlen", "zusammen", "coc", "dof", "dofmisch", "runter", "hoch", "ton", "taa", "fxaa", "ende"].forEach(prog);
  };

  function ziel(name, b, h, format, mip) {
    var z = ziele[name];
    if (z && z.b === b && z.h === h) return z;
    if (z) { G.loescheTextur(z.t); G.loescheFbo(z.f); }
    var t = G.textur({ b: b, h: h, format: format || "rgba16f", mip: mip });
    var f = G.fbo([t]);
    ziele[name] = { t: t, f: f, b: b, h: h };
    return ziele[name];
  }
  P.freigeben = function () {
    for (var n in ziele) { G.loescheTextur(ziele[n].t); G.loescheFbo(ziele[n].f); }
    ziele = {};
  };

  function lauf(p, z) {
    if (z) { gl.bindFramebuffer(gl.FRAMEBUFFER, z.f.fb); gl.viewport(0, 0, z.b, z.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, G.kanvas.width, G.kanvas.height); }
    G.vollbild();
  }
  function tex(p, name, einheit, t) { G.tex(einheit, t); p.i1(name, einheit); }

  /* Überblendung (z. B. bei „Bewegung reduzieren“): altes Bild wird festgehalten */
  var letzteAusgabe = null;
  P.ueberblenden = function (dauer) {
    if (!letzteAusgabe) return;
    var a = ziel("alt", letzteAusgabe.b, letzteAusgabe.h, "rgba8");
    var k = prog("kopie"); if (!k) return;
    gl.useProgram(k.p); tex(k, "uQ", 0, letzteAusgabe.t); lauf(k, a);
    P.alt = 1; P.altDauer = dauer || 0.8;
  };

  P.ausfuehren = function (sz, kam, dt, zeit) {
    var z = R.ziele, st = R.stufe, S = sz.stimmung;
    var B = R.b, H = R.h, hb = Math.max(8, B >> 1), hh = Math.max(8, H >> 1);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE); gl.depthMask(false);
    var lin = [kam.proj[10], kam.proj[14]];
    var p;

    /* 1. Umgebungsverdeckung */
    var aoT = null;
    if (st.verdeckung > 0 && (p = prog("ssao"))) {
      var f = st.verdeckung >= 1 ? 2 : 4;
      var ab = Math.max(8, Math.round(B / f)), ah = Math.max(8, Math.round(H / f));
      var a1 = ziel("ao1", ab, ah, "rgba8"), a2 = ziel("ao2", ab, ah, "rgba8");
      gl.useProgram(p.p);
      tex(p, "uTiefe", 0, z.tiefe); tex(p, "uNormal", 1, z.normal);
      p.m4("uProj", kam.proj); p.m4("uInvProj", kam.invProj);
      p.f1("uRadius", (sz.ao && sz.ao.radius) || 0.5); p.f1("uStaerke", ((sz.ao && sz.ao.staerke) || 1.2));
      p.f1("uRausch", R.bildNr % 64); p.i1("uN", st.verdeckung >= 2 ? 16 : (st.verdeckung >= 1 ? 12 : 8));
      lauf(p, a1);
      var bl = prog("bilateral");
      if (bl) {
        gl.useProgram(bl.p); tex(bl, "uTiefe", 1, z.tiefe); bl.f2("uLin", lin[0], lin[1]);
        tex(bl, "uQ", 0, a1.t); bl.f2("uRicht", 1 / ab, 0); lauf(bl, a2);
        tex(bl, "uQ", 0, a2.t); bl.f2("uRicht", 0, 1 / ah); lauf(bl, a1);
      }
      aoT = a1.t;
      P.aoTextur = aoT;
    }

    /* 2. Lichtstrahlen im Staub */
    var stT = null;
    var schatten = R.schattenTextur();
    if (st.strahlen > 0 && schatten && sz.sonne && S.nebelStrahlen > 0 && (p = prog("strahlen"))) {
      var s1 = ziel("st1", hb, hh, "rgba16f"), s2 = ziel("st2", hb, hh, "rgba16f");
      gl.useProgram(p.p);
      tex(p, "uTiefe", 0, z.tiefe);
      G.tex(1, schatten); gl.bindSampler(1, R.samplerVergleich()); p.i1("uSchatten", 1);
      p.m4("uInvVP", kam.invVp); p.m4("uSchattenMat", sz.schattenMat);
      p.f3("uKamPos", kam.pos); p.f3("uSonneR", S.sonneR); p.f3("uSonneF", S.sonneF);
      p.f4("uNebel", [S.nebelDichte, S.nebelReichweite, S.nebelStreuung, S.nebelStrahlen]);
      p.i1("uSchritte", st.strahlen); p.f1("uRausch", R.bildNr % 64);
      lauf(p, s1);
      gl.bindSampler(1, null);
      var bl2 = prog("bilateral");
      if (bl2) {
        gl.useProgram(bl2.p); tex(bl2, "uTiefe", 1, z.tiefe); bl2.f2("uLin", lin[0], lin[1]);
        tex(bl2, "uQ", 0, s1.t); bl2.f2("uRicht", 1 / hb, 0); lauf(bl2, s2);
        tex(bl2, "uQ", 0, s2.t); bl2.f2("uRicht", 0, 1 / hh); lauf(bl2, s1);
      }
      stT = s1.t;
    }

    /* 3. Zusammensetzen + Luftperspektive */
    var sz2 = ziel("szene2", B, H, "rgba16f");
    p = prog("zusammen");
    gl.useProgram(p.p);
    tex(p, "uSzene", 0, z.farbe); tex(p, "uAO", 1, aoT || MOTOR.texturen.weiss); tex(p, "uStrahlen", 2, stT || MOTOR.texturen.schwarz); tex(p, "uTiefe", 3, z.tiefe);
    p.f1("uAOan", aoT ? 1 : 0); p.f1("uStrahlenAn", stT ? 1 : 0); p.f2("uLin", lin[0], lin[1]);
    var nf = S.nebelFarbe, nu = S.umgebung * 0.6;
    p.f4("uNebel", [nf[0] * nu, nf[1] * nu, nf[2] * nu, S.nebelDichte * 0.5 * S.nebelDunst]);
    lauf(p, sz2);
    var aktuell = sz2;

    /* 4. Tiefenschärfe */
    if (st.tiefe > 0 && P.einstellungen.tiefe && kam.blende && (p = prog("coc"))) {
      var d1 = ziel("dof1", hb, hh, "rgba16f"), d2 = ziel("dof2", hb, hh, "rgba16f");
      var mm = kam.mm, A = mm / kam.blende, massstab = DATA.kameras.modellMassstab || 10;
      var S1 = Math.max(kam.fokus * 1000 / massstab, mm * 1.05);
      var pxMm = (hh / 24);
      var maxR = st.tiefe >= 2 ? 22 : (st.tiefe >= 1 ? 16 : 9);
      var dofU = [S1, mm, A, 1000 / massstab];
      gl.useProgram(p.p);
      tex(p, "uSzene", 0, aktuell.t); tex(p, "uTiefe", 1, z.tiefe);
      p.f2("uLin", lin[0], lin[1]); p.f4("uDof", dofU); p.f1("uMaxR", maxR); p.f2("uTexel", 1 / B, 1 / H); p.f1("uPxMm", pxMm);
      lauf(p, d1);
      var dp = prog("dof");
      gl.useProgram(dp.p);
      tex(dp, "uQ", 0, d1.t); dp.f2("uTexel", 1 / hb, 1 / hh); dp.f1("uMaxR", maxR);
      dp.f1("uSchritt", st.tiefe >= 2 ? 1.1 : (st.tiefe >= 1 ? 1.8 : 3.0)); dp.f1("uHell", st.tiefe >= 2 ? 1.5 : 0.6);
      lauf(dp, d2);
      var mp = prog("dofmisch"), sz3 = ziel("szene3", B, H, "rgba16f");
      gl.useProgram(mp.p);
      tex(mp, "uSzene", 0, aktuell.t); tex(mp, "uUnscharf", 1, d2.t); tex(mp, "uTiefe", 2, z.tiefe);
      mp.f2("uLin", lin[0], lin[1]); mp.f4("uDof", dofU); mp.f1("uPxMm", pxMm);
      lauf(mp, sz3);
      aktuell = sz3;
    }

    /* 5. Bloom */
    var n = st.bloomStufen || 4, ketten = [], bb = B, bh = H;
    var pr = prog("runter"), ph = prog("hoch");
    if (pr && ph && S.bloom > 0) {
      var q = aktuell;
      gl.useProgram(pr.p);
      for (var i = 0; i < n; i++) {
        bb = Math.max(4, bb >> 1); bh = Math.max(4, bh >> 1);
        var zz = ziel("bloom" + i, bb, bh, "rgba16f");
        tex(pr, "uQ", 0, q.t); pr.f2("uTexel", 1 / q.b, 1 / q.h); pr.f1("uErste", i === 0 ? 1 : 0);
        lauf(pr, zz); ketten.push(zz); q = zz;
      }
      gl.useProgram(ph.p);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      for (i = n - 1; i > 0; i--) {
        tex(ph, "uQ", 0, ketten[i].t); ph.f2("uTexel", 1 / ketten[i].b, 1 / ketten[i].h); ph.f1("uRadius", 1.0);
        lauf(ph, ketten[i - 1]);
      }
      gl.disable(gl.BLEND);
    }

    /* 6. Tonwertkurve, Farbtabelle, Vignette */
    var ldr = ziel("ldr", B, H, "rgba8");
    p = prog("ton");
    gl.useProgram(p.p);
    tex(p, "uSzene", 0, aktuell.t); tex(p, "uBloom", 1, ketten.length ? ketten[0].t : MOTOR.texturen.schwarz);
    G.tex(2, sz.lut || null, "3d"); p.i1("uLut", 2);
    p.f1("uLutAn", sz.lut ? 1 : 0);
    p.f1("uBelichtung", S.belichtung * P.einstellungen.helligkeit);
    p.f1("uBloomStaerke", ketten.length ? S.bloom * (st.bloomStufen < 4 ? 0.6 : 1) : 0);
    p.f1("uVignette", S.vignette);
    p.f2("uSeiten", B / Math.max(B, H) * 1.0, H / Math.max(B, H) * 1.0);
    lauf(p, ldr);
    G.tex(2, null, "3d");

    /* 7. Kantenglättung */
    var aus = ldr;
    if (st.kanten === "zeitlich" && (p = prog("taa"))) {
      var va = ziel("verlauf0", B, H, "rgba8"), vb = ziel("verlauf1", B, H, "rgba8");
      var vorher = P.taaIndex ? vb : va, neu = P.taaIndex ? va : vb;
      gl.useProgram(p.p);
      tex(p, "uAktuell", 0, ldr.t); tex(p, "uVerlauf", 1, vorher.t); tex(p, "uTiefe", 2, z.tiefe);
      p.m4("uInvVP", kam.invVp); p.m4("uVorherVP", kam.vorherVp);
      p.f2("uTexel", 1 / B, 1 / H);
      p.f1("uMisch", (kam.schnitt || P.verlaufLeer) ? 1 : (st.renderskala >= 1 && st.tiefe >= 2 ? 0.08 : 0.11));
      lauf(p, neu);
      P.taaIndex = 1 - P.taaIndex;
      P.verlaufLeer = false;
      aus = neu;
    } else if ((p = prog("fxaa"))) {
      var fx = ziel("fxaa", B, H, "rgba8");
      gl.useProgram(p.p); tex(p, "uQ", 0, ldr.t); p.f2("uTexel", 1 / B, 1 / H);
      lauf(p, fx); aus = fx;
    }
    letzteAusgabe = aus;

    /* 8. Ausgabe: Korn, Farbsaum, Schärfen, Überblendung */
    p = prog("ende");
    gl.useProgram(p.p);
    tex(p, "uQ", 0, aus.t);
    var alt = ziele.alt;
    tex(p, "uAlt", 1, alt ? alt.t : MOTOR.texturen.schwarz);
    if (P.alt > 0) { P.alt = Math.max(0, P.alt - dt / P.altDauer); }
    p.f1("uAlt_", alt ? M.glatt(0, 1, P.alt) : 0);
    p.f2("uTexel", 1 / B, 1 / H);
    p.f1("uKorn", st.korn && P.einstellungen.korn ? S.korn : 0);
    p.f1("uSaum", st.farbsaum ? 1 : 0);
    p.f1("uSchaerfe", st.kanten === "zeitlich" ? 0.18 : 0.0);
    p.f1("uZeit", zeit % 100);
    p.f1("uHelligkeit", 1); p.f1("uSchwarz", 0);
    lauf(p, null);

    /* Debug-Ansichten */
    if (R.debugAnsicht >= 2) {
      var d = prog("debug");
      if (d) {
        gl.useProgram(d.p);
        var t = R.debugAnsicht === 2 ? z.normal : (R.debugAnsicht === 3 ? z.tiefe : (R.debugAnsicht === 4 ? (aoT || MOTOR.texturen.weiss) : schatten));
        if (t) { tex(d, "uQ", 0, t); d.f1("uModus", R.debugAnsicht); d.f2("uLin", lin[0], lin[1]); lauf(d, null); }
      }
    }
    for (var e = 0; e < 4; e++) G.tex(e, null);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.enable(gl.CULL_FACE);
  };

  P.verlaufLoeschen = function () { P.verlaufLeer = true; };

  return P;
})();
