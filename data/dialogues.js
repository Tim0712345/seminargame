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
  aufzug: "Aufzug",
  aufzugTitel: "Aufzug – welche Etage?",
  aufzugHier: "(hier)",
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
      { wenn: "alle_beweise&!hub_laurent_alle", knoten: "alle" },
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
        text: "Das hören wir oft. Wenn Betreuung fehlt, bleibt wenig Spielraum – und dann reduziert häufig die Person, die ohnehin weniger verdient.",
        next: "nach_de_ende" },
      nach_de_b: { speaker: "Dr. Marie Laurent", emotion: "nachdenklich",
        text: "Auch das stimmt. Die Frage ist nur: Unter welchen Bedingungen wird entschieden? Mit Kita-Platz entscheidet man anders als ohne.",
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
        text: "Viele sehen das so. Und trotzdem nehmen auch in Schweden Väter noch weniger Tage als Mütter. Regeln helfen – ändern aber nicht alles über Nacht.",
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
        text: "Alle vier Beweisstücke! Kim, das ist großartig. Das Tor im Norden ist bereit – in Brüssel wartet der Ausschuss.",
        setFlag: ["hub_laurent_alle", "hub_laurent_de", "hub_laurent_se", "hub_laurent_ee", "hub_laurent_lu"], next: "ende" }
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
        addNote: "se_vaeter",
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
        text: "Weniger, als ich dachte. Weil Lars auch weg war, war ich nicht die Einzige im Team, die gefehlt hat. Das macht einen Unterschied.",
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
  }
};

/* =====================================================================
   Minispiele (Texte und Aufbau) – Zahlen kommen aus facts.js
   ===================================================================== */
DATA.minispiele = {

  branchen: {
    art: "zuordnen",
    titel: "Welche Branche zahlt mehr?",
    anleitung: "Ordne jedem Messestand das durchschnittliche Bruttomonatsgehalt in Estland zu.",
    tasten: "↑ ↓ Stand wählen · ← → oder E Gehalt wechseln · Enter prüfen (oder klicken)",
    leer: "– Gehalt wählen –",
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
  }
};
