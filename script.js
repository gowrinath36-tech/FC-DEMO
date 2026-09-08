// ============================================
// FOREST CAFE — "FC MAIN NEW" ANIMATION ENGINE
// GSAP + ScrollTrigger + MotionPathPlugin
// ============================================

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ============================================
// PRELOADER SCREEN ("BREWING THE EXPERIENCE")
// Teapot animation + progress percentage fill
// ============================================
(function initPreloader() {
  const loader = document.getElementById("loader");
  const loaderVideo = document.getElementById("loader-video");
  const fillBar = document.getElementById("loaderFillBar");

  if (!loader) return;

  // Lock scroll initially
  document.body.style.overflow = "hidden";

  let progress = 0;
  let isFinished = false;
  let animationFrame;

  function setProgress(val) {
    progress = Math.min(100, Math.max(progress, val));
    if (fillBar) fillBar.style.width = `${progress}%`;
    loader.setAttribute("aria-valuenow", Math.round(progress));

    if (progress >= 100 && !isFinished) {
      finishPreloader();
    }
  }

  function finishPreloader() {
    if (isFinished) return;
    isFinished = true;
    cancelAnimationFrame(animationFrame);

    // Wait a beat at 100% for user satisfaction, then fade into hero
    setTimeout(() => {
      gsap.to(loader, {
        opacity: 0,
        scale: 1.03,
        duration: 0.85,
        ease: "power2.inOut",
        onComplete: () => {
          loader.classList.add("hidden");
          document.body.style.overflow = "auto";

          // Start interactive components
          requestAnimationFrame(() => {
            revealHero();
            initSoilToSipJourney();
            initCafeAmbience();
            initTextReveal();
            if (typeof ScrollTrigger !== "undefined") {
              ScrollTrigger.refresh();
            }
          });
        }
      });
    }, 280);
  }

  if (reduceMotion) {
    setProgress(100);
    return;
  }

  // Smooth progress hybrid
  let startTime = performance.now();
  const minDuration = 2400; // 2.4s for pleasant intro

  function updateProgress(now) {
    const elapsed = now - startTime;
    let target = (elapsed / minDuration) * 90;

    if (loaderVideo && loaderVideo.duration && !isNaN(loaderVideo.duration)) {
      const videoPercent = (loaderVideo.currentTime / loaderVideo.duration) * 100;
      target = Math.max(target, videoPercent);
    }

    if (elapsed >= minDuration) {
      target = 100;
    }

    setProgress(target);

    if (progress < 100) {
      animationFrame = requestAnimationFrame(updateProgress);
    }
  }

  if (loaderVideo) {
    loaderVideo.play().catch(() => {});
    loaderVideo.addEventListener("ended", () => setProgress(100), { once: true });
  }

  animationFrame = requestAnimationFrame(updateProgress);

  // Safety fallback
  setTimeout(() => setProgress(100), 5500);
})();

