(function () {
  // "Until I Found You" — Stephen Sanchez (Official Audio)
  const VIDEO_ID = 'MlThQTo6D8A';

  const gate = document.getElementById('gate');
  const seal = document.getElementById('seal');
  const muteBtn = document.getElementById('muteBtn');

  // ---------- Música (YouTube IFrame API) ----------
  // O player começa mudo (o navegador permite autoplay assim) e é
  // desmutado no toque do selo, que conta como interação do usuário.
  let player = null;
  let ready = false;
  let wantsSound = false;

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('yt', {
      videoId: VIDEO_ID,
      width: 1, height: 1,
      playerVars: { autoplay: 1, mute: 1, loop: 1, playlist: VIDEO_ID, controls: 0, disablekb: 1, fs: 0, playsinline: 1 },
      events: {
        onReady: () => { ready = true; if (wantsSound) startMusic(); },
      },
    });
  };
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);

  function startMusic() {
    if (!ready) return;
    player.seekTo(0, true);
    player.unMute();
    player.setVolume(70);
    player.playVideo();
    muteBtn.classList.remove('muted');
    muteBtn.setAttribute('aria-label', 'Silenciar música');
  }

  muteBtn.addEventListener('click', () => {
    if (!ready) return;
    if (player.isMuted() || player.getPlayerState() !== YT.PlayerState.PLAYING) {
      player.unMute(); player.playVideo();
      muteBtn.classList.remove('muted');
      muteBtn.setAttribute('aria-label', 'Silenciar música');
    } else {
      player.mute();
      muteBtn.classList.add('muted');
      muteBtn.setAttribute('aria-label', 'Tocar música');
    }
  });

  // ---------- Abrir envelope ----------
  function openInvite() {
    if (gate.classList.contains('open')) return;
    gate.classList.add('open');
    wantsSound = true;
    startMusic();
    setTimeout(() => {
      document.body.classList.remove('locked');
      window.scrollTo(0, 0);
    }, 1500);
  }
  seal.addEventListener('click', openInvite);

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
