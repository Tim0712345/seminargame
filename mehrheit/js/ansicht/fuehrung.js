/* =====================================================================
   js/ansicht/fuehrung.js – Leitfaden (Wunsch des Users, 1. November 2026)
   ---------------------------------------------------------------------
   1. Aufgabenkarte oben links: Kapitel, Ziel, nächster Schritt, Fortschritt.
   2. Mira zeigt Schritt für Schritt: Beim ersten Mal wird das wichtige
      Element hervorgehoben und in einem Satz erklärt („Verstanden“).
      Jeder Hinweis erscheint nur einmal pro Spielstand (Flag f_<id>).
   Alle Texte stehen in data/texte.js (aufgaben, fuehrung).
   ===================================================================== */
var ANSICHT = window.ANSICHT || {};

ANSICHT.aufgabe = (function () {
  var A = { schritt: "start", zu: false };
  function hol(id) { return document.getElementById(id); }

  function fortschritt(k, d) {
    var st = LOGIK.stand, W = DATA.spielwerte;
    if (!d.fortschritt) return "";
    var n = null, max = null;
    if (k === 2) { n = st.gefragt.length; max = W.fragen_anhoerung; }
    else if (k === 3 && ANSICHT.editor.offen && ANSICHT.editor.modus === "entwurf") { n = ANSICHT.editor.artikel + 1; max = DATA.artikel.length; }
    else if (k === 4) { n = st.termineUebrig; max = st.versuche > 0 ? W.extra_termine : W.termine_flure; }
    else if (k === 6 && LOGIK.ablauf.trilog) { var T = LOGIK.ablauf.trilog; n = String(Math.max(0, T.budget - LOGIK.ablauf.trilogVerbraucht())).replace(".", ","); }
    if (n === null) return "";
    return d.fortschritt.replace("{n}", n).replace("{max}", max);
  }

  A.setzen = function (schritt) { A.schritt = schritt; A.aktualisieren(); };
  A.zeigen = function (an) {
    var el = hol("aufgabe"); if (!el) return;
    var d = DATA.texte.aufgaben["k" + LOGIK.stand.kapitel];
    el.classList.toggle("versteckt", !an || !d);
    if (an) A.aktualisieren();
  };
  A.aktualisieren = function () {
    var el = hol("aufgabe");
    if (!el || el.classList.contains("versteckt")) return;
    var st = LOGIK.stand, k = st.kapitel, T = DATA.texte.aufgaben, d = T["k" + k], kap = DATA.texte.kapitel[k - 1];
    if (!d || !kap) { el.classList.add("versteckt"); return; }
    var tag = LOGIK.text.ersetzen(kap.tag, true);
    if (k === 4) tag = st.tag === 1 ? DATA.texte.kalender.mittwoch : DATA.texte.kalender.donnerstag;
    var jetzt = d.schritte[A.schritt] || d.schritte.start;
    var f = fortschritt(k, d);
    el.innerHTML = '<button type="button" class="af-kopf" id="afKopf" aria-expanded="' + !A.zu + '">' +
      '<span class="af-kapitel">' + DATA.texte.kapitelWort + " " + k + " · " + LOGIK.text.ersetzen(kap.titel, true) + '</span><span class="af-tag">' + tag + " " + (A.zu ? "▾" : "▴") + "</span></button>" +
      (A.zu ? "" : '<div class="af-zeile af-ziel"><b>' + T.ziel + "</b><span>" + LOGIK.text.ersetzen(d.ziel) + "</span></div>" +
        '<div class="af-zeile af-jetzt"><b>' + T.jetzt + "</b><span>" + LOGIK.text.ersetzen(jetzt) + "</span></div>" +
        (f ? '<div class="af-fort">' + f + "</div>" : ""));
    var b = hol("afKopf");
    b.addEventListener("click", function () { A.zu = !A.zu; A.aktualisieren(); });
    ANSICHT.hover(b);
  };
  return A;
})();

