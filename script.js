const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Cursor light */
const cursorLight = document.querySelector(".cursor-light");
if (cursorLight && !reduceMotion) {
  document.addEventListener("pointermove", (event) => {
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
  });
}

/* Reveal on scroll */
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

/* Mobile menu */
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.getElementById("main-nav");
if (menuToggle && mainNav) {
  const setMenu = (open) => {
    mainNav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };
  menuToggle.addEventListener("click", () => setMenu(!mainNav.classList.contains("open")));
  mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
}

/* Services accordion */
document.querySelectorAll(".service").forEach((service) => {
  const button = service.querySelector(".expand-button");
  const detail = service.querySelector(".service-detail");
  const title = service.querySelector("h3").textContent;
  if (!button || !detail) return;

  button.addEventListener("click", () => {
    const open = detail.hidden;
    detail.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", `${open ? "Ocultar" : "Ver"} detalle de ${title}`);
  });
});

/* Reel play / pause */
document.querySelectorAll(".reel").forEach((reel) => {
  const video = reel.querySelector("video");
  const button = reel.querySelector(".play-toggle");
  if (!video || !button) return;

  const label = button.getAttribute("aria-label").replace(/^Pausar /, "");
  const sync = () => {
    const paused = video.paused;
    button.setAttribute("aria-pressed", String(paused));
    button.setAttribute("aria-label", `${paused ? "Reproducir" : "Pausar"} ${label}`);
  };

  if (reduceMotion) video.pause();

  button.addEventListener("click", () => {
    if (video.paused) video.play();
    else video.pause();
  });
  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);
  sync();
});

/* Running timecode in the hero */
const timecode = document.querySelector(".timecode");
if (timecode && !reduceMotion) {
  let frames = (1 * 60 + 4) * 24 + 12;
  const pad = (n) => String(n).padStart(2, "0");
  setInterval(() => {
    frames += 1;
    const f = frames % 24;
    const s = Math.floor(frames / 24) % 60;
    const m = Math.floor(frames / 1440) % 60;
    const h = Math.floor(frames / 86400);
    timecode.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
  }, 1000 / 24);
}

/* Footer year */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
