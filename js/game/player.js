/* =====================================================================
   Die Lücke – Spielfigur Kim: Steuerung, Bewegung, Interaktion
   Weiches Beschleunigen/Bremsen, 8 Richtungen frei, sanftes Drehen.
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.Spieler = (function () {
  "use strict";
  var MM = ENG.math;

  var MAX_TEMPO = 3.4;       // Einheiten pro Sekunde
  var ANFAHREN = 9;          // wie schnell Kim beschleunigt
  var BREMSEN = 12;          // wie schnell Kim abbremst
  var DREHEN = 13;           // wie schnell Kim sich in Laufrichtung dreht
  var REICHWEITE = 1.5;      // Abstand für „E: sprechen/untersuchen“

  function Spieler(figurId) {
    this.figur = new GAME.character.Figur(figurId || "kim");
    this.vx = 0; this.vz = 0;
    this.radius = this.figur.info.radius;
    this.gesperrt = false;          // z. B. während Dialogen
    this.ziel = null;               // nächstes ansprechbares Ding
  }

  Spieler.prototype.setzen = function (x, z, rot, welt) {
    this.figur.x = x; this.figur.z = z; this.figur.rot = rot || 0;
    this.figur.y = welt.hoeheBei(x, z);
    this.vx = this.vz = 0;
  };

  /* kamDrehung: Blickrichtung der Kamera – „hoch“ heißt immer „vom Bildschirm weg“ */
  Spieler.prototype.update = function (dt, welt, dyn, kamDrehung) {
    var f = this.figur;
    var e = this.gesperrt ? { x: 0, z: 0 } : ENG.input.richtung();
    var c = Math.cos(kamDrehung || 0), sn = Math.sin(kamDrehung || 0);
    var r = { x: e.x * c + e.z * sn, z: -e.x * sn + e.z * c };
    var sollX = r.x * MAX_TEMPO, sollZ = r.z * MAX_TEMPO;
    var laenge = Math.sqrt(r.x * r.x + r.z * r.z);
    var k = laenge > 0.01 ? ANFAHREN : BREMSEN;
    this.vx = MM.damp(this.vx, sollX, k, dt);
    this.vz = MM.damp(this.vz, sollZ, k, dt);

    var altX = f.x, altZ = f.z;
    var p = { x: f.x + this.vx * dt, z: f.z + this.vz * dt };
    welt.koll.aufloesen(p, this.radius, dyn, this);
    f.x = p.x; f.z = p.z;

    // Tatsächliche Geschwindigkeit (nach Kollision) für die Animation
    var bx = (f.x - altX) / Math.max(dt, 1e-4), bz = (f.z - altZ) / Math.max(dt, 1e-4);
    f.tempo = Math.sqrt(bx * bx + bz * bz);
    // Wenn Kim an einer Wand steht, nicht weiter "gegen" sie beschleunigen
    if (dt > 0) { this.vx = MM.lerp(this.vx, bx, 0.5); this.vz = MM.lerp(this.vz, bz, 0.5); }

    if (laenge > 0.01) f.rot = MM.dampAngle(f.rot, Math.atan2(r.x, r.z), DREHEN, dt);

    f.y = MM.damp(f.y, welt.hoeheBei(f.x, f.z), 20, dt);
    f.update(dt);
  };

  /* Nächstes ansprechbares Ding suchen (bevorzugt das, wohin Kim schaut).
     kandidaten: [{ x, z, radius?, ... }]                                */
  Spieler.prototype.zielSuchen = function (kandidaten) {
    var f = this.figur, best = null, bestWert = Infinity;
    var vx = Math.sin(f.rot), vz = Math.cos(f.rot);
    for (var i = 0; i < kandidaten.length; i++) {
      var c = kandidaten[i];
      if (c.aus) continue;
      var dx = c.x - f.x, dz = c.z - f.z, d = Math.sqrt(dx * dx + dz * dz);
      var reichweite = REICHWEITE + (c.radius || 0);
      if (d > reichweite) continue;
      var blick = d > 0.001 ? (dx * vx + dz * vz) / d : 1;
      var wert = d - blick * 0.6;
      if (wert < bestWert) { bestWert = wert; best = c; }
    }
    this.ziel = best;
    return best;
  };

  return Spieler;
})();
