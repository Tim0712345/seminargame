/* =====================================================================
   js/motor/inflate.js – Entpacken von „raw deflate“-Daten (RFC 1951)
   ---------------------------------------------------------------------
   Eigene kleine Umsetzung (nach dem Aufbau von zlibs „puff“), damit die
   Menschen-Netze komprimiert in einer Skriptdatei liegen können und
   ohne fetch/XHR und ohne Browser-Sonderfunktionen entpackt werden.
   MOTOR.inflate(bytes, ausLaenge) → Uint8Array
   MOTOR.base64(text) → Uint8Array
   ===================================================================== */
var MOTOR = window.MOTOR || {};

MOTOR.inflate = (function () {
  var LBASIS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258];
  var LEXTRA = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  var DBASIS = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  var DEXTRA = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  var REIHE = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

  /* Kanonischer Huffman-Baum aus Codelängen: Anzahl je Länge + Symbole sortiert */
  function baum(laengen, von, n) {
    var anz = new Uint16Array(16), off = new Uint16Array(16), sym = new Uint16Array(n);
    for (var i = 0; i < n; i++) anz[laengen[von + i]]++;
    anz[0] = 0;
    for (i = 1; i < 16; i++) off[i] = off[i - 1] + anz[i - 1];
    for (i = 0; i < n; i++) if (laengen[von + i]) sym[off[laengen[von + i]]++] = i;
    return { anz: anz, sym: sym };
  }
  var festL = null, festD = null;
  function feste() {
    if (festL) return;
    var l = new Uint8Array(288), i;
    for (i = 0; i < 144; i++) l[i] = 8;
    for (; i < 256; i++) l[i] = 9;
    for (; i < 280; i++) l[i] = 7;
    for (; i < 288; i++) l[i] = 8;
    festL = baum(l, 0, 288);
    var d = new Uint8Array(30);
    for (i = 0; i < 30; i++) d[i] = 5;
    festD = baum(d, 0, 30);
  }

  return function (ein, ausLaenge) {
    var aus = new Uint8Array(ausLaenge), op = 0, ip = 0, puffer = 0, nb = 0;
    function bits(n) {
      while (nb < n) { puffer |= ein[ip++] << nb; nb += 8; }
      var v = puffer & ((1 << n) - 1);
      puffer >>>= n; nb -= n;
      return v;
    }
    function lies(b) {
      var code = 0, erst = 0, index = 0;
      for (var len = 1; len < 16; len++) {
        code |= bits(1);
        var c = b.anz[len];
        if (code - c < erst) return b.sym[index + (code - erst)];
        index += c; erst += c; erst <<= 1; code <<= 1;
      }
      throw new Error("inflate: ungültiger Code");
    }
    var letzter;
    do {
      letzter = bits(1);
      var typ = bits(2);
      if (typ === 0) {
        puffer = 0; nb = 0;
        var len = ein[ip] | (ein[ip + 1] << 8); ip += 4;
        aus.set(ein.subarray(ip, ip + len), op); ip += len; op += len;
        continue;
      }
      var L, D;
      if (typ === 1) { feste(); L = festL; D = festD; }
      else {
        var hlit = bits(5) + 257, hdist = bits(5) + 1, hclen = bits(4) + 4;
        var cl = new Uint8Array(19);
        for (var i = 0; i < hclen; i++) cl[REIHE[i]] = bits(3);
        var cb = baum(cl, 0, 19);
        var laengen = new Uint8Array(hlit + hdist), k = 0;
        while (k < hlit + hdist) {
          var s = lies(cb);
          if (s < 16) laengen[k++] = s;
          else {
            var w = 0, r;
            if (s === 16) { w = laengen[k - 1]; r = 3 + bits(2); }
            else if (s === 17) r = 3 + bits(3);
            else r = 11 + bits(7);
            while (r--) laengen[k++] = w;
          }
        }
        L = baum(laengen, 0, hlit); D = baum(laengen, hlit, hdist);
      }
      for (;;) {
        var sym = lies(L);
        if (sym < 256) aus[op++] = sym;
        else if (sym === 256) break;
        else {
          sym -= 257;
          var l = LBASIS[sym] + bits(LEXTRA[sym]);
          var ds = lies(D);
          var dist = DBASIS[ds] + bits(DEXTRA[ds]);
          for (var j = 0; j < l; j++) { aus[op] = aus[op - dist]; op++; }
        }
      }
    } while (!letzter);
    return aus;
  };
})();

MOTOR.base64 = function (text) {
  var tab = new Uint8Array(128), z = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0; i < 64; i++) tab[z.charCodeAt(i)] = i;
  var n = text.length, pad = text[n - 1] === "=" ? (text[n - 2] === "=" ? 2 : 1) : 0;
  var aus = new Uint8Array(n * 3 / 4 - pad), o = 0;
  for (i = 0; i < n; i += 4) {
    var a = tab[text.charCodeAt(i)], b = tab[text.charCodeAt(i + 1)], c = tab[text.charCodeAt(i + 2)], d = tab[text.charCodeAt(i + 3)];
    var v = (a << 18) | (b << 12) | (c << 6) | d;
    if (o < aus.length) aus[o++] = (v >> 16) & 255;
    if (o < aus.length) aus[o++] = (v >> 8) & 255;
    if (o < aus.length) aus[o++] = v & 255;
  }
  return aus;
};
