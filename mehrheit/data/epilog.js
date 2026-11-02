/* =====================================================================
   data/epilog.js – „Fünf Jahre später“ (Abschnitt 4.8 und 5.8)
   ---------------------------------------------------------------------
   Bausteine mit Bedingungen. Der erste passende Baustein je Figur wird
   gezeigt (gleiche Fassung = gleicher Epilog). Ohne Bedingung = Rückfall.
   In Bedingungen stehen:
     wissen, durchsetzung, aufwand, recht   Stufen 1 bis 5 der Wirkungsanzeige
     angenommen, kompromiss, wunsch         wahr/falsch
     Stellschrauben-IDs (z. B. schwelle == "gross")
   Der Epilog behauptet keine Zahlen über Wirkungen.
   ===================================================================== */
var DATA = window.DATA || {};

DATA.epilog = {
  hinweis: "Erfundene Geschichten – so könnte es aussehen.",
  titel: "Fünf Jahre später",
  bausteine: [
    /* Inès antwortet auf ihren eigenen Zettel (Postkarte) */
    { figur: "ines", art: "postkarte", bedingung: "!angenommen",
      text: "Das Gesetz kam damals nicht durch. Ich habe trotzdem gefragt – und keine Antwort bekommen. Inzwischen bin ich Gesellin. Ich frage immer noch." },
    { figur: "ines", art: "postkarte", bedingung: "auskunft_umfang == \"nichts\"",
      text: "Ich bin jetzt Gesellin. Gefragt habe ich nie – es gab ja kein Recht darauf. Ich weiß es bis heute nicht." },
    { figur: "ines", art: "postkarte", bedingung: "wissen >= 4 && durchsetzung >= 4",
      text: "Über das Auskunftsrecht habe ich erfahren, dass ich weniger bekam. Mit Hilfe der Gewerkschaft wurde nachgezahlt." },
    { figur: "ines", art: "postkarte", bedingung: "durchsetzung <= 2",
      text: "Ich weiß jetzt, dass ich weniger bekam. Aber allein gegen den Betrieb vorgehen? Das habe ich mich nicht getraut." },
    { figur: "ines", art: "postkarte", bedingung: "schwelle == \"gross\" || schwelle == \"keine\"",
      text: "Mein Betrieb ist zu klein für die Berichtspflicht. Ich durfte fragen, aber die Antwort war vage. Ich weiß es immer noch nicht genau." },
    { figur: "ines", art: "postkarte",
      text: "Ich durfte fragen und habe eine Antwort bekommen. Der Unterschied war kleiner als gedacht – aber er war da. Inzwischen reden wir offen darüber." },

    /* Karin Hofstetter berichtet (Brief) */
    { figur: "karin", art: "brief", bedingung: "!angenommen",
      text: "Ein Gesetz kam nicht. Wir haben trotzdem angefangen, Stellen zu vergleichen. Freiwillig und langsam." },
    { figur: "karin", art: "brief", bedingung: "kriterien == \"neutral\" && aufwand <= 3",
      text: "Es war besser machbar als gedacht. Mit den Vorlagen hat die Bewertung ein paar Wochen gedauert." },
    { figur: "karin", art: "brief", bedingung: "aufwand >= 4",
      text: "Es hat ein Jahr gedauert. Wir haben es geschafft, aber ohne Hilfe war es zu viel für eine halbe Personalstelle." },
    { figur: "karin", art: "brief",
      text: "Es war Arbeit. Aber jetzt wissen wir, wo wir stehen. Zwei Stellen haben wir angepasst." },

    /* Nadia El Amrani (Chatnachricht) */
    { figur: "nadia", art: "chat", bedingung: "angenommen && (kriterien == \"neutral\" || kriterien == \"raster\")",
      text: "Die neuen Kriterien zählen Belastung und Verantwortung. Unsere Station wurde neu eingestuft. Nicht alles ist gut, aber besser." },
    { figur: "nadia", art: "chat",
      text: "Für die Pflege hat sich wenig geändert. Wer bewertet, legt die Kriterien fest – und die sind die alten." },

    /* Mateusz (Chatnachricht) – erinnert an das, was ein Gesetz nicht lösen kann */
    { figur: "mateusz", art: "chat", bedingung: "wunsch",
      text: "Ihr habt die Kita-Garantie damals versucht. Sie gehörte in ein anderes Gesetz, aber immerhin wurde darüber geredet." },
    { figur: "mateusz", art: "chat",
      text: "Transparenz hilft. Aber die Kita schließt immer noch früh. Dafür bräuchte es ein anderes Gesetz." },

    /* Schlagzeilen von Clara Vogt (Zeitungsausschnitt) */
    { figur: "clara", art: "zeitung", bedingung: "kompromiss",
      text: "Kommission rettet Transparenzgesetz mit eigenem Kompromisstext" },
    { figur: "clara", art: "zeitung", bedingung: "!angenommen",
      text: "Lohntransparenz scheitert im Plenum – neuer Anlauf ungewiss" },
    { figur: "clara", art: "zeitung", bedingung: "grundstimmung == \"mutig\"",
      text: "Mehrheit für mehr Lohntransparenz – junge Berichterstattung setzt sich durch" },
    { figur: "clara", art: "zeitung",
      text: "Kompromiss zur Lohntransparenz verabschiedet – Länder müssen jetzt umsetzen" }
  ],
  /* Miras Schlusszeile nach der Grundstimmung (aus den Abendantworten und Pressefragen) */
  mira: {
    mutig: "Du hast viel gewagt. Nicht alle waren begeistert, aber man hat dir zugehört.",
    pragmatisch: "Du hast zugehört und Kompromisse gefunden. So entstehen Gesetze.",
    vorsichtig: "Du hast darauf geachtet, dass alle mitkommen. Das war nicht immer leicht."
  }
};
