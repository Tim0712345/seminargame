/* =====================================================================
   Die Lücke – Szenen (Ablauf des Spiels)
   ---------------------------------------------------------------------
   Ablauf: Titelszene → Spielszene (Viertel, Brüssel, Finale im Saal)
           → Epilogszene („10 Jahre später“) → Reflexion (HTML-Seite)
   Spielszene: Kim läuft über eine Karte, spricht mit NPCs, betritt
   Häuser und wechselt die Karten (mit Abblende). Speichert automatisch.
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

  // Szenenwechsel mit Abblende (Papier deckt kurz alles ab)
  var laeuft = false;
  S.ueberblenden = function (szene, arg) {
    if (laeuft) return;
    laeuft = true;
    GAME.ui.abblenden(true);
    setTimeout(function () {
      S.wechseln(szene, arg);
      GAME.ui.abblenden(false);
      laeuft = false;
    }, 420);
  };

  S.epilogStarten = function () { S.ueberblenden(GAME.Epilogszene); };
  S.titelStarten = function () { S.ueberblenden(GAME.Titelszene); };
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
    wechsel = null;
    Z.gezeigterBeweis = null;
    GAME.ui.hudZeigen(true);
    Z.karteLaden(opt.karte || "europaplatz", opt.spawn || "start", opt.pos);
  };
  Z.verlassen = function () {
    if (GAME.dialog.aktiv) GAME.dialog.beenden();
    GAME.ui.blasenBeginn(); GAME.ui.blasenEnde();
  };

  // ---------------- Karte laden ----------------
  Z.karteLaden = function (id, spawnName, pos) {
    Z.welt = new GAME.Welt(id);
    var map = Z.welt.map;
    var sp = pos || Z.welt.spawn(spawnName);
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
    Z.kamera.abstandSoll = (map.kamera && map.kamera.abstand) || (map.innen ? 12 : 14.5);
    Z.kamera.grenzen = Z.welt.kameraGrenzen;
    Z.kamera.setzen(Z.spieler.figur.x, Z.spieler.figur.y, Z.spieler.figur.z);

    // Brunnen & Co.: Stellen, an denen Wasser spritzt
    Z.spritzer = [];
    for (var oid in Z.welt.objekte) {
      var o = Z.welt.objekte[oid];
      if (o.prefab.spritzer) Z.spritzer.push({ x: o.x, y: o.y + o.prefab.spritzer, z: o.z, t: 0 });
    }

    Z.testfundBauen();
    var land = map.land && DATA.countries[map.land];
    GAME.ui.ort(map.name, map.innen ? null : (map.fakt || (land && land.fakt)));
    ENG.partikel.leeren();
    if (map.land) GAME.flags.setzen("war_in_" + map.land);
    sperrZeit = 0.8;
    introTimer = 0.9;
    Z.kimEmote = null;
    Z.speichern();
  };

  // ---------------- Speichern ----------------
  var speicherPause = 0;
  Z.ort = function () {
    var f = Z.spieler.figur;
    return { karte: Z.welt.id, x: f.x, z: f.z, rot: f.rot };
  };
  Z.speichern = function () {
    if (!Z.welt || Z.welt.id === "testinsel") return;
    GAME.speicher.speichern(Z.ort());
    speicherPause = 1.5;
  };

  // Beweisstück hochhalten (auch für die Präsentation im Sitzungssaal)
  Z.beweisZeigen = function (land, zeit) {
    Z.gezeigterBeweis = land ? { land: land, zeit: zeit || 1.8 } : null;
  };

  // Kartenwechsel mit Abblende
  Z.wechseln = function (ziel, spawn) {
    if (wechsel) return;
    if (!DATA.maps[ziel]) { console.warn("Ziel-Karte fehlt: " + ziel); return; }
    wechsel = { ziel: ziel, spawn: spawn, t: 0, geladen: false };
    GAME.ui.abblenden(true);
    ENG.audio.tuer();
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
      beweisZeigen: function (land) { Z.beweisZeigen(land, 1.8); },
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
    // "objekt" = nur für NPC-Routinen markiert (Bänke, Tische) – nicht ansprechbar
    Z.welt.interaktionen.forEach(function (i) { if (!i.aus && i.art && i.art !== "objekt") l.push(i); });
    sichtbareNpcs().forEach(function (n) {
      if (n.def.dialog) l.push({ art: "npc", npc: n, x: n.figur.x, z: n.figur.z, radius: n.figur.sitzt ? 0.45 : 0.15 });
    });
    if (Z.fund && Z.fund.aktiv) l.push({ art: "fund", x: Z.fund.x, z: Z.fund.z, radius: 0.3 });
    Z.figuren.forEach(function (f) { l.push({ art: "figur", figur: f, x: f.x, z: f.z, radius: 0.1 }); });
    return l;
  }

  // Aufzug: Etage wählen (Karten mit Startpunkt "aufzug")
  function aufzugMenue(ziel) {
    var T = DATA.texte;
    // Nur die anderen Etagen sind wählbar – so fährt E/Enter sofort los
    var eintraege = ziel.etagen.filter(function (id) { return id !== Z.welt.id; }).map(function (id) {
      return { text: "→ " + (DATA.maps[id] ? DATA.maps[id].etage || DATA.maps[id].name : id),
               aktion: function () { GAME.ui.menueSchliessen(); Z.wechseln(id, "aufzug"); } };
    });
    eintraege.push({ text: T.schliessen, aktion: function () { GAME.ui.menueSchliessen(); } });
    var hier = DATA.maps[Z.welt.id];
    GAME.ui.menueOeffnen({ titel: T.aufzugTitel, eintraege: eintraege,
      fussnote: T.aufzugHier + " " + (hier.etage || hier.name) });
  }

  function interagieren(ziel) {
    var kim = Z.spieler.figur;
    switch (ziel.art) {
      case "npc": Z.dialogStarten(ziel.npc.def.dialog, ziel.npc); break;
      case "dialog":
        kim.rot = Math.atan2(ziel.x - kim.x, ziel.z - kim.z);
        Z.dialogStarten(ziel.dialog, null);
        break;
      case "tuer":
        if (GAME.flags.pruefen(ziel.wenn)) Z.wechseln(ziel.ziel, ziel.spawn);
        else if (ziel.gesperrt) {
          kim.rot = Math.atan2(ziel.x - kim.x, ziel.z - kim.z);
          Z.dialogStarten(ziel.gesperrt, null);
        }
        break;
      case "aufzug": aufzugMenue(ziel); break;
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

  // ---------------- Klicken / Tippen ----------------
  // Bildschirmpunkt → Punkt auf dem Boden (Höhe y0)
  function bodenPunkt(sx, sy, y0) {
    var R = ENG.renderer, m = Z.kamera.invViewProj;
    var nx = sx / R.cssB * 2 - 1, ny = 1 - sy / R.cssH * 2;
    function zurueck(nz) {
      var x = m[0] * nx + m[4] * ny + m[8] * nz + m[12], y = m[1] * nx + m[5] * ny + m[9] * nz + m[13];
      var z = m[2] * nx + m[6] * ny + m[10] * nz + m[14], w = m[3] * nx + m[7] * ny + m[11] * nz + m[15];
      return [x / w, y / w, z / w];
    }
    var a = zurueck(-1), b = zurueck(1), t = (y0 - a[1]) / (b[1] - a[1]);
    return { x: a[0] + (b[0] - a[0]) * t, z: a[2] + (b[2] - a[2]) * t };
  }
  function zielOben(c) {
    switch (c.art) {
      case "npc": return kopfHoehe(c.npc.figur) + 0.3;
      case "figur": return kopfHoehe(c.figur) + 0.3;
      case "fund": return Z.fund.y + 0.3;
      default: return (c.y || 0) + (c.hoehe || 1.4);
    }
  }
  function zuZielGehen(c) {
    var kim = Z.spieler.figur, reich = GAME.Spieler.REICHWEITE + (c.radius || 0);
    var los = function () {
      var k = Z.spieler.figur;
      k.rot = Math.atan2(c.x - k.x, c.z - k.z);
      if (!GAME.dialog.aktiv && !GAME.ui.blockiert() && !wechsel) interagieren(c);
    };
    var dx = c.x - kim.x, dz = c.z - kim.z;
    if (dx * dx + dz * dz <= reich * reich * 0.9) { los(); return; }
    var punkte = (Z.welt.weg(kim.x, kim.z, c.x, c.z) || []).slice(0, -1);
    Z.spieler.laufZiel = { x: c.x, z: c.z, punkte: punkte, stopp: Math.max(0.45, reich - 0.4), reichweite: reich, kandidat: c, fertig: los };
  }
  Z.klicken = function (k) {
    var kim = Z.spieler.figur, best = null, bestD = 55 * 55;
    kandidaten().forEach(function (c) {
      var y0 = c.art === "npc" ? c.npc.figur.y : (c.art === "figur" ? c.figur.y : (c.y || 0)), oben = zielOben(c);
      for (var s = 0; s <= 1.001; s += 0.25) {
        if (!aufBildschirm(c.x, y0 + (oben - y0) * s, c.z)) continue;
        var d = (bp[0] - k.x) * (bp[0] - k.x) + (bp[1] - k.y) * (bp[1] - k.y);
        if (d < bestD) { bestD = d; best = c; }
      }
    });
    if (best) { zuZielGehen(best); return; }
    var p = bodenPunkt(k.x, k.y, kim.y);
    if (!isFinite(p.x) || !isFinite(p.z)) return;
    var punkte = Z.welt.weg(kim.x, kim.z, p.x, p.z);
    if (!punkte || !punkte.length) return;
    var letzt = punkte[punkte.length - 1];
    Z.spieler.laufZiel = { x: letzt.x, z: letzt.z, punkte: punkte.slice(0, -1), stopp: 0.15 };
    // kleiner Tusche-Kringel als Markierung
    var hy = Z.welt.hoeheBei(letzt.x, letzt.z) + 0.05;
    for (var i = 0; i < 10; i++) {
      var a = i / 10 * Math.PI * 2;
      ENG.partikel.neu({ x: letzt.x + Math.cos(a) * 0.28, y: hy, z: letzt.z + Math.sin(a) * 0.28, vy: 0.15,
        leben: 0.5, groesse: 0.07, farbe: [0.2, 0.17, 0.22], alpha: 0.75 });
    }
  };

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

    // Klicken / Tippen: im Gespräch weiter, sonst hinlaufen (und ansprechen)
    if (I.klick) {
      var klick = I.klick;
      I.klick = null;
      if (GAME.dialog.aktiv) GAME.dialog.weiter();
      else if (!blockiert) Z.klicken(klick);
    }
    if (blockiert) sp.laufZiel = null;
    var lz = sp.laufZiel;
    if (lz && lz.kandidat && lz.kandidat.npc) { lz.x = lz.kandidat.npc.figur.x; lz.z = lz.kandidat.npc.figur.z; }

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
        if (i.art !== "tuer" || wechsel || !GAME.flags.pruefen(i.wenn)) return;
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
    if (Z.gezeigterBeweis) { Z.gezeigterBeweis.zeit -= dt; if (Z.gezeigterBeweis.zeit <= 0) Z.gezeigterBeweis = null; }

    // Automatisch speichern, sobald sich etwas geändert hat und gerade Ruhe ist
    speicherPause -= dt;
    if (GAME.speicher.geaendert && speicherPause <= 0 && !GAME.dialog.aktiv && !wechsel && !GAME.minispiel.laeuft()) Z.speichern();

    // HUD-Hinweis zur aktuellen Aufgabe
    GAME.ui.hinweis(GAME.flags.hat("intro_fertig") ? GAME.quests.hinweis(Z.welt.map.land || null) : "");

    Z.kamera.folgen(kim.x, kim.y, kim.z, sp.vx, sp.vz, dt, GAME.einstellungen.ruhig);
    GAME.dioramaHilfen.schweben(Z.welt, Z.kamera, dt);
    ENG.partikel.update(dt);
  };

  // Beweisstück, das Kim beim Jubeln hochhält (kleine Akte in Landesfarbe)
  var beweisMeshes = {}, beweisModel = MM.m4();
  var BEWEIS_FARBE = { de: "terrakotta", se: "himmelblau", ee: "petrol", lu: "koralle", bxl: "senf" };
  function beweisZeichnen(b, t) {
    if (!beweisMeshes[b.land]) {
      var m = ENG.mesh.neu(), F = GAME.farbe;
      m.add(ENG.mesh.form("box", { groesse: [0.36, 0.26, 0.05], rund: 0.02 }, true), { pos: [0, 0, 0], farbe: F(BEWEIS_FARBE[b.land] || "senf") });
      m.add(ENG.mesh.form("box", { groesse: [0.3, 0.22, 0.02], rund: 0.01 }, true), { pos: [0.01, 0.02, 0.03], farbe: F("creme") });
      m.add(ENG.mesh.form("box", { groesse: [0.18, 0.02, 0.01], rund: 0.004 }, true), { pos: [-0.02, 0.08, 0.045], farbe: F("tusche") });
      m.add(ENG.mesh.form("box", { groesse: [0.22, 0.02, 0.01], rund: 0.004 }, true), { pos: [0, 0.02, 0.045], farbe: F("grau") });
      m.add(ENG.mesh.form("box", { groesse: [0.16, 0.02, 0.01], rund: 0.004 }, true), { pos: [-0.03, -0.04, 0.045], farbe: F("grau") });
      beweisMeshes[b.land] = m.fertig();
    }
    var kim = Z.spieler.figur;
    var h = kim.y + kim.info.kopfHoehe * kim.info.groesse + 0.2 + Math.sin(t * 6) * 0.04;
    MM.m4compose(beweisModel, kim.x, h, kim.z, -0.2, Math.sin(t * 2.5) * 0.4, 0, 1.2, 1.2, 1.2);
    ENG.renderer.mesh(beweisMeshes[b.land], beweisModel, { kontur: 0.0018 });
    if (Math.random() < 0.3) ENG.partikel.neu({ x: kim.x + (Math.random() - 0.5) * 0.6, y: h + (Math.random() - 0.3) * 0.4, z: kim.z + (Math.random() - 0.5) * 0.4,
      vy: 0.5, leben: 0.7, groesse: 0.07, farbe: [1, 0.93, 0.65], alpha: 0.9 });
  }

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
    if (Z.gezeigterBeweis) beweisZeichnen(Z.gezeigterBeweis, t);

    w.schattenZeichnen(k);
    Z.spieler.figur.schatten(hf);
    npcs.forEach(function (n) { n.figur.schatten(hf); });
    Z.figuren.forEach(function (f) { f.schatten(hf); });
    if (Z.fund && Z.fund.aktiv) R.schatten(Z.fund.x, Z.fund.z, 0.25, 0.25, hf);
    ENG.partikel.zeichnen();
    if (GAME.debug && GAME.debug.an) GAME.debug.zeichnen(Z);
    R.ende();
    GAME.dialog.portraitZeichnen(w.stimmung, t);
    GAME.minispiel.portraitZeichnen(w.stimmung, t);

    // ---- Blasen über Köpfen und Objekten ----
    var U = GAME.ui;
    U.blasenBeginn();
    // Ausgänge: schwebendes Schild mit Pfeil und Ziel (z. B. „→ Europaplatz“)
    var PFEIL = { w: "←", o: "→", n: "↑", s: "↓" };
    w.ausgaenge.forEach(function (a, i) {
      if (!GAME.flags.pruefen(a.wenn) || !DATA.maps[a.ziel]) return;
      var mx = (a.x0 + a.x1) / 2, mz = (a.z0 + a.z1) / 2;
      // ein Stück ins Kartenfeld hinein, damit das Schild sichtbar bleibt
      if (a.richtung === "w") mx += 1.2; if (a.richtung === "o") mx -= 1.2;
      if (a.richtung === "n") mz += 1.4; if (a.richtung === "s") mz -= 1.0;
      if (aufBildschirm(mx, w.hoeheBei(mx, mz) + 1.3, mz))
        U.blase("ausgang_" + i, bp[0], bp[1], { text: (PFEIL[a.richtung] || "→") + " " + DATA.maps[a.ziel].name, klasse: "ausgang" });
    });
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
        case "tuer":
          hoehe = (z.y || 0) + (z.hoehe || 1.6);
          text = GAME.flags.pruefen(z.wenn)
            ? (DATA.maps[z.ziel] ? DATA.maps[z.ziel].name : DATA.texte.hineingehen) + " – " + DATA.texte.hineingehen
            : DATA.texte.verschlossen;
          break;
        case "dialog": hoehe = (z.y || 0) + (z.hoehe || 1.4); text = z.text || DATA.texte.ansehen; break;
        case "fund": hoehe = Z.fund.y + 0.45; text = DATA.texte.test.fundUntersuchen; break;
        case "aufzug": hoehe = (z.y || 0) + (z.hoehe || 2.3); text = DATA.texte.aufzug; break;
        default: hoehe = (z.y || 0) + 1.2; text = DATA.texte.ansehen;
      }
      var mitEmote = z.art === "npc" && (z.npc.emote || (z.npc.def.hinweis && GAME.flags.pruefen(z.npc.def.hinweis)));
      if (aufBildschirm(z.x, hoehe + (mitEmote ? 0.55 : 0), z.z)) U.blase("ziel", bp[0], bp[1], { taste: DATA.texte.hudTaste, text: text });
    }
    U.blasenEnde();
  };

  return Z;
})();

/* ---------------- Gemeinsame Hilfen für Titel und Epilog ---------------- */
GAME.dioramaHilfen = (function () {
  "use strict";
  var H = {};
  // Brunnen & Co.: Stellen, an denen Wasser spritzt
  H.spritzerSuchen = function (welt) {
    var l = [];
    for (var oid in welt.objekte) {
      var o = welt.objekte[oid];
      if (o.prefab.spritzer) l.push({ x: o.x, y: o.y + o.prefab.spritzer, z: o.z, t: 0 });
    }
    return l;
  };
  H.spritzen = function (liste, dt) {
    liste.forEach(function (s) {
      s.t -= dt;
      if (s.t > 0) return;
      s.t = 0.06;
      var w = Math.random() * Math.PI * 2, v = 0.5 + Math.random() * 0.5;
      ENG.partikel.neu({ x: s.x, y: s.y, z: s.z, vx: Math.cos(w) * v, vy: 1.6 + Math.random() * 0.6, vz: Math.sin(w) * v,
        leben: 0.9, groesse: 0.07, farbe: [0.62, 0.8, 0.9], alpha: 0.85, schwerkraft: 5 });
    });
  };
  // Welt mit Figuren zeichnen
  H.zeichnen = function (welt, kamera, figuren, t) {
    var R = ENG.renderer;
    kamera.aktualisieren(R.breite / R.hoehe);
    R.beginn(kamera, welt.stimmung, t);
    welt.zeichnen(kamera);
    var hf = function (x, z) { return welt.hoeheBei(x, z); };
    figuren.forEach(function (f) { f.zeichnen(); });
    welt.schattenZeichnen(kamera);
    figuren.forEach(function (f) { f.schatten(hf); });
    ENG.partikel.zeichnen();
    R.ende();
  };
  // Pollen (draußen) bzw. Staub (drinnen) schweben langsam im Licht
  var schwebeZeit = 0;
  H.schweben = function (welt, kamera, dt) {
    var st = welt.stimmung, menge = st.pollen || 0;
    if (menge <= 0 || !ENG.renderer.fx) return;
    schwebeZeit -= dt * menge;
    while (schwebeZeit < 0) {
      schwebeZeit += 0.09;
      var x = kamera.ziel[0] + (Math.random() - 0.5) * 22, z = kamera.ziel[2] + (Math.random() - 0.5) * 15;
      ENG.partikel.neu({ x: x, y: welt.hoeheBei(x, z) + 0.3 + Math.random() * 2.2, z: z,
        vx: (Math.random() - 0.5) * 0.5, vy: 0.04 + Math.random() * 0.12, vz: (Math.random() - 0.5) * 0.5,
        leben: 3.5 + Math.random() * 3, groesse: 0.045 + Math.random() * 0.04,
        farbe: st.pollenFarbe, alpha: 0.55 + Math.random() * 0.3 });
    }
  };
  H.KEIN_SPIELER = { x: -999, z: -999 };
  return H;
})();

