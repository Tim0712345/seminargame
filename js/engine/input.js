/* =====================================================================
   Die Lücke – Engine: Eingabe (Tastatur, Maus und Finger)
   Aktionen statt Tasten: das Spiel fragt z. B. input.gedrueckt("aktion").
   Zeiger (Maus/Touch) auf dem Spielbild:
     * kurz tippen/klicken → I.klick = { x, y } (Bildschirmpunkt)
     * ziehen              → virtueller Joystick (I.touch), Mitte = Startpunkt
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.input = (function () {
  "use strict";
  var I = { unten: {}, neu: {}, irgendeineTaste: false, touch: { x: 0, z: 0, aktiv: false },
            zeiger: { aktiv: false, zieht: false, sx: 0, sy: 0, x: 0, y: 0 }, klick: null };
  var JOY_RADIUS = 60, ZIEH_SCHWELLE = 14;

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

  // Maus und Finger auf dem Spielbild
  I.zeigerInit = function (el) {
    var Z = I.zeiger, id = null, t0 = 0;
    el.addEventListener("pointerdown", function (e) {
      if (Z.aktiv || (e.pointerType === "mouse" && e.button !== 0)) return;
      id = e.pointerId; t0 = Date.now();
      Z.aktiv = true; Z.zieht = false;
      Z.sx = Z.x = e.clientX; Z.sy = Z.y = e.clientY;
      try { el.setPointerCapture(id); } catch (err) { /* egal */ }
      e.preventDefault();
    });
    el.addEventListener("pointermove", function (e) {
      if (!Z.aktiv || e.pointerId !== id) return;
      Z.x = e.clientX; Z.y = e.clientY;
      var dx = Z.x - Z.sx, dy = Z.y - Z.sy, l = Math.sqrt(dx * dx + dy * dy);
      if (!Z.zieht && l > ZIEH_SCHWELLE) Z.zieht = true;
      if (Z.zieht) {
        var m = Math.max(l, JOY_RADIUS);
        I.touch.aktiv = true; I.touch.x = dx / m; I.touch.z = dy / m;
      }
    });
    function ende(e) {
      if (!Z.aktiv || e.pointerId !== id) return;
      if (!Z.zieht && Date.now() - t0 < 700 && e.type === "pointerup") I.klick = { x: Z.sx, y: Z.sy };
      Z.aktiv = false; Z.zieht = false; id = null;
      I.touch.aktiv = false; I.touch.x = I.touch.z = 0;
    }
    el.addEventListener("pointerup", ende);
    el.addEventListener("pointercancel", ende);
  };
  I.JOY_RADIUS = JOY_RADIUS;

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

  I.bildEnde = function () { I.neu = {}; I.irgendeineTaste = false; I.klick = null; };

  return I;
})();
