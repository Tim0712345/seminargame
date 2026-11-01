/* =====================================================================
   js/ansicht/ton.js – Töne aus dem Code (Web Audio)
   ---------------------------------------------------------------------
   Raumhall je Ort (im Code erzeugte Impulsantwort), Papierrascheln,
   Füllfeder, Stempel, Hammer, Schritte, Gemurmel, Regen am Fenster und ein
   kurzes Musik-Motiv (vier Töne, ruhig). Keine Sprachausgabe.
   Startet erst nach der ersten Eingabe. Standard: leise.
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

  /* Hintergrund je Ort: "regen" (Trilog), "saal" (leises Gemurmel), sonst Stille */
  var atmo = null;
  T.atmo = function (art) {
    T._atmo = art;
    if (!ctx) return;
    if (atmo) { var alt = atmo; alt.g.gain.setTargetAtTime(0, ctx.currentTime, 0.6); setTimeout(function () { try { alt.s.stop(); } catch (e) {} }, 3000); atmo = null; }
    if (!art) return;
    var s = ctx.createBufferSource(); s.buffer = rausch; s.loop = true;
    var f = ctx.createBiquadFilter(), g = ctx.createGain();
    if (art === "regen") { f.type = "bandpass"; f.frequency.value = 2600; f.Q.value = 0.4; }
    else { f.type = "bandpass"; f.frequency.value = 480; f.Q.value = 1.1; }
    g.gain.value = 0; g.gain.setTargetAtTime(art === "regen" ? 0.05 : 0.035, ctx.currentTime, 1.2);
    s.connect(f); f.connect(g); g.connect(gGer);
    // langsames Schwanken (Gemurmel lebt, Regen prasselt)
    var lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = art === "regen" ? 7 : 0.4; lg.gain.value = art === "regen" ? 0.012 : 0.02;
    lfo.connect(lg); lg.connect(g.gain); lfo.start();
    s.start();
    atmo = { s: s, g: g, lfo: lfo };
  };

  /* Musik-Motiv: vier ruhige Töne (aufsteigend = Hoffnung, offen endend) */
  function motiv(toene, laut) {
    var t = ctx.currentTime;
    toene.forEach(function (n, k) {
      var f = 220 * Math.pow(2, n / 12);
      [1, 2].forEach(function (ob, j) {
        var o = ctx.createOscillator(); o.type = j ? "sine" : "triangle"; o.frequency.value = f * ob;
        var g = ctx.createGain(), a = t + k * 0.42;
        g.gain.setValueAtTime(0, a); g.gain.linearRampToValueAtTime(laut / (j ? 3 : 1), a + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, a + 2.2);
        o.connect(g); g.connect(gMusik); g.connect(hall);
        o.start(a); o.stop(a + 2.3);
      });
    });
  }

  var altSpiele = T.spiele;
  T.spiele = function (name) {
    if (!ctx || !T.an) return altSpiele(name);
    if (name === "hammer") {
      [0, 0.32].forEach(function (v) {
        setTimeout(function () {
          var o = sinus(170, 0.18, 0.45); o.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.12);
          rauschStoss(0.05, "bandpass", 900, 1.2, 0.35);
        }, v * 1000);
      });
    } else if (name === "gemurmel") {
      rauschStoss(4, "bandpass", 520, 1.2, 0.12, null, [[0.8, 0.12], [2.5, 0.09], [4, 0]]);
      rauschStoss(4, "bandpass", 900, 2, 0.06, null, [[1.0, 0.06], [3.0, 0.04], [4, 0]]);
    } else if (name === "schritte") {
      for (var i = 0; i < 4; i++) (function (k) { setTimeout(function () { rauschStoss(0.07, "lowpass", 420, 0.7, 0.22); sinus(70, 0.09, 0.1); }, k * 380); })(i);
    } else if (name === "motiv") motiv([0, 5, 7, 12], 0.07);
    else if (name === "motivOffen") motiv([0, 5, 7, 4], 0.06);
    else if (name === "motivDunkel") motiv([0, 3, 7, 2], 0.06);
    else altSpiele(name);
  };
  var altStarten = T.starten;
  T.starten = function () { var neu = !ctx; altStarten(); if (neu && ctx && T._atmo) T.atmo(T._atmo); };

  return T;
})();
var MOTOR = window.MOTOR || {};
MOTOR.ton = ANSICHT.ton;
