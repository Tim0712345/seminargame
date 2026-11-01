/* =====================================================================
   js/debug.js – Debug-Modus (index.html?debug=1), Abschnitt 11
   ---------------------------------------------------------------------
   Feld oben links: FPS, Bildzeit (CPU/GPU), Zeichenaufrufe, Dreiecke,
   Grafikstufe, Kapitel, Punkte je Fraktion, Mehrheit, Flags.
   Tasten: G = Ansicht wechseln (Bild, nur Licht, Normalen, Tiefe,
   Verdeckung, Schattenkarte, Drahtgitter) · L = Lichtquellen zeigen ·
   C = freie Kamera (WASD + Maus, Q/E hoch/runter) · P = Standbild als PNG ·
   K = nächstes Kapitel · V = Vertrauen auf 0 · F = Flags in der Konsole.
   Beim Start: Prüfungen (Gespräche, Daten, Ziffern, Textlänge) und
   Tabelle der ungeprüften Fakten in der Konsole.
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
    console.log("ℹ Textlänge: " + p.woerter + " Wörter Spieltext (Phase 1), längste Zeile: " + p.laengste + " Zeichen");
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
    var erg = { gespraeche: LOGIK.gespraech.pruefen(), daten: [], ziffern: [], woerter: 0, laengste: 0 };
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
        });
        if (!s.optionen.some(function (o) { return o.id === s.start; })) erg.daten.push(a.id + "/" + s.id + ": Startoption fehlt");
      });
    });
    var sa = 0, sp = 0; DATA.fraktionen.forEach(function (f) { sa += f.sitzeAusschuss; sp += f.sitzePlenum; });
    if (sa !== DATA.spielwerte.sitze_ausschuss) erg.daten.push("Ausschusssitze ergeben " + sa + " statt " + DATA.spielwerte.sitze_ausschuss);
    if (sp !== DATA.spielwerte.sitze_plenum_darstellung) erg.daten.push("Plenumssitze ergeben " + sp + " statt " + DATA.spielwerte.sitze_plenum_darstellung);
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
        if (["id", "start", "ziel", "weiter", "sprecher", "geste", "kamera", "vergleich", "ort", "art", "farbe", "muster", "person", "fraktion", "teilnehmer", "flag"].indexOf(k) >= 0) continue;
        sammle(o[k], pfad + "." + k);
      }
    }
    sammle(DATA.texte, "texte"); sammle(DATA.gespraeche, "gespraeche"); sammle(DATA.artikel, "artikel");
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
      var w = LOGIK.text.ersetzen(x.t, true);
      erg.woerter += w.split(/\s+/).filter(Boolean).length;
      erg.laengste = Math.max(erg.laengste, w.length);
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

  return D;
})();
