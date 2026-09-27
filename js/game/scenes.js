/* =====================================================================
   Die Lücke – Szenen (Ablauf des Spiels)
   ---------------------------------------------------------------------
   Spielszene: Kim läuft über eine Karte, spricht mit NPCs, betritt
   Häuser und wechselt die Karten (mit Abblende).
   Später (Phase 4): Titel → Spiel → Finale → Epilog → Reflexion.
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

/* ---------------- Spielszene ---------------- */
GAME.Spielszene = (function () {
  "use strict";
  var MM = ENG.math;
  var Z = { npcs: [], figuren: [] };
  var EMOTIONEN = ["froehlich", "ueberrascht", "nachdenklich", "skeptisch", "neutral"];
  var bp = [0, 0];
  var wechsel = null;          // laufender Kartenwechsel
  var sperrZeit = 0;           // kurz nach dem Betreten keine Ausgänge auslösen
  var introTimer = 0;

  Z.betreten = function (opt) {
    Z.spieler = new GAME.Spieler("kim");
    Z.kamera = new ENG.Kamera();
    Z.karteLaden(opt.karte || "europaplatz", opt.spawn || "start");
  };

  // ---------------- Karte laden ----------------
  Z.karteLaden = function (id, spawnName) {
    Z.welt = new GAME.Welt(id);
    var map = Z.welt.map;
    var sp = Z.welt.spawn(spawnName);
    Z.spieler.setzen(sp.x, sp.z, sp.rot, Z.welt);

    // NPCs dieser Karte
    Z.npcs = [];
    for (var nid in DATA.npcs) {
      var d = DATA.npcs[nid];
      if (d.karte === id) Z.npcs.push(new GAME.NPC(nid, d, Z.welt));
    }

    // Probefiguren (nur Test-Insel)
    Z.figuren = [];
    (map.testfiguren || []).forEach(function (t) {
      var f = new GAME.character.Figur(t.figur);
      f.x = t.x + 0.5; f.z = t.y + 0.5; f.rot = (t.blick || 0) * MM.DEG;
      f.startRot = f.rot; f.y = Z.welt.hoeheBei(f.x, f.z);
      f.emoIndex = -1; f.sprichtBis = 0;
      Z.figuren.push(f);
    });

    // Kamera
    Z.kamera.abstandSoll = map.innen ? 12 : 14.5;
    Z.kamera.grenzen = Z.welt.kameraGrenzen;
    Z.kamera.setzen(Z.spieler.figur.x, Z.spieler.figur.y, Z.spieler.figur.z);

    // Brunnen & Co.: Stellen, an denen Wasser spritzt
    Z.spritzer = [];
    for (var oid in Z.welt.objekte) {
      var o = Z.welt.objekte[oid];
      if (o.prefab.spritzer) Z.spritzer.push({ x: o.x, y: o.y + o.prefab.spritzer, z: o.z, t: 0 });
    }

    Z.testfundBauen();
    GAME.ui.ort(map.name);
    ENG.partikel.leeren();
    if (map.land) GAME.flags.setzen("war_in_" + map.land);
    sperrZeit = 0.8;
    introTimer = 0.9;
    Z.kimEmote = null;
  };

  // Kartenwechsel mit Abblende
  Z.wechseln = function (ziel, spawn) {
    if (wechsel) return;
    if (!DATA.maps[ziel]) { console.warn("Ziel-Karte fehlt: " + ziel); return; }
    wechsel = { ziel: ziel, spawn: spawn, t: 0, geladen: false };
    GAME.ui.abblenden(true);
  };

  // ---------------- Test-Fundstück (nur Test-Insel) ----------------
  Z.testfundBauen = function () {
    Z.fund = null;
    var i = Z.welt.interaktionen.filter(function (x) { return x.id === "testfund"; })[0];
    if (!i) return;
    var b = ENG.mesh.neu(), F = GAME.farbe;
    b.add(ENG.mesh.form("box", { groesse: [0.36, 0.08, 0.28], rund: 0.03 }, true), { pos: [0, 0, 0], farbe: F("senf") });
    b.add(ENG.mesh.form("box", { groesse: [0.32, 0.06, 0.29], rund: 0.02 }, true), { pos: [0.015, 0, 0], farbe: F("creme") });
    b.add(ENG.mesh.form("box", { groesse: [0.03, 0.02, 0.14], rund: 0.008 }, true), { pos: [0.08, 0.04, 0.16], farbe: F("koralle") });
    Z.fund = { mesh: b.fertig(), x: i.x, y: i.y + 0.95, z: i.z, aktiv: true, model: MM.m4(), funkeln: 0 };
    i.aus = true;
  };

  // ---------------- Hilfen ----------------
  function sichtbareNpcs() { return Z.npcs.filter(function (n) { return n.sichtbar(); }); }

  Z.figurVon = function (id) {
    if (id === "kim") return Z.spieler.figur;
    var n = npcVonFigur(id);
    return n ? n.figur : null;
  };
  function npcVonFigur(id) {
    for (var i = 0; i < Z.npcs.length; i++) if (Z.npcs[i].id === id || Z.npcs[i].def.figur === id) return Z.npcs[i];
    return null;
  }

  function kontext(npc, beteiligte) {
    var kim = Z.spieler.figur;
    return {
      npc: npc, kim: kim,
      figurVon: Z.figurVon,
      kimEmote: function (s) { Z.kimEmote = { symbol: s, zeit: 2.2 }; },
      beiEnde: function () {
        if (npc) npc.loslassen();
        (beteiligte || []).forEach(function (n) { n.loslassen(); });
        kim.emotion = "neutral";
      }
    };
  }

  Z.dialogStarten = function (id, npc) {
    var kim = Z.spieler.figur;
    if (npc) {
      npc.ansprechen(kim.x, kim.z);
      kim.rot = Math.atan2(npc.figur.x - kim.x, npc.figur.z - kim.z);
    }
    GAME.dialog.starten(id, kontext(npc, []));
  };

  function introStarten() {
    var beteiligte = ["laurent", "anna", "jonas"].map(npcVonFigur).filter(Boolean);
    var kim = Z.spieler.figur;
    beteiligte.forEach(function (n) { n.ansprechen(kim.x, kim.z); });
    GAME.dialog.starten("intro", kontext(npcVonFigur("laurent"), beteiligte));
  }

  function kandidaten() {
    var l = [];
    Z.welt.interaktionen.forEach(function (i) { if (!i.aus && i.art) l.push(i); });
    sichtbareNpcs().forEach(function (n) {
      if (n.def.dialog) l.push({ art: "npc", npc: n, x: n.figur.x, z: n.figur.z, radius: n.figur.sitzt ? 0.45 : 0.15 });
    });
    if (Z.fund && Z.fund.aktiv) l.push({ art: "fund", x: Z.fund.x, z: Z.fund.z, radius: 0.3 });
    Z.figuren.forEach(function (f) { l.push({ art: "figur", figur: f, x: f.x, z: f.z, radius: 0.1 }); });
    return l;
  }

  function interagieren(ziel) {
    var kim = Z.spieler.figur;
    switch (ziel.art) {
      case "npc": Z.dialogStarten(ziel.npc.def.dialog, ziel.npc); break;
      case "dialog":
        kim.rot = Math.atan2(ziel.x - kim.x, ziel.z - kim.z);
        Z.dialogStarten(ziel.dialog, null);
        break;
      case "tuer": Z.wechseln(ziel.ziel, ziel.spawn); break;
      case "fund":
        Z.fund.aktiv = false;
        kim.jubeln(); kim.emotion = "froehlich";
        GAME.ui.einblenden(DATA.texte.test.fundText);
        for (var k = 0; k < 24; k++) {
          var a = k / 24 * Math.PI * 2;
          ENG.partikel.neu({ x: Z.fund.x, y: Z.fund.y, z: Z.fund.z, vx: Math.cos(a) * 1.6, vy: 1.4 + Math.random(), vz: Math.sin(a) * 1.6,
            leben: 0.9, groesse: 0.12, farbe: [1, 0.92, 0.6], alpha: 0.9, schwerkraft: 3 });
        }
        break;
      case "figur":
        var f = ziel.figur;
        f.emoIndex = (f.emoIndex + 1) % EMOTIONEN.length;
        f.emotion = EMOTIONEN[f.emoIndex];
        f.sprichtBis = 1.2;
        f.huepfen();
        break;
    }
  }

  // ---------------- Update ----------------
  Z.update = function (dt, t) {
    var sp = Z.spieler, kim = sp.figur, I = ENG.input;

    // Kartenwechsel: abblenden → laden → aufblenden
    if (wechsel) {
      wechsel.t += dt;
      if (!wechsel.geladen && wechsel.t > 0.38) {
        Z.karteLaden(wechsel.ziel, wechsel.spawn);
        wechsel.geladen = true;
        GAME.ui.abblenden(false);
      }
      if (wechsel.geladen && wechsel.t > 0.7) wechsel = null;
    }

    GAME.dialog.update(dt);
    var blockiert = GAME.ui.blockiert() || GAME.dialog.aktiv || !!wechsel;
    sp.gesperrt = blockiert;

    var npcs = sichtbareNpcs();
    var dyn = npcs.map(function (n) { return { x: n.figur.x, z: n.figur.z, r: n.radius }; })
      .concat(Z.figuren.map(function (f) { return { x: f.x, z: f.z, r: f.info.radius }; }));
    sp.update(dt, Z.welt, dyn, Z.kamera.drehung);
    npcs.forEach(function (n) { n.update(dt, Z.welt, kim); });

    // Probefiguren (Test-Insel)
    Z.figuren.forEach(function (f) {
      var dx = kim.x - f.x, dz = kim.z - f.z, d = Math.sqrt(dx * dx + dz * dz);
      f.rot = MM.dampAngle(f.rot, d < 2.6 ? Math.atan2(dx, dz) : f.startRot, 6, dt);
      f.tempo = 0;
      if (f.sprichtBis > 0) { f.sprichtBis -= dt; f.spricht = f.sprichtBis > 0; }
      f.update(dt);
    });

    // Intro beim ersten Besuch des Europaplatzes
    if (Z.welt.id === "europaplatz" && !GAME.flags.hat("intro_fertig") && !GAME.dialog.aktiv && !wechsel && !GAME.ui.blockiert()) {
      introTimer -= dt;
      if (introTimer <= 0) introStarten();
    }

    // Interaktion
    var ziel = blockiert ? null : sp.zielSuchen(kandidaten());
    Z.ziel = ziel;
    if (ziel && I.gedrueckt("aktion")) {
      I.verbrauchen("aktion");
      interagieren(ziel);
    }

    // Türen durch Hineinlaufen betreten, Ausgänge am Kartenrand
    sperrZeit -= dt;
    if (!blockiert && sperrZeit <= 0) {
      Z.welt.interaktionen.forEach(function (i) {
        if (i.art !== "tuer" || wechsel) return;
        var dx = i.x - kim.x, dz = i.z - kim.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d < 0.45 && (dx * sp.vx + dz * sp.vz) > 0.8 * d) Z.wechseln(i.ziel, i.spawn);
      });
      var a = Z.welt.ausgangBei(kim.x, kim.z);
      if (a && !wechsel && GAME.flags.pruefen(a.wenn)) {
        var r = a.richtung, ok = !r ||
          (r === "w" && sp.vx < -0.3) || (r === "o" && sp.vx > 0.3) ||
          (r === "n" && sp.vz < -0.3) || (r === "s" && sp.vz > 0.3);
        if (ok) Z.wechseln(a.ziel, a.spawn);
      }
    }

    // Brunnen plätschern
    Z.spritzer.forEach(function (s) {
      s.t -= dt;
      if (s.t <= 0) {
        s.t = 0.06;
        var w = Math.random() * Math.PI * 2, v = 0.5 + Math.random() * 0.5;
        ENG.partikel.neu({ x: s.x, y: s.y, z: s.z, vx: Math.cos(w) * v, vy: 1.6 + Math.random() * 0.6, vz: Math.sin(w) * v,
          leben: 0.9, groesse: 0.07, farbe: [0.62, 0.8, 0.9], alpha: 0.85, schwerkraft: 5 });
      }
    });

    if (Z.fund && Z.fund.aktiv) {
      MM.m4compose(Z.fund.model, Z.fund.x, Z.fund.y + Math.sin(t * 2) * 0.08, Z.fund.z, 0.25, t * 1.2, 0, 1, 1, 1);
    }
    if (Z.kimEmote) { Z.kimEmote.zeit -= dt; if (Z.kimEmote.zeit <= 0) Z.kimEmote = null; }

    // HUD-Hinweis zur aktuellen Aufgabe
    GAME.ui.hinweis(GAME.flags.hat("intro_fertig") ? GAME.quests.hinweis(Z.welt.map.land || null) : "");

    Z.kamera.folgen(kim.x, kim.y, kim.z, sp.vx, sp.vz, dt, false);
    ENG.partikel.update(dt);
  };

  // Weltpunkt -> Bildschirm (mit Weltkrümmung, wie im Shader)
  function aufBildschirm(x, y, z) {
    var k = Z.kamera, dx = x - k.ziel[0], dz = z - k.ziel[2];
    y -= (dx * dx + dz * dz) * ENG.renderer.kruemmung;
    return MM.project(bp, k.viewProj, x, y, z, ENG.renderer.cssB, ENG.renderer.cssH);
  }
  function kopfHoehe(f) { return f.y + f.info.kopfHoehe * f.info.groesse + 0.05; }

  // ---------------- Zeichnen ----------------
  Z.zeichnen = function (t) {
    var R = ENG.renderer, k = Z.kamera, w = Z.welt;
    k.aktualisieren(R.breite / R.hoehe);
    R.beginn(k, w.stimmung, t);
    w.zeichnen(k);
    var hf = function (x, z) { return w.hoeheBei(x, z); };
    var npcs = sichtbareNpcs();
    Z.spieler.figur.zeichnen();
    npcs.forEach(function (n) { n.figur.zeichnen(); });
    Z.figuren.forEach(function (f) { f.zeichnen(); });
    if (Z.fund && Z.fund.aktiv) R.mesh(Z.fund.mesh, Z.fund.model, { kontur: 0.0018 });

    w.schattenZeichnen(k);
    Z.spieler.figur.schatten(hf);
    npcs.forEach(function (n) { n.figur.schatten(hf); });
    Z.figuren.forEach(function (f) { f.schatten(hf); });
    if (Z.fund && Z.fund.aktiv) R.schatten(Z.fund.x, Z.fund.z, 0.25, 0.25, hf);
    ENG.partikel.zeichnen();
    if (GAME.debug && GAME.debug.an) GAME.debug.zeichnen(Z);
    R.ende();
    GAME.dialog.portraitZeichnen(w.stimmung, t);

    // ---- Blasen über Köpfen und Objekten ----
    var U = GAME.ui;
    U.blasenBeginn();
    npcs.forEach(function (n) {
      var sym = n.emote || (!n.gespraech && n.def.hinweis && GAME.flags.pruefen(n.def.hinweis) ? "!" : null);
      if (sym && aufBildschirm(n.figur.x, kopfHoehe(n.figur) + 0.25, n.figur.z)) U.blase("emote_" + n.id, bp[0], bp[1], { emote: sym });
    });
    var kim = Z.spieler.figur;
    if (Z.kimEmote && aufBildschirm(kim.x, kopfHoehe(kim) + 0.25, kim.z)) U.blase("emote_kim", bp[0], bp[1], { emote: Z.kimEmote.symbol });
    var z = Z.ziel;
    if (z && !GAME.dialog.aktiv) {
      var hoehe, text;
      switch (z.art) {
        case "npc": hoehe = kopfHoehe(z.npc.figur) + 0.05; text = z.npc.name; break;
        case "figur": hoehe = kopfHoehe(z.figur) + 0.05; text = z.figur.def.name; break;
        case "tuer": hoehe = (z.y || 0) + (z.hoehe || 1.6); text = DATA.texte.hineingehen; break;
        case "dialog": hoehe = (z.y || 0) + (z.hoehe || 1.4); text = z.text || DATA.texte.ansehen; break;
        case "fund": hoehe = Z.fund.y + 0.45; text = DATA.texte.test.fundUntersuchen; break;
        default: hoehe = (z.y || 0) + 1.2; text = DATA.texte.ansehen;
      }
      var mitEmote = z.art === "npc" && (z.npc.emote || (z.npc.def.hinweis && GAME.flags.pruefen(z.npc.def.hinweis)));
      if (aufBildschirm(z.x, hoehe + (mitEmote ? 0.55 : 0), z.z)) U.blase("ziel", bp[0], bp[1], { taste: DATA.texte.hudTaste, text: text });
    }
    U.blasenEnde();
  };

  return Z;
})();
