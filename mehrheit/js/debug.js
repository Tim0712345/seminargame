/* =====================================================================
   js/debug.js – Debug-Modus (index.html?debug=1), Abschnitt 11
   ---------------------------------------------------------------------
   Feld oben links: FPS, Bildzeit (CPU/GPU), Zeichenaufrufe, Dreiecke,
   Grafikstufe, Kapitel, Punkte je Fraktion, Mehrheit, Flags.
   Tasten: G = Ansicht wechseln (Bild, nur Licht, Normalen, Tiefe,
   Verdeckung, Schattenkarte, Drahtgitter) · L = Lichtquellen zeigen ·
   C = freie Kamera (WASD + Maus, Q/E hoch/runter) · P = Standbild als PNG ·
   K = nächstes Kapitel · V = Vertrauen auf 0 · F = Flags in der Konsole.
   Beim Start: Prüfungen (Gespräche, Daten, Ziffern, Textlänge), Balance
   der Beispielentwürfe und Tabelle der ungeprüften Fakten in der Konsole.
   Admin-Menü (auch ohne Debug): 5× schnell auf den Titel tippen oder
   „admin“ eintippen. Kapitel springen, Beispielentwürfe, alle Karten,
   direkt zum Vergleich. Speichert nur nach ausdrücklicher Bestätigung.
   ===================================================================== */
window.MEHRHEIT_DEBUG = /[?&]debug=1/.test(location.search);

