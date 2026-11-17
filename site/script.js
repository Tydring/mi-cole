/* miCole promo site. Everything here is an enhancement: the page is complete without it. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function clamp(x, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a || 0, x)); }
  function seg(t, a, b) { return clamp((t - a) / (b - a)); }
  function io(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function out(x) { return 1 - Math.pow(1 - x, 3); }
  function inq(x) { return x * x; }
  function back(x) { var c = 1.6; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function rememberIntro() { try { localStorage.setItem("micole-intro", "1"); } catch (e) {} }

  /* ---------- 1. intro: the logo animation, first visit only ---------- */
  var intro = document.getElementById("intro");
  function finishIntro() {
    if (!intro || !root.classList.contains("intro")) return;
    rememberIntro();
    intro.classList.add("out");
    setTimeout(function () { root.classList.remove("intro"); }, 650);
  }
  if (intro && root.classList.contains("intro")) {
    try { runIntro(); } catch (e) { finishIntro(); }
  }

  function runIntro() {
    var D = JSON.parse(document.getElementById("intro-data").textContent);
    var $ = function (id) { return document.getElementById("ik-" + id); };
    var portrait = innerHeight > innerWidth;
    var W = portrait ? 1080 : 1920, H = portrait ? 1920 : 1080;
    var lw = portrait ? 860 : 820, cyEnd = H / 2, cy0 = H / 2;
    var sv = $("sv");
    sv.setAttribute("viewBox", "0 0 " + W + " " + H);
    sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
    var vb = D.vb, S = lw / vb[2], LX = W / 2 - S * (vb[0] + vb[2] / 2), LY = cyEnd - S * (vb[1] + vb[3] / 2);
    $("place").setAttribute("transform", "translate(" + LX + " " + LY + ") scale(" + S + ")");
    var bx = D.btn[0], by = D.btn[1], ex = D.edge[0], ey = D.edge[1];
    var cb = $("C").getBBox(), ccx = cb.x + cb.width / 2, ccy = cb.y + cb.height / 2, cr = Math.max(cb.width, cb.height) * 0.36;
    var wb = $("place").getBBox();
    var markC = [ccx, (cb.y + by) / 2], wordC = [wb.x + wb.width / 2, wb.y + wb.height / 2];
    var letters = { m: 4.0, i: 4.08, o: 4.2, l: 4.28, e: 4.36 };
    var drop = -80;
    function lvl(id, k) { $(id).setAttribute("transform", "rotate(-18 " + bx + " " + by + ") translate(0 " + by + ") scale(1 " + Math.max(k, 0.0001) + ") translate(0 " + (-by) + ") rotate(18 " + bx + " " + by + ")"); }

    function render(t) {
      var dy = t < 2.2 ? drop : t < 3.0 ? lerp(drop, 0, inq(seg(t, 2.2, 3.0))) : 2.2 * Math.sin(Math.PI * seg(t, 3.0, 3.3));
      var rot = 18 * (1 - io(seg(t, 2.0, 2.8)));
      $("cap").setAttribute("transform", "translate(0 " + dy + ") rotate(" + rot + " " + bx + " " + by + ")");
      $("btn").setAttribute("transform", "translate(" + bx + " " + by + ") scale(" + back(seg(t, 0.05, 0.65)) + ") translate(" + (-bx) + " " + (-by) + ")");
      var rp = seg(t, 0.15, 1.0);
      $("ring").setAttribute("r", 9 + 46 * out(rp)); $("ring").style.opacity = rp > 0 && rp < 1 ? 0.55 * (1 - rp) : 0;
      $("ring").setAttribute("cy", by + dy);
      $("cord1").style.strokeDasharray = "1 1"; $("cord1").style.strokeDashoffset = 1 - out(seg(t, 1.0, 1.4));
      var sy = out(seg(t, 1.3, 2.0)); lvl("boardg", sy); $("boardg").style.opacity = sy > 0 ? 1 : 0;
      var bk = out(seg(t, 1.95, 2.35)); lvl("bandg", bk); $("bandg").style.opacity = bk > 0 ? 1 : 0;
      var grow = out(seg(t, 2.0, 2.6)), k = t - 3.0;
      var sw = t < 3.0 ? -8 * grow : Math.exp(-2.6 * k) * (30 * Math.sin(8.2 * k) - 8 * Math.cos(8.2 * k));
      $("tassel").setAttribute("transform", "rotate(" + sw + " " + ex + " " + ey + ") translate(" + ex + " " + ey + ") scale(1 " + Math.max(grow, 0.0001) + ") translate(" + (-ex) + " " + (-ey) + ")");
      $("tassel").style.opacity = grow > 0 ? 1 : 0;
      // the C fades in and settles as the cap falls onto it (a mask sweep left a loose sliver)
      var cp = io(seg(t, 2.2, 2.85)), cs = 0.9 + 0.1 * cp;
      $("Cg").removeAttribute("mask");
      $("Cg").style.opacity = cp;
      $("Cg").setAttribute("transform", "translate(" + ccx + " " + ccy + ") scale(" + cs + ") translate(" + (-ccx) + " " + (-ccy) + ")");
      for (var id in letters) { var p = out(seg(t, letters[id], letters[id] + 0.45)); $(id).style.opacity = clamp(p * 2.2); $(id).setAttribute("transform", "translate(0 " + 32 * (1 - p) + ")"); }
      var f, z, b0 = [bx, by + drop], m0 = [markC[0], markC[1] + drop * 0.35];
      if (t < 1.8) { f = [bx, by + dy]; z = lerp(2.9, 2.6, seg(t, 0, 1.8)); }
      else if (t < 3.3) { var k2 = io(seg(t, 1.8, 2.2)); f = [lerp(b0[0], m0[0], k2), lerp(b0[1], m0[1], k2)]; z = lerp(2.6, 1.95, k2) - 0.05 * seg(t, 2.2, 3.3); }
      else { var k3 = io(seg(t, 3.3, 4.0)); f = [lerp(m0[0], wordC[0], k3), lerp(m0[1], wordC[1], k3)]; z = lerp(1.9, 1.0, k3); }
      var fx = LX + S * f[0], fy = LY + S * f[1];
      $("cam").setAttribute("transform", "translate(" + W / 2 + " " + cy0 + ") scale(" + z + ") translate(" + (-fx) + " " + (-fy) + ")");
    }

    var SPEED = 1.4, END = 4.8, done = false, t0 = null;
    function stop() { if (done) return; done = true; finishIntro(); }
    intro.addEventListener("click", stop);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") stop(); }, { once: true });
    render(0);
    requestAnimationFrame(function tick(now) {
      if (done) return;
      if (t0 === null) t0 = now;
      var t = Math.min(END, (now - t0) / 1000 * SPEED);
      render(t);
      if (t < END) requestAnimationFrame(tick); else setTimeout(stop, 350);
    });
    setTimeout(stop, 7000); // never keep anyone behind the intro
  }

  /* ---------- 2. the thread along the school day (the page's one moment) ----------
     Each stop owns the segment from its dot down to the next dot. Without JavaScript every
     segment is full and every dot is lit. With it, they start empty and fill as you scroll. */
  var track = document.querySelector(".track");
  if (track && !reduce && "IntersectionObserver" in window) {
    var stops = [].slice.call(track.querySelectorAll(".stop"));
    root.classList.add("js-thread");
    stops.forEach(function (s) { s.classList.remove("lit"); s.style.setProperty("--fill", "0"); });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = stops.indexOf(en.target);
        for (var j = 0; j <= i; j++) {
          stops[j].classList.add("lit");
          if (j > 0) stops[j - 1].style.setProperty("--fill", "1");
        }
        obs.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -35% 0px" });
    stops.forEach(function (s) { obs.observe(s); });
  }

  /* ---------- 3. gentle one-time reveal of sections ---------- */
  if (!reduce && "IntersectionObserver" in window) {
    var items = [].slice.call(document.querySelectorAll(".rv"));
    var vh = innerHeight;
    var later = items.filter(function (el) { return el.getBoundingClientRect().top > vh; });
    if (later.length) {
      root.classList.add("js-reveal");
      items.forEach(function (el) { if (later.indexOf(el) < 0) el.classList.add("in"); });
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -10% 0px" });
      later.forEach(function (el) { ro.observe(el); });
    }
  }
})();
