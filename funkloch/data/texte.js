// =====================================================================
//  data/texte.js – Texte der Oberfläche (Knöpfe, Hinweise, Titel)
// ---------------------------------------------------------------------
//  Einfach den Text zwischen den Anführungszeichen ändern.
//  Keine Zahlen direkt hineinschreiben – dafür gibt es {fakt:id}.
// =====================================================================

var DATA = window.DATA || {};
window.DATA = DATA;

DATA.texte = {
  spielname: "Funkloch",
  untertitel: "Stimmen aus Europa",

  // Hinweise im Spiel
  ansprechen: "ansprechen",
  antippen: "antippen zum Ansprechen",
  verabschieden: "Danke dir! Bis später.",
  tasteAnsprechen: "E",
  geraet: "Aufnahmegerät",
  schnipselGespeichert: "Schnipsel aufgenommen",
  schliessen: "Gespräch beenden",
  geraetSpaeter: "Das Aufnahmegerät kommt in Phase zwei",

  // Steuerungs-Hinweis unten (verschwindet nach den ersten Schritten)
  steuerung: "A / D oder ← → zum Laufen · E zum Ansprechen · Auf dem Tablet: tippen oder ziehen",

  // Kennzeichnung des Prototyps
  stilprobe: "Stilprobe · Phase eins",

  // Debug
  debugStimmung: "Tasten 1–5: Stimmung wechseln · P: Figuren-Parade"
};
