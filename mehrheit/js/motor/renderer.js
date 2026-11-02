/* =====================================================================
   js/motor/renderer.js – Szene zeichnen
   ---------------------------------------------------------------------
   Vorwärts-Rendering in einen HDR-Puffer (RGBA16F), physikalisch
   basiertes Licht, Schattenkarte der Hauptlichtquelle (weich je nach
   Abstand), bis zu acht Zusatzlichter, Umgebungslicht aus einer
   Würfeltextur, die beim Laden aus dem Raum selbst aufgenommen wird,
   Spiegel-Ebene für Böden und Tischplatten, Glas mit Brechung.
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.renderer = (function () {
  var R = { bildNr: 0, statistik: { aufrufe: 0, dreiecke: 0 }, stufe: null, debugAnsicht: 0, b: 1, h: 1 };
  var G, gl, M;
  var programme = {};
  var EINHEIT = { struktur: 0, farbTex: 1, umgebung: 2, schatten: 3, schattenRoh: 4, ebene: 5, fleck: 6, szene: 7, hoehe: 8 };
  var samplerVergleich = null, samplerRoh = null;
  var tmp = { m: null, vp: null };

  R.init = function (stufe) {
    G = MOTOR.gl; gl = G.gl; M = MOTOR.m;
    programme = {};
    R.stufe = stufe;
    R.ziele = null;
    R.schattenZiel = null;
    if (!G.webgl2) EINHEIT.hoehe = 3;
    if (G.webgl2) {
      samplerVergleich = gl.createSampler();
      gl.samplerParameteri(samplerVergleich, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.samplerParameteri(samplerVergleich, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.samplerParameteri(samplerVergleich, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
      gl.samplerParameteri(samplerVergleich, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
      gl.samplerParameteri(samplerVergleich, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.samplerParameteri(samplerVergleich, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      samplerRoh = gl.createSampler();
      gl.samplerParameteri(samplerRoh, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.samplerParameteri(samplerRoh, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.samplerParameteri(samplerRoh, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.samplerParameteri(samplerRoh, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    tmp.m = M.m4(); tmp.vp = M.m4();
  };

  R.setzeStufe = function (stufe) {
    R.stufe = stufe;
    programme = {};
    R.schattenFreigeben();
    R.zieleFreigeben();
  };

  /* ---------- Programm-Varianten ---------- */
  R.prog = function (art, f) {
    var d = [];
    var st = R.stufe;
    if (art === "tiefe") {
      if (f.skin4) d.push("SKIN4"); else if (f.skin) d.push("SKIN"); if (f.instanz) d.push("INSTANZ"); if (f.blatt) d.push("BLATT");
    } else if (art === "teilchen") {
      if (f.schatten) d.push("SCHATTEN");
    } else {
      if (f.skin4) d.push("SKIN4"); else if (f.skin) d.push("SKIN"); if (f.instanz) d.push("INSTANZ"); if (f.muster) d.push("MUSTER"); if (f.instFarbe) d.push("INSTFARBE");
      if (f.glas) d.push("GLAS"); if (f.brechung) d.push("BRECHUNG"); if (f.farbTex) d.push("FARBTEX");
      if (f.blatt) d.push("BLATT"); if (f.himmel) d.push("HIMMEL"); if (f.doppelseitig) d.push("DOPPELSEITIG");
      if (f.ebene) d.push("EBENE"); if (f.mrt) d.push("MRT"); if (f.direkt) d.push("DIREKT");
      if (f.schatten) { d.push("SCHATTEN"); d.push("SCHATTEN_WEICH " + (G.webgl2 ? st.schattenWeich : -1)); }
      if (R.debugAnsicht === 1) d.push("NUR_LICHT");
    }
    var schl = art + "|" + d.join(",");
    if (programme[schl] === undefined) {
      var S = MOTOR.shader;
      var fs = art === "tiefe" ? S.tiefe_fs : (art === "teilchen" ? S.teilchen_fs : S.szene_fs);
      var vs = art === "teilchen" ? S.teilchen_vs : S.szene_vs;
      programme[schl] = G.programm(vs, fs, d, art + " [" + d.join(" ") + "]");
      if (programme[schl]) programme[schl].flags = f;
    }
    return programme[schl];
  };

  /* ---------- Render-Ziele ---------- */
  R.zieleFreigeben = function () {
    var z = R.ziele; if (!z) return;
    [z.farbe, z.normal, z.tiefe, z.kopie, z.spiegelFarbe].forEach(function (t) { if (t) G.loescheTextur(t); });
    [z.haupt, z.kopieFbo, z.spiegel].forEach(function (f) { if (f) G.loescheFbo(f); });
    R.ziele = null;
  };

  R.groesse = function (b, h) {
    b = Math.max(16, Math.round(b)); h = Math.max(16, Math.round(h));
    if (R.ziele && R.b === b && R.h === h) return;
    R.zieleFreigeben();
    R.b = b; R.h = h;
    if (!G.hdr) { R.ziele = { direkt: true }; return; }
    var z = {};
    z.farbe = G.textur({ b: b, h: h, format: "rgba16f" });
    z.normal = G.textur({ b: b, h: h, format: "rgba8" });
    z.tiefe = G.textur({ b: b, h: h, format: "tiefe", filter: "nah" });
    z.haupt = G.fbo([z.farbe, z.normal], z.tiefe);
    z.kopie = G.textur({ b: b, h: h, format: "rgba16f", mip: true });
    z.kopieFbo = G.fbo([z.kopie]);
    var sb = Math.max(8, b >> 1), sh = Math.max(8, h >> 1);
    z.spiegelFarbe = G.textur({ b: sb, h: sh, format: "rgba16f", mip: true });
    z.spiegel = G.fbo([z.spiegelFarbe], G.tiefenpuffer(sb, sh));
    R.ziele = z;
    if (!z.haupt.ok) console.warn("HDR-Puffer unvollständig – Rückfall auf direkte Ausgabe.");
  };

  R.schattenFreigeben = function () {
    if (R.schattenZiel) { G.loescheTextur(R.schattenZiel.tex); G.loescheFbo(R.schattenZiel.fbo); R.schattenZiel = null; }
  };
  function schattenZiel(groesse) {
    if (R.schattenZiel && R.schattenZiel.groesse === groesse) return R.schattenZiel;
    R.schattenFreigeben();
    if (!G.webgl2 && !G.ext.tiefe) return null;
    var t = G.textur({ b: groesse, h: groesse, format: "tiefe", filter: G.webgl2 ? "linear" : "nah" });
    var f = G.fbo([], t);
    if (!f.ok) { console.warn("Schattenkarte nicht möglich."); return null; }
    R.schattenZiel = { tex: t, fbo: f, groesse: groesse };
    return R.schattenZiel;
  }

  /* ---------- Sichtbarkeit (Kegelstumpf) ---------- */
  function ebenenAus(vp) {
    var e = [], m = vp;
    var z = [[3, 0], [3, -0], [3, 1], [3, -1], [3, 2], [3, -2]];
    var roh = [
      [m[3] + m[0], m[7] + m[4], m[11] + m[8], m[15] + m[12]],
      [m[3] - m[0], m[7] - m[4], m[11] - m[8], m[15] - m[12]],
      [m[3] + m[1], m[7] + m[5], m[11] + m[9], m[15] + m[13]],
      [m[3] - m[1], m[7] - m[5], m[11] - m[9], m[15] - m[13]],
      [m[3] + m[2], m[7] + m[6], m[11] + m[10], m[15] + m[14]],
      [m[3] - m[2], m[7] - m[6], m[11] - m[10], m[15] - m[14]]
    ];
    for (var i = 0; i < 6; i++) { var p = roh[i], l = Math.hypot(p[0], p[1], p[2]) || 1; e.push([p[0] / l, p[1] / l, p[2] / l, p[3] / l]); }
    return e;
  }
  function kugelWelt(o) {
    if (o.kugelWelt && (o.statisch || o.festeKugel)) return o.kugelWelt;
    var k = o.netz.kugel, m = o.matrix;
    var c = M.punktMal(m, k.m);
    var s = Math.max(Math.hypot(m[0], m[1], m[2]), Math.hypot(m[4], m[5], m[6]), Math.hypot(m[8], m[9], m[10]));
    o.kugelWelt = { m: c, r: k.r * s * (o.kugelFaktor || 1) };
    return o.kugelWelt;
  }
  function sichtbar(o, ebenen) {
    if (o.immerZeichnen) return true;
    var k = kugelWelt(o);
    for (var i = 0; i < 6; i++) { var e = ebenen[i]; if (e[0] * k.m[0] + e[1] * k.m[1] + e[2] * k.m[2] + e[3] < -k.r) return false; }
    return true;
  }

  /* ---------- Flags eines Objekts ---------- */
  function flags(o, pass, sz) {
    var mat = o.mat, st = R.stufe;
    var f = {
      skin: !!o.knochen && !o.skin4, skin4: !!o.skin4, instanz: !!o.netz.maxInstanzen, muster: !!o.muster, instFarbe: !!o.instFarbe,
      glas: !!mat.glas, farbTex: !!o.farbTex, blatt: !!o.hoehe, himmel: !!mat.himmel,
      doppelseitig: !!mat.doppelseitig, direkt: !G.hdr
    };
    var schatten = !!(R.schattenZiel && sz.sonne && st.schatten && !o.keinSchattenEmpfang);
    f.schatten = schatten;
    if (pass === "haupt") {
      f.mrt = G.hdr;
      f.brechung = !!(mat.glas && st.brechung && G.hdr && !o.keineBrechung);
      f.ebene = !!(mat.spiegelt && st.spiegel > 0 && sz.spiegelEbene !== null && sz.spiegelEbene !== undefined && G.hdr);
    }
    return f;
  }

  /* ---------- Uniforms pro Bild ---------- */
  function bildUniforms(P, sz, kam, pass, ziel) {
    var st = sz.stimmung;
    P.m4("uVP", kam.vp);
    P.m4("uSicht", kam.sicht);
    P.f3("uKamPos", kam.augePos || kam.pos);
    P.f3("uSonneR", st.sonneR);
    P.f3("uSonneF", sz.sonne ? st.sonneF : [0, 0, 0]);
    P.f4("uSonneKegel", st.kegel || [0, 0, 0, 0]);
    P.f2("uRausch", (R.bildNr % 64) * 0.618, (R.bildNr % 64) * 0.382);
    P.f4("uClip", pass === "spiegel" ? [0, 1, 0, -sz.spiegelEbene + 0.002] : [0, 0, 0, 1]);
    // Umgebung
    G.tex(EINHEIT.umgebung, sz.umgebung || sz.himmelWuerfel, "wuerfel");
    P.i1("uUmgebung", EINHEIT.umgebung);
    var uw = sz.umgebung || sz.himmelWuerfel;
    P.f4("uUmgebungP", [uw ? uw.lods : 4, st.umgebung * (pass === "sonde" ? 1.0 : 1.0), 0, 0]);
    // Zusatzlichter
    var n = Math.min(8, sz.lichter.length);
    var lp = new Float32Array(32), lf = new Float32Array(32), lr = new Float32Array(32);
    for (var i = 0; i < n; i++) {
      var L = sz.lichter[i];
      lp.set([L.pos[0], L.pos[1], L.pos[2], L.reichweite || 5], i * 4);
      var s = L.aktuell !== undefined ? L.aktuell : L.staerke;
      lf.set([L.farbe[0] * s, L.farbe[1] * s, L.farbe[2] * s, L.kegelInnen ? Math.cos(L.kegelInnen * M.GRAD) : 1], i * 4);
      if (L.richtung) lr.set([L.richtung[0], L.richtung[1], L.richtung[2], Math.cos((L.kegelAussen || 60) * M.GRAD)], i * 4);
      else lr.set([0, -1, 0, -2], i * 4);
    }
    P.f4v("uLichtPos", lp); P.f4v("uLichtFarbe", lf); P.f4v("uLichtRicht", lr); P.f1("uLichtN", n);
    // Schatten
    if (P.flags.schatten && R.schattenZiel) {
      P.m4("uSchattenMat", sz.schattenMat);
      P.f4("uSchattenP", sz.schattenP);
      P.f2("uSchattenTexel", 1 / R.schattenZiel.groesse, 1 / R.schattenZiel.groesse);
      if (G.webgl2) {
        G.tex(EINHEIT.schatten, R.schattenZiel.tex); gl.bindSampler(EINHEIT.schatten, samplerVergleich);
        P.i1("uSchatten", EINHEIT.schatten);
      }
      G.tex(EINHEIT.schattenRoh, R.schattenZiel.tex); if (G.webgl2) gl.bindSampler(EINHEIT.schattenRoh, samplerRoh);
      P.i1("uSchattenRoh", EINHEIT.schattenRoh);
    }
    // Lichtfleck
    var fl = sz.fleck;
    if (fl && fl.tex && pass !== "tiefe") {
      G.tex(EINHEIT.fleck, fl.tex); P.i1("uFleck", EINHEIT.fleck);
      P.f4("uFleckP", [fl.mitte[0], fl.mitte[1], 1 / fl.groesse[0], 1 / fl.groesse[1]]);
      P.f4("uFleckF", [fl.staerke, fl.y, fl.abfall, 0]);
    } else { P.f4("uFleckF", [0, 0, 0, 0]); G.tex(EINHEIT.fleck, MOTOR.texturen.schwarz); P.i1("uFleck", EINHEIT.fleck); }
    // Spiegel-Ebene
    if (P.flags.ebene && R.ziele && R.ziele.spiegelFarbe) {
      G.tex(EINHEIT.ebene, R.ziele.spiegelFarbe); P.i1("uEbeneTex", EINHEIT.ebene);
      P.f4("uEbeneP", [sz.spiegelEbene, 0, 1 / R.b, 1 / R.h]);
    }
    if (P.flags.brechung && R.ziele) {
      G.tex(EINHEIT.szene, R.ziele.kopie); P.i1("uSzene", EINHEIT.szene);
      P.f2("uBildTexel", 1 / R.b, 1 / R.h);
    }
    if (P.flags.himmel) {
      P.f3("uHimmelOben", st.himmelOben); P.f3("uHimmelMitte", st.himmelHorizont); P.f3("uHimmelUnten", st.himmelUnten);
      P.f1("uSonnenGlanz", st.sonnenglanz);
    }
    if (P.flags.direkt) {
      P.f1("uBelichtung", st.belichtung * (MOTOR.einstellungHelligkeit || 1));
      P.f4("uNebel", [st.nebelFarbe[0] * st.umgebung * 0.6, st.nebelFarbe[1] * st.umgebung * 0.6, st.nebelFarbe[2] * st.umgebung * 0.6, st.nebelDichte * 0.5]);
    }
    P.i1("uStruktur", EINHEIT.struktur);
    P.i1("uFarbTex", EINHEIT.farbTex);
    P.i1("uHoehe", EINHEIT.hoehe);
  }

  var letzteStruktur = null;
  function objektUniforms(P, o, pass) {
    P.m4("uModell", o.matrix);
    if (o.knochen) { var ort = P.u("uKnochen"); if (ort) gl.uniform4fv(ort, o.knochen); }
    if (o.hoehe) {
      G.tex(EINHEIT.hoehe, o.hoehe.tex);
      P.f1("uHoeheStaerke", o.hoehe.staerke); P.f2("uHoeheTexel", 1 / o.hoehe.tex.b, 1 / o.hoehe.tex.h);
    }
    if (pass === "tiefe") return;
    var m = o.mat;
    P.f3("uFarbe", m.farbe);
    P.f4("uMat", [m.rauheit, m.metall, m.durchscheinen, m.klarlack]);
    P.f4("uMat2", [m.strukturSkala, R.debugAnsicht === 1 ? 0 : m.strukturStaerke, 0, m.samt]);
    var em = o.emission || m.emission;
    P.f3("uEmission", em);
    P.f2("uGlas", m.alpha, m.brechung);
    var t = MOTOR.texturen.struktur[m.struktur] || MOTOR.texturen.struktur.glatt;
    if (t !== letzteStruktur) { G.tex(EINHEIT.struktur, t); letzteStruktur = t; }
    if (o.farbTex) {
      G.tex(EINHEIT.farbTex, o.farbTex);
      P.f4("uNass", o.nass || [0, 0, 0, 0]); P.f1("uNassWert", o.nassWert || 0);
    }
  }

  function zeichneNetz(o) {
    var n = o.netz;
    G.bindeVao(n.vao);
    if (n.maxInstanzen) {
      if (n.instanzen > 0) { G.zeichneInstanzen(gl.TRIANGLES, n.anzahl, n.typ, n.instanzen); R.statistik.dreiecke += n.dreiecke * n.instanzen; R.statistik.aufrufe++; }
    } else {
      gl.drawElements(gl.TRIANGLES, n.anzahl, n.typ, 0);
      R.statistik.dreiecke += n.dreiecke; R.statistik.aufrufe++;
    }
  }

  /* Liste zeichnen (pass: haupt, spiegel, sonde) */
  function zeichneListe(liste, sz, kam, pass) {
    var aktuell = null;
    letzteStruktur = null;
    for (var i = 0; i < liste.length; i++) {
      var o = liste[i];
      var P = o._prog;
      if (!P) continue;
      if (P !== aktuell) { gl.useProgram(P.p); bildUniforms(P, sz, kam, pass); aktuell = P; letzteStruktur = null; }
      if (o.mat.doppelseitig) gl.disable(gl.CULL_FACE); else gl.enable(gl.CULL_FACE);
      objektUniforms(P, o, pass);
      zeichneNetz(o);
    }
    G.bindeVao(null);
  }

  /* Sortieren und Programme zuordnen */
  function vorbereiten(sz, kam, pass, ebenen) {
    var undurch = [], glas = [];
    for (var i = 0; i < sz.objekte.length; i++) {
      var o = sz.objekte[i];
      if (o.sichtbar === false) continue;
      if (pass === "spiegel" && o.nichtImSpiegel) continue;
      if (pass === "sonde" && o.nichtInSonde) continue;
      if (ebenen && !sichtbar(o, ebenen)) continue;
      var f = flags(o, pass, sz);
      o._prog = R.prog("szene", f);
      if (o.mat.glas) { var k = kugelWelt(o); o._dist = M.abstand(k.m, kam.pos); glas.push(o); }
      else undurch.push(o);
    }
    undurch.sort(function (a, b) { return (a._prog && b._prog ? (a._prog.name < b._prog.name ? -1 : (a._prog.name > b._prog.name ? 1 : 0)) : 0) || ((a.mat.struktur || "") < (b.mat.struktur || "") ? -1 : 1); });
    glas.sort(function (a, b) { return b._dist - a._dist; });
    return { undurch: undurch, glas: glas };
  }

  /* ---------- Schattenkarte ---------- */
  R.schattenMatrix = function (sz) {
    var st = sz.stimmung, box = sz.schattenBox;
    var d = st.sonneR;
    var c = box.mitte, g = box.groesse;
    var oben = Math.abs(d[1]) > 0.95 ? [0, 0, 1] : [0, 1, 0];
    var auge = M.plus(c, M.mal(d, 100));
    var sicht = M.blick(M.m4(), auge, c, oben);
    var mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    for (var i = 0; i < 8; i++) {
      var p = [c[0] + (i & 1 ? 0.5 : -0.5) * g[0], c[1] + (i & 2 ? 0.5 : -0.5) * g[1], c[2] + (i & 4 ? 0.5 : -0.5) * g[2]];
      var q = M.punktMal(sicht, p);
      for (var k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], q[k]); mx[k] = Math.max(mx[k], q[k]); }
    }
    var proj = M.ortho(M.m4(), mn[0], mx[0], mn[1], mx[1], -mx[2] - 0.5, -mn[2] + 0.5);
    sz.schattenMat = M.mul(M.m4(), proj, sicht);
    var breite = Math.max(mx[0] - mn[0], mx[1] - mn[1]);
    var tiefe = (mx[2] - mn[2]) + 1;
    var tanW = Math.tan((st.winkel || 0.5) * M.GRAD);
    var texelWelt = breite / (R.stufe.schatten || 1024);
    sz.schattenP = [0, texelWelt * 1.6, Math.min(0.025, 2.5 * tanW / breite) + 2 / (R.stufe.schatten || 1024), tiefe * tanW * 2 / breite];
    sz.schattenBreite = breite;
  };

  R.schattenPass = function (sz) {
    var st = R.stufe;
    if (!st.schatten || !sz.sonne) return;
    var z = schattenZiel(st.schatten);
    if (!z) return;
    if (!sz.schattenMat) R.schattenMatrix(sz);
    G.binde(z.fbo);
    gl.colorMask(false, false, false, false);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.BLEND);
    gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(1.6, 2.0);
    if (G.webgl2) { gl.bindSampler(EINHEIT.schatten, null); gl.bindSampler(EINHEIT.schattenRoh, null); }
    G.tex(EINHEIT.schatten, null); G.tex(EINHEIT.schattenRoh, null);
    var aktuell = null;
    for (var i = 0; i < sz.objekte.length; i++) {
      var o = sz.objekte[i];
      if (o.sichtbar === false || o.schatten === false || o.mat.glas || o.mat.himmel) continue;
      var P = R.prog("tiefe", { skin: !!o.knochen && !o.skin4, skin4: !!o.skin4, instanz: !!o.netz.maxInstanzen, blatt: !!o.hoehe });
      if (!P) continue;
      if (P !== aktuell) { gl.useProgram(P.p); P.m4("uVP", sz.schattenMat); P.i1("uHoehe", EINHEIT.hoehe); aktuell = P; }
      if (o.mat.doppelseitig) gl.disable(gl.CULL_FACE); else gl.enable(gl.CULL_FACE);
      objektUniforms(P, o, "tiefe");
      zeichneNetz(o);
    }
    G.bindeVao(null);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.colorMask(true, true, true, true);
    sz.schattenNeu = false;
  };

  /* ---------- Szene in ein Ziel zeichnen ---------- */
  function szeneZeichnen(sz, kam, pass, mitGlas) {
    var ebenen = ebenenAus(kam.vp);
    var l = vorbereiten(sz, kam, pass, ebenen);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true);
    gl.disable(gl.BLEND);
    zeichneListe(l.undurch, sz, kam, pass);
    if (mitGlas && l.glas.length) {
      gl.depthMask(false);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
      zeichneListe(l.glas, sz, kam, pass);
      gl.disable(gl.BLEND); gl.depthMask(true);
    }
    return l;
  }

  /* ---------- Umgebungs-Würfel ---------- */
  var WUERFEL = [
    { z: [1, 0, 0], o: [0, -1, 0] }, { z: [-1, 0, 0], o: [0, -1, 0] },
    { z: [0, 1, 0], o: [0, 0, 1] }, { z: [0, -1, 0], o: [0, 0, -1] },
    { z: [0, 0, 1], o: [0, -1, 0] }, { z: [0, 0, -1], o: [0, -1, 0] }
  ];

  R.himmelWuerfel = function (sz) {
    var st = sz.stimmung, gr = 32;
    var cube = G.wuerfel(gr, G.hdr);
    var prog = G.programm(MOTOR.shader.voll_vs, MOTOR.shader.himmel_fs, [], "Himmel");
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.viewport(0, 0, gr, gr);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
    gl.useProgram(prog.p);
    for (var i = 0; i < 6; i++) {
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, cube.tex, 0);
      var s = M.blick(M.m4(), [0, 0, 0], WUERFEL[i].z, WUERFEL[i].o);
      var inv = M.invert(M.m4(), s);
      prog.m4("uRichtung", inv);
      var hs = st.himmelStaerke || 1;
      prog.f3("uOben", M.mal(st.himmelOben, hs)); prog.f3("uMitte", M.mal(st.himmelHorizont, hs)); prog.f3("uUnten", M.mal(st.himmelUnten, hs));
      prog.f3("uSonneR", st.sonneR); prog.f3("uSonneF", st.sonneF);
      G.vollbild();
    }
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cube.tex);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
    gl.deleteProgram(prog.p);
    return cube;
  };

  /* Raum von innen aufnehmen → Umgebungslicht und Spiegelungen */
  R.sondeAufnehmen = function (sz) {
    var gr = R.stufe.umgebungGroesse || 128;
    if (!sz.himmelWuerfel) sz.himmelWuerfel = R.himmelWuerfel(sz);
    if (sz.umgebung && sz.umgebung !== sz.himmelWuerfel) { gl.deleteTexture(sz.umgebung.tex); }
    sz.umgebung = null;
    if (sz.sonne && R.stufe.schatten) { R.schattenMatrix(sz); R.schattenPass(sz); }
    var cube = G.wuerfel(gr, G.hdr);
    var tiefe = G.tiefenpuffer(gr, gr);
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, tiefe.rb);
    if (G.webgl2) gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    var kam = { vp: M.m4(), sicht: M.m4(), pos: sz.sondePos };
    var proj = M.perspektive(M.m4(), Math.PI / 2, 1, 0.05, 200);
    var durchgaenge = (R.stufe.umgebungGroesse || 128) >= 128 ? 2 : 1;
    var vorher = null;
    for (var d = 0; d < durchgaenge; d++) {
      var ziel = d === durchgaenge - 1 ? cube : G.wuerfel(Math.max(32, gr >> 1), G.hdr);
      var zg = ziel.groesse;
      if (d > 0) { gl.bindRenderbuffer(gl.RENDERBUFFER, tiefe.rb); gl.renderbufferStorage(gl.RENDERBUFFER, G.webgl2 ? gl.DEPTH_COMPONENT24 : gl.DEPTH_COMPONENT16, zg, zg); }
      else { gl.bindRenderbuffer(gl.RENDERBUFFER, tiefe.rb); gl.renderbufferStorage(gl.RENDERBUFFER, G.webgl2 ? gl.DEPTH_COMPONENT24 : gl.DEPTH_COMPONENT16, zg, zg); }
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      for (var i = 0; i < 6; i++) {
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, ziel.tex, 0);
        gl.viewport(0, 0, zg, zg);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        M.blick(kam.sicht, sz.sondePos, M.plus(sz.sondePos, WUERFEL[i].z), WUERFEL[i].o);
        M.mul(kam.vp, proj, kam.sicht);
        szeneZeichnen(sz, kam, "sonde", true);
      }
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, ziel.tex);
      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      if (vorher) gl.deleteTexture(vorher.tex);
      // der nächste Durchgang beleuchtet mit dieser Aufnahme (zweiter Lichtweg)
      sz.umgebung = ziel; vorher = ziel === cube ? null : ziel;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fb);
    gl.deleteRenderbuffer(tiefe.rb);
    sz.umgebung = cube;
  };

  /* ---------- Teilchen ---------- */
  function teilchenZeichnen(sz, kam) {
    if (!sz.teilchen || !sz.teilchen.length) return;
    var schatten = !!(R.schattenZiel && G.webgl2 && sz.sonne);
    var P = R.prog("teilchen", { schatten: schatten });
    if (!P) return;
    gl.useProgram(P.p);
    P.m4("uVP", kam.vp);
    var s = kam.sicht;
    P.f3("uRechts", [s[0], s[4], s[8]]); P.f3("uOben", [s[1], s[5], s[9]]);
    P.f3("uSonneF", sz.stimmung.sonneF);
    var u = sz.stimmung.himmelHorizont, us = sz.stimmung.umgebung;
    P.f3("uUmgebungF", [u[0] * us + 0.15, u[1] * us + 0.15, u[2] * us + 0.15]);
    if (schatten) {
      P.m4("uSchattenMat", sz.schattenMat);
      G.tex(EINHEIT.schatten, R.schattenZiel.tex); gl.bindSampler(EINHEIT.schatten, samplerVergleich);
      P.i1("uSchatten", EINHEIT.schatten);
    }
    gl.depthMask(false); gl.enable(gl.BLEND); gl.disable(gl.CULL_FACE);
    for (var i = 0; i < sz.teilchen.length; i++) {
      var t = sz.teilchen[i];
      if (!t.netz || !t.netz.instanzen) continue;
      P.f1("uArt", t.art === "staub" ? 0 : 1);
      if (t.art === "staub") gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ZERO, gl.ONE);
      else gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);
      G.bindeVao(t.netz.vao);
      G.zeichneInstanzen(gl.TRIANGLES, t.netz.anzahl, t.netz.typ, t.netz.instanzen);
      R.statistik.aufrufe++;
    }
    G.bindeVao(null);
    gl.disable(gl.BLEND); gl.depthMask(true); gl.enable(gl.CULL_FACE);
  }

  /* Alle Shader-Varianten einer Szene gleich beim Laden übersetzen (hinter der Abblende),
     damit es später kein Ruckeln gibt, wenn ein Objekt zum ersten Mal ins Bild kommt. */
  R.vorwaermen = function (sz) {
    for (var i = 0; i < sz.objekte.length; i++) {
      var o = sz.objekte[i];
      if (!o.netz || !o.mat) continue;
      R.prog("szene", flags(o, "haupt", sz));
      if (R.stufe.schatten && o.schatten !== false) R.prog("tiefe", { skin: !!o.knochen && !o.skin4, skin4: !!o.skin4, instanz: !!o.netz.maxInstanzen, blatt: !!o.hoehe });
    }
  };

  /* ---------- Ein Bild ---------- */
  R.zeichne = function (sz, kam) {
    R.bildNr++;
    R.statistik.aufrufe = 0; R.statistik.dreiecke = 0;
    var st = R.stufe;
    if (!sz._vorgewaermt) { sz._vorgewaermt = true; R.vorwaermen(sz); }
    if (!sz.umgebung) R.sondeAufnehmen(sz);
    // 1. Schattenkarte (nur wenn sich etwas bewegt hat)
    if (sz.sonne && st.schatten) {
      if (!sz.schattenMat) R.schattenMatrix(sz);
      if (sz.schattenNeu || !R.schattenZiel) R.schattenPass(sz);
    }
    var z = R.ziele;
    // 2. Spiegel-Ebene
    if (G.hdr && z && z.spiegel && st.spiegel > 0 && sz.spiegelEbene !== null && sz.spiegelEbene !== undefined) {
      var h = sz.spiegelEbene;
      var spiegel = M.m4(); spiegel[5] = -1; spiegel[13] = 2 * h;
      var sk = { pos: [kam.pos[0], 2 * h - kam.pos[1], kam.pos[2]], sicht: M.mul(M.m4(), kam.sicht, spiegel), vp: M.m4() };
      M.mul(sk.vp, kam.projOhneJitter, sk.sicht);
      G.binde(z.spiegel);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.frontFace(gl.CW);
      szeneZeichnen(sz, sk, "spiegel", false);
      gl.frontFace(gl.CCW);
      gl.bindTexture(gl.TEXTURE_2D, z.spiegelFarbe.tex);
      gl.generateMipmap(gl.TEXTURE_2D);
    }
    // 3. Hauptdurchgang
    if (G.hdr && z && z.haupt) {
      G.binde(z.haupt);
      gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
      gl.clearBufferfv(gl.COLOR, 0, [0, 0, 0, 0]);
      gl.clearBufferfv(gl.COLOR, 1, [0.5, 0.5, 1, 1]);
      gl.clear(gl.DEPTH_BUFFER_BIT);
    } else {
      G.binde(null);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    var ebenen = ebenenAus(kam.vp);
    var l = vorbereiten(sz, kam, "haupt", ebenen);
    gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(true); gl.disable(gl.BLEND);
    if (R.drahtgitter && G.ext.polygon) G.ext.polygon.polygonModeWEBGL(gl.FRONT_AND_BACK, G.ext.polygon.LINE_WEBGL);
    zeichneListe(l.undurch, sz, kam, "haupt");
    if (G.hdr && z && z.haupt) gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.NONE]);
    if (l.glas.length) {
      // Kopie der Szene für Brechung
      if (G.hdr && z && st.brechung) {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, z.haupt.fb);
        gl.readBuffer(gl.COLOR_ATTACHMENT0);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, z.kopieFbo.fb);
        gl.blitFramebuffer(0, 0, R.b, R.h, 0, 0, R.b, R.h, gl.COLOR_BUFFER_BIT, gl.NEAREST);
        gl.bindFramebuffer(gl.FRAMEBUFFER, z.haupt.fb);
        gl.bindTexture(gl.TEXTURE_2D, z.kopie.tex);
        gl.generateMipmap(gl.TEXTURE_2D);
      }
      gl.depthMask(false);
      for (var i = 0; i < l.glas.length; i++) {
        var o = l.glas[i];
        if (o._prog && o._prog.flags.brechung) { gl.disable(gl.BLEND); gl.colorMask(true, true, true, false); }
        else { gl.enable(gl.BLEND); gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE); gl.colorMask(true, true, true, true); }
        zeichneListe([o], sz, kam, "haupt");
      }
      gl.colorMask(true, true, true, true);
      gl.disable(gl.BLEND); gl.depthMask(true);
    }
    teilchenZeichnen(sz, kam);
    if (R.drahtgitter && G.ext.polygon) G.ext.polygon.polygonModeWEBGL(gl.FRONT_AND_BACK, G.ext.polygon.FILL_WEBGL);
    if (G.webgl2) { gl.bindSampler(EINHEIT.schatten, null); gl.bindSampler(EINHEIT.schattenRoh, null); }
  };

  R.schattenTextur = function () { return R.schattenZiel ? R.schattenZiel.tex : null; };
  R.samplerVergleich = function () { return samplerVergleich; };
  R.EINHEIT = EINHEIT;

  return R;
})();
