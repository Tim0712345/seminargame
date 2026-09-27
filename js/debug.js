/* =====================================================================
   Die Lücke – Debug-Modus (nur mit ?debug=1 in der Adresse)
   ---------------------------------------------------------------------
   * Anzeige: FPS, Draw-Calls, Dreiecke, Karte, Kachel
   * G: Kachel-Raster und Kollisionsformen
   * T: Teleport-Menü zu allen Karten
   * F: Flags setzen / zurücksetzen
   * Konsole beim Start: Prüfung aller Dialoge (next-Referenzen,
     erreichbare Knoten, fehlende Fakten/Notizen), Prüfung aller Karten
     (erreichbare Ausgänge, NPCs und Objekte), ungeprüfte Fakten
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.debug = (function () {
  "use strict";
  var D = { an: false, raster: false };
  var anzeige;

  D.init = function () {
    D.an = /[?&]debug=1\b/.test(window.location.search);
    if (!D.an) return;
    document.body.classList.add("debug");
    anzeige = document.getElementById("debug-anzeige");
    anzeige.classList.remove("versteckt");
    ENG.input.beiTaste = function (c) {
      if (GAME.dialog.aktiv) return;
      if (c === "KeyG") D.raster = !D.raster;
      if (c === "KeyT" && !GAME.ui.blockiert()) D.teleportMenue();
      if (c === "KeyF" && !GAME.ui.blockiert()) D.flagMenue();
    };
    console.log("%cDie Lücke – Debug-Modus: G = Raster, T = Teleport, F = Flags", "color:#c76d41;font-weight:bold");
    D.faktenPruefen();
    D.dialogePruefen();
    setTimeout(D.kartenPruefen, 300);
  };

  D.faktenPruefen = function () {
    var offen = [];
    for (var k in DATA.facts) {
      if (DATA.facts[k].verifiziert !== true) offen.push({ Feld: k, Wert: DATA.facts[k].wert, Quelle: DATA.facts[k].quelle });
    }
    if (offen.length) {
      console.warn("Ungeprüfte Fakten (" + offen.length + ") – im Dialog rot markiert:");
      if (console.table) console.table(offen);
    }
  };

  D.dialogePruefen = function () {
    var e = GAME.dialog.pruefen();
    // Flags, die nicht aus Dialogen kommen, sondern vom Spiel gesetzt werden
    var vomSpiel = /^(beweis_|notiz_|war_in_|massnahme_|duell_punkte_|alle_beweise$|finale_fertig$)/;
    for (var m in (DATA.minispiele || {})) {
      if (DATA.minispiele[m].setFlag) e.gesetzt[DATA.minispiele[m].setFlag] = true;
      if (DATA.minispiele[m].erfolgFlag) e.gesetzt[DATA.minispiele[m].erfolgFlag] = true;
    }
    var nieGesetzt = Object.keys(e.benutzt).filter(function (f) { return !e.gesetzt[f] && !vomSpiel.test(f); });
    for (var q in DATA.quests) DATA.quests[q].schritte.forEach(function (s) {
      String(s.fertigWenn || "").split(/[|&]/).forEach(function (f) {
        f = f.replace("!", "").trim();
        if (f && !e.gesetzt[f] && !vomSpiel.test(f) && nieGesetzt.indexOf(f) < 0) nieGesetzt.push(f);
      });
    });
    if (e.fehler.length) { console.warn("Dialog-Prüfung: " + e.fehler.length + " Problem(e)"); e.fehler.forEach(function (f) { console.warn("  " + f); }); }
    else console.log("Dialog-Prüfung: alle next-Referenzen gültig, alle Knoten erreichbar ✓");
    if (nieGesetzt.length) console.warn("Flags, die abgefragt, aber nirgends gesetzt werden: " + nieGesetzt.join(", "));
  };

  /* Karten prüfen: Kann Kim vom ersten Startpunkt aus alle Ausgänge,
     Startpunkte, NPCs und Objekte erreichen? (Flutfüllung über Kacheln) */
  D.kartenPruefen = function () {
    var ergebnis = [];
    for (var id in DATA.maps) {
      var w;
      try { w = new GAME.Welt(id); } catch (err) { ergebnis.push(id + ": Fehler beim Bauen: " + err.message); continue; }
      var frei = new Uint8Array(w.w * w.h);
      for (var z = 0; z < w.h; z++) for (var x = 0; x < w.w; x++) {
        if (w.koll.istGesperrt(x, z)) continue;
        var p = { x: x + 0.5, z: z + 0.5 };
        w.koll.aufloesen(p, 0.28);
        if (Math.abs(p.x - x - 0.5) < 0.45 && Math.abs(p.z - z - 0.5) < 0.45) frei[x + z * w.w] = 1;
      }
      var spawns = w.map.spawns || {}, namen = Object.keys(spawns);
      if (!namen.length) continue;
      var s0 = spawns[namen[0]], start = Math.floor(s0.x + 0.5) + Math.floor(s0.y + 0.5) * w.w;
      var erreicht = new Uint8Array(w.w * w.h), stapel = [start];
      while (stapel.length) {
        var k = stapel.pop();
        if (erreicht[k] || !frei[k]) continue;
        erreicht[k] = 1;
        var kx = k % w.w, kz = (k - kx) / w.w;
        if (kx > 0) stapel.push(k - 1);
        if (kx < w.w - 1) stapel.push(k + 1);
        if (kz > 0) stapel.push(k - w.w);
        if (kz < w.h - 1) stapel.push(k + w.w);
      }
      var nahe = function (px, pz, r) {
        for (var dz = -r; dz <= r; dz++) for (var dx = -r; dx <= r; dx++) {
          var tx = Math.floor(px) + dx, tz = Math.floor(pz) + dz;
          if (tx >= 0 && tz >= 0 && tx < w.w && tz < w.h && erreicht[tx + tz * w.w]) return true;
        }
        return false;
      };
      namen.forEach(function (n) { if (!nahe(spawns[n].x + 0.5, spawns[n].y + 0.5, 0)) ergebnis.push(id + ": Startpunkt \"" + n + "\" nicht erreichbar"); });
      w.ausgaenge.forEach(function (a) { if (!nahe((a.x0 + a.x1) / 2, (a.z0 + a.z1) / 2, 1)) ergebnis.push(id + ": Ausgang nach \"" + a.ziel + "\" nicht erreichbar"); });
      w.interaktionen.forEach(function (i) { if (i.art && !nahe(i.x, i.z, 1)) ergebnis.push(id + ": Objekt \"" + (i.id || i.dialog) + "\" nicht erreichbar"); });
      for (var nid in DATA.npcs) {
        var d = DATA.npcs[nid];
        if (d.karte === id && !nahe(d.start[0] + 0.5, d.start[1] + 0.5, 1)) ergebnis.push(id + ": NPC \"" + nid + "\" steht außerhalb des erreichbaren Bereichs");
      }
      (w.map.uebergaenge || []).forEach(function (u) {
        if (!DATA.maps[u.ziel]) ergebnis.push(id + ": Ausgang zeigt auf fehlende Karte \"" + u.ziel + "\"");
        else if (!(DATA.maps[u.ziel].spawns || {})[u.spawn]) ergebnis.push(id + ": Startpunkt \"" + u.spawn + "\" fehlt auf Karte \"" + u.ziel + "\"");
      });
      if (w.fehler.length) ergebnis = ergebnis.concat(w.fehler.map(function (f) { return id + ": " + f; }));
    }
    if (ergebnis.length) { console.warn("Karten-Prüfung: " + ergebnis.length + " Problem(e)"); ergebnis.forEach(function (e) { console.warn("  " + e); }); }
    else console.log("Karten-Prüfung: alle Startpunkte, Ausgänge, NPCs und Objekte erreichbar ✓");
    D.kartenErgebnis = ergebnis;
  };

  D.teleportMenue = function () {
    var eintraege = Object.keys(DATA.maps).map(function (id) {
      var sp = Object.keys(DATA.maps[id].spawns || { start: 1 })[0];
      return { text: (DATA.maps[id].name || id) + "  (" + id + ")", aktion: function () {
        GAME.ui.menueSchliessen();
        if (GAME.szenen.aktiv === GAME.Spielszene) GAME.Spielszene.wechseln(id, sp);
        else GAME.szenen.ueberblenden(GAME.Spielszene, { karte: id, spawn: sp });
      } };
    });
    eintraege.push({ text: "Schließen", aktion: function () { GAME.ui.menueSchliessen(); } });
    GAME.ui.menueOeffnen({ titel: "Teleport (Debug)", eintraege: eintraege });
  };

  D.flagMenue = function () {
    var F = GAME.flags, Q = GAME.quests;
    GAME.ui.menueOeffnen({
      titel: "Flags (Debug)",
      eintraege: [
        { text: "Intro überspringen", aktion: function () { F.setzen("intro_fertig"); GAME.ui.menueSchliessen(); } },
        { text: "Deutschland-Viertel erledigen", aktion: function () {
          F.setzen(["intro_fertig", "war_in_de", "de_lea_fertig", "de_tobias_fertig", "de_warteliste"]); Q.beweis("de"); GAME.ui.menueSchliessen(); } },
        { text: "Alle vier Beweisstücke geben", aktion: function () {
          F.setzen("intro_fertig"); ["de", "se", "ee", "lu"].forEach(Q.beweis); GAME.ui.menueSchliessen(); } },
        { text: "Brüssel-Archiv erledigen (5. Beweisstück)", aktion: function () {
          F.setzen(["intro_fertig", "hub_laurent_alle", "war_in_bxl", "bxl_peeters_auftrag", "bxl_fach_a", "bxl_fach_b", "bxl_fach_c"]);
          ["de", "se", "ee", "lu", "bxl"].forEach(Q.beweis);
          ["gpg_eu", "teilzeit_gruende", "kita_luecke", "se_modell", "elternzeit_geteilt", "branchen_muster", "durchschnitt", "befoerderung",
           "fuehrung_lu", "rest_unbereinigt", "rest_erklaert", "rest_bereinigt", "rest_bedeutung"].forEach(Q.notiz);
          GAME.ui.menueSchliessen(); } },
        { text: "Epilog ansehen (Kita, Partnermonate, Transparenz)", aktion: function () {
          F.setzen(["finale_praesentiert", "finale_duell", "finale_fertig", "duell_punkte_hoch", "massnahme_kita", "massnahme_partnermonate", "massnahme_transparenz"]);
          GAME.zustand.finale = { punkte: 6, max: 6, massnahmen: ["kita", "partnermonate", "transparenz"] };
          GAME.ui.menueSchliessen(); GAME.szenen.epilogStarten(); } },
        { text: "Spielstand löschen", aktion: function () { GAME.speicher.loeschen(); GAME.ui.menueSchliessen(); GAME.ui.einblenden("Spielstand gelöscht"); } },
        { text: "Alles zurücksetzen", aktion: function () { F.zuruecksetzen(); GAME.zustand.gesehen = {}; GAME.ui.menueSchliessen(); } },
        { text: function () { return "Gesetzte Flags anzeigen (" + F.alle().length + ")"; },
          aktion: function () { console.log("Flags:", F.alle().join(", ") || "(keine)"); GAME.ui.einblenden(F.alle().length + " Flags – siehe Konsole"); } },
        { text: "Schließen", aktion: function () { GAME.ui.menueSchliessen(); } }
      ]
    });
  };

  D.update = function () {
    if (!D.an || !anzeige) return;
    var R = ENG.renderer, sz = GAME.Spielszene, f = sz.spieler ? sz.spieler.figur : null;
    anzeige.textContent =
      "FPS " + ENG.loop.fps +
      " · Draw-Calls " + R.stats.drawCalls +
      " · Dreiecke " + Math.round(R.stats.dreiecke) +
      " · " + (sz.welt ? sz.welt.id : "") +
      (f ? " · Kachel " + Math.floor(f.x) + "/" + Math.floor(f.z) : "") +
      " · G Raster · T Teleport · F Flags";
  };

  // Raster und Kollisionsformen als Linien
  D.zeichnen = function (Z) {
    if (!D.raster) return;
    var R = ENG.renderer, w = Z.welt, f = Z.spieler.figur;
    var cx = Math.floor(f.x), cz = Math.floor(f.z), rad = 8, x, z;
    function hy(x, z) { return w.hoeheBei(x, z) + 0.04; }
    for (z = cz - rad; z <= cz + rad; z++) {
      for (x = cx - rad; x <= cx + rad; x++) {
        if (x < 0 || z < 0 || x >= w.w || z >= w.h) continue;
        R.linie(x, hy(x, z), z, x + 1, hy(x + 1, z), z, 0.35, 0.35, 0.4);
        R.linie(x, hy(x, z), z, x, hy(x, z + 1), z + 1, 0.35, 0.35, 0.4);
        if (w.koll.istGesperrt(x, z)) {
          R.linie(x + 0.1, hy(x, z), z + 0.1, x + 0.9, hy(x, z), z + 0.9, 0.9, 0.2, 0.2);
          R.linie(x + 0.9, hy(x, z), z + 0.1, x + 0.1, hy(x, z), z + 0.9, 0.9, 0.2, 0.2);
        }
      }
    }
    function kreis(mx, mz, r, cr, cg, cb) {
      var n = 20, y = hy(mx, mz) + 0.02;
      for (var i = 0; i < n; i++) {
        var a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2;
        R.linie(mx + Math.cos(a0) * r, y, mz + Math.sin(a0) * r, mx + Math.cos(a1) * r, y, mz + Math.sin(a1) * r, cr, cg, cb);
      }
    }
    w.koll.formenNahe(f.x, f.z, rad).forEach(function (s) {
      if (s.typ === "kreis") { kreis(s.x, s.z, s.r, 1, 0.6, 0.1); return; }
      var ecken = [[-s.hb, -s.ht], [s.hb, -s.ht], [s.hb, s.ht], [-s.hb, s.ht]].map(function (e) {
        return [s.x + e[0] * s.c + e[1] * s.s, s.z - e[0] * s.s + e[1] * s.c];
      });
      for (var i = 0; i < 4; i++) {
        var a = ecken[i], b = ecken[(i + 1) % 4];
        R.linie(a[0], hy(a[0], a[1]) + 0.02, a[1], b[0], hy(b[0], b[1]) + 0.02, b[1], 1, 0.6, 0.1);
      }
    });
    w.ausgaenge.forEach(function (a) {
      R.linie(a.x0, 0.1, a.z0, a.x1, 0.1, a.z1, 0.2, 0.5, 1);
      R.linie(a.x1, 0.1, a.z0, a.x0, 0.1, a.z1, 0.2, 0.5, 1);
    });
    Z.npcs.forEach(function (n) { kreis(n.figur.x, n.figur.z, n.radius, 0.3, 0.6, 1); });
    Z.figuren.forEach(function (g) { kreis(g.x, g.z, g.info.radius, 0.3, 0.6, 1); });
    kreis(f.x, f.z, Z.spieler.radius, 0.2, 0.9, 0.3);
  };

  return D;
})();
