/* =====================================================================
   js/logik/ablauf.js – Ablauf: Titel, Kapitel, Übergänge
   ---------------------------------------------------------------------
   Phase 1: Titel (Plenarsaal) → „Neue Legislatur“ → Büro als Stil-
   Prototyp mit Beispiel-Gespräch, Gesetzespapier, Glasmodell, Stempel.
   ===================================================================== */
var LOGIK = window.LOGIK || {};

LOGIK.ablauf = (function () {
  var A = { szene: null, modus: "laden", kamera: null, ansicht: "totale", stimmungB: "buero_morgen" };
  var M = MOTOR.m;

  A.init = function (kamera) { A.kamera = kamera; };

  function szeneLaden(name) {
    if (A.szene) WELT.szenen.freigeben(A.szene);
    A.szene = WELT.szenen.bauen(name, A.kamera);
    MOTOR.post.verlaufLoeschen();
    ANSICHT.szenenText(DATA.texte.szenen[DATA.szenen[name].beschreibung] || "");
    if (MOTOR.ton) MOTOR.ton.raum(name === "plenarsaal" ? 2.8 : 0.7);
  }
  A.szeneNeuAufbauen = function () {
    var name = A.szene ? A.szene.name : "plenarsaal";
    var alt = A.szene; A.szene = null;
    A.szene = WELT.szenen.bauen(name, A.kamera);
    if (alt && alt.titel && A.szene.titel) A.szene.titel.zeit = alt.titel.zeit;
    if (name === "buero" && A.stimmungB !== DATA.szenen.buero.stimmung) WELT.szenen.stimmungWechseln(A.szene, A.stimmungB);
  };

  /* ---------- Titel ---------- */
  A.titel = function () {
    A.modus = "titel";
    szeneLaden("plenarsaal");
    var F = DATA.kameras.fahrten;
    if (MOTOR.bewegungReduziert) {
      var p = F.titel.punkte[F.titel.punkte.length - 1];
      A.kamera.setze(p);
      WELT.szenen.titelUeberspringen(A.szene);
    } else {
      A.kamera.setze(F.titel.punkte[0]);
      A.kamera.starteFahrt(F.titel);
    }
    ANSICHT.menues.titelZeigen();
    if (MOTOR.ton) MOTOR.ton.spiele("titel");
  };

  A.titelUeberspringen = function () {
    if (A.modus !== "titel" || !A.szene || !A.szene.titel) return;
    var F = DATA.kameras.fahrten.titel;
    if (A.kamera.fahrt && A.kamera.fahrt.art === "pfad") {
      MOTOR.post.ueberblenden(0.8);
      A.kamera.setze(F.punkte[F.punkte.length - 1]);
      WELT.szenen.titelUeberspringen(A.szene);
    }
  };

  /* ---------- Kapitel (Phase 1: Büro-Prototyp) ---------- */
  A.neueLegislatur = function () {
    LOGIK.stand = LOGIK.neuerStand();
    LOGIK.speicher.speichern();
    A.kapitel(1);
  };
  A.weiterspielen = function () {
    var r = LOGIK.speicher.laden();
    if (r === "alt") { ANSICHT.menues.hinweis(DATA.texte.menue.speichernNichtMoeglich); }
    A.kapitel(LOGIK.stand.kapitel || 1);
  };

  A.kapitel = function (nr) {
    ANSICHT.menues.titelVerbergen();
    ANSICHT.blende(true, function () {
      A.modus = "buero";
      szeneLaden("buero");
      A.stimmungB = DATA.szenen.buero.stimmung;
      A.kamera.setze(DATA.kameras.buero.totale);
      A.ansicht = "totale";
      ANSICHT.blende(false);
      ANSICHT.menues.kapitelKarte(nr, function () { ANSICHT.menues.probeZeigen(); });
      LOGIK.stand.kapitel = nr;
      LOGIK.speicher.speichern();
    });
  };

  A.zumTitel = function () {
    if (LOGIK.gespraech.aktiv) LOGIK.gespraech.beenden();
    ANSICHT.menues.probeVerbergen();
    ANSICHT.blende(true, function () { A.titel(); ANSICHT.blende(false); });
  };

  /* ---------- Kamera im Gespräch: Schuss/Gegenschuss über die Schulter ---------- */
  A.gespraechKamera = function (sprecherId, art) {
    var sz = A.szene; if (!sz || !sz.figuren) return;
    var S = sz.figuren[sprecherId], L = null;
    for (var p in sz.figuren) if (p !== sprecherId) L = sz.figuren[p];
    if (!S || !L || art === "totale") return;
    var K = DATA.kameras.gespraech;
    var sk = S.kopfWelt, lk = L.kopfWelt;
    var richtung = M.norm([lk[0] - sk[0], 0, lk[2] - sk[2]]);
    var seite = M.norm(M.kreuz([0, 1, 0], richtung));
    if (seite[2] < 0) seite = M.mal(seite, -1);
    var pos = M.plus(M.plus(lk, M.mal(richtung, K.schulterAbstand)), M.plus(M.mal(seite, K.schulterSeite), [0, K.schulterHoehe, 0]));
    var ziel = [sk[0], sk[1] - 0.2, sk[2]];
    MOTOR.post.verlaufLoeschen();
    A.kamera.setze({ pos: pos, ziel: ziel, mm: K.mm, blende: K.blende, fokus: M.abstand(pos, sk) });
    A.ansicht = "gespraech";
  };

  /* ---------- Bedienleiste des Prototyps ---------- */
  A.probe = function (aktion) {
    var sz = A.szene; if (!sz || A.modus !== "buero") return;
    var K = DATA.kameras.buero;
    if (aktion !== "gespraech" && LOGIK.gespraech.aktiv) LOGIK.gespraech.beenden();
    if (aktion === "totale") { A.kamera.fahreZu(K.totale, 2.4); A.ansicht = "totale"; }
    else if (aktion === "gespraech") {
      if (LOGIK.gespraech.aktiv) return;
      LOGIK.gespraech.starte("probe_luca", function () { A.kamera.setze(K.totale); MOTOR.post.verlaufLoeschen(); A.ansicht = "totale"; });
    }
    else if (aktion === "dokument") { A.kamera.fahreZu(K.dokument, 2.2); A.ansicht = "dokument"; }
    else if (aktion === "halbrund") {
      A.kamera.fahreZu(K.halbrund, 2.0); A.ansicht = "halbrund";
    }
    else if (aktion === "option") {
      if (A.ansicht !== "dokument") { A.kamera.fahreZu(K.dokument, 1.6); A.ansicht = "dokument"; }
      var doc = sz.dokument, art = DATA.artikel[0], sch = art.schrauben[0];
      if (doc.blatt === 1 && !doc.blaettern) WELT.dokument.umblaettern(doc);
      var opts = sch.optionen.map(function (o) { return o.id; });
      var jetzt = doc.seiten[1].daten.auswahl[sch.id];
      var naechste = opts[(opts.indexOf(jetzt) + 1) % opts.length];
      WELT.dokument.optionSetzen(doc, sch.id, naechste);
      LOGIK.stand.entwurf[sch.id] = naechste;
      LOGIK.speicher.baldSpeichern();
      var erg = LOGIK.mehrheit.ausschuss(LOGIK.mehrheit.probeEntwurf(sz));
      WELT.szenen.halbrundSetzen(sz, erg);
      ANSICHT.halbrundText(LOGIK.mehrheit.alsText(erg));
      // Schärfe ziehen vom Papier zum Glasmodell, wenn sich die Mehrheit ändert
      setTimeout(function () { if (A.ansicht === "dokument") A.kamera.schaerfeZiehen(M.abstand(A.kamera.pos, sz.glasmodell ? M.punktMal(sz.glasmodell.basis, [0, 0, 0]) : A.kamera.ziel)); }, 1700);
      setTimeout(function () { if (A.ansicht === "dokument") A.kamera.schaerfeZiehen(M.abstand(A.kamera.pos, A.kamera.ziel)); }, 3600);
    }
    else if (aktion === "umblaettern") {
      if (A.ansicht !== "dokument") { A.kamera.fahreZu(K.dokument, 1.6); A.ansicht = "dokument"; }
      WELT.dokument.umblaettern(sz.dokument);
    }
    else if (aktion === "stempel") {
      if (A.ansicht !== "stempel") { A.kamera.fahreZu(K.stempel, 1.4); A.ansicht = "stempel"; }
      setTimeout(function () { WELT.dokument.stempeln(sz.dokument, DATA.texte.dokument.stempel.eingereicht); }, MOTOR.bewegungReduziert ? 200 : 1300);
    }
    else if (aktion === "licht") {
      A.stimmungB = A.stimmungB === "buero_morgen" ? "buero_vormittag" : "buero_morgen";
      MOTOR.post.ueberblenden(1.0);
      WELT.szenen.stimmungWechseln(sz, A.stimmungB);
      ANSICHT.menues.probeAktualisieren();
    }
    else if (aktion === "titel") A.zumTitel();
  };

  /* ---------- Jedes Bild ---------- */
  A.schritt = function (dt) {
    var sz = A.szene; if (!sz) return;
    if (A.modus === "titel" && !A.kamera.fahrt && sz.titel && sz.titel.zeit > 1 && !MOTOR.bewegungReduziert) {
      // ruhige Schleife über dem Blatt
      var S = DATA.kameras.fahrten.titel_schleife;
      var t = (sz.titel.zeit % S.dauer) / S.dauer * Math.PI * 2;
      var w = M.glatt(0, 4, sz.titel.zeit - DATA.kameras.fahrten.titel.punkte[DATA.kameras.fahrten.titel.punkte.length - 1].t);
      A.kamera.pos = [S.mitte[0] + Math.sin(t) * S.ausschlag[0] * w, S.mitte[1] + Math.sin(t * 2) * S.ausschlag[1] * w, S.mitte[2] + (Math.cos(t) - 1) * S.ausschlag[2] * w];
      A.kamera.ziel = S.ziel.slice();
    }
  };

  return A;
})();
