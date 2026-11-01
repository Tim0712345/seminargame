/* =====================================================================
   js/motor/qualitaet.js – Grafikstufen, Messung, automatische Anpassung
   ---------------------------------------------------------------------
   Beim ersten Start wird einige Sekunden lang die Bildzeit gemessen und
   die passende Stufe gewählt. Fällt die Bildrate im Spiel länger unter
   28 FPS, sinkt die Stufe einen Schritt (mit kleinem Hinweis).
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.qualitaet = (function () {
  var Q = { name: "hoch", auto: true, messung: null, beiWechsel: null, fps: 60, bildzeit: 16, gpuZeit: 0 };
  var REIHE = ["ultra", "hoch", "mittel", "niedrig"];
  var unterSeit = 0, verlauf = [];

  Q.stufe = function () {
    var s = DATA.stil.grafikstufen[Q.name];
    if (!MOTOR.gl.webgl2 || !MOTOR.gl.hdr) s = DATA.stil.grafikstufen.niedrig;
    return s;
  };

  Q.start = function (gespeichert) {
    var url = new URLSearchParams(location.search).get("stufe");
    if (url && DATA.stil.grafikstufen[url]) { Q.name = url; Q.auto = false; Q.fest = true; return; }
    if (!MOTOR.gl.webgl2 || !MOTOR.gl.hdr) { Q.name = "niedrig"; Q.auto = false; return; }
    if (gespeichert && gespeichert !== "auto" && DATA.stil.grafikstufen[gespeichert]) { Q.name = gespeichert; Q.auto = false; return; }
    Q.auto = true;
    Q.name = gespeichert === "auto" && Q.gemerkt() ? Q.gemerkt() : "hoch";
    if (!Q.gemerkt()) Q.messung = { zeit: 0, bilder: 0, summe: 0, warm: 1.0, dauer: 3.0 };
  };

  Q.gemerkt = function () {
    try { var v = localStorage.getItem("mehrheit_auto_stufe"); return DATA.stil.grafikstufen[v] ? v : null; } catch (e) { return null; }
  };

  Q.waehle = function (name) {
    if (name === "auto") { Q.auto = true; try { localStorage.removeItem("mehrheit_auto_stufe"); } catch (e) {} Q.messung = { zeit: 0, bilder: 0, summe: 0, warm: 0.6, dauer: 2.5 }; return; }
    Q.auto = false;
    if (Q.name !== name) { Q.name = name; if (Q.beiWechsel) Q.beiWechsel(false); }
  };

  /* Wird jedes Bild aufgerufen (dt in Sekunden, cpu = Bildzeit in ms) */
  Q.bild = function (dt) {
    verlauf.push(dt);
    if (verlauf.length > 60) verlauf.shift();
    var summe = 0; for (var i = 0; i < verlauf.length; i++) summe += verlauf[i];
    Q.bildzeit = summe / verlauf.length * 1000;
    Q.fps = 1000 / Math.max(1, Q.bildzeit);
    if (Q.fest) return;
    var A = DATA.stil.automatik;
    // erste Messung
    if (Q.messung) {
      var m = Q.messung;
      m.zeit += dt;
      if (m.zeit > m.warm) { m.summe += dt; m.bilder++; }
      if (m.zeit > m.warm + m.dauer && m.bilder > 5) {
        var ms = m.summe / m.bilder * 1000;
        var neu = ms < A.ultraUnter ? "ultra" : (ms < A.hochUnter ? "hoch" : (ms < A.mittelUnter ? "mittel" : "niedrig"));
        Q.messung = null;
        try { localStorage.setItem("mehrheit_auto_stufe", neu); } catch (e) {}
        if (neu !== Q.name) { Q.name = neu; if (Q.beiWechsel) Q.beiWechsel(false); }
      }
      return;
    }
    // laufende Überwachung: nur nach unten
    if (!Q.auto) return;
    if (Q.fps < A.absenkenUnterFps && verlauf.length >= 30) {
      unterSeit += dt;
      if (unterSeit > A.absenkenNachSekunden) {
        unterSeit = 0; verlauf = [];
        var idx = REIHE.indexOf(Q.name);
        if (idx < REIHE.length - 1) {
          Q.name = REIHE[idx + 1];
          try { localStorage.setItem("mehrheit_auto_stufe", Q.name); } catch (e) {}
          if (Q.beiWechsel) Q.beiWechsel(true);
        }
      }
    } else unterSeit = Math.max(0, unterSeit - dt * 0.5);
  };

  /* Größe des Bildpuffers für die aktuelle Stufe */
  Q.aufloesung = function (cssB, cssH) {
    var s = Q.stufe();
    var dpr = Math.min(window.devicePixelRatio || 1, s.pixelMax || 1);
    return { b: Math.max(16, Math.round(cssB * dpr * s.renderskala)), h: Math.max(16, Math.round(cssH * dpr * s.renderskala)) };
  };

  /* GPU-Zeitmessung (wenn der Browser sie erlaubt) */
  var abfragen = [], ext = null;
  Q.gpuBeginn = function () {
    var G = MOTOR.gl; ext = G.ext.zeit;
    if (!ext || !window.MEHRHEIT_DEBUG) return;
    var gl = G.gl;
    var q = gl.createQuery();
    gl.beginQuery(ext.TIME_ELAPSED_EXT, q);
    abfragen.push(q);
  };
  Q.gpuEnde = function () {
    if (!ext || !window.MEHRHEIT_DEBUG) return;
    var gl = MOTOR.gl.gl;
    gl.endQuery(ext.TIME_ELAPSED_EXT);
    while (abfragen.length) {
      var q = abfragen[0];
      if (!gl.getQueryParameter(q, gl.QUERY_RESULT_AVAILABLE)) break;
      if (!gl.getParameter(ext.GPU_DISJOINT_EXT)) Q.gpuZeit = gl.getQueryParameter(q, gl.QUERY_RESULT) / 1e6;
      gl.deleteQuery(q); abfragen.shift();
    }
    if (abfragen.length > 6) { gl.deleteQuery(abfragen.shift()); }
  };

  return Q;
})();
