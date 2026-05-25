/* ░░ AGUXTIN — Chronicles of the Furious Five ░░
   scrollytelling controller — GSAP + ScrollTrigger + Lenis */

gsap.registerPlugin(ScrollTrigger);

/* ── Smooth scroll via Lenis (optional) ────────────────── */
if (typeof Lenis !== "undefined") {
  try {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } catch (e) {
    console.warn("Lenis init failed:", e);
  }
}

/* ── Split words for [data-split] reveal ───────────────── */
document.querySelectorAll("[data-split]").forEach((el) => {
  const text = el.textContent.trim();
  const html = text
    .split(/(\s+)/)
    .map((tok) =>
      /^\s+$/.test(tok)
        ? tok
        : `<span class="word"><span class="word-inner">${tok}</span></span>`
    )
    .join("");
  el.innerHTML = html;
});

/* ── Custom cursor ─────────────────────────────────────── */
const cursor = document.querySelector(".cursor");
const dot = document.querySelector(".cursor-dot");
const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const current = { x: target.x, y: target.y };

gsap.set([cursor, dot], { xPercent: -50, yPercent: -50 });

window.addEventListener("mousemove", (e) => {
  target.x = e.clientX;
  target.y = e.clientY;
  gsap.set(dot, { x: e.clientX, y: e.clientY });
});

gsap.ticker.add(() => {
  current.x += (target.x - current.x) * 0.18;
  current.y += (target.y - current.y) * 0.18;
  gsap.set(cursor, { x: current.x, y: current.y });
});

document.querySelectorAll("a, [data-magnet]").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
});

/* ── Magnetic CTA ──────────────────────────────────────── */
document.querySelectorAll("[data-magnet]").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: "power3.out" });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  });
});

/* ── Subtle 3D tilt on photo cards ─────────────────────── */
document.querySelectorAll("[data-tilt]").forEach((card) => {
  const inner = card.querySelector(".hero-photo-mask, .m-photo-mask");
  if (!inner) return;
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(inner, {
      rotationY: x * 7, rotationX: -y * 7,
      transformPerspective: 1000,
      duration: 0.6, ease: "power3.out",
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(inner, { rotationY: 0, rotationX: 0, duration: 0.9, ease: "power3.out" });
  });
});

/* ── Progress rail ─────────────────────────────────────── */
gsap.set(".rail-fill", { scaleX: 0, transformOrigin: "left center" });
gsap.to(".rail-fill", {
  scaleX: 1, ease: "none",
  scrollTrigger: { trigger: "main", start: "top top", end: "bottom bottom", scrub: 0.3 },
});

/* ── Hero embers (drifting up) ─────────────────────────── */
(() => {
  const host = document.getElementById("embers");
  if (!host) return;
  for (let i = 0; i < 50; i++) {
    const s = document.createElement("span");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = 100 + Math.random() * 20 + "%";
    host.appendChild(s);
    gsap.to(s, {
      y: -window.innerHeight - 200,
      x: (Math.random() - 0.5) * 200,
      opacity: 0.8,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 8,
      repeat: -1,
      ease: "none",
      onRepeat() { gsap.set(s, { y: 0, x: 0, opacity: 0 }); },
    });
  }
})();

/* ── HERO timeline ─────────────────────────────────────── */
const heroTl = gsap.timeline({ delay: 0.15 });
heroTl
  .to(".hero-stack .eyebrow .word-inner", {
    y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.04,
  })
  .to(".display .char", {
    y: 0, opacity: 1, duration: 1.2, ease: "expo.out", stagger: 0.06,
  }, "-=0.6")
  .to(".hero-photo-mask", {
    scale: 1, rotate: 0, duration: 1.4, ease: "expo.out",
  }, "-=0.7")
  .to(".hero-photo-mask img", {
    scale: 1.06, duration: 3.5, ease: "sine.out",
  }, "-=1.2")
  .to(".hero-stamp", {
    opacity: 1, scale: 1, rotate: -8, duration: 0.7, ease: "back.out(2.2)",
  }, "-=0.7")
  .to(".hero-row .hero-glyph", {
    y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.6)", stagger: 0.08,
  }, "-=0.5")
  .to(".hero-stack .lede .word-inner", {
    y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.03,
  }, "-=0.4");

