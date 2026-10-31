// =====================================================================
//  js/zeichnen/grundlagen.js – Namensraum ZINE und kleine Helfer
//  (Zufall mit Startwert, Farben/Materialien auflösen, Mathe)
// =====================================================================

var ZINE = window.ZINE || {};
window.ZINE = ZINE;

// Aktive Stimmung (Tageszeit) – wird von ZINE.ebenen gesetzt
ZINE.stimmung = null;
// „Bewegung reduzieren“: schaltet Zittern und Parallaxe ab
ZINE.bewegungReduziert = false;

// Zufallszahlen mit festem Startwert (gleiche Saat = gleiches Bild)
ZINE.zufall = function (saat) {
  var a = (saat * 2654435761) >>> 0 || 1;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

ZINE.klemmen = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
ZINE.mix = function (a, b, t) { return a + (b - a) * t; };

// Namen der vier Druckfarben (aus data/stil.js)
ZINE.tinten = function () { return DATA.stil.reihenfolge; };

// Material nachschlagen (Stimmung darf überschreiben)
ZINE._fehlendeMaterialien = {};
ZINE.material = function (name) {
  var st = ZINE.stimmung;
  if (st && st.materialien && st.materialien[name]) return st.materialien[name];
  var m = DATA.stil.materialien[name];
  if (!m) {
    if (!ZINE._fehlendeMaterialien[name]) {
      ZINE._fehlendeMaterialien[name] = true;
      console.warn("[Funkloch] Unbekanntes Material: " + name);
    }
    return {};
  }
  return m;
};

// Farbe auflösen: Materialname oder { blau: 0.5, … } → reine Dichte-Liste.
// „ton“ = zusätzliche Tönung der Ebene (z. B. bläuliche Ferne).
ZINE.farbe = function (f, ton) {
  if (!f) return {};
  if (typeof f === "string") f = ZINE.material(f);
  var namen = DATA.stil.reihenfolge, r = {}, leuchtet = f.leuchtet;
  for (var i = 0; i < namen.length; i++) {
    var n = namen[i], d = f[n] || 0;
    if (ton && !leuchtet) d += ton[n] || 0;
    if (d > 1) d = 1;
    if (d > 0.004) r[n] = d;
  }
  return r;
};

// Zwei Dichte-Listen zusammenzählen
ZINE.plus = function (a, b) {
  var r = {}, k;
  for (k in a) r[k] = a[k];
  for (k in b) r[k] = Math.min(1, (r[k] || 0) + b[k]);
  return r;
};

// Dichte-Liste abschwächen (Faktor 0 … 1)
ZINE.mal = function (a, f) {
  var r = {};
  for (var k in a) if (typeof a[k] === "number") r[k] = a[k] * f;
  return r;
};
