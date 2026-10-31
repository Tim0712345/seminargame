// =====================================================================
//  js/zeichnen/figur.js – Figuren aus einfachen Formen
// ---------------------------------------------------------------------
//  Kopf = Kreis, Körper = Trapez, Beine = Rechtecke.
//  Gesicht: zwei Punkte und ein Strich. Bewegung nur durch Wackeln,
//  Stauchen und Neigen (keine Knochen). Aussehen: data/figuren.js
//
//  zustand = { x, y (Boden), richtung (1 = rechts, -1 = links),
//              gehen (0 … 1), phase (Schrittphase), zeit, spricht,
//              saat (für Blinzeln), schaukeln (Kinderwagen) }
// =====================================================================

ZINE.figur = {

  masse: function (def) {
    var H = DATA.stil.figuren.hoehe * (def.groesse || 1);
    var sitzt = def.haltung === "sitzt";
    var ex = def.extras || [];
    var abstand = H * 0.5 + (ex.indexOf("kinderwagen") >= 0 ? H * 0.62 : 0) + (sitzt ? H * 0.15 : 0);
    return { H: H, oben: sitzt ? H * 0.78 : H, breite: H * 0.3 * (def.koerper || 1), abstand: abstand };
  },

  bauen: function (S, def, z) {
    var PI = Math.PI;
    var H = DATA.stil.figuren.hoehe * (def.groesse || 1);
    var kb = def.koerper || 1;
    var dir = z.richtung >= 0 ? 1 : -1;
    var x = z.x, y = z.y;
    var extras = def.extras || [];
    function hat(e) { return extras.indexOf(e) >= 0; }
    var haut = (DATA.hauttoene && DATA.hauttoene[def.haut]) || def.haut || "putz_rosa";
    var haarF = (def.haare && def.haare.farbe) || "kante";
    var oberF = (def.oberteil && def.oberteil.farbe) || "schild_blau";
    var hoseF = (def.hose && def.hose.farbe) || "kante";
    var extraF = def.extraFarbe || "schild_pink";
    var form = (def.oberteil && def.oberteil.form) || "trapez";
    var haarForm = (def.haare && def.haare.form) || "kurz";
    var sitzt = def.haltung === "sitzt";
    var ruhig = ZINE.bewegungReduziert;

    // ---------- Bewegung: Wackeln und Stauchen ----------
    var g = z.gehen || 0, ph = z.phase || 0, t = z.zeit || 0, s0 = (z.saat || 1) * 1.7;
    var bob = sitzt ? 0 : Math.abs(Math.sin(ph)) * 0.035 * H * g;
    var sy = 1 + 0.045 * Math.sin(ph * 2) * g + (ruhig ? 0 : 0.012 * Math.sin(t * 2.1 + s0)) * (1 - g);
    var sx = 1 / Math.sqrt(sy);
    var neigung = dir * (0.07 * g + 0.02 * Math.sin(ph) * g);
    if (def.haltung === "gebeugt") neigung += dir * 0.13;
    if (z.spricht && !ruhig) sy += 0.015 * Math.sin(t * 14);

    var beinH = 0.3 * H, rumpfH = 0.4 * H, kopfR = 0.13 * H;
    var huefteY = y - beinH - bob;

    // Bodenschatten
    S.ellipse(x, y + 1, H * 0.22 * kb + (sitzt ? 10 : 0), 3, "bodenschatten", "ueber");

    // ---------- Rollstuhl (hinterer Teil) ----------
    var rad = 0.21 * H;
    if (sitzt) {
      huefteY = y - rad * 1.55;
      var rx = x - dir * 0.02 * H;
      ZINE.ring(S, rx, y - rad, rad, 2.6, "metall");
      var drehung = (z.weg || 0) / rad;
      for (var sp = 0; sp < 3; sp++) {
        var wa = drehung + sp * PI / 3;
        S.linie(rx - Math.cos(wa) * rad, y - rad - Math.sin(wa) * rad, rx + Math.cos(wa) * rad, y - rad + Math.sin(wa) * rad, 1, "metall");
      }
      S.rechteck(x - dir * 0.16 * H - 1.5, huefteY - 0.36 * H, 3, 0.36 * H + 4, "metall");  // Lehne
      S.linie(x - dir * 0.16 * H, huefteY - 0.36 * H, x - dir * 0.24 * H, huefteY - 0.38 * H, 2.4, "metall"); // Griff
    }

    // ---------- Beine ----------
    var beinB = 0.085 * H * Math.sqrt(kb);
    if (!sitzt) {
      for (var b = -1; b <= 1; b += 2) {
        var schwung = Math.sin(ph) * b * g;
        var bx = x + b * 0.045 * H * kb + schwung * 0.07 * H;
        var heben = Math.max(0, schwung) * 0.035 * H;
        var lang = (y - heben) - huefteY;
        S.rechteck(bx - beinB / 2, huefteY, beinB, lang, hoseF);
        S.rund(bx - beinB / 2 - (dir < 0 ? 3 : 0), y - heben - 4, beinB + 3, 4.5, 2, "kante");   // Schuh
      }
    } else {
      // Sitzend: Oberschenkel nach vorn, Unterschenkel nach unten
      var kx = x + dir * 0.22 * H;
      S.rechteck(Math.min(x, kx) - 2, huefteY - beinB, Math.abs(kx - x) + 4, beinB + 1, hoseF);
      S.rechteck(kx - beinB / 2, huefteY - 1, beinB, y - 8 - huefteY, hoseF);
      S.rund(kx - beinB / 2 - (dir < 0 ? 4 : 0), y - 10, beinB + 4, 4.5, 2, "kante");
      S.rechteck(kx - 6, y - 6, 12, 2.5, "metall");                                          // Fußstütze
      S.kreis(kx + dir * 4, y - 4, 4, "metall");                                              // Vorderrad
    }

    // ---------- Oberkörper (ab hier wird gestaucht und geneigt) ----------
    S.verzerren({ ax: x, ay: huefteY, sx: sx, sy: sy, k: neigung });
    var schulterY = huefteY - rumpfH;
    var bO = 0.27 * H * kb, bU = 0.36 * H * kb, unten = 0;
    if (form === "gerade" || form === "kapuze") { bO = 0.31 * H * kb; bU = 0.33 * H * kb; }
    if (form === "kleid") { bO = 0.26 * H * kb; bU = 0.46 * H * kb; unten = beinH * 0.6; }
    if (form === "mantel") { bO = 0.3 * H * kb; bU = 0.37 * H * kb; unten = beinH * 0.35; }
    if (sitzt) unten = 0;

    var kopfX = x + dir * 0.015 * H, kopfY = schulterY - 0.025 * H - kopfR;
    if (def.haltung === "gebeugt") kopfX += dir * 0.04 * H;

    // Dinge hinter dem Körper
    if (hat("rucksack")) S.rund(x - dir * (bO / 2 + 0.06 * H), schulterY + 3, 0.13 * H, 0.26 * H, 4, extraF);
    if (haarForm === "lang") {
      S.kreis(kopfX - dir * 0.02 * H, kopfY, kopfR * 1.12, haarF);
      S.rechteck(kopfX - dir * kopfR * 0.25 - kopfR * 0.85, kopfY, kopfR * 1.7, kopfR * 1.6, haarF);
    }
    if (haarForm === "locken") S.kreis(kopfX - dir * 0.02 * H, kopfY - kopfR * 0.15, kopfR * 1.42, haarF);
    if (form === "kapuze") S.segment(x - dir * 0.03 * H, schulterY + 1, 0.13 * H, PI, PI * 2, oberF);
    if (haarForm === "kopftuch") S.trapez(kopfX - dir * 0.01 * H, kopfY, kopfR * 1.9, bO * 1.08, schulterY - kopfY + 6, haarF);

    // hinterer Arm
    var armL = 0.33 * H, armD = 0.075 * H;
    var armSchwung = Math.sin(ph) * 0.45 * g;
    var armHinten = -armSchwung * dir;
    var armVorn = armSchwung * dir;
    var greift = hat("kinderwagen") || hat("gehstock") || hat("becher");
    if (greift) armVorn = hat("becher") ? -dir * 1.25 : -dir * 0.75;
    if (hat("gehstock")) armVorn = -dir * 0.45;
    if (sitzt) { armVorn = -dir * 0.5; armHinten = -dir * 0.35; }
    this.glied(S, x - dir * bO * 0.25, schulterY + 3, armL, armD, armHinten, oberF, haut, true);

    // Rumpf
    S.trapez(x, schulterY, bO, bU, rumpfH + unten, oberF);
    S.trapez(x + bO * 0.32, schulterY, bO * 0.3, bU * 0.3, rumpfH + unten, "schatten", "ueber");
    if (form === "kapuze") {
      S.rechteck(x + dir * bO * 0.05 - bO * 0.3, huefteY - rumpfH * 0.42, bO * 0.6, rumpfH * 0.25, ZINE.plus(ZINE.farbe(oberF), { gruen: 0.2 }));
      S.linie(x + dir * 0.02 * H, schulterY + 2, x + dir * 0.03 * H, schulterY + rumpfH * 0.35, 1.2, "kante");
    }
    if (form === "mantel") {
      S.linie(x + dir * 0.03 * H, schulterY + 2, x + dir * 0.04 * H, huefteY + unten, 1.3, "kante");
      for (var k = 0; k < 3; k++) S.kreis(x + dir * 0.065 * H, schulterY + 8 + k * rumpfH * 0.28, 1.3, "kante");
    }
    if (hat("weste")) {
      S.trapez(x, schulterY + 2, bO * 0.92, bU * 0.9, rumpfH - 4, extraF);
      S.rechteck(x - bO * 0.45, schulterY + rumpfH * 0.55, bO * 0.9, 3, {});
    }
    if (hat("schuerze")) {
      S.trapez(x + dir * 0.02 * H, schulterY + rumpfH * 0.25, bO * 0.62, bU * 0.78, rumpfH * 0.75 + beinH * 0.25, extraF);
      S.rechteck(x - bO * 0.5, huefteY - rumpfH * 0.3, bO, 2, extraF);
    }
    if (hat("namensschild")) {
      S.rechteck(x + dir * 0.06 * H - 4, schulterY + rumpfH * 0.3, 8, 5, {});
      S.rechteck(x + dir * 0.06 * H - 2.6, schulterY + rumpfH * 0.3 + 2, 5.2, 1, "kante");
    }
    if (hat("rekorder")) {
      S.linie(x - dir * bO * 0.42, schulterY + 2, x + dir * bO * 0.38, huefteY - 4, 1.6, "kante");
      var rbx = x + dir * bO * 0.42;
      S.rund(rbx - 7, huefteY - 10, 14, 11, 2, "schild_gruen");
      S.kreis(rbx + dir * 3, huefteY - 4.5, 2.2, {});
      S.kreis(rbx + dir * 3, huefteY - 4.5, 1.2, "schild_pink");
      S.rechteck(rbx - dir * 4 - 2, huefteY - 8, 4, 1, {});
      S.rechteck(rbx - dir * 4 - 2, huefteY - 6, 4, 1, {});
      S.linie(rbx - dir * 3, huefteY - 10, rbx - dir * 5, huefteY - 16, 1.4, "kante");      // Antenne
    }
    if (hat("tasche")) {
      S.linie(x + dir * bO * 0.35, schulterY + 2, x - dir * bO * 0.5, huefteY - 2, 1.4, extraF);
      S.rund(x - dir * bO * 0.62 - 7, huefteY - 8, 14, 12, 3, extraF);
    }

    // Hals
    S.rechteck(kopfX - 0.035 * H, schulterY - 0.04 * H, 0.07 * H, 0.05 * H, haut);
    if (hat("schal")) {
      S.rund(kopfX - 0.11 * H, schulterY - 0.035 * H, 0.22 * H, 0.06 * H, 3, extraF);
      S.rechteck(kopfX + dir * 0.03 * H - 2.5, schulterY, 5, 0.17 * H, extraF);
    }

    // ---------- Kopf ----------
    var gesichtX = kopfX, gesichtR = kopfR;
    if (haarForm === "kopftuch") {
      S.kreis(kopfX, kopfY, kopfR * 1.14, haarF);
      gesichtX = kopfX + dir * kopfR * 0.18; gesichtR = kopfR * 0.8;
      S.kreis(gesichtX, kopfY + kopfR * 0.05, gesichtR, haut);
    } else {
      S.kreis(kopfX, kopfY, kopfR, haut);
    }
    this.haare(S, haarForm, kopfX, kopfY, kopfR, dir, haarF);
    if (hat("kopfhoerer")) {
      S.bogen(kopfX, kopfY, kopfR * 1.18, PI * 1.05, PI * 1.95, kopfR * 0.18, "kante");
      S.rund(kopfX - dir * kopfR * 0.62 - kopfR * 0.22, kopfY - kopfR * 0.28, kopfR * 0.44, kopfR * 0.62, kopfR * 0.18, extraF, { rand: 1 });
    }
    if (hat("bart")) {
      var b0 = dir > 0 ? -0.02 * PI : 0.45 * PI, b1 = dir > 0 ? 0.55 * PI : 1.02 * PI;
      S.segment(kopfX + dir * kopfR * 0.08, kopfY + kopfR * 0.12, kopfR * 0.95, b0, b1, haarF);
    }

    // Gesicht: zwei Punkte, ein Strich
    var gf = def.gesicht || "gesicht";
    var augeY = kopfY - gesichtR * 0.05 + (haarForm === "kopftuch" ? kopfR * 0.05 : 0);
    var a1 = gesichtX + dir * gesichtR * 0.12, a2 = gesichtX + dir * gesichtR * 0.6;
    var blinzeln = !ruhig && ((t + s0 * 3) % 4.3) < 0.13;
    if (blinzeln) {
      S.linie(a1 - 1.8, augeY, a1 + 1.8, augeY, 1.2, gf);
      S.linie(a2 - 1.8, augeY, a2 + 1.8, augeY, 1.2, gf);
    } else {
      S.kreis(a1, augeY, gesichtR * 0.14, gf);
      S.kreis(a2, augeY, gesichtR * 0.14, gf);
    }
    var mundY = kopfY + gesichtR * 0.45, mundF = hat("bart") ? {} : gf;
    if (z.spricht && !ruhig && Math.sin(t * 16) > 0) {
      S.ellipse(gesichtX + dir * gesichtR * 0.4, mundY, gesichtR * 0.14, gesichtR * 0.12, mundF);
    } else {
      S.linie(gesichtX + dir * gesichtR * 0.2, mundY, gesichtX + dir * gesichtR * 0.62, mundY - 0.4, gesichtR * 0.11, mundF);
    }

    // vorderer Arm
    var hand = this.glied(S, x + dir * bO * 0.15, schulterY + 3, armL, armD, armVorn, oberF, haut, false);
    S.verzerren(null);

    // ---------- Dinge in der Hand / vor der Figur ----------
    if (hat("becher")) {
      S.rechteck(hand[0] - 3, hand[1] - 9, 6, 8, "putz_hell");
      S.rechteck(hand[0] - 3, hand[1] - 6, 6, 2, extraF);
      if (!ruhig) S.linie(hand[0], hand[1] - 12 - Math.sin(t * 2) * 1.5, hand[0] + 1.5, hand[1] - 18, 0.8, "kante");
    }
    if (hat("gehstock")) S.linie(hand[0], hand[1], hand[0] + dir * 0.1 * H, y, 2.4, extraF);
    if (hat("kinderwagen")) this.kinderwagen(S, x, y, H, dir, hand, z, extraF);
  },

  // Arm (oder anderes Glied): Rechteck mit runder Hand am Ende. winkel 0 = nach unten.
  glied: function (S, x, y, laenge, dicke, winkel, farbe, haut, hinten) {
    var ex = x - Math.sin(winkel) * laenge, ey = y + Math.cos(winkel) * laenge;
    var dx = Math.cos(winkel) * dicke / 2, dy = Math.sin(winkel) * dicke / 2;
    var f = hinten ? ZINE.plus(ZINE.farbe(farbe), { blau: 0.15, gruen: 0.15 }) : farbe;
    S.vieleck([x - dx, y - dy, x + dx, y + dy, ex + dx, ey + dy, ex - dx, ey - dy], f, hinten ? null : { rand: 1.6 });
    S.kreis(ex, ey, dicke * 0.55, haut);
    var v = S.vz, q = v ? S._tp(ex, ey) : [ex, ey];
    return q;
  },

  // Frisuren
  haare: function (S, form, kx, ky, r, dir, f) {
    var PI = Math.PI;
    function kappe(rr, aHinten, aVorn, ox, oy) {
      var a0 = aHinten, a1 = aVorn;
      if (dir < 0) { a0 = PI - aVorn; a1 = PI - aHinten; }
      S.segment(kx + (ox || 0) * dir, ky + (oy || 0), rr, a0, a1, f);
    }
    switch (form) {
      case "glatze":
        kappe(r * 1.02, PI * 0.78, PI * 1.05, 0, 0);
        break;
      case "kurz":
        kappe(r * 1.07, PI * 0.82, PI * 1.97, -r * 0.03, -r * 0.05);
        break;
      case "seitenscheitel":
        kappe(r * 1.07, PI * 0.82, PI * 1.97, -r * 0.03, -r * 0.05);
        S.vieleck([kx - dir * r * 0.2, ky - r * 1.05, kx + dir * r * 1.15, ky - r * 0.55, kx + dir * r * 0.75, ky - r * 0.25, kx + dir * r * 0.1, ky - r * 0.55], f);
        break;
      case "wuschel":
        kappe(r * 1.08, PI * 0.8, PI * 1.98, -r * 0.03, -r * 0.06);
        for (var i = 0; i < 5; i++) {
          var w = PI * (1.05 + i * 0.2);
          S.kreis(kx + Math.cos(w) * r * 0.95 * dir, ky - r * 0.05 + Math.sin(w) * r * 0.95, r * 0.36, f);
        }
        break;
      case "lang":
        kappe(r * 1.1, PI * 0.7, PI * 1.98, -r * 0.03, -r * 0.05);
        break;
      case "dutt":
        kappe(r * 1.06, PI * 0.82, PI * 1.95, -r * 0.03, -r * 0.05);
        S.kreis(kx - dir * r * 0.75, ky - r * 0.85, r * 0.45, f);
        break;
      case "zopf":
        kappe(r * 1.06, PI * 0.82, PI * 1.95, -r * 0.03, -r * 0.05);
        S.ellipse(kx - dir * r * 1.15, ky + r * 0.2, r * 0.3, r * 0.75, f, null, dir * 0.4);
        break;
      case "locken":
        for (var j = 0; j < 7; j++) {
          var w2 = PI * (0.95 + j * 0.17);
          S.kreis(kx + Math.cos(w2) * r * 1.0 * dir - dir * r * 0.05, ky + Math.sin(w2) * r * 1.0, r * 0.42, f);
        }
        break;
      case "muetze":
        kappe(r * 1.1, PI * 0.95, PI * 2.05, 0, -r * 0.15);
        S.rund(kx - r * 1.12, ky - r * 0.35, r * 2.24, r * 0.38, r * 0.15, ZINE.plus(ZINE.farbe(f), { blau: 0.25 }));
        S.kreis(kx - dir * r * 0.1, ky - r * 1.32, r * 0.28, f);
        break;
      case "kopftuch":
        break;
      default:
        kappe(r * 1.07, PI * 0.82, PI * 1.97, 0, -r * 0.05);
    }
  },

  kinderwagen: function (S, x, y, H, dir, hand, z, farbe) {
    var PI = Math.PI;
    var schaukel = ZINE.bewegungReduziert ? 0 : Math.sin((z.zeit || 0) * 2.2) * 3 * (1 - (z.gehen || 0));
    var wx = x + dir * 0.48 * H + schaukel, wy = y - 0.24 * H, r = 0.16 * H;
    ZINE.ring(S, wx - 0.1 * H, y - 5, 5, 1.6, "metall");
    ZINE.ring(S, wx + 0.1 * H, y - 5, 5, 1.6, "metall");
    S.linie(wx - 0.1 * H, y - 5, wx, wy + 2, 1.6, "metall");
    S.linie(wx + 0.1 * H, y - 5, wx, wy + 2, 1.6, "metall");
    S.segment(wx, wy - 2, r, 0, PI, farbe);
    S.rechteck(wx - r, wy - 4, r * 2, 3, "kante");
    // Verdeck
    if (dir > 0) S.segment(wx + r * 0.1, wy - 3, r * 0.9, PI, PI * 1.5, ZINE.plus(ZINE.farbe(farbe), { blau: 0.3 }));
    else S.segment(wx - r * 0.1, wy - 3, r * 0.9, PI * 1.5, PI * 2, ZINE.plus(ZINE.farbe(farbe), { blau: 0.3 }));
    // Griff zur Hand
    S.linie(wx - dir * r * 0.9, wy - 2, hand[0] + dir * 1, hand[1], 1.8, "metall");
  }
};
