/* =====================================================================
   Die Lücke – Benutzeroberfläche (HTML/CSS-Overlay über dem 3D-Bild)
   ---------------------------------------------------------------------
   Einstellungen, Steuerungshinweis, Pausemenü, HUD, Blasen über den
   Köpfen, Einblendungen, Abblende, Fehlerseite.
   Alle Texte kommen aus DATA.texte (data/dialogues.js).
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

/* ---------------- Einstellungen (optional in localStorage) ---------------- */
GAME.einstellungen = (function () {
  "use strict";
  var SCHLUESSEL = "dieLuecke.einstellungen";
  var E = { qualitaet: "hoch", kruemmung: true, stumm: false };
  E.laden = function () {
    try {
      var s = window.localStorage.getItem(SCHLUESSEL);
      if (s) {
        var d = JSON.parse(s);
        for (var k in d) if (Object.prototype.hasOwnProperty.call(d, k) && k in E && typeof E[k] !== "function") E[k] = d[k];
      }
    } catch (e) { /* ohne Speicher geht es auch */ }
  };
  E.speichern = function () {
    try {
      window.localStorage.setItem(SCHLUESSEL, JSON.stringify({ qualitaet: E.qualitaet, kruemmung: E.kruemmung, stumm: E.stumm }));
    } catch (e) { /* ignorieren */ }
  };
  E.anwenden = function () {
    ENG.renderer.fx = E.qualitaet === "hoch";
    ENG.renderer.kruemmungAn = !!E.kruemmung;
    ENG.audio.setStumm(E.stumm);
    if (GAME.ui && GAME.ui.groesseAnpassen) GAME.ui.groesseAnpassen();
  };
  E.renderSkala = function () { return E.qualitaet === "hoch" ? 1 : 0.75; };
  return E;
})();

GAME.merker = {
  lesen: function (k) { try { return window.localStorage.getItem("dieLuecke." + k); } catch (e) { return null; } },
  schreiben: function (k, v) { try { window.localStorage.setItem("dieLuecke." + k, v); } catch (e) { /* egal */ } }
};

