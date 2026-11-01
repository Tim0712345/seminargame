/* =====================================================================
   js/logik/ablauf.js – Ablauf: Titel, sieben Kapitel, Epilog, Vergleich
   ---------------------------------------------------------------------
   Jedes Kapitel beginnt mit einer Kapitelkarte und endet (wo vorgesehen)
   mit einer Abendnotiz von Mira. Zwischen den Kapiteln wird gespeichert.
   ===================================================================== */
var LOGIK = window.LOGIK || {};

LOGIK.ablauf = (function () {
  var A = { szene: null, modus: "laden", kamera: null, ansicht: "totale", gebDreh: 0, tasten: {} };
  var M = MOTOR.m;
  var Z = function () { return DATA.zeilen; };

  A.init = function (kamera) { A.kamera = kamera; };

  function szeneLaden(name, extra) {
    if (A.ohne3D) {
      // Dokumentmodus: keine 3D-Welt, nur Ort und Halbrund auf der Seite
      A.szene = { name: name, ohne3D: true, figuren: {}, raumGlas: {}, raumPos: {},
        hotspots: name === "gebaeude" ? DATA.szenen.gebaeude.raeume.filter(function (r) { return r.art !== "leer" && r.art !== "halle"; }).map(function (r) { return { id: r.id, art: r.art, fraktion: r.fraktion, pos: [0, 0, 0] }; }) : [] };
      A.szeneArgs = { name: name, extra: extra };
      ANSICHT.szenenText(DATA.texte.szenen[DATA.szenen[name].beschreibung] || "");
      ANSICHT.dokumentmodus.szene(name);
      if (MOTOR.ton) MOTOR.ton.atmo(name === "trilog" ? "regen" : (name === "plenum" || name === "ausschusssaal" ? "saal" : null));
      return;
    }
    if (A.szene) WELT.szenen.freigeben(A.szene);
    A.szene = WELT.szenen.bauen(name, A.kamera, extra);
    A.szeneArgs = { name: name, extra: extra };
    MOTOR.post.verlaufLoeschen();
    ANSICHT.szenenText(DATA.texte.szenen[DATA.szenen[name].beschreibung] || "");
    if (MOTOR.ton) {
      MOTOR.ton.raum(name === "plenarsaal" || name === "plenum" ? 2.8 : (name === "buero" || name === "trilog" ? 0.7 : 1.4));
      MOTOR.ton.atmo(name === "trilog" ? "regen" : (name === "plenum" || name === "ausschusssaal" ? "saal" : null));
    }
  }
  A.szeneNeuAufbauen = function () {
    if (A.ohne3D) return;
    var a = A.szeneArgs || { name: "plenarsaal" };
    var alt = A.szene; A.szene = null;
    A.szene = WELT.szenen.bauen(a.name, A.kamera, a.extra);
    if (alt && alt.titel && A.szene.titel) A.szene.titel.zeit = alt.titel.zeit;
  };

  function speichern() { LOGIK.speicher.speichern(); }
  function folge(saetze, fertig, antworten) { LOGIK.gespraech.folge(saetze, fertig, antworten); }
  function setzeKamera(e) { A.kamera.setze(e); if (!A.ohne3D) MOTOR.post.verlaufLoeschen(); }
  function hud(an) { ANSICHT.menues.hud(an); }

  /* ---------- Titel ---------- */
  A.titel = function () {
    A.modus = "titel";
    hud(false); ANSICHT.menues.alleVerbergen();
    szeneLaden("plenarsaal");
    var F = DATA.kameras.fahrten;
    if (A.ohne3D) { /* kein Bild */ }
    else if (MOTOR.bewegungReduziert) { A.kamera.setze(F.titel.punkte[F.titel.punkte.length - 1]); WELT.szenen.titelUeberspringen(A.szene); }
    else { A.kamera.setze(F.titel.punkte[0]); A.kamera.starteFahrt(F.titel); }
    ANSICHT.menues.titelZeigen();
    if (MOTOR.ton) MOTOR.ton.spiele("titel");
  };
  A.titelUeberspringen = function () {
    if (A.modus !== "titel" || !A.szene || !A.szene.titel || A.ohne3D) return;
    var F = DATA.kameras.fahrten.titel;
    if (A.kamera.fahrt && A.kamera.fahrt.art === "pfad") {
      MOTOR.post.ueberblenden(0.8);
      A.kamera.setze(F.punkte[F.punkte.length - 1]);
      WELT.szenen.titelUeberspringen(A.szene);
    }
  };

  A.neueLegislatur = function () { LOGIK.stand = LOGIK.neuerStand(); speichern(); A.kapitel(1); };
  A.weiterspielen = function () {
    var r = LOGIK.speicher.laden();
    if (r === "alt") { ANSICHT.menues.hinweis(DATA.texte.menue.altStand); LOGIK.stand = LOGIK.neuerStand(); }
    A.kapitel(LOGIK.stand.kapitel || 1);
  };
  A.zumTitel = function () {
    if (LOGIK.gespraech.aktiv) LOGIK.gespraech.beenden(true);
    ANSICHT.editor.schliessen(); ANSICHT.wahlZu(); ANSICHT.menues.alleVerbergen();
    ANSICHT.blende(true, function () { A.titel(); ANSICHT.blende(false); });
  };

  /* ---------- Kapitelwechsel ---------- */
  var START = {};
  A.kapitel = function (nr, ohneKarte) {
    ANSICHT.menues.titelVerbergen(); ANSICHT.menues.alleVerbergen(); ANSICHT.editor.schliessen(); ANSICHT.wahlZu();
    if (LOGIK.gespraech.aktiv) LOGIK.gespraech.beenden(true);
    ANSICHT.blende(true, function () {
      LOGIK.stand.kapitel = nr; speichern();
      ANSICHT.aufgabe.schritt = "start";
      START[nr].laden();
      ANSICHT.blende(false);
      hud(nr <= 7);
      if (nr <= 7 && !ohneKarte) ANSICHT.menues.kapitelKarte(nr, START[nr].los);
      else START[nr].los();
    });
  };

  /* Abendnotiz von Mira mit Frage (drei Haltungen) */
  function abend(nr, weiter) {
    var a = Z().abende[nr];
    ANSICHT.menues.abendnotiz(a.notiz, function () {
      ANSICHT.wahl(DATA.figuren.personen.mira.name, a.frage, a.antworten.map(function (x) { return { text: x.text }; }), function (i) {
        LOGIK.stand.abendantworten.push(a.antworten[i].haltung); speichern(); weiter();
      });
    });
  }

  /* =================== Kapitel 1 – Der Stapel =================== */
  START[1] = {
    laden: function () {
      A.modus = "k1";
      szeneLaden("buero", { stimmung: "buero_morgen", figuren: [{ person: "mira", pos: [-1.92, 0, 0.55], dreh: 75, haltung: "sitzen" }, { person: "sam", pos: [0.75, 0, 0.55], dreh: -100, haltung: "stehen" }] });
      setzeKamera(DATA.kameras.buero.totale); A.ansicht = "totale";
    },
    los: function () {
      ANSICHT.menues.nameFragen(function (name) {
        LOGIK.stand.name = name; speichern();
        folge(Z().kapitel1.mira, function () {
          ANSICHT.menues.zettelZeigen(true, function () {
            folge([Z().kapitel1.zettel], function () {
              // Mini-Tutorial: probehalber eine Option in Artikel 1 wählen
              A.kamera.fahreZu(DATA.kameras.buero.dokument, 2.0); A.ansicht = "dokument";
              var vorher = JSON.stringify(LOGIK.stand.entwurf);
              ANSICHT.editor.oeffnen("probe", 0);
              ANSICHT.fraktionsleiste.zeigen(true);
              ANSICHT.aufgabe.setzen("probe");
              folge([Z().kapitel1.probe], function () {
                ANSICHT.fuehrung.zeige("probe", "#editor .ed-optionen", function () { ANSICHT.fuehrung.zeige("mehrheitProbe", "#fraktionsleiste"); });
              });
              ANSICHT.editor.beiWahl = function () {
                ANSICHT.editor.beiWahl = null;
                setTimeout(function () {
                  folge([Z().kapitel1.probeDanach], function () {
                    LOGIK.stand.entwurf = JSON.parse(vorher);
                    ANSICHT.editor.schliessen(); ANSICHT.fraktionsleiste.zeigen(false);
                    ANSICHT.aufgabe.setzen("fertig");
                    ANSICHT.editor.nachAenderung();
                    if (A.szene.dokument) ANSICHT.editor.seiteSetzen(A.szene.dokument, false);
                    A.kamera.fahreZu(DATA.kameras.buero.totale, 2.0); A.ansicht = "totale";
                    abend(0, function () { A.kapitel(2); });
                  });
                }, 1600);
              };
            });
          });
        });
      });
    }
  };

  /* =================== Kapitel 2 – Die Anhörung =================== */
  START[2] = {
    laden: function () {
      A.modus = "anhoerung";
      szeneLaden("ausschusssaal");
      setzeKamera(DATA.kameras.anhoerung.fahrt.punkte[0]);
    },
    los: function () {
      if (!MOTOR.bewegungReduziert) A.kamera.starteFahrt(DATA.kameras.anhoerung.fahrt);
      else setzeKamera(DATA.kameras.anhoerung.totale);
      setTimeout(function () {
        folge(Z().anhoerung.einfuehrung, function () {
          ANSICHT.dossier.neu("weiss_stundenlohn"); ANSICHT.dossier.neu("weiss_bereinigt");
          setzeKamera(DATA.kameras.anhoerung.totale); A.ansicht = "totale";
          folge([Z().anhoerung.mira], fragen);
        });
      }, MOTOR.bewegungReduziert ? 300 : 3500);
    }
  };
  function fragen() {
    var Q = Z().anhoerung.fragen, st = LOGIK.stand, max = DATA.spielwerte.fragen_anhoerung;
    if (st.gefragt.length >= max) {
      var hatEinwand = st.gefragt.some(function (id) { return id === "karin_vorlagen" || id === "weiss_rest" || id === "mateusz_haelfte"; });
      setzeKamera(DATA.kameras.anhoerung.totale); A.ansicht = "totale";
      folge([hatEinwand ? Z().anhoerung.feedbackGut : Z().anhoerung.feedbackEinseitig], function () { A.kapitel(3); });
      return;
    }
    var opts = Q.map(function (q) { var p = DATA.figuren.personen[q.an]; return { text: q.frage, unter: p.name, aus: st.gefragt.indexOf(q.id) >= 0 }; });
    ANSICHT.aufgabe.setzen("fragen");
    setTimeout(function () { ANSICHT.fuehrung.zeige("fragen", "#wahl"); }, 60);
    ANSICHT.wahl(DATA.texte.anhoerung.titel, null, opts, function (i) {
      var q = Q[i];
      st.gefragt.push(q.id);
      if (q.flag) st.flags[q.flag] = true;
      folge(q.antwort, function () { ANSICHT.dossier.neu(q.karte); speichern(); fragen(); ANSICHT.fuehrung.zeige("dossier", "#knopfDossier"); });
    }, { zusatz: (max - st.gefragt.length) + " " + DATA.texte.anhoerung.uebrig, spalten: true });
  }

  /* =================== Kapitel 3 – Der Entwurf =================== */
  START[3] = {
    laden: function () {
      A.modus = "entwurf";
      szeneLaden("buero", { stimmung: "buero_vormittag", figuren: [{ person: "mira", pos: [-1.92, 0, 0.55], dreh: 75, haltung: "sitzen" }, { person: "sam", pos: [0.75, 0, 0.55], dreh: -100, haltung: "stehen" }] });
      setzeKamera(DATA.kameras.buero.schreibtisch); A.ansicht = "schreibtisch";
    },
    los: function () {
      folge([Z().entwurf.start, Z().entwurf.hanna], function () {
        A.kamera.fahreZu(DATA.kameras.buero.dokument, 2.2); A.ansicht = "dokument";
        ANSICHT.fraktionsleiste.zeigen(true); ANSICHT.wirkung.zeigen(true);
        ANSICHT.editor.oeffnen("entwurf", 0, einreichen);
        ANSICHT.editor.nachAenderung();
        setTimeout(function () {
          ANSICHT.fuehrung.zeige("mehrheit", "#fraktionsleiste", function () {
            ANSICHT.fuehrung.zeige("artikel", "#editor .ed-optionen", function () {
              ANSICHT.fuehrung.zeige("wirkung", "#edWirkung", function () { ANSICHT.fuehrung.zeige("einreichen", "#edEinreichen"); });
            });
          });
        }, MOTOR.bewegungReduziert ? 100 : 2300);
      });
    }
  };
  function einreichen() {
    ANSICHT.menues.frage(DATA.texte.editor.einreichenFrage, DATA.texte.editor.einreichen, function () {
      ANSICHT.editor.schliessen();
      ANSICHT.fraktionsleiste.zeigen(false); ANSICHT.wirkung.zeigen(false);
      A.kamera.fahreZu(DATA.kameras.buero.stempel, 1.4); A.ansicht = "stempel";
      LOGIK.stand.eingereicht = true; speichern();
      setTimeout(function () {
        if (A.szene.dokument) WELT.dokument.stempeln(A.szene.dokument, DATA.texte.dokument.stempel.eingereicht);
        setTimeout(function () { folge([Z().entwurf.eingereicht], function () { abend(1, function () { LOGIK.stand.termineUebrig = DATA.spielwerte.termine_flure; A.kapitel(4); }); }); }, 1800);
      }, MOTOR.bewegungReduziert ? 200 : 1500);
    });
  }

  /* =================== Kapitel 4 – Die Flure =================== */
  START[4] = {
    laden: function () {
      A.modus = "flure";
      szeneLaden("gebaeude");
      A.gebDreh = 0; A.ansicht = "gebaeude";
      setzeKamera(gebaeudeKamera(0));
    },
    los: function () {
      folge([LOGIK.stand.versuche > 0 ? Z().flure.extraTermine : Z().flure.start], function () { flurUebersicht(); });
    }
  };
  function gebaeudeKamera(dreh) {
    var G = DATA.kameras.gebaeude, w = (dreh || 0) * M.GRAD, n = G.neigung * M.GRAD;
    var pos = [G.mitte[0] + Math.sin(w) * Math.cos(n) * G.abstand, G.mitte[1] + Math.sin(n) * G.abstand, G.mitte[2] + Math.cos(w) * Math.cos(n) * G.abstand];
    return { pos: pos, ziel: G.mitte.slice(), mm: G.mm, blende: G.blende };
  }
  function flurUebersicht() {
    A.ansicht = "gebaeude";
    var sz = A.szene;
    for (var id in sz.raumGlas) sz.raumGlas[id].forEach(function (o) { o.sichtbar = true; });
    if (sz.raumLicht) sz.raumLicht.aktuell = 0;
    A.kamera.fahreZu(gebaeudeKamera(A.gebDreh), 1.8);
    ANSICHT.fraktionsleiste.zeigen(true);
    ANSICHT.menues.hudAktualisieren();
    ANSICHT.aufgabe.setzen("uebersicht");
    if (LOGIK.stand.termineUebrig <= 0) {
      ANSICHT.menues.flurVerbergen();
      folge([Z().flure.keineTermine], function () { A.kapitel(5); });
      return;
    }
    ANSICHT.menues.flurZeigen(sz.hotspots, flurZiel);
    setTimeout(function () { ANSICHT.fuehrung.zeige("buero", "#hotspots .hotspot.buero"); }, MOTOR.bewegungReduziert ? 100 : 1900);
  }
  function terminVerbrauchen() {
    LOGIK.stand.termineUebrig--;
    var verbraucht = DATA.spielwerte.termine_flure - LOGIK.stand.termineUebrig;
    if (verbraucht >= Math.ceil(DATA.spielwerte.termine_flure / 2)) LOGIK.stand.tag = 2;
    speichern(); ANSICHT.menues.hudAktualisieren();
  }
  function flurZiel(h) {
    var st = LOGIK.stand;
    if (h.art === "cafeteria") {
      if (st.cafeteria[st.tag]) { ANSICHT.menues.hinweis(DATA.texte.flure.cafeteriaSchon); return; }
      st.cafeteria[st.tag] = true;
      var g = Z().flure.geruechte, k = (st.tag - 1) * 3;
      ANSICHT.menues.flurVerbergen();
      raumKamera(h.id, null);
      folge([{ sprecher: "hinweis", text: Z().flure.cafeteria + " " + g[k % g.length] }, { sprecher: "hinweis", text: g[(k + 1) % g.length] }, { sprecher: "hinweis", text: g[(k + 2) % g.length] }], flurUebersicht);
      return;
    }
    if (st.termineUebrig <= 0) return;
    if (h.art === "bibliothek") {
      var frei = DATA.bibliothek.filter(function (id) { return st.dossier.indexOf(id) < 0; });
      if (!frei.length) { ANSICHT.menues.hinweis(DATA.texte.flure.bibliothekLeer); return; }
      ANSICHT.menues.flurVerbergen();
      raumKamera(h.id, null);
      terminVerbrauchen();
      ANSICHT.wahl(DATA.texte.flure.bibliothekTitel, Z().flure.bibliothek, frei.map(function (id) { var k = DATA.karten[id]; return { text: k.text, unter: DATA.texte.dossier.arten[k.art] }; }), function (i) {
        ANSICHT.dossier.neu(frei[i]); flurUebersicht();
      }, { spalten: true });
      return;
    }
    if (h.art === "buero" && h.fraktion && h.fraktion !== "BRUECKE") {
      ANSICHT.menues.flurVerbergen();
      if (MOTOR.ton) MOTOR.ton.spiele("schritte");
      terminVerbrauchen();
      verhandeln(h.fraktion, h.id);
    }
  }
  function raumKamera(raumId, personId) {
    if (A.ohne3D) return;
    var sz = A.szene, rp = sz.raumPos[raumId], G = DATA.kameras.gebaeude.raum;
    if (sz.raumLicht) { sz.raumLicht.pos = [rp.x, rp.y + 2.4, -0.6]; sz.raumLicht.aktuell = DATA.szenen.gebaeude.raumLicht || 6; }
    (sz.raumGlas[raumId] || []).forEach(function (o) { o.sichtbar = false; });
    var ziel = personId && sz.figuren[personId] ? sz.figuren[personId].kopfWelt.slice() : [rp.x, rp.y + 1.2, -1.2];
    A.kamera.fahreZu({ pos: [rp.x - 0.4, rp.y + G.hoehe, 1.6 + G.abstand * 0.4], ziel: ziel, mm: G.mm, blende: G.blende }, MOTOR.bewegungReduziert ? 0.01 : 1.6);
    A.ansicht = "raum";
  }

  /* Ein Verhandlungsgespräch: Anliegen hören – antworten – Ergebnis */
  function anliegenVon(f) {
    var e = LOGIK.entwurf(), best = null, verlust = 0;
    Object.keys(f.anliegen || {}).forEach(function (artId) {
      var art = DATA.artikel.filter(function (a) { return a.id === artId; })[0]; if (!art) return;
      var v = 0;
      art.schrauben.forEach(function (s) {
        var max = -9, jetzt = 0;
        s.optionen.forEach(function (o) { max = Math.max(max, o.haltung[f.id]); if (o.id === e[s.id]) jetzt = o.haltung[f.id]; });
        v += max - jetzt;
      });
      if (v > verlust) { verlust = v; best = artId; }
    });
    return best;
  }
  A.anliegenVon = anliegenVon;
  function verhandeln(fid, raumId) {
    var sz = A.szene, f = DATA.fraktionen.filter(function (x) { return x.id === fid; })[0], person = f.person;
    var P = Z().flure.personen[fid], R = Z().flure.reaktion, st = LOGIK.stand;
    var fig = sz.figuren[person], sam = sz.figuren.sam, rp = sz.raumPos[raumId];
    if (sam && fig) {
      sam.pos = [rp.x - 0.15, rp.y, -0.35];
      sam.dreh = Math.atan2(fig.pos[0] - sam.pos[0], fig.pos[2] - sam.pos[2]) / M.GRAD;
      fig.dreh = Math.atan2(sam.pos[0] - fig.pos[0], sam.pos[2] - fig.pos[2]) / M.GRAD;
      WELT.figuren.aktualisieren(sam, 0, 0); WELT.figuren.aktualisieren(fig, 0, 0);
    }
    raumKamera(raumId, person);
    var besuche = st.flags["besuch_" + fid] || 0; st.flags["besuch_" + fid] = besuche + 1;
    var anl = anliegenVon(f);
    var saetze = [{ sprecher: person, text: P.begruessung, geste: "nicken" }];
    if (!besuche) saetze.push({ sprecher: person, text: P.stark, geste: "hand_heben" });
    if (!anl) { saetze.push({ sprecher: person, text: R.zufrieden }); folge(saetze, function () { setTimeout(flurUebersicht, 300); }); return; }
    saetze.push({ sprecher: person, text: P.anliegen[anl], geste: "auf_papier_zeigen" });
    folge(saetze, function () { verhandlungsZug(f, anl, person); });
  }
  function verhandlungsZug(f, anl, person) {
    var st = LOGIK.stand, A2 = Z().flure.aktionen, R = Z().flure.reaktion, an = f.anliegen[anl];
    var opts = [{ text: A2.karte, aus: !st.dossier.length, art: "karte" }];
    var z = an.zugestaendnis, art = DATA.artikel.filter(function (a) { return a.id === anl; })[0];
    var sch = art.schrauben.filter(function (s) { return s.id === z.schraube; })[0], zo = sch.optionen.filter(function (o) { return o.id === z.option; })[0];
    var schonDrin = LOGIK.entwurf()[z.schraube] === z.option;
    opts.push({ text: A2.zugestaendnis, unter: schonDrin ? DATA.texte.flure.schonDrin : LOGIK.text.ersetzen(art.titel, true) + ": " + LOGIK.text.ersetzen(zo.kurz, true), aus: schonDrin, art: "zug" });
    var hatVersprochen = st.versprechen.some(function (v) { return v.fraktion === f.id; });
    if (an.versprechen) opts.push({ text: A2.versprechen, unter: LOGIK.text.ersetzen(Z().flure.versprechenText[an.versprechen], true), aus: hatVersprochen, art: "versprechen" });
    opts.push({ text: A2.danke, art: "danke" });
    function ende(satz, geste) {
      folge([{ sprecher: person, text: satz, geste: geste }], function () {
        ANSICHT.fraktionsleiste.zeigen(false);
        if ((st.vertrauen[f.id] || 0) >= 2 && !st.flags["wunder_" + f.id]) {
          st.flags["wunder_" + f.id] = true;
          folge([{ sprecher: person, text: Z().flure.personen[f.id].wunder }], function () { speichern(); flurUebersicht(); });
        } else { speichern(); flurUebersicht(); }
      });
    }
    function vertrauen(d) { st.vertrauen[f.id] = M.klemme((st.vertrauen[f.id] || 0) + d, DATA.spielwerte.vertrauen_min, DATA.spielwerte.vertrauen_max); }
    ANSICHT.fraktionsleiste.zeigen(true);
    ANSICHT.aufgabe.setzen("gespraech");
    setTimeout(function () { ANSICHT.fuehrung.zeige("verhandeln", "#wahl"); }, 60);
    ANSICHT.wahl(DATA.figuren.personen[person].name, DATA.texte.flure.wasTun, opts, function (i, o) {
      if (o.art === "karte") {
        ANSICHT.menues.karteWaehlen(function (kid) {
          var k = DATA.karten[kid], gezeigt = st.flags["karte_" + f.id + "_" + kid];
          st.flags["karte_" + f.id + "_" + kid] = true;
          if (gezeigt) return ende(R.schonGehoert);
          var passt = (k.wirktBei || []).indexOf(f.id + "_" + anl) >= 0;
          var faktor = (f.kartenArt || {})[k.art];
          if (passt && !faktor) return ende(R.zeigen, "arme_verschraenken");
          if (!passt) return ende(R.nichtThema, "zuruecklehnen");
          var plus = Math.max(1, Math.round(k.staerke * faktor));
          vertrauen(plus);
          ende(plus >= 2 ? R.ueberzeugt : R.teilweise, "nicken");
        }, function () { verhandlungsZug(f, anl, person); });
      } else if (o.art === "zug") {
        var vorher = LOGIK.mehrheit.ausschuss(LOGIK.entwurf());
        var test = LOGIK.entwurf(); test[z.schraube] = z.option;
        var nachher = LOGIK.mehrheit.ausschuss(test);
        ANSICHT.fraktionsleiste.aktualisieren(vorher, nachher);
        ANSICHT.menues.frage(DATA.texte.flure.zugestaendnisFrage + " „" + LOGIK.text.ersetzen(zo.kurz, true) + "“", DATA.texte.flure.zugestaendnisJa, function () {
          LOGIK.stand.entwurf[z.schraube] = z.option; vertrauen(1);
          ende(R.zugestaendnis, "nicken");
        }, function () { verhandlungsZug(f, anl, person); });
      } else if (o.art === "versprechen") {
        st.versprechen.push({ fraktion: f.id, typ: an.versprechen }); vertrauen(1);
        ende(R.versprechen, "nicken");
      } else ende(R.danke);
    });
  }

  /* =================== Kapitel 5 – Die Ausschussabstimmung =================== */
  START[5] = {
    laden: function () {
      A.modus = "ausschuss";
      szeneLaden("ausschusssaal", { stimmung: "ausschuss", ohneGaeste: true });
      setzeKamera(DATA.kameras.anhoerung.totale); A.ansicht = "totale";
    },
    los: function () {
      folge([Z().ausschuss.start], function () {
        var erg = LOGIK.mehrheit.ausschuss(LOGIK.entwurf());
        var dauer = A.ohne3D ? ANSICHT.dokumentmodus.abstimmung(erg, "sitzeAusschuss") : WELT.szenen.abstimmungZeigen(A.szene, LOGIK.mehrheit.sitzStimmen(erg, "sitzeAusschuss"));
        if (MOTOR.ton) MOTOR.ton.spiele("hammer");
        ANSICHT.menues.zaehler(erg, dauer);
        ANSICHT.halbrundText(LOGIK.mehrheit.alsText(erg));
        setTimeout(function () { ausschussErgebnis(erg); }, (dauer + 1.4) * 1000);
      });
    }
  };
  function ausschussErgebnis(erg) {
    var st = LOGIK.stand;
    st.ergebnis.ausschuss = erg.mehrheit;
    ANSICHT.menues.zaehlerWeg();
    if (erg.mehrheit) {
      folge([Z().ausschuss.erfolg], function () { presse("ausschuss", function () { abend(2, function () { A.kapitel(6); }); }); });
      return;
    }
    st.versuche++;
    if (st.versuche === 1) {
      var n = LOGIK.mehrheit.knappDagegen(erg);
      var s = { sprecher: "mira", text: Z().ausschuss.ohne.text.replace("{fraktionA}", n[0] || "–").replace("{fraktionB}", n[1] || n[0] || "–"), geste: "arme_verschraenken" };
      folge([s], function () { st.termineUebrig = DATA.spielwerte.extra_termine; speichern(); A.kapitel(4, true); });
    } else {
      folge([Z().ausschuss.kompromiss], function () {
        var k = DATA.trilog.kommissionsKompromiss; for (var id in k) st.entwurf[id] = k[id];
        st.wunschzettel = []; st.ergebnis.kompromiss = true; st.ergebnis.ausschuss = true; speichern();
        abend(2, function () { A.kapitel(6); });
      });
    }
  }
  function presse(art, weiter) {
    var p = Z().presse[art];
    folge([{ sprecher: "clara", text: p.text }], function (i) { LOGIK.stand.presse.push(p.antworten[i || 0].haltung); speichern(); weiter(); }, p.antworten.map(function (a) { return a.text; }));
  }

  /* =================== Kapitel 6 – Der Trilog =================== */
  START[6] = {
    laden: function () {
      A.modus = "trilog";
      szeneLaden("trilog");
      A.trilogWinkel = 0.6; A.ansicht = "trilog";
      A.seitenBezug = [0, 0, 1];
      setzeKamera(trilogKamera(A.trilogWinkel));
    },
    los: function () {
      var st = LOGIK.stand, T = DATA.trilog;
      var e = LOGIK.entwurf();
      var zeilen = [];
      DATA.artikel.forEach(function (a) { a.schrauben.forEach(function (s) { zeilen.push({ artikel: a, schraube: s, komm: s.start, parl: e[s.id], rat: (T.positionen[s.id] || {}).rat || s.start, mw: (T.positionen[s.id] || {}).mittelweg }); }); });
      zeilen.push({ artikel: { titel: DATA.umsetzungsfrist.titel, id: "frist" }, schraube: DATA.umsetzungsfrist, frist: true, komm: "mittel", parl: e.frist || "kurz", rat: T.positionen.frist.rat, mw: T.positionen.frist.mittelweg });
      // Neuer Anlauf: der Rat ist beweglicher (Spielwert)
      var budget = DATA.spielwerte.rat_nachgeben + (st.dossier.indexOf("karin_vorlagen") >= 0 ? 0.5 : 0) + st.neuerAnlauf * T.neuerAnlaufBonus;
      A.trilog = { zeilen: zeilen, budget: budget, wahl: {}, bruecke: T.bruecken, uhr: 0, dolmetscher: false };
      zeilen.forEach(function (z) { A.trilog.wahl[z.schraube.id] = z.parl === z.rat ? "gleich" : null; });
      var saetze = Z().trilog.start.slice();
      if (st.wunschzettel.length) saetze.push(Z().trilog.wunsch);
      if (st.dossier.indexOf("karin_vorlagen") >= 0) saetze.push(Z().trilog.karin);
      saetze.push({ sprecher: "hinweis", text: Z().trilog.erklaerung });
      folge(saetze, function () {
        st.wunschzettel = []; ANSICHT.menues.trilogTabelle(A.trilog, trilogWahl, trilogAbschluss); trilogBlatt();
        ANSICHT.aufgabe.setzen("tabelle");
        setTimeout(function () { ANSICHT.fuehrung.zeige("trilog", "#trilogTabelle table"); }, 60);
      });
    }
  };
  function trilogKamera(w) {
    var K = DATA.kameras.trilog;
    return { pos: [K.mitte[0] + Math.sin(w) * K.abstand, K.hoehe, K.mitte[2] + Math.cos(w) * K.abstand], ziel: K.mitte.slice(), mm: K.mm, blende: K.blende };
  }
  function trilogVerbraucht() {
    var v = 0, T = A.trilog;
    T.zeilen.forEach(function (z) { var w = T.wahl[z.schraube.id]; if (w === "parl") v += 1; else if (w === "mitte") v += 0.5; });
    return v;
  }
  A.trilogVerbraucht = trilogVerbraucht;
  function trilogBlatt() { if (A.szene && A.szene.trilogBlatt) ANSICHT.menues.trilogBlattZeichnen(A.szene.trilogBlatt, A.trilog); }
  function trilogWahl(id, wahl) {
    var T = A.trilog, alt = T.wahl[id];
    T.wahl[id] = wahl;
    if (trilogVerbraucht() > T.budget + 1e-6) {
      T.wahl[id] = alt;
      folge([Z().trilog.mandat]);
      return false;
    }
    T.uhr = Math.min(3, T.uhr + 0.3);
    var sz = A.szene, u = Math.floor(T.uhr);
    if (u < Z().trilog.uhr.length && !T["uhr" + u]) { T["uhr" + u] = true; ANSICHT.menues.hinweis(Z().trilog.uhr[u]); }
    if (sz.trilogBecher) sz.trilogBecher.forEach(function (b, i) { b.forEach(function (o) { o.sichtbar = i < 2 + Math.round(T.uhr * 2.3); }); });
    if (id === DATA.trilog.dolmetscherBei && !T.dolmetscher) {
      T.dolmetscher = true;
      folge([Z().trilog.dolmetscher], function (i) {
        if (i === 0) { LOGIK.stand.flags.praezisiert = true; folge([Z().trilog.dolmetscherDanke]); }
        ANSICHT.menues.trilogTabelle(T, trilogWahl, trilogAbschluss);
      }, [DATA.texte.trilog.praezisieren, DATA.texte.trilog.nichtPraezisieren]);
    }
    trilogBlatt();
    ANSICHT.aufgabe.aktualisieren();
    return true;
  }
  A.trilogBruecke = function (id) {
    var T = A.trilog; if (T.bruecke <= 0) return;
    var z = T.zeilen.filter(function (x) { return x.schraube.id === id; })[0];
    if (!z || z.mw) return;
    var ops = z.schraube.optionen.map(function (o) { return o.id; }), ip = ops.indexOf(z.parl), ir = ops.indexOf(z.rat);
    var mitte = ops[Math.round((ip + ir) / 2)];
    if (mitte === z.parl || mitte === z.rat) mitte = ops[M.klemme(ip > ir ? ip - 1 : ip + 1, 0, ops.length - 1)];
    z.mw = { option: mitte, text: DATA.texte.trilog.brueckeText };
    T.bruecke--;
    folge([Z().trilog.bruecke], function () { ANSICHT.menues.trilogTabelle(T, trilogWahl, trilogAbschluss); });
  };
  function trilogKompromiss() {
    var T = A.trilog, k = {};
    T.zeilen.forEach(function (z) {
      var w = T.wahl[z.schraube.id];
      k[z.schraube.id] = w === "parl" || w === "gleich" ? z.parl : (w === "mitte" ? z.mw.option : z.rat);
    });
    return k;
  }
  A.trilogKompromiss = trilogKompromiss;
  function trilogAbschluss() {
    var T = A.trilog, st = LOGIK.stand;
    var offen = T.zeilen.filter(function (z) { return !T.wahl[z.schraube.id]; });
    if (offen.length) { ANSICHT.menues.hinweis(DATA.texte.trilog.nochOffen); return; }
    var k = trilogKompromiss(), test = {};
    for (var id in k) test[id] = k[id];
    test.__praezise = !!st.flags.praezisiert;
    var w = LOGIK.mehrheit.wirkung(test);
    if (w.recht < 3) { folge([Z().trilog.rechtZuSchwach]); return; }
    var saetze = [];
    st.versprechen.forEach(function (v) {
      var gehalten = v.typ === "frist_lang" ? k.frist === "lang" : true;
      v.gehalten = gehalten;
      if (!gehalten) st.vertrauen[v.fraktion] = M.klemme((st.vertrauen[v.fraktion] || 0) - 2, -3, 3);
      saetze.push(gehalten ? Z().trilog.versprechenGehalten : Z().trilog.versprechenGebrochen);
    });
    for (id in k) st.entwurf[id] = k[id];
    st.trilog = k; speichern();
    ANSICHT.menues.trilogWeg();
    A.szene.morgen = 1;
    saetze.push(Z().trilog.ende);
    folge(saetze, function () { A.kapitel(7); });
  }

  /* =================== Kapitel 7 – Das Plenum =================== */
  START[7] = {
    laden: function () {
      A.modus = "plenum";
      szeneLaden("plenum");
      setzeKamera(DATA.kameras.plenum.saal);
    },
    los: function () {
      var st = LOGIK.stand, P = Z().plenum, bonus = {};
      function plus(w) { for (var f in w) bonus[f] = (bonus[f] || 0) + w[f]; }
      folge([P.start, P.saaldiener], function () {
        setzeKamera(DATA.kameras.plenum.rede);
        ANSICHT.aufgabe.setzen("rede");
        setTimeout(function () { ANSICHT.fuehrung.zeige("rede", "#wahl"); }, 60);
        ANSICHT.wahl(DATA.texte.plenum.einstieg, null, P.einstieg.map(function (o) { return { text: o.kurz, unter: o.text }; }), function (i) {
          plus(P.einstieg[i].wirkt);
          folge([{ sprecher: "sam", text: P.einstieg[i].text, geste: "hand_heben" }], function () {
            ANSICHT.wahl(DATA.texte.plenum.kern, null, DATA.artikel.map(function (a) { return { text: a.titel, unter: a.kurzfassung }; }), function (j) {
              var art = DATA.artikel[j], e = LOGIK.entwurf();
              DATA.fraktionen.forEach(function (f) {
                if ((f.kernanliegen || []).indexOf(art.id) < 0) return;
                var gut = art.schrauben.every(function (s) { var o = s.optionen.filter(function (x) { return x.id === e[s.id]; })[0]; return o && o.haltung[f.id] >= 0; });
                bonus[f.id] = (bonus[f.id] || 0) + (gut ? 0.8 : -0.3);
              });
              var kern = P.kern.replace("{artikel}", art.titel).replace("{kurzfassung}", art.kurzfassung);
              folge([{ sprecher: "sam", text: kern, geste: "auf_papier_zeigen" }], function () {
                ANSICHT.wahl(DATA.texte.plenum.schluss, null, P.schluss.map(function (o) { return { text: o.kurz, unter: o.text }; }), function (k) {
                  plus(P.schluss[k].wirkt);
                  folge([{ sprecher: "sam", text: P.schluss[k].text, geste: "hand_heben" }], function () { st.rede = bonus; speichern(); plenumAbstimmung(bonus); });
                }, { spalten: true });
              });
            }, { spalten: true });
          });
        }, { spalten: true });
      });
    }
  };
  function plenumAbstimmung(bonus) {
    ANSICHT.aufgabe.setzen("abstimmung");
    var e = LOGIK.entwurf(); e.__bonus = bonus;
    var erg = LOGIK.mehrheit.plenum(e);
    var P = Z().plenum;
    folge([P.saaldiener], function () {
      if (!MOTOR.bewegungReduziert) A.kamera.starteFahrt(DATA.kameras.plenum.kran); else setzeKamera(DATA.kameras.plenum.saal);
      if (MOTOR.ton) MOTOR.ton.spiele("gemurmel");
      var dauer = A.ohne3D ? ANSICHT.dokumentmodus.abstimmung(erg, "sitzePlenum") : WELT.szenen.abstimmungZeigen(A.szene, LOGIK.mehrheit.sitzStimmen(erg, "sitzePlenum"));
      ANSICHT.menues.zaehler(erg, dauer);
      ANSICHT.halbrundText(LOGIK.mehrheit.alsText(erg));
      setTimeout(function () {
        ANSICHT.menues.zaehlerWeg();
        setzeKamera(DATA.kameras.plenum.blatt);
        var text = erg.mehrheit ? DATA.texte.dokument.stempel.angenommen : DATA.texte.dokument.stempel.abgelehnt;
        setTimeout(function () {
          if (!A.ohne3D) WELT.dokument.plenumStempeln(A.szene, text);
          setTimeout(function () { plenumErgebnis(erg); }, 2200);
        }, 900);
      }, Math.max(dauer + 1.5, MOTOR.bewegungReduziert ? 2 : 16.5) * 1000);
    });
  }
  function plenumErgebnis(erg) {
    var st = LOGIK.stand, P = Z().plenum;
    st.ergebnis.plenum = erg.mehrheit; speichern();
    if (erg.mehrheit) {
      folge([P.angenommen], function () { presse("plenum", function () { A.kapitel(8); }); });
    } else {
      var n = LOGIK.mehrheit.knappDagegen(erg);
      var s = { sprecher: "mira", text: P.abgelehnt.text.replace("{fraktionA}", n[0] || "–").replace("{fraktionB}", n[1] || n[0] || "–") };
      folge([s], function () {
        presse("plenum", function () {
          ANSICHT.wahl(DATA.texte.plenum.wieWeiter, P.neuerAnlauf, [{ text: DATA.texte.plenum.anlauf }, { text: DATA.texte.plenum.zumEpilog }], function (i) {
            if (i === 0) { st.neuerAnlauf++; speichern(); A.kapitel(6); }
            else A.kapitel(8);
          });
        });
      });
    }
  }

  /* =================== Epilog – Fünf Jahre später =================== */
  A.grundstimmung = function () {
    var z = { mutig: 0, pragmatisch: 0, vorsichtig: 0 };
    LOGIK.stand.abendantworten.concat(LOGIK.stand.presse).forEach(function (h) { z[h] = (z[h] || 0) + 1; });
    return Object.keys(z).sort(function (a, b) { return z[b] - z[a]; })[0] || "pragmatisch";
  };
  A.epilogStuecke = function () {
    var st = LOGIK.stand, e = LOGIK.entwurf(), w = LOGIK.mehrheit.wirkung(e);
    var ctx = { wissen: w.wissen, durchsetzung: w.durchsetzung, aufwand: w.aufwand, recht: w.recht, angenommen: !!st.ergebnis.plenum,
      kompromiss: !!st.ergebnis.kompromiss, wunsch: !!st.flags.wunschVersucht, grundstimmung: A.grundstimmung() };
    for (var k in e) if (k.indexOf("__") !== 0) ctx[k] = e[k];
    var namen = Object.keys(ctx), werte = namen.map(function (n) { return ctx[n]; });
    var gewaehlt = {}, liste = [];
    DATA.epilog.bausteine.forEach(function (b) {
      if (gewaehlt[b.figur]) return;
      var ok = true;
      if (b.bedingung) { try { ok = !!(new Function(namen.join(","), "return (" + b.bedingung + ");")).apply(null, werte); } catch (x) { ok = false; console.warn("Epilog-Bedingung fehlerhaft: " + b.bedingung); } }
      if (ok) { gewaehlt[b.figur] = true; var p = DATA.figuren.personen[b.figur]; liste.push({ art: b.art, text: b.text, name: p ? p.name : "", figur: b.figur }); }
    });
    return liste;
  };
  START[8] = {
    laden: function () {
      A.modus = "epilog";
      A.epilog = A.epilogStuecke();
      szeneLaden("epilog", { stuecke: A.epilog });
      A.epilogIndex = 0;
      epilogKamera(0, true);
    },
    los: function () {
      hud(false);
      var gs = A.grundstimmung();
      if (MOTOR.ton) MOTOR.ton.spiele(gs === "mutig" ? "motiv" : (gs === "vorsichtig" ? "motivDunkel" : "motivOffen"));
      ANSICHT.menues.epilogZeigen(A.epilog, A.grundstimmung(), function (i) { A.epilogIndex = i; epilogKamera(i); }, function () { A.kapitel(9); });
    }
  };
  function epilogKamera(i, sofort) {
    var sz = A.szene; if (!sz || !sz.collage || !sz.collage.length) return;
    var c = sz.collage[Math.min(i, sz.collage.length - 1)], K = DATA.kameras.epilog;
    var e = { pos: [c.pos[0] + 0.05, c.pos[1] + K.hoehe, c.pos[2] + 0.42], ziel: [c.pos[0], c.pos[1], c.pos[2]], mm: K.mm, blende: K.blende };
    if (sofort) setzeKamera(e); else A.kamera.fahreZu(e, 2.4);
  }

  /* =================== So ist es wirklich =================== */
  START[9] = {
    laden: function () { A.modus = "vergleich"; },
    los: function () { hud(false); ANSICHT.menues.vergleichZeigen(); }
  };

  /* ---------- Kamera im Gespräch ---------- */
  A.gespraechKamera = function (sprecherId) {
    var sz = A.szene; if (!sz || !sz.figuren) return;
    var S = sz.figuren[sprecherId];
    if (!S) return;
    if (A.modus === "anhoerung") {
      var K = DATA.kameras.anhoerung.gast, k = S.kopfWelt;
      setzeKamera({ pos: [k[0] + 0.15, k[1] + K.hoehe, k[2] + K.abstand], ziel: [k[0], k[1] - 0.12, k[2]], mm: K.mm, blende: K.blende });
      A.ansicht = "gast"; return;
    }
    if (A.modus === "plenum") {
      if (sprecherId === "sam") setzeKamera(DATA.kameras.plenum.rede);
      else { var kk = S.kopfWelt; setzeKamera({ pos: [kk[0] + 1.2, kk[1] + 0.1, kk[2] + 2.0], ziel: [kk[0], kk[1] - 0.15, kk[2]], mm: 55, blende: 2.8 }); }
      return;
    }
    if (sprecherId === "dolmetscher") { var kd = S.kopfWelt; setzeKamera({ pos: [kd[0] + 0.6, kd[1] - 0.3, kd[2] + 3.0], ziel: [kd[0], kd[1] - 0.05, kd[2]], mm: 60, blende: 2.8 }); A.ansicht = "gespraech"; return; }
    var L = sz.figuren.sam && sprecherId !== "sam" ? sz.figuren.sam : null;
    if (!L) for (var p in sz.figuren) if (p !== sprecherId && p !== "dolmetscher") { L = sz.figuren[p]; break; }
    if (!L) return;
    var G = DATA.kameras.gespraech, sk = S.kopfWelt, lk = L.kopfWelt;
    var richtung = M.norm([lk[0] - sk[0], 0, lk[2] - sk[2]]);
    var seite = M.norm(M.kreuz([0, 1, 0], richtung));
    if (M.punkt(seite, A.seitenBezug || [0, 0, 1]) < 0) seite = M.mal(seite, -1);
    var pos = M.plus(M.plus(lk, M.mal(richtung, G.schulterAbstand)), M.plus(M.mal(seite, G.schulterSeite), [0, G.schulterHoehe, 0]));
    setzeKamera({ pos: pos, ziel: [sk[0], sk[1] - 0.2, sk[2]], mm: G.mm, blende: G.blende, fokus: M.abstand(pos, sk) });
    A.ansicht = "gespraech";
  };

  /* Nach einem Gespräch: Kamera zurück in die Grundeinstellung des Ortes */
  A.nachGespraech = function () {
    if (A.modus === "trilog") { A.ansicht = "trilog"; setzeKamera(trilogKamera(A.trilogWinkel)); }
    else if ((A.modus === "k1" || A.modus === "entwurf") && A.ansicht === "gespraech") {
      setzeKamera(ANSICHT.editor.offen ? DATA.kameras.buero.dokument : DATA.kameras.buero.totale);
      A.ansicht = ANSICHT.editor.offen ? "dokument" : "totale";
    }
    else if ((A.modus === "anhoerung" || A.modus === "ausschuss") && A.ansicht === "gast") { setzeKamera(DATA.kameras.anhoerung.totale); A.ansicht = "totale"; }
    else if (A.modus === "plenum" && A.ansicht === "gespraech") setzeKamera(DATA.kameras.plenum.rede);
  };

  /* ---------- Jedes Bild ---------- */
  A.schritt = function (dt) {
    var sz = A.szene; if (!sz) return;
    if (A.modus === "titel" && !A.kamera.fahrt && sz.titel && sz.titel.zeit > 1 && !MOTOR.bewegungReduziert) {
      var S = DATA.kameras.fahrten.titel_schleife;
      var t = (sz.titel.zeit % S.dauer) / S.dauer * Math.PI * 2;
      var w = M.glatt(0, 4, sz.titel.zeit - DATA.kameras.fahrten.titel.punkte[DATA.kameras.fahrten.titel.punkte.length - 1].t);
      A.kamera.pos = [S.mitte[0] + Math.sin(t) * S.ausschlag[0] * w, S.mitte[1] + Math.sin(t * 2) * S.ausschlag[1] * w, S.mitte[2] + (Math.cos(t) - 1) * S.ausschlag[2] * w];
      A.kamera.ziel = S.ziel.slice();
    }
    if (A.modus === "flure" && A.ansicht === "gebaeude") {
      var d = (A.tasten.e ? 1 : 0) - (A.tasten.q ? 1 : 0), zieh = A.ziehDreh || 0;
      A.ziehDreh = 0;
      if (d || zieh) {
        var G = DATA.kameras.gebaeude;
        A.gebDreh = M.klemme(A.gebDreh + d * dt * 25 + zieh, -G.drehMax, G.drehMax);
        var e = gebaeudeKamera(A.gebDreh); A.kamera.fahrt = null; A.kamera.pos = e.pos; A.kamera.ziel = e.ziel;
      }
      ANSICHT.menues.flurPositionen(A.kamera);
    }
    if (A.modus === "trilog" && A.ansicht === "trilog" && !LOGIK.gespraech.aktiv && !MOTOR.bewegungReduziert && !A.kamera.fahrt) {
      A.trilogWinkel += dt * DATA.kameras.trilog.kreis;
      var tk = trilogKamera(A.trilogWinkel); A.kamera.pos = tk.pos; A.kamera.ziel = tk.ziel;
    }
    if (A.modus === "trilog" && A.trilog) sz.morgen = Math.max(sz.morgen || 0, M.klemme((A.trilog.uhr - 2.2) / 1.2, 0, 0.6));
    if (ANSICHT.editor.offen) ANSICHT.editor.schritt(A.kamera);
  };
  window.addEventListener("keydown", function (e) { if (e.key) A.tasten[e.key.toLowerCase()] = true; });
  window.addEventListener("keyup", function (e) { if (e.key) A.tasten[e.key.toLowerCase()] = false; });

  A.seitenBezug = [0, 0, 1];
  A.START = START;
  return A;
})();
