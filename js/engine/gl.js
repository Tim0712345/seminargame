/* =====================================================================
   Die Lücke – Engine: WebGL-Kontext, Shader, Texturen, Buffer
   Nur WebGL 1, keine Erweiterungen zwingend nötig.
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.gl = (function () {
  "use strict";
  var G = { gl: null, canvas: null, aniso: null, anisoMax: 1, verloren: false };
  var aktivAttr = 0;

  G.create = function (canvas, kantenglaettung) {
    var opt = {
      antialias: !!kantenglaettung, alpha: false, depth: true, stencil: false,
      premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: "default"
    };
    var gl = null;
    try {
      gl = canvas.getContext("webgl", opt) || canvas.getContext("experimental-webgl", opt);
    } catch (e) { gl = null; }
    if (!gl) return null;
    G.gl = gl;
    G.canvas = canvas;
    G.aniso = gl.getExtension("EXT_texture_filter_anisotropic") ||
              gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
              gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
    if (G.aniso) G.anisoMax = Math.min(4, gl.getParameter(G.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1);
    canvas.addEventListener("webglcontextlost", function (e) {
      e.preventDefault();
      G.verloren = true;
      if (G.onLost) G.onLost();
    }, false);
    return gl;
  };

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      var log = gl.getShaderInfoLog(s);
      throw new Error("Shader-Fehler: " + log);
    }
    return s;
  }

  /* Programm bauen. attribs = Liste der Attributnamen (Reihenfolge = Location). */
  G.program = function (vs, fs, attribs) {
    var gl = G.gl;
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    for (var i = 0; i < attribs.length; i++) gl.bindAttribLocation(p, i, attribs[i]);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) {
      throw new Error("Shader-Verknüpfung fehlgeschlagen: " + gl.getProgramInfoLog(p));
    }
    var u = {};
    var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var k = 0; k < n; k++) {
      var info = gl.getActiveUniform(p, k);
      u[info.name.replace(/\[0\]$/, "")] = gl.getUniformLocation(p, info.name);
    }
    return { p: p, u: u, nAttr: attribs.length };
  };

  G.use = function (prog) {
    var gl = G.gl;
    gl.useProgram(prog.p);
    var i;
    for (i = aktivAttr; i < prog.nAttr; i++) gl.enableVertexAttribArray(i);
    for (i = prog.nAttr; i < aktivAttr; i++) gl.disableVertexAttribArray(i);
    aktivAttr = prog.nAttr;
  };

  /* Textur aus Canvas oder Pixel-Array.
     opt: { breite, hoehe (bei Array), wiederholen, mipmap } */
  G.texture = function (quelle, opt) {
    var gl = G.gl;
    opt = opt || {};
    var t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    if (quelle instanceof Uint8Array) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, opt.breite, opt.hoehe, 0, gl.RGBA, gl.UNSIGNED_BYTE, quelle);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, quelle);
    }
    var wrap = opt.wiederholen ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (opt.mipmap) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      if (G.aniso && opt.anisotrop) gl.texParameterf(gl.TEXTURE_2D, G.aniso.TEXTURE_MAX_ANISOTROPY_EXT, G.anisoMax);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    return t;
  };

  G.buffer = function (daten, ziel, nutzung) {
    var gl = G.gl;
    var b = gl.createBuffer();
    gl.bindBuffer(ziel || gl.ARRAY_BUFFER, b);
    gl.bufferData(ziel || gl.ARRAY_BUFFER, daten, nutzung || gl.STATIC_DRAW);
    return b;
  };

  return G;
})();
