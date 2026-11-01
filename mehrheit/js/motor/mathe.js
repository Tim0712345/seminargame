/* =====================================================================
   js/motor/mathe.js – Vektoren, Matrizen, Quaternionen, Rauschen
   Matrizen sind Float32Array(16), spaltenweise (wie WebGL).
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.m = (function () {
  var M = {};
  var GRAD = Math.PI / 180;
  M.GRAD = GRAD;

  /* ---------- Vektoren (einfache Arrays [x,y,z]) ---------- */
  M.v3 = function (x, y, z) { return [x || 0, y || 0, z || 0]; };
  M.plus = function (a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; };
  M.minus = function (a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; };
  M.mal = function (a, s) { return [a[0] * s, a[1] * s, a[2] * s]; };
  M.punkt = function (a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; };
  M.kreuz = function (a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; };
  M.laenge = function (a) { return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]); };
  M.norm = function (a) { var l = M.laenge(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  M.mix = function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
  M.abstand = function (a, b) { return M.laenge(M.minus(a, b)); };
  M.klemme = function (x, a, b) { return x < a ? a : (x > b ? b : x); };
  M.glatt = function (a, b, x) { var t = M.klemme((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  M.weich = function (t) { t = M.klemme(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
  M.lerp = function (a, b, t) { return a + (b - a) * t; };

  /* ---------- Matrizen ---------- */
  M.m4 = function () { var m = new Float32Array(16); m[0] = m[5] = m[10] = m[15] = 1; return m; };
  M.kopie = function (a) { return new Float32Array(a); };
  M.einheit = function (o) { o.fill(0); o[0] = o[5] = o[10] = o[15] = 1; return o; };

  M.mul = function (o, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    for (var i = 0; i < 4; i++) {
      var b0 = b[i * 4], b1 = b[i * 4 + 1], b2 = b[i * 4 + 2], b3 = b[i * 4 + 3];
      o[i * 4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      o[i * 4 + 1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      o[i * 4 + 2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      o[i * 4 + 3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    }
    return o;
  };

  M.perspektive = function (o, fovy, aspekt, nah, fern) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (nah - fern);
    o.fill(0);
    o[0] = f / aspekt; o[5] = f; o[10] = (fern + nah) * nf; o[11] = -1; o[14] = 2 * fern * nah * nf;
    return o;
  };

  M.ortho = function (o, l, r, u, ob, n, f) {
    o.fill(0);
    o[0] = 2 / (r - l); o[5] = 2 / (ob - u); o[10] = -2 / (f - n);
    o[12] = -(r + l) / (r - l); o[13] = -(ob + u) / (ob - u); o[14] = -(f + n) / (f - n); o[15] = 1;
    return o;
  };

  M.blick = function (o, auge, ziel, oben) {
    var z = M.norm(M.minus(auge, ziel));
    var x = M.kreuz(oben || [0, 1, 0], z);
    if (M.laenge(x) < 1e-6) x = M.kreuz([0, 0, 1], z);
    x = M.norm(x);
    var y = M.kreuz(z, x);
    o[0] = x[0]; o[1] = y[0]; o[2] = z[0]; o[3] = 0;
    o[4] = x[1]; o[5] = y[1]; o[6] = z[1]; o[7] = 0;
    o[8] = x[2]; o[9] = y[2]; o[10] = z[2]; o[11] = 0;
    o[12] = -M.punkt(x, auge); o[13] = -M.punkt(y, auge); o[14] = -M.punkt(z, auge); o[15] = 1;
    return o;
  };

  M.invert = function (o, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3], a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11], a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) return M.einheit(o);
    det = 1 / det;
    o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det; o[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    o[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det; o[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    o[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det; o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    o[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det; o[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    o[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det; o[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det; o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det; o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det; o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return o;
  };

  /* Verschiebung, Drehung (Grad um Y), Skalierung */
  M.trs = function (o, pos, drehY, skala) {
    var c = Math.cos((drehY || 0) * GRAD), s = Math.sin((drehY || 0) * GRAD), k = skala || 1;
    o.fill(0);
    o[0] = c * k; o[2] = -s * k; o[5] = k; o[8] = s * k; o[10] = c * k; o[15] = 1;
    o[12] = pos[0]; o[13] = pos[1]; o[14] = pos[2];
    return o;
  };

  /* Matrix aus Quaternion + Position + Skalierung (Vektor) */
  M.ausQuat = function (o, q, pos, sk) {
    var x = q[0], y = q[1], z = q[2], w = q[3], sx = sk ? sk[0] : 1, sy = sk ? sk[1] : 1, sz = sk ? sk[2] : 1;
    var x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2,
        wx = w * x2, wy = w * y2, wz = w * z2;
    o[0] = (1 - (yy + zz)) * sx; o[1] = (xy + wz) * sx; o[2] = (xz - wy) * sx; o[3] = 0;
    o[4] = (xy - wz) * sy; o[5] = (1 - (xx + zz)) * sy; o[6] = (yz + wx) * sy; o[7] = 0;
    o[8] = (xz + wy) * sz; o[9] = (yz - wx) * sz; o[10] = (1 - (xx + yy)) * sz; o[11] = 0;
    o[12] = pos ? pos[0] : 0; o[13] = pos ? pos[1] : 0; o[14] = pos ? pos[2] : 0; o[15] = 1;
    return o;
  };

  M.punktMal = function (m, v) {
    var x = v[0], y = v[1], z = v[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    return [(m[0] * x + m[4] * y + m[8] * z + m[12]) / w, (m[1] * x + m[5] * y + m[9] * z + m[13]) / w, (m[2] * x + m[6] * y + m[10] * z + m[14]) / w];
  };
  M.richtungMal = function (m, v) {
    return [m[0] * v[0] + m[4] * v[1] + m[8] * v[2], m[1] * v[0] + m[5] * v[1] + m[9] * v[2], m[2] * v[0] + m[6] * v[1] + m[10] * v[2]];
  };

  /* ---------- Quaternionen [x,y,z,w] ---------- */
  M.quat = function () { return [0, 0, 0, 1]; };
  M.quatMul = function (a, b) {
    return [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
            a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
            a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
            a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
  };
  M.quatAchse = function (achse, winkel) {
    var h = winkel * 0.5, s = Math.sin(h);
    return [achse[0] * s, achse[1] * s, achse[2] * s, Math.cos(h)];
  };
  /* Euler in Grad [x,y,z], Reihenfolge: erst Y (drehen), dann X (beugen), dann Z (seitlich) */
  M.quatEuler = function (e) {
    var qy = M.quatAchse([0, 1, 0], (e[1] || 0) * GRAD);
    var qx = M.quatAchse([1, 0, 0], (e[0] || 0) * GRAD);
    var qz = M.quatAchse([0, 0, 1], (e[2] || 0) * GRAD);
    return M.quatMul(M.quatMul(qy, qx), qz);
  };
  M.quatDreh = function (q, v) {
    var x = v[0], y = v[1], z = v[2], qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
    return [ix * qw + iw * -qx + iy * -qz - iz * -qy, iy * qw + iw * -qy + iz * -qx - ix * -qz, iz * qw + iw * -qz + ix * -qy - iy * -qx];
  };

  /* ---------- Kurven ---------- */
  M.catmull = function (p0, p1, p2, p3, t) {
    var t2 = t * t, t3 = t2 * t, r = [];
    for (var i = 0; i < 3; i++) {
      r[i] = 0.5 * ((2 * p1[i]) + (-p0[i] + p2[i]) * t + (2 * p0[i] - 5 * p1[i] + 4 * p2[i] - p3[i]) * t2 + (-p0[i] + 3 * p1[i] - 3 * p2[i] + p3[i]) * t3);
    }
    return r;
  };

  /* Feder mit kritischer Dämpfung (weiche Bewegung mit Gewicht) */
  M.feder = function (wert, ziel, geschw, dt, haerte) {
    var w = haerte || 6, x = wert - ziel;
    var t = (geschw + w * x) * dt;
    var e = Math.exp(-w * dt);
    return { wert: ziel + (x + t) * e, geschw: (geschw - w * t) * e };
  };

  /* ---------- Zufall und Rauschen (deterministisch) ---------- */
  M.zufall = function (saat) {
    var s = (saat >>> 0) || 1;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  M.hash = function (x, y) {
    var h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  };
  M.rauschen1 = function (x) {
    var i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return M.lerp(M.hash(i, 0.5), M.hash(i + 1, 0.5), u) * 2 - 1;
  };

  /* Farbe: "#rrggbb" → linear [r,g,b] */
  M.farbe = function (hex) {
    if (Array.isArray(hex)) return hex;
    var h = (hex || "#ffffff").replace("#", "");
    var r = parseInt(h.substr(0, 2), 16) / 255, g = parseInt(h.substr(2, 2), 16) / 255, b = parseInt(h.substr(4, 2), 16) / 255;
    function lin(c) { return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
    return [lin(r), lin(g), lin(b)];
  };
  M.farbeSRGB = function (hex) {
    var h = (hex || "#ffffff").replace("#", "");
    return [parseInt(h.substr(0, 2), 16) / 255, parseInt(h.substr(2, 2), 16) / 255, parseInt(h.substr(4, 2), 16) / 255];
  };
  /* Farbtemperatur in Kelvin → lineare Farbe (Näherung nach Tanner Helland) */
  M.kelvin = function (k) {
    var t = k / 100, r, g, b;
    if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; }
    else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); }
    if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = 138.5177312231 * Math.log(t - 10) - 305.0447927307;
    function lin(c) { c = M.klemme(c, 0, 255) / 255; return Math.pow(c, 2.2); }
    return [lin(r), lin(g), lin(b)];
  };

  return M;
})();
