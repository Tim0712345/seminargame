/* =====================================================================
   Die Lücke – Engine: Game-Loop
   requestAnimationFrame mit Delta-Time (höchstens 0,1 s pro Bild,
   damit nach einer Pause nichts „springt“).
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.loop = (function () {
  "use strict";
  var L = { fps: 0, laeuft: false, zeit: 0 };

  L.start = function (schritt) {
    if (L.laeuft) return;
    L.laeuft = true;
    var letzte = 0, bilder = 0, summe = 0;
    function bild(t) {
      if (!L.laeuft) return;
      var dt = letzte ? (t - letzte) / 1000 : 1 / 60;
      letzte = t;
      if (dt > 0.1) dt = 0.1;
      if (dt < 0) dt = 0;
      L.zeit += dt;
      bilder++; summe += dt;
      if (summe >= 0.5) { L.fps = Math.round(bilder / summe); bilder = 0; summe = 0; }
      schritt(dt, L.zeit);
      window.requestAnimationFrame(bild);
    }
    window.requestAnimationFrame(bild);
  };

  L.stopp = function () { L.laeuft = false; };

  return L;
})();
