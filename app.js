// Astryn site interactions: starfield canvas, scroll reveals, nav.
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Starfield ---- */
  const canvas = document.querySelector(".sky-canvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(140, Math.floor((w * h) / 11000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.22 + 0.08,
        amp: Math.random() * 0.18,
        spd: Math.random() * 0.8 + 0.2,
        ph: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.22,
      }));
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = s.base + s.amp * Math.sin(t * 0.001 * s.spd + s.ph);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(184, 149, 79, ${Math.max(0, a) * 1.4})`
          : `rgba(26, 26, 31, ${Math.max(0, a)})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(draw);
  }

  /* ---- Staggered scroll reveal ---- */
  // Give grid children an incremental delay for a cascading entrance.
  document.querySelectorAll(".pillars, .steps, .safety-grid").forEach((grid) => {
    [...grid.children].forEach((child, i) => {
      if (child.classList.contains("reveal")) {
        child.style.transitionDelay = `${i * 0.08}s`;
      }
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- Subtle aurora parallax on pointer move ---- */
  const aurora = document.querySelector(".aurora");
  if (aurora && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("mousemove", (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 24;
      ty = (e.clientY / window.innerHeight - 0.5) * 24;
    });
    (function loop() {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      aurora.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---- Nav scrolled state + mobile toggle ---- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }
})();