// ============================================
// STICKY HEADER & NAV SCROLLSPY
// Dark-brown bar (#1c1410) with smooth scroll binding
// ============================================
(function initNavigation() {
  const header = document.getElementById("site-header");
  const navLinks = document.querySelectorAll(".nav-links .nav-link");
  const sections = document.querySelectorAll("section[id]");

  if (header) {
    ScrollTrigger.create({
      start: 60,
      onUpdate: (self) => {
        if (self.scroll() > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      }
    });
  }

  // Smooth Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Active Link ScrollSpy
  if (navLinks.length && sections.length) {
    function updateActiveNav() {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollY + windowHeight >= docHeight - 50) {
        navLinks.forEach((link, idx) => {
          link.classList.toggle("active", idx === navLinks.length - 1);
        });
        return;
      }

      sections.forEach((sec) => {
        const secTop = sec.offsetTop - 140;
        const secHeight = sec.offsetHeight;
        const id = sec.getAttribute("id");

        if (scrollY >= secTop && scrollY < secTop + secHeight) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
  }
})();

// ============================================
// HERO BRAND REVEAL — ORGANIC FLOAT & WIND
// ============================================
function initHeroBrandFloat() {
  const brand = document.querySelector("#hero-brand-reveal");
  const logo = document.querySelector("#hero-brand-logo");
  const text = document.querySelector("#hero-brand-text");

  if (!brand) return;

  gsap.set(brand, { opacity: 1, xPercent: -50, x: 0, y: 0, scale: 1 });

  if (reduceMotion) return;

  const floatTl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: { ease: "sine.inOut" }
  });

  floatTl
    .to(brand, { y: -10, x: 4, duration: 5.5 }, 0)
    .to(logo, { opacity: 0.95, duration: 3.5 }, 0.2)
    .to(text, { y: -6, x: -3, opacity: 0.95, duration: 4.5 }, 0.4);

  brand._floatTl = floatTl;

  const windLines = brand.querySelectorAll(".wind-line");
  if (windLines.length) {
    gsap.to(windLines, {
      strokeDashoffset: -70,
      duration: 5.5,
      ease: "none",
      repeat: -1,
      stagger: 0.6
    });

    gsap.to(windLines, {
      opacity: 0.2,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.4
    });
  }
}

// ============================================
// HERO SECTION PARALLAX & REVEAL (UNCLIPPED LAYERS)
// ============================================
function revealHero() {
  const hero = document.querySelector("#hero");
  if (!hero) return;

  initHeroBrandFloat();

  const mm = gsap.matchMedia();

  // Desktop 4-Layer Parallax
  mm.add("(min-width: 769px)", () => {
    gsap.set(["#hero-layer-2 img", "#hero-layer-3 img", "#hero-layer-4 img"], {
      yPercent: 85
    });

    gsap.set(".hero-content", { opacity: 0, y: 45 });
    gsap.set([".card-left", ".card-right"], { opacity: 0, y: 40 });

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "+=240%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    heroTl
      // Treeline & Leaves rise
      .to("#hero-layer-2 img", { yPercent: 0, ease: "none", duration: 1 }, 0)
      // Cafe entrance & roofline emerges
      .to("#hero-layer-3 img", { yPercent: 0, ease: "none", duration: 1.2 }, 0.2)
      // Foreground hanging lamp fixtures & plants emerge 100% full
      .to("#hero-layer-4 img", { yPercent: 0, ease: "none", duration: 1.3 }, 0.4)
      // Brand reveal gently fades
      .to(
        "#hero-brand-reveal",
        {
          opacity: 0,
          y: -20,
          scale: 0.95,
          duration: 0.4,
          ease: "power1.in",
          onStart: () => {
            const b = document.querySelector("#hero-brand-reveal");
            if (b && b._floatTl) b._floatTl.pause();
          },
          onReverseComplete: () => {
            const b = document.querySelector("#hero-brand-reveal");
            if (b && b._floatTl) b._floatTl.play();
          }
        },
        0.1
      )
      // Hero content typography emerges
      .to(".hero-content", { opacity: 1, y: 0, ease: "power1.out", duration: 0.8 }, 0.7)
      // Floating feature badges
      .to(".card-left", { opacity: 1, y: 0, ease: "power1.out", duration: 0.8 }, 0.8)
      .to(".card-right", { opacity: 1, y: 0, ease: "power1.out", duration: 0.8 }, 0.85);
  });

  // Mobile Parallax
  mm.add("(max-width: 768px)", () => {
    const mobileImg = hero.querySelector(".hero-mobile-image img");
    const content = hero.querySelector(".hero-content");

    if (mobileImg) {
      gsap.set(mobileImg, { yPercent: 0, scale: 1.05 });
      if (content) gsap.set(content, { opacity: 0, y: 30 });

      const mobileTl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      mobileTl
        .to(mobileImg, { yPercent: -5, scale: 1, ease: "none" }, 0)
        .to("#hero-brand-reveal", { opacity: 0, duration: 0.2 }, 0)
        .to(content, { opacity: 1, y: 0, ease: "power1.out" }, 0.3);
    }
  });
}

// ============================================
// SOIL TO SIP PINNED JOURNEY (LEFT-TO-RIGHT DIRECTION)
// - Pinning (#soil-to-sip, pin: true) with scrub: 1.5
// - MotionPathPlugin: Coffee bean animates Left-to-Right ABOVE card margins
// - Clean Step Node SVGs (Planting, Beans, Grinder, Terminal Cup)
// - Terminal Cup at z-index: 20 with overflow: visible
// ============================================
function initSoilToSipJourney() {
  const section = document.querySelector("#soil-to-sip");
  if (!section) return;

  const trackWrapper = section.querySelector(".journey-track-wrapper");
  const journeyCards = section.querySelectorAll(".journey-card");
  const coffeeBean = document.querySelector("#coffee-bean");
  const motionPath = document.querySelector("#journey-motion-path");
  const terminalCup = document.querySelector("#terminal-cup");
  const nodePlanting = document.querySelector("#node-planting");
  const nodeBeans = document.querySelector("#node-beans");
  const nodeGrinder = document.querySelector("#node-grinder");

  const mm = gsap.matchMedia();

  // Desktop Pinned Journey Choreography
  mm.add("(min-width: 769px)", () => {
    // Initial States
    if (journeyCards.length) {
      gsap.set(journeyCards, { opacity: 0, y: 30, scale: 0.96 });
    }

    if (coffeeBean && motionPath) {
      gsap.set(coffeeBean, {
        opacity: 0,
        scale: 0.6,
        motionPath: {
          path: motionPath,
          align: motionPath,
          alignOrigin: [0.5, 0.5],
          start: 0,
          end: 0
        }
      });
    }

    if (terminalCup) {
      gsap.set(terminalCup, { scale: 1 });
    }

    const getTrackShift = () => {
      if (!trackWrapper) return 0;
      const trackRight = trackWrapper.offsetLeft + trackWrapper.offsetWidth;
      return Math.max(0, trackRight - window.innerWidth + 40);
    };

    // Pinned Master Timeline
    const masterJourneyTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=260%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Step 1: Journey Cards Sequential Stagger Entrance (01 Soil to 08 Sip)
    if (journeyCards.length) {
      masterJourneyTl.to(
        journeyCards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.07,
          ease: "power2.out",
          duration: 1.0
        },
        0
      );
    }

    // Step 2: Track Horizontal Glide if viewport is narrower than track width
    if (trackWrapper) {
      masterJourneyTl.to(
        trackWrapper,
        {
          x: () => -getTrackShift(),
          duration: 3.2,
          ease: "power1.inOut"
        },
        0.3
      );
    }

    // Step 3: Coffee Bean Appears at Genesis (Planting Node on Left)
    if (coffeeBean) {
      masterJourneyTl.to(
        coffeeBean,
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(2)"
        },
        0.2
      );
    }

    // Pulse node 1 (Planting)
    if (nodePlanting) {
      masterJourneyTl.to(nodePlanting, { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1 }, 0.3);
    }

    // Step 4: Coffee Bean Motion Path Traversal (Left-to-Right ABOVE Cards)
    if (coffeeBean && motionPath) {
      masterJourneyTl.to(
        coffeeBean,
        {
          motionPath: {
            path: motionPath,
            align: motionPath,
            alignOrigin: [0.5, 0.5],
            autoRotate: 90,
            start: 0,
            end: 1
          },
          duration: 3.2,
          ease: "power1.inOut"
        },
        0.3
      );

      // Pulse node 2 (Harvest / Beans) near halfway
      if (nodeBeans) {
        masterJourneyTl.to(nodeBeans, { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1 }, 1.5);
      }

      // Pulse node 3 (Grinder) near 75%
      if (nodeGrinder) {
        masterJourneyTl.to(nodeGrinder, { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1 }, 2.4);
      }

      // Bean lands into terminal coffee cup
      masterJourneyTl.to(
        coffeeBean,
        {
          scale: 0.2,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        },
        3.3
      );
    }

    // Step 5: Terminal Cup Reaction (Crema & Steam Activation, z-index: 20)
    if (terminalCup) {
      masterJourneyTl.to(
        terminalCup,
        {
          scale: 1.15,
          duration: 0.45,
          ease: "back.out(2)",
          onStart: () => {
            terminalCup.classList.add("active");
          },
          onReverseComplete: () => {
            terminalCup.classList.remove("active");
          }
        },
        3.35
      );
    }

    // Settling pause before unpinning cleanly
    masterJourneyTl.to({}, { duration: 0.4 });
  });

  // Mobile Fallback: Natural Scroll Reveal
  mm.add("(max-width: 768px)", () => {
    if (journeyCards.length) {
      gsap.fromTo(
        journeyCards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 20%",
            scrub: 1
          }
        }
      );
    }
  });
}

