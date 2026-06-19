/* =====================================================================
 *  ÂM THANH — Web Audio API
 *  - Nhạc nền tổng hợp (intro bí ẩn -> celebration), miễn phí bản quyền.
 *  - SFX tổng hợp: radar, portal, wow, pop, candle, firework.
 *  - KHÔNG tự phát trước khi người dùng tương tác (AudioContext bị suspend).
 *  - Có thể thay bằng file mp3 riêng qua CARD_CONFIG.nhacNenUrl.
 * ===================================================================== */
(function (global) {
  "use strict";

  var Ctx = global.AudioContext || global.webkitAudioContext;

  function AudioEngine(cfg) {
    this.cfg = cfg || {};
    this.ready = false;
    this.muted = false;
    this.ctx = null;
    this.master = null;
    this.musicGain = null;
    this.bgTimer = null;
    this.mode = "intro";      // "intro" | "party"
    this.htmlAudio = null;    // nếu dùng file mp3
  }

  AudioEngine.prototype.init = function () {
    if (this.ready || !Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.0;
    this.musicGain.connect(this.master);
    this.ready = true;

    // Nếu có file nhạc riêng -> dùng <audio>, bỏ qua synth music.
    if (this.cfg.nhacNenUrl) {
      this.htmlAudio = new Audio(this.cfg.nhacNenUrl);
      this.htmlAudio.loop = true;
      this.htmlAudio.volume = this.muted ? 0 : 0.55;
    }
  };

  AudioEngine.prototype.resume = function () {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
  };

  AudioEngine.prototype.setMuted = function (m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.05);
    if (this.htmlAudio) this.htmlAudio.volume = m ? 0 : 0.55;
  };
  AudioEngine.prototype.toggleMute = function () { this.setMuted(!this.muted); return this.muted; };

  /* ---------- Nhạc nền tổng hợp ---------- */
  AudioEngine.prototype.startMusic = function (mode) {
    this.resume();
    if (!this.ready) return;
    this.mode = mode || this.mode;

    if (this.htmlAudio) {
      this.htmlAudio.play().catch(function () {});
      return;
    }
    if (this.bgTimer) return; // đã chạy
    this.musicGain.gain.setTargetAtTime(0.5, this.ctx.currentTime, 1.2);
    var self = this;
    var step = 0;

    // Hai vòng hoà âm: intro (tối, thưa) và party (sáng, dồn dập)
    var introScale = [220.0, 261.63, 329.63, 392.0, 523.25];      // Am pad-ish
    var partyScale = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]; // C major bright
    var introBeat = 900, partyBeat = 300;

    function tick() {
      if (self.muted === false) {
        var party = self.mode === "party";
        var scale = party ? partyScale : introScale;
        var note = scale[Math.floor(Math.random() * scale.length)];
        self._pluck(note, party ? 0.18 : 0.12, party ? "triangle" : "sine");
        // bass nhẹ mỗi 4 nhịp khi party
        if (party && step % 4 === 0) self._pluck(note / 2, 0.16, "sine", 0.5);
        // pad chord nền khi party mỗi 8 nhịp
        if (party && step % 8 === 0) self._chord([261.63, 329.63, 392.0], 1.6);
      }
      step++;
      self.bgTimer = setTimeout(tick, self.mode === "party" ? partyBeat : introBeat);
    }
    tick();
  };

  AudioEngine.prototype.toParty = function () {
    this.mode = "party";
    if (this.htmlAudio && this.htmlAudio.paused) this.htmlAudio.play().catch(function(){});
    if (this.ready && !this.htmlAudio) this.musicGain.gain.setTargetAtTime(0.6, this.ctx.currentTime, 0.6);
  };

  AudioEngine.prototype._pluck = function (freq, dur, type, vol) {
    if (!this.ready) return;
    var t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime((vol || 0.16), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, t + (dur || 0.3));
    o.connect(g); g.connect(this.musicGain);
    o.start(t); o.stop(t + (dur || 0.3) + 0.05);
  };

  AudioEngine.prototype._chord = function (freqs, dur) {
    var self = this;
    freqs.forEach(function (f) { self._pluck(f, dur || 1.4, "sine", 0.05); });
  };

  /* ---------- SFX ---------- */
  AudioEngine.prototype._tone = function (f1, f2, dur, type, vol, dest) {
    if (!this.ready || this.muted) return;
    var t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(f1, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol || 0.3, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
    o.connect(g); g.connect(dest || this.master);
    o.start(t); o.stop(t + dur + 0.03);
  };

  AudioEngine.prototype._noise = function (dur, vol, hp) {
    if (!this.ready || this.muted) return;
    var t = this.ctx.currentTime, len = Math.floor(this.ctx.sampleRate * dur);
    var buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = this.ctx.createBufferSource(); src.buffer = buf;
    var g = this.ctx.createGain(); g.gain.value = vol || 0.3;
    if (hp) { var f = this.ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = hp; src.connect(f); f.connect(g); }
    else src.connect(g);
    g.connect(this.master); src.start(t);
  };

  AudioEngine.prototype.sfx = function (name) {
    this.resume();
    switch (name) {
      case "radar":   this._tone(880, 1760, 0.5, "sine", 0.18); break;
      case "portal":  this._tone(160, 1200, 0.6, "sawtooth", 0.22); break;
      case "reveal":  this._tone(523, 1046, 0.4, "triangle", 0.3); this._tone(659, 1318, 0.5, "sine", 0.2); break;
      case "wow":     this._tone(330, 990, 0.35, "square", 0.22); this._noise(0.25, 0.12, 2000); break;
      case "mode":    this._tone(262, 1046, 0.5, "sawtooth", 0.25); break;
      case "pop":     this._tone(700, 1500, 0.12, "triangle", 0.25); break;
      case "candle":  this._noise(0.5, 0.32, 600); break;
      case "wish":    this._tone(784, 1568, 0.7, "sine", 0.22); break;
      case "firework":this._noise(0.45, 0.4, 300); this._tone(120, 60, 0.5, "sine", 0.25); break;
      case "tick":    this._tone(600, 600, 0.08, "square", 0.2); break;
    }
  };

  global.AudioEngine = AudioEngine;
})(window);
