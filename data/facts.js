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
   Die Einträge werden ab Phase 2/3 gefüllt.                           */
DATA.notes = {};