var DEBUG = (function () {
  var D = { an: window.MEHRHEIT_DEBUG, freieKamera: false, lichter: false, ansicht: 0, standbild: false };
  var ANSICHTEN = ["Fertiges Bild", "Nur Licht", "Normalen", "Tiefe", "Umgebungsverdeckung", "Schattenkarte", "Drahtgitter"];
  var feld = null, akku = 0, tasten = {}, maus = null;

  D.init = function () {
    if (!D.an) return;
    feld = document.createElement("div"); feld.id = "debugFeld"; document.body.appendChild(feld);
    var p = D.pruefungen();
    console.log("%cMehrheit – Prüfungen", "font-weight:bold");
    console.log((p.gespraeche.length ? "✗ Gespräche: " + p.gespraeche.length + " Fehler" : "✓ Gespräche: alle Knoten erreichbar"), p.gespraeche);
    console.log((p.daten.length ? "✗ Daten: " + p.daten.length + " Fehler" : "✓ Daten: vollständig"), p.daten);
    console.log((p.ziffern.length ? "✗ Ziffern: " + p.ziffern.length + " Texte mit Ziffern" : "✓ Ziffern: keine Ziffern in Texten"), p.ziffern);
    console.log((p.woerter > 6000 ? "✗" : "✓") + " Textlänge: etwa " + Math.round(p.woerter / 50) * 50 + " Wörter Spieltext pro typischem Durchgang (Schätzung, Ziel höchstens 6000; alle Texte zusammen " + p.woerterGesamt + "), längster Spieltext: " + p.laengste + " Zeichen");
    D.balance();
    var offen = [];
    for (var id in DATA.fakten) if (!DATA.fakten[id].verifiziert) offen.push({ id: id, wert: LOGIK.text.fakt(id), jahr: DATA.fakten[id].jahr, quelle: DATA.fakten[id].quelle });
    console.log("%cUngeprüfte Fakten: " + offen.length, "color:#d0322a;font-weight:bold");
    if (console.table) console.table(offen);
    D.ergebnis = p;
    window.addEventListener("keydown", function (e) { tasten[e.key.toLowerCase()] = true; D.taste(e); });
    window.addEventListener("keyup", function (e) { tasten[e.key.toLowerCase()] = false; });
    window.addEventListener("pointerdown", function (e) { if (D.freieKamera) maus = [e.clientX, e.clientY]; });
    window.addEventListener("pointerup", function () { maus = null; });
    window.addEventListener("pointermove", function (e) {
      if (!D.freieKamera || !maus) return;
      var dx = e.clientX - maus[0], dy = e.clientY - maus[1]; maus = [e.clientX, e.clientY];
      D.gier -= dx * 0.004; D.nick = MOTOR.m.klemme(D.nick - dy * 0.004, -1.5, 1.5);
    });
  };

  /* ---------- Prüfungen ---------- */
  D.pruefungen = function () {
    var erg = { gespraeche: LOGIK.gespraech.pruefen(), daten: [], ziffern: [], woerter: 0, woerterGesamt: 0, laengste: 0 };
    /* Schätzung, welcher Anteil eines Textbereichs in einem typischen Durchgang gelesen wird */
    var nFig = {}; DATA.epilog.bausteine.forEach(function (b) { nFig[b.figur] = 1; });
    var ANTEILE = [
      [/^zeilen\.anhoerung\.fragen/, DATA.spielwerte.fragen_anhoerung / DATA.zeilen.anhoerung.fragen.length],
      [/^zeilen\.flure\.personen/, 0.35], [/^zeilen\.flure\.geruechte/, 0.5], [/^zeilen\.flure\.reaktion/, 0.5],
      [/^zeilen\.(ausschuss|plenum)/, 0.6], [/^zeilen\.presse/, 0.7], [/^zeilen/, 1],
      [/^artikel/, 0.45], [/^karten/, 0.7], [/^epilog\.bausteine/, Object.keys(nFig).length / DATA.epilog.bausteine.length],
      [/^epilog\.mira/, 1 / 3], [/^epilog/, 1], [/^vergleich/, 1], [/^glossar/, 0.15], [/^wunschzettel|^umsetzungsfrist|^trilog/, 0.8],
      [/^texte\.(ueber|einstellungen|dokumentmodus|hinweise|admin)/, 0], [/^texte/, 0.5], [/^gespraeche/, 0], [/.*/, 0.5]
    ];
    function durchgangsAnteil(pfad) { for (var i = 0; i < ANTEILE.length; i++) if (ANTEILE[i][0].test(pfad)) return ANTEILE[i][1]; return 1; }
    var achsen = ["wissen", "durchsetzung", "aufwand", "recht"];
    var fr = DATA.fraktionen.filter(function (f) { return !f.immerJa; });
    // Datenprüfung
    DATA.artikel.forEach(function (a) {
      a.schrauben.forEach(function (s) {
        s.optionen.forEach(function (o) {
          var w = a.id + "/" + s.id + "/" + o.id;
          fr.forEach(function (f) { if (!o.haltung || o.haltung[f.id] === undefined) erg.daten.push(w + ": Haltung für " + f.id + " fehlt"); });
          achsen.forEach(function (x) { if (!o.wirkung || o.wirkung[x] === undefined) erg.daten.push(w + ": Wirkung „" + x + "“ fehlt"); });
          if (o.vergleich && !DATA.fakten[o.vergleich]) erg.daten.push(w + ": Vergleichsfakt „" + o.vergleich + "“ fehlt");
          if (!DATA.vergleich.echteOption[s.id]) erg.daten.push(a.id + "/" + s.id + ": echte Option im Vergleich fehlt");
        });
        if (!s.optionen.some(function (o) { return o.id === s.start; })) erg.daten.push(a.id + "/" + s.id + ": Startoption fehlt");
      });
    });
    var sa = 0, sp = 0; DATA.fraktionen.forEach(function (f) { sa += f.sitzeAusschuss; sp += f.sitzePlenum; });
    if (sa !== DATA.spielwerte.sitze_ausschuss) erg.daten.push("Ausschusssitze ergeben " + sa + " statt " + DATA.spielwerte.sitze_ausschuss);
    if (sp !== DATA.spielwerte.sitze_plenum_darstellung) erg.daten.push("Plenumssitze ergeben " + sp + " statt " + DATA.spielwerte.sitze_plenum_darstellung);
    // Karten, Anliegen, Epilog-Figuren
    for (var kid in DATA.karten) {
      var ka = DATA.karten[kid];
      if (["stimme", "beleg", "einwand"].indexOf(ka.art) < 0) erg.daten.push("Karte " + kid + ": unbekannte Art „" + ka.art + "“");
      if (ka.fakt && !DATA.fakten[ka.fakt]) erg.daten.push("Karte " + kid + ": Fakt „" + ka.fakt + "“ fehlt");
      if (ka.von && !DATA.figuren.personen[ka.von] && !(DATA.texte.dossier.von || {})[ka.von]) erg.daten.push("Karte " + kid + ": Figur „" + ka.von + "“ fehlt");
      (ka.wirktBei || []).forEach(function (wb) { var t = wb.split("_"), f = DATA.fraktionen.filter(function (x) { return x.id === t[0]; })[0]; if (!f || !f.anliegen || !f.anliegen[wb.slice(t[0].length + 1)]) erg.daten.push("Karte " + kid + ": Anliegen „" + wb + "“ gibt es nicht"); });
    }
    DATA.bibliothek.forEach(function (bid) { if (!DATA.karten[bid]) erg.daten.push("Bibliothek: Karte „" + bid + "“ fehlt"); });
    DATA.zeilen.anhoerung.fragen.forEach(function (q) { if (q.karte && !DATA.karten[q.karte]) erg.daten.push("Anhörung " + q.id + ": Karte „" + q.karte + "“ fehlt"); if (!DATA.figuren.personen[q.an]) erg.daten.push("Anhörung " + q.id + ": Figur „" + q.an + "“ fehlt"); });
    DATA.fraktionen.forEach(function (f) {
      for (var an in (f.anliegen || {})) {
        var z = f.anliegen[an].zugestaendnis, art = DATA.artikel.filter(function (a) { return a.id === an; })[0];
        var sc = art && art.schrauben.filter(function (x) { return x.id === z.schraube; })[0];
        if (!sc || !sc.optionen.some(function (o) { return o.id === z.option; })) erg.daten.push(f.id + "/" + an + ": Zugeständnis " + z.schraube + "=" + z.option + " gibt es nicht");
        if (!f.immerJa && (!DATA.zeilen.flure.personen[f.id] || !DATA.zeilen.flure.personen[f.id].anliegen[an])) erg.daten.push(f.id + "/" + an + ": Gesprächstext zum Anliegen fehlt");
      }
    });
    DATA.epilog.bausteine.forEach(function (b, i) { if (!DATA.figuren.personen[b.figur]) erg.daten.push("Epilog " + i + ": Figur „" + b.figur + "“ fehlt"); });
    for (var id in DATA.fakten) {
      var f = DATA.fakten[id];
      ["wert", "einheit", "jahr", "text", "quelle", "link_hinweis", "verifiziert"].forEach(function (k) { if (f[k] === undefined) erg.daten.push("Fakt " + id + ": Feld „" + k + "“ fehlt"); });
    }
    // alle Texte einsammeln
    var texte = [];
    function sammle(o, pfad) {
      if (typeof o === "string") { texte.push({ pfad: pfad, t: o }); return; }
      if (Array.isArray(o)) { o.forEach(function (x, i) { sammle(x, pfad + "[" + i + "]"); }); return; }
      if (o && typeof o === "object") for (var k in o) {
        if (["id", "start", "ziel", "weiter", "sprecher", "geste", "kamera", "vergleich", "ort", "art", "farbe", "muster", "person", "fraktion", "teilnehmer", "flag",
             "schraube", "option", "figur", "bedingung", "versprechen", "kartenArt", "echteOption", "rat", "an", "karte", "haltung", "wirktBei", "dolmetscherBei",
             "kommissionsKompromiss", "positionen", "bibliothek", "ziffernAusnahmen", "fakt", "von"].indexOf(k) >= 0) continue;
        sammle(o[k], pfad + "." + k);
      }
    }
    sammle(DATA.texte, "texte"); sammle(DATA.gespraeche, "gespraeche"); sammle(DATA.artikel, "artikel");
    sammle(DATA.zeilen, "zeilen"); sammle(DATA.karten, "karten"); sammle(DATA.epilog, "epilog"); sammle(DATA.vergleich, "vergleich");
    sammle(DATA.glossar, "glossar"); sammle(DATA.wunschzettel, "wunschzettel"); sammle(DATA.umsetzungsfrist, "umsetzungsfrist");
    sammle(DATA.trilog, "trilog");
    DATA.fraktionen.forEach(function (f, i) { sammle({ name: f.name, kurz: f.kurz, richtung: f.richtung, hinweis: f.hinweis }, "fraktionen[" + i + "]"); });
    for (var p in DATA.figuren.personen) { var pe = DATA.figuren.personen[p]; sammle({ name: pe.name, rolle: pe.rolle, land: pe.land }, "figuren." + p); }
    var ausnahmen = (DATA.texte.ziffernAusnahmen || []).map(function (r) { return new RegExp(r, "g"); });
    texte.forEach(function (x) {
      if (x.pfad.indexOf("ziffernAusnahmen") >= 0) return;
      LOGIK.text.platzhalter(x.t).forEach(function (pl) {
        if ((pl.art === "wert" && DATA.spielwerte[pl.id] === undefined) || ((pl.art === "fakt" || pl.art === "jahr" || pl.art === "quelle") && !DATA.fakten[pl.id])) erg.daten.push(x.pfad + ": Platzhalter {" + pl.art + ":" + pl.id + "} fehlt");
      });
      var ohne = x.t.replace(/\{[a-z]+:[a-z0-9_]+\}/g, "");
      ausnahmen.forEach(function (r) { ohne = ohne.replace(r, ""); });
      if (/[0-9]/.test(ohne)) erg.ziffern.push(x.pfad + ": „" + x.t + "“");
      var w = LOGIK.text.ersetzen(x.t, true), n = w.split(/\s+/).filter(Boolean).length;
      erg.woerterGesamt += n;
      erg.woerter += n * durchgangsAnteil(x.pfad);
      if (!/^(texte\.(ueber|einstellungen|dokumentmodus|hinweise)|glossar|vergleich)/.test(x.pfad)) erg.laengste = Math.max(erg.laengste, w.length);
    });
    return erg;
  };

  /* ---------- Tasten ---------- */
  D.taste = function (e) {
    if (!D.an || e.target && e.target.tagName === "INPUT") return;
    var R = MOTOR.renderer, k = e.key.toLowerCase();
    if (k === "g") {
      D.ansicht = (D.ansicht + 1) % ANSICHTEN.length;
      R.debugAnsicht = D.ansicht === 6 ? 0 : D.ansicht;
      R.drahtgitter = D.ansicht === 6;
      console.log("Ansicht: " + ANSICHTEN[D.ansicht] + (D.ansicht === 6 && !MOTOR.gl.ext.polygon ? " (vom Browser nicht unterstützt)" : ""));
    } else if (k === "l") { D.lichter = !D.lichter; D.lichterSymbole(); }
    else if (k === "c") {
      D.freieKamera = !D.freieKamera;
      var kam = LOGIK.ablauf.kamera;
      if (D.freieKamera) { kam.fahrt = null; var d = MOTOR.m.norm(MOTOR.m.minus(kam.ziel, kam.pos)); D.gier = Math.atan2(d[0], -d[2]); D.nick = Math.asin(d[1]); }
      console.log("Freie Kamera: " + (D.freieKamera ? "an (WASD, Q/E, Maus ziehen)" : "aus"));
    } else if (k === "p") D.standbild = true;
    else if (k === "k") { if (LOGIK.ablauf.modus === "titel") LOGIK.ablauf.kapitel(1); else LOGIK.ablauf.zumTitel(); }
    else if (k === "v") { for (var f in LOGIK.stand.vertrauen) LOGIK.stand.vertrauen[f] = 0; console.log("Vertrauen auf 0 gesetzt."); }
    else if (k === "f") console.log("Flags:", JSON.stringify(LOGIK.stand.flags));
  };

  /* Lichtquellen als kleine leuchtende Kugeln */
  D.lichterSymbole = function () {
    var sz = LOGIK.ablauf.szene; if (!sz) return;
    sz.objekte = sz.objekte.filter(function (o) { if (o.debugLicht) { MOTOR.netzLoeschen(o.netz); return false; } return true; });
    if (!D.lichter) return;
    var M = MOTOR.m;
    var punkte = sz.lichter.map(function (L) { return { p: L.pos, f: L.farbe }; });
    punkte.push({ p: M.plus(sz.sondePos, M.mal(sz.stimmung.sonneR, 1.0)), f: [1, 0.8, 0.3] });
    punkte.forEach(function (L) {
      var netz = MOTOR.netz(MOTOR.geo.kugel(0.03, 10, 5));
      sz.objekte.push({ netz: netz, mat: WELT.material("modellharz", { emission: 20 }), emission: [L.f[0] * 20, L.f[1] * 20, L.f[2] * 20], matrix: M.trs(M.m4(), L.p, 0, 1), schatten: false, debugLicht: true, sichtbar: true });
    });
  };

  D.kameraSchritt = function (dt, kam) {
    if (!D.freieKamera) return;
    var M = MOTOR.m, v = 2.0 * dt * (tasten.shift ? 4 : 1);
    var vor = [Math.sin(D.gier) * Math.cos(D.nick), Math.sin(D.nick), -Math.cos(D.gier) * Math.cos(D.nick)];
    var rechts = M.norm(M.kreuz(vor, [0, 1, 0]));
    if (tasten.w) kam.pos = M.plus(kam.pos, M.mal(vor, v));
    if (tasten.s) kam.pos = M.minus(kam.pos, M.mal(vor, v));
    if (tasten.d) kam.pos = M.plus(kam.pos, M.mal(rechts, v));
    if (tasten.a) kam.pos = M.minus(kam.pos, M.mal(rechts, v));
    if (tasten.e) kam.pos[1] += v; if (tasten.q) kam.pos[1] -= v;
    kam.ziel = M.plus(kam.pos, vor);
    kam.fokus = 2;
  };

  /* Nach dem Zeichnen: Standbild speichern */
  D.nachBild = function () {
    if (!D.standbild) return;
    D.standbild = false;
    try {
      var url = MOTOR.gl.kanvas.toDataURL("image/png");
      var a = document.createElement("a"); a.href = url; a.download = "mehrheit_standbild.png"; document.body.appendChild(a); a.click(); a.remove();
    } catch (e) { console.warn("Standbild nicht möglich: " + e.message); }
  };

  D.bild = function (dt, cpu) {
    if (!D.an || !feld) return;
    akku += dt; if (akku < 0.25) return; akku = 0;
    var Q = MOTOR.qualitaet, R = MOTOR.renderer, st = Q.stufe();
    var z = [];
    z.push("FPS " + Q.fps.toFixed(0) + "   Bild " + Q.bildzeit.toFixed(1) + " ms   CPU " + cpu.toFixed(1) + " ms" + (Q.gpuZeit ? "   GPU " + Q.gpuZeit.toFixed(1) + " ms" : ""));
    z.push("Aufrufe " + R.statistik.aufrufe + "   Dreiecke " + Math.round(R.statistik.dreiecke / 1000) + " Tsd.   " + R.b + "×" + R.h);
    z.push("Stufe " + st.name + (Q.auto ? " (auto)" : "") + (MOTOR.gl.webgl2 ? "  WebGL 2" : "  WebGL 1") + "   Ansicht: " + ANSICHTEN[D.ansicht]);
    z.push("Kapitel " + LOGIK.stand.kapitel + "   Termine " + LOGIK.stand.termineUebrig + "   Modus " + LOGIK.ablauf.modus);
    var sz = LOGIK.ablauf.szene;
    if (sz && sz.glasmodell && sz.glasmodell.erg) {
      var e = sz.glasmodell.erg, t = [];
      DATA.fraktionen.forEach(function (f) { var x = e.fraktionen[f.id]; t.push(f.kurz + " " + x.punkte.toFixed(1) + "→" + x.ja + "/" + x.nein + "/" + x.enthaltung); });
      z.push(t.join("  "));
      z.push("Mehrheit: " + (e.mehrheit ? "ja" : "nein") + "  (" + e.ja + " : " + e.nein + " : " + e.enthaltung + ")");
    }
    z.push("Flags: " + Object.keys(LOGIK.stand.flags).join(", "));
    feld.textContent = z.join("\n");
  };

  /* ---------- Beispielentwürfe und Balance ---------- */
  D.beispielEntwurf = function (art) {
    var e = {};
    DATA.artikel.forEach(function (a) { a.schrauben.forEach(function (s) {
      var n = s.optionen.length;
      if (s.id === "begruendung" || art === "mitte") e[s.id] = s.start;
      else if (art === "mutig") e[s.id] = s.optionen[n - 1].id;
      else e[s.id] = s.optionen[0].id;
    }); });
    // die Umsetzungsfrist kommt im Spiel erst im Trilog dazu (siehe beispielStand)
    return e;
  };
  /* Balance-Prüfung (Abschnitt 11): alle Kombinationen der Optionen bei Vertrauen 0.
     Die Punkte sind ganze Zahlen, deshalb werden die Stimmen je Fraktion und Punktzahl
     vorab in Tabellen gerechnet – so schafft der Browser alle Fassungen in kurzer Zeit. */
  D.balance = function (still) {
    var t0 = performance.now(), W = DATA.spielwerte, H = LOGIK.mehrheit, fr = DATA.fraktionen, nf = fr.length;
    var sch = []; DATA.artikel.forEach(function (a) { a.schrauben.forEach(function (s) { sch.push({ s: s, art: a }); }); });
    var ganz = true;
    var beitrag = sch.map(function (x) { return x.s.optionen.map(function (o) { return fr.map(function (f) {
      var g = (f.kernanliegen || []).indexOf(x.art.id) >= 0 ? W.gewicht_kernanliegen : W.gewicht_normal, v = ((o.haltung || {})[f.id] || 0) * g;
      if (v !== Math.round(v)) ganz = false; return v; }); }); });
    var OFF = 80, tab = { A: [], P: [] };
    fr.forEach(function (f, i) { tab.A[i] = []; tab.P[i] = []; for (var p = -OFF; p <= OFF; p++) { tab.A[i][p + OFF] = H.stimmen(f, p, f.sitzeAusschuss); tab.P[i][p + OFF] = H.stimmen(f, p, f.sitzePlenum); } });
    var n = sch.length, wahl = new Int32Array(n), summe = []; for (var d = 0; d <= n; d++) summe.push(new Float64Array(nf));
    var gesamt = 0, mA = 0, mP = 0, koal = {}, ohne = new Int32Array(nf);
    function blatt() {
      var s = summe[n], jaA = 0, neA = 0, jaP = 0, neP = 0, maske = 0;
      for (var i = 0; i < nf; i++) {
        var p = Math.round(s[i]) + OFF; if (p < 0) p = 0; if (p > 2 * OFF) p = 2 * OFF;
        var a = tab.A[i][p], b = tab.P[i][p];
        jaA += a.ja; neA += a.nein; jaP += b.ja; neP += b.nein;
        if (!fr[i].immerJa && a.ja * 2 >= fr[i].sitzeAusschuss) maske |= 1 << i;
      }
      gesamt++;
      if (jaP > neP) mP++;
      if (jaA > neA) { mA++; koal[maske] = (koal[maske] || 0) + 1; for (i = 0; i < nf; i++) if (!fr[i].immerJa && !(maske & (1 << i))) ohne[i]++; }
    }
    (function tiefe(k) {
      if (k === n) { blatt(); return; }
      var opts = beitrag[k], vor = summe[k], nach = summe[k + 1];
      for (var o = 0; o < opts.length; o++) { var b = opts[o]; for (var i = 0; i < nf; i++) nach[i] = vor[i] + b[i]; wahl[k] = o; tiefe(k + 1); }
    })(0);
    // Sonderfassungen
    function nachWert(fn) { var e = {}; sch.forEach(function (x) { var best = null, bw = -1e9; x.s.optionen.forEach(function (o) { var w = fn(o); if (w > bw) { bw = w; best = o.id; } }); e[x.s.id] = best; }); return e; }
    function hs(o, ids) { var v = 0; ids.forEach(function (id) { v += (o.haltung || {})[id] || 0; }); return v; }
    var links = fr.filter(function (f) { return f.lager === "links"; }).map(function (f) { return f.id; });
    var rechts = fr.filter(function (f) { return f.lager === "rechts"; }).map(function (f) { return f.id; });
    var v0 = {}; fr.forEach(function (f) { v0[f.id] = 0; });
    var faelle = {
      maxLinks: nachWert(function (o) { return hs(o, links); }),
      maxRechts: nachWert(function (o) { return hs(o, rechts); }),
      allesGestrichen: nachWert(function (o) { return (o.streichen ? 10 : 0) - (o.wirkung.wissen + o.wirkung.durchsetzung); })
    };
    var sonder = {};
    for (var fn in faelle) { var r = H.ausschuss(faelle[fn], v0), rp = H.plenum(faelle[fn], v0); sonder[fn] = { ausschuss: r.mehrheit, plenum: rp.mehrheit }; }
    var namen = function (m) { return fr.filter(function (f, i) { return m & (1 << i); }).map(function (f) { return f.kurz; }).join(" + "); };
    var liste = Object.keys(koal).map(function (m) { return { koalition: namen(+m), fassungen: koal[m] }; }).sort(function (a, b) { return b.fassungen - a.fassungen; });
    var nennenswert = liste.filter(function (k) { return k.fassungen >= mA * 0.02; }).length;
    var unverzichtbar = fr.filter(function (f, i) { return !f.immerJa && ohne[i] === 0; }).map(function (f) { return f.kurz; });
    var ziele = [
      [nennenswert >= 3, "Mindestens drei verschiedene Wege zur Mehrheit: " + nennenswert + " Koalitionen mit nennenswert vielen Fassungen (insgesamt " + liste.length + ")"],
      [!sonder.maxLinks.ausschuss && !sonder.maxRechts.ausschuss, "Maximalfassungen beider Seiten scheitern im Ausschuss (links: " + (sonder.maxLinks.ausschuss ? "Mehrheit" : "keine Mehrheit") + ", rechts: " + (sonder.maxRechts.ausschuss ? "Mehrheit" : "keine Mehrheit") + ")"],
      [!sonder.allesGestrichen.ausschuss, "„Fast alles gestrichen“ scheitert im Ausschuss"],
      [!unverzichtbar.length, "Keine Fraktion ist zwingend nötig" + (unverzichtbar.length ? " – unverzichtbar: " + unverzichtbar.join(", ") : "")]
    ];
    // Beispielentwürfe für das Admin-Menü
    var beispiele = ["mutig", "mitte", "schlank"].map(function (art) {
      var st = LOGIK.neuerStand(); st.entwurf = D.beispielEntwurf(art);
      var e = LOGIK.entwurf(st), a = H.ausschuss(e, st.vertrauen), p = H.plenum(e, st.vertrauen);
      return { entwurf: art, ausschuss: a.ja + ":" + a.nein + ":" + a.enthaltung + (a.mehrheit ? " ✓" : " ✗"), plenum: p.ja + ":" + p.nein + ":" + p.enthaltung + (p.mehrheit ? " ✓" : " ✗") };
    });
    var erg = { fassungen: gesamt, ausschuss: mA, plenum: mP, koalitionen: liste, ziele: ziele, beispiele: beispiele, ms: Math.round(performance.now() - t0), ganz: ganz };
    if (!still) {
      console.log("%cBalance: " + gesamt + " Fassungen in " + erg.ms + " ms – Mehrheit im Ausschuss: " + mA + " (" + (100 * mA / gesamt).toFixed(1) + " %), im Plenum: " + mP + " (" + (100 * mP / gesamt).toFixed(1) + " %)", "font-weight:bold");
      ziele.forEach(function (z) { console.log((z[0] ? "✓ " : "✗ ") + z[1]); });
      if (!ganz) console.log("ℹ Punkte nicht ganzzahlig – Tabellen gerundet");
      if (console.table) { console.table(liste.slice(0, 8)); console.table(beispiele); }
    }
    D.balanceErgebnis = erg;
    return erg;
  };

  /* Spielstand für Sprünge in ein Kapitel (Admin-Menü, ?kapitel=) */
  D.beispielStand = function (art, kapitel) {
    var st = LOGIK.neuerStand(), Q = DATA.zeilen.anhoerung.fragen;
    st.name = (LOGIK.stand && LOGIK.stand.name) || "Sam";
    st.entwurf = D.beispielEntwurf(art || "mitte");
    st.flags.zettel = true;
    st.dossier = ["weiss_stundenlohn", "weiss_bereinigt"];
    Q.slice(0, DATA.spielwerte.fragen_anhoerung).forEach(function (q) { st.gefragt.push(q.id); if (q.karte && st.dossier.indexOf(q.karte) < 0) st.dossier.push(q.karte); });
    st.abendantworten = ["pragmatisch", "mutig"]; st.presse = ["pragmatisch"];
    st.kapitel = kapitel || 1;
    if ((kapitel || 1) >= 4) st.eingereicht = true;
    if ((kapitel || 1) >= 6) st.ergebnis.ausschuss = true;
    if ((kapitel || 1) >= 7) st.entwurf.frist = art === "mutig" ? "kurz" : (art === "schlank" ? "lang" : "mittel");
    if ((kapitel || 1) >= 8) st.ergebnis.plenum = LOGIK.mehrheit.plenum(LOGIK.entwurf(st), st.vertrauen).mehrheit;
    LOGIK.stand = st;
    return st;
  };

  /* ---------- Verstecktes Admin-Menü ---------- */
  var ohneSpeichern = false, adminTaps = [], getippt = "";
  var originalSpeichern = LOGIK.speicher.speichern;
  LOGIK.speicher.speichern = function () { return ohneSpeichern ? false : originalSpeichern(); };

  D.admin = function () {
    var T = DATA.texte.admin, Mn = ANSICHT.menues;
    if (!ohneSpeichern && !D.adminSpeichernBestaetigt) { LOGIK.speicher.speichern(); ohneSpeichern = true; }
    var d = document.createElement("div"); d.className = "admin";
    function zeile(titel) { var h = document.createElement("h3"); h.textContent = titel; d.appendChild(h); var r = document.createElement("div"); r.className = "reihe"; d.appendChild(r); return r; }
    function k(r, text, f, haupt) { var b = document.createElement("button"); b.type = "button"; b.className = "knopf" + (haupt ? " haupt" : ""); b.textContent = text; b.style.touchAction = "manipulation"; ANSICHT.hover(b); b.addEventListener("click", f); r.appendChild(b); return b; }
    var p = document.createElement("p"); p.className = "klein"; p.textContent = T.hinweis; d.appendChild(p);
    var rs = zeile(T.speichern);
    k(rs, ohneSpeichern ? T.aus : T.an, function () {
      if (ohneSpeichern) Mn.frage(T.speichernFrage, T.speichernJa, function () { ohneSpeichern = false; D.adminSpeichernBestaetigt = true; LOGIK.speicher.speichern(); });
      else { ohneSpeichern = true; Mn.fensterZu(); }
    });
    var art = D.adminArt || "mitte";
    var re = zeile(T.entwurf);
    [["mutig", T.mutig], ["mitte", T.mitte], ["schlank", T.schlank]].forEach(function (x) {
      var b = k(re, x[1], function () {
        D.adminArt = x[0];
        LOGIK.stand.entwurf = D.beispielEntwurf(x[0]);
        Mn.fensterZu();
        Mn.hinweis(T.entwurfGesetzt + " " + x[1]);
        if (ANSICHT.editor.offen) { ANSICHT.editor.nachAenderung(); ANSICHT.editor.blatt(); var sz = LOGIK.ablauf.szene; if (sz && sz.dokument) ANSICHT.editor.seiteSetzen(sz.dokument, false); }
      });
      b.setAttribute("aria-pressed", String(x[0] === art));
    });
    var rk = zeile(T.kapitel);
    DATA.texte.kapitel.forEach(function (kp, i) {
      k(rk, (i + 1) + " · " + LOGIK.text.ersetzen(kp.titel, true), function () { Mn.fensterZu(); D.beispielStand(D.adminArt || "mitte", i + 1); LOGIK.ablauf.kapitel(i + 1); });
    });
    k(rk, "8 · " + T.epilog, function () { Mn.fensterZu(); D.beispielStand(D.adminArt || "mitte", 8); LOGIK.ablauf.kapitel(8); });
    var rv = zeile(T.vergleichKurz);
    k(rv, T.karten, function () { Object.keys(DATA.karten).forEach(function (id) { if (LOGIK.stand.dossier.indexOf(id) < 0) LOGIK.stand.dossier.push(id); }); Mn.fensterZu(); Mn.hinweis(T.kartenOk); });
    k(rv, T.vergleich, function () { Mn.fensterZu(); if (!LOGIK.stand.eingereicht) D.beispielStand(D.adminArt || "mitte", 9); LOGIK.ablauf.kapitel(9); }, true);
    var b = (D.balanceErgebnis || D.balance(true)).beispiele, h = document.createElement("h3"); h.textContent = T.balance; d.appendChild(h);
    var tab = document.createElement("table"); tab.className = "admin-tabelle";
    tab.innerHTML = "<thead><tr><th></th><th>" + T.ausschuss + "</th><th>" + T.plenum + "</th></tr></thead><tbody>" +
      b.map(function (z) { return "<tr><th>" + T[z.entwurf] + "</th><td>" + z.ausschuss + "</td><td>" + z.plenum + "</td></tr>"; }).join("") + "</tbody>";
    d.appendChild(tab);
    Mn.fenster(T.titel, d);
  };
  // 5× schnell auf den Titel tippen oder „admin“ eintippen
  window.addEventListener("pointerdown", function (e) {
    if (LOGIK.ablauf.modus !== "titel" || e.target.closest("button, input, #fenster")) return;
    var t = performance.now(); adminTaps = adminTaps.filter(function (x) { return t - x < 2500; }); adminTaps.push(t);
    if (adminTaps.length >= 5) { adminTaps = []; D.admin(); }
  });
  window.addEventListener("keydown", function (e) {
    if (!e.key || e.key.length !== 1 || (e.target && e.target.tagName === "INPUT")) return;
    getippt = (getippt + e.key.toLowerCase()).slice(-5);
    if (getippt === "admin") { getippt = ""; D.admin(); }
  });

  return D;
})();
