/* =====================================================================
   js/motor/texturen.js – Texturen, die beim Start im Code entstehen
   ---------------------------------------------------------------------
   Materialstrukturen (Maserung, Korn, Gewebe, Kratzer …) werden auf der
   Grafikkarte berechnet. Es werden keine Bilder geladen.
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.texturen = (function () {
  var T = { struktur: {}, leer: null, weiss: null };
  var TYPEN = { glatt: 0, korn: 1, holz: 2, gebuerstet: 3, stoff: 4, teppich: 5, papier: 6, stein: 7, milchglas: 8 };
  T.TYPEN = TYPEN;

  T.init = function (groesse) {
    var G = MOTOR.gl, gl = G.gl;
    T.freigeben();
    var prog = G.programm(MOTOR.shader.voll_vs, MOTOR.shader.struktur_fs, [], "Strukturen");
    for (var name in TYPEN) {
      var g = name === "glatt" ? 4 : groesse;
      var t = G.textur({ b: g, h: g, format: "rgba8", wiederholen: true });
      var f = G.fbo([t]);
      G.binde(f);
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
      gl.useProgram(prog.p);
      prog.f1("uTyp", TYPEN[name]);
      prog.f1("uTexel", 1 / g);
      G.vollbild();
      G.loescheFbo(f);
      gl.bindTexture(gl.TEXTURE_2D, t.tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.generateMipmap(gl.TEXTURE_2D);
      if (G.ext.aniso) gl.texParameterf(gl.TEXTURE_2D, G.ext.aniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, G.anisoMax));
      t.mip = true;
      T.struktur[name] = t;
    }
    if (prog) gl.deleteProgram(prog.p);
    G.binde(null);
    // kleine Hilfstexturen
    T.weiss = G.textur({ b: 2, h: 2, daten: new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]) });
    T.schwarz = G.textur({ b: 2, h: 2, daten: new Uint8Array(16) });
    T.neutral = G.textur({ b: 2, h: 2, daten: new Uint8Array([128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128, 128]) });
  };

  T.freigeben = function () {
    var G = MOTOR.gl;
    for (var n in T.struktur) G.loescheTextur(T.struktur[n]);
    T.struktur = {};
  };

  /* Farbtabelle (3D, 32³) für die Farbkorrektur einer Stimmung */
  T.farbtabelle = function (f, alt) {
    var G = MOTOR.gl, gl = G.gl;
    if (!G.webgl2) return null;
    var N = 32, d = new Uint8Array(N * N * N * 4);
    var M = MOTOR.m;
    var sT = M.farbeSRGB(f.schatten || "#808080"), lT = M.farbeSRGB(f.lichter || "#808080");
    var temp = f.temperatur || 0, sat = f.saettigung === undefined ? 1 : f.saettigung, kon = f.kontrast || 1, ton = f.toenung || 0, schw = f.schwarz || 0;
    function weichesLicht(a, b) { return b < 0.5 ? a - (1 - 2 * b) * a * (1 - a) : a + (2 * b - 1) * ((a < 0.25 ? ((16 * a - 12) * a + 4) * a : Math.sqrt(a)) - a); }
    for (var b = 0; b < N; b++) for (var g = 0; g < N; g++) for (var r = 0; r < N; r++) {
      var c = [r / (N - 1), g / (N - 1), b / (N - 1)];
      c[0] *= 1 + temp * 0.12; c[2] *= 1 - temp * 0.12;
      var l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
      for (var k = 0; k < 3; k++) {
        var x = c[k];
        x = (x - 0.5) * kon + 0.5;
        x = l + (x - l) * sat;
        var gs = (1 - l) * (1 - l), gl2 = l * l;
        x = x + ton * (gs * (weichesLicht(x, sT[k]) - x) + gl2 * (weichesLicht(x, lT[k]) - x));
        x = schw + x * (1 - schw);
        c[k] = M.klemme(x, 0, 1);
      }
      var o = (b * N * N + g * N + r) * 4;
      d[o] = c[0] * 255; d[o + 1] = c[1] * 255; d[o + 2] = c[2] * 255; d[o + 3] = 255;
    }
    var t = alt || gl.createTexture();
    gl.bindTexture(gl.TEXTURE_3D, t);
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA8, N, N, N, 0, gl.RGBA, gl.UNSIGNED_BYTE, d);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    return t;
  };

  /* Zeichenfläche (Canvas 2D) – für Gesetzestext, Bildschirm, Zettel */
  T.leinwand = function (b, h) {
    var c = document.createElement("canvas");
    c.width = b; c.height = h;
    return c;
  };

  return T;
})();
