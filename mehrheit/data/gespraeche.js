/* =====================================================================
   data/gespraeche.js – alle Gespräche und Sätze (Abschnitt 4 und 5.5)
   ---------------------------------------------------------------------
   Ein Satz ist { sprecher, text, geste }.
     sprecher: Figur aus data/figuren.js
     geste:    hand_heben, auf_papier_zeigen, arme_verschraenken, nicken (optional)
   Platzhalter: {name}, {fakt:id}, {jahr:id}, {quelle:id}, {wert:id}.
   Mira duzt die Spielfigur, alle anderen siezen. Keine Pronomen für die Spielfigur.
   Jede Figur hat genau einen trockenen Humor-Satz pro Auftritt.
   ===================================================================== */
var DATA = window.DATA || {};

/* Gesprächsnetze (werden im Debug-Modus auf Erreichbarkeit geprüft) */
DATA.gespraeche = {
  /* Beispiel aus Phase 1, bleibt als Probe im Büro erhalten */
  probe_luca: {
    ort: "buero", teilnehmer: ["mira", "luca"], start: "k1",
    knoten: {
      k1: { sprecher: "mira", text: "Besuch für dich, {name}. Luca Bianchi, Allianz für Soziale Gerechtigkeit. Er hat den Stapel schon gelesen. Natürlich.", geste: "nicken", weiter: "k2" },
      k2: { sprecher: "luca", text: "Guten Morgen, {name}. Ich mache es kurz: Wer nicht weiß, was die anderen verdienen, kann nicht einmal fragen, ob es fair ist.", geste: "hand_heben",
            antworten: [{ text: "Was genau wollen Sie im Gesetz sehen?", ziel: "k3" }, { text: "Und was sagen die kleinen Betriebe dazu?", ziel: "k4" }] },
      k3: { sprecher: "luca", text: "Ein Auskunftsrecht, das man wirklich nutzen kann. Für alle Beschäftigten – nicht nur in großen Firmen.", geste: "auf_papier_zeigen", weiter: "k5" },
      k4: { sprecher: "luca", text: "Ich war Gewerkschaftssekretär in einer Fabrik. Ich weiß, was ein Formular kostet. Aber Schweigen kostet auch etwas.", geste: "arme_verschraenken", weiter: "k5" },
      k5: { sprecher: "mira", text: "Pieter de Wit wird dir heute noch erklären, was das für eine Firma mit zehn Leuten bedeutet. Beide haben einen Punkt.", geste: "arme_verschraenken", weiter: "k6" },
      k6: { sprecher: "luca", text: "Und bevor Sie fragen: Nein, den Espressoautomaten im dritten Stock habe ich nicht kaputt gemacht. Diesmal nicht.", geste: "nicken",
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
      { sprecher: "mira", text: "Und: Es gibt keine richtige Lösung. Nur gut begründete. Der Kaffee hier ist übrigens auch keine Lösung, aber er hilft.", geste: "arme_verschraenken" }
    ],
    zettel: { sprecher: "mira", text: "Das lag heute Morgen auf deinem Schreibtisch. Von Inès, einer Auszubildenden aus Lyon. Ihre Berufsschule war gestern hier." },
    probe: { sprecher: "mira", text: "Probier es aus: Wähle für Artikel 1 eine Begründung und schau auf das Glasmodell." },
    probeDanach: { sprecher: "mira", text: "Siehst du? Jedes Wort hat Freund*innen und Feind*innen. Das war nur eine Probe – ich setze es zurück.", geste: "nicken" }
  },

  /* ---------------- Kapitel 2 – Die Anhörung ---------------- */
  anhoerung: {
    einfuehrung: [
      { sprecher: "weiss", text: "Guten Morgen. Vorweg: Der Gender Pay Gap vergleicht durchschnittliche {g:bruttostundenlohn} – nicht Monatsgehälter.", geste: "hand_heben" },
      { sprecher: "weiss", text: "Teilzeit wirkt deshalb nicht über weniger Stunden. Sie wirkt über schlechtere Stundenlöhne, seltenere Beförderungen und flachere Gehaltsentwicklung." },
      { sprecher: "weiss", text: "In Deutschland liegt die Lücke {g:unbereinigt} bei {fakt:gpg_de_destatis}. Rechnet man Beruf, Branche oder Arbeitszeit heraus, bleiben {g:bereinigt} {fakt:gpg_de_bereinigt}.", geste: "auf_papier_zeigen" },
      { sprecher: "weiss", text: "Dieser Rest heißt unerklärter Teil. Er ist kein Beweis für Diskriminierung – aber ein ernster Hinweis." },
      { sprecher: "weiss", text: "Umgekehrt kann auch der erklärte Teil ungerecht sein: wenn Berufe mit vielen Frauen grundsätzlich schlechter bezahlt werden." },
      { sprecher: "weiss", text: "Und bitte keine Wunder vom Durchschnitt: Mit einem Fuß im Eis und dem anderen im Feuer geht es mir im Durchschnitt prima.", geste: "nicken" }
    ],
    mira: { sprecher: "mira", text: "Du hast {wert:fragenkarten_anhoerung} Fragekarten, aber nur Zeit für {wert:fragen_anhoerung} Fragen. Wen fragst du?" },
    fragen: [
      { id: "ines_vertrag", an: "ines", frage: "Woran merken Sie, dass Sie weniger verdienen könnten?", karte: "ines_vertrag", haltung: "betroffen",
        antwort: [
          { sprecher: "ines", text: "Ich hab vorher geübt. Vor meinem Spiegel. Der war einverstanden.", geste: "nicken" },
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
          { sprecher: "karin", text: "Wir haben {wert:karin_beschaeftigte} Leute und eine halbe Personalstelle. Wir brauchen Vorlagen. Und Zeit.", geste: "auf_papier_zeigen" },
          { sprecher: "karin", text: "Unsere Lohnsoftware macht gerade ein Update. Seit dem Frühjahr.", geste: "arme_verschraenken" }
        ] },
      { id: "nadia_pflege", an: "nadia", frage: "Warum wird Pflege schlechter bewertet?", karte: "nadia_pflege", haltung: "betroffen",
        antwort: [
          { sprecher: "nadia", text: "Pflege ist körperlich schwer und emotional noch schwerer. Wir tragen Verantwortung für Menschenleben.", geste: "hand_heben" },
          { sprecher: "nadia", text: "Trotzdem werden technische Berufe mit ähnlicher Verantwortung oft höher eingestuft. Es kommt darauf an, welche Kriterien man ansetzt." },
          { sprecher: "nadia", text: "Unser Schichtplan ist übrigens das einzige Dokument, das sich jeden Tag selbst widerspricht.", geste: "nicken" }
        ] },
      { id: "mateusz_haelfte", an: "mateusz", frage: "Was würde Ihnen wirklich helfen?", karte: "mateusz_haelfte", haltung: "anders",
        antwort: [
          { sprecher: "mateusz", text: "Ich arbeite Teilzeit, weil unsere Kita früh schließt. Seitdem bin ich bei Beförderungen einfach nicht mehr dabei." },
          { sprecher: "mateusz", text: "Gut, dass ihr das macht. Aber mein Problem löst ihr damit nur zur Hälfte.", geste: "hand_heben" },
          { sprecher: "mateusz", text: "Ich habe seit Wochen dasselbe Kinderlied im Kopf. Es hat nur zwei Zeilen.", geste: "nicken" }
        ] }
    ],
    feedbackEinseitig: { sprecher: "mira", text: "Du hast heute vor allem Leute gehört, die dir zustimmen. Die anderen sind nicht weg, nur weil du nicht gefragt hast." },
    feedbackGut: { sprecher: "mira", text: "Gute Mischung. Du hast auch die gehört, die bremsen. Das hilft dir in den Fluren.", geste: "nicken" }
  },

  /* ---------------- Kapitel 3 – Der Entwurf ---------------- */
  entwurf: {
    start: { sprecher: "mira", text: "Jetzt wird geschrieben. Sieben Artikel, kein Zeitdruck. Erst mit „Entwurf einreichen“ ist es dein Stand.", geste: "auf_papier_zeigen" },
    hanna: { sprecher: "hanna", text: "Hanna Lindqvist, Juristischer Dienst. Ich lese mit. Ein Komma an der falschen Stelle hat schon mehr Gesetze gekippt als jede Opposition." },
    wunsch: { sprecher: "hanna", text: "Nicht jede gute Idee gehört in jedes Gesetz. Das hier wäre ein anderes Instrument." },
    eingereicht: { sprecher: "mira", text: "Eingereicht. Ab jetzt änderst du nur noch über Verhandlungen oder im Trilog.", geste: "nicken" }
  },

  /* ---------------- Kapitel 4 – Die Flure ---------------- */
  flure: {
    start: { sprecher: "mira", text: "Du hast {wert:termine_flure} Termine bis Donnerstagmittag. Jedes Gespräch kostet einen. Die Bibliothek auch. Die Cafeteria ist gratis.", geste: "hand_heben" },
    keineTermine: { sprecher: "mira", text: "Das war der letzte Termin. Ab in den Ausschuss." },
    extraTermine: { sprecher: "mira", text: "Du hast noch {wert:extra_termine} Termine. Nutze sie gut." },
    bibliothek: "Die Bibliothek hat drei Belege für dich vorbereitet. Du kannst einen mitnehmen.",
    cafeteria: "In der Cafeteria hört man im Vorbeigehen:",
    geruechte: [
      "„Novák soll lange mit seiner Delegation telefoniert haben. Es ging um Fristen.“",
      "„Kowalska sagt jedem: Ohne Sozialpartner keine Stimmen der Volksmitte.“",
      "„Bei de Wit zählt nur, was man belegen kann. Gefühle ziehen da nicht.“",
      "„Byrne hat Pflegekräfte eingeladen. Sie will über Bewertung reden, nicht über Berichte.“",
      "„Andreou hört vor allem auf Geschichten aus dem Alltag.“",
      "„Bianchi will, dass Verbände klagen dürfen. Er sagt das jedem. Auch dem Automaten.“"
    ],
    aktionen: { karte: "Karte vorlegen", zugestaendnis: "Zugeständnis anbieten", versprechen: "Versprechen geben", danke: "Danke, ich denke darüber nach" },
    reaktion: {
      ueberzeugt: "Das ist ein Argument, das ich mitnehmen kann.",
      teilweise: "Ein Punkt. Noch nicht ganz meiner, aber ein Punkt.",
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
        begruessung: "Pieter de Wit. Früher habe ich eine Software-Firma gegründet, heute zähle ich Formulare. Ich habe eine Tabelle, die mir sagt, wie viele Tabellen ich habe.",
        stark: "Jede Stunde, die eine Zehn-Personen-Firma mit Formularen verbringt, fehlt für die Arbeit, die die Gehälter überhaupt bezahlt.",
        wunder: "Ehrlich gesagt: Beim Verkauf meiner Firma habe ich gemerkt, dass eine Entwicklerin weniger verdiente. Niemand hatte nachgesehen. Ich auch nicht.",
        anliegen: {
          bericht: "Ihr Artikel fünf trifft auch Betriebe ohne Personalabteilung. Wer soll das ausrechnen – die Chefin am Wochenende?",
          bewertung: "Gleichwertige Arbeit vergleichen – schön. Aber womit? Kleine Firmen brauchen Werkzeuge, nicht nur Pflichten.",
          vorher: "Eine feste Spanne in jeder Anzeige nimmt kleinen Firmen die Luft zum Verhandeln."
        } },
      EVM: {
        begruessung: "Maria Kowalska. Ich war Bürgermeisterin einer Kleinstadt. Dort dauerten die Sitzungen länger als die Dorffeste.",
        stark: "Gute Regeln entstehen da, wo man die Menschen kennt – in der Region, im Tarifvertrag. Nicht nur in Brüssel.",
        wunder: "Meine Tochter arbeitet als Pflegekraft im Ausland. Sie verdient dort mehr – für dieselbe Arbeit.",
        anliegen: {
          folgen: "Wenn eine Lücke gefunden wird, sollen Betrieb und Beschäftigte gemeinsam prüfen. Die Sozialpartner kennen ihre Betriebe.",
          bericht: "Ein Bericht für jeden Handwerksbetrieb? Staffeln Sie das. Und geben Sie den Betrieben Zeit.",
          bewertung: "Familienbetriebe brauchen Hilfe bei der Bewertung. Sonst bleibt es Papier."
        } },
      ASG: {
        begruessung: "Luca Bianchi, wieder. Der Espressoautomat im dritten Stock funktioniert übrigens. Fragen Sie nicht, warum.",
        stark: "Wer nicht weiß, was die anderen verdienen, kann nicht einmal fragen, ob es fair ist.",
        wunder: "Ich unterschätze manchmal, was Kleinbetriebe leisten. Pieter erinnert mich daran. Oft.",
        anliegen: {
          auskunft: "Ein Recht, von dem niemand weiß, nützt niemandem. Die Beschäftigten müssen jedes Jahr davon erfahren.",
          bericht: "Die meisten Menschen arbeiten in kleineren Betrieben. Für die ändert Ihr Entwurf so gar nichts.",
          durchsetzung: "Wer klagt schon allein gegen den eigenen Betrieb? Lassen Sie Verbände und Gleichstellungsstellen helfen."
        } },
      GZL: {
        begruessung: "Aoife Byrne. Ich bin mit dem Rad gekommen. Im Regen. Wie immer.",
        stark: "Warum ist es eigentlich mehr wert, Maschinen zu reparieren als Menschen zu pflegen?",
        wunder: "Ich weiß, ich will manchmal mehr in ein Gesetz packen, als es tragen kann.",
        anliegen: {
          bewertung: "Wenn jeder Betrieb selbst festlegt, was gleichwertig ist, bleibt Pflege unten. Wir brauchen gemeinsame Kriterien.",
          auskunft: "Viele erfahren nie von ihren Rechten – Frauen mit Migrationsgeschichte besonders oft. Ein jährlicher Hinweis würde helfen.",
          folgen: "Eine Lücke, aus der nichts folgt, ist nur eine Statistik."
        } },
      BSN: {
        begruessung: "Jaroslav Novák. Die letzte Übersetzung Ihres Entwurfs machte aus der Beweislast einen Beweislastwagen. Wir haben gelacht. Kurz.",
        stark: "Ein Gesetz, das zu Hause niemand versteht, macht die Menschen nicht gleicher, sondern wütender.",
        wunder: "Ich bin nicht gegen gleichen Lohn. Und meine Partei zu Hause ist sich da selbst nicht einig.",
        anliegen: {
          durchsetzung: "Sanktionen sind Sache der Mitgliedstaaten. Lassen Sie jedem Land die Höhe.",
          bewertung: "Ein Raster für alle Berufe in ganz Europa? Unsere Tarifverträge kennen ihre Berufe besser.",
          bericht: "Öffentliche Pranger schaden kleinen Betrieben zu Hause. Der Bericht gehört zur Behörde."
        } },
      FU: {
        begruessung: "Sofia Andreou, unabhängig. Ich war Krankenschwester. Nachtschichten im Parlament sind ruhiger. Meistens.",
        stark: "Ich frage immer: Was ändert sich am Montagmorgen für die Kollegin im Schichtdienst?",
        wunder: "Ich entscheide jede Frage einzeln. Das macht mich unberechenbar. Und ehrlich.",
        anliegen: {
          vorher: "Wer sich bewirbt, muss vorher wissen, worüber verhandelt wird. Sonst verhandelt man blind.",
          auskunft: "Schweigeklauseln im Vertrag – die Kollegin im Schichtdienst darf nicht mal fragen. Das muss weg.",
          durchsetzung: "Allein gegen den Arbeitgeber klagen? Das macht im Krankenhaus niemand."
        } }
    }
  },

  /* ---------------- Kapitel 5 – Die Ausschussabstimmung ---------------- */
  ausschuss: {
    start: { sprecher: "mira", text: "Gleich wird abgestimmt. Ab jetzt kannst du nur noch zuschauen." },
    erfolg: { sprecher: "mira", text: "Mehrheit! Atme kurz durch. Heute Nacht kommt der Trilog.", geste: "hand_heben" },
    ohne: { sprecher: "mira", text: "Keine Mehrheit. Knapp dagegen waren {fraktionA} und {fraktionB}. Du bekommst Extra-Termine – zurück in die Flure.", geste: "arme_verschraenken" },
    kompromiss: { sprecher: "tiago", text: "Die Kommission legt einen Kompromisstext vor. Er geht weiter – aber er ist nicht mehr ganz Ihrer." }
  },

  /* Presse: Clara Vogt nach jeder Abstimmung */
  presse: {
    ausschuss: { sprecher: "clara", text: "Clara Vogt, Tageblatt. Ich frage schnell, mein Akku ist bei Rot. Was sagen Sie Betrieben, die jetzt Bürokratie fürchten?",
      antworten: [
        { text: "Fair bezahlen ist keine Bürokratie. Es ist die Regel.", haltung: "mutig" },
        { text: "Wir haben auf Machbarkeit geachtet. Es soll funktionieren.", haltung: "pragmatisch" },
        { text: "Wir hören weiter zu. Im Trilog kann sich noch einiges ändern.", haltung: "vorsichtig" }
      ] },
    plenum: { sprecher: "clara", text: "Noch eine Frage, versprochen die letzte: Was ändert sich jetzt für Menschen wie Inès?",
      antworten: [
        { text: "Sie darf fragen. Und sie bekommt eine Antwort.", haltung: "mutig" },
        { text: "Mehr als vorher. Nicht alles, was nötig wäre.", haltung: "pragmatisch" },
        { text: "Das hängt jetzt davon ab, wie die Länder es umsetzen.", haltung: "vorsichtig" }
      ] }
  },

  /* ---------------- Kapitel 6 – Der Trilog ---------------- */
  trilog: {
    start: [
      { sprecher: "marinescu", text: "Elena Marinescu, Ratspräsidentschaft. Ich habe eine Liste. Natürlich habe ich eine Liste.", geste: "auf_papier_zeigen" },
      { sprecher: "marinescu", text: "{fakt:eu_mitgliedstaaten} Länder, {fakt:eu_mitgliedstaaten} Arbeitsmärkte. Was in einem Land einfach ist, ist im anderen ein Umbau." },
      { sprecher: "tiago", text: "Tiago Esteves, Kommission. Ich vermittle. Und ich verteidige unseren Vorschlag – mit allen Fußnoten.", geste: "nicken" },
      { sprecher: "tiago", text: "Ein Recht, das niemand nachprüfen kann, ist ein Recht auf dem Papier.", geste: "hand_heben" }
    ],
    erklaerung: "Vier Spalten: Vorschlag der Kommission, Parlament (dein Entwurf), Rat, Kompromiss. Wo Parlament und Rat verschieden sind, entscheidest du.",
    mandat: { sprecher: "marinescu", text: "Dafür habe ich kein Mandat. Welche Punkte sind Ihnen am wichtigsten?", geste: "arme_verschraenken" },
    wunsch: { sprecher: "marinescu", text: "Kita-Garantie, Elternzeit – sympathisch. Aber das ist ein anderes Gesetz. Das streichen wir." },
    karin: { sprecher: "marinescu", text: "Vorlagen und Fristen für die Betriebe? Damit kann ich in meinen Hauptstädten arbeiten. Da gebe ich etwas mehr nach." },
    bruecke: { sprecher: "tiago", text: "Darf ich eine Brücke bauen? Ich hätte einen Text, mit dem beide Seiten leben können." },
    dolmetscher: { sprecher: "dolmetscher", text: "Entschuldigung, aus der Kabine: „gleichwertig“ heißt in einer Sprachfassung „gleich viel wert“, in einer anderen „ähnlich“. Das ist nicht dasselbe." },
    dolmetscherDanke: { sprecher: "hanna", text: "Präzisiert. Alle {fakt:amtssprachen} Sprachfassungen sind gleich verbindlich. Jetzt meinen sie auch dasselbe." },
    uhr: ["Zwei Uhr nachts.", "Drei Uhr. Der Kaffee wird kälter, die Liste nicht kürzer.", "Vier Uhr. Tiago fragt, ob „gleichwertig“ mit oder ohne Bindestrich geschrieben wird. Alle lachen müde."],
    frist: { sprecher: "marinescu", text: "Und die Umsetzungsfrist. Die Länder brauchen Zeit, um das in eigenes Recht zu übertragen." },
    rechtZuSchwach: { sprecher: "hanna", text: "So formuliert landet das vor Gericht und verliert. Ändern Sie mindestens einen der markierten Punkte." },
    versprechenGehalten: { sprecher: "mira", text: "Du hast dein Versprechen gehalten. Das merkt man sich hier." },
    versprechenGebrochen: { sprecher: "mira", text: "Ein Versprechen aus den Fluren hast du nicht gehalten. Das Vertrauen dieser Fraktion sinkt.", geste: "arme_verschraenken" },
    ende: { sprecher: "tiago", text: "Wir haben einen Kompromiss. Draußen wird es hell.", geste: "nicken" }
  },

  /* ---------------- Kapitel 7 – Das Plenum ---------------- */
  plenum: {
    start: { sprecher: "mira", text: "Straßburg. Du hast eine kurze Rede. Drei Teile: Einstieg, Kern, Schluss." },
    einstieg: [
      { id: "zettel", kurz: "Inès' Zettel", text: "Auf meinem Schreibtisch lag ein Zettel. Eine Auszubildende fragt: Wie soll ich überhaupt herausfinden, ob ich fair bezahlt werde?", wirkt: { GZL: 0.6, ASG: 0.6, FU: 0.8 } },
      { id: "beleg", kurz: "Ein Beleg", text: "In der Europäischen Union liegt die Lohnlücke zwischen Frauen und Männern bei {fakt:gpg_eu} pro Stunde.", wirkt: { BFW: 0.6, EVM: 0.6, GZL: 0.3 } },
      { id: "einwand", kurz: "Ein Einwand, ernst genommen", text: "Viele Betriebe sagen: Wir wollen fair bezahlen, aber wir brauchen Hilfe. Sie haben recht – deshalb hilft dieses Gesetz auch ihnen.", wirkt: { BFW: 0.6, EVM: 0.8, BSN: 0.6 } }
    ],
    kern: "Im Kern steht {artikel}: {kurzfassung}",
    schluss: [
      { id: "kollegin", kurz: "Für die Kollegin", text: "Stimmen Sie für die Kollegin, die heute nicht einmal fragen darf.", wirkt: { ASG: 0.8, FU: 0.6, GZL: 0.4 } },
      { id: "europa", kurz: "Für Europa", text: "Stimmen Sie für ein Europa, das seine eigenen Grundsätze ernst nimmt.", wirkt: { GZL: 0.6, EVM: 0.6, BSN: -0.3 } },
      { id: "vertrauen", kurz: "Für Vertrauen", text: "Stimmen Sie für ein Gesetz, das Betriebe nicht überfordert und Beschäftigten Vertrauen gibt.", wirkt: { BFW: 0.6, EVM: 0.6, BSN: 0.4 } }
    ],
    saaldiener: { sprecher: "saaldiener", text: "Ruhe bitte." },
    abstimmung: "Die Abstimmung ist eröffnet.",
    angenommen: { sprecher: "mira", text: "Angenommen. Du hast ein europäisches Gesetz geschrieben. Und eine Mehrheit gefunden.", geste: "hand_heben" },
    abgelehnt: { sprecher: "mira", text: "Abgelehnt. Gefehlt haben vor allem {fraktionA} und {fraktionB}. Kein Weltuntergang – aber ein Grund nachzudenken.", geste: "arme_verschraenken" },
    neuerAnlauf: "Neuer Anlauf: zurück in den Trilog, mit einer neuen Position des Rates."
  },

  /* ---------------- Abendnotizen von Mira ---------------- */
  abende: [
    { notiz: "Erster Tag. Du hast den Stapel gesehen und Inès' Zettel gelesen. Morgen früh: die Anhörung.",
      frage: "Und – wofür würdest du deine Hand ins Feuer legen?",
      antworten: [
        { text: "Dass sich etwas ändern muss. Auch wenn es unbequem wird.", haltung: "mutig" },
        { text: "Dass wir etwas schaffen, das auch durchkommt.", haltung: "pragmatisch" },
        { text: "Dass wir niemanden überfordern.", haltung: "vorsichtig" }
      ] },
    { notiz: "Dein Entwurf ist eingereicht. Morgen beginnen die Verhandlungen. Die Flure sind lang, die Türen schwer.",
      frage: "Was ist dir wichtiger: ein starkes Gesetz oder eine breite Mehrheit?",
      antworten: [
        { text: "Ein starkes Gesetz. Sonst lohnt sich der ganze Aufwand nicht.", haltung: "mutig" },
        { text: "Beides geht nur mit Kompromissen. Ich suche die Mitte.", haltung: "pragmatisch" },
        { text: "Eine breite Mehrheit. Ein Gesetz muss getragen werden.", haltung: "vorsichtig" }
      ] },
    { notiz: "Der Ausschuss ist entschieden. Heute Nacht: Trilog mit Rat und Kommission.",
      frage: "Wenn du nachgeben musst – wo zuerst?",
      antworten: [
        { text: "Nirgends gern. Ich kämpfe um jeden Artikel.", haltung: "mutig" },
        { text: "Bei den Fristen. Beim Kern nicht.", haltung: "pragmatisch" },
        { text: "Da, wo die Länder wirklich verschieden sind.", haltung: "vorsichtig" }
      ] }
  ]
};
