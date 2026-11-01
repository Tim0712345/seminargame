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
    (entwurf.__wunsch || []).forEach(function (id) { DATA.wunschzettel.forEach(function (w) { if (w.id === id && w.haltung[f.id] !== undefined) summe += w.haltung[f.id]; }); });
    if (entwurf.frist) { var fo = DATA.umsetzungsfrist.optionen.filter(function (o) { return o.id === entwurf.frist; })[0]; if (fo && fo.haltung[f.id] !== undefined) summe += fo.haltung[f.id]; }
    if (entwurf.__bonus && entwurf.__bonus[f.id]) summe += entwurf.__bonus[f.id];
    return summe + (vertrauen && vertrauen[f.id] !== undefined ? vertrauen[f.id] : (f.startVertrauen || 0));
  };

  /* Wirkungsanzeige: Summe je Achse über alle Stellschrauben → Stufe 1 bis 5 (qualitativ, keine Prognose) */
  H.wirkung = function (entwurf) {
    var s = { wissen: 0, durchsetzung: 0, aufwand: 0, recht: 0 };
    DATA.artikel.forEach(function (art) { art.schrauben.forEach(function (sch) {
      var o = optionVon(art, sch, entwurf);
      if (o && o.wirkung) for (var a in s) s[a] += o.wirkung[a] || 0;
    }); });
    s.recht -= (entwurf.__wunsch || []).length * 2;
    s.recht += entwurf.__praezise ? 2 : 0;
    var st = {};
    for (var a in s) st[a] = Math.max(1, Math.min(5, Math.round(1 + (s[a] + 8) / 5.5)));
    st.roh = s;
    return st;
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

  /* Stimmen je Sitz in Sitzordnung (für Glasmodell und Sitzlampen) */
  H.sitzStimmen = function (erg, feld) {
    var l = [];
    DATA.fraktionen.slice().sort(function (a, b) { return a.sitzordnung - b.sitzordnung; }).forEach(function (f) {
      var e = erg.fraktionen[f.id];
      for (var k = 0; k < f[feld]; k++) l.push(k < e.ja ? "ja" : (k < e.ja + e.enthaltung ? "enthaltung" : "nein"));
    });
    return l;
  };

  /* Die zwei Fraktionen, die am knappsten dagegen waren */
  H.knappDagegen = function (erg) {
    return DATA.fraktionen.filter(function (f) { return !f.immerJa && erg.fraktionen[f.id].ja * 2 < f.sitzeAusschuss; })
      .sort(function (a, b) { return (b.punkte !== undefined ? 0 : 0) + (erg.fraktionen[b.id].punkte - b.schwelle) - (erg.fraktionen[a.id].punkte - a.schwelle); })
      .slice(0, 2).map(function (f) { return f.name; });
  };

  /* Text für Bildschirmleser: „Ja: 34, Nein: 20, Enthaltung: 6 – Mehrheit erreicht“ */
  H.alsText = function (erg) {
    var T = DATA.texte.halbrund;
    return T.ja + ": " + erg.ja + ", " + T.nein + ": " + erg.nein + ", " + T.enthaltung + ": " + erg.enthaltung + " – " + (erg.mehrheit ? T.mehrheit : T.keineMehrheit);
  };

  return H;
})();
