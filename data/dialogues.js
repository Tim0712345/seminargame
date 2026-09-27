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
    kruemmung: "Gekrümmte Welt",
    an: "An",
    aus: "Aus",
    steuerung: "Steuerung anzeigen",
    hinweisNeuladen: "Die Kantenglättung ändert sich erst nach dem Neuladen."
  },

  hudTaste: "E",

  test: {
    fundUntersuchen: "Untersuchen",
    fundText: "Test-Fundstück gefunden!",
    figurHallo: "Hallo!"
  }
};

DATA.dialogues = {};
