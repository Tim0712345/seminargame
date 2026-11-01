/* =====================================================================
   data/vergleich.js – „So ist es wirklich“ (Abschnitt 4.9)
   ---------------------------------------------------------------------
   Für jeden Artikel: was in der echten Richtlinie steht und warum.
   Echte Personen werden nicht genannt. Zahlen nur über Platzhalter.
   {info:id} setzt die Beschreibung eines Fakts ein (Feld „text“).
   echteOption: welche Option im Spiel der echten Regel am nächsten kommt
   (Optionen sind innerhalb einer Stellschraube von zurückhaltend nach weitgehend geordnet).
   ===================================================================== */
var DATA = window.DATA || {};

DATA.vergleich = {
  titel: "So ist es wirklich",
  untertitel: "Deine Fassung neben der echten {fakt:rl_nummer}",
  spalten: ["Deine Fassung", "Echte Richtlinie", "Warum so entschieden wurde"],
  zeichen: { gleich: "ähnlich entschieden", mutiger: "mutiger", vorsichtiger: "vorsichtiger", anders: "anders" },
  echteOption: {
    begruendung: "gerechtigkeit", vorher_info: "vorgespraech", vorgehalt: "verboten", kriterien: "neutral", werkzeuge: "ja",
    auskunft_umfang: "durchschnitt_info", verschwiegenheit: "verboten", schwelle: "gestaffelt", empfaenger: "beschaeftigte",
    massnahme: "bewertung", beweislast: "indizien", sanktionen: "entschaedigung", verbandsklage: "ja", frist: "mittel"
  },
  artikel: {
    zweck: { echt: "Die Richtlinie stützt sich auf {fakt:aeuv_157}. Sie soll den Grundsatz des gleichen Entgelts durch Transparenz und Durchsetzung stärken.",
      warum: "Der Grundsatz gilt seit {fakt:rv_1957}, wurde aber oft nicht durchgesetzt. Deshalb setzt die Richtlinie beim fehlenden Wissen an." },
    vorher: { echt: "{info:rl_stellenanzeige}: {fakt:rl_stellenanzeige}. Außerdem: {fakt:rl_vorgehalt}.",
      warum: "Wer das alte Gehalt nennen muss, nimmt eine alte Lücke in den neuen Job mit. Eine Pflicht für jede Stellenanzeige ging den Mitgliedstaaten zu weit." },
    bewertung: { echt: "Entgeltstrukturen müssen auf objektiven, geschlechtsneutralen Kriterien beruhen: Kompetenzen, Belastungen, Verantwortung und Arbeitsbedingungen. Die Mitgliedstaaten sorgen für Hilfsmittel zur Analyse.",
      warum: "Gleichwertigkeit lässt sich nur mit gemeinsamen Maßstäben prüfen. Ein EU-weites Raster wurde nicht beschlossen, weil Tarifsysteme sehr verschieden sind." },
    auskunft: { echt: "{fakt:rl_auskunft}. Arbeitgeber informieren jährlich über dieses Recht. Klauseln, die das Sprechen über das eigene Gehalt verbieten, sind unzulässig.",
      warum: "Ohne Wissen keine Durchsetzung. Offene Gehaltslisten für alle wurden wegen des Datenschutzes nicht beschlossen." },
    bericht: { echt: "Gestaffelte Berichtspflicht: {info:rl_bericht_250} ({fakt:rl_bericht_250}); {info:rl_bericht_150} ({fakt:rl_bericht_150}); {info:rl_bericht_100} ({fakt:rl_bericht_100}).",
      warum: "Große Betriebe können am meisten leisten. Die Staffelung sollte kleinere Betriebe nicht überfordern – sehr kleine sind ausgenommen." },
    folgen: { echt: "{info:rl_schwelle_bewertung}: {fakt:rl_schwelle_bewertung}.",
      warum: "Ein unerklärter Unterschied ist ein Anlass zur Prüfung, kein automatischer Beweis. Die gemeinsame Bewertung bindet die Beschäftigten ein." },
    durchsetzung: { echt: "{fakt:rl_beweislast}, sobald Tatsachen eine Diskriminierung vermuten lassen. Dazu Entschädigung und Sanktionen, die die Mitgliedstaaten festlegen. Verbände und Gleichstellungsstellen können Beschäftigte unterstützen.",
      warum: "Beschäftigte kennen die Gehälter der anderen meist nicht. Deshalb reichen Indizien, dann muss der Betrieb sich erklären. Die Höhe der Sanktionen blieb Sache der Länder." },
    frist: { echt: "Umsetzungsfrist: {fakt:rl_frist}.",
      warum: "Die Länder brauchten Zeit, um ihre Gesetze anzupassen. Wie es in Deutschland umgesetzt wurde, kannst du selbst recherchieren." }
  },
  ausserdem: {
    titel: "Was es außerdem bräuchte",
    text: "Kita-Plätze, Elternzeit, Tarifverträge und nationale Politik wirken auf die Lohnlücke – aber nicht über dieses Gesetz. Für Elternzeit und Vaterschaftsurlaub gibt es zum Beispiel die {fakt:wlb_rl}. Wie stark diese Werkzeuge wirken, behauptet dieses Spiel nicht."
  },
  vereinfacht: {
    titel: "Was im Spiel vereinfacht wurde",
    punkte: [
      "Echte Gesetze haben mehrere Lesungen; im Spiel gibt es nur Ausschuss, Trilog und Plenum.",
      "Der Rat stimmt meist mit qualifizierter Mehrheit ab – im Spiel ist er eine einzige Verhandlungsperson.",
      "Fraktionen, Personen und Sitzzahlen sind erfunden. Das echte Parlament hat {fakt:ep_sitze} Sitze.",
      "Der Vorschlag der Kommission und die Position des Rates im Spiel sind vereinfacht und erfunden.",
      "Ein echter Trilog dauert oft Monate und viele Runden, nicht eine Nacht.",
      "Die Wirkungsanzeige ist eine Einschätzung im Spiel, keine Prognose."
    ]
  },
  zeitleiste: {
    titel: "Zeitleiste der echten Richtlinie",
    punkte: [
      { wann: "{fakt:rl_vorschlag}", was: "Vorschlag der Kommission" },
      { wann: "{fakt:rl_datum}", was: "Annahme durch Parlament und Rat" },
      { wann: "{fakt:rl_frist}", was: "Frist für die Umsetzung in nationales Recht" },
      { wann: "{fakt:rl_bericht_250}", was: "Erste Berichte großer Arbeitgeber" }
    ],
    hinweis: "Wie es in Deutschland umgesetzt wurde, kannst du selbst recherchieren."
  },
  fragen: {
    titel: "Offene Fragen – zum Nachdenken und für den Unterricht",
    punkte: [
      "Welche Ursache der Lohnlücke findest du am wichtigsten – und welches Gesetz bräuchte es dafür?",
      "Wann ist Transparenz gut, wann wird sie zur Belastung?",
      "Was wäre in deinem Ausbildungsbetrieb oder Nebenjob anders, wenn alle ihr Gehalt kennen dürften?",
      "Warum ist ein unerklärter Rest kein Beweis – und warum trotzdem ein Grund zum Handeln?",
      "Wo hast du im Spiel nachgegeben? War es das wert?",
      "Welches Argument einer anderen Fraktion fandest du überzeugend, obwohl du anders entschieden hast?",
      "Sollte die EU mehr regeln – oder die Länder? Woran machst du das fest?"
    ]
  },
  credits: {
    titel: "Credits",
    zeilen: ["Konzept und Texte: [Dein Name]", "Umsetzung mit KI-Unterstützung (siehe KI-Dokumentation)",
             "Ein Beitrag zum Schülerwettbewerb „Europäischer Wettbewerb“",
             "Alle Personen, Fraktionen, Firmen und Geschichten sind erfunden. Die Richtlinie und die Zahlen sind echt – Quellen siehe oben."]
  }
};
