/* =====================================================================
   Die Lücke – Dialoge und Spieltexte
   ---------------------------------------------------------------------
   1) DATA.texte     – Texte von Menüs, Hinweisen und Einblendungen
   2) DATA.dialogues – Gesprächsbäume (ab Phase 2)

   Aufbau eines Dialogs (ab Phase 2):
   DATA.dialogues.de_lea = {
     einstieg: [ { wenn: "de_lea_fertig", knoten: "danach" }, { knoten: "start" } ],
     knoten: {
       start: { speaker: "Lea", emotion: "froehlich", text: "…",
                options: [ { label: "…", next: "warum", setFlag: "…",
                             requiresFlag: "…", addNote: "…" } ] },
       warum: { speaker: "Lea", emotion: "nachdenklich", text: "…", next: "ende" }
     }
   };
   Zahlen niemals direkt schreiben, sondern als {fakt:gpg_de} einsetzen.
   ===================================================================== */
var DATA = window.DATA = window.DATA || {};

DATA.texte = {
  spielTitel: "Die Lücke",
  untertitel: "Ein europäischer Fall",

  fehlerWebGL: {
    titel: "Oh nein – die 3D-Grafik startet nicht",
    text: "Dein Browser kann gerade kein WebGL verwenden. Das Spiel braucht es, um die kleine 3D-Welt zu zeichnen.",
    tipps: [
      "Öffne das Spiel in einem aktuellen Browser (Edge, Chrome oder Firefox).",
      "Prüfe in den Browser-Einstellungen, ob die Hardwarebeschleunigung eingeschaltet ist.",
      "Lade die Seite neu oder starte den Browser neu."
    ]
  },
  fehlerVerloren: "Die Grafik wurde kurz zurückgesetzt. Bitte lade die Seite neu (F5).",

  steuerung: {
    titel: "So spielst du",
    zeilen: [
      ["W A S D", "oder Pfeiltasten: laufen"],
      ["E", "oder Leertaste: sprechen & untersuchen"],
      ["Klick", "oder Tippen: hinlaufen, ansprechen, im Gespräch weiter"],
      ["Ziehen", "mit Maus oder Finger: laufen wie mit einem Joystick"],
      ["Esc", "Pause & Einstellungen"],
      ["N", "Notizbuch"],
      ["Q", "Aufgaben"]
    ],
    weiter: "Los geht's!",
    weiterTaste: "E"
  },

  pause: {
    titel: "Pause",
    weiter: "Weiterspielen",
    grafik: "Grafik",
    hoch: "Hoch",
    niedrig: "Niedrig",
    an: "An",
    aus: "Aus",
    steuerung: "Steuerung anzeigen",
    titelbildschirm: "Zum Titelbildschirm",
    hinweisNeuladen: "Das Spiel speichert automatisch. Die Kantenglättung ändert sich erst nach dem Neuladen."
  },

  hudTaste: "E",
  gespraechBeenden: "Gespräch beenden (Esc)",
  knoepfe: { buch: "Notizbuch (N)", aufgaben: "Aufgaben (Q)", pause: "Pause (Esc)" },
  notizNeu: "Neue Notiz:",
  beweisNeu: "Beweisstück gefunden:",
  hineingehen: "Hineingehen",
  hinausgehen: "Hinausgehen",
  ansehen: "Ansehen",
  aufzug: "Aufzug",
  aufzugTitel: "Aufzug – welche Etage?",
  aufzugHier: "Du bist hier:",
  hudGpg: "Gender Pay Gap:",
  schliessen: "Schließen",

  notizbuch: {
    titel: "Kims Notizbuch",
    reiter: [
      { id: "teilzeit",    titel: "Teilzeit" },
      { id: "elternzeit",  titel: "Elternzeit" },
      { id: "branchen",    titel: "Branchen" },
      { id: "verhandlung", titel: "Verhandlung & Beförderung" },
      { id: "rest",        titel: "Unerklärter Rest" },
      { id: "eurecht",     titel: "EU-Recht" }
    ],
    leer: "Hier ist noch nichts notiert. Sprich mit den Leuten in den Vierteln!",
    quelle: "Quelle:",
    fuss: "← → Reiter wechseln · ↑ ↓ blättern · N oder Esc schließen"
  },
  questlog: {
    titel: "Aufgaben",
    leer: "Noch keine Aufgaben. Sprich mit Dr. Laurent am Brunnen.",
    fuss: "Q oder Esc schließen"
  },

  // ---------------- Titelbildschirm (Phase 4) ----------------
  titel: {
    neu: "Neues Spiel",
    weiter: "Weiterspielen",
    steuerung: "Steuerung",
    credits: "Credits",
    neuFrage: "Neues Spiel beginnen?",
    neuText: "Dein bisheriger Spielstand wird dabei überschrieben.",
    neuJa: "Ja, neu beginnen",
    neuNein: "Abbrechen",
    fuss: "↑ ↓ wählen · Enter bestätigen"
  },

  credits: {
    titel: "Credits",
    zeilen: [
      ["Idee, Konzept und Texte", "[Dein Name / eure Namen]"],
      ["Gestaltung", "[Dein Name / eure Namen]"],
      ["Programmierung", "[Dein Name] mit Unterstützung durch KI"],
      ["Beitrag für", "Europäischer Wettbewerb"]
    ],
    ki: "Hinweis zum KI-Einsatz: Beim Programmieren und beim Formulieren wurde das KI-Werkzeug Claude (Anthropic) eingesetzt. Was von der KI stammt und was selbst gemacht oder geprüft wurde, steht in der Datei KI-DOKUMENTATION.md.",
    hinweis: "Alle Figuren, Firmen und Orte im Spiel sind erfunden. Ähnlichkeiten mit echten Personen wären Zufall.",
    zurueck: "Zurück"
  },

  // ---------------- Epilog und Reflexion (Phase 4) ----------------
  reflexion: {
    titel: "Zum Nachdenken",
    einleitung: "Die Geschichte ist erfunden – die Fragen sind echt.",
    fragen: [
      "Welche Ursache der Lohnlücke hat dich am meisten überrascht – und warum?",
      "Ab wann ist eine Entscheidung wirklich frei? Denk an Teilzeit, Elternzeit und Berufswahl.",
      "Welche Maßnahme würdest du in deinem Land zuerst umsetzen – und wer müsste dafür etwas abgeben?"
    ],
    entscheidungen: "Deine Vorschläge im Ausschuss",
    punkte: "Überzeugungspunkte im Duell: {p} von {max}",
    keineEntscheidung: "Du hast dem Ausschuss noch keine Maßnahmen vorgeschlagen.",
    quellenTitel: "Quellen",
    quellenHinweis: "Alle Zahlen im Spiel stammen aus diesen Quellen (Details in QUELLEN.md).",
    ungeprueft: "noch nicht geprüft",
    creditsTitel: "Credits",
    zumTitel: "Zum Titelbildschirm",
    weiterErkunden: "Weiter erkunden"
  },

  // Verstecktes Admin-Menü („admin“ tippen oder 5× aufs Logo im Titel)
  admin: {
    titel: "Admin-Menü",
    hinweis: "Nur zum Testen und Vorführen. Freischalten verändert den Spielstand.",
    allesFrei: "Alles freischalten (Beweisstücke, Notizen, Aufgaben)",
    freiGeschaltet: "Alles freigeschaltet!",
    finale: "Direkt zum Finale (Sitzungssaal)",
    epilog: "Epilog ansehen",
    reisen: "Reisen zu …",
    loeschen: "Spielstand löschen",
    geloescht: "Spielstand gelöscht",
    zurueck: "Zurück",
    schliessen: "Schließen"
  },

  speichern: {
    fehlt: "Es gibt noch keinen Spielstand.",
    geladen: "Spielstand geladen"
  },
  verschlossen: "Verschlossen",

  test: {
    fundUntersuchen: "Untersuchen",
    fundText: "Test-Fundstück gefunden!",
    figurHallo: "Hallo!"
  }
};

