/* =====================================================================
   Die Lücke – Fakten und Zahlen
   ---------------------------------------------------------------------
   ALLE Zahlen des Spiels stehen hier – nirgendwo sonst.
   Dialoge und Infotexte holen sie über Platzhalter wie {fakt:gpg_de}.

   WICHTIG: Jeder Wert ist ein SCHÄTZWERT, bis er geprüft wurde.
   Nach der Prüfung: Wert korrigieren, Jahr und Quelle eintragen,
   verifiziert: true setzen und den TODO-Kommentar löschen.
   Im Debug-Modus (?debug=1) erscheinen ungeprüfte Werte rot.
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.facts = {
  // ---- Unbereinigte Lohnlücke (Gender Pay Gap) nach Ländern ----
  gpg_eu: { wert: 12.0, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Unbereinigter Gender Pay Gap, EU-27",
    quelle: "Eurostat, Tabelle sdg_05_20" },        // TODO: verifizieren – Quelle: Eurostat sdg_05_20

  gpg_de: { wert: 17.6, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Unbereinigter Gender Pay Gap, Deutschland",
    quelle: "Eurostat, Tabelle sdg_05_20" },        // TODO: verifizieren – Quelle: Eurostat sdg_05_20 (Destatis nennt eigene, gerundete Werte)

  gpg_se: { wert: 11.2, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Unbereinigter Gender Pay Gap, Schweden",
    quelle: "Eurostat, Tabelle sdg_05_20" },        // TODO: verifizieren – Quelle: Eurostat sdg_05_20

  gpg_ee: { wert: 17.7, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Unbereinigter Gender Pay Gap, Estland",
    quelle: "Eurostat, Tabelle sdg_05_20" },        // TODO: verifizieren – Quelle: Eurostat sdg_05_20

  gpg_lu: { wert: -0.7, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Unbereinigter Gender Pay Gap, Luxemburg (nahe null bzw. negativ)",
    quelle: "Eurostat, Tabelle sdg_05_20" },        // TODO: verifizieren – Quelle: Eurostat sdg_05_20

  // ---- Bereinigte Lücke ----
  gpg_de_bereinigt: { wert: 6, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Bereinigter Gender Pay Gap, Deutschland („unerklärter Rest“)",
    quelle: "Statistisches Bundesamt (Destatis), Pressemitteilung zum Gender Pay Gap" }, // TODO: verifizieren – Quelle: Destatis

  // ---- Deutschland: Teilzeit & Kinderbetreuung ----
  de_teilzeit_frauen: { wert: 50, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Anteil der erwerbstätigen Frauen, die in Teilzeit arbeiten, Deutschland",
    quelle: "Statistisches Bundesamt (Destatis), Mikrozensus; Eurostat lfsa_eppgan" },   // TODO: verifizieren – Quelle: Destatis / Eurostat lfsa_eppgan

  de_teilzeit_maenner: { wert: 13, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Anteil der erwerbstätigen Männer, die in Teilzeit arbeiten, Deutschland",
    quelle: "Statistisches Bundesamt (Destatis), Mikrozensus; Eurostat lfsa_eppgan" },   // TODO: verifizieren – Quelle: Destatis / Eurostat lfsa_eppgan

  de_teilzeit_grund_betreuung: { wert: 28, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Anteil der teilzeitbeschäftigten Frauen, die Betreuung von Kindern oder Angehörigen als Hauptgrund nennen, Deutschland",
    quelle: "Eurostat lfsa_epgar (Hauptgrund für Teilzeitarbeit)" },   // TODO: verifizieren – Quelle: Eurostat lfsa_epgar

  de_kita_fehlende_plaetze: { wert: 300000, einheit: "Plätze", jahr: 2023, verifiziert: false,
    beschreibung: "Geschätzte Zahl fehlender Betreuungsplätze für Kinder unter drei Jahren, Deutschland",
    quelle: "Institut der deutschen Wirtschaft (IW) Köln, Kurzbericht zur Kita-Lücke; alternativ Bertelsmann Stiftung, Ländermonitor Frühkindliche Bildung" },   // TODO: verifizieren – Quelle: IW Köln / Bertelsmann Stiftung

  de_gender_pension_gap: { wert: 27, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Gender Pension Gap (Unterschied der Alterseinkünfte), Deutschland",
    quelle: "Statistisches Bundesamt (Destatis), Gender Pension Gap" },   // TODO: verifizieren – Quelle: Destatis

  de_frauen_fuehrung: { wert: 29, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Anteil von Frauen an Führungskräften, Deutschland",
    quelle: "Statistisches Bundesamt (Destatis), Frauen in Führungspositionen" },   // TODO: verifizieren – Quelle: Destatis

  // ---- EU-Recht ----
  eu_richtlinie_jahr: { wert: 2023, einheit: "", jahr: 2023, verifiziert: false,
    beschreibung: "Entgelttransparenzrichtlinie (EU) 2023/970 – Jahr der Verabschiedung",
    quelle: "Amtsblatt der EU, Richtlinie (EU) 2023/970" },  // TODO: verifizieren – Quelle: EUR-Lex 32023L0970

  eu_richtlinie_frist: { wert: "7. Juni 2026", einheit: "", jahr: 2023, verifiziert: false,
    beschreibung: "Frist für die Umsetzung der Richtlinie (EU) 2023/970 in nationales Recht",
    quelle: "Richtlinie (EU) 2023/970, Art. 34" }            // TODO: verifizieren – Quelle: EUR-Lex 32023L0970
};

/* Notizbuch-Einträge (werden in Dialogen per addNote freigeschaltet).
   reiter: teilzeit | elternzeit | branchen | verhandlung | rest | eurecht
   Zahlen auch hier nur als Platzhalter {fakt:id}.                      */
