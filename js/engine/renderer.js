/* =====================================================================
   Die Lücke – Engine: Renderer
   ---------------------------------------------------------------------
   * Toon-Shader (3 weiche Lichtstufen, warme Sonne, kühle Schatten,
     Dunst, Wind, Wasserwellen, Gesichter, Weltkrümmung)
   * Starre Knochen: eine ganze Figur = ein Draw-Call
   * Blob-Schatten + Partikel in EINEM gemeinsamen Draw-Call
   * Himmelsverlauf, Debug-Linien
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.renderer = (function () {
  "use strict";
  var MM = ENG.math;
  var R = { stats: { drawCalls: 0, dreiecke: 0 }, breite: 1, hoehe: 1, skala: 1, fx: true, kruemmungAn: true, kruemmung: 0 };
  var gl, pHaupt, pBlob, pHimmel, pLinie;
  var MAX_KNOCHEN = 12;
  var einheitsKnochen = new Float32Array(16 * MAX_KNOCHEN);
  var knochenSindEinheit = false;
  var kam = null, umg = null, zeit = 0;

  var FS_PREC = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n";

  // ---------------- Shader ----------------
  var VS_HAUPT = [
    "precision highp float;",
    "attribute vec3 aPos; attribute vec3 aNrm; attribute vec3 aCol; attribute vec2 aUv; attribute vec4 aExtra;",
    "uniform mat4 uViewProj; uniform mat4 uModel; uniform mat4 uBones[" + MAX_KNOCHEN + "];",
    "uniform vec3 uKruemmMitte; uniform float uKruemmung; uniform float uZeit; uniform float uFx;",
    "varying vec3 vNrm; varying vec3 vCol; varying vec2 vUv; varying vec3 vWelt;",
    "varying vec4 vSel; varying float vWasser; varying float vGesicht;",
    "void main() {",
    "  mat4 bm = uBones[int(aExtra.x + 0.5)];",
    "  vec4 w = uModel * (bm * vec4(aPos, 1.0));",
    "  if (aExtra.y > 0.0) {",
    "    float ph = uZeit * 1.6 + w.x * 0.37 + w.z * 0.23;",
    "    w.x += sin(ph) * 0.05 * aExtra.y * uFx;",
    "    w.z += cos(ph * 0.83) * 0.035 * aExtra.y * uFx;",
    "  }",
    "  float sel = aExtra.w;",
    "  vWasser = step(4.5, sel);",
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
    "uniform sampler2D uDetail; uniform sampler2D uGesichtTex;",
    "uniform vec4 uAugen; uniform vec4 uMund;",
    "uniform vec3 uSonnenRichtung; uniform vec3 uSonne; uniform vec3 uSchatten;",
    "uniform vec3 uDunst; uniform vec2 uDunstWeite; uniform vec3 uKamPos;",
    "uniform float uZeit; uniform float uRand; uniform vec3 uTon;",
    "varying vec3 vNrm; varying vec3 vCol; varying vec2 vUv; varying vec3 vWelt;",
    "varying vec4 vSel; varying float vWasser; varying float vGesicht;",
    "void main() {",
    "  vec3 basis = vCol;",
    "  if (vSel.x + vSel.y + vSel.z + vSel.w > 0.0) {",
    "    float d = dot(texture2D(uDetail, vUv), vSel);",
    "    basis *= 0.84 + d * 0.32;",
    "  }",
    "  if (vWasser > 0.5) {",
    "    vec2 wuv = vWelt.xz * 0.11;",
    "    float r1 = texture2D(uDetail, wuv + vec2(uZeit * 0.013, uZeit * 0.009)).a;",
    "    float r2 = texture2D(uDetail, wuv * 1.37 + vec2(-uZeit * 0.011, uZeit * 0.014)).a;",
    "    float g = smoothstep(0.6, 0.7, 1.0 - (r1 + r2) * 0.5);",
    "    basis = mix(basis, vec3(1.0), g * 0.4);",
    "  }",
    "  if (vGesicht > 0.5) {",
    "    vec4 r = vGesicht < 1.5 ? uAugen : uMund;",
    "    vec4 f = texture2D(uGesichtTex, r.xy + clamp(vUv, 0.0, 1.0) * r.zw);",
    "    if (f.a < 0.04) discard;",
    "    basis = mix(basis, f.rgb, f.a);",
    "  }",
    "  vec3 N = normalize(vNrm);",
    "  float ndl = dot(N, uSonnenRichtung);",
    "  float t = smoothstep(-0.06, 0.06, ndl) * 0.55 + smoothstep(0.38, 0.5, ndl) * 0.45;",
    "  vec3 licht = mix(uSchatten, uSonne, t);",
    "  vec3 V = normalize(uKamPos - vWelt);",
    "  float rand = pow(1.0 - max(dot(N, V), 0.0), 3.0) * uRand;",
    "  vec3 col = basis * licht + rand * uSonne * 0.45;",
    "  float dist = length(vWelt - uKamPos);",
    "  col = mix(col, uDunst, smoothstep(uDunstWeite.x, uDunstWeite.y, dist));",
    "  gl_FragColor = vec4(col * uTon, 1.0);",
    "}"
  ].join("\n");

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
    "uniform sampler2D uTex; varying vec2 vUv; varying vec4 vCol;",
    "void main() {",
    "  float a = texture2D(uTex, vUv).a * vCol.a;",
    "  if (a < 0.004) discard;",
    "  gl_FragColor = vec4(vCol.rgb, a);",
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
    R.breite = w; R.hoehe = h; R.cssB = cssB; R.cssH = cssH;
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
    gl.uniform1f(u.uRand, 0);
    gl.uniform3f(u.uTon, 1, 1, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, ENG.textures.detail);
    gl.uniform1i(u.uDetail, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, ENG.textures.gesicht);
    gl.uniform1i(u.uGesichtTex, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniformMatrix4fv(u.uBones, false, einheitsKnochen);
    knochenSindEinheit = true;
  }

  var EINHEIT = MM.m4();

  /* Mesh zeichnen.
     opt: { knochen: Float32Array(16*n), augen, mund (Atlas-Rechtecke),
            rand (Randlicht 0…1), ton [r,g,b] }                         */
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
    gl.uniform1f(u.uRand, opt && opt.rand ? opt.rand : 0);
    if (opt && opt.ton) gl.uniform3fv(u.uTon, opt.ton); else gl.uniform3f(u.uTon, 1, 1, 1);
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
            umg.schattenFarbe[0], umg.schattenFarbe[1], umg.schattenFarbe[2], staerke);
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
