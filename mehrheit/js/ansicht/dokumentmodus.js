/* =====================================================================
   js/ansicht/dokumentmodus.js – Rückfall ohne WebGL (Abschnitt 10.1)
   ---------------------------------------------------------------------
   Das ganze Spiel bleibt als HTML spielbar: derselbe Ablauf wie mit 3D
   (LOGIK.ablauf mit ohne3D = true), nur statt des 3D-Bilds eine Seite mit
   Ort und Kapitel, dem Halbrund als SVG und dem Gesetzestext als Blatt.
   Gespräche, Auswahl, Entwurf, Trilog-Tabelle, Epilog und Vergleich sind
   ohnehin HTML. Kein Spielinhalt steckt nur im 3D-Bild.
   ===================================================================== */
var ANSICHT = window.ANSICHT || {};

ANSICHT.dokumentmodus = (function () {
  var D = { an: false };

  function el(tag, klasse, html) { var e = document.createElement(tag); if (klasse) e.className = klasse; if (html !== undefined) e.innerHTML = html; return e; }
  function hol(id) { return document.getElementById(id); }

  /* Halbrund als SVG. Form zeigt die Stimme (Ja = voll, Nein = leer, Enthaltung = halb),
     damit es auch ohne Farben lesbar ist. feld: "sitzeAusschuss" (60) oder "sitzePlenum" (120). */
  function halbrundSvg(erg, feld) {
    var ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "-110 -105 220 112"); svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", LOGIK.mehrheit.alsText(erg));
    var gross = feld === "sitzePlenum";
    var reihen = gross ? [15, 17, 19, 21, 23, 25] : [11, 14, 16, 19], radien = gross ? [40, 51, 62, 73, 84, 95] : [45, 62, 79, 96], plaetze = [];
    reihen.forEach(function (n, r) { for (var s = 0; s < n; s++) { var w = Math.PI + 0.16 + (Math.PI - 0.32) * (s + 0.5) / n; plaetze.push({ w: w, r: radien[r] }); } });
    plaetze.sort(function (a, b) { return a.w - b.w || a.r - b.r; });
    var defs = document.createElementNS(ns, "defs"); svg.appendChild(defs);
    var i = 0, rad = gross ? 3.6 : 5.2;
    DATA.fraktionen.slice().sort(function (a, b) { return a.sitzordnung - b.sitzordnung; }).forEach(function (f) {
      var lg = document.createElementNS(ns, "linearGradient");
      lg.setAttribute("id", "halb_" + f.id); lg.setAttribute("x2", "0"); lg.setAttribute("y2", "1");
      [["0.5", f.farbe], ["0.5", "#fff"]].forEach(function (s) { var st = document.createElementNS(ns, "stop"); st.setAttribute("offset", s[0]); st.setAttribute("stop-color", s[1]); lg.appendChild(st); });
      defs.appendChild(lg);
      var e = erg.fraktionen[f.id];
      for (var k = 0; k < f[feld] && i < plaetze.length; k++, i++) {
        var p = plaetze[i], c = document.createElementNS(ns, "circle");
        c.setAttribute("cx", (Math.cos(p.w) * p.r).toFixed(1)); c.setAttribute("cy", (Math.sin(p.w) * p.r).toFixed(1)); c.setAttribute("r", rad);
        var st = k < e.ja ? "ja" : (k < e.ja + e.enthaltung ? "enth" : "nein");
        c.setAttribute("stroke", f.farbe); c.setAttribute("stroke-width", gross ? "1.5" : "2");
        c.setAttribute("fill", st === "ja" ? f.farbe : (st === "enth" ? "url(#halb_" + f.id + ")" : "#fff"));
        svg.appendChild(c);
      }
    });
    // Linie der Mehrheit
    var l = document.createElementNS(ns, "line");
    l.setAttribute("x1", "0"); l.setAttribute("y1", "-104"); l.setAttribute("x2", "0"); l.setAttribute("y2", "-30");
    l.setAttribute("stroke", erg.mehrheit ? DATA.stil.oberflaeche.akzent : "#999"); l.setAttribute("stroke-dasharray", "3 3"); l.setAttribute("stroke-width", "1.2");
    svg.appendChild(l);
    return svg;
  }

  /* Seite aufbauen (einmal beim Start) */
  D.zeigen = function () {
    var T = DATA.texte, DM = T.dokumentmodus;
    D.an = true;
    document.body.classList.add("dokumentmodus");
    var w = hol("dokumentmodus");
    w.classList.remove("versteckt");
    w.innerHTML = "";
    w.appendChild(el("h1", "", T.spielTitel + " <small>" + T.untertitel + "</small>"));
    w.appendChild(el("p", "hinweisBox", DM.hinweis));
    var sz = el("section", "dmSzene"); sz.id = "dmSzene";
    sz.appendChild(el("h2", "", "")); sz.appendChild(el("p", "", ""));
    w.appendChild(sz);
    var hb = el("section", "halbrundHtml versteckt"); hb.id = "dmHalbrund";
    hb.appendChild(el("h2", "", DM.halbrundTitel));
    hb.appendChild(el("div", "dmSvg"));
    var p = el("p", "dmText"); p.setAttribute("aria-live", "polite"); hb.appendChild(p);
    var leg = el("ul", "legende");
    DATA.fraktionen.forEach(function (f) { leg.appendChild(el("li", "", '<span class="punkt" style="background:' + f.farbe + '"></span>' + f.name)); });
    hb.appendChild(leg);
    w.appendChild(hb);
    // Gesetzesblatt: dieselbe HTML-Seite wie über dem 3D-Papier, hier flach im Textfluss
    var platz = el("section", "dmBlatt"); platz.id = "dmBlatt";
    platz.appendChild(hol("blattHtml"));
    w.appendChild(platz);
    w.appendChild(el("p", "klein dmErfunden", T.erfundenHinweis));
  };

  /* Ort und Kapitel (statt des 3D-Bilds) */
  D.szene = function (name) {
    if (!D.an) return;
    var s = hol("dmSzene"), st = LOGIK.stand, k = DATA.texte.kapitel[(st.kapitel || 1) - 1];
    var titel = LOGIK.ablauf.modus === "titel" ? DATA.texte.dokumentmodus.titel : (k ? DATA.texte.kapitelWort + " " + st.kapitel + " – " + LOGIK.text.ersetzen(k.titel, true) : "");
    s.querySelector("h2").textContent = titel;
    s.querySelector("p").textContent = DATA.texte.szenen[DATA.szenen[name] ? DATA.szenen[name].beschreibung : name] || "";
    var mitHalbrund = { buero: 1, ausschusssaal: 1, plenum: 1, gebaeude: 1 };
    hol("dmHalbrund").classList.toggle("versteckt", !mitHalbrund[name] || LOGIK.ablauf.modus === "anhoerung" || LOGIK.ablauf.modus === "k1");
    if (mitHalbrund[name]) D.halbrund(name === "plenum" ? LOGIK.mehrheit.plenum(LOGIK.entwurf()) : LOGIK.mehrheit.ausschuss(LOGIK.entwurf()), name === "plenum" ? "sitzePlenum" : "sitzeAusschuss");
    window.scrollTo(0, 0);
  };

  /* Halbrund neu zeichnen (nach jeder Änderung im Entwurf und bei Abstimmungen) */
  D.halbrund = function (erg, feld) {
    if (!D.an) return;
    feld = feld || (LOGIK.ablauf.modus === "plenum" ? "sitzePlenum" : "sitzeAusschuss");
    var hb = hol("dmHalbrund");
    hb.querySelector("h2").textContent = feld === "sitzePlenum" ? DATA.texte.dokumentmodus.plenumTitel : DATA.texte.dokumentmodus.halbrundTitel;
    var c = hb.querySelector(".dmSvg"); c.innerHTML = ""; c.appendChild(halbrundSvg(erg, feld));
    hb.querySelector(".dmText").textContent = LOGIK.mehrheit.alsText(erg);
  };

  /* Abstimmung: Ergebnis zeigen, Dauer für den Zähler zurückgeben */
  D.abstimmung = function (erg, feld) {
    var hb = hol("dmHalbrund"); hb.classList.remove("versteckt");
    D.halbrund(erg, feld);
    hb.scrollIntoView({ block: "start" });
    return MOTOR.bewegungReduziert ? 0.5 : 2.5;
  };

  /* Bildschleife ohne 3D: nur Schreibmaschine der Gesprächsleiste */
  D.schleife = function () {
    var letzte = 0;
    function bild(t) {
      requestAnimationFrame(bild);
      var dt = letzte ? Math.min(0.1, (t - letzte) / 1000) : 1 / 60; letzte = t;
      ANSICHT.leiste.schritt(dt);
    }
    requestAnimationFrame(bild);
  };

  /* Ersatz für die Kamera: nimmt alle Befehle an und tut nichts */
  D.kamera = function () {
    var k = { pos: [0, 0, 0], ziel: [0, 0, -1], fahrt: null };
    ["setze", "fahreZu", "starteFahrt", "schaerfeZiehen", "schritt", "aktualisieren"].forEach(function (n) { k[n] = function () {}; });
    return k;
  };

  return D;
})();
