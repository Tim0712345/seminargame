/* =====================================================================
   Die Lücke – Engine: Audio (Web Audio API, weiche Synth-Töne)
   ---------------------------------------------------------------------
   Keine Sounddateien: alle Klänge werden hier aus Sinus-/Dreieckstönen
   erzeugt. Der Audio-Kontext startet erst nach der ersten Taste bzw.
   dem ersten Tippen (Regel der Browser).
     silbe(tonhoehe)  – Sprechlaut pro Silbe (Tonhöhe je Figur)
     klick()          – Menü/Knopf
     notiz()          – neue Notiz im Notizbuch
     fanfare()        – Beweisstück gefunden
     tuer()           – Karten-/Raumwechsel
     richtig()/falsch() – Rückmeldung in Minispielen
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.audio = (function () {
  "use strict";
  var A = { ctx: null, stumm: false, sprechlaute: true, haupt: null };
  var LAUT = 0.5;

  A.starten = function () {
    if (A.ctx) { if (A.ctx.state === "suspended" && A.ctx.resume) A.ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      A.ctx = new AC();
      A.haupt = A.ctx.createGain();
      A.haupt.gain.value = A.stumm ? 0 : LAUT;
      // sanfter Tiefpass: nimmt den Tönen die Schärfe
      A.filter = A.ctx.createBiquadFilter();
      A.filter.type = "lowpass";
      A.filter.frequency.value = 2600;
      A.haupt.connect(A.filter);
      A.filter.connect(A.ctx.destination);
    } catch (e) { A.ctx = null; }
  };

  A.setStumm = function (s) {
    A.stumm = !!s;
    if (A.haupt) A.haupt.gain.value = A.stumm ? 0 : LAUT;
  };

  function bereit() { return A.ctx && !A.stumm && A.ctx.state !== "suspended"; }

  // Ein weicher Ton: Frequenz (Hz), Dauer (s), Lautstärke (0…1), Wellenform, Start (s ab jetzt), Zielfrequenz
  A.ton = function (freq, dauer, laut, form, start, bisFreq) {
    if (!bereit()) return;
    try {
      var t = A.ctx.currentTime + (start || 0);
      var o = A.ctx.createOscillator(), g = A.ctx.createGain();
      o.type = form || "sine";
      o.frequency.setValueAtTime(freq, t);
      if (bisFreq) o.frequency.exponentialRampToValueAtTime(bisFreq, t + dauer);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(laut || 0.2, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
      o.connect(g); g.connect(A.haupt);
      o.start(t); o.stop(t + dauer + 0.05);
    } catch (e) { /* Audio ist nur Beiwerk */ }
  };

  // Sprechlaut: kurzer, leicht zufälliger „Blubb“ – tiefere Stimmen klingen tiefer
  var letzteSilbe = 0;
  A.silbe = function (tonhoehe) {
    if (!bereit() || !A.sprechlaute) return;
    var jetzt = A.ctx.currentTime;
    if (jetzt - letzteSilbe < 0.055) return;
    letzteSilbe = jetzt;
    var f = 190 * (tonhoehe || 1) * (0.9 + Math.random() * 0.25);
    A.ton(f, 0.075, 0.07, "triangle", 0, f * (0.85 + Math.random() * 0.3));
  };

  A.klick = function () { A.ton(660, 0.05, 0.05, "sine", 0, 520); };
  A.notiz = function () { A.ton(784, 0.18, 0.08, "sine"); A.ton(1046, 0.25, 0.07, "sine", 0.09); };
  A.fanfare = function () {
    [523, 659, 784, 1046].forEach(function (f, i) { A.ton(f, 0.3, 0.09, "triangle", i * 0.09); });
    A.ton(1318, 0.5, 0.06, "sine", 0.36);
  };
  A.tuer = function () { A.ton(320, 0.28, 0.05, "sine", 0, 180); };
  A.richtig = function () { A.ton(659, 0.15, 0.08, "triangle"); A.ton(880, 0.22, 0.08, "triangle", 0.1); };
  A.falsch = function () { A.ton(330, 0.18, 0.07, "triangle", 0, 262); };

  return A;
})();
