// =====================================================================
//  js/zeichnen/objekte.js – Bausteine für die Straßenszenen
// ---------------------------------------------------------------------
//  Jeder Baustein ist eine Funktion (o, S, info):
//    o    = Eintrag aus data/stationen.js (x, y, b, h, farbe, schild …)
//    S    = Sammler (ZINE.sammler), in den die Formen kommen
//    info = { st: Stimmung, zeit, kamX, mitte, parallaxe }
//  y ist immer die Unterkante (Boden), nach oben wird y kleiner.
//  Bausteine mit „.animiert = true“ werden jedes Bild neu gebaut.
//  Farben kommen als Materialnamen aus data/stil.js und können pro
//  Objekt mit „farbe“, „dachFarbe“ usw. überschrieben werden.
// =====================================================================

ZINE.objekte = {};

(function () {
  var O = ZINE.objekte;
  var PI = Math.PI;

  function saat(o) { return o.saat !== undefined ? o.saat : Math.round((o.x || o.von || 0) * 7.3 + (o.y || 0)); }

  // Ein Fenster mit Rahmen. an: true = erleuchtet
  function fenster(S, x, y, b, h, an, info, bogen) {
    var tag = !info.st.fensterAn;
    var glas = an ? "fenster_hell" : (tag ? "fenster_tag" : "fenster_dunkel");
    if (bogen) {
      S.bogenFenster(x - 1.5, y - 1.5, b + 3, h + 3, "rahmen");
      S.bogenFenster(x, y, b, h, glas);
    } else {
      S.rechteck(x - 1.5, y - 1.5, b + 3, h + 3, "rahmen");
      S.rechteck(x, y, b, h, glas);
    }
    if (tag) S.linie(x + b * 0.25, y + h * 0.8, x + b * 0.75, y + h * 0.2, 1.6, {}, null);   // Glanz (Papier)
    else S.rechteck(x + b / 2 - 0.6, y, 1.2, h, "rahmen");                                     // Fensterkreuz
  }

  // Schattenseite eines Gebäudes (Sonne kommt von links)
  function schatten(S, x, y, b, h) {
    S.rechteck(x, y, b, h, "schatten", "ueber");
  }

  // ---------------- Himmel ----------------

  O.sonne = function (o, S) {
    S.kreis(o.x, o.y, o.r || 36, o.farbe || "sonne");
  };

  O.wolke = function (o, S) {
    var b = o.b || 140, h = o.h || 16, f = o.farbe || "wolke";
    S.rund(o.x - b / 2, o.y, b, h, h / 2, f);
    S.rund(o.x - b * 0.32, o.y - h * 0.75, b * 0.5, h * 1.1, h / 2, f);
    S.rund(o.x - b * 0.62, o.y + h * 0.55, b * 0.45, h * 0.8, h / 2, f);
  };

  O.sterne = function (o, S, info) {
    var n = info.st.sterne || 0, z = ZINE.zufall(saat(o));
    for (var i = 0; i < n; i++) {
      var x = o.von + z() * (o.bis - o.von), y = (o.oben || 10) + z() * ((o.unten || 180) - (o.oben || 10));
      var r = 0.7 + z() * 1.1;
      S.kreis(x, y, r, {});                              // Papierpunkt
      if (z() < 0.2) { S.linie(x - r * 3, y, x + r * 3, y, 0.7, {}); S.linie(x, y - r * 3, x, y + r * 3, 0.7, {}); }
    }
  };

  O.moewen = function (o, S, info) {
    var t = info.zeit, n = o.anzahl || 3, f = o.farbe || "kante";
    if (ZINE.bewegungReduziert) t = 0;
    for (var i = 0; i < n; i++) {
      var x = o.x + i * 38 + Math.sin(t * 0.25 + i * 1.7) * 30 + ((t * 6 + i * 50) % 160) - 80;
      var y = o.y + Math.sin(t * 0.4 + i * 2.3) * 10 + (i % 2) * 14;
      var schlag = Math.sin(t * 5 + i * 1.3) * 4, sp = 8 + (i % 2) * 2;
      S.linie(x - sp, y - 2 + schlag, x, y + 1, 1.8, f);
      S.linie(x, y + 1, x + sp, y - 2 + schlag, 1.8, f);
    }
  };
  O.moewen.animiert = true;

  // ---------------- Ferne ----------------

  O.huegel = function (o, S) {
    var z = ZINE.zufall(saat(o)), pkt = [o.von, o.y + 120], h = o.h || 30;
    for (var x = o.von; x <= o.bis + 40; x += 40) {
      var y = o.y - h * (0.55 + 0.45 * Math.sin(x * 0.0045 + (o.saat || 0))) - z() * h * 0.25;
      pkt.push(x, y);
    }
    pkt.push(o.bis + 40, o.y + 120);
    S.vieleck(pkt, o.farbe || "huegel");
  };

  O.windrad = function (o, S, info) {
    var h = o.h || 70, x = o.x, y = o.y, f = o.farbe || "metall_hell";
    S.trapez(x, y - h, 2, 4.5, h, f);
    var w = ZINE.bewegungReduziert ? 0.3 : info.zeit * (o.tempo || 0.9) + x;
    for (var i = 0; i < 3; i++) {
      var a = w + i * PI * 2 / 3, l = h * 0.42;
      S.linie(x, y - h, x + Math.cos(a) * l, y - h + Math.sin(a) * l, 2.6, f);
    }
    S.kreis(x, y - h, 2.6, f);
  };
  O.windrad.animiert = true;

  O.kran = function (o, S) {
    var x = o.x, y = o.y, h = o.h || 110, r = o.richtung || 1, f = o.farbe || "metall";
    // Turm als Gitter (die Lücken zeigen den Himmel)
    S.rechteck(x - 5, y - h, 2, h, f);
    S.rechteck(x + 3, y - h, 2, h, f);
    for (var k = y - h + 4, s = 1; k < y - 6; k += 10, s = -s) S.linie(x - 4 * s, k, x + 4 * s, k + 10, 1.3, f);
    // Ausleger
    var la = h * 0.9 * r, ya = y - h + 6;
    S.rechteck(Math.min(x, x + la), ya - 5, Math.abs(la), 1.8, f);
    S.rechteck(Math.min(x, x + la), ya + 0.5, Math.abs(la), 1.8, f);
    for (var a = 0, s2 = 1; a < Math.abs(la) - 6; a += 7, s2 = -s2) S.linie(x + a * r, ya + (s2 > 0 ? -4 : 1.4), x + (a + 7) * r, ya + (s2 > 0 ? 1.4 : -4), 1.1, f);
    S.rechteck(Math.min(x, x - 26 * r), ya - 5, 26, 9, f);                           // Gegengewicht
    S.vieleck([x - 4, y - h, x + 4, y - h, x, y - h - 22], f);                      // Spitze
    S.linie(x, y - h - 22, x + la * 0.95, ya - 3, 1, f);                            // Seil
    S.linie(x + la * 0.7, ya, x + la * 0.7, ya + h * 0.35, 1, f);                   // Haken-Seil
    S.rechteck(x + la * 0.7 - 3, ya + h * 0.35, 6, 4, f);
    S.rechteck(x - 7, ya + 4, 14, 12, o.kabine || "schild_gelb");                   // Kabine
  };

  O.wasser = function (o, S, info) {
    var t = ZINE.bewegungReduziert ? 0 : info.zeit;
    S.rechteck(o.von, o.y, o.bis - o.von, o.h || 60, o.farbe || "wasser");
    // Wellen als Papierstriche
    var z = ZINE.zufall(saat(o));
    for (var reihe = 0; reihe < 6; reihe++) {
      var yy = o.y + 5 + reihe * 8 + reihe * reihe * 0.6, schritt = 36 + reihe * 10;
      var versatz = (t * (4 + reihe * 2)) % schritt;
      for (var x = o.von - schritt + versatz + z() * 10; x < o.bis; x += schritt) {
        var l = 6 + reihe * 2 + z() * 6;
        S.linie(x, yy, x + l, yy, 1 + reihe * 0.25, {});
      }
    }
    // Spiegelung der Sonne (wandert mit der Sonne mit)
    if (o.glanz) {
      var gx = o.glanz.x + (info.kamX - info.mitte) * (info.parallaxe - (o.glanz.parallaxe || 0));
      for (var g = 0; g < 7; g++) {
        var gy = o.y + 3 + g * 6.5, gb = (o.glanz.b || 50) * (1 - g * 0.09) * (0.8 + 0.2 * Math.sin(t * 2 + g));
        S.rund(gx - gb / 2 + Math.sin(t * 1.3 + g * 2) * 3, gy, gb, 2.6, 1.3, "wasser_glanz");
      }
    }
  };
  O.wasser.animiert = true;

  O.faehre = function (o, S, info) {
    var t = ZINE.bewegungReduziert ? 0 : info.zeit;
    var x = o.x, b = o.b || 200, y = o.y + Math.sin(t * 0.8) * 0.8, an = info.st.fensterAn > 0;
    var z = ZINE.zufall(saat(o));
    // Aufbauten
    S.rechteck(x + b * 0.12, y - 34, b * 0.7, 14, "schiff");
    S.rechteck(x + b * 0.2, y - 46, b * 0.5, 13, "schiff");
    S.rechteck(x + b * 0.32, y - 56, b * 0.22, 11, "schiff");
    S.rechteck(x + b * 0.5, y - 72, 10, 18, "schiff_streifen");         // Schornstein
    for (var i = 0; i < 16; i++) {
      var fx = x + b * 0.15 + i * (b * 0.64 / 16);
      S.rechteck(fx, y - 30, 4, 4, an && z() < 0.8 ? "fenster_hell" : "fenster_dunkel");
      if (i < 11) S.rechteck(x + b * 0.23 + i * (b * 0.44 / 11), y - 42, 4, 4, an && z() < 0.6 ? "fenster_hell" : "fenster_dunkel");
    }
    // Rumpf
    S.vieleck([x, y - 20, x + b, y - 20, x + b * 0.94, y, x + b * 0.06, y], "schiff_rumpf");
    S.rechteck(x + b * 0.02, y - 16, b * 0.96, 3, "schiff_streifen");
  };
  O.faehre.animiert = true;

  O.skyline = function (o, S, info) {
    var z = ZINE.zufall(saat(o)), x = o.von, f = o.farbe || "silhouette";
    while (x < o.bis) {
      var b = 18 + z() * 34, h = o.hMin + z() * (o.hMax - o.hMin), y = o.y;
      var art = z();
      if (art < 0.35) S.vieleck([x, y, x, y - h, x + b / 2, y - h - b * 0.5, x + b, y - h, x + b, y], f);
      else S.rechteck(x, y - h, b, h, f);
      // vereinzelte Lichter
      if (info.st.fensterAn > 0) {
        for (var k = 0; k < 4; k++) {
          if (z() < info.st.fensterAn * 0.6) S.rechteck(x + 3 + z() * (b - 7), y - h + 4 + z() * (h - 10), 2.5, 3, "fenster_hell");
        }
      }
      x += b + (z() < 0.3 ? z() * 10 : -1);
    }
  };

  O.turm = function (o, S, info) {
    var x = o.x, y = o.y, b = o.b || 26, h = o.h || 150, f = o.farbe || "backstein";
    S.rechteck(x - b / 2, y - h, b, h, f);
    S.vieleck([x - b / 2 - 2, y - h, x + b / 2 + 2, y - h, x, y - h - (o.spitze || 60)], o.dachFarbe || "dach_kupfer");
    S.kreis(x, y - h + 16, 6, {});
    S.linie(x, y - h + 16, x, y - h + 12, 1.2, "kante"); S.linie(x, y - h + 16, x + 3, y - h + 17, 1.2, "kante");
    fenster(S, x - 4, y - h + 34, 8, 18, false, info, true);
    schatten(S, x + b * 0.2, y - h, b * 0.3, h);
  };

  // ---------------- Häuser ----------------

  // Reihenhaus mit Giebel. dach: "giebel", "stufe" (Treppengiebel), "flach", "spitz"
  O.reihenhaus = function (o, S, info) {
    var x = o.x, y = o.y || 300, b = o.b || 110, h = o.h || 120, z = ZINE.zufall(saat(o));
    var wand = o.farbe || "backstein", dach = o.dachFarbe || "dach_ziegel";
    var art = o.dach || "giebel", gh = b * 0.5;
    if (art === "giebel" || art === "spitz") {
      if (art === "spitz") gh = b * 0.75;
      S.vieleck([x - 3, y - h, x + b / 2, y - h - gh, x + b + 3, y - h], dach);
    } else if (art === "stufe") {
      var stufen = 4, pkt = [x, y - h];
      for (var s = 0; s < stufen; s++) {
        var sx = x + s * b / (2 * stufen + 1), sy = y - h - (s + 1) * gh / stufen;
        pkt.push(sx, sy, sx + b / (2 * stufen + 1), sy);
      }
      var mitteX = x + b / 2, wb = b / (2 * stufen + 1) / 2;
      pkt.push(mitteX - wb, y - h - gh - 6, mitteX + wb, y - h - gh - 6);
      for (s = stufen - 1; s >= 0; s--) {
        var sx2 = x + b - s * b / (2 * stufen + 1), sy2 = y - h - (s + 1) * gh / stufen;
        pkt.push(sx2 - b / (2 * stufen + 1), sy2, sx2, sy2);
      }
      pkt.push(x + b, y - h);
      S.vieleck(pkt, wand);
    } else {
      S.rechteck(x - 3, y - h - 6, b + 6, 6, dach);
    }
    S.rechteck(x, y - h, b, h, wand);
    // Fenster
    var spalten = Math.max(1, Math.floor(b / 30)), stock = o.stockwerke || Math.max(1, Math.floor(h / 40));
    var fb = 12, fh = 18, abstandX = b / spalten;
    for (var st = 0; st < stock; st++) {
      for (var sp = 0; sp < spalten; sp++) {
        var fx = x + abstandX * sp + abstandX / 2 - fb / 2, fy = y - h + 14 + st * (h - 20) / stock;
        if (st === stock - 1 && sp === Math.floor(spalten / 2) && o.tuer !== false) continue;
        fenster(S, fx, fy, fb, fh, z() < info.st.fensterAn, info, o.bogen);
      }
    }
    if (art === "giebel" || art === "stufe" || art === "spitz") fenster(S, x + b / 2 - 5, y - h - gh * 0.55, 10, 12, z() < info.st.fensterAn, info, true);
    // Tür
    if (o.tuer !== false) {
      var tx = x + abstandX * Math.floor(spalten / 2) + abstandX / 2 - 10;
      S.rechteck(tx - 2, y - 46, 24, 46, "rahmen");
      S.rechteck(tx, y - 44, 20, 44, o.tuerFarbe || "schild_gruen");
      S.kreis(tx + 15, y - 22, 1.6, "lampe");
    }
    schatten(S, x + b * 0.82, y - h, b * 0.18, h);
  };

  O.bahnhof = function (o, S, info) {
    var x = o.x, y = o.y || 300, b = o.b || 480, h = o.h || 140, z = ZINE.zufall(saat(o));
    var wand = o.farbe || "backstein";
    // Dach
    S.vieleck([x + 60, y - h, x + 80, y - h - 26, x + b - 20, y - h - 26, x + b, y - h], o.dachFarbe || "dach_kupfer");
    S.rechteck(x + 56, y - h - 4, b - 52, 6, "kante");
    // Halle
    S.rechteck(x + 60, y - h, b - 60, h, wand);
    // Rundbogenfenster
    var n = 6, fb = 30;
    for (var i = 0; i < n; i++) {
      var fx = x + 90 + i * ((b - 120) / n);
      if (i === 2 || i === 3) continue;
      fenster(S, fx, y - h + 30, fb, 62, z() < info.st.fensterAn + 0.25, info, true);
      S.rechteck(fx - 2, y - h + 96, fb + 4, 4, "kante");
    }
    // Eingang (später Tür zum Zug)
    var ex = x + 90 + 2 * ((b - 120) / n) + 8, eb = (b - 120) / n * 2 - 16;
    S.bogenFenster(ex - 6, y - 104, eb + 12, 104, "kante");
    S.bogenFenster(ex, y - 98, eb, 98, info.st.fensterAn ? "fenster_warm" : "fenster_tag");
    S.rechteck(ex + eb / 2 - 1, y - 70, 2, 70, "rahmen");
    if (o.eingang) {
      S.rechteck(ex + 10, y - 88, eb - 20, 14, "schild_gelb");
      S.text(o.eingang, ex + eb / 2, y - 77.5, 9, "kante");
    }
    // Schriftband
    S.rechteck(x + 100, y - h + 6, b - 140, 18, "schild_blau");
    S.text(o.schild || "", x + 80 + (b - 100) / 2, y - h + 20.5, 14, {});
    schatten(S, x + b - 46, y - h, 46, h);
    // Uhrturm
    var tb = 62, th = h + 90, tx = x;
    S.vieleck([tx - 4, y - th, tx + tb / 2, y - th - 52, tx + tb + 4, y - th], o.dachFarbe || "dach_kupfer");
    S.linie(tx + tb / 2, y - th - 52, tx + tb / 2, y - th - 66, 2, "kante");
    S.rechteck(tx, y - th, tb, th, wand);
    S.rechteck(tx - 3, y - th, tb + 6, 6, "kante");
    S.kreis(tx + tb / 2, y - th + 30, 17, "kante");
    S.kreis(tx + tb / 2, y - th + 30, 15, {});
    S.linie(tx + tb / 2, y - th + 30, tx + tb / 2 + 1, y - th + 19, 2.2, "kante");
    S.linie(tx + tb / 2, y - th + 30, tx + tb / 2 + 8, y - th + 33, 2.2, "kante");
    for (var f = 0; f < 3; f++) fenster(S, tx + tb / 2 - 7, y - th + 62 + f * 46, 14, 28, z() < info.st.fensterAn, info, true);
    schatten(S, tx + tb * 0.72, y - th, tb * 0.28, th);
  };

  O.kita = function (o, S, info) {
    var x = o.x, y = o.y || 300, b = o.b || 240, h = o.h || 95;
    var z = ZINE.zufall(saat(o));
    S.rechteck(x - 4, y - h - 8, b + 8, 8, o.dachFarbe || "dach");
    S.rechteck(x, y - h, b, h, o.farbe || "putz_gelb");
    // bunte Wandfelder
    S.rechteck(x + b * 0.62, y - h, b * 0.38, h, "putz_rosa");
    // Fenster mit Papier-Basteleien
    var an = info.st.fensterAn > 0;
    for (var i = 0; i < 3; i++) {
      var fx = x + 16 + i * 46;
      S.rund(fx - 2, y - h + 20, 38, 38, 6, "schild_pink");
      S.rund(fx + 2, y - h + 24, 30, 30, 4, an ? "fenster_warm" : "fenster_tag");
      // ausgeschnittene Sterne und Monde aus Papier
      var sx = fx + 9 + z() * 12, sy = y - h + 33 + z() * 10;
      if (i % 2 === 0) S.vieleck(stern(sx, sy, 6, 2.6), {});
      else { S.kreis(sx, sy, 6, {}); S.kreis(sx + 3, sy - 2, 5, an ? "fenster_warm" : "fenster_tag"); }
    }
    // Rundfenster
    S.kreis(x + b * 0.81, y - h + 34, 15, "schild_blau");
    S.kreis(x + b * 0.81, y - h + 34, 11, an ? "fenster_hell" : "fenster_tag");
    // Tür
    S.rund(x + b * 0.72, y - 60, 40, 60, 10, "schild_blau");
    S.rechteck(x + b * 0.72 + 18.5, y - 60, 3, 60, "kante");
    // Schild
    if (o.schild) {
      S.rund(x + 10, y - h - 28, b * 0.55, 18, 9, "schild_pink");
      S.text(o.schild, x + 10 + b * 0.275, y - h - 15, 11, {});
    }
    schatten(S, x + b * 0.88, y - h, b * 0.12, h);
    // Rutsche davor
    var rx = x + 18;
    S.linie(rx, y, rx + 4, y - 38, 3, "metall");
    S.linie(rx + 12, y, rx + 16, y - 38, 3, "metall");
    for (var l = 0; l < 4; l++) S.linie(rx + 1, y - 8 - l * 9, rx + 14, y - 8 - l * 9, 2, "metall");
    S.vieleck([rx + 16, y - 40, rx + 20, y - 40, rx + 56, y - 3, rx + 50, y - 1], "schild_pink");
  };

  function stern(x, y, r1, r2) {
    var pkt = [];
    for (var i = 0; i < 10; i++) {
      var w = -PI / 2 + i * PI / 5, r = i % 2 ? r2 : r1;
      pkt.push(x + Math.cos(w) * r, y + Math.sin(w) * r);
    }
    return pkt;
  }

  O.markt = function (o, S, info) {
    var x = o.x, y = o.y || 300, b = o.b || 330, h = o.h || 110, an = info.st.fensterAn > 0;
    S.rechteck(x - 4, y - h - 8, b + 8, 8, "kante");
    S.rechteck(x, y - h, b, h, o.farbe || "putz_blau");
    // Leuchtschild
    if (o.schild) {
      S.rund(x + b * 0.25, y - h - 34, b * 0.5, 28, 5, "leuchtschild");
      S.text(o.schild, x + b / 2, y - h - 13, 22, {});
      S.linie(x + b * 0.32, y - h - 8, x + b * 0.32, y - h, 2, "kante");
      S.linie(x + b * 0.68, y - h - 8, x + b * 0.68, y - h, 2, "kante");
    }
    // große Glasfront mit Regalen
    var gx = x + 16, gy = y - h + 18, gb = b - 32, gh = h - 18;
    S.rechteck(gx - 3, gy - 3, gb + 6, gh + 3, "rahmen");
    S.rechteck(gx, gy, gb, gh, an ? "fenster_hell" : "fenster_tag");
    for (var r = 0; r < 4; r++) {
      var rx = gx + 14 + r * (gb / 4);
      S.rechteck(rx, gy + 26, gb / 4 - 28, 58, an ? "fenster_warm" : "fenster_dunkel");
      for (var e = 0; e < 3; e++) S.rechteck(rx, gy + 38 + e * 16, gb / 4 - 28, 2, "rahmen");
    }
    for (var p = 1; p < 6; p++) S.rechteck(gx + p * gb / 6 - 1, gy, 2, gh, "rahmen");
    if (o.zusatz) {
      S.rechteck(gx + gb * 0.6, gy + 6, gb * 0.36, 13, "schild_gelb");
      S.text(o.zusatz, gx + gb * 0.78, gy + 15.5, 7.5, "kante");
    }
    // Lichtschein auf dem Gehweg
    if (an) { S.nachFiguren(); S.rechteck(gx, y, gb, 14, "lichtkegel", "ueber"); S.nachFiguren(false); }
    schatten(S, x + b - 16, y - h, 16, h);
  };

  // ---------------- Straße und Dinge ----------------

  O.boden = function (o, S) {
    var y = o.y || 300, b = o.bis - o.von;
    S.rechteck(o.von, y, b, 18, "gehweg");
    for (var x = o.von; x < o.bis; x += 26) S.rechteck(x, y + 1, 1, 17, { gruen: 0.25 }, "ueber");
    S.rechteck(o.von, y + 18, b, 5, "bordstein");
    S.rechteck(o.von, y + 23, b, 80, "strasse");
    for (x = o.von; x < o.bis; x += 70) S.rechteck(x, y + 44, 34, 3, "markierung");
  };

  O.kaimauer = function (o, S) {
    var y = o.y || 300, b = o.bis - o.von;
    S.rechteck(o.von, y - 10, b, 10, o.farbe || "backstein_dunkel");
    S.rechteck(o.von, y - 12, b, 3, "kante");
    for (var x = o.von + 6; x < o.bis; x += 30) S.rechteck(x, y - 34, 2.5, 24, "metall");
    S.rechteck(o.von, y - 34, b, 2.5, "metall");
    S.rechteck(o.von, y - 23, b, 1.5, "metall");
  };

  O.poller = function (o, S) {
    var x = o.x, y = o.y || 300, h = o.h || 16;
    S.rund(x - 5, y - h, 10, h, 3, o.farbe || "metall");
    S.rechteck(x - 6.5, y - h + 3, 13, 3, o.band || "schild_pink");
  };

  O.laterne = function (o, S, info) {
    var x = o.x, y = o.y || 300, h = o.h || 110, an = info.st.lichter;
    S.rechteck(x - 2, y - h, 4, h, "metall");
    S.rechteck(x - 5, y - 8, 10, 8, "metall");
    S.linie(x, y - h, x + 14, y - h - 6, 3, "metall");
    S.trapez(x + 16, y - h - 8, 8, 16, 7, "metall");
    S.rechteck(x + 9, y - h - 1, 14, 3, an ? "lampe" : "metall_hell");
    if (an) {
      S.nachFiguren();
      S.vieleck([x + 9, y - h + 2, x + 23, y - h + 2, x + 58, y, x - 26, y], "lichtkegel", "ueber");
      S.ellipse(x + 16, y + 4, 46, 6, "lichtkegel", "ueber");
      S.nachFiguren(false);
    }
  };

  O.baum = function (o, S) {
    var x = o.x, y = o.y || 300, h = o.h || 120, r = o.r || 34;
    S.trapez(x, y - h * 0.6, 6, 10, h * 0.6, "stamm");
    var ky = y - h + r * 0.5;
    S.kreis(x - r * 0.5, ky + r * 0.3, r * 0.75, o.farbe || "baumkrone");
    S.kreis(x + r * 0.5, ky + r * 0.25, r * 0.7, o.farbe || "baumkrone");
    S.kreis(x, ky - r * 0.15, r * 0.85, o.farbe || "baumkrone");
    S.kreis(x - r * 0.3, ky - r * 0.3, r * 0.35, "baumkrone_hell");
    S.segment(x + r * 0.15, ky + r * 0.1, r * 0.95, -PI * 0.35, PI * 0.6, "schatten", "ueber");
  };

  O.busch = function (o, S) {
    var x = o.x, y = o.y || 300, r = o.r || 18, f = o.farbe || "gras";
    S.kreis(x - r * 0.7, y - r * 0.5, r * 0.7, f);
    S.kreis(x + r * 0.7, y - r * 0.55, r * 0.75, f);
    S.kreis(x, y - r * 0.9, r * 0.85, f);
    S.rechteck(x - r * 1.4, y - r * 0.5, r * 2.8, r * 0.5, f);
  };

  O.bank = function (o, S) {
    var x = o.x, y = o.y || 300, f = o.farbe || "holz";
    S.rechteck(x - 22, y - 16, 44, 4, f);
    S.rechteck(x - 22, y - 28, 44, 4, f);
    S.rechteck(x - 22, y - 22, 44, 3, f);
    S.rechteck(x - 18, y - 12, 3, 12, "metall");
    S.rechteck(x + 15, y - 12, 3, 12, "metall");
  };

  O.zaun = function (o, S) {
    var y = o.y || 300, h = o.h || 26, f = o.farbe || "metall", farben = o.farben;
    for (var x = o.von, i = 0; x < o.bis; x += o.abstand || 10, i++) {
      var ff = farben ? farben[i % farben.length] : f;
      S.vieleck([x, y, x, y - h + 4, x + 2.5, y - h, x + 5, y - h + 4, x + 5, y], ff);
    }
    S.rechteck(o.von, y - h * 0.7, o.bis - o.von, 2.5, f);
    S.rechteck(o.von, y - h * 0.3, o.bis - o.von, 2.5, f);
  };

  O.fahrraeder = function (o, S) {
    var n = o.anzahl || 3, y = o.y || 300, f = o.farbe || "metall";
    for (var i = 0; i < n; i++) {
      var x = o.x + i * 30, r = 9;
      ring(S, x - 11, y - r, r, 2, f);
      ring(S, x + 11, y - r, r, 2, f);
      S.linie(x - 11, y - r, x - 2, y - r - 12, 2, f);
      S.linie(x - 2, y - r - 12, x + 8, y - r - 12, 2, f);
      S.linie(x + 8, y - r - 12, x + 11, y - r, 2, f);
      S.linie(x - 2, y - r - 12, x, y - r, 2, f);
      S.linie(x, y - r, x + 8, y - r - 12, 2, f);
      S.linie(x + 8, y - r - 12, x + 7, y - r - 18, 2, f);
      S.rechteck(x + 3, y - r - 19, 8, 2, f);
      S.rechteck(x - 5, y - r - 14, 7, 2.5, f);
    }
  };

  // Ring mit Loch (das Loch zeigt, was dahinter ist)
  function ring(S, x, y, r, d, f) {
    var p = new Path2D();
    p.arc(x, y, r, 0, PI * 2, false);
    p.moveTo(x + r - d, y);
    p.arc(x, y, r - d, 0, PI * 2, true);
    S._rand(x - r, y - r); S._rand(x + r, y + r);
    S._neu(p, f);
  }
  ZINE.ring = ring;

  O.haltestelle = function (o, S) {
    var x = o.x, y = o.y || 300;
    S.rechteck(x - 1.5, y - 92, 3, 92, "metall");
    S.kreis(x, y - 96, 11, "schild_gelb");
    S.kreis(x, y - 96, 11.5, "schild_gruen", "ueber");
    S.kreis(x, y - 96, 9.5, "schild_gelb");
    S.text("H", x, y - 91.5, 13, "schild_gruen");
    S.rechteck(x + 2, y - 72, 16, 22, "putz_hell");
    for (var i = 0; i < 4; i++) S.rechteck(x + 4, y - 68 + i * 4.5, 12, 1.5, "kante");
  };

  O.litfass = function (o, S) {
    var x = o.x, y = o.y || 300, h = o.h || 90, b = 34;
    S.rechteck(x - b / 2 - 2, y - 8, b + 4, 8, "kante");
    S.rechteck(x - b / 2, y - h, b, h - 8, "plakat");
    S.segment(x, y - h, b / 2 + 2, PI, PI * 2, "dach");
    S.rechteck(x - b / 2 - 3, y - h - 2, b + 6, 4, "kante");
    if (o.plakat) {
      S.rechteck(x - b / 2, y - h + 10, b, 22, "schild_blau");
      S.text(o.plakat[0], x, y - h + 25, 8, {});
      S.text(o.plakat[1] || "", x, y - h + 44, 5.5, "kante", { fliess: true });
      S.text(o.plakat[2] || "", x, y - h + 52, 5.5, "kante", { fliess: true });
      for (var w = 0; w < 4; w++) S.bogen(x - 6, y - h + 68, 3 + w * 4, -0.7, 0.7, 1.4, "schild_pink");
    }
    // Rundung durch Raster: links hell, rechts Schatten
    S.rechteck(x + b * 0.18, y - h, b * 0.32, h - 8, "schatten", "ueber");
    S.rechteck(x - b * 0.5, y - h, b * 0.12, h - 8, { gelb: 0.0 }, null);
  };

  O.muelleimer = function (o, S) {
    var x = o.x, y = o.y || 300;
    S.rechteck(x - 1.5, y - 30, 3, 30, "metall");
    S.rund(x - 9, y - 34, 18, 20, 4, o.farbe || "schild_gruen");
    S.rechteck(x - 10, y - 34, 20, 3, "kante");
  };

  O.gras = function (o, S) {
    var z = ZINE.zufall(saat(o)), y = o.y || 300, f = o.farbe || "gras";
    for (var x = o.von; x < o.bis; x += 6 + z() * 16) {
      var h = (o.h || 14) * (0.5 + z());
      S.vieleck([x - 3, y + 2, x + z() * 4 - 2, y - h, x + 3, y + 2], f);
      S.vieleck([x, y + 2, x + 5 + z() * 4, y - h * 0.7, x + 5, y + 2], f);
    }
  };

  O.pfosten = function (o, S) {
    var x = o.x, y = o.y || 360, h = o.h || 120;
    S.rechteck(x - 5, y - h, 10, h, o.farbe || "metall");
    if (o.schild) {
      S.rund(x - 30, y - h - 6, 60, 22, 4, o.schildFarbe || "schild_blau");
      S.text(o.schild, x, y - h + 9.5, 10, {});
    }
  };
})();
