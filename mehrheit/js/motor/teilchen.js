/* =====================================================================
   js/motor/teilchen.js – Staub im Licht, Dampf über Bechern
   (Regen auf Glas folgt in Phase 4)
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.teilchen = (function () {
  var T = {};
  var quad = null;

  function quadGeo() {
    return { p: [-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], n: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1], uv: [0, 0, 1, 0, 1, 1, 0, 1], i: [0, 1, 2, 0, 2, 3], ao: [], k: [] };
  }

  /* Staub: schwebt langsam in einem Kasten, leuchtet nur im Lichtstrahl */
  T.staub = function (box, anzahl, saat) {
    var r = MOTOR.m.zufall(saat || 3);
    var sys = { art: "staub", n: anzahl, box: box, p: new Float32Array(anzahl * 3), v: new Float32Array(anzahl * 3), g: new Float32Array(anzahl), ph: new Float32Array(anzahl) };
    for (var i = 0; i < anzahl; i++) {
      for (var k = 0; k < 3; k++) sys.p[i * 3 + k] = box.mitte[k] + (r() - 0.5) * box.groesse[k];
      sys.g[i] = box.teilchenGroesse * (0.5 + r() * r() * 1.6);
      sys.ph[i] = r() * 100;
    }
    sys.netz = MOTOR.netz(quadGeo(), { instanzen: anzahl });
    sys.helligkeit = box.helligkeit || 1;
    return sys;
  };

  /* Dampf: steigt auf, wird größer und verblasst */
  T.dampf = function (quelle, anzahl, saat) {
    var r = MOTOR.m.zufall(saat || 5);
    var sys = { art: "dampf", n: anzahl, quelle: quelle, p: new Float32Array(anzahl * 3), alter: new Float32Array(anzahl), dauer: new Float32Array(anzahl), ph: new Float32Array(anzahl), zufall: r };
    for (var i = 0; i < anzahl; i++) { sys.dauer[i] = 2.2 + r() * 1.8; sys.alter[i] = r() * sys.dauer[i]; sys.ph[i] = r() * 10; }
    sys.netz = MOTOR.netz(quadGeo(), { instanzen: anzahl });
    return sys;
  };

  T.aktualisieren = function (sys, dt, zeit, anteil) {
    var d = sys.netz.instanzDaten, n = Math.max(0, Math.floor(sys.n * (anteil === undefined ? 1 : anteil))), i, o;
    if (sys.art === "staub") {
      var b = sys.box;
      for (i = 0; i < n; i++) {
        var ph = sys.ph[i];
        sys.p[i * 3] += (Math.sin(zeit * 0.21 + ph) * 0.012 + 0.006) * dt;
        sys.p[i * 3 + 1] += (Math.sin(zeit * 0.17 + ph * 1.7) * 0.01 - 0.002) * dt;
        sys.p[i * 3 + 2] += Math.cos(zeit * 0.19 + ph * 0.7) * 0.012 * dt;
        for (var k = 0; k < 3; k++) {
          var lo = b.mitte[k] - b.groesse[k] / 2, hi = b.mitte[k] + b.groesse[k] / 2;
          if (sys.p[i * 3 + k] < lo) sys.p[i * 3 + k] += b.groesse[k]; else if (sys.p[i * 3 + k] > hi) sys.p[i * 3 + k] -= b.groesse[k];
        }
        o = i * 12;
        d[o] = sys.p[i * 3]; d[o + 1] = sys.p[i * 3 + 1]; d[o + 2] = sys.p[i * 3 + 2]; d[o + 3] = sys.g[i];
        var funkel = 0.55 + 0.45 * Math.sin(zeit * 1.3 + ph * 3.0);
        d[o + 4] = 1; d[o + 5] = 1; d[o + 6] = 1; d[o + 7] = funkel * sys.helligkeit;
      }
    } else {
      var q = sys.quelle;
      for (i = 0; i < n; i++) {
        sys.alter[i] += dt;
        if (sys.alter[i] > sys.dauer[i]) { sys.alter[i] = 0; sys.ph[i] = sys.zufall() * 10; }
        var t = sys.alter[i] / sys.dauer[i];
        var hoch = t * q.hoehe;
        var drift = Math.sin(zeit * 0.8 + sys.ph[i] + t * 4.0) * q.radius * (0.4 + t * 1.6);
        o = i * 12;
        d[o] = q.pos[0] + drift + Math.cos(sys.ph[i] * 2.0) * q.radius * 0.5;
        d[o + 1] = q.pos[1] + hoch;
        d[o + 2] = q.pos[2] + Math.sin(sys.ph[i] * 3.0) * q.radius * 0.5 + Math.cos(zeit * 0.6 + sys.ph[i]) * q.radius * t;
        d[o + 3] = q.groesse * (0.5 + t * 2.2);
        var a = Math.sin(Math.PI * Math.min(1, t * 1.15)) * q.dichte;
        d[o + 4] = 1; d[o + 5] = 1; d[o + 6] = 1; d[o + 7] = Math.max(0, a);
      }
    }
    MOTOR.netzInstanzen(sys.netz, n);
  };

  return T;
})();
