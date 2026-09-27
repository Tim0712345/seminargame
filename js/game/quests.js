/* =====================================================================
   Die Lücke – Spielstand, Flags und Quests
   ---------------------------------------------------------------------
   GAME.zustand ist das zentrale Objekt für den Fortschritt:
     flags   – { name: true }  (gesetzt durch Dialoge, Funde, Aktionen)
     notizen – IDs aus DATA.notes (fürs Notizbuch, Phase 3)
     beweise – Länderkürzel der gefundenen Beweisstücke ("de", "se" …)
     gesehen – besuchte Dialogknoten (für ausgegraute Antworten)
     finale  – { punkte, max, massnahmen: [...] } nach dem Ausschuss
   Bedingungen als Text: "flag", "!flag", "a&b", "a|b" (& vor |).
   GAME.speicher: automatisches Speichern in einem Slot (localStorage).
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.zustand = { flags: {}, notizen: [], beweise: [], gesehen: {}, finale: null };

GAME.flags = (function () {
  "use strict";
  var F = {};
  var beobachter = [];

  F.hat = function (name) { return !!GAME.zustand.flags[name]; };

  F.setzen = function (name, wert) {
    if (!name) return;
    if (Array.isArray(name)) { name.forEach(function (n) { F.setzen(n, wert); }); return; }
    var alt = !!GAME.zustand.flags[name];
    GAME.zustand.flags[name] = wert !== false;
    if (!wert && wert !== undefined) delete GAME.zustand.flags[name];
    if (alt !== F.hat(name)) beobachter.forEach(function (b) { b(name, F.hat(name)); });
  };

  // Bedingung prüfen: leer = erfüllt
  F.pruefen = function (bed) {
    if (!bed) return true;
    return bed.split("|").some(function (teil) {
      return teil.split("&").every(function (b) {
        b = b.trim();
        if (!b) return true;
        if (b.charAt(0) === "!") return !F.hat(b.slice(1).trim());
        return F.hat(b);
      });
    });
  };

  F.beobachten = function (fn) { beobachter.push(fn); };
  F.alle = function () { return Object.keys(GAME.zustand.flags); };
  F.zuruecksetzen = function () {
    GAME.zustand = { flags: {}, notizen: [], beweise: [], gesehen: {}, finale: null };
    beobachter.forEach(function (b) { b("*", false); });
  };
  // Kompletten Zustand übernehmen (z. B. aus dem Spielstand)
  F.ersetzen = function (z) {
    GAME.zustand = {
      flags: z.flags || {}, notizen: z.notizen || [], beweise: z.beweise || [],
      gesehen: z.gesehen || {}, finale: z.finale || null
    };
    beobachter.forEach(function (b) { b("*", true); });
  };
  return F;
})();

GAME.quests = (function () {
  "use strict";
  var Q = {};

  // Notiz fürs Notizbuch merken (gibt true zurück, wenn sie neu ist)
  Q.notiz = function (id) {
    if (!id) return false;
    if (!DATA.notes[id]) console.warn("Notiz fehlt in facts.js (DATA.notes): " + id);
    if (GAME.zustand.notizen.indexOf(id) >= 0) return false;
    GAME.zustand.notizen.push(id);
    GAME.flags.setzen("notiz_" + id);
    return true;
  };

  // Beweisstück eines Landes erhalten
  Q.beweis = function (land) {
    if (GAME.zustand.beweise.indexOf(land) >= 0) return false;
    GAME.zustand.beweise.push(land);
    GAME.flags.setzen("beweis_" + land);
    var vier = ["de", "se", "ee", "lu"].every(function (l) { return GAME.zustand.beweise.indexOf(l) >= 0; });
    if (vier) GAME.flags.setzen("alle_beweise");
    return true;
  };

  Q.schrittFertig = function (s) { return GAME.flags.pruefen(s.fertigWenn); };

  Q.questFertig = function (id) {
    var q = DATA.quests[id];
    return !!q && q.schritte.every(Q.schrittFertig);
  };

  // Aktive Quests: sichtbar, sobald ihre Startbedingung erfüllt ist
  Q.aktive = function () {
    var out = [];
    for (var id in DATA.quests) {
      var q = DATA.quests[id];
      if (GAME.flags.pruefen(q.sichtbarWenn)) out.push(id);
    }
    return out;
  };

  /* Hinweis für das HUD: bevorzugt die Quest des aktuellen Viertels,
     sonst die Hauptquest. Gibt Text oder "" zurück.                    */
  Q.hinweis = function (viertel) {
    var liste = Q.aktive();
    var sortiert = liste.filter(function (id) { return DATA.quests[id].viertel === viertel; })
      .concat(liste.filter(function (id) { return DATA.quests[id].viertel !== viertel; }));
    for (var i = 0; i < sortiert.length; i++) {
      var q = DATA.quests[sortiert[i]];
      for (var k = 0; k < q.schritte.length; k++) {
        if (!Q.schrittFertig(q.schritte[k])) return q.schritte[k].text;
      }
    }
    return "";
  };

  return Q;
})();

/* ---------------- Spielstand (ein Slot, automatisch) ----------------
   Gespeichert werden der Zustand (Flags, Notizen, Beweise …) und wo Kim
   gerade steht. Ohne localStorage (z. B. privates Fenster) läuft das
   Spiel einfach ohne Speicherstand weiter.                              */
GAME.speicher = (function () {
  "use strict";
  var SCHLUESSEL = "dieLuecke.spielstand";
  var VERSION = 1;
  var S = { geaendert: false };

  S.speichern = function (ort) {
    try {
      var z = GAME.zustand;
      window.localStorage.setItem(SCHLUESSEL, JSON.stringify({
        version: VERSION, zeit: Date.now(), ort: ort || null,
        flags: z.flags, notizen: z.notizen, beweise: z.beweise, gesehen: z.gesehen || {}, finale: z.finale || null
      }));
      S.geaendert = false;
      return true;
    } catch (e) { return false; }
  };

  S.laden = function () {
    try {
      var roh = window.localStorage.getItem(SCHLUESSEL);
      if (!roh) return null;
      var d = JSON.parse(roh);
      if (!d || d.version !== VERSION || !d.flags) return null;
      return d;
    } catch (e) { return null; }
  };

  S.vorhanden = function () { return !!S.laden(); };

  S.loeschen = function () {
    try { window.localStorage.removeItem(SCHLUESSEL); } catch (e) { /* egal */ }
  };

  // Jede Flag-Änderung markiert den Spielstand als „zu speichern“
  S.init = function () {
    GAME.flags.beobachten(function () { S.geaendert = true; });
  };

  return S;
})();
