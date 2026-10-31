// =====================================================================
//  js/zeichnen/raster.js – Rasterpunkte (Halbton) statt Verläufe
// ---------------------------------------------------------------------
//  Für jede Druckfarbe gibt es eine Reihe kleiner Kacheln mit einem
//  Punkt (oder bei hoher Dichte: mit einem Loch). Daraus werden
//  Canvas-Muster. Die Muster werden so gedreht und skaliert, dass die
//  Punkte immer gleich groß auf dem Bildschirm sind – egal wie groß
//  das Fenster ist.
// =====================================================================

ZINE.raster = {

  // Eine Kachel (abstand × abstand Pixel) für die Dichte d (0 … 1)
  kachel: function (abstand, d, farbe) {
    var c = document.createElement("canvas");
    c.width = c.height = abstand;
    var g = c.getContext("2d");
    g.fillStyle = farbe;
    var m = abstand / 2;
    if (d <= 0.785) {
      // Punkt in der Mitte
      g.beginPath();
      g.arc(m, m, abstand * Math.sqrt(d / Math.PI), 0, Math.PI * 2);
      g.fill();
    } else {
      // Fast voll: Fläche mit Löchern an den Ecken
      g.fillRect(0, 0, abstand, abstand);
      g.globalCompositeOperation = "destination-out";
      var r = abstand * Math.sqrt((1 - d) / Math.PI);
      var ecken = [[0, 0], [abstand, 0], [0, abstand], [abstand, abstand]];
      for (var i = 0; i < 4; i++) {
        g.beginPath();
        g.arc(ecken[i][0], ecken[i][1], r, 0, Math.PI * 2);
        g.fill();
      }
    }
    return c;
  },

  // Alle Muster einer Druckfarbe bauen. Ergebnis: Liste [stufe] → CanvasPattern
  // (Stufe 0 = nichts, letzte Stufe = Vollfläche, dafür kein Muster nötig)
  muster: function (ctx, farbe, abstand, stufen) {
    var liste = [null];
    for (var s = 1; s < stufen; s++) {
      liste.push(ctx.createPattern(this.kachel(abstand, s / stufen, farbe), "repeat"));
    }
    liste.push(null);
    return liste;
  },

  // Muster ausrichten: gegen die Welt-Skalierung (feste Punktgröße) und gedreht
  ausrichten: function (liste, skala, winkelGrad) {
    if (typeof DOMMatrix === "undefined") return;
    var m = new DOMMatrix().scale(1 / skala, 1 / skala).rotate(winkelGrad);
    for (var i = 0; i < liste.length; i++) {
      if (liste[i] && liste[i].setTransform) liste[i].setTransform(m);
    }
  },

  // Gerasterter Verlauf (z. B. Himmel) als fertiges Bild in Bildschirm-Pixeln.
  // dichteBei(yAnteil) liefert die Dichte für die Höhe 0 (oben) … 1 (unten).
  verlauf: function (breite, hoehe, farbe, abstand, winkelGrad, dichteBei) {
    var c = document.createElement("canvas");
    c.width = breite; c.height = hoehe;
    var g = c.getContext("2d");
    var bild = g.createImageData(breite, hoehe);
    var px = bild.data;
    var rgb = this.hexZuRgb(farbe);
    var w = winkelGrad * Math.PI / 180, co = Math.cos(w) / abstand, si = Math.sin(w) / abstand;
    var x, y, i = 0;
    for (y = 0; y < hoehe; y++) {
      var d = dichteBei(y / hoehe);
      if (d <= 0.004) { i += breite * 4; continue; }
      var voll = d >= 0.995;
      var R = Math.sqrt(Math.min(d, 0.785) / Math.PI);       // Punktradius (in Rasterabständen)
      var H = Math.sqrt(Math.max(0, 1 - d) / Math.PI);        // Lochradius bei hoher Dichte
      var gross = d > 0.785;
      for (x = 0; x < breite; x++, i += 4) {
        var a;
        if (voll) a = 1;
        else {
          var u = x * co + y * si, v = -x * si + y * co;
          var fu = u - Math.floor(u) - 0.5, fv = v - Math.floor(v) - 0.5;
          if (!gross) {
            var r = Math.sqrt(fu * fu + fv * fv);
            a = (R - r) * abstand + 0.5;
          } else {
            var eu = 0.5 - Math.abs(fu), ev = 0.5 - Math.abs(fv);
            var re = Math.sqrt(eu * eu + ev * ev);
            a = (re - H) * abstand + 0.5;
          }
          if (a <= 0) continue;
          if (a > 1) a = 1;
        }
        px[i] = rgb[0]; px[i + 1] = rgb[1]; px[i + 2] = rgb[2]; px[i + 3] = a * 255;
      }
    }
    g.putImageData(bild, 0, 0);
    return c;
  },

  hexZuRgb: function (hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
};