DATA.dialogues = {

  // ========================================================================
  //  INTRO (startet automatisch beim ersten Betreten des Europaplatzes)
  // ========================================================================
  intro: {
    abbrechbar: false,
    knoten: {
      start: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "froehlich",
        text: "Da bist du ja, Kim! Willkommen am Europaplatz. Ich bin Marie Laurent – ab heute deine Chefin im EU-Büro für Gleichstellung.",
        next: "k2" },
      k2: { speaker: "Kim", emotion: "froehlich",
        text: "Hallo! Ich bin bereit. Glaube ich. Ich habe sogar ein neues Notizbuch dabei.",
        next: "k3" },
      k3: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "nachdenklich",
        text: "Sehr gut, das wirst du brauchen. Darf ich vorstellen: Anna und Jonas. Geschwister, gleiche Ausbildung, beide in ähnlichen Firmen.",
        next: "k4" },
      k4: { speaker: "Anna", wer: "anna", emotion: "neutral",
        text: "Hallo, Kim! Wir haben neulich unsere Gehaltszettel verglichen. Eigentlich als Witz …",
        next: "k5" },
      k5: { speaker: "Jonas", wer: "jonas", emotion: "ueberrascht", emote: "schweiss",
        text: "… und dann war es plötzlich gar nicht mehr witzig. Ich verdiene deutlich mehr als Anna.",
        next: "k6" },
      k6: { speaker: "Anna", wer: "anna", emotion: "nachdenklich",
        text: "Dabei machen wir fast dieselbe Arbeit. Ich will einfach verstehen, woher das kommt.",
        next: "k7" },
      k7: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "neutral",
        text: "Genau das ist dein Auftrag, Kim. Hinter so einem Unterschied stecken meist mehrere Ursachen – und keine davon gibt es nur in einem einzigen Land.",
        next: "k8" },
      k8: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "nachdenklich",
        text: "In der EU verdienen Frauen pro Stunde im Schnitt {fakt:gpg_eu} weniger als Männer. Das nennt man den unbereinigten Gender Pay Gap.",
        addNote: "gpg_eu",
        options: [
          { label: "Was heißt „unbereinigt“?", next: "unbereinigt" },
          { label: "Und was soll ich jetzt tun?", next: "k9" }
        ] },
      unbereinigt: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "nachdenklich",
        text: "Dabei werden einfach alle Stundenlöhne verglichen – egal, in welchem Beruf oder mit wie vielen Stunden. Ein Teil der Lücke lässt sich durch solche Unterschiede erklären. Ein anderer Teil nicht. Den nennen wir den **unerklärten Rest**.",
        next: "k9" },
      k9: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "neutral",
        text: "Besuch vier Viertel: Deutschland, Schweden, Estland und Luxemburg. In jedem steckt eine andere Ursache. Bring mir aus jedem ein Beweisstück mit.",
        next: "k10" },
      k10: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "froehlich",
        text: "Mit allen vier öffnet sich das Tor nach Brüssel. Dort legen wir dem Ausschuss deine Empfehlungen vor.",
        next: "k11" },
      k11: { speaker: "Kim", emotion: "nachdenklich",
        text: "Vier Länder, ein Tor, ein Ausschuss. Also kein Druck.",
        next: "k12" },
      k12: { speaker: "Jonas", wer: "jonas", emotion: "froehlich",
        text: "Wir warten hier am Brunnen. Und Kim – danke, dass du dir das anschaust.",
        next: "k13" },
      k13: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "froehlich",
        text: "Fang am besten im Deutschland-Viertel an: der Weg nach Westen, links vom Brunnen. Viel Erfolg!",
        setFlag: "intro_fertig", aktion: "emoteKim:gluehbirne",
        next: "ende" }
    }
  },

  // ========================================================================
  //  EUROPAPLATZ
  // ========================================================================
  hub_laurent: {
    einstieg: [
      { wenn: "finale_fertig", knoten: "nach_finale" },
      { wenn: "alle_beweise&!hub_laurent_alle", knoten: "alle" },
      { wenn: "alle_beweise", knoten: "start_bxl" },
      { wenn: "beweis_de&!hub_laurent_de", knoten: "nach_de" },
      { wenn: "beweis_se&!hub_laurent_se", knoten: "nach_se" },
      { wenn: "beweis_ee&!hub_laurent_ee", knoten: "nach_ee" },
      { wenn: "beweis_lu&!hub_laurent_lu", knoten: "nach_lu" },
      { knoten: "start" }
    ],
    knoten: {
      start: { speaker: "Dr. Marie Laurent", emotion: "neutral",
        text: "Na, Kim? Deutschland liegt im Westen, Schweden im Osten, Estland im Südwesten und Luxemburg im Südosten. Die Wegweiser helfen dir.",
        options: [
          { label: "Kannst du den Auftrag noch mal erklären?", next: "erklaeren" },
          { label: "Bis später!", next: "ende" }
        ] },
      erklaeren: { speaker: "Dr. Marie Laurent", emotion: "froehlich",
        text: "Vier Viertel, vier Ursachen, vier Beweisstücke. Hör gut zu – die Leute dort sind sich nicht immer einig. Das ist gut so: Du sollst dir selbst ein Bild machen.",
        next: "ende" },
      nach_de: { speaker: "Dr. Marie Laurent", emotion: "ueberrascht",
        text: "Die Warteliste der Kita! Sehr gut. Was nimmst du aus dem Deutschland-Viertel mit?",
        options: [
          { label: "Teilzeit ist oft keine ganz freie Wahl.", next: "nach_de_a" },
          { label: "Viele entscheiden sich bewusst für Teilzeit.", next: "nach_de_b" }
        ] },
      nach_de_a: { speaker: "Dr. Marie Laurent", emotion: "nachdenklich",
        text: "Das hören wir oft. Wenn Betreuung fehlt, reduziert häufig die Person, die ohnehin weniger verdient. Teilzeit wird pro Stunde oft schlechter bezahlt und bremst Beförderungen – so wächst die Lohnlücke.",
        next: "nach_de_ende" },
      nach_de_b: { speaker: "Dr. Marie Laurent", emotion: "nachdenklich",
        text: "Auch das stimmt. Die Frage ist nur: Unter welchen Bedingungen wird entschieden? Mit Kita-Platz entscheidet man anders als ohne. Und die Folgen für den Stundenlohn und die Karriere sind dieselben.",
        next: "nach_de_ende" },
      nach_de_ende: { speaker: "Dr. Marie Laurent", emotion: "froehlich",
        text: "Weiter geht's: Schweden liegt im Osten, Estland im Südwesten, Luxemburg im Südosten.",
        setFlag: "hub_laurent_de", next: "ende" },
      nach_se: { speaker: "Dr. Marie Laurent", emotion: "froehlich",
        text: "Ein Elternzeit-Kalender aus Schweden! Reservierte Tage für jeden Elternteil – was hältst du davon?",
        options: [
          { label: "Das könnte auch anderswo helfen.", next: "se_a" },
          { label: "Das sollte jede Familie selbst entscheiden.", next: "se_b" }
        ] },
      se_a: { speaker: "Dr. Marie Laurent", emotion: "nachdenklich",
        text: "Viele sehen das so. Wer lange allein aussetzt, verdient danach oft langsamer mehr – geteilte Elternzeit verteilt diesen Knick. Trotzdem nehmen auch in Schweden Väter noch weniger Tage als Mütter.",
        setFlag: "hub_laurent_se", next: "ende" },
      se_b: { speaker: "Dr. Marie Laurent", emotion: "nachdenklich",
        text: "Ein wichtiger Einwand, den du in Brüssel sicher wieder hörst. Die Frage ist, ob eine Wahl ohne reservierte Tage wirklich frei ist.",
        setFlag: "hub_laurent_se", next: "ende" },
      nach_ee: { speaker: "Dr. Marie Laurent", emotion: "nachdenklich",
        text: "Die Gehaltstabelle aus Estland. Branchen mit vielen Frauen zahlen oft weniger – und niemand hat das bewusst so beschlossen. Genau das macht es so schwierig.",
        setFlag: "hub_laurent_ee", next: "ende" },
      nach_lu: { speaker: "Dr. Marie Laurent", emotion: "ueberrascht",
        text: "Eine Beförderungsliste aus Luxemburg – und das in einem Land mit fast keiner Lücke im Durchschnitt! Gut, dass du genauer hingeschaut hast.",
        setFlag: "hub_laurent_lu", next: "ende" },
      alle: { speaker: "Dr. Marie Laurent", emotion: "froehlich", emote: "herz",
        text: "Alle vier Beweisstücke! Kim, das ist großartig. Das Tor im Norden ist offen – in Brüssel wartet der Ausschuss.",
        setFlag: ["hub_laurent_alle", "hub_laurent_de", "hub_laurent_se", "hub_laurent_ee", "hub_laurent_lu"], next: "alle2" },
      alle2: { speaker: "Dr. Marie Laurent", emotion: "nachdenklich",
        text: "Ein Stück fehlt dir aber noch: der unerklärte Rest. Schau in Brüssel zuerst ins Archiv. Ich komme nach und halte dir einen Platz im Sitzungssaal frei.",
        next: "ende" },
      start_bxl: { speaker: "Dr. Marie Laurent", emotion: "froehlich",
        text: "Das Tor im Norden steht offen. In Brüssel zuerst ins Archiv, dann in den Sitzungssaal. Du schaffst das!",
        next: "ende" },
      nach_finale: { speaker: "Dr. Marie Laurent", emotion: "froehlich",
        text: "Kim! Im Büro reden alle noch von deinem Auftritt im Ausschuss. Ich bin sehr stolz auf dich.",
        options: [
          { label: "Noch mal über alles nachdenken", next: "ende", aktion: "reflexion" },
          { label: "Danke! Ich schau mich noch ein bisschen um.", next: "ende" }
        ] }
    }
  },

  hub_anna: {
    einstieg: [ { wenn: "beweis_de", knoten: "nach_de" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Anna", emotion: "nachdenklich",
        text: "Weißt du, was komisch ist? Ich arbeite gern. Aber seit dem Vergleich frage ich mich bei jeder Gehaltsrunde: Hätte ich mehr verlangen sollen?",
        options: [
          { label: "Hast du mal verhandelt?", next: "verhandelt" },
          { label: "Ich finde es heraus.", next: "danke" }
        ] },
      verhandelt: { speaker: "Anna", emotion: "skeptisch",
        text: "Einmal. Da hieß es: „Das Budget ist leider ausgeschöpft.“ Jonas hat im selben Jahr mehr bekommen. Hat er besser verhandelt – oder hat man ihm einfach mehr zugetraut?",
        next: "danke" },
      danke: { speaker: "Anna", emotion: "froehlich",
        text: "Danke, Kim. Ich sitze solange hier und zähle Tauben. Es gibt hier keine Tauben. Ich zähle trotzdem.",
        next: "ende" },
      nach_de: { speaker: "Anna", emotion: "nachdenklich",
        text: "Eine Kita-Warteliste? Ich habe keine Kinder, aber meine Kollegin wartet seit einem Jahr auf einen Platz. So lange arbeitet sie weniger.",
        next: "ende" }
    }
  },

  hub_jonas: {
    knoten: {
      start: { speaker: "Jonas", emotion: "skeptisch",
        text: "Ehrlich gesagt dachte ich immer, ich verdiene mehr, weil ich so gut bin. Jetzt frage ich mich, ob das die ganze Geschichte ist.",
        options: [
          { label: "Vielleicht ist es ein Teil davon.", next: "teil" },
          { label: "Habt ihr früher schon mal übers Geld geredet?", next: "reden" }
        ] },
      teil: { speaker: "Jonas", emotion: "nachdenklich", emote: "schweiss",
        text: "Kann sein. Aber Anna ist mindestens genauso gut. Mindestens. Sag ihr bitte nicht, dass ich das gesagt habe.",
        next: "ende" },
      reden: { speaker: "Jonas", emotion: "nachdenklich",
        text: "Nie. „Über Geld redet man nicht“, hieß es immer. Seltsame Regel eigentlich. Wem hilft die?",
        next: "ende" }
    }
  },

  hub_sanne: {
    knoten: {
      start: { speaker: "Sanne", emotion: "froehlich",
        text: "Post fürs EU-Büro! … Ach, du bist ja das EU-Büro. Dann ist das hier deine Werbung für Gartenzwerge.",
        options: [
          { label: "Danke …?", next: "zwerge" },
          { label: "Wie ist es, Post auszutragen?", next: "beruf" }
        ] },
      zwerge: { speaker: "Sanne", emotion: "froehlich",
        text: "Gern! Die Zwerge sind übrigens im Angebot.",
        next: "ende" },
      beruf: { speaker: "Sanne", emotion: "nachdenklich",
        text: "Ich mag's: viel draußen, viele Gespräche. Nur das Gehalt könnte besser sein. Warum werden Jobs, die den Alltag am Laufen halten, eigentlich oft so mies bezahlt? Frag mal im Estland-Viertel – da gibt es eine ganze Berufsmesse dazu.",
        next: "ende" }
    }
  },

  hub_dimitriou: {
    knoten: {
      start: { speaker: "Herr Dimitriou", emotion: "skeptisch",
        text: "Setz dich lieber nicht, die Bank ist frisch gestrichen. … Kleiner Scherz. Aber dein Gesicht war gut.",
        options: [
          { label: "Worüber denken Sie gerade nach?", next: "denken" },
          { label: "Einen schönen Tag noch!", next: "ende" }
        ] },
      denken: { speaker: "Herr Dimitriou", emotion: "nachdenklich",
        text: "Über meine Frau. Vierzig Jahre hat sie gearbeitet – im Laden, zu Hause, bei den Enkeln. Ihre Rente ist trotzdem viel kleiner als meine. Das finde ich … nicht richtig.",
        next: "ende" }
    }
  },

  hub_emil: {
    knoten: {
      start: { speaker: "Emil", emotion: "froehlich",
        text: "Hey! Ich trainiere für den Stadtlauf. Beziehungsweise Stadtroll. Drei Runden um den Brunnen, dann gibt's Eis.",
        options: [
          { label: "Viel Erfolg!", next: "ende" },
          { label: "Was machst du, wenn du nicht trainierst?", next: "ausbildung" }
        ] },
      ausbildung: { speaker: "Emil", emotion: "froehlich",
        text: "Ausbildung zum Mechatroniker. In meiner Klasse sind zwei Frauen. Die beiden sind übrigens die Besten. Nur so nebenbei.",
        next: "ende" }
    }
  },

  hub_brunnen: {
    knoten: {
      start: { speaker: "",
        text: "Der Brunnen plätschert. Auf dem Grund glitzern Münzen aus ganz Europa.",
        options: [
          { label: "Sich etwas wünschen", next: "wunsch" },
          { label: "Weitergehen", next: "ende" }
        ] },
      wunsch: { speaker: "Kim", emotion: "froehlich", emote: "herz",
        text: "Ich wünsche mir, dass Anna und Jonas bald dasselbe verdienen. Ein bisschen kitschig. Fühlt sich aber richtig an.",
        next: "ende" }
    }
  },

  hub_wegweiser: {
    knoten: {
      start: { speaker: "Wegweiser",
        text: "Westen: **Deutschland-Viertel**. Osten: **Schweden-Viertel**. Südwesten: **Estland-Viertel**. Südosten: **Luxemburg-Viertel**. Norden: **Tor nach Brüssel**.",
        next: "ende" }
    }
  },

  hub_infoschild: {
    knoten: {
      start: { speaker: "Infoschild",
        text: "**Europaplatz.** Gender Pay Gap in der EU: {fakt:gpg_eu} ({jahr:gpg_eu}). Gemeint ist der Unterschied zwischen den durchschnittlichen Bruttostundenlöhnen von Frauen und Männern.",
        addNote: "gpg_eu", next: "ende" }
    }
  },

  tor_bruessel: {
    einstieg: [ { wenn: "alle_beweise", knoten: "offen" }, { knoten: "zu" } ],
    knoten: {
      zu: { speaker: "",
        text: "Das Tor nach Brüssel ist verschlossen. Im Schloss sind vier runde Mulden – genau so groß wie vier Beweisstücke.",
        next: "ende" },
      offen: { speaker: "",
        text: "Alle vier Mulden leuchten in den Farben deiner Beweisstücke. Das Tor steht offen – dahinter führt der Weg nach Brüssel.",
        options: [
          { label: "Nach Brüssel gehen", next: "ende", aktion: "reise:bxl,von_hub" },
          { label: "Noch nicht", next: "ende" }
        ] }
    }
  },

  sperre_viertel: {
    knoten: {
      start: { speaker: "Schild",
        text: "„Dieses Viertel wird gerade vorbereitet. Bitte später wiederkommen!“ Darunter hat jemand eine kleine Sonne gemalt.",
        next: "ende" }
    }
  },

  // ========================================================================
  //  DEUTSCHLAND-VIERTEL: Teilzeit & Kinderbetreuung
  // ========================================================================
  de_infoschild: {
    knoten: {
      start: { speaker: "Infoschild",
        text: "**Deutschland-Viertel.** Gender Pay Gap in Deutschland: {fakt:gpg_de} ({jahr:gpg_de}). Zum Vergleich: EU-Durchschnitt {fakt:gpg_eu}.",
        addNote: "gpg_de", next: "ende" }
    }
  },

  de_lea: {
    einstieg: [ { wenn: "de_lea_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Lea", emotion: "froehlich",
        text: "Oh, hallo! Ich warte hier eigentlich nur. Meine Tochter ist da drin, und ich hoffe jeden Tag, dass sie bald länger bleiben darf.",
        options: [
          { label: "Länger bleiben?", next: "laenger" },
          { label: "Warum wartest du vor der Kita?", next: "laenger" }
        ] },
      laenger: { speaker: "Lea", emotion: "nachdenklich",
        text: "Sie hat nur einen Halbtagsplatz. Um halb eins ist Schluss. Einen Ganztagsplatz gibt es erst, wenn jemand auf der Warteliste abspringt.",
        next: "arbeit" },
      arbeit: { speaker: "Kim", emotion: "nachdenklich",
        text: "Und was heißt das für deine Arbeit?",
        next: "arbeit2" },
      arbeit2: { speaker: "Lea", emotion: "nachdenklich",
        text: "Ich bin Bauingenieurin. Früher Vollzeit, jetzt 20 Stunden. Weniger Stunden heißt weniger Geld – und die spannenden, besser bezahlten Projekte bekommen die, die immer da sind.",
        addNote: "teilzeit_quote", next: "lohn" },
      lohn: { speaker: "Kim", emotion: "nachdenklich",
        text: "Moment – der Gender Pay Gap vergleicht doch Stundenlöhne. Dann zählen weniger Stunden doch gar nicht, oder?",
        next: "lohn2" },
      lohn2: { speaker: "Lea", emotion: "skeptisch",
        text: "Direkt nicht. Aber Teilzeitstellen werden pro Stunde oft schlechter bezahlt. Und wer reduziert, wird seltener befördert. Mein Stundenlohn ist seit drei Jahren nicht gestiegen – der meiner Kollegen schon.",
        addNote: "teilzeit_lohn",
        options: [
          { label: "Und dein Partner?", next: "partner" },
          { label: "Hast du dir das so ausgesucht?", next: "ausgesucht" }
        ] },
      partner: { speaker: "Lea", emotion: "skeptisch",
        text: "Mein Mann verdient mehr. Also haben wir gerechnet: Wenn einer reduziert, dann ich. Klingt logisch, oder? Nur wird die Lücke dadurch jedes Jahr ein Stück größer.",
        addNote: "rechnet_sich", next: "abschluss" },
      ausgesucht: { speaker: "Lea", emotion: "nachdenklich",
        text: "Ausgesucht … Ich hätte mir eher einen Kita-Platz ausgesucht. Frei entscheiden kann ich erst, wenn es überhaupt eine Wahl gibt.",
        addNote: "meinung_strukturen", next: "abschluss" },
      abschluss: { speaker: "Lea", emotion: "froehlich",
        text: "Frag doch mal in der Kita nach der Warteliste – Frau Yılmaz weiß mehr als ich. Und falls du Tobias am Fahrradständer triffst: Der hat's andersherum gemacht.",
        setFlag: "de_lea_fertig", aktion: "emoteKim:gluehbirne", next: "ende" },
      danach: { speaker: "Lea", emotion: "neutral",
        text: "Noch keine Nachricht von der Kita. Ich plane meine Woche weiter in halben Tagen.",
        options: [
          { label: "Und dein Partner?", next: "partner", requiresFlag: "!notiz_rechnet_sich" },
          { label: "Hast du dir das so ausgesucht?", next: "ausgesucht", requiresFlag: "!notiz_meinung_strukturen" },
          { label: "Bis später!", next: "ende" }
        ] }
    }
  },

  de_tobias: {
    einstieg: [ { wenn: "de_tobias_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Tobias", emotion: "skeptisch", emote: "schweiss",
        text: "Diese Kette springt jeden Morgen ab. Jeden. Einzelnen. Morgen.",
        options: [
          { label: "Kann ich helfen?", next: "helfen" },
          { label: "Lea meinte, du hast es andersherum gemacht?", next: "anders", requiresFlag: "de_lea_fertig" }
        ] },
      helfen: { speaker: "Kim", emotion: "froehlich",
        text: "Ich kann sehr gut … moralisch unterstützen.",
        next: "helfen2" },
      helfen2: { speaker: "Tobias", emotion: "froehlich",
        text: "Das zählt! Ich muss eh gleich ins Büro. Seit einem Jahr arbeite ich dort 30 Stunden, damit ich die Kinder abholen kann.",
        next: "anders" },
      anders: { speaker: "Tobias", emotion: "nachdenklich",
        text: "Meine Partnerin und ich haben beide auf 30 Stunden reduziert. So ist keiner von uns ganz raus aus dem Job.",
        next: "reaktion" },
      reaktion: { speaker: "Tobias", emotion: "skeptisch",
        text: "Die Reaktionen waren gemischt. Mein Chef hat gefragt, ob ich „noch Karriere machen will“. Meine Partnerin hat man das nie gefragt – bei ihr hat man es irgendwie erwartet.",
        addNote: "teilzeit_maenner",
        options: [
          { label: "Bereust du es?", next: "bereuen" },
          { label: "Was würde euch helfen?", next: "politik" }
        ] },
      bereuen: { speaker: "Tobias", emotion: "froehlich",
        text: "Nein. Aber ich verdiene jetzt weniger – und bei der letzten Beförderungsrunde war ich plötzlich nicht mehr im Gespräch. Meine Partnerin kannte das schon lange.",
        setFlag: "de_tobias_fertig", next: "ende" },
      politik: { speaker: "Tobias", emotion: "nachdenklich",
        text: "Mehr Kita-Plätze. Und Chefs, die Müttern und Vätern dieselben Fragen stellen. Oder am besten gar keine.",
        setFlag: "de_tobias_fertig", next: "ende" },
      danach: { speaker: "Tobias", emotion: "froehlich",
        text: "Die Kette hält! Seit drei Minuten. Ich nenne das Fortschritt.",
        next: "ende" }
    }
  },

  de_brandt: {
    knoten: {
      start: { speaker: "Herr Brandt", emotion: "skeptisch",
        text: "Du bist doch von diesem EU-Büro? Dann sag ich dir mal was: Früher hat das auch geklappt. Einer arbeitet, einer kümmert sich. Fertig.",
        options: [
          { label: "Und wer hat sich bei Ihnen gekümmert?", next: "gekuemmert" },
          { label: "Ist das heute noch so einfach?", next: "einfach" }
        ] },
      gekuemmert: { speaker: "Herr Brandt", emotion: "nachdenklich",
        text: "Meine Frau. Und sie hat's gern gemacht, glaube ich. Gefragt hab ich sie nie, ehrlich gesagt.",
        next: "rente" },
      einfach: { speaker: "Herr Brandt", emotion: "skeptisch",
        text: "Jede Familie soll das selbst entscheiden. Da muss sich der Staat nicht einmischen.",
        addNote: "meinung_frei", next: "rente" },
      rente: { speaker: "Herr Brandt", emotion: "nachdenklich",
        text: "Nur eins wurmt mich: Ihre Rente ist heute viel kleiner als meine. Dabei hat sie genauso viel gearbeitet. Nur eben ohne Lohn.",
        addNote: "rente", next: "tulpen" },
      tulpen: { speaker: "Herr Brandt", emotion: "froehlich",
        text: "So. Und jetzt kümmere ich mich um meine Tulpen. Die fragen wenigstens nicht nach Politik.",
        next: "ende" }
    }
  },

  de_jana: {
    knoten: {
      start: { speaker: "Jana", emotion: "froehlich",
        text: "Hi! Ich studiere Maschinenbau und jobbe nebenbei. Mein Fahrrad lasse ich zu Hause – der Ständer ist sowieso immer voll.",
        options: [
          { label: "Was denkst du über Teilzeit?", next: "teilzeit" },
          { label: "Viel Spaß noch!", next: "ende" }
        ] },
      teilzeit: { speaker: "Jana", emotion: "nachdenklich",
        text: "Ich will später Vollzeit arbeiten und Kinder haben. Alle sagen: „Das wird schwierig.“ Aber warum eigentlich nur zu mir? Meinen Freund fragt das keiner.",
        next: "ende" }
    }
  },

  de_yilmaz: {
    einstieg: [ { wenn: "beweis_de", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Frau Yılmaz", emotion: "froehlich",
        text: "Willkommen in der Kita „Kleine Wolke“! Vorsicht, auf dem Teppich liegen Bauklötze. Meistens genau da, wo man hintritt.",
        next: "vorstellen" },
      vorstellen: { speaker: "Kim", emotion: "froehlich",
        text: "Hallo! Ich bin Kim vom EU-Büro für Gleichstellung.",
        next: "vorstellen2" },
      vorstellen2: { speaker: "Frau Yılmaz", emotion: "ueberrascht",
        text: "Oh, offizieller Besuch! Setz dich doch. Auf einen Kinderstuhl. Wir haben nur Kinderstühle.",
        options: [
          { label: "Gibt es eine Warteliste für Ganztagsplätze?", next: "liste" },
          { label: "Wie ist die Arbeit hier?", next: "arbeit" }
        ] },
      arbeit: { speaker: "Frau Yılmaz", emotion: "nachdenklich",
        text: "Wunderbar und anstrengend. Wir sind zu wenige Fachkräfte. Deshalb können wir nicht alle Kinder den ganzen Tag betreuen – selbst wenn wir die Räume hätten.",
        next: "liste" },
      liste: { speaker: "Frau Yılmaz", emotion: "nachdenklich",
        text: "Hier, das ist sie. Drei Seiten. Fast überall steht dabei: Ein Elternteil arbeitet so lange weniger. Du darfst raten, welches meistens.",
        addNote: "kita_luecke", next: "liste2" },
      liste2: { speaker: "Kim", emotion: "skeptisch",
        text: "Darf ich eine Kopie mitnehmen? Für den Ausschuss in Brüssel.",
        next: "liste3" },
      liste3: { speaker: "Frau Yılmaz", emotion: "froehlich",
        text: "Unbedingt. Vielleicht liest sie dort jemand, der Kita-Plätze bauen kann.",
        addNote: "teilzeit_gruende", aktion: "beweis:de", next: "ende" },
      danach: { speaker: "Frau Yılmaz", emotion: "froehlich",
        text: "Und? Hat Brüssel schon angerufen? Nein? Dann räume ich weiter Bauklötze weg.",
        next: "ende" }
    }
  },

  de_pinnwand: {
    knoten: {
      start: { speaker: "Pinnwand",
        text: "Zwischen Bastelbildern hängt ein Zettel: „Ganztagsplätze leider alle belegt. Warteliste bei Frau Yılmaz.“ Daneben ist eine Wolke mit Beinen gemalt.",
        next: "ende" }
    }
  },

  de_mia: {
    knoten: {
      start: { speaker: "Mia", emotion: "froehlich",
        text: "Ich baue einen Turm bis zur Decke! … Bis zur Hälfte der Decke. … Bis zu meinem Knie.",
        next: "ende" }
    }
  },

  de_ben: {
    knoten: {
      start: { speaker: "Ben", emotion: "froehlich",
        text: "Weißt du, was ich mal werde? Erzieher! Oder Astronaut. Oder beides gleichzeitig.",
        next: "ende" }
    }
  },

  de_okafor: {
    knoten: {
      start: { speaker: "Frau Okafor", emotion: "froehlich",
        text: "Guten Tag! Ich leite hier das Entwicklungsteam – mit 30 Stunden pro Woche. Bevor du fragst: Das fragen alle.",
        options: [
          { label: "Geht Führung in Teilzeit?", next: "fuehrung" },
          { label: "Was entwickeln Sie hier?", next: "firma" }
        ] },
      firma: { speaker: "Frau Okafor", emotion: "froehlich",
        text: "Eine App für Busfahrpläne. Wenn der Bus trotzdem zu spät kommt, sind wir nicht schuld. Meistens.",
        next: "fuehrung" },
      fuehrung: { speaker: "Frau Okafor", emotion: "nachdenklich",
        text: "Es geht – mit guter Planung und einem Team, dem ich vertraue. Aber bei meiner Bewerbung war ich die Einzige mit Teilzeitwunsch. Und fast die einzige Frau.",
        addNote: "fuehrung_teilzeit", next: "transparenz" },
      transparenz: { speaker: "Frau Okafor", emotion: "skeptisch",
        text: "Übrigens: Bald müssen Firmen offenlegen, wie sie Gehälter festlegen. Eine EU-Richtlinie. Ich bin gespannt, was dabei herauskommt.",
        addNote: "eu_richtlinie", next: "ende" }
    }
  },

  // ========================================================================
  //  SCHWEDEN-VIERTEL: Elternzeit-Aufteilung
  // ========================================================================
  se_infoschild: {
    knoten: {
      start: { speaker: "Infoschild",
        text: "**Schweden-Viertel.** Gender Pay Gap in Schweden: {fakt:gpg_se} ({jahr:gpg_se}). EU-Durchschnitt: {fakt:gpg_eu}.",
        addNote: "gpg_se", next: "ende" }
    }
  },

  se_amtsschild: {
    knoten: {
      start: { speaker: "Schild",
        text: "**Familjekontoret – Familienamt.** Elterngeld, Elternzeit, Kinderbetreuung. Darunter ein Bild: zwei Erwachsene und ein Kind, Hand in Hand.",
        next: "ende" }
    }
  },

  se_plakat: {
    knoten: {
      start: { speaker: "Plakat",
        text: "Zwei Hände schieben gemeinsam einen Kinderwagen. Darunter steht: „Elternzeit – teilt sie euch!“",
        next: "ende" }
    }
  },

  se_lindqvist: {
    einstieg: [ { wenn: "se_amt_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Frau Lindqvist", emotion: "froehlich",
        text: "Välkommen – willkommen im Familienamt! Was kann ich für dich tun?",
        options: [ { label: "Wie funktioniert Elternzeit in Schweden?", next: "modell" } ] },
      modell: { speaker: "Frau Lindqvist", emotion: "nachdenklich",
        text: "Eltern bekommen zusammen {fakt:se_elterngeld_tage} Elterngeld. Die dürfen sie sich weitgehend frei aufteilen – bis auf {fakt:se_reservierte_tage} pro Elternteil. Die sind fest reserviert.",
        addNote: "se_modell",
        options: [
          { label: "Und wenn ein Elternteil die Tage nicht nimmt?", next: "verfallen" },
          { label: "Warum reserviert man überhaupt Tage?", next: "warum" }
        ] },
      verfallen: { speaker: "Frau Lindqvist", emotion: "skeptisch",
        text: "Dann verfallen sie. Man kann sie nicht an den anderen Elternteil verschenken. Streng? Vielleicht. Aber es wirkt.",
        next: "vaeter" },
      warum: { speaker: "Frau Lindqvist", emotion: "nachdenklich",
        text: "Früher konnten Eltern alles frei aufteilen. Und dann haben viele Väter … sagen wir: großzügig verzichtet. Die reservierten Tage haben das verändert.",
        next: "vaeter" },
      vaeter: { speaker: "Frau Lindqvist", emotion: "nachdenklich",
        text: "Heute nehmen Väter etwa {fakt:se_vaeter_anteil_tage} aller Elterngeldtage. Viel mehr als früher – aber immer noch nicht die Hälfte.",
        addNote: "se_vaeter", next: "lohn" },
      lohn: { speaker: "Kim", emotion: "nachdenklich",
        text: "Und was hat die Elternzeit mit der Lohnlücke zu tun?",
        next: "lohn2" },
      lohn2: { speaker: "Frau Lindqvist", emotion: "nachdenklich",
        text: "Sehr viel! Nach dem ersten Kind steigt das Gehalt von Müttern oft viel langsamer als das von Vätern. Fachleute nennen das die „Kinderstrafe“. Wenn beide eine Pause machen, verteilt sich dieser Knick – und die Lücke wird kleiner.",
        addNote: "elternzeit_lohn",
        options: [
          { label: "Wie ist das in Deutschland?", next: "de" },
          { label: "Danke, das hilft mir sehr!", next: "familie" }
        ] },
      de: { speaker: "Frau Lindqvist", emotion: "neutral",
        text: "Soweit ich weiß, gibt es bei euch {fakt:de_partnermonate} Partnermonate. Etwa {fakt:de_vaeter_elterngeld_anteil} der Väter nehmen Elterngeld – im Schnitt aber viel kürzer als die Mütter.",
        addNote: "de_elternzeit", next: "familie" },
      familie: { speaker: "Frau Lindqvist", emotion: "froehlich",
        text: "Wenn du sehen willst, wie das im echten Leben aussieht: Am See sitzen oft Lars und Nora. Die haben die Elternzeit genau halbiert.",
        setFlag: "se_amt_fertig", aktion: "emoteKim:gluehbirne", next: "ende" },
      danach: { speaker: "Frau Lindqvist", emotion: "froehlich",
        text: "Noch Fragen? Ich habe Zeit. Und Kaffee. Vor allem Kaffee.",
        options: [
          { label: "Wie ist das in Deutschland?", next: "de", requiresFlag: "!notiz_de_elternzeit" },
          { label: "Tschüss!", next: "ende" }
        ] }
    }
  },

  se_familie: {
    einstieg: [
      { wenn: "beweis_se", knoten: "danach" },
      { wenn: "!se_amt_fertig", knoten: "vorher" },
      { knoten: "start" }
    ],
    knoten: {
      vorher: { speaker: "Nora", wer: "nora", emotion: "froehlich",
        text: "Hej! Wir genießen gerade die Sonne. Falls du etwas über Elternzeit wissen willst: Frag erst im Familienamt – die erklären das viel besser als wir.",
        next: "ende" },
      start: { speaker: "Nora", wer: "nora", emotion: "froehlich",
        text: "Hej! Du bist vom EU-Büro, oder? Frau Lindqvist hat dich schon angekündigt.",
        next: "s2" },
      s2: { speaker: "Lars", wer: "lars", emotion: "froehlich",
        text: "Ich bin Lars, das ist Nora, und im Kinderwagen liegt Ella. Sie schläft. Zum ersten Mal heute.",
        next: "s3" },
      s3: { speaker: "Kim", emotion: "nachdenklich",
        text: "Frau Lindqvist sagt, ihr habt die Elternzeit halbiert?",
        next: "s4" },
      s4: { speaker: "Nora", wer: "nora", emotion: "nachdenklich",
        text: "Genau. Die ersten sechs Monate war ich zu Hause, jetzt ist Lars dran. Ich bin seit einem Monat wieder im Job.",
        options: [
          { label: "Wie ist das für dich, Lars?", next: "lars" },
          { label: "Hat dein Job darunter gelitten, Nora?", next: "job" }
        ] },
      lars: { speaker: "Lars", wer: "lars", emotion: "ueberrascht", emote: "schweiss",
        text: "Ehrlich? Anstrengender als mein Büro. Aber jetzt weiß ich, wie viel Arbeit das ist. Und niemand fragt mehr, ob Nora „nur“ zu Hause war.",
        addNote: "elternzeit_geteilt", next: "kalender" },
      job: { speaker: "Nora", wer: "nora", emotion: "skeptisch",
        text: "Weniger, als ich dachte. Weil Lars auch weg war, war ich nicht die Einzige im Team, die gefehlt hat. Mein Gehalt ist danach ganz normal weitergestiegen. Bei meiner Schwester, die zwei Jahre allein zu Hause war, war das anders.",
        addNote: "elternzeit_geteilt", next: "kalender" },
      kalender: { speaker: "Lars", wer: "lars", emotion: "froehlich",
        text: "Hier, unser Elternzeit-Kalender. Grün ist Nora, orange bin ich. Nimm ihn mit nach Brüssel – vielleicht überzeugt er dort jemanden.",
        aktion: "beweis:se", next: "ende_s" },
      ende_s: { speaker: "Nora", wer: "nora", emotion: "froehlich",
        text: "Aber bring ihn wieder mit. Ohne Kalender weiß Lars nicht, wann er dran ist.",
        next: "ende" },
      danach: { speaker: "Lars", wer: "lars", emotion: "nachdenklich",
        text: "Ella schläft immer noch. Wir flüstern ab jetzt nur noch.",
        next: "ende" }
    }
  },

  se_birgit: {
    knoten: {
      start: { speaker: "Birgit", emotion: "skeptisch",
        text: "Früher blieb die Mutter zu Hause, und alle waren zufrieden. Na ja. Fast alle.",
        options: [
          { label: "Warum „fast“?", next: "fast" },
          { label: "Was halten Sie von den reservierten Tagen?", next: "tage" }
        ] },
      fast: { speaker: "Birgit", emotion: "nachdenklich",
        text: "Ich war zufrieden. Meine Schwester nicht – sie wäre gern Ärztin geworden. Das hat damals nicht gepasst.",
        next: "ende" },
      tage: { speaker: "Birgit", emotion: "skeptisch",
        text: "Ich finde, jede Familie sollte selbst bestimmen, wer zu Hause bleibt. Warum schreibt der Staat Tage vor?",
        addNote: "meinung_familie", next: "tage2" },
      tage2: { speaker: "Birgit", emotion: "froehlich",
        text: "Aber mein Enkel wickelt besser als sein Vater. Das muss ich zugeben.",
        next: "ende" }
    }
  },

  se_erik: {
    knoten: {
      start: { speaker: "Erik", emotion: "ueberrascht", emote: "schweiss",
        text: "Psst! Nur kurz, ja? Der Kleine schläft nur, solange der Wagen rollt.",
        options: [
          { label: "Seit wann joggst du mit Kinderwagen?", next: "seit" },
          { label: "Dann schnell weiter!", next: "ende" }
        ] },
      seit: { speaker: "Erik", emotion: "froehlich",
        text: "Seit meiner Elternzeit. Ich war noch nie so fit. Und noch nie so müde.",
        next: "ende" }
    }
  },

  se_alva: {
    knoten: {
      start: { speaker: "Alva", emotion: "froehlich",
        text: "Bei uns ist es normal, dass Papas Elternzeit nehmen. Mein Vater war ein Jahr zu Hause. Er behauptet, er hätte mir das Laufen beigebracht.",
        options: [ { label: "Machen das alle so?", next: "alle" } ] },
      alle: { speaker: "Alva", emotion: "nachdenklich",
        text: "Hm, nicht alle. Ich glaube, viele Väter nehmen vor allem die reservierten Tage. Ein ganzes Jahr ist auch hier eher selten.",
        next: "ende" }
    }
  },

  // ========================================================================
  //  ESTLAND-VIERTEL: Branchen & Berufswahl (Berufsmesse)
  // ========================================================================
  ee_infoschild: {
    knoten: {
      start: { speaker: "Infoschild",
        text: "**Estland-Viertel – Berufsmesse.** Gender Pay Gap in Estland: {fakt:gpg_ee} ({jahr:gpg_ee}) – einer der höchsten Werte in der EU. EU-Durchschnitt: {fakt:gpg_eu}.",
        addNote: "gpg_ee", next: "ende" }
    }
  },

  ee_mart: {
    knoten: {
      start: { speaker: "Mart", emotion: "froehlich",
        text: "Tere! Willkommen am IT-Stand. Wir suchen Leute, die gern knobeln. Und Kaffee trinken. Hauptsächlich knobeln.",
        options: [ { label: "Was verdient man in der IT?", next: "lohn" } ] },
      lohn: { speaker: "Mart", emotion: "neutral",
        text: "Im Schnitt etwa {fakt:ee_lohn_it} brutto im Monat. Einer der bestbezahlten Bereiche hier.",
        next: "frauen" },
      frauen: { speaker: "Mart", emotion: "nachdenklich",
        text: "Nur etwa {fakt:ee_frauen_it} der Leute bei uns sind Frauen. Dabei hat mir unsere beste Programmiererin alles beigebracht, was ich kann.",
        addNote: "branchen_it", setFlag: "ee_stand_it", next: "ende" }
    }
  },

  ee_liis: {
    knoten: {
      start: { speaker: "Liis", emotion: "froehlich",
        text: "Hallo! Pflege – der Beruf, bei dem man jeden Tag gebraucht wird. Wirklich jeden Tag. Auch sonntags.",
        options: [ { label: "Was verdient man in der Pflege?", next: "lohn" } ] },
      lohn: { speaker: "Liis", emotion: "nachdenklich",
        text: "Im Gesundheits- und Sozialwesen etwa {fakt:ee_lohn_pflege} im Schnitt. Etwa {fakt:ee_frauen_pflege} von uns sind Frauen.",
        next: "meinung" },
      meinung: { speaker: "Liis", emotion: "skeptisch",
        text: "Warum wird ein Beruf, in dem man Menschen pflegt, schlechter bezahlt als einer, in dem man Apps baut? Gute Frage. Stell sie in Brüssel.",
        addNote: "branchen_pflege", setFlag: "ee_stand_pflege", next: "ende" }
    }
  },

  ee_kertu: {
    knoten: {
      start: { speaker: "Kertu", emotion: "froehlich",
        text: "Tischlerin, seit zwölf Jahren. Und nein, ich muss den Hammer nicht erst suchen.",
        options: [ { label: "Was verdient man im Handwerk?", next: "lohn" } ] },
      lohn: { speaker: "Kertu", emotion: "neutral",
        text: "Im Baugewerbe im Schnitt etwa {fakt:ee_lohn_bau}. Frauen gibt es hier wenige – etwa {fakt:ee_frauen_bau}.",
        next: "erfahrung" },
      erfahrung: { speaker: "Kertu", emotion: "skeptisch",
        text: "Auf Baustellen werde ich oft nach „dem Chef“ gefragt. Dann sage ich: „Steht vor dir.“",
        addNote: "branchen_bau", setFlag: "ee_stand_bau", next: "ende" }
    }
  },

  ee_priit: {
    knoten: {
      start: { speaker: "Priit", emotion: "froehlich",
        text: "Ich bin Erzieher. Die Kinder nennen mich „Onkel Priit“. Manche Eltern auch – das ist ein bisschen komisch.",
        options: [ { label: "Was verdient man in der Erziehung?", next: "lohn" } ] },
      lohn: { speaker: "Priit", emotion: "nachdenklich",
        text: "In Erziehung und Unterricht etwa {fakt:ee_lohn_bildung}. Etwa {fakt:ee_frauen_bildung} der Beschäftigten sind Frauen.",
        next: "mann" },
      mann: { speaker: "Priit", emotion: "skeptisch",
        text: "Als Mann bin ich hier die Ausnahme. Manche fragen, ob ich mir den Job „leisten“ kann. Eigentlich komisch – warum ist das überhaupt eine Frage?",
        addNote: "branchen_bildung", setFlag: "ee_stand_soziales", next: "ende" }
    }
  },

  ee_anu: {
    knoten: {
      start: { speaker: "Anu", emotion: "nachdenklich",
        text: "Ich mache nächstes Jahr Abitur und will in die Pflege. Meine Tante sagt, ich soll lieber in die IT gehen – wegen des Geldes.",
        options: [ { label: "Und was möchtest du selbst?", next: "selbst" } ] },
      selbst: { speaker: "Anu", emotion: "skeptisch",
        text: "Pflege. Weil ich das mag. Soll ich deshalb weniger verdienen – oder sollte Pflege besser bezahlt werden?",
        addNote: "meinung_berufswahl", next: "ende" }
    }
  },

  ee_kadri: {
    einstieg: [
      { wenn: "beweis_ee", knoten: "danach" },
      { wenn: "ee_minispiel", knoten: "nachspiel" },
      { knoten: "start" }
    ],
    knoten: {
      start: { speaker: "Kadri", emotion: "froehlich",
        text: "Willkommen auf der Berufsmesse! Ich bin Kadri, ich leite das hier. Du willst wissen, welche Branche wie viel zahlt?",
        options: [
          { label: "Ja! Ich möchte das Spiel spielen.", next: "spiel" },
          { label: "Ich schaue mich erst an den Ständen um.", next: "umschauen" }
        ] },
      umschauen: { speaker: "Kadri", emotion: "froehlich",
        text: "Gute Idee. An jedem Stand erfährst du etwas. Danach kannst du dein Wissen bei mir testen.",
        next: "ende" },
      spiel: { speaker: "Kadri", emotion: "froehlich",
        text: "Dann los: Ordne jedem Stand das passende Durchschnittsgehalt zu. Wer vorher an den Ständen gefragt hat, ist klar im Vorteil!",
        aktion: "minispiel:branchen", next: "ende" },
      nachspiel: { speaker: "Kadri", emotion: "froehlich",
        text: "Willkommen zurück! Möchtest du noch mal spielen oder die Gehaltstabelle mitnehmen?",
        options: [
          { label: "Noch mal spielen!", next: "spiel" },
          { label: "Die Tabelle, bitte.", next: "tabelle" }
        ] },
      tabelle: { speaker: "Kadri", emotion: "froehlich",
        text: "Hier, unsere Gehaltstabelle der Messe. Nimm sie mit nach Brüssel.",
        aktion: "beweis:ee", addNote: "branchen_muster", next: "ende" },
      danach: { speaker: "Kadri", emotion: "froehlich",
        text: "Viel Erfolg in Brüssel! Und falls du mal den Beruf wechseln willst: Ich kenne da eine Messe.",
        options: [
          { label: "Noch mal spielen!", next: "spiel" },
          { label: "Tschüss!", next: "ende" }
        ] }
    }
  },

  ee_kadri_nach_spiel: {
    einstieg: [ { wenn: "beweis_ee", knoten: "schon" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Kadri", emotion: "nachdenklich",
        text: "Na, fällt dir etwas auf? Wo viele Frauen arbeiten, ist der Lohn im Schnitt oft niedriger.",
        options: [
          { label: "Liegt das an den Berufen oder an der Bezahlung?", next: "frage" },
          { label: "Jeder sucht sich seinen Beruf doch selbst aus.", next: "frei" }
        ] },
      frage: { speaker: "Kadri", emotion: "nachdenklich",
        text: "Beides hängt zusammen. Wer welchen Beruf wählt, hat viel mit Vorbildern und Erwartungen zu tun. Und wie viel ein Beruf wert ist, entscheidet am Ende die Gesellschaft.",
        next: "tabelle" },
      frei: { speaker: "Kadri", emotion: "skeptisch",
        text: "Stimmt – aber mit welchen Vorbildern? Und die Frage bleibt: Warum ist Pflege weniger wert als Programmieren?",
        next: "tabelle" },
      tabelle: { speaker: "Kadri", emotion: "froehlich",
        text: "Hier, unsere Gehaltstabelle der Messe. Nimm sie mit nach Brüssel.",
        aktion: "beweis:ee", addNote: "branchen_muster", next: "ende" },
      schon: { speaker: "Kadri", emotion: "froehlich",
        text: "Gut gespielt! Die Tabelle hast du ja schon.",
        next: "ende" }
    }
  },

  // ========================================================================
  //  LUXEMBURG-VIERTEL: Gehaltsverhandlung & Beförderung
  // ========================================================================
  lu_infoschild: {
    knoten: {
      start: { speaker: "Infoschild",
        text: "**Luxemburg-Viertel.** Gender Pay Gap in Luxemburg: {fakt:gpg_lu} ({jahr:gpg_lu}). Also fast keine Lücke? Frag mal Dr. Hoffmann auf der Brücke.",
        addNote: "gpg_lu", next: "ende" }
    }
  },

  lu_hoffmann: {
    einstieg: [ { wenn: "lu_hoffmann_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Dr. Hoffmann", emotion: "froehlich",
        text: "Ah, Besuch! Ich bin Dr. Hoffmann, Ökonomin im Ruhestand. Ich zähle Boote. Und Durchschnitte.",
        options: [ { label: "Die Lücke in Luxemburg ist fast null. Ist hier alles gerecht?", next: "gerecht" } ] },
      gerecht: { speaker: "Dr. Hoffmann", emotion: "nachdenklich",
        text: "Schöne Frage! Ein Durchschnitt ist wie dieser Fluss: Oben sieht er ruhig aus. Was darunter passiert, sieht man nicht.",
        next: "gruende" },
      gruende: { speaker: "Dr. Hoffmann", emotion: "nachdenklich",
        text: "Ein niedriger Wert kann viele Gründe haben – zum Beispiel, welche Berufe Frauen und Männer hier haben oder wer überhaupt erwerbstätig ist. Innerhalb einer Firma kann es trotzdem große Unterschiede geben.",
        addNote: "durchschnitt",
        options: [ { label: "Welche Unterschiede zum Beispiel?", next: "beispiel" } ] },
      beispiel: { speaker: "Dr. Hoffmann", emotion: "skeptisch",
        text: "Wer befördert wird. Wer verhandelt – und wie das ankommt. Fahr ins Hochhaus, 2. Etage, Personalabteilung. Herr Schmit ist ein alter Bekannter. Er redet gern. Sehr gern.",
        setFlag: "lu_hoffmann_fertig", aktion: "emoteKim:gluehbirne", next: "ende" },
      danach: { speaker: "Dr. Hoffmann", emotion: "froehlich",
        text: "Die Boote zählen sich nicht von allein. Viel Glück bei Herrn Schmit!",
        next: "ende" }
    }
  },

  lu_marc: {
    knoten: {
      start: { speaker: "Marc", emotion: "froehlich",
        text: "Kaffee? Heute im Angebot: Espresso, Cappuccino und ungefragte Meinungen.",
        options: [
          { label: "Eine ungefragte Meinung, bitte.", next: "meinung" },
          { label: "Nein danke!", next: "ende" }
        ] },
      meinung: { speaker: "Marc", emotion: "froehlich",
        text: "Meine Schwester und ich führen das Café zusammen. Gleiche Arbeit, gleicher Lohn – steht so im Vertrag. Den haben wir zusammen geschrieben. Auf eine Serviette.",
        next: "ende" }
    }
  },

  lu_paul: {
    knoten: {
      start: { speaker: "Paul", emotion: "froehlich",
        text: "Willkommen im Capitol! Der Aufzug ist dort drüben. Er ist schneller als die Treppe. Und viel schneller als unsere Kaffeemaschine.",
        options: [
          { label: "Wo finde ich Herrn Schmit?", next: "schmit" },
          { label: "Danke!", next: "ende" }
        ] },
      schmit: { speaker: "Paul", emotion: "neutral",
        text: "2. Etage, Personalabteilung. Klopf lieber an – er übt gerade seinen Vortrag über Teamgeist.",
        next: "ende" }
    }
  },

  lu_chloe: {
    knoten: {
      start: { speaker: "Chloé", emotion: "nachdenklich",
        text: "Ich habe mich zweimal auf die Teamleitung beworben. Beide Male hieß es: „Du bist noch nicht so weit.“",
        options: [ { label: "Und wer hat die Stelle bekommen?", next: "wer" } ] },
      wer: { speaker: "Chloé", emotion: "skeptisch",
        text: "Tom. Er hatte weniger Erfahrung, aber er hat einfach gefragt, bevor die Stelle ausgeschrieben war. Ich wusste gar nicht, dass das geht.",
        next: "ende" }
    }
  },

  lu_tom: {
    knoten: {
      start: { speaker: "Tom", emotion: "froehlich",
        text: "Ich bin Tom, seit drei Monaten Teamleiter. Ehrlich gesagt hat mich mein alter Chef vorgeschlagen – beim Fußball am Wochenende.",
        options: [ { label: "Findest du das fair?", next: "fair" } ] },
      fair: { speaker: "Tom", emotion: "nachdenklich", emote: "schweiss",
        text: "Hm. Chloé hätte es auch verdient. Vielleicht mehr als ich. Das sage ich aber nur dir.",
        next: "ende" }
    }
  },

  lu_schmit: {
    einstieg: [
      { wenn: "beweis_lu", knoten: "danach" },
      { wenn: "lu_verhandelt", knoten: "nachspiel" },
      { knoten: "start" }
    ],
    knoten: {
      start: { speaker: "Herr Schmit", emotion: "froehlich",
        text: "Ah, das EU-Büro! Dr. Hoffmann hat schon angerufen. Sie redet gern. Sehr gern.",
        options: [ { label: "Ich möchte verstehen, wie Gehaltsverhandlungen laufen.", next: "spiel" } ] },
      spiel: { speaker: "Herr Schmit", emotion: "froehlich",
        text: "Dann machen wir eine Übung: Du spielst Anna, ich spiele ihren Chef. Wähle deine Argumente gut!",
        aktion: "minispiel:verhandlung", next: "ende" },
      nachspiel: { speaker: "Herr Schmit", emotion: "neutral",
        text: "Na? Noch eine Runde üben oder reden wir über Beförderungen?",
        options: [
          { label: "Noch mal verhandeln!", next: "spiel" },
          { label: "Lass uns über Beförderungen reden.", next: "befoerderung" }
        ] },
      befoerderung: { speaker: "Herr Schmit", emotion: "nachdenklich",
        text: "Schau dir diese Liste an: unsere letzten Beförderungen in Führungsjobs. Im Team arbeiten etwa gleich viele Frauen und Männer. Auf der Liste stehen fast nur Männer.",
        addNote: "befoerderung", next: "fuehrung" },
      fuehrung: { speaker: "Herr Schmit", emotion: "nachdenklich",
        text: "Und das ist kein Einzelfall. In Luxemburg sind etwa {fakt:lu_frauen_fuehrung} der Führungskräfte Frauen, EU-weit etwa {fakt:eu_frauen_fuehrung}.",
        addNote: "fuehrung_lu", next: "liste" },
      liste: { speaker: "Herr Schmit", emotion: "froehlich",
        text: "Nimm die Liste mit nach Brüssel. Vielleicht ändert sich ja was, wenn mehr Leute hinschauen. Bei uns zum Beispiel.",
        aktion: "beweis:lu", next: "ende" },
      danach: { speaker: "Herr Schmit", emotion: "froehlich",
        text: "Grüß mir Brüssel! Und Dr. Hoffmann, falls du sie siehst. Obwohl – sie ruft sowieso an.",
        options: [
          { label: "Noch mal verhandeln!", next: "spiel" },
          { label: "Tschüss!", next: "ende" }
        ] }
    }
  },

  lu_schmit_nach_spiel: {
    einstieg: [ { wenn: "beweis_lu", knoten: "schon" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Herr Schmit", emotion: "nachdenklich",
        text: "Gut vorbereitet ist halb gewonnen. Aber ich muss ehrlich sein.",
        next: "fair" },
      fair: { speaker: "Herr Schmit", emotion: "skeptisch",
        text: "Wenn Frauen hart verhandeln, gilt das hier manchmal als „fordernd“. Bei Männern heißt es „selbstbewusst“. Unfair – aber es passiert.",
        addNote: "verhandlung_fair",
        options: [ { label: "Und wie ist das bei Beförderungen?", next: "befoerderung" } ] },
      befoerderung: { speaker: "Herr Schmit", emotion: "nachdenklich",
        text: "Schau dir diese Liste an: unsere letzten Beförderungen in Führungsjobs. Im Team arbeiten etwa gleich viele Frauen und Männer. Auf der Liste stehen fast nur Männer.",
        addNote: "befoerderung", next: "fuehrung" },
      fuehrung: { speaker: "Herr Schmit", emotion: "nachdenklich",
        text: "Und das ist kein Einzelfall. In Luxemburg sind etwa {fakt:lu_frauen_fuehrung} der Führungskräfte Frauen, EU-weit etwa {fakt:eu_frauen_fuehrung}.",
        addNote: "fuehrung_lu", next: "liste" },
      liste: { speaker: "Herr Schmit", emotion: "froehlich",
        text: "Nimm die Liste mit nach Brüssel. Vielleicht ändert sich ja was, wenn mehr Leute hinschauen. Bei uns zum Beispiel.",
        aktion: "beweis:lu", next: "ende" },
      schon: { speaker: "Herr Schmit", emotion: "froehlich",
        text: "Nicht schlecht! Du lernst schnell.",
        next: "ende" }
    }
  },

  // ========================================================================
  //  BRÜSSEL: Platz, Archiv „Unerklärter Rest“, Sitzungssaal (Finale)
  // ========================================================================
  bxl_infoschild: {
    knoten: {
      start: { speaker: "Infoschild",
        text: "**Brüssel, Belgien.** Gender Pay Gap in Belgien: {fakt:gpg_be} ({jahr:gpg_be}). Hier beraten Parlament, Rat und Kommission über Regeln für die ganze EU.",
        addNote: "gpg_be", next: "ende" }
    }
  },

  bxl_comicwand: {
    knoten: {
      start: { speaker: "",
        text: "Ein halb fertiger Comic: Zwei Geschwister vergleichen ihre Gehaltszettel. Im letzten Bild fehlt noch das Ende.",
        next: "ende" }
    }
  },

  bxl_lotte: {
    knoten: {
      start: { speaker: "Lotte", emotion: "froehlich",
        text: "Oh, hallo! Nicht erschrecken, ich male nur. In Brüssel gibt es überall Comic-Wände – diese hier wird meine erste.",
        options: [
          { label: "Worum geht es in deinem Comic?", next: "comic" },
          { label: "Kann man vom Zeichnen leben?", next: "leben" },
          { label: "Viel Erfolg!", next: "ende" }
        ] },
      comic: { speaker: "Lotte", emotion: "nachdenklich",
        text: "Um zwei Geschwister, die zufällig ihre Gehälter vergleichen. Ich weiß nur noch nicht, wie es ausgeht. Hast du eine Idee?",
        options: [
          { label: "Das entscheidet sich gerade im Sitzungssaal.", next: "saal" },
          { label: "Vielleicht bleibt das Ende offen?", next: "offen" }
        ] },
      saal: { speaker: "Lotte", emotion: "ueberrascht", emote: "gluehbirne",
        text: "Echt? Dann warte ich mit dem letzten Bild, bis du wieder rauskommst!",
        next: "ende" },
      offen: { speaker: "Lotte", emotion: "nachdenklich",
        text: "Ein offenes Ende … Hm. Das wäre wenigstens ehrlich. Ich denk drüber nach.",
        next: "ende" },
      leben: { speaker: "Lotte", emotion: "skeptisch",
        text: "Mal so, mal so. Als Selbstständige verhandle ich jedes Honorar neu. Ich habe gelernt: einen Preis nennen – und dann still sein. Das Schweigen danach ist der schwierigste Teil.",
        next: "ende" }
    }
  },

  bxl_samir: {
    knoten: {
      start: { speaker: "Samir", emotion: "froehlich",
        text: "Hallo! Ich studiere Übersetzen und mache hier ein Praktikum. Heute habe ich drei Sitzungen gedolmetscht, in drei Sprachen. Mein Kopf klingelt.",
        options: [
          { label: "Was passiert eigentlich mit einem EU-Gesetz?", next: "gesetz" },
          { label: "Kennst du die Regeln zur Lohntransparenz?", next: "richtlinie", requiresFlag: "!notiz_eu_richtlinie" },
          { label: "Dann ruh dich aus!", next: "ende" }
        ] },
      gesetz: { speaker: "Samir", emotion: "nachdenklich",
        text: "Bei einer Richtlinie legt die EU ein Ziel fest. Jedes Land schreibt dann ein eigenes Gesetz dazu – mit etwas Spielraum. Deshalb sieht dieselbe Regel in Tallinn manchmal anders aus als in Lissabon.",
        addNote: "eu_umsetzung", next: "ende" },
      richtlinie: { speaker: "Samir", emotion: "froehlich",
        text: "Klar, die übersetze ich dauernd! Die Entgelttransparenzrichtlinie: Firmen müssen offenlegen, wie sie Gehälter festlegen. Umgesetzt sein muss sie bis {fakt:eu_richtlinie_frist}.",
        addNote: "eu_richtlinie", next: "ende" }
    }
  },

  bxl_janssens: {
    einstieg: [ { wenn: "finale_fertig", knoten: "danach" }, { wenn: "beweis_bxl", knoten: "bereit" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Herr Janssens", emotion: "neutral",
        text: "Guten Tag! Du willst in den Sitzungssaal? Der Ausschuss erwartet dich schon – aber nur mit vollständigen Unterlagen. Auf meiner Liste fehlt noch ein Beweisstück aus dem Archiv.",
        options: [
          { label: "Wo ist das Archiv?", next: "archiv" },
          { label: "Wer sitzt im Ausschuss?", next: "ausschuss" }
        ] },
      archiv: { speaker: "Herr Janssens", emotion: "froehlich",
        text: "Das Backsteinhaus mit den runden Fenstern, links am Platz. Frau Peeters kennt dort jede Akte beim Vornamen.",
        next: "ende" },
      ausschuss: { speaker: "Herr Janssens", emotion: "nachdenklich",
        text: "Drei Abgeordnete aus drei Ländern mit drei Meinungen. Mindestens. Sie stellen Fragen – und gute Antworten stehen meistens in einem Notizbuch.",
        next: "ende" },
      bereit: { speaker: "Herr Janssens", emotion: "froehlich",
        text: "Die Akte aus dem Archiv – dann ist deine Mappe komplett. Bitte sehr, der Saal ist offen. Keine Sorge, die Abgeordneten beißen nicht. Meistens.",
        next: "ende" },
      danach: { speaker: "Herr Janssens", emotion: "froehlich",
        text: "Man hört, die Sitzung war lebhaft. Das ist ein gutes Zeichen.",
        next: "ende" }
    }
  },

  bxl_saal_zu: {
    knoten: {
      start: { speaker: "",
        text: "Die Glastür ist verschlossen. Auf einem Schild steht: „Ausschusssitzung – Zutritt nur mit vollständigen Unterlagen.“ Dir fehlt noch das Beweisstück aus dem Archiv.",
        next: "ende" }
    }
  },

  bxl_peeters: {
    einstieg: [
      { wenn: "beweis_bxl", knoten: "danach" },
      { wenn: "bxl_fach_a&bxl_fach_b&bxl_fach_c", knoten: "quiz" },
      { wenn: "bxl_peeters_auftrag", knoten: "suche" },
      { knoten: "start" }
    ],
    knoten: {
      start: { speaker: "Frau Peeters", emotion: "froehlich",
        text: "Ah, Besuch! Willkommen im Archiv. Hier lagern Lohnstudien aus allen EU-Ländern. Und ziemlich viel Staub.",
        next: "k2" },
      k2: { speaker: "Kim", emotion: "neutral",
        text: "Ich suche den „unerklärten Rest“. Dr. Laurent hat mir davon erzählt.",
        next: "k3" },
      k3: { speaker: "Frau Peeters", emotion: "nachdenklich",
        text: "Der Rest ist das, was übrig bleibt, wenn man alles Erklärbare abzieht. Um ihn zu finden, musst du verstehen, wie gerechnet wird. Die drei Fächer an der Rückwand gehören zusammen: A, B und C.",
        next: "k4" },
      k4: { speaker: "Frau Peeters", emotion: "froehlich",
        text: "Lies alle drei. Dann komm zurück und sag mir, welche Zahl der unerklärte Rest ist. Wenn es stimmt, bekommst du die Akte.",
        setFlag: "bxl_peeters_auftrag", next: "ende" },
      suche: { speaker: "Frau Peeters", emotion: "neutral",
        text: "Fach A, B und C an der Rückwand. Lies alle drei, dann reden wir weiter.",
        options: [
          { label: "Was bedeutet „bereinigt“?", next: "bereinigt" },
          { label: "Bin schon unterwegs!", next: "ende" }
        ] },
      bereinigt: { speaker: "Frau Peeters", emotion: "nachdenklich",
        text: "Stell dir vor, du vergleichst nur Leute mit gleichem Beruf, gleicher Branche, gleichen Stunden und ähnlicher Erfahrung. Alles andere wird herausgerechnet – „bereinigt“ eben. Was dann noch an Lücke übrig ist, kann die Statistik nicht erklären.",
        next: "ende" },
      quiz: { speaker: "Frau Peeters", emotion: "froehlich",
        text: "Du hast alle drei Fächer gelesen? Dann meine Prüfungsfrage: Welche Zahl ist der unerklärte Rest in Deutschland?",
        options: [
          { label: "{fakt:de_gpg_unbereinigt_destatis} – der Unterschied aller Stundenlöhne", next: "falsch_a" },
          { label: "{fakt:de_gpg_erklaert_anteil} – der Teil, den man erklären kann", next: "falsch_b" },
          { label: "{fakt:gpg_de_bereinigt} – was bei gleichem Beruf, gleicher Branche und gleichen Stunden übrig bleibt", next: "richtig" }
        ] },
      falsch_a: { speaker: "Frau Peeters", emotion: "skeptisch",
        text: "Fast! Das ist die unbereinigte Lücke – also alles zusammen. Der Rest ist nur ein Teil davon. Versuch es noch einmal.",
        next: "quiz" },
      falsch_b: { speaker: "Frau Peeters", emotion: "nachdenklich",
        text: "Das ist der Anteil, den man mit Teilzeit, Branche, Beruf und Führung erklären kann. Wir suchen aber das, was danach noch übrig bleibt.",
        next: "quiz" },
      richtig: { speaker: "Frau Peeters", emotion: "froehlich", emote: "herz",
        text: "Genau! Das ist die bereinigte Lücke – der unerklärte Rest.",
        next: "richtig2" },
      richtig2: { speaker: "Frau Peeters", emotion: "nachdenklich",
        text: "Aber Vorsicht: „Unerklärt“ heißt nicht automatisch Diskriminierung. Die Statistik misst nicht alles. Ungleiche Behandlung kann aber ein Teil davon sein – bei Verhandlungen zum Beispiel, oder bei Beförderungen.",
        addNote: "rest_bedeutung", next: "richtig3" },
      richtig3: { speaker: "Frau Peeters", emotion: "froehlich",
        text: "Hier, die Akte „Unerklärter Rest“. Bring sie in den Sitzungssaal – das ist das Gebäude mit der Glaskuppel.",
        aktion: "beweis:bxl", next: "ende" },
      danach: { speaker: "Frau Peeters", emotion: "froehlich",
        text: "Viel Erfolg im Ausschuss! Und falls dir dort die Worte fehlen: Dein Notizbuch hat sie.",
        next: "ende" }
    }
  },

  bxl_fach_a: {
    einstieg: [ { wenn: "bxl_fach_a", knoten: "nochmal" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Fach A – „Unbereinigt“",
        text: "Ein blauer Ordner. Darin: Tabellen mit den Stundenlöhnen aller Beschäftigten – egal in welchem Beruf und mit wie vielen Stunden.",
        next: "a2" },
      a2: { speaker: "Kim", emotion: "nachdenklich",
        text: "Einfach alle Löhne verglichen. Für Deutschland kommt dabei {fakt:de_gpg_unbereinigt_destatis} heraus. Das ist die ganze Lücke.",
        addNote: "rest_unbereinigt", setFlag: "bxl_fach_a", next: "ende" },
      nochmal: { speaker: "Fach A – „Unbereinigt“",
        text: "Der blaue Ordner: die ganze Lücke, {fakt:de_gpg_unbereinigt_destatis}.",
        next: "ende" }
    }
  },

  bxl_fach_b: {
    einstieg: [ { wenn: "bxl_fach_b", knoten: "nochmal" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Fach B – „Erklärt“",
        text: "Ein grüner Ordner voller Balkendiagramme: Teilzeit, Branche, Beruf, Führungsposition. Jeder Balken erklärt ein Stück der Lücke.",
        next: "b2" },
      b2: { speaker: "Kim", emotion: "ueberrascht",
        text: "Zusammen erklären diese Unterschiede etwa {fakt:de_gpg_erklaert_anteil} der Lücke. Ein großer Teil – aber nicht alles.",
        addNote: "rest_erklaert", setFlag: "bxl_fach_b", next: "ende" },
      nochmal: { speaker: "Fach B – „Erklärt“",
        text: "Der grüne Ordner: Etwa {fakt:de_gpg_erklaert_anteil} der Lücke lassen sich erklären.",
        next: "ende" }
    }
  },

  bxl_fach_c: {
    einstieg: [ { wenn: "bxl_fach_c", knoten: "nochmal" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Fach C – „Bereinigt“",
        text: "Ein gelber Ordner mit einem Fragezeichen auf dem Rücken. Hier werden nur Frauen und Männer mit gleichem Beruf, gleicher Branche, gleichen Stunden und ähnlicher Erfahrung verglichen.",
        next: "c2" },
      c2: { speaker: "Kim", emotion: "nachdenklich", emote: "gluehbirne",
        text: "Und trotzdem bleibt eine Lücke von etwa {fakt:gpg_de_bereinigt}. Das ist der Teil, den keine Tabelle erklärt.",
        addNote: "rest_bereinigt", setFlag: "bxl_fach_c", next: "ende" },
      nochmal: { speaker: "Fach C – „Bereinigt“",
        text: "Der gelbe Ordner: Übrig bleiben etwa {fakt:gpg_de_bereinigt}.",
        next: "ende" }
    }
  },

  // ---------------- Sitzungssaal ----------------
  saal_laurent: {
    einstieg: [ { wenn: "finale_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Dr. Marie Laurent", emotion: "froehlich",
        text: "Kim! Du hast es geschafft – alle fünf Beweisstücke. Die Abgeordneten sind gespannt.",
        next: "s2" },
      s2: { speaker: "Dr. Marie Laurent", emotion: "nachdenklich",
        text: "Wenn du so weit bist, tritt ans Rednerpult. Erst zeigst du deine Beweise, dann stellen die drei ihre Fragen, und am Ende schlägst du drei Maßnahmen vor.",
        options: [
          { label: "Hast du einen Tipp für mich?", next: "tipp" },
          { label: "Ich bin bereit.", next: "ende" }
        ] },
      tipp: { speaker: "Dr. Marie Laurent", emotion: "froehlich",
        text: "Antworte mit dem, was du gesehen und gehört hast. Dein Notizbuch ist dein bestes Argument. Und: Es gibt nicht die eine richtige Lösung – nur gute Gründe.",
        next: "ende" },
      danach: { speaker: "Dr. Marie Laurent", emotion: "froehlich",
        text: "Das war stark, Kim. Ganz ehrlich.",
        next: "ende" }
    }
  },

  saal_anna: {
    einstieg: [ { wenn: "finale_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Anna", emotion: "ueberrascht", emote: "schweiss",
        text: "Ich bin so aufgeregt, als müsste ich selbst da vorne stehen. Jonas hat schon zweimal gefragt, ob seine Krawatte richtig sitzt. Er trägt keine Krawatte.",
        next: "ende" },
      danach: { speaker: "Anna", emotion: "froehlich",
        text: "Heute hat sich etwas bewegt. Das habe ich richtig gespürt.",
        next: "ende" }
    }
  },

  saal_jonas: {
    einstieg: [ { wenn: "finale_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Jonas", emotion: "nachdenklich",
        text: "Egal, was heute herauskommt: Ich rede ab jetzt offen über mein Gehalt. Zumindest mit Anna. Das ist ein Anfang, oder?",
        next: "ende" },
      danach: { speaker: "Jonas", emotion: "froehlich",
        text: "Ich hab's Anna gleich gesagt: Kim war super. Sie meinte nur: „Wissen wir doch.“",
        next: "ende" }
    }
  },

  saal_vella: {
    einstieg: [ { wenn: "finale_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Abg. Lucia Vella", emotion: "skeptisch",
        text: "Lucia Vella, Ausschuss für Beschäftigung. Ich sage es gleich: Ich halte viel von freien Entscheidungen und wenig von neuen Vorschriften. Überzeugen Sie mich!",
        next: "ende" },
      danach: { speaker: "Abg. Lucia Vella", emotion: "nachdenklich",
        text: "Ihre Argumente waren gut vorbereitet. Einig sind wir uns noch nicht – aber das muss man in einer Demokratie auch nicht immer sein.",
        next: "ende" }
    }
  },

  saal_nowicki: {
    einstieg: [ { wenn: "finale_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Abg. Piotr Nowicki", emotion: "neutral",
        text: "Piotr Nowicki. Ich war lange Betriebsrat in einer Fabrik. Für mich ist klar: gleiche Arbeit, gleicher Lohn. Aber ich will Belege sehen, keine Parolen.",
        next: "ende" },
      danach: { speaker: "Abg. Piotr Nowicki", emotion: "froehlich",
        text: "Gute Arbeit. Belege schlagen Parolen – fast immer.",
        next: "ende" }
    }
  },

  saal_dewit: {
    einstieg: [ { wenn: "finale_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "Abg. Anneke de Wit", emotion: "skeptisch",
        text: "Anneke de Wit. Ich frage mich bei jedem Thema: Muss das wirklich in Brüssel geregelt werden? Oder können die Länder das besser selbst?",
        next: "ende" },
      danach: { speaker: "Abg. Anneke de Wit", emotion: "nachdenklich",
        text: "Sie haben mir einiges zum Nachdenken mitgegeben. Das passiert mir nicht oft.",
        next: "ende" }
    }
  },

  // ---------------- Das Finale (startet am Rednerpult) ----------------
  finale_pult: {
    einstieg: [ { wenn: "finale_fertig", knoten: "danach" }, { knoten: "start" } ],
    knoten: {
      start: { speaker: "",
        text: "Das Rednerpult. Vor dir: drei Abgeordnete, ein Mikrofon und ziemlich viel Stille.",
        options: [
          { label: "Die Sitzung beginnen", next: "s1" },
          { label: "Noch nicht", next: "ende" }
        ] },
      s1: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "neutral",
        text: "Sehr geehrte Abgeordnete, das ist Kim aus unserem Büro. Kim hat in vier Ländern recherchiert – und im Archiv.",
        next: "s2" },
      s2: { speaker: "Abg. Piotr Nowicki", wer: "nowicki", emotion: "neutral",
        text: "Willkommen, Kim. Dann zeigen Sie uns bitte, was Sie gefunden haben.",
        next: "s3" },
      s3: { speaker: "Kim", emotion: "froehlich",
        text: "Gern. Ich habe fünf Beweisstücke mitgebracht.",
        aktion: "minispiel:praesentation", next: "ende" },
      danach: { speaker: "",
        text: "Die Sitzung ist vorbei. Das Mikrofon ist aus – zum Glück, denn Kim summt leise vor sich hin.",
        next: "ende" }
    }
  },

  finale_nach_praesentation: {
    knoten: {
      start: { speaker: "Abg. Lucia Vella", wer: "vella", emotion: "nachdenklich",
        text: "Danke, Kim. Das waren eindrucksvolle Beweise. Trotzdem haben wir Fragen.",
        next: "k2" },
      k2: { speaker: "Abg. Piotr Nowicki", wer: "nowicki", emotion: "neutral",
        text: "Jede und jeder von uns stellt Ihnen eine Frage. Antworten Sie bitte mit einem Fakt aus Ihrem Notizbuch.",
        aktion: "minispiel:duell", next: "ende" }
    }
  },

  finale_nach_duell: {
    einstieg: [ { wenn: "duell_punkte_hoch", knoten: "hoch" }, { wenn: "duell_punkte_mittel", knoten: "mittel" }, { knoten: "niedrig" } ],
    knoten: {
      hoch: { speaker: "Abg. Anneke de Wit", wer: "dewit", emotion: "ueberrascht",
        text: "Das war überzeugend – das muss sogar ich zugeben.",
        next: "m" },
      mittel: { speaker: "Abg. Anneke de Wit", wer: "dewit", emotion: "nachdenklich",
        text: "Einiges hat mich überzeugt, anderes weniger. Das ist ehrlich gesagt ganz normal.",
        next: "m" },
      niedrig: { speaker: "Abg. Anneke de Wit", wer: "dewit", emotion: "skeptisch",
        text: "Ich bin noch nicht überzeugt. Aber ich höre Ihnen weiter zu.",
        next: "m" },
      m: { speaker: "Abg. Lucia Vella", wer: "vella", emotion: "neutral",
        text: "Kommen wir zum wichtigsten Teil: Was schlagen Sie vor? Wählen Sie drei Maßnahmen. Und bitte verschweigen Sie uns die Nachteile nicht.",
        next: "m2" },
      m2: { speaker: "Kim", emotion: "nachdenklich",
        text: "Eine perfekte Lösung gibt es nicht. Aber ich weiß, was ich vorschlagen würde.",
        aktion: "minispiel:massnahmen", next: "ende" }
    }
  },

  finale_abschluss: {
    knoten: {
      start: { speaker: "Abg. Piotr Nowicki", wer: "nowicki", emotion: "froehlich",
        text: "Danke, Kim. Der Ausschuss wird über Ihre Vorschläge beraten. Die Sitzung ist geschlossen.",
        next: "k2" },
      k2: { speaker: "Dr. Marie Laurent", wer: "laurent", emotion: "froehlich", emote: "herz",
        text: "Du warst großartig, Kim. Was aus deinen Vorschlägen wird, zeigt sich erst mit der Zeit …",
        next: "k3" },
      k3: { speaker: "",
        text: "Zehn Jahre später …",
        aktion: "epilog", next: "ende" }
    }
  }
};


