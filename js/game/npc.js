/* =====================================================================
   Die Lücke – NPCs mit Tagesabläufen
   ---------------------------------------------------------------------
   Eine Routine ist eine Liste von Schritten, die sich wiederholt:
     { tun: "gehen",   weg: [[x, y], …] }      Wegpunkte (Kacheln)
     { tun: "warten",  s: 3 }                  stehen bleiben
     { tun: "sitzen",  an: "bank_1", s: 8 }    auf ein Objekt mit dieser id setzen
     { tun: "giessen", an: "beet_1", s: 5 }    Blumen gießen
     { tun: "schauen", richtung: 90, s: 4 }    in eine Richtung schauen (Grad)
   Wird ein NPC angesprochen, unterbricht er, dreht sich zu Kim und macht
   danach an derselben Stelle weiter.
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.NPC = (function () {
  "use strict";
  var MM = ENG.math;
  var TEMPO = 1.25;

  function NPC(id, def, welt) {
    this.id = id;
    this.def = def;
    this.figur = new GAME.character.Figur(def.figur);
    this.name = def.name || (DATA.characters[def.figur] || {}).name || id;
    var st = def.start || [0, 0];
    this.figur.x = st[0] + 0.5;
    this.figur.z = st[1] + 0.5;
    this.figur.rot = (def.blick || 0) * MM.DEG;
    this.figur.y = welt.hoeheBei(this.figur.x, this.figur.z);
    this.radius = this.figur.info.radius;
    this.routine = def.routine || [];
    this.schritt = 0;
    this.wegIndex = 0;
    this.timer = 0;
    this.phase = "start";     // start → läuft → fertig (pro Schritt)
    this.gespraech = false;
    this.blickZiel = null;
    this.emote = null;        // Symbol über dem Kopf (z. B. "!")
    this.emoteZeit = 0;
  }

  NPC.prototype.sichtbar = function () { return GAME.flags.pruefen(this.def.nurWenn); };

  NPC.prototype.ansprechen = function (x, z) {
    this.gespraech = true;
    this.blickZiel = [x, z];
    this.figur.sitztVorher = this.figur.sitzt;
    this.figur.giesst = false;
  };
  NPC.prototype.loslassen = function () {
    this.gespraech = false;
    this.blickZiel = null;
    this.figur.spricht = false;
    this.figur.emotion = "neutral";
  };

  // Zielpunkt und Blick für "sitzen"/"giessen" aus einem Objekt der Karte
  function objektPunkt(welt, id, abstand) {
    var o = welt.objekte[id];
    if (!o) { console.warn("NPC-Routine: Objekt mit id \"" + id + "\" fehlt auf der Karte."); return null; }
    var sitz = (o.prefab.sitz || [0, 0.15]);
    var lz = abstand === undefined ? sitz[1] : abstand;
    var c = Math.cos(o.rot), s = Math.sin(o.rot);
    return { x: o.x + sitz[0] * c + lz * s, z: o.z - sitz[0] * s + lz * c, rot: o.rot, y: o.y, hoehe: o.prefab.sitzHoehe || 0.44 };
  }

  NPC.prototype.update = function (dt, welt, spieler) {
    var f = this.figur;
    if (this.emoteZeit > 0) { this.emoteZeit -= dt; if (this.emoteZeit <= 0) this.emote = null; }

    if (this.gespraech) {
      f.tempo = 0;
      if (this.blickZiel && !f.sitzt) f.rot = MM.dampAngle(f.rot, Math.atan2(this.blickZiel[0] - f.x, this.blickZiel[1] - f.z), 8, dt);
      f.update(dt);
      return;
    }

    // Tagesablauf erst ab einer Bedingung (z. B. nach dem Intro)
    if (this.def.routineWenn && !GAME.flags.pruefen(this.def.routineWenn)) {
      f.tempo = 0;
      f.update(dt);
      return;
    }

    var sch = this.routine.length ? this.routine[this.schritt % this.routine.length] : null;
    var tempo = 0;
    if (sch) {
      switch (sch.tun) {
        case "gehen": tempo = this.gehen(dt, sch, welt, spieler); break;
        case "sitzen": this.sitzen(dt, sch, welt, spieler); tempo = this.laufTempo || 0; break;
        case "giessen": this.giessen(dt, sch, welt, spieler); tempo = this.laufTempo || 0; break;
        case "schauen":
          if (this.phase === "start") { this.timer = sch.s || 3; this.phase = "laeuft"; }
          f.rot = MM.dampAngle(f.rot, (sch.richtung || 0) * MM.DEG, 4, dt);
          this.timer -= dt;
          if (this.timer <= 0) this.weiter();
          break;
        default: // warten
          if (this.phase === "start") { this.timer = sch.s || 2; this.phase = "laeuft"; }
          this.timer -= dt;
          if (this.timer <= 0) this.weiter();
      }
    }
    f.tempo = tempo;
    if (!f.sitzt) f.y = MM.damp(f.y, welt.hoeheBei(f.x, f.z), 15, dt);
    f.update(dt);
  };

  NPC.prototype.weiter = function () {
    this.schritt = (this.schritt + 1) % Math.max(1, this.routine.length);
    this.phase = "start";
    this.wegIndex = 0;
    this.laufTempo = 0;
  };

  // Zu einem Punkt laufen. Gibt true zurück, wenn angekommen.
  NPC.prototype.laufen = function (dt, zx, zz, spieler) {
    var f = this.figur, dx = zx - f.x, dz = zz - f.z, d = Math.sqrt(dx * dx + dz * dz);
    if (d < 0.08) { this.laufTempo = 0; return true; }
    // Steht Kim im Weg? Dann kurz warten.
    if (spieler) {
      var px = spieler.x - f.x, pz = spieler.z - f.z, pd = Math.sqrt(px * px + pz * pz);
      if (pd < 0.75 && (px * dx + pz * dz) > 0) { this.laufTempo = 0; return false; }
    }
    var schritt = Math.min(d, TEMPO * dt);
    f.x += dx / d * schritt;
    f.z += dz / d * schritt;
    f.rot = MM.dampAngle(f.rot, Math.atan2(dx, dz), 8, dt);
    this.laufTempo = TEMPO;
    return false;
  };

  NPC.prototype.gehen = function (dt, sch, welt, spieler) {
    var weg = sch.weg || [];
    if (!weg.length) { this.weiter(); return 0; }
    var p = weg[this.wegIndex];
    if (this.laufen(dt, p[0] + 0.5, p[1] + 0.5, spieler)) {
      this.wegIndex++;
      if (this.wegIndex >= weg.length) this.weiter();
    }
    return this.laufTempo;
  };

  NPC.prototype.sitzen = function (dt, sch, welt, spieler) {
    var f = this.figur;
    if (this.phase === "start") {
      this.punkt = objektPunkt(welt, sch.an, 0.75);
      if (!this.punkt) { this.weiter(); return; }
      this.phase = "hin";
    }
    if (this.phase === "hin") {
      if (this.laufen(dt, this.punkt.x, this.punkt.z, spieler)) {
        var sp = objektPunkt(welt, sch.an);
        f.x = sp.x; f.z = sp.z; f.rot = sp.rot;
        f.sitzt = true;
        f.y = sp.y + sp.hoehe - 0.43 * (f.info.groesse || 1);
        this.timer = sch.s || 6;
        this.phase = "sitzt";
      }
      return;
    }
    if (this.phase === "sitzt") {
      this.timer -= dt;
      if (this.timer <= 0) {
        f.sitzt = false;
        f.x = this.punkt.x; f.z = this.punkt.z;
        this.weiter();
      }
    }
  };

  NPC.prototype.giessen = function (dt, sch, welt, spieler) {
    var f = this.figur;
    if (this.phase === "start") {
      var o = welt.objekte[sch.an];
      if (!o) { console.warn("NPC-Routine: Objekt \"" + sch.an + "\" fehlt."); this.weiter(); return; }
      // vor das Beet stellen (Seite in Richtung NPC)
      var dx = f.x - o.x, dz = f.z - o.z, d = Math.sqrt(dx * dx + dz * dz) || 1;
      var ab = (o.prefab.kollision && o.prefab.kollision.box ? Math.max(o.prefab.kollision.box[0], o.prefab.kollision.box[1]) / 2 : 0.5) + 0.45;
      this.punkt = { x: o.x + dx / d * ab, z: o.z + dz / d * ab, ox: o.x, oz: o.z };
      this.phase = "hin";
    }
    if (this.phase === "hin") {
      if (this.laufen(dt, this.punkt.x, this.punkt.z, spieler)) { this.phase = "giesst"; this.timer = sch.s || 5; }
      return;
    }
    if (this.phase === "giesst") {
      f.rot = MM.dampAngle(f.rot, Math.atan2(this.punkt.ox - f.x, this.punkt.oz - f.z), 6, dt);
      f.giesst = true;
      this.timer -= dt;
      if (this.timer <= 0) { f.giesst = false; this.weiter(); }
    }
  };

  NPC.prototype.zeigeEmote = function (symbol, dauer) {
    this.emote = symbol;
    this.emoteZeit = dauer || 2.2;
  };

  return NPC;
})();