/* ---------------- Oberfläche ---------------- */
GAME.ui = (function () {
  "use strict";
  var U = {};
  var el = {};
  var menue = null;          // aktuell offenes Menü
  var blasen = {};           // id -> { el, benutzt }
  var TX;

  function $(id) { return document.getElementById(id); }
  function neu(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function taste(t) { return neu("span", "taste", t); }

  U.init = function () {
    TX = DATA.texte;
    el.ui = $("ui");
    el.ort = $("hud-ort");
    el.blasen = $("blasen");
    el.einblendung = $("einblendung");
    el.menue = $("menue-schicht");
    el.blende = $("blende");
    window.addEventListener("resize", U.groesseAnpassen);
    U.groesseAnpassen();
  };

  U.groesseAnpassen = function () {
    var c = ENG.gl.canvas;
    if (!c) return;
    ENG.renderer.groesse(c.clientWidth || window.innerWidth, c.clientHeight || window.innerHeight,
      window.devicePixelRatio || 1, GAME.einstellungen.renderSkala());
  };

  // ---------------- Fehlerseite ----------------
  U.fehlerZeigen = function (details) {
    var f = DATA.texte.fehlerWebGL;
    var box = $("fehler");
    box.innerHTML = "";
    var karte = neu("div", "karte fehler-karte");
    karte.appendChild(neu("div", "fehler-bild", "☁"));
    karte.appendChild(neu("h1", "", f.titel));
    karte.appendChild(neu("p", "", f.text));
    var ul = neu("ul");
    f.tipps.forEach(function (t) { ul.appendChild(neu("li", "", t)); });
    karte.appendChild(ul);
    if (details) karte.appendChild(neu("p", "klein", String(details)));
    box.appendChild(karte);
    box.classList.remove("versteckt");
    var s = $("spiel");
    if (s) s.style.display = "none";
  };
  U.meldung = function (text) {
    var box = $("fehler");
    box.innerHTML = "";
    var karte = neu("div", "karte fehler-karte");
    karte.appendChild(neu("p", "", text));
    box.appendChild(karte);
    box.classList.remove("versteckt");
  };

  // ---------------- HUD ----------------
  U.ort = function (name) {
    el.ort.textContent = name || "";
    el.ort.classList.remove("ploppen");
    void el.ort.offsetWidth;
    el.ort.classList.add("ploppen");
    el.ort.classList.toggle("versteckt", !name);
  };

  // ---------------- Blasen über Köpfen/Objekten ----------------
  U.blasenBeginn = function () { for (var k in blasen) blasen[k].benutzt = false; };
  /* inhalt: { taste: "E", text: "Untersuchen" } oder { symbol: "!" } */
  U.blase = function (id, sx, sy, inhalt) {
    var b = blasen[id];
    if (!b) {
      // Äußeres Element wird positioniert, das innere ploppt auf
      b = { halter: neu("div", "blase-halter"), el: neu("div", "blase ploppen") };
      b.halter.appendChild(b.el);
      el.blasen.appendChild(b.halter);
      blasen[id] = b;
      b.schluessel = "";
    }
    var schl = (inhalt.taste || "") + "|" + (inhalt.text || "") + "|" + (inhalt.symbol || "");
    if (schl !== b.schluessel) {
      b.el.innerHTML = "";
      if (inhalt.taste) b.el.appendChild(taste(inhalt.taste));
      if (inhalt.text) b.el.appendChild(neu("span", "blase-text", inhalt.text));
      if (inhalt.symbol) b.el.appendChild(neu("span", "blase-symbol", inhalt.symbol));
      b.schluessel = schl;
    }
    b.halter.style.transform = "translate(" + Math.round(sx) + "px," + Math.round(sy) + "px)";
    b.benutzt = true;
  };
  U.blasenEnde = function () {
    for (var k in blasen) {
      if (!blasen[k].benutzt) {
        el.blasen.removeChild(blasen[k].halter);
        delete blasen[k];
      }
    }
  };

  // ---------------- Einblendungen ----------------
  U.einblenden = function (text, dauer) {
    var e = neu("div", "einblendung-karte ploppen", text);
    el.einblendung.appendChild(e);
    setTimeout(function () { e.classList.add("weg"); }, (dauer || 2.2) * 1000);
    setTimeout(function () { if (e.parentNode) e.parentNode.removeChild(e); }, (dauer || 2.2) * 1000 + 500);
  };

  // ---------------- Abblende ----------------
  U.abblenden = function (an) { el.blende.classList.toggle("an", !!an); };

  // ---------------- Menüs (Tastatur + Maus) ----------------
  U.blockiert = function () { return !!menue; };

  /* opt: { titel, klasse, inhalt (DOM, optional), eintraege: [ { text() | text, aktion(), umschalten(richtung) } ],
            schliessbar, beimSchliessen } */
  U.menueOeffnen = function (opt) {
    U.menueSchliessen(true);
    menue = { opt: opt, wahl: 0, knoepfe: [] };
    var karte = neu("div", "karte menue ploppen " + (opt.klasse || ""));
    if (opt.titel) karte.appendChild(neu("h2", "", opt.titel));
    if (opt.inhalt) karte.appendChild(opt.inhalt);
    var liste = neu("div", "menue-liste");
    (opt.eintraege || []).forEach(function (e, i) {
      var k = neu("button", "knopf");
      k.type = "button";
      k.addEventListener("mouseenter", function () { menue.wahl = i; U.menueMalen(); });
      k.addEventListener("click", function () { menue.wahl = i; eintragAusloesen(0); });
      liste.appendChild(k);
      menue.knoepfe.push(k);
    });
    karte.appendChild(liste);
    if (opt.fussnote) karte.appendChild(neu("p", "fussnote", opt.fussnote));
    el.menue.innerHTML = "";
    el.menue.appendChild(karte);
    el.menue.classList.remove("versteckt");
    U.menueMalen();
  };

  U.menueMalen = function () {
    if (!menue) return;
    var ein = menue.opt.eintraege || [];
    for (var i = 0; i < ein.length; i++) {
      var t = typeof ein[i].text === "function" ? ein[i].text() : ein[i].text;
      menue.knoepfe[i].textContent = t;
      menue.knoepfe[i].classList.toggle("gewaehlt", i === menue.wahl);
    }
  };

  function eintragAusloesen(richtung) {
    var e = (menue.opt.eintraege || [])[menue.wahl];
    if (!e) return;
    if (e.umschalten) { e.umschalten(richtung || 1); U.menueMalen(); }
    else if (e.aktion) e.aktion();
  }

  U.menueSchliessen = function (still) {
    if (!menue) return;
    var m = menue;
    menue = null;
    el.menue.classList.add("versteckt");
    el.menue.innerHTML = "";
    if (!still && m.opt.beimSchliessen) m.opt.beimSchliessen();
  };

  // Wird jedes Bild aufgerufen: Tastatur für Menüs
  U.update = function () {
    var I = ENG.input;
    if (menue) {
      var n = (menue.opt.eintraege || []).length;
      if (I.gedrueckt("hoch") && n) { menue.wahl = (menue.wahl + n - 1) % n; U.menueMalen(); }
      if (I.gedrueckt("runter") && n) { menue.wahl = (menue.wahl + 1) % n; U.menueMalen(); }
      if (I.gedrueckt("links") && n) eintragAusloesen(-1);
      if (I.gedrueckt("rechts") && n) eintragAusloesen(1);
      if (I.gedrueckt("ok")) { if (n) eintragAusloesen(1); else if (menue.opt.schliessbar !== false) U.menueSchliessen(); }
      else if (I.gedrueckt("pause") && menue && menue.opt.schliessbar !== false) U.menueSchliessen();
      I.verbrauchen("aktion"); I.verbrauchen("ok"); I.verbrauchen("pause");
      return;
    }
    if (I.gedrueckt("pause")) { I.verbrauchen("pause"); U.pauseOeffnen(); }
  };

  // ---------------- Steuerungshinweis ----------------
  U.steuerungZeigen = function (danach) {
    var s = DATA.texte.steuerung;
    var tab = neu("div", "steuerung");
    s.zeilen.forEach(function (z) {
      var zeile = neu("div", "steuerung-zeile");
      var tasten = neu("div", "steuerung-tasten");
      z[0].split(" ").forEach(function (t) { tasten.appendChild(taste(t)); });
      zeile.appendChild(tasten);
      zeile.appendChild(neu("div", "steuerung-text", z[1]));
      tab.appendChild(zeile);
    });
    U.menueOeffnen({
      titel: s.titel, klasse: "menue-steuerung", inhalt: tab,
      eintraege: [{ text: s.weiter, aktion: function () { U.menueSchliessen(); } }],
      beimSchliessen: danach
    });
  };

  // ---------------- Pausemenü ----------------
  U.pauseOeffnen = function () {
    var p = DATA.texte.pause, E = GAME.einstellungen;
    U.menueOeffnen({
      titel: p.titel,
      eintraege: [
        { text: p.weiter, aktion: function () { U.menueSchliessen(); } },
        { text: function () { return p.grafik + ": " + (E.qualitaet === "hoch" ? p.hoch : p.niedrig); },
          umschalten: function () { E.qualitaet = E.qualitaet === "hoch" ? "niedrig" : "hoch"; E.anwenden(); E.speichern(); } },
        { text: p.steuerung, aktion: function () { U.steuerungZeigen(); } }
      ],
      fussnote: p.hinweisNeuladen
    });
  };

  return U;
})();