/* =====================================================================
   Minispiele (Texte und Aufbau) – Zahlen kommen aus facts.js
   ===================================================================== */
DATA.minispiele = {

  branchen: {
    art: "zuordnen",
    titel: "Welche Branche zahlt mehr?",
    anleitung: "Welcher Messestand zahlt wie viel? **Zieh jedes Gehalt auf den passenden Stand** – oder tipp erst ein Gehalt an und dann den Stand. Gemeint ist das durchschnittliche Bruttomonatsgehalt in Estland.",
    tasten: "Tastatur: ↑ ↓ Stand wählen · ← → Gehalt wechseln · Enter prüfen",
    leer: "hierher ziehen",
    alleVerteilt: "Alle Gehälter sind verteilt – jetzt „Prüfen“!",
    pruefen: "Prüfen",
    weiter: "Weiter",
    nochNichtFertig: "Ordne erst jedem Stand ein Gehalt zu!",
    eintraege: [
      { name: "IT & Kommunikation", fakt: "ee_lohn_it",      zusatz: "Frauenanteil: etwa {fakt:ee_frauen_it}" },
      { name: "Bau & Handwerk",     fakt: "ee_lohn_bau",     zusatz: "Frauenanteil: etwa {fakt:ee_frauen_bau}" },
      { name: "Gesundheit & Pflege", fakt: "ee_lohn_pflege", zusatz: "Frauenanteil: etwa {fakt:ee_frauen_pflege}" },
      { name: "Bildung & Soziales", fakt: "ee_lohn_bildung", zusatz: "Frauenanteil: etwa {fakt:ee_frauen_bildung}" }
    ],
    aufloesung: "So sieht es aus! Schau dir den **Frauenanteil** unter den Gehältern an. Was fällt dir auf?",
    setFlag: "ee_minispiel",
    danach: "ee_kadri_nach_spiel"
  },

  verhandlung: {
    art: "verhandlung",
    titel: "Gehaltsverhandlung (Übung)",
    rolle: "Du spielst Anna. Herr Schmit spielt ihren Chef. Überzeuge ihn mit guten Argumenten!",
    gegenueber: "Herr Schmit",
    meterName: "Überzeugung",
    start: 35,
    ziel: 70,
    einleitung: "Setzen Sie sich, Anna. Sie wollten über Ihr Gehalt sprechen?",
    tasten: "↑ ↓ Argument wählen · Enter oder E: sagen",
    rundeText: "Runde {n} von {von}",
    runden: [
      { frage: "Warum sollten wir über Ihr Gehalt sprechen?",
        optionen: [
          { text: "Ich habe dieses Jahr das Kundenprojekt geleitet und drei neue Kunden gewonnen.", punkte: 25, reaktion: "Hm, das stimmt. Das war richtig gute Arbeit." },
          { text: "Ich bräuchte einfach ein bisschen mehr Geld.", punkte: 0, reaktion: "Verstehe ich. Aber brauchen tun wir alle etwas." },
          { text: "Tut mir leid, dass ich überhaupt frage …", punkte: -10, reaktion: "Äh … Sie müssen sich nicht entschuldigen." },
          { text: "Wenn ich nicht mehr bekomme, bin ich weg!", punkte: -10, reaktion: "Drohungen sind kein guter Start." }
        ] },
      { frage: "Und an welche Summe haben Sie gedacht?",
        optionen: [
          { text: "Ich habe mich informiert: Für vergleichbare Stellen sind 8 Prozent mehr üblich.", punkte: 20, reaktion: "Sie haben sich vorbereitet. Das merkt man." },
          { text: "Was Sie für angemessen halten.", punkte: -10, reaktion: "Dann sage ich mal: etwas weniger, als Sie gehofft haben." },
          { text: "So viel wie mein Bruder.", punkte: 0, reaktion: "Vergleiche sind in Ordnung – aber lieber mit Zahlen vom Markt." },
          { text: "Keine Ahnung … vielleicht ein bisschen?", punkte: -5, reaktion: "Ein bisschen ist schwer zu planen." }
        ] },
      { frage: "Das Budget ist dieses Jahr leider knapp.",
        optionen: [
          { text: "Dann lassen Sie uns einen Stufenplan machen: jetzt ein Teil, in sechs Monaten der Rest.", punkte: 15, reaktion: "Das ist ein fairer Vorschlag." },
          { text: "Nach der neuen EU-Richtlinie darf ich doch erfahren, was vergleichbare Stellen verdienen, oder?", punkte: 10, reaktion: "Stimmt, die Transparenz kommt. Sie sind gut informiert." },
          { text: "Oh, okay. Dann vielleicht nächstes Jahr.", punkte: -10, reaktion: "Ja … vielleicht." },
          { text: "Dann kündige ich eben.", punkte: -15, reaktion: "Das würde ich nicht so schnell sagen." }
        ] },
      { frage: "Was bringen Sie im nächsten Jahr ein?",
        optionen: [
          { text: "Ich möchte das neue Projekt leiten – ich habe schon einen Plan dafür.", punkte: 15, reaktion: "Einen Plan? Den will ich sehen!" },
          { text: "Ich arbeite einfach noch mehr Stunden.", punkte: 0, reaktion: "Mehr Stunden sind nicht dasselbe wie mehr Wert." },
          { text: "Das Gleiche wie immer.", punkte: -5, reaktion: "Hm. Das Gleiche wie immer ist … das Gleiche wie immer." }
        ] }
    ],
    ergebnisse: [
      { ab: 90, text: "Herr Schmit lächelt: „Überzeugt. 8 Prozent mehr – und wir reden über die Projektleitung.“" },
      { ab: 70, text: "Herr Schmit nickt: „Einverstanden. 5 Prozent jetzt, der Rest nach der nächsten Beurteilung.“" },
      { ab: 0,  text: "Herr Schmit zuckt mit den Schultern: „Tut mir leid, dieses Jahr wird das nichts.“ Beim nächsten Versuch hilft bessere Vorbereitung." }
    ],
    lehre: "Gute Argumente: eigene Erfolge mit Beispielen, eine recherchierte Zahl, Lösungen statt Drohungen. Entschuldigungen und „was Sie für angemessen halten“ schwächen die Position.",
    nochmal: "Noch mal üben",
    weiter: "Weiter",
    setFlag: "lu_verhandelt",
    addNote: "verhandlung_tipps",
    danach: "lu_schmit_nach_spiel"
  },

  // ---------------- Finale 1: Beweisstücke präsentieren ----------------
  praesentation: {
    art: "praesentation",
    titel: "Kims Beweisstücke",
    zaehler: "Beweisstück {n} von {von}",
    tasten: "E oder Enter: weiter",
    weiter: "Nächstes Beweisstück",
    fertig: "Zu den Fragen",
    karten: [
      { land: "de", text: "In Deutschland arbeiten etwa {fakt:de_teilzeit_frauen} der erwerbstätigen Frauen in Teilzeit – oft, weil Betreuungsplätze fehlen. Teilzeitstellen werden pro Stunde oft schlechter bezahlt und seltener befördert. So wächst die Lohnlücke." },
      { land: "se", text: "Nach dem ersten Kind steigen die Löhne von Müttern oft langsamer als die von Vätern. Schweden reserviert jedem Elternteil {fakt:se_reservierte_tage} Elterngeld – so teilen sich mehr Paare die Pause und den Lohnknick." },
      { land: "ee", text: "In Estland zahlt die IT ({fakt:ee_lohn_it}) deutlich mehr als die Pflege ({fakt:ee_lohn_pflege}). In der IT arbeiten wenige Frauen, in der Pflege sehr viele." },
      { land: "lu", text: "Luxemburg hat im Durchschnitt fast keine Lücke ({fakt:gpg_lu}). Trotzdem werden in manchen Firmen vor allem Männer befördert – nur etwa {fakt:lu_frauen_fuehrung} der Führungskräfte sind Frauen." },
      { land: "bxl", text: "Selbst wenn man Beruf, Branche und Arbeitszeit herausrechnet, bleibt in Deutschland eine Lücke von etwa {fakt:gpg_de_bereinigt}: der unerklärte Rest." }
    ],
    setFlag: "finale_praesentiert",
    danach: "finale_nach_praesentation"
  },

  // ---------------- Finale 2: Argumentationsduell ----------------
  // passend: Notizen (DATA.notes), die als gute Antwort zählen.
  // Punkte: 2 beim ersten Versuch, 1 beim zweiten, danach 0. Kein Game Over.
  duell: {
    art: "duell",
    titel: "Fragen des Ausschusses",
    anleitung: "Wähle aus deinem Notizbuch die Notiz, die die Frage am besten beantwortet.",
    tasten: "← → Reiter · ↑ ↓ Notiz · Enter: vorlegen",
    vorlegen: "Diese Notiz vorlegen",
    weiter: "Weiter",
    punkteName: "Überzeugung",
    keineNotiz: "Auf dieser Seite steht nichts.",
    punkteRichtig: [2, 1],
    versuche: 3,
    fragen: [
      { wer: "vella", haltung: "wirtschaftsliberal",
        frage: "Viele Frauen entscheiden sich doch bewusst für Teilzeit. Das ist eine freie Wahl. Warum sollte die Politik da eingreifen?",
        passend: ["teilzeit_gruende", "kita_luecke", "meinung_strukturen", "rechnet_sich", "teilzeit_lohn", "elternzeit_lohn", "se_modell", "se_vaeter", "elternzeit_geteilt"],
        richtig: "Hm. Wenn Betreuungsplätze fehlen oder sich nur eine Aufteilung rechnet, ist die Wahl also nicht ganz so frei. Das nehme ich mit.",
        falsch: "Interessant – aber das beantwortet meine Frage nicht. Mir geht es um die angeblich freie Wahl bei der Arbeitszeit.",
        tipp: "Tipp: Schau unter „Teilzeit“ oder „Elternzeit“.",
        aufgeben: "Lassen wir das so stehen. Ich hätte gern gehört, warum die Wahl vielleicht nicht ganz frei ist – zum Beispiel wegen fehlender Kita-Plätze." },
      { wer: "nowicki", haltung: "gewerkschaftsnah",
        frage: "Die Arbeitgeber sagen mir immer: Die Lücke erklärt sich komplett durch Beruf, Branche und Arbeitszeit – also ist alles fair. Was antworten Sie darauf?",
        passend: ["rest_bereinigt", "rest_bedeutung", "rest_erklaert", "branchen_muster", "verhandlung_fair", "befoerderung"],
        richtig: "Genau solche Belege brauche ich. Mit „alles erklärbar“ ist es also nicht getan.",
        falsch: "Das mag stimmen, hilft mir aber nicht gegen das Argument „alles erklärbar“.",
        tipp: "Tipp: Schau unter „Unerklärter Rest“.",
        aufgeben: "Dann sage ich es selbst: Auch wenn man Beruf, Branche und Arbeitszeit herausrechnet, bleibt eine Lücke. Das zeigt Ihre Akte aus dem Archiv." },
      { wer: "dewit", haltung: "skeptisch gegenüber EU-Regeln",
        frage: "Luxemburg hat im Durchschnitt fast keine Lohnlücke. Die Länder schaffen das also allein. Warum sollte sich Brüssel einmischen?",
        passend: ["durchschnitt", "gpg_lu", "befoerderung", "fuehrung_lu", "eu_umsetzung"],
        richtig: "Hm. Ein niedriger Durchschnitt heißt also nicht, dass alles in Ordnung ist. Das muss ich mir überlegen.",
        falsch: "Das mag sein, erklärt aber nicht, warum ein Land mit fast keiner Lücke gemeinsame Regeln braucht.",
        tipp: "Tipp: Schau unter „Verhandlung & Beförderung“ oder „EU-Recht“.",
        aufgeben: "Ich hätte erwartet, dass Sie auf die Beförderungsliste aus Luxemburg verweisen. Ein Durchschnitt zeigt eben nicht alles." }
    ],
    ergebnis: "Du hast {p} von {max} Überzeugungspunkten gesammelt.",
    grenzeHoch: 5,
    grenzeMittel: 3,
    setFlag: "finale_duell",
    danach: "finale_nach_duell"
  },

  // ---------------- Finale 3: Drei Maßnahmen wählen ----------------
  massnahmen: {
    art: "massnahmen",
    titel: "Drei Maßnahmen für den Ausschuss",
    anleitung: "Wähle genau drei Maßnahmen. Jede hat Vor- und Nachteile – eine einzig richtige Lösung gibt es nicht.",
    tasten: "Pfeiltasten: wählen · E oder Leertaste: an/aus · Enter: vorlegen",
    zaehler: "{n} von {von} gewählt",
    vorlegen: "Maßnahmen vorlegen",
    zuWenig: "Wähle genau drei Maßnahmen.",
    schonVoll: "Du hast schon drei Maßnahmen gewählt. Nimm erst eine wieder heraus.",
    pro: "Dafür",
    contra: "Dagegen",
    anzahl: 3,
    optionen: [
      { id: "kita", titel: "Kita-Ausbau", farbe: "de",
        kurz: "Mehr und bessere Betreuungsplätze für kleine Kinder, mit Förderung der EU.",
        pro: ["Eltern können freier entscheiden, wie viel sie arbeiten.", "Kinder profitieren von früher Bildung."],
        contra: ["Kostet viel Geld.", "Schon heute fehlen Erzieher*innen."] },
      { id: "partnermonate", titel: "Mehr Partnermonate", farbe: "se",
        kurz: "Jeder Elternteil bekommt eigene Elternzeitmonate, die nicht übertragbar sind.",
        pro: ["Väter nehmen häufiger Elternzeit – das zeigt Schweden.", "Die Pause im Job verteilt sich gerechter."],
        contra: ["Manche Familien fühlen sich bevormundet.", "Für kleine Betriebe schwerer zu planen."] },
      { id: "transparenz", titel: "Lohntransparenz", farbe: "bxl",
        kurz: "Nach der Richtlinie (EU) 2023/970: Firmen legen offen, wie sie Gehälter festlegen, und Beschäftigte dürfen Vergleichswerte erfragen.",
        pro: ["Unterschiede werden sichtbar und können geklärt werden.", "Gilt in allen EU-Ländern."],
        contra: ["Mehr Aufwand für Firmen.", "Offenheit allein ändert die Ursachen noch nicht."] },
      { id: "aufwertung", titel: "Soziale Berufe aufwerten", farbe: "ee",
        kurz: "Pflege, Erziehung und soziale Arbeit werden besser bezahlt.",
        pro: ["Wichtige Arbeit wird gerechter bezahlt.", "Mehr Menschen wollen diese Berufe lernen."],
        contra: ["Höhere Kosten, zum Beispiel für Pflegekassen und Gebühren.", "Löhne legt die EU nicht selbst fest – das machen die Länder und Tarifpartner."] },
      { id: "quote", titel: "Frauenquote für Führungsposten", farbe: "lu",
        kurz: "Große Unternehmen müssen einen Mindestanteil von Frauen in Führungspositionen erreichen.",
        pro: ["Mehr Vorbilder in Chefetagen.", "Beförderungen werden genauer geprüft."],
        contra: ["Kritik: Allein die Leistung sollte zählen.", "Hilft vor allem Frauen in großen Firmen."] },
      { id: "keine", titel: "Keine Eingriffe – freie Entscheidung", farbe: "keine",
        kurz: "Die EU macht keine neuen Regeln. Familien und Firmen entscheiden selbst.",
        pro: ["Keine neue Bürokratie.", "Respektiert persönliche Entscheidungen."],
        contra: ["Bestehende Hindernisse bleiben.", "Veränderungen können sehr lange dauern."] }
    ],
    setFlag: "finale_fertig",
    danach: "finale_abschluss"
  }
};

