document.addEventListener("DOMContentLoaded", function () {
  const content = window.PORTFOLIO_CONTENT || {};
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  applyContent(content);
  scheduleProfileNetBackground();
  renderQuickFacts(content.quickFacts || []);
  renderStats(content.stats || []);
  renderAboutText(content.aboutParagraphs || []);
  renderToolShowcase(content.toolHighlights || []);
  renderSocials(content.socials || []);
  renderProjects(content.projects || []);
  setupProjectCardMotion();
  setupProjectCarousel(content.projects || []);
  renderSkills(content.skills || []);
  renderWorkflow(content.workflow || []);
  startTypingEffect(content.typingRoles || ["Frontend Developer"]);
  setupNavigation(menuToggle, navMenu, navLinks);
  setupProjectTransition(navLinks, menuToggle, navMenu);
  setupContactForm(content.email || "hello@example.com");
  setupActiveSections(navLinks);
  setupRevealAnimations();
  setupViewportMotionBudget();

  document.querySelector("[data-current-year]").textContent = new Date().getFullYear();
});

function applyContent(content) {
  document.querySelectorAll("[data-content]").forEach((element) => {
    const key = element.dataset.content;
    if (content[key]) {
      element.textContent = content[key];
    }
  });

  document.querySelectorAll("[data-image]").forEach((image) => {
    const key = image.dataset.image;
    if (content[key]) {
      image.src = content[key];
    }
  });

  document.querySelectorAll("[data-delay]").forEach((element) => {
    element.style.setProperty("--delay", `${element.dataset.delay}ms`);
  });

  const emailLink = document.querySelector("[data-contact-email]");
  if (emailLink && content.email) {
    emailLink.textContent = content.email;
    emailLink.href = `mailto:${content.email}`;
  }

  document.title = `${content.brandName || "Personal"} Portfolio`;
}

function scheduleProfileNetBackground() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const start = () => setupProfileNetBackground();
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 1600 });
  } else {
    window.setTimeout(start, 900);
  }
}

function setupProfileNetBackground() {
  const target = document.querySelector("[data-vanta-profile]");
  if (!target || !window.VANTA || !window.VANTA.NET || !window.THREE) return;

  const effect = window.VANTA.NET({
    el: target,
    THREE: window.THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.0,
    minWidth: 200.0,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x2afc85,
    backgroundAlpha: 0.0,
    points: 9.0,
    maxDistance: 18.0,
    spacing: 16.0,
    showDots: true
  });

  window.addEventListener("beforeunload", () => effect.destroy());
}

function renderQuickFacts(facts) {
  const container = document.querySelector("[data-list='quickFacts']");
  if (!container) return;

  container.innerHTML = facts.map((fact) => `<span class="quick-fact">${escapeHtml(fact)}</span>`).join("");
}

function renderStats(stats) {
  const container = document.querySelector("[data-list='stats']");
  if (!container) return;

  container.innerHTML = stats
    .map(
      (stat) => `
        <div class="stat-card">
          <strong>${escapeHtml(stat.value)}</strong>
          <span>${escapeHtml(stat.label)}</span>
        </div>
      `
    )
    .join("");
}

