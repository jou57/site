(function () {
  "use strict";

  const LETTER = `Nici nu știu cum să încep sau ce să zic… dar iubire, hey, iubita mea, ascultă-mă. Sper să citești mesajul ăsta. Ne-am certat mult zilele astea, mai ales azi, și stau să analizez tot ce s-a întâmplat. Am înțeles și înțeleg ce ne macină pe amândoi, dar crede-mă… noi ne iubim. Eu te iubesc atât de mult și, Doamne, ești ca ochii din cap pentru mine.

Crede-mă că dacă sunt momente în care nu aud bine sau nu înțeleg ce zici, e din cauza împrejurărilor, nu pentru că nu te ascult. Azi, de exemplu, în autobuz era reclama aia tare și chiar nu am înțeles clar ce ai zis. Eu te mângâiam pe mână și de aia am făcut asocierea aia cu „sunt o drăguță”, dar vezi? Eu am ascultat și tot am încercat să înțeleg ce ai spus.

Apoi, chestia cu Timothy am spus-o doar pentru că am simțit că zici că nu te înțeleg și am vrut să-ți demonstrez contrariul. Gândește-te… după m-am supărat pe tine? Nu. Mi-ai explicat și am înțeles. Am adus în discuție lucrul ăla doar ca să vezi, nu doar din vorbe, că țin la tine, că te iubesc tare și că încerc să te înțeleg mereu.

Știu că, fiind obosită, nervoasă și stresată, mesajul meu poate a fost primit greșit și te-a enervat mai tare, dar intenția mea nu a fost niciodată să te rănesc. Am avut un moment de descărcare și am încercat să-ți explic, poate plângând, poate greșit… dar sincer.

Sunt prost că te-am făcut să plângi și că nu am știut să pun problema cum trebuie. Am greșit și îmi pare rău pentru toate greșelile făcute. Nu vreau să ne pierdem din cauza unor momente urâte, pentru că pentru mine tu contezi enorm. Te iubesc și vreau doar să fim bine, împreună.`;

  const WHISPERS = [
    "te iubesc",
    "îmi pare rău",
    "ești totul",
    "pentru tine",
    "împreună",
    "inima mea",
    "scuze",
    "mereu al tău",
    "noi doi",
    "dragostea mea",
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MUSIC_SRC = "assets/muzica/Theo Rose - Rai pe Pamant Official Video.mp3";
  let musicStarted = false;
  let loaderFinished = false;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Music (autoplay la pornire) ---------- */
  function startAmbientMusic() {
    const audio = document.getElementById("ambientMusic");
    const toggle = document.getElementById("musicToggle");
    if (!audio || musicStarted) return Promise.resolve();

    if (!audio.getAttribute("src") && audio.querySelector("source")) {
      audio.src = audio.querySelector("source").src;
    }
    if (!audio.src) audio.src = MUSIC_SRC;

    audio.volume = 0.4;
    return audio
      .play()
      .then(() => {
        musicStarted = true;
        toggle?.classList.add("is-playing");
        toggle?.setAttribute("aria-label", "Oprește muzica");
      })
      .catch(() => {});
  }

  function initMusicUnlock() {
    const retryOnGesture = () => {
      startAmbientMusic().then(() => {
        if (musicStarted) {
          document.removeEventListener("pointerdown", retryOnGesture);
          document.removeEventListener("keydown", retryOnGesture);
        }
      });
    };
    startAmbientMusic();
    document.addEventListener("pointerdown", retryOnGesture, { passive: true });
    document.addEventListener("keydown", retryOnGesture);
  }

  /* ---------- Loader ---------- */
  function finishLoader() {
    if (loaderFinished) return;
    loaderFinished = true;

    const loader = document.getElementById("loader");
    if (!loader || loader.classList.contains("is-done")) return;

    gsap.to(loader, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        loader.classList.add("is-done");
        document.body.classList.remove("is-loading");
        playIntro();
        ScrollTrigger.refresh();
        setTimeout(() => window.checkLetterTypewriter?.(), 400);
      },
    });
  }

  function initLoader() {
    document.body.classList.add("is-loading");
    const loader = document.getElementById("loader");
    const fill = document.querySelector(".loader__bar-fill");

    startAmbientMusic();

    const enter = () => {
      startAmbientMusic();
      finishLoader();
    };

    loader?.addEventListener("click", enter);
    loader?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    });

    const tl = gsap.timeline({
      onComplete: finishLoader,
    });

    tl.to(fill, { width: "100%", duration: 1.8, ease: "power2.inOut" })
      .to(".loader__heart", { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 }, "-=0.4");
  }

  function playIntro() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.8 })
      .from(".hero__title-line", { y: 40, opacity: 0, duration: 1, stagger: 0.15 }, "-=0.5")
      .from(".hero__subtitle", { y: 24, opacity: 0, duration: 0.8 }, "-=0.6")
      .from("#heroCta", { y: 20, opacity: 0, scale: 0.9, duration: 0.7 }, "-=0.4")
      .from(".hero__scroll", { opacity: 0, duration: 0.6 }, "-=0.3");
  }

  /* ---------- Particles (hearts + stars) ---------- */
  function initParticles() {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, items;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function createItems() {
      const count = Math.min(55, Math.floor((w * h) / 18000));
      items = [];
      for (let i = 0; i < count; i++) {
        items.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.12,
          heart: Math.random() > 0.75,
          alpha: Math.random() * 0.35 + 0.1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      if (prefersReducedMotion) return;
      ctx.clearRect(0, 0, w, h);
      items.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        const a = p.alpha + Math.sin(Date.now() * 0.001 + p.phase) * 0.08;
        ctx.globalAlpha = Math.max(0, a);
        if (p.heart) {
          ctx.fillStyle = "#ff6b8a";
          ctx.font = `${p.r * 6}px serif`;
          ctx.fillText("♥", p.x, p.y);
        } else {
          ctx.fillStyle = "#f4b8c8";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      requestAnimationFrame(draw);
    }

    resize();
    createItems();
    window.addEventListener("resize", () => {
      resize();
      createItems();
    });
    if (!prefersReducedMotion) draw();
  }

  /* ---------- Background whispers ---------- */
  function initWhispers() {
    const el = document.querySelector(".bg-whispers");
    if (!el) return;
    WHISPERS.forEach((text, i) => {
      const span = document.createElement("span");
      span.textContent = text;
      span.style.left = `${(i * 17) % 90 + 5}%`;
      span.style.top = `${(i * 23) % 85 + 5}%`;
      el.appendChild(span);
      if (!prefersReducedMotion) {
        gsap.to(span, {
          y: "+=30",
          x: "+=15",
          duration: 8 + i * 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });
  }

  /* ---------- Floating hearts ---------- */
  function initFloatingHearts() {
    const container = document.getElementById("floatingHearts");
    if (!container || prefersReducedMotion) return;

    function spawn() {
      const heart = document.createElement("span");
      heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.setProperty("--drift", `${(Math.random() - 0.5) * 80}px`);
      heart.style.animationDuration = `${12 + Math.random() * 10}s`;
      heart.style.fontSize = `${0.5 + Math.random() * 0.8}rem`;
      container.appendChild(heart);
      heart.addEventListener("animationend", () => heart.remove());
    }

    setInterval(spawn, 2200);
    for (let i = 0; i < 5; i++) setTimeout(spawn, i * 400);
  }

  /* ---------- Scroll reveals ---------- */
  function initScrollAnimations() {
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 48,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    });

    gsap.utils.toArray(".reason-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: (i % 3) * 0.1,
        ease: "power3.out",
      });
    });

    gsap.to(".hero__glow", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      y: 120,
      opacity: 0.3,
    });

    gsap.from(".letter__card", {
      scrollTrigger: {
        trigger: ".letter__card",
        start: "top 90%",
        once: true,
      },
      y: 36,
      duration: 1,
      ease: "power3.out",
    });

    gsap.to(".finale__gif", {
      scrollTrigger: {
        trigger: ".finale",
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
      y: -60,
      scale: 1.08,
    });
  }

  /* ---------- Typewriter ---------- */
  function initTypewriter() {
    const el = document.getElementById("typewriter");
    const sig = document.querySelector(".letter__signature");
    if (!el) return;

    gsap.set([".letter__card", "#typewriter", ".letter__body"], { opacity: 1, visibility: "visible" });

    let started = false;

    function runTypewriter() {
      if (started) return;
      started = true;
      el.textContent = "";

      typeLetter(el, LETTER, () => {
        el.classList.add("is-done");
        if (sig) {
          sig.classList.add("is-visible");
          gsap.fromTo(sig, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 });
        }
      });
    }

    function checkLetterVisible() {
      if (started) return;
      const card = document.querySelector(".letter__card");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 40) {
        runTypewriter();
      }
    }

    window.checkLetterTypewriter = checkLetterVisible;

    if (prefersReducedMotion) {
      el.textContent = LETTER;
      el.classList.add("is-done");
      if (sig) sig.classList.add("is-visible");
      return;
    }

    ScrollTrigger.create({
      trigger: ".letter__card",
      start: "top 92%",
      once: true,
      onEnter: runTypewriter,
    });

    checkLetterVisible();
    setTimeout(checkLetterVisible, 800);
    setTimeout(checkLetterVisible, 2500);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) runTypewriter();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    const card = document.querySelector(".letter__card");
    if (card) observer.observe(card);
  }

  function typeLetter(el, text, onDone) {
    let i = 0;
    const speed = 10;
    const chunk = text.length > 400 ? 5 : 1;

    function tick() {
      if (i < text.length) {
        el.textContent += text.slice(i, i + chunk);
        i += chunk;
        setTimeout(tick, speed);
      } else if (onDone) {
        onDone();
      }
    }
    tick();
  }

  /* ---------- Carousel ---------- */
  function initCarousel() {
    const track = document.getElementById("carouselTrack");
    const dotsWrap = document.getElementById("carouselDots");
    if (!track || !dotsWrap) return;

    const slides = [...track.querySelectorAll(".carousel__slide")];
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Slide ${i + 1}`);
      dot.addEventListener("click", () => {
        const slide = slides[i];
        slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
      dotsWrap.appendChild(dot);
    });

    const dots = [...dotsWrap.querySelectorAll(".carousel__dot")];

    function updateDots() {
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      slides.forEach((slide, i) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const dist = Math.abs(center - slideCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      dots.forEach((d, i) => d.classList.toggle("is-active", i === closest));
    }

    let scrollTimer;
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateDots, 80);
    }, { passive: true });

    updateDots();
  }

  /* ---------- Forgive + confetti ---------- */
  function initForgive() {
    const btn = document.getElementById("forgiveBtn");
    const response = document.getElementById("forgiveResponse");
    const canvas = document.getElementById("confetti");
    if (!btn || !response) return;

    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      btn.disabled = true;
      response.hidden = false;

      gsap.from(response, { scale: 0.9, opacity: 0, duration: 0.6, ease: "back.out(1.4)" });

      burstHearts();
      if (canvas) runConfetti(canvas);

      if (navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
    });
  }

  function burstHearts() {
    const section = document.getElementById("forgive");
    if (!section) return;
    for (let i = 0; i < 24; i++) {
      const h = document.createElement("span");
      h.textContent = "♥";
      h.style.cssText = `
        position:absolute;left:50%;top:50%;font-size:${14 + Math.random() * 20}px;
        color:#ff6b8a;pointer-events:none;z-index:10;
      `;
      section.appendChild(h);
      const angle = (Math.PI * 2 * i) / 24;
      const dist = 80 + Math.random() * 120;
      gsap.to(h, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40,
        opacity: 0,
        scale: 0.3,
        duration: 1.2 + Math.random() * 0.5,
        ease: "power2.out",
        onComplete: () => h.remove(),
      });
    }
  }

  function runConfetti(canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#ff6b8a", "#f4b8c8", "#ffd4e0", "#c96b7a", "#fff"];
    const pieces = [];
    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 100,
        y: canvas.height * 0.55,
        vx: (Math.random() - 0.5) * 10,
        vy: -Math.random() * 14 - 4,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        heart: Math.random() > 0.6,
      });
    }

    let frame = 0;
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.rot += p.vr;
        if (p.y < canvas.height + 20) alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.heart) {
          ctx.font = `${p.size * 2}px serif`;
          ctx.fillText("♥", 0, 0);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }
        ctx.restore();
      });
      frame++;
      if (alive && frame < 180) requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    loop();
  }

  /* ---------- Music toggle ---------- */
  function initMusic() {
    const toggle = document.getElementById("musicToggle");
    const audio = document.getElementById("ambientMusic");
    if (!toggle || !audio) return;

    toggle.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        if (audio.paused) {
          await startAmbientMusic();
        } else {
          audio.pause();
          musicStarted = false;
          toggle.classList.remove("is-playing");
          toggle.setAttribute("aria-label", "Pornește muzica romantică");
        }
      } catch (_) {}
    });
  }

  /* ---------- Hero CTA smooth scroll ---------- */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id === "#") return;
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initMusicUnlock();
    initLoader();
    initParticles();
    initWhispers();
    initFloatingHearts();
    initScrollAnimations();
    initTypewriter();
    initCarousel();
    initForgive();
    initMusic();
    initSmoothAnchors();
  });
})();
