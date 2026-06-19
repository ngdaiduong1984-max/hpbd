/* =====================================================================
 *  HIỆU ỨNG CANVAS — particle nền · confetti · pháo hoa · tên-pháo-hoa
 *  Một vòng requestAnimationFrame duy nhất. Giới hạn particle theo thiết bị.
 * ===================================================================== */
(function (global) {
  "use strict";

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function Effects() {
    this.bg = null; this.fx = null; this.bgc = null; this.fxc = null;
    this.name = null; this.namec = null;
    this.dpr = Math.min(global.devicePixelRatio || 1, 2);
    this.w = 0; this.h = 0;
    this.stars = []; this.orbs = [];
    this.confetti = []; this.sparks = []; this.rockets = [];
    this.nameParticles = [];
    this.colors = ["#FF3CAC", "#FF6FB5", "#8B5CF6", "#22D3EE", "#FFD166", "#FFFFFF"];
    this.reduced = false;
    this.running = false;
    this.cap = 1200;
    this._raf = null;
  }

  Effects.prototype.init = function (bgCanvas, fxCanvas, nameCanvas, colors) {
    this.bg = bgCanvas; this.fx = fxCanvas; this.name = nameCanvas;
    this.bgc = bgCanvas.getContext("2d");
    this.fxc = fxCanvas.getContext("2d");
    if (nameCanvas) this.namec = nameCanvas.getContext("2d");
    if (colors) this.colors = colors;
    this.resize();
    this._buildStars();
    var self = this;
    global.addEventListener("resize", function () { self.resize(); self._buildStars(); }, { passive: true });
  };

  Effects.prototype.setReduced = function (r) { this.reduced = r; };

  Effects.prototype.resize = function () {
    var w = global.innerWidth, h = global.innerHeight;
    this.w = w; this.h = h;
    [this.bg, this.fx].forEach((c) => {
      c.width = w * this.dpr; c.height = h * this.dpr;
      c.style.width = w + "px"; c.style.height = h + "px";
    });
    this.bgc.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.fxc.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    // cap particle theo diện tích màn hình
    this.cap = Math.max(500, Math.min(1500, Math.round((w * h) / 900)));
  };

  Effects.prototype._buildStars = function () {
    this.stars = [];
    var n = this.reduced ? 40 : Math.round(Math.min(160, (this.w * this.h) / 9000));
    for (var i = 0; i < n; i++)
      this.stars.push({ x: rand(0, this.w), y: rand(0, this.h), r: rand(.4, 1.6), a: rand(.2, .9), tw: rand(.005, .02), p: rand(0, 6.28) });
    this.orbs = [];
    var m = this.reduced ? 0 : 4;
    for (var j = 0; j < m; j++)
      this.orbs.push({ x: rand(0, this.w), y: rand(0, this.h), r: rand(80, 180), c: pick(this.colors), vx: rand(-.15, .15), vy: rand(-.1, .1) });
  };

  Effects.prototype.start = function () {
    if (this.running) return; this.running = true;
    var self = this, last = performance.now();
    function frame(now) {
      var dt = Math.min(40, now - last) / 16.67; last = now;
      self._step(dt);
      self._raf = requestAnimationFrame(frame);
    }
    this._raf = requestAnimationFrame(frame);
  };

  Effects.prototype._step = function (dt) {
    var bgc = this.bgc, fxc = this.fxc, w = this.w, h = this.h;

    /* ---- background ---- */
    bgc.clearRect(0, 0, w, h);
    if (!this.reduced) {
      for (var o = 0; o < this.orbs.length; o++) {
        var ob = this.orbs[o];
        ob.x += ob.vx * dt; ob.y += ob.vy * dt;
        if (ob.x < -200) ob.x = w + 200; if (ob.x > w + 200) ob.x = -200;
        if (ob.y < -200) ob.y = h + 200; if (ob.y > h + 200) ob.y = -200;
        var g = bgc.createRadialGradient(ob.x, ob.y, 0, ob.x, ob.y, ob.r);
        g.addColorStop(0, this._rgba(ob.c, .18)); g.addColorStop(1, this._rgba(ob.c, 0));
        bgc.fillStyle = g; bgc.beginPath(); bgc.arc(ob.x, ob.y, ob.r, 0, 6.2832); bgc.fill();
      }
    }
    for (var s = 0; s < this.stars.length; s++) {
      var st = this.stars[s];
      st.p += st.tw * dt;
      var a = this.reduced ? st.a : st.a * (0.6 + 0.4 * Math.sin(st.p));
      bgc.globalAlpha = a; bgc.fillStyle = "#fff";
      bgc.beginPath(); bgc.arc(st.x, st.y, st.r, 0, 6.2832); bgc.fill();
    }
    bgc.globalAlpha = 1;

    /* ---- foreground fx ---- */
    fxc.clearRect(0, 0, w, h);

    // rockets
    for (var r = this.rockets.length - 1; r >= 0; r--) {
      var rk = this.rockets[r];
      rk.x += rk.vx * dt; rk.y += rk.vy * dt; rk.vy += 0.06 * dt;
      fxc.globalAlpha = 1; fxc.fillStyle = rk.c;
      fxc.beginPath(); fxc.arc(rk.x, rk.y, 2.2, 0, 6.2832); fxc.fill();
      if (rk.vy >= rk.burstVy || rk.y <= rk.targetY) { this._explode(rk.x, rk.y, rk.c); this.rockets.splice(r, 1); }
    }

    // sparks (explosions + confetti share draw)
    for (var i = this.sparks.length - 1; i >= 0; i--) {
      var p = this.sparks[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; p.vx *= 0.99; p.life -= dt;
      if (p.life <= 0) { this.sparks.splice(i, 1); continue; }
      fxc.globalAlpha = Math.max(0, Math.min(1, p.life / p.max));
      fxc.fillStyle = p.c;
      fxc.beginPath(); fxc.arc(p.x, p.y, p.r, 0, 6.2832); fxc.fill();
    }

    // confetti (rectangles, spin)
    for (var c = this.confetti.length - 1; c >= 0; c--) {
      var f = this.confetti[c];
      f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 0.05 * dt; f.rot += f.vr * dt; f.life -= dt;
      if (f.y > h + 30 || f.life <= 0) { this.confetti.splice(c, 1); continue; }
      fxc.globalAlpha = Math.max(0, Math.min(1, f.life / f.max));
      fxc.save(); fxc.translate(f.x, f.y); fxc.rotate(f.rot);
      fxc.fillStyle = f.c; fxc.fillRect(-f.s / 2, -f.s / 2, f.s, f.s * 0.6);
      fxc.restore();
    }
    fxc.globalAlpha = 1;

    // name particles (drawn on separate nameCanvas)
    if (this.nameParticles.length && this.namec) this._stepName(dt);
  };

  Effects.prototype._rgba = function (hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  };

  /* ---------- Confetti ---------- */
  Effects.prototype.confettiBurst = function (x, y, count) {
    if (this.reduced) count = Math.round(count * 0.4);
    if (this.confetti.length > this.cap) return;
    for (var i = 0; i < count; i++) {
      var ang = rand(0, 6.2832), sp = rand(2, 9);
      this.confetti.push({
        x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - rand(2, 6),
        s: rand(6, 12), c: pick(this.colors), rot: rand(0, 6.28), vr: rand(-.3, .3),
        life: rand(60, 130), max: 130
      });
    }
  };
  Effects.prototype.confettiCannon = function () {
    this.confettiBurst(0, this.h * 0.65, 70);
    this.confettiBurst(this.w, this.h * 0.65, 70);
  };

  /* ---------- Fireworks ---------- */
  Effects.prototype._explode = function (x, y, color) {
    var n = this.reduced ? 26 : 60;
    for (var i = 0; i < n; i++) {
      var ang = (i / n) * 6.2832, sp = rand(1.5, 5.5);
      this.sparks.push({
        x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        g: 0.04, r: rand(1.5, 3), c: Math.random() < .3 ? "#fff" : color,
        life: rand(40, 75), max: 75
      });
    }
    if (global.cardAudio) global.cardAudio.sfx("firework");
  };
  Effects.prototype.launchFirework = function (x, color) {
    var startX = x != null ? x : rand(this.w * 0.2, this.w * 0.8);
    var targetY = rand(this.h * 0.18, this.h * 0.45);
    this.rockets.push({
      x: startX, y: this.h + 10, vx: rand(-.6, .6), vy: rand(-12, -9),
      burstVy: rand(-3, -1.5), targetY: targetY, c: color || pick(this.colors)
    });
  };
  Effects.prototype.fireworksShow = function (durationMs) {
    var self = this, end = performance.now() + (durationMs || 6000);
    (function loop() {
      if (performance.now() > end) return;
      self.launchFirework();
      setTimeout(loop, self.reduced ? 900 : rand(280, 650));
    })();
  };

  /* ---------- Tên vẽ bằng pháo hoa ---------- */
  Effects.prototype.buildNameTargets = function (text) {
    var c = this.name; if (!c) return false;
    var cssW = c.clientWidth || 480, cssH = c.clientHeight || 140;
    c.width = cssW * this.dpr; c.height = cssH * this.dpr;
    var ctx = this.namec;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);
    // vẽ chữ tạm để lấy điểm mẫu
    var fs = Math.min(cssH * 0.78, (cssW / Math.max(text.length, 1)) * 1.7);
    ctx.font = "900 " + fs + 'px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(text, cssW / 2, cssH / 2);
    var img;
    try { img = ctx.getImageData(0, 0, cssW * this.dpr, cssH * this.dpr); }
    catch (e) { return false; }
    ctx.clearRect(0, 0, cssW, cssH);
    var pts = [], step = this.reduced ? 7 : 4;
    for (var y = 0; y < cssH * this.dpr; y += step) {
      for (var x = 0; x < cssW * this.dpr; x += step) {
        if (img.data[(y * (cssW * this.dpr) + x) * 4 + 3] > 128)
          pts.push({ tx: x / this.dpr, ty: y / this.dpr });
      }
    }
    this.nameParticles = pts.map((pt) => ({
      x: cssW / 2 + rand(-30, 30), y: cssH + rand(10, 80),
      tx: pt.tx, ty: pt.ty, c: pick(this.colors),
      vx: 0, vy: 0, arrived: false, tw: rand(0, 6.28)
    }));
    this._nameW = cssW; this._nameH = cssH;
    return this.nameParticles.length > 0;
  };

  Effects.prototype._stepName = function (dt) {
    var ctx = this.namec; if (!ctx) return;
    ctx.clearRect(0, 0, this._nameW, this._nameH);
    for (var i = 0; i < this.nameParticles.length; i++) {
      var p = this.nameParticles[i];
      var dx = p.tx - p.x, dy = p.ty - p.y;
      p.x += dx * 0.12 * dt; p.y += dy * 0.12 * dt;
      if (!p.arrived && Math.abs(dx) < 1 && Math.abs(dy) < 1) p.arrived = true;
      p.tw += 0.15 * dt;
      var a = p.arrived ? 0.7 + 0.3 * Math.sin(p.tw) : 1;
      ctx.globalAlpha = a; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.7, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  global.Effects = Effects;
})(window);