/* Idle float on panda */
gsap.to(".hero-photo", {
  y: -10, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.8,
});

gsap.to(".hero-stack", {
  y: -120, opacity: 0, ease: "none",
  scrollTrigger: { trigger: ".scene-hero", start: "top top", end: "bottom top", scrub: true },
});

/* ── Word reveal for non-hero [data-split] ─────────────── */
gsap.utils.toArray("[data-split]").forEach((el) => {
  if (el.closest(".hero-stack")) return;
  gsap.to(el.querySelectorAll(".word-inner"), {
    y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.04,
    scrollTrigger: { trigger: el, start: "top 85%" },
  });
});

/* ── Section indicator: activate current master ───────── */
document.querySelectorAll(".master").forEach((sec) => {
  const id = sec.id;
  const dot = document.querySelector(`.ind-dot[href="#${id}"]`);
  if (!dot) return;
  ScrollTrigger.create({
    trigger: sec,
    start: "top 50%",
    end: "bottom 50%",
    onToggle: (self) => dot.classList.toggle("active", self.isActive),
  });
});

/* ── I · TIGRESS — kanji reveal + claws slash ──────────── */
{
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".master--tigress",
      start: "top 70%",
      end: "bottom 30%",
      scrub: 0.8,
    },
  });
  tl.to(".master--tigress .m-photo-mask", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1, ease: "power2.out",
    }, 0)
    .to(".master--tigress .m-photo-mask img", {
      scale: 1, ease: "none", duration: 1.6,
    }, 0)
    .to(".master--tigress .m-stamp", {
      opacity: 1, scale: 1, rotate: -8, duration: 0.4, ease: "back.out(2)",
    }, 0.7)
    .to(".master--tigress .claw", {
      strokeDashoffset: 0,
      duration: 1, ease: "power2.inOut",
      stagger: 0.15,
    }, 0.25);
}

/* ── II · MONKEY — bamboo grove parallax + photo wipe ──── */
{
  const tlPhoto = gsap.timeline({
    scrollTrigger: { trigger: ".master--monkey", start: "top 75%", end: "bottom 30%", scrub: 0.8 },
  });
  tlPhoto
    .to(".master--monkey .m-photo-mask", {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.out",
    }, 0)
    .to(".master--monkey .m-photo-mask img", {
      scale: 1.02, ease: "none", duration: 1.6,
    }, 0)
    .to(".master--monkey .m-stamp", {
      opacity: 1, scale: 1, rotate: -8, duration: 0.4, ease: "back.out(2)",
    }, 0.7);

  /* bamboo stalks parallax at different speeds */
  const speeds = [60, -80, 40, -100, 30];
  document.querySelectorAll(".master--monkey .stalk").forEach((s, i) => {
    gsap.to(s, {
      y: speeds[i] || 50,
      ease: "none",
      scrollTrigger: {
        trigger: ".master--monkey",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}

/* ── III · MANTIS — pinned, kanji grows from speck ─────── */
{
  /* create dewdrops */
  const dew = document.getElementById("dew");
  if (dew) {
    for (let i = 0; i < 18; i++) {
      const d = document.createElement("span");
      const size = 8 + Math.random() * 26;
      d.style.width = d.style.height = size + "px";
      d.style.left = Math.random() * 100 + "%";
      d.style.top = Math.random() * 100 + "%";
      dew.appendChild(d);
    }
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".master--mantis",
      start: "top top",
      end: "+=150%",
      scrub: 0.8,
      pin: true,
      pinSpacing: true,
    },
  });
  tl.to(".master--mantis .m-photo-mask", {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1, ease: "power2.out",
    }, 0)
    .to(".master--mantis .m-photo-mask img", {
      scale: 1.04, ease: "none", duration: 1.6,
    }, 0)
    .to(".master--mantis .m-stamp", {
      opacity: 1, scale: 1, rotate: -8, duration: 0.4, ease: "back.out(2)",
    }, 0.6)
    .fromTo(".master--mantis .dew span",
      { opacity: 0, scale: 0 },
      { opacity: 0.85, scale: 1, duration: 0.6, stagger: { amount: 0.6, from: "random" } }, 0.3
    ).fromTo(".master--mantis .m-copy",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.5
    );
}

/* ── IV · VIPER — long curve draws across screen ──────── */
{
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".master--viper",
      start: "top 80%",
      end: "bottom 30%",
      scrub: 0.8,
    },
  });
  tl.to(".master--viper .m-photo-mask", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1, ease: "power2.out",
    }, 0)
    .to(".master--viper .m-photo-mask img", {
      scale: 1, ease: "none", duration: 1.6,
    }, 0)
    .to(".master--viper .m-stamp", {
      opacity: 1, scale: 1, rotate: -8, duration: 0.4, ease: "back.out(2)",
    }, 0.7)
    .to(".master--viper .viper-curve path", {
      strokeDashoffset: 0, ease: "none", duration: 1, stagger: 0.1,
    }, 0);
}

