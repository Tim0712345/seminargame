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
    if (LOGIK.ablauf.modus !== "titel") {
      var r = document.createElement("div"); r.className = "reihe";
      r.appendChild(knopf(T.zumTitel, function () { Mn.fensterZu(); LOGIK.speicher.speichern(); LOGIK.ablauf.zumTitel(); }));
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
    if (MOTOR.ton) MOTOR.ton.spiele("motiv");
    var dauer = MOTOR.bewegungReduziert ? 2200 : 3400;
    var weg = function () {
      el.classList.add("versteckt"); document.body.classList.remove("unscharf");
      el.removeEventListener("click", weg);
      if (fertig) { var f = fertig; fertig = null; f(); }
    };
    el.addEventListener("click", weg);
    setTimeout(weg, dauer);
  };

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

/* =====================================================================
   Oberfläche des ganzen Spiels (Phase 2 bis 5)
   ===================================================================== */
(function (Mn) {
  var T = function () { return DATA.texte; };
  function hol(id) { return document.getElementById(id); }
  function el(tag, klasse, html) { var e = document.createElement(tag); if (klasse) e.className = klasse; if (html !== undefined) e.innerHTML = html; return e; }
  function knopf(text, aktion, klasse) {
    var b = el("button", "knopf " + (klasse || ""), text); b.type = "button";
    b.addEventListener("click", function (e) { if (MOTOR.ton) MOTOR.ton.spiele("klick"); aktion(e); });
    ANSICHT.hover(b); return b;
  }

  /* Allgemeines Fenster (Dialog) mit beliebigem Inhalt */
  Mn.fenster = function (titel, inhalt) {
    var f = hol("fenster");
    hol("fensterTitel").textContent = titel;
    var i = hol("fensterInhalt"); i.innerHTML = ""; i.appendChild(inhalt);
    f.classList.remove("versteckt");
    setTimeout(function () { var b = i.querySelector("button, input"); (b || hol("fensterZu")).focus({ preventScroll: true }); }, 30);
  };
  var altFensterZu = Mn.fensterZu;
  Mn.fensterZu = function () {
    var f = hol("fenster"); if (f.classList.contains("versteckt")) return false;
    f.classList.add("versteckt"); if (Mn._fensterZu) { var c = Mn._fensterZu; Mn._fensterZu = null; c(); } return true;
  };
  Mn.fensterOffen = function () { return !hol("fenster").classList.contains("versteckt"); };

  /* Rückfrage mit Ja/Abbrechen */
  Mn.frage = function (text, jaText, ja, nein) {
    var d = el("div"); d.appendChild(el("p", "", LOGIK.text.ersetzen(text)));
    var r = el("div", "reihe");
    r.appendChild(knopf(jaText, function () { Mn._fensterZu = null; hol("fenster").classList.add("versteckt"); ja(); }, "haupt"));
    r.appendChild(knopf(T().menue.nein, function () { Mn._fensterZu = null; hol("fenster").classList.add("versteckt"); if (nein) nein(); }));
    d.appendChild(r);
    Mn._fensterZu = nein || null;
    Mn.fenster(T().menue.rueckfrageTitel, d);
  };

  /* Kopfknöpfe: Kalender, Dossier, Pause */
  Mn.hud = function (an) {
    hol("kopfKnoepfe").classList.toggle("versteckt", !an);
    hol("zettelEcke").classList.toggle("versteckt", !(an && LOGIK.stand.flags.zettel));
    if (an) Mn.hudAktualisieren();
  };
  Mn.hudAktualisieren = function () {
    var st = LOGIK.stand, k = DATA.texte.kapitel[(st.kapitel || 1) - 1], z = hol("kalenderZeile");
    if (!k || !z) return;
    var text = k.tag ? LOGIK.text.ersetzen(k.tag, true) : "";
    if (st.kapitel === 4) text = (st.tag === 1 ? T().kalender.mittwoch : T().kalender.donnerstag) + " · " + st.termineUebrig + " " + T().kalender.termine;
    z.textContent = text;
  };
  Mn.kalender = function () {
    var d = el("div"), st = LOGIK.stand;
    var ul = el("ol", "kalender-liste");
    DATA.texte.kapitel.forEach(function (k, i) {
      var li = el("li", (i + 1 === st.kapitel ? "jetzt" : (i + 1 < st.kapitel ? "vorbei" : "")), "<strong>" + LOGIK.text.ersetzen(k.titel) + "</strong> <span>" + LOGIK.text.ersetzen(k.tag) + "</span>");
      ul.appendChild(li);
    });
    d.appendChild(ul);
    if (st.kapitel === 4) d.appendChild(el("p", "", st.termineUebrig + " " + T().kalender.termine));
    Mn.fenster(T().kalender.titel, d);
  };
  Mn.alleVerbergen = function () {
    ["fraktionsleiste", "wirkung", "hotspots", "zaehler", "trilogTabelle", "epilogFeld", "vergleich", "abendnotiz"].forEach(function (id) { var e = hol(id); if (e) e.classList.add("versteckt"); });
    ANSICHT.wahlZu();
  };

  /* Vorname der Spielfigur */
  Mn.nameFragen = function (fertig) {
    var d = el("div"), t = T().name;
    d.appendChild(el("p", "", t.frage));
    var inp = el("input", "namensfeld"); inp.type = "text"; inp.maxLength = 16; inp.value = LOGIK.stand.name || t.vorschlag;
    inp.setAttribute("aria-label", t.frage); inp.autocomplete = "off";
    d.appendChild(inp);
    d.appendChild(el("p", "klein", t.hinweis));
    var r = el("div", "reihe");
    function ok() {
      var n = (inp.value || "").replace(/[^A-Za-zÀ-ÖØ-öø-ÿĀ-ž\- ]/g, "").replace(/\s+/g, " ").trim().slice(0, 16);
      if (!n) n = t.vorschlag;
      hol("fenster").classList.add("versteckt"); Mn._fensterZu = null; fertig(n);
    }
    r.appendChild(knopf(t.los, ok, "haupt"));
    d.appendChild(r);
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") ok(); e.stopPropagation(); });
    Mn._fensterZu = function () { fertig(LOGIK.stand.name || t.vorschlag); };
    Mn.fenster(t.titel, d);
    setTimeout(function () { inp.focus(); inp.select(); }, 60);
  };

  /* Zettel von Inès: groß zeigen, danach in der Ecke angeheftet */
  Mn.zettelZeigen = function (gross, fertig) {
    LOGIK.stand.flags.zettel = true;
    hol("zettelEcke").classList.remove("versteckt");
    if (!gross) return;
    var d = el("div", "zettel-gross", "<p>" + LOGIK.text.ersetzen(DATA.texte.zettel) + '</p><p class="unterschrift">– ' + DATA.texte.zettelUnterschrift + "</p>");
    Mn._fensterZu = fertig || null;
    Mn.fenster(T().zettelTitel, d);
  };

  /* Abendnotiz von Mira */
  Mn.abendnotiz = function (text, weiter) {
    var a = hol("abendnotiz");
    a.innerHTML = '<div class="an-kopf">' + T().abend.titel + "</div><p>" + LOGIK.text.ersetzen(text) + '</p><p class="an-von">– Mira</p>';
    a.classList.remove("versteckt");
    document.body.classList.add("unscharf");
    if (MOTOR.ton) MOTOR.ton.spiele("papier");
    setTimeout(function () { a.classList.add("versteckt"); document.body.classList.remove("unscharf"); weiter(); }, MOTOR.bewegungReduziert ? 2500 : 3800);
  };

  /* Karte aus dem Dossier wählen */
  Mn.karteWaehlen = function (fertig, abbruch) {
    var st = LOGIK.stand, d = el("div");
    d.appendChild(el("p", "klein", T().dossier.waehlen));
    var reihe = el("div", "kartenreihe");
    reihe.innerHTML = st.dossier.map(function (id) { return ANSICHT.dossier.kartenHtml(id, true); }).join("");
    d.appendChild(reihe);
    Array.prototype.forEach.call(reihe.querySelectorAll("[data-karte]"), function (b) {
      ANSICHT.hover(b);
      b.addEventListener("click", function () { Mn._fensterZu = null; hol("fenster").classList.add("versteckt"); fertig(b.getAttribute("data-karte")); });
    });
    Mn._fensterZu = abbruch || null;
    Mn.fenster(T().dossier.titel, d);
  };

  /* Kapitel 4: Räume im Schnittmodell antippen */
  var hotspots = [];
  Mn.flurZeigen = function (liste, aktion) {
    var c = hol("hotspots"); c.innerHTML = ""; hotspots = [];
    liste.forEach(function (h) {
      var text;
      if (h.art === "buero") { var f = DATA.fraktionen.filter(function (x) { return x.id === h.fraktion; })[0]; if (!f || f.immerJa) return; text = ANSICHT.MUSTER_SVG(f.muster, f.farbe) + "<span>" + f.kurz + '<span class="hs-person"> · ' + DATA.figuren.personen[f.person].name + "</span></span>"; }
      else text = "<span>" + (T().flure[h.art] || h.art) + "</span>";
      var b = knopf(text, function () { aktion(h); }, "hotspot");
      c.appendChild(b); hotspots.push({ b: b, h: h });
    });
    c.classList.remove("versteckt");
  };
  Mn.flurVerbergen = function () { hol("hotspots").classList.add("versteckt"); };
  Mn.flurPositionen = function (kam) {
    if (hol("hotspots").classList.contains("versteckt")) return;
    var kn = hol("bild"), cw = kn.clientWidth, ch = kn.clientHeight, v = kam.vpOhneJitter;
    hotspots.forEach(function (o) {
      var p = o.h.pos, x = v[0] * p[0] + v[4] * p[1] + v[8] * p[2] + v[12], y = v[1] * p[0] + v[5] * p[1] + v[9] * p[2] + v[13], w = v[3] * p[0] + v[7] * p[1] + v[11] * p[2] + v[15];
      o.b.style.transform = "translate(" + Math.round((x / w * 0.5 + 0.5) * cw) + "px," + Math.round((1 - (y / w * 0.5 + 0.5)) * ch) + "px) translate(-50%,-50%)";
    });
  };

  /* Großer Stimmenzähler bei Abstimmungen */
  Mn.zaehler = function (erg, dauer) {
    var z = hol("zaehler"), t = DATA.texte.halbrund, start = performance.now();
    z.classList.remove("versteckt");
    function bild() {
      if (z.classList.contains("versteckt")) return;
      var f = Math.min(1, (performance.now() - start) / 1000 / Math.max(0.1, dauer));
      z.innerHTML = '<span class="ja">' + t.ja + " " + Math.round(erg.ja * Math.min(1, f * 1.6)) + '</span><span class="nein">' + t.nein + " " + Math.round(erg.nein * M.klemme(f * 1.6 - 0.5, 0, 1)) + '</span><span class="enth">' + t.enthaltung + " " + Math.round(erg.enthaltung * M.klemme(f * 2 - 1, 0, 1)) + "</span>" +
        (f >= 1 ? '<strong class="' + (erg.mehrheit ? "ja" : "nein") + '">' + (erg.mehrheit ? t.mehrheit : t.keineMehrheit) + "</strong>" : "");
      if (f < 1) requestAnimationFrame(bild); else z.setAttribute("aria-label", LOGIK.mehrheit.alsText(erg));
    }
    var M = MOTOR.m;
    bild();
  };
  Mn.zaehlerWeg = function () { hol("zaehler").classList.add("versteckt"); };

  /* Kapitel 6: Vier-Spalten-Tabelle */
  function optKurz(z, id) { var o = z.schraube.optionen.filter(function (x) { return x.id === id; })[0]; return o ? LOGIK.text.ersetzen(o.kurz) : "–"; }
  Mn.trilogTabelle = function (Tr, wahl, abschluss) {
    var c = hol("trilogTabelle"), t = T().trilog;
    var verbraucht = LOGIK.ablauf.trilogVerbraucht();
    var h = '<div class="tt-kopf"><h2>' + t.titel + '</h2><span class="tt-budget">' + t.budget + " " + (Tr.budget - verbraucht).toFixed(1).replace(".", ",") + " / " + Tr.budget.toFixed(1).replace(".", ",") + "</span></div>";
    h += '<div class="tt-scroll"><table><thead><tr><th>' + t.spalten.join("</th><th>") + "</th></tr></thead><tbody>";
    Tr.zeilen.forEach(function (z) {
      var id = z.schraube.id, w = Tr.wahl[id], gleich = w === "gleich";
      h += '<tr class="' + (gleich ? "gleich" : "streit") + '"><th scope="row">' + LOGIK.text.ersetzen(z.artikel.titel).replace(/ – .*/, "") + '<small>' + LOGIK.text.ersetzen(z.schraube.frage) + "</small></th>";
      h += "<td>" + optKurz(z, z.komm) + "</td><td>" + optKurz(z, z.parl) + "</td><td>" + optKurz(z, z.rat) + "</td><td>";
      if (gleich) h += '<span class="tt-einig">' + optKurz(z, z.parl) + "</span>";
      else {
        h += '<button class="knopf segment" data-id="' + id + '" data-w="parl" aria-pressed="' + (w === "parl") + '">' + t.halten + "</button>";
        if (z.mw) h += '<button class="knopf segment" data-id="' + id + '" data-w="mitte" aria-pressed="' + (w === "mitte") + '" title="' + LOGIK.text.ersetzen(z.mw.text, true) + '">' + t.mittelweg + ": " + optKurz(z, z.mw.option) + "</button>";
        else if (Tr.bruecke > 0) h += '<button class="knopf segment bruecke" data-bruecke="' + id + '">' + t.bruecke + "</button>";
        h += '<button class="knopf segment" data-id="' + id + '" data-w="rat" aria-pressed="' + (w === "rat") + '">' + t.uebernehmen + "</button>";
      }
      h += "</td></tr>";
    });
    h += '</tbody></table></div><div class="reihe"><button class="knopf haupt" id="ttFertig">' + t.abschliessen + "</button></div>";
    c.innerHTML = h;
    c.classList.remove("versteckt");
    Array.prototype.forEach.call(c.querySelectorAll("button"), function (b) { ANSICHT.hover(b); });
    Array.prototype.forEach.call(c.querySelectorAll("[data-w]"), function (b) {
      b.addEventListener("click", function () { if (wahl(b.getAttribute("data-id"), b.getAttribute("data-w"))) Mn.trilogTabelle(Tr, wahl, abschluss); });
    });
    Array.prototype.forEach.call(c.querySelectorAll("[data-bruecke]"), function (b) { b.addEventListener("click", function () { LOGIK.ablauf.trilogBruecke(b.getAttribute("data-bruecke")); }); });
    hol("ttFertig").addEventListener("click", abschluss);
    ANSICHT.fraktionsleiste.zeigen(true);
    var e = LOGIK.entwurf(), k = LOGIK.ablauf.trilogKompromiss(); for (var x in k) e[x] = k[x];
    ANSICHT.fraktionsleiste.aktualisieren(LOGIK.mehrheit.plenum(e));
  };
  Mn.trilogWeg = function () { hol("trilogTabelle").classList.add("versteckt"); ANSICHT.fraktionsleiste.zeigen(false); };
  /* dieselbe Tabelle als großes Papier auf dem Tisch */
  Mn.trilogBlattZeichnen = function (b, Tr) {
    var c = b.lw.getContext("2d"), W = b.lw.width, H = b.lw.height, S = DATA.stil.oberflaeche, t = T().trilog;
    c.fillStyle = "#fbfaf6"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#1d1c1a"; c.font = "bold 34px " + S.schriftGesetz; c.fillText(t.titel.toUpperCase(), 40, 56);
    var sx = [40, 420, 700, 980, 1260], zh = (H - 120) / (Tr.zeilen.length + 1);
    c.font = "bold 22px " + S.schriftUI; t.spalten.forEach(function (s, i) { c.fillText(s, sx[i], 100); });
    c.font = "20px " + S.schriftGesetz;
    Tr.zeilen.forEach(function (z, i) {
      var y = 100 + zh * (i + 1);
      c.fillStyle = "rgba(0,0,0,0.12)"; c.fillRect(40, y - zh + 8, W - 80, 1);
      c.fillStyle = "#1d1c1a"; c.fillText(LOGIK.text.ersetzen(z.artikel.titel, true).replace(/ – .*/, "") + " · " + LOGIK.text.ersetzen(z.schraube.frage, true).slice(0, 26), sx[0], y);
      [z.komm, z.parl, z.rat].forEach(function (o, k) { c.fillText(LOGIK.text.ersetzen(optKurz(z, o), true).slice(0, 24), sx[k + 1], y); });
      var w = Tr.wahl[z.schraube.id];
      if (w) { c.fillStyle = DATA.stil.tinte.neu; c.fillText(LOGIK.text.ersetzen(optKurz(z, w === "parl" || w === "gleich" ? z.parl : (w === "mitte" ? z.mw.option : z.rat)), true).slice(0, 24), sx[4], y); }
    });
    MOTOR.gl.texturNeu(b.tex, b.lw);
  };

  /* Epilog: Collage mit Texten */
  Mn.epilogZeigen = function (stuecke, stimmung, zeige, weiter) {
    var e = hol("epilogFeld"), i = 0, E = DATA.epilog;
    function bild() {
      var s = stuecke[i];
      e.innerHTML = '<div class="ep-kopf"><h2>' + E.titel + '</h2><span class="klein">' + E.hinweis + "</span></div>" +
        (s ? '<div class="ep-stueck ' + s.art + '"><span class="ep-art">' + (T().epilogArten[s.art] || "") + " · " + s.name + "</span><p>" + LOGIK.text.ersetzen(s.text) + "</p></div>" :
          '<div class="ep-stueck mira"><span class="ep-art">Mira Kovács</span><p>' + LOGIK.text.ersetzen(E.mira[stimmung]) + "</p></div>");
      var r = el("div", "reihe");
      if (i < stuecke.length) r.appendChild(knopf(T().epilogWeiter, function () { i++; if (i < stuecke.length) zeige(i); bild(); }, "haupt"));
      else r.appendChild(knopf(T().zumVergleich, weiter, "haupt"));
      e.appendChild(r);
      var b = r.querySelector("button"); if (b && ANSICHT.tastatur) b.focus({ preventScroll: true });
    }
    e.classList.remove("versteckt");
    bild();
  };

  /* So ist es wirklich: Vergleich, Vereinfachungen, Zeitleiste, Fragen, Quellen, Credits */
  Mn.vergleichZeigen = function () {
    var V = DATA.vergleich, v = hol("vergleich"), e = LOGIK.entwurf(), st = LOGIK.stand;
    var h = '<div class="vg-blatt"><h1>' + V.titel + '</h1><p class="vg-unter">' + LOGIK.text.ersetzen(V.untertitel) + "</p>";
    h += '<p class="vg-ergebnis">' + (st.ergebnis.plenum ? T().vergleichAngenommen : T().vergleichAbgelehnt) + "</p>";
    h += '<div class="vg-scroll"><table class="vg-tabelle"><thead><tr><th></th><th>' + V.spalten.join("</th><th>") + "</th></tr></thead><tbody>";
    function zeichen(sch, ich, echt) {
      if (ich === echt) return '<span class="vg-z gleich" title="' + V.zeichen.gleich + '">✓ ' + V.zeichen.gleich + "</span>";
      if (sch.id === "begruendung") return '<span class="vg-z anders">↔ ' + V.zeichen.anders + "</span>";
      var ids = sch.optionen.map(function (o) { return o.id; });
      return ids.indexOf(ich) > ids.indexOf(echt) ? '<span class="vg-z mutiger">↑ ' + V.zeichen.mutiger + "</span>" : '<span class="vg-z vorsichtiger">↓ ' + V.zeichen.vorsichtiger + "</span>";
    }
    DATA.artikel.forEach(function (a) {
      var meine = a.schrauben.map(function (s) { var o = s.optionen.filter(function (x) { return x.id === e[s.id]; })[0]; return LOGIK.text.ersetzen(o.kurz) + " " + zeichen(s, e[s.id], V.echteOption[s.id]); }).join("<br>");
      var A = V.artikel[a.id];
      h += '<tr><th scope="row">' + LOGIK.text.ersetzen(a.titel) + "</th><td>" + meine + "</td><td>" + LOGIK.text.ersetzen(A.echt) + "</td><td>" + LOGIK.text.ersetzen(A.warum) + "</td></tr>";
    });
    if (e.frist) {
      var fo = DATA.umsetzungsfrist.optionen.filter(function (o) { return o.id === e.frist; })[0];
      h += '<tr><th scope="row">' + DATA.umsetzungsfrist.titel + "</th><td>" + LOGIK.text.ersetzen(fo.kurz) + " " + zeichen(DATA.umsetzungsfrist, e.frist, V.echteOption.frist) + "</td><td>" + LOGIK.text.ersetzen(V.artikel.frist.echt) + "</td><td>" + LOGIK.text.ersetzen(V.artikel.frist.warum) + "</td></tr>";
    }
    h += "</tbody></table></div>";
    h += '<section class="vg-kasten"><h2>' + V.ausserdem.titel + "</h2><p>" + LOGIK.text.ersetzen(V.ausserdem.text) + "</p></section>";
    h += "<section><h2>" + V.vereinfacht.titel + "</h2><ul>" + V.vereinfacht.punkte.map(function (p) { return "<li>" + LOGIK.text.ersetzen(p) + "</li>"; }).join("") + "</ul></section>";
    h += "<section><h2>" + V.zeitleiste.titel + '</h2><ol class="vg-zeit">' + V.zeitleiste.punkte.map(function (p) { return "<li><strong>" + LOGIK.text.ersetzen(p.wann) + "</strong> " + LOGIK.text.ersetzen(p.was) + "</li>"; }).join("") + '</ol><p class="klein">' + V.zeitleiste.hinweis + "</p></section>";
    h += "<section><h2>" + V.fragen.titel + "</h2><ul>" + V.fragen.punkte.map(function (p) { return "<li>" + LOGIK.text.ersetzen(p) + "</li>"; }).join("") + "</ul></section>";
    // Quellen automatisch aus data/fakten.js, nach Quelle sortiert, mit Prüfstatus
    var nachQuelle = {};
    for (var id in DATA.fakten) { var f = DATA.fakten[id]; (nachQuelle[f.quelle] = nachQuelle[f.quelle] || []).push(f); }
    h += "<section><h2>" + T().quellenTitel + '</h2><ul class="vg-quellen">';
    Object.keys(nachQuelle).sort().forEach(function (q) {
      h += "<li><strong>" + q + "</strong><ul>" + nachQuelle[q].map(function (f) { return "<li>" + f.text + " – " + LOGIK.text.ersetzen("{fakt:" + Object.keys(DATA.fakten).filter(function (k) { return DATA.fakten[k] === f; })[0] + "}") + ' <span class="pruef ' + (f.verifiziert ? "ok" : "offen") + '">' + (f.verifiziert ? T().geprueft : T().ungeprueft) + '</span><br><span class="klein">' + f.link_hinweis + "</span></li>"; }).join("") + "</ul></li>";
    });
    h += "</ul></section>";
    h += '<section class="vg-credits"><h2>' + V.credits.titel + "</h2>" + V.credits.zeilen.map(function (z) { return "<p>" + LOGIK.text.ersetzen(z) + "</p>"; }).join("") + "</section>";
    h += '<div class="reihe"><button class="knopf haupt" id="vgTitel">' + T().zumTitel + '</button><button class="knopf" id="vgNeu">' + T().menue.neu + "</button></div></div>";
    v.innerHTML = h;
    v.classList.remove("versteckt");
    v.scrollTop = 0;
    hol("vgTitel").addEventListener("click", function () { LOGIK.ablauf.zumTitel(); });
    hol("vgNeu").addEventListener("click", function () { LOGIK.ablauf.neueLegislatur(); });
    var h1 = v.querySelector("h1"); if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
  };

  /* Knöpfe oben rechts und der angeheftete Zettel */
  var altInit = Mn.init;
  Mn.init = function () {
    altInit();
    hol("knopfDossier").addEventListener("click", function () { ANSICHT.dossier.oeffnen(); });
    hol("knopfKalender").addEventListener("click", function () { Mn.kalender(); });
    hol("zettelEcke").addEventListener("click", function () { Mn.zettelZeigen(true); });
    ["knopfDossier", "knopfKalender", "zettelEcke"].forEach(function (id) { ANSICHT.hover(hol(id)); });
    hol("knopfDossier").setAttribute("aria-label", T().dossier.titel); hol("knopfDossier").title = T().dossier.titel + " (D)";
    hol("knopfKalender").setAttribute("aria-label", T().kalender.titel); hol("knopfKalender").title = T().kalender.titel;
    hol("zettelEcke").setAttribute("aria-label", T().zettelTitel);
    // Glossar: kleines „?“ neben Fachbegriffen
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest(".glossar");
      var alt = document.querySelector(".glossar-blase"); if (alt) alt.remove();
      if (!b) return;
      e.stopPropagation();
      var bl = el("div", "glossar-blase glas", b.getAttribute("data-erklaerung")); bl.setAttribute("role", "tooltip");
      document.body.appendChild(bl);
      var r = b.getBoundingClientRect();
      bl.style.left = Math.max(8, Math.min(window.innerWidth - 300, r.left - 120)) + "px";
      bl.style.top = Math.max(8, r.top - bl.offsetHeight - 10) + "px";
    }, true);
  };
})(ANSICHT.menues);
