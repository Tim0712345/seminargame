/* =====================================================================
   data/fraktionen.js – die erfundenen Fraktionen (Abschnitt 3.3 und 5.3)
   ---------------------------------------------------------------------
   Alle Fraktionen sind erfunden und orientieren sich nur grob an
   politischen Grundrichtungen.
   farbe:          lackierte Akzente und Licht (Abschnitt 7.9)
   muster:         für Farbsehschwäche (Sockel im Glasmodell, Fraktionsleiste)
   sitzeAusschuss: Sitze im Ausschuss (Spielwert, zusammen 60)
   sitzePlenum:    Punkte im Plenarsaal (Spielwert, zusammen 120)
   startVertrauen: -3 bis +3
   schwelle:       ab dieser Punktzahl stimmt die Fraktion zu
   geschlossenheit: 0 bis 1 – wie einheitlich sie abstimmt
   kernanliegen:   Artikel, bei denen die Haltung doppelt zählt
   sitzordnung:    Reihenfolge im Halbrund von links nach rechts
   ===================================================================== */
var DATA = window.DATA || {};

DATA.fraktionen = [
  { id: "GZL", name: "Grüne Zukunftsliste", kurz: "GZL", richtung: "ökologisch-progressiv",
    farbe: "#2f9a5a", muster: "wellen", sitzeAusschuss: 8, sitzePlenum: 16,
    startVertrauen: 0, schwelle: 1.5, geschlossenheit: 0.85, kernanliegen: ["bewertung"], person: "aoife", sitzordnung: 1 },

  { id: "ASG", name: "Allianz für Soziale Gerechtigkeit", kurz: "ASG", richtung: "sozialdemokratisch, gewerkschaftsnah",
    farbe: "#d6453a", muster: "streifen", sitzeAusschuss: 12, sitzePlenum: 24,
    startVertrauen: 0, schwelle: 1.5, geschlossenheit: 0.85, kernanliegen: ["auskunft", "bericht"], person: "luca", sitzordnung: 2 },

  { id: "BRUECKE", name: "Brücke", kurz: "Brücke", richtung: "kleine Gruppe junger Abgeordneter, vermittelt",
    farbe: "#00a2ad", muster: "rauten", sitzeAusschuss: 3, sitzePlenum: 6,
    startVertrauen: 3, schwelle: 0, geschlossenheit: 1.0, kernanliegen: [], person: null, sitzordnung: 3, immerJa: true,
    hinweis: "Fraktion der Spielfigur – stimmt immer mit der Spielfigur." },

  { id: "BFW", name: "Bündnis Freie Wirtschaft", kurz: "BFW", richtung: "wirtschaftsliberal",
    farbe: "#e0a526", muster: "punkte", sitzeAusschuss: 9, sitzePlenum: 18,
    startVertrauen: 0, schwelle: 0.5, geschlossenheit: 0.75, kernanliegen: ["bericht"], person: "pieter", sitzordnung: 4 },

  { id: "EVM", name: "Europäische Volksmitte", kurz: "EVM", richtung: "bürgerlich-konservativ",
    farbe: "#3a6fd1", muster: "karo", sitzeAusschuss: 15, sitzePlenum: 30,
    startVertrauen: 0, schwelle: 0.5, geschlossenheit: 0.7, kernanliegen: ["bericht", "folgen"], person: "maria", sitzordnung: 5 },

  { id: "BSN", name: "Bund Souveräner Nationen", kurz: "BSN", richtung: "EU-skeptisch",
    farbe: "#8a4f7d", muster: "dreiecke", sitzeAusschuss: 8, sitzePlenum: 16,
    startVertrauen: -1, schwelle: 1.5, geschlossenheit: 0.8, kernanliegen: ["durchsetzung"], person: "jaroslav", sitzordnung: 6 },

  { id: "FU", name: "Fraktionslose und Unabhängige", kurz: "FU", richtung: "keine Fraktion, sehr gemischt",
    farbe: "#9aa0aa", muster: "voll", sitzeAusschuss: 5, sitzePlenum: 10,
    startVertrauen: 0, schwelle: 0.5, geschlossenheit: 0.3, kernanliegen: [], person: "sofia", sitzordnung: 7 }
];
