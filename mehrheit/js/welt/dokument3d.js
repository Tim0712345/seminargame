/* =====================================================================
   js/welt/dokument3d.js – das Gesetz als echtes 3D-Dokument (Abschnitt 7.8)
   ---------------------------------------------------------------------
   Papierstapel mit Reitern, Büroklammer und Eselsohr. Die Seite zeigt den
   echten Text (Canvas 2D → Textur). Füllfeder streicht alten Text durch,
   neuer Text sinkt wie Tinte ein (nass → trocken). Umblättern biegt das
   Blatt um eine wandernde Achse. Stempel mit unregelmäßigem Abdruck.
   ===================================================================== */
var WELT = window.WELT || {};

WELT.dokument = (function () {
  var D = {};
  var M = MOTOR.m, Geo = MOTOR.geo, GR = M.GRAD;
  var BLATT_B = 0.21, BLATT_T = 0.297;

  /* ---------- Text-Hilfen ---------- */
  function umbrechen(c, text, breite) {
    var woerter = text.split(" "), zeilen = [], z = "";
    woerter.forEach(function (w) { var t = z ? z + " " + w : w; if (c.measureText(t).width > breite && z) { zeilen.push(z); z = w; } else z = t; });
    if (z) zeilen.push(z);
    return zeilen;
  }
  function text(t) { return LOGIK.text ? LOGIK.text.ersetzen(t, true) : t; }

  /* ---------- Seiteninhalt zeichnen ----------
     seite: { art: "artikel" | "begruendung", artikel, auswahl, aenderungen, stempel, anim } */
  D.zeichneSeite = function (lw, seite, anim) {
    var c = lw.getContext("2d"), W = lw.width, H = lw.height, s = W / 1000;
    var S = DATA.stil.oberflaeche, T = DATA.texte.dokument, F = DATA.stil.tinte;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = "#ffffff"; c.fillRect(0, 0, W, H);
    var rand = 92 * s, br = W - 2 * rand, y = 100 * s;
    c.textBaseline = "alphabetic";
    c.fillStyle = "#3b3a37"; c.font = (19 * s) + "px " + S.schriftGesetz;
    c.fillText(T.kopfLinks.toUpperCase(), rand, y);
    c.textAlign = "right"; c.fillText(T.kopfRechts, W - rand, y); c.textAlign = "left";
    c.fillRect(rand, y + 14 * s, br, 1.5 * s);
    var bereich = {};
    if (seite.art === "artikel") {
      y += 92 * s;
      c.fillStyle = F.text; c.font = "bold " + (26 * s) + "px " + S.schriftGesetz; c.textAlign = "center";
      c.fillText(T.art, W / 2, y); y += 46 * s;
      c.font = "italic " + (23 * s) + "px " + S.schriftGesetz;
      umbrechen(c, T.titel, br * 0.86).forEach(function (z) { c.fillText(z, W / 2, y); y += 33 * s; });
      y += 10 * s;
      c.font = (21 * s) + "px " + S.schriftGesetz; c.fillStyle = "#4a4945";
      c.fillText(text(T.berichterstattung), W / 2, y); c.textAlign = "left";
      y += 30 * s; c.fillStyle = F.text; c.fillRect(W / 2 - 60 * s, y, 120 * s, 1.5 * s); y += 78 * s;
      var art = seite.artikel;
      c.font = "bold " + (27 * s) + "px " + S.schriftGesetz; c.fillStyle = F.text;
      umbrechen(c, art.titel, br).forEach(function (z) { c.fillText(z, rand, y); y += 38 * s; });
      y += 18 * s;
      c.font = (25 * s) + "px " + S.schriftGesetz;
      var zh = 38 * s;
      if (art.grundtext) {
        umbrechen(c, text(art.grundtext), br).forEach(function (z) { c.fillText(z, rand, y); y += zh; });
        y += 22 * s;
      }
      art.schrauben.forEach(function (sch, nr) {
        var aktuell = seite.auswahl[sch.id], start = sch.start;
        var optA = sch.optionen.filter(function (o) { return o.id === aktuell; })[0];
        var optS = sch.optionen.filter(function (o) { return o.id === start; })[0];
        var nummer = "(" + (nr + 1) + ")";
        c.fillStyle = F.text; c.fillText(nummer, rand, y);
        var einzug = rand + 52 * s, bz = br - 52 * s;
        var geaendert = aktuell !== start;
        var anim2 = anim && anim.schraube === sch.id ? anim : null;
        // alter Text (durchgestrichen, wenn geändert)
        var alt = geaendert ? (anim2 ? anim2.altText : (optS ? optS.text : "")) : "";
        if (anim2) alt = anim2.altText;
        var zeilenAlt = alt ? umbrechen(c, text(alt), bz) : [];
        var startY = y;
        if (geaendert || anim2) {
          var strich = anim2 ? M.klemme(anim2.strich, 0, 1) : 1;
          var gesamt = 0; zeilenAlt.forEach(function (z) { gesamt += c.measureText(z).width; });
          var bisher = 0;
          zeilenAlt.forEach(function (z) {
            c.fillStyle = "#6a6862"; c.fillText(z, einzug, y);
            var w = c.measureText(z).width;
            var anteil = M.klemme((strich * gesamt - bisher) / w, 0, 1);
            if (anteil > 0) { c.fillStyle = F.gestrichen; c.fillRect(einzug, y - 8 * s, w * anteil, 2.4 * s); }
            bisher += w;
            if (anim2 && anteil > 0 && anteil < 1) { anim2.stiftUV = [(einzug + w * anteil) / W, (y - 8 * s) / H]; }
            y += zh;
          });
        }
        var neuText = optA && !optA.streichen ? optA.text : "";
        if (optA && optA.streichen) neuText = "(gestrichen)";
        var zeilenNeu = neuText ? umbrechen(c, text(neuText), bz) : [];
        var zeichen = anim2 ? anim2.schrift : 1e9, gezeigt = 0;
        var nassOben = y - zh * 0.8;
        zeilenNeu.forEach(function (z) {
          var teil = z;
          if (gezeigt + z.length > zeichen) teil = z.substr(0, Math.max(0, zeichen - gezeigt));
          gezeigt += z.length;
          c.fillStyle = (geaendert || anim2) ? F.neu : F.text;
          if (teil) c.fillText(teil, einzug, y);
          if (anim2 && teil.length < z.length && teil.length > 0) anim2.stiftUV = [(einzug + c.measureText(teil).width) / W, (y - 6 * s) / H];
          if (geaendert && teil) { c.fillRect(einzug, y + 5 * s, c.measureText(teil).width, 1.2 * s); }
          y += zh;
        });
        if (anim2 || geaendert) bereich[sch.id] = { x0: rand / W, y0: startY / H - 0.03, x1: (W - rand) / W, y1: (y) / H, nassOben: nassOben / H };
        // Randmarkierung (Änderungsbalken)
        if (geaendert) { c.fillStyle = F.neu; c.fillRect(rand - 26 * s, startY - 28 * s, 4 * s, y - startY); }
        y += 22 * s;
      });
    } else {
      y += 92 * s;
      c.fillStyle = F.text; c.font = "bold " + (26 * s) + "px " + S.schriftGesetz; c.textAlign = "center";
      c.fillText(seite.titel, W / 2, y); c.textAlign = "left"; y += 70 * s;
      c.font = (25 * s) + "px " + S.schriftGesetz;
      seite.absaetze.forEach(function (a, i) {
        c.fillText("(" + (i + 1) + ")", rand, y);
        umbrechen(c, text(a), br - 52 * s).forEach(function (z) { c.fillText(z, rand + 52 * s, y); y += 38 * s; });
        y += 18 * s;
      });
    }
    // Fußzeile
    c.fillStyle = "#6a6862"; c.font = "italic " + (19 * s) + "px " + S.schriftGesetz;
    c.fillText(T.fuss, rand, H - 70 * s);
    c.textAlign = "right"; c.fillText("– " + (seite.nummer || 1) + " –", W - rand, H - 70 * s); c.textAlign = "left";
    // Stempel
    if (seite.stempel) D.stempelAbdruck(c, seite.stempel, W, H);
    return bereich;
  };

  /* Stempelabdruck mit unregelmäßiger Farbe */
  D.stempelAbdruck = function (c, st, W, H) {
    var s = W / 1000, r = M.zufall(st.saat || 4);
    c.save();
    c.translate(st.x * W, st.y * H);
    c.rotate(st.dreh || -0.08);
    c.globalAlpha = 0.86;
    c.strokeStyle = DATA.stil.tinte.stempel; c.fillStyle = DATA.stil.tinte.stempel;
    c.lineWidth = 7 * s;
    c.font = "bold " + (58 * s) + "px " + DATA.stil.oberflaeche.schriftUI;
    var w = c.measureText(st.text).width + 70 * s, h = 104 * s;
    c.strokeRect(-w / 2, -h / 2, w, h);
    c.lineWidth = 2.5 * s; c.strokeRect(-w / 2 + 11 * s, -h / 2 + 11 * s, w - 22 * s, h - 22 * s);
    c.textAlign = "center"; c.textBaseline = "middle";
    c.fillText(st.text, 0, 3 * s);
    // ungleichmäßige Farbe: weiße Sprenkel
    c.globalCompositeOperation = "destination-out";
    c.globalAlpha = 1;
    for (var i = 0; i < 900; i++) {
      var x = (r() - 0.5) * w, y = (r() - 0.5) * h, rr = (0.6 + r() * 2.4) * s;
      c.globalAlpha = 0.25 + r() * 0.6;
      c.beginPath(); c.arc(x, y, rr, 0, Math.PI * 2); c.fill();
    }
    // weniger Farbe an einer Kante
    var g = c.createLinearGradient(-w / 2, 0, w / 2, 0);
    g.addColorStop(0, "rgba(0,0,0,0.0)"); g.addColorStop(0.75, "rgba(0,0,0,0.0)"); g.addColorStop(1, "rgba(0,0,0,0.45)");
    c.globalAlpha = 1; c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h);
    c.restore();
    c.globalCompositeOperation = "source-over";
  };

  /* ---------- Blatt-Netz (fein unterteilt, biegbar) ---------- */
  function blattNetz(nx, nz) { return Geo.ebene(BLATT_B, BLATT_T, nx, nz); }

  /* Ruheform: leichte Wölbung und Eselsohr */
  function ruheForm(basis, eselsohr) {
    var p = basis.slice();
    for (var v = 0; v < p.length; v += 3) {
      var u = p[v] / BLATT_B + 0.5, w = p[v + 2] / BLATT_T + 0.5;
      p[v + 1] = Math.sin(Math.PI * u) * 0.0012 + Math.sin(Math.PI * w) * 0.0008;
      if (eselsohr) { var e = u + w - 1.84; if (e > 0) p[v + 1] += e * e * 0.9 + e * 0.012; }
    }
    return p;
  }

  /* Umblättern: Biegung um eine wandernde Achse an der linken Kante */
  function blaetterForm(ruhe, f) {
    var p = ruhe.slice();
    for (var v = 0; v < p.length; v += 3) {
      var d = p[v] + BLATT_B / 2;
      var anteil = d / BLATT_B;
      var th = Math.PI * M.klemme(f * 1.35 - anteil * 0.35, 0, 1);
      th = Math.PI * M.weich(th / Math.PI);
      var hub = Math.sin(Math.PI * f) * 0.02 * anteil;
      p[v] = -BLATT_B / 2 + d * Math.cos(th);
      p[v + 1] = ruhe[v + 1] + d * Math.sin(th) * 0.92 + hub + 0.0004;
    }
    return p;
  }

  /* ---------- Papierstapel auf dem Schreibtisch ---------- */
  D.stapel = function (B, e, sz) {
    var basis = M.trs(M.m4(), e.pos, e.dreh || 0);
    var r = M.zufall(17);
    for (var i = 0; i < 14; i++) {
      var m = M.mul(M.m4(), basis, M.trs(M.m4(), [(r() - 0.5) * 0.004, 0.0006 + i * 0.0009, (r() - 0.5) * 0.004], (r() - 0.5) * 1.2));
      B.teil(Geo.box(BLATT_B, 0.0008, BLATT_T, 0.0002, 1), "papier", m, { kein_ao: i > 0 });
    }
    var hoehe = 0.0006 + 14 * 0.0009;
    // Klebe-Reiter an den Artikeln
    var farben = ["#f0c24a", "#7fc4c9", "#e98b7d", "#9dc78a", "#b9a3d6", "#f3a66a", "#8fb2e8"];
    for (i = 0; i < 7; i++) {
      var tm = M.mul(M.m4(), basis, M.trs(M.m4(), [BLATT_B / 2 + 0.006, hoehe - i * 0.0011 - 0.001, -BLATT_T / 2 + 0.04 + i * 0.033]));
      B.teil(Geo.box(0.022, 0.0005, 0.018, 0.0002, 1), WELT.material("lack", { farbe: farben[i], rauheit: 0.55, klarlack: 0, durchscheinen: 0.4 }), tm, { kein_ao: true });
    }
    // Büroklammer oben links
    var kl = [[0, 0, 0.012], [0, 0, -0.03], [0.006, 0, -0.036], [0.012, 0, -0.03], [0.012, 0, 0.02], [0.0035, 0, 0.026], [0.0035, 0, -0.022]];
    var km = M.mul(M.m4(), basis, M.trs(M.m4(), [-BLATT_B / 2 + 0.03, hoehe + 0.0018, -BLATT_T / 2 + 0.018]));
    B.teil(Geo.rohr(kl, 0.0007, 6), "chrom", km, { kein_ao: true });
    B.verdecker.push({ typ: "box", inv: M.invert(M.m4(), M.mul(M.m4(), basis, M.trs(M.m4(), [0, hoehe / 2, 0]))), h: [BLATT_B / 2, hoehe / 2, BLATT_T / 2], m: e.pos, r: 0.2 });

    // Seiten
    var aufl = MOTOR.qualitaet.stufe().seitenAufloesung || 1200;
    var W = Math.min(aufl, MOTOR.gl.maxTextur), H = Math.round(W * 1.414);
    var doc = { basis: basis, hoehe: hoehe, W: W, H: H, seiten: [], blatt: 0, blaettern: null, anim: null, stift: null, stempel: null };
    function seite(daten, y, eselsohr, oben) {
      var lw = MOTOR.texturen.leinwand(W, H);
      var tex = MOTOR.gl.textur({ quelle: lw, mip: true, aniso: 16, drehen: true });
      var g = blattNetz(oben ? 28 : 2, oben ? 36 : 2);
      var ruhe = ruheForm(g.p, eselsohr);
      g.p = ruhe.slice();
      var m = M.mul(M.m4(), basis, M.trs(M.m4(), [0, y, 0]));
      var o = B.objekt(g, "papier", m, { farbTex: tex, dynamisch: true, schatten: true, keinSchattenEmpfang: false });
      o.festeKugel = true; o.kugelWelt = { m: M.punktMal(m, [0, 0, 0]), r: 0.3 };
      var s = { lw: lw, tex: tex, obj: o, ruhe: ruhe, daten: daten, normalenGeo: g };
      doc.seiten.push(s);
      return s;
    }
    var art = DATA.artikel[0];
    var auswahl = {}; art.schrauben.forEach(function (sch) { auswahl[sch.id] = sch.start; });
    var S2 = DATA.texte.dokument.seite2;
    seite({ art: "begruendung", titel: S2.titel, absaetze: S2.absaetze, nummer: 2 }, hoehe + 0.0001, false, false);
    seite({ art: "artikel", artikel: art, auswahl: auswahl, nummer: 1 }, hoehe + 0.0009, true, true);
    doc.seiten.forEach(function (s) { D.seiteNeu(doc, s); });
    sz.dokument = doc;
    return doc;
  };

  D.seiteNeu = function (doc, s, anim) {
    var bereich = D.zeichneSeite(s.lw, s.daten, anim);
    MOTOR.gl.texturNeu(s.tex, s.lw);
    return bereich;
  };

  /* Option wählen: Füllfeder streicht durch, Tinte sinkt ein */
  D.optionSetzen = function (doc, schraubeId, optionId) {
    var s = doc.seiten[1];
    var art = s.daten.artikel, sch = art.schrauben.filter(function (x) { return x.id === schraubeId; })[0];
    if (!sch) { s.daten.auswahl[schraubeId] = optionId; D.seiteNeu(doc, s); return; }  // steht nicht auf dieser Seite
    var alt = s.daten.auswahl[schraubeId];
    if (alt === optionId) return;
    var altOpt = sch.optionen.filter(function (o) { return o.id === alt; })[0];
    s.daten.auswahl[schraubeId] = optionId;
    var neuOpt = sch.optionen.filter(function (o) { return o.id === optionId; })[0];
    var neuText = neuOpt.streichen ? "(gestrichen)" : neuOpt.text;
    doc.anim = { schraube: schraubeId, altText: altOpt.streichen ? "" : altOpt.text, strich: 0, schrift: 0, t: 0, nass: 1,
                 laenge: LOGIK.text ? LOGIK.text.ersetzen(neuText, true).length : neuText.length, stiftUV: null, letzt: -1 };
    if (MOTOR.bewegungReduziert || !DATA.einstellungenAktuell || DATA.einstellungenAktuell.schreibmaschine === "sofort") { doc.anim.strich = 1; doc.anim.schrift = 1e9; doc.anim.t = 9; }
    if (MOTOR.ton) MOTOR.ton.spiele("feder");
  };

  D.umblaettern = function (doc) {
    if (doc.blaettern) return;
    doc.blaettern = { t: 0, von: doc.blatt, nach: 1 - doc.blatt };
    if (MOTOR.ton) MOTOR.ton.spiele("papier");
  };

  /* Anderen Artikel aufschlagen: Blatt anheben, neuen Inhalt zeigen, ablegen */
  D.blaetternWechsel = function (doc) {
    if (MOTOR.bewegungReduziert) { D.seiteNeu(doc, doc.seiten[1]); return; }
    doc.blaettern = { t: 0, von: 0, nach: 0, wechsel: true, neu: false };
    if (MOTOR.ton) MOTOR.ton.spiele("papier");
  };

  D.stempeln = function (doc, text) {
    if (doc.stempel && doc.stempel.t < 1.4) return;
    doc.stempel = { t: 0, text: text, gesetzt: false, x: 0.66, y: 0.84, dreh: -0.1 };
  };

  /* ---------- Füllfeder und Stempel als 3D-Objekte ---------- */
  D.werkzeuge = function (B, doc) {
    var feder = Geo.leer();
    Geo.anhaengen(feder, Geo.drehkoerper([[0, 0], [0.0025, 0.004], [0.0045, 0.012], [0.0055, 0.03], [0.0058, 0.12], [0.005, 0.135], [0, 0.137]], 18, {}), M.trs(M.m4(), [0, 0.012, 0]));
    var spitze = Geo.drehkoerper([[0, 0], [0.0015, 0.004], [0.003, 0.012], [0.0035, 0.013]], 10, {});
    doc.feder = B.objekt(feder, WELT.material("lack", { farbe: "#1d2430", rauheit: 0.2, klarlack: 1 }), M.m4(), { schatten: true });
    doc.federSpitze = B.objekt(spitze, WELT.material("chrom", { farbe: "#d9c08a", rauheit: 0.18 }), M.m4(), { schatten: false });
    doc.federRing = B.objekt(Geo.zylinder(0.0059, 0.006, 18, true, 0.001), "chrom", M.m4(), { schatten: false });
    [doc.feder, doc.federSpitze, doc.federRing].forEach(function (o) { o.sichtbar = false; o.kugelFaktor = 1.2; });
    var griff = Geo.drehkoerper([[0, 0], [0.018, 0], [0.019, 0.006], [0.012, 0.02], [0.011, 0.06], [0.018, 0.085], [0.016, 0.098], [0, 0.1]], 24, {});
    doc.stempelGriff = B.objekt(griff, "eiche_matt", M.m4(), { schatten: true });
    doc.stempelFuss = B.objekt(Geo.box(0.09, 0.016, 0.05, 0.004, 2), "aluminium", M.m4(), { schatten: true });
    doc.stempelGummi = B.objekt(Geo.box(0.086, 0.006, 0.046, 0.002, 1), WELT.material("gummi", { farbe: "#5a201c" }), M.m4(), { schatten: true });
    [doc.stempelGriff, doc.stempelFuss, doc.stempelGummi].forEach(function (o) { o.sichtbar = false; });
  };

  function seitePunkt(doc, uv, seite) {
    // uv der Textur → Weltpunkt auf der sichtbaren Seite
    var x = (uv[0] - 0.5) * BLATT_B, z = (uv[1] - 0.5) * BLATT_T;
    return M.punktMal((seite || doc.seiten[1]).obj.matrix, [x, 0.0015, z]);
  }

  /* ---------- Jedes Bild ---------- */
  D.aktualisieren = function (doc, dt, zeit, sz) {
    var oben = doc.seiten[1];
    // Umblättern
    if (doc.blaettern) {
      var b = doc.blaettern;
      b.t += dt / (MOTOR.bewegungReduziert ? 0.01 : 1.1);
      var f = M.klemme(b.t, 0, 1);
      var wert = b.von === 0 ? f : 1 - f;
      if (b.wechsel) {
        wert = Math.sin(f * Math.PI) * 0.42;
        if (f >= 0.5 && !b.neu) { b.neu = true; D.seiteNeu(doc, oben); }
      }
      var p = blaetterForm(oben.ruhe, wert);
      oben.normalenGeo.p = p;
      Geo.normalenNeu(oben.normalenGeo);
      // Rückseite zeigt nach oben, wenn umgeblättert: Normalen bleiben, Doppelseitigkeit erledigt den Rest
      MOTOR.netzPositionen(oben.obj.netz, p, oben.normalenGeo.n);
      sz.schattenNeu = true;
      if (b.t >= 1) { doc.blatt = b.nach; doc.blaettern = null; if (b.wechsel && !b.neu) D.seiteNeu(doc, oben); }
    }
    // Füllfeder-Animation
    var a = doc.anim;
    var feder = doc.feder;
    if (a) {
      a.t += dt;
      var tempo = (DATA.einstellungenAktuell && DATA.einstellungenAktuell.schreibmaschine === "langsam") ? 0.6 : ((DATA.einstellungenAktuell && DATA.einstellungenAktuell.schreibmaschine === "schnell") ? 1.8 : 1);
      a.strich = a.altText ? M.klemme((a.t - 0.25) / 0.7, 0, 1) : 1;
      var schriftStart = a.altText ? 1.05 : 0.3;
      a.schrift = Math.floor(Math.max(0, a.t - schriftStart) * 48 * tempo);
      var fertig = a.schrift >= a.laenge && a.strich >= 1;
      var bild = Math.floor(a.t * 24);
      if (bild !== a.letzt || fertig) {
        a.letzt = bild;
        var ber = D.seiteNeu(doc, oben, fertig ? null : a);
        var r = ber[a.schraube];
        if (r) { oben.obj.nass = [r.x0, 1 - r.y1, r.x1, 1 - r.nassOben]; }
      }
      oben.obj.nassWert = fertig ? Math.max(0, 1 - (a.t - a.fertigZeit || 0) / 2.2) : 1;
      if (fertig && !a.fertigZeit) a.fertigZeit = a.t;
      // Feder folgt der Schreibstelle
      if (a.stiftUV && !fertig) {
        var ziel = seitePunkt(doc, [a.stiftUV[0], 1 - (1 - a.stiftUV[1])]);
        a.federPos = a.federPos ? M.mix(a.federPos, ziel, Math.min(1, dt * 18)) : ziel;
      }
      if (fertig && a.fertigZeit && a.t - a.fertigZeit > 2.4) { doc.anim = null; oben.obj.nassWert = 0; }
      var hub = fertig ? M.glatt(0, 0.6, a.t - a.fertigZeit) : 0;
      if (a.federPos && feder) {
        var fp = M.plus(a.federPos, [0.03 * hub, 0.12 * hub, 0.06 * hub]);
        var fm = M.mul(M.m4(), M.trs(M.m4(), fp, 30), M.ausQuat(M.m4(), M.quatEuler([48, 0, 0])));
        feder.matrix = fm; doc.federSpitze.matrix = fm; doc.federRing.matrix = M.mul(M.m4(), fm, M.trs(M.m4(), [0, 0.11, 0]));
        [feder, doc.federSpitze, doc.federRing].forEach(function (o) { o.sichtbar = hub < 0.99; });
        sz.schattenNeu = true;
      }
    }
    // Stempel
    var st = doc.stempel;
    if (st) {
      st.t += dt;
      var sichtbareSeite = doc.blatt === 1 ? doc.seiten[0] : oben;
      var ziel2 = seitePunkt(doc, [st.x, st.y], sichtbareSeite);
      var tt = st.t, y, schwung;
      if (tt < 0.55) { var k = M.weich(tt / 0.55); y = M.lerp(0.32, 0.0, k * k); schwung = (1 - k) * 25; }
      else if (tt < 0.75) { y = 0; schwung = 0; }
      else { var k2 = M.weich((tt - 0.75) / 0.6); y = k2 * 0.35; schwung = -k2 * 12; }
      if (tt >= 0.55 && !st.gesetzt) {
        st.gesetzt = true;
        sichtbareSeite.daten.stempel = { text: st.text, x: st.x, y: st.y, dreh: st.dreh, saat: 5 };
        D.seiteNeu(doc, sichtbareSeite);
        if (sz.kamera) sz.kamera.wackeln = 1;
        if (MOTOR.ton) MOTOR.ton.spiele("stempel");
      }
      var sm = M.mul(M.m4(), M.trs(M.m4(), [ziel2[0] + schwung * 0.004, ziel2[1] + y, ziel2[2] - schwung * 0.002], -6 + (st.dreh / GR) * -1), M.ausQuat(M.m4(), M.quatEuler([schwung, 0, schwung * 0.3])));
      doc.stempelGummi.matrix = M.mul(M.m4(), sm, M.trs(M.m4(), [0, 0.003, 0]));
      doc.stempelFuss.matrix = M.mul(M.m4(), sm, M.trs(M.m4(), [0, 0.014, 0]));
      doc.stempelGriff.matrix = M.mul(M.m4(), sm, M.trs(M.m4(), [0, 0.022, 0]));
      var sichtbar = tt < 1.35;
      [doc.stempelGriff, doc.stempelFuss, doc.stempelGummi].forEach(function (o) { o.sichtbar = sichtbar; });
      sz.schattenNeu = true;
      if (!sichtbar) doc.stempel = null;
    }
  };

  /* =====================================================================
     Titelblatt auf dem Rednerpult: Tinte und geprägter Titel
     ===================================================================== */
  D.titelBlatt = function (B, sz, modus) {
    var W = 1024, H = 1448;
    var lw = MOTOR.texturen.leinwand(W, H), hw = MOTOR.texturen.leinwand(512, 724);
    var tex = MOTOR.gl.textur({ quelle: lw, mip: true, aniso: 16, drehen: true });
    // Höhenbild der Prägung: Text klein zeichnen, groß ziehen = weich
    var hc = hw.getContext("2d");
    hc.fillStyle = "#000"; hc.fillRect(0, 0, 512, 724);
    hc.fillStyle = "#fff"; hc.textAlign = "center"; hc.textBaseline = "middle";
    hc.font = "bold 66px " + DATA.stil.oberflaeche.schriftGesetz;
    var titel = DATA.texte.spielTitel;
    hc.save(); hc.translate(256, 250);
    var breite = hc.measureText(titel).width;
    var faktor = Math.min(1, 420 / breite);
    hc.scale(faktor * 1.0, 1.15);
    // weiche Kanten: mehrfach mit Versatz zeichnen
    hc.globalAlpha = 0.12;
    for (var i = 0; i < 16; i++) { var w = i / 16 * Math.PI * 2; hc.fillText(titel, Math.cos(w) * 2.2, Math.sin(w) * 2.2); }
    hc.globalAlpha = 1; hc.fillText(titel, 0, 0);
    hc.restore();
    // Rahmenlinie geprägt
    hc.strokeStyle = "rgba(255,255,255,0.55)"; hc.lineWidth = 3; hc.strokeRect(70, 170, 372, 160);
    var hoeheTex = MOTOR.gl.textur({ quelle: hw, mip: true, drehen: true });
    var g = blattNetz(110, 150);
    var m = M.mul(M.m4(), sz.pultFlaeche, M.trs(M.m4(), [0.01, 0.0004, 0.01], 180 + 2));
    var o = B.objekt(g, "papier", m, { farbTex: tex, hoehe: { tex: hoeheTex, staerke: 0 }, statisch: true, schatten: true });
    o.festeKugel = true; o.kugelWelt = { m: M.punktMal(m, [0, 0, 0]), r: 0.3 };
    var tb = { lw: lw, tex: tex, obj: o, W: W, H: H, tinte: 0, strich: 0, neu: 0, praegung: 0, letzt: "", plenum: modus === "plenum" };
    sz.titelBlatt = tb;
    D.titelZeichnen(tb);
    return tb;
  };

  D.titelZeichnen = function (tb) {
    var schl = [tb.tinte.toFixed(2), tb.strich.toFixed(2), Math.floor(tb.neu * 40), tb.stempel ? tb.stempel.text : ""].join("|");
    if (schl === tb.letzt) return;
    tb.letzt = schl;
    if (tb.plenum) { plenumBlatt(tb); return; }
    var c = tb.lw.getContext("2d"), W = tb.W, H = tb.H, s = W / 1000;
    var T = DATA.texte.titelBlatt, S = DATA.stil.oberflaeche, F = DATA.stil.tinte;
    c.fillStyle = "#ffffff"; c.fillRect(0, 0, W, H);
    c.fillStyle = "#4a4945"; c.font = (22 * s) + "px " + S.schriftGesetz; c.textAlign = "center";
    c.globalAlpha = 0.85; c.fillText(T.kopf.toUpperCase(), W / 2, 150 * s);
    c.fillRect(W / 2 - 150 * s, 168 * s, 300 * s, 1.2 * s);
    c.globalAlpha = 1;
    // Tintenzeile
    var y = 900 * s;
    c.font = "italic " + (54 * s) + "px " + S.schriftGesetz;
    var a = T.vorher + " ", b = T.gestrichen, n = T.neu;
    var wa = c.measureText(a).width, wb = c.measureText(b).width;
    var x0 = W / 2 - (wa + wb) / 2;
    c.textAlign = "left";
    c.globalAlpha = M.klemme(tb.tinte, 0, 1);
    c.fillStyle = F.text; c.fillText(a, x0, y);
    c.fillStyle = tb.strich > 0 ? "#6a6862" : F.text; c.fillText(b, x0 + wa, y);
    c.globalAlpha = 1;
    if (tb.strich > 0) { c.fillStyle = F.gestrichen; c.fillRect(x0 + wa - 4 * s, y - 17 * s, (wb + 8 * s) * M.klemme(tb.strich, 0, 1), 4 * s); }
    if (tb.neu > 0) {
      var anz = Math.floor(n.length * M.klemme(tb.neu, 0, 1));
      c.fillStyle = F.neu; c.font = "italic " + (58 * s) + "px " + S.schriftGesetz;
      var wn = c.measureText(n).width;
      c.fillText(n.substr(0, anz), W / 2 - wn / 2, y + 92 * s);
      // Einfügezeichen
      c.strokeStyle = F.neu; c.lineWidth = 3 * s;
      c.beginPath(); c.moveTo(x0 + wa + wb * 0.5 - 14 * s, y + 18 * s); c.lineTo(x0 + wa + wb * 0.5, y + 4 * s); c.lineTo(x0 + wa + wb * 0.5 + 14 * s, y + 18 * s); c.stroke();
    }
    MOTOR.gl.texturNeu(tb.tex, tb.lw);
    tb.obj.nass = [0.1, 1 - (y + 130 * s) / H, 0.9, 1 - (y - 60 * s) / H];
  };

  /* Blatt am Rednerpult in Kapitel 7: Schlussabstimmung */
  function plenumBlatt(tb) {
    var c = tb.lw.getContext("2d"), W = tb.W, H = tb.H, s = W / 1000, S = DATA.stil.oberflaeche, T = DATA.texte;
    c.fillStyle = "#ffffff"; c.fillRect(0, 0, W, H);
    c.textAlign = "center"; c.fillStyle = "#4a4945"; c.font = (22 * s) + "px " + S.schriftGesetz;
    c.fillText(T.titelBlatt.kopf.toUpperCase(), W / 2, 150 * s);
    c.fillRect(W / 2 - 150 * s, 168 * s, 300 * s, 1.2 * s);
    c.fillStyle = "#1d1c1a"; c.font = "bold " + (60 * s) + "px " + S.schriftGesetz; c.fillText(T.titelBlatt.vorher.toUpperCase(), W / 2, 420 * s);
    c.font = "italic " + (54 * s) + "px " + S.schriftGesetz; c.fillStyle = DATA.stil.tinte.neu; c.fillText(T.titelBlatt.neu, W / 2, 500 * s);
    c.fillStyle = "#3a3936"; c.font = (30 * s) + "px " + S.schriftGesetz;
    c.fillText(T.plenumBlatt || "", W / 2, 640 * s);
    c.fillText(LOGIK.text.ersetzen(DATA.texte.dokument.berichterstattung, true), W / 2, 700 * s);
    c.textAlign = "left";
    if (tb.stempel) D.stempelAbdruck(c, tb.stempel, W, H);
    MOTOR.gl.texturNeu(tb.tex, tb.lw);
  }

  /* Stempel für das Plenum */
  D.stempelWerkzeug = function (B, sz) {
    var griff = Geo.drehkoerper([[0, 0], [0.018, 0], [0.019, 0.006], [0.012, 0.02], [0.011, 0.06], [0.018, 0.085], [0.016, 0.098], [0, 0.1]], 24, {});
    sz.stempelObj = [
      B.objekt(griff, "eiche_matt", M.m4(), { schatten: true }),
      B.objekt(Geo.box(0.09, 0.016, 0.05, 0.004, 2), "aluminium", M.m4(), { schatten: true }),
      B.objekt(Geo.box(0.086, 0.006, 0.046, 0.002, 1), WELT.material("gummi", { farbe: "#5a201c" }), M.m4(), { schatten: true })
    ];
    sz.stempelObj.forEach(function (o) { o.sichtbar = false; });
  };
  D.plenumStempeln = function (sz, text) { sz.stempelAnim = { t: 0, text: text, gesetzt: false }; };
  D.stempelSchritt = function (sz, dt) {
    var st = sz.stempelAnim, tb = sz.titelBlatt; if (!st || !tb) return;
    st.t += dt;
    var ziel = M.punktMal(tb.obj.matrix, [(0.62 - 0.5) * BLATT_B, 0.0015, (0.78 - 0.5) * BLATT_T]);
    var tt = st.t, y, schwung;
    if (tt < 0.55) { var k = M.weich(tt / 0.55); y = M.lerp(0.32, 0.0, k * k); schwung = (1 - k) * 25; }
    else if (tt < 0.75) { y = 0; schwung = 0; }
    else { var k2 = M.weich((tt - 0.75) / 0.6); y = k2 * 0.35; schwung = -k2 * 12; }
    if (tt >= 0.55 && !st.gesetzt) {
      st.gesetzt = true;
      tb.stempel = { text: st.text, x: 0.62, y: 0.78, dreh: -0.12, saat: 8 };
      tb.letzt = ""; D.titelZeichnen(tb);
      if (sz.kamera) sz.kamera.wackeln = 1;
      if (MOTOR.ton) MOTOR.ton.spiele("stempel");
    }
    var sm = M.mul(M.m4(), M.trs(M.m4(), [ziel[0] + schwung * 0.004, ziel[1] + y, ziel[2] - schwung * 0.002], 180 - 8), M.ausQuat(M.m4(), M.quatEuler([schwung, 0, schwung * 0.3])));
    var o = sz.stempelObj;
    o[2].matrix = M.mul(M.m4(), sm, M.trs(M.m4(), [0, 0.003, 0]));
    o[1].matrix = M.mul(M.m4(), sm, M.trs(M.m4(), [0, 0.014, 0]));
    o[0].matrix = M.mul(M.m4(), sm, M.trs(M.m4(), [0, 0.022, 0]));
    var sichtbar = tt < 1.35;
    o.forEach(function (x) { x.sichtbar = sichtbar; x.kugelWelt = null; });
    sz.schattenNeu = true;
    if (!sichtbar) sz.stempelAnim = null;
  };

  return D;
})();
