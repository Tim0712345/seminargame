// =====================================================================
//  js/zeichnen/sammler.js – Formen sammeln (Rechteck, Kreis, Trapez …)
// ---------------------------------------------------------------------
//  Ein „Sammler“ baut aus einfachen Formen eine Liste von Teilen, die
//  ZINE.druck dann druckt. Alle Koordinaten sind Welt-Einheiten
//  (das Bild ist 360 Einheiten hoch, y wächst nach unten).
//
//  farbe = Materialname (data/stil.js) oder { blau: 0.5, … }
//  opt   = "ueber" → überdrucken statt aussparen (Licht, Schatten)
//
//  Für Figuren gibt es eine „Verzerrung“ (stauchen, strecken, neigen),
//  damit sie wackeln können, ohne Knochen zu brauchen.
// =====================================================================

ZINE.Sammler = function (ton) {
  this.teile = [];
  this.spaet = [];        // Teile, die erst NACH den Figuren gedruckt werden (z. B. Lichtkegel)
  this.ziel = this.teile;
  this.ton = ton || null;
  this.x0 = Infinity; this.x1 = -Infinity;
  this.y0 = Infinity; this.y1 = -Infinity;
  this.vz = null;         // Verzerrung { ax, ay, sx, sy, k }
};

ZINE.sammler = function (ton) { return new ZINE.Sammler(ton); };

