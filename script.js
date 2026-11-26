(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav + progress
  const nav = $('#nav'), bar = $('#progress');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 30);
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const burger = $('#burger'), menu = $('#menu');
  burger.addEventListener('click', () => {
    const o = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = '';
  }));

  // reveal + counters
  const countUp = el => {
    const to = +el.dataset.count, t0 = performance.now(), dur = 1800;
    const step = t => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-count]', e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .cert').forEach(el => io.observe(el));

  // 3D tilt
  if (!reduce && matchMedia('(hover:hover)').matches) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transition = 'transform .08s';
        el.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(0)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.2,.7,.2,1)'; el.style.transform = '';
      });
    });
  }

  // parallax on scroll for feature images
  if (!reduce) {
    const imgs = $$('.f-media img, .cyl-media img');
    const par = () => imgs.forEach(im => {
      const r = im.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      im.style.transform = `scale(1.14) translateY(${p * -34}px)`;
    });
    addEventListener('scroll', par, { passive: true }); par();
  }

  // hydraulic particle field
  const cv = $('#fx');
  if (cv && !reduce) {
    const ctx = cv.getContext('2d'); let W, H, pts = [], mouse = { x: -999, y: -999 }, run = true;
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.min(110, Math.round(W * H / 14000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6 }));
    };
    size(); addEventListener('resize', size);
    cv.parentElement.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    new IntersectionObserver(([e]) => { run = e.isIntersecting; if (run) loop(); }).observe(cv);
    const loop = () => {
      if (!run) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 22000) { const f = (1 - d2 / 22000) * .6; p.vx += dx / Math.sqrt(d2 + 1) * f * .05; p.vy += dy / Math.sqrt(d2 + 1) * f * .05; }
        p.x += p.vx; p.y += p.vy; p.vx *= .995; p.vy *= .995;
        if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = 'rgba(120,200,255,.75)'; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], ax = p.x - q.x, ay = p.y - q.y, dd = ax * ax + ay * ay;
          if (dd < 15000) { ctx.strokeStyle = `rgba(60,140,255,${(1 - dd / 15000) * .32})`; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
        }
      }
      requestAnimationFrame(loop);
    };
    loop();
  }
})();
