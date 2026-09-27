/* =====================================================================
   Die Lücke – Start
   Verbindet Engine und Spiel und startet den Game-Loop.
   ===================================================================== */
(function () {
  "use strict";

  function start() {
    var canvas = document.getElementById("spiel");
    GAME.einstellungen.laden();

    var gl = ENG.gl.create(canvas, GAME.einstellungen.qualitaet === "hoch");
    if (!gl) { GAME.ui.fehlerZeigen(); return; }
    ENG.gl.onLost = function () { ENG.loop.stopp(); GAME.ui.meldung(DATA.texte.fehlerVerloren); };

    try {
      ENG.renderer.init(gl);
      ENG.textures.init();
      ENG.input.init();
      GAME.ui.init();
      GAME.dialog.init();
      GAME.einstellungen.anwenden();
      GAME.debug.init();
      // Startkarte (im Debug-Modus per ?karte=… wählbar, z. B. ?debug=1&karte=testinsel)
      var m = /[?&]karte=([a-z_]+)/.exec(window.location.search);
      var start = m && DATA.maps[m[1]] ? m[1] : "europaplatz";
      GAME.szenen.wechseln(GAME.Spielszene, { karte: start, spawn: Object.keys(DATA.maps[start].spawns)[0] });
    } catch (e) {
      console.error(e);
      GAME.ui.fehlerZeigen(e && e.message);
      return;
    }

    // Audio darf erst nach einer Taste starten
    window.addEventListener("keydown", function einmal() {
      ENG.audio.starten();
      window.removeEventListener("keydown", einmal);
    });

    ENG.loop.start(function (dt, t) {
      GAME.ui.update();
      GAME.szenen.update(dt, t);
      GAME.szenen.zeichnen(t);
      GAME.debug.update();
      ENG.input.bildEnde();
    });

    // Beim ersten Start: Steuerung erklären
    if (!GAME.merker.lesen("hinweisGesehen")) {
      GAME.ui.steuerungZeigen(function () { GAME.merker.schreiben("hinweisGesehen", "1"); });
    }
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();
