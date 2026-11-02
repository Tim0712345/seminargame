/* =====================================================================
   data/gespraeche.js – alle Gespräche und Sätze (Abschnitt 4 und 5.5)
   ---------------------------------------------------------------------
   Ein Satz ist { sprecher, text, geste }.
     sprecher: Figur aus data/figuren.js
     geste:    hand_heben, auf_papier_zeigen, arme_verschraenken, nicken (optional)
   Platzhalter: {name}, {fakt:id}, {jahr:id}, {quelle:id}, {wert:id}.
   Mira duzt die Spielfigur, alle anderen siezen. Keine Pronomen für die Spielfigur.
   Schlicht und sachlich, ohne Witzsätze (Wunsch des Users, November 2026).
   ===================================================================== */
var DATA = window.DATA || {};

/* Gesprächsnetze (werden im Debug-Modus auf Erreichbarkeit geprüft) */
DATA.gespraeche = {
  /* Beispiel aus Phase 1, bleibt als Probe im Büro erhalten */
  probe_luca: {
    ort: "buero", teilnehmer: ["mira", "luca"], start: "k1",
    knoten: {
      k1: { sprecher: "mira", text: "Besuch für dich, {name}. Luca Bianchi von der Allianz für Soziale Gerechtigkeit. Er hat den Vorschlag schon gelesen.", geste: "nicken", weiter: "k2" },
      k2: { sprecher: "luca", text: "Guten Morgen, {name}. Mir geht es um eine Sache: Wer nicht weiß, was die anderen verdienen, kann gar nicht prüfen, ob die eigene Bezahlung fair ist.", geste: "hand_heben",
            antworten: [{ text: "Was genau wollen Sie im Gesetz sehen?", ziel: "k3" }, { text: "Und was sagen die kleinen Betriebe dazu?", ziel: "k4" }] },
      k3: { sprecher: "luca", text: "Ein Auskunftsrecht, das man wirklich nutzen kann. Für alle Beschäftigten – nicht nur in großen Firmen.", geste: "auf_papier_zeigen", weiter: "k5" },
      k4: { sprecher: "luca", text: "Ich war Gewerkschaftssekretär in einer Fabrik. Ich weiß, dass Formulare Arbeit machen. Aber wenn niemand etwas weiß, zahlen das die Beschäftigten.", geste: "arme_verschraenken", weiter: "k5" },
      k5: { sprecher: "mira", text: "Pieter de Wit wird dir noch erklären, was das für eine kleine Firma bedeutet. Beide Seiten haben gute Gründe.", geste: "arme_verschraenken", weiter: "k6" },
      k6: { sprecher: "luca", text: "Mein Büro ist im dritten Stock. Kommen Sie vorbei, wenn Sie Fragen haben.", geste: "nicken",
            antworten: [{ text: "Danke. Ich denke darüber nach.", ziel: "ende" }, { text: "Ich höre mir auch die andere Seite an.", ziel: "ende" }] }
    }
  }
};

