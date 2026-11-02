/* =====================================================================
   js/welt/szenen.js – Szenen aufbauen und jedes Bild aktualisieren
   ---------------------------------------------------------------------
   Phase 1: Plenarsaal (Titel) und Büro (Stil-Prototyp).
   ===================================================================== */
var WELT = window.WELT || {};

WELT.szenen = (function () {
  var S = {};
  var M = MOTOR.m, GR = M.GRAD;
  var MUSTER = { streifen: 0, punkte: 1, karo: 2, wellen: 3, dreiecke: 4, voll: 5, rauten: 6 };

  /* Lichtstimmung aus data/stil.js in Rechenwerte umsetzen */
  S.stimmung = function (name) {
    var d = DATA.stil.stimmungen[name];
    var hs = d.himmel.staerke || 1;
    var sf = M.kelvin(d.sonne.kelvin);
    return {
      name: name, daten: d,
      sonneR: M.norm(d.sonne.richtung), sonneF: M.mal(sf, d.sonne.staerke), winkel: d.sonne.winkel, kegel: d.sonne.kegel || null,
      himmelOben: M.mal(M.farbe(d.himmel.oben), hs), himmelHorizont: M.mal(M.farbe(d.himmel.horizont), hs), himmelUnten: M.mal(M.farbe(d.himmel.unten), hs),
      himmelStaerke: 1, sonnenglanz: d.himmel.sonnenglanz || 1,
      umgebung: d.umgebung, nebelDichte: d.nebel.dichte, nebelFarbe: M.farbe(d.nebel.farbe), nebelStreuung: d.nebel.streuung,
      nebelStrahlen: d.nebel.strahlen, nebelReichweite: d.nebel.reichweite || 20, nebelDunst: d.nebel.dunst === undefined ? 1 : d.nebel.dunst,
      belichtung: d.belichtung, farbe: d.farbe, bloom: d.bloom, vignette: d.vignette, korn: d.korn
    };
  };

  function figurenBauen(B, liste, sz) {
    (liste || []).forEach(function (f) {
      var def = DATA.figuren.personen[f.person];
      if (def) sz.figuren[f.person] = WELT.figuren.bauen(B, def, f, sz);
    });
  }

  S.bauen = function (name, kamera, extra) {
    var d = DATA.szenen[name];
    var sz = { name: name, daten: d, objekte: [], lichter: [], sonne: true, dampfQuellen: [], teilchen: [], figuren: {}, kamera: kamera, zeit: 0 };
    sz.stimmung = S.stimmung((extra && extra.stimmung) || d.stimmung);
    var B = new WELT.Bauer({ aoReichweite: (name === "plenarsaal" || name === "plenum") ? 0.9 : (name === "gebaeude" ? 0.5 : 0.3) });
    var W = WELT.bausteine;
    if (name === "buero") {
      W.bueroRaum(B, d, sz);
      d.moebel.forEach(function (e) {
        if (e.baustein === "papierstapel") WELT.dokument.stapel(B, e, sz);
        else if (W[e.baustein]) W[e.baustein](B, e, sz);
      });
      WELT.dokument.werkzeuge(B, sz.dokument);
      figurenBauen(B, (extra && extra.figuren) || d.figuren, sz);
      sz.schattenBox = { mitte: [0, 1.45, -0.1], groesse: [5.0, 3.1, 5.2] };
      sz.spiegelEbene = 0.75; sz.sondePos = [0.1, 1.3, 0.2]; sz.ao = { radius: 0.2, staerke: 1.25 };
      sz.staubBox = { mitte: [-0.4, 1.45, -1.2], groesse: [3.6, 2.6, 2.4], teilchenGroesse: 0.0026, helligkeit: 0.7 }; sz.staubAnzahl = 700;
    } else if (name === "plenarsaal" || name === "plenum") {
      var dp = DATA.szenen.plenarsaal;
      W.plenarsaal(B, dp, sz);
      WELT.dokument.titelBlatt(B, sz, name === "plenum" ? "plenum" : "titel");
      sz.schattenBox = { mitte: [0, 6.0, 2.6], groesse: [32.5, 13, 26] };
      sz.spiegelEbene = 0.0; sz.sondePos = [0, 3.2, 3.0]; sz.ao = { radius: 0.6, staerke: 1.2 };
      sz.staubBox = { mitte: [2.2, 5.5, -3.0], groesse: [13, 11, 10], teilchenGroesse: 0.011, helligkeit: 0.5 }; sz.staubAnzahl = 2600;
      if (name === "plenarsaal") {
        sz.titel = { zeit: 0, flacker: -1, fertig: false };
        var fp = DATA.kameras.fahrten.titel.flackerPunkt, best = 0, bd = 1e9;
        sz.sitze.forEach(function (st, i) { var dd = M.abstand(st.lampenPos, fp); if (dd < bd) { bd = dd; best = i; } });
        sz.titel.flacker = best;
      } else {
        W.plenumBelebt(B, d, sz);
        figurenBauen(B, d.figuren, sz);
        WELT.dokument.stempelWerkzeug(B, sz);
        sz.plenum = { lampen: sz.sitze.map(function () { return { licht: 0.25, ziel: 0.25, farbe: [1, 0.86, 0.66], form: 1, zielForm: 1, verz: 0 }; }), zeit: 0 };
      }
    } else if (name === "ausschusssaal") {
      W.ausschusssaal(B, d, sz);
      figurenBauen(B, (extra && extra.figuren) || (extra && extra.ohneGaeste ? [] : d.gaeste), sz);
      (d.lichter || []).forEach(function (L) { B.licht({ pos: L.pos, kelvin: L.kelvin, staerke: L.staerke, reichweite: L.reichweite, richtung: M.norm(L.richtung), kegelAussen: L.kegelAussen, kegelInnen: L.kegelInnen }); });
      sz.schattenBox = { mitte: [0, 2.3, 0.2], groesse: [16.6, 4.8, 13.2] };
      sz.spiegelEbene = 0.76; sz.sondePos = [0, 1.8, 1.0]; sz.ao = { radius: 0.4, staerke: 1.2 };
      sz.ausschuss = { lampen: sz.ausschussSitze.map(function () { return { licht: 0.1, ziel: 0.1, farbe: [1, 0.9, 0.75], verz: 0 }; }), zeit: 0 };
    } else if (name === "gebaeude") {
      W.gebaeude(B, d, sz);
      // Schattenberichterstatter*innen in ihren Büros
      d.raeume.forEach(function (r) {
        if (r.art !== "buero" || r.fraktion === "BRUECKE") return;
        var f = DATA.fraktionen.filter(function (x) { return x.id === r.fraktion; })[0];
        var rp = sz.raumPos[r.id];
        if (f && f.person && DATA.figuren.personen[f.person]) sz.figuren[f.person] = WELT.figuren.bauen(B, DATA.figuren.personen[f.person], { pos: [rp.x + 0.9, rp.y, -1.35], dreh: -15, haltung: "stehen" }, sz);
      });
      var rp0 = sz.raumPos.eigenes;
      sz.figuren.sam = WELT.figuren.bauen(B, DATA.figuren.personen.sam, { pos: [rp0.x + 1.6, rp0.y, 1.6], dreh: -90, haltung: "stehen" }, sz);
      // Besucher*innen gehen durch die Flure (grobe Menschen-Figuren)
      var farbenBes = ["#3d4452", "#7a3f3a", "#2e4a44", "#8c8574", "#4b3f55"];
      var hautBes = [1, 4, 2, 6, 3], haarBes = ["#2a201b", "#6e6862", "#161211", "#8a6a4a", "#3b2c24"];
      var netzeBes = {};
      sz.besucher = [];
      for (var i = 0; i < (d.besucher || 4); i++) {
        var v = i % 3, objs = [];
        [["koerper", "stoff", { farbe: farbenBes[i % farbenBes.length], strukturSkala: 26 }], ["haut", "haut", { farbe: DATA.figuren.hauttoene[hautBes[i % 5]] }], ["haar", "haar", { farbe: haarBes[i % 5] }]].forEach(function (t) {
          var schl = t[0] + v;
          if (!netzeBes[schl]) netzeBes[schl] = MOTOR.netz(WELT.figuren.modellFigur(false, t[0], v));
          var o = B.objekt(null, WELT.material(t[1], t[2]), M.m4(), { netz: netzeBes[schl] });
          o.festeKugel = true; o.kugelWelt = { m: [0, 5, 0], r: 16 };
          objs.push(o);
        });
        sz.besucher.push({ objekte: objs, etage: i % 3, x: -10 + i * 4.3, z: 1.2 + (i % 2) * 1.4, richtung: i % 2 ? 1 : -1, tempo: 0.6 + (i % 3) * 0.15 });
      }
      sz.schattenBox = { mitte: [0, 5.2, 0], groesse: [26, 11, 10] };
      sz.spiegelEbene = null; sz.sondePos = [0, 4.0, 2.0]; sz.ao = { radius: 0.5, staerke: 1.2 };  // kein Spiegel: spart einen ganzen Durchgang
      sz.staubBox = { mitte: [0, 4.6, 0], groesse: [24, 9, 8], teilchenGroesse: 0.006, helligkeit: 0.5 }; sz.staubAnzahl = 1200;
    } else if (name === "trilog") {
      W.trilog(B, d, sz);
      figurenBauen(B, d.figuren, sz);
      sz.schattenBox = { mitte: [0, 1.4, 0], groesse: [10.4, 3.4, 7.8] };
      sz.spiegelEbene = 0.765; sz.sondePos = [0, 1.5, 0.6]; sz.ao = { radius: 0.25, staerke: 1.3 };
      sz.staubBox = { mitte: [0, 1.5, 0], groesse: [3.0, 1.6, 2.0], teilchenGroesse: 0.003, helligkeit: 0.6 }; sz.staubAnzahl = 400;
      sz.trilogZeit = 0;
    } else if (name === "epilog") {
      W.epilog(B, d, sz, extra);
      sz.schattenBox = { mitte: [0, 0.9, 0], groesse: [4, 2, 3] };
      sz.spiegelEbene = 0.75; sz.sondePos = [0, 1.2, 0.8]; sz.ao = { radius: 0.15, staerke: 1.2 };
      sz.staubBox = { mitte: [0, 1.2, 0], groesse: [3, 1.2, 2], teilchenGroesse: 0.003, helligkeit: 0.8 }; sz.staubAnzahl = 400;
    }
    (d.lichter && name !== "ausschusssaal" ? d.lichter : []).forEach(function (L) { B.licht({ pos: L.pos, kelvin: L.kelvin, farbe: L.farbe, staerke: L.staerke, reichweite: L.reichweite }); });
    // Gebäudemodell: ein zusätzliches Raumlicht, das beim Besuch eines Büros dort angeht
    if (name === "gebaeude") sz.raumLicht = B.licht({ pos: [0, -50, 0], kelvin: 3500, staerke: 0, reichweite: 5 });
    sz.objekte = B.fertig();
    sz.lichter = B.lichter;
    sz.lichter.forEach(function (L) { L.aktuell = L.staerke; });
    sz.lut = MOTOR.texturen.farbtabelle(sz.stimmung.farbe);
    sz.schattenNeu = true;
    var stufe = MOTOR.qualitaet.stufe();
    if (sz.staubBox && MOTOR.gl.webgl2) { sz.staub = MOTOR.teilchen.staub(sz.staubBox, sz.staubAnzahl, 7); sz.teilchen.push(sz.staub); }
    sz.dampfQuellen.forEach(function (q, i) { sz.teilchen.push(MOTOR.teilchen.dampf(q, 36, 11 + i)); });
    if (sz.glasmodell) S.halbrundStart(sz);
    if (sz.fenster) WELT.bausteine.fensterZeichnen(sz.fenster, 0, 0);
    return sz;
  };

  /* Lichtstimmung wechseln (z. B. Kapitel 1 → Kapitel 3) */
  S.stimmungWechseln = function (sz, name) {
    var gl = MOTOR.gl.gl;
    sz.stimmung = S.stimmung(name);
    if (sz.himmelWuerfel) { gl.deleteTexture(sz.himmelWuerfel.tex); sz.himmelWuerfel = null; }
    if (sz.umgebung) { gl.deleteTexture(sz.umgebung.tex); sz.umgebung = null; }
    if (sz.lut) gl.deleteTexture(sz.lut);
    sz.lut = MOTOR.texturen.farbtabelle(sz.stimmung.farbe);
    sz.schattenMat = null; sz.schattenNeu = true;
    // Schreibtischlampe: morgens an, später aus
    var an = name === "buero_morgen";
    sz.lichter.forEach(function (L) { if (L.lampe) L.aktuell = an ? L.staerke : 0; });
    sz.objekte.forEach(function (o) {
      if (!o.lampe) return;
      if (!o._em) o._em = o.mat.emission.slice();
      o.emission = an ? o._em : [o._em[0] * 0.02, o._em[1] * 0.02, o._em[2] * 0.02];
    });
    if (MOTOR.post) MOTOR.post.verlaufLoeschen();
  };

  /* ---------- Glasmodell des Halbrunds ---------- */
  S.halbrundStart = function (sz) {
    var erg = LOGIK.mehrheit.ausschuss(LOGIK.entwurf());
    S.halbrundSetzen(sz, erg, true);
  };

  S.halbrundSetzen = function (sz, erg, sofort) {
    var g = sz.glasmodell;
    var fr = DATA.fraktionen.slice().sort(function (a, b) { return a.sitzordnung - b.sitzordnung; });
    var idx = 0, ziele = [];
    fr.forEach(function (f) {
      var e = erg.fraktionen[f.id];
      var farbe = M.farbe(f.farbe);
      for (var k = 0; k < f.sitzeAusschuss; k++) {
        var stimme = k < e.ja ? "ja" : (k < e.ja + e.enthaltung ? "enthaltung" : "nein");
        ziele.push({ stimme: stimme, farbe: farbe, muster: MUSTER[f.muster] !== undefined ? MUSTER[f.muster] : 5 });
      }
    });
    g.ziele = ziele;
    g.erg = erg;
    g.wechselZeit = 0;
    ziele.forEach(function (z, i) {
      var a = g.anzeige[i];
      a.verzoegerung = sofort ? 0 : i * 0.022;
      a.zielLicht = z.stimme === "ja" ? 1 : (z.stimme === "enthaltung" ? 0.42 : 0.08);
      a.zielKipp = z.stimme === "nein" ? -24 * GR : 0;
      a.zielHalb = z.stimme === "enthaltung" ? 1 : 0;
      a.farbe = z.farbe; a.muster = z.muster;
      if (sofort) { a.licht = a.zielLicht; a.kipp = a.zielKipp; a.halb = a.zielHalb; }
    });
    g.jaZiel = erg.ja;
    if (sofort) g.jaAnzeige = erg.ja;
    g.dirty = true;
  };

  function halbrundAktualisieren(sz, dt) {
    var g = sz.glasmodell; if (!g || !g.ziele) return;
    g.wechselZeit += dt;
    var aktiv = false, n = g.plaetze.length;
    var hd = g.huelle.netz.instanzDaten, kd = g.kern.netz.instanzDaten, sd = g.sockel.netz.instanzDaten, ld = g.strich.netz.instanzDaten;
    for (var i = 0; i < n; i++) {
      var a = g.anzeige[i], p = g.plaetze[i];
      if (g.wechselZeit > a.verzoegerung) {
        var k = Math.min(1, dt * 6);
        var dl = a.zielLicht - a.licht, dk = a.zielKipp - a.kipp, dh = a.zielHalb - a.halb;
        if (Math.abs(dl) + Math.abs(dk) + Math.abs(dh) > 0.002) aktiv = true;
        a.licht += dl * k; a.kipp += dk * k; a.halb += dh * k;
      } else aktiv = true;
      var c = Math.cos(p.w), s = Math.sin(p.w), dreh = Math.atan2(c, s);
      var x = c * p.r, z = s * p.r, y = p.y + g.wuerfel / 2 + 0.0008;
      var o = i * 12;
      hd.set([x, y, z, dreh, 1, 1, 1, 0, 1, 1, 1, a.kipp], o);
      var hoehe = 1 - a.halb * 0.5;
      kd.set([x, y - (1 - hoehe) * g.wuerfel * 0.3, z, dreh, a.farbe[0], a.farbe[1], a.farbe[2], a.licht * 7.0, 1, hoehe, 1, a.kipp], o);
      sd.set([x, p.y + 0.0008, z, dreh, a.farbe[0], a.farbe[1], a.farbe[2], 0, 1, 1, 1, a.muster], o);
    }
    // Lichtlinie: füllt sich mit den Ja-Stimmen, Marke bei der Mehrheit
    g.jaAnzeige = g.jaAnzeige === undefined ? g.jaZiel : g.jaAnzeige + (g.jaZiel - g.jaAnzeige) * Math.min(1, dt * 3);
    var mehrheit = Math.floor(n / 2) + 1;
    var erreicht = g.jaAnzeige >= mehrheit - 0.5;
    for (i = 0; i < n; i++) {
      var w = Math.PI + 0.12 + (Math.PI - 0.24) * (i + 0.5) / n;
      var an = i < g.jaAnzeige - 0.5 ? 1 : 0.02;
      var f = erreicht ? [1.0, 0.85, 0.62] : [0.85, 0.9, 1.0];
      ld.set([Math.cos(w) * 0.047, 0.0125, Math.sin(w) * 0.047, Math.atan2(Math.cos(w), Math.sin(w)), f[0], f[1], f[2], an * 3.2, 1, 1, 1, 0], i * 12);
    }
    var wm = Math.PI + 0.12 + (Math.PI - 0.24) * (mehrheit - 0.5) / n;
    ld.set([Math.cos(wm) * 0.041, 0.0125, Math.sin(wm) * 0.041, Math.atan2(Math.cos(wm), Math.sin(wm)), 1, 1, 1, erreicht ? 2.5 : 1.2, 0.5, 1.4, 3.2, 0], n * 12);
    MOTOR.netzInstanzen(g.huelle.netz, n); MOTOR.netzInstanzen(g.kern.netz, n); MOTOR.netzInstanzen(g.sockel.netz, n); MOTOR.netzInstanzen(g.strich.netz, n + 1);
    if (aktiv || g.dirty) { lichtfleck(sz); sz.schattenNeu = true; }
    g.dirty = false;
  }

  /* Farbiges Licht des Glasmodells auf Papier und Tisch (Kaustik genähert) */
  function lichtfleck(sz) {
    var g = sz.glasmodell, lw = g.leinwand, c = lw.getContext("2d"), fl = sz.fleck;
    c.globalCompositeOperation = "source-over";
    c.fillStyle = "#000"; c.fillRect(0, 0, lw.width, lw.height);
    c.globalCompositeOperation = "lighter";
    for (var i = 0; i < g.plaetze.length; i++) {
      var a = g.anzeige[i], p = g.plaetze[i];
      if (a.licht < 0.05) continue;
      var wp = M.punktMal(g.basis, [Math.cos(p.w) * p.r, 0, Math.sin(p.w) * p.r]);
      var u = ((wp[0] - fl.mitte[0]) / fl.groesse[0] + 0.5) * lw.width, v = ((wp[2] - fl.mitte[1]) / fl.groesse[1] + 0.5) * lw.height;
      var rad = 7 + a.licht * 6;
      var gr = c.createRadialGradient(u, v, 0, u, v, rad);
      var f = a.farbe, st = a.licht * 0.55;
      gr.addColorStop(0, "rgba(" + Math.round(Math.pow(f[0], 0.45) * 255) + "," + Math.round(Math.pow(f[1], 0.45) * 255) + "," + Math.round(Math.pow(f[2], 0.45) * 255) + "," + st + ")");
      gr.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = gr; c.beginPath(); c.arc(u, v, rad, 0, Math.PI * 2); c.fill();
    }
    c.globalCompositeOperation = "source-over";
    MOTOR.gl.texturNeu(fl.tex, lw);
    fl.staerke = 0.5;
  }

  /* ---------- Titel: Zeitleiste ---------- */
  function titelAktualisieren(sz, dt) {
    var T = sz.titel, tb = sz.titelBlatt;
    T.zeit += dt;
    var t = T.zeit;
    var dauer = DATA.kameras.fahrten.titel.punkte[DATA.kameras.fahrten.titel.punkte.length - 1].t;
    // Tinte, Durchstreichen, Einfügen, Prägung
    tb.tinte = M.klemme((t - (dauer - 1.0)) / 0.9, 0, 1);
    tb.strich = M.klemme((t - (dauer + 0.6)) / 0.5, 0, 1);
    tb.neu = M.klemme((t - (dauer + 1.2)) / 1.3, 0, 1);
    var pr = M.weich(M.klemme((t - (dauer + 2.2)) / 2.2, 0, 1));
    tb.obj.hoehe.staerke = pr * 0.0028;
    tb.obj.nassWert = tb.neu > 0 ? M.klemme(1 - (t - (dauer + 2.5)) / 2.5, 0, 1) : (tb.tinte > 0 && tb.tinte < 1 ? 1 : M.klemme(1 - (t - dauer) / 2.0, 0, 1));
    WELT.dokument.titelZeichnen(tb);
    if (pr > 0 && pr < 1) sz.schattenNeu = true;
    if (t > dauer + 4.5) T.fertig = true;
    // Sitzlampen: leises Glimmen, eine flackert kurz auf
    var L = sz.sitzlampen, d = L.netz.instanzDaten, ruhe = sz.daten.sitzlampen.ruhe;
    var ft = DATA.kameras.fahrten.titel.flackerZeit;
    for (var i = 0; i < sz.sitze.length; i++) {
      var w = ruhe * (0.85 + 0.15 * Math.sin(i * 1.7 + t * 0.3));
      if (i === T.flacker && t > ft && t < ft + 1.1) {
        var k = t - ft;
        w = (k < 0.08 || (k > 0.18 && k < 0.24) || (k > 0.32 && k < 0.9)) ? 2.2 * (1 - Math.max(0, k - 0.6) / 0.3) : 0.05;
      }
      d[i * 12 + 7] = w;
    }
    MOTOR.netzInstanzen(L.netz, sz.sitze.length);
  }

  S.titelUeberspringen = function (sz) {
    if (!sz.titel) return;
    var dauer = DATA.kameras.fahrten.titel.punkte[DATA.kameras.fahrten.titel.punkte.length - 1].t;
    if (sz.titel.zeit < dauer + 4.6) sz.titel.zeit = dauer + 4.6;
  };

  /* ---------- Jedes Bild ---------- */
  S.aktualisieren = function (sz, dt, zeit) {
    sz.zeit += dt;
    for (var n in sz.figuren) { WELT.figuren.aktualisieren(sz.figuren[n], dt, zeit); sz.schattenNeu = true; }
    var anteil = MOTOR.qualitaet.stufe().teilchen;
    sz.teilchen.forEach(function (t) { MOTOR.teilchen.aktualisieren(t, dt, zeit, t.art === "dampf" ? Math.max(0.5, anteil) : anteil); });
    if (sz.glasmodell) halbrundAktualisieren(sz, dt);
    if (sz.dokument) WELT.dokument.aktualisieren(sz.dokument, dt, zeit, sz);
    if (sz.titel) titelAktualisieren(sz, dt);
    if (sz.besucher && sz.name === "gebaeude") besucherAktualisieren(sz, dt);
    if (sz.fenster) { sz.fensterZeit = (sz.fensterZeit || 0) + dt; if (sz.fensterZeit > 0.12) { sz.fensterZeit = 0; WELT.bausteine.fensterZeichnen(sz.fenster, zeit, sz.morgen || 0); } }
    if (sz.ausschuss) lampenAktualisieren(sz.ausschuss, sz.ausschussLampen, sz.ausschussSitze.length, dt, false);
    if (sz.plenum) lampenAktualisieren(sz.plenum, sz.sitzlampen, sz.sitze.length, dt, true);
    if (sz.stempelAnim) WELT.dokument.stempelSchritt(sz, dt);
  };

  function besucherAktualisieren(sz, dt) {
    var H = sz.daten.etagenHoehe;
    sz.besucher.forEach(function (b) {
      b.x += b.richtung * b.tempo * dt;
      if (b.x > 10.8) b.richtung = -1; if (b.x < -10.8) b.richtung = 1;
      var hub = Math.abs(Math.sin(b.x * 3.0)) * 0.02;
      var m = M.trs(M.m4(), [b.x, 0.25 + b.etage * H + hub, b.z], b.richtung > 0 ? 90 : -90, 1);
      b.objekte.forEach(function (o) { o.matrix = m; o.kugelWelt = { m: [b.x, 1 + b.etage * H, b.z], r: 1.2 }; });
    });
  }

  /* Sitzlampen: Licht, Farbe und Form nach Stimme (Ja hoch, Nein flach, Enthaltung halb) */
  function lampenAktualisieren(L, obj, n, dt, plenum) {
    if (!obj) return;
    L.zeit += dt;
    var d = obj.netz.instanzDaten, aktiv = false;
    for (var i = 0; i < n; i++) {
      var l = L.lampen[i];
      if (L.zeit > l.verz) {
        var k = Math.min(1, dt * 7);
        if (Math.abs(l.ziel - l.licht) > 0.002) aktiv = true;
        l.licht += (l.ziel - l.licht) * k;
        l.form = (l.form || 1) + ((l.zielForm || 1) - (l.form || 1)) * k;
        l.f = l.f ? M.mix(l.f, l.farbe, k) : l.farbe.slice();
      }
      var q = i * 12;
      d[q + 4] = l.f ? l.f[0] : l.farbe[0]; d[q + 5] = l.f ? l.f[1] : l.farbe[1]; d[q + 6] = l.f ? l.f[2] : l.farbe[2];
      d[q + 7] = l.licht;
      d[q + 9] = l.form || 1;
    }
    MOTOR.netzInstanzen(obj.netz, n);
  }

  /* Abstimmung zeigen: stimmen = Liste je Sitz ("ja"/"nein"/"enthaltung"), Reihenfolge: erst Ja, dann Nein, dann Enthaltung */
  S.abstimmungZeigen = function (sz, stimmen) {
    var L = sz.plenum || sz.ausschuss; if (!L) return;
    L.zeit = 0;
    var FARBE = { ja: M.farbe("#5fc48a"), nein: M.farbe("#e0503f"), enthaltung: M.farbe("#f0c24e") };
    var reihen = { ja: [], nein: [], enthaltung: [] };
    stimmen.forEach(function (s, i) { reihen[s].push(i); });
    var t = 0.4;
    ["ja", "nein", "enthaltung"].forEach(function (art) {
      reihen[art].forEach(function (i, k) {
        var l = L.lampen[i];
        l.verz = t + k * (MOTOR.bewegungReduziert ? 0 : 0.035);
        l.ziel = art === "ja" ? 5.5 : (art === "nein" ? 3.0 : 2.4);
        l.zielForm = art === "ja" ? 1.6 : (art === "nein" ? 0.45 : 1.0);
        l.farbe = FARBE[art];
      });
      t += reihen[art].length * (MOTOR.bewegungReduziert ? 0 : 0.035) + 0.6;
    });
    return t;
  };
  S.abstimmungZuruecksetzen = function (sz) {
    var L = sz.plenum || sz.ausschuss; if (!L) return;
    L.lampen.forEach(function (l) { l.ziel = sz.plenum ? 0.25 : 0.1; l.zielForm = 1; l.farbe = [1, 0.88, 0.7]; l.verz = 0; });
  };

  /* Szene freigeben (Puffer und Texturen) */
  S.freigeben = function (sz) {
    if (!sz) return;
    var gl = MOTOR.gl.gl;
    sz.objekte.forEach(function (o) { MOTOR.netzLoeschen(o.netz); if (o.farbTex) MOTOR.gl.loescheTextur(o.farbTex); });
    sz.teilchen.forEach(function (t) { MOTOR.netzLoeschen(t.netz); });
    if (sz.umgebung) gl.deleteTexture(sz.umgebung.tex);
    if (sz.himmelWuerfel) gl.deleteTexture(sz.himmelWuerfel.tex);
    if (sz.lut) gl.deleteTexture(sz.lut);
  };

  return S;
})();
