/* =====================================================================
   js/start.js – Start, Bildschleife, Eingaben, Einstellungen
   ---------------------------------------------------------------------
   Adressleisten-Parameter (zum Testen):
     ?debug=1          Debug-Modus
     ?stufe=ultra      Grafikstufe festlegen (ultra, hoch, mittel, niedrig)
     ?webgl=1          WebGL 1 erzwingen (Rückfall testen)
     ?modus=dokument   Dokumentmodus erzwingen (ohne WebGL)
     ?szene=buero      direkt ins Büro (Stil-Prototyp)
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
      ANSICHT.dokumentmodus.zeigen();
      DEBUG.init();
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
    if (url.get("szene") === "buero") { LOGIK.ablauf.kapitel(1); }
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

  X.groesse = function (erzwingen) {
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
    window.addEventListener("pointerdown", function (e) {
      erste();
      ANSICHT.tastatur = false;
      if (LOGIK.ablauf.modus === "titel" && (e.target === kanvas || e.target.id === "oberflaeche" || e.target.tagName === "MAIN")) LOGIK.ablauf.titelUeberspringen();
    }, true);
    window.addEventListener("keydown", function (e) {
      erste();
      if (e.key === "Tab") ANSICHT.tastatur = true;
      if (e.key === "Escape" && ANSICHT.menues.fensterZu()) { e.preventDefault(); return; }
      if (ANSICHT.menues.fensterOffen()) return;
      if (ANSICHT.leiste.taste(e)) { e.preventDefault(); return; }
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
    if (!start && !MOTOR.qualitaet.fest) {
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
    zeit: function () { return zeit; },
    probe: function (a) { LOGIK.ablauf.probe(a); }
  };

  return X;
})();

window.addEventListener("load", MEHRHEIT.start);
