/* =====================================================================
   Die Lücke – Engine: prozedurale Texturen
   ---------------------------------------------------------------------
   1) Detail-Textur (256×256, kachelbar). Jeder Farbkanal ein Muster:
        R = Gras   G = Pflaster   B = Holz   A = Kopfstein
      Die Muster sind grau und hellen/dunkeln die Grundfarbe nur ab.
   2) Gesichts-Atlas (512×1024): Augen- und Mundformen der Figuren.
   3) Weicher Kreis: für Blob-Schatten und Staubwölkchen.
   Alles wird hier im Code gezeichnet – keine Bilddateien.
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.textures = (function () {
  "use strict";
  var T = { detail: null, gesicht: null, weich: null, rects: { augen: {}, muender: {} } };
  var S = 256;
  var M = ENG.math;

  function leinwand(w, h) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    return c;
  }
  function rundRechteck(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function ellipse(ctx, x, y, rx, ry) {
    ctx.beginPath();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(rx, ry);
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.restore();
    ctx.closePath();
  }
  // Zeichnet eine Form an allen Kachel-Nachbarpositionen, damit das Muster nahtlos ist
  function kachelbar(x, y, rad, fn) {
    for (var dx = -S; dx <= S; dx += S) {
      for (var dy = -S; dy <= S; dy += S) {
        var px = x + dx, py = y + dy;
        if (px + rad < 0 || px - rad > S || py + rad < 0 || py - rad > S) continue;
        fn(px, py);
      }
    }
  }
  function grau(v, a) {
    v = Math.max(0, Math.min(255, Math.round(v)));
    return a === undefined ? "rgb(" + v + "," + v + "," + v + ")" : "rgba(" + v + "," + v + "," + v + "," + a + ")";
  }
  // Kachelbares Werte-Rauschen
  function rauschen(zellen, seed) {
    var r = M.rng(seed), g = [];
    for (var i = 0; i < zellen * zellen; i++) g.push(r());
    function v(i, j) {
      i = ((i % zellen) + zellen) % zellen;
      j = ((j % zellen) + zellen) % zellen;
      return g[i + j * zellen];
    }
    return function (x, y) {
      var fx = x / S * zellen, fy = y / S * zellen;
      var ix = Math.floor(fx), iy = Math.floor(fy);
      var tx = fx - ix, ty = fy - iy;
      tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
      return M.lerp(M.lerp(v(ix, iy), v(ix + 1, iy), tx), M.lerp(v(ix, iy + 1), v(ix + 1, iy + 1), tx), ty);
    };
  }
  function pixelFlaeche(fn) {
    var c = leinwand(S, S), ctx = c.getContext("2d");
    var img = ctx.createImageData(S, S), d = img.data;
    for (var y = 0; y < S; y++) {
      for (var x = 0; x < S; x++) {
        var v = Math.max(0, Math.min(255, fn(x, y)));
        var i = (x + y * S) * 4;
        d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c;
  }

  // ---------------- Muster ----------------
  function musterGras() {
    var n1 = rauschen(4, 11), n2 = rauschen(16, 12), n3 = rauschen(64, 13);
    var c = pixelFlaeche(function (x, y) {
      return 122 + (n1(x, y) - 0.5) * 50 + (n2(x, y) - 0.5) * 34 + (n3(x, y) - 0.5) * 20;
    });
    var ctx = c.getContext("2d"), r = M.rng(21);
    ctx.lineCap = "round";
    for (var i = 0; i < 1100; i++) {
      var x = r() * S, y = r() * S, len = 4 + r() * 8;
      var ang = -Math.PI / 2 + (r() - 0.5) * 0.9;
      ctx.strokeStyle = r() < 0.5 ? "rgba(255,255,255,0.24)" : "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1.2 + r() * 1.4;
      kachelbar(x, y, 14, function (px, py) {
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(ang) * len, py + Math.sin(ang) * len);
        ctx.stroke();
      });
    }
    return c;
  }

  function musterPflaster() {
    var c = leinwand(S, S), ctx = c.getContext("2d"), r = M.rng(31);
    ctx.fillStyle = grau(78);
    ctx.fillRect(0, 0, S, S);
    var gr = 64, luecke = 5;
    for (var row = 0; row < 4; row++) {
      var off = (row % 2) * 32;
      for (var col = 0; col < 4; col++) {
        var v = 158 + (r() - 0.5) * 44;
        kachelbar(col * gr + off + gr / 2, row * gr + gr / 2, 40, function (px, py) {
          rundRechteck(ctx, px - gr / 2 + luecke / 2, py - gr / 2 + luecke / 2, gr - luecke, gr - luecke, 9);
          ctx.fillStyle = grau(v);
          ctx.fill();
          rundRechteck(ctx, px - gr / 2 + luecke, py - gr / 2 + luecke, gr - luecke * 2.4, gr - luecke * 2.4, 7);
          ctx.fillStyle = grau(v + 14, 0.5);
          ctx.fill();
        });
      }
    }
    for (var i = 0; i < 1400; i++) {
      ctx.fillStyle = r() < 0.5 ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)";
      ctx.fillRect(Math.floor(r() * S), Math.floor(r() * S), 2, 2);
    }
    return c;
  }

  function musterHolz() {
    var n = rauschen(8, 51), r = M.rng(52), streifen = [], fugen = [], basis = [];
    for (var y = 0; y < S; y++) streifen.push((r() - 0.5) * 22);
    for (var p = 0; p < 8; p++) { fugen.push(Math.floor(r() * S)); basis.push(140 + (r() - 0.5) * 34); }
    return pixelFlaeche(function (x, y) {
      var brett = Math.floor(y / 32), lokal = y % 32;
      var v = basis[brett] + streifen[y] + Math.sin((x / S) * Math.PI * 4 + brett * 1.7 + lokal * 0.33) * 7 + (n(x, y) - 0.5) * 16;
      if (lokal < 2) v *= 0.55;
      var dx = Math.abs(x - fugen[brett]);
      if (dx < 1.5 || dx > S - 1.5) v *= 0.6;
      return v;
    });
  }

  function musterKopfstein() {
    var c = leinwand(S, S), ctx = c.getContext("2d"), r = M.rng(41);
    ctx.fillStyle = grau(82);
    ctx.fillRect(0, 0, S, S);
    var n = 8, zelle = S / n;
    for (var j = 0; j < n; j++) {
      for (var i = 0; i < n; i++) {
        var cx = i * zelle + zelle / 2 + (r() - 0.5) * 6;
        var cy = j * zelle + zelle / 2 + (r() - 0.5) * 6;
        var rx = 12.5 + r() * 2.5, ry = 11.5 + r() * 2.5, v = 150 + (r() - 0.5) * 56;
        kachelbar(cx, cy, 18, function (px, py) {
          ellipse(ctx, px, py, rx, ry);
          ctx.fillStyle = grau(v);
          ctx.fill();
          ellipse(ctx, px - 3, py - 3, rx * 0.6, ry * 0.55);
          ctx.fillStyle = grau(v + 24, 0.45);
          ctx.fill();
        });
      }
    }
    return c;
  }

  function detailTextur() {
    var kanaele = [musterGras(), musterPflaster(), musterHolz(), musterKopfstein()];
    var out = new Uint8Array(S * S * 4);
    for (var k = 0; k < 4; k++) {
      var d = kanaele[k].getContext("2d").getImageData(0, 0, S, S).data;
      for (var i = 0; i < S * S; i++) out[i * 4 + k] = d[i * 4];
    }
    return out;
  }

  // ---------------- Gesichter ----------------
  var AUGE = "#2f2727", MUND = "#6e3b3b", ZUNGE = "#f09c9c";
  var AUGEN_LISTE = ["offen", "zu", "froehlich", "ueberrascht", "skeptisch", "nachdenklich"];
  var MUND_LISTE = ["laecheln", "neutral", "grinsen", "o", "schief", "sprechen", "hmm", "offen"];

  function strich(ctx, breite) {
    ctx.strokeStyle = AUGE;
    ctx.lineWidth = breite;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  }
  function glanz(ctx, x, y, gross) {
    ctx.fillStyle = "#ffffff";
    ellipse(ctx, x - 7 * gross, y - 10 * gross, 7 * gross, 8 * gross); ctx.fill();
    ellipse(ctx, x + 7 * gross, y + 11 * gross, 3.2 * gross, 3.2 * gross); ctx.fill();
  }
  function wange(ctx, x, y) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, 24);
    g.addColorStop(0, "rgba(255,125,115,0.5)");
    g.addColorStop(0.6, "rgba(255,125,115,0.25)");
    g.addColorStop(1, "rgba(255,125,115,0)");
    ctx.fillStyle = g;
    ctx.save();
    ctx.translate(x, y); ctx.scale(1, 0.55); ctx.translate(-x, -y);
    ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function auge(ctx, x, y, typ, rechts) {
    ctx.fillStyle = AUGE;
    switch (typ) {
      case "zu":
        ctx.beginPath(); ctx.moveTo(x - 24, y + 2); ctx.quadraticCurveTo(x, y + 18, x + 24, y + 2);
        strich(ctx, 8); break;
      case "froehlich":
        ctx.beginPath(); ctx.moveTo(x - 24, y + 10); ctx.quadraticCurveTo(x, y - 22, x + 24, y + 10);
        strich(ctx, 9); break;
      case "ueberrascht":
        ellipse(ctx, x, y - 2, 30, 38); ctx.fill();
        glanz(ctx, x, y - 3, 1.45);
        ctx.beginPath(); ctx.moveTo(x - 18, y - 47); ctx.quadraticCurveTo(x, y - 57, x + 18, y - 47);
        strich(ctx, 5); break;
      case "skeptisch":
        ctx.save();
        ctx.beginPath(); ctx.rect(x - 40, y - 8, 80, 60); ctx.clip();
        ellipse(ctx, x, y, 26, 34); ctx.fill();
        ctx.fillStyle = "#ffffff";
        ellipse(ctx, x - 8, y + 2, 7, 5); ctx.fill();
        ctx.restore();
        ctx.beginPath(); ctx.moveTo(x - 27, y - 8); ctx.lineTo(x + 27, y - 8); strich(ctx, 6);
        ctx.beginPath();
        if (rechts) { ctx.moveTo(x - 18, y - 34); ctx.lineTo(x + 18, y - 46); }
        else { ctx.moveTo(x - 18, y - 22); ctx.lineTo(x + 18, y - 21); }
        strich(ctx, 6); break;
      case "nachdenklich":
        ellipse(ctx, x + 4, y - 3, 24, 31); ctx.fill();
        ctx.fillStyle = "#ffffff";
        ellipse(ctx, x + 10, y - 16, 8, 9); ctx.fill();
        if (rechts) { ctx.beginPath(); ctx.moveTo(x - 15, y - 44); ctx.quadraticCurveTo(x + 2, y - 52, x + 19, y - 46); strich(ctx, 6); }
        break;
      default: // offen
        ellipse(ctx, x, y, 26, 34); ctx.fill();
        glanz(ctx, x, y, 1.3);
    }
  }

  function mund(ctx, x, y, typ) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(1.4, 1.4); ctx.translate(-x, -y);
    mundForm(ctx, x, y, typ);
    ctx.restore();
  }
  function mundForm(ctx, x, y, typ) {
    ctx.fillStyle = MUND;
    ctx.strokeStyle = MUND;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    function zunge(zx, zy, rx, ry) {
      ctx.save(); ctx.clip();
      ctx.fillStyle = ZUNGE; ellipse(ctx, zx, zy, rx, ry); ctx.fill();
      ctx.restore();
    }
    switch (typ) {
      case "neutral":
        ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.quadraticCurveTo(x, y + 4, x + 12, y); ctx.stroke(); break;
      case "grinsen":
        ctx.beginPath(); ctx.moveTo(x - 22, y - 6); ctx.lineTo(x + 22, y - 6); ctx.quadraticCurveTo(x, y + 30, x - 22, y - 6);
        ctx.fill(); zunge(x, y + 13, 12, 7); break;
      case "o":
        ellipse(ctx, x, y + 2, 9, 12); ctx.fill(); zunge(x, y + 10, 6, 4); break;
      case "schief":
        ctx.beginPath(); ctx.moveTo(x - 16, y + 2); ctx.bezierCurveTo(x - 6, y - 6, x + 4, y + 8, x + 16, y - 4); ctx.stroke(); break;
      case "sprechen":
        ellipse(ctx, x, y + 1, 12, 9); ctx.fill(); zunge(x, y + 7, 7, 4); break;
      case "hmm":
        ctx.beginPath(); ctx.moveTo(x - 7, y + 2); ctx.lineTo(x + 11, y - 1); ctx.stroke(); break;
      case "offen":
        ctx.beginPath(); ctx.moveTo(x - 16, y - 4); ctx.lineTo(x + 16, y - 4); ctx.quadraticCurveTo(x, y + 22, x - 16, y - 4);
        ctx.fill(); zunge(x, y + 8, 8, 5); break;
      default: // laecheln
        ctx.beginPath(); ctx.moveTo(x - 18, y - 4); ctx.quadraticCurveTo(x, y + 14, x + 18, y - 4); ctx.stroke();
    }
  }

  function gesichtsAtlas() {
    var W = 512, H = 1024, c = leinwand(W, H), ctx = c.getContext("2d");
    var i;
    for (i = 0; i < AUGEN_LISTE.length; i++) {
      var ox = (i % 2) * 256, oy = Math.floor(i / 2) * 128;
      wange(ctx, ox + 30, oy + 102);
      wange(ctx, ox + 226, oy + 102);
      auge(ctx, ox + 74, oy + 62, AUGEN_LISTE[i], false);
      auge(ctx, ox + 182, oy + 62, AUGEN_LISTE[i], true);
      T.rects.augen[AUGEN_LISTE[i]] = [(ox + 1) / W, (oy + 1) / H, 254 / W, 126 / H];
    }
    for (i = 0; i < MUND_LISTE.length; i++) {
      var mx = (i % 4) * 128, my = 512 + Math.floor(i / 4) * 128;
      mund(ctx, mx + 64, my + 40, MUND_LISTE[i]);
      T.rects.muender[MUND_LISTE[i]] = [(mx + 1) / W, (my + 1) / H, 126 / W, 126 / H];
    }
    return c;
  }

  function weicherKreis() {
    var c = leinwand(64, 64), ctx = c.getContext("2d");
    var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 31);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.5, "rgba(255,255,255,0.75)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return c;
  }

  T.init = function () {
    T.detail = ENG.gl.texture(detailTextur(), { breite: S, hoehe: S, wiederholen: true, mipmap: true, anisotrop: true });
    T.gesicht = ENG.gl.texture(gesichtsAtlas(), { mipmap: true });
    T.weich = ENG.gl.texture(weicherKreis(), { mipmap: true });
  };

  T.augen = function (name) { return T.rects.augen[name] || T.rects.augen.offen; };
  T.mund = function (name) { return T.rects.muender[name] || T.rects.muender.laecheln; };

  return T;
})();
