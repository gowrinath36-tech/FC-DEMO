// ============================================
// FOREST CAFE — INTERACTION & SCROLL CHOREOGRAPHY
// Desktop: 4-layer parallax
// Mobile: Single image + subtle parallax
// ============================================

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


// ============================================
// NAV BACKGROUND ON SCROLL
// ============================================

const nav = document.getElementById("nav");

if (nav) {

  ScrollTrigger.create({

    start: 100,

    onUpdate: (self) => {

      if (self.scroll() > 80) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }

    }

  });

}


// ============================================
// FOREST CAFE HERO BRAND REVEAL
// Logo + wordmark: idle breathing float,
// independent of the scroll-driven parallax.
// ============================================

function initHeroBrandFloat() {

  const brand = document.querySelector("#hero-brand-reveal");
  const logo = document.querySelector("#hero-brand-logo");
  const text = document.querySelector("#hero-brand-text");

  if (!brand) return;


  // Always start fully visible in place
  // xPercent:-50 + x:0 = centering (GSAP owns this now,
  // make sure CSS .hero-brand-reveal has NO transform line)
  gsap.set(brand, { opacity: 1, xPercent: -50, x: 0, y: 0, scale: 1 });


  // Reduced motion: no idle float, just show it
  if (reduceMotion) return;


  // ----------------------------------------
  // Slow, organic breathing / wind drift
  // Logo and text move together, with the
  // text getting a touch of independent motion
  // ----------------------------------------

  const floatTl = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: { ease: "sine.inOut" }
  });

  floatTl
    .to(brand, { y: -9, x: 3, duration: 5.5 }, 0)
    .to(logo, { opacity: 0.94, duration: 3.6 }, 0.2)
    .to(
      text,
      { y: -5, x: -3, opacity: 0.95, duration: 4.4 },
      0.4
    );

  // Keep a handle for pausing once it's scrolled out of view
  brand._floatTl = floatTl;


  // ----------------------------------------
  // FOREST CAFE HERO BRAND REVEAL — wind streaks
  // Gentle flowing dash + opacity breathing
  // ----------------------------------------

  const windLines = brand.querySelectorAll(".wind-line");

  if (windLines.length) {

    gsap.to(windLines, {
      strokeDashoffset: -60,
      duration: 6,
      ease: "none",
      repeat: -1,
      stagger: 0.8
    });

    gsap.to(windLines, {
      opacity: 0.15,
      duration: 3.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5
    });

  }

}


// ============================================
// HERO SECTION PIN & REVEAL
// ============================================