function renderAboutText(paragraphs) {
  const container = document.querySelector("[data-about-text]");
  if (!container) return;

  container.innerHTML = paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function renderSocials(socials) {
  const container = document.querySelector("[data-socials]");
  if (!container) return;

  container.innerHTML = socials
    .map(
      (social) => `
        <a href="${escapeAttribute(social.url)}" aria-label="${escapeAttribute(social.name)}" target="_blank" rel="noopener noreferrer">
          <i class="${escapeAttribute(social.icon)}"></i>
        </a>
      `
    )
    .join("");
}

function renderProjects(projects) {
  const container = document.querySelector("[data-projects]");
  if (!container) return;

  container.innerHTML = projects
    .map(
      (project, index) => `
        <article class="project-card" data-project-index="${index}">
          <div class="project-border" aria-hidden="true"></div>
          <div class="project-pattern" aria-hidden="true"></div>
          <div class="project-card-head">
            <span>${escapeHtml(project.title)}</span>
            <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </div>
          ${renderProjectThumb(project)}
          <div class="project-card-body">
            <div class="tag-list">
              ${(project.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

function getProjectImages(project) {
  const gallery = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : [{ src: project.image, label: project.title }];

  return gallery.filter((image) => image?.src);
}

function renderProjectThumb(project) {
  const images = getProjectImages(project);
  const primary = images[0] || { src: project.image, label: project.title };
  const secondary = images[1];

  return `
    <div class="project-thumb${secondary ? " project-thumb-gallery" : ""}">
      <img src="${escapeAttribute(primary.src)}" alt="${escapeAttribute(primary.label || project.title)} preview" loading="lazy" decoding="async" />
      ${secondary ? `
        <div class="project-thumb-secondary" aria-hidden="true">
          <img src="${escapeAttribute(secondary.src)}" alt="" loading="lazy" decoding="async" />
        </div>
        <span class="project-thumb-count">2 previews</span>
      ` : ""}
    </div>
  `;
}

function renderToolShowcase(tools) {
  const container = document.querySelector("[data-tool-showcase]");
  if (!container) return;

  container.innerHTML = tools
    .map(
      (tool, index) => `
        <div class="tool-badge" style="--tool-delay: ${index * 90}ms">
          <i class="${escapeAttribute(tool.icon)}" aria-hidden="true"></i>
          <span>${escapeHtml(tool.name)}</span>
        </div>
      `
    )
    .join("");
}

function setupProjectCarousel(projects) {
  const carousel = document.querySelector("[data-projects]");
  const prevButton = document.querySelector(".project-nav-prev");
  const nextButton = document.querySelector(".project-nav-next");
  const dots = document.querySelector("[data-project-dots]");
  const details = document.querySelector("[data-project-details]");
  const cards = Array.from(document.querySelectorAll(".project-card"));
  const lightbox = createProjectLightbox();

  if (!carousel || cards.length === 0) return;

  let activeIndex = 0;
  let autoplayId = null;
  let touchStartX = null;

  if (dots) {
    dots.innerHTML = cards
      .map(
        (_, index) => `
          <button
            class="project-dot"
            type="button"
            data-project-dot="${index}"
            aria-label="Show project ${index + 1}"
          ></button>
        `
      )
      .join("");
  }

  function updateCarousel(nextIndex) {
    activeIndex = (nextIndex + cards.length) % cards.length;

    cards.forEach((card, index) => {
      const relative = (index - activeIndex + cards.length) % cards.length;
      const position =
        relative === 0 ? "active" :
        relative === 1 ? "next" :
        relative === cards.length - 1 ? "prev" :
        "hidden";

      card.dataset.position = position;
      card.setAttribute("aria-hidden", String(position !== "active"));
      card.tabIndex = position === "active" ? 0 : -1;
    });

    dots?.querySelectorAll(".project-dot").forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

    if (details && projects[activeIndex]) {
      const project = projects[activeIndex];
      details.innerHTML = `
        <div class="project-details-copy">
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.description)}</p>
        </div>
        <div class="project-details-meta">
          <strong>Result</strong>
          <p>${escapeHtml(project.result || "")}</p>
          <div class="tag-list">
            ${(project.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </div>
      `;
    }
  }

  function startAutoplay() {
    window.clearInterval(autoplayId);
    autoplayId = window.setInterval(() => updateCarousel(activeIndex + 1), 6500);
  }

  prevButton?.addEventListener("click", () => {
    updateCarousel(activeIndex - 1);
    startAutoplay();
  });

  nextButton?.addEventListener("click", () => {
    updateCarousel(activeIndex + 1);
    startAutoplay();
  });

  dots?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-dot]");
    if (!button) return;
    updateCarousel(Number(button.dataset.projectDot));
    startAutoplay();
  });

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (index === activeIndex) {
        openProjectLightbox(projects[index], lightbox, () => window.clearInterval(autoplayId), startAutoplay);
        return;
      }
      updateCarousel(index);
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", () => window.clearInterval(autoplayId));
  carousel.addEventListener("mouseleave", startAutoplay);

  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0]?.clientX ?? null;
  }, { passive: true });

  carousel.addEventListener("touchend", (event) => {
    if (touchStartX === null) return;
    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) > 45) {
      updateCarousel(activeIndex + (distance < 0 ? 1 : -1));
      startAutoplay();
    }

    touchStartX = null;
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox?.classList.contains("active")) return;

    if (event.key === "ArrowLeft") {
      updateCarousel(activeIndex - 1);
      startAutoplay();
    }

    if (event.key === "ArrowRight") {
      updateCarousel(activeIndex + 1);
      startAutoplay();
    }
  });

  updateCarousel(0);
  startAutoplay();
}

function createProjectLightbox() {
  const existing = document.querySelector("[data-project-lightbox]");
  if (existing) return existing;

  const lightbox = document.createElement("div");
  lightbox.className = "project-lightbox";
  lightbox.dataset.projectLightbox = "";
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.innerHTML = `
    <button class="project-lightbox__close" type="button" aria-label="Close fullscreen project view">
      <i class="fas fa-xmark"></i>
    </button>
    <figure class="project-lightbox__figure">
      <div class="project-lightbox__media"></div>
      <figcaption></figcaption>
    </figure>
  `;

  document.body.appendChild(lightbox);
  return lightbox;
}

function openProjectLightbox(project, lightbox, onOpen, onClose) {
  if (!project || !lightbox) return;

  const media = lightbox.querySelector(".project-lightbox__media");
  const caption = lightbox.querySelector("figcaption");
  const closeButton = lightbox.querySelector(".project-lightbox__close");
  const images = getProjectImages(project);

  if (media) {
    media.className = `project-lightbox__media${images.length > 1 ? " project-lightbox__media--gallery" : ""}`;
    media.innerHTML = images
      .map(
        (image) => `
          <img src="${escapeAttribute(image.src)}" alt="${escapeAttribute(image.label || project.title)} fullscreen preview" />
        `
      )
      .join("");
  }
  caption.textContent = project.title;
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  onOpen?.();
  closeButton?.focus();

  const closeLightbox = () => {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    onClose?.();
  };

  lightbox.onclick = (event) => {
    if (event.target === lightbox || event.target.closest(".project-lightbox__close")) {
      closeLightbox();
    }
  };

  document.onkeydown = (event) => {
    if (!lightbox.classList.contains("active")) return;
    if (event.key === "Escape") {
      closeLightbox();
    }
  };
}

function setupProjectCardMotion() {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xPercent = x / rect.width;
      const yPercent = y / rect.height;

      card.style.setProperty("--pointer-x", `${x}px`);
      card.style.setProperty("--pointer-y", `${y}px`);
      card.style.setProperty("--rotate-x", `${(0.5 - yPercent) * 7}deg`);
      card.style.setProperty("--rotate-y", `${(xPercent - 0.5) * 7}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--pointer-x", "50%");
      card.style.setProperty("--pointer-y", "50%");
      card.style.setProperty("--rotate-x", "0deg");
      card.style.setProperty("--rotate-y", "0deg");
    });
  });
}

