/* ═══════════════════════════════════════════
   main.js  –  Nguyen Thanh Thinh Portfolio
   ═══════════════════════════════════════════ */

/* ── PARTICLES CANVAS ── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  const CONFIG = {
    count:        90,
    maxRadius:    2.2,
    speed:        0.35,
    connectDist:  130,
    baseColor:    [0, 212, 255],
    accentColor:  [124, 58, 237],
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    const useAccent = Math.random() > 0.7;
    const [r, g, b] = useAccent ? CONFIG.accentColor : CONFIG.baseColor;
    return {
      x:      randBetween(0, W),
      y:      randBetween(0, H),
      r:      randBetween(0.6, CONFIG.maxRadius),
      alpha:  randBetween(0.2, 0.7),
      dx:     (Math.random() - 0.5) * CONFIG.speed,
      dy:     (Math.random() - 0.5) * CONFIG.speed,
      color:  `rgba(${r},${g},${b}`,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      // Move
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color},${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < CONFIG.connectDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,212,255,${0.1 * (1 - dist / CONFIG.connectDist)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  init();
  draw();
})();


/* ── TYPING ANIMATION ── */
(function initTyping() {
  const roles = [
    'Backend Developer',
    'Laravel Engineer',
    'API Builder',
    'AI App Creator',
  ];
  let ri = 0, ci = 0, deleting = false;
  const el = document.getElementById('typed-text');
  if (!el) return;

  function tick() {
    const cur = roles[ri];
    el.textContent = deleting ? cur.slice(0, ci--) : cur.slice(0, ci++);

    let ms = deleting ? 55 : 85;
    if (!deleting && ci > cur.length)   { ms = 1800; deleting = true; }
    else if (deleting && ci < 0)        { deleting = false; ri = (ri + 1) % roles.length; ci = 0; ms = 350; }

    setTimeout(tick, ms);
  }
  tick();
})();


/* ── NAVBAR SCROLL SHADOW ── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


/* ── MOBILE HAMBURGER ── */
(function initHamburger() {
  const ham   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!ham || !links) return;

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* ── SCROLL REVEAL ── */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


/* ── STAT COUNTER ANIMATION ── */
(function initCounters() {
  const boxes = document.querySelectorAll('.stat-box .sn[data-target]');
  if (!boxes.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.target;
      let current  = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        current += step;
        if (current >= target) { clearInterval(timer); el.textContent = el.dataset.suffix || target; return; }
        el.textContent = current;
      }, 40);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  boxes.forEach(b => io.observe(b));
})();


/* ── CV MODAL ── */
(function initCvModal() {
  const modal   = document.getElementById('cv-modal');
  const iframe  = document.getElementById('cv-iframe');
  const title   = document.getElementById('modal-title');
  const overlay = modal && modal.querySelector('.modal-overlay');
  const closeBtn= modal && modal.querySelector('.modal-close');

  if (!modal) return;

  // Open modal via data-cv attribute on preview buttons
  document.querySelectorAll('[data-cv]').forEach(btn => {
    btn.addEventListener('click', () => {
      const src   = btn.dataset.cv;
      const label = btn.dataset.label || 'CV Preview';

      // Load PDF directly into iframe. Works both when served via HTTP/HTTPS
      // and when opened locally via file:// protocol (no fetch/CORS issues).
      iframe.src = src;
      if (title) title.textContent = label;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  overlay && overlay.addEventListener('click', closeModal);
  closeBtn && closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();


/* ── PROJECT CARD TILT ── */
(function initTilt() {
  const cards = document.querySelectorAll('.proj-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width  - 0.5;
      const y = (e.clientY - top)  / height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
