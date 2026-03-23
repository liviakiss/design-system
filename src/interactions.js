/**
 * interactions.js — ALIVE Design Studio
 *
 * 1. Magnetic cursor  (.btn--primary, .card)
 * 2. Button ripple    (.btn)
 * 3. Warm ink reveal  (h1, h2, h3)
 */

document.addEventListener("DOMContentLoaded", () => {
  initMagnetic();
  initRipple();
  initInkReveal();
});

/* ══════════════════════════════════════════════════════════
   1. MAGNETIC CURSOR
   Polls mousemove on the document. When the cursor comes
   within THRESHOLD px of a magnetic element, it slowly
   pulls toward the cursor (max MAX_MOVE px displacement).
   Springs back on departure.
   ══════════════════════════════════════════════════════════ */

function initMagnetic() {
  const THRESHOLD = 80;   // px — pull radius
  const MAX_MOVE  = 12;   // px — max element displacement
  const EASE_IN   = "transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)";
  const EASE_OUT  = "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)";

  const els = [...document.querySelectorAll(".btn--primary, .card")];
  if (!els.length) return;

  // Cache bounding rects; refresh on scroll + resize
  let rects = computeRects(els);

  const refresh = () => { rects = computeRects(els); };
  window.addEventListener("resize", refresh, { passive: true });
  window.addEventListener("scroll", refresh, { passive: true });

  document.addEventListener("mousemove", (e) => {
    els.forEach((el, i) => {
      const rect = rects[i];
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < THRESHOLD) {
        // Strength: 0 at edge, 1 at centre
        const pull = (1 - dist / THRESHOLD);
        const x    = (dx / THRESHOLD) * MAX_MOVE * pull;
        const y    = (dy / THRESHOLD) * MAX_MOVE * pull;
        el.style.transition = EASE_IN;
        el.style.transform  = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
      } else if (el.style.transform) {
        // Spring back only if we were pulled (avoid redundant style writes)
        el.style.transition = EASE_OUT;
        el.style.transform  = "";
      }
    });
  }, { passive: true });
}

function computeRects(els) {
  return els.map(el => el.getBoundingClientRect());
}


/* ══════════════════════════════════════════════════════════
   2. BUTTON RIPPLE
   On click, injects a .btn__ripple span at the exact cursor
   position. CSS handles the scale + fade animation.
   ══════════════════════════════════════════════════════════ */

function initRipple() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    const SIZE = 60; // px — matches CSS .btn__ripple width/height

    // Clean up any leftover ripples (e.g. rapid clicking)
    btn.querySelectorAll(".btn__ripple").forEach(r => r.remove());

    const rect   = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className  = "btn__ripple";
    ripple.style.left = `${e.clientX - rect.left - SIZE / 2}px`;
    ripple.style.top  = `${e.clientY - rect.top  - SIZE / 2}px`;

    btn.appendChild(ripple);

    ripple.addEventListener(
      "animationend",
      () => ripple.remove(),
      { once: true }
    );
  });
}


/* ══════════════════════════════════════════════════════════
   3. WARM INK REVEAL
   Finds all h1/h2/h3, marks them .ink-reveal (CSS does the
   gradient + clip trick), then fires .is-visible via
   IntersectionObserver when they enter the viewport.
   Stagger: each heading in DOM order gets +120 ms delay.
   ══════════════════════════════════════════════════════════ */

function initInkReveal() {
  const headings = [...document.querySelectorAll("h1, h2, h3")];
  if (!headings.length) return;

  // Assign DOM-order stagger delays before observing
  headings.forEach((el, i) => {
    el.classList.add("ink-reveal");
    el.style.setProperty("--stagger-delay", `${i * 120}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // fires once only
      });
    },
    { threshold: 0.15 }
  );

  headings.forEach(el => observer.observe(el));
}
