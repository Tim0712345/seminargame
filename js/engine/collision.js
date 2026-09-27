/* =====================================================================
   Die Lücke – Engine: Kollision
   ---------------------------------------------------------------------
   Kreis (Figur) gegen:
     * gesperrte Kacheln (Wasser, steile Hänge, "X" im Kollisions-Layer)
     * Kreise (Bäume, Laternen, andere Figuren)
     * gedrehte Rechtecke (Bänke, Häuser)
   Die Figur wird aus Hindernissen herausgeschoben – dadurch gleitet sie
   an Kanten entlang, statt hängen zu bleiben.
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.Kollision = (function () {
  "use strict";
  var MM = ENG.math;

  function Kollision(breite, hoehe) {
    this.w = breite;
    this.h = hoehe;
    this.gesperrt = new Uint8Array(breite * hoehe);
    this.formen = [];
    this.zellen = [];
    this.stempel = 0;
    for (var i = 0; i < breite * hoehe; i++) this.zellen.push(null);
  }

  Kollision.prototype.sperren = function (tx, tz, an) {
    if (tx < 0 || tz < 0 || tx >= this.w || tz >= this.h) return;
    this.gesperrt[tx + tz * this.w] = an === false ? 0 : 1;
  };
  Kollision.prototype.istGesperrt = function (tx, tz) {
    if (tx < 0 || tz < 0 || tx >= this.w || tz >= this.h) return true;
    return this.gesperrt[tx + tz * this.w] === 1;
  };

  Kollision.prototype.eintragen = function (f, radius) {
    f.id = this.formen.length;
    f.st = 0;
    this.formen.push(f);
    var x0 = Math.floor(f.x - radius), x1 = Math.floor(f.x + radius);
    var z0 = Math.floor(f.z - radius), z1 = Math.floor(f.z + radius);
    for (var z = Math.max(0, z0); z <= Math.min(this.h - 1, z1); z++) {
      for (var x = Math.max(0, x0); x <= Math.min(this.w - 1, x1); x++) {
        var k = x + z * this.w;
        if (!this.zellen[k]) this.zellen[k] = [];
        this.zellen[k].push(f);
      }
    }
    return f;
  };

  Kollision.prototype.kreis = function (x, z, r, info) {
    return this.eintragen({ typ: "kreis", x: x, z: z, r: r, info: info }, r);
  };

  // Rechteck mit Mittelpunkt, halber Breite/Tiefe und Drehung (Grad, wie Objekt-rot)
  Kollision.prototype.rechteck = function (x, z, hb, ht, rotGrad, info) {
    var a = (rotGrad || 0) * MM.DEG;
    return this.eintragen({ typ: "box", x: x, z: z, hb: hb, ht: ht, c: Math.cos(a), s: Math.sin(a), info: info },
      Math.sqrt(hb * hb + ht * ht));
  };

  // Punkt p {x,z} mit Radius r aus Rechteck [x0,z0]-[x1,z1] schieben
  function ausAabb(p, r, x0, z0, x1, z1) {
    var qx = MM.clamp(p.x, x0, x1), qz = MM.clamp(p.z, z0, z1);
    var dx = p.x - qx, dz = p.z - qz, d2 = dx * dx + dz * dz;
    if (d2 >= r * r) return false;
    if (d2 > 1e-10) {
      var d = Math.sqrt(d2), f = (r - d) / d;
      p.x += dx * f; p.z += dz * f;
    } else {
      var l = p.x - x0, re = x1 - p.x, o = p.z - z0, u = z1 - p.z;
      var m = Math.min(l, re, o, u);
      if (m === l) p.x = x0 - r; else if (m === re) p.x = x1 + r;
      else if (m === o) p.z = z0 - r; else p.z = z1 + r;
    }
    return true;
  }

  function ausForm(p, r, f) {
    if (f.typ === "kreis") {
      var dx = p.x - f.x, dz = p.z - f.z, rr = r + f.r, d2 = dx * dx + dz * dz;
      if (d2 >= rr * rr) return false;
      if (d2 < 1e-10) { p.x += rr; return true; }
      var d = Math.sqrt(d2), k = (rr - d) / d;
      p.x += dx * k; p.z += dz * k;
      return true;
    }
    // gedrehtes Rechteck: in lokale Koordinaten, schieben, zurück
    var wx = p.x - f.x, wz = p.z - f.z;
    var lp = { x: wx * f.c - wz * f.s, z: wx * f.s + wz * f.c };
    if (!ausAabb(lp, r, -f.hb, -f.ht, f.hb, f.ht)) return false;
    p.x = f.x + lp.x * f.c + lp.z * f.s;
    p.z = f.z - lp.x * f.s + lp.z * f.c;
    return true;
  }

  /* Position p {x,z} mit Radius r auflösen.
     dyn: zusätzliche bewegliche Kreise [{x,z,r}], ignoriert: dieser Kreis zählt nicht */
  Kollision.prototype.aufloesen = function (p, r, dyn, ignoriert) {
    for (var iter = 0; iter < 4; iter++) {
      var bewegt = false;
      this.stempel++;
      var x0 = Math.floor(p.x - r - 0.5), x1 = Math.floor(p.x + r + 0.5);
      var z0 = Math.floor(p.z - r - 0.5), z1 = Math.floor(p.z + r + 0.5);
      for (var tz = z0; tz <= z1; tz++) {
        for (var tx = x0; tx <= x1; tx++) {
          if (this.istGesperrt(tx, tz)) {
            if (ausAabb(p, r, tx, tz, tx + 1, tz + 1)) bewegt = true;
            continue;
          }
          var zelle = this.zellen[tx + tz * this.w];
          if (!zelle) continue;
          for (var i = 0; i < zelle.length; i++) {
            var f = zelle[i];
            if (f.st === this.stempel || f.aus) continue;
            f.st = this.stempel;
            if (ausForm(p, r, f)) bewegt = true;
          }
        }
      }
      if (dyn) {
        for (var k = 0; k < dyn.length; k++) {
          if (dyn[k] === ignoriert) continue;
          if (ausForm(p, r, { typ: "kreis", x: dyn[k].x, z: dyn[k].z, r: dyn[k].r })) bewegt = true;
        }
      }
      if (!bewegt) break;
    }
    return p;
  };

  // Für die Debug-Anzeige: alle Formen in der Nähe
  Kollision.prototype.formenNahe = function (x, z, rad) {
    var out = [];
    this.stempel++;
    for (var tz = Math.floor(z - rad); tz <= Math.floor(z + rad); tz++) {
      for (var tx = Math.floor(x - rad); tx <= Math.floor(x + rad); tx++) {
        if (tx < 0 || tz < 0 || tx >= this.w || tz >= this.h) continue;
        var zelle = this.zellen[tx + tz * this.w];
        if (!zelle) continue;
        for (var i = 0; i < zelle.length; i++) {
          if (zelle[i].st === this.stempel) continue;
          zelle[i].st = this.stempel;
          out.push(zelle[i]);
        }
      }
    }
    return out;
  };

  return Kollision;
})();
