// =====================================================================
//  js/debug.js – Debug-Modus (index.html?debug=1)
// ---------------------------------------------------------------------
//  • FPS, Zeit pro Bild, gedruckte Flächen, Auflösung
//  • Tasten 1–5: Stimmung (Tageszeit) wechseln, P: Figuren-Parade
//  • Konsole: ungeprüfte Fakten, Prüfung aller Dialoge und Texte
// =====================================================================

var SPIEL = window.SPIEL || {};
window.SPIEL = SPIEL;

SPIEL.debug = {
  an: /[?&]debug=1/.test(location.search),
  fps: 60, ms: 0, _letzte: 0, _anzeigeZeit: 0, parade: false,
  fehler: [],

  init: function () {
    if (!this.an) return;
    document.getElementById("debug").classList.add("an");
    this.faktenListe();
    this.pruefen();
  },

  // Alle Fakten mit verifiziert: false in der Konsole
  faktenListe: function () {
    var liste = [];
    for (var id in DATA.fakten) {
      var f = DATA.fakten[id];
      if (!f.verifiziert) liste.push({ id: id, wert: f.wert + " " + f.einheit, jahr: f.jahr, quelle: f.quelle });
    }
    this.ungeprueft = liste.length;
    if (liste.length) {
      console.log("%c[Funkloch] " + liste.length + " ungeprüfte Fakten:", "color:#d0002a;font-weight:bold");
      if (console.table) console.table(liste); else console.log(liste);
    } else console.log("[Funkloch] Alle Fakten geprüft ✓");
  },

  // Automatische Prüfung von Dialogen, Figuren, Stationen und Texten
  pruefen: function () {
    var fehler = [], id, i, j;
    function ziffern(text, wo) {
      var ohne = String(text).replace(/\{(fakt|wert|jahr):[a-z0-9_]+\}/gi, "");
      if (/[0-9]/.test(ohne)) fehler.push("Zahl direkt im Text (bitte {fakt:id} nutzen): " + wo + " → " + text);
      var re = /\{fakt:([a-z0-9_]+)\}/gi, m;
      while ((m = re.exec(text))) if (!DATA.fakten[m[1]]) fehler.push("Unbekannter Fakt {fakt:" + m[1] + "} in " + wo);
    }
    // Dialoge (Phase 1: Stilprobe – jeder Knoten ist ein Satz mit Antworten)
    var knoten = 0;
    for (id in DATA.dialoge) {
      var d = DATA.dialoge[id];
      knoten++;
      if (!DATA.figuren[d.figur]) fehler.push("Dialog " + id + ": unbekannte Figur " + d.figur);
      if (!d.satz) fehler.push("Dialog " + id + ": kein Satz");
      ziffern(d.satz || "", "dialoge." + id + ".satz");
      if (!d.antworten || d.antworten.length < 1 || d.antworten.length > 3) fehler.push("Dialog " + id + ": 1–3 Antworten nötig");
      (d.antworten || []).forEach(function (a, k) {
        knoten++;
        ziffern(a.text, "dialoge." + id + ".antworten[" + k + "].text");
        if (a.folge) ziffern(a.folge, "dialoge." + id + ".antworten[" + k + "].folge");
        if (a.schnipsel) {
          ziffern(a.schnipsel.zitat, "dialoge." + id + " Schnipsel");
          if (a.schnipsel.art !== "Erfahrung" && a.schnipsel.art !== "Meinung") fehler.push("Dialog " + id + ": Schnipsel-Art muss „Erfahrung“ oder „Meinung“ sein");
        }
      });
    }
    // Stationen: Figuren, Gespräche, Bausteine, Schilder
    for (id in DATA.stationen) {
      var s = DATA.stationen[id];
      if (!DATA.stil.stimmungen[s.stimmung]) fehler.push("Station " + id + ": unbekannte Stimmung " + s.stimmung);
      for (i = 0; i < s.figuren.length; i++) {
        var f = s.figuren[i];
        if (!DATA.figuren[f.id]) fehler.push("Station " + id + ": unbekannte Figur " + f.id);
        if (f.gespraech && !DATA.dialoge[f.gespraech]) fehler.push("Station " + id + ": Figur " + f.id + " hat kein Gespräch " + f.gespraech);
        if (f.x < 24 || f.x > s.breite - 24) fehler.push("Station " + id + ": Figur " + f.id + " steht außerhalb der Straße");
      }
      for (i = 0; i < s.ebenen.length; i++) {
        for (j = 0; j < s.ebenen[i].objekte.length; j++) {
          var o = s.ebenen[i].objekte[j];
          if (!ZINE.objekte[o.typ]) fehler.push("Station " + id + ": unbekannter Baustein " + o.typ);
          ["schild", "eingang", "zusatz"].forEach(function (k) { if (o[k]) ziffern(o[k], "stationen." + id + "." + o.typ + "." + k); });
          if (o.plakat) o.plakat.forEach(function (p) { ziffern(p, "stationen." + id + ".plakat"); });
        }
      }
    }
    // Oberflächentexte (außer Debug-Hilfen)
    for (id in DATA.texte) if (id.indexOf("debug") !== 0) ziffern(DATA.texte[id], "texte." + id);
    // Materialien der Figuren
    for (id in DATA.figuren) {
      var fg = DATA.figuren[id];
      if (fg.haut && !DATA.hauttoene[fg.haut]) fehler.push("Figur " + id + ": unbekannter Hautton " + fg.haut);
    }
    this.fehler = fehler;
    if (fehler.length) {
      console.warn("[Funkloch] Prüfung: " + fehler.length + " Problem(e)");
      fehler.forEach(function (t) { console.warn("  • " + t); });
    } else {
      console.log("%c[Funkloch] Dialogprüfung: alle " + knoten + " Knoten erreichbar ✓  ·  Texte ohne direkte Zahlen ✓  ·  Stationen ✓", "color:#0a7a3a;font-weight:bold");
    }
  },

  // Jedes Bild
  bild: function (jetzt) {
    if (!this.an) return;
    var E = SPIEL.eingabe;
    var dt = jetzt - (this._letzte || jetzt);
    this._letzte = jetzt;
    if (dt > 0) { this.fps = this.fps * 0.93 + (1000 / dt) * 0.07; this.ms = this.ms * 0.9 + dt * 0.1; }

    if (!SPIEL.szene.imGespraech) {
      var namen = Object.keys(DATA.stil.stimmungen);
      for (var z = 1; z <= namen.length; z++) {
        if (E.neu["ziffer" + z]) ZINE.ebenen.stimmungSetzen(namen[z - 1]);
      }
      if (E.neu.p) { this.parade = !this.parade; SPIEL.szene.parade(this.parade); }
    }

    if (jetzt - this._anzeigeZeit < 250) return;
    this._anzeigeZeit = jetzt;
    var D = ZINE.druck;
    var zeilen = [
      "FPS " + this.fps.toFixed(0) + "  (" + this.ms.toFixed(1) + " ms)",
      "Flächen/Bild " + D.zaehler + "  Druck " + (ZINE.ebenen.msFertig || 0).toFixed(1) + " ms",
      "Bild " + D.B + "×" + D.H + "  Raster " + D.rasterAbstand + " px",
      "Stimmung " + ZINE.ebenen.stimmungName,
      "Robin x " + Math.round(SPIEL.szene.robin.x),
      DATA.texte.debugStimmung
    ];
    var html = zeilen.join("\n").replace(/&/g, "&amp;").replace(/</g, "&lt;");
    if (this.ungeprueft) html += '\n<span class="rot">' + this.ungeprueft + " Fakten ungeprüft</span>";
    if (this.fehler.length) html += '\n<span class="rot">' + this.fehler.length + " Prüf-Fehler (Konsole)</span>";
    else html += "\nPrüfung ✓";
    document.getElementById("debug").innerHTML = html;
  }
};