function revealHero() {

  if (typeof gsap === "undefined") return;

  const hero = document.querySelector("#hero");

  if (!hero) return;


  // FOREST CAFE HERO BRAND REVEAL — idle float
  initHeroBrandFloat();


  // ==========================================
  // DESKTOP HERO
  // ==========================================

  const desktopMedia = gsap.matchMedia();

  desktopMedia.add(
    "(min-width: 769px)",
    () => {

      // -------------------------------
      // Initial states
      // -------------------------------

      gsap.set(
        [
          "#hero-layer-2 img",
          "#hero-layer-3 img",
          "#hero-layer-4 img"
        ],
        {
          yPercent: 100
        }
      );


      gsap.set(
        ".hero-content",
        {
          opacity: 0,
          y: 50
        }
      );


      gsap.set(
        [".card-left", ".card-right"],
        {
          opacity: 0,
          y: 50
        }
      );


      // -------------------------------
      // Desktop parallax timeline
      // -------------------------------

      const tl = gsap.timeline({

        scrollTrigger: {

          trigger: "#hero",

          start: "top top",

          end: "+=250%",

          scrub: 1,

          pin: true,

          anticipatePin: 1,

          invalidateOnRefresh: true

        }

      });


      tl

        // TREELINE
        .to(
          "#hero-layer-2 img",
          {
            yPercent: 12,
            ease: "none"
          }
        )


        // CAFE
        .to(
          "#hero-layer-3 img",
          {
            yPercent: 8,
            ease: "none"
          },
          "-=0.3"
        )


        // FOREGROUND
        .to(
          "#hero-layer-4 img",
          {
            yPercent: 0,
            ease: "none"
          },
          "-=0.3"
        )


        // FOREST CAFE HERO BRAND REVEAL — quick, light fade
        // right at the very start of scroll, well before
        // treeline/cafe layers rise into that area.
        .to(
          "#hero-brand-reveal",
          Object.assign(
            {
              opacity: 0,
              ease: reduceMotion ? "none" : "power1.in",
              duration: 0.15,
              onStart: () => {
                const brand = document.querySelector("#hero-brand-reveal");
                if (brand && brand._floatTl) brand._floatTl.pause();
              },
              onReverseComplete: () => {
                const brand = document.querySelector("#hero-brand-reveal");
                if (brand && brand._floatTl) brand._floatTl.play();
              }
            },
            reduceMotion ? {} : { y: -14, scale: 0.97 }
          ),
          0
        )


        // HERO CONTENT
        .to(
          ".hero-content",
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "-=0.1"
        )


        // LEFT CARD
        .to(
          ".card-left",
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "<"
        )


        // RIGHT CARD
        .to(
          ".card-right",
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "<"
        );

    }
  );


  // ==========================================
  // MOBILE HERO
  // ==========================================

  desktopMedia.add(
    "(max-width: 768px)",
    () => {

      const mobileImage = hero.querySelector(
        ".hero-mobile-image img"
      );

      const mobileContent = hero.querySelector(
        ".hero-content"
      );


      if (!mobileImage) return;


      // ----------------------------------------
      // Initial mobile state
      // ----------------------------------------

      gsap.set(
        mobileImage,
        {
          yPercent: 0,
          scale: 1.04
        }
      );


      if (mobileContent) {

        gsap.set(
          mobileContent,
          {
            opacity: 0,
            y: 25
          }
        );

      }


      // ----------------------------------------
      // MOBILE SUBTLE PARALLAX
      // ----------------------------------------

      const mobileTimeline = gsap.timeline({

        scrollTrigger: {

          trigger: hero,

          start: "top top",

          /*
            Smaller than desktop.
            Only a little scroll movement.
          */

          end: "+=110%",

          scrub: 0.8,

          pin: true,

          anticipatePin: 1,

          invalidateOnRefresh: true

        }

      });


      mobileTimeline

        // --------------------------------------
        // Image moves VERY SLOWLY
        // --------------------------------------

        .to(
          mobileImage,
          {
            yPercent: -6,
            scale: 1,
            ease: "none"
          }
        )


        // --------------------------------------
        // FOREST CAFE HERO BRAND REVEAL — fades
        // away as the mobile hero settles in
        // --------------------------------------

        .to(
          "#hero-brand-reveal",
          Object.assign(
            {
              opacity: 0,
              ease: reduceMotion ? "none" : "power1.in",
              duration: 0.15,
              onStart: () => {
                const brand = document.querySelector("#hero-brand-reveal");
                if (brand && brand._floatTl) brand._floatTl.pause();
              },
              onReverseComplete: () => {
                const brand = document.querySelector("#hero-brand-reveal");
                if (brand && brand._floatTl) brand._floatTl.play();
              }
            },
            reduceMotion ? {} : { y: -14, scale: 0.97 }
          ),
          0
        )


        // --------------------------------------
        // Content gently appears
        // --------------------------------------

        .to(
          mobileContent,
          {
            opacity: 1,
            y: 0,
            ease: "none"
          },
          "-=0.25"
        );

    }
  );

}


// ============================================
// LOADER → HERO START
// ============================================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const loader =
      document.getElementById("loader");

    const loaderVideo =
      document.getElementById("loader-video");


    let finished = false;


    function startWebsite() {

      if (finished) return;

      finished = true;


      // ----------------------------------------
      // Remove loader
      // ----------------------------------------

      if (loader) {
        loader.classList.add("hidden");
      }


      // ----------------------------------------
      // Allow scrolling
      // ----------------------------------------

      document.body.style.overflow = "auto";


      // ----------------------------------------
      // Start website
      // ----------------------------------------

      requestAnimationFrame(() => {

        // HERO
        revealHero();

        // SOIL TO SIP
        initSoilToSip();

        // CAFE AMBIENCE
        initCafeAmbience();

        // TEXT REVEAL (menu + products headings)
        initTextReveal();

        // Refresh GSAP
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }

      });

    }


    // ==========================================
    // REDUCED MOTION
    // ==========================================

    if (reduceMotion) {

      startWebsite();

      return;

    }


    // ==========================================
    // VIDEO LOADER
    // ==========================================

    if (loaderVideo) {


      // Make sure video starts

      loaderVideo
        .play()
        .catch(() => {});


      // Video completed

      loaderVideo.addEventListener(
        "ended",
        startWebsite,
        {
          once: true
        }
      );


      // Safety fallback

      setTimeout(
        startWebsite,
        7000
      );


    } else {


      // No video → immediately start

      startWebsite();

    }

  }
);



// ============================================
// SOIL TO SIP — JOURNEY CARDS REVEAL
// (This was previously called but never defined,
// causing "initSoilToSip is not defined".)
// Runs independently of the Hero GSAP timeline —
// different trigger, different elements.
// ============================================

