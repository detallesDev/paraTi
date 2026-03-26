(function () {
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    })();
  }
})();

(function () {
  const c = document.getElementById('bg');
  const cx = c.getContext('2d');
  let W, H, stars = [], pmx = 400, pmy = 300;

  function resize() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const n = Math.min(Math.floor(W * H / 4500), 220);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.004,
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        hue: Math.random() > 0.65 ? 320 + Math.random() * 40 : 255 + Math.random() * 35
      });
    }
  }

  document.addEventListener('mousemove', e => { pmx = e.clientX; pmy = e.clientY; });
  document.addEventListener('touchmove', e => {
    pmx = e.touches[0].clientX;
    pmy = e.touches[0].clientY;
  }, { passive: true });

  function draw() {
    cx.fillStyle = '#050008';
    cx.fillRect(0, 0, W, H);
    stars.forEach(s => {
      const dx = s.x - pmx, dy = s.y - pmy;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) { const f = 0.025 * (1 - d / 110); s.vx += dx / d * f; s.vy += dy / d * f; }
      s.vx *= 0.99; s.vy *= 0.99;
      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
      s.a += s.da;
      if (s.a < 0.1 || s.a > 1) s.da *= -1;
      cx.beginPath();
      cx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      cx.fillStyle = `hsla(${s.hue},80%,80%,${s.a})`;
      cx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

(function () {
  const canvas = document.getElementById('heart-canvas');
  const ctx = canvas.getContext('2d');
  const CW = 340, CH = 300;
  canvas.width = CW; canvas.height = CH;

  function heartXY(t) {
    return {
      x: 16 * Math.pow(Math.sin(t), 3),
      y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
    };
  }

  const particles = [];
  for (let i = 0; i < 1100; i++) {
    const t = Math.random() * Math.PI * 2;
    const s = 0.3 + Math.random() * 0.7;
    const p = heartXY(t);
    particles.push({
      bx: p.x * s, by: p.y * s,
      bz: (Math.random() - 0.5) * 3,
      size: 0.5 + Math.random() * 1.5,
      hue: 295 + Math.random() * 65,
      phase: Math.random() * Math.PI * 2
    });
  }

  let angle = 0;
  function drawHeart() {
    ctx.clearRect(0, 0, CW, CH);
    const cx_ = CW / 2, cy_ = CH / 2 - 4;
    const sc = Math.min(CW, CH) / 40;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const time = Date.now() * 0.001;

    const proj = particles.map(p => {
      const rx = p.bx * cos - p.bz * sin;
      const rz = p.bx * sin + p.bz * cos;
      const pulse = 1 + 0.04 * Math.sin(time * 2 + p.phase);
      return {
        sx: rx * sc * pulse + cx_,
        sy: p.by * sc * pulse + cy_,
        depth: (rz + 18) / 36,
        hue: p.hue,
        size: p.size
      };
    });
    proj.sort((a, b) => a.depth - b.depth);

    proj.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, Math.max(0.3, p.size * (0.4 + p.depth * 0.9)), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},85%,${55 + p.depth * 30}%,${0.3 + p.depth * 0.7})`;
      ctx.fill();
    });

    const grd = ctx.createRadialGradient(cx_, cy_, 0, cx_, cy_, 55);
    grd.addColorStop(0, 'rgba(255,100,180,0.07)');
    grd.addColorStop(1, 'rgba(255,100,180,0)');
    ctx.beginPath(); ctx.arc(cx_, cy_, 55, 0, Math.PI * 2);
    ctx.fillStyle = grd; ctx.fill();

    angle += 0.008;
    requestAnimationFrame(drawHeart);
  }
  drawHeart();
})();

(function () {
  function burst(x, y) {
    for (let i = 0; i < 6; i++) {
      const h = document.createElement('span');
      const chars = ['♡', '✦', '·', '˙'];
      h.textContent = chars[Math.floor(Math.random() * 4)];
      const dx = (Math.random() - 0.5) * 44;
      h.style.cssText = `position:fixed;left:${x}px;top:${y}px;pointer-events:none;z-index:9997;`
        + `font-size:${12 + Math.random() * 14}px;`
        + `animation:floatUp ${0.8 + Math.random() * 0.8}s ease-out forwards;`
        + `transform:translateX(${dx}px);`
        + `color:hsl(${300 + Math.random() * 60},90%,75%)`;
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 1700);
    }
  }
  document.addEventListener('click', e => burst(e.clientX, e.clientY));
  document.addEventListener('touchend', e => {
    const t = e.changedTouches[0];
    burst(t.clientX, t.clientY);
  }, { passive: true });
})();

(function () {
  const startDate = new Date('2024-02-26T09:48:00');
  function update() {
    const diff = Date.now() - startDate;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById('t-days').textContent = String(days).padStart(3, '0');
    document.getElementById('t-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('t-mins').textContent = String(mins).padStart(2, '0');
    document.getElementById('t-secs').textContent = String(secs).padStart(2, '0');
  }
  setInterval(update, 1000);
  update();
})();

(function () {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const d = new Date();
  document.getElementById('letter-date').textContent =
    `${d.getDate()} de ${months[d.getMonth()]}, ${d.getFullYear()}`;
})();

(function () {
  const grid = document.getElementById('gallery-grid');
  const galleryData = [
    { img: 'IMG1.jpg', poem: 'Tu sonrisa ilumina\nmi mundo entero.' },
    { img: 'IMG2.jpg', poem: 'A tu lado,\nel tiempo se detiene.' },
    { img: 'IMG3.jpg', poem: 'Mi lugar favorito\nes contigo.' },
    { img: 'IMG4.jpg', poem: 'Cada día te quiero\nun poco más.' },
    { img: 'IMG5.jpg', poem: 'Eres mi casualidad\nmás bonita.' },
    { img: 'IMG6.jpg', poem: 'Toda una vida\nno basta.' }
  ];

  galleryData.forEach((item, i) => {
    const slot = document.createElement('div');
    slot.className = 'g-slot';
    slot.innerHTML = `
      <div class="g-slot-inner">
        <div class="g-slot-front">
          <img src="${item.img}" alt="Foto ${i + 1}">
          <div class="g-placeholder">
            <span class="g-icon">✦</span>
            <p>Foto ${i + 1}</p>
          </div>
        </div>
        <div class="g-slot-back">
          <p class="g-poem">${item.poem.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `;

    // Si la imagen carga correctamente, ocultamos su placeholder
    const img = slot.querySelector('img');
    img.onload = () => {
      slot.querySelector('.g-placeholder').style.display = 'none';
    };
    img.onerror = () => {
      // Si la foto no existe o no carga, ocultamos el img y mostramos el placeholder
      img.style.display = 'none';
      slot.querySelector('.g-placeholder').style.display = 'flex';
    };

    // Al hacer click, gira la tarjeta
    slot.addEventListener('click', () => {
      slot.classList.toggle('flipped');
    });

    grid.appendChild(slot);
  });
})();

(function () {
  const ids = ['hero', 'heart-section', 'countdown-section', 'letter-section', 'gallery-section'];
  const dots = document.querySelectorAll('.ndot');

  window.scrollToSection = i => {
    document.getElementById(ids[i])?.scrollIntoView({ behavior: 'smooth' });
  };

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const i = ids.indexOf(e.target.id);
        if (i >= 0) dots.forEach((d, j) => d.classList.toggle('active', i === j));
      }
    });
  }, { threshold: 0.45 });

  ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
})();
