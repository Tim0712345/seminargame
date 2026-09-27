/* =====================================================================
   Die Lücke – Engine: Audio (Web Audio API, weiche Synth-Töne)
   Grundgerüst – Klänge und Sprechlaute folgen in Phase 5.
   Der Audio-Kontext startet erst nach der ersten Taste (Browser-Regel).
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.audio = (function () {
  "use strict";
  var A = { ctx: null, stumm: false, haupt: null };

  A.starten = function () {
    if (A.ctx) return;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      A.ctx = new AC();
      A.haupt = A.ctx.createGain();
      A.haupt.gain.value = A.stumm ? 0 : 0.5;
      A.haupt.connect(A.ctx.destination);
    } catch (e) { A.ctx = null; }
  };

  A.setStumm = function (s) {
    A.stumm = !!s;
    if (A.haupt) A.haupt.gain.value = A.stumm ? 0 : 0.5;
  };

  // Ein weicher Ton: Frequenz (Hz), Dauer (s), Lautstärke (0…1), Wellenform
  A.ton = function (freq, dauer, laut, form) {
    if (!A.ctx || A.stumm) return;
    var t = A.ctx.currentTime;
    var o = A.ctx.createOscillator(), g = A.ctx.createGain();
    o.type = form || "sine";
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(laut || 0.2, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    o.connect(g); g.connect(A.haupt);
    o.start(t); o.stop(t + dauer + 0.05);
  };

  return A;
})();
