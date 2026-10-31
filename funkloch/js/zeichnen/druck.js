// =====================================================================
//  js/zeichnen/druck.js – die „Druckmaschine“
// ---------------------------------------------------------------------
//  So wird gedruckt (wie beim Risograph):
//  1. Eine Fläche, die etwas verdeckt, spart erst das Papier aus
//     (Papierfarbe wird hineingesetzt).
//  2. Dann wird jede ihrer Druckfarben als Rasterpunkte MULTIPLIZIERT
//     daraufgedruckt – jede Farbe ein bis zwei Pixel verrutscht
//     (Fehlpasser). Wo verrutscht wird, blitzt Papier hervor oder
//     Farben überlappen sich dunkler – genau wie im echten Druck.
//  3. Flächen mit „überdrucken“ (Licht, Schatten) sparen nichts aus.
//
//  Damit es auch auf Schul-Laptops schnell ist, werden die festen Teile
//  jeder Ebene einmal in Kacheln gedruckt und zwischengespeichert
//  (siehe ZINE.ebenen). Nur Figuren und Bewegtes werden jedes Bild neu
//  gedruckt – diese Schichten zittern auch farbweise.
// =====================================================================

ZINE.druck = {
  leinwand: null, ctx: null,
  werkbank: null, wctx: null,   // Hilfs-Canvas zum Drucken von Kacheln
  namen: [],
  B: 1, H: 1,            // Bildgröße in Pixeln
  pxProCss: 1,           // Bildpixel je CSS-Pixel
  skala: 1,              // Bildpixel je Welt-Einheit
  stufen: 24,
  KACHEL: 512,           // Breite einer Kachel in Pixeln
  zaehler: 0,            // gedruckte Flächen in diesem Bild (Debug)
  zitter: {},            // aktuelles Zittern je Druckfarbe
  _zitterZeit: -1e9,

  init: function (leinwand) {
    this.leinwand = leinwand;
    this.ctx = leinwand.getContext("2d", { alpha: false });
    this.werkbank = document.createElement("canvas");
    this.wctx = this.werkbank.getContext("2d");
    this.namen = DATA.stil.reihenfolge.slice();
    this.stufen = DATA.stil.raster.stufen;
    for (var i = 0; i < this.namen.length; i++) this.zitter[this.namen[i]] = [0, 0];
    this.kornBauen();
    this.fehlerBauen();
  },

  // Fenstergröße übernehmen (cssB × cssH in CSS-Pixeln)
  groesse: function (cssB, cssH) {
    var T = DATA.stil.technik, st = DATA.stil;
    var sk = (window.devicePixelRatio || 1) * T.renderSkala;
    if (cssB * cssH * sk * sk > T.maxPixel) sk = Math.sqrt(T.maxPixel / (cssB * cssH));
    this.pxProCss = sk;
    this.B = Math.max(2, Math.round(cssB * sk));
    this.H = Math.max(2, Math.round(cssH * sk));
    this.leinwand.width = this.B; this.leinwand.height = this.H;
    this.leinwand.style.width = cssB + "px"; this.leinwand.style.height = cssH + "px";
    this.skala = Math.min(this.H / T.weltHoehe, this.B / T.mindestBreite);
    this.werkbank.width = this.KACHEL; this.werkbank.height = this.H;

    // Rasterpunkte: je Druckfarbe eine Reihe Muster – für die Leinwand und die Werkbank
    var abstand = Math.max(3, Math.round(st.raster.abstand * sk));
    this.rasterAbstand = abstand;
    this.musterHaupt = {}; this.musterWerk = {};
    this.farbe = {}; this.deckkraft = {}; this.versatzPx = {};
    for (var i = 0; i < this.namen.length; i++) {
      var n = this.namen[i], def = st.druckfarben[n];
      this.farbe[n] = def.farbe;
      this.deckkraft[n] = def.deckkraft;
      this.musterHaupt[n] = ZINE.raster.muster(this.ctx, def.farbe, abstand, this.stufen);
      this.musterWerk[n] = ZINE.raster.muster(this.wctx, def.farbe, abstand, this.stufen);
      ZINE.raster.ausrichten(this.musterHaupt[n], this.skala, def.winkel);
      ZINE.raster.ausrichten(this.musterWerk[n], this.skala, def.winkel);
    }
    this.versatzBerechnen();
    this.kornMuster = this.ctx.createPattern(this.kornBild, "repeat");
    this.fehlerMuster = this.wctx.createPattern(this.fehlerBild, "repeat");
    this.fehlerMusterHaupt = this.ctx.createPattern(this.fehlerBild, "repeat");
  },

  // Fehlpasser in Bildpixeln (aus data/stil.js und der Stimmung)
  versatzBerechnen: function () {
    var st = ZINE.stimmung || {}, fp = DATA.stil.fehlpasser;
    var staerke = st.fehlpasser !== undefined ? st.fehlpasser : fp.staerke;
    for (var i = 0; i < this.namen.length; i++) {
      var n = this.namen[i], v = DATA.stil.druckfarben[n].versatz;
      this.versatzPx[n] = [Math.round(v[0] * staerke * this.pxProCss), Math.round(v[1] * staerke * this.pxProCss)];
    }
  },

  // Zu Beginn jedes Bildes: Zittern weiterschalten
  bildAnfang: function (zeitMs) {
    this.zaehler = 0;
    var fp = DATA.stil.fehlpasser, i, n;
    if (ZINE.bewegungReduziert || fp.zittern <= 0) {
      for (i = 0; i < this.namen.length; i++) this.zitter[this.namen[i]] = [0, 0];
      this.ebenenZitter = [];
      return false;
    }
    if (zeitMs - this._zitterZeit < fp.zitterTakt) return false;
    this._zitterZeit = zeitMs;
    var px = Math.max(1, Math.round(fp.zittern * this.pxProCss));
    function wurf() {
      var z = Math.random();
      if (z < 0.5) return [0, 0];
      if (z < 0.8) return [(Math.random() < 0.5 ? -1 : 1) * px, 0];
      return [0, (Math.random() < 0.5 ? -1 : 1) * px];
    }
    for (i = 0; i < this.namen.length; i++) { n = this.namen[i]; this.zitter[n] = wurf(); }
    this.ebenenZitter = [];
    for (i = 0; i < 8; i++) this.ebenenZitter.push(Math.random() < 0.6 ? [0, 0] : wurf());
    return true;
  },

  // Zittern einer ganzen Ebene (feste Kacheln zittern als Ganzes)
  ebeneZittern: function (i) {
    var z = this.ebenenZitter && this.ebenenZitter[i];
    return z || [0, 0];
  },

  // Wohin wird gedruckt? g = Kontext, muster = passende Muster,
  // tx/ty = Verschiebung in Bildpixeln, lebendig = mit farbweisem Zittern
  ziel: function (g, muster, tx, ty, lebendig) {
    this._g = g; this._m = muster; this._tx = Math.round(tx); this._ty = Math.round(ty);
    var o = this._o || (this._o = {});
    for (var i = 0; i < this.namen.length; i++) {
      var n = this.namen[i], v = this.versatzPx[n], z = lebendig ? this.zitter[n] : [0, 0];
      o[n] = [this._tx + v[0] + z[0], this._ty + v[1] + z[1]];
    }
  },

  // Eine Fläche drucken. t = { p: Path2D | t: Text, f: {farbe: dichte}, a: aussparen? }
  teil: function (t) {
    var g = this._g, s = this.skala, N = this.stufen, namen = this.namen, o = this._o;
    if (t.a) {
      g.setTransform(s, 0, 0, s, this._tx, this._ty);
      g.globalCompositeOperation = "source-over";
      g.globalAlpha = 1;
      g.fillStyle = DATA.stil.papier.farbe;
      if (t.r && t.p) { g.strokeStyle = g.fillStyle; g.lineWidth = t.r; g.lineJoin = "round"; g.stroke(t.p); }
      this._fuellen(g, t);
    }
    var multi = false;
    for (var i = 0; i < namen.length; i++) {
      var n = namen[i], d = t.f[n];
      if (!d) continue;
      var st = Math.round(d * N);
      if (st <= 0) continue;
      if (!multi) { g.globalCompositeOperation = "multiply"; multi = true; }
      g.setTransform(s, 0, 0, s, o[n][0], o[n][1]);
      g.globalAlpha = this.deckkraft[n];
      g.fillStyle = st >= N ? this.farbe[n] : this._m[n][st];
      this._fuellen(g, t);
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
  },

  // Nur Papierrand (für den ausgeschnittenen Umriss von Figuren)
  papierRand: function (liste, breite) {
    var g = this._g, s = this.skala;
    g.setTransform(s, 0, 0, s, this._tx, this._ty);
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = 1;
    g.fillStyle = g.strokeStyle = DATA.stil.papier.farbe;
    g.lineWidth = breite * 2;
    g.lineJoin = "round";
    for (var i = 0; i < liste.length; i++) {
      var t = liste[i];
      if (!t.a || !t.p) continue;
      g.stroke(t.p);
      g.fill(t.p);
    }
  },

  // Mehrere Flächen drucken; Flächen außerhalb von vx0 … vx1 (Welt-x) werden übersprungen
  teile: function (liste, vx0, vx1) {
    if (vx0 === undefined) { vx0 = -Infinity; vx1 = Infinity; }
    for (var i = 0; i < liste.length; i++) {
      var t = liste[i];
      if (t.x1 < vx0 || t.x0 > vx1) continue;
      this.teil(t);
    }
  },

  _fuellen: function (g, t) {
    this.zaehler++;
    if (t.t !== undefined) {
      g.font = t.font; g.textAlign = t.ausr; g.textBaseline = "alphabetic";
      g.fillText(t.t, t.x, t.y);
    } else g.fill(t.p);
  },

  // Druckfehler (ausgedünnte Farbe, Fehlstellen) auf einen Bereich legen.
  // ox/oy = Lage des Bereichs „auf dem Papier“, damit das Muster durchläuft.
  druckfehler: function (g, muster, ox, oy, b, h) {
    var df = DATA.stil.druckfehler.staerke;
    if (df <= 0) return;
    g.setTransform(1, 0, 0, 1, -ox, -oy);
    g.globalCompositeOperation = "source-atop";
    g.globalAlpha = Math.min(1, df);
    g.fillStyle = muster;
    g.fillRect(ox, oy, b, h);
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
    g.setTransform(1, 0, 0, 1, 0, 0);
  },

  // Zum Schluss: Papierkorn über alles
  korn: function () {
    var c = this.ctx, k = DATA.stil.papier.korn;
    if (k <= 0) return;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalCompositeOperation = "multiply";
    c.globalAlpha = k;
    c.fillStyle = this.kornMuster;
    c.fillRect(0, 0, this.B, this.H);
    c.globalAlpha = 1;
    c.globalCompositeOperation = "source-over";
  },

  // ---------- Texturen (einmal beim Start berechnet) ----------

  // Papierkorn: feines Rauschen + ein paar Fasern
  kornBauen: function () {
    var G = 256, c = document.createElement("canvas");
    c.width = c.height = G;
    var g = c.getContext("2d"), bild = g.createImageData(G, G), px = bild.data;
    var z = ZINE.zufall(7);
    for (var i = 0; i < G * G; i++) {
      var v = 255 - Math.pow(z(), 3) * 120 - z() * 30;
      px[i * 4] = v; px[i * 4 + 1] = v; px[i * 4 + 2] = v * 0.98; px[i * 4 + 3] = 255;
    }
    g.putImageData(bild, 0, 0);
    var anzahl = Math.round(60 * DATA.stil.papier.fasern);
    g.lineCap = "round";
    for (var f = 0; f < anzahl; f++) {
      var x = z() * G, y = z() * G, w = z() * Math.PI * 2, l = 4 + z() * 14;
      g.strokeStyle = "rgba(120,110,95," + (0.25 + z() * 0.35) + ")";
      g.lineWidth = 0.6 + z() * 0.6;
      g.beginPath();
      g.moveTo(x, y);
      g.quadraticCurveTo(x + Math.cos(w + 0.6) * l * 0.5, y + Math.sin(w + 0.6) * l * 0.5,
                         x + Math.cos(w) * l, y + Math.sin(w) * l);
      g.stroke();
    }
    this.kornBild = c;
  },

  // Druckfehler-Maske in Papierfarbe: weiche Flecken (ausgedünnte Farbe) und kleine Fehlstellen
  fehlerBauen: function () {
    var G = 512, c = document.createElement("canvas");
    c.width = c.height = G;
    var g = c.getContext("2d"), bild = g.createImageData(G, G), px = bild.data;
    var rgb = ZINE.raster.hexZuRgb(DATA.stil.papier.farbe);
    var z = ZINE.zufall(23), raster = 12, werte = [], werte2 = [], i, x, y;
    for (i = 0; i < raster * raster; i++) werte.push(z());
    for (i = 0; i < 48 * 48; i++) werte2.push(z());
    function rauschen(liste, n, u, v) {      // kachelbares Wert-Rauschen
      var x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0;
      fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
      var a = liste[(y0 % n) * n + (x0 % n)], b = liste[(y0 % n) * n + ((x0 + 1) % n)];
      var cc = liste[((y0 + 1) % n) * n + (x0 % n)], d = liste[((y0 + 1) % n) * n + ((x0 + 1) % n)];
      return (a + (b - a) * fx) * (1 - fy) + (cc + (d - cc) * fx) * fy;
    }
    var flecken = DATA.stil.druckfehler.flecken;
    for (y = 0; y < G; y++) {
      for (x = 0; x < G; x++) {
        var grob = rauschen(werte, raster, x / G * raster, y / G * raster);
        var fein = rauschen(werte2, 48, x / G * 48, y / G * 48);
        var a = ZINE.klemmen((grob * 0.7 + fein * 0.3 - 0.58) * 3.2, 0, 1) * 0.55 * flecken;
        var r = z();
        if (r < 0.0025) a = 1;                       // winzige Fehlstellen
        else a += r * r * 0.22;                      // feines Ausdünnen
        i = (y * G + x) * 4;
        px[i] = rgb[0]; px[i + 1] = rgb[1]; px[i + 2] = rgb[2]; px[i + 3] = ZINE.klemmen(a, 0, 1) * 255;
      }
    }
    g.putImageData(bild, 0, 0);
    g.strokeStyle = "rgba(" + rgb.join(",") + ",0.6)";
    g.lineWidth = 1;
    for (i = 0; i < 5; i++) {                       // „Kratzer“ der Trommel
      x = z() * G; y = z() * G;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + 20 + z() * 60, y + (z() - 0.5) * 3); g.stroke();
    }
    this.fehlerBild = c;
  }
};
