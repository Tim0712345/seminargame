// =====================================================================
//  data/dialoge.js – Gespräche
// ---------------------------------------------------------------------
//  PHASE 1: Hier steht nur eine kleine STILPROBE (ein Satz, zwei Zettel),
//  damit du Sprechblasen, Antwort-Zettel und die Schnipsel-Animation
//  ansehen kannst. Das richtige Gesprächssystem (mit Nachfragen,
//  Flags usw.) kommt in Phase 2.
//
//  satz       = was die Figur zuerst sagt
//  antworten  = 2–3 Zettel für Robin
//    text      = was auf dem Zettel steht
//    folge     = was die Figur darauf antwortet
//    schnipsel = wird als Tonschnipsel aufgenommen (art: "Erfahrung" oder "Meinung")
//  **fett** markiert wichtige Wörter.
// =====================================================================

var DATA = window.DATA || {};
window.DATA = DATA;

DATA.dialoge = {

  stilprobe_birte: {
    figur: "birte",
    satz: "Du bist von diesem Podcast? Dann hast du Glück: Meine Pause dauert genau so lange wie dieser Kaffee.",
    antworten: [
      {
        text: "Wie ist das mit deinem Job?",
        folge: "Minijob. Ich würde gern **mehr Stunden** machen. Aber mehr gibt’s hier nur in Vollzeit – und die Kita macht am Nachmittag zu.",
        schnipsel: { zitat: "Mehr Stunden gibt’s hier nur in Vollzeit – und die Kita macht am Nachmittag zu.", art: "Erfahrung" }
      },
      {
        text: "Ich komm später wieder.",
        folge: "Mach das. Ich bin bis Ladenschluss hier. Der Kaffee leider nicht."
      }
    ]
  },

  stilprobe_jannik: {
    figur: "jannik",
    satz: "Psst. Wenn der Wagen stehen bleibt, wacht sie auf. Ich bin quasi ein Perpetuum mobile mit Teilzeitvertrag.",
    antworten: [
      {
        text: "Wie läuft’s mit der Teilzeit?",
        folge: "Gut fürs Kind. Aber seit ich weniger Stunden habe, fragt mich keiner mehr nach dem **Projekt, das ich eigentlich leiten sollte**.",
        schnipsel: { zitat: "Seit ich weniger Stunden habe, fragt mich keiner mehr nach dem Projekt, das ich leiten sollte.", art: "Erfahrung" }
      },
      {
        text: "Dann will ich nicht stören.",
        folge: "Du störst nicht. Nur wenn du stehen bleibst."
      }
    ]
  }
};
