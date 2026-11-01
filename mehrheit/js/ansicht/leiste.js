/* =====================================================================
   js/ansicht/leiste.js – Gesprächsleiste am unteren Rand (Abschnitt 5.5, 7.10)
   ---------------------------------------------------------------------
   Name und Rolle der sprechenden Figur, Text (Schreibmaschine, abschaltbar),
   zwei bis drei Antwortknöpfe. Die Figur selbst sieht man im 3D-Bild.
   Tasten: 1–3 wählen Antworten, Leertaste zeigt den Text sofort,
   Enter = weiter, Esc beendet das Gespräch.
   ===================================================================== */
var ANSICHT = window.ANSICHT || {};

ANSICHT.leiste = (function () {
  var L = { offen: false, zeichen: 0, voll: "", fertig: true, n: null };
  var el = {};

  function hol(id) { return document.getElementById(id); }

  L.init = function () {
    el.box = hol("leiste"); el.name = hol("leisteName"); el.rolle = hol("leisteRolle");
    el.text = hol("leisteText"); el.antworten = hol("leisteAntworten"); el.weiter = hol("leisteWeiter"); el.zu = hol("leisteZu");
    el.weiter.textContent = DATA.texte.leiste.weiter;
    el.zu.setAttribute("aria-label", DATA.texte.leiste.schliessen);
    el.zu.title = DATA.texte.leiste.schliessen;
    el.text.addEventListener("click", function () { L.tippen(); });
    el.weiter.addEventListener("click", function () { L.tippen(); });
    el.zu.addEventListener("click", function () { LOGIK.gespraech.beenden(); });
    ANSICHT.hover(el.weiter); ANSICHT.hover(el.zu);
  };

  function tempo() {
    var e = DATA.einstellungenAktuell || {};
    if (MOTOR.bewegungReduziert || e.schreibmaschine === "sofort") return 1e9;
    return e.schreibmaschine === "langsam" ? 24 : (e.schreibmaschine === "schnell" ? 95 : 48);
  }

  L.knoten = function (n) {
    var p = DATA.figuren.personen[n.sprecher] || { name: n.sprecher, rolle: "" };
    L.n = n; L.offen = true;
    el.box.classList.remove("versteckt");
    el.name.textContent = p.name;
    el.rolle.textContent = p.rolle + (p.land ? " · " + p.land : "");
    L.voll = LOGIK.text.ersetzen(n.text);
    L.klar = LOGIK.text.ersetzen(n.text, true);
    L.zeichen = 0; L.fertig = false;
    el.text.innerHTML = "";
    el.text.setAttribute("aria-label", p.name + ": " + L.klar);
    el.antworten.innerHTML = "";
    el.antworten.classList.add("versteckt");
    el.weiter.classList.add("versteckt");
    if (tempo() > 1e8) L.fertigZeigen();
  };

  L.fertigZeigen = function () {
    if (!L.n) return;
    L.fertig = true;
    el.text.innerHTML = L.voll;
    var n = L.n;
    if (n.antworten) {
      el.antworten.innerHTML = "";
      n.antworten.forEach(function (a, i) {
        var b = document.createElement("button");
        b.className = "antwort knopf";
        b.innerHTML = '<span class="nr" aria-hidden="true">' + (i + 1) + "</span>" + LOGIK.text.ersetzen(a.text);
        b.addEventListener("click", function () { LOGIK.gespraech.antworte(i); });
        ANSICHT.hover(b);
        el.antworten.appendChild(b);
      });
      el.antworten.classList.remove("versteckt");
      var erste = el.antworten.querySelector("button");
      if (erste && ANSICHT.tastatur) erste.focus({ preventScroll: true });
    } else {
      el.weiter.classList.remove("versteckt");
      if (ANSICHT.tastatur) el.weiter.focus({ preventScroll: true });
    }
  };

  /* Klick auf den Text: erst alles zeigen, dann weiter */
  L.tippen = function () {
    if (!L.offen) return;
    if (!L.fertig) { L.fertigZeigen(); return; }
    if (L.n && !L.n.antworten) LOGIK.gespraech.weiter();
  };

  L.schritt = function (dt) {
    if (!L.offen || L.fertig) return;
    L.zeichen += dt * tempo();
    var anz = Math.floor(L.zeichen);
    if (anz >= L.klar.length) { L.fertigZeigen(); return; }
    el.text.textContent = L.klar.substr(0, anz);
  };

  L.taste = function (e) {
    if (!L.offen) return false;
    if (e.key === "Escape") { LOGIK.gespraech.beenden(); return true; }
    if (e.key === " " || e.key === "Enter") {
      if (document.activeElement && document.activeElement.classList.contains("antwort") && e.key === "Enter") return false;
      L.tippen(); return true;
    }
    var z = parseInt(e.key, 10);
    if (z >= 1 && z <= 3 && L.fertig && L.n && L.n.antworten) { LOGIK.gespraech.antworte(z - 1); return true; }
    return false;
  };

  L.ausblenden = function () {
    L.offen = false; L.n = null;
    el.box.classList.add("versteckt");
  };

  return L;
})();
