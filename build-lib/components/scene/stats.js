'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// stats.js - http://github.com/mrdoob/stats.js
var Stats = function Stats() {
  function h(a) {
    c.appendChild(a.dom);
    return a;
  }
  function k(a) {
    for (var d = 0; d < c.children.length; d++) {
      c.children[d].style.display = d === a ? 'block' : 'none';
    }
    l = a;
  }
  var l = 0;
  var c = document.createElement('div');
  c.style.cssText = 'position:absolute;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
  c.addEventListener('click', function (a) {
    a.preventDefault();
    k(++l % c.children.length);
  }, !1);
  var g = (performance || Date).now();
  var e = g;
  var a = 0;
  var r = h(new Stats.Panel('FPS', '#0ff', '#002'));
  var f = h(new Stats.Panel('MS', '#0f0', '#020'));
  if (this.performance && this.performance.memory) {
    var t = h(new Stats.Panel('MB', '#f08', '#201'));
  }
  k(0);
  return {
    REVISION: 16,
    dom: c,
    addPanel: h,
    showPanel: k,
    begin: function begin() {
      g = (performance || Date).now();
    },
    end: function end() {
      a++;
      var c = (performance || Date).now();
      f.update(c - g, 200);
      if (c > e + 1e3 && (r.update(1e3 * a / (c - e), 100), e = c, a = 0, t)) {
        var d = performance.memory;
        t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
      }
      return c;
    },
    update: function update() {
      g = this.end();
    },
    domElement: c,
    setMode: k
  };
};
Stats.Panel = function (h, k, l) {
  var c = Infinity;
  var g = 0;
  var e = Math.round;
  var a = e(window.devicePixelRatio || 1);
  var r = 80 * a;
  var f = 48 * a;
  var t = 3 * a;
  var u = 2 * a;
  var d = 3 * a;
  var m = 15 * a;
  var n = 74 * a;
  var p = 30 * a;
  var q = document.createElement('canvas');
  q.width = r;
  q.height = f;
  q.style.cssText = 'width:80px;height:48px';
  var b = q.getContext('2d');
  b.font = 'bold ' + 9 * a + 'px Helvetica,Arial,sans-serif';
  b.textBaseline = 'top';
  b.fillStyle = l;
  b.fillRect(0, 0, r, f);
  b.fillStyle = k;
  b.fillText(h, t, u);
  b.fillRect(d, m, n, p);
  b.fillStyle = l;
  b.globalAlpha = 0.9;
  b.fillRect(d, m, n, p);
  return {
    dom: q,
    update: function update(f, v) {
      c = Math.min(c, f);
      g = Math.max(g, f);
      b.fillStyle = l;
      b.globalAlpha = 1;
      b.fillRect(0, 0, r, m);
      b.fillStyle = k;
      b.fillText(e(f) + ' ' + h + ' (' + e(c) + '-' + e(g) + ')', t, u);
      b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);
      b.fillRect(d + n - a, m, a, p);
      b.fillStyle = l;
      b.globalAlpha = 0.9;
      b.fillRect(d + n - a, m, a, e((1 - f / v) * p));
    }
  };
};
exports.default = Stats;