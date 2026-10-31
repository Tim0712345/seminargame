// =====================================================================
//  js/spiel/szene.js – eine Station: Robin, Figuren, Kamera
// =====================================================================

var SPIEL = window.SPIEL || {};
window.SPIEL = SPIEL;

SPIEL.szene = {
  station: null,
  robin: null,
  figuren: [],
  wellen: [],          // Schallwellen-Animationen { figur, start }
  kamX: 0,
  zeit: 0,
  naehe: null,         // Figur in Reichweite
  imGespraech: null,

  TEMPO: 110,          // Robins Lauftempo (Welt-Einheiten pro Sekunde)
  REICHWEITE: 40,      // so nah muss Robin (zusätzlich zum Abstand der Figur) sein, um sie anzusprechen

  starten: function (id) {
    var stn = DATA.stationen[id];
    this.station = stn;
    this.stationId = id;
    ZINE.ebenen.laden(stn);
    this.robin = this.neueFigur("robin", stn.start, 1);
    this.robin.istRobin = true;
    this.figuren = [];
    for (var i = 0; i < stn.figuren.length; i++) {
      var f = stn.figuren[i], fig = this.neueFigur(f.id, f.x, f.richtung || 1);
      fig.gespraech = f.gespraech;
      fig.grundRichtung = f.richtung || 1;
      this.figuren.push(fig);
    }
    this.kamX = this.kameraZiel();
  },

  neueFigur: function (id, x, richtung) {
    return {
      id: id, def: DATA.figuren[id], x: x, y: this.station.boden, richtung: richtung,
      gehen: 0, phase: 0, weg: 0, spricht: false, saat: (x * 13) % 97 + 1, ziel: null
    };
  },

  // Figuren-Parade (Debug): zeigt alle Probe-Figuren neben Robin
  parade: function (an) {
    var i;
    this.figuren = this.figuren.filter(function (f) { return !f.probe; });
    if (!an) return;
    var ids = Object.keys(DATA.figuren).filter(function (k) { return k.indexOf("probe_") === 0; });
    for (i = 0; i < ids.length; i++) {
      var f = this.neueFigur(ids[i], this.robin.x + 70 + i * 66, i % 2 ? -1 : 1);
      f.probe = true;
      this.figuren.push(f);
    }
  },

  kameraZiel: function () {
    var h = ZINE.ebenen.halbeSicht(), b = this.station.breite;
    var ziel = this.robin.x + this.robin.richtung * 40;
    if (b <= h * 2) return b / 2;
    return ZINE.klemmen(ziel, h, b - h);
  },

  update: function (dt) {
    var E = SPIEL.eingabe, r = this.robin, i;
    this.zeit += dt;

    // ---------- Eingabe → Laufrichtung ----------
    var richtung = 0;
    if (!this.imGespraech) {
      if (E.gehalten.links) { richtung -= 1; r.ziel = null; }
      if (E.gehalten.rechts) { richtung += 1; r.ziel = null; }
      if (E.zeiger && E.zeiger.ziehen) {
        r.ziel = { x: ZINE.ebenen.cssZuWelt(E.zeiger.x, E.zeiger.y)[0] };
      }
      if (E.tipp) {
        var w = ZINE.ebenen.cssZuWelt(E.tipp.x, E.tipp.y), getroffen = this.figurBei(w[0], w[1]);
        if (getroffen) {
          var ab = ZINE.figur.masse(getroffen.def).abstand + 16;
          r.ziel = { x: getroffen.x + (r.x < getroffen.x ? -ab : ab), figur: getroffen };
        }
        else r.ziel = { x: w[0] };
      }
      if (r.ziel && richtung === 0) {
        var d = r.ziel.x - r.x;
        if (Math.abs(d) > 3) richtung = d > 0 ? 1 : -1;
        else {
          var zielFigur = r.ziel.figur;
          r.ziel = null;
          if (zielFigur) this.ansprechen(zielFigur);
        }
      }
    }
    // Im Gespräch: zu nah? Dann einen Schritt zurück (z. B. vor dem Kinderwagen)
    var schauen = 0;
    if (this.imGespraech && r.platz !== undefined) {
      var dp = r.platz - r.x;
      if (Math.abs(dp) > 2) { richtung = dp > 0 ? 1 : -1; r.ziel = { x: r.platz }; }
      else { r.platz = undefined; r.ziel = null; }
      schauen = this.imGespraech.x > r.x ? 1 : -1;
    }
    if (richtung !== 0) { r.richtung = richtung; E.benutzt = true; }
    if (schauen) r.richtung = schauen;

    // ---------- Bewegung ----------
    var vorher = r.x;
    r.x = ZINE.klemmen(r.x + richtung * this.TEMPO * dt, 24, this.station.breite - 24);
    if (r.ziel && Math.abs(r.ziel.x - r.x) < this.TEMPO * dt) r.x = ZINE.klemmen(r.ziel.x, 24, this.station.breite - 24);
    var bewegt = Math.abs(r.x - vorher) > 0.01;
    r.gehen = ZINE.mix(r.gehen, bewegt ? 1 : 0, 1 - Math.exp(-dt * 12));
    if (bewegt) { r.phase += dt * 9.5; r.weg += r.x - vorher; }
    else r.phase = ZINE.mix(r.phase, Math.round(r.phase / Math.PI) * Math.PI, 1 - Math.exp(-dt * 10));

    // ---------- Figuren schauen Robin an, wenn Robin nah ist ----------
    this.naehe = null;
    var beste = Infinity;
    for (i = 0; i < this.figuren.length; i++) {
      var f = this.figuren[i], abst = Math.abs(f.x - r.x);
      var reichweite = ZINE.figur.masse(f.def).abstand + this.REICHWEITE;
      f.richtung = abst < reichweite + 60 ? (r.x < f.x ? -1 : 1) : f.grundRichtung || f.richtung;
      if (abst < reichweite && abst < beste && f.gespraech) { beste = abst; this.naehe = f; }
    }

    // ---------- Ansprechen ----------
    if (!this.imGespraech && E.neu.aktion && this.naehe) this.ansprechen(this.naehe);

    // ---------- Kamera ----------
    this.kamX = ZINE.mix(this.kamX, this.kameraZiel(), 1 - Math.exp(-dt * 3.2));

    // Schallwellen aufräumen
    var z = this.zeit;
    this.wellen = this.wellen.filter(function (w) { return z - w.start < 2.2; });
  },

  figurBei: function (x, y) {
    var alle = this.figuren;
    for (var i = 0; i < alle.length; i++) {
      var f = alle[i], m = ZINE.figur.masse(f.def);
      if (f.gespraech && Math.abs(x - f.x) < Math.max(22, m.breite) && y > f.y - m.oben - 10 && y < f.y + 8) return f;
    }
    return null;
  },

  ansprechen: function (f) {
    if (this.imGespraech || !f.gespraech) return;
    var r = this.robin;
    r.richtung = f.x > r.x ? 1 : -1;
    f.richtung = -r.richtung;
    var ab = ZINE.figur.masse(f.def).abstand + 10;
    if (Math.abs(f.x - r.x) < ab) r.platz = ZINE.klemmen(f.x - r.richtung * ab, 24, this.station.breite - 24);
    this.imGespraech = f;
    SPIEL.blasen.gespraechStarten(f);
  },

  gespraechEnde: function () { this.imGespraech = null; },

  schallwelle: function (f) { this.wellen.push({ figur: f, start: this.zeit }); },

  // Figuren in die Straßen-Ebene drucken
  figurenZeichnen: function (ebene, vx0, vx1) {
    var D = ZINE.druck, rand = DATA.stil.figuren.rand, i, alle = this.figuren.concat([this.robin]);
    // Jede Figur einzeln: erst der Papierrand (wie ausgeschnitten), dann die Farben
    for (i = 0; i < alle.length; i++) {
      var f = alle[i];
      if (f.x < vx0 - 80 || f.x > vx1 + 80) continue;
      var SF = ZINE.sammler(ebene._ton);
      ZINE.figur.bauen(SF, f.def, {
        x: f.x, y: f.y, richtung: f.richtung, gehen: f.gehen, phase: f.phase,
        zeit: this.zeit, spricht: f.spricht, saat: f.saat, weg: f.weg
      });
      if (rand > 0) D.papierRand(SF.teile, rand);
      D.teile(SF.teile);
    }
    var S = ZINE.sammler(ebene._ton);
    // Schallwellen: wenn jemand etwas Wichtiges sagt
    for (i = 0; i < this.wellen.length; i++) {
      var w = this.wellen[i], fw = w.figur, m = ZINE.figur.masse(fw.def);
      var t = this.zeit - w.start, kopfY = fw.y - m.oben * 0.83;
      for (var k = 0; k < 3; k++) {
        var tt = (t * 1.6 - k * 0.25) % 1;
        if (tt < 0 || t > 1.9) continue;
        var rr = 8 + tt * 22, dicke = 2.4 * (1 - tt) + 0.6;
        var mx = fw.x + fw.richtung * m.H * 0.1;
        S.bogen(mx, kopfY, rr, fw.richtung > 0 ? -0.75 : Math.PI - 0.75, fw.richtung > 0 ? 0.75 : Math.PI + 0.75, dicke, "schallwelle");
      }
    }
    D.teile(S.teile);
  }
};
