/* =====================================================================
   js/logik/gespraech.js – Platzhalter und Gesprächsknoten (Abschnitt 5.5)
   ===================================================================== */
var LOGIK = window.LOGIK || {};

/* ---------- Platzhalter in Texten ---------- */
LOGIK.text = (function () {
  var T = {};
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  T.fakt = function (id) {
    var f = DATA.fakten[id];
    if (!f) return "[?" + id + "]";
    var e = f.einheit;
    return f.wert + (e ? (e === "%" ? " %" : " " + e) : "");
  };
  /* nurText = true: ohne HTML (für Canvas-Texte im 3D-Bild) */
  T.ersetzen = function (s, nurText) {
    if (!s) return "";
    var r = nurText ? String(s) : esc(s);
    r = r.replace(/\{name\}/g, function () { return nurText ? LOGIK.stand.name : esc(LOGIK.stand.name); });
    r = r.replace(/\{(fakt|jahr|quelle):([a-z0-9_]+)\}/g, function (_, art, id) {
      var f = DATA.fakten[id], w;
      if (!f) w = "[?" + id + "]";
      else w = art === "fakt" ? T.fakt(id) : (art === "jahr" ? f.jahr : f.quelle);
      if (nurText) return w;
      var kl = "fakt" + (window.MEHRHEIT_DEBUG && f && !f.verifiziert ? " ungeprueft" : "");
      return '<span class="' + kl + '" data-fakt="' + id + '">' + esc(w) + "</span>";
    });
    r = r.replace(/\{wert:([a-z0-9_]+)\}/g, function (_, id) { var v = DATA.spielwerte[id]; return v === undefined ? "[?" + id + "]" : String(v); });
    r = r.replace(/\{option:([a-z0-9_]+)\}/g, function (_, id) {
      var kurz = id;
      DATA.artikel.forEach(function (a) { a.schrauben.forEach(function (s) { if (s.id === id) { var o = s.optionen.filter(function (x) { return x.id === (LOGIK.stand.entwurf[id] || s.start); })[0]; if (o) kurz = o.kurz; } }); });
      return kurz;
    });
    r = r.replace(/\*\*(.+?)\*\*/g, nurText ? "$1" : "<strong>$1</strong>");
    return r;
  };
  /* Platzhalter aus einem Text herausziehen (für die Prüfungen) */
  T.platzhalter = function (s) {
    var l = [], m, re = /\{(fakt|jahr|quelle|wert|option):([a-z0-9_]+)\}/g;
    while ((m = re.exec(s || ""))) l.push({ art: m[1], id: m[2] });
    return l;
  };
  return T;
})();

/* ---------- Gespräche ---------- */
LOGIK.gespraech = (function () {
  var G = { aktiv: null };

  G.starte = function (id, beiEnde) {
    var d = DATA.gespraeche[id];
    if (!d) { console.warn("Gespräch fehlt: " + id); return; }
    G.aktiv = { id: id, d: d, knoten: null, beiEnde: beiEnde };
    document.body.classList.add("gespraech");
    G.zeige(d.start);
  };

  G.zeige = function (kid) {
    var a = G.aktiv; if (!a) return;
    if (kid === "ende") { G.beenden(); return; }
    var n = a.d.knoten[kid];
    if (!n) { G.beenden(); return; }
    a.knoten = kid;
    if (n.flag) LOGIK.stand.flags[n.flag] = true;
    var sz = LOGIK.ablauf.szene;
    if (sz && sz.figuren) {
      var sprecher = sz.figuren[n.sprecher];
      for (var p in sz.figuren) {
        var f = sz.figuren[p];
        if (f === sprecher) { f.blickZiel = null; for (var q in sz.figuren) if (q !== p) f.blickZiel = sz.figuren[q].kopfWelt; }
        else if (sprecher) f.blickZiel = sprecher.kopfWelt;
      }
      if (sprecher) {
        if (n.geste) WELT.figuren.geste(sprecher, n.geste);
        sprecher.spricht = Math.min(6, 0.6 + LOGIK.text.ersetzen(n.text, true).length * 0.035);
      }
      LOGIK.ablauf.gespraechKamera(n.sprecher, n.kamera);
    }
    ANSICHT.leiste.knoten(n, a.d);
  };

  G.weiter = function () {
    var a = G.aktiv; if (!a) return;
    var n = a.d.knoten[a.knoten];
    if (n && !n.antworten) G.zeige(n.weiter || "ende");
  };

  G.antworte = function (i) {
    var a = G.aktiv; if (!a) return;
    var n = a.d.knoten[a.knoten];
    if (n && n.antworten && n.antworten[i]) {
      if (MOTOR.ton) MOTOR.ton.spiele("klick");
      G.zeige(n.antworten[i].ziel);
    }
  };

  G.beenden = function () {
    var a = G.aktiv; G.aktiv = null;
    document.body.classList.remove("gespraech");
    ANSICHT.leiste.ausblenden();
    var sz = LOGIK.ablauf.szene;
    if (sz && sz.figuren) for (var p in sz.figuren) sz.figuren[p].blickZiel = null;
    if (a && a.beiEnde) a.beiEnde();
  };

  /* Dialogprüfung: alle Knoten erreichbar, Verweise gültig */
  G.pruefen = function () {
    var fehler = [];
    for (var id in DATA.gespraeche) {
      var d = DATA.gespraeche[id], erreicht = {}, liste = [d.start];
      if (!d.knoten[d.start]) fehler.push(id + ": Startknoten „" + d.start + "“ fehlt");
      while (liste.length) {
        var k = liste.pop();
        if (k === "ende" || erreicht[k]) continue;
        erreicht[k] = true;
        var n = d.knoten[k];
        if (!n) { fehler.push(id + ": Verweis auf fehlenden Knoten „" + k + "“"); continue; }
        if (!DATA.figuren.personen[n.sprecher]) fehler.push(id + "/" + k + ": unbekannte Figur „" + n.sprecher + "“");
        if (n.geste && !DATA.figuren.gesten[n.geste]) fehler.push(id + "/" + k + ": unbekannte Geste „" + n.geste + "“");
        LOGIK.text.platzhalter(n.text).forEach(function (p) {
          if ((p.art === "wert" && DATA.spielwerte[p.id] === undefined) || (p.art !== "wert" && p.art !== "option" && !DATA.fakten[p.id])) fehler.push(id + "/" + k + ": Platzhalter {" + p.art + ":" + p.id + "} fehlt");
        });
        if (n.antworten) n.antworten.forEach(function (a) { liste.push(a.ziel); });
        else if (n.weiter) liste.push(n.weiter);
        else fehler.push(id + "/" + k + ": Knoten ohne Fortsetzung");
      }
      for (var kn in d.knoten) if (!erreicht[kn]) fehler.push(id + ": Knoten „" + kn + "“ ist nicht erreichbar");
    }
    return fehler;
  };
  return G;
})();
