/* =====================================================================
   Die Lücke – Start
   Verbindet Engine und Spiel und startet den Game-Loop.
   ===================================================================== */
(function () {
  "use strict";

  function start() {
    var canvas = document.getElementById("spiel");
    GAME.einstellungen.laden();

    var gl = ENG.gl.create(canvas, GAME.einstellungen.qualitaet !== "niedrig");
    if (!gl) { GAME.ui.fehlerZeigen(); return; }
    ENG.gl.onLost = function () { ENG.loop.stopp(); GAME.ui.meldung(DATA.texte.fehlerVerloren); };

    try {
      ENG.renderer.init(gl);
      ENG.textures.init();
      ENG.input.init();
      ENG.input.zeigerInit(canvas);
      GAME.ui.init();
      GAME.dialog.init();
      GAME.buch.init();
      GAME.minispiel.init();
      GAME.beweisHud.init();
      GAME.speicher.init();
      GAME.einstellungen.anwenden();
      GAME.debug.init();
      GAME.admin.init();
      // Normal: Titelbildschirm. Zum Testen direkt auf eine Karte: ?karte=… (z. B. ?debug=1&karte=testinsel)
      var m = /[?&]karte=([a-z_0-9]+)/.exec(window.location.search);
      if (m && DATA.maps[m[1]]) GAME.szenen.wechseln(GAME.Spielszene, { karte: m[1], spawn: Object.keys(DATA.maps[m[1]].spawns)[0] });
      else GAME.szenen.wechseln(GAME.Titelszene);
    } catch (e) {
      console.error(e);
      GAME.ui.fehlerZeigen(e && e.message);
      return;
    }

    // Audio darf erst nach einer Taste starten
    function audioStart() { ENG.audio.starten(); }
    window.addEventListener("keydown", audioStart);
    window.addEventListener("pointerdown", audioStart);

    ENG.loop.start(function (dt, t) {
      GAME.ui.update();
      GAME.einstellungen.leistungPruefen(dt);
      GAME.szenen.update(dt, t);
      GAME.szenen.zeichnen(t);
      GAME.debug.update();
      ENG.input.bildEnde();
    });

    // Der Steuerungshinweis erscheint beim ersten „Neues Spiel“ (siehe ui.js)

    // Spielstand auch beim Schließen/Neuladen der Seite sichern
    function sichern() { if (GAME.szenen.aktiv === GAME.Spielszene && GAME.Spielszene.welt) GAME.Spielszene.speichern(); }
    window.addEventListener("pagehide", sichern);
    window.addEventListener("beforeunload", sichern);
    document.addEventListener("visibilitychange", function () { if (document.hidden) sichern(); });
    setInterval(sichern, 15000);
  }

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();
