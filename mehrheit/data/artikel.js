/* =====================================================================
   data/artikel.js – die sieben Artikel des Gesetzentwurfs (Abschnitt 5.2 und 6)
   ---------------------------------------------------------------------
   Jeder Artikel hat genau eine Kernentscheidung (Stellschraube) – auf Wunsch des Users
   (1. November 2026: „weniger Stellschrauben, dafür härtere Abwägungen“). Was früher eigene
   Stellschrauben waren, steckt jetzt in den Optionen oder im festen Grundtext.
   Jede Stellschraube hat Optionen mit:
     kurz:     Kurzname für Knöpfe (höchstens vier Wörter)
     text:     Wortlaut im Gesetzestext (juristisch, aber verständlich)
     streichen: true = dieser Teil fällt weg
     dafuer / dagegen: je ein bis zwei Sätze
     haltung:  je Fraktion -2 (lehnt stark ab) bis +2 (will das unbedingt)
               (die Fraktion Brücke stimmt immer mit der Spielfigur)
     wirkung:  je Achse -2 bis +2 – wissen, durchsetzung, aufwand, recht
               (bei „aufwand“ heißt +2: viel Arbeit für Betriebe)
     jurist:   Randbemerkung des Juristischen Dienstes (optional)
     echt / vergleich: entspricht etwa der echten Richtlinie → Fakt-ID
   kurzfassung: ein Satz in einfacher Sprache (Lesehilfe)
   start:    Option im (erfundenen, vereinfachten) Vorschlag der Kommission im Spiel
   Zahlen stehen nie direkt im Text: {wert:…} = Spielwert, {fakt:…} = Fakt.
   ===================================================================== */
var DATA = window.DATA || {};

