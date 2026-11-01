/* =====================================================================
   js/ansicht/dokumentmodus.js – Rückfall ohne WebGL (Abschnitt 10.1)
   ---------------------------------------------------------------------
   Das Spiel bleibt als HTML spielbar: Gesetzestext, Halbrund als SVG,
   Gespräche mit Namen. Kein Spielinhalt steckt nur im 3D-Bild.
   Phase 1: Probe mit Artikel 4, Halbrund und Beispiel-Gespräch.
   ===================================================================== */
var ANSICHT = window.ANSICHT || {};

ANSICHT.dokumentmodus = (function () {
  var D = {};
  var auswahl = {};

  function el(tag, klasse, html) { var e = document.createElement(tag); if (klasse) e.className = klasse; if (html !== undefined) e.innerHTML = html; return e; }

  /* Halbrund als SVG: 60 Sitze, Form zeigt die Stimme (Ja = voll, Nein = leer, Enthaltung = halb) */
  function halbrundSvg(erg) {
    var ns = "http://www.w3.org/2000/svg", svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "-110 -105 220 112"); svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", LOGIK.mehrheit.alsText(erg));
    var reihen = [11, 14, 16, 19], radien = [45, 62, 79, 96], plaetze = [];
    reihen.forEach(function (n, r) { for (var s = 0; s < n; s++) { var w = Math.PI + 0.16 + (Math.PI - 0.32) * (s + 0.5) / n; plaetze.push({ w: w, r: radien[r] }); } });
    plaetze.sort(function (a, b) { return a.w - b.w || a.r - b.r; });
    var i = 0;
    DATA.fraktionen.slice().sort(function (a, b) { return a.sitzordnung - b.sitzordnung; }).forEach(function (f) {
      var e = erg.fraktionen[f.id];
      for (var k = 0; k < f.sitzeAusschuss; k++, i++) {
        var p = plaetze[i], c = document.createElementNS(ns, "circle");
        c.setAttribute("cx", (Math.cos(p.w) * p.r).toFixed(1)); c.setAttribute("cy", (Math.sin(p.w) * p.r).toFixed(1)); c.setAttribute("r", "5.2");
        var st = k < e.ja ? "ja" : (k < e.ja + e.enthaltung ? "enth" : "nein");
        c.setAttribute("stroke", f.farbe); c.setAttribute("stroke-width", "2");
        c.setAttribute("fill", st === "ja" ? f.farbe : (st === "enth" ? "url(#halb_" + f.id + ")" : "#fff"));
        svg.appendChild(c);
      }
      var defs = document.createElementNS(ns, "defs"), lg = document.createElementNS(ns, "linearGradient");
      lg.setAttribute("id", "halb_" + f.id); lg.setAttribute("x2", "0"); lg.setAttribute("y2", "1");
      [["0.5", f.farbe], ["0.5", "#fff"]].forEach(function (s) { var st = document.createElementNS(ns, "stop"); st.setAttribute("offset", s[0]); st.setAttribute("stop-color", s[1]); lg.appendChild(st); });
      defs.appendChild(lg); svg.appendChild(defs);
    });
    return svg;
  }

  D.zeigen = function (grund) {
    var T = DATA.texte, DM = T.dokumentmodus;
    document.body.classList.add("dokumentmodus");
    var w = document.getElementById("dokumentmodus");
    w.classList.remove("versteckt");
    w.innerHTML = "";
    w.appendChild(el("h1", "", T.spielTitel + " <small>" + T.untertitel + "</small>"));
    w.appendChild(el("p", "hinweisBox", DM.hinweis));
    w.appendChild(el("p", "klein", T.erfundenHinweis));
    var art = DATA.artikel[0];
    art.schrauben.forEach(function (s) { if (!auswahl[s.id]) auswahl[s.id] = s.start; });
    var blatt = el("section", "blattHtml");
    blatt.appendChild(el("div", "kopf", T.dokument.kopfLinks + " · " + T.dokument.kopfRechts));
    blatt.appendChild(el("h2", "", T.dokument.art));
    blatt.appendChild(el("p", "titel", LOGIK.text.ersetzen(T.dokument.titel)));
    blatt.appendChild(el("h3", "", LOGIK.text.ersetzen(art.titel)));
    art.schrauben.forEach(function (s, nr) {
      var o = s.optionen.filter(function (x) { return x.id === auswahl[s.id]; })[0];
      blatt.appendChild(el("p", "absatz", "(" + (nr + 1) + ") " + (o.streichen ? "<em>(gestrichen)</em>" : LOGIK.text.ersetzen(o.text))));
      var reihe = el("div", "reihe");
      reihe.setAttribute("role", "group"); reihe.setAttribute("aria-label", s.frage);
      s.optionen.forEach(function (op) {
        var b = el("button", "knopf segment", LOGIK.text.ersetzen(op.kurz));
        b.setAttribute("aria-pressed", String(op.id === auswahl[s.id]));
        b.addEventListener("click", function () { auswahl[s.id] = op.id; D.zeigen(grund); });
        reihe.appendChild(b);
      });
      blatt.appendChild(reihe);
    });
    w.appendChild(blatt);
    var erg = LOGIK.mehrheit.ausschuss(auswahl);
    var hb = el("section", "halbrundHtml");
    hb.appendChild(el("h2", "", DM.halbrundTitel));
    hb.appendChild(halbrundSvg(erg));
    var p = el("p", "", LOGIK.mehrheit.alsText(erg)); p.setAttribute("aria-live", "polite");
    hb.appendChild(p);
    var leg = el("ul", "legende");
    DATA.fraktionen.forEach(function (f) { leg.appendChild(el("li", "", '<span class="punkt" style="background:' + f.farbe + '"></span>' + f.name)); });
    hb.appendChild(leg);
    w.appendChild(hb);
    // Beispiel-Gespräch
    var g = DATA.gespraeche.probe_luca, gs = el("section", "gespraechHtml");
    gs.appendChild(el("h2", "", DM.gespraechTitel));
    var k = g.knoten[g.start], schutz = 0;
    while (k && schutz++ < 12) {
      var person = DATA.figuren.personen[k.sprecher];
      gs.appendChild(el("p", "", "<strong>" + person.name + "</strong> (" + person.rolle + "): " + LOGIK.text.ersetzen(k.text)));
      k = g.knoten[k.weiter || (k.antworten ? k.antworten[0].ziel : "ende")];
    }
    w.appendChild(gs);
  };

  return D;
})();