/* ---------------- Titelbildschirm: der Europaplatz als drehendes Diorama ---------------- */
GAME.Titelszene = (function () {
  "use strict";
  var MM = ENG.math, H = GAME.dioramaHilfen;
  var T = {};

  T.betreten = function () {
    GAME.ui.hudZeigen(false);
    T.welt = new GAME.Welt("europaplatz");
    T.npcs = [];
    for (var nid in DATA.npcs) {
      var d = DATA.npcs[nid];
      if (d.karte === "europaplatz") T.npcs.push(new GAME.NPC(nid, d, T.welt));
    }
    T.kamera = new ENG.Kamera();
    T.kamera.neigung = 36 * MM.DEG;
    T.kamera.abstandSoll = 23;
    T.kamera.setzen(18, 0, 15);
    T.spritzer = H.spritzerSuchen(T.welt);
    T.zeit = 0;
    ENG.partikel.leeren();
    GAME.ui.titelZeigen();
  };

  T.verlassen = function () { GAME.ui.menueSchliessen(true); };

  T.update = function (dt) {
    T.zeit += dt;
    T.kamera.drehung = GAME.einstellungen.ruhig ? 0.35 : T.zeit * 0.05;
    T.npcs.forEach(function (n) { if (n.sichtbar()) n.update(dt, T.welt, H.KEIN_SPIELER); });
    H.spritzen(T.spritzer, dt);
    H.schweben(T.welt, T.kamera, dt);
    ENG.partikel.update(dt);
  };

  T.zeichnen = function (t) {
    var figuren = T.npcs.filter(function (n) { return n.sichtbar(); }).map(function (n) { return n.figur; });
    H.zeichnen(T.welt, T.kamera, figuren, t);
  };

  return T;
})();