DATA.notes = {
  // ---- allgemein ----
  gpg_eu: { reiter: "rest", titel: "Die Lücke in der EU",
    text: "Frauen verdienen in der EU pro Stunde im Schnitt {fakt:gpg_eu} weniger als Männer ({jahr:gpg_eu}). Das ist der unbereinigte Gender Pay Gap: Er vergleicht alle Stundenlöhne, egal in welchem Beruf oder mit wie vielen Stunden.",
    quelle: "Eurostat sdg_05_20" },

  // ---- Deutschland ----
  gpg_de: { reiter: "teilzeit", titel: "Die Lücke in Deutschland",
    text: "Gender Pay Gap in Deutschland: {fakt:gpg_de} ({jahr:gpg_de}). Das liegt über dem EU-Durchschnitt von {fakt:gpg_eu}.",
    quelle: "Eurostat sdg_05_20 (Infoschild im Deutschland-Viertel)" },
  teilzeit_quote: { reiter: "teilzeit", titel: "Teilzeit ist ungleich verteilt",
    text: "In Deutschland arbeiten etwa {fakt:de_teilzeit_frauen} der erwerbstätigen Frauen in Teilzeit. Lea arbeitet seit der Geburt ihrer Tochter 20 statt 40 Stunden – mit weniger Lohn und weniger spannenden Projekten.",
    quelle: "Destatis / Eurostat; Gespräch mit Lea" },
  teilzeit_maenner: { reiter: "teilzeit", titel: "Väter in Teilzeit",
    text: "Bei den Männern arbeiten nur etwa {fakt:de_teilzeit_maenner} in Teilzeit. Tobias hat reduziert – und wurde gefragt, ob er „noch Karriere machen will“. Seine Partnerin hat man das nie gefragt.",
    quelle: "Destatis / Eurostat; Gespräch mit Tobias" },
  rechnet_sich: { reiter: "teilzeit", titel: "„Es rechnet sich“",
    text: "Wer in einer Familie weniger verdient, reduziert oft zuerst die Arbeitszeit. Dadurch verdient diese Person später noch weniger – ein Kreislauf.",
    quelle: "Gespräch mit Lea" },
  teilzeit_gruende: { reiter: "teilzeit", titel: "Warum Teilzeit?",
    text: "Viele Frauen in Teilzeit nennen die Betreuung von Kindern oder Angehörigen als Hauptgrund: etwa {fakt:de_teilzeit_grund_betreuung}.",
    quelle: "Eurostat lfsa_epgar" },
  kita_luecke: { reiter: "teilzeit", titel: "Kita-Plätze fehlen",
    text: "Fachleute schätzen, dass rund {fakt:de_kita_fehlende_plaetze} Betreuungsplätze für kleine Kinder fehlen. Auf der Warteliste der Kita „Kleine Wolke“ stehen vor allem Familien, in denen ein Elternteil deshalb weniger arbeitet.",
    quelle: "IW Köln / Bertelsmann Stiftung; Gespräch mit Frau Yılmaz" },
  rente: { reiter: "teilzeit", titel: "Die Lücke im Alter",
    text: "Weniger Lohn und mehr Teilzeit bedeuten später weniger Rente. Der Gender Pension Gap in Deutschland liegt bei etwa {fakt:de_gender_pension_gap}.",
    quelle: "Destatis; Gespräch mit Herrn Brandt" },
  fuehrung_teilzeit: { reiter: "verhandlung", titel: "Führen in Teilzeit",
    text: "Frau Okafor leitet ein Team mit 30 Stunden pro Woche. Nur etwa {fakt:de_frauen_fuehrung} der Führungskräfte in Deutschland sind Frauen.",
    quelle: "Destatis; Gespräch mit Frau Okafor" },
  meinung_frei: { reiter: "teilzeit", titel: "Meinung: „Freie Entscheidung“",
    text: "Herr Brandt: „Jede Familie soll selbst entscheiden, wer wie viel arbeitet. Da muss sich der Staat nicht einmischen.“",
    quelle: "Gespräch mit Herrn Brandt" },
  meinung_strukturen: { reiter: "teilzeit", titel: "Meinung: „Erst braucht es eine Wahl“",
    text: "Lea: „Frei entscheiden kann ich erst, wenn es überhaupt einen Kita-Platz gibt.“",
    quelle: "Gespräch mit Lea" },

  // ---- EU-Recht ----
  eu_richtlinie: { reiter: "eurecht", titel: "Lohntransparenz",
    text: "Die Entgelttransparenzrichtlinie (EU) 2023/970 soll Gehälter nachvollziehbarer machen: Firmen müssen erklären, wie sie Gehälter festlegen. Frist für die Umsetzung in den Mitgliedstaaten: {fakt:eu_richtlinie_frist}.",
    quelle: "Richtlinie (EU) 2023/970; Gespräch mit Frau Okafor" }
};
