/* ============================================================
   32 HOUR GROUP — shared behaviors + the 32-Dial engine
   ============================================================ */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var DEG = 360 / 32;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Five domains — hours sum to exactly 32
  var DOMAINS = [
    { n: "01", name: "Creation",    h: 11, range: "10–12 hrs / cycle", color: "#f0d479",
      essence: "Focused work, learning, and building — the uninterrupted depth where your most important work lives.",
      practice: "Protected blocks with no notifications. The work that only you can do, given room to become good.",
      neglect: "Your best work never gets the depth it deserves. Everything turns shallow, reactive, and urgent." },
    { n: "02", name: "Maintenance", h: 5, range: "4–6 hrs / cycle", color: "#d8b85a",
      essence: "Health, administration, and stability — the quiet care that keeps everything else functioning.",
      practice: "Movement, meals, money, the inbox, the home. The unglamorous upkeep of being alive.",
      neglect: "Small things rot into emergencies. The base you build everything else on slowly crumbles." },
    { n: "03", name: "Reflection",  h: 2, range: "2–3 hrs / cycle", color: "#c9a84c",
      essence: "Review, journaling, and meaning-making — thought without pressure.",
      practice: "Writing the cycle down. Asking what actually mattered, and what only felt like it did.",
      neglect: "You repeat the same week forever, never noticing the pattern. The first domain most people sacrifice." },
    { n: "04", name: "Connection",  h: 5, range: "4–6 hrs / cycle", color: "#b08f3e",
      essence: "Family, community, and service — meaningful presence with others. Being, not scrolling.",
      practice: "Undivided time with people. The weekly Pause & Realign. Service that needs no audience.",
      neglect: "Connection becomes performance. Presence becomes a notification you mean to answer later." },
    { n: "05", name: "Rest",        h: 9, range: "8–10 hrs / cycle", color: "#8a6f30",
      essence: "Sleep and restorative stillness. Not earned. Not optional. Required.",
      practice: "Sleep protected as fiercely as work. Stillness that asks nothing of you in return.",
      neglect: "A cycle without rest is a broken cycle. Every other domain degrades to cover the deficit." }
  ];

  function el(t, a) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); return e; }
  function pt(cx, cy, r, d) { var a = d * Math.PI / 180; return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) }; }
  function arcD(cx, cy, r, a0, a1) {
    var p0 = pt(cx, cy, r, a0), p1 = pt(cx, cy, r, a1);
    var lg = (((a1 - a0) % 360) + 360) % 360 > 180 ? 1 : 0;
    return "M " + p0.x + " " + p0.y + " A " + r + " " + r + " 0 " + lg + " 1 " + p1.x + " " + p1.y;
  }

  // Build a dial into <g>. opts: {r,sw,gap,ticks,nums,draw,delay,interactive,stroke(idx,d)}
  function buildDial(g, opts) {
    opts = opts || {};
    var cx = 280, cy = 280, r = opts.r || 200, sw = opts.sw || 16, gap = opts.gap == null ? 2.2 : opts.gap;
    g.appendChild(el("circle", { "class": "track", cx: cx, cy: cy, r: r, "stroke-width": sw }));
    if (opts.ticks !== false) {
      for (var i = 0; i < 32; i++) {
        var deg = i * DEG, mj = (i === 0 || i === 8 || i === 16 || i === 24);
        var a = pt(cx, cy, r + sw * 0.85, deg), b = pt(cx, cy, r + sw * 0.85 + (mj ? 14 : 9), deg);
        g.appendChild(el("line", { "class": "tick" + (mj ? " major" : ""), x1: a.x, y1: a.y, x2: b.x, y2: b.y }));
      }
    }
    if (opts.nums) {
      [[8, "8"], [16, "16"], [24, "24"], [0, "32"]].forEach(function (p) {
        var c = pt(cx, cy, r + sw * 0.85 + 30, p[0] * DEG);
        var n = el("text", { "class": "tick-num", x: c.x, y: c.y }); n.textContent = p[1]; g.appendChild(n);
      });
    }
    var arcs = [], hr = 0;
    DOMAINS.forEach(function (d, idx) {
      var a0 = hr * DEG + gap, a1 = (hr + d.h) * DEG - gap; hr += d.h;
      var stroke = opts.stroke ? opts.stroke(idx, d) : d.color;
      var cls = "arc" + (opts.interactive ? " interactive" : "");
      var attrs = { "class": cls, d: arcD(cx, cy, r, a0, a1), stroke: stroke, "stroke-width": sw };
      if (opts.interactive) { attrs.tabindex = "0"; attrs.role = "button"; attrs["aria-label"] = d.name + ", " + d.range; }
      var p = el("path", attrs); p.dataset.idx = idx; g.appendChild(p); arcs.push(p);
    });
    if (opts.draw && !reduce) {
      arcs.forEach(function (p, i) {
        var len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
        p.style.transition = "stroke-dashoffset .95s var(--ease) " + ((opts.delay || 0) + i * 0.13) + "s";
        requestAnimationFrame(function () { requestAnimationFrame(function () { p.style.strokeDashoffset = 0; }); });
      });
    }
    return arcs;
  }

  // brand mark (5-arc ring) into an <svg viewBox 0 0 60 60>
  function mark(svg) {
    var g = el("g", {}); svg.appendChild(g); var hr = 0;
    DOMAINS.forEach(function (d) {
      var a0 = hr * DEG + 4, a1 = (hr + d.h) * DEG - 4; hr += d.h;
      g.appendChild(el("path", { d: arcD(30, 30, 22, a0, a1), fill: "none", stroke: d.color, "stroke-width": 4 }));
    });
  }

  function intro(g) {
    if (reduce) { g.style.opacity = 1; return; }
    g.style.transformOrigin = "280px 280px"; g.style.opacity = "0";
    g.style.transform = "rotate(-18deg) scale(.95)";
    g.style.transition = "transform 1.6s var(--ease), opacity 1.1s var(--ease)";
    requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.opacity = "1"; g.style.transform = "rotate(0) scale(1)"; }); });
  }
  function countUp(node) {
    if (reduce) { node.textContent = "32"; return; }
    var t0 = performance.now(), dur = 2000;
    (function f(now) { var k = Math.min(1, (now - t0) / dur); node.textContent = Math.round((1 - Math.pow(1 - k, 3)) * 32); if (k < 1) requestAnimationFrame(f); })(t0);
  }
  function $(id) { return document.getElementById(id); }
  function gOf(id) { var s = $(id); return s ? s.querySelector("g") || s.appendChild(el("g", {})) : null; }

  // ---- interactive domain dial wired to a detail panel + center ----
  function wireInteractive(arcs, opts) {
    opts = opts || {};
    var legendEl = opts.legend, panel = opts.panel, locking = opts.locking;
    var selected = null;
    var legs = [];
    if (legendEl) {
      DOMAINS.forEach(function (d, idx) {
        var l = document.createElement("div"); l.className = "leg"; l.dataset.idx = idx;
        l.innerHTML = '<span class="dot" style="background:' + d.color + '"></span><span class="nm">' + d.name + '</span><span class="hr">' + d.range.split(" ")[0] + ' hrs</span>';
        legendEl.appendChild(l); legs.push(l);
      });
    }
    function paint(idx) {
      arcs.forEach(function (p, i) { p.classList.toggle("active", i === idx); p.classList.toggle("dim", idx != null && i !== idx); });
      legs.forEach(function (l, i) { l.classList.toggle("active", i === idx); });
      if (panel) panel(idx);
    }
    function render() { paint(selected); }
    arcs.concat(legs).forEach(function (node) {
      var idx = +node.dataset.idx;
      node.addEventListener("mouseenter", function () { paint(idx); });
      node.addEventListener("mouseleave", render);
      node.addEventListener("focus", function () { paint(idx); });
      node.addEventListener("blur", render);
      if (locking) {
        node.addEventListener("click", function () { selected = (selected === idx ? null : idx); paint(selected); });
        node.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selected = (selected === idx ? null : idx); paint(selected); } });
      }
    });
    paint(null);
  }

  // ===================== INIT =====================
  document.addEventListener("DOMContentLoaded", function () {
    // brand marks
    [].forEach.call(document.querySelectorAll(".navmark"), function (s) { if (!s.querySelector("g")) mark(s); });

    // active nav link
    var page = document.body.getAttribute("data-page");
    if (page) {
      [].forEach.call(document.querySelectorAll('.nav-links a, .mobile-links a'), function (a) {
        if (a.getAttribute("href") === page + ".html") a.classList.add("active");
      });
    }

    // nav scroll
    var nav = $("nav-el");
    if (nav) window.addEventListener("scroll", function () { nav.classList.toggle("scrolled", window.scrollY > 60); });

    // mobile menu
    var burger = $("hamburger"), menu = $("mobileMenu"), closeBtn = $("mobileClose");
    function openMenu() { menu.classList.add("open"); menu.setAttribute("aria-hidden", "false"); if (burger) burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; }
    function closeMenu() { menu.classList.remove("open"); menu.setAttribute("aria-hidden", "true"); if (burger) { burger.setAttribute("aria-expanded", "false"); burger.focus(); } document.body.style.overflow = ""; }
    if (burger && menu) {
      burger.addEventListener("click", openMenu);
      if (closeBtn) closeBtn.addEventListener("click", closeMenu);
      [].forEach.call(menu.querySelectorAll("a"), function (a) { a.addEventListener("click", closeMenu); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) closeMenu(); });
    }

    // reveals
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) e.target.classList.add("visible"); }); }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    [].forEach.call(document.querySelectorAll(".reveal"), function (n) { io.observe(n); });

    // FAQ accordion
    [].forEach.call(document.querySelectorAll(".faq-q"), function (q) {
      q.addEventListener("click", function () {
        var item = q.parentElement, ans = item.querySelector(".faq-a"), open = item.classList.contains("open");
        [].forEach.call(document.querySelectorAll(".faq-item.open"), function (i) { i.classList.remove("open"); i.querySelector(".faq-a").style.maxHeight = null; });
        if (!open) { item.classList.add("open"); ans.style.maxHeight = ans.scrollHeight + "px"; }
      });
    });

    // page-hero watermark dial
    [].forEach.call(document.querySelectorAll(".page-hero-dial"), function (s) {
      buildDial(s.appendChild(el("g", {})), { r: 200, sw: 14, nums: false });
    });

    // coin (Father Joe medallion) — reuse the dial as an engraved ring
    if ($("coinG")) buildDial($("coinG"), { r: 200, sw: 14, nums: false });

    // HOME
    if ($("heroG")) { buildDial($("heroG"), { nums: true, draw: true, delay: 0.3 }); intro($("heroG")); if ($("heroNum")) countUp($("heroNum")); }
    if ($("wholeG")) buildDial($("wholeG"), { r: 200, sw: 18, nums: false });
    if ($("brokenG")) buildDial($("brokenG"), { r: 200, sw: 18, nums: false, gap: 7, stroke: function () { return "#3a3a36"; } });
    if ($("domHomeG")) {
      var ha = buildDial($("domHomeG"), { nums: true, interactive: true });
      var dnum = $("domHomeNum"), dsub = $("domHomeSub");
      wireInteractive(ha, {
        legend: $("domHomeLegend"),
        panel: function (idx) {
          if (idx == null) { dnum.textContent = "32"; dnum.style.color = ""; dsub.textContent = "One Complete Cycle"; }
          else { var d = DOMAINS[idx]; dnum.textContent = d.h; dnum.style.color = d.color; dsub.textContent = "of 32 · " + d.name + " (" + d.range.split(" ")[0] + " hrs)"; }
        }
      });
    }

    // PRINCIPLES interactive stage
    if ($("prinG")) {
      var pa = buildDial($("prinG"), { nums: true, interactive: true });
      intro($("prinG"));
      var P = {
        num: $("pNum"), name: $("pName"), range: $("pRange"), ess: $("pEssence"),
        bl1: $("pBl1"), bx1: $("pBx1"), bl2: $("pBl2"), bx2: $("pBx2"),
        dcN: $("prinNum"), dcS: $("prinSub"), wrap: $("prinPanel")
      };
      function setPanel(idx) {
        function swap() {
          if (idx == null) {
            P.num.textContent = "01 — 05"; P.num.style.color = ""; P.name.textContent = "All Five"; P.name.style.color = "";
            P.range.textContent = "32 hours / cycle";
            P.ess.textContent = "We do not add hours to the day. We restore intention to the time you already have — divided across five domains that, together, make a day whole.";
            P.bl1.textContent = "The Doctrine"; P.bx1.textContent = "Hover or select any arc of the dial. Each domain has its own weight — and its own cost when neglected.";
            P.bl2.textContent = "When the cycle breaks"; P.bx2.textContent = "Drop one domain for long enough and the whole cycle desaturates. Sufficiency is the sum of all five.";
            if (P.dcN) { P.dcN.textContent = "32"; P.dcN.style.color = ""; } if (P.dcS) P.dcS.textContent = "One Complete Cycle";
          } else {
            var d = DOMAINS[idx];
            P.num.textContent = "Domain " + d.n; P.num.style.color = d.color; P.name.textContent = d.name; P.name.style.color = d.color;
            P.range.textContent = d.range; P.ess.textContent = d.essence;
            P.bl1.textContent = "In Practice"; P.bx1.textContent = d.practice;
            P.bl2.textContent = "When Neglected"; P.bx2.textContent = d.neglect;
            if (P.dcN) { P.dcN.textContent = d.h; P.dcN.style.color = d.color; } if (P.dcS) P.dcS.textContent = "of 32 · " + d.name;
          }
        }
        if (reduce || !P.wrap) { swap(); return; }
        P.wrap.classList.add("swap"); setTimeout(function () { swap(); P.wrap.classList.remove("swap"); }, 180);
      }
      wireInteractive(pa, { legend: $("prinLegend"), panel: setPanel, locking: true });
    }
  });
})();
