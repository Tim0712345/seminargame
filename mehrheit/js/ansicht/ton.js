/* =====================================================================
   js/ansicht/ton.js – Töne aus dem Code (Web Audio)
   ---------------------------------------------------------------------
   Raumhall je Ort (im Code erzeugte Impulsantwort), Papierrascheln,
   Füllfeder, Stempel, ein tiefer warmer Ton im Titel. Keine Sprachausgabe.
   Startet erst nach der ersten Eingabe. Standard: leise.
   (Musik-Motiv, Schritte, Regen und Gemurmel folgen in Phase 4 und 5.)
   ===================================================================== */
var ANSICHT = window.ANSICHT || {};

ANSICHT.ton = (function () {
  var T = { an: true, musik: 0.35, geraeusche: 0.5 };
  var ctx = null, haupt = null, gMusik = null, gGer = null, hall = null, hallGain = null, rausch = null;
  var warteschlange = [];

  function rauschPuffer(sek) {
    var n = Math.floor(ctx.sampleRate * sek), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  T.starten = function () {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { ctx = new AC(); } catch (e) { return; }
    haupt = ctx.createGain(); haupt.gain.value = T.an ? 1 : 0; haupt.connect(ctx.destination);
    gMusik = ctx.createGain(); gMusik.gain.value = T.musik; gMusik.connect(haupt);
    gGer = ctx.createGain(); gGer.gain.value = T.geraeusche; gGer.connect(haupt);
    hall = ctx.createConvolver(); hallGain = ctx.createGain(); hallGain.gain.value = 0.35;
    hall.connect(hallGain); hallGain.connect(haupt);
    rausch = rauschPuffer(2);
    T.raum(T._raum || 1.2);
    warteschlange.forEach(function (n) { T.spiele(n); }); warteschlange = [];
  };

  /* Raumhall: abklingendes Rauschen als Impulsantwort */
  T.raum = function (sek) {
    T._raum = sek;
    if (!ctx) return;
    var n = Math.floor(ctx.sampleRate * sek), b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (var k = 0; k < 2; k++) { var d = b.getChannelData(k); for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.2); }
    hall.buffer = b;
  };

  T.einstellen = function (an, musik, ger) {
    T.an = an; T.musik = musik; T.geraeusche = ger;
    if (!ctx) return;
    haupt.gain.setTargetAtTime(an ? 1 : 0, ctx.currentTime, 0.05);
    gMusik.gain.setTargetAtTime(musik, ctx.currentTime, 0.05);
    gGer.gain.setTargetAtTime(ger, ctx.currentTime, 0.05);
  };

  function rauschStoss(dauer, filterTyp, freq, q, laut, ziel, kurve) {
    var s = ctx.createBufferSource(); s.buffer = rausch; s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = filterTyp; f.frequency.value = freq; f.Q.value = q || 1;
    var g = ctx.createGain(); var t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    (kurve || [[0.01, laut], [dauer, 0]]).forEach(function (p) { g.gain.linearRampToValueAtTime(p[1], t + p[0]); });
    s.connect(f); f.connect(g); g.connect(ziel || gGer); g.connect(hall);
    s.start(t, Math.random()); s.stop(t + dauer + 0.05);
    return { f: f, g: g };
  }
  function sinus(freq, dauer, laut, ziel, art) {
    var o = ctx.createOscillator(); o.type = art || "sine"; o.frequency.value = freq;
    var g = ctx.createGain(), t = ctx.currentTime;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(laut, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    o.connect(g); g.connect(ziel || gGer); g.connect(hall);
    o.start(t); o.stop(t + dauer + 0.05);
    return o;
  }

  T.spiele = function (name) {
    if (!ctx) { if (warteschlange.length < 4 && name !== "klick") warteschlange.push(name); return; }
    if (!T.an) return;
    var t = ctx.currentTime;
    if (name === "klick") { sinus(1800, 0.05, 0.05); rauschStoss(0.03, "highpass", 3000, 1, 0.05); }
    else if (name === "papier") {
      for (var i = 0; i < 4; i++) {
        (function (k) { setTimeout(function () { rauschStoss(0.18 + Math.random() * 0.15, "bandpass", 2200 + Math.random() * 2500, 0.7, 0.16); }, k * 120 + Math.random() * 60); })(i);
      }
    } else if (name === "feder") {
      var r = rauschStoss(1.8, "bandpass", 5200, 3, 0.05, null, [[0.05, 0.06], [1.6, 0.05], [1.8, 0]]);
      for (var j = 0; j < 18; j++) r.g.gain.setValueAtTime(0.02 + Math.random() * 0.05, t + 0.1 + j * 0.09);
    } else if (name === "stempel") {
      setTimeout(function () {
        var o = sinus(95, 0.35, 0.5); o.frequency.exponentialRampToValueAtTime(48, ctx.currentTime + 0.25);
        rauschStoss(0.06, "lowpass", 1400, 0.8, 0.4);
      }, 520);
    } else if (name === "titel") {
      // tiefer, warmer Ton
      [55, 82.4, 110].forEach(function (f, k) {
        var o = ctx.createOscillator(); o.type = k === 2 ? "triangle" : "sine"; o.frequency.value = f;
        var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420;
        var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime([0.22, 0.1, 0.05][k], t + 2.5); g.gain.linearRampToValueAtTime(0, t + 9);
        o.connect(lp); lp.connect(g); g.connect(gMusik); g.connect(hall);
        o.start(t); o.stop(t + 9.2);
      });
    }
  };

  return T;
})();
var MOTOR = window.MOTOR || {};
MOTOR.ton = ANSICHT.ton;