// ============================================
// CAFE AMBIENCE — NATURAL LEFT-TO-RIGHT HORIZONTAL MOVEMENT
// ============================================
function initCafeAmbience() {
  const cafeTrack = document.querySelector(".cafe-ambience-cards");
  if (!cafeTrack || reduceMotion) return;

  const mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", () => {
    const getDistance = () => {
      const parent = cafeTrack.parentElement;
      const parentWidth = parent ? parent.clientWidth : window.innerWidth;
      return Math.max(0, cafeTrack.scrollWidth - parentWidth + 80);
    };

    // Animate Left-to-Right (from negative offset towards 0)
    gsap.set(cafeTrack, { x: () => -getDistance() });

    const driftTween = gsap.to(cafeTrack, {
      x: 0,
      duration: 20,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    return () => driftTween.kill();
  });
}

// ============================================
// WORD-BY-WORD HEADLINE TEXT REVEAL
// ============================================
function splitIntoRevealWords(el) {
  if (el.dataset.revealed === "true") {
    return el.querySelectorAll(".reveal-word");
  }
  el.dataset.revealed = "true";

  function walk(node) {
    const frag = document.createDocumentFragment();

    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (part.trim() === "") {
            frag.appendChild(document.createTextNode(part));
            return;
          }

          const wrap = document.createElement("span");
          wrap.className = "reveal-word-wrap";

          const word = document.createElement("span");
          word.className = "reveal-word";
          word.textContent = part;

          wrap.appendChild(word);
          frag.appendChild(wrap);
        });
      } else {
        frag.appendChild(child.cloneNode(true));
      }
    });

    return frag;
  }

  const rebuilt = walk(el);
  el.innerHTML = "";
  el.appendChild(rebuilt);

  return el.querySelectorAll(".reveal-word");
}

