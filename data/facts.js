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

  // ---- Brüssel-Archiv: bereinigt vs. unbereinigt (Phase 4) ----
  de_gpg_unbereinigt_destatis: { wert: 18, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Unbereinigter Gender Pay Gap, Deutschland, nach Berechnung des Statistischen Bundesamts (gerundet)",
    quelle: "Statistisches Bundesamt (Destatis), Pressemitteilung zum Gender Pay Gap" }, // TODO: verifizieren – Quelle: Destatis (gleiches Jahr wie gpg_de_bereinigt wählen!)

  de_gpg_erklaert_anteil: { wert: 64, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Anteil der unbereinigten Lohnlücke, der sich durch messbare Merkmale (Beruf, Branche, Arbeitszeit, Führung …) erklären lässt, Deutschland",
    quelle: "Statistisches Bundesamt (Destatis), Pressemitteilung zum Gender Pay Gap" }, // TODO: verifizieren – Quelle: Destatis

  gpg_be: { wert: 0.7, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Unbereinigter Gender Pay Gap, Belgien (Infoschild in Brüssel)",
    quelle: "Eurostat, Tabelle sdg_05_20" },        // TODO: verifizieren – Quelle: Eurostat sdg_05_20

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

  // ---- Schweden: Elternzeit ----
  se_elterngeld_tage: { wert: 480, einheit: "Tage", jahr: 2024, verifiziert: false,
    beschreibung: "Tage Elterngeld (föräldrapenning) pro Kind in Schweden, für beide Eltern zusammen",
    quelle: "Försäkringskassan (schwedische Sozialversicherung)" },   // TODO: verifizieren – Quelle: Försäkringskassan

  se_reservierte_tage: { wert: 90, einheit: "Tage", jahr: 2024, verifiziert: false,
    beschreibung: "Tage, die in Schweden fest für jeden Elternteil reserviert sind (nicht übertragbar)",
    quelle: "Försäkringskassan" },   // TODO: verifizieren – Quelle: Försäkringskassan

  se_vaeter_anteil_tage: { wert: 30, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Anteil der Elterngeldtage, die in Schweden von Vätern genommen werden",
    quelle: "Försäkringskassan, Statistik zum föräldrapenning" },   // TODO: verifizieren – Quelle: Försäkringskassan

  de_partnermonate: { wert: 2, einheit: "Monate", jahr: 2024, verifiziert: false,
    beschreibung: "Partnermonate beim deutschen Elterngeld (zusätzlich, wenn beide Eltern Elterngeld nehmen)",
    quelle: "Bundesministerium für Familie (BMFSFJ), Bundeselterngeld- und Elternzeitgesetz" },   // TODO: verifizieren – Quelle: BMFSFJ / BEEG

  de_vaeter_elterngeld_anteil: { wert: 46, einheit: "%", jahr: 2022, verifiziert: false,
    beschreibung: "Anteil der Väter in Deutschland, die Elterngeld beziehen (Väterbeteiligung)",
    quelle: "Statistisches Bundesamt (Destatis), Elterngeldstatistik" },   // TODO: verifizieren – Quelle: Destatis

  de_vaeter_bezugsdauer: { wert: 3.6, einheit: "Monate", jahr: 2022, verifiziert: false,
    beschreibung: "Durchschnittliche geplante Bezugsdauer von Elterngeld bei Vätern in Deutschland",
    quelle: "Statistisches Bundesamt (Destatis), Elterngeldstatistik" },   // TODO: verifizieren – Quelle: Destatis

  de_muetter_bezugsdauer: { wert: 14.6, einheit: "Monate", jahr: 2022, verifiziert: false,
    beschreibung: "Durchschnittliche geplante Bezugsdauer von Elterngeld bei Müttern in Deutschland",
    quelle: "Statistisches Bundesamt (Destatis), Elterngeldstatistik" },   // TODO: verifizieren – Quelle: Destatis

  // ---- Estland: Branchen & Berufswahl (Monatsbruttolöhne) ----
  ee_lohn_it: { wert: 3300, einheit: "€", jahr: 2023, verifiziert: false,
    beschreibung: "Durchschnittlicher Bruttomonatslohn in Estland: Information und Kommunikation",
    quelle: "Statistikamt Estland (Statistikaamet), Löhne nach Wirtschaftszweig" },   // TODO: verifizieren – Quelle: Statistikaamet
  ee_lohn_bau: { wert: 1900, einheit: "€", jahr: 2023, verifiziert: false,
    beschreibung: "Durchschnittlicher Bruttomonatslohn in Estland: Baugewerbe",
    quelle: "Statistikamt Estland (Statistikaamet), Löhne nach Wirtschaftszweig" },   // TODO: verifizieren – Quelle: Statistikaamet
  ee_lohn_pflege: { wert: 1800, einheit: "€", jahr: 2023, verifiziert: false,
    beschreibung: "Durchschnittlicher Bruttomonatslohn in Estland: Gesundheits- und Sozialwesen",
    quelle: "Statistikamt Estland (Statistikaamet), Löhne nach Wirtschaftszweig" },   // TODO: verifizieren – Quelle: Statistikaamet
  ee_lohn_bildung: { wert: 1600, einheit: "€", jahr: 2023, verifiziert: false,
    beschreibung: "Durchschnittlicher Bruttomonatslohn in Estland: Erziehung und Unterricht",
    quelle: "Statistikamt Estland (Statistikaamet), Löhne nach Wirtschaftszweig" },   // TODO: verifizieren – Quelle: Statistikaamet

  ee_frauen_it: { wert: 30, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Frauenanteil unter den Beschäftigten in Information und Kommunikation, Estland",
    quelle: "Eurostat lfsa_egan2 (Beschäftigte nach Geschlecht und Wirtschaftszweig)" },   // TODO: verifizieren – Quelle: Eurostat lfsa_egan2
  ee_frauen_bau: { wert: 12, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Frauenanteil unter den Beschäftigten im Baugewerbe, Estland",
    quelle: "Eurostat lfsa_egan2" },   // TODO: verifizieren – Quelle: Eurostat lfsa_egan2
  ee_frauen_pflege: { wert: 85, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Frauenanteil unter den Beschäftigten im Gesundheits- und Sozialwesen, Estland",
    quelle: "Eurostat lfsa_egan2" },   // TODO: verifizieren – Quelle: Eurostat lfsa_egan2
  ee_frauen_bildung: { wert: 80, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Frauenanteil unter den Beschäftigten in Erziehung und Unterricht, Estland",
    quelle: "Eurostat lfsa_egan2" },   // TODO: verifizieren – Quelle: Eurostat lfsa_egan2

  // ---- Luxemburg: Verhandlung & Beförderung ----
  lu_frauen_fuehrung: { wert: 22, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Anteil von Frauen an Führungskräften (Managern), Luxemburg",
    quelle: "Eurostat lfsa_egais bzw. EIGE Gender Statistics Database" },   // TODO: verifizieren – Quelle: Eurostat / EIGE
  eu_frauen_fuehrung: { wert: 35, einheit: "%", jahr: 2023, verifiziert: false,
    beschreibung: "Anteil von Frauen an Führungskräften (Managern), EU-27",
    quelle: "Eurostat lfsa_egais bzw. EIGE Gender Statistics Database" },   // TODO: verifizieren – Quelle: Eurostat / EIGE

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

  // ---- Schweden ----
  gpg_se: { reiter: "elternzeit", titel: "Die Lücke in Schweden",
    text: "Gender Pay Gap in Schweden: {fakt:gpg_se} ({jahr:gpg_se}) – kleiner als der EU-Durchschnitt von {fakt:gpg_eu}, aber nicht null.",
    quelle: "Eurostat sdg_05_20 (Infoschild im Schweden-Viertel)" },
  se_modell: { reiter: "elternzeit", titel: "Das schwedische Modell",
    text: "Eltern in Schweden haben zusammen {fakt:se_elterngeld_tage} Elterngeld. Davon sind {fakt:se_reservierte_tage} fest für jeden Elternteil reserviert – wer sie nicht nimmt, verliert sie.",
    quelle: "Försäkringskassan; Gespräch mit Frau Lindqvist" },
  se_vaeter: { reiter: "elternzeit", titel: "Väter nehmen Elternzeit – aber weniger",
    text: "Väter in Schweden nehmen etwa {fakt:se_vaeter_anteil_tage} aller Elterngeldtage. Das ist viel im EU-Vergleich – aber immer noch weniger als die Hälfte.",
    quelle: "Försäkringskassan; Gespräch mit Frau Lindqvist" },
  de_elternzeit: { reiter: "elternzeit", titel: "Zum Vergleich: Deutschland",
    text: "In Deutschland gibt es {fakt:de_partnermonate} Partnermonate. Etwa {fakt:de_vaeter_elterngeld_anteil} der Väter beziehen Elterngeld – im Schnitt für {fakt:de_vaeter_bezugsdauer}, Mütter für {fakt:de_muetter_bezugsdauer}.",
    quelle: "BMFSFJ; Destatis Elterngeldstatistik" },
  elternzeit_geteilt: { reiter: "elternzeit", titel: "Geteilte Elternzeit",
    text: "Lars und Nora haben die Elternzeit halbiert. Lars: „Seitdem weiß ich, wie viel Arbeit das ist.“ Nora: „Und ich war nicht die Einzige, die im Job gefehlt hat.“",
    quelle: "Gespräch mit Lars und Nora" },
  meinung_familie: { reiter: "elternzeit", titel: "Meinung: „Das geht den Staat nichts an“",
    text: "Birgit: „Ich finde, jede Familie sollte selbst bestimmen, wer zu Hause bleibt. Warum schreibt der Staat Tage vor?“",
    quelle: "Gespräch mit Birgit" },

  // ---- Estland ----
  gpg_ee: { reiter: "branchen", titel: "Die Lücke in Estland",
    text: "Gender Pay Gap in Estland: {fakt:gpg_ee} ({jahr:gpg_ee}) – einer der höchsten Werte in der EU.",
    quelle: "Eurostat sdg_05_20 (Infoschild im Estland-Viertel)" },
  branchen_it: { reiter: "branchen", titel: "IT: gut bezahlt, wenige Frauen",
    text: "In der IT verdient man in Estland im Schnitt etwa {fakt:ee_lohn_it} brutto im Monat. Nur etwa {fakt:ee_frauen_it} der Beschäftigten sind Frauen.",
    quelle: "Statistikaamet; Eurostat; Messestand IT" },
  branchen_pflege: { reiter: "branchen", titel: "Pflege: wichtig, aber schlechter bezahlt",
    text: "Im Gesundheits- und Sozialwesen liegt der Durchschnittslohn bei etwa {fakt:ee_lohn_pflege}. Rund {fakt:ee_frauen_pflege} der Beschäftigten sind Frauen.",
    quelle: "Statistikaamet; Eurostat; Messestand Pflege" },
  branchen_bau: { reiter: "branchen", titel: "Handwerk & Bau",
    text: "Im Baugewerbe verdient man im Schnitt etwa {fakt:ee_lohn_bau}. Frauen sind dort mit rund {fakt:ee_frauen_bau} selten.",
    quelle: "Statistikaamet; Eurostat; Messestand Handwerk" },
  branchen_bildung: { reiter: "branchen", titel: "Bildung & Soziales",
    text: "In Erziehung und Unterricht liegt der Durchschnittslohn bei etwa {fakt:ee_lohn_bildung}. Etwa {fakt:ee_frauen_bildung} der Beschäftigten sind Frauen.",
    quelle: "Statistikaamet; Eurostat; Messestand Soziales" },
  branchen_muster: { reiter: "branchen", titel: "Das Muster",
    text: "Branchen, in denen viele Frauen arbeiten, zahlen im Schnitt oft weniger. Ein Teil der Lücke entsteht also dadurch, wer in welchem Beruf arbeitet – und wie viel die Gesellschaft diesen Berufen zahlt.",
    quelle: "Minispiel „Welche Branche zahlt mehr?“" },
  meinung_berufswahl: { reiter: "branchen", titel: "Meinung: „Jeder sucht sich den Beruf selbst aus“",
    text: "Anu: „Ich will Pflegerin werden, weil ich das mag. Soll ich deshalb weniger verdienen – oder sollte Pflege besser bezahlt werden?“",
    quelle: "Gespräch mit Anu" },

  // ---- Luxemburg ----
  gpg_lu: { reiter: "verhandlung", titel: "Luxemburg: fast keine Lücke?",
    text: "Der unbereinigte Gender Pay Gap in Luxemburg liegt bei {fakt:gpg_lu} ({jahr:gpg_lu}) – nahe null. Das heißt aber nicht, dass Frauen und Männer überall gleich behandelt werden. Ein Durchschnitt zeigt nicht alles.",
    quelle: "Eurostat sdg_05_20 (Infoschild im Luxemburg-Viertel)" },
  durchschnitt: { reiter: "verhandlung", titel: "Warum ein Durchschnitt täuschen kann",
    text: "Ein niedriger Durchschnittswert kann viele Gründe haben – zum Beispiel, welche Berufe Frauen und Männer im Land haben oder wer überhaupt erwerbstätig ist. Innerhalb einer Firma kann es trotzdem große Unterschiede geben, etwa bei Beförderungen.",
    quelle: "Gespräch mit Dr. Hoffmann" },
  fuehrung_lu: { reiter: "verhandlung", titel: "Wer führt?",
    text: "In Luxemburg sind etwa {fakt:lu_frauen_fuehrung} der Führungskräfte Frauen, im EU-Schnitt etwa {fakt:eu_frauen_fuehrung}.",
    quelle: "Eurostat / EIGE; Gespräch mit Herrn Schmit" },
  verhandlung_tipps: { reiter: "verhandlung", titel: "Gut verhandeln",
    text: "Was hilft: eigene Erfolge mit Beispielen, eine recherchierte Zahl, Lösungen statt Drohungen. Was nicht hilft: Entschuldigungen oder „was Sie für angemessen halten“.",
    quelle: "Minispiel Gehaltsverhandlung mit Herrn Schmit" },
  verhandlung_fair: { reiter: "verhandlung", titel: "Verhandeln ist nicht für alle gleich",
    text: "Herr Schmit gibt zu: Wenn Frauen hart verhandeln, gilt das manchmal als „fordernd“, bei Männern als „selbstbewusst“. Verhandeln allein löst die Lücke also nicht.",
    quelle: "Gespräch mit Herrn Schmit" },
  befoerderung: { reiter: "verhandlung", titel: "Die Beförderungsliste",
    text: "In Herrn Schmits Firma arbeiten etwa gleich viele Frauen und Männer. Auf der Liste der letzten Beförderungen in Führungsjobs stehen aber fast nur Männer.",
    quelle: "Gespräch mit Herrn Schmit (fiktive Firma)" },

  // ---- EU-Recht ----
  eu_richtlinie: { reiter: "eurecht", titel: "Lohntransparenz",
    text: "Die Entgelttransparenzrichtlinie (EU) 2023/970 soll Gehälter nachvollziehbarer machen: Firmen müssen erklären, wie sie Gehälter festlegen. Frist für die Umsetzung in den Mitgliedstaaten: {fakt:eu_richtlinie_frist}.",
    quelle: "Richtlinie (EU) 2023/970; Gespräch mit Frau Okafor" },
  eu_umsetzung: { reiter: "eurecht", titel: "Wie eine Richtlinie wirkt",
    text: "Eine EU-Richtlinie gilt nicht sofort für alle Menschen. Jeder Mitgliedstaat muss sie erst in ein eigenes Gesetz umsetzen – und dabei bleibt oft Spielraum.",
    quelle: "Gespräch mit Samir in Brüssel" },

  // ---- Brüssel: Archiv „Unerklärter Rest“ ----
  gpg_be: { reiter: "rest", titel: "Belgien",
    text: "Gender Pay Gap in Belgien: {fakt:gpg_be} ({jahr:gpg_be}). Wie in Luxemburg ein niedriger Durchschnitt – Brüssel ist trotzdem der Ort, an dem über die Lücke in der ganzen EU beraten wird.",
    quelle: "Eurostat sdg_05_20 (Infoschild in Brüssel)" },
  rest_unbereinigt: { reiter: "rest", titel: "Unbereinigt: der ganze Unterschied",
    text: "Die unbereinigte Lücke vergleicht einfach alle Stundenlöhne von Frauen und Männern. Das Statistische Bundesamt kam für Deutschland auf {fakt:de_gpg_unbereinigt_destatis} ({jahr:de_gpg_unbereinigt_destatis}). Eurostat rechnet etwas anders und nennt {fakt:gpg_de}.",
    quelle: "Destatis; Eurostat sdg_05_20; Archiv in Brüssel, Fach A" },
  rest_erklaert: { reiter: "rest", titel: "Der erklärte Teil",
    text: "Etwa {fakt:de_gpg_erklaert_anteil} der Lücke lassen sich mit messbaren Unterschieden erklären: Frauen arbeiten häufiger in Teilzeit, öfter in schlechter bezahlten Berufen und Branchen und seltener in Führungspositionen.",
    quelle: "Destatis; Archiv in Brüssel, Fach B" },
  rest_bereinigt: { reiter: "rest", titel: "Der unerklärte Rest",
    text: "Vergleicht man Frauen und Männer mit gleichem Beruf, gleicher Branche, gleicher Arbeitszeit und ähnlicher Erfahrung, bleibt immer noch eine Lücke von etwa {fakt:gpg_de_bereinigt}. Das ist die bereinigte Lücke – der unerklärte Rest.",
    quelle: "Destatis; Archiv in Brüssel, Fach C" },
  rest_bedeutung: { reiter: "rest", titel: "Was steckt im Rest?",
    text: "„Unerklärt“ heißt nicht automatisch Diskriminierung – die Statistik misst nicht alles, zum Beispiel Pausen im Lebenslauf. Aber ungleiche Behandlung, etwa bei Gehaltsverhandlungen oder Beförderungen, kann ein Teil davon sein.",
    quelle: "Gespräch mit Frau Peeters (Archiv)" }
};
