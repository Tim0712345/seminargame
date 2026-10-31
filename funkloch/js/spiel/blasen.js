// =====================================================================
//  js/spiel/blasen.js – Sprechblasen, Antwort-Zettel, Schnipsel-Flug
// ---------------------------------------------------------------------
//  Phase 1: Stilprobe. Die Sprechblase hängt direkt über der Figur,
//  Robins Antworten sind Zettel zum Antippen. Wichtige Sätze werden als
//  „Schnipsel“ ins Aufnahmegerät gezogen.
//  Touch-Regel: Knöpfe werden NIE beim Hover neu gebaut; Hover-Effekte
//  nur bei pointerType === "mouse".
// =====================================================================

var SPIEL = window.SPIEL || {};
window.SPIEL = SPIEL;

SPIEL.aufnahmen = [];   // aufgenommene Schnipsel (Phase 2: Aufnahmegerät)

SPIEL.blasen = {
  figur: null,
  dialog: null,
  tippen: null,         // { teile, gesamt, n, fertig, danach }
  schritt: "",

  init: function () {
    var B = this;
    this.el = {
      blase: document.getElementById("blase"),
      name: document.querySelector("#blase .blase-name"),
      text: document.querySelector("#blase .blase-text"),
      zu: document.querySelector("#blase .blase-zu"),
      zettel: document.getElementById("zettel-reihe"),
      hinweis: document.getElementById("hinweis"),
      geraet: document.getElementById("geraet"),
      zahl: document.getElementById("geraet-zahl"),
      toast: document.getElementById("toast")
    };
    this.el.blase.addEventListener("click", function () { B.weiter(); });
    this.el.zu.addEventListener("click", function (e) { e.stopPropagation(); B.beenden(); });
    this.el.zu.title = DATA.texte.schliessen;
    this.el.zu.setAttribute("aria-label", DATA.texte.schliessen);
    this.el.hinweis.addEventListener("click", function () {
      if (SPIEL.szene.naehe) SPIEL.szene.ansprechen(SPIEL.szene.naehe);
    });
    // Hover nur mit der Maus (iPad-Regel)
    SPIEL.blasen.mausHover(this.el.zettel);
  },

  // Hover-Klasse nur für echte Mäuse setzen – nichts neu bauen
  mausHover: function (behaelter) {
    behaelter.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse") return;
      var k = e.target.closest ? e.target.closest("button") : null;
      if (k) k.classList.add("maus-hover");
    });
    behaelter.addEventListener("pointerout", function (e) {
      var k = e.target.closest ? e.target.closest("button") : null;
      if (k) k.classList.remove("maus-hover");
    });
  },

  // ---------- Gespräch ----------
  gespraechStarten: function (f) {
    var d = DATA.dialoge[f.gespraech];
    if (!d) { SPIEL.szene.gespraechEnde(); return; }
    this.figur = f;
    this.dialog = d;
    this.el.name.textContent = f.def.name;
    this.el.blase.classList.add("sichtbar");
    this.el.hinweis.classList.remove("sichtbar");
    var B = this;
    this.sagen(d.satz, function () { B.zettelZeigen(d.antworten); });
  },

  sagen: function (text, danach) {
    this.zettelLeeren();
    this.tippen = { teile: this.zerlegen(SPIEL.text(text)), n: 0, fertig: false, danach: danach };
    this.tippen.gesamt = this.tippen.teile.reduce(function (s, t) { return s + t.text.length; }, 0);
    this.figur.spricht = true;
    this.el.text.innerHTML = "";
    this.el.blase.classList.remove("wackeln");
    void this.el.blase.offsetWidth;
    this.el.blase.classList.add("wackeln");
  },

  // **fett** in Teile zerlegen
  zerlegen: function (text) {
    var teile = [], fett = false, stuecke = text.split("**");
    for (var i = 0; i < stuecke.length; i++) {
      if (stuecke[i]) teile.push({ text: stuecke[i], fett: fett });
      fett = !fett;
    }
    return teile;
  },

  html: function (teile, n) {
    var aus = "", rest = n;
    for (var i = 0; i < teile.length && rest > 0; i++) {
      var s = teile[i].text.slice(0, rest);
      rest -= s.length;
      s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      aus += teile[i].fett ? "<strong>" + s + "</strong>" : s;
    }
    return aus;
  },

  // Klick auf die Blase / Taste E: Text sofort fertig
  weiter: function () {
    var t = this.tippen;
    if (t && !t.fertig) { t.n = t.gesamt; }
    else if (t && t.fertig && this.el.zettel.children.length === 1) this.el.zettel.children[0].click();
  },

  zettelZeigen: function (antworten) {
    var B = this, reihe = this.el.zettel;
    this.zettelLeeren();
    antworten.forEach(function (a, i) {
      var k = document.createElement("button");
      k.className = "zettel";
      k.type = "button";
      k.style.setProperty("--dreh", [-2.2, 1.6, -0.8][i % 3] + "deg");
      k.innerHTML = '<span class="zettel-nr">' + (i + 1) + "</span>" + B.html(B.zerlegen(SPIEL.text(a.text)), 9999);
      k.addEventListener("click", function () { B.waehlen(a); });
      reihe.appendChild(k);
    });
    reihe.classList.add("sichtbar");
  },

  zettelLeeren: function () {
    this.el.zettel.innerHTML = "";
    this.el.zettel.classList.remove("sichtbar");
  },

  waehlen: function (a) {
    if (!a) return;
    var B = this;
    if (a.ende) { this.beenden(); return; }
    this.sagen(a.folge || "…", function () {
      if (a.schnipsel) B.schnipselAufnehmen(a.schnipsel);
      B.zettelZeigen([{ text: DATA.texte.verabschieden, ende: true }]);
    });
  },

  beenden: function () {
    if (this.figur) this.figur.spricht = false;
    this.figur = null; this.dialog = null; this.tippen = null;
    this.el.blase.classList.remove("sichtbar");
    this.zettelLeeren();
    SPIEL.szene.gespraechEnde();
  },

  // ---------- Schnipsel: Schallwelle + Flug ins Aufnahmegerät ----------
  schnipselAufnehmen: function (s) {
    var f = this.figur, B = this;
    SPIEL.szene.schallwelle(f);
    SPIEL.aufnahmen.push({ von: f.def.name, zitat: s.zitat, art: s.art, station: SPIEL.szene.stationId });
    var start = this.el.blase.getBoundingClientRect(), ziel = this.el.geraet.getBoundingClientRect();
    var flug = document.createElement("div");
    flug.className = "schnipsel-flug";
    flug.innerHTML = '<span class="schnipsel-art">' + s.art + "</span>„" + this.html([{ text: s.zitat }], 9999) + "“";
    document.getElementById("ui").appendChild(flug);
    var x0 = start.left + 10, y0 = start.top - 10;
    flug.style.left = x0 + "px"; flug.style.top = y0 + "px";
    var reduziert = ZINE.bewegungReduziert;
    setTimeout(function () {
      flug.classList.add("fliegt");
      var dx = ziel.left + ziel.width / 2 - (x0 + flug.offsetWidth / 2), dy = ziel.top + ziel.height / 2 - (y0 + flug.offsetHeight / 2);
      flug.style.transform = "translate(" + dx + "px," + dy + "px) scale(0.12) rotate(" + (reduziert ? 0 : -14) + "deg)";
      flug.style.opacity = "0.2";
    }, reduziert ? 300 : 900);
    setTimeout(function () {
      if (flug.parentNode) flug.parentNode.removeChild(flug);
      B.el.zahl.textContent = SPIEL.aufnahmen.length;
      B.el.geraet.classList.remove("hupf"); void B.el.geraet.offsetWidth; B.el.geraet.classList.add("hupf");
      B.toast(DATA.texte.schnipselGespeichert);
    }, reduziert ? 1100 : 1800);
  },

  toast: function (text) {
    var t = this.el.toast;
    t.textContent = text;
    t.classList.remove("sichtbar"); void t.offsetWidth; t.classList.add("sichtbar");
    clearTimeout(this._toastZeit);
    this._toastZeit = setTimeout(function () { t.classList.remove("sichtbar"); }, 2200);
  },

  // ---------- jedes Bild: Schreibmaschine + Position über der Figur ----------
  aktualisieren: function (dt) {
    var sz = SPIEL.szene, E = SPIEL.eingabe;
    // Tasten im Gespräch
    if (sz.imGespraech) {
      if (E.neu.aktion) this.weiter();
      if (E.neu.zurueck) this.beenden();
      for (var z = 1; z <= 3; z++) {
        if (E.neu["ziffer" + z] && this.el.zettel.children[z - 1]) this.el.zettel.children[z - 1].click();
      }
    }
    // Schreibmaschine
    var t = this.tippen;
    if (t && !t.fertig) {
      t.n = Math.min(t.gesamt, t.n + dt * (ZINE.bewegungReduziert ? 400 : 48));
      this.el.text.innerHTML = this.html(t.teile, Math.floor(t.n));
      if (t.n >= t.gesamt) {
        t.fertig = true;
        if (this.figur) this.figur.spricht = false;
        if (t.danach) t.danach();
      }
    }
    // Sprechblase über der Figur halten
    if (this.figur) this.anFigur(this.el.blase, this.figur, 14, true);
    // Hinweis „E · ansprechen“
    var h = this.el.hinweis;
    if (!sz.imGespraech && sz.naehe) {
      h.classList.add("sichtbar");
      var touch = E.letzteArt === "touch" || E.letzteArt === "pen";
      h.innerHTML = touch ? DATA.texte.antippen : '<b>' + DATA.texte.tasteAnsprechen + "</b> " + DATA.texte.ansprechen;
      this.anFigur(h, sz.naehe, 8, false);
    } else h.classList.remove("sichtbar");
  },

  // Element über den Kopf einer Figur setzen (innerhalb des Fensters halten)
  anFigur: function (el, f, abstand, zipfel) {
    var m = ZINE.figur.masse(f.def);
    var p = ZINE.ebenen.weltZuCss(f.x, f.y - m.oben - 4);
    var b = el.offsetWidth, h = el.offsetHeight, rand = 10;
    var links = ZINE.klemmen(p[0] - b / 2, rand, window.innerWidth - b - rand);
    var oben = Math.max(rand, p[1] - h - abstand);
    el.style.left = Math.round(links) + "px";
    el.style.top = Math.round(oben) + "px";
    if (zipfel) el.style.setProperty("--zipfel-x", ZINE.klemmen(p[0] - links, 24, b - 24) + "px");
  }
};

// Platzhalter in Texten ersetzen: {fakt:id} → „wert einheit“
SPIEL.text = function (s) {
  return String(s).replace(/\{fakt:([a-z0-9_]+)\}/gi, function (alles, id) {
    var f = DATA.fakten[id];
    if (!f) { console.warn("[Funkloch] Unbekannter Fakt: " + id); return "[?" + id + "]"; }
    var zahl = String(f.wert).replace(".", ",");
    var html = zahl + (f.einheit === "%" ? " %" : " " + f.einheit);
    return html;
  });
};
