/* =====================================================================
 *  APP — máy trạng thái 8 phân cảnh + tương tác + wiring cấu hình
 * ===================================================================== */
(function () {
  "use strict";
  var cfg = window.CARD_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var body = document.body;

  /* ---------- màu chủ đạo từ config ---------- */
  function applyColors() {
    var root = document.documentElement.style;
    if (cfg.mauChuDao) root.setProperty("--pink", cfg.mauChuDao);
    if (cfg.mauPhu1) root.setProperty("--pink-soft", cfg.mauPhu1);
    if (cfg.mauPhu2) root.setProperty("--purple", cfg.mauPhu2);
    if (cfg.mauPhu3) root.setProperty("--cyan", cfg.mauPhu3);
    if (cfg.mauVang) root.setProperty("--gold", cfg.mauVang);
  }

  /* ---------- engines ---------- */
  var fx = new window.Effects();
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var audio = new window.AudioEngine(cfg);
  window.cardAudio = audio;

  /* ---------- scene manager ---------- */
  var ORDER = ["intro", "reveal", "mode", "wow", "wish", "age", "candle", "finale"];
  var idx = 0, locked = false;

  function show(name) {
    var i = ORDER.indexOf(name); if (i < 0) return;
    idx = i;
    $$(".scene").forEach(function (s) { s.classList.toggle("active", s.dataset.scene === name); });
    body.dataset.state = name;
    locked = true; setTimeout(function () { locked = false; }, 650);
    if (cfg.ghiNhoTienTrinh) try { sessionStorage.setItem("hpbd_scene", name); } catch (e) {}
    onEnter(name);
  }
  function next() { if (!locked && idx < ORDER.length - 1) show(ORDER[idx + 1]); }

  /* ---------- nội dung tĩnh ---------- */
  function fillStatic() {
    $("#hero-name").textContent = cfg.tenNguoiNhan || "Bạn";
    var photo = $("#holo-photo");
    photo.src = cfg.anhChanDung || "";
    photo.alt = "Ảnh " + (cfg.tenNguoiNhan || "");
    // gallery
    var g = $("#gallery");
    (cfg.danhSachAnh || []).forEach(function (a) {
      var fig = document.createElement("figure"); fig.className = "polaroid";
      var im = document.createElement("img"); im.src = a.src; im.alt = a.caption || ""; im.loading = "lazy";
      var cap = document.createElement("figcaption"); cap.textContent = a.caption || "";
      fig.appendChild(im); fig.appendChild(cap); g.appendChild(fig);
    });
    // wish (highlight vài từ khoá)
    $("#wish-text").innerHTML = highlight(cfg.loiChuc || "");
    $("#wish-from").textContent = "— Thân tặng từ " + (cfg.tenNguoiGui || "");
    // age
    $("#age-title").textContent = cfg.ageTitle || "";
    $("#age-quip").textContent = cfg.ageQuip || "";
    // candle hint
    $("#candle-hint").textContent = "Nhấn giữ để thổi " +
      (cfg.danhSachAnh ? "" : "") + "nến và gửi điều ước vào vũ trụ ✨";
    // finale
    $("#finale-wish").textContent = cfg.loiChucCuoi || "";
    $("#finale-name-fallback").textContent = (cfg.tenNguoiNhan || "").toUpperCase();
    if (cfg.i18n && cfg.i18n.hbd) $("[data-i18n='hbd']").textContent = cfg.i18n.hbd;
    // letter
    $("#letter-body").textContent = cfg.thuTay || "";
    $("#letter-sign").textContent = cfg.kyTenThuTay || "";
    $("#gift-title").textContent = "💌 " + (cfg.tieuDeNutQua || "Thư tay");
    $("#btn-gift").textContent = "💌 " + (cfg.tieuDeNutQua || "Mở thư tay");
  }
  function highlight(t) {
    var words = ["rực rỡ", "công việc", "tình cảm", "sức khoẻ", "sức khỏe", "WOW", "may mắn", "hiện thực"];
    var esc = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    words.forEach(function (w) {
      esc = esc.replace(new RegExp("(" + w + ")", "g"), '<span class="hl">$1</span>');
    });
    return esc;
  }

  /* ---------- onEnter cho từng cảnh ---------- */
  function onEnter(name) {
    switch (name) {
      case "intro":   enterIntro(); break;
      case "reveal":  enterReveal(); break;
      case "mode":    /* chờ người dùng bấm */ break;
      case "wow":     enterWow(); break;
      case "wish":    break;
      case "age":     enterAge(); break;
      case "candle":  resetCandle(); break;
      case "finale":  enterFinale(); break;
    }
  }

  /* ===== Cảnh 1: intro typing ===== */
  var introBtn = $("#btn-open-signal");
  function enterIntro() {
    introBtn.disabled = true; introBtn.style.opacity = 0;
    var line = $(".signal-line"), lines = cfg.intro || ["Đang kết nối…"];
    var li = 0;
    function typeLine() {
      var text = lines[li], ci = 0; line.innerHTML = "";
      var caret = document.createElement("span"); caret.className = "caret"; line.appendChild(caret);
      if (li === 0) audio.sfx("radar");
      var iv = setInterval(function () {
        ci++;
        line.textContent = text.slice(0, ci);
        var c = document.createElement("span"); c.className = "caret"; line.appendChild(c);
        if (ci >= text.length) {
          clearInterval(iv);
          li++;
          if (li < lines.length) setTimeout(typeLine, 650);
          else setTimeout(function () { introBtn.disabled = false; introBtn.style.opacity = 1; }, 350);
        }
      }, reduced ? 12 : 45);
    }
    typeLine();
  }
  introBtn.addEventListener("click", function () {
    audio.resume(); audio.startMusic("intro"); audio.sfx("portal");
    fx.confettiBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
    next();
  });

  /* ===== Cảnh 2: reveal ===== */
  function enterReveal() {
    audio.sfx("reveal");
    var hn = $("#hero-name");
    hn.style.animation = "none"; void hn.offsetWidth; hn.style.animation = "";
    setTimeout(function () { fx.confettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 30); }, 500);
  }

  /* ===== Cảnh 3: birthday mode ===== */
  $("#btn-birthday-mode").addEventListener("click", function () {
    this.disabled = true;
    audio.toParty(); audio.sfx("mode");
    $("#mode-state").hidden = false;
    fx.confettiCannon();
    document.documentElement.style.setProperty("--bg", "#0c0820");
    setTimeout(next, 1100);
  });

  /* ===== Cảnh 4: WOW ===== */
  var wowList = cfg.wow || [], wi = 0;
  var wowWord = $("#wow-word"), wowMsg = $("#wow-msg"), wowDots = $("#wow-dots"), wowNext = $("#btn-wow-next");
  function buildDots() {
    wowDots.innerHTML = "";
    wowList.forEach(function () { wowDots.appendChild(document.createElement("span")); });
  }
  function enterWow() { wi = 0; buildDots(); playWow(); }
  function playWow() {
    var msg = wowList[wi] || "";
    wowWord.classList.remove("show"); void wowWord.offsetWidth; wowWord.classList.add("show");
    wowMsg.textContent = msg.replace(/^WOW!\s*—?\s*/i, "");
    audio.sfx("wow");
    var cx = window.innerWidth / 2;
    fx.confettiBurst(cx, window.innerHeight * 0.42, 18 + wi * 8);
    if (wi === 2) fx.launchFirework(cx, "#FFD166"); // WOW cuối: pháo hoa nhỏ
    $$("#wow-dots span").forEach(function (d, k) { d.classList.toggle("on", k <= wi); });
    wowNext.textContent = wi < wowList.length - 1 ? "WOW tiếp →" : "Tiếp tục →";
  }
  wowNext.addEventListener("click", function () {
    if (locked) return;
    if (wi < wowList.length - 1) { wi++; playWow(); }
    else next();
  });

  /* ===== Cảnh 6: khoe tuổi ===== */
  function enterAge() {
    if (!cfg.hienTuoi) { next(); return; }
    var el = $("#age-number"), target = cfg.tuoi || 0, cur = 0;
    el.textContent = "0";
    var steps = 28, k = 0;
    var iv = setInterval(function () {
      k++; cur = Math.round(target * (k / steps));
      el.textContent = cur;
      audio.sfx("tick");
      if (k >= steps) {
        clearInterval(iv); el.textContent = target;
        audio.sfx("reveal");
        fx.confettiBurst(window.innerWidth / 2, window.innerHeight * 0.4, 40);
      }
    }, reduced ? 20 : 55);
  }

  /* ===== Cảnh 7: thổi nến (nhấn giữ) ===== */
  var blowBtn = $("#btn-blow"), blowFill = $("#blow-fill"), candles = $$(".candle");
  var holdTimer = null, holdStart = 0, blown = false;
  var HOLD_MS = 1500;
  function resetCandle() {
    blown = false; blowFill.style.width = "0%";
    candles.forEach(function (c) { c.classList.remove("out"); });
    $("#candle-hint").textContent = "Nhấn giữ để thổi nến và gửi điều ước vào vũ trụ ✨";
  }
  function startHold() {
    if (blown) return; holdStart = performance.now();
    holdTimer = requestAnimationFrame(function tickHold() {
      var p = Math.min(1, (performance.now() - holdStart) / HOLD_MS);
      blowFill.style.width = (p * 100) + "%";
      // tắt nến dần
      var outN = Math.floor(p * candles.length);
      candles.forEach(function (c, k) { c.classList.toggle("out", k < outN); });
      if (p >= 1) finishBlow();
      else holdTimer = requestAnimationFrame(tickHold);
    });
  }
  function cancelHold() {
    if (blown) return;
    cancelAnimationFrame(holdTimer);
    blowFill.style.width = "0%";
    candles.forEach(function (c) { c.classList.remove("out"); });
  }
  function finishBlow() {
    blown = true; cancelAnimationFrame(holdTimer);
    candles.forEach(function (c) { c.classList.add("out"); });
    audio.sfx("candle");
    if (navigator.vibrate) navigator.vibrate(60);
    blowBtn.disabled = true;
    // tối nhẹ 0.5s rồi xác nhận điều ước
    var hint = $("#candle-hint");
    document.body.style.transition = "filter .25s"; document.body.style.filter = "brightness(.4)";
    setTimeout(function () {
      document.body.style.filter = "";
      hint.textContent = cfg.thongDiepSauThoiNen || "Điều ước đã được gửi đi ✨";
      audio.sfx("wish");
      setTimeout(function () { blowBtn.disabled = false; next(); }, 1200);
    }, 500);
  }
  blowBtn.addEventListener("pointerdown", function (e) { e.preventDefault(); startHold(); });
  blowBtn.addEventListener("pointerup", cancelHold);
  blowBtn.addEventListener("pointerleave", cancelHold);
  blowBtn.addEventListener("pointercancel", cancelHold);

  /* ===== Cảnh 8: finale ===== */
  var finaleStarted = false;
  function enterFinale() {
    var cd = $("#countdown"), content = $("#finale-content");
    content.hidden = true; cd.style.display = "";
    var seq = ["3", "2", "1"], k = 0;
    function step() {
      if (k < seq.length) {
        cd.textContent = seq[k];
        cd.classList.remove("tick"); void cd.offsetWidth; cd.classList.add("tick");
        audio.sfx("tick");
        k++; setTimeout(step, 900);
      } else {
        cd.style.display = "none"; content.hidden = false;
        bigFinale();
      }
    }
    step();
  }
  function bigFinale() {
    if (finaleStarted) return; finaleStarted = true;
    audio.toParty();
    audio.sfx("reveal");
    fx.confettiCannon();
    fx.fireworksShow(reduced ? 4000 : 9000);
    // tên vẽ bằng pháo hoa
    var ok = false;
    try { ok = fx.buildNameTargets((cfg.tenNguoiNhan || "").toUpperCase()); } catch (e) { ok = false; }
    if (!ok) {
      $("#name-canvas").style.display = "none";
      $("#finale-name-fallback").style.display = "block";
    }
    startPhotoRain(reduced ? 4000 : 9000);
    setupShake();
  }

  /* photo rain — dùng ảnh thật */
  function startPhotoRain(durationMs) {
    var box = $("#photo-rain");
    var imgs = [cfg.anhChanDung].concat((cfg.danhSachAnh || []).map(function (a) { return a.src; })).filter(Boolean);
    if (!imgs.length) return;
    var end = performance.now() + durationMs, active = [];
    function spawn() {
      if (performance.now() > end) return;
      var im = document.createElement("img");
      im.src = imgs[(Math.random() * imgs.length) | 0];
      var x = Math.random() * (window.innerWidth - 84);
      var rot = (Math.random() * 40 - 20);
      var dur = 4200 + Math.random() * 2600;
      im.style.left = x + "px"; im.style.top = "-120px";
      im.style.transform = "rotate(" + rot + "deg)";
      box.appendChild(im);
      var start = performance.now();
      (function fall(now) {
        var p = (now - start) / dur;
        if (p >= 1) { im.remove(); return; }
        im.style.opacity = p < .1 ? p * 10 : (p > .85 ? (1 - p) / .15 : 1);
        im.style.top = (-120 + p * (window.innerHeight + 160)) + "px";
        im.style.transform = "rotate(" + (rot + p * 40) + "deg)";
        requestAnimationFrame(fall);
      })(start);
      setTimeout(spawn, reduced ? 1100 : 520);
    }
    spawn();
  }

  /* lắc / chạm để bắn pháo hoa */
  function setupShake() {
    var fin = $("#scene-finale");
    fin.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".btn")) return;
      fx.launchFirework(e.clientX);
      maybeAskMotion();
    });
    function maybeAskMotion() {
      if (window.DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function" && !setupShake._asked) {
        setupShake._asked = true;
        DeviceMotionEvent.requestPermission().then(function (s) { if (s === "granted") bindMotion(); }).catch(function () {});
      } else if (!setupShake._bound) { bindMotion(); }
    }
    function bindMotion() {
      if (setupShake._bound) return; setupShake._bound = true;
      var last = 0, lx = 0, ly = 0, lz = 0;
      window.addEventListener("devicemotion", function (ev) {
        var a = ev.accelerationIncludingGravity; if (!a) return;
        var d = Math.abs(a.x - lx) + Math.abs(a.y - ly) + Math.abs(a.z - lz);
        lx = a.x; ly = a.y; lz = a.z;
        var now = performance.now();
        if (d > 28 && now - last > 500 && body.dataset.state === "finale") {
          last = now; fx.launchFirework(); fx.confettiBurst(window.innerWidth / 2, window.innerHeight * .3, 20);
        }
      });
    }
  }

  /* ---------- nút data-next ---------- */
  $$("[data-next]").forEach(function (b) { b.addEventListener("click", function () { next(); }); });

  /* ---------- modal thư tay ---------- */
  $("#btn-gift").addEventListener("click", function () { $("#gift-modal").hidden = false; });
  $("#gift-close").addEventListener("click", function () { $("#gift-modal").hidden = true; });
  $("#gift-modal").addEventListener("click", function (e) { if (e.target === this) this.hidden = true; });

  /* ---------- replay / share ---------- */
  $("#btn-replay").addEventListener("click", function () {
    finaleStarted = false; wi = 0; resetCandle();
    document.documentElement.style.setProperty("--bg", "#070716");
    $("#btn-birthday-mode").disabled = false; $("#mode-state").hidden = true;
    $("#photo-rain").innerHTML = "";
    show("intro");
  });
  $("#btn-share").addEventListener("click", function () {
    var data = { title: "Happy Birthday " + (cfg.tenNguoiNhan || ""), text: "Một tín hiệu đặc biệt từ vũ trụ ✨", url: location.href };
    if (navigator.share) navigator.share(data).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { toast("Đã sao chép liên kết!"); });
    else toast(location.href);
  });
  function toast(msg) {
    var t = document.createElement("div"); t.textContent = msg;
    t.style.cssText = "position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:rgba(20,10,46,.9);color:#fff;padding:12px 18px;border-radius:999px;z-index:40;font-weight:700;border:1px solid rgba(255,255,255,.2)";
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  }

  /* ---------- HUD ---------- */
  var audioBtn = $("#btn-audio");
  var savedMute = false;
  try { savedMute = sessionStorage.getItem("hpbd_mute") === "1"; } catch (e) {}
  audio.muted = savedMute;
  body.dataset.audio = savedMute ? "off" : "on";
  audioBtn.setAttribute("aria-pressed", String(!savedMute));
  audioBtn.addEventListener("click", function () {
    var m = audio.toggleMute();
    body.dataset.audio = m ? "off" : "on";
    audioBtn.setAttribute("aria-pressed", String(!m));
    try { sessionStorage.setItem("hpbd_mute", m ? "1" : "0"); } catch (e) {}
    if (!m) audio.startMusic();
  });
  $("#btn-skip").addEventListener("click", function () { if (!locked) next(); });

  /* ---------- khởi động ---------- */
  function boot() {
    applyColors();
    fx.setReduced(reduced);
    fx.init($("#bg-canvas"), $("#fx-canvas"), $("#name-canvas"),
      [cfg.mauChuDao, cfg.mauPhu1, cfg.mauPhu2, cfg.mauPhu3, cfg.mauVang, "#FFFFFF"].filter(Boolean));
    fx.start();
    if (reduced) body.dataset.reduced = "1";
    fillStatic();
    var startScene = "intro";
    if (cfg.ghiNhoTienTrinh) { try { startScene = sessionStorage.getItem("hpbd_scene") || "intro"; } catch (e) {} }
    show(startScene);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