function renderSkills(skills) {
  const container = document.querySelector("[data-skills]");
  if (!container) return;

  container.innerHTML = skills
    .map(
      (group, index) => `
        <article class="skill-group reveal" style="--delay: ${index * 80}ms">
          <i class="${escapeAttribute(group.icon)}"></i>
          <h3>${escapeHtml(group.title)}</h3>
          <div class="skill-list">
            ${(group.items || []).map((item) => `<span class="skill-pill">${escapeHtml(item)}</span>`).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderWorkflow(steps) {
  const container = document.querySelector("[data-list='workflow']");
  if (!container) return;

  container.innerHTML = steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
}

function setupNavigation(menuToggle, navMenu, navLinks) {
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.querySelector("i").classList.toggle("fa-bars", !isOpen);
      menuToggle.querySelector("i").classList.toggle("fa-times", isOpen);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        event.preventDefault();
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      navMenu?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.querySelector("i").classList.add("fa-bars");
      menuToggle?.querySelector("i").classList.remove("fa-times");
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

function setupProjectTransition(navLinks, menuToggle, navMenu) {
  const transition = document.querySelector(".project-transition");
  const projectLinks = document.querySelectorAll('a[href="#projects"]');
  if (!transition || projectLinks.length === 0) return;

  projectLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector("#projects");
      if (!target) return;

      event.preventDefault();
      navMenu?.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.querySelector("i")?.classList.add("fa-bars");
      menuToggle?.querySelector("i")?.classList.remove("fa-times");

      transition.classList.remove("active", "leaving");
      void transition.offsetWidth;
      transition.classList.add("active");

      window.setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        navLinks.forEach((navLink) => navLink.classList.toggle("active", navLink.getAttribute("href") === "#projects"));
      }, 620);

      window.setTimeout(() => {
        transition.classList.add("leaving");
      }, 1180);

      window.setTimeout(() => {
        transition.classList.remove("active", "leaving");
      }, 1680);
    });
  });
}

function startTypingEffect(texts) {
  const typingElement = document.querySelector(".typing-text");
  if (!typingElement || texts.length === 0) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 50;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingDelay = 1500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingDelay = 500;
    }

    setTimeout(type, typingDelay);
  }

  setTimeout(type, 600);
}

function setupContactForm(email) {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const senderEmail = formData.get("email");
    const message = formData.get("message");
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${senderEmail}\n\n${message}`);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
}

function setupActiveSections(navLinks) {
  const sections = document.querySelectorAll("main section[id]");
  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0.05 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupViewportMotionBudget() {
  const animatedGroups = document.querySelectorAll(
    ".tool-showcase, .automation-orbit, .contact-flow"
  );
  if (animatedGroups.length === 0 || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("motion-paused", !entry.isIntersecting);
      });
    },
    { rootMargin: "120px 0px", threshold: 0.01 }
  );

  animatedGroups.forEach((element) => {
    element.classList.add("motion-paused");
    observer.observe(element);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