DATA.artikel = [
  /* ---------------- Artikel 1 ---------------- */
  {
    id: "zweck", titel: "Artikel 1 – Zweck",
    einleitung: "Der Zweck steht fest. Du wählst nur, welche Begründung vorne steht.",
    kurzfassung: "Das Gesetz soll gleiches Geld für gleiche oder gleich viel werte Arbeit durchsetzen.",
    grundtext: "Diese Richtlinie soll den Grundsatz des gleichen Entgelts für Frauen und Männer bei gleicher oder gleichwertiger Arbeit wirksam durchsetzen.",
    schrauben: [
      { id: "begruendung", frage: "Welche Begründung steht vorne?", start: "gerechtigkeit", keinStreichen: true,
        optionen: [
          { id: "gerechtigkeit", kurz: "Gerechtigkeit", echt: true, vergleich: "aeuv_157",
            text: "Sie dient der Gerechtigkeit für jede einzelne beschäftigte Person.",
            dafuer: "Stellt die Menschen in den Mittelpunkt.", dagegen: "Klingt für manche nach Moral statt nach Recht.",
            haltung: { GZL: 0, ASG: 1, BFW: 0, EVM: 0, BSN: 0, FU: 1 }, wirkung: { wissen: 0, durchsetzung: 0, aufwand: 0, recht: 0 } },
          { id: "wettbewerb", kurz: "Fairer Wettbewerb",
            text: "Sie dient gleichen Wettbewerbsbedingungen für alle Unternehmen im Binnenmarkt.",
            dafuer: "Wer fair bezahlt, soll keinen Nachteil gegenüber Firmen haben, die das nicht tun.", dagegen: "Die Betroffenen kommen erst an zweiter Stelle vor.",
            haltung: { GZL: 0, ASG: 0, BFW: 1, EVM: 1, BSN: 0, FU: 0 }, wirkung: { wissen: 0, durchsetzung: 0, aufwand: 0, recht: 0 } },
          { id: "grundrechte", kurz: "Europäische Grundrechte",
            text: "Sie dient dem Vertrauen in die Grundrechte der Union, zu denen die Gleichheit von Frauen und Männern gehört.",
            dafuer: "Verbindet das Gesetz mit den gemeinsamen Werten der Union.", dagegen: "Manche finden das zu abstrakt.",
            haltung: { GZL: 1, ASG: 0, BFW: 0, EVM: 0, BSN: 0, FU: 0 }, wirkung: { wissen: 0, durchsetzung: 0, aufwand: 0, recht: 0 } }
        ] }
    ]
  },

  /* ---------------- Artikel 2 ---------------- */
  {
    id: "vorher", titel: "Artikel 2 – Gehalt vor der Einstellung",
    einleitung: "Was erfahren Bewerber*innen über das Gehalt, bevor sie einen Vertrag unterschreiben?",
    kurzfassung: "Wer sich bewirbt, soll wissen, was die Stelle ungefähr einbringt.",
    schrauben: [
      { id: "vorher_info", frage: "Was erfahren Bewerber*innen über das Gehalt – und darf nach dem alten Gehalt gefragt werden?", start: "vorgespraech",
        optionen: [
          { id: "nichts", kurz: "Nichts", streichen: true, text: "",
            dafuer: "Betriebe entscheiden selbst, wann sie über Geld reden.", dagegen: "Wer nichts weiß, verhandelt schlechter. Und wer früher zu wenig verdient hat, nimmt die alte Lücke mit.",
            haltung: { GZL: -2, ASG: -2, BFW: 1, EVM: -1, BSN: 2, FU: -1 }, wirkung: { wissen: -2, durchsetzung: -1, aufwand: -2, recht: 0 } },
          { id: "nachfrage", kurz: "Auf Nachfrage",
            text: "Bewerberinnen und Bewerber erhalten auf Nachfrage Auskunft über das Einstiegsgehalt oder dessen Spanne.",
            dafuer: "Wenig Aufwand für Betriebe.", dagegen: "Nachfragen kostet im Vorstellungsgespräch Mut.",
            haltung: { GZL: -1, ASG: -1, BFW: 2, EVM: 1, BSN: 0, FU: 0 }, wirkung: { wissen: 0, durchsetzung: 0, aufwand: -1, recht: 1 } },
          { id: "vorgespraech", kurz: "Vor dem Gespräch", echt: true, vergleich: "rl_stellenanzeige",
            text: "Bewerberinnen und Bewerber erhalten vor dem Vorstellungsgespräch Informationen über das Einstiegsgehalt oder dessen Spanne. Nach ihrem bisherigen Entgelt darf nicht gefragt werden.",
            dafuer: "Alle starten mit demselben Wissen – und niemand nimmt eine alte Lücke in den neuen Job mit.", dagegen: "Betriebe müssen ihre Gehaltsspannen früh festlegen.",
            haltung: { GZL: 1, ASG: 1, BFW: 0, EVM: 1, BSN: -1, FU: 1 }, wirkung: { wissen: 1, durchsetzung: 1, aufwand: 0, recht: 2 } },
          { id: "anzeige", kurz: "In jeder Stellenanzeige",
            text: "Jede Stellenanzeige nennt verpflichtend die Gehaltsspanne der ausgeschriebenen Stelle. Nach dem bisherigen Entgelt darf nicht gefragt werden.",
            dafuer: "Maximale Klarheit, schon bevor man sich bewirbt.", dagegen: "Für kleine Betriebe eine starre Vorgabe, die Verhandlungen erschwert.",
            haltung: { GZL: 2, ASG: 2, BFW: -2, EVM: -1, BSN: -2, FU: 1 }, wirkung: { wissen: 2, durchsetzung: 1, aufwand: 1, recht: 1 } }
        ] }
    ]
  },

  /* ---------------- Artikel 3 ---------------- */
  {
    id: "bewertung", titel: "Artikel 3 – Kriterien für gleichwertige Arbeit",
    einleitung: "Wie wird festgestellt, ob zwei verschiedene Tätigkeiten gleich viel wert sind?",
    kurzfassung: "Arbeit soll nach fairen Merkmalen verglichen werden – nicht nach dem Geschlecht.",
    schrauben: [
      { id: "kriterien", frage: "Wie wird „gleichwertig“ festgestellt?", start: "neutral",
        optionen: [
          { id: "betrieb", kurz: "Regelt jeder Betrieb", streichen: true, text: "",
            dafuer: "Betriebe kennen ihre Arbeit am besten.", dagegen: "Ohne gemeinsame Kriterien bleibt ungleiche Bewertung oft unsichtbar.",
            haltung: { GZL: -2, ASG: -1, BFW: 1, EVM: 0, BSN: 2, FU: 0 }, wirkung: { wissen: -1, durchsetzung: -1, aufwand: -2, recht: -1 } },
          { id: "neutral", kurz: "Neutrale Kriterien", echt: true, vergleich: "aeuv_157",
            text: "Arbeitgeber bewerten Tätigkeiten nach objektiven, geschlechtsneutralen Kriterien: Kompetenzen, Belastungen, Verantwortung und Arbeitsbedingungen. Die Mitgliedstaaten stellen dafür kostenlose Werkzeuge bereit.",
            dafuer: "Pflege und Technik werden nach denselben Maßstäben verglichen.", dagegen: "Betriebe brauchen Zeit und Wissen, um ihre Stellen so zu bewerten.",
            haltung: { GZL: 1, ASG: 1, BFW: 1, EVM: 2, BSN: -1, FU: 1 }, wirkung: { wissen: 1, durchsetzung: 1, aufwand: 0, recht: 2 } },
          { id: "raster", kurz: "EU-weites Raster",
            text: "Die Kommission legt ein einheitliches Bewertungsraster für alle Berufe in der Union fest, das alle Arbeitgeber anwenden.",
            dafuer: "Überall dieselben Maßstäbe, keine Schlupflöcher.", dagegen: "Ein Raster für siebenundzwanzig Arbeitsmärkte passt kaum irgendwo genau.",
            haltung: { GZL: 2, ASG: 1, BFW: -2, EVM: -2, BSN: -2, FU: -1 }, wirkung: { wissen: 2, durchsetzung: 1, aufwand: 2, recht: -1 },
            jurist: "Ein einheitliches Raster für alle Berufe der Union greift tief in Tarifverträge und nationale Zuständigkeiten ein. So formuliert ist es rechtlich angreifbar." }
        ] }
    ]
  },

  /* ---------------- Artikel 4 ---------------- */
  {
    id: "auskunft", titel: "Artikel 4 – Auskunftsrecht und Verschwiegenheit",
    einleitung: "Was dürfen Beschäftigte über die Bezahlung in ihrem Betrieb erfahren?",
    kurzfassung: "Beschäftigte sollen erfahren können, ob sie fair bezahlt werden.",
    grundtext: "Vertragsklauseln, die Beschäftigte daran hindern, ihr eigenes Entgelt offenzulegen, sind unzulässig.",
    schrauben: [
      { id: "auskunft_umfang", frage: "Was dürfen Beschäftigte erfahren?", start: "durchschnitt",
        optionen: [
          { id: "nichts", kurz: "Kein Auskunftsrecht", streichen: true, text: "",
            dafuer: "Betriebe müssen keine neuen Auskünfte vorbereiten.", dagegen: "Beschäftigte wissen weiterhin nicht, ob sie fair bezahlt werden.",
            haltung: { GZL: -2, ASG: -2, BFW: 0, EVM: -1, BSN: 1, FU: -1 }, wirkung: { wissen: -2, durchsetzung: -1, aufwand: -2, recht: 0 } },
          { id: "durchschnitt", kurz: "Auskunft auf Antrag", echt: true, vergleich: "rl_auskunft",
            text: "Beschäftigte haben das Recht, auf Antrag Auskunft über ihr eigenes Entgelt und über die durchschnittliche Entgelthöhe zu erhalten, aufgeschlüsselt nach Geschlecht, für Gruppen mit gleicher oder gleichwertiger Arbeit.",
            dafuer: "Wer fragt, bekommt eine Antwort – ohne dass einzelne Gehälter offenliegen.", dagegen: "Viele wissen nicht, dass sie fragen dürfen. Nachfragen kostet Mut.",
            haltung: { GZL: 1, ASG: 1, BFW: 0, EVM: 1, BSN: -1, FU: 1 }, wirkung: { wissen: 1, durchsetzung: 1, aufwand: 1, recht: 1 } },
          { id: "durchschnitt_info", kurz: "Auskunft und jährlicher Hinweis", echt: true, vergleich: "rl_auskunft",
            text: "Beschäftigte haben das Recht, auf Antrag Auskunft über die durchschnittliche Entgelthöhe nach Geschlecht für gleiche oder gleichwertige Arbeit zu erhalten. Arbeitgeber informieren alle Beschäftigten jährlich über dieses Recht.",
            dafuer: "Alle erfahren von ihrem Recht – auch wer sich nicht traut zu fragen.", dagegen: "Ein weiterer Pflichtbrief im Jahr. Kleine Betriebe sehen darin Bürokratie.",
            haltung: { GZL: 2, ASG: 2, BFW: -1, EVM: 1, BSN: -1, FU: 1 }, wirkung: { wissen: 2, durchsetzung: 1, aufwand: 1, recht: 1 } },
          { id: "offen", kurz: "Offene Gehaltslisten",
            text: "Arbeitgeber legen die Entgelte aller Beschäftigten innerhalb des Betriebs offen. Jede beschäftigte Person kann die vollständige Liste einsehen.",
            dafuer: "Mehr Transparenz geht nicht. Ungleiche Bezahlung fällt sofort auf.", dagegen: "Einzelne Gehälter werden für alle sichtbar. Viele empfinden das als Eingriff in die Privatsphäre.",
            haltung: { GZL: 1, ASG: 1, BFW: -2, EVM: -2, BSN: -2, FU: -1 }, wirkung: { wissen: 2, durchsetzung: 1, aufwand: 2, recht: -1 },
            jurist: "Vollständig offene Gehaltslisten berühren den Datenschutz der einzelnen Beschäftigten. So formuliert ist das vor Gericht angreifbar." }
        ] }
    ]
  },

  /* ---------------- Artikel 5 ---------------- */
  {
    id: "bericht", titel: "Artikel 5 – Berichtspflicht der Arbeitgeber",
    einleitung: "Welche Betriebe müssen ihre Entgeltlücke berechnen und berichten – und für wen?",
    kurzfassung: "Größere Betriebe sollen regelmäßig zeigen, wie groß die Lücke bei ihnen ist.",
    grundtext: "Der Bericht geht an die zuständige Behörde und an die Beschäftigten des Betriebs.",
    schrauben: [
      { id: "schwelle", frage: "Ab welcher Größe müssen Betriebe berichten?", start: "gross",
        optionen: [
          { id: "keine", kurz: "Keine Pflicht", streichen: true, text: "",
            dafuer: "Keine neuen Berichte, kein neuer Aufwand.", dagegen: "Niemand weiß, wie groß die Lücke in einzelnen Betrieben ist.",
            haltung: { GZL: -2, ASG: -2, BFW: 0, EVM: -1, BSN: 1, FU: -1 }, wirkung: { wissen: -2, durchsetzung: -1, aufwand: -2, recht: 0 } },
          { id: "gross", kurz: "Ab {wert:schwelle_gross} Beschäftigten",
            text: "Arbeitgeber mit mindestens {wert:schwelle_gross} Beschäftigten berichten jährlich über das Entgeltgefälle zwischen Frauen und Männern.",
            dafuer: "Nur große Betriebe mit eigener Personalabteilung sind betroffen.", dagegen: "Die meisten Beschäftigten arbeiten in kleineren Betrieben – für sie ändert sich nichts.",
            haltung: { GZL: -1, ASG: -1, BFW: 2, EVM: 0, BSN: 0, FU: 0 }, wirkung: { wissen: 0, durchsetzung: 0, aufwand: 0, recht: 1 } },
          { id: "gestaffelt", kurz: "Gestaffelt ab {wert:schwelle_mittel}", echt: true, vergleich: "rl_bericht_100",
            text: "Arbeitgeber ab {wert:schwelle_mittel} Beschäftigten berichten über das Entgeltgefälle; größere jährlich, kleinere in längeren Abständen.",
            dafuer: "Viel mehr Beschäftigte erfahren etwas – ohne Kleinbetriebe zu überfordern.", dagegen: "Für mittelgroße Betriebe ist der Bericht spürbare Arbeit.",
            haltung: { GZL: 1, ASG: 1, BFW: 0, EVM: 1, BSN: -1, FU: 1 }, wirkung: { wissen: 1, durchsetzung: 1, aufwand: 1, recht: 1 } },
          { id: "klein", kurz: "Ab {wert:schwelle_klein} Beschäftigten",
            text: "Arbeitgeber ab {wert:schwelle_klein} Beschäftigten berichten jährlich über das Entgeltgefälle zwischen Frauen und Männern.",
            dafuer: "Fast alle Beschäftigten erfahren, wie es in ihrem Betrieb aussieht.", dagegen: "Für kleine Firmen ohne Personalabteilung ein großer Aufwand.",
            haltung: { GZL: 2, ASG: 2, BFW: -2, EVM: -1, BSN: -2, FU: 0 }, wirkung: { wissen: 2, durchsetzung: 1, aufwand: 2, recht: 1 } },
          { id: "alle", kurz: "Alle Betriebe",
            text: "Alle Arbeitgeber berichten jährlich über das Entgeltgefälle zwischen Frauen und Männern.",
            dafuer: "Niemand fällt durchs Raster.", dagegen: "In sehr kleinen Betrieben sagen Durchschnitte kaum etwas aus.",
            haltung: { GZL: 2, ASG: 1, BFW: -2, EVM: -2, BSN: -2, FU: -1 }, wirkung: { wissen: 2, durchsetzung: 1, aufwand: 2, recht: -1 },
            jurist: "In Kleinstbetrieben mit wenigen Beschäftigten lassen Durchschnittswerte Rückschlüsse auf einzelne Personen zu. Das ist ein Datenschutzproblem." }
        ] }
    ]
  },

  /* ---------------- Artikel 6 ---------------- */
  {
    id: "folgen", titel: "Artikel 6 – Was passiert, wenn eine Lücke gefunden wird",
    einleitung: "Ein Bericht zeigt eine Lücke. Und dann?",
    kurzfassung: "Wenn ein Betrieb eine unerklärte Lücke hat, soll er sie prüfen und beheben.",
    schrauben: [
      { id: "massnahme", frage: "Was folgt aus einer gefundenen Lücke?", start: "begruenden",
        optionen: [
          { id: "nichts", kurz: "Nichts weiter", streichen: true, text: "",
            dafuer: "Der Bericht allein schafft schon Druck.", dagegen: "Eine Lücke, aus der nichts folgt, bleibt eine Lücke.",
            haltung: { GZL: -2, ASG: -2, BFW: 0, EVM: -1, BSN: 1, FU: -1 }, wirkung: { wissen: 0, durchsetzung: -2, aufwand: -1, recht: 0 } },
          { id: "begruenden", kurz: "Lücke begründen",
            text: "Arbeitgeber müssen eine festgestellte Lücke gegenüber der Behörde begründen.",
            dafuer: "Betriebe müssen sich mit ihren Zahlen beschäftigen.", dagegen: "Eine Begründung lässt sich leicht schreiben – ändern muss sich nichts.",
            haltung: { GZL: -1, ASG: -1, BFW: 1, EVM: 0, BSN: 1, FU: 0 }, wirkung: { wissen: 0, durchsetzung: 0, aufwand: 0, recht: 1 } },
          { id: "bewertung", kurz: "Gemeinsame Bewertung", echt: true, vergleich: "rl_schwelle_bewertung",
            text: "Besteht ein nicht begründeter Unterschied von mindestens {wert:schwelle_bewertung}, der nicht innerhalb einer Frist behoben wird, führen Arbeitgeber und Arbeitnehmervertretung eine gemeinsame Entgeltbewertung durch.",
            dafuer: "Erst prüfen, dann handeln – gemeinsam mit den Beschäftigten.", dagegen: "Ein aufwendiges Verfahren, das Zeit kostet.",
            haltung: { GZL: 1, ASG: 1, BFW: -1, EVM: 1, BSN: -1, FU: 1 }, wirkung: { wissen: 1, durchsetzung: 1, aufwand: 1, recht: 2 } },
          { id: "nachzahlung", kurz: "Automatische Nachzahlung",
            text: "Besteht ein nicht begründeter Unterschied, zahlen Arbeitgeber allen betroffenen Beschäftigten automatisch die Differenz nach.",
            dafuer: "Schnell und direkt: Das Geld kommt bei den Betroffenen an.", dagegen: "Ein unerklärter Unterschied ist noch kein Beweis für Diskriminierung.",
            haltung: { GZL: 2, ASG: 2, BFW: -2, EVM: -2, BSN: -2, FU: 0 }, wirkung: { wissen: 0, durchsetzung: 2, aufwand: 1, recht: -2 },
            jurist: "Ein nicht begründeter Unterschied beweist noch keine Diskriminierung. Eine Nachzahlung ohne Prüfung im Einzelfall hält vor Gericht kaum." }
        ] }
    ]
  },

  /* ---------------- Artikel 7 ---------------- */
  {
    id: "durchsetzung", titel: "Artikel 7 – Durchsetzung",
    einleitung: "Wie kommen Beschäftigte zu ihrem Recht, wenn sie benachteiligt werden?",
    kurzfassung: "Wer benachteiligt wird, soll sich wirksam wehren können.",
    schrauben: [
      { id: "beweislast", frage: "Wie kommen Benachteiligte zu ihrem Recht?", start: "indizien",
        optionen: [
          { id: "beschaeftigte", kurz: "Beschäftigte beweisen alles", streichen: true, text: "",
            dafuer: "Niemand wird ohne Beweis beschuldigt.", dagegen: "Die Unterlagen über Gehälter hat der Betrieb – nicht die einzelne Person. Kaum jemand gewinnt so einen Fall.",
            haltung: { GZL: -2, ASG: -2, BFW: 1, EVM: 0, BSN: 2, FU: -1 }, wirkung: { wissen: 0, durchsetzung: -2, aufwand: -1, recht: 0 } },
          { id: "indizien", kurz: "Indizien genügen",
            text: "Legen Beschäftigte Tatsachen vor, die eine Entgeltdiskriminierung vermuten lassen, muss der Arbeitgeber beweisen, dass keine Diskriminierung vorliegt. Benachteiligte erhalten Nachzahlung und Entschädigung; die Sanktionen legen die Mitgliedstaaten fest.",
            dafuer: "Wer begründete Zweifel hat, muss nicht alles allein beweisen. Jedes Land behält Spielraum bei den Strafen.", dagegen: "Wer sich nicht allein vor Gericht traut, bleibt trotzdem allein.",
            haltung: { GZL: 1, ASG: 0, BFW: 0, EVM: 1, BSN: 1, FU: 1 }, wirkung: { wissen: 0, durchsetzung: 1, aufwand: 0, recht: 2 } },
          { id: "verbaende", kurz: "Indizien und Verbandsklage", echt: true, vergleich: "rl_beweislast",
            text: "Legen Beschäftigte Tatsachen vor, die eine Entgeltdiskriminierung vermuten lassen, muss der Arbeitgeber beweisen, dass keine Diskriminierung vorliegt. Benachteiligte erhalten Nachzahlung und Entschädigung. Verbände und Gleichstellungsstellen können sie unterstützen oder in ihrem Namen handeln.",
            dafuer: "Niemand muss allein gegen den eigenen Betrieb vor Gericht.", dagegen: "Betriebe fürchten mehr Verfahren, auch unbegründete.",
            haltung: { GZL: 2, ASG: 2, BFW: -1, EVM: 0, BSN: -1, FU: 1 }, wirkung: { wissen: 0, durchsetzung: 2, aufwand: 0, recht: 2 } },
          { id: "arbeitgeber", kurz: "Arbeitgeber beweist immer",
            text: "In allen Verfahren wegen Entgeltdiskriminierung muss der Arbeitgeber beweisen, dass keine Diskriminierung vorliegt. In der ganzen Union gelten einheitliche Mindestbußgelder.",
            dafuer: "Der stärkste Schutz für Beschäftigte.", dagegen: "Betriebe stehen unter Generalverdacht, und die Strafen greifen tief in nationales Recht ein.",
            haltung: { GZL: 2, ASG: 2, BFW: -2, EVM: -2, BSN: -2, FU: 0 }, wirkung: { wissen: 0, durchsetzung: 2, aufwand: 1, recht: -2 },
            jurist: "Eine Beweislast ohne jeden Anhaltspunkt und einheitliche Bußgelder berühren Verfahrensrecht und Strafrecht der Mitgliedstaaten. Das wird vor Gericht schwierig." }
        ] }
    ]
  }
];

