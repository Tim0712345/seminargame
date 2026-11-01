/* =====================================================================
   js/logik/stand.js – Spielstand und Speichern (Abschnitt 5.1 und 5.9)
   ---------------------------------------------------------------------
   Alles, was das Spiel weiß, steht in LOGIK.stand. Gespeichert wird in
   einem einzigen Spielstand (localStorage, nur mit try/catch).
   ===================================================================== */
var LOGIK = window.LOGIK || {};

LOGIK.STAND_VERSION = 1;

LOGIK.neuerStand = function () {
  var v = {};
  DATA.fraktionen.forEach(function (f) { v[f.id] = f.startVertrauen || 0; });
  return {
    version: LOGIK.STAND_VERSION,
    name: "Sam", kapitel: 1, termineUebrig: DATA.spielwerte.termine_flure,
    entwurf: {}, wunschzettel: [], vertrauen: v, dossier: [], versprechen: [],
    abendantworten: [], presse: [], ergebnis: {}, flags: {}, gefragt: [], tag: 1, cafeteria: {}, bibliothek: false,
    trilog: null, rede: null, versuche: 0, neuerAnlauf: 0, eingereicht: false
  };
};

/* Aktueller Entwurf: gewählte Optionen, sonst der Vorschlag der Kommission */
LOGIK.entwurf = function (stand) {
  var st = stand || LOGIK.stand, e = {};
  DATA.artikel.forEach(function (a) { a.schrauben.forEach(function (s) { e[s.id] = st.entwurf[s.id] || s.start; }); });
  if (st.entwurf.frist) e.frist = st.entwurf.frist;
  e.__wunsch = (st.wunschzettel || []).slice();
  if (st.flags && st.flags.praezisiert) e.__praezise = true;
  return e;
};

LOGIK.stand = LOGIK.neuerStand();

LOGIK.speicher = (function () {
  var S = { schluessel: "mehrheit_spielstand", moeglich: true, zeitgeber: null };
  try { var t = "__mehrheit_test__"; localStorage.setItem(t, "1"); localStorage.removeItem(t); }
  catch (e) { S.moeglich = false; }

  S.vorhanden = function () {
    if (!S.moeglich) return false;
    try { return !!localStorage.getItem(S.schluessel); } catch (e) { return false; }
  };
  S.speichern = function () {
    if (!S.moeglich) return false;
    try { localStorage.setItem(S.schluessel, JSON.stringify(LOGIK.stand)); return true; } catch (e) { return false; }
  };
  /* mit kurzer Verzögerung (z. B. nach jeder Entwurfsänderung) */
  S.baldSpeichern = function () {
    if (S.zeitgeber) clearTimeout(S.zeitgeber);
    S.zeitgeber = setTimeout(S.speichern, 800);
  };
  /* Rückgabe: "ok", "keiner" oder "alt" (inkompatible Version) */
  S.laden = function () {
    if (!S.moeglich) return "keiner";
    try {
      var roh = localStorage.getItem(S.schluessel);
      if (!roh) return "keiner";
      var st = JSON.parse(roh);
      if (!st || st.version !== LOGIK.STAND_VERSION) return "alt";
      var neu = LOGIK.neuerStand();
      for (var k in neu) if (st[k] === undefined) st[k] = neu[k];
      LOGIK.stand = st;
      return "ok";
    } catch (e) { return "alt"; }
  };
  S.loeschen = function () { try { localStorage.removeItem(S.schluessel); } catch (e) {} };

  /* Einstellungen getrennt vom Spielstand */
  S.einstellungenLaden = function () {
    var std = { grafik: "auto", tiefe: true, korn: true, helligkeit: 1, ton: true, lautMusik: 0.35, lautGeraeusche: 0.5,
                schrift: 100, kontrast: false, bewegung: null, schreibmaschine: "normal", lesehilfe: false };
    try {
      var roh = localStorage.getItem("mehrheit_einstellungen");
      if (roh) { var e = JSON.parse(roh); for (var k in e) std[k] = e[k]; }
    } catch (e) {}
    if (std.bewegung === null) {
      try { std.bewegung = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { std.bewegung = false; }
    }
    return std;
  };
  S.einstellungenSpeichern = function (e) {
    try { localStorage.setItem("mehrheit_einstellungen", JSON.stringify(e)); } catch (x) {}
  };
  return S;
})();
