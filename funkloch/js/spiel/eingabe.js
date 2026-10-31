// =====================================================================
//  js/spiel/eingabe.js – Tastatur, Maus und Touch
// ---------------------------------------------------------------------
//  Laufen: A/D oder Pfeiltasten, auf dem Tablet Tippen (hinlaufen)
//  oder Ziehen (Robin folgt dem Finger). Ansprechen: E / Leertaste.
// =====================================================================

var SPIEL = window.SPIEL || {};
window.SPIEL = SPIEL;

SPIEL.eingabe = {
  gehalten: {},     // Tasten, die gerade gedrückt sind
  neu: {},          // Tasten, die in diesem Bild neu gedrückt wurden
  zeiger: null,     // laufender Finger/Maus auf der Leinwand
  tipp: null,       // Antippen in diesem Bild { x, y } (CSS-Pixel)
  benutzt: false,   // hat sich Robin schon einmal bewegt?
  letzteArt: "",    // "mouse", "touch", "pen" oder "tastatur"

  init: function (leinwand) {
    var E = this;
    function name(e) {
      var c = e.code || "", k = e.key || "";
      if (c === "ArrowLeft" || c === "KeyA" || k === "ArrowLeft" || k === "a" || k === "A") return "links";
      if (c === "ArrowRight" || c === "KeyD" || k === "ArrowRight" || k === "d" || k === "D") return "rechts";
      if (c === "KeyE" || c === "Space" || c === "Enter" || k === "e" || k === "E" || k === " " || k === "Enter") return "aktion";
      if (c === "Escape" || k === "Escape") return "zurueck";
      if (c === "KeyR" || k === "r" || k === "R") return "geraet";
      if (c === "KeyP" || k === "p" || k === "P") return "p";
      if (/^Digit[1-9]$/.test(c)) return "ziffer" + c.slice(5);
      if (/^[1-9]$/.test(k)) return "ziffer" + k;
      return null;
    }
    window.addEventListener("pointerdown", function (e) { E.letzteArt = e.pointerType; }, true);
    window.addEventListener("keydown", function (e) {
      E.letzteArt = "tastatur";
      var n = name(e);
      if (!n) return;
      // Knöpfe der Oberfläche behalten Leertaste/Enter selbst
      var fokus = document.activeElement;
      if (n === "aktion" && (e.key === " " || e.key === "Enter") && fokus && fokus.tagName === "BUTTON") return;
      if (!E.gehalten[n]) E.neu[n] = true;
      E.gehalten[n] = true;
      if (n === "links" || n === "rechts" || n === "aktion") e.preventDefault();
    });
    window.addEventListener("keyup", function (e) {
      var n = name(e);
      if (n) E.gehalten[n] = false;
    });
    window.addEventListener("blur", function () { E.gehalten = {}; E.zeiger = null; });

    // Zeiger (Maus, Finger, Stift) auf der Leinwand
    leinwand.addEventListener("pointerdown", function (e) {
      E.zeiger = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, ziehen: false, art: e.pointerType };
      if (leinwand.setPointerCapture) try { leinwand.setPointerCapture(e.pointerId); } catch (f) { /* egal */ }
      e.preventDefault();
    });
    leinwand.addEventListener("pointermove", function (e) {
      var z = E.zeiger;
      if (!z || z.id !== e.pointerId) return;
      z.x = e.clientX; z.y = e.clientY;
      if (!z.ziehen && Math.abs(z.x - z.x0) + Math.abs(z.y - z.y0) > 14) z.ziehen = true;
    });
    function los(e) {
      var z = E.zeiger;
      if (!z || z.id !== e.pointerId) return;
      if (!z.ziehen) E.tipp = { x: z.x, y: z.y };
      E.zeiger = null;
    }
    leinwand.addEventListener("pointerup", los);
    leinwand.addEventListener("pointercancel", function () { E.zeiger = null; });
    leinwand.addEventListener("contextmenu", function (e) { e.preventDefault(); });
  },

  // Am Ende jedes Bildes aufrufen
  bildEnde: function () { this.neu = {}; this.tipp = null; }
};