/* ── V · CRANE — pinned, clouds drift, feathers fall ───── */
{
  /* create feathers */
  const fh = document.getElementById("feathers");
  if (fh) {
    for (let i = 0; i < 24; i++) {
      const f = document.createElement("span");
      f.style.left = Math.random() * 100 + "%";
      f.style.top = -5 + "%";
      f.style.transform = `rotate(${(Math.random() - 0.5) * 60}deg)`;
      fh.appendChild(f);

      const dur = 8 + Math.random() * 10;
      gsap.to(f, {
        y: window.innerHeight * 1.2,
        x: (Math.random() - 0.5) * 200,
        rotation: 180 + Math.random() * 360,
        opacity: 0.9,
        duration: dur,
        delay: Math.random() * dur,
        repeat: -1,
        ease: "none",
        onRepeat() { gsap.set(f, { y: 0, x: 0, opacity: 0 }); },
      });
    }
  }

  const cranePhoto = gsap.timeline({
    scrollTrigger: { trigger: ".master--crane", start: "top 75%", end: "bottom 35%", scrub: 0.8 },
  });
  cranePhoto
    .to(".master--crane .m-photo-mask", {
      scale: 1, rotate: 0, duration: 1, ease: "expo.out",
    }, 0)
    .to(".master--crane .m-photo-mask img", {
      scale: 1.04, ease: "none", duration: 1.8,
    }, 0)
    .to(".master--crane .m-stamp", {
      opacity: 1, scale: 1, rotate: -8, duration: 0.5, ease: "back.out(2)",
    }, 0.7);

  /* clouds drift horizontally on scroll */
  const speeds = [180, -120, 220, -80];
  document.querySelectorAll(".master--crane .cloud").forEach((c, i) => {
    gsap.to(c, {
      x: speeds[i] || 100,
      ease: "none",
      scrollTrigger: {
        trigger: ".master--crane",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}

/* ── OUTRO — five row + CTA ────────────────────────────── */
gsap.to(".five-row span", {
  y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.6)", stagger: 0.12,
  scrollTrigger: { trigger: ".scene-outro", start: "top 75%" },
});

gsap.from(".cta", {
  y: 30, opacity: 0, duration: 1.1, ease: "expo.out",
  scrollTrigger: { trigger: ".scene-outro", start: "top 60%" },
});

gsap.to(".outro-sun", {
  scale: 1.2, opacity: 0.7, ease: "none",
  scrollTrigger: {
    trigger: ".scene-outro",
    start: "top bottom",
    end: "bottom bottom",
    scrub: true,
  },
});

window.addEventListener("resize", () => ScrollTrigger.refresh());