/* Der Wunschzettel: zwei Vorschläge, die nicht in dieses Gesetz gehören (Abschnitt 4.3) */
DATA.wunschzettel = [
  { id: "kita", kurz: "Europaweite Kita-Garantie",
    text: "Die Mitgliedstaaten garantieren jedem Kind einen festen Platz in einer Kindertagesstätte.",
    jurist: "Nicht Gegenstand dieser Richtlinie. Für Kinderbetreuung sind überwiegend die Mitgliedstaaten zuständig.",
    haltung: { GZL: 1, ASG: 1, BFW: -1, EVM: -2, BSN: -3, FU: 0 } },
  { id: "elternzeit", kurz: "Gleiche Aufteilung der Elternzeit",
    text: "Beide Elternteile müssen die Elternzeit zu gleichen Teilen nehmen.",
    jurist: "Nicht Gegenstand dieser Richtlinie. Elternzeit regelt ein anderes Instrument (siehe {fakt:wlb_rl}).",
    haltung: { GZL: 1, ASG: 0, BFW: -1, EVM: -2, BSN: -3, FU: -1 } }
];

/* Die Umsetzungsfrist kommt erst im Trilog dazu (Abschnitt 6) */
DATA.umsetzungsfrist = {
  id: "frist", titel: "Umsetzungsfrist", frage: "Wie viel Zeit bekommen die Mitgliedstaaten für die Umsetzung in eigenes Recht?",
  optionen: [
    { id: "kurz", kurz: "{wert:frist_kurz}", text: "Die Mitgliedstaaten setzen diese Richtlinie innerhalb von {wert:frist_kurz} in nationales Recht um.",
      haltung: { GZL: 1, ASG: 1, BFW: -1, EVM: -1, BSN: -1, FU: 0 } },
    { id: "mittel", kurz: "{wert:frist_mittel}", text: "Die Mitgliedstaaten setzen diese Richtlinie innerhalb von {wert:frist_mittel} in nationales Recht um.",
      haltung: { GZL: 0, ASG: 0, BFW: 0, EVM: 1, BSN: 0, FU: 1 } },
    { id: "lang", kurz: "{wert:frist_lang}", text: "Die Mitgliedstaaten setzen diese Richtlinie innerhalb von {wert:frist_lang} in nationales Recht um.",
      haltung: { GZL: -1, ASG: -1, BFW: 1, EVM: 1, BSN: 1, FU: 0 } }
  ]
};
