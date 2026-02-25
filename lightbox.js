// lightbox.js — shared lightbox carousel for story pages

(function () {
  const overlay = document.getElementById("lightbox");
  if (!overlay) return;

  const track = overlay.querySelector(".lightbox-track");
  const slides = Array.from(overlay.querySelectorAll(".lightbox-slide"));
  const prevBtn = overlay.querySelector(".lightbox-prev");
  const nextBtn = overlay.querySelector(".lightbox-next");
  const closeBtn = overlay.querySelector("#lightbox-close");
  const viewport = overlay.querySelector(".lightbox-viewport");

  let index = 0;

  function clamp(i) {
    const n = slides.length;
    return (i % n + n) % n;
  }

  function update() {
    const n = slides.length;
    if (!n) return;

    index = clamp(index);

    slides.forEach((s, i) => {
      s.classList.remove("is-center", "is-adjacent");
      if (i === index) s.classList.add("is-center");
      if (i === clamp(index - 1) || i === clamp(index + 1)) s.classList.add("is-adjacent");
    });

    const slideW = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap || "0") || 0;
    const offset = (slideW + gap) * index;

    const viewportW = viewport.getBoundingClientRect().width;
    const centerAdjust = (viewportW / 2) - (slideW / 2);

    track.style.transform = `translateX(${centerAdjust - offset}px)`;
  }

  function openAt(i) {
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    index = i;
    update();
  }

  function close() {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Click a thumbnail to open at that slide
  document.querySelectorAll("[data-lightbox-index]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const i = parseInt(el.getAttribute("data-lightbox-index"), 10);
      openAt(isNaN(i) ? 0 : i);
    });
  });

  prevBtn?.addEventListener("click", () => { index -= 1; update(); });
  nextBtn?.addEventListener("click", () => { index += 1; update(); });
  closeBtn?.addEventListener("click", close);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") { index -= 1; update(); }
    if (e.key === "ArrowRight") { index += 1; update(); }
  });

  window.addEventListener("resize", () => {
    if (overlay.classList.contains("active")) update();
  });

  // Initialize layout (in case you open immediately)
  update();
})();
