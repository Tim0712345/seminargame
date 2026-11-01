/* =====================================================================
   js/logik/mehrheit.js – Zustimmung und Abstimmung (Abschnitt 5.3)
   ---------------------------------------------------------------------
   Einfach und nachvollziehbar:

     punkte(Fraktion) = Summe über alle Artikel (Haltung der gewählten Option × Gewicht)
                      + Vertrauen(Fraktion)
     Gewicht = 2 bei Kernanliegen, sonst 1   (data/spielwerte.js)

   Aus punkte − schwelle wird ein Ja-Anteil (weiche Stufe):
     q = 1 / (1 + e^(−(punkte − schwelle) · steilheit · (1 + 3 · geschlossenheit)))
   Geschlossene Fraktionen kippen also schneller ganz auf Ja oder Nein.
   Unentschlossene enthalten sich:
     enthaltung = Sitze · (1 − geschlossenheit) · 4 · q · (1 − q) · 0,6
     ja         = (Sitze − enthaltung) · q,   nein = Rest
   Die Zahlenwerte stehen in data/spielwerte.js und data/fraktionen.js.
   ===================================================================== */
var LOGIK = window.LOGIK || {};

LOGIK.mehrheit = (function () {
  var H = {};

  function optionVon(art, schraube, entwurf) {
    var id = entwurf[schraube.id] !== undefined ? entwurf[schraube.id] : schraube.start;
    for (var i = 0; i < schraube.optionen.length; i++) if (schraube.optionen[i].id === id) return schraube.optionen[i];
    return null;
  }

  H.punkte = function (f, entwurf, vertrauen) {
    var W = DATA.spielwerte, summe = 0;
    DATA.artikel.forEach(function (art) {
      var gewicht = (f.kernanliegen || []).indexOf(art.id) >= 0 ? W.gewicht_kernanliegen : W.gewicht_normal;
      art.schrauben.forEach(function (s) {
        var o = optionVon(art, s, entwurf);
        if (o && o.haltung && o.haltung[f.id] !== undefined) summe += o.haltung[f.id] * gewicht;
      });
    });
    return summe + (vertrauen && vertrauen[f.id] !== undefined ? vertrauen[f.id] : (f.startVertrauen || 0));
  };

  /* Stimmen einer Fraktion aus ihren Punkten */
  H.stimmen = function (f, punkte, sitze) {
    if (f.immerJa) return { ja: sitze, nein: 0, enthaltung: 0, q: 1 };
    var k = DATA.spielwerte.mehrheit_steilheit * (1 + 3 * f.geschlossenheit);
    var q = 1 / (1 + Math.exp(-(punkte - f.schwelle) * k));
    var enth = Math.round(sitze * (1 - f.geschlossenheit) * 4 * q * (1 - q) * 0.6);
    var ja = Math.round((sitze - enth) * q);
    return { ja: ja, enthaltung: enth, nein: sitze - enth - ja, q: q };
  };

  function abstimmung(entwurf, vertrauen, feld) {
    var erg = { fraktionen: {}, ja: 0, nein: 0, enthaltung: 0 };
    DATA.fraktionen.forEach(function (f) {
      var p = H.punkte(f, entwurf, vertrauen);
      var s = H.stimmen(f, p, f[feld]);
      s.punkte = p;
      erg.fraktionen[f.id] = s;
      erg.ja += s.ja; erg.nein += s.nein; erg.enthaltung += s.enthaltung;
    });
    // einfache Mehrheit der abgegebenen Stimmen
    erg.mehrheit = erg.ja > erg.nein;
    return erg;
  }

  H.ausschuss = function (entwurf, vertrauen) { return abstimmung(entwurf, vertrauen || LOGIK.stand.vertrauen, "sitzeAusschuss"); };
  H.plenum = function (entwurf, vertrauen) { return abstimmung(entwurf, vertrauen || LOGIK.stand.vertrauen, "sitzePlenum"); };

  /* Phase 1: Entwurf aus dem Probe-Dokument im Büro */
  H.probeEntwurf = function (sz) {
    var e = {};
    if (sz && sz.dokument) { var a = sz.dokument.seiten[1].daten.auswahl; for (var k in a) e[k] = a[k]; }
    return e;
  };

  /* Text für Bildschirmleser: „Ja: 34, Nein: 20, Enthaltung: 6 – Mehrheit erreicht“ */
  H.alsText = function (erg) {
    var T = DATA.texte.halbrund;
    return T.ja + ": " + erg.ja + ", " + T.nein + ": " + erg.nein + ", " + T.enthaltung + ": " + erg.enthaltung + " – " + (erg.mehrheit ? T.mehrheit : T.keineMehrheit);
  };

  return H;
})();