/* =====================================================================
   Epilog: „Anna und Jonas in 10 Jahren“
   ---------------------------------------------------------------------
   Kleine 3D-Szene auf dem Europaplatz im Abendlicht. Der Text setzt sich
   aus Bausteinen zusammen:
     1) eine Grundstimmung (die erste, deren Bedingung passt)
     2) ein Baustein je gewählter Maßnahme (Flags massnahme_<id>)
     3) ein Satz je nach Überzeugungspunkten im Duell
     4) das Schlussgespräch
   figuren: wie in npcs.js (nurWenn, start, blick, routine). Objekte-IDs
   (z. B. Bänke) stammen von der Karte des Epilogs.
   ===================================================================== */
DATA.epilog = {
  karte: "europaplatz",
  stimmung: "abend",
  kamera: { ziel: [18, 18.6], abstand: 10.5, neigung: 40, schwenk: 0.22 },
  titel: "Zehn Jahre später …",
  tasten: "E oder Enter: weiter",
  weiter: "Weiter",
  ende: "Zum Nachdenken",

  figuren: {
    anna:         { figur: "anna_10", start: [16.6, 18.1], blick: 30, nurWenn: "!massnahme_quote&!massnahme_transparenz" },
    anna_chefin:  { figur: "anna_10_blazer", start: [16.6, 18.1], blick: 30, nurWenn: "massnahme_quote|massnahme_transparenz" },
    jonas:        { figur: "jonas_10", start: [18.4, 18.1], blick: -30, nurWenn: "!massnahme_partnermonate" },
    jonas_wagen:  { figur: "jonas_10_wagen", start: [18.4, 17.9], blick: -20, nurWenn: "massnahme_partnermonate" },
    lina:         { figur: "lina", start: [15.6, 19.2], blick: 90, nurWenn: "massnahme_kita",
                    routine: [ { tun: "gehen", weg: [[15.2, 17.6], [14.6, 19.6], [16.2, 20.2]] }, { tun: "warten", s: 1.2 } ] },
    anu:          { figur: "anu_10", start: [9.5, 21.2], blick: 90, nurWenn: "massnahme_aufwertung",
                    routine: [ { tun: "gehen", weg: [[26, 21.2]] }, { tun: "warten", s: 2 }, { tun: "gehen", weg: [[9.5, 21.2]] }, { tun: "warten", s: 2 } ] },
    dimitriou:    { figur: "dimitriou", start: [21.2, 19.2], blick: -135, nurWenn: "massnahme_keine",
                    routine: [ { tun: "sitzen", an: "hub_bank_3", s: 9999 } ] }
  },

  stimmungen: [
    { wenn: "massnahme_keine",
      text: "Die EU hat damals nur wenige neue Regeln beschlossen. Vieles blieb den Familien und Firmen selbst überlassen. Manches hat sich dadurch verändert – anderes ist geblieben, wie es war." },
    { wenn: "massnahme_kita|massnahme_partnermonate",
      text: "In den letzten zehn Jahren hat sich an vielen Stellen gleichzeitig etwas bewegt – zu Hause und im Job. Die Lücke ist kleiner geworden. Verschwunden ist sie nicht." },
    { wenn: "",
      text: "Auf den Gehaltszetteln hat sich in den letzten zehn Jahren einiges getan. Zu Hause ist vieles beim Alten geblieben: Wer Kinder betreut, arbeitet oft noch weniger Stunden." }
  ],

  massnahmen: {
    kita: "**Kita-Ausbau:** Überall wurden neue Kitas gebaut, auch mit Geld der EU. Anna hat für ihre Tochter Lina gleich nach der Elternzeit einen Platz bekommen und arbeitet so viele Stunden, wie sie möchte. In manchen Städten fehlen allerdings noch immer Erzieher*innen.",
    partnermonate: "**Partnermonate:** Jeder Elternteil hat eigene Elternzeitmonate, die verfallen, wenn man sie nicht nimmt. Jonas war mit seinem Sohn ein halbes Jahr zu Hause. Sein Chef fand das erst seltsam – inzwischen macht es die halbe Abteilung so. Manche Familien fühlen sich allerdings bevormundet.",
    transparenz: "**Lohntransparenz:** Heute steht in jeder Stellenanzeige ein Gehalt, und alle dürfen fragen, was vergleichbare Kolleg*innen verdienen. Anna hat nachgefragt – und eine Gehaltserhöhung bekommen. Für kleine Firmen war der neue Papierkram aber lästig.",
    aufwertung: "**Soziale Berufe:** Pflege, Erziehung und soziale Arbeit werden heute besser bezahlt. Anu aus Estland arbeitet inzwischen als Pflegerin – und muss nicht mehr nebenbei jobben. Dafür sind einige Beiträge und Gebühren gestiegen.",
    quote: "**Frauenquote:** Große Firmen müssen mehr Frauen in Führungspositionen bringen. Anna leitet inzwischen ein Team. Ein Kollege murmelte anfangs etwas von „Quote“ – nach einem halben Jahr murmelte er nicht mehr. Manche finden die Quote trotzdem ungerecht.",
    keine: "**Freie Entscheidung:** Ohne neue Regeln entscheiden Anna und Jonas alles selbst – mit allen Freiheiten und allen alten Hindernissen. Einige Firmen sind freiwillig vorangegangen, andere nicht."
  },

  punkte: [
    { ab: 5, text: "Übrigens: Der Ausschuss hat Kims Bericht damals fast Wort für Wort übernommen." },
    { ab: 3, text: "Übrigens: Kims Bericht wurde damals lange diskutiert – und in Teilen übernommen." },
    { ab: 0, text: "Übrigens: Kims Bericht sorgte damals für viele Fragen. Die Diskussion darüber läuft bis heute." }
  ],

  schluss: [
    { wer: "anna", name: "Anna", text: "Weißt du noch, wie wir damals unsere Gehaltszettel verglichen haben?" },
    { wer: "jonas", name: "Jonas", text: "Klar. Und weißt du, was das Beste ist? Heute reden wir einfach darüber." }
  ]
};

