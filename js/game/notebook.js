/* =====================================================================
   Die Lücke – Notizbuch (Taste N) und Aufgabenliste (Taste Q)
   ---------------------------------------------------------------------
   Notizbuch: sammelt alle Notizen (DATA.notes), die Kim in Gesprächen
   erhält, sortiert nach Reitern. Jede Notiz mit Quelle.
   Aufgabenliste: Hauptquest und Viertel-Quests mit Häkchen.
   Beide Ansichten nutzen dasselbe „Buch“-Fenster.
   Steuerung: ← → Reiter wechseln · ↑ ↓ blättern · N/Q/Esc schließen
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.buch = (function () {
  "use strict";
  var B = { offen: null, reiter: 0 };
  var el = {};

  function neu(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  B.init = function () {
    el.schicht = document.getElementById("buch");
    el.schicht.addEventListener("click", function (e) { if (e.target === el.schicht) B.schliessen(); });
  };

  B.istOffen = function () { return !!B.offen; };

  B.oeffnen = function (art) {
    B.offen = art;
    if (art === "notizbuch" && B.reiter >= DATA.texte.notizbuch.reiter.length) B.reiter = 0;
    malen();
    el.schicht.classList.remove("versteckt");
    el.karte.classList.remove("ploppen");
    void el.karte.offsetWidth;
    el.karte.classList.add("ploppen");
  };

  B.schliessen = function () {
    B.offen = null;
    el.schicht.classList.add("versteckt");
    el.schicht.innerHTML = "";
  };

  // Zeilen mit Platzhaltern ({fakt:…}) als HTML-Knoten
  function textKnoten(text) {
    var f = document.createDocumentFragment();
    GAME.dialog.zerlegen(text).forEach(function (s) {
      if (s.k) f.appendChild(neu("span", s.k, s.t));
      else f.appendChild(document.createTextNode(s.t));
    });
    return f;
  }

  function malen() {
    var T = DATA.texte;
    el.schicht.innerHTML = "";
    var karte = neu("div", "buch-karte " + B.offen);
    el.karte = karte;
    var titel = neu("h2", "buch-titel", B.offen === "notizbuch" ? T.notizbuch.titel : T.questlog.titel);
    karte.appendChild(titel);

    if (B.offen === "notizbuch") {
      var reiterLeiste = neu("div", "buch-reiter");
      T.notizbuch.reiter.forEach(function (r, i) {
        var anzahl = GAME.zustand.notizen.filter(function (n) { return DATA.notes[n] && DATA.notes[n].reiter === r.id; }).length;
        var b = neu("button", "reiter reiter-" + r.id + (i === B.reiter ? " gewaehlt" : ""), r.titel + (anzahl ? " (" + anzahl + ")" : ""));
        b.type = "button";
        b.addEventListener("click", function () { B.reiter = i; malen(); });
        reiterLeiste.appendChild(b);
      });
      karte.appendChild(reiterLeiste);
      var seite = neu("div", "buch-seite");
      el.seite = seite;
      var rid = T.notizbuch.reiter[B.reiter].id;
      var liste = GAME.zustand.notizen.filter(function (n) { return DATA.notes[n] && DATA.notes[n].reiter === rid; });
      if (!liste.length) seite.appendChild(neu("p", "buch-leer", T.notizbuch.leer));
      liste.forEach(function (id) {
        var n = DATA.notes[id];
        var eintrag = neu("div", "notiz");
        eintrag.appendChild(neu("h3", "", n.titel));
        var p = neu("p");
        p.appendChild(textKnoten(n.text));
        eintrag.appendChild(p);
        if (n.quelle) eintrag.appendChild(neu("p", "quelle", T.notizbuch.quelle + " " + n.quelle));
        seite.appendChild(eintrag);
      });
      karte.appendChild(seite);
    } else {
      var seite2 = neu("div", "buch-seite");
      el.seite = seite2;
      var aktive = GAME.quests.aktive();
      if (!aktive.length) seite2.appendChild(neu("p", "buch-leer", T.questlog.leer));
      aktive.forEach(function (id) {
        var q = DATA.quests[id];
        var fertig = GAME.quests.questFertig(id);
        var block = neu("div", "quest" + (fertig ? " fertig" : ""));
        block.appendChild(neu("h3", "", q.titel + (q.viertel && DATA.countries[q.viertel] ? " – " + DATA.countries[q.viertel].viertel : "")));
        var ul = neu("ul");
        var offenGezeigt = false;
        q.schritte.forEach(function (s) {
          var ok = GAME.quests.schrittFertig(s);
          // Bei der Hauptquest nur erledigte Schritte + den nächsten offenen zeigen
          if (!ok && q.viertel === null && offenGezeigt) return;
          if (!ok) offenGezeigt = true;
          var li = neu("li", ok ? "erledigt" : "");
          var box = neu("span", "haken");
          box.innerHTML = ok
            ? '<svg viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="3"/><path d="M5 10 L9 14 L16 4" class="h"/></svg>'
            : '<svg viewBox="0 0 20 20"><rect x="2" y="2" width="16" height="16" rx="3"/></svg>';
          li.appendChild(box);
          li.appendChild(neu("span", "", s.text));
          ul.appendChild(li);
        });
        block.appendChild(ul);
        seite2.appendChild(block);
      });
      karte.appendChild(seite2);
    }
    karte.appendChild(neu("p", "buch-fuss", B.offen === "notizbuch" ? T.notizbuch.fuss : T.questlog.fuss));
    el.schicht.appendChild(karte);
  }

  B.update = function () {
    var I = ENG.input;
    if (!B.offen) return;
    if (B.offen === "notizbuch") {
      var n = DATA.texte.notizbuch.reiter.length;
      if (I.gedrueckt("links")) { B.reiter = (B.reiter + n - 1) % n; malen(); ENG.audio.klick(); }
      if (I.gedrueckt("rechts")) { B.reiter = (B.reiter + 1) % n; malen(); ENG.audio.klick(); }
    }
    if (el.seite) {
      if (I.gehalten("hoch")) el.seite.scrollTop -= 12;
      if (I.gehalten("runter")) el.seite.scrollTop += 12;
    }
    if (I.gedrueckt("pause") || (B.offen === "notizbuch" && I.gedrueckt("notizbuch")) || (B.offen === "questlog" && I.gedrueckt("quests"))) {
      B.schliessen();
    } else if (I.gedrueckt("notizbuch")) B.oeffnen("notizbuch");
    else if (I.gedrueckt("quests")) B.oeffnen("questlog");
    I.verbrauchen("pause"); I.verbrauchen("aktion"); I.verbrauchen("ok"); I.verbrauchen("notizbuch"); I.verbrauchen("quests");
  };

  return B;
})();

/* ---------------- Beweisstücke im HUD ---------------- */
GAME.beweisHud = (function () {
  "use strict";
  var H = {};
  var el, bekannt = [];
  var LAENDER = ["de", "se", "ee", "lu", "bxl"];
  // Kleine Tusche-Zeichnungen je Beweisstück
  var ICONS = {
    de: '<rect x="8" y="6" width="16" height="21" rx="2"/><path d="M12 4 H20 V8 H12 Z"/><path d="M11 13 H21 M11 17 H21 M11 21 H18"/>',
    se: '<rect x="6" y="8" width="20" height="18" rx="2"/><path d="M6 13 H26 M11 5 V10 M21 5 V10"/><path d="M10 17 H13 M15 17 H18 M20 17 H23 M10 21 H13 M15 21 H18"/>',
    ee: '<path d="M7 26 V6 M7 26 H26"/><rect x="10" y="16" width="3.5" height="10"/><rect x="15.5" y="10" width="3.5" height="16"/><rect x="21" y="19" width="3.5" height="7"/>',
    lu: '<path d="M9 27 V5 M21 27 V5 M9 10 H21 M9 16 H21 M9 22 H21"/><circle cx="25" cy="7" r="2.5"/>',
    bxl: '<path d="M5 10 H13 L15 12 H27 V26 H5 Z"/><path d="M14 17 C14 14 20 14 20 17 C20 19 17 19 17 21.5"/><circle cx="17" cy="24" r="0.9"/>'
  };

  H.init = function () {
    el = document.getElementById("hud-beweise");
    el.innerHTML = "";
    LAENDER.forEach(function (l) {
      var d = document.createElement("div");
      d.className = "beweis-slot land-" + l;
      d.title = DATA.countries[l] ? DATA.countries[l].beweis.name : l;
      d.innerHTML = '<svg viewBox="0 0 32 32">' + ICONS[l] + "</svg>";
      el.appendChild(d);
    });
    H.aktualisieren();
    GAME.flags.beobachten(function (name) { if (name === "*" || name === "intro_fertig" || name.indexOf("beweis_") === 0) H.aktualisieren(); });
  };

  // Symbol eines Beweisstücks als SVG (auch für die Präsentation im Finale)
  H.icon = function (l) { return '<svg viewBox="0 0 32 32">' + (ICONS[l] || "") + "</svg>"; };

  H.aktualisieren = function () {
    if (!el) return;
    var sichtbar = GAME.flags.hat("intro_fertig");
    el.classList.toggle("versteckt", !sichtbar);
    LAENDER.forEach(function (l, i) {
      var hat = GAME.zustand.beweise.indexOf(l) >= 0;
      var slot = el.children[i];
      slot.classList.toggle("gefunden", hat);
      if (hat && bekannt.indexOf(l) < 0) {
        bekannt.push(l);
        slot.classList.remove("ploppen");
        void slot.offsetWidth;
        slot.classList.add("ploppen");
      }
      if (!hat) { var k = bekannt.indexOf(l); if (k >= 0) bekannt.splice(k, 1); }
    });
  };

  return H;
})();