/* ---------------- Epilog: „Anna und Jonas in 10 Jahren“ ---------------- */
GAME.Epilogszene = (function () {
  "use strict";
  var MM = ENG.math, H = GAME.dioramaHilfen;
  var E = {};

  // Textseiten aus den Bausteinen in DATA.epilog zusammensetzen
  function seitenBauen() {
    var ep = DATA.epilog, fin = GAME.zustand.finale || { punkte: 0, massnahmen: [] };
    var seiten = [];
    var stimmung = ep.stimmungen.filter(function (s) { return GAME.flags.pruefen(s.wenn); })[0];
    seiten.push({ titel: ep.titel, text: stimmung ? stimmung.text : "" });
    (fin.massnahmen || []).forEach(function (id) {
      if (ep.massnahmen[id]) seiten.push({ text: ep.massnahmen[id] });
    });
    for (var i = 0; i < ep.punkte.length; i++) {
      if ((fin.punkte || 0) >= ep.punkte[i].ab) { seiten.push({ text: ep.punkte[i].text }); break; }
    }
    ep.schluss.forEach(function (z) { seiten.push({ name: z.name, wer: z.wer, text: z.text }); });
    return seiten;
  }

  E.betreten = function () {
    var ep = DATA.epilog;
    GAME.ui.hudZeigen(false);
    E.welt = new GAME.Welt(ep.karte);
    E.welt.stimmung = GAME.Welt.umgebung(DATA.stimmungen[ep.stimmung] || DATA.stimmungen.hub);
    E.npcs = [];
    for (var id in ep.figuren) E.npcs.push(new GAME.NPC(id, ep.figuren[id], E.welt));
    E.kamera = new ENG.Kamera();
    E.kamera.neigung = (ep.kamera.neigung || 40) * MM.DEG;
    E.kamera.abstandSoll = ep.kamera.abstand || 11;
    E.kamera.setzen(ep.kamera.ziel[0], 0, ep.kamera.ziel[1]);
    E.spritzer = H.spritzerSuchen(E.welt);
    E.zeit = 0;
    E.seiten = seitenBauen();
    E.seite = 0;
    E.fertig = false;
    ENG.partikel.leeren();
    GAME.ui.epilogSeite(E.seiten[0], false);
    // Spielstand: Finale erledigt – „Weiterspielen“ führt danach auf den Europaplatz
    var w = new GAME.Welt("europaplatz"), sp = w.spawn("von_bxl");
    GAME.speicher.speichern({ karte: "europaplatz", x: sp.x, z: sp.z, rot: sp.rot });
  };

  E.verlassen = function () { GAME.ui.epilogSeite(null); };

  function sichtbare() { return E.npcs.filter(function (n) { return n.sichtbar(); }); }

  E.weiter = function () {
    if (E.fertig) return;
    E.seite++;
    if (E.seite >= E.seiten.length) {
      E.fertig = true;
      GAME.ui.epilogSeite(null);
      GAME.ui.reflexionZeigen(true);
      return;
    }
    var s = E.seiten[E.seite];
    GAME.ui.epilogSeite(s, E.seite === E.seiten.length - 1);
    // Im Schlussgespräch spricht die passende Figur
    sichtbare().forEach(function (n) {
      var spricht = !!s.wer && n.def.figur.indexOf(s.wer) === 0;
      n.figur.spricht = spricht;
      n.figur.emotion = spricht ? "froehlich" : "neutral";
      if (spricht) n.figur.huepfen();
    });
  };

  E.update = function (dt) {
    var I = ENG.input;
    E.zeit += dt;
    E.kamera.drehung = GAME.einstellungen.ruhig ? 0 : Math.sin(E.zeit * 0.12) * (DATA.epilog.kamera.schwenk || 0);
    sichtbare().forEach(function (n) { n.update(dt, E.welt, H.KEIN_SPIELER); });
    H.spritzen(E.spritzer, dt);
    H.schweben(E.welt, E.kamera, dt);
    ENG.partikel.update(dt);
    if (!E.fertig && !GAME.ui.blockiert() && E.zeit > 0.6 && (I.gedrueckt("ok") || I.klick)) E.weiter();
    I.klick = null;
    I.verbrauchen("ok"); I.verbrauchen("aktion");
  };

  E.zeichnen = function (t) {
    H.zeichnen(E.welt, E.kamera, sichtbare().map(function (n) { return n.figur; }), t);
  };

  return E;
})();
