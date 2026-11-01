/* =====================================================================
   data/texte.js – Oberflächentexte, Kapitelkarten, Menüs
   ---------------------------------------------------------------------
   Platzhalter: {name} (Vorname der Spielfigur), {fakt:id}, {jahr:id},
   {quelle:id}, {wert:id}. **fett** wird fett gedruckt.
   Keine Ziffern in Texten – Zahlen kommen aus fakten.js / spielwerte.js.
   ===================================================================== */
var DATA = window.DATA || {};

DATA.texte = {
  spielTitel: "MEHRHEIT",
  untertitel: "Ein Gesetz gegen die Lohnlücke",
  erfundenHinweis: "Alle Personen und Fraktionen sind erfunden. Die Richtlinie und die Zahlen sind echt – Quellen am Ende.",

  /* Das Blatt auf dem Rednerpult im Titelbild */
  titelBlatt: {
    kopf: "Europäisches Parlament",
    vorher: "Richtlinie",
    gestrichen: "über …",
    neu: "gegen die Lohnlücke"
  },

  menue: {
    weiterspielen: "Weiterspielen",
    neu: "Neue Legislatur",
    einstellungen: "Einstellungen",
    ueber: "Über das Spiel",
    speichernNichtMoeglich: "Speichern nicht möglich",
    rueckfrageNeu: "Ein neues Spiel überschreibt den gespeicherten Stand. Wirklich neu beginnen?",
    ja: "Ja, neu beginnen",
    nein: "Abbrechen",
    weiterTippen: "Tippen oder Taste drücken, um die Fahrt zu überspringen",
    rueckfrageTitel: "Bist du sicher?",
    altStand: "Der gespeicherte Spielstand passt nicht zu dieser Version. Es beginnt eine neue Legislatur."
  },

  /* Vorname der Spielfigur (Kapitel 1) */
  name: { titel: "Willkommen im Europäischen Parlament", frage: "Wie heißt du? (Vorname)", hinweis: "Höchstens sechzehn Zeichen, nur Buchstaben, Bindestrich und Leerzeichen.", vorschlag: "Sam", los: "Los geht's" },
  zettelTitel: "Der Zettel von Inès",
  abend: { titel: "Abendnotiz" },
  kalender: { titel: "Kalender", mittwoch: "Mittwoch", donnerstag: "Donnerstag", termine: "Termine übrig" },

  /* Fraktionsleiste und Wirkungsanzeige (Abschnitt 5.6) */
  leisten: { fraktionen: "Ausschuss – erwartete Stimmen", vertrauen: "Vertrauen" },

  /* Große Mehrheitsanzeige (oben in der Mitte) */
  mehrheit: {
    ausschuss: "Ausschuss", plenum: "Plenum", ja: "Ja", nein: "Nein", enthaltung: "Enthaltung",
    erreicht: "Mehrheit – {n} Stimmen Vorsprung", erreichtEins: "Mehrheit – eine Stimme Vorsprung",
    fehlen: "Dir fehlen {n} Stimmen", fehltEine: "Dir fehlt eine Stimme",
    mitAenderung: "Mit dieser Änderung:", details: "Wer stimmt wie?", weniger: "Weniger zeigen",
    regel: "Gewonnen ist, wenn mehr Ja als Nein kommen."
  },

  /* Aufgabenkarte oben links: Ziel des Kapitels und nächster Schritt */
  aufgaben: {
    titel: "Deine Aufgabe", ziel: "Ziel", jetzt: "Jetzt",
    k1: { ziel: "Lerne deinen Auftrag kennen.", schritte: { start: "Hör Mira zu.", probe: "Probier es aus: Wähle im Gesetz eine andere Option.", fertig: "Der erste Tag ist geschafft." } },
    k2: { ziel: "Sammle Argumente für dein Gesetz.", schritte: { start: "Hör dem Ökonomen zu.", fragen: "Stell den Gästen deine Fragen. Jede Antwort wird eine Karte in deinem Dossier." },
          fortschritt: "Fragen: {n} von {max}" },
    k3: { ziel: "Schreib ein Gesetz, für das im Ausschuss mehr Ja als Nein kommen.", schritte: { start: "Hör Mira und dem Juristischen Dienst zu.", artikel: "Entscheide in jedem Artikel eine Frage. Behalte die Mehrheit oben im Blick.", einreichen: "Fertig? Dann reich den Entwurf ein." },
          fortschritt: "Artikel {n} von {max}" },
    k4: { ziel: "Gewinne Stimmen, bevor der Ausschuss abstimmt.", schritte: { start: "Hör Mira zu.", uebersicht: "Wähle ein Büro, die Bibliothek oder die Cafeteria.", gespraech: "Verhandle: Karte vorlegen, etwas anbieten oder etwas versprechen." },
          fortschritt: "Termine übrig: {n} von {max}" },
    k5: { ziel: "Der Ausschuss stimmt ab.", schritte: { start: "Schau zu, wie abgestimmt wird." } },
    k6: { ziel: "Einige dich mit Rat und Kommission auf einen gemeinsamen Text.", schritte: { start: "Hör zu, was Rat und Kommission wollen.", tabelle: "Entscheide bei jedem Streitpunkt: halten, Mittelweg oder dem Rat nachgeben." },
          fortschritt: "Der Rat gibt noch bei {n} Punkten nach" },
    k7: { ziel: "Überzeuge das Plenum.", schritte: { start: "Gleich hältst du deine Rede.", rede: "Wähle Einstieg, Kernpunkt und Schluss deiner Rede.", abstimmung: "Das Plenum stimmt ab." } }
  },

  /* Mira erklärt jeden neuen Bildschirm einmal (Hervorhebung + ein Satz) */
  fuehrung: {
    verstanden: "Verstanden",
    probe: "Hier entscheidest du. Tipp eine Option an – auf dem Blatt siehst du sofort, was sich ändert.",
    mehrheitProbe: "Und hier oben siehst du, wie der Ausschuss gerade abstimmen würde.",
    fragen: "Du kannst nicht alle fragen. Jede Antwort landet als Karte in deinem Dossier – die brauchst du später zum Verhandeln.",
    dossier: "Hier liegt dein Dossier. Tipp es an, wann immer du deine Karten sehen willst.",
    mehrheit: "Das Wichtigste: Du brauchst mehr Ja als Nein. Tipp hier, um zu sehen, welche Fraktion wie denkt.",
    artikel: "Sieben Artikel, in jedem eine Entscheidung. Neben jeder Option steht, wer sie mag und wer nicht.",
    wirkung: "Das zeigt, was dein Gesetz bewirkt. Mehr ist nicht immer besser – achte auf Aufwand und Rechtssicherheit.",
    einreichen: "Wenn du fertig bist, reichst du hier ein. Danach änderst du den Text nur noch durch Verhandlungen.",
    buero: "Tipp ein Büro an, um mit der Fraktion zu reden. Jeder Besuch kostet einen Termin – du hast nur wenige.",
    verhandeln: "Eine passende Karte schafft Vertrauen. Ein Zugeständnis ändert deinen Text. Ein Versprechen musst du im Trilog halten.",
    trilog: "Links steht, was du willst und was der Rat will. Der Rat gibt nur bei wenigen Punkten nach – such dir aus, wo du hart bleibst.",
    rede: "Deine Rede kann Unentschlossene überzeugen. Wähle, was zu deinem Gesetz passt."
  },
  wirkung: {
    titel: "Wirkung",
    untertitel: "Einschätzung im Spiel – vereinfacht, keine Prognose",
    achsen: { wissen: "Wissen", durchsetzung: "Durchsetzung", aufwand: "Aufwand für Betriebe", recht: "Rechtssicherheit" },
    grau: "Ursachen außerhalb dieses Gesetzes (Kitas, Elternzeit, Berufswahl)",
    grauErklaerung: ["Diese Leiste bleibt grau, egal was ihr schreibt. Kita-Plätze, Elternzeit, Berufswahl – das regelt ein Transparenzgesetz nicht.", "Dafür bräuchte es andere Gesetze. Gut, dass ihr das hier macht. Aber es ist nur die Hälfte."]
  },

  /* Dossier (Abschnitt 5.4) */
  dossier: { titel: "Dossier", leer: "Noch keine Karten. Alles, was du hörst, landet hier.", neu: "Neu im Dossier –", waehlen: "Welche Karte legst du vor?",
    versprechen: "Deine Versprechen", arten: { stimme: "Stimme", beleg: "Beleg", einwand: "Einwand" }, von: { bibliothek: "Bibliothek des Parlaments" } },

  /* Entwurf (Kapitel 3) */
  editor: {
    kommission: "Kommission", dafuerDagegen: "Dafür / Dagegen", dafuer: "Dafür:", dagegen: "Dagegen:", moegen: "Mögen das:", ablehnen: "Lehnen ab:",
    gestrichen: "(gestrichen)", lesehilfe: "In einem Satz:", wunschTab: "Wunschzettel", wunschTitel: "Wunschzettel",
    wunschErklaerung: "Zwei Vorschläge, die viele gut finden. Gehören sie in dieses Gesetz?",
    wunschRein: "In den Entwurf aufnehmen", wunschRaus: "Wieder herausnehmen",
    einreichen: "Entwurf einreichen", einreichenFrage: "Danach kannst du den Text nur noch über Verhandlungen und im Trilog ändern. Jetzt einreichen?",
    probeHinweis: "Nur eine Probe: Wähle eine Option und schau auf die Mehrheit oben.",
    artikelVon: "Artikel {n} von {max}", zurueck: "Zurück", weiter: "Nächster Artikel", extras: "Extra",
    keiner: "niemand", wirkungTitel: "Was bewirkt dein Gesetz?"
  },

  /* Kapitel 2 */
  anhoerung: { titel: "Wen fragst du?", uebrig: "Fragen übrig" },

  /* Kapitel 4 */
  flure: {
    cafeteria: "Cafeteria", bibliothek: "Bibliothek", bibliothekTitel: "Bibliothek des Parlaments",
    cafeteriaSchon: "In der Cafeteria warst du heute schon.", bibliothekLeer: "Die Bibliothek hat dir schon alles gegeben.",
    wasTun: "Wie antwortest du?", schonDrin: "steht schon so im Entwurf",
    zugestaendnisFrage: "Diese Änderung in den Entwurf übernehmen:", zugestaendnisJa: "Ja, übernehmen"
  },

  /* Kapitel 6 */
  trilog: {
    titel: "Der Trilog", spalten: ["Streitpunkt", "Du (Parlament)", "Rat", "Deine Entscheidung"],
    einig: "Schon einig:", einigPunkte: "Punkte",
    budget: "Spielraum des Rates:", halten: "Parlament halten", uebernehmen: "Rat übernehmen", mittelweg: "Mittelweg", bruecke: "Tiago fragen",
    brueckeText: "Ein Kompromisstext der Kommission.", abschliessen: "Kompromiss abschließen", nochOffen: "Es sind noch Zeilen offen.",
    praezisieren: "Formulierung präzisieren", nichtPraezisieren: "So lassen"
  },

  /* Kapitel 7 */
  plenum: { einstieg: "Deine Rede – Einstieg", kern: "Deine Rede – Kern: Welcher Artikel?", schluss: "Deine Rede – Schluss",
    wieWeiter: "Wie geht es weiter?", anlauf: "Neuer Anlauf (zurück in den Trilog)", zumEpilog: "Zum Epilog" },

  /* Epilog und Vergleich */
  epilogArten: { postkarte: "Postkarte", brief: "Brief", chat: "Nachricht", zeitung: "Zeitungsausschnitt" },
  epilogWeiter: "Weiter", zumVergleich: "So ist es wirklich", zumTitel: "Zum Titel",
  vergleichAngenommen: "Dein Gesetz wurde im Plenum angenommen.", vergleichAbgelehnt: "Dein Gesetz kam im Plenum nicht durch.",
  quellenTitel: "Quellen (automatisch aus den Fakten des Spiels)", geprueft: "geprüft", ungeprueft: "noch nicht geprüft",

  /* Kapitelkarten (Kapitelnummer setzt der Code ein) */
  kapitelWort: "Kapitel",
  kapitel: [
    { titel: "Der Stapel", tag: "Montag", zeile: "Ein dicker Vorschlag, ein neues Büro – und ein Zettel auf dem Schreibtisch." },
    { titel: "Die Anhörung", tag: "Dienstag, {wert:uhr_anhoerung}", zeile: "Fünf Menschen, fünf Blickwinkel. Du darfst nur einige fragen." },
    { titel: "Der Entwurf", tag: "Dienstag, später Vormittag", zeile: "Sieben Artikel. Jedes Wort hat Freund*innen und Feind*innen." },
    { titel: "Die Flure", tag: "Mittwoch", zeile: "Verhandeln, zuhören, Versprechen geben." },
    { titel: "Die Ausschussabstimmung", tag: "Donnerstag", zeile: "Hände gehen hoch. Oder nicht." },
    { titel: "Der Trilog", tag: "Donnerstag, nachts", zeile: "Parlament, Rat und Kommission an einem Tisch." },
    { titel: "Das Plenum", tag: "Straßburg", zeile: "Die letzte Abstimmung." }
  ],

  /* Kurze Szenenbeschreibung für Bildschirmleser (das 3D-Bild selbst ist aria-hidden) */
  szenen: {
    titel: "Ein leerer Plenarsaal im Morgengrauen. Ein Sonnenstrahl fällt durch das Glasdach. Auf dem Rednerpult liegt ein Blatt mit dem Titel Mehrheit.",
    ausschusssaal: "Ein Ausschusssaal mit hufeisenförmigem Eichentisch, Mikrofonen, Flaggen und Dolmetschkabinen. Fünf Gäste sitzen am Kopfende.",
    gebaeude: "Ein aufgeschnittenes Modell des Parlamentsgebäudes mit drei Etagen: Cafeteria, Bibliothek und die Büros der Fraktionen. Nachmittagssonne fällt durch die Fenster.",
    trilog: "Ein fensterloser Verhandlungsraum bei Nacht. Über dem langen Tisch hängt eine Pendelleuchte. Am Fenster läuft Regen herunter.",
    plenum: "Der Plenarsaal in Straßburg, voll besetzt. Licht fällt durch das Glasdach. Am Rednerpult steht die Spielfigur.",
    epilog: "Eine Collage auf einem Tisch: Postkarte, Brief, Telefon mit Nachrichten und ein Zeitungsausschnitt.",
    buero: "Ein schmales Büro mit Fensterwand. Auf dem Schreibtisch liegen der Gesetzentwurf, ein gläsernes Modell des Ausschusses und ein Becher Kaffee. Mira sitzt an einem kleinen Tisch, die Spielfigur steht am Schreibtisch."
  },

  /* Blatt am Rednerpult in Kapitel 7 */
  plenumBlatt: "Schlussabstimmung im Plenum",

  /* Bildschirm im Büro: Miras Mail */
  mail: {
    von: "Mira Kovács",
    betreff: "Glückwunsch. Und Beileid.",
    zeilen: ["Du bist Berichterstatter*in.", "Der Vorschlag der Kommission liegt", "auf deinem Schreibtisch.", "Kaffee steht daneben. – M."]
  },

  /* Zettel von Inès an der Pinnwand (Abschnitt 3.1) */
  zettel: "Meine Kollegin und ich machen dieselbe Arbeit. Ich habe zufällig gesehen, dass sie mehr verdient – oder ich weniger? Ich weiß es nicht mal. Wie soll ich das überhaupt herausfinden?",
  zettelUnterschrift: "Inès",

  /* Kopf der Gesetzesseite */
  dokument: {
    kopfLinks: "Europäisches Parlament",
    kopfRechts: "Ausschuss für Beschäftigung und Gleichstellung",
    art: "ENTWURF EINES BERICHTS",
    titel: "über den Vorschlag für eine Richtlinie zur Stärkung des Grundsatzes des gleichen Entgelts durch Entgelttransparenz",
    berichterstattung: "Berichterstattung: {name} (Brücke)",
    fuss: "Entwurf – vertraulich",
    stempel: { eingereicht: "EINGEREICHT", angenommen: "ANGENOMMEN", abgelehnt: "ABGELEHNT", kompromiss: "KOMPROMISS", vertraulich: "VERTRAULICH" },
    /* zweite Seite des Entwurfs (Begründung) */
    seite2: {
      titel: "Begründung",
      absaetze: [
        "Der Grundsatz des gleichen Entgelts für Frauen und Männer bei gleicher oder gleichwertiger Arbeit gilt in der Union seit {fakt:rv_1957}. Rechtsgrundlage ist {fakt:aeuv_157}.",
        "Viele Beschäftigte wissen nicht, ob sie fair bezahlt werden. Ohne dieses Wissen lässt sich ungleiche Bezahlung kaum erkennen.",
        "Wer eine Benachteiligung vermutet, scheitert oft an fehlenden Informationen und an hohen Hürden vor Gericht.",
        "Diese Richtlinie stärkt daher die Transparenz der Entgelte und die Durchsetzung des Rechts auf gleiches Entgelt."
      ]
    }
  },

  /* Halbrund als Text (aria-live). Zahlen setzt der Code ein. */
  halbrund: { ja: "Ja", nein: "Nein", enthaltung: "Enthaltung", mehrheit: "Mehrheit erreicht", keineMehrheit: "keine Mehrheit" },

  /* Einstellungen (Abschnitt 9) */
  einstellungen: {
    titel: "Einstellungen",
    grafik: "Grafikstufe",
    grafikStufen: { auto: "Automatisch", ultra: "Ultra", hoch: "Hoch", mittel: "Mittel", niedrig: "Niedrig" },
    tiefe: "Tiefenschärfe",
    korn: "Filmkorn",
    helligkeit: "Bildschirmhelligkeit",
    ton: "Ton",
    lautMusik: "Musik",
    lautGeraeusche: "Geräusche",
    schrift: "Schriftgröße",
    kontrast: "Hoher Kontrast",
    bewegung: "Bewegung reduzieren",
    schreibmaschine: "Schreibmaschinen-Tempo",
    lesehilfe: "Lesehilfe (Ein-Satz-Zusammenfassung je Artikel)",
    an: "an", aus: "aus", schliessen: "Schließen",
    langsam: "langsam", normal: "normal", schnell: "schnell", sofort: "sofort",
    abgesenkt: "Die Grafikstufe wurde gesenkt, damit das Spiel flüssig läuft."
  },

  ueber: {
    titel: "Über das Spiel",
    absaetze: [
      "**Mehrheit** ist ein Lernspiel über die Lohnlücke zwischen Frauen und Männern in Europa – und darüber, wie ein europäisches Gesetz entsteht.",
      "Du spielst eine neu gewählte abgeordnete Person im Europäischen Parlament und schreibst als Berichterstatter*in einen Gesetzesvorschlag. Dafür brauchst du eine Mehrheit.",
      "Alle Personen, Fraktionen, Firmen und Geschichten sind erfunden. Die Richtlinie und die Zahlen sind echt – die Quellen stehen am Ende des Spiels.",
      "Ein Beitrag zum Schülerwettbewerb „Europäischer Wettbewerb“."
    ]
  },

  /* Hinweise */
  hinweise: {
    laden: "Der Saal wird aufgebaut …",
    kontextVerloren: "Die Grafik wird neu aufgebaut …",
    webgl1: "Dein Browser kann nur einfache 3D-Grafik. Das Spiel läuft mit der Stufe „Niedrig“."
  },

  /* Dokumentmodus: wenn gar kein WebGL geht (Abschnitt 10.1) */
  dokumentmodus: {
    titel: "Dokumentmodus",
    hinweis: "Dein Browser zeigt keine 3D-Grafik. Das Spiel läuft trotzdem vollständig als Dokument. Für das 3D-Bild: In den Browser-Einstellungen „Hardwarebeschleunigung verwenden“ einschalten und den Browser neu starten.",
    halbrundTitel: "Der Ausschuss",
    plenumTitel: "Das Plenum",
    gespraechTitel: "Gespräch"
  },

  /* Verstecktes Admin-Menü für Lehrkräfte und Jury (5× auf den Titel tippen oder „admin“ tippen) */
  admin: {
    titel: "Admin",
    hinweis: "Zum Vorführen und Prüfen. Änderungen hier werden nicht gespeichert, außer du schaltest das Speichern ausdrücklich ein.",
    speichern: "Spielstand speichern", aus: "aus", an: "an",
    speichernFrage: "Der bisherige Spielstand wird dann überschrieben. Speichern einschalten?", speichernJa: "Einschalten",
    kapitel: "Zu Kapitel springen",
    entwurf: "Beispielentwurf", mutig: "mutig", mitte: "Mitte (Kommission)", schlank: "schlank",
    karten: "Alle Karten ins Dossier", kartenOk: "Alle Karten liegen im Dossier.",
    vergleich: "Direkt zu „So ist es wirklich“",
    epilog: "Epilog", vergleichKurz: "Vergleich",
    balance: "Mehrheiten der Beispielentwürfe (ohne Verhandlung)", ausschuss: "Ausschuss", plenum: "Plenum",
    entwurfGesetzt: "Beispielentwurf gesetzt:"
  },

  /* Gesprächsleiste */
  leiste: { weiter: "Weiter", schliessen: "Gespräch beenden" },

  /* Fachbegriffe, die beim ersten Auftreten erklärt werden (ausführlich in Phase 2: data/glossar.js) */
  berichterstatter: "Berichterstatter*in: die abgeordnete Person, die für das Parlament einen Gesetzesvorschlag bearbeitet.",

  /* Ziffern, die in Texten erlaubt sind (Ziffernprüfung im Debug-Modus).
     Nur Artikelnummern im Gesetzestext. */
  ziffernAusnahmen: ["Artikel \\d+", "3D"]
};
