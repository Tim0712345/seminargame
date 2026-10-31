// =====================================================================
//  data/fakten.js – ALLE Zahlen des Spiels stehen nur hier.
// ---------------------------------------------------------------------
//  Regeln:
//  • Texte im Spiel enthalten nie direkt eine Zahl, sondern einen
//    Platzhalter, z. B. {fakt:gpg_de}. Das Spiel setzt dann „wert + einheit“ ein.
//  • Jede Zahl ist ein SCHÄTZWERT und muss noch geprüft werden.
//    Nach dem Prüfen: Wert korrigieren, verifiziert: true setzen und
//    in QUELLEN.md „ja“ eintragen.
//  • Im Debug-Modus (index.html?debug=1) werden ungeprüfte Zahlen rot angezeigt.
//
//  Aufbau eines Eintrags:
//    id: { wert, einheit, jahr, text (kurze Beschreibung), quelle, verifiziert }
// =====================================================================

var DATA = window.DATA || {};
window.DATA = DATA;

DATA.fakten = {

  // TODO: verifizieren – Quelle: Eurostat, Tabelle sdg_05_20 (Gender Pay Gap, unbereinigt)
  gpg_eu: {
    wert: 12, einheit: "%", jahr: 2023,
    text: "Unbereinigter Gender Pay Gap in der EU (Unterschied der durchschnittlichen Bruttostundenlöhne)",
    quelle: "Eurostat, sdg_05_20",
    verifiziert: false
  },

  // TODO: verifizieren – Quelle: Eurostat, Tabelle sdg_05_20 (Deutschland)
  gpg_de: {
    wert: 17.6, einheit: "%", jahr: 2023,
    text: "Unbereinigter Gender Pay Gap in Deutschland (EU-Methode)",
    quelle: "Eurostat, sdg_05_20",
    verifiziert: false
  },

  // TODO: verifizieren – Quelle: Destatis, Pressemitteilung zum Gender Pay Gap
  gpg_de_destatis: {
    wert: 16, einheit: "%", jahr: 2024,
    text: "Unbereinigter Gender Pay Gap in Deutschland laut Statistischem Bundesamt",
    quelle: "Destatis (Statistisches Bundesamt), Pressemitteilung Gender Pay Gap",
    verifiziert: false
  },

  // TODO: verifizieren – Quelle: Destatis, Pressemitteilung zum Gender Pay Gap (bereinigt)
  gpg_de_bereinigt: {
    wert: 6, einheit: "%", jahr: 2024,
    text: "Bereinigter Gender Pay Gap in Deutschland (gleiche Merkmale wie Beruf, Branche, Arbeitszeit verglichen)",
    quelle: "Destatis (Statistisches Bundesamt), Pressemitteilung Gender Pay Gap",
    verifiziert: false
  }
};
