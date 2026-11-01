/* =====================================================================
   js/ansicht/leiste.js – Gesprächsleiste am unteren Rand (Abschnitt 5.5, 7.10)
   ---------------------------------------------------------------------
   Name und Rolle der sprechenden Figur, Text (Schreibmaschine, abschaltbar),
   zwei bis drei Antwortknöpfe. Die Figur selbst sieht man im 3D-Bild.
   Tasten: 1–3 wählen Antworten, Leertaste zeigt den Text sofort,
   Enter = weiter, Esc beendet das Gespräch.
   ===================================================================== */
var ANSICHT = window.ANSICHT || {};

ANSICHT.leiste = (function () {
  var L = { offen: false, zeichen: 0, voll: "", fertig: true, n: null };
  var el = {};

  function hol(id) { return document.getElementById(id); }

  L.init = function () {
    el.box = hol("leiste"); el.name = hol("leisteName"); el.rolle = hol("leisteRolle");
    el.text = hol("leisteText"); el.antworten = hol("leisteAntworten"); el.weiter = hol("leisteWeiter"); el.zu = hol("leisteZu");
    el.weiter.textContent = DATA.texte.leiste.weiter;
    el.zu.setAttribute("aria-label", DATA.texte.leiste.schliessen);
    el.zu.title = DATA.texte.leiste.schliessen;
    el.text.addEventListener("click", function () { L.tippen(); });
    el.weiter.addEventListener("click", function () { L.tippen(); });
    el.zu.addEventListener("click", function () { if (LOGIK.gespraech.aktiv && LOGIK.gespraech.aktiv.abbrechbar === false) return; LOGIK.gespraech.beenden(); });
    ANSICHT.hover(el.weiter); ANSICHT.hover(el.zu);
  };

  function tempo() {
    var e = DATA.einstellungenAktuell || {};
    if (MOTOR.bewegungReduziert || e.schreibmaschine === "sofort") return 1e9;
    return e.schreibmaschine === "langsam" ? 24 : (e.schreibmaschine === "schnell" ? 95 : 48);
  }

  L.knoten = function (n) {
    var p = DATA.figuren.personen[n.sprecher] || { name: "", rolle: "" };
    L.n = n; L.offen = true;
    el.box.classList.remove("versteckt");
    el.name.textContent = LOGIK.text.ersetzen(p.name, true);
    el.rolle.textContent = p.rolle + (p.land ? " · " + p.land : "");
    L.voll = LOGIK.text.ersetzen(n.text);
    L.klar = LOGIK.text.ersetzen(n.text, true);
    L.zeichen = 0; L.fertig = false;
    el.text.innerHTML = "";
    el.text.setAttribute("aria-label", LOGIK.text.ersetzen(p.name, true) + ": " + L.klar);
    el.antworten.innerHTML = "";
    el.antworten.classList.add("versteckt");
    el.weiter.classList.add("versteckt");
    el.zu.classList.toggle("versteckt", !!(LOGIK.gespraech.aktiv && LOGIK.gespraech.aktiv.folge));
    if (tempo() > 1e8) L.fertigZeigen();
  };

  L.fertigZeigen = function () {
    if (!L.n) return;
    L.fertig = true;
    el.text.innerHTML = L.voll;
    var n = L.n;
    if (n.antworten) {
      el.antworten.innerHTML = "";
      n.antworten.forEach(function (a, i) {
        var b = document.createElement("button");
        b.className = "antwort knopf";
        b.innerHTML = '<span class="nr" aria-hidden="true">' + (i + 1) + "</span>" + LOGIK.text.ersetzen(a.text);
        b.addEventListener("click", function () { LOGIK.gespraech.antworte(i); });
        ANSICHT.hover(b);
        el.antworten.appendChild(b);
      });
      el.antworten.classList.remove("versteckt");
      var erste = el.antworten.querySelector("button");
      if (erste && ANSICHT.tastatur) erste.focus({ preventScroll: true });
    } else {
      el.weiter.classList.remove("versteckt");
      if (ANSICHT.tastatur) el.weiter.focus({ preventScroll: true });
    }
  };

  /* Klick auf den Text: erst alles zeigen, dann weiter */
  L.tippen = function () {
    if (!L.offen) return;
    if (!L.fertig) { L.fertigZeigen(); return; }
    if (L.n && !L.n.antworten) LOGIK.gespraech.weiter();
  };

  L.schritt = function (dt) {
    if (!L.offen || L.fertig) return;
    L.zeichen += dt * tempo();
    var anz = Math.floor(L.zeichen);
    if (anz >= L.klar.length) { L.fertigZeigen(); return; }
    el.text.textContent = L.klar.substr(0, anz);
  };

  L.taste = function (e) {
    if (!L.offen) return false;
    if (e.key === "Escape") { if (!(LOGIK.gespraech.aktiv && LOGIK.gespraech.aktiv.folge)) LOGIK.gespraech.beenden(); return true; }
    if (e.key === " " || e.key === "Enter") {
      if (document.activeElement && document.activeElement.classList.contains("antwort") && e.key === "Enter") return false;
      L.tippen(); return true;
    }
    var z = parseInt(e.key, 10);
    if (z >= 1 && z <= 3 && L.fertig && L.n && L.n.antworten) { LOGIK.gespraech.antworte(z - 1); return true; }
    return false;
  };

  L.ausblenden = function () {
    L.offen = false; L.n = null;
    el.box.classList.add("versteckt");
  };

  return L;
})();

