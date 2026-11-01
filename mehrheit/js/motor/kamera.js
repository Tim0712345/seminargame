/* =====================================================================
   js/motor/kamera.js – Kamerateam: Brennweite, Fahrten, Schärfe ziehen
   ---------------------------------------------------------------------
   Die Kamera ist keine freie Spielkamera. Sie fährt langsam (Dolly),
   schwenkt sanft und „atmet“ ganz leicht. Brennweiten wie beim Film.
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.Kamera = function () {
  var M = MOTOR.m;
  var K = this;
  K.pos = [0, 1.6, 5]; K.ziel = [0, 1, 0]; K.oben = [0, 1, 0];
  K.mm = 35; K.blende = 8; K.fokus = 5; K.fokusZiel = null; K.fokusGeschw = 0;
  K.nah = 0.03; K.fern = 400;
  K.sicht = M.m4(); K.proj = M.m4(); K.projOhneJitter = M.m4(); K.vp = M.m4(); K.invVp = M.m4(); K.invProj = M.m4();
  K.vorherVp = M.m4(); K.vpOhneJitter = M.m4();
  K.jitter = [0, 0]; K.schnitt = true; K.verschiebungY = 0;
  K.wackeln = 0; K.atmen = 1;
  K.fahrt = null;

  /* Halton-Folge für die zeitliche Kantenglättung */
  function halton(i, b) { var f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; }

  K.aktualisieren = function (b, h, bildNr, mitJitter, zeit) {
    K.vorherVp.set(K.vpOhneJitter);
    var asp = b / h;
    // Brennweite → Bildwinkel (Kleinbild, 24 mm hoch). Im Hochformat wird der Winkel weiter.
    var fovy = 2 * Math.atan(12 / K.mm);
    var minAsp = 1.55;
    if (asp < minAsp) fovy = 2 * Math.atan(Math.tan(fovy / 2) * minAsp / asp);
    K.fovy = fovy;
    var pos = K.pos.slice(), ziel = K.ziel.slice();
    // Atmen: wenige Millimeter im Modellmaßstab
    var at = DATA.kameras.atmen;
    if (K.atmen > 0 && at && !MOTOR.bewegungReduziert) {
      var t = zeit || 0, s = at.staerke * K.atmen;
      pos[0] += Math.sin(t * at.tempo * 6.283) * s;
      pos[1] += Math.sin(t * at.tempo * 6.283 * 0.73 + 1.3) * s * 0.6;
      ziel[0] += Math.sin(t * at.tempo * 6.283 * 0.51 + 0.4) * s * 0.5;
    }
    if (K.wackeln > 0.0005) {
      pos[1] += Math.sin((zeit || 0) * 70) * K.wackeln * 0.004;
      ziel[1] += Math.sin((zeit || 0) * 63) * K.wackeln * 0.003;
    }
    M.blick(K.sicht, pos, ziel, K.oben);
    K.augePos = pos;
    M.perspektive(K.projOhneJitter, fovy, asp, K.nah, K.fern);
    K.projOhneJitter[9] += K.verschiebungY;
    K.proj.set(K.projOhneJitter);
    if (mitJitter) {
      var n = (bildNr % 8) + 1;
      K.jitter = [(halton(n, 2) - 0.5) * 2 / b, (halton(n, 3) - 0.5) * 2 / h];
      K.proj[8] += K.jitter[0]; K.proj[9] += K.jitter[1];
    } else K.jitter = [0, 0];
    M.mul(K.vp, K.proj, K.sicht);
    M.mul(K.vpOhneJitter, K.projOhneJitter, K.sicht);
    if (K.schnitt) K.vorherVp.set(K.vpOhneJitter);
    M.invert(K.invVp, K.vp);
    M.invert(K.invProj, K.proj);
  };

  /* Einstellung setzen (sofort, z. B. Schnitt) */
  K.setze = function (e, schnitt) {
    if (e.pos) K.pos = e.pos.slice();
    if (e.ziel) K.ziel = e.ziel.slice();
    if (e.mm) K.mm = e.mm;
    if (e.blende) K.blende = e.blende;
    K.fokus = e.fokus || M.abstand(K.pos, K.ziel);
    K.fokusZiel = null;
    if (schnitt !== false) K.schnitt = true;
    K.fahrt = null;
  };

  /* Sanft zu einer Einstellung fahren (Dolly mit Gewicht) */
  K.fahreZu = function (e, dauer) {
    if (MOTOR.bewegungReduziert) {
      if (MOTOR.post && MOTOR.post.ueberblenden) MOTOR.post.ueberblenden(0.7);
      K.setze(e); return;
    }
    K.fahrt = { art: "zu", von: { pos: K.pos.slice(), ziel: K.ziel.slice(), mm: K.mm, blende: K.blende, fokus: K.fokus },
                nach: { pos: e.pos.slice(), ziel: e.ziel.slice(), mm: e.mm || K.mm, blende: e.blende || K.blende, fokus: e.fokus || M.abstand(e.pos, e.ziel) },
                t: 0, dauer: dauer || 2.2 };
  };

  /* Fahrt entlang einer Punktliste aus data/kameras.js */
  K.starteFahrt = function (daten, schleife) {
    K.fahrt = { art: "pfad", d: daten, t: 0, dauer: daten.punkte[daten.punkte.length - 1].t, schleife: !!schleife };
    K.schnitt = true;
  };

  /* Schärfe ziehen (z. B. vom Papier zum Glasmodell) */
  K.schaerfeZiehen = function (abstand) { K.fokusZiel = abstand; };

  K.schritt = function (dt) {
    var f = K.fahrt;
    if (f) {
      f.t += dt;
      if (f.art === "zu") {
        var u = M.weich(f.t / f.dauer);
        K.pos = M.mix(f.von.pos, f.nach.pos, u);
        K.ziel = M.mix(f.von.ziel, f.nach.ziel, u);
        K.mm = M.lerp(f.von.mm, f.nach.mm, u);
        K.blende = M.lerp(f.von.blende, f.nach.blende, u);
        K.fokus = M.lerp(f.von.fokus, f.nach.fokus, u);
        if (f.t >= f.dauer) { K.fahrt = null; if (f.fertig) f.fertig(); }
      } else if (f.art === "pfad") {
        var P = f.d.punkte, x = Math.min(f.t, f.dauer) / f.dauer;
        // weiche Geschwindigkeit an Anfang und Ende der ganzen Fahrt (Gewicht und Dämpfung)
        var t = f.dauer * M.lerp(x, M.weich(x), 0.65);
        var i = 0; while (i < P.length - 2 && P[i + 1].t <= t) i++;
        var a = P[i], b = P[i + 1];
        var ue = M.klemme((t - a.t) / Math.max(0.001, b.t - a.t), 0, 1);
        var p0 = P[Math.max(0, i - 1)], p3 = P[Math.min(P.length - 1, i + 2)];
        K.pos = M.catmull(p0.pos, a.pos, b.pos, p3.pos, ue);
        K.ziel = M.catmull(p0.ziel, a.ziel, b.ziel, p3.ziel, ue);
        K.mm = M.lerp(a.mm, b.mm, ue);
        K.blende = M.lerp(a.blende || 8, b.blende || 8, ue);
        var fa = a.fokus || M.abstand(a.pos, a.ziel), fb = b.fokus || M.abstand(b.pos, b.ziel);
        K.fokus = M.lerp(fa, fb, ue);
        if (f.t >= f.dauer) { K.fahrt = null; if (f.fertig) f.fertig(); }
      }
    }
    if (K.fokusZiel !== null && !f) {
      var r = M.feder(K.fokus, K.fokusZiel, K.fokusGeschw, dt, 4.0);
      K.fokus = r.wert; K.fokusGeschw = r.geschw;
    }
    K.wackeln *= Math.exp(-dt * 7);
  };
};
