/* =====================================================================
   Die Lücke – Engine: Mathe (Vektoren, Matrizen, Hilfsfunktionen)
   Matrizen sind Float32Array(16), spaltenweise wie in WebGL.
   ===================================================================== */
var ENG = window.ENG = window.ENG || {};

ENG.math = (function () {
  "use strict";
  var M = {};
  M.DEG = Math.PI / 180;

  // ---------------- Skalare ----------------
  M.clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  M.lerp = function (a, b, t) { return a + (b - a) * t; };
  // Bildratenunabhängiges Annähern (je größer lambda, desto schneller)
  M.damp = function (a, b, lambda, dt) { return a + (b - a) * (1 - Math.exp(-lambda * dt)); };
  M.angleDiff = function (a, b) {
    var d = (b - a) % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
  };
  M.dampAngle = function (a, b, lambda, dt) { return a + M.angleDiff(a, b) * (1 - Math.exp(-lambda * dt)); };
  M.smoothstep = function (a, b, x) { var t = M.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  M.easeOutBack = function (t) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  M.easeInOut = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

  // Deterministischer Zufall
  M.hash2 = function (x, y) {
    var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  };
  M.rng = function (seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // "#rrggbb" -> [r, g, b] (0…1)
  M.hex = function (h) {
    if (typeof h !== "string") return h;
    h = h.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  // ---------------- mat4 ----------------
  M.m4 = function () { var m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; };
  M.m4identity = function (o) {
    for (var i = 0; i < 16; i++) o[i] = 0;
    o[0] = o[5] = o[10] = o[15] = 1;
    return o;
  };
  M.m4copy = function (o, a) { for (var i = 0; i < 16; i++) o[i] = a[i]; return o; };

  M.m4mul = function (o, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    for (var i = 0; i < 4; i++) {
      var b0 = b[i * 4], b1 = b[i * 4 + 1], b2 = b[i * 4 + 2], b3 = b[i * 4 + 3];
      o[i * 4]     = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      o[i * 4 + 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      o[i * 4 + 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      o[i * 4 + 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    }
    return o;
  };

  M.m4perspective = function (o, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    for (var i = 0; i < 16; i++) o[i] = 0;
    o[0] = f / aspect; o[5] = f;
    o[10] = (far + near) * nf; o[11] = -1;
    o[14] = 2 * far * near * nf;
    return o;
  };

  M.m4lookAt = function (o, eye, c, up) {
    var z0 = eye[0] - c[0], z1 = eye[1] - c[1], z2 = eye[2] - c[2];
    var l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= l; z1 *= l; z2 *= l;
    var x0 = up[1] * z2 - up[2] * z1, x1 = up[2] * z0 - up[0] * z2, x2 = up[0] * z1 - up[1] * z0;
    l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (l) { l = 1 / l; x0 *= l; x1 *= l; x2 *= l; }
    var y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;
    o[0] = x0; o[1] = y0; o[2] = z0; o[3] = 0;
    o[4] = x1; o[5] = y1; o[6] = z1; o[7] = 0;
    o[8] = x2; o[9] = y2; o[10] = z2; o[11] = 0;
    o[12] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]);
    o[13] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]);
    o[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]);
    o[15] = 1;
    return o;
  };

  M.m4invert = function (o, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return null;
    det = 1 / det;
    o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return o;
  };

  /* Verschieben * Drehen (Ry * Rx * Rz, Bogenmaß) * Skalieren */
  M.m4compose = function (o, tx, ty, tz, rx, ry, rz, sx, sy, sz) {
    var cx = Math.cos(rx), sxr = Math.sin(rx),
        cy = Math.cos(ry), syr = Math.sin(ry),
        cz = Math.cos(rz), szr = Math.sin(rz);
    var r00 = cy * cz + syr * sxr * szr, r01 = -cy * szr + syr * sxr * cz, r02 = syr * cx;
    var r10 = cx * szr,                  r11 = cx * cz,                    r12 = -sxr;
    var r20 = -syr * cz + cy * sxr * szr, r21 = syr * szr + cy * sxr * cz, r22 = cy * cx;
    o[0] = r00 * sx; o[1] = r10 * sx; o[2] = r20 * sx; o[3] = 0;
    o[4] = r01 * sy; o[5] = r11 * sy; o[6] = r21 * sy; o[7] = 0;
    o[8] = r02 * sz; o[9] = r12 * sz; o[10] = r22 * sz; o[11] = 0;
    o[12] = tx; o[13] = ty; o[14] = tz; o[15] = 1;
    return o;
  };

  /* Drehen/Skalieren um einen Drehpunkt p, danach um t verschieben:
     T(p + t) * R * S * T(-p)                                          */
  M.m4pivot = function (o, px, py, pz, rx, ry, rz, sx, sy, sz, tx, ty, tz) {
    M.m4compose(o, px + tx, py + ty, pz + tz, rx, ry, rz, sx, sy, sz);
    o[12] -= o[0] * px + o[4] * py + o[8] * pz;
    o[13] -= o[1] * px + o[5] * py + o[9] * pz;
    o[14] -= o[2] * px + o[6] * py + o[10] * pz;
    return o;
  };

  // Normalenmatrix (inverse Transponierte des 3x3-Teils) -> Float32Array(9)
  M.m3normal = function (o, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2],
        a10 = a[4], a11 = a[5], a12 = a[6],
        a20 = a[8], a21 = a[9], a22 = a[10];
    var b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20;
    var det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) { o[0] = o[4] = o[8] = 1; o[1] = o[2] = o[3] = o[5] = o[6] = o[7] = 0; return o; }
    det = 1 / det;
    var i0 = b01 * det, i1 = (-a22 * a01 + a02 * a21) * det, i2 = (a12 * a01 - a02 * a11) * det,
        i3 = b11 * det, i4 = (a22 * a00 - a02 * a20) * det, i5 = (-a12 * a00 + a02 * a10) * det,
        i6 = b21 * det, i7 = (-a21 * a00 + a01 * a20) * det, i8 = (a11 * a00 - a01 * a10) * det;
    o[0] = i0; o[1] = i3; o[2] = i6;
    o[3] = i1; o[4] = i4; o[5] = i7;
    o[6] = i2; o[7] = i5; o[8] = i8;
    return o;
  };

  // ---------------- Sichtbarkeit (Frustum) ----------------
  M.frustum = function (pl, m) {
    var r = [
      [m[3] + m[0], m[7] + m[4], m[11] + m[8], m[15] + m[12]],
      [m[3] - m[0], m[7] - m[4], m[11] - m[8], m[15] - m[12]],
      [m[3] + m[1], m[7] + m[5], m[11] + m[9], m[15] + m[13]],
      [m[3] - m[1], m[7] - m[5], m[11] - m[9], m[15] - m[13]],
      [m[3] + m[2], m[7] + m[6], m[11] + m[10], m[15] + m[14]],
      [m[3] - m[2], m[7] - m[6], m[11] - m[10], m[15] - m[14]]
    ];
    for (var i = 0; i < 6; i++) {
      var l = Math.sqrt(r[i][0] * r[i][0] + r[i][1] * r[i][1] + r[i][2] * r[i][2]) || 1;
      pl[i * 4] = r[i][0] / l; pl[i * 4 + 1] = r[i][1] / l; pl[i * 4 + 2] = r[i][2] / l; pl[i * 4 + 3] = r[i][3] / l;
    }
    return pl;
  };

  // Achsenparallele Box sichtbar? (dy verschiebt die Box nach unten, für die Weltkrümmung)
  M.boxVisible = function (pl, x0, y0, z0, x1, y1, z1) {
    for (var i = 0; i < 6; i++) {
      var a = pl[i * 4], b = pl[i * 4 + 1], c = pl[i * 4 + 2], d = pl[i * 4 + 3];
      var px = a > 0 ? x1 : x0, py = b > 0 ? y1 : y0, pz = c > 0 ? z1 : z0;
      if (a * px + b * py + c * pz + d < 0) return false;
    }
    return true;
  };

  // Weltpunkt -> Bildschirm (CSS-Pixel). Gibt false zurück, wenn hinter der Kamera.
  M.project = function (out, m, x, y, z, w, h) {
    var cx = m[0] * x + m[4] * y + m[8] * z + m[12];
    var cy = m[1] * x + m[5] * y + m[9] * z + m[13];
    var cw = m[3] * x + m[7] * y + m[11] * z + m[15];
    if (cw <= 0.0001) return false;
    out[0] = (cx / cw * 0.5 + 0.5) * w;
    out[1] = (1 - (cy / cw * 0.5 + 0.5)) * h;
    return true;
  };

  return M;
})();