/* =====================================================================
   Fraktionsleiste, Wirkungsanzeige, Dossier, Auswahlfeld, Hinweise
   ===================================================================== */
ANSICHT.MUSTER_SVG = function (muster, farbe) {
  var f = farbe, w = "#ffffff";
  var p = {
    streifen: '<rect width="20" height="20" fill="' + f + '"/><path d="M0 20L20 0M-5 5L5 -5M15 25L25 15" stroke="' + w + '" stroke-width="3"/>',
    punkte: '<rect width="20" height="20" fill="' + f + '"/><circle cx="5" cy="5" r="2.5" fill="' + w + '"/><circle cx="15" cy="15" r="2.5" fill="' + w + '"/>',
    karo: '<rect width="20" height="20" fill="' + f + '"/><rect width="10" height="10" fill="' + w + '" opacity="0.55"/><rect x="10" y="10" width="10" height="10" fill="' + w + '" opacity="0.55"/>',
    wellen: '<rect width="20" height="20" fill="' + f + '"/><path d="M0 7Q5 2 10 7T20 7M0 16Q5 11 10 16T20 16" stroke="' + w + '" stroke-width="2" fill="none"/>',
    dreiecke: '<rect width="20" height="20" fill="' + f + '"/><path d="M2 17L8 5L14 17Z" fill="' + w + '" opacity="0.7"/>',
    voll: '<rect width="20" height="20" fill="' + f + '"/>',
    rauten: '<rect width="20" height="20" fill="' + f + '"/><path d="M10 2L18 10L10 18L2 10Z" fill="' + w + '" opacity="0.6"/>'
  };
  return '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" class="muster">' + (p[muster] || p.voll) + "</svg>";
};

