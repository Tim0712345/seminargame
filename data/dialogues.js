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
    hinweisNeuladen: "Die Kantenglättung ändert sich erst nach dem Neuladen."
  },

  hudTaste: "E",
  notizNeu: "Neue Notiz:",
  beweisNeu: "Beweisstück gefunden:",
  hineingehen: "Hineingehen",
  hinausgehen: "Hinausgehen",
  ansehen: "Ansehen",

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
      { wenn: "beweis_de&!hub_laurent_de", knoten: "nach_de" },
      { knoten: "start" }
    ],
    knoten: {
      start: { speaker: "Dr. Marie Laurent", emotion: "neutral",
        text: "Na, Kim? Das Deutschland-Viertel liegt im Westen. Die anderen Viertel werden gerade noch vorbereitet – dorthin geht es später.",
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
        text: "Das hören wir oft. Wenn Betreuung fehlt, bleibt wenig Spielraum – und dann reduziert häufig die Person, die ohnehin weniger verdient.",
        next: "nach_de_ende" },
      nach_de_b: { speaker: "Dr. Marie Laurent", emotion: "nachdenklich",
        text: "Auch das stimmt. Die Frage ist nur: Unter welchen Bedingungen wird entschieden? Mit Kita-Platz entscheidet man anders als ohne.",
        next: "nach_de_ende" },
      nach_de_ende: { speaker: "Dr. Marie Laurent", emotion: "froehlich",
        text: "Die anderen Viertel öffnen bald. Schau bis dahin gern noch bei Anna und Jonas vorbei.",
        setFlag: "hub_laurent_de", next: "ende" }
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
        text: "Alle vier Mulden sind gefüllt. Das Tor summt leise. (Brüssel wird in Phase 4 gebaut.)",
        next: "ende" }
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
        text: "Ich bin Bauingenieurin. Früher Vollzeit, jetzt 20 Stunden. Weniger Stunden heißt weniger Geld – und die spannenden Projekte bekommen die, die immer da sind.",
        addNote: "teilzeit_quote",
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
        text: "Nein. Aber ich verdiene jetzt weniger und merke zum ersten Mal, wie sich das anfühlt. Meine Partnerin kannte das schon lange.",
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
  }
};
