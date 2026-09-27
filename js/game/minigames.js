/* =====================================================================
   Die Lücke – Minispiele
   ---------------------------------------------------------------------
   1) "zuordnen"   – Werte (z. B. Gehälter) Kategorien zuordnen
                     (Estland: „Welche Branche zahlt mehr?“)
   2) "verhandlung" – Dialog-Minispiel: in mehreren Runden Argumente
                     wählen; gute Argumente bringen Überzeugung
                     (Luxemburg: Gehaltsverhandlung)
   Alle Texte und Werte stehen in DATA.minispiele (data/dialogues.js),
   Zahlen kommen aus facts.js.
   Start aus einem Dialog: aktion "minispiel:branchen".
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.minispiel = (function () {
  "use strict";
  var M = { aktiv: null };
  var el, zustand = null, beiEnde = null;

  function neu(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function textKnoten(text) {
    var f = document.createDocumentFragment();
    GAME.dialog.zerlegen(text).forEach(function (s) {
      if (s.k) f.appendChild(neu("span", s.k, s.t));
      else f.appendChild(document.createTextNode(s.t));
    });
    return f;
  }
  function wertText(faktId) { return GAME.dialog.fakt("fakt", faktId).t; }

  M.init = function () { el = document.getElementById("minispiel"); };
  M.laeuft = function () { return !!M.aktiv; };

  /* id: Schlüssel in DATA.minispiele · fertig(ergebnis): Rückruf am Ende */
  M.starten = function (id, fertig) {
    var def = DATA.minispiele[id];
    if (!def) { console.warn("Minispiel fehlt: " + id); if (fertig) fertig(null); return; }
    M.aktiv = id;
    beiEnde = fertig;
    el.classList.remove("versteckt");
    if (def.art === "zuordnen") zuordnenStart(def);
    else verhandlungStart(def);
  };

  function beenden(ergebnis) {
    var def = DATA.minispiele[M.aktiv];
    if (def.setFlag) GAME.flags.setzen(def.setFlag);
    if (def.addNote) GAME.quests.notiz(def.addNote);
    M.aktiv = null;
    zustand = null;
    el.classList.add("versteckt");
    el.innerHTML = "";
    var cb = beiEnde; beiEnde = null;
    if (cb) cb(ergebnis);
  }

  function rahmen(def) {
    el.innerHTML = "";
    var karte = neu("div", "karte minispiel-karte ploppen");
    karte.appendChild(neu("h2", "", def.titel));
    el.appendChild(karte);
    return karte;
  }

  // ====================================================================
  //  1) Zuordnen
  // ====================================================================
  function zuordnenStart(def) {
    // Werte gemischt anbieten, anfangs ist nichts zugeordnet
    var werte = def.eintraege.map(function (e, i) { return i; });
    for (var i = werte.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = werte[i]; werte[i] = werte[j]; werte[j] = t; }
    zustand = { def: def, werte: werte, wahl: def.eintraege.map(function () { return -1; }), zeile: 0, geprueft: false };
    zuordnenMalen();
  }

  function zuordnenMalen() {
    var z = zustand, def = z.def;
    var karte = rahmen(def);
    var anl = neu("p", "minispiel-anleitung");
    anl.appendChild(textKnoten(z.geprueft ? def.aufloesung : def.anleitung));
    karte.appendChild(anl);
    var tab = neu("div", "zuordnen");
    def.eintraege.forEach(function (e, i) {
      var zeile = neu("div", "zuordnen-zeile" + (i === z.zeile && !z.geprueft ? " gewaehlt" : ""));
      zeile.appendChild(neu("span", "zuordnen-name", e.name));
      var knopf = neu("button", "zuordnen-wert");
      knopf.type = "button";
      if (z.geprueft) {
        var richtig = z.wahl[i] === i;
        knopf.className += richtig ? " richtig" : " falsch";
        knopf.textContent = wertText(e.fakt) + (richtig ? "  ✓" : "");
        var zusatz = neu("span", "zuordnen-zusatz");
        zusatz.appendChild(textKnoten(e.zusatz || ""));
        zeile.appendChild(knopf);
        zeile.appendChild(zusatz);
      } else {
        knopf.textContent = z.wahl[i] >= 0 ? wertText(def.eintraege[z.wahl[i]].fakt) : def.leer;
        if (z.wahl[i] < 0) knopf.className += " leer";
        knopf.addEventListener("click", function () { z.zeile = i; wechseln(1); });
        zeile.appendChild(knopf);
      }
      tab.appendChild(zeile);
    });
    karte.appendChild(tab);
    var fuss = neu("div", "minispiel-fuss");
    var b = neu("button", "knopf", z.geprueft ? def.weiter : def.pruefen);
    b.type = "button";
    b.addEventListener("click", function () { bestaetigen(); });
    fuss.appendChild(b);
    if (!z.geprueft) fuss.appendChild(neu("span", "minispiel-tipp", def.tasten));
    karte.appendChild(fuss);
  }

  // Wert der gewählten Zeile weiterschalten (nur noch freie Werte)
  function wechseln(r) {
    var z = zustand, n = z.def.eintraege.length;
    var belegt = z.wahl.filter(function (w, i) { return w >= 0 && i !== z.zeile; });
    var liste = [-1].concat(z.werte.filter(function (w) { return belegt.indexOf(w) < 0; }));
    var pos = liste.indexOf(z.wahl[z.zeile]);
    pos = (pos + r + liste.length) % liste.length;
    z.wahl[z.zeile] = liste[pos];
    if (n) zuordnenMalen();
  }

  function bestaetigen() {
    var z = zustand;
    if (z.geprueft) {
      var richtige = z.wahl.filter(function (w, i) { return w === i; }).length;
      beenden({ richtig: richtige, von: z.wahl.length });
      return;
    }
    if (z.wahl.some(function (w) { return w < 0; })) {
      // erst alles zuordnen
      var anl = el.querySelector(".minispiel-anleitung");
      if (anl) { anl.textContent = z.def.nochNichtFertig; anl.classList.add("wackeln"); }
      return;
    }
    z.geprueft = true;
    zuordnenMalen();
  }

  // ====================================================================
  //  2) Verhandlung
  // ====================================================================
  function verhandlungStart(def) {
    zustand = { def: def, runde: 0, wert: def.start, reaktion: def.einleitung, wahl: 0, phase: "frage", ergebnis: null };
    verhandlungMalen();
  }

  function verhandlungMalen() {
    var z = zustand, def = z.def;
    var karte = rahmen(def);
    karte.appendChild(neu("p", "minispiel-rolle", def.rolle));

    var meter = neu("div", "meter");
    meter.appendChild(neu("span", "meter-name", def.meterName));
    var balken = neu("div", "meter-balken");
    var fuell = neu("div", "meter-fuellung");
    fuell.style.width = Math.max(0, Math.min(100, z.wert)) + "%";
    balken.appendChild(fuell);
    var ziel = neu("div", "meter-ziel");
    ziel.style.left = def.ziel + "%";
    balken.appendChild(ziel);
    meter.appendChild(balken);
    karte.appendChild(meter);

    var sprech = neu("div", "verhandlung-rede");
    if (z.reaktion) {
      var r = neu("p", "rede-reaktion");
      r.appendChild(neu("b", "", def.gegenueber + ": "));
      r.appendChild(textKnoten(z.reaktion));
      sprech.appendChild(r);
    }
    if (z.phase === "frage") {
      var runde = def.runden[z.runde];
      var f = neu("p", "rede-frage");
      f.appendChild(neu("b", "", def.gegenueber + ": "));
      f.appendChild(textKnoten(runde.frage));
      sprech.appendChild(f);
      karte.appendChild(sprech);
      var opts = neu("div", "dialog-optionen");
      runde.optionen.forEach(function (o, i) {
        var b = neu("button", "dialog-option" + (i === z.wahl ? " gewaehlt" : ""), o.text);
        b.type = "button";
        b.addEventListener("mouseenter", function () { z.wahl = i; verhandlungMalen(); });
        b.addEventListener("click", function () { z.wahl = i; waehlen(); });
        opts.appendChild(b);
      });
      karte.appendChild(opts);
      karte.appendChild(neu("p", "minispiel-tipp", def.tasten + "  ·  " + def.rundeText.replace("{n}", z.runde + 1).replace("{von}", def.runden.length)));
    } else {
      karte.appendChild(sprech);
      var erg = neu("div", "verhandlung-ergebnis");
      erg.appendChild(textKnoten(z.ergebnis.text));
      karte.appendChild(erg);
      var lehre = neu("p", "minispiel-anleitung");
      lehre.appendChild(textKnoten(def.lehre));
      karte.appendChild(lehre);
      var fuss = neu("div", "minispiel-fuss");
      var nochmal = neu("button", "knopf", def.nochmal);
      nochmal.type = "button";
      nochmal.addEventListener("click", function () { verhandlungStart(def); });
      var weiter = neu("button", "knopf", def.weiter);
      weiter.type = "button";
      weiter.addEventListener("click", function () { beenden({ wert: z.wert, erfolg: z.wert >= def.ziel }); });
      fuss.appendChild(weiter);
      fuss.appendChild(nochmal);
      karte.appendChild(fuss);
      z.knoepfe = [weiter, nochmal];
      z.knopfWahl = z.knopfWahl || 0;
      z.knoepfe.forEach(function (k, i) { k.classList.toggle("gewaehlt", i === z.knopfWahl); });
    }
  }

  function waehlen() {
    var z = zustand, def = z.def, o = def.runden[z.runde].optionen[z.wahl];
    z.wert = Math.max(0, Math.min(100, z.wert + o.punkte));
    z.reaktion = o.reaktion;
    z.runde++;
    z.wahl = 0;
    if (z.runde >= def.runden.length) {
      z.phase = "ende";
      for (var i = 0; i < def.ergebnisse.length; i++) {
        if (z.wert >= def.ergebnisse[i].ab) { z.ergebnis = def.ergebnisse[i]; break; }
      }
      if (z.wert >= def.ziel && def.erfolgFlag) GAME.flags.setzen(def.erfolgFlag);
    }
    verhandlungMalen();
  }

  // ====================================================================
  M.update = function () {
    if (!M.aktiv || !zustand) return;
    var I = ENG.input, z = zustand;
    if (z.def.art === "zuordnen") {
      var n = z.def.eintraege.length;
      if (!z.geprueft) {
        if (I.gedrueckt("hoch")) { z.zeile = (z.zeile + n - 1) % n; zuordnenMalen(); }
        if (I.gedrueckt("runter")) { z.zeile = (z.zeile + 1) % n; zuordnenMalen(); }
        if (I.gedrueckt("links")) wechseln(-1);
        if (I.gedrueckt("rechts")) wechseln(1);
        if (I.neu.Enter || I.neu.NumpadEnter) bestaetigen();
        else if (I.gedrueckt("aktion")) wechseln(1);
      } else if (I.gedrueckt("ok")) bestaetigen();
    } else if (z.phase === "frage") {
      var k = z.def.runden[z.runde].optionen.length;
      if (I.gedrueckt("hoch")) { z.wahl = (z.wahl + k - 1) % k; verhandlungMalen(); }
      if (I.gedrueckt("runter")) { z.wahl = (z.wahl + 1) % k; verhandlungMalen(); }
      if (I.gedrueckt("ok")) waehlen();
    } else {
      if (I.gedrueckt("hoch") || I.gedrueckt("runter") || I.gedrueckt("links") || I.gedrueckt("rechts")) {
        z.knopfWahl = 1 - (z.knopfWahl || 0); verhandlungMalen();
      }
      if (I.gedrueckt("ok")) {
        if ((z.knopfWahl || 0) === 0) beenden({ wert: z.wert, erfolg: z.wert >= z.def.ziel });
        else verhandlungStart(z.def);
      }
    }
    I.verbrauchen("ok"); I.verbrauchen("aktion"); I.verbrauchen("pause");
  };

  return M;
})();