(function () {
  var P = ZINE.Sammler.prototype;

  // Ab jetzt in die „spät“-Liste sammeln (über den Figuren)
  P.nachFiguren = function (an) { this.ziel = an === false ? this.teile : this.spaet; };

  P.verzerren = function (vz) { this.vz = vz; };

  // Grenzen merken: für das ganze Objekt und für die einzelne Form (zum Weglassen außerhalb des Bildes)
  P._rand = function (x, y) {
    if (x < this.x0) this.x0 = x; if (x > this.x1) this.x1 = x;
    if (x < this._t0) this._t0 = x; if (x > this._t1) this._t1 = x;
    if (y !== undefined) { if (y < this.y0) this.y0 = y; if (y > this.y1) this.y1 = y; }
  };
  P._t0 = Infinity; P._t1 = -Infinity;

  P._tp = function (x, y) {
    var v = this.vz;
    if (!v) return [x, y];
    var Y = v.ay + (y - v.ay) * v.sy;
    return [v.ax + (x - v.ax) * v.sx + v.k * (v.ay - Y), Y];
  };

  // opt: "ueber" (überdrucken) oder { rand: Breite } (Papierrand)
  P._neu = function (pfad, farbe, opt) {
    var t = { p: pfad, f: ZINE.farbe(farbe, this.ton), a: opt !== "ueber", x0: this._t0, x1: this._t1 };
    if (opt && opt.rand) t.r = opt.rand;       // schmaler Papierrand um diese Form
    this._t0 = Infinity; this._t1 = -Infinity;
    this.ziel.push(t);
    return t;
  };

  // Vieleck aus Punkten [x, y, x, y, …]
  P.vieleck = function (pkt, farbe, opt) {
    var p = new Path2D();
    for (var i = 0; i < pkt.length; i += 2) {
      var q = this._tp(pkt[i], pkt[i + 1]);
      if (i === 0) p.moveTo(q[0], q[1]); else p.lineTo(q[0], q[1]);
      this._rand(q[0], q[1]);
    }
    p.closePath();
    return this._neu(p, farbe, opt);
  };

  P.rechteck = function (x, y, b, h, farbe, opt) {
    if (!this.vz) {
      var p = new Path2D();
      p.rect(x, y, b, h);
      this._rand(x, y); this._rand(x + b, y + h);
      return this._neu(p, farbe, opt);
    }
    return this.vieleck([x, y, x + b, y, x + b, y + h, x, y + h], farbe, opt);
  };

  // Trapez: Mitte x, oben y, Breite oben, Breite unten, Höhe
  P.trapez = function (xm, y, bOben, bUnten, h, farbe, opt) {
    return this.vieleck([xm - bOben / 2, y, xm + bOben / 2, y, xm + bUnten / 2, y + h, xm - bUnten / 2, y + h], farbe, opt);
  };

  P.kreis = function (x, y, r, farbe, opt) {
    var q = this._tp(x, y), v = this.vz;
    if (v) r *= Math.sqrt(Math.abs(v.sx * v.sy));
    var p = new Path2D();
    p.arc(q[0], q[1], Math.max(0.01, r), 0, Math.PI * 2);
    this._rand(q[0] - r, q[1] - r); this._rand(q[0] + r, q[1] + r);
    return this._neu(p, farbe, opt);
  };

  // Kreisausschnitt (z. B. Halbkreis-Dach, Haarkappe) von Winkel a0 bis a1 (Bogenmaß)
  P.segment = function (x, y, r, a0, a1, farbe, opt) {
    var q = this._tp(x, y), v = this.vz;
    if (v) r *= Math.sqrt(Math.abs(v.sx * v.sy));
    var p = new Path2D();
    p.arc(q[0], q[1], r, a0, a1);
    p.closePath();
    this._rand(q[0] - r, q[1] - r); this._rand(q[0] + r, q[1] + r);
    return this._neu(p, farbe, opt);
  };

  P.ellipse = function (x, y, rx, ry, farbe, opt, drehung) {
    var q = this._tp(x, y), v = this.vz;
    if (v) { rx *= Math.abs(v.sx); ry *= Math.abs(v.sy); }
    var p = new Path2D();
    p.ellipse(q[0], q[1], Math.max(0.01, rx), Math.max(0.01, ry), drehung || 0, 0, Math.PI * 2);
    this._rand(q[0] - rx, q[1] - ry); this._rand(q[0] + rx, q[1] + ry);
    return this._neu(p, farbe, opt);
  };

  // Rechteck mit runden Ecken
  P.rund = function (x, y, b, h, r, farbe, opt) {
    r = Math.min(r, b / 2, h / 2);
    var pkt = [], ecken = [[x + b - r, y + r, -Math.PI / 2], [x + b - r, y + h - r, 0], [x + r, y + h - r, Math.PI / 2], [x + r, y + r, Math.PI]];
    for (var e = 0; e < 4; e++) {
      for (var s = 0; s <= 4; s++) {
        var w = ecken[e][2] + s / 4 * Math.PI / 2;
        pkt.push(ecken[e][0] + Math.cos(w) * r, ecken[e][1] + Math.sin(w) * r);
      }
    }
    return this.vieleck(pkt, farbe, opt);
  };

  // Rundbogen-Fenster/Tor: Rechteck mit Halbkreis oben
  P.bogenFenster = function (x, y, b, h, farbe, opt) {
    var r = b / 2, pkt = [x, y + h, x, y + r];
    for (var s = 0; s <= 10; s++) {
      var w = Math.PI + s / 10 * Math.PI;
      pkt.push(x + r + Math.cos(w) * r, y + r + Math.sin(w) * r);
    }
    pkt.push(x + b, y + h);
    return this.vieleck(pkt, farbe, opt);
  };

  // Gerade Linie mit Dicke
  P.linie = function (x1, y1, x2, y2, dicke, farbe, opt) {
    var dx = x2 - x1, dy = y2 - y1, l = Math.sqrt(dx * dx + dy * dy) || 1;
    var nx = -dy / l * dicke / 2, ny = dx / l * dicke / 2;
    return this.vieleck([x1 + nx, y1 + ny, x2 + nx, y2 + ny, x2 - nx, y2 - ny, x1 - nx, y1 - ny], farbe, opt);
  };

  // Bogen-Linie (z. B. Schallwelle): Mittelpunkt, Radius, Winkel a0 … a1, Dicke
  P.bogen = function (x, y, r, a0, a1, dicke, farbe, opt) {
    var aussen = [], innen = [], n = 10;
    for (var s = 0; s <= n; s++) {
      var w = a0 + (a1 - a0) * s / n;
      aussen.push(x + Math.cos(w) * (r + dicke / 2), y + Math.sin(w) * (r + dicke / 2));
      innen.unshift(y + Math.sin(w) * (r - dicke / 2));
      innen.unshift(x + Math.cos(w) * (r - dicke / 2));
    }
    return this.vieleck(aussen.concat(innen), farbe, opt);
  };

  // Text (Schilder). groesse in Welt-Einheiten.
  P.text = function (str, x, y, groesse, farbe, opt) {
    opt = opt || {};
    var schrift = opt.fliess ? '"Segoe UI", system-ui, Arial, sans-serif' : '"Arial Black", "Arial Bold", Impact, "Helvetica Neue", Arial, sans-serif';
    var b = String(str).length * groesse * 0.6;
    this._rand(x - b, y - groesse); this._rand(x + b, y + groesse * 0.3);
    var t = {
      x0: this._t0, x1: this._t1,
      t: String(str), x: x, y: y,
      font: (opt.fliess ? "700 " : "900 ") + groesse + "px " + schrift,
      ausr: opt.ausr || "center",
      f: ZINE.farbe(farbe, this.ton),
      a: opt.ueber ? false : true
    };
    this._t0 = Infinity; this._t1 = -Infinity;
    this.ziel.push(t);
    return t;
  };

  P.ergebnis = function () {
    return { teile: this.teile, spaet: this.spaet, x0: this.x0, x1: this.x1, y0: this.y0, y1: this.y1 };
  };
})();
