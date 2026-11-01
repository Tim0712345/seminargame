/* =====================================================================
   data/trilog.js – Position des Rates und Mittelwege (Abschnitt 5.7)
   ---------------------------------------------------------------------
   Die Ratsposition ist ein Spielwert, NICHT die echte Ratsposition.
   Sie orientiert sich grob an den Interessen der Mitgliedstaaten:
   längere Fristen, höhere Schwellen, Spielraum bei Sanktionen.
   rat:       Option-ID, die der Rat will
   mittelweg: (optional) Option-ID als Kompromiss + Satz zur Erklärung
   Regeln: Der Rat gibt höchstens bei {wert:rat_nachgeben} Punkten nach;
   ein Mittelweg kostet einen halben Punkt seines Budgets.
   ===================================================================== */
var DATA = window.DATA || {};

DATA.trilog = {
  positionen: {
    begruendung:      { rat: "wettbewerb" },
    vorher_info:      { rat: "nachfrage", mittelweg: { option: "vorgespraech", text: "Information vor dem Gespräch, aber ohne Pflicht in jeder Stellenanzeige." } },
    vorgehalt:        { rat: "freiwillig" },
    kriterien:        { rat: "neutral" },
    werkzeuge:        { rat: "ja" },
    auskunft_umfang:  { rat: "durchschnitt", mittelweg: { option: "durchschnitt_info", text: "Jährlicher Hinweis, aber erst nach einer Übergangszeit für kleine Betriebe." } },
    verschwiegenheit: { rat: "verboten" },
    schwelle:         { rat: "gross", mittelweg: { option: "gestaffelt", text: "Gestaffelt – kleinere Betriebe berichten erst später und seltener." } },
    empfaenger:       { rat: "behoerde", mittelweg: { option: "beschaeftigte", text: "Die Beschäftigten bekommen den Bericht, öffentlich wird er nicht." } },
    massnahme:        { rat: "begruenden", mittelweg: { option: "bewertung", text: "Gemeinsame Bewertung – aber erst, wenn die Lücke nach einer Frist nicht behoben ist." } },
    beweislast:       { rat: "indizien" },
    sanktionen:       { rat: "entschaedigung" },
    verbandsklage:    { rat: "nein", mittelweg: { option: "ja", text: "Verbände dürfen unterstützen, die Mitgliedstaaten regeln die Einzelheiten." } },
    frist:            { rat: "lang", mittelweg: { option: "mittel", text: "Eine mittlere Frist mit Berichtspflichten, die später beginnen." } }
  },
  /* Beim „Neuen Anlauf“ ist der Rat etwas beweglicher */
  neuerAnlaufBonus: 1,
  /* Wo der Dolmetscher eine Doppeldeutigkeit bemerkt */
  dolmetscherBei: "kriterien",
  /* Kompromisstext der Kommission, falls der Ausschuss zweimal scheitert (Abschnitt 4.5) */
  kommissionsKompromiss: {
    begruendung: "gerechtigkeit", vorher_info: "vorgespraech", vorgehalt: "verboten", kriterien: "neutral", werkzeuge: "ja",
    auskunft_umfang: "durchschnitt", verschwiegenheit: "verboten", schwelle: "gestaffelt", empfaenger: "beschaeftigte",
    massnahme: "bewertung", beweislast: "indizien", sanktionen: "entschaedigung", verbandsklage: "nein"
  },
  /* Wie oft Tiago eine Brücke bauen darf */
  bruecken: 1
};
