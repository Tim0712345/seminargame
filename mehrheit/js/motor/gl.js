/* =====================================================================
   js/motor/gl.js – WebGL-Kontext, Erweiterungen, Rückfall, Hilfen
   ---------------------------------------------------------------------
   Rückfallebenen (Abschnitt 10.1):
   1. WebGL 2 mit allen Effekten
   2. WebGL 1 mit Stufe „Niedrig“ (ohne Gleitkomma-Puffer)
   3. kein WebGL → Dokumentmodus (js/ansicht/dokumentmodus.js)
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.gl = (function () {
  var G = { gl: null, webgl2: false, hdr: false, ext: {}, kanvas: null, verloren: false, beiVerlust: null, beiNeuaufbau: null };
  var gl;

  /* Feste Plätze der Vertex-Attribute */
  G.ATTR = { aPos: 0, aNor: 1, aUv: 2, aAo: 3, aKnochen: 4, iA: 5, iB: 6, iC: 7 };

  G.init = function (kanvas, nurWebGL1) {
    G.kanvas = kanvas;
    var opt = { antialias: false, alpha: false, depth: true, stencil: false, premultipliedAlpha: false,
                preserveDrawingBuffer: false, powerPreference: "high-performance" };
    gl = null;
    if (!nurWebGL1) { try { gl = kanvas.getContext("webgl2", opt); } catch (e) { gl = null; } }
    G.webgl2 = !!gl;
    if (!gl) {
      try { gl = kanvas.getContext("webgl", opt) || kanvas.getContext("experimental-webgl", opt); } catch (e) { gl = null; }
    }
    if (!gl) return false;
    G.gl = gl;
    var E = G.ext = {};
    function hol(n) { try { return gl.getExtension(n); } catch (e) { return null; } }
    E.aniso = hol("EXT_texture_filter_anisotropic");
    E.zeit = G.webgl2 ? hol("EXT_disjoint_timer_query_webgl2") : null;
    E.polygon = hol("WEBGL_polygon_mode");
    E.verlust = hol("WEBGL_lose_context");
    if (G.webgl2) {
      E.farbFloat = hol("EXT_color_buffer_float");
      E.floatLinear = hol("OES_texture_float_linear");
      G.hdr = !!E.farbFloat;
    } else {
      E.vao = hol("OES_vertex_array_object");
      E.instanz = hol("ANGLE_instanced_arrays");
      E.uint = hol("OES_element_index_uint");
      E.abl = hol("OES_standard_derivatives");
      E.lod = hol("EXT_shader_texture_lod");
      E.tiefe = hol("WEBGL_depth_texture");
      G.hdr = false;
      if (!E.vao || !E.instanz || !E.abl) return false;   // ohne diese geht unsere Maschine nicht
    }
    G.anisoMax = E.aniso ? gl.getParameter(E.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
    G.maxTextur = gl.getParameter(gl.MAX_TEXTURE_SIZE);

    kanvas.addEventListener("webglcontextlost", function (e) {
      e.preventDefault(); G.verloren = true; if (G.beiVerlust) G.beiVerlust();
    }, false);
    kanvas.addEventListener("webglcontextrestored", function () {
      G.verloren = false; if (G.beiNeuaufbau) G.beiNeuaufbau();
    }, false);
    return true;
  };

  /* ---------- Vertex-Array-Objekte und Instancing (WebGL 1 / 2) ---------- */
  G.vao = function () { return G.webgl2 ? gl.createVertexArray() : G.ext.vao.createVertexArrayOES(); };
  G.bindeVao = function (v) { if (G.webgl2) gl.bindVertexArray(v); else G.ext.vao.bindVertexArrayOES(v); };
  G.loescheVao = function (v) { if (G.webgl2) gl.deleteVertexArray(v); else G.ext.vao.deleteVertexArrayOES(v); };
  G.teiler = function (ort, n) { if (G.webgl2) gl.vertexAttribDivisor(ort, n); else G.ext.instanz.vertexAttribDivisorANGLE(ort, n); };
  G.zeichneInstanzen = function (modus, anzahl, typ, n) {
    if (G.webgl2) gl.drawElementsInstanced(modus, anzahl, typ, 0, n);
    else G.ext.instanz.drawElementsInstancedANGLE(modus, anzahl, typ, 0, n);
  };

  /* ---------- Texturen ----------
     format: rgba8, rgba16f, r8, rg8, tiefe */
  G.textur = function (o) {
    var t = gl.createTexture(), b = o.b || 1, h = o.h || 1, fmt = o.format || "rgba8";
    gl.bindTexture(gl.TEXTURE_2D, t);
    var intern, form, typ;
    if (G.webgl2) {
      if (fmt === "rgba16f") { intern = gl.RGBA16F; form = gl.RGBA; typ = gl.HALF_FLOAT; }
      else if (fmt === "r8") { intern = gl.R8; form = gl.RED; typ = gl.UNSIGNED_BYTE; }
      else if (fmt === "rg8") { intern = gl.RG8; form = gl.RG; typ = gl.UNSIGNED_BYTE; }
      else if (fmt === "tiefe") { intern = gl.DEPTH_COMPONENT24; form = gl.DEPTH_COMPONENT; typ = gl.UNSIGNED_INT; }
      else { intern = gl.RGBA8; form = gl.RGBA; typ = gl.UNSIGNED_BYTE; }
    } else {
      if (fmt === "tiefe") { intern = gl.DEPTH_COMPONENT; form = gl.DEPTH_COMPONENT; typ = gl.UNSIGNED_INT; }
      else { intern = gl.RGBA; form = gl.RGBA; typ = gl.UNSIGNED_BYTE; }
    }
    if (o.quelle) {
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!o.drehen);
      gl.texImage2D(gl.TEXTURE_2D, 0, intern, form, typ, o.quelle);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      b = o.quelle.width; h = o.quelle.height;
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, intern, b, h, 0, form, typ, o.daten || null);
    }
    var lin = o.filter !== "nah";
    var mip = !!o.mip;
    // WebGL 1: Mipmaps und Wiederholen nur bei Zweierpotenzen
    var zp = function (x) { return (x & (x - 1)) === 0; };
    if (!G.webgl2 && !(zp(b) && zp(h))) { mip = false; o.wiederholen = false; }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, lin ? gl.LINEAR : gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : (lin ? gl.LINEAR : gl.NEAREST));
    var wrap = o.wiederholen ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    if (mip) gl.generateMipmap(gl.TEXTURE_2D);
    if (o.aniso && G.ext.aniso) gl.texParameterf(gl.TEXTURE_2D, G.ext.aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(o.aniso, G.anisoMax));
    return { tex: t, b: b, h: h, format: fmt, mip: mip, drehen: !!o.drehen };
  };

  G.texturNeu = function (t, quelle) {
    gl.bindTexture(gl.TEXTURE_2D, t.tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !!t.drehen);
    gl.texImage2D(gl.TEXTURE_2D, 0, G.webgl2 ? gl.RGBA8 : gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, quelle);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    if (t.mip) gl.generateMipmap(gl.TEXTURE_2D);
  };

  G.loescheTextur = function (t) { if (t && t.tex) gl.deleteTexture(t.tex); };

  /* Würfeltextur (Umgebung) – leer anlegen */
  G.wuerfel = function (groesse, hdr) {
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, t);
    var intern = hdr ? gl.RGBA16F : (G.webgl2 ? gl.RGBA8 : gl.RGBA), typ = hdr ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;
    for (var i = 0; i < 6; i++) gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, intern, groesse, groesse, 0, gl.RGBA, typ, null);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    return { tex: t, groesse: groesse, hdr: hdr, lods: Math.floor(Math.log2(groesse)) };
  };

  /* ---------- Framebuffer ---------- */
  G.fbo = function (farben, tiefe) {
    var f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    var puffer = [];
    for (var i = 0; i < farben.length; i++) {
      var att = G.webgl2 ? gl.COLOR_ATTACHMENT0 + i : gl.COLOR_ATTACHMENT0;
      gl.framebufferTexture2D(gl.FRAMEBUFFER, att, gl.TEXTURE_2D, farben[i].tex, 0);
      puffer.push(att);
    }
    if (tiefe) {
      if (tiefe.tex) gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, tiefe.tex, 0);
      else gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, tiefe.rb);
    }
    if (G.webgl2) gl.drawBuffers(farben.length ? puffer : [gl.NONE]);
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    var b = farben.length ? farben[0].b : (tiefe ? tiefe.b : 1), h = farben.length ? farben[0].h : (tiefe ? tiefe.h : 1);
    return { fb: f, farben: farben, tiefe: tiefe, b: b, h: h, ok: status === gl.FRAMEBUFFER_COMPLETE, puffer: puffer };
  };
  G.tiefenpuffer = function (b, h) {
    var rb = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
    gl.renderbufferStorage(gl.RENDERBUFFER, G.webgl2 ? gl.DEPTH_COMPONENT24 : gl.DEPTH_COMPONENT16, b, h);
    return { rb: rb, b: b, h: h };
  };
  G.loescheFbo = function (f) {
    if (!f) return;
    gl.deleteFramebuffer(f.fb);
    if (f.tiefe && f.tiefe.rb) gl.deleteRenderbuffer(f.tiefe.rb);
  };
  G.binde = function (f) {
    if (f) { gl.bindFramebuffer(gl.FRAMEBUFFER, f.fb); gl.viewport(0, 0, f.b, f.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, G.kanvas.width, G.kanvas.height); }
  };

  /* ---------- Shader-Programme ---------- */
  var KOPF2 = "#version 300 es\n#define WEBGL2 1\n";
  var MAKROS =
    "#ifdef WEBGL2\n" +
    "#define TEX texture\n#define TEXCUBE texture\n#define TEXCUBELOD textureLod\n#define TEXLOD textureLod\n" +
    "#else\n" +
    "#define TEX texture2D\n#define TEXCUBE textureCube\n" +
    "#ifdef HAT_LOD\n#define TEXCUBELOD textureCubeLodEXT\n#define TEXLOD texture2DLodEXT\n#else\n#define TEXCUBELOD(a,b,c) textureCube(a,b,c)\n#define TEXLOD(a,b,c) texture2D(a,b,c)\n#endif\n" +
    "#endif\n";

  function kopf(defines, art) {
    var s = G.webgl2 ? KOPF2 : "";
    if (!G.webgl2 && art === "fs") {
      s += "#extension GL_OES_standard_derivatives : enable\n";
      if (G.ext.lod) s += "#extension GL_EXT_shader_texture_lod : enable\n#define HAT_LOD 1\n";
    }
    for (var i = 0; i < defines.length; i++) s += "#define " + defines[i] + "\n";
    s += MAKROS;
    if (art === "vs") {
      s += G.webgl2 ? "#define ATTR in\n#define VAR out\n" : "#define ATTR attribute\n#define VAR varying\n";
    } else {
      s += "precision highp float;\n" + (G.webgl2 ? "precision highp sampler2DShadow;\nprecision highp sampler3D;\n#define VAR in\n" : "#define VAR varying\n");
    }
    return s;
  }

  function kompiliere(typ, quelle, name) {
    var s = gl.createShader(typ);
    gl.shaderSource(s, quelle);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      var log = gl.getShaderInfoLog(s);
      var zeilen = quelle.split("\n").map(function (z, i) { return (i + 1) + ": " + z; }).join("\n");
      console.error("Shader-Fehler in „" + name + "“:\n" + log);
      if (window.MEHRHEIT_DEBUG) console.log(zeilen);
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  G.programm = function (vs, fs, defines, name) {
    defines = defines || [];
    var v = kompiliere(gl.VERTEX_SHADER, kopf(defines, "vs") + vs, name + " (Vertex)");
    var f = kompiliere(gl.FRAGMENT_SHADER, kopf(defines, "fs") + fs, name + " (Fragment)");
    if (!v || !f) return null;
    var p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f);
    for (var a in G.ATTR) gl.bindAttribLocation(p, G.ATTR[a], a);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) {
      console.error("Shader „" + name + "“ ließ sich nicht verbinden: " + gl.getProgramInfoLog(p));
      return null;
    }
    gl.deleteShader(v); gl.deleteShader(f);
    var orte = {};
    var P = {
      p: p, name: name, bild: -1,
      u: function (n) { if (!(n in orte)) orte[n] = gl.getUniformLocation(p, n); return orte[n]; },
      f1: function (n, x) { var o = P.u(n); if (o) gl.uniform1f(o, x); },
      f2: function (n, x, y) { var o = P.u(n); if (o) gl.uniform2f(o, x, y); },
      f3: function (n, v) { var o = P.u(n); if (o) gl.uniform3f(o, v[0], v[1], v[2]); },
      f4: function (n, v) { var o = P.u(n); if (o) gl.uniform4f(o, v[0], v[1], v[2], v[3]); },
      f4v: function (n, v) { var o = P.u(n); if (o) gl.uniform4fv(o, v); },
      i1: function (n, x) { var o = P.u(n); if (o) gl.uniform1i(o, x); },
      m4: function (n, m) { var o = P.u(n); if (o) gl.uniformMatrix4fv(o, false, m); }
    };
    return P;
  };

  /* Vollbild-Dreieck für Nachbearbeitung */
  var vollVao = null;
  G.vollbild = function () {
    if (!vollVao) {
      vollVao = G.vao();
      G.bindeVao(vollVao);
      var b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      G.bindeVao(null);
    }
    G.bindeVao(vollVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    G.bindeVao(null);
  };
  G.zuruecksetzen = function () { vollVao = null; };

  /* Textur an Einheit binden */
  G.tex = function (einheit, t, art) {
    gl.activeTexture(gl.TEXTURE0 + einheit);
    gl.bindTexture(art === "wuerfel" ? gl.TEXTURE_CUBE_MAP : (art === "3d" ? gl.TEXTURE_3D : gl.TEXTURE_2D), t ? (t.tex || t) : null);
  };

  return G;
})();
