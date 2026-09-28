/* =====================================================================
   Die Lücke – Engine: Renderer
   ---------------------------------------------------------------------
   * Toon-Shader (3 weiche Lichtstufen, warme Sonne, kühle Schatten,
     Dunst, Wind, Wasserwellen, Gesichter, Weltkrümmung)
   * Licht: bis zu 8 Punktlichter (Laternen, Lampen, Fensterlicht) als
     gemalte Lichtpfützen mit Aquarell-Rand, leuchtende Teile (Muster 6),
     Fenster (Muster 7, Glanzstrich / abends warmes Licht), warmes
     Rücklicht vom Boden, ziehende Wolkenschatten, Lichthöfe um Lampen
   * Starre Knochen: eine ganze Figur = ein Draw-Call
   * Blob-Schatten + Partikel in EINEM gemeinsamen Draw-Call
   * Himmelsverlauf, Debug-Linien
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.renderer = (function () {
  "use strict";
  var MM = ENG.math;
  var R = { stats: { drawCalls: 0, dreiecke: 0, lichter: 0 }, breite: 1, hoehe: 1, skala: 1, fx: true, licht: true, kruemmungAn: true, kruemmung: 0 };
  var gl, pHaupt, pKontur, pBlob, pHimmel, pLinie;
  var MAX_KNOCHEN = 12;
  var MAX_LICHTER = 8;
  var lichtPos = new Float32Array(4 * MAX_LICHTER), lichtFarbe = new Float32Array(4 * MAX_LICHTER), lichtN = 0;
  var einheitsKnochen = new Float32Array(16 * MAX_KNOCHEN);
  var knochenSindEinheit = false, konturKnochenEinheit = false;
  var kam = null, umg = null, zeit = 0;

  var FS_PREC = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n";

  // ---------------- Shader ----------------
  var VS_HAUPT = [
    "precision highp float;",
    "attribute vec3 aPos; attribute vec3 aNrm; attribute vec3 aCol; attribute vec2 aUv; attribute vec4 aExtra;",
    "uniform mat4 uViewProj; uniform mat4 uModel; uniform mat4 uBones[" + MAX_KNOCHEN + "];",
    "uniform vec3 uKruemmMitte; uniform float uKruemmung; uniform float uZeit; uniform float uFx;",
    "varying vec3 vNrm; varying vec3 vCol; varying vec2 vUv; varying vec3 vWelt;",
    "varying vec4 vSel; varying float vWasser; varying float vGesicht; varying float vLeuchten; varying float vFenster;",
    "void main() {",
    "  mat4 bm = uBones[int(aExtra.x + 0.5)];",
    "  vec4 w = uModel * (bm * vec4(aPos, 1.0));",
    "  if (aExtra.y > 0.0) {",
    "    float ph = uZeit * 1.6 + w.x * 0.37 + w.z * 0.23;",
    "    w.x += sin(ph) * 0.05 * aExtra.y * uFx;",
    "    w.z += cos(ph * 0.83) * 0.035 * aExtra.y * uFx;",
    "  }",
    "  float sel = aExtra.w;",
    "  vWasser = step(4.5, sel) * step(sel, 5.5);",
    "  vLeuchten = step(5.5, sel) * step(sel, 6.5);",
    "  vFenster = step(6.5, sel);",
    "  if (vWasser > 0.5) {",
    "    w.y += (sin(uZeit * 1.3 + w.x * 0.9) + cos(uZeit * 1.1 + w.z * 1.2)) * 0.03 * uFx;",
    "  }",
    "  vSel = clamp(1.0 - abs(vec4(1.0, 2.0, 3.0, 4.0) - vec4(sel)), 0.0, 1.0);",
    "  vNrm = (uModel * (bm * vec4(aNrm, 0.0))).xyz;",
    "  vCol = aCol; vUv = aUv; vGesicht = aExtra.z; vWelt = w.xyz;",
    "  vec2 d = w.xz - uKruemmMitte.xz;",
    "  w.y -= dot(d, d) * uKruemmung;",
    "  gl_Position = uViewProj * w;",
    "}"
  ].join("\n");

  var FS_HAUPT = FS_PREC + [
    "uniform sampler2D uDetail; uniform sampler2D uGesichtTex; uniform sampler2D uPapier;",
    "uniform vec4 uAugen; uniform vec4 uMund;",
    "uniform vec3 uSonnenRichtung; uniform vec3 uSonne; uniform vec3 uSchatten; uniform vec3 uTusche;",
    "uniform vec3 uDunst; uniform vec2 uDunstWeite; uniform vec3 uKamPos;",
    "uniform float uZeit; uniform vec3 uTon; uniform float uPixel; uniform float uSchraffur;",
    "uniform float uFx; uniform vec4 uRueck; uniform float uWolken; uniform float uLampen; uniform vec4 uFensterLicht;",
    "uniform vec4 uLichtPos[" + MAX_LICHTER + "]; uniform vec4 uLichtFarbe[" + MAX_LICHTER + "]; uniform int uLichtN;",
    "varying vec3 vNrm; varying vec3 vCol; varying vec2 vUv; varying vec3 vWelt;",
    "varying vec4 vSel; varying float vWasser; varying float vGesicht; varying float vLeuchten; varying float vFenster;",
    "void main() {",
    "  vec3 basis = vCol;",
    // Oberflächenmuster, dezent
    "  if (vSel.x + vSel.y + vSel.z + vSel.w > 0.0) {",
    "    float d = dot(texture2D(uDetail, vUv), vSel);",
    "    basis *= 0.9 + d * 0.2;",
    "  }",
    // Aquarell: große, unregelmäßige Farbflecken in der Welt
    "  float fleck = texture2D(uPapier, vWelt.xz * 0.045 + vec2(vWelt.y * 0.03, 0.0)).g;",
    "  basis *= 0.9 + fleck * 0.18;",
    // Wasser: gezeichnete Wellenlinien in Tusche
    "  float linie = 0.0;",
    "  if (vWasser > 0.5) {",
    "    float wl = vWelt.z * 1.1 + sin(vWelt.x * 0.9 + uZeit * 0.9) * 0.22 + sin(vWelt.x * 0.23 - uZeit * 0.4) * 0.6;",
    "    float f = abs(fract(wl) - 0.5);",
    "    float luecke = step(0.52, texture2D(uPapier, vec2(vWelt.x * 0.04 + uZeit * 0.008, floor(wl) * 0.137)).g);",
    "    linie = smoothstep(0.07, 0.025, f) * luecke * 0.5;",
    "  }",
    "  if (vGesicht > 0.5) {",
    "    vec4 r = vGesicht < 1.5 ? uAugen : uMund;",
    "    vec4 f = texture2D(uGesichtTex, r.xy + clamp(vUv, 0.0, 1.0) * r.zw);",
    "    if (f.a < 0.04) discard;",
    "    basis = mix(basis, f.rgb, f.a);",
    "  }",
    // Sonne: zwei klare Stufen
    "  vec3 N = normalize(vNrm);",
    "  float ndl = dot(N, uSonnenRichtung);",
    "  float licht = smoothstep(0.02, 0.1, ndl);",
    "  float kern = smoothstep(-0.2, -0.45, ndl);",
    // Wolkenschatten: große, weiche Flecken ziehen langsam über die Welt
    "  float sonnig = licht;",
    "  if (uWolken > 0.0) {",
    "    float wo = texture2D(uPapier, vWelt.xz * 0.017 + vec2(0.011, 0.004) * uZeit * uFx).b;",
    "    sonnig *= 1.0 - smoothstep(0.45, 0.62, wo) * uWolken;",
    "  }",
    // Rücklicht: was nach unten oder zur Seite zeigt, fängt warmes Licht vom Boden
    "  vec3 schattenTon = mix(uSchatten, uRueck.rgb, clamp(0.5 - N.y * 0.5, 0.0, 1.0) * uRueck.a);",
    "  vec3 col = mix(basis * schattenTon, basis * uSonne, sonnig);",
    // Punktlichter: gemalte Lichtpfützen in zwei Stufen mit unruhigem Aquarell-Rand
    "  vec3 lsum = vec3(0.0);",
    "  if (uLichtN > 0) {",
    "    float rauh = texture2D(uPapier, vWelt.xz * 0.19 + vec2(vWelt.y * 0.11, 0.0)).g - 0.5;",
    "    for (int i = 0; i < " + MAX_LICHTER + "; i++) {",
    "      if (i >= uLichtN) break;",
    "      vec3 L = uLichtPos[i].xyz - vWelt;",
    "      float d = length(L);",
    "      float a = clamp(1.0 - d / uLichtPos[i].w, 0.0, 1.0);",
    "      float nl = clamp(dot(N, L / max(d, 0.001)) * 0.6 + 0.4, 0.0, 1.0);",
    "      float w = a * a * nl * (1.0 + rauh * 0.9 + (fleck - 0.5) * 0.5);",
    "      float stufe = smoothstep(0.035, 0.08, w) * 0.55 + smoothstep(0.26, 0.33, w) * 0.45;",
    "      lsum += uLichtFarbe[i].rgb * stufe;",
    "    }",
    "    lsum *= 1.0 - sonnig * 0.55;",
    "    col = 1.0 - (1.0 - col) * (1.0 - min(basis * lsum, vec3(1.0)));",   // aufhellen, aber nie grell weiß
    // warme Lasur in der Lichtfarbe – so sieht man das Licht auch auf hellem Grund
    "    float lmax = max(lsum.r, max(lsum.g, lsum.b));",
    "    col *= mix(vec3(1.0), lsum / max(lmax, 0.001), clamp(lmax * 1.6, 0.0, 1.0) * 0.4);",
    "  }",
    "  float erhellt = clamp(max(lsum.r, max(lsum.g, lsum.b)) * 1.4, 0.0, 1.0);",
    // Schraffur im Schatten (diagonal), Kreuzschraffur im Kernschatten – Licht radiert sie weg
    "  vec2 fc = gl_FragCoord.xy / uPixel;",
    "  float s1 = smoothstep(0.16, 0.06, abs(fract((fc.x + fc.y) / 6.0) - 0.5));",
    "  float s2 = smoothstep(0.14, 0.05, abs(fract((fc.x - fc.y) / 6.0) - 0.5));",
    "  float schraffur = (s1 * (1.0 - licht) * 0.3 + s2 * kern * 0.26) * uSchraffur * (1.0 - erhellt * 0.85);",
    "  if (vGesicht > 0.5) schraffur *= 0.3;",
    // Pigment sammelt sich am Rand (Aquarell-Kante)
    "  vec3 V = normalize(uKamPos - vWelt);",
    "  float rand = pow(1.0 - max(dot(N, V), 0.0), 2.5);",
    "  col *= 1.0 - rand * 0.16;",
    // Fenster: Glanzstrich wie mit Deckweiß – abends warmes Licht von innen
    "  if (vFenster > 0.5) {",
    "    float gs = fract((vWelt.x + vWelt.y * 0.8 + vWelt.z * 0.35) * 1.25);",
    "    float glanz = smoothstep(0.09, 0.05, abs(gs - 0.5)) * 0.55 + smoothstep(0.03, 0.012, abs(gs - 0.68)) * 0.4;",
    "    col = mix(col, vec3(1.0), glanz * (1.0 - uFensterLicht.a) * 0.7);",
    "    col = mix(col, uFensterLicht.rgb * (0.92 + fleck * 0.16), uFensterLicht.a);",
    "    schraffur *= 1.0 - uFensterLicht.a;",
    "  }",
    // Leuchtende Teile (Lampenschirm, Laternenglas): kein Schatten, keine Schraffur
    "  if (vLeuchten > 0.5) {",
    "    col = mix(basis, vec3(1.0, 0.96, 0.84), 0.3 * uLampen) * (0.96 + 0.14 * uLampen);",
    "    schraffur = 0.0;",
    "  }",
    "  col = mix(col, uTusche, max(schraffur, linie));",
    // Papierkorn
    "  float korn = texture2D(uPapier, gl_FragCoord.xy / (256.0 * uPixel)).r;",
    "  col *= 0.95 + korn * 0.08;",
    "  float dist = length(vWelt - uKamPos);",
    "  col = mix(col, uDunst, smoothstep(uDunstWeite.x, uDunstWeite.y, dist));",
    "  gl_FragColor = vec4(min(col * uTon, vec3(1.0)), 1.0);",
    "}"
  ].join("\n");

  /* Konturen: Rückseiten entlang der Normalen aufblähen und in Tusche füllen
     („Inverted Hull“). Gesichter und Wasser bekommen keine Kontur.          */
  var VS_KONTUR = [
    "precision highp float;",
    "attribute vec3 aPos; attribute vec3 aNrm; attribute vec3 aCol; attribute vec2 aUv; attribute vec4 aExtra;",
    "uniform mat4 uViewProj; uniform mat4 uModel; uniform mat4 uBones[" + MAX_KNOCHEN + "];",
    "uniform vec3 uKruemmMitte; uniform float uKruemmung; uniform float uZeit; uniform float uFx;",
    "uniform vec3 uKamPos; uniform float uBreite;",
    "void main() {",
    "  if (aExtra.z > 0.5 || abs(aExtra.w - 5.0) < 0.5) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }",
    "  mat4 bm = uBones[int(aExtra.x + 0.5)];",
    "  vec4 w = uModel * (bm * vec4(aPos, 1.0));",
    "  if (aExtra.y > 0.0) {",
    "    float ph = uZeit * 1.6 + w.x * 0.37 + w.z * 0.23;",
    "    w.x += sin(ph) * 0.05 * aExtra.y * uFx;",
    "    w.z += cos(ph * 0.83) * 0.035 * aExtra.y * uFx;",
    "  }",
    "  vec3 n = normalize((uModel * (bm * vec4(aNrm, 0.0))).xyz);",
    "  w.xyz += n * uBreite * length(uKamPos - w.xyz);",
    "  vec2 d = w.xz - uKruemmMitte.xz;",
    "  w.y -= dot(d, d) * uKruemmung;",
    "  gl_Position = uViewProj * w;",
    "}"
  ].join("\n");
  var FS_KONTUR = FS_PREC + "uniform vec3 uTusche; void main() { gl_FragColor = vec4(uTusche, 1.0); }";

  var VS_BLOB = [
    "precision highp float;",
    "attribute vec3 aPos; attribute vec2 aUv; attribute vec4 aCol;",
    "uniform mat4 uViewProj; uniform vec3 uKruemmMitte; uniform float uKruemmung;",
    "varying vec2 vUv; varying vec4 vCol;",
    "void main() {",
    "  vec3 w = aPos; vec2 d = w.xz - uKruemmMitte.xz; w.y -= dot(d, d) * uKruemmung;",
    "  vUv = aUv; vCol = aCol; gl_Position = uViewProj * vec4(w, 1.0);",
    "}"
  ].join("\n");
  var FS_BLOB = FS_PREC + [
    "uniform sampler2D uTex; uniform float uPixel; uniform vec3 uTusche; varying vec2 vUv; varying vec4 vCol;",
    "void main() {",
    "  float t = texture2D(uTex, vUv).a;",
    "  if (vCol.a < 0.0) {",
    // Schatten: klar umrissene, schraffierte Fläche in Tusche
    "    vec2 fc = gl_FragCoord.xy / uPixel;",
    "    float l = smoothstep(0.2, 0.08, abs(fract((fc.x + fc.y) / 4.5) - 0.5));",
    "    float form = smoothstep(0.3, 0.42, t);",
    "    float a = form * (0.18 + l * 0.8) * -vCol.a;",
    "    if (a < 0.004) discard;",
    "    gl_FragColor = vec4(uTusche, a);",
    "  } else {",
    "    float a = t * vCol.a;",
    "    if (a < 0.004) discard;",
    "    gl_FragColor = vec4(vCol.rgb, a);",
    "  }",
    "}"
  ].join("\n");

  var VS_HIMMEL = [
    "attribute vec2 aPos; uniform mat4 uInvViewProj; varying vec4 vFern;",
    "void main() { gl_Position = vec4(aPos, 0.9999, 1.0); vFern = uInvViewProj * vec4(aPos, 1.0, 1.0); }"
  ].join("\n");
  var FS_HIMMEL = FS_PREC + [
    "uniform vec3 uKamPos; uniform vec3 uOben; uniform vec3 uHorizont; uniform vec3 uUnten; varying vec4 vFern;",
    "void main() {",
    "  vec3 dir = normalize(vFern.xyz / vFern.w - uKamPos);",
    "  float y = dir.y;",
    "  vec3 c = y > 0.0 ? mix(uHorizont, uOben, pow(clamp(y * 1.8, 0.0, 1.0), 0.7))",
    "                   : mix(uHorizont, uUnten, clamp(-y * 4.0, 0.0, 1.0));",
    "  gl_FragColor = vec4(c, 1.0);",
    "}"
  ].join("\n");

  var VS_LINIE = [
    "attribute vec3 aPos; attribute vec3 aCol; uniform mat4 uViewProj; varying vec3 vCol;",
    "uniform vec3 uKruemmMitte; uniform float uKruemmung;",
    "void main() { vec3 w = aPos; vec2 d = w.xz - uKruemmMitte.xz; w.y -= dot(d, d) * uKruemmung;",
    "  vCol = aCol; gl_Position = uViewProj * vec4(w, 1.0); }"
  ].join("\n");
  var FS_LINIE = FS_PREC + "varying vec3 vCol; void main() { gl_FragColor = vec4(vCol, 1.0); }";

  // ---------------- dynamische Buffer ----------------
  var BLOB_MAX = 3000;                          // Vierecke
  var blobDaten = new Float32Array(BLOB_MAX * 4 * 9);
  var blobIdx, blobVbo, blobN = 0, blobSchattenN = 0;
  var blobPart = [];                            // Partikel werden nach den Schatten angehängt
  var LINIE_MAX = 20000;
  var linienDaten = new Float32Array(LINIE_MAX * 2 * 6), linienN = 0, linienVbo;
  var himmelVbo;

  R.init = function (g) {
    gl = g;
    pHaupt = ENG.gl.program(VS_HAUPT, FS_HAUPT, ["aPos", "aNrm", "aCol", "aUv", "aExtra"]);
    pKontur = ENG.gl.program(VS_KONTUR, FS_KONTUR, ["aPos", "aNrm", "aCol", "aUv", "aExtra"]);
    pBlob = ENG.gl.program(VS_BLOB, FS_BLOB, ["aPos", "aUv", "aCol"]);
    pHimmel = ENG.gl.program(VS_HIMMEL, FS_HIMMEL, ["aPos"]);
    pLinie = ENG.gl.program(VS_LINIE, FS_LINIE, ["aPos", "aCol"]);
    for (var k = 0; k < MAX_KNOCHEN; k++) MM.m4identity(einheitsKnochen.subarray(k * 16, k * 16 + 16));
    var idx = new Uint16Array(BLOB_MAX * 6);
    for (var i = 0; i < BLOB_MAX; i++) {
      idx[i * 6] = i * 4; idx[i * 6 + 1] = i * 4 + 1; idx[i * 6 + 2] = i * 4 + 2;
      idx[i * 6 + 3] = i * 4; idx[i * 6 + 4] = i * 4 + 2; idx[i * 6 + 5] = i * 4 + 3;
    }
    blobIdx = ENG.gl.buffer(idx, gl.ELEMENT_ARRAY_BUFFER);
    blobVbo = ENG.gl.buffer(blobDaten.byteLength, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
    linienVbo = ENG.gl.buffer(linienDaten.byteLength, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
    himmelVbo = ENG.gl.buffer(new Float32Array([-1, -1, 3, -1, -1, 3]), gl.ARRAY_BUFFER);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  };

  // Zeichenfläche an Fenstergröße anpassen
  R.groesse = function (cssB, cssH, dpr, skala) {
    var c = ENG.gl.canvas;
    var f = Math.min(dpr || 1, 2) * (skala || 1);
    var w = Math.max(1, Math.floor(cssB * f)), h = Math.max(1, Math.floor(cssH * f));
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    R.breite = w; R.hoehe = h; R.cssB = cssB; R.cssH = cssH; R.pixel = f;
  };

  /* Umgebung: { oben, horizont, dunst, sonne, schatten (je [r,g,b]),
                 sonnenRichtung [x,y,z], dunstWeite [nah, fern], kruemmung } */
  R.beginn = function (kamera, umgebung, t) {
    kam = kamera; umg = umgebung; zeit = t;
    R.stats.drawCalls = 0; R.stats.dreiecke = 0;
    blobN = 0; blobSchattenN = 0; blobPart.length = 0; linienN = 0;
    R.kruemmung = (R.fx && R.kruemmungAn) ? (umgebung.kruemmung || 0) : 0;
    gl.viewport(0, 0, R.breite, R.hoehe);
    gl.clearColor(umg.dunst[0], umg.dunst[1], umg.dunst[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Himmel
    ENG.gl.use(pHimmel);
    gl.disable(gl.DEPTH_TEST);
    gl.depthMask(false);
    gl.uniformMatrix4fv(pHimmel.u.uInvViewProj, false, kam.invViewProj);
    gl.uniform3fv(pHimmel.u.uKamPos, kam.pos);
    gl.uniform3fv(pHimmel.u.uOben, umg.oben);
    gl.uniform3fv(pHimmel.u.uHorizont, umg.horizont);
    gl.uniform3fv(pHimmel.u.uUnten, umg.dunst);
    gl.bindBuffer(gl.ARRAY_BUFFER, himmelVbo);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    R.stats.drawCalls++;
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);
    hauptVorbereiten();
  };

  function hauptVorbereiten() {
    ENG.gl.use(pHaupt);
    var u = pHaupt.u;
    gl.uniformMatrix4fv(u.uViewProj, false, kam.viewProj);
    gl.uniform3fv(u.uKruemmMitte, kam.ziel);
    gl.uniform1f(u.uKruemmung, R.kruemmung);
    gl.uniform1f(u.uZeit, zeit);
    gl.uniform1f(u.uFx, R.fx ? 1 : 0);
    gl.uniform3fv(u.uSonnenRichtung, umg.sonnenRichtung);
    gl.uniform3fv(u.uSonne, umg.sonne);
    gl.uniform3fv(u.uSchatten, umg.schatten);
    gl.uniform3fv(u.uDunst, umg.dunst);
    gl.uniform2fv(u.uDunstWeite, umg.dunstWeite);
    gl.uniform3fv(u.uKamPos, kam.pos);
    gl.uniform3f(u.uTon, 1, 1, 1);
    gl.uniform3fv(u.uTusche, umg.tusche);
    gl.uniform1f(u.uPixel, R.pixel || 1);
    gl.uniform1f(u.uSchraffur, 1);
    var rk = umg.rueck || umg.schatten;
    gl.uniform4f(u.uRueck, rk[0], rk[1], rk[2], umg.rueckStaerke || 0);
    gl.uniform1f(u.uWolken, R.licht ? (umg.wolken || 0) : 0);
    gl.uniform1f(u.uLampen, umg.lampen || 0);
    var fl = umg.fensterLicht || [1, 1, 1];
    gl.uniform4f(u.uFensterLicht, fl[0], fl[1], fl[2], umg.fenster || 0);
    gl.uniform1i(u.uLichtN, 0);
    lichtN = 0;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, ENG.textures.detail);
    gl.uniform1i(u.uDetail, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, ENG.textures.gesicht);
    gl.uniform1i(u.uGesichtTex, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, ENG.textures.papier);
    gl.uniform1i(u.uPapier, 2);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniformMatrix4fv(u.uBones, false, einheitsKnochen);
    knochenSindEinheit = true;
    // Konturen-Programm: Werte für das ganze Bild
    ENG.gl.use(pKontur);
    var k = pKontur.u;
    gl.uniformMatrix4fv(k.uViewProj, false, kam.viewProj);
    gl.uniform3fv(k.uKruemmMitte, kam.ziel);
    gl.uniform1f(k.uKruemmung, R.kruemmung);
    gl.uniform1f(k.uZeit, zeit);
    gl.uniform1f(k.uFx, R.fx ? 1 : 0);
    gl.uniform3fv(k.uKamPos, kam.pos);
    gl.uniform3fv(k.uTusche, umg.tusche);
    gl.uniformMatrix4fv(k.uBones, false, einheitsKnochen);
    konturKnochenEinheit = true;
    ENG.gl.use(pHaupt);
  }

  var EINHEIT = MM.m4();

  /* Mesh zeichnen.
     opt: { knochen: Float32Array(16*n), augen, mund (Atlas-Rechtecke),
            rand (Randlicht 0…1), ton [r,g,b] }                         */
  /* opt zusätzlich: kontur (Linienbreite, 0 = keine) */
  function zeichneTeile(mesh) {
    var st = ENG.mesh.STRIDE * 4;
    for (var i = 0; i < mesh.teile.length; i++) {
      var t = mesh.teile[i];
      gl.bindBuffer(gl.ARRAY_BUFFER, t.vbo);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, st, 0);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, st, 12);
      gl.vertexAttribPointer(2, 3, gl.FLOAT, false, st, 24);
      gl.vertexAttribPointer(3, 2, gl.FLOAT, false, st, 36);
      gl.vertexAttribPointer(4, 4, gl.FLOAT, false, st, 44);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, t.ibo);
      gl.drawElements(gl.TRIANGLES, t.anzahl, gl.UNSIGNED_SHORT, 0);
      R.stats.drawCalls++;
      R.stats.dreiecke += t.anzahl / 3;
    }
  }

  R.mesh = function (mesh, model, opt) {
    var u = pHaupt.u;
    gl.uniformMatrix4fv(u.uModel, false, model || EINHEIT);
    if (opt && opt.knochen) {
      gl.uniformMatrix4fv(u.uBones, false, opt.knochen);
      knochenSindEinheit = false;
    } else if (!knochenSindEinheit) {
      gl.uniformMatrix4fv(u.uBones, false, einheitsKnochen);
      knochenSindEinheit = true;
    }
    if (opt && opt.augen) gl.uniform4fv(u.uAugen, opt.augen);
    if (opt && opt.mund) gl.uniform4fv(u.uMund, opt.mund);
    if (opt && opt.ton) gl.uniform3fv(u.uTon, opt.ton); else gl.uniform3f(u.uTon, 1, 1, 1);
    zeichneTeile(mesh);

    if (opt && opt.kontur) {
      var k = pKontur.u;
      ENG.gl.use(pKontur);
      gl.uniformMatrix4fv(k.uModel, false, model || EINHEIT);
      if (opt.knochen) {
        gl.uniformMatrix4fv(k.uBones, false, opt.knochen);
        konturKnochenEinheit = false;
      } else if (!konturKnochenEinheit) {
        gl.uniformMatrix4fv(k.uBones, false, einheitsKnochen);
        konturKnochenEinheit = true;
      }
      gl.uniform1f(k.uBreite, opt.kontur);
      gl.cullFace(gl.FRONT);
      zeichneTeile(mesh);
      gl.cullFace(gl.BACK);
      ENG.gl.use(pHaupt);
    }
  };

  // Ist eine Box sichtbar? (berücksichtigt die Weltkrümmung)
  R.sichtbar = function (min, max) {
    if (!kam) return true;
    var cx = (min[0] + max[0]) / 2 - kam.ziel[0], cz = (min[2] + max[2]) / 2 - kam.ziel[2];
    var rx = (max[0] - min[0]) / 2, rz = (max[2] - min[2]) / 2;
    var d = Math.max(0, Math.sqrt(cx * cx + cz * cz) - Math.sqrt(rx * rx + rz * rz));
    var fall = d * d * R.kruemmung;
    return MM.boxVisible(kam.ebenen, min[0], min[1] - fall, min[2], max[0], max[1], max[2]);
  };

  // ---------------- Punktlichter ----------------
  /* Lichter für dieses Bild setzen (nach R.beginn, vor den Meshes).
     liste: [{ x, y, z, radius, farbe: [r,g,b] (schon mit Stärke) }, …]
     Es zählen nur die ersten MAX_LICHTER Einträge. Bei „Niedrig“ aus.   */
  R.MAX_LICHTER = MAX_LICHTER;
  R.lichter = function (liste) {
    lichtN = R.licht ? Math.min(liste.length, MAX_LICHTER) : 0;
    for (var i = 0; i < lichtN; i++) {
      var l = liste[i];
      lichtPos[i * 4] = l.x; lichtPos[i * 4 + 1] = l.y; lichtPos[i * 4 + 2] = l.z; lichtPos[i * 4 + 3] = l.radius;
      lichtFarbe[i * 4] = l.farbe[0]; lichtFarbe[i * 4 + 1] = l.farbe[1]; lichtFarbe[i * 4 + 2] = l.farbe[2]; lichtFarbe[i * 4 + 3] = 1;
    }
    ENG.gl.use(pHaupt);
    if (lichtN) {
      gl.uniform4fv(pHaupt.u.uLichtPos, lichtPos);
      gl.uniform4fv(pHaupt.u.uLichtFarbe, lichtFarbe);
    }
    gl.uniform1i(pHaupt.u.uLichtN, lichtN);
    R.stats.lichter = lichtN;
  };

  // Weicher Lichthof um eine Lampe (gemalter Schein, als Billboard)
  R.lichthof = function (x, y, z, groesse, farbe, alpha) {
    if (!R.licht || alpha <= 0.004) return;
    blobPart.push(x, y, z, groesse, farbe[0], farbe[1], farbe[2], alpha);
  };

  // ---------------- Blob-Schatten ----------------
  function viereck(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, r, g, b, a) {
    if (blobN >= BLOB_MAX) return;
    var o = blobN * 36, D = blobDaten;
    D[o] = ax; D[o + 1] = ay; D[o + 2] = az; D[o + 3] = 0; D[o + 4] = 0; D[o + 5] = r; D[o + 6] = g; D[o + 7] = b; D[o + 8] = a;
    D[o + 9] = bx; D[o + 10] = by; D[o + 11] = bz; D[o + 12] = 1; D[o + 13] = 0; D[o + 14] = r; D[o + 15] = g; D[o + 16] = b; D[o + 17] = a;
    D[o + 18] = cx; D[o + 19] = cy; D[o + 20] = cz; D[o + 21] = 1; D[o + 22] = 1; D[o + 23] = r; D[o + 24] = g; D[o + 25] = b; D[o + 26] = a;
    D[o + 27] = dx; D[o + 28] = dy; D[o + 29] = dz; D[o + 30] = 0; D[o + 31] = 1; D[o + 32] = r; D[o + 33] = g; D[o + 34] = b; D[o + 35] = a;
    blobN++;
  }

  /* Runder Schatten auf dem Boden. hoehe(x,z) liefert die Bodenhöhe,
     damit der Schatten sich an Hügel anschmiegt.                      */
  R.schatten = function (x, z, radius, staerke, hoehe, yFest) {
    var h0, h1, h2, h3;
    if (yFest !== undefined) { h0 = h1 = h2 = h3 = yFest; }
    else {
      h0 = hoehe(x - radius, z - radius); h1 = hoehe(x + radius, z - radius);
      h2 = hoehe(x + radius, z + radius); h3 = hoehe(x - radius, z + radius);
    }
    var e = 0.03;
    viereck(x - radius, h0 + e, z - radius, x - radius, h3 + e, z + radius,
            x + radius, h2 + e, z + radius, x + radius, h1 + e, z - radius,
            umg.schattenFarbe[0], umg.schattenFarbe[1], umg.schattenFarbe[2], -staerke);
    blobSchattenN = blobN;
  };

  // Partikel (Billboard zur Kamera)
  R.partikel = function (x, y, z, groesse, r, g, b, a) {
    blobPart.push(x, y, z, groesse, r, g, b, a);
  };

  // ---------------- Debug-Linien ----------------
  R.linie = function (ax, ay, az, bx, by, bz, r, g, b) {
    if (linienN >= LINIE_MAX) return;
    var o = linienN * 12, D = linienDaten;
    D[o] = ax; D[o + 1] = ay; D[o + 2] = az; D[o + 3] = r; D[o + 4] = g; D[o + 5] = b;
    D[o + 6] = bx; D[o + 7] = by; D[o + 8] = bz; D[o + 9] = r; D[o + 10] = g; D[o + 11] = b;
    linienN++;
  };

  // ---------------- 3D-Portrait (Dialogfenster) ----------------
  /* Zeichnet eine Figur (Kopf und Schultern) in einen eigenen Framebuffer im
     selben WebGL-Kontext und kopiert das Bild in ein 2D-Canvas.
     Aufruf nach R.ende(), damit das Hauptbild fertig ist.               */
  var PG = 256, pFbo = null, pTex, pRb, pPixel, pBild, pKam = null;
  R.portrait = function (figur, zielCanvas, umgebung, t, drehung) {
    if (!pFbo) {
      pTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, pTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, PG, PG, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      pRb = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, pRb);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, PG, PG);
      pFbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, pFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pTex, 0);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, pRb);
      pPixel = new Uint8Array(PG * PG * 4);
      pKam = { view: MM.m4(), proj: MM.m4(), viewProj: MM.m4(), invViewProj: MM.m4(), pos: [0, 0, 0], ziel: [0, 0, 0] };
    }
    var ctx = zielCanvas.getContext("2d");
    if (!pBild || pBild.width !== PG) pBild = ctx.createImageData(PG, PG);

    var g = figur.info.groesse || 1;
    var kopf = (figur.info.kopfHoehe - 0.2) * g;
    pKam.ziel[0] = 0; pKam.ziel[1] = kopf - 0.1 * g; pKam.ziel[2] = 0;
    pKam.pos[0] = 0.25 * g; pKam.pos[1] = kopf + 0.05 * g; pKam.pos[2] = 1.45 * g;
    MM.m4lookAt(pKam.view, pKam.pos, pKam.ziel, [0, 1, 0]);
    MM.m4perspective(pKam.proj, 24 * MM.DEG, 1, 0.1, 20);
    MM.m4mul(pKam.viewProj, pKam.proj, pKam.view);

    var altKam = kam, altUmg = umg, altKr = R.kruemmung;
    kam = pKam; umg = umgebung; zeit = t; R.kruemmung = 0;
    gl.bindFramebuffer(gl.FRAMEBUFFER, pFbo);
    gl.viewport(0, 0, PG, PG);
    var pap = umgebung.papier || umgebung.dunst;
    gl.clearColor(pap[0], pap[1], pap[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    hauptVorbereiten();
    gl.uniform1f(pHaupt.u.uWolken, 0);   // keine Wolkenschatten im Portrait
    var model = MM.m4compose(MM.m4(), 0, 0, 0, 0, drehung === undefined ? 0.35 : drehung, 0, g, g, g);
    var ge = figur.gesicht();
    R.mesh(figur.mesh, model, { knochen: figur.knochen, augen: ge.augen, mund: ge.mund, kontur: 0.0045 });
    gl.readPixels(0, 0, PG, PG, gl.RGBA, gl.UNSIGNED_BYTE, pPixel);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    kam = altKam; umg = altUmg; R.kruemmung = altKr;

    // Zeilen umdrehen (WebGL liest von unten nach oben)
    var d = pBild.data, zeile = PG * 4;
    for (var y = 0; y < PG; y++) {
      var q = (PG - 1 - y) * zeile, z = y * zeile;
      for (var i = 0; i < zeile; i++) d[z + i] = pPixel[q + i];
    }
    if (zielCanvas.width !== PG) { zielCanvas.width = PG; zielCanvas.height = PG; }
    ctx.putImageData(pBild, 0, 0);
  };

  // ---------------- Abschluss: Schatten, Partikel, Linien ----------------
  R.ende = function () {
    // Partikel an die Schatten anhängen (Billboards)
    if (blobPart.length) {
      var v = kam.view;
      var rx = v[0], ry = v[4], rz = v[8], ux = v[1], uy = v[5], uz = v[9];
      for (var i = 0; i < blobPart.length; i += 8) {
        var x = blobPart[i], y = blobPart[i + 1], z = blobPart[i + 2], s = blobPart[i + 3] / 2;
        viereck(x - rx * s - ux * s, y - ry * s - uy * s, z - rz * s - uz * s,
                x + rx * s - ux * s, y + ry * s - uy * s, z + rz * s - uz * s,
                x + rx * s + ux * s, y + ry * s + uy * s, z + rz * s + uz * s,
                x - rx * s + ux * s, y - ry * s + uy * s, z - rz * s + uz * s,
                blobPart[i + 4], blobPart[i + 5], blobPart[i + 6], blobPart[i + 7]);
      }
    }
    if (blobN > 0) {
      ENG.gl.use(pBlob);
      gl.uniformMatrix4fv(pBlob.u.uViewProj, false, kam.viewProj);
      gl.uniform3fv(pBlob.u.uKruemmMitte, kam.ziel);
      gl.uniform1f(pBlob.u.uKruemmung, R.kruemmung);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, ENG.textures.weich);
      gl.uniform1i(pBlob.u.uTex, 0);
      gl.uniform1f(pBlob.u.uPixel, R.pixel || 1);
      gl.uniform3fv(pBlob.u.uTusche, umg.tusche);
      gl.bindBuffer(gl.ARRAY_BUFFER, blobVbo);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, blobDaten.subarray(0, blobN * 36));
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 36, 12);
      gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 36, 20);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, blobIdx);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
      gl.disable(gl.CULL_FACE);
      gl.enable(gl.POLYGON_OFFSET_FILL);
      gl.polygonOffset(-1, -4);
      gl.drawElements(gl.TRIANGLES, blobN * 6, gl.UNSIGNED_SHORT, 0);
      R.stats.drawCalls++;
      gl.disable(gl.POLYGON_OFFSET_FILL);
      gl.enable(gl.CULL_FACE);
      gl.depthMask(true);
      gl.disable(gl.BLEND);
    }
    if (linienN > 0) {
      ENG.gl.use(pLinie);
      gl.uniformMatrix4fv(pLinie.u.uViewProj, false, kam.viewProj);
      gl.uniform3fv(pLinie.u.uKruemmMitte, kam.ziel);
      gl.uniform1f(pLinie.u.uKruemmung, R.kruemmung);
      gl.bindBuffer(gl.ARRAY_BUFFER, linienVbo);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, linienDaten.subarray(0, linienN * 12));
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
      gl.disable(gl.DEPTH_TEST);
      gl.drawArrays(gl.LINES, 0, linienN * 2);
      gl.enable(gl.DEPTH_TEST);
      R.stats.drawCalls++;
    }
  };

  return R;
})();

