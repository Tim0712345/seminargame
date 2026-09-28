/* =====================================================================
   Die Lücke – Minispiele
   ---------------------------------------------------------------------
   1) "zuordnen"   – Werte (z. B. Gehälter) Kategorien zuordnen
                     (Estland: „Welche Branche zahlt mehr?“)
   2) "verhandlung" – Dialog-Minispiel: in mehreren Runden Argumente
                     wählen; gute Argumente bringen Überzeugung
                     (Luxemburg: Gehaltsverhandlung)
   Finale im Sitzungssaal (Phase 4):
   3) "praesentation" – die fünf Beweisstücke nacheinander vorstellen
   4) "duell"         – drei Abgeordnete fragen, Kim antwortet mit einer
                        Notiz aus dem Notizbuch (kein Game Over)
   5) "massnahmen"    – drei von sechs Maßnahmen mit Vor- und Nachteilen
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
    el.classList.toggle("unten", def.art === "praesentation");
    if (def.art === "zuordnen") zuordnenStart(def);
    else if (def.art === "praesentation") praesentationStart(def);
    else if (def.art === "duell") duellStart(def);
    else if (def.art === "massnahmen") massnahmenStart(def);
    else verhandlungStart(def);
  };

  function beenden(ergebnis) {
    var def = DATA.minispiele[M.aktiv];
    if (def.setFlag) GAME.flags.setzen(def.setFlag);
    if (def.addNote) GAME.quests.notiz(def.addNote);
    M.aktiv = null;
    zustand = null;
    el.classList.add("versteckt");
    el.classList.remove("unten");
    el.innerHTML = "";
    var cb = beiEnde; beiEnde = null;
    if (cb) cb(ergebnis);
  }

  function rahmen(def, klasse) {
    el.innerHTML = "";
    var karte = neu("div", "karte minispiel-karte ploppen" + (klasse ? " " + klasse : ""));
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

  /* Darstellung: links die Stände (Ablagefelder), unten die Gehälter als
     Kärtchen. Kärtchen lassen sich ziehen (Maus/Finger) oder antippen und
     dann auf einen Stand tippen. Tastatur: ↑ ↓ Stand, ← → Gehalt.         */
  function zuordnenMalen() {
    var z = zustand, def = z.def;
    var karte = rahmen(def, "zuordnen-karte");
    var anl = neu("p", "minispiel-anleitung");
    anl.appendChild(textKnoten(z.geprueft ? def.aufloesung : def.anleitung));
    karte.appendChild(anl);
    var tab = neu("div", "zuordnen");
    def.eintraege.forEach(function (e, i) {
      var zeile = neu("div", "zuordnen-zeile" + (i === z.zeile && !z.geprueft ? " gewaehlt" : ""));
      zeile.appendChild(neu("span", "zuordnen-name", e.name));
      var feld = neu("div", "zuordnen-feld");
      feld.setAttribute("data-zeile", i);
      if (z.geprueft) {
        var richtig = z.wahl[i] === i;
        var c = neu("span", "gehalt-chip " + (richtig ? "richtig" : "falsch"), wertText(def.eintraege[z.wahl[i]].fakt) + (richtig ? "  ✓" : ""));
        feld.appendChild(c);
        if (!richtig) feld.appendChild(neu("span", "zuordnen-korrektur", "→ " + wertText(e.fakt)));
        zeile.appendChild(feld);
        var zusatz = neu("span", "zuordnen-zusatz");
        zusatz.appendChild(textKnoten(e.zusatz || ""));
        zeile.appendChild(zusatz);
      } else {
        if (z.wahl[i] >= 0) feld.appendChild(chip(z.wahl[i]));
        else feld.appendChild(neu("span", "zuordnen-leer", def.leer));
        feld.classList.toggle("frei", z.wahl[i] < 0);
        feld.addEventListener("click", function () { feldAntippen(i); });
        zeile.appendChild(feld);
      }
      tab.appendChild(zeile);
    });
    karte.appendChild(tab);
    if (!z.geprueft) {
      var pool = neu("div", "gehalt-pool");
      pool.setAttribute("data-zeile", "pool");
      var frei = z.werte.filter(function (w) { return z.wahl.indexOf(w) < 0; });
      if (!frei.length) pool.appendChild(neu("span", "zuordnen-leer", def.alleVerteilt));
      frei.forEach(function (w) { pool.appendChild(chip(w)); });
      karte.appendChild(pool);
    }
    var fuss = neu("div", "minispiel-fuss");
    var b = neu("button", "knopf" + (z.geprueft || z.wahl.indexOf(-1) < 0 ? " gewaehlt" : ""), z.geprueft ? def.weiter : def.pruefen);
    b.type = "button";
    b.addEventListener("click", function () { bestaetigen(); });
    fuss.appendChild(b);
    if (!z.geprueft) fuss.appendChild(neu("span", "minispiel-tipp", def.tasten));
    karte.appendChild(fuss);
  }

  // Ein Gehalts-Kärtchen (ziehbar)
  function chip(w) {
    var z = zustand;
    var c = neu("span", "gehalt-chip" + (z.gewaehlterWert === w ? " angetippt" : ""), wertText(z.def.eintraege[w].fakt));
    c.addEventListener("pointerdown", function (e) { ziehenStart(e, w, c); });
    return c;
  }

  // Wert w in Zeile i legen (Zeile -1 = zurück in den Vorrat)
  function ablegen(w, i) {
    var z = zustand, alt = z.wahl.indexOf(w);
    if (i < 0) { if (alt >= 0) z.wahl[alt] = -1; }
    else {
      var dort = z.wahl[i];
      z.wahl[i] = w;
      if (alt >= 0 && alt !== i) z.wahl[alt] = dort;   // tauschen
      z.zeile = i;
    }
    z.gewaehlterWert = null;
    zuordnenMalen();
  }

  function feldAntippen(i) {
    var z = zustand;
    if (z.gewaehlterWert !== null && z.gewaehlterWert !== undefined) ablegen(z.gewaehlterWert, i);
    else { z.zeile = i; zuordnenMalen(); }
  }

  // Ziehen mit Maus oder Finger
  function ziehenStart(e, w, el0) {
    e.preventDefault(); e.stopPropagation();
    var z = zustand, sx = e.clientX, sy = e.clientY, gezogen = false, geist = null;
    function bewegen(ev) {
      var dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!gezogen && dx * dx + dy * dy > 64) {
        gezogen = true;
        geist = el0.cloneNode(true);
        geist.className += " geist";
        document.body.appendChild(geist);
        el0.classList.add("wird-gezogen");
      }
      if (geist) { geist.style.left = ev.clientX + "px"; geist.style.top = ev.clientY + "px"; }
      markieren(ev.clientX, ev.clientY);
    }
    function ziel(x, y) {
      var t = document.elementFromPoint(x, y);
      var f = t && t.closest ? t.closest("[data-zeile]") : null;
      if (!f) return null;
      var a = f.getAttribute("data-zeile");
      return a === "pool" ? -1 : parseInt(a, 10);
    }
    function markieren(x, y) {
      var alle = el.querySelectorAll(".zuordnen-feld");
      if (geist) geist.style.display = "none";
      var zi = ziel(x, y);
      if (geist) geist.style.display = "";
      for (var k = 0; k < alle.length; k++) alle[k].classList.toggle("drueber", zi === k);
    }
    function loslassen(ev) {
      window.removeEventListener("pointermove", bewegen);
      window.removeEventListener("pointerup", loslassen);
      window.removeEventListener("pointercancel", loslassen);
      if (geist) geist.style.display = "none";
      var zi = gezogen ? ziel(ev.clientX, ev.clientY) : null;
      if (geist && geist.parentNode) geist.parentNode.removeChild(geist);
      if (!zustand || zustand.geprueft) return;
      if (!gezogen) {
        // nur angetippt: auswählen (noch einmal antippen = abwählen)
        z.gewaehlterWert = z.gewaehlterWert === w ? null : w;
        zuordnenMalen();
      } else if (zi !== null) ablegen(w, zi);
      else zuordnenMalen();
    }
    window.addEventListener("pointermove", bewegen);
    window.addEventListener("pointerup", loslassen);
    window.addEventListener("pointercancel", loslassen);
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
  //  3) Präsentation der Beweisstücke (Finale)
  // ====================================================================
  function praesentationStart(def) {
    zustand = { def: def, i: 0 };
    praesentationMalen();
  }

  function praesentationMalen() {
    var z = zustand, def = z.def, k = def.karten[z.i], land = DATA.countries[k.land] || {};
    var karte = rahmen(def, "praesentation-karte land-" + k.land);
    karte.removeChild(karte.firstChild);                       // Titel ersetzen
    var kopf = neu("div", "praesentation-kopf");
    var icon = neu("div", "beweis-slot gefunden land-" + k.land);
    icon.innerHTML = GAME.beweisHud.icon(k.land);
    kopf.appendChild(icon);
    var tx = neu("div");
    tx.appendChild(neu("p", "praesentation-zaehler", def.zaehler.replace("{n}", z.i + 1).replace("{von}", def.karten.length)));
    tx.appendChild(neu("h2", "", land.beweis ? land.beweis.name : k.land));
    tx.appendChild(neu("p", "praesentation-ort", (land.viertel || "") + " · " + (land.ursache || "")));
    kopf.appendChild(tx);
    karte.appendChild(kopf);
    var p = neu("p", "minispiel-anleitung");
    p.appendChild(textKnoten(k.text));
    karte.appendChild(p);
    var fuss = neu("div", "minispiel-fuss");
    var b = neu("button", "knopf gewaehlt", z.i < def.karten.length - 1 ? def.weiter : def.fertig);
    b.type = "button";
    b.addEventListener("click", praesentationWeiter);
    fuss.appendChild(b);
    fuss.appendChild(neu("span", "minispiel-tipp", def.tasten));
    karte.appendChild(fuss);
    // Kim hält das Beweisstück hoch
    var sz = GAME.Spielszene;
    if (sz.spieler) { sz.spieler.figur.jubeln(); sz.spieler.figur.emotion = "froehlich"; sz.beweisZeigen(k.land, 1.8); }
  }

  function praesentationWeiter() {
    var z = zustand;
    z.i++;
    if (z.i >= z.def.karten.length) { GAME.Spielszene.beweisZeigen(null); beenden({}); return; }
    praesentationMalen();
  }

  // ====================================================================
  //  4) Argumentationsduell (Finale)
  // ====================================================================
  function duellStart(def) {
    GAME.flags.setzen(["duell_punkte_hoch", "duell_punkte_mittel"], false);   // falls das Duell wiederholt wird
    var portrait = neu("canvas");
    portrait.width = portrait.height = 256;
    zustand = { def: def, frage: 0, versuch: 0, punkte: 0, max: def.fragen.length * def.punkteRichtig[0],
                phase: "frage", reiter: 0, wahl: 0, antwort: null, portrait: portrait, bild: 0 };
    reiterMitNotiz(1);
    duellMalen();
  }

  function notizenIm(reiterIndex) {
    var rid = DATA.texte.notizbuch.reiter[reiterIndex].id;
    return GAME.zustand.notizen.filter(function (n) { return DATA.notes[n] && DATA.notes[n].reiter === rid; });
  }
  // Ab dem aktuellen Reiter den nächsten mit Notizen suchen
  function reiterMitNotiz(richtung) {
    var z = zustand, n = DATA.texte.notizbuch.reiter.length;
    for (var i = 0; i < n; i++) {
      if (notizenIm(z.reiter).length) break;
      z.reiter = (z.reiter + richtung + n) % n;
    }
    z.wahl = 0;
  }

  function mpFigur() {
    var f = zustand.def.fragen[zustand.frage];
    return f && GAME.Spielszene.figurVon ? GAME.Spielszene.figurVon(f.wer) : null;
  }

  function punkteZeichnen(z) {
    var leiste = neu("div", "duell-punkte");
    leiste.appendChild(neu("span", "meter-name", z.def.punkteName));
    for (var i = 0; i < z.max; i++) leiste.appendChild(neu("span", "punkt" + (i < z.punkte ? " voll" : "")));
    return leiste;
  }

  function duellMalen() {
    var z = zustand, def = z.def, T = DATA.texte.notizbuch;
    var karte = rahmen(def, "duell-karte");
    karte.appendChild(punkteZeichnen(z));

    if (z.phase === "ende") {
      var erg = neu("div", "verhandlung-ergebnis");
      erg.textContent = def.ergebnis.replace("{p}", z.punkte).replace("{max}", z.max);
      karte.appendChild(erg);
      var fe = neu("div", "minispiel-fuss");
      var be = neu("button", "knopf gewaehlt", def.weiter);
      be.type = "button";
      be.addEventListener("click", duellWeiter);
      fe.appendChild(be);
      karte.appendChild(fe);
      return;
    }

    var fr = def.fragen[z.frage];
    var mp = DATA.characters[fr.wer] || {};
    var fig = mpFigur();
    if (fig) fig.emotion = z.phase === "frage" ? "skeptisch" : (z.antwort.art === "richtig" ? "froehlich" : "nachdenklich");

    // Abgeordnete*r mit Portrait und Frage
    var kopf = neu("div", "duell-kopf");
    var rahmenP = neu("div", "dialog-portrait");
    rahmenP.appendChild(z.portrait);
    kopf.appendChild(rahmenP);
    var rede = neu("div", "duell-rede");
    var name = neu("div", "dialog-name", mp.name || fr.wer);
    rede.appendChild(name);
    rede.appendChild(neu("span", "duell-haltung", fr.haltung));
    var fp = neu("p", "duell-frage");
    fp.appendChild(textKnoten(z.phase === "frage" ? fr.frage : z.antwort.text));
    if (z.phase !== "frage") fp.className += " antwort-" + z.antwort.art;
    rede.appendChild(fp);
    kopf.appendChild(rede);
    karte.appendChild(kopf);

    if (z.phase === "antwort") {
      if (z.antwort.punkte) karte.appendChild(neu("p", "duell-plus", "+" + z.antwort.punkte + " " + def.punkteName));
      var fa = neu("div", "minispiel-fuss");
      var ba = neu("button", "knopf gewaehlt", def.weiter);
      ba.type = "button";
      ba.addEventListener("click", duellWeiter);
      fa.appendChild(ba);
      fa.appendChild(neu("span", "minispiel-tipp", "E oder Enter: weiter"));
      karte.appendChild(fa);
      return;
    }

    // Notizbuch: Reiter, Liste, Vorschau
    karte.appendChild(neu("p", "minispiel-anleitung", def.anleitung));
    var leiste = neu("div", "buch-reiter");
    T.reiter.forEach(function (r, i) {
      var anz = notizenIm(i).length;
      var b = neu("button", "reiter reiter-" + r.id + (i === z.reiter ? " gewaehlt" : "") + (anz ? "" : " leer"), r.titel + (anz ? " (" + anz + ")" : ""));
      b.type = "button";
      b.addEventListener("click", function () { z.reiter = i; z.wahl = 0; duellMalen(); });
      leiste.appendChild(b);
    });
    karte.appendChild(leiste);

    var bereich = neu("div", "duell-notizen");
    var liste = neu("div", "duell-liste");
    var ids = notizenIm(z.reiter);
    if (!ids.length) liste.appendChild(neu("p", "buch-leer", def.keineNotiz));
    ids.forEach(function (id, i) {
      var b = neu("button", "dialog-option" + (i === z.wahl ? " gewaehlt" : ""), DATA.notes[id].titel);
      b.type = "button";
      b.addEventListener("click", function () { if (z.wahl === i) duellVorlegen(); else { z.wahl = i; duellMalen(); } });
      liste.appendChild(b);
    });
    bereich.appendChild(liste);
    var vorschau = neu("div", "duell-vorschau notiz");
    var nid = ids[z.wahl];
    if (nid) {
      vorschau.appendChild(neu("h3", "", DATA.notes[nid].titel));
      var tp = neu("p");
      tp.appendChild(textKnoten(DATA.notes[nid].text));
      vorschau.appendChild(tp);
      if (DATA.notes[nid].quelle) vorschau.appendChild(neu("p", "quelle", T.quelle + " " + DATA.notes[nid].quelle));
    }
    bereich.appendChild(vorschau);
    karte.appendChild(bereich);

    var fuss = neu("div", "minispiel-fuss");
    var bv = neu("button", "knopf" + (nid ? " gewaehlt" : ""), def.vorlegen);
    bv.type = "button";
    bv.disabled = !nid;
    bv.addEventListener("click", duellVorlegen);
    fuss.appendChild(bv);
    fuss.appendChild(neu("span", "minispiel-tipp", def.tasten));
    karte.appendChild(fuss);
    var gew = liste.querySelector(".gewaehlt");
    if (gew && gew.scrollIntoView) gew.scrollIntoView({ block: "nearest" });
  }

  function duellVorlegen() {
    var z = zustand, def = z.def, fr = def.fragen[z.frage];
    var id = notizenIm(z.reiter)[z.wahl];
    if (!id) return;
    var ok = fr.passend.indexOf(id) >= 0;
    z.versuch++;
    if (ok) {
      var p = def.punkteRichtig[z.versuch - 1] || 0;
      z.punkte += p;
      z.antwort = { art: "richtig", text: fr.richtig, punkte: p };
      var fig = mpFigur();
      if (fig) fig.huepfen();
    } else if (z.versuch >= def.versuche) {
      z.antwort = { art: "aufgeben", text: fr.aufgeben };
    } else {
      z.antwort = { art: "falsch", text: fr.falsch + " " + fr.tipp };
    }
    z.phase = "antwort";
    duellMalen();
  }

  function duellWeiter() {
    var z = zustand, def = z.def;
    if (z.phase === "ende") {
      var f = GAME.zustand.finale || {};
      GAME.zustand.finale = { punkte: z.punkte, max: z.max, massnahmen: f.massnahmen || [] };
      if (z.punkte >= def.grenzeHoch) GAME.flags.setzen("duell_punkte_hoch");
      else if (z.punkte >= def.grenzeMittel) GAME.flags.setzen("duell_punkte_mittel");
      var fig = mpFigur();
      if (fig) fig.emotion = "neutral";
      beenden({ punkte: z.punkte, max: z.max });
      return;
    }
    if (z.antwort.art === "falsch") { z.phase = "frage"; duellMalen(); return; }
    var alt = mpFigur();
    if (alt) alt.emotion = "neutral";
    z.frage++; z.versuch = 0; z.antwort = null;
    z.phase = z.frage >= def.fragen.length ? "ende" : "frage";
    duellMalen();
  }

  // ====================================================================
  //  5) Maßnahmen wählen (Finale)
  // ====================================================================
  function massnahmenStart(def) {
    zustand = { def: def, fokus: 0, gewaehlt: [], meldung: "" };
    massnahmenMalen();
  }

  function massnahmenMalen() {
    var z = zustand, def = z.def;
    var karte = rahmen(def, "massnahmen-karte");
    var anl = neu("p", "minispiel-anleitung" + (z.meldung ? " wackeln" : ""), z.meldung || def.anleitung);
    karte.appendChild(anl);
    var raster = neu("div", "massnahmen");
    def.optionen.forEach(function (o, i) {
      var an = z.gewaehlt.indexOf(o.id) >= 0;
      var k = neu("div", "massnahme farbe-" + o.farbe + (an ? " an" : "") + (i === z.fokus ? " fokus" : ""));
      k.setAttribute("role", "checkbox");
      k.setAttribute("aria-checked", an ? "true" : "false");
      var kopf = neu("div", "massnahme-kopf");
      var box = neu("span", "haken");
      box.innerHTML = an
        ? '<svg viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="3"/><path d="M5 10 L9 14 L16 4" class="h"/></svg>'
        : '<svg viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="3"/></svg>';
      kopf.appendChild(box);
      kopf.appendChild(neu("h3", "", o.titel));
      k.appendChild(kopf);
      k.appendChild(neu("p", "massnahme-kurz", o.kurz));
      var pc = neu("div", "massnahme-pc");
      [["pro", o.pro, def.pro], ["contra", o.contra, def.contra]].forEach(function (x) {
        var sp = neu("div", "massnahme-" + x[0]);
        sp.appendChild(neu("b", "", x[2]));
        var ul = neu("ul");
        x[1].forEach(function (t) { ul.appendChild(neu("li", "", t)); });
        sp.appendChild(ul);
        pc.appendChild(sp);
      });
      k.appendChild(pc);
      k.addEventListener("click", function () { z.fokus = i; umschalten(); });
      raster.appendChild(k);
    });
    karte.appendChild(raster);
    var fuss = neu("div", "minispiel-fuss");
    var bereit = z.gewaehlt.length === def.anzahl;
    var b = neu("button", "knopf" + (bereit ? " gewaehlt" : ""), def.vorlegen);
    b.type = "button";
    b.disabled = !bereit;
    b.addEventListener("click", vorlegen);
    fuss.appendChild(b);
    fuss.appendChild(neu("span", "massnahmen-zaehler", def.zaehler.replace("{n}", z.gewaehlt.length).replace("{von}", def.anzahl)));
    fuss.appendChild(neu("span", "minispiel-tipp", def.tasten));
    karte.appendChild(fuss);
    var f = raster.children[z.fokus];
    if (f && f.scrollIntoView) f.scrollIntoView({ block: "nearest" });
    z.meldung = "";
  }

  function umschalten() {
    var z = zustand, o = z.def.optionen[z.fokus], k = z.gewaehlt.indexOf(o.id);
    if (k >= 0) z.gewaehlt.splice(k, 1);
    else if (z.gewaehlt.length < z.def.anzahl) z.gewaehlt.push(o.id);
    else z.meldung = z.def.schonVoll || z.def.zuWenig;
    massnahmenMalen();
  }

  function vorlegen() {
    var z = zustand;
    if (z.gewaehlt.length !== z.def.anzahl) { z.meldung = z.def.zuWenig; massnahmenMalen(); return; }
    z.gewaehlt.forEach(function (id) { GAME.flags.setzen("massnahme_" + id); });
    var f = GAME.zustand.finale || { punkte: 0, max: 0 };
    GAME.zustand.finale = { punkte: f.punkte || 0, max: f.max || 0, massnahmen: z.gewaehlt.slice() };
    beenden({ massnahmen: z.gewaehlt.slice() });
  }

  // 3D-Portrait der fragenden Person (nach dem Zeichnen der Szene aufrufen)
  M.portraitZeichnen = function (umgebung, t) {
    var z = zustand;
    if (!z || z.def.art !== "duell" || z.phase === "ende") return;
    z.bild++;
    if (z.bild % 2) return;
    var f = mpFigur();
    if (f) ENG.renderer.portrait(f, z.portrait, umgebung, t, 0.3);
  };

  // ====================================================================
  M.update = function () {
    if (!M.aktiv || !zustand) return;
    var I = ENG.input, z = zustand;
    if (z.def.art === "praesentation") {
      if (I.gedrueckt("ok")) praesentationWeiter();
    } else if (z.def.art === "duell") {
      if (z.phase === "frage") {
        var nr = DATA.texte.notizbuch.reiter.length, anz = notizenIm(z.reiter).length;
        if (I.gedrueckt("links")) { z.reiter = (z.reiter + nr - 1) % nr; reiterMitNotiz(-1); duellMalen(); }
        if (I.gedrueckt("rechts")) { z.reiter = (z.reiter + 1) % nr; reiterMitNotiz(1); duellMalen(); }
        if (anz && I.gedrueckt("hoch")) { z.wahl = (z.wahl + anz - 1) % anz; duellMalen(); }
        if (anz && I.gedrueckt("runter")) { z.wahl = (z.wahl + 1) % anz; duellMalen(); }
        if (I.gedrueckt("ok")) duellVorlegen();
      } else if (I.gedrueckt("ok")) duellWeiter();
    } else if (z.def.art === "massnahmen") {
      var n = z.def.optionen.length, sp = 3;
      if (I.gedrueckt("links")) { z.fokus = (z.fokus + n - 1) % n; massnahmenMalen(); }
      if (I.gedrueckt("rechts")) { z.fokus = (z.fokus + 1) % n; massnahmenMalen(); }
      if (I.gedrueckt("hoch")) { z.fokus = (z.fokus + n - sp) % n; massnahmenMalen(); }
      if (I.gedrueckt("runter")) { z.fokus = (z.fokus + sp) % n; massnahmenMalen(); }
      if (I.neu.Enter || I.neu.NumpadEnter) { if (z.gewaehlt.length === z.def.anzahl) vorlegen(); else umschalten(); }
      else if (I.gedrueckt("aktion")) umschalten();
    } else if (z.def.art === "zuordnen") {
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
