/* =====================================================================
   js/ansicht/dokument.js – HTML-Ebene des Gesetzestexts und Änderungsmodus
   ---------------------------------------------------------------------
   Lesbarkeit geht vor (Abschnitt 7.8): Über die 3D-Seite legt sich
   deckungsgleich eine scharfe HTML-Ebene mit demselben Text (perspektivisch
   per Homografie verzerrt). Rechts die Stellschrauben mit Optionen,
   Dafür/Dagegen-Karten und Randbemerkungen des Juristischen Dienstes.
   ===================================================================== */
var ANSICHT = window.ANSICHT || {};

ANSICHT.editor = (function () {
  var E = { offen: false, modus: null, artikel: 0, wunsch: false };
  var M = MOTOR.m;
  var BLATT_B = 0.21, BLATT_T = 0.297, PX_B = 840, PX_H = 1188;

  function hol(id) { return document.getElementById(id); }
  function T() { return DATA.texte.editor; }
  function opt(sch, id) { return sch.optionen.filter(function (o) { return o.id === id; })[0]; }

  /* ---------- Seite als HTML (gleicher Inhalt wie die Canvas-Seite) ---------- */
  function seiteHtml() {
    var art = DATA.artikel[E.artikel], e = LOGIK.entwurf(), D = DATA.texte.dokument;
    var h = '<div class="bl-kopf"><span>' + D.kopfLinks.toUpperCase() + "</span><span>" + D.kopfRechts + "</span></div>";
    h += '<div class="bl-art">' + D.art + '</div><div class="bl-titel">' + LOGIK.text.ersetzen(D.titel) + '</div><div class="bl-bericht">' + LOGIK.text.ersetzen(D.berichterstattung) + "</div>";
    h += '<h3 class="bl-artikel">' + LOGIK.text.ersetzen(art.titel) + "</h3>";
    if (art.grundtext) h += "<p>" + LOGIK.text.ersetzen(art.grundtext) + "</p>";
    art.schrauben.forEach(function (s, nr) {
      var a = opt(s, e[s.id]), st = opt(s, s.start), geaendert = e[s.id] !== s.start;
      h += '<div class="bl-absatz' + (geaendert ? " geaendert" : "") + '"><span class="bl-nr">(' + (nr + 1) + ")</span><div>";
      if (geaendert && st && !st.streichen) h += '<del>' + LOGIK.text.ersetzen(st.text) + "</del> ";
      if (a.streichen) h += '<em class="bl-weg">' + T().gestrichen + "</em>";
      else h += geaendert ? "<ins>" + LOGIK.text.ersetzen(a.text) + "</ins>" : LOGIK.text.ersetzen(a.text);
      if (a.jurist) h += '<aside class="haftnotiz"><b>§</b> ' + LOGIK.text.ersetzen(a.jurist) + '<span class="hn-von">' + DATA.figuren.personen.hanna.name + "</span></aside>";
      h += "</div></div>";
    });
    h += '<div class="bl-fuss"><span>' + D.fuss + "</span><span>– " + (E.artikel + 1) + " –</span></div>";
    return h;
  }

  /* ---------- Bedienfeld rechts: ein Artikel, eine Frage ---------- */
  function wer(o, wert) {
    var l = DATA.fraktionen.filter(function (f) { return !f.immerJa && o.haltung && (wert > 0 ? o.haltung[f.id] > 0 : o.haltung[f.id] < 0); });
    if (!l.length) return '<span class="eo-keiner">' + T().keiner + "</span>";
    return l.map(function (f) { return '<span class="eo-fr" style="--fr:' + f.farbe + '">' + f.kurz + "</span>"; }).join(" ");
  }
  function feld() {
    var el = hol("editor"), t = T(), max = DATA.artikel.length;
    var html = "";
    if (E.modus === "entwurf") {
      html += '<div class="ed-kopf"><span class="ed-von">' + (E.wunsch ? t.extras : t.artikelVon.replace("{n}", E.artikel + 1).replace("{max}", max)) + '</span><div class="ed-tabs" role="tablist">';
      DATA.artikel.forEach(function (a, i) { html += '<button type="button" class="knopf ed-tab' + (i === E.artikel && !E.wunsch ? " aktiv" : "") + '" data-tab="' + i + '" aria-label="' + LOGIK.text.ersetzen(a.titel, true) + '">' + (i + 1) + "</button>"; });
      html += '<button type="button" class="knopf ed-tab wz' + (E.wunsch ? " aktiv" : "") + '" data-tab="wunsch" aria-label="' + t.wunschTab + '">+</button></div></div>';
    }
    if (E.wunsch) {
      html += "<h2>" + t.wunschTitel + '</h2><p class="ed-einleitung">' + t.wunschErklaerung + "</p>";
      DATA.wunschzettel.forEach(function (w) {
        var drin = LOGIK.stand.wunschzettel.indexOf(w.id) >= 0;
        html += '<div class="ed-wunsch"><div class="ed-frage">' + w.kurz + "</div><p>" + LOGIK.text.ersetzen(w.text) + '</p><button type="button" class="knopf segment" data-wunsch="' + w.id + '" aria-pressed="' + drin + '">' + (drin ? t.wunschRaus : t.wunschRein) + "</button>" +
          (drin ? '<aside class="haftnotiz rot"><b>§</b> ' + LOGIK.text.ersetzen(w.jurist) + "</aside>" : "") + "</div>";
      });
    } else {
      var art = DATA.artikel[E.artikel], e = LOGIK.entwurf();
      html += "<h2>" + LOGIK.text.ersetzen(art.titel) + '</h2><p class="ed-einleitung">' + LOGIK.text.ersetzen(art.einleitung) + "</p>";
      if (DATA.einstellungenAktuell.lesehilfe && art.kurzfassung) html += '<p class="lesehilfe">' + t.lesehilfe + " " + LOGIK.text.ersetzen(art.kurzfassung) + "</p>";
      art.schrauben.forEach(function (s) {
        html += '<div class="ed-frage" id="edFrage">' + LOGIK.text.ersetzen(s.frage) + '</div><div class="ed-optionen segmente" role="group" aria-label="' + LOGIK.text.ersetzen(s.frage, true) + '">';
        s.optionen.forEach(function (o) {
          html += '<button type="button" class="knopf ed-option segment" data-schraube="' + s.id + '" data-option="' + o.id + '" aria-pressed="' + (e[s.id] === o.id) + '">' +
            '<span class="eo-kopf"><span class="eo-kurz">' + LOGIK.text.ersetzen(o.kurz) + "</span>" + (o.id === s.start ? '<span class="eo-komm">' + t.kommission + "</span>" : "") + "</span>" +
            '<span class="eo-wer"><span class="eo-label">' + t.moegen + "</span> " + wer(o, 1) + '</span><span class="eo-wer"><span class="eo-label">' + t.ablehnen + "</span> " + wer(o, -1) + "</span></button>";
        });
        html += "</div>";
        var a = opt(s, e[s.id]);
        html += '<div class="ed-abwaegung"><p><b>' + t.dafuer + "</b> " + LOGIK.text.ersetzen(a.dafuer) + "</p><p><b>" + t.dagegen + "</b> " + LOGIK.text.ersetzen(a.dagegen) + "</p></div>";
      });
      if (E.modus === "entwurf") html += '<div id="edWirkung" class="ed-wirkung"></div>';
    }
    html += '<div class="ed-fuss">';
    if (E.modus === "entwurf") {
      var letzt = E.wunsch || E.artikel === max - 1;
      html += '<div class="reihe ed-nav"><button type="button" class="knopf" id="edZurueck"' + (E.artikel === 0 && !E.wunsch ? " disabled" : "") + ">← " + t.zurueck + "</button>" +
        (letzt ? "" : '<button type="button" class="knopf" id="edWeiter">' + t.weiter + " →</button>") + "</div>";
      html += '<button type="button" class="knopf ' + (letzt ? "haupt" : "leise") + '" id="edEinreichen">' + t.einreichen + "</button>";
    } else if (E.modus === "probe") html += '<p class="klein">' + t.probeHinweis + "</p>";
    html += "</div>";
    el.innerHTML = html;
    Array.prototype.forEach.call(el.querySelectorAll("button"), function (b) { ANSICHT.hover(b); b.style.touchAction = "manipulation"; });
    Array.prototype.forEach.call(el.querySelectorAll("[data-tab]"), function (b) {
      b.addEventListener("click", function () { var v = b.getAttribute("data-tab"); if (v === "wunsch") { E.wunsch = true; feld(); } else E.artikelZeigen(parseInt(v, 10)); });
    });
    Array.prototype.forEach.call(el.querySelectorAll("[data-option]"), function (b) {
      b.addEventListener("click", function () { E.waehlen(b.getAttribute("data-schraube"), b.getAttribute("data-option")); });
    });
    Array.prototype.forEach.call(el.querySelectorAll("[data-wunsch]"), function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-wunsch"), l = LOGIK.stand.wunschzettel, i = l.indexOf(id);
        if (i >= 0) l.splice(i, 1); else { l.push(id); if (!LOGIK.stand.flags.wunschHanna) { LOGIK.stand.flags.wunschHanna = true; LOGIK.gespraech.folge([DATA.zeilen.entwurf.wunsch]); } LOGIK.stand.flags.wunschVersucht = true; }
        E.nachAenderung(); feld();
      });
    });
    var z = hol("edZurueck"); if (z) z.addEventListener("click", function () { if (E.wunsch) { E.wunsch = false; E.artikelZeigen(max - 1); feld(); } else E.artikelZeigen(E.artikel - 1); });
    var w = hol("edWeiter"); if (w) w.addEventListener("click", function () { E.artikelZeigen(E.artikel + 1); });
    var ein = hol("edEinreichen"); if (ein) ein.addEventListener("click", function () { if (E.beiEinreichen) E.beiEinreichen(); });
    ANSICHT.wirkung.aktualisieren();
    if (E.modus === "entwurf") ANSICHT.aufgabe.setzen(E.wunsch || E.artikel === max - 1 ? "einreichen" : "artikel");
    el.scrollTop = 0;
  }

  /* ---------- Öffnen / Schließen ---------- */
  E.oeffnen = function (modus, artikel, beiEinreichen) {
    E.offen = true; E.modus = modus; E.wunsch = false; E.beiEinreichen = beiEinreichen;
    E.artikel = artikel || 0;
    var sz = LOGIK.ablauf.szene;
    if (sz && sz.dokument) E.seiteSetzen(sz.dokument, false);
    hol("editor").classList.remove("versteckt");
    hol("blattHtml").classList.remove("versteckt");
    feld();
    E.blatt();
    document.body.classList.add("editor-offen");
  };
  E.schliessen = function () {
    E.offen = false;
    hol("editor").classList.add("versteckt");
    hol("blattHtml").classList.add("versteckt");
    hol("blattHtml").style.opacity = 0;
    document.body.classList.remove("editor-offen");
  };

  E.seiteSetzen = function (doc, mitBlaettern) {
    var s = doc.seiten[1];
    s.daten.artikel = DATA.artikel[E.artikel];
    s.daten.auswahl = LOGIK.entwurf();
    s.daten.nummer = E.artikel + 1;
    s.daten.stempel = null;
    if (mitBlaettern) WELT.dokument.blaetternWechsel(doc);
    else WELT.dokument.seiteNeu(doc, s);
  };

  E.artikelZeigen = function (i) {
    if (i < 0 || i >= DATA.artikel.length) return;
    E.wunsch = false;
    if (i !== E.artikel) {
      E.artikel = i;
      var sz = LOGIK.ablauf.szene;
      if (sz && sz.dokument) E.seiteSetzen(sz.dokument, true);
    }
    feld(); E.blatt();
  };

  E.blatt = function () { hol("blattInhalt").innerHTML = seiteHtml(); };

  E.waehlen = function (schraube, option) {
    var e = LOGIK.entwurf();
    if (e[schraube] === option) return;
    LOGIK.stand.entwurf[schraube] = option;
    var sz = LOGIK.ablauf.szene;
    if (sz && sz.dokument) {
      var s = sz.dokument.seiten[1];
      s.daten.artikel = DATA.artikel[E.artikel];
      s.daten.auswahl = e;
      WELT.dokument.optionSetzen(sz.dokument, schraube, option);
      s.daten.auswahl = LOGIK.entwurf();
    }
    var art = DATA.artikel[E.artikel], sch = art.schrauben.filter(function (x) { return x.id === schraube; })[0], o = opt(sch, option);
    if (o.jurist && !LOGIK.stand.flags["jurist_" + option + schraube]) {
      LOGIK.stand.flags["jurist_" + option + schraube] = true;
      LOGIK.gespraech.folge([{ sprecher: "hanna", text: o.jurist }]);
    }
    E.nachAenderung();
    feld(); E.blatt();
    if (E.beiWahl) E.beiWahl(schraube, option);
  };

  E.nachAenderung = function () {
    var sz = LOGIK.ablauf.szene, erg = LOGIK.mehrheit.ausschuss(LOGIK.entwurf());
    if (sz && sz.glasmodell) WELT.szenen.halbrundSetzen(sz, erg);
    if (LOGIK.ablauf.ohne3D) ANSICHT.dokumentmodus.halbrund(erg, "sitzeAusschuss");
    ANSICHT.fraktionsleiste.aktualisieren(erg);
    ANSICHT.wirkung.aktualisieren();
    LOGIK.speicher.baldSpeichern();
    // Schärfe ziehen zum Glasmodell, wenn sich die Mehrheit ändert
    if (sz && sz.glasmodell && LOGIK.ablauf.kamera) {
      var K = LOGIK.ablauf.kamera, ziel = M.abstand(K.pos, M.punktMal(sz.glasmodell.basis, [0, 0, 0]));
      if (E.letzteMehrheit !== undefined && E.letzteMehrheit !== erg.mehrheit) {
        K.schaerfeZiehen(ziel);
        setTimeout(function () { K.schaerfeZiehen(M.abstand(K.pos, K.ziel)); }, 1800);
      }
    }
    E.letzteMehrheit = erg.mehrheit;
  };

  /* ---------- Homografie: HTML-Seite deckungsgleich über die 3D-Seite ---------- */
  function homografie(q) {
    // Rechteck (0,0)-(W,H) → Viereck q[0..3] (oben links, oben rechts, unten rechts, unten links)
    var src = [[0, 0], [PX_B, 0], [PX_B, PX_H], [0, PX_H]], A = [], b = [];
    for (var i = 0; i < 4; i++) {
      var x = src[i][0], y = src[i][1], X = q[i][0], Y = q[i][1];
      A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]); b.push(X);
      A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]); b.push(Y);
    }
    for (var c = 0; c < 8; c++) {
      var p = c; for (var r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      var t = A[c]; A[c] = A[p]; A[p] = t; t = b[c]; b[c] = b[p]; b[p] = t;
      for (r = c + 1; r < 8; r++) { var f = A[r][c] / A[c][c]; for (var k = c; k < 8; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; }
    }
    var h = new Array(8);
    for (c = 7; c >= 0; c--) { var s = b[c]; for (k = c + 1; k < 8; k++) s -= A[c][k] * h[k]; h[c] = s / A[c][c]; }
    return h;
  }

  E.schritt = function (kam) {
    if (!E.offen) return;
    var sz = LOGIK.ablauf.szene, el = hol("blattHtml");
    if (!sz || !sz.dokument || !kam) return;
    var doc = sz.dokument, m = doc.seiten[1].obj.matrix;
    var bewegt = !!(kam.fahrt || doc.blaettern || doc.anim);
    var kn = document.getElementById("bild"), cw = kn.clientWidth, ch = kn.clientHeight;
    var ecken = [[-BLATT_B / 2, -BLATT_T / 2], [BLATT_B / 2, -BLATT_T / 2], [BLATT_B / 2, BLATT_T / 2], [-BLATT_B / 2, BLATT_T / 2]].map(function (p) {
      var w = M.punktMal(m, [p[0], 0.0022, p[1]]);
      var v = kam.vpOhneJitter, x = w[0], y = w[1], z = w[2];
      var cx = v[0] * x + v[4] * y + v[8] * z + v[12], cy = v[1] * x + v[5] * y + v[9] * z + v[13], cww = v[3] * x + v[7] * y + v[11] * z + v[15];
      return [(cx / cww * 0.5 + 0.5) * cw, (1 - (cy / cww * 0.5 + 0.5)) * ch];
    });
    var h = homografie(ecken);
    el.style.transform = "matrix3d(" + [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1].join(",") + ")";
    // erst einblenden, wenn die Kamera steht (dann sieht man die Überblendung nicht)
    el.style.opacity = bewegt || LOGIK.ablauf.ansicht !== "dokument" ? 0 : 1;
  };

  E.taste = function (e) {
    if (!E.offen || E.modus !== "entwurf") return false;
    if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && !(e.target.closest && e.target.closest("#editor .segmente"))) {
      E.artikelZeigen(E.artikel + (e.key === "ArrowRight" ? 1 : -1));
      // Fokus nicht verlieren: auf den Reiter des neuen Artikels
      var t = document.querySelector("#editor .ed-tab.aktiv"); if (t && ANSICHT.tastatur !== false) t.focus({ preventScroll: true });
      return true;
    }
    return false;
  };

  return E;
})();
