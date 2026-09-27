/* =====================================================================
   Die Lücke – Engine: Eingabe (Tastatur, später auch Touch)
   Aktionen statt Tasten: das Spiel fragt z. B. input.gedrueckt("aktion").
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.input = (function () {
  "use strict";
  var I = { unten: {}, neu: {}, irgendeineTaste: false, touch: { x: 0, z: 0, aktiv: false } };

  var BELEGUNG = {
    hoch:      ["KeyW", "ArrowUp"],
    runter:    ["KeyS", "ArrowDown"],
    links:     ["KeyA", "ArrowLeft"],
    rechts:    ["KeyD", "ArrowRight"],
    aktion:    ["KeyE", "Space"],
    ok:        ["Enter", "NumpadEnter", "KeyE", "Space"],
    pause:     ["Escape"],
    notizbuch: ["KeyN"],
    quests:    ["KeyQ"]
  };
  // Für sehr alte Browser ohne e.code
  var NACH_KEY = {
    "w": "KeyW", "a": "KeyA", "s": "KeyS", "d": "KeyD", "e": "KeyE", "n": "KeyN", "q": "KeyQ",
    "ArrowUp": "ArrowUp", "ArrowDown": "ArrowDown", "ArrowLeft": "ArrowLeft", "ArrowRight": "ArrowRight",
    "Up": "ArrowUp", "Down": "ArrowDown", "Left": "ArrowLeft", "Right": "ArrowRight",
    " ": "Space", "Spacebar": "Space", "Enter": "Enter", "Escape": "Escape", "Esc": "Escape"
  };
  var BLOCKIEREN = { ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, Space: 1 };

  function code(e) {
    if (e.code) return e.code;
    var k = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
    return NACH_KEY[k] || e.key;
  }

  I.init = function () {
    window.addEventListener("keydown", function (e) {
      var c = code(e);
      if (BLOCKIEREN[c]) e.preventDefault();
      if (e.repeat) return;
      if (!I.unten[c]) I.neu[c] = true;
      I.unten[c] = true;
      I.irgendeineTaste = true;
      if (I.beiTaste) I.beiTaste(c);
    });
    window.addEventListener("keyup", function (e) { I.unten[code(e)] = false; });
    window.addEventListener("blur", function () { I.unten = {}; I.neu = {}; });
    document.addEventListener("visibilitychange", function () { if (document.hidden) { I.unten = {}; I.neu = {}; } });
  };

  I.gehalten = function (aktion) {
    var l = BELEGUNG[aktion];
    for (var i = 0; i < l.length; i++) if (I.unten[l[i]]) return true;
    return false;
  };
  I.gedrueckt = function (aktion) {
    var l = BELEGUNG[aktion];
    for (var i = 0; i < l.length; i++) if (I.neu[l[i]]) return true;
    return false;
  };
  // Tastendruck "verbrauchen", damit ihn nicht zwei Systeme im selben Bild auswerten
  I.verbrauchen = function (aktion) {
    var l = BELEGUNG[aktion];
    for (var i = 0; i < l.length; i++) I.neu[l[i]] = false;
  };

  // Laufrichtung: x = rechts, z = nach unten im Bild (Süden)
  I.richtung = function () {
    var x = 0, z = 0;
    if (I.gehalten("links")) x -= 1;
    if (I.gehalten("rechts")) x += 1;
    if (I.gehalten("hoch")) z -= 1;
    if (I.gehalten("runter")) z += 1;
    if (I.touch.aktiv) { x += I.touch.x; z += I.touch.z; }
    var l = Math.sqrt(x * x + z * z);
    if (l > 1) { x /= l; z /= l; }
    return { x: x, z: z };
  };

  I.bildEnde = function () { I.neu = {}; I.irgendeineTaste = false; };

  return I;
})();