/* ---------------- Partikel-System (Staubwölkchen, Funkeln) ---------------- */
ENG.partikel = (function () {
  "use strict";
  var P = { liste: [] };
  var MAX = 400;
  /* opt: { x,y,z, vx,vy,vz, leben, groesse, wachsen, farbe [r,g,b], alpha, schwerkraft } */
  P.neu = function (o) {
    if (!ENG.renderer.fx) return;
    if (P.liste.length >= MAX) P.liste.shift();
    o.alter = 0;
    o.vx = o.vx || 0; o.vy = o.vy || 0; o.vz = o.vz || 0;
    o.leben = o.leben || 0.6; o.groesse = o.groesse || 0.2; o.wachsen = o.wachsen || 0;
    o.farbe = o.farbe || [1, 1, 1]; o.alpha = o.alpha === undefined ? 0.8 : o.alpha;
    o.schwerkraft = o.schwerkraft || 0;
    P.liste.push(o);
  };
  P.update = function (dt) {
    for (var i = P.liste.length - 1; i >= 0; i--) {
      var p = P.liste[i];
      p.alter += dt;
      if (p.alter >= p.leben) { P.liste.splice(i, 1); continue; }
      p.vy -= p.schwerkraft * dt;
      var brems = Math.exp(-2.5 * dt);
      p.vx *= brems; p.vz *= brems;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
    }
  };
  P.zeichnen = function () {
    for (var i = 0; i < P.liste.length; i++) {
      var p = P.liste[i], t = p.alter / p.leben;
      var a = p.alpha * (t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85);
      ENG.renderer.partikel(p.x, p.y, p.z, p.groesse + p.wachsen * t, p.farbe[0], p.farbe[1], p.farbe[2], a);
    }
  };
  P.leeren = function () { P.liste.length = 0; };
  return P;
})();
