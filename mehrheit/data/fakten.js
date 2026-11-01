/* =====================================================================
   data/fakten.js – alle echten Zahlen und Fakten (Abschnitt 2)
   ---------------------------------------------------------------------
   KEINER dieser Werte ist bisher geprüft. Es sind Schätzwerte nach
   bisherigem Kenntnisstand. Vor der Abgabe jeden Wert mit der Quelle
   abgleichen, korrigieren und dann  verifiziert: true  setzen.
   Auch QUELLEN.md aktualisieren.

   Texte im Spiel benutzen nur Platzhalter:
     {fakt:id}    → Wert + Einheit   (z. B. „12,0 %“)
     {jahr:id}    → Jahr
     {quelle:id}  → Quelle
   ===================================================================== */
var DATA = window.DATA || {};

DATA.fakten = {

  // TODO: verifizieren – Quelle: Eurostat, Tabelle sdg_05_20
  gpg_eu: { wert: "12,0", einheit: "%", jahr: "2023", text: "Unbereinigter Gender Pay Gap in der EU",
    quelle: "Eurostat, Tabelle sdg_05_20", link_hinweis: "ec.europa.eu/eurostat – Datenbank – Suche „sdg_05_20“", verifiziert: false },

  // TODO: verifizieren – Quelle: Eurostat, Tabelle sdg_05_20
  gpg_de: { wert: "17,6", einheit: "%", jahr: "2023", text: "Unbereinigter Gender Pay Gap Deutschland (EU-Methode)",
    quelle: "Eurostat, Tabelle sdg_05_20", link_hinweis: "ec.europa.eu/eurostat – Datenbank – Suche „sdg_05_20“", verifiziert: false },

  // TODO: verifizieren – Quelle: Destatis, Pressemitteilung zum Gender Pay Gap
  gpg_de_destatis: { wert: "16", einheit: "%", jahr: "2024", text: "Unbereinigter Gender Pay Gap Deutschland (Destatis)",
    quelle: "Destatis, Pressemitteilung zum Gender Pay Gap", link_hinweis: "destatis.de – Presse – Suche „Gender Pay Gap“", verifiziert: false },

  // TODO: verifizieren – Quelle: Destatis, Pressemitteilung zum Gender Pay Gap
  gpg_de_bereinigt: { wert: "6", einheit: "%", jahr: "2024", text: "Bereinigter Gender Pay Gap Deutschland",
    quelle: "Destatis, Pressemitteilung zum Gender Pay Gap", link_hinweis: "destatis.de – Presse – Suche „bereinigter Gender Pay Gap“", verifiziert: false },

  // TODO: verifizieren – Quelle: Eurostat, Tabelle sdg_05_20 (unsicher: Land und Wert nachschlagen)
  gpg_land_min: { wert: "-0,9", einheit: "%", jahr: "2023", land: "Luxemburg", text: "EU-Land mit dem niedrigsten unbereinigten Gender Pay Gap",
    quelle: "Eurostat, Tabelle sdg_05_20", link_hinweis: "ec.europa.eu/eurostat – sdg_05_20 – Länder sortieren", verifiziert: false },

  // TODO: verifizieren – Quelle: Eurostat, Tabelle sdg_05_20 (unsicher: Land und Wert nachschlagen)
  gpg_land_max: { wert: "19,0", einheit: "%", jahr: "2023", land: "Lettland", text: "EU-Land mit dem höchsten unbereinigten Gender Pay Gap",
    quelle: "Eurostat, Tabelle sdg_05_20", link_hinweis: "ec.europa.eu/eurostat – sdg_05_20 – Länder sortieren", verifiziert: false },

  // TODO: verifizieren – Quelle: EUR-Lex
  rl_nummer: { wert: "Richtlinie (EU) 2023/970", einheit: "", jahr: "2023",
    text: "Richtlinie zur Stärkung der Anwendung des Grundsatzes des gleichen Entgelts für Männer und Frauen bei gleicher oder gleichwertiger Arbeit durch Entgelttransparenz und Durchsetzungsmechanismen",
    quelle: "EUR-Lex", link_hinweis: "eur-lex.europa.eu – Suche „2023/970“", verifiziert: false },

  // TODO: verifizieren – Quelle: EUR-Lex
  rl_datum: { wert: "10. Mai 2023", einheit: "", jahr: "2023", text: "Datum der Annahme der Richtlinie",
    quelle: "EUR-Lex", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Dokumentinformationen", verifiziert: false },

  // TODO: verifizieren – Quelle: EUR-Lex, Art. 34 der Richtlinie
  rl_frist: { wert: "7. Juni 2026", einheit: "", jahr: "2026", text: "Umsetzungsfrist für die Mitgliedstaaten",
    quelle: "EUR-Lex, Richtlinie (EU) 2023/970, Art. 34", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 34", verifiziert: false },

  // TODO: verifizieren – Quelle: EUR-Lex, COM(2021) 93
  rl_vorschlag: { wert: "März 2021", einheit: "", jahr: "2021", text: "Vorschlag der Europäischen Kommission",
    quelle: "EUR-Lex, COM(2021) 93", link_hinweis: "eur-lex.europa.eu – Suche „COM(2021) 93“", verifiziert: false },

  // TODO: verifizieren – Quelle: Richtlinie (EU) 2023/970, Art. 9
  rl_bericht_250: { wert: "ab 2027 (für 2026), danach jährlich", einheit: "", jahr: "2027",
    text: "Berichtspflicht für Arbeitgeber ab 250 Beschäftigten: jährlich",
    quelle: "Richtlinie (EU) 2023/970, Art. 9", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 9", verifiziert: false },

  // TODO: verifizieren – Quelle: Richtlinie (EU) 2023/970, Art. 9
  rl_bericht_150: { wert: "ab 2027, alle drei Jahre", einheit: "", jahr: "2027",
    text: "Berichtspflicht für Arbeitgeber mit 150 bis 249 Beschäftigten",
    quelle: "Richtlinie (EU) 2023/970, Art. 9", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 9", verifiziert: false },

  // TODO: verifizieren – Quelle: Richtlinie (EU) 2023/970, Art. 9
  rl_bericht_100: { wert: "ab 2031, alle drei Jahre", einheit: "", jahr: "2031",
    text: "Berichtspflicht für Arbeitgeber mit 100 bis 149 Beschäftigten",
    quelle: "Richtlinie (EU) 2023/970, Art. 9", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 9", verifiziert: false },

  // TODO: verifizieren – Quelle: Richtlinie (EU) 2023/970, Art. 10
  rl_schwelle_bewertung: { wert: "5", einheit: "%", jahr: "2023",
    text: "Gemeinsame Entgeltbewertung, wenn ein nicht begründeter Unterschied von mindestens diesem Wert besteht und nicht innerhalb von sechs Monaten behoben wird",
    quelle: "Richtlinie (EU) 2023/970, Art. 10", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 10", verifiziert: false },

  // TODO: verifizieren – Quelle: Richtlinie (EU) 2023/970, Art. 5
  rl_stellenanzeige: { wert: "Information über Einstiegsgehalt oder Spanne vor dem Vorstellungsgespräch", einheit: "", jahr: "2023",
    text: "Entgelttransparenz vor der Beschäftigung",
    quelle: "Richtlinie (EU) 2023/970, Art. 5", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 5", verifiziert: false },

  // TODO: verifizieren – Quelle: Richtlinie (EU) 2023/970, Art. 5
  rl_vorgehalt: { wert: "Verbot, nach dem bisherigen Gehalt zu fragen", einheit: "", jahr: "2023",
    text: "Frage nach dem bisherigen Entgelt",
    quelle: "Richtlinie (EU) 2023/970, Art. 5", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 5", verifiziert: false },

  // TODO: verifizieren – Quelle: Richtlinie (EU) 2023/970, Art. 7
  rl_auskunft: { wert: "Auskunftsrecht über die durchschnittliche Entgelthöhe nach Geschlecht für gleiche oder gleichwertige Arbeit", einheit: "", jahr: "2023",
    text: "Auskunftsrecht der Beschäftigten",
    quelle: "Richtlinie (EU) 2023/970, Art. 7", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 7", verifiziert: false },

  // TODO: verifizieren – Quelle: Richtlinie (EU) 2023/970, Art. 18
  rl_beweislast: { wert: "Verlagerung der Beweislast auf den Arbeitgeber", einheit: "", jahr: "2023",
    text: "Beweislast bei Verdacht auf Entgeltdiskriminierung",
    quelle: "Richtlinie (EU) 2023/970, Art. 18", link_hinweis: "eur-lex.europa.eu – Richtlinie (EU) 2023/970 – Artikel 18", verifiziert: false },

  // TODO: verifizieren – Quelle: EUR-Lex, Vertrag über die Arbeitsweise der EU
  aeuv_157: { wert: "Artikel 157 AEUV", einheit: "", jahr: "2009",
    text: "Gleiches Entgelt für Männer und Frauen bei gleicher oder gleichwertiger Arbeit (Rechtsgrundlage)",
    quelle: "EUR-Lex, AEUV", link_hinweis: "eur-lex.europa.eu – Vertrag über die Arbeitsweise der Europäischen Union – Artikel 157", verifiziert: false },

  // TODO: verifizieren – Quelle: EUR-Lex / Geschichte der EU
  rv_1957: { wert: "1957", einheit: "", jahr: "1957", text: "Grundsatz des gleichen Entgelts seit den Römischen Verträgen",
    quelle: "EUR-Lex / Geschichte der EU", link_hinweis: "european-union.europa.eu – Geschichte der EU – Römische Verträge", verifiziert: false },

  // TODO: verifizieren – Quelle: EUR-Lex
  wlb_rl: { wert: "Richtlinie (EU) 2019/1158", einheit: "", jahr: "2019", text: "Vereinbarkeitsrichtlinie (Elternzeit, Vaterschaftsurlaub)",
    quelle: "EUR-Lex", link_hinweis: "eur-lex.europa.eu – Suche „2019/1158“", verifiziert: false },

  // TODO: verifizieren – Quelle: Europäische Union, offizielle Website
  eu_mitgliedstaaten: { wert: "27", einheit: "", jahr: "2026", text: "Zahl der EU-Mitgliedstaaten",
    quelle: "Europäische Union, offizielle Website", link_hinweis: "european-union.europa.eu – Länder", verifiziert: false },

  // TODO: verifizieren – Quelle: Europäisches Parlament
  ep_sitze: { wert: "720", einheit: "", jahr: "2024", text: "Sitze im Europäischen Parlament (Wahlperiode ab 2024)",
    quelle: "Europäisches Parlament", link_hinweis: "europarl.europa.eu – Abgeordnete", verifiziert: false },

  // TODO: verifizieren – Quelle: Bundesgesetzblatt / BMFSFJ
  entgtranspg: { wert: "200", einheit: "Beschäftigten", jahr: "2017",
    text: "Deutsches Entgelttransparenzgesetz: Auskunftsanspruch in Betrieben ab dieser Zahl von Beschäftigten (seit 2017)",
    quelle: "Bundesgesetzblatt / BMFSFJ", link_hinweis: "gesetze-im-internet.de – EntgTranspG", verifiziert: false },

  // TODO: verifizieren – Quelle: Eurostat lfsa_eppgan (unsicher: Wert nachschlagen)
  teilzeit_frauen_eu: { wert: "27,9", einheit: "%", jahr: "2023", text: "Teilzeitquote der erwerbstätigen Frauen in der EU",
    quelle: "Eurostat, Tabelle lfsa_eppgan", link_hinweis: "ec.europa.eu/eurostat – Datenbank – Suche „lfsa_eppgan“", verifiziert: false },

  // TODO: verifizieren – Quelle: Eurostat lfsa_eppgan (unsicher: Wert nachschlagen)
  teilzeit_maenner_eu: { wert: "7,7", einheit: "%", jahr: "2023", text: "Teilzeitquote der erwerbstätigen Männer in der EU",
    quelle: "Eurostat, Tabelle lfsa_eppgan", link_hinweis: "ec.europa.eu/eurostat – Datenbank – Suche „lfsa_eppgan“", verifiziert: false },

  // TODO: verifizieren – Quelle: Europäische Union, Amtssprachen
  amtssprachen: { wert: "24", einheit: "", jahr: "2026", text: "Zahl der Amtssprachen der EU",
    quelle: "Europäische Union, offizielle Website", link_hinweis: "european-union.europa.eu – Sprachen", verifiziert: false }
};
