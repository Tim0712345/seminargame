/* =====================================================================
   js/ansicht/menues.js – Titelmenü, Einstellungen, Über das Spiel,
   Kapitelkarte, Hinweise und die Bedienleiste des Phase-1-Prototyps
   ---------------------------------------------------------------------
   Touch-Regeln (Abschnitt 10.3): Knöpfe werden nie beim Überfahren neu
   gebaut. Hover-Effekte nur bei pointerType "mouse" (Klasse .hover).
   ===================================================================== */
var ANSICHT = window.ANSICHT || {};

/* Hover nur mit der Maus (sonst verschluckt Safari auf dem iPad den ersten Tipp) */
ANSICHT.hover = function (b) {
  if (!b || b._hover) return;
  b._hover = true;
  b.addEventListener("pointerover", function (e) { if (e.pointerType === "mouse") b.classList.add("hover"); });
  b.addEventListener("pointerout", function () { b.classList.remove("hover"); });
};

ANSICHT.szenenText = function (t) { var e = document.getElementById("szenenText"); if (e) e.textContent = t; };
ANSICHT.halbrundText = function (t) { var e = document.getElementById("halbrundText"); if (e) e.textContent = t; };

/* Weiche Abblende über Schwarz */
ANSICHT.blende = function (zu, fertig) {
  var b = document.getElementById("blende");
  b.classList.toggle("zu", zu);
  if (fertig) setTimeout(fertig, MOTOR.bewegungReduziert ? 120 : 650);
};

