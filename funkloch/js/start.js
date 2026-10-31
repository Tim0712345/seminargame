// =====================================================================
//  js/start.js – Start und Hauptschleife
// =====================================================================

(function () {
  var leinwand = document.getElementById("leinwand");

  // Farben aus data/stil.js an die Oberfläche (CSS) weitergeben
  function cssFarben() {
    var w = document.documentElement.style, d = DATA.stil.druckfarben;
    w.setProperty("--papier", DATA.stil.papier.farbe);
    w.setProperty("--blau", d.blau.farbe);
    w.setProperty("--pink", d.pink.farbe);
    w.setProperty("--gelb", d.gelb.farbe);
    w.setProperty("--gruen", d.gruen.farbe);
  }

  // „Bewegung reduzieren“ (Betriebssystem-Einstellung oder ?ruhig=1)
  function bewegung() {
    var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    ZINE.bewegungReduziert = /[?&]ruhig=1/.test(location.search) || !!(mq && mq.matches);
    document.body.classList.toggle("ruhig", ZINE.bewegungReduziert);
  }

  function groesse() {
    ZINE.druck.groesse(window.innerWidth, window.innerHeight);
    if (ZINE.ebenen.station) ZINE.ebenen.himmelBauen();
  }

  function oberflaecheTexte() {
    var s = SPIEL.szene.station, T = DATA.texte;
    document.querySelector("#stationskarte .karte-titel").textContent = s.titel;
    document.querySelector("#stationskarte .karte-unter").textContent = s.land + " · " + s.tageszeit + " · " + s.thema;
    document.getElementById("stempel").textContent = T.stilprobe;
    document.getElementById("steuerung").textContent = T.steuerung;
    document.getElementById("geraet").setAttribute("aria-label", T.geraet);
    document.title = T.spielname + " – " + T.untertitel;
  }

  function start() {
    cssFarben();
    bewegung();
    ZINE.druck.init(leinwand);
    ZINE.druck.groesse(window.innerWidth, window.innerHeight);
    SPIEL.eingabe.init(leinwand);
    SPIEL.blasen.init();
    var param = /[?&]station=([a-z_]+)/.exec(location.search);
    SPIEL.szene.starten(param && DATA.stationen[param[1]] ? param[1] : "kiel");
    oberflaecheTexte();
    SPIEL.debug.init();

    var zeitGroesse = 0;
    window.addEventListener("resize", function () {
      clearTimeout(zeitGroesse);
      zeitGroesse = setTimeout(groesse, 120);
    });

    document.getElementById("geraet").addEventListener("click", function () {
      SPIEL.blasen.toast(DATA.texte.geraetSpaeter);
      this.blur();
    });

    var letzte = 0, steuerungWeg = false;
    function bild(jetzt) {
      requestAnimationFrame(bild);
      var dt = letzte ? Math.min(0.05, (jetzt - letzte) / 1000) : 1 / 60;
      letzte = jetzt;
      var E = SPIEL.eingabe;
      if (E.neu.geraet) SPIEL.blasen.toast(DATA.texte.geraetSpaeter);
      SPIEL.szene.update(dt);
      SPIEL.blasen.aktualisieren(dt);
      ZINE.ebenen.zeichnen(SPIEL.szene.kamX, SPIEL.szene.zeit, function (e, vx0, vx1) {
        SPIEL.szene.figurenZeichnen(e, vx0, vx1);
      });
      SPIEL.debug.bild(jetzt);
      if (!steuerungWeg && E.benutzt) {
        steuerungWeg = true;
        setTimeout(function () { document.getElementById("steuerung").classList.add("weg"); }, 2500);
      }
      E.bildEnde();
    }
    requestAnimationFrame(bild);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
