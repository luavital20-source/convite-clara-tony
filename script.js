(function () {
  const gate = document.getElementById('gate');
  const seal = document.getElementById('seal');
  const muteBtn = document.getElementById('muteBtn');
  const music = document.getElementById('music');

  // ---------- Música ----------
  // O play() precisa ser chamado direto dentro do toque do convidado:
  // é isso que faz o iPhone (e qualquer navegador) liberar o som.
  let pausedByUser = false;

  function setPlayingUI(playing) {
    muteBtn.classList.toggle('muted', !playing);
    muteBtn.setAttribute('aria-label', playing ? 'Pausar música' : 'Tocar música');
  }
  function playMusic() {
    const p = music.play();
    if (p && p.catch) p.catch(() => setPlayingUI(false));
  }
  music.addEventListener('play', () => setPlayingUI(true));
  music.addEventListener('pause', () => setPlayingUI(false));

  muteBtn.addEventListener('click', () => {
    if (music.paused) { pausedByUser = false; playMusic(); }
    else { pausedByUser = true; music.pause(); }
  });

  // Pausa ao sair do convite (trocar de app/aba) e retoma ao voltar
  let wasPlaying = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { wasPlaying = !music.paused; music.pause(); }
    else if (wasPlaying && !pausedByUser) playMusic();
  });

  // ---------- Abertura ----------
  const iris = document.querySelector('.iris-ring');
  function openInvite() {
    if (gate.classList.contains('opening')) return;
    gate.classList.add('opening');
    playMusic();
    // 1) anel acende e o texto se dissolve; 2) abertura circular revela a capa
    // centro e raio do anel do monograma: a abertura nasce dali
    const r = seal.getBoundingClientRect();
    [gate, iris].forEach((el) => {
      el.style.setProperty('--cx', r.left + r.width / 2 + 'px');
      el.style.setProperty('--cy', r.top + r.height / 2 + 'px');
      el.style.setProperty('--r0', r.width * 0.445 + 'px');
    });
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.classList.remove('locked');
      gate.classList.add('iris');
      iris.classList.add('go');
    }, 650);
    setTimeout(() => {
      gate.classList.add('done');
      iris.remove();
    }, 2500);
  }
  gate.addEventListener('click', openInvite);

  // ---------- Animações ao rolar ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ---------- Contagem regressiva ----------
  const target = new Date('2026-12-04T15:30:00-03:00').getTime();
  const out = ['d', 'h', 'm', 's'].map((k) => document.getElementById('cd-' + k));
  const pad = (n) => String(n).padStart(2, '0');
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000); diff %= 60000;
    const s = Math.floor(diff / 1000);
    [d, h, m, s].forEach((v, i) => { out[i].textContent = pad(v); });
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
  const copyBtn = document.getElementById('copyPix');
  copyBtn.addEventListener('click', async () => {
    const key = copyBtn.dataset.key;
    try {
      await navigator.clipboard.writeText(key);
    } catch (_) {
      const t = document.createElement('textarea');
      t.value = key; document.body.appendChild(t); t.select();
      document.execCommand('copy'); t.remove();
    }
    const label = copyBtn.querySelector('span');
    copyBtn.classList.add('ok'); label.textContent = 'Chave copiada';
    showToast('Chave Pix copiada!');
    setTimeout(() => { copyBtn.classList.remove('ok'); label.textContent = 'Copiar chave'; }, 2500);
  });
})();