/* Fraktionsleiste: Farbe, Muster, erwartete Stimmen, Vertrauen */
ANSICHT.fraktionsleiste = (function () {
  var F = {};
  F.zeigen = function (an) { document.getElementById("fraktionsleiste").classList.toggle("versteckt", !an); if (an) F.aktualisieren(); };
  F.aktualisieren = function (erg, vorschau) {
    var el = document.getElementById("fraktionsleiste");
    if (!el || el.classList.contains("versteckt")) return;
    erg = erg || LOGIK.mehrheit.ausschuss(LOGIK.entwurf());
    var html = '<div class="fl-kopf"><span>' + DATA.texte.leisten.fraktionen + '</span><strong class="' + (erg.mehrheit ? "ja" : "nein") + '">' +
      erg.ja + " : " + erg.nein + " : " + erg.enthaltung + " – " + (erg.mehrheit ? DATA.texte.halbrund.mehrheit : DATA.texte.halbrund.keineMehrheit) + "</strong></div><ul>";
    DATA.fraktionen.slice().sort(function (a, b) { return a.sitzordnung - b.sitzordnung; }).forEach(function (f) {
      var e = erg.fraktionen[f.id], n = f.sitzeAusschuss, v = LOGIK.stand.vertrauen[f.id] || 0;
      var vw = vorschau && vorschau.fraktionen[f.id] ? vorschau.fraktionen[f.id].ja - e.ja : 0;
      html += '<li title="' + f.name + '">' + ANSICHT.MUSTER_SVG(f.muster, f.farbe) + '<span class="fl-name">' + f.kurz + "</span>" +
        '<span class="fl-balken" aria-label="' + e.ja + " Ja, " + e.nein + " Nein, " + e.enthaltung + ' Enthaltung">' +
        '<i class="ja" style="width:' + (e.ja / n * 100) + '%"></i><i class="enth" style="width:' + (e.enthaltung / n * 100) + '%"></i><i class="nein" style="width:' + (e.nein / n * 100) + '%"></i></span>' +
        '<span class="fl-zahl">' + e.ja + "/" + n + (vw ? ' <em class="' + (vw > 0 ? "plus" : "minus") + '">' + (vw > 0 ? "+" : "") + vw + "</em>" : "") + "</span>" +
        (f.immerJa ? "" : '<span class="fl-vertrauen" title="' + DATA.texte.leisten.vertrauen + '">' + (v > 0 ? "▲".repeat(v) : (v < 0 ? "▼".repeat(-v) : "·")) + "</span>") + "</li>";
    });
    el.innerHTML = html + "</ul>";
    ANSICHT.halbrundText(LOGIK.mehrheit.alsText(erg));
  };
  return F;
})();

/* Wirkungsanzeige (qualitativ!) – vier Achsen, fünf Stufen, dazu eine graue Leiste */
ANSICHT.wirkung = (function () {
  var W = {};
  W.zeigen = function (an) { document.getElementById("wirkung").classList.toggle("versteckt", !an); if (an) W.aktualisieren(); };
  W.aktualisieren = function () {
    var el = document.getElementById("wirkung");
    if (!el || el.classList.contains("versteckt")) return;
    var T = DATA.texte.wirkung, w = LOGIK.mehrheit.wirkung(LOGIK.entwurf());
    var html = '<div class="wk-titel">' + T.titel + '</div><div class="wk-unter">' + T.untertitel + "</div>";
    ["wissen", "durchsetzung", "aufwand", "recht"].forEach(function (a) {
      html += '<div class="wk-achse' + (a === "aufwand" ? " aufwand" : "") + '"><span>' + T.achsen[a] + '</span><span class="wk-kaesten" role="img" aria-label="' + T.achsen[a] + ": " + w[a] + " / 5\">";
      for (var i = 1; i <= 5; i++) html += '<i class="' + (i <= w[a] ? "an" : "") + '"></i>';
      html += "</span></div>";
    });
    html += '<button class="wk-achse grau knopf" id="wkGrau"><span>' + T.grau + '</span><span class="wk-kaesten">' + "<i class='an'></i>".repeat(5) + "</span></button>";
    el.innerHTML = html;
    var g = document.getElementById("wkGrau");
    g.addEventListener("click", function () { LOGIK.gespraech.folge([{ sprecher: "mateusz", text: T.grauErklaerung[0] }, { sprecher: "mateusz", text: T.grauErklaerung[1] }]); });
    ANSICHT.hover(g);
  };
  return W;
})();