function initSoilToSip() {

  if (typeof gsap === "undefined") return;
  if (typeof ScrollTrigger === "undefined") return;

  const section = document.querySelector("#soil-to-sip");

  if (!section) return;

  const journeyCards = section.querySelectorAll(".journey-card");

  if (!journeyCards.length) return;


  // ------------------------------------------
  // Respect reduced motion
  // ------------------------------------------

  if (reduceMotion) {
    gsap.set(journeyCards, { opacity: 1, y: 0 });
    return;
  }


  // ------------------------------------------
  // Initial state
  // ------------------------------------------

  gsap.set(journeyCards, {
    opacity: 0,
    y: 40
  });


  // ------------------------------------------
  // Reveal as the section scrolls into view
  // ------------------------------------------

  gsap.to(journeyCards, {

    opacity: 1,
    y: 0,

    stagger: 0.08,
    ease: "power2.out",

    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      end: "top 25%",
      scrub: 1,
      invalidateOnRefresh: true
    }

  });

}


// ============================================
// CAFE AMBIENCE — AUTOMATIC HORIZONTAL MOVEMENT
// Desktop only — mobile uses a plain
// horizontally-scrollable row (see style.css)
// so it never fights native touch scrolling.
// Runs continuously, independent of scroll —
// not tied to a ScrollTrigger scrub.
// ============================================

function initCafeAmbience() {

  if (typeof gsap === "undefined") return;

  const cafeTrack = document.querySelector(
    ".cafe-ambience-cards"
  );

  if (!cafeTrack) return;

  const cards = cafeTrack.querySelectorAll(
    ".cafe-card"
  );

  if (!cards.length) return;

  if (reduceMotion) return;


  const desktopMedia = gsap.matchMedia();

  desktopMedia.add("(min-width: 769px)", () => {

    const getDistance = () => {

      return Math.max(
        0,
        cafeTrack.scrollWidth -
        window.innerWidth +
        260
      );

    };


    const tween = gsap.to(cafeTrack, {

      x: () => -getDistance(),

      duration: 16,

      ease: "sine.inOut",

      repeat: -1,

      yoyo: true

    });


    return () => tween.kill();

  });

}

/* ============================================
   TEXT REVEAL — word by word, on scroll
   Splits any [data-reveal-text] element into
   individual words (keeping <br> etc. intact),
   wraps each in an overflow-hidden span, and
   animates them in with GSAP as the element
   scrolls into view. Gives headings their own
   quiet bit of movement instead of just popping
   in flat.
   ============================================ */

function splitIntoRevealWords(el) {

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

  if (typeof gsap === "undefined") return;

  const targets = document.querySelectorAll("[data-reveal-text]");

  if (!targets.length) return;

  targets.forEach((el) => {

    const words = splitIntoRevealWords(el);

    if (!words.length) return;

    if (reduceMotion) {
      gsap.set(words, { opacity: 1, yPercent: 0 });
      return;
    }

    gsap.set(words, { yPercent: 130, opacity: 0 });

    gsap.to(words, {

      yPercent: 0,
      opacity: 1,

      duration: 0.9,
      ease: "power3.out",
      stagger: 0.045,

      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse"
      }

    });

  });

}


/* ============================================
   NAV SCROLLSPY & SMOOTH SCROLL
   ============================================ */

(function () {
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");

  if (!navLinks.length || !sections.length) return;

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 150;
      const secHeight = sec.offsetHeight;
      const id = sec.getAttribute("id");

      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
})();

/* ============================================
   IMAGE LOAD → SCROLLTRIGGER RE-REFRESH
   Hero images (sky/treeline/cafe/foreground) are
   large and may still be loading when the initial
   ScrollTrigger.refresh() runs. If their real height
   differs from what was measured, the pin distance
   becomes stale and scroll can jump mid-parallax.
   Refresh again once everything has fully loaded.
   ============================================ */

window.addEventListener("load", () => {

  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }

});

/* ============================================
   GLOBAL RESPONSIVE REFRESH
   ============================================ */

(function () {

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


/* ============================================
   FULL MENU LIGHTBOX MODAL
   (There are two "Explore Menu" buttons on the
   page — highlights section + products section —
   so we bind every .btn-view-menu, not just one id.)
   ============================================ */
(function() {
  const openBtns = document.querySelectorAll('.btn-view-menu');
  const closeBtn = document.getElementById('closeMenuBtn');
  const modal = document.getElementById('menuModal');

  if (openBtns.length && modal && closeBtn) {

    openBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling
      });
    });

    // Close Modal on Close Button Click
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    // Close Modal on Outside Click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }
})();