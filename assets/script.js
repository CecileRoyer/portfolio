// Scroll reveal avec effet doux (fade + translateY) + option de stagger
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const applyStagger = (section) => {
  const children = Array.from(section.children);
  children.forEach((child, index) => {
    child.style.transitionDelay = `${index * 70}ms`;
  });
};

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
    if (item.classList.contains("stagger")) {
      applyStagger(item);
    }
  });
} else {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (entry.target.classList.contains("stagger")) {
            applyStagger(entry.target);
          }
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
}

// Mise à jour automatique de l'année
const yearTarget = document.querySelector("[data-year]");
if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

// Parallax subtil sur le hero (souris) — désactivé si reduced motion
const hero = document.querySelector(".hero");
if (hero && !prefersReducedMotion) {
  const onMove = (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) - 0.5;
    const y = ((event.clientY - rect.top) / rect.height) - 0.5;
    hero.style.setProperty("--hero-parallax-x", `${x * 18}px`);
    hero.style.setProperty("--hero-parallax-y", `${y * 18}px`);
  };

  hero.addEventListener("mousemove", onMove);
  hero.addEventListener("mouseleave", () => {
    hero.style.setProperty("--hero-parallax-x", "0px");
    hero.style.setProperty("--hero-parallax-y", "0px");
  });
}

// Parallax ultra léger sur les formes de sections (scroll)
if (!prefersReducedMotion) {
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const offset = window.scrollY * 0.02;
        document.documentElement.style.setProperty("--section-parallax-y", `${-offset}px`);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Sous-menu mobile (accordéon simple, sans framework)
const submenuParents = document.querySelectorAll(".has-submenu");
const isMobileMenu = () => window.matchMedia("(max-width: 760px)").matches;

submenuParents.forEach((parent) => {
  const trigger = parent.querySelector("a");
  if (!trigger) return;
  trigger.addEventListener("click", (event) => {
    if (!isMobileMenu()) return;
    event.preventDefault();
    const isOpen = parent.classList.toggle("submenu-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });
});

window.addEventListener("resize", () => {
  if (!isMobileMenu()) {
    submenuParents.forEach((parent) => {
      parent.classList.remove("submenu-open");
      const trigger = parent.querySelector("a");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }
});

// Ferme le sous-menu si clic en dehors (mobile)
document.addEventListener("click", (event) => {
  if (!isMobileMenu()) return;
  const isInside = event.target.closest(".has-submenu");
  if (!isInside) {
    submenuParents.forEach((parent) => {
      parent.classList.remove("submenu-open");
      const trigger = parent.querySelector("a");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }
});
// Scroll-spy léger pour mettre en évidence la section active
const navLinks = Array.from(document.querySelectorAll(".nav-list a"))
  .filter((link) => link.getAttribute("href")?.startsWith("#"));

if (navLinks.length && !prefersReducedMotion && "IntersectionObserver" in window) {
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = `#${entry.target.id}`;
        const link = navLinks.find((item) => item.getAttribute("href") === id);
        if (link) {
          link.classList.toggle("is-active", entry.isIntersecting);
        }
      });
    },
    { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => spy.observe(section));
}

// Bouton retour en haut (affiché après un léger scroll)
const backToTop = document.querySelector(".back-to-top");
if (backToTop) {
  const toggleBackToTop = () => {
    const show = window.scrollY > 220;
    backToTop.classList.toggle("is-visible", show);
  };
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();
}

// Lightbox simple pour agrandir les images cliquables (hors photo de profil)
const zoomableImages = document.querySelectorAll(".zoomable");
if (zoomableImages.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Fermer l'image">×</button>
    <img class="lightbox__img" alt="" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox__img");
  const closeBtn = lightbox.querySelector(".lightbox__close");

  const getZoomSrc = (el) => {
    if (el.tagName === "IMG") return el.src;
    const dataSrc = el.getAttribute("data-zoom-src");
    if (dataSrc) return dataSrc;
    const bg = window.getComputedStyle(el).backgroundImage;
    const match = /url\([\"']?(.*?)[\"']?\)/.exec(bg);
    return match ? match[1] : "";
  };

  const openLightbox = (el) => {
    const src = getZoomSrc(el);
    if (!src) return;
    lightboxImg.src = src;
    lightboxImg.alt = el.getAttribute("aria-label") || el.alt || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  zoomableImages.forEach((el) => {
    el.addEventListener("click", () => openLightbox(el));
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}