ANSICHT.fuehrung = (function () {
  var F = { offen: null, warte: [] };
  function hol(id) { return document.getElementById(id); }

  /* id: Schlüssel in DATA.texte.fuehrung · ziel: CSS-Auswahl oder Element · fertig: danach */
  F.zeige = function (id, ziel, fertig) {
    var st = LOGIK.stand;
    if (st.flags["f_" + id] || !DATA.texte.fuehrung[id]) { if (fertig) fertig(); return; }
    if (F.offen) { F.warte.push([id, ziel, fertig]); return; }
    var el = typeof ziel === "string" ? document.querySelector(ziel) : ziel;
    if (!el || !el.getClientRects().length) { if (fertig) fertig(); return; }
    st.flags["f_" + id] = true;
    F.offen = { id: id, el: el, fertig: fertig };
    var w = hol("fuehrung");
    w.innerHTML = '<div class="fu-loch"></div><div class="fu-blase" role="dialog" aria-live="polite" aria-label="' + DATA.figuren.personen.mira.name + '">' +
      '<div class="fu-name">' + DATA.figuren.personen.mira.name + '</div><p>' + LOGIK.text.ersetzen(DATA.texte.fuehrung[id]) + '</p>' +
      '<button type="button" class="knopf haupt" id="fuOk">' + DATA.texte.fuehrung.verstanden + "</button></div>";
    w.classList.remove("versteckt");
    F.ausrichten();
    var ok = hol("fuOk");
    ok.addEventListener("click", F.schliessen);
    ANSICHT.hover(ok);
    setTimeout(function () { ok.focus({ preventScroll: true }); }, 30);
    if (MOTOR.ton) MOTOR.ton.spiele("klick");
  };

  /* Loch und Sprechblase an das hervorgehobene Element anlegen */
  F.ausrichten = function () {
    if (!F.offen) return;
    // Koordinaten relativ zur Spielfläche (#oberflaeche ist der Bezugsrahmen)
    var o = hol("oberflaeche").getBoundingClientRect(), r0 = F.offen.el.getBoundingClientRect(), w = hol("fuehrung");
    var r = { left: r0.left - o.left, top: r0.top - o.top, width: r0.width, height: r0.height, bottom: r0.bottom - o.top };
    var B = o.width, Hh = o.height;
    var loch = w.querySelector(".fu-loch"), blase = w.querySelector(".fu-blase"), rand = 8;
    loch.style.left = (r.left - rand) + "px"; loch.style.top = (r.top - rand) + "px";
    loch.style.width = (r.width + 2 * rand) + "px"; loch.style.height = (r.height + 2 * rand) + "px";
    var bw = Math.min(340, B - 24), bh = blase.offsetHeight || 150;
    var x = Math.max(12, Math.min(B - bw - 12, r.left + r.width / 2 - bw / 2));
    var y = r.bottom + rand + 12;
    if (y + bh > Hh - 12) y = r.top - rand - 12 - bh;
    if (y < 12) y = Math.max(12, Math.min(Hh - bh - 12, r.top + 12));
    blase.style.width = bw + "px"; blase.style.left = x + "px"; blase.style.top = y + "px";
  };

  F.schliessen = function () {
    if (!F.offen) return false;
    var f = F.offen.fertig;
    F.offen = null;
    hol("fuehrung").classList.add("versteckt");
    hol("fuehrung").innerHTML = "";
    LOGIK.speicher.baldSpeichern();
    if (f) f();
    if (!F.offen && F.warte.length) { var n = F.warte.shift(); F.zeige(n[0], n[1], n[2]); }
    return true;
  };
  F.taste = function (e) {
    if (!F.offen) return false;
    if (e.key === "Enter" || e.key === "Escape" || e.key === " ") { F.schliessen(); return true; }
    return true;   // andere Tasten blockieren, solange der Hinweis offen ist
  };
  window.addEventListener("resize", F.ausrichten);
  return F;
})();
