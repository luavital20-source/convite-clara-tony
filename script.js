(function () {
  const envelope = document.getElementById('envelope');
  const player = document.getElementById('player');
  const spotify = document.getElementById('spotify');

  // ---------- Abrir envelope ----------
  function openInvite() {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    document.body.classList.remove('locked');
    // Carrega o player do Spotify após o toque (navegadores bloqueiam autoplay sem interação)
    spotify.src = spotify.dataset.src;
    setTimeout(() => {
      player.classList.add('show');
      player.setAttribute('aria-hidden', 'false');
    }, 1400);
    // Recolhe o painel depois de alguns segundos, deixando só o botão
    setTimeout(() => player.classList.add('collapsed'), 9000);
  }
  envelope.addEventListener('click', openInvite);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvite(); }
  });

  document.getElementById('playerToggle').addEventListener('click', () => {
    player.classList.toggle('collapsed');
  });

  // ---------- Animações ao rolar ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------- Contagem regressiva ----------
  const target = new Date('2026-12-04T15:30:00-03:00').getTime();
  const el = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s'),
  };
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000); diff %= 60000;
    const s = Math.floor(diff / 1000);
    el.d.textContent = pad(d); el.h.textContent = pad(h);
    el.m.textContent = pad(m); el.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  // ---------- Copiar Pix ----------
  const toast = document.getElementById('toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }
  document.getElementById('copyPix').addEventListener('click', async (e) => {
    const key = e.currentTarget.dataset.key;
    try {
      await navigator.clipboard.writeText(key);
    } catch (_) {
      const t = document.createElement('textarea');
      t.value = key; document.body.appendChild(t); t.select();
      document.execCommand('copy'); t.remove();
    }
    showToast('Chave Pix copiada!');
  });
})();
