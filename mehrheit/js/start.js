/* =====================================================================
   js/start.js – Start, Bildschleife, Eingaben, Einstellungen
   ---------------------------------------------------------------------
   Adressleisten-Parameter (zum Testen):
     ?debug=1          Debug-Modus
     ?stufe=ultra      Grafikstufe festlegen (ultra, hoch, mittel, niedrig)
     ?webgl=1          WebGL 1 erzwingen (Rückfall testen)
     ?modus=dokument   Dokumentmodus erzwingen (ohne WebGL)
     ?kapitel=4        direkt in ein Kapitel springen (1 bis 9, nur mit ?debug=1)
   ===================================================================== */
var MEHRHEIT = (function () {
  var X = {};
  var kanvas, kamera, letzte = 0, zeit = 0, laeuft = false, gestartet = false;
  var url = new URLSearchParams(location.search);
  var R = null;

  function cssVariablen() {
    var O = DATA.stil.oberflaeche, s = document.documentElement.style;
    s.setProperty("--akzent", O.akzent); s.setProperty("--schrift-ui", O.schriftUI); s.setProperty("--schrift-gesetz", O.schriftGesetz);
    s.setProperty("--schrift-zahlen", O.schriftZahlen); s.setProperty("--glas", O.glas); s.setProperty("--glas-rand", O.glasRand);
    s.setProperty("--text", O.text); s.setProperty("--rundung", O.rundung + "px");
  }

  X.start = function () {
    cssVariablen();
    DATA.einstellungenAktuell = LOGIK.speicher.einstellungenLaden();
    MOTOR.bewegungReduziert = !!DATA.einstellungenAktuell.bewegung;
    kanvas = document.getElementById("bild");
    var ok = url.get("modus") !== "dokument" && MOTOR.gl.init(kanvas, url.get("webgl") === "1");
    if (!ok) {
      // Dokumentmodus: ganzes Spiel als HTML, gleicher Ablauf ohne 3D-Welt
      ANSICHT.leiste.init();
      ANSICHT.menues.init();
      ANSICHT.dokumentmodus.zeigen();
      LOGIK.ablauf.ohne3D = true;
      kamera = ANSICHT.dokumentmodus.kamera();
      LOGIK.ablauf.init(kamera);
      X.einstellungenAnwenden(true);
      X.eingaben();
      window.addEventListener("pagehide", function () { LOGIK.speicher.speichern(); });
      document.addEventListener("visibilitychange", function () { if (document.hidden) LOGIK.speicher.speichern(); });
      var kap0 = parseInt(url.get("kapitel"), 10);
      if (url.get("debug") === "1" && kap0 >= 1 && kap0 <= 9) { DEBUG.beispielStand("mitte", kap0); LOGIK.ablauf.kapitel(kap0); }
      else LOGIK.ablauf.titel();
      ANSICHT.blende(false);
      DEBUG.init();
      ANSICHT.dokumentmodus.schleife();
      gestartet = true;
      return;
    }
    R = MOTOR.renderer;
    MOTOR.qualitaet.start(DATA.einstellungenAktuell.grafik);
    MOTOR.qualitaet.beiWechsel = X.stufeWechseln;
    X.motorInit();
    ANSICHT.leiste.init();
    ANSICHT.menues.init();
    kamera = new MOTOR.Kamera();
    LOGIK.ablauf.init(kamera);
    X.einstellungenAnwenden(true);
    X.eingaben();
    MOTOR.gl.beiVerlust = function () { laeuft = false; ANSICHT.menues.hinweis(DATA.texte.hinweise.kontextVerloren); };
    MOTOR.gl.beiNeuaufbau = function () {
      MOTOR.gl.zuruecksetzen(); X.motorInit(); X.groesse(true);
      LOGIK.ablauf.szeneNeuAufbauen(); laeuft = true;
    };
    window.addEventListener("resize", function () { X.groesse(); });
    X.groesse(true);
    var kap = parseInt(url.get("kapitel"), 10);
    if (url.get("debug") === "1" && kap >= 1 && kap <= 9) { DEBUG.beispielStand("mitte", kap); LOGIK.ablauf.kapitel(kap); }
    else LOGIK.ablauf.titel();
    ANSICHT.blende(false);
    DEBUG.init();
    if (!MOTOR.gl.webgl2 || !MOTOR.gl.hdr) setTimeout(function () { ANSICHT.menues.hinweis(DATA.texte.hinweise.webgl1); }, 1500);
    // Speichern bei Verlassen der Seite
    window.addEventListener("pagehide", function () { LOGIK.speicher.speichern(); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) LOGIK.speicher.speichern(); });
    laeuft = true; gestartet = true;
    requestAnimationFrame(X.bild);
  };

  X.motorInit = function () {
    var st = MOTOR.qualitaet.stufe();
    MOTOR.texturen.init(st.texturGroesse);
    R.init(st);
    MOTOR.post.init();
    if (MOTOR.gl.hdr) MOTOR.post.vorkompilieren();
  };

  /* Grafikstufe gewechselt (von Hand oder automatisch) */
  X.stufeWechseln = function (automatisch) {
    var st = MOTOR.qualitaet.stufe();
    R.setzeStufe(st);
    MOTOR.post.freigeben();
    MOTOR.texturen.init(st.texturGroesse);
    X.groesse(true);
    LOGIK.ablauf.szeneNeuAufbauen();
    if (automatisch) ANSICHT.menues.hinweis(DATA.texte.einstellungen.abgesenkt);
  };

  /* Sehr breite Bildschirme (z. B. 21:9): Spielfläche mittig mit höchstens diesem Seitenverhältnis,
     damit Bildausschnitt und Bedienfelder zusammenbleiben (Wert in data/stil.js) */
  X.spielflaeche = function () {
    var vb = window.innerWidth, vh = window.innerHeight, max = (DATA.stil.bildformat && DATA.stil.bildformat.maxSeitenverhaeltnis) || 2.05;
    var sb = vb, sx = 0;
    if (vb / vh > max) { sb = Math.round(vh * max); sx = Math.floor((vb - sb) / 2); }
    var st = document.documentElement.style;
    st.setProperty("--sb", sb + "px"); st.setProperty("--sx", sx + "px");
  };
  X.groesse = function (erzwingen) {
    X.spielflaeche();
    var b = kanvas.clientWidth || window.innerWidth, h = kanvas.clientHeight || window.innerHeight;
    var a = MOTOR.qualitaet.aufloesung(b, h);
    if (!erzwingen && kanvas.width === a.b && kanvas.height === a.h) return;
    kanvas.width = a.b; kanvas.height = a.h;
    R.groesse(a.b, a.h);
    MOTOR.post.verlaufLoeschen();
    // Hochformat: Bild etwas nach oben rücken, weil die Oberfläche unten liegt
    kamera.verschiebungY = a.h > a.b ? -0.18 : 0;
  };

  /* ---------- Bildschleife ---------- */
  X.bild = function (t) {
    requestAnimationFrame(X.bild);
    if (!laeuft || MOTOR.gl.verloren || X.angehalten) { letzte = t; return; }
    var dt = letzte ? Math.min(0.1, (t - letzte) / 1000) : 1 / 60;
    letzte = t;
    if (X.festesDt) dt = X.festesDt;
    X.einBild(dt);
  };
  X.einBild = function (dt) {
    var cpu0 = performance.now();
    zeit += dt;
    var sz = LOGIK.ablauf.szene;
    if (!sz) return;
    LOGIK.ablauf.schritt(dt);
    ANSICHT.leiste.schritt(dt);
    if (DEBUG.freieKamera) DEBUG.kameraSchritt(dt, kamera); else kamera.schritt(dt);
    WELT.szenen.aktualisieren(sz, dt, zeit);
    var st = MOTOR.qualitaet.stufe();
    MOTOR.qualitaet.gpuBeginn();
    kamera.aktualisieren(R.b, R.h, R.bildNr + 1, MOTOR.gl.hdr && st.kanten === "zeitlich", zeit);
    R.zeichne(sz, kamera);
    if (MOTOR.gl.hdr && R.ziele && R.ziele.haupt) MOTOR.post.ausfuehren(sz, kamera, dt, zeit);
    kamera.schnitt = false;
    MOTOR.qualitaet.gpuEnde();
    var cpu = performance.now() - cpu0;
    if (!X.festesDt) MOTOR.qualitaet.bild(dt);
    DEBUG.bild(dt, cpu);
    DEBUG.nachBild();
    X.bilder++;
  };
  X.bilder = 0;

  /* ---------- Eingaben ---------- */
  X.eingaben = function () {
    function erste() { if (MOTOR.ton) MOTOR.ton.starten(); }
    var zieh = null;
    function aufBild(e) { return e.target === kanvas || e.target.id === "oberflaeche" || e.target.tagName === "MAIN" || e.target.id === "hotspots"; }
    window.addEventListener("pointerdown", function (e) {
      erste();
      ANSICHT.tastatur = false;
      if (LOGIK.ablauf.modus === "titel" && aufBild(e)) LOGIK.ablauf.titelUeberspringen();
      // Kapitel 4: Gebäudemodell durch Ziehen drehen (Maus, Finger, Stift)
      if (LOGIK.ablauf.modus === "flure" && aufBild(e)) zieh = { x: e.clientX, id: e.pointerId };
    }, true);
    window.addEventListener("pointermove", function (e) {
      if (!zieh || e.pointerId !== zieh.id) return;
      var dx = e.clientX - zieh.x; zieh.x = e.clientX;
      LOGIK.ablauf.ziehDreh = (LOGIK.ablauf.ziehDreh || 0) + dx * 0.35;
    });
    function ziehEnde() { zieh = null; }
    window.addEventListener("pointerup", ziehEnde);
    window.addEventListener("pointercancel", ziehEnde);
    window.addEventListener("keydown", function (e) {
      erste();
      if (e.key === "Tab") ANSICHT.tastatur = true;
      if (e.target && e.target.tagName === "INPUT") return;
      if (ANSICHT.fuehrung.taste(e)) { e.preventDefault(); return; }
      // Pfeiltasten wechseln innerhalb einer Gruppe von Knöpfen (Optionen, Antworten, Menü)
      if (/^Arrow/.test(e.key) && e.target && e.target.tagName === "BUTTON" && e.target.closest) {
        var gruppe = e.target.closest(".segmente, .wahl-knoepfe, #leisteAntworten, #titelMenue, .reihe, .kartenreihe, #hotspots");
        if (gruppe) {
          var bs = Array.prototype.filter.call(gruppe.querySelectorAll("button"), function (b) { return !b.disabled && b.offsetParent !== null; });
          var i = bs.indexOf(e.target), d = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
          if (i >= 0 && bs.length > 1) { bs[(i + d + bs.length) % bs.length].focus(); e.preventDefault(); return; }
        }
      }
      var kk = document.getElementById("kapitelKarte");
      if (!kk.classList.contains("versteckt") && (e.key === "Enter" || e.key === " " || e.key === "Escape")) { kk.click(); e.preventDefault(); return; }
      if (e.key === "Escape" && ANSICHT.menues.fensterZu()) { e.preventDefault(); return; }
      if (ANSICHT.menues.fensterOffen()) return;
      if (ANSICHT.leiste.taste(e)) { e.preventDefault(); return; }
      if (ANSICHT.wahlTaste(e)) { e.preventDefault(); return; }
      if (ANSICHT.editor.taste(e)) { e.preventDefault(); return; }
      if ((e.key === "d" || e.key === "D") && !e.ctrlKey && !e.metaKey && LOGIK.ablauf.modus !== "titel" && !LOGIK.gespraech.aktiv &&
          !document.getElementById("kopfKnoepfe").classList.contains("versteckt")) { ANSICHT.dossier.oeffnen(); e.preventDefault(); return; }
      if (LOGIK.ablauf.modus === "titel" && e.key !== "Tab" && e.key !== "Shift") LOGIK.ablauf.titelUeberspringen();
    });
  };

  /* ---------- Einstellungen anwenden (Abschnitt 9) ---------- */
  X.einstellungenAnwenden = function (start) {
    var E = DATA.einstellungenAktuell;
    document.body.classList.toggle("kontrast", !!E.kontrast);
    document.body.classList.toggle("ruhig", !!E.bewegung);
    document.documentElement.style.setProperty("--faktor", (E.schrift || 100) / 100);
    MOTOR.bewegungReduziert = !!E.bewegung;
    MOTOR.post.einstellungen.tiefe = !!E.tiefe && !E.kontrast;
    MOTOR.post.einstellungen.korn = !!E.korn && !E.kontrast;
    MOTOR.post.einstellungen.helligkeit = E.helligkeit || 1;
    MOTOR.einstellungHelligkeit = E.helligkeit || 1;
    if (MOTOR.ton) MOTOR.ton.einstellen(!!E.ton, E.lautMusik, E.lautGeraeusche);
    if (!start && !MOTOR.qualitaet.fest && !LOGIK.ablauf.ohne3D) {
      var Q = MOTOR.qualitaet, vorher = Q.name;
      if (E.grafik === "auto") { if (!Q.auto) Q.waehle("auto"); }
      else if (E.grafik !== Q.name || Q.auto) { Q.waehle(E.grafik); }
      if (Q.name !== vorher) X.stufeWechseln(false);
    }
    LOGIK.speicher.einstellungenSpeichern(E);
  };

  /* ---------- Hilfen für automatische Tests (Playwright) ---------- */
  X.test = {
    bereit: function () { return gestartet && !!LOGIK.ablauf.szene; },
    dokumentmodus: function () { return !!LOGIK.ablauf.ohne3D; },
    kamera: function (e) { kamera.setze(e); MOTOR.post.verlaufLoeschen(); },
    titelEnde: function () { var F = DATA.kameras.fahrten.titel; kamera.setze(F.punkte[F.punkte.length - 1]); WELT.szenen.titelUeberspringen(LOGIK.ablauf.szene); },
    anhalten: function () { X.angehalten = true; },
    oberflaeche: function (an) { document.getElementById("oberflaeche").style.visibility = an ? "" : "hidden"; var d = document.getElementById("debugFeld"); if (d) d.style.visibility = an ? "" : "hidden"; },
    weiter: function () { X.angehalten = false; },
    /* n Bilder sofort rechnen (für Standbilder auf langsamen Rechnern); liefert ms pro Bild */
    rendern: function (n, dt) {
      var gl = MOTOR.gl.gl, px = new Uint8Array(4), zeiten = [];
      for (var i = 0; i < n; i++) { var t0 = performance.now(); X.einBild(dt || 1 / 30); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); zeiten.push(performance.now() - t0); }
      zeiten.sort(function (a, b) { return a - b; });
      return zeiten[Math.floor(zeiten.length / 2)];
    },
    titelZeit: function (t) { var sz = LOGIK.ablauf.szene; if (sz && sz.titel) sz.titel.zeit = t; if (kamera.fahrt) kamera.fahrt.t = t; },
    festesDt: function (dt) { X.festesDt = dt; },
    szene: function (name, extra) { LOGIK.ablauf.testSzene(name, extra); },
    zeit: function () { return zeit; }
  };

  return X;
})();

window.addEventListener("load", MEHRHEIT.start);