ANSICHT.menues = (function () {
  var Mn = {};
  var T = DATA.texte;
  function hol(id) { return document.getElementById(id); }
  function knopf(text, aktion, klasse) {
    var b = document.createElement("button");
    b.className = "knopf " + (klasse || "");
    b.innerHTML = text;
    b.addEventListener("click", function (e) { if (MOTOR.ton) MOTOR.ton.spiele("klick"); aktion(e); });
    ANSICHT.hover(b);
    return b;
  }

  /* ---------- Titelmenü ---------- */
  Mn.titelZeigen = function () {
    var nav = hol("titelMenue");
    nav.innerHTML = "";
    var h = document.createElement("h1"); h.className = "nur-vorleser"; h.textContent = T.spielTitel + " – " + T.untertitel; nav.appendChild(h);
    if (LOGIK.speicher.vorhanden()) nav.appendChild(knopf(T.menue.weiterspielen, function () { LOGIK.ablauf.weiterspielen(); }, "haupt"));
    nav.appendChild(knopf(T.menue.neu, function () {
      if (LOGIK.speicher.vorhanden()) Mn.rueckfrage(T.menue.rueckfrageNeu, function () { LOGIK.ablauf.neueLegislatur(); });
      else LOGIK.ablauf.neueLegislatur();
    }, LOGIK.speicher.vorhanden() ? "" : "haupt"));
    nav.appendChild(knopf(T.menue.einstellungen, function () { Mn.einstellungen(); }));
    nav.appendChild(knopf(T.menue.ueber, function () { Mn.ueber(); }));
    if (!LOGIK.speicher.moeglich) { var p = document.createElement("p"); p.className = "klein"; p.textContent = T.menue.speichernNichtMoeglich; nav.appendChild(p); }
    nav.classList.remove("versteckt");
    hol("erfundenHinweis").textContent = T.erfundenHinweis;
    hol("erfundenHinweis").classList.remove("versteckt");
    hol("titelTipp").textContent = MOTOR.bewegungReduziert ? "" : T.menue.weiterTippen;
    hol("titelTipp").classList.remove("versteckt");
    setTimeout(function () { hol("titelTipp").classList.add("versteckt"); }, 9000);
    hol("kopfKnoepfe").classList.add("versteckt");
  };
  Mn.titelVerbergen = function () {
    hol("titelMenue").classList.add("versteckt");
    hol("erfundenHinweis").classList.add("versteckt");
    hol("titelTipp").classList.add("versteckt");
  };

  /* ---------- Fenster (Dialoge) ---------- */
  var offenesFenster = null, vorherFokus = null;
  function fensterOeffnen(titel, inhalt) {
    var f = hol("fenster");
    hol("fensterTitel").textContent = titel;
    var i = hol("fensterInhalt"); i.innerHTML = ""; i.appendChild(inhalt);
    f.classList.remove("versteckt");
    offenesFenster = f; vorherFokus = document.activeElement;
    var z = hol("fensterZu"); z.setAttribute("aria-label", T.einstellungen.schliessen); z.title = T.einstellungen.schliessen;
    setTimeout(function () { var erster = i.querySelector("button, input"); (erster || z).focus({ preventScroll: true }); }, 30);
  }
  Mn.fensterZu = function () {
    if (!offenesFenster) return false;
    offenesFenster.classList.add("versteckt"); offenesFenster = null;
    if (vorherFokus && vorherFokus.focus) vorherFokus.focus({ preventScroll: true });
    return true;
  };
  Mn.fensterOffen = function () { return !!offenesFenster; };

  Mn.rueckfrage = function (text, ja) {
    var d = document.createElement("div");
    var p = document.createElement("p"); p.textContent = text; d.appendChild(p);
    var r = document.createElement("div"); r.className = "reihe";
    r.appendChild(knopf(T.menue.ja, function () { Mn.fensterZu(); ja(); }, "haupt"));
    r.appendChild(knopf(T.menue.nein, function () { Mn.fensterZu(); }));
    d.appendChild(r);
    fensterOeffnen(T.menue.neu, d);
  };

  Mn.ueber = function () {
    var d = document.createElement("div");
    T.ueber.absaetze.forEach(function (a) { var p = document.createElement("p"); p.innerHTML = LOGIK.text.ersetzen(a); d.appendChild(p); });
    fensterOeffnen(T.ueber.titel, d);
  };

  /* ---------- Einstellungen (Abschnitt 9) ---------- */
  Mn.einstellungen = function () {
    var E = DATA.einstellungenAktuell, TE = T.einstellungen;
    var d = document.createElement("div"); d.className = "einstellungen";
    function gruppe(titel, werte, aktuell, setzen) {
      var g = document.createElement("div"); g.className = "gruppe"; g.setAttribute("role", "group"); g.setAttribute("aria-label", titel);
      var l = document.createElement("div"); l.className = "beschriftung"; l.textContent = titel; g.appendChild(l);
      var r = document.createElement("div"); r.className = "segmente";
      werte.forEach(function (w) {
        var b = knopf(w[1], function () {
          setzen(w[0]);
          Array.prototype.forEach.call(r.children, function (c) { c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
          MEHRHEIT.einstellungenAnwenden();
        }, "segment");
        b.setAttribute("aria-pressed", String(aktuell() === w[0]));
        r.appendChild(b);
      });
      g.appendChild(r); d.appendChild(g);
    }
    function regler(titel, min, max, schritt, aktuell, setzen) {
      var g = document.createElement("label"); g.className = "gruppe";
      var l = document.createElement("span"); l.className = "beschriftung"; l.textContent = titel; g.appendChild(l);
      var i = document.createElement("input"); i.type = "range"; i.min = min; i.max = max; i.step = schritt; i.value = aktuell();
      i.addEventListener("input", function () { setzen(parseFloat(i.value)); MEHRHEIT.einstellungenAnwenden(); });
      g.appendChild(i); d.appendChild(g);
    }
    var AN = [[true, TE.an], [false, TE.aus]];
    var stufen = MOTOR.gl.webgl2 && MOTOR.gl.hdr ? ["auto", "ultra", "hoch", "mittel", "niedrig"] : ["niedrig"];
    gruppe(TE.grafik, stufen.map(function (s) { return [s, TE.grafikStufen[s]]; }), function () { return E.grafik; }, function (v) { E.grafik = v; });
    gruppe(TE.tiefe, AN, function () { return E.tiefe; }, function (v) { E.tiefe = v; });
    gruppe(TE.korn, AN, function () { return E.korn; }, function (v) { E.korn = v; });
    regler(TE.helligkeit, 0.7, 1.3, 0.05, function () { return E.helligkeit; }, function (v) { E.helligkeit = v; });
    gruppe(TE.ton, AN, function () { return E.ton; }, function (v) { E.ton = v; });
    regler(TE.lautMusik, 0, 1, 0.05, function () { return E.lautMusik; }, function (v) { E.lautMusik = v; });
    regler(TE.lautGeraeusche, 0, 1, 0.05, function () { return E.lautGeraeusche; }, function (v) { E.lautGeraeusche = v; });
    gruppe(TE.schrift, [[100, "100 %"], [120, "120 %"], [140, "140 %"]], function () { return E.schrift; }, function (v) { E.schrift = v; });
    gruppe(TE.kontrast, AN, function () { return E.kontrast; }, function (v) { E.kontrast = v; });
    gruppe(TE.bewegung, AN, function () { return E.bewegung; }, function (v) { E.bewegung = v; });
    gruppe(TE.schreibmaschine, [["langsam", TE.langsam], ["normal", TE.normal], ["schnell", TE.schnell], ["sofort", TE.sofort]], function () { return E.schreibmaschine; }, function (v) { E.schreibmaschine = v; });
    gruppe(TE.lesehilfe, AN, function () { return E.lesehilfe; }, function (v) { E.lesehilfe = v; });
    if (LOGIK.ablauf.modus === "buero") {
      var r = document.createElement("div"); r.className = "reihe";
      r.appendChild(knopf(T.probe.titel_zurueck, function () { Mn.fensterZu(); LOGIK.ablauf.zumTitel(); }));
      d.appendChild(r);
    }
    fensterOeffnen(TE.titel, d);
  };

  /* ---------- Hinweis (z. B. Grafikstufe gesenkt) ---------- */
  var hinweisZeit = null;
  Mn.hinweis = function (text) {
    var h = hol("hinweis");
    h.textContent = text; h.classList.remove("versteckt");
    if (hinweisZeit) clearTimeout(hinweisZeit);
    hinweisZeit = setTimeout(function () { h.classList.add("versteckt"); }, 4500);
  };

  /* ---------- Kapitelkarte ---------- */
  Mn.kapitelKarte = function (nr, fertig) {
    var k = DATA.texte.kapitel[nr - 1];
    var el = hol("kapitelKarte");
    el.innerHTML = '<div class="kapitelNr">' + (DATA.texte.kapitelWort || "") + " " + nr + '</div><h2>' + LOGIK.text.ersetzen(k.titel) + '</h2><div class="kapitelTag">' + LOGIK.text.ersetzen(k.tag) + '</div><p>' + LOGIK.text.ersetzen(k.zeile) + "</p>";
    el.classList.remove("versteckt");
    document.body.classList.add("unscharf");
    var dauer = MOTOR.bewegungReduziert ? 2200 : 3400;
    var weg = function () {
      el.classList.add("versteckt"); document.body.classList.remove("unscharf");
      el.removeEventListener("click", weg);
      if (fertig) { var f = fertig; fertig = null; f(); }
    };
    el.addEventListener("click", weg);
    setTimeout(weg, dauer);
  };

  /* ---------- Bedienleiste des Prototyps (Phase 1) ---------- */
  Mn.probeZeigen = function () {
    var p = hol("probe"), P = T.probe;
    p.innerHTML = "";
    var h = document.createElement("h2"); h.textContent = P.titel; p.appendChild(h);
    var e = document.createElement("p"); e.className = "klein"; e.textContent = P.erklaerung; p.appendChild(e);
    var r = document.createElement("div"); r.className = "probeKnoepfe";
    [["totale", P.totale], ["gespraech", P.gespraech], ["dokument", P.dokument], ["halbrund", P.halbrund], ["option", P.option],
     ["umblaettern", P.umblaettern], ["stempel", P.stempel], ["licht", P.licht + " " + (LOGIK.ablauf.stimmungB === "buero_morgen" ? "3" : "1")]].forEach(function (a) {
      var b = knopf(a[1], function () { LOGIK.ablauf.probe(a[0]); });
      b.dataset.aktion = a[0];
      r.appendChild(b);
    });
    p.appendChild(r);
    p.classList.remove("versteckt");
    hol("kopfKnoepfe").classList.remove("versteckt");
  };
  Mn.probeAktualisieren = function () {
    var b = document.querySelector('#probe [data-aktion="licht"]');
    if (b) b.textContent = T.probe.licht + " " + (LOGIK.ablauf.stimmungB === "buero_morgen" ? "3" : "1");
  };
  Mn.probeVerbergen = function () { hol("probe").classList.add("versteckt"); hol("kopfKnoepfe").classList.add("versteckt"); };

  Mn.init = function () {
    var z = hol("fensterZu");
    z.addEventListener("click", function () { Mn.fensterZu(); });
    ANSICHT.hover(z);
    var pause = hol("knopfPause");
    pause.setAttribute("aria-label", T.einstellungen.titel); pause.title = T.einstellungen.titel;
    pause.addEventListener("click", function () { Mn.einstellungen(); });
    ANSICHT.hover(pause);
  };

  return Mn;
})();
