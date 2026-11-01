/* =====================================================================
   data/spielwerte.js – Zahlen der Spielmechanik (keine Fakten!)
   ---------------------------------------------------------------------
   Alle Werte hier sind „Spielwert, frei gewählt“. Texte setzen sie mit
   {wert:id} ein. Wo ein Spielwert zufällig einem echten Wert entspricht,
   zeigt der Vergleich am Ende den echten Wert aus data/fakten.js.
   ===================================================================== */
var DATA = window.DATA || {};

DATA.spielwerte = {
  sitze_ausschuss: 60,             // Spielwert, frei gewählt: Sitze im erfundenen Ausschuss
  sitze_plenum_darstellung: 120,   // Spielwert, frei gewählt: Punkte im Plenarsaal (vereinfachte Darstellung)
  fragenkarten_anhoerung: 6,       // Spielwert, frei gewählt
  fragen_anhoerung: 4,             // Spielwert, frei gewählt
  termine_flure: 6,                // Spielwert, frei gewählt
  extra_termine: 2,                // Spielwert, frei gewählt
  rat_nachgeben: 3,                // Spielwert, frei gewählt
  uhr_anhoerung: "9 Uhr",          // Spielwert, frei gewählt (Uhrzeit im Kapiteltext)

  // Schwellen, die die Spielfigur in Artikel 5 wählen kann (Spielwerte)
  schwelle_gross: 250,
  schwelle_mittel: 100,
  schwelle_klein: 50,
  schwelle_bewertung: "5 %",       // Spielwert; entspricht zufällig dem echten Wert {fakt:rl_schwelle_bewertung}

  // Umsetzungsfristen im Trilog (Spielwerte)
  frist_kurz: "zwei Jahre",
  frist_mittel: "drei Jahre",
  frist_lang: "vier Jahre",

  // Geschichte von Karin Hofstetter (Spielwert der Geschichte, kein Fakt)
  karin_beschaeftigte: 140,

  // Vertrauen der Fraktionen
  vertrauen_min: -3,
  vertrauen_max: 3,

  // Mehrheitsberechnung (js/logik/mehrheit.js)
  gewicht_kernanliegen: 2,
  gewicht_normal: 1,
  // Wirkungsanzeige: Stufe = wirkung_mitte + Summe der Wirkungen / wirkung_teiler (Spielwert)
  wirkung_mitte: 3,
  wirkung_teiler: 3.2,
  mehrheit_steilheit: 1.4          // wie schnell eine Fraktion von Nein zu Ja kippt
};
