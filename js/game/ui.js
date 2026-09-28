/* =====================================================================
   Die Lücke – Benutzeroberfläche (HTML/CSS-Overlay über dem 3D-Bild)
   ---------------------------------------------------------------------
   Einstellungen, Steuerungshinweis, Pausemenü, HUD, Blasen über den
   Köpfen, Einblendungen, Abblende, Fehlerseite, Titelmenü mit Logo,
   Credits, Epilog-Textkarte und Reflexionsseite.
   Alle Texte kommen aus DATA.texte (data/dialogues.js).
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

/* ---------------- Einstellungen (optional in localStorage) ----------------
   qualitaet   "hoch" | "niedrig" (Renderskala 0,75, ohne Zusatzeffekte und Deko)
   stumm       alle Töne aus
   sprechlaute Silben-Töne beim Sprechen
   schrift     "normal" | "gross" | "sehrgross"
   kontrast    hoher Kontrast der Oberfläche
   ruhig       Bewegung reduzieren (keine Wackel-/Schwenkbewegungen, Animationen aus) */
GAME.einstellungen = (function () {
  "use strict";
  var SCHLUESSEL = "dieLuecke.einstellungen";
  var FELDER = ["qualitaet", "kruemmung", "stumm", "sprechlaute", "schrift", "kontrast", "ruhig"];
  var E = { qualitaet: "hoch", kruemmung: false, stumm: false, sprechlaute: true, schrift: "normal", kontrast: false, ruhig: false };
  E.laden = function () {
    try {
      var s = window.localStorage.getItem(SCHLUESSEL);
      if (s) {
        var d = JSON.parse(s);
        FELDER.forEach(function (k) { if (Object.prototype.hasOwnProperty.call(d, k)) E[k] = d[k]; });
      }
    } catch (e) { /* ohne Speicher geht es auch */ }
    // Barrierefreiheit: „Bewegung reduzieren“ des Systems übernehmen
    try { if (!s && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) E.ruhig = true; } catch (e2) { /* egal */ }
  };
  E.speichern = function () {
    try {
      var d = {};
      FELDER.forEach(function (k) { d[k] = E[k]; });
      window.localStorage.setItem(SCHLUESSEL, JSON.stringify(d));
    } catch (e) { /* ignorieren */ }
  };
  E.anwenden = function () {
    ENG.renderer.fx = E.qualitaet === "hoch" && !E.ruhig;
    ENG.renderer.deko = E.qualitaet === "hoch";
    ENG.renderer.kruemmungAn = false;
    ENG.audio.setStumm(E.stumm);
    ENG.audio.sprechlaute = !!E.sprechlaute;
    var html = document.documentElement;
    html.classList.toggle("schrift-gross", E.schrift === "gross");
    html.classList.toggle("schrift-sehrgross", E.schrift === "sehrgross");
    document.body.classList.toggle("kontrast", !!E.kontrast);
    document.body.classList.toggle("ruhig", !!E.ruhig);
    if (GAME.ui && GAME.ui.groesseAnpassen) GAME.ui.groesseAnpassen();
  };
  E.renderSkala = function () { return E.qualitaet === "hoch" ? 1 : 0.75; };

  // Läuft das Spiel dauerhaft zu langsam, einmalig auf „Niedrig“ schalten
  var langsam = 0, geprueft = false;
  E.leistungPruefen = function (dt) {
    if (geprueft || E.qualitaet !== "hoch" || GAME.szenen.aktiv !== GAME.Spielszene) return;
    var fps = ENG.loop.fps || 60;
    langsam = fps < 28 ? langsam + dt : Math.max(0, langsam - dt * 2);
    if (langsam > 6) {
      geprueft = true;
      E.qualitaet = "niedrig";
      E.anwenden(); E.speichern();
      GAME.ui.einblenden(DATA.texte.pause.autoNiedrig, 4);
    }
  };
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
    el.hinweis = $("hud-hinweis");
    el.blasen = $("blasen");
    el.einblendung = $("einblendung");
    el.menue = $("menue-schicht");
    el.blende = $("blende");
    el.hud = $("hud");
    el.knoepfe = $("knoepfe");
    el.joy = $("joystick");
    el.joyKnauf = $("joystick-knauf");
    // Runde Knöpfe unten rechts (für Maus und Touch, z. B. auf dem iPad)
    var ICON = {
      buch: '<svg viewBox="0 0 32 32"><path d="M7 5 H23 C24.5 5 25 6 25 7 V27 H9 C7.5 27 7 26 7 25 Z"/><path d="M7 23 C7 21.5 8 21 9 21 H25"/><path d="M12 10 H20 M12 14 H18"/></svg>',
      aufgaben: '<svg viewBox="0 0 32 32"><rect x="6" y="5" width="20" height="23" rx="3"/><path d="M10 12 L12 14 L15 10 M18 12 H22 M10 20 L12 22 L15 18 M18 20 H22"/></svg>',
      pause: '<svg viewBox="0 0 32 32"><path d="M8 10 H24 M8 16 H24 M8 22 H24"/></svg>'
    };
    [["knopf-buch", "buch", function () { GAME.buch.oeffnen("notizbuch"); }],
     ["knopf-aufgaben", "aufgaben", function () { GAME.buch.oeffnen("questlog"); }],
     ["knopf-pause", "pause", function () { U.pauseOeffnen(); }]].forEach(function (k) {
      var b = $(k[0]);
      b.innerHTML = ICON[k[1]];
      b.title = DATA.texte.knoepfe[k[1]];
      b.setAttribute("aria-label", DATA.texte.knoepfe[k[1]]);
      b.addEventListener("click", function () {
        if (GAME.szenen.aktiv !== GAME.Spielszene || U.blockiert() || GAME.dialog.aktiv) return;
        k[2]();
      });
    });
    // Buttons sollen beim Anklicken keinen Tastatur-Fokus behalten,
    // sonst löst Enter/Leertaste sie später noch einmal aus
    document.addEventListener("mousedown", function (e) { if (e.target.closest && e.target.closest("button")) e.preventDefault(); }, true);
    window.addEventListener("keydown", function (e) {
      var a = document.activeElement;
      if (a && a.tagName === "BUTTON" && (e.code === "Enter" || e.code === "Space" || e.key === "Enter" || e.key === " ")) { e.preventDefault(); a.blur(); }
    }, true);
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
  // Ortsname, darunter (draußen) der Gender Pay Gap des Landes
  U.ort = function (name, faktId) {
    el.ort.textContent = name || "";
    if (faktId && DATA.facts[faktId]) {
      var z = neu("span", "ort-gpg");
      z.appendChild(document.createTextNode(DATA.texte.hudGpg + " "));
      var f = GAME.dialog.fakt("fakt", faktId);
      z.appendChild(neu("b", "fakt" + (f.ungeprueft ? " ungeprueft" : ""), f.t));
      el.ort.appendChild(z);
    }
    el.ort.classList.remove("ploppen");
    void el.ort.offsetWidth;
    el.ort.classList.add("ploppen");
    el.ort.classList.toggle("versteckt", !name);
  };

  // Aufgabenhinweis unter dem Ortsnamen
  U.hinweis = function (text) {
    if (el.hinweis.textContent === text) return;
    el.hinweis.textContent = text || "";
    el.hinweis.classList.toggle("versteckt", !text);
    el.hinweis.classList.remove("ploppen");
    void el.hinweis.offsetWidth;
    el.hinweis.classList.add("ploppen");
  };

  // Emote-Symbole als kleine Tusche-Zeichnungen (SVG)
  var EMOTES = {
    "!": '<path d="M16 5 L15 20" /><circle cx="15" cy="26" r="1.8" class="voll"/>',
    "?": '<path d="M9.5 10.5 C9.5 5 20.5 4.5 20.5 10.5 C20.5 15 15 15 15 20" /><circle cx="15" cy="26" r="1.8" class="voll"/>',
    "gluehbirne": '<path d="M10.5 18 C6 14 7.5 5 15 5 C22.5 5 24 14 19.5 18 L19 21 L11 21 Z" class="gelb"/><path d="M11.5 23.5 L18.5 23.5 M12.5 26.5 L17.5 26.5" /><path d="M3 9 L6 10 M27 9 L24 10 M15 1.5 L15 3" class="duenn"/>',
    "herz": '<path d="M15 26 C4 18 4 8 10 7 C13 6.5 15 9 15 11 C15 9 17 6.5 20 7 C26 8 26 18 15 26 Z" class="rot"/>',
    "schweiss": '<path d="M16 4 C22 12 23 16 23 19 C23 23.5 19.5 26 16 26 C12.5 26 9 23.5 9 19 C9 16 10 12 16 4 Z" class="blau"/><path d="M13 19 C13 21 14 22.5 16 23" class="duenn"/>'
  };
  U.emoteSvg = function (name) {
    var inhalt = EMOTES[name] || EMOTES["!"];
    return '<svg viewBox="0 0 30 30" class="emote-svg">' + inhalt + '</svg>';
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
    var schl = (inhalt.taste || "") + "|" + (inhalt.text || "") + "|" + (inhalt.symbol || "") + "|" + (inhalt.emote || "") + "|" + (inhalt.klasse || "");
    if (schl !== b.schluessel) {
      b.el.innerHTML = "";
      if (inhalt.taste) b.el.appendChild(taste(inhalt.taste));
      if (inhalt.text) b.el.appendChild(neu("span", "blase-text", inhalt.text));
      if (inhalt.symbol) b.el.appendChild(neu("span", "blase-symbol", inhalt.symbol));
      if (inhalt.emote) { var sv = neu("span", "blase-emote"); sv.innerHTML = U.emoteSvg(inhalt.emote); b.el.appendChild(sv); }
      b.el.classList.toggle("nur-emote", !!inhalt.emote && !inhalt.text);
      if (inhalt.klasse) b.el.classList.add(inhalt.klasse);
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

  // HUD (Ort, Aufgabe, Beweisstücke) nur in der Spielszene
  U.hudZeigen = function (an) {
    el.hud.classList.toggle("versteckt", !an);
    el.blasen.classList.toggle("versteckt", !an);
    el.knoepfe.classList.toggle("versteckt", !an);
  };

  // Joystick-Anzeige, solange mit Maus oder Finger gezogen wird
  U.joystickMalen = function () {
    var z = ENG.input.zeiger, r = ENG.input.JOY_RADIUS;
    var an = z.zieht && GAME.szenen.aktiv === GAME.Spielszene && !U.blockiert() && !GAME.dialog.aktiv;
    el.joy.classList.toggle("versteckt", !an);
    if (!an) return;
    var dx = z.x - z.sx, dy = z.y - z.sy, l = Math.sqrt(dx * dx + dy * dy);
    if (l > r) { dx = dx / l * r; dy = dy / l * r; }
    el.joy.style.transform = "translate(" + Math.round(z.sx) + "px," + Math.round(z.sy) + "px)";
    el.joyKnauf.style.transform = "translate(" + Math.round(dx) + "px," + Math.round(dy) + "px)";
  };

  // ---------------- Menüs (Tastatur + Maus) ----------------
  U.blockiert = function () {
    return !!menue || (GAME.buch && GAME.buch.istOffen()) || (GAME.minispiel && GAME.minispiel.laeuft());
  };

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
    el.menue.classList.toggle("hell", !!opt.hell);
    menue.karte = karte;
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
    else if (e.aktion) { ENG.audio.klick(); e.aktion(); }
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
    U.joystickMalen();
    if (GAME.dialog && GAME.dialog.aktiv) return;
    if (GAME.minispiel.laeuft()) { GAME.minispiel.update(); return; }
    if (GAME.buch.istOffen()) { GAME.buch.update(); return; }
    if (menue && menue.opt.tasten) {
      // Menü mit eigener Tastensteuerung (z. B. lange Seiten zum Scrollen)
      menue.opt.tasten(I, menue);
      I.verbrauchen("aktion"); I.verbrauchen("ok"); I.verbrauchen("pause");
      return;
    }
    if (menue) {
      var n = (menue.opt.eintraege || []).length;
      if (I.gedrueckt("hoch") && n) { menue.wahl = (menue.wahl + n - 1) % n; U.menueMalen(); ENG.audio.klick(); }
      if (I.gedrueckt("runter") && n) { menue.wahl = (menue.wahl + 1) % n; U.menueMalen(); ENG.audio.klick(); }
      if (I.gedrueckt("links") && n) eintragAusloesen(-1);
      if (I.gedrueckt("rechts") && n) eintragAusloesen(1);
      if (I.gedrueckt("ok")) { if (n) eintragAusloesen(1); else if (menue.opt.schliessbar !== false) U.menueSchliessen(); }
      else if (I.gedrueckt("pause") && menue && menue.opt.schliessbar !== false) U.menueSchliessen();
      I.verbrauchen("aktion"); I.verbrauchen("ok"); I.verbrauchen("pause");
      return;
    }
    if (GAME.szenen.aktiv !== GAME.Spielszene) return;
    if (I.gedrueckt("pause")) { I.verbrauchen("pause"); U.pauseOeffnen(); }
    else if (I.gedrueckt("notizbuch")) { I.verbrauchen("notizbuch"); GAME.buch.oeffnen("notizbuch"); }
    else if (I.gedrueckt("quests")) { I.verbrauchen("quests"); GAME.buch.oeffnen("questlog"); }
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
    var p = DATA.texte.pause;
    U.menueOeffnen({
      titel: p.titel,
      eintraege: [
        { text: p.weiter, aktion: function () { U.menueSchliessen(); } },
        { text: p.einstellungen, aktion: function () { U.einstellungenZeigen(U.pauseOeffnen); } },
        { text: p.steuerung, aktion: function () { U.steuerungZeigen(U.pauseOeffnen); } },
        { text: p.titelbildschirm, aktion: function () {
          U.menueSchliessen(true);
          GAME.Spielszene.speichern();
          GAME.szenen.titelStarten();
        } }
      ],
      fussnote: p.autosave
    });
  };

  // ---------------- Einstellungen ----------------
  U.einstellungenZeigen = function (zurueck) {
    var p = DATA.texte.pause, E = GAME.einstellungen;
    function anAus(w) { return w ? p.an : p.aus; }
    function aendern(fn) { return function (r) { fn(r); E.anwenden(); E.speichern(); ENG.audio.klick(); }; }
    var SCHRIFT = ["normal", "gross", "sehrgross"];
    U.menueOeffnen({
      titel: p.einstellungen,
      eintraege: [
        { text: function () { return p.grafik + ": " + (E.qualitaet === "hoch" ? p.hoch : p.niedrig); },
          umschalten: aendern(function () { E.qualitaet = E.qualitaet === "hoch" ? "niedrig" : "hoch"; }) },
        { text: function () { return p.ton + ": " + anAus(!E.stumm); },
          umschalten: aendern(function () { E.stumm = !E.stumm; }) },
        { text: function () { return p.sprechlaute + ": " + anAus(E.sprechlaute); },
          umschalten: aendern(function () { E.sprechlaute = !E.sprechlaute; }) },
        { text: function () { return p.schrift + ": " + p.schriftStufen[SCHRIFT.indexOf(E.schrift) < 0 ? 0 : SCHRIFT.indexOf(E.schrift)]; },
          umschalten: aendern(function (r) { var k = SCHRIFT.indexOf(E.schrift); E.schrift = SCHRIFT[(k + (r < 0 ? 2 : 1)) % 3]; }) },
        { text: function () { return p.kontrast + ": " + anAus(E.kontrast); },
          umschalten: aendern(function () { E.kontrast = !E.kontrast; }) },
        { text: function () { return p.ruhig + ": " + anAus(E.ruhig); },
          umschalten: aendern(function () { E.ruhig = !E.ruhig; }) },
        { text: p.zurueck, aktion: function () { if (zurueck) zurueck(); else U.menueSchliessen(); } }
      ],
      fussnote: p.hinweisNeuladen,
      beimSchliessen: zurueck
    });
  };

  // ====================================================================
  //  Titelbildschirm
  // ====================================================================
  // Logo: dicke, runde Tusche-Buchstaben auf Aquarell-Flecken.
  // „Lücke“ ist in der Mitte auseinandergerissen – dazwischen die Lücke.
  U.logoZeichnen = function (c) {
    var B = 760, H = 330, S = 2;
    c.width = B * S; c.height = H * S;
    var g = c.getContext("2d");
    g.scale(S, S);
    var zufall = ENG.math.rng(7);
    function fleck(x, y, r, farbe, alpha) {
      for (var i = 0; i < 7; i++) {
        var rx = r * (0.6 + zufall() * 0.5), ry = r * (0.4 + zufall() * 0.35);
        g.save();
        g.translate(x + (zufall() - 0.5) * r * 0.7, y + (zufall() - 0.5) * r * 0.4);
        g.rotate((zufall() - 0.5) * 0.6);
        g.scale(1, ry / rx);
        var gr = g.createRadialGradient(0, 0, 0, 0, 0, rx);
        gr.addColorStop(0, "rgba(" + farbe + "," + alpha + ")");
        gr.addColorStop(0.75, "rgba(" + farbe + "," + (alpha * 0.8) + ")");
        gr.addColorStop(1, "rgba(" + farbe + ",0)");
        g.fillStyle = gr;
        g.beginPath(); g.arc(0, 0, rx, 0, Math.PI * 2); g.fill();
        g.restore();
      }
    }
    fleck(230, 175, 170, "226,178,90", 0.22);
    fleck(540, 185, 160, "99,160,162", 0.2);
    fleck(390, 110, 120, "242,157,137", 0.16);

    var tusche = "#2e2934", papier = "#fdf8ec", rot = "#c8664a";
    var gross = 'bold 150px "Arial Rounded MT Bold", "Segoe UI Black", "Arial Black", system-ui, sans-serif';
    var hand = 'bold 52px "Segoe Print", "Bradley Hand", "Chalkboard SE", "Comic Sans MS", cursive';
    g.lineJoin = "round"; g.lineCap = "round";

    function wort(text, x, y, winkel) {
      g.save();
      g.translate(x, y); g.rotate(winkel);
      g.font = gross;
      g.lineWidth = 16; g.strokeStyle = tusche; g.strokeText(text, 0, 0);
      g.fillStyle = papier; g.fillText(text, 0, 0);
      g.lineWidth = 2.5; g.strokeStyle = "rgba(46,41,52,0.55)"; g.strokeText(text, 2, 1.5);
      g.restore();
    }
    g.font = gross;
    var links = "Lü", rechts = "cke";
    var bl = g.measureText(links).width, br = g.measureText(rechts).width, luecke = 58;
    var x0 = Math.max(20, (B - bl - br - luecke) / 2), y0 = 222;
    wort(links, x0, y0, -0.03);
    wort(rechts, x0 + bl + luecke, y0 + 12, 0.035);

    // Maßlinie über der Lücke
    var gx0 = x0 + bl + 10, gx1 = x0 + bl + luecke - 6, gy = y0 + 38;
    g.strokeStyle = rot; g.lineWidth = 3;
    g.beginPath();
    g.moveTo(gx0, gy - 10); g.lineTo(gx0, gy + 10);
    g.moveTo(gx1, gy - 10); g.lineTo(gx1, gy + 10);
    g.moveTo(gx0 + 2, gy); g.lineTo(gx1 - 2, gy);
    g.moveTo(gx0 + 9, gy - 6); g.lineTo(gx0 + 2, gy); g.lineTo(gx0 + 9, gy + 6);
    g.moveTo(gx1 - 9, gy - 6); g.lineTo(gx1 - 2, gy); g.lineTo(gx1 - 9, gy + 6);
    g.stroke();
    g.setLineDash([4, 6]);
    g.beginPath(); g.moveTo(gx0, y0 - 110); g.lineTo(gx0, gy - 14); g.moveTo(gx1, y0 - 100); g.lineTo(gx1, gy - 14); g.stroke();
    g.setLineDash([]);

    // „Die“ und Untertitel in Handschrift
    g.save();
    g.translate(x0 + 6, y0 - 128); g.rotate(-0.08);
    g.font = hand; g.fillStyle = tusche; g.fillText(DATA.texte.spielTitel.split(" ")[0], 0, 0);
    g.restore();
    g.save();
    g.font = 'bold 34px "Segoe Print", "Bradley Hand", "Chalkboard SE", "Comic Sans MS", cursive';
    var ut = DATA.texte.untertitel, uw = g.measureText(ut).width;
    g.translate(B - uw - 40, y0 + 84); g.rotate(-0.02);
    g.fillStyle = tusche; g.fillText(ut, 0, 0);
    g.strokeStyle = rot; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, 12); g.quadraticCurveTo(uw * 0.5, 22, uw, 8); g.stroke();
    g.restore();
  };

  var logo = null;
  U.titelZeigen = function () {
    var T = DATA.texte.titel;
    if (!logo) {
      logo = neu("canvas", "titel-logo");
      U.logoZeichnen(logo);
      // Versteckt: fünfmal schnell aufs Logo tippen öffnet das Admin-Menü
      var tipps = [];
      logo.addEventListener("click", function () {
        var jetzt = Date.now();
        tipps = tipps.filter(function (t) { return jetzt - t < 2500; });
        tipps.push(jetzt);
        if (tipps.length >= 5) { tipps = []; GAME.admin.oeffnen(); }
      });
    }
    logo.setAttribute("aria-label", DATA.texte.spielTitel + " – " + DATA.texte.untertitel);
    var ein = [{ text: T.neu, aktion: U.neuesSpiel }];
    if (GAME.speicher.vorhanden()) ein.unshift({ text: T.weiter, aktion: U.weiterspielen });
    ein.push({ text: T.einstellungen, aktion: function () { U.einstellungenZeigen(U.titelZeigen); } });
    ein.push({ text: T.steuerung, aktion: function () { U.steuerungZeigen(U.titelZeigen); } });
    ein.push({ text: T.credits, aktion: U.creditsZeigen });
    U.menueOeffnen({ klasse: "titel-menue", inhalt: logo, eintraege: ein, schliessbar: false, hell: true, fussnote: T.fuss });
  };

  U.neuesSpiel = function () {
    var T = DATA.texte.titel;
    if (!GAME.speicher.vorhanden()) { spielBeginnen(null); return; }
    U.menueOeffnen({
      titel: T.neuFrage, inhalt: neu("p", "", T.neuText), schliessbar: false, hell: true,
      eintraege: [
        { text: T.neuJa, aktion: function () { spielBeginnen(null); } },
        { text: T.neuNein, aktion: U.titelZeigen }
      ]
    });
  };

  U.weiterspielen = function () {
    var d = GAME.speicher.laden();
    if (!d) { U.einblenden(DATA.texte.speichern.fehlt); return; }
    spielBeginnen(d);
  };

  function spielBeginnen(stand) {
    U.menueSchliessen(true);
    var opt;
    if (stand) {
      GAME.flags.ersetzen(stand);
      var o = stand.ort || {};
      opt = DATA.maps[o.karte] ? { karte: o.karte, pos: { x: o.x, z: o.z, rot: o.rot || 0 } } : { karte: "europaplatz", spawn: "start" };
    } else {
      GAME.flags.zuruecksetzen();
      opt = { karte: "europaplatz", spawn: "start" };
    }
    GAME.szenen.ueberblenden(GAME.Spielszene, opt);
    // Beim ersten Spiel: Steuerung erklären
    if (!GAME.merker.lesen("hinweisGesehen")) {
      setTimeout(function () {
        U.steuerungZeigen(function () { GAME.merker.schreiben("hinweisGesehen", "1"); });
      }, 500);
    }
  }

  function creditsInhalt() {
    var C = DATA.texte.credits;
    var box = neu("div", "credits");
    C.zeilen.forEach(function (z) {
      var zeile = neu("div", "credits-zeile");
      zeile.appendChild(neu("span", "credits-was", z[0]));
      zeile.appendChild(neu("span", "credits-wer", z[1]));
      box.appendChild(zeile);
    });
    box.appendChild(neu("p", "credits-ki", C.ki));
    box.appendChild(neu("p", "klein", C.hinweis));
    return box;
  }

  U.creditsZeigen = function () {
    var C = DATA.texte.credits;
    U.menueOeffnen({ titel: C.titel, klasse: "menue-breit", inhalt: creditsInhalt(), hell: true,
      eintraege: [{ text: C.zurueck, aktion: U.titelZeigen }], beimSchliessen: U.titelZeigen });
  };

  // ====================================================================
  //  Epilog: Textkarte unten
  // ====================================================================
  U.epilogSeite = function (seite, letzte) {
    var box = $("epilog-text");
    if (!seite) { if (box) box.parentNode.removeChild(box); return; }
    if (!box) {
      box = neu("div");
      box.id = "epilog-text";
      el.ui.appendChild(box);
    }
    var ep = DATA.epilog;
    box.innerHTML = "";
    var karte = neu("div", "karte epilog-karte ploppen");
    if (seite.titel) karte.appendChild(neu("h2", "epilog-titel", seite.titel));
    if (seite.name) karte.appendChild(neu("div", "dialog-name", seite.name));
    var p = neu("p", "epilog-absatz");
    GAME.dialog.zerlegen(seite.text).forEach(function (t) {
      if (t.k) p.appendChild(neu("span", t.k, t.t)); else p.appendChild(document.createTextNode(t.t));
    });
    karte.appendChild(p);
    var fuss = neu("div", "minispiel-fuss");
    var b = neu("button", "knopf gewaehlt", letzte ? ep.ende : ep.weiter);
    b.type = "button";
    b.addEventListener("click", function () { GAME.Epilogszene.weiter(); });
    fuss.appendChild(b);
    fuss.appendChild(neu("span", "minispiel-tipp", ep.tasten));
    karte.appendChild(fuss);
    box.appendChild(karte);
  };

  // ====================================================================
  //  Reflexion: drei Fragen, Entscheidungen, Quellen, Credits
  // ====================================================================
  U.reflexionZeigen = function (ausEpilog) {
    var R = DATA.texte.reflexion;
    var inhalt = neu("div", "reflexion");
    inhalt.appendChild(neu("p", "reflexion-einleitung", R.einleitung));
    var ol = neu("ol", "reflexion-fragen");
    R.fragen.forEach(function (f) { ol.appendChild(neu("li", "", f)); });
    inhalt.appendChild(ol);

    // Entscheidungen im Ausschuss
    inhalt.appendChild(neu("h3", "", R.entscheidungen));
    var fin = GAME.zustand.finale;
    if (fin && fin.massnahmen && fin.massnahmen.length) {
      var ul = neu("ul", "reflexion-liste");
      var opts = DATA.minispiele.massnahmen.optionen;
      fin.massnahmen.forEach(function (id) {
        var o = opts.filter(function (x) { return x.id === id; })[0];
        ul.appendChild(neu("li", "", o ? o.titel : id));
      });
      inhalt.appendChild(ul);
      inhalt.appendChild(neu("p", "klein", R.punkte.replace("{p}", fin.punkte || 0).replace("{max}", fin.max || 0)));
    } else inhalt.appendChild(neu("p", "klein", R.keineEntscheidung));

    // Quellen (aus facts.js, je Quelle einmal)
    inhalt.appendChild(neu("h3", "", R.quellenTitel));
    inhalt.appendChild(neu("p", "klein", R.quellenHinweis));
    var quellen = {}, reihenfolge = [];
    for (var k in DATA.facts) {
      var f = DATA.facts[k];
      if (!f.quelle) continue;
      if (!quellen[f.quelle]) { quellen[f.quelle] = { offen: false }; reihenfolge.push(f.quelle); }
      if (f.verifiziert !== true) quellen[f.quelle].offen = true;
    }
    var ql = neu("ul", "reflexion-quellen");
    reihenfolge.forEach(function (q) {
      var li = neu("li", "", q);
      if (quellen[q].offen) li.appendChild(neu("span", "quelle-offen", " – " + R.ungeprueft));
      ql.appendChild(li);
    });
    inhalt.appendChild(ql);

    inhalt.appendChild(neu("h3", "", R.creditsTitel));
    inhalt.appendChild(creditsInhalt());

    var eintraege = [{ text: R.weiterErkunden, aktion: function () {
      U.menueSchliessen(true);
      if (ausEpilog) GAME.szenen.ueberblenden(GAME.Spielszene, { karte: "europaplatz", spawn: "von_bxl" });
    } }];
    if (ausEpilog) eintraege.push({ text: R.zumTitel, aktion: function () { U.menueSchliessen(true); GAME.szenen.titelStarten(); } });

    U.menueOeffnen({
      titel: R.titel, klasse: "menue-breit reflexion-karte", inhalt: inhalt, eintraege: eintraege,
      schliessbar: !ausEpilog, hell: ausEpilog,
      // ↑ ↓ scrollen, ← → Knopf wählen, Enter auslösen
      tasten: function (I, m) {
        var n = eintraege.length;
        if (I.gehalten("hoch")) m.karte.scrollTop -= 14;
        if (I.gehalten("runter")) m.karte.scrollTop += 14;
        if (I.gedrueckt("links")) { m.wahl = (m.wahl + n - 1) % n; U.menueMalen(); }
        if (I.gedrueckt("rechts")) { m.wahl = (m.wahl + 1) % n; U.menueMalen(); }
        if (I.gedrueckt("ok")) eintraege[m.wahl].aktion();
        else if (I.gedrueckt("pause") && !ausEpilog) U.menueSchliessen();
      }
    });
  };

  return U;
})();