/* Dossier: Karten als Reihe (Stimme, Beleg, Einwand) */
ANSICHT.dossier = (function () {
  var D = {};
  D.kartenHtml = function (id, waehlbar) {
    var k = DATA.karten[id]; if (!k) return "";
    var p = DATA.figuren.personen[k.von];
    var von = p ? p.name : (DATA.texte.dossier.von[k.von] || "");
    return '<' + (waehlbar ? 'button class="karte knopf ' + k.art + '" data-karte="' + id + '"' : 'div class="karte ' + k.art + '"') + '>' +
      '<span class="karte-art">' + DATA.texte.dossier.arten[k.art] + "</span>" +
      '<span class="karte-text">' + LOGIK.text.ersetzen(k.text) + '</span><span class="karte-von">' + von + "</span>" + (waehlbar ? "</button>" : "</div>");
  };
  D.oeffnen = function () {
    var T = DATA.texte.dossier, d = document.createElement("div");
    if (!LOGIK.stand.dossier.length) d.innerHTML = "<p>" + T.leer + "</p>";
    else d.innerHTML = '<div class="kartenreihe">' + LOGIK.stand.dossier.map(function (id) { return D.kartenHtml(id, false); }).join("") + "</div>";
    if (LOGIK.stand.versprechen.length) d.innerHTML += "<h3>" + T.versprechen + "</h3><ul>" + LOGIK.stand.versprechen.map(function (v) { var f = DATA.fraktionen.filter(function (x) { return x.id === v.fraktion; })[0]; return "<li>" + f.kurz + ": " + LOGIK.text.ersetzen(DATA.zeilen.flure.versprechenText[v.typ]) + "</li>"; }).join("") + "</ul>";
    ANSICHT.menues.fenster(T.titel, d);
  };
  D.neu = function (id) {
    if (LOGIK.stand.dossier.indexOf(id) >= 0) return false;
    LOGIK.stand.dossier.push(id);
    ANSICHT.menues.hinweis(DATA.texte.dossier.neu + " " + DATA.texte.dossier.arten[DATA.karten[id].art] + ": " + LOGIK.text.ersetzen(DATA.karten[id].text, true).slice(0, 70) + "…");
    if (MOTOR.ton) MOTOR.ton.spiele("papier");
    return true;
  };
  return D;
})();

/* Auswahlfeld unten (wie die Gesprächsleiste): Titel, Text, Knöpfe */
ANSICHT.wahl = function (titel, text, optionen, fertig, opt) {
  opt = opt || {};
  var el = document.getElementById("wahl");
  el.innerHTML = "";
  var h = document.createElement("div"); h.className = "wahl-kopf"; h.innerHTML = "<strong>" + LOGIK.text.ersetzen(titel || "") + "</strong>" + (opt.zusatz ? '<span class="wahl-zusatz">' + opt.zusatz + "</span>" : "");
  el.appendChild(h);
  if (text) { var p = document.createElement("p"); p.innerHTML = LOGIK.text.ersetzen(text); el.appendChild(p); }
  var r = document.createElement("div"); r.className = "wahl-knoepfe" + (opt.spalten ? " spalten" : "");
  optionen.forEach(function (o, i) {
    var b = document.createElement("button");
    b.className = "knopf antwort" + (o.klasse ? " " + o.klasse : "");
    b.disabled = !!o.aus;
    b.innerHTML = '<span class="nr" aria-hidden="true">' + (i + 1) + "</span><span>" + LOGIK.text.ersetzen(o.text) + (o.unter ? '<small>' + LOGIK.text.ersetzen(o.unter) + "</small>" : "") + "</span>";
    b.addEventListener("click", function () { if (MOTOR.ton) MOTOR.ton.spiele("klick"); ANSICHT.wahlZu(); fertig(i, o); });
    ANSICHT.hover(b);
    r.appendChild(b);
  });
  el.appendChild(r);
  el.classList.remove("versteckt");
  ANSICHT.wahlOffen = { optionen: optionen, fertig: fertig };
  if (ANSICHT.tastatur) { var erste = r.querySelector("button:not([disabled])"); if (erste) erste.focus({ preventScroll: true }); }
};
ANSICHT.wahlZu = function () { document.getElementById("wahl").classList.add("versteckt"); ANSICHT.wahlOffen = null; };
ANSICHT.wahlTaste = function (e) {
  var w = ANSICHT.wahlOffen; if (!w) return false;
  var z = parseInt(e.key, 10);
  if (z >= 1 && z <= Math.min(9, w.optionen.length) && !w.optionen[z - 1].aus) { var f = w.fertig, o = w.optionen[z - 1]; ANSICHT.wahlZu(); f(z - 1, o); return true; }
  return false;
};
