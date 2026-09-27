/* =====================================================================
   Die Lücke – Spielstand, Flags und Quests
   ---------------------------------------------------------------------
   GAME.zustand ist das zentrale Objekt für den Fortschritt:
     flags   – { name: true }  (gesetzt durch Dialoge, Funde, Aktionen)
     notizen – IDs aus DATA.notes (fürs Notizbuch, Phase 3)
     beweise – Länderkürzel der gefundenen Beweisstücke ("de", "se" …)
   Bedingungen als Text: "flag", "!flag", "a&b", "a|b" (& vor |).
   ===================================================================== */
var GAME = window.GAME = window.GAME || {};

GAME.zustand = { flags: {}, notizen: [], beweise: [] };

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
    GAME.zustand.flags = {};
    GAME.zustand.notizen = [];
    GAME.zustand.beweise = [];
    beobachter.forEach(function (b) { b("*", false); });
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
