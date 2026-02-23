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
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const observerOptions = isMobile
    ? { threshold: 0.1, rootMargin: "0px 0px 15% 0px" }
    : { threshold: 0.2, rootMargin: "0px 0px -10% 0px" };

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
    observerOptions
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

// Menu burger mobile
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  const closeMobileMenu = () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    submenuParents.forEach((parent) => {
      parent.classList.remove("submenu-open");
      const trigger = parent.querySelector("a");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    if (!isOpen) {
      submenuParents.forEach((parent) => {
        parent.classList.remove("submenu-open");
        const trigger = parent.querySelector("a");
        if (trigger) trigger.setAttribute("aria-expanded", "false");
      });
    }
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!isMobileMenu()) return;
      const parentItem = link.closest(".has-submenu");
      const isParentTrigger = parentItem && parentItem.querySelector("a") === link;
      // Ne pas fermer si on clique sur le déclencheur d'un sous-menu
      if (isParentTrigger) return;
      closeMobileMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (!isMobileMenu()) {
      closeMobileMenu();
    }
  });

  // Ferme le menu si clic en dehors (mobile)
  document.addEventListener("click", (event) => {
    if (!isMobileMenu()) return;
    if (!mainNav.classList.contains("is-open")) return;
    const isInsideHeader = event.target.closest(".site-header");
    if (!isInsideHeader) {
      closeMobileMenu();
    }
  });
}

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
const zoomableImages = Array.from(document.querySelectorAll(".zoomable"));
const zoomableWithSrc = zoomableImages.filter((el) => {
  const bg = window.getComputedStyle(el).backgroundImage;
  return el.tagName === "IMG" || (bg && bg !== "none") || el.getAttribute("data-zoom-src");
});

if (zoomableWithSrc.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML = `
    <button class="lightbox__close" aria-label="Fermer l'image">×</button>
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Image précédente">‹</button>
    <button class="lightbox__nav lightbox__nav--next" aria-label="Image suivante">›</button>
    <img class="lightbox__img" alt="" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox__img");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
  const nextBtn = lightbox.querySelector(".lightbox__nav--next");
  let currentIndex = 0;
  let currentGroup = zoomableWithSrc;

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
    const groupId = el.getAttribute("data-zoom-group");
    currentGroup = groupId
      ? zoomableWithSrc.filter((item) => item.getAttribute("data-zoom-group") === groupId)
      : zoomableWithSrc;
    currentIndex = currentGroup.indexOf(el);
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  };

  const showAt = (index) => {
    const total = currentGroup.length;
    currentIndex = (index + total) % total;
    const el = currentGroup[currentIndex];
    const src = getZoomSrc(el);
    if (!src) return;
    lightboxImg.src = src;
    lightboxImg.alt = el.getAttribute("aria-label") || el.alt || "";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  zoomableWithSrc.forEach((el) => {
    el.addEventListener("click", () => openLightbox(el));
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener("click", () => showAt(currentIndex - 1));
  nextBtn.addEventListener("click", () => showAt(currentIndex + 1));
  closeBtn.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
    if (event.key === "ArrowLeft" && lightbox.classList.contains("is-open")) {
      showAt(currentIndex - 1);
    }
    if (event.key === "ArrowRight" && lightbox.classList.contains("is-open")) {
      showAt(currentIndex + 1);
    }
  });
}
