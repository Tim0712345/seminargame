/* =====================================================================
   Die Lücke – Debug-Modus (nur mit ?debug=1 in der Adresse)
   ---------------------------------------------------------------------
   * FPS, Draw-Calls, Dreiecke, Position
   * Taste G: Kachel-Raster und Kollisionsformen anzeigen
   * Konsole: Prüfung der Kartendaten, Liste ungeprüfter Fakten
   Teleport-Menü und Flags folgen in Phase 2 (sobald es mehrere Karten gibt).
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.debug = (function () {
  "use strict";
  var D = { an: false, raster: false };
  var anzeige;

  D.init = function () {
    D.an = /[?&]debug=1\b/.test(window.location.search);
    if (!D.an) return;
    anzeige = document.getElementById("debug-anzeige");
    anzeige.classList.remove("versteckt");
    D.raster = true;
    ENG.input.beiTaste = function (c) {
      if (c === "KeyG") D.raster = !D.raster;
    };
    console.log("%cDie Lücke – Debug-Modus aktiv (G = Raster/Kollision)", "color:#c76d41;font-weight:bold");
    D.faktenPruefen();
  };

  D.faktenPruefen = function () {
    var offen = [];
    for (var k in DATA.facts) {
      if (DATA.facts[k].verifiziert !== true) offen.push({ Feld: k, Wert: DATA.facts[k].wert, Quelle: DATA.facts[k].quelle });
    }
    if (offen.length) {
      console.warn("Ungeprüfte Fakten (" + offen.length + "):");
      if (console.table) console.table(offen);
    }
  };

  D.update = function () {
    if (!D.an || !anzeige) return;
    var R = ENG.renderer, sz = GAME.Spielszene, f = sz.spieler ? sz.spieler.figur : null;
    anzeige.textContent =
      "FPS " + ENG.loop.fps +
      " · Draw-Calls " + R.stats.drawCalls +
      " · Dreiecke " + Math.round(R.stats.dreiecke) +
      " · Auflösung " + R.breite + "×" + R.hoehe +
      (f ? " · Kachel " + Math.floor(f.x) + "/" + Math.floor(f.z) : "") +
      " · G: Raster " + (D.raster ? "an" : "aus");
  };

  // Raster und Kollisionsformen als Linien
  D.zeichnen = function (Z) {
    if (!D.raster) return;
    var R = ENG.renderer, w = Z.welt, f = Z.spieler.figur;
    var cx = Math.floor(f.x), cz = Math.floor(f.z), rad = 8, x, z;
    function hy(x, z) { return w.hoeheBei(x, z) + 0.04; }
    for (z = cz - rad; z <= cz + rad; z++) {
      for (x = cx - rad; x <= cx + rad; x++) {
        if (x < 0 || z < 0 || x >= w.w || z >= w.h) continue;
        R.linie(x, hy(x, z), z, x + 1, hy(x + 1, z), z, 0.35, 0.35, 0.4);
        R.linie(x, hy(x, z), z, x, hy(x, z + 1), z + 1, 0.35, 0.35, 0.4);
        if (w.koll.istGesperrt(x, z)) {
          R.linie(x + 0.1, hy(x, z), z + 0.1, x + 0.9, hy(x, z), z + 0.9, 0.9, 0.2, 0.2);
          R.linie(x + 0.9, hy(x, z), z + 0.1, x + 0.1, hy(x, z), z + 0.9, 0.9, 0.2, 0.2);
        }
      }
    }
    function kreis(mx, mz, r, cr, cg, cb) {
      var n = 20, y = hy(mx, mz) + 0.02;
      for (var i = 0; i < n; i++) {
        var a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2;
        R.linie(mx + Math.cos(a0) * r, y, mz + Math.sin(a0) * r, mx + Math.cos(a1) * r, y, mz + Math.sin(a1) * r, cr, cg, cb);
      }
    }
    w.koll.formenNahe(f.x, f.z, rad).forEach(function (s) {
      if (s.typ === "kreis") { kreis(s.x, s.z, s.r, 1, 0.6, 0.1); return; }
      var ecken = [[-s.hb, -s.ht], [s.hb, -s.ht], [s.hb, s.ht], [-s.hb, s.ht]].map(function (e) {
        return [s.x + e[0] * s.c + e[1] * s.s, s.z - e[0] * s.s + e[1] * s.c];
      });
      for (var i = 0; i < 4; i++) {
        var a = ecken[i], b = ecken[(i + 1) % 4];
        R.linie(a[0], hy(a[0], a[1]) + 0.02, a[1], b[0], hy(b[0], b[1]) + 0.02, b[1], 1, 0.6, 0.1);
      }
    });
    Z.figuren.forEach(function (g) { kreis(g.x, g.z, g.info.radius, 0.3, 0.6, 1); });
    kreis(f.x, f.z, Z.spieler.radius, 0.2, 0.9, 0.3);
  };

  return D;
})();
