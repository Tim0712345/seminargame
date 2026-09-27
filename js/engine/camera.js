/* =====================================================================
   Die Lücke – Engine: Kamera
   Feste Schrägansicht von Süden, folgt weich. Keine freie Drehung.
   Für den Titelbildschirm gibt es einen Umkreis-Modus (orbit).
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.Kamera = (function () {
  "use strict";
  var MM = ENG.math;

  function Kamera() {
    this.ziel = [0, 0, 0];        // Punkt, auf den die Kamera schaut
    this.zielSoll = [0, 0, 0];
    this.pos = [0, 10, 10];
    this.neigung = 46 * MM.DEG;
    this.drehung = 0;             // Blickrichtung um die Hochachse (0 = von Süden)
    this.abstand = 14.5;
    this.abstandSoll = 14.5;
    this.sichtfeld = 32 * MM.DEG;
    this.nah = 0.5;
    this.fern = 160;
    this.grenzen = null;          // [minX, minZ, maxX, maxZ] – optional
    this.view = MM.m4();
    this.proj = MM.m4();
    this.viewProj = MM.m4();
    this.invViewProj = MM.m4();
    this.ebenen = new Float32Array(24);
  }

  Kamera.prototype.setzen = function (x, y, z) {
    this.zielSoll[0] = this.ziel[0] = x;
    this.zielSoll[1] = this.ziel[1] = y;
    this.zielSoll[2] = this.ziel[2] = z;
    this.abstand = this.abstandSoll;
    this.begrenzen(this.ziel);
  };

  Kamera.prototype.begrenzen = function (p) {
    if (!this.grenzen) return;
    var g = this.grenzen;
    p[0] = g[2] > g[0] ? MM.clamp(p[0], g[0], g[2]) : (g[0] + g[2]) / 2;
    p[2] = g[3] > g[1] ? MM.clamp(p[2], g[1], g[3]) : (g[1] + g[3]) / 2;
  };

  /* Weich folgen. vx/vz = Laufrichtung für einen kleinen Blick nach vorn. */
  Kamera.prototype.folgen = function (x, y, z, vx, vz, dt, ruhig) {
    var vor = ruhig ? 0 : 0.28;
    this.zielSoll[0] = x + vx * vor;
    this.zielSoll[1] = y;
    this.zielSoll[2] = z + vz * vor;
    this.begrenzen(this.zielSoll);
    var tempo = ruhig ? 9 : 4.5;
    this.ziel[0] = MM.damp(this.ziel[0], this.zielSoll[0], tempo, dt);
    this.ziel[1] = MM.damp(this.ziel[1], this.zielSoll[1], tempo * 0.7, dt);
    this.ziel[2] = MM.damp(this.ziel[2], this.zielSoll[2], tempo, dt);
    this.abstand = MM.damp(this.abstand, this.abstandSoll, 3, dt);
  };

  Kamera.prototype.aktualisieren = function (seitenverhaeltnis) {
    var cp = Math.cos(this.neigung), sp = Math.sin(this.neigung);
    this.pos[0] = this.ziel[0] + Math.sin(this.drehung) * cp * this.abstand;
    this.pos[1] = this.ziel[1] + sp * this.abstand;
    this.pos[2] = this.ziel[2] + Math.cos(this.drehung) * cp * this.abstand;
    MM.m4lookAt(this.view, this.pos, this.ziel, [0, 1, 0]);
    MM.m4perspective(this.proj, this.sichtfeld, seitenverhaeltnis, this.nah, this.fern);
    MM.m4mul(this.viewProj, this.proj, this.view);
    MM.m4invert(this.invViewProj, this.viewProj);
    MM.frustum(this.ebenen, this.viewProj);
  };

  return Kamera;
})();