function initTextReveal() {
  const targets = document.querySelectorAll("[data-reveal-text]");
  if (!targets.length) return;

  targets.forEach((el) => {
    const words = splitIntoRevealWords(el);
    if (!words.length) return;

    if (reduceMotion) {
      gsap.set(words, { opacity: 1, yPercent: 0 });
      return;
    }

    gsap.set(words, { yPercent: 120, opacity: 0 });

    gsap.to(words, {
      yPercent: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.04,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse"
      }
    });
  });
}

// ============================================
// FULL MENU LIGHTBOX MODAL
// ============================================
(function initMenuModal() {
  const openBtns = document.querySelectorAll(".btn-view-menu");
  const closeBtn = document.getElementById("closeMenuBtn");
  const modal = document.getElementById("menuModal");
  let previousActiveEl = null;

  if (!openBtns.length || !modal || !closeBtn) return;

  function openModal(trigger) {
    previousActiveEl = trigger || document.activeElement;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    if (previousActiveEl && typeof previousActiveEl.focus === "function") {
      previousActiveEl.focus();
    }
  }

  openBtns.forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn));
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });
})();

// ============================================
// GLOBAL REFRESH ON WINDOW LOAD & RESIZE
// ============================================
window.addEventListener("load", () => {
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }
});

(function handleResize() {
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 250);
  });
})();