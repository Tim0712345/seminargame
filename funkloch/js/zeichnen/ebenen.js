// =====================================================================
//  js/zeichnen/ebenen.js – Straßenszene aus mehreren Ebenen (Parallaxe)
// ---------------------------------------------------------------------
//  Eine Station besteht aus 4–6 Ebenen (Himmel, Ferne, Mitte, Straße,
//  Vordergrund). Jede Ebene hat eine „parallaxe“: 1 = bewegt sich mit
//  Robin, 0.2 = bewegt sich nur ein Fünftel so schnell (weit weg),
//  1.35 = schneller (ganz vorne). Alle Ebenen benutzen dieselben
//  x-Koordinaten wie die Straße; in der Mitte der Station passen sie
//  genau übereinander.
//
//  Tempo-Trick: Die festen Teile einer Ebene werden einmal in Kacheln
//  (512 Pixel breit) gedruckt und gemerkt. Bewegte Bausteine (Wasser,
//  Möwen, Windräder …) und Figuren werden jedes Bild neu gedruckt –
//  und zwar NACH den festen Teilen ihrer Ebene.
// =====================================================================

ZINE.ebenen = {
  station: null,
  stimmungName: "",
  himmelBild: null,
  kamX: 0,
  bildNr: 0,
  gebautDiesesBild: 0,

  laden: function (station) {
    this.kachelnLeeren();
    this.station = station;
    this.stimmungSetzen(station.stimmung);
  },

  stimmungSetzen: function (name) {
    var st = DATA.stil.stimmungen[name];
    if (!st) { console.warn("[Funkloch] Unbekannte Stimmung: " + name); st = DATA.stil.stimmungen.kiel_abend; }
    ZINE.stimmung = st;
    this.stimmungName = name;
    ZINE.druck.versatzBerechnen();
    this.bauen();
    this.himmelBauen();
  },

  // Feste (nicht animierte) Objekte einmal vorbauen
  bauen: function () {
    var stn = this.station, st = ZINE.stimmung;
    this.kachelnLeeren();
    for (var i = 0; i < stn.ebenen.length; i++) {
      var e = stn.ebenen[i];
      e._ton = (e.ton && st.ton) ? st.ton[e.ton] : null;
      e._nr = i;
      for (var j = 0; j < e.objekte.length; j++) {
        var o = e.objekte[j], fn = ZINE.objekte[o.typ];
        o._g = null;
        if (!fn) { console.warn("[Funkloch] Unbekannter Baustein: " + o.typ); continue; }
        if (fn.animiert) continue;
        var S = ZINE.sammler(e._ton);
        fn(o, S, { st: st, zeit: 0, kamX: 0, mitte: stn.breite / 2, parallaxe: e.parallaxe });
        o._g = S.ergebnis();
      }
    }
  },

  // Alle gemerkten Kacheln wegwerfen (Größe oder Stimmung geändert)
  kachelnLeeren: function () {
    var stn = this.station;
    if (!stn) return;
    for (var i = 0; i < stn.ebenen.length; i++) {
      var k = stn.ebenen[i]._kacheln;
      if (k) for (var key in k) if (k[key].canvas) k[key].canvas.width = 0;
      stn.ebenen[i]._kacheln = {};
    }
  },

  // Himmel: gerasterter Verlauf, fertig auf Papier gedruckt
  // (wird nur bei Größen- oder Stimmungswechsel neu berechnet)
  himmelBauen: function () {
    var D = ZINE.druck, st = ZINE.stimmung, h = st.himmel, namen = D.namen;
    this.kachelnLeeren();
    var c = this.himmelBild || document.createElement("canvas");
    c.width = D.B; c.height = D.H;
    var g = c.getContext("2d");
    g.fillStyle = DATA.stil.papier.farbe;
    g.fillRect(0, 0, D.B, D.H);
    this.himmelBild = c;
    if (!this.station || !h) return;
    var ty = this.ty(), horizontPx = ty + h.horizont * DATA.stil.technik.weltHoehe * D.skala;
    g.globalCompositeOperation = "multiply";
    for (var i = 0; i < namen.length; i++) {
      var n = namen[i], o = h.oben[n] || 0, u = h.unten[n] || 0;
      if (o <= 0.004 && u <= 0.004) continue;
      var def = DATA.stil.druckfarben[n];
      var schicht = ZINE.raster.verlauf(D.B, D.H, def.farbe, D.rasterAbstand, def.winkel, (function (o, u) {
        return function (yA) {
          var a = ZINE.klemmen((yA * D.H - ty) / Math.max(1, horizontPx - ty), 0, 1);
          return o + (u - o) * Math.pow(a, h.kurve || 1);
        };
      })(o, u));
      g.globalAlpha = def.deckkraft;
      g.drawImage(schicht, D.versatzPx[n][0], D.versatzPx[n][1]);
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
    D.druckfehler(g, g.createPattern(D.fehlerBild, "repeat"), 0, 0, D.B, D.H);
  },

  // Senkrechte Verschiebung: Welt-y = weltHoehe liegt am unteren Bildrand
  ty: function () {
    var D = ZINE.druck;
    return D.H - DATA.stil.technik.weltHoehe * D.skala;
  },

  // Wirksame Parallaxe (bei „Bewegung reduzieren“ bewegt sich alles gleich)
  faktor: function (p) {
    if (ZINE.bewegungReduziert && p >= 0.1) return 1;
    return p;
  },

  // Waagerechte Verschiebung einer Ebene in Bildpixeln (gerundet)
  tx: function (parallaxe, kamX) {
    var D = ZINE.druck, f = this.faktor(parallaxe), mitte = this.station.breite / 2;
    return Math.round(D.B / 2 - (kamX * f + mitte * (1 - f)) * D.skala);
  },

  // Welt → CSS-Pixel (für Sprechblasen über Figuren)
  weltZuCss: function (x, y, parallaxe) {
    var D = ZINE.druck;
    var px = this.tx(parallaxe === undefined ? 1 : parallaxe, this.kamX) + x * D.skala;
    var py = this.ty() + y * D.skala;
    return [px / D.pxProCss, py / D.pxProCss];
  },

  // CSS-Pixel → Welt (Hauptebene), z. B. für Antippen
  cssZuWelt: function (cx, cy) {
    var D = ZINE.druck;
    return [(cx * D.pxProCss - this.tx(1, this.kamX)) / D.skala, (cy * D.pxProCss - this.ty()) / D.skala];
  },

  // Sichtbare halbe Breite in Welt-Einheiten
  halbeSicht: function () { return ZINE.druck.B / 2 / ZINE.druck.skala; },

  // ---------- Kacheln ----------
  kachelBauen: function (e, i) {
    var D = ZINE.druck, T = D.KACHEL, s = D.skala, ty = this.ty();
    var vx0 = i * T / s - 6, vx1 = (i + 1) * T / s + 6;
    // Welche Objekte liegen in dieser Kachel? Und wie hoch ist der Inhalt?
    var liste = [], y0 = Infinity, y1 = -Infinity, j;
    for (j = 0; j < e.objekte.length; j++) {
      var g = e.objekte[j]._g;
      if (!g || g.x1 < vx0 || g.x0 > vx1 || !g.teile.length) continue;
      liste.push(g);
      if (g.y0 < y0) y0 = g.y0;
      if (g.y1 > y1) y1 = g.y1;
    }
    var k = { leer: !liste.length, canvas: null, oben: 0, benutzt: this.bildNr };
    this.gebautDiesesBild++;
    if (k.leer) return k;
    var oben = ZINE.klemmen(Math.floor(ty + y0 * s) - 6, 0, D.H), unten = ZINE.klemmen(Math.ceil(ty + y1 * s) + 6, 0, D.H);
    var h = unten - oben;
    if (h <= 0) { k.leer = true; return k; }
    var w = D.wctx;
    w.setTransform(1, 0, 0, 1, 0, 0);
    w.clearRect(0, 0, T, h + 2);
    D.ziel(w, D.musterWerk, -i * T, ty - oben, false);
    for (j = 0; j < liste.length; j++) D.teile(liste[j].teile, vx0, vx1);
    D.druckfehler(w, D.fehlerMuster, i * T + e._nr * 131, oben, T, h);
    var c = document.createElement("canvas");
    c.width = T; c.height = h;
    c.getContext("2d").drawImage(D.werkbank, 0, 0, T, h, 0, 0, T, h);
    k.canvas = c; k.oben = oben;
    return k;
  },

  kachelnZeichnen: function (e, tx, zit) {
    var D = ZINE.druck, T = D.KACHEL, g = D.ctx, k = e._kacheln || (e._kacheln = {});
    var i0 = Math.floor(-tx / T), i1 = Math.floor((D.B - 1 - tx) / T), i;
    g.setTransform(1, 0, 0, 1, 0, 0);
    for (i = i0; i <= i1; i++) {
      var ka = k[i];
      if (!ka) ka = k[i] = this.kachelBauen(e, i);
      ka.benutzt = this.bildNr;
      if (!ka.leer) g.drawImage(ka.canvas, tx + i * T + zit[0], ka.oben + zit[1]);
    }
    // Vorausdrucken: höchstens eine Nachbarkachel pro Bild
    if (!this.gebautDiesesBild) {
      if (!k[i1 + 1]) k[i1 + 1] = this.kachelBauen(e, i1 + 1);
      else if (!k[i0 - 1]) k[i0 - 1] = this.kachelBauen(e, i0 - 1);
    }
    // Alte Kacheln wegwerfen
    if (this.bildNr % 60 === 0) {
      for (var key in k) {
        var n = +key;
        if ((n < i0 - 2 || n > i1 + 2) && this.bildNr - k[key].benutzt > 120) {
          if (k[key].canvas) k[key].canvas.width = 0;
          delete k[key];
        }
      }
    }
  },

  // Ein ganzes Bild drucken. figurenZeichnen(ebene, vx0, vx1) zeichnet Figuren in die passende Ebene.
  zeichnen: function (kamX, zeit, figurenZeichnen) {
    var D = ZINE.druck, stn = this.station, st = ZINE.stimmung, i, j;
    this.kamX = kamX;
    this.bildNr++;
    this.gebautDiesesBild = 0;
    D.bildAnfang(zeit * 1000);
    var g = D.ctx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = 1;
    g.drawImage(this.himmelBild, 0, 0);

    var ty = this.ty(), mitte = stn.breite / 2;
    for (i = 0; i < stn.ebenen.length; i++) {
      var e = stn.ebenen[i], tx = this.tx(e.parallaxe, kamX);
      this.kachelnZeichnen(e, tx, D.ebeneZittern(i));

      // Bewegtes und Figuren direkt auf die Leinwand drucken
      D.ziel(g, D.musterHaupt, tx, ty, true);
      var vx0 = -tx / D.skala - 8, vx1 = (D.B - tx) / D.skala + 8;
      var spaet = [];
      var info = { st: st, zeit: zeit, kamX: kamX, mitte: mitte, parallaxe: this.faktor(e.parallaxe) };
      for (j = 0; j < e.objekte.length; j++) {
        var o = e.objekte[j], gb = o._g;
        if (gb) {
          if (gb.spaet.length && !(gb.x1 < vx0 || gb.x0 > vx1)) spaet.push(gb.spaet);
          continue;
        }
        var fn = ZINE.objekte[o.typ];
        if (!fn || !fn.animiert) continue;
        if (o.x !== undefined && (o.x + (o.b || 0) + 150 < vx0 || o.x - 150 > vx1)) continue;
        var S = ZINE.sammler(e._ton);
        fn(o, S, info);
        D.teile(S.teile, vx0, vx1);
        if (S.spaet.length) spaet.push(S.spaet);
      }
      if (e.figuren && figurenZeichnen) figurenZeichnen(e, vx0, vx1);
      for (j = 0; j < spaet.length; j++) D.teile(spaet[j], vx0, vx1);
    }
    D.korn();
  }
};
