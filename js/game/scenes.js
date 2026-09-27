/* =====================================================================
   Die Lücke – Szenen (Ablauf des Spiels)
   ---------------------------------------------------------------------
   Phase 1: nur die Spielszene auf der Test-Insel.
   Später: Titel → Intro → Spiel ↔ Kartenwechsel → Finale → Epilog.
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.szenen = (function () {
  "use strict";
  var S = { aktiv: null };
  S.wechseln = function (szene, arg) {
    if (S.aktiv && S.aktiv.verlassen) S.aktiv.verlassen();
    S.aktiv = szene;
    if (szene.betreten) szene.betreten(arg || {});
  };
  S.update = function (dt, t) { if (S.aktiv) S.aktiv.update(dt, t); };
  S.zeichnen = function (t) { if (S.aktiv) S.aktiv.zeichnen(t); };
  return S;
})();

/* ---------------- Spielszene: Kim läuft durch eine Karte ---------------- */
GAME.Spielszene = (function () {
  "use strict";
  var MM = ENG.math;
  var Z = {};
  var EMOTIONEN = ["froehlich", "ueberrascht", "nachdenklich", "skeptisch", "neutral"];
  var bp = [0, 0];

  Z.betreten = function (opt) {
    Z.welt = new GAME.Welt(opt.karte || "testinsel");
    Z.spieler = new GAME.Spieler("kim");
    var sp = Z.welt.spawn(opt.spawn || "start");
    Z.spieler.setzen(sp.x, sp.z, sp.rot, Z.welt);

    // Probefiguren (nur Test-Insel)
    Z.figuren = [];
    (Z.welt.map.testfiguren || []).forEach(function (t) {
      var f = new GAME.character.Figur(t.figur);
      f.x = t.x + 0.5; f.z = t.y + 0.5; f.rot = (t.blick || 0) * MM.DEG;
      f.startRot = f.rot;
      f.y = Z.welt.hoeheBei(f.x, f.z);
      f.emoIndex = -1;
      f.sprichtBis = 0;
      Z.figuren.push(f);
    });

    Z.kamera = new ENG.Kamera();
    if (Z.welt.map.innen) Z.kamera.abstandSoll = 11;
    Z.kamera.setzen(Z.spieler.figur.x, Z.spieler.figur.y, Z.spieler.figur.z);

    Z.testfundBauen();
    GAME.ui.ort(Z.welt.map.name);
    ENG.partikel.leeren();
  };

  // ---------------- Test-Fundstück (schwebendes Notizbuch) ----------------
  Z.testfundBauen = function () {
    Z.fund = null;
    var i = Z.welt.interaktionen.filter(function (x) { return x.id === "testfund"; })[0];
    if (!i) return;
    var b = ENG.mesh.neu(), F = GAME.farbe;
    b.add(ENG.mesh.form("box", { groesse: [0.36, 0.08, 0.28], rund: 0.03 }, true), { pos: [0, 0, 0], farbe: F("senf") });
    b.add(ENG.mesh.form("box", { groesse: [0.32, 0.06, 0.29], rund: 0.02 }, true), { pos: [0.015, 0, 0], farbe: F("creme") });
    b.add(ENG.mesh.form("box", { groesse: [0.03, 0.02, 0.14], rund: 0.008 }, true), { pos: [0.08, 0.04, 0.16], farbe: F("koralle") });
    b.add(ENG.mesh.form("kugel", { r: 0.05 }, true), { pos: [-0.06, 0.045, 0], skal: [1, 0.3, 1], farbe: F("koralle") });
    Z.fund = { mesh: b.fertig(), x: i.x, y: i.y + 0.95, z: i.z, aktiv: true, model: MM.m4(), funkeln: 0, info: i };
    i.radius = 0.3;
  };

  function kandidaten() {
    var l = [];
    if (Z.fund && Z.fund.aktiv) l.push({ x: Z.fund.x, z: Z.fund.z, radius: 0.3, art: "fund" });
    Z.figuren.forEach(function (f) { l.push({ x: f.x, z: f.z, radius: 0.1, art: "figur", figur: f }); });
    return l;
  }

  Z.update = function (dt, t) {
    var sp = Z.spieler, I = ENG.input;
    sp.gesperrt = GAME.ui.blockiert();

    var dyn = Z.figuren.map(function (f) { return { x: f.x, z: f.z, r: f.info.radius }; });
    sp.update(dt, Z.welt, dyn);

    // Probefiguren: drehen sich zu Kim, wenn Kim nah ist
    Z.figuren.forEach(function (f) {
      var dx = sp.figur.x - f.x, dz = sp.figur.z - f.z, d = Math.sqrt(dx * dx + dz * dz);
      var soll = d < 2.6 ? Math.atan2(dx, dz) : f.startRot;
      f.rot = MM.dampAngle(f.rot, soll, 6, dt);
      f.tempo = 0;
      if (f.sprichtBis > 0) { f.sprichtBis -= dt; f.spricht = f.sprichtBis > 0; }
      f.update(dt);
    });

    // Interaktion
    var ziel = GAME.ui.blockiert() ? null : sp.zielSuchen(kandidaten());
    Z.ziel = ziel;
    if (ziel && I.gedrueckt("aktion")) {
      I.verbrauchen("aktion");
      if (ziel.art === "fund") {
        Z.fund.aktiv = false;
        sp.figur.jubeln();
        sp.figur.emotion = "froehlich";
        setTimeout(function () { sp.figur.emotion = "neutral"; }, 1800);
        GAME.ui.einblenden(DATA.texte.test.fundText);
        for (var k = 0; k < 24; k++) {
          var a = k / 24 * Math.PI * 2;
          ENG.partikel.neu({ x: Z.fund.x, y: Z.fund.y, z: Z.fund.z, vx: Math.cos(a) * 1.6, vy: 1.4 + Math.random(), vz: Math.sin(a) * 1.6,
            leben: 0.9, groesse: 0.12, farbe: [1, 0.92, 0.6], alpha: 0.9, schwerkraft: 3 });
        }
      } else if (ziel.art === "figur") {
        var f = ziel.figur;
        f.emoIndex = (f.emoIndex + 1) % EMOTIONEN.length;
        f.emotion = EMOTIONEN[f.emoIndex];
        f.sprichtBis = 1.2;
        f.huepfen();
      }
    }

    // Test-Fundstück schweben lassen
    if (Z.fund && Z.fund.aktiv) {
      var f2 = Z.fund;
      MM.m4compose(f2.model, f2.x, f2.y + Math.sin(t * 2) * 0.08, f2.z, 0.25, t * 1.2, 0, 1, 1, 1);
      f2.funkeln -= dt;
      if (f2.funkeln <= 0) {
        f2.funkeln = 0.25;
        ENG.partikel.neu({ x: f2.x + (Math.random() - 0.5) * 0.6, y: f2.y + Math.random() * 0.3, z: f2.z + (Math.random() - 0.5) * 0.6,
          vy: 0.4, leben: 1.0, groesse: 0.08, farbe: [1, 0.95, 0.7], alpha: 0.9 });
      }
    }

    var fg = sp.figur;
    Z.kamera.folgen(fg.x, fg.y, fg.z, sp.vx, sp.vz, dt, false);
    ENG.partikel.update(dt);
  };

  // Weltpunkt -> Bildschirm (mit Weltkrümmung, wie im Shader)
  function aufBildschirm(x, y, z) {
    var k = Z.kamera, dx = x - k.ziel[0], dz = z - k.ziel[2];
    y -= (dx * dx + dz * dz) * ENG.renderer.kruemmung;
    return MM.project(bp, k.viewProj, x, y, z, ENG.renderer.cssB, ENG.renderer.cssH);
  }

  Z.zeichnen = function (t) {
    var R = ENG.renderer, k = Z.kamera, w = Z.welt;
    k.aktualisieren(R.breite / R.hoehe);
    R.beginn(k, w.stimmung, t);
    w.zeichnen(k);
    var hf = function (x, z) { return w.hoeheBei(x, z); };
    Z.spieler.figur.zeichnen();
    Z.figuren.forEach(function (f) { f.zeichnen(); });
    if (Z.fund && Z.fund.aktiv) R.mesh(Z.fund.mesh, Z.fund.model, { rand: 0.6 });

    w.schattenZeichnen(k);
    Z.spieler.figur.schatten(hf);
    Z.figuren.forEach(function (f) { f.schatten(hf); });
    if (Z.fund && Z.fund.aktiv) R.schatten(Z.fund.x, Z.fund.z, 0.25, 0.25, hf);
    ENG.partikel.zeichnen();
    if (GAME.debug && GAME.debug.an) GAME.debug.zeichnen(Z);
    R.ende();

    // Blasen
    GAME.ui.blasenBeginn();
    if (Z.ziel) {
      var hoehe, text;
      if (Z.ziel.art === "fund") { hoehe = Z.fund.y + 0.45; text = DATA.texte.test.fundUntersuchen; }
      else { hoehe = Z.ziel.figur.y + Z.ziel.figur.info.kopfHoehe * Z.ziel.figur.info.groesse + 0.1; text = Z.ziel.figur.def.name; }
      if (aufBildschirm(Z.ziel.x, hoehe, Z.ziel.z)) GAME.ui.blase("ziel", bp[0], bp[1], { taste: DATA.texte.hudTaste, text: text });
    }
    GAME.ui.blasenEnde();
  };

  return Z;
})();