/* Sätze, die der Ablauf der Kapitel benutzt */
DATA.zeilen = {

  /* ---------------- Kapitel 1 – Der Stapel ---------------- */
  kapitel1: {
    namensfrage: "Wie heißt du? (Vorname)",
    mira: [
      { sprecher: "mira", text: "Guten Morgen, {name}! Du bist jetzt {g:berichterstatter}. Du schreibst für das Parlament den Text, über den alle abstimmen.", geste: "hand_heben" },
      { sprecher: "mira", text: "Dafür brauchst du eine Mehrheit. Im Ausschuss sitzen {wert:sitze_ausschuss} Abgeordnete aus sieben Fraktionen. Keine hat allein genug Stimmen.", geste: "auf_papier_zeigen" },
      { sprecher: "mira", text: "Der Kalender ist knapp. Bis Donnerstag muss dein Entwurf durch den Ausschuss. Danach kommen {g:trilog} und Plenum." },
      { sprecher: "mira", text: "Alles, was du hörst, landet im Dossier. Das sind deine Karten für die Verhandlungen.", geste: "nicken" },
      { sprecher: "mira", text: "Es gibt nicht die eine richtige Lösung. Wichtig ist, dass du deine Entscheidungen begründen kannst.", geste: "arme_verschraenken" }
    ],
    zettel: { sprecher: "mira", text: "Das lag heute Morgen auf deinem Schreibtisch. Von Inès, einer Auszubildenden aus Lyon. Ihre Berufsschule war gestern hier." },
    probe: { sprecher: "mira", text: "Probier es aus: Wähle für Artikel 1 eine Begründung und schau auf das Glasmodell." },
    probeDanach: { sprecher: "mira", text: "Siehst du? Schon eine Änderung verschiebt Stimmen. Das war nur eine Probe, ich setze es zurück.", geste: "nicken" }
  },

  /* ---------------- Kapitel 2 – Die Anhörung ---------------- */
  anhoerung: {
    einfuehrung: [
      { sprecher: "weiss", text: "Guten Morgen. Vorweg: Der Gender Pay Gap vergleicht durchschnittliche {g:bruttostundenlohn} – nicht Monatsgehälter.", geste: "hand_heben" },
      { sprecher: "weiss", text: "Teilzeit wirkt deshalb nicht über weniger Stunden. Sie wirkt über schlechtere Stundenlöhne, seltenere Beförderungen und flachere Gehaltsentwicklung." },
      { sprecher: "weiss", text: "In Deutschland liegt die Lücke {g:unbereinigt} bei {fakt:gpg_de_destatis}. Rechnet man Beruf, Branche oder Arbeitszeit heraus, bleiben {g:bereinigt} {fakt:gpg_de_bereinigt}.", geste: "auf_papier_zeigen" },
      { sprecher: "weiss", text: "Dieser Rest heißt unerklärter Teil. Er ist kein Beweis für Diskriminierung – aber ein ernster Hinweis." },
      { sprecher: "weiss", text: "Umgekehrt kann auch der erklärte Teil ungerecht sein: wenn Berufe mit vielen Frauen grundsätzlich schlechter bezahlt werden." },
      { sprecher: "weiss", text: "Ein Durchschnitt sagt aber nichts über den einzelnen Betrieb. Dafür braucht man Zahlen aus dem Betrieb selbst.", geste: "nicken" }
    ],
    mira: { sprecher: "mira", text: "Du hast {wert:fragenkarten_anhoerung} Fragekarten, aber nur Zeit für {wert:fragen_anhoerung} Fragen. Wen fragst du?" },
    fragen: [
      { id: "ines_vertrag", an: "ines", frage: "Woran merken Sie, dass Sie weniger verdienen könnten?", karte: "ines_vertrag", haltung: "betroffen",
        antwort: [
          { sprecher: "ines", text: "Ich hab es nur zufällig gesehen, auf einem Ausdruck im Drucker. Sonst wüsste ich gar nichts." },
          { sprecher: "ines", text: "In meinem Vertrag steht, dass ich nicht über mein Gehalt reden darf. Also frage ich auch niemanden.", geste: "arme_verschraenken" }
        ] },
      { id: "ines_gespraech", an: "ines", frage: "Wie lief Ihr Vorstellungsgespräch?", karte: "ines_gespraech", haltung: "betroffen",
        antwort: [
          { sprecher: "ines", text: "Sie haben mich gefragt, was ich mir vorstelle. Ich hatte keine Ahnung, was üblich ist." },
          { sprecher: "ines", text: "Also habe ich die erste Zahl genommen, die sie mir angeboten haben.", geste: "nicken" }
        ] },
      { id: "weiss_rest", an: "weiss", frage: "Was sagt der unerklärte Rest wirklich aus?", karte: "weiss_unerklaert", haltung: "sachlich",
        antwort: [
          { sprecher: "weiss", text: "Er sagt: Hier gibt es einen Unterschied, den wir mit unseren Daten nicht erklären können." },
          { sprecher: "weiss", text: "Das kann Diskriminierung sein. Oder etwas, das nicht gemessen wurde – zum Beispiel, wie verhandelt wurde.", geste: "hand_heben" },
          { sprecher: "weiss", text: "Deshalb: erst genau hinschauen, dann handeln. Unerklärt heißt nicht automatisch Diskriminierung." }
        ] },
      { id: "karin_vorlagen", an: "karin", frage: "Was bräuchte Ihr Betrieb, um fair zu bezahlen?", karte: "karin_vorlagen", haltung: "gegenstimme", flag: "karin_gefragt",
        antwort: [
          { sprecher: "karin", text: "Ich würde gern fair bezahlen. Wirklich. Aber wie vergleiche ich Lagerlogistik mit Buchhaltung – ohne teuren Beratungsvertrag?" },
          { sprecher: "karin", text: "Wir haben {wert:karin_beschaeftigte} Leute und eine halbe Personalstelle. Wir brauchen Vorlagen und genug Zeit.", geste: "auf_papier_zeigen" }
        ] },
      { id: "nadia_pflege", an: "nadia", frage: "Warum wird Pflege schlechter bewertet?", karte: "nadia_pflege", haltung: "betroffen",
        antwort: [
          { sprecher: "nadia", text: "Pflege ist körperlich schwer und emotional noch schwerer. Wir tragen Verantwortung für Menschenleben.", geste: "hand_heben" },
          { sprecher: "nadia", text: "Trotzdem werden technische Berufe mit ähnlicher Verantwortung oft höher eingestuft. Es kommt darauf an, welche Kriterien man ansetzt." }
        ] },
      { id: "mateusz_haelfte", an: "mateusz", frage: "Was würde Ihnen wirklich helfen?", karte: "mateusz_haelfte", haltung: "anders",
        antwort: [
          { sprecher: "mateusz", text: "Ich arbeite Teilzeit, weil unsere Kita früh schließt. Seitdem bin ich bei Beförderungen einfach nicht mehr dabei." },
          { sprecher: "mateusz", text: "Mehr Transparenz finde ich gut. Aber am meisten würde mir eine Kita helfen, die länger offen hat.", geste: "hand_heben" }
        ] }
    ],
    feedbackEinseitig: { sprecher: "mira", text: "Du hast heute vor allem Leute gehört, die dir zustimmen. Die anderen sind nicht weg, nur weil du nicht gefragt hast." },
    feedbackGut: { sprecher: "mira", text: "Gute Mischung. Du hast auch die gehört, die bremsen. Das hilft dir in den Fluren.", geste: "nicken" }
  },

  /* ---------------- Kapitel 3 – Der Entwurf ---------------- */
  entwurf: {
    start: { sprecher: "mira", text: "Jetzt schreibst du den Entwurf. Sieben Artikel, du hast Zeit. Erst mit „Entwurf einreichen“ gilt deine Fassung.", geste: "auf_papier_zeigen" },
    hanna: { sprecher: "hanna", text: "Hanna Lindqvist vom Juristischen Dienst. Ich lese mit und achte darauf, dass der Text auch vor Gericht hält." },
    wunsch: { sprecher: "hanna", text: "Nicht jede gute Idee gehört in jedes Gesetz. Das hier wäre ein anderes Instrument." },
    eingereicht: { sprecher: "mira", text: "Eingereicht. Ab jetzt änderst du nur noch über Verhandlungen oder im Trilog.", geste: "nicken" }
  },

  /* ---------------- Kapitel 4 – Die Flure ---------------- */
  flure: {
    start: { sprecher: "mira", text: "Du hast {wert:termine_flure} Termine bis Donnerstagmittag. Jedes Gespräch kostet einen, die Bibliothek auch. Die Cafeteria kostet keinen.", geste: "hand_heben" },
    keineTermine: { sprecher: "mira", text: "Das war der letzte Termin. Jetzt geht es in den Ausschuss." },
    extraTermine: { sprecher: "mira", text: "Du hast noch {wert:extra_termine} Termine." },
    bibliothek: "Die Bibliothek hat drei Belege für dich vorbereitet. Du kannst einen mitnehmen.",
    cafeteria: "In der Cafeteria hört man im Vorbeigehen:",
    geruechte: [
      "„Novák soll lange mit seiner Delegation telefoniert haben. Es ging um Fristen.“",
      "„Kowalska sagt jedem: Ohne Sozialpartner keine Stimmen der Volksmitte.“",
      "„Bei de Wit zählt nur, was man belegen kann. Gefühle ziehen da nicht.“",
      "„Byrne hat Pflegekräfte eingeladen. Sie will über Bewertung reden, nicht über Berichte.“",
      "„Andreou hört vor allem auf Geschichten aus dem Alltag.“",
      "„Bianchi will, dass Verbände klagen dürfen. Das sagt er jedem.“"
    ],
    aktionen: { karte: "Karte vorlegen", zugestaendnis: "Zugeständnis anbieten", versprechen: "Versprechen geben", danke: "Danke, ich denke darüber nach" },
    reaktion: {
      ueberzeugt: "Das ist ein Argument, das ich mitnehmen kann.",
      teilweise: "Das ist ein Punkt. Ganz überzeugt bin ich noch nicht.",
      zeigen: "Das glaube ich Ihnen. Aber können Sie es auch zeigen?",
      nichtThema: "Stimmt. Aber mein Problem ist ein anderes.",
      schonGehoert: "Das haben Sie mir schon gesagt.",
      zugestaendnis: "Damit kann ich arbeiten. Danke.",
      versprechen: "Gut. Ich verlasse mich darauf.",
      danke: "In Ordnung. Meine Tür bleibt offen.",
      zufrieden: "Mit diesem Entwurf kann ich leben. Sie müssen mich heute nicht überzeugen."
    },
    versprechenText: { frist_lang: "Ich setze mich im Trilog für eine lange Umsetzungsfrist ein." },
    personen: {
      BFW: {
        begruessung: "Pieter de Wit. Ich habe früher eine Software-Firma geführt. Mich interessiert, was Ihr Entwurf für kleine Betriebe bedeutet.",
        stark: "Jede Stunde, die eine Zehn-Personen-Firma mit Formularen verbringt, fehlt für die Arbeit, die die Gehälter überhaupt bezahlt.",
        wunder: "Beim Verkauf meiner Firma habe ich gemerkt, dass eine Entwicklerin weniger verdient hat als ihre Kollegen. Niemand hatte nachgesehen, ich auch nicht.",
        anliegen: {
          bericht: "Ihr Artikel fünf trifft auch Betriebe ohne Personalabteilung. Wer soll das dort ausrechnen?",
          bewertung: "Gleichwertige Arbeit vergleichen, gut. Aber womit? Kleine Firmen brauchen Werkzeuge, nicht nur Pflichten.",
          vorher: "Eine feste Spanne in jeder Anzeige nimmt kleinen Firmen die Luft zum Verhandeln."
        } },
      EVM: {
        begruessung: "Maria Kowalska. Bevor ich ins Parlament kam, war ich Bürgermeisterin einer Kleinstadt.",
        stark: "Gute Regeln entstehen da, wo man die Menschen kennt: in der Region und im Tarifvertrag, nicht nur in Brüssel.",
        wunder: "Meine Tochter arbeitet als Pflegekraft im Ausland. Sie verdient dort mehr für dieselbe Arbeit.",
        anliegen: {
          folgen: "Wenn eine Lücke gefunden wird, sollen Betrieb und Beschäftigte gemeinsam prüfen. Die Sozialpartner kennen ihre Betriebe.",
          bericht: "Ein Bericht für jeden Handwerksbetrieb? Staffeln Sie das. Und geben Sie den Betrieben Zeit.",
          bewertung: "Familienbetriebe brauchen Hilfe bei der Bewertung. Sonst bleibt es Papier."
        } },
      ASG: {
        begruessung: "Luca Bianchi, wir kennen uns schon. Danke, dass Sie gekommen sind.",
        stark: "Wer nicht weiß, was die anderen verdienen, kann nicht einmal fragen, ob es fair ist.",
        wunder: "Ich unterschätze manchmal, was Kleinbetriebe leisten. Pieter erinnert mich daran.",
        anliegen: {
          auskunft: "Ein Recht, von dem niemand weiß, nützt niemandem. Die Beschäftigten müssen jedes Jahr davon erfahren.",
          bericht: "Die meisten Menschen arbeiten in kleineren Betrieben. Für die ändert Ihr Entwurf so nichts.",
          durchsetzung: "Wer klagt schon allein gegen den eigenen Betrieb? Lassen Sie Verbände und Gleichstellungsstellen helfen."
        } },
      GZL: {
        begruessung: "Aoife Byrne. Schön, dass Sie da sind.",
        stark: "Warum ist es eigentlich mehr wert, Maschinen zu reparieren als Menschen zu pflegen?",
        wunder: "Ich weiß, ich will manchmal mehr in ein Gesetz packen, als hineinpasst.",
        anliegen: {
          bewertung: "Wenn jeder Betrieb selbst festlegt, was gleichwertig ist, bleibt Pflege unten. Wir brauchen gemeinsame Kriterien.",
          auskunft: "Viele erfahren nie von ihren Rechten, Frauen mit Migrationsgeschichte besonders oft. Ein jährlicher Hinweis würde helfen.",
          folgen: "Wenn eine Lücke gefunden wird, muss daraus auch etwas folgen."
        } },
      BSN: {
        begruessung: "Jaroslav Novák. Ich habe Ihren Entwurf in unserer Sprachfassung gelesen.",
        stark: "Wenn die Menschen zu Hause ein Gesetz nicht verstehen, lehnen sie es ab. Dann hilft es niemandem.",
        wunder: "Ich bin nicht gegen gleichen Lohn. Meine Partei zu Hause ist sich da selbst nicht einig.",
        anliegen: {
          durchsetzung: "Sanktionen sind Sache der Mitgliedstaaten. Lassen Sie jedem Land die Höhe.",
          bewertung: "Ein Raster für alle Berufe in ganz Europa? Unsere Tarifverträge kennen ihre Berufe besser.",
          bericht: "Ein Bericht für jeden kleinen Betrieb? Das schadet den Betrieben zu Hause. Fangen Sie bei den großen an."
        } },
      FU: {
        begruessung: "Sofia Andreou, fraktionslos. Ich war lange Krankenschwester.",
        stark: "Ich frage immer: Was ändert sich am Montagmorgen für die Kollegin im Schichtdienst?",
        wunder: "Ich entscheide jede Frage einzeln, ohne Fraktion im Rücken.",
        anliegen: {
          vorher: "Wer sich bewirbt, muss vorher wissen, worüber verhandelt wird. Sonst verhandelt man blind.",
          auskunft: "Schweigeklauseln im Vertrag: Die Kollegin im Schichtdienst darf nicht mal fragen. Das muss weg.",
          durchsetzung: "Allein gegen den Arbeitgeber klagen? Das macht im Krankenhaus niemand."
        } }
    }
  },

  /* ---------------- Kapitel 5 – Die Ausschussabstimmung ---------------- */
  ausschuss: {
    start: { sprecher: "mira", text: "Gleich wird abgestimmt. Ab jetzt kannst du nur noch zuschauen." },
    erfolg: { sprecher: "mira", text: "Mehrheit im Ausschuss. Heute Nacht verhandelst du mit Rat und Kommission.", geste: "hand_heben" },
    ohne: { sprecher: "mira", text: "Keine Mehrheit. Knapp dagegen waren {fraktionA} und {fraktionB}. Du bekommst noch einige Termine in den Fluren.", geste: "arme_verschraenken" },
    kompromiss: { sprecher: "tiago", text: "Die Kommission legt einen Kompromisstext vor. Damit geht es weiter, aber es ist nicht mehr ganz Ihr Text." }
  },

  /* Presse: Clara Vogt nach jeder Abstimmung */
  presse: {
    ausschuss: { sprecher: "clara", text: "Clara Vogt, Tageblatt. Was sagen Sie Betrieben, die jetzt mehr Bürokratie fürchten?",
      antworten: [
        { text: "Fair bezahlen ist keine Bürokratie. Es ist die Regel.", haltung: "mutig" },
        { text: "Wir haben auf Machbarkeit geachtet. Es soll funktionieren.", haltung: "pragmatisch" },
        { text: "Wir hören weiter zu. Im Trilog kann sich noch einiges ändern.", haltung: "vorsichtig" }
      ] },
    plenum: { sprecher: "clara", text: "Eine letzte Frage: Was ändert sich jetzt für Menschen wie Inès?",
      antworten: [
        { text: "Sie darf fragen. Und sie bekommt eine Antwort.", haltung: "mutig" },
        { text: "Einiges. Aber nicht alles, was nötig wäre.", haltung: "pragmatisch" },
        { text: "Das hängt jetzt davon ab, wie die Länder es umsetzen.", haltung: "vorsichtig" }
      ] }
  },

  /* ---------------- Kapitel 6 – Der Trilog ---------------- */
  trilog: {
    start: [
      { sprecher: "marinescu", text: "Elena Marinescu, Ratspräsidentschaft. Ich spreche für die Regierungen der Mitgliedstaaten.", geste: "auf_papier_zeigen" },
      { sprecher: "marinescu", text: "Es sind {fakt:eu_mitgliedstaaten} Länder mit sehr verschiedenen Arbeitsmärkten. Was in einem Land einfach ist, ist im anderen viel Arbeit." },
      { sprecher: "tiago", text: "Tiago Esteves, Kommission. Ich vermittle zwischen Ihnen und vertrete unseren Vorschlag.", geste: "nicken" },
      { sprecher: "tiago", text: "Ein Recht, das niemand nachprüfen kann, hilft in der Praxis wenig.", geste: "hand_heben" }
    ],
    erklaerung: "Vier Spalten: Vorschlag der Kommission, Parlament (dein Entwurf), Rat, Kompromiss. Wo Parlament und Rat verschieden sind, entscheidest du.",
    mandat: { sprecher: "marinescu", text: "Dafür habe ich kein Mandat. Welche Punkte sind Ihnen am wichtigsten?", geste: "arme_verschraenken" },
    wunsch: { sprecher: "marinescu", text: "Kita-Garantie und Elternzeit sind wichtige Themen, aber sie gehören in ein anderes Gesetz. Das streichen wir." },
    karin: { sprecher: "marinescu", text: "Vorlagen und Fristen für die Betriebe? Das kann ich den Hauptstädten erklären. Da gebe ich etwas mehr nach." },
    bruecke: { sprecher: "tiago", text: "Darf ich einen Vorschlag machen? Ich hätte einen Text, mit dem beide Seiten leben können." },
    dolmetscher: { sprecher: "dolmetscher", text: "Entschuldigung, aus der Kabine: „gleichwertig“ heißt in einer Sprachfassung „gleich viel wert“, in einer anderen „ähnlich“. Das ist nicht dasselbe." },
    dolmetscherDanke: { sprecher: "hanna", text: "Danke, das ist geändert. Alle {fakt:amtssprachen} Sprachfassungen sind gleich verbindlich, deshalb müssen sie dasselbe bedeuten." },
    uhr: ["Zwei Uhr nachts.", "Drei Uhr nachts.", "Vier Uhr nachts."],
    frist: { sprecher: "marinescu", text: "Und die Umsetzungsfrist. Die Länder brauchen Zeit, um das in eigenes Recht zu übertragen." },
    rechtZuSchwach: { sprecher: "hanna", text: "So formuliert landet das vor Gericht und verliert. Ändern Sie mindestens einen der markierten Punkte." },
    versprechenGehalten: { sprecher: "mira", text: "Du hast dein Versprechen gehalten. Das wird dir angerechnet." },
    versprechenGebrochen: { sprecher: "mira", text: "Ein Versprechen aus den Fluren hast du nicht gehalten. Das Vertrauen dieser Fraktion sinkt.", geste: "arme_verschraenken" },
    ende: { sprecher: "tiago", text: "Wir haben einen Kompromiss. Danke an alle.", geste: "nicken" }
  },

  /* ---------------- Kapitel 7 – Das Plenum ---------------- */
  plenum: {
    start: { sprecher: "mira", text: "Straßburg. Du hältst eine kurze Rede mit Einstieg, Kern und Schluss." },
    einstieg: [
      { id: "zettel", kurz: "Inès' Zettel", text: "Auf meinem Schreibtisch lag ein Zettel. Eine Auszubildende fragt: Wie soll ich überhaupt herausfinden, ob ich fair bezahlt werde?", wirkt: { GZL: 0.6, ASG: 0.6, FU: 0.8 } },
      { id: "beleg", kurz: "Ein Beleg", text: "In der Europäischen Union liegt die Lohnlücke zwischen Frauen und Männern bei {fakt:gpg_eu} pro Stunde.", wirkt: { BFW: 0.6, EVM: 0.6, GZL: 0.3 } },
      { id: "einwand", kurz: "Ein Einwand, ernst genommen", text: "Viele Betriebe sagen: Wir wollen fair bezahlen, aber wir brauchen Hilfe. Das stimmt, deshalb hilft dieses Gesetz auch ihnen.", wirkt: { BFW: 0.6, EVM: 0.8, BSN: 0.6 } }
    ],
    kern: "Im Kern steht {artikel}: {kurzfassung}",
    schluss: [
      { id: "kollegin", kurz: "Für die Kollegin", text: "Stimmen Sie für die Kollegin, die heute nicht einmal fragen darf.", wirkt: { ASG: 0.8, FU: 0.6, GZL: 0.4 } },
      { id: "europa", kurz: "Für Europa", text: "Stimmen Sie für ein Europa, das seine eigenen Grundsätze ernst nimmt.", wirkt: { GZL: 0.6, EVM: 0.6, BSN: -0.3 } },
      { id: "vertrauen", kurz: "Für Vertrauen", text: "Stimmen Sie für ein Gesetz, das Betriebe nicht überfordert und Beschäftigten Vertrauen gibt.", wirkt: { BFW: 0.6, EVM: 0.6, BSN: 0.4 } }
    ],
    saaldiener: { sprecher: "saaldiener", text: "Ruhe bitte." },
    abstimmung: "Die Abstimmung ist eröffnet.",
    angenommen: { sprecher: "mira", text: "Angenommen. Dein Gesetz hat eine Mehrheit gefunden.", geste: "hand_heben" },
    abgelehnt: { sprecher: "mira", text: "Abgelehnt. Gefehlt haben vor allem {fraktionA} und {fraktionB}. Du kannst einen neuen Anlauf nehmen.", geste: "arme_verschraenken" },
    neuerAnlauf: "Neuer Anlauf: zurück in den Trilog, mit einer neuen Position des Rates."
  },

  /* ---------------- Abendnotizen von Mira ---------------- */
  abende: [
    { notiz: "Erster Tag. Du hast den Stapel gesehen und Inès' Zettel gelesen. Morgen früh: die Anhörung.",
      frage: "Was ist dir bei diesem Gesetz am wichtigsten?",
      antworten: [
        { text: "Dass sich etwas ändern muss. Auch wenn es unbequem wird.", haltung: "mutig" },
        { text: "Dass wir etwas schaffen, das auch durchkommt.", haltung: "pragmatisch" },
        { text: "Dass wir niemanden überfordern.", haltung: "vorsichtig" }
      ] },
    { notiz: "Dein Entwurf ist eingereicht. Morgen beginnen die Verhandlungen mit den Fraktionen.",
      frage: "Was ist dir wichtiger: ein starkes Gesetz oder eine breite Mehrheit?",
      antworten: [
        { text: "Ein starkes Gesetz. Sonst lohnt sich der ganze Aufwand nicht.", haltung: "mutig" },
        { text: "Beides geht nur mit Kompromissen. Ich suche die Mitte.", haltung: "pragmatisch" },
        { text: "Eine breite Mehrheit. Ein Gesetz muss getragen werden.", haltung: "vorsichtig" }
      ] },
    { notiz: "Der Ausschuss ist entschieden. Heute Nacht: Trilog mit Rat und Kommission.",
      frage: "Wenn du nachgeben musst: wo zuerst?",
      antworten: [
        { text: "Nirgends gern. Ich kämpfe um jeden Artikel.", haltung: "mutig" },
        { text: "Bei den Fristen. Beim Kern nicht.", haltung: "pragmatisch" },
        { text: "Da, wo die Länder wirklich verschieden sind.", haltung: "vorsichtig" }
      ] }
  ]
};
