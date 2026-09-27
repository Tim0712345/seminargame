/* =====================================================================
   Die Lücke – Dialogsystem
   ---------------------------------------------------------------------
   Gesprächsbäume aus data/dialogues.js. Ein Knoten:
     speaker   Name im Namensschild ("Kim" = Spielfigur)
     wer       optional: Figuren-ID des Sprechers (z. B. "laurent"), wenn
               nicht die angesprochene Person spricht
     text      Text; Platzhalter: {fakt:id} (Wert + Einheit), {wert:id},
               {jahr:id}; **fett**
     emotion   froehlich | nachdenklich | ueberrascht | skeptisch | neutral
     emote     Symbol über dem Kopf: ! ? gluehbirne herz schweiss
     next      nächster Knoten (ohne Optionen), "ende" beendet
     options   [{ label, next, setFlag, requiresFlag, addNote, aktion }]
     setFlag / addNote / aktion  werden beim Anzeigen des Knotens ausgeführt
   Aktionen (mehrere mit ";"): beweis:de · emote:gluehbirne · emoteKim:herz
                               jubeln · einblenden:Text · minispiel:branchen
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.dialog = (function () {
  "use strict";
  var D = { aktiv: false };
  var el = {};
  var dlg = null, dlgId = null, kontext = null, knoten = null, knotenId = null;
  var segmente = [], gesamt = 0, gezeigt = 0, tippGeschw = 48;
  var optionen = [], wahl = 0, sprecher = null, sprecherIstKim = false;
  var bildZaehler = 0;
  var wartendesMinispiel = null;   // startet, sobald der Dialog endet

  function neu(tag, klasse) { var e = document.createElement(tag); if (klasse) e.className = klasse; return e; }

  D.init = function () {
    el.box = document.getElementById("dialog");
    el.box.innerHTML = "";
    var karte = neu("div", "karte dialog-karte");
    el.portraitRahmen = neu("div", "dialog-portrait");
    el.portrait = neu("canvas");
    el.portrait.width = el.portrait.height = 256;
    el.portraitRahmen.appendChild(el.portrait);
    var inhalt = neu("div", "dialog-inhalt");
    el.name = neu("div", "dialog-name");
    el.text = neu("div", "dialog-text");
    el.optionen = neu("div", "dialog-optionen");
    el.weiter = neu("div", "dialog-weiter");
    el.weiter.textContent = "▼";
    inhalt.appendChild(el.name);
    inhalt.appendChild(el.text);
    inhalt.appendChild(el.optionen);
    karte.appendChild(el.portraitRahmen);
    karte.appendChild(inhalt);
    karte.appendChild(el.weiter);
    el.box.appendChild(karte);
    karte.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".dialog-option")) return;
      weiterDruecken();
    });
  };

  // ---------------- Text-Platzhalter ----------------
  function zahl(v) {
    if (typeof v !== "number") return String(v);
    var neg = v < 0, a = Math.abs(v);
    var teile = (Math.round(a * 100) / 100).toString().split(".");
    teile[0] = teile[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "−" : "") + teile.join(",");
  }
  D.fakt = function (art, id) {
    var f = DATA.facts[id];
    if (!f) { console.warn("Fakt fehlt in facts.js: " + id); return { t: "[?" + id + "]", ungeprueft: true }; }
    var t;
    if (art === "jahr") t = String(f.jahr);
    else if (art === "wert") t = zahl(f.wert);
    else t = zahl(f.wert) + (f.einheit ? (f.einheit === "%" ? " %" : " " + f.einheit) : "");
    return { t: t, ungeprueft: f.verifiziert !== true };
  };

  // Text in Abschnitte zerlegen (für Schreibmaschine + Hervorhebung)
  D.zerlegen = function (text) {
    var out = [], re = /\{(fakt|wert|jahr):([a-z0-9_]+)\}|\*\*([^*]+)\*\*/gi, letzte = 0, m;
    text = String(text || "");
    while ((m = re.exec(text))) {
      if (m.index > letzte) out.push({ t: text.slice(letzte, m.index) });
      if (m[1]) { var f = D.fakt(m[1].toLowerCase(), m[2]); out.push({ t: f.t, k: "fakt" + (f.ungeprueft ? " ungeprueft" : "") }); }
      else out.push({ t: m[3], k: "fett" });
      letzte = re.lastIndex;
    }
    if (letzte < text.length) out.push({ t: text.slice(letzte) });
    return out;
  };
  D.textFertig = function (text) {
    return D.zerlegen(text).map(function (s) { return s.t; }).join("");
  };

  function textMalen() {
    el.text.innerHTML = "";
    var rest = Math.floor(gezeigt);
    for (var i = 0; i < segmente.length && rest > 0; i++) {
      var s = segmente[i], t = s.t.slice(0, rest);
      rest -= t.length;
      if (s.k) { var sp = neu("span", s.k); sp.textContent = t; el.text.appendChild(sp); }
      else el.text.appendChild(document.createTextNode(t));
    }
  }

  // ---------------- Ablauf ----------------
  /* kontext: { npc (GAME.NPC oder null), figurVon(id) -> Figur, kim: Figur, beiEnde() } */
  D.starten = function (id, ktx) {
    var d = DATA.dialogues[id];
    if (!d) { console.warn("Dialog fehlt in dialogues.js: " + id); return false; }
    dlg = d; dlgId = id; kontext = ktx || {};
    D.aktiv = true;
    el.box.classList.remove("versteckt");
    el.box.firstChild.classList.remove("ploppen");
    void el.box.offsetWidth;
    el.box.firstChild.classList.add("ploppen");
    var start = null;
    (d.einstieg || [{ knoten: "start" }]).some(function (e) {
      if (GAME.flags.pruefen(e.wenn)) { start = e.knoten; return true; }
      return false;
    });
    zeigen(start || "start");
    return true;
  };

  function besucht(id) {
    var z = GAME.zustand;
    if (!z.gesehen) z.gesehen = {};
    if (!z.gesehen[dlgId]) z.gesehen[dlgId] = {};
    return z.gesehen[dlgId][id];
  }
  function merkeBesuch(id) { besucht(id); GAME.zustand.gesehen[dlgId][id] = true; }

  function zeigen(id) {
    if (!id || id === "ende") { D.beenden(); return; }
    var k = dlg.knoten[id];
    if (!k) { console.warn("Dialog \"" + dlgId + "\": Knoten fehlt: " + id); D.beenden(); return; }
    knoten = k; knotenId = id;
    merkeBesuch(id);
    if (k.setFlag) GAME.flags.setzen(k.setFlag);
    if (k.addNote) notiz(k.addNote);

    // Sprecher bestimmen
    if (sprecher) sprecher.spricht = false;
    var kimName = DATA.characters.kim.name;
    sprecherIstKim = k.speaker === kimName || k.wer === "kim";
    sprecher = null;
    if (sprecherIstKim) sprecher = kontext.kim;
    else if (k.wer && kontext.figurVon) sprecher = kontext.figurVon(k.wer);
    else if (kontext.npc) sprecher = kontext.npc.figur;
    if (sprecher) { sprecher.emotion = k.emotion || "neutral"; sprecher.spricht = true; }
    el.portraitRahmen.classList.toggle("versteckt", !sprecher);
    el.portraitRahmen.classList.toggle("links", !sprecherIstKim);
    el.box.firstChild.classList.toggle("kim-spricht", sprecherIstKim);

    if (k.emote) emote(k.emote, sprecherIstKim);
    if (k.aktion) aktionen(k.aktion);

    el.name.textContent = k.speaker || "";
    el.name.classList.toggle("versteckt", !k.speaker);
    segmente = D.zerlegen(k.text);
    gesamt = segmente.reduce(function (n, s) { return n + s.t.length; }, 0);
    gezeigt = 0;
    optionen = (k.options || []).filter(function (o) { return GAME.flags.pruefen(o.requiresFlag); });
    wahl = 0;
    el.optionen.innerHTML = "";
    el.weiter.classList.add("versteckt");
    textMalen();
    bildZaehler = 0;
  }

  function notiz(id) {
    (Array.isArray(id) ? id : [id]).forEach(function (n) {
      if (GAME.quests.notiz(n)) GAME.ui.einblenden(DATA.texte.notizNeu + " " + ((DATA.notes[n] || {}).titel || n), 2.2);
    });
  }

  function emote(sym, kim) {
    if (kim) { if (kontext.kimEmote) kontext.kimEmote(sym); }
    else if (kontext.npc) kontext.npc.zeigeEmote(sym);
  }

  function aktionen(text) {
    String(text).split(";").forEach(function (a) {
      a = a.trim();
      if (!a) return;
      var i = a.indexOf(":"), art = i >= 0 ? a.slice(0, i) : a, wert = i >= 0 ? a.slice(i + 1) : "";
      switch (art) {
        case "beweis":
          if (GAME.quests.beweis(wert)) {
            var land = DATA.countries[wert];
            if (kontext.kim) { kontext.kim.jubeln(); kontext.kim.emotion = "froehlich"; }
            if (kontext.beweisZeigen) kontext.beweisZeigen(wert);
            GAME.ui.einblenden(DATA.texte.beweisNeu + " " + (land ? land.beweis.name : wert), 3);
          }
          break;
        case "emote": emote(wert, false); break;
        case "emoteKim": emote(wert, true); break;
        case "jubeln": if (kontext.kim) kontext.kim.jubeln(); break;
        case "einblenden": GAME.ui.einblenden(wert, 2.6); break;
        case "minispiel": wartendesMinispiel = { id: wert, npc: kontext.npc }; break;
        default: console.warn("Unbekannte Dialog-Aktion: " + a);
      }
    });
  }

  function optionenMalen() {
    el.optionen.innerHTML = "";
    optionen.forEach(function (o, i) {
      var b = neu("button", "dialog-option" + (i === wahl ? " gewaehlt" : "") + (o.next && besucht(o.next) ? " gesehen" : ""));
      b.type = "button";
      b.textContent = o.label;
      b.addEventListener("mouseenter", function () { wahl = i; optionenMalen(); });
      b.addEventListener("click", function () { wahl = i; waehlen(); });
      el.optionen.appendChild(b);
    });
  }

  function waehlen() {
    var o = optionen[wahl];
    if (!o) return;
    if (o.setFlag) GAME.flags.setzen(o.setFlag);
    if (o.addNote) notiz(o.addNote);
    if (o.aktion) aktionen(o.aktion);
    zeigen(o.next || "ende");
  }

  function weiterDruecken() {
    if (!D.aktiv) return;
    if (gezeigt < gesamt) { gezeigt = gesamt; textMalen(); fertigGetippt(); return; }
    if (optionen.length) { waehlen(); return; }
    zeigen(knoten.next || "ende");
  }

  function fertigGetippt() {
    if (sprecher) sprecher.spricht = false;
    if (optionen.length) optionenMalen();
    else el.weiter.classList.remove("versteckt");
  }

  D.beenden = function () {
    if (sprecher) sprecher.spricht = false;
    D.aktiv = false;
    el.box.classList.add("versteckt");
    var k = kontext;
    dlg = null; knoten = null; sprecher = null; kontext = null;
    if (k && k.beiEnde) k.beiEnde();
    if (wartendesMinispiel) {
      var mp = wartendesMinispiel;
      wartendesMinispiel = null;
      GAME.minispiel.starten(mp.id, function () {
        var danach = (DATA.minispiele[mp.id] || {}).danach;
        if (danach) GAME.Spielszene.dialogStarten(danach, mp.npc);
      });
    }
  };

  D.update = function (dt) {
    if (!D.aktiv) return;
    var I = ENG.input;
    if (gezeigt < gesamt) {
      gezeigt = Math.min(gesamt, gezeigt + dt * tippGeschw);
      textMalen();
      if (gezeigt >= gesamt) fertigGetippt();
    }
    if (optionen.length && gezeigt >= gesamt) {
      if (I.gedrueckt("hoch")) { wahl = (wahl + optionen.length - 1) % optionen.length; optionenMalen(); }
      if (I.gedrueckt("runter")) { wahl = (wahl + 1) % optionen.length; optionenMalen(); }
    }
    if (I.gedrueckt("ok")) weiterDruecken();
    I.verbrauchen("ok"); I.verbrauchen("aktion"); I.verbrauchen("pause");
  };

  // Nach dem Zeichnen des Bildes aufrufen: aktualisiert das 3D-Portrait
  D.portraitZeichnen = function (umgebung, t) {
    if (!D.aktiv || !sprecher) return;
    bildZaehler++;
    if (bildZaehler % 2 !== 1) return;
    ENG.renderer.portrait(sprecher, el.portrait, umgebung, t, sprecherIstKim ? -0.4 : 0.4);
  };

  // ---------------- Prüfung aller Dialoge (Debug) ----------------
  D.pruefen = function () {
    var fehler = [], gesetzt = {}, benutzt = {};
    function sammleFlags(v, ziel) { if (!v) return; (Array.isArray(v) ? v : [v]).forEach(function (f) { ziel[f] = true; }); }
    function bedFlags(b) { if (!b) return; b.split(/[|&]/).forEach(function (f) { f = f.replace("!", "").trim(); if (f) benutzt[f] = true; }); }
    for (var id in DATA.dialogues) {
      var d = DATA.dialogues[id], kn = d.knoten || {};
      var starts = (d.einstieg || [{ knoten: "start" }]).map(function (e) { bedFlags(e.wenn); return e.knoten; });
      var erreichbar = {}, offen = starts.slice();
      starts.forEach(function (s) { if (!kn[s]) fehler.push(id + ": Einstieg zeigt auf fehlenden Knoten \"" + s + "\""); });
      while (offen.length) {
        var k = offen.pop();
        if (!kn[k] || erreichbar[k]) continue;
        erreichbar[k] = true;
        var n = kn[k];
        var ziele = [];
        if (n.next) ziele.push(n.next);
        (n.options || []).forEach(function (o) {
          ziele.push(o.next || "ende"); sammleFlags(o.setFlag, gesetzt); bedFlags(o.requiresFlag);
          if (o.addNote && !DATA.notes[o.addNote]) fehler.push(id + "/" + k + ": Notiz fehlt: " + o.addNote);
        });
        sammleFlags(n.setFlag, gesetzt);
        if (n.addNote && !DATA.notes[n.addNote]) fehler.push(id + "/" + k + ": Notiz fehlt: " + n.addNote);
        ziele.forEach(function (z) {
          if (z === "ende") return;
          if (!kn[z]) fehler.push(id + "/" + k + ": \"next\" zeigt auf fehlenden Knoten \"" + z + "\"");
          else offen.push(z);
        });
        String(n.text || "").replace(/\{(fakt|wert|jahr):([a-z0-9_]+)\}/gi, function (m, a, f) {
          if (!DATA.facts[f]) fehler.push(id + "/" + k + ": Fakt fehlt: " + f);
          return m;
        });
      }
      for (var kk in kn) if (!erreichbar[kk]) fehler.push(id + ": Knoten \"" + kk + "\" ist nicht erreichbar.");
    }
    return { fehler: fehler, gesetzt: gesetzt, benutzt: benutzt };
  };

  return D;
})();
