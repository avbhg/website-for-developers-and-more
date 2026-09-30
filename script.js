// profile settings from config.js or defaults
const settings = window.CONFIG || {
  name: "yourname",
  avatar: "avatar.jpg",
  views: "1.4k views",
  bio: ["DEVELOPER // TRUSTED", "BUILDING COOL SHIT"],
  discord: "your_discord",
  github: "https://github.com/yourusername",
  ltc: "YOUR_LTC_WALLET_ADDRESS",
  audio: { track: "audio.mp3", title: "TRACK TITLE", artist: "ARTIST", volume: 0.5 }
};

document.addEventListener('DOMContentLoaded', () => {
  setupConfig();
  setupBlackout();
  setupDeckSwitching();
  setupAudio();
  setupGrainCanvas();
  setupTilt();
  setupTypewriter();
  setupTabTitle();
  setupCopyButtons();
  setupViews();
});

// apply config values to DOM
function setupConfig() {
  if (!window.CONFIG) return;

  const cfg = window.CONFIG;

  if (cfg.name) {
    const hero = document.getElementById('heroNameText');
    if (hero) {
      hero.textContent = cfg.name;
      hero.setAttribute('data-text', cfg.name);
    }
  }

  if (cfg.avatar) {
    const avatar = document.getElementById('avatarImage');
    if (avatar) avatar.src = cfg.avatar;
  }

  if (cfg.audio && cfg.audio.title) {
    const trackLabel = document.getElementById('audioTrackLabel');
    if (trackLabel) {
      const by = cfg.audio.artist ? ` — ${cfg.audio.artist}` : '';
      trackLabel.textContent = `${cfg.audio.title}${by}`;
    }
  }

  if (cfg.github) {
    const ghBtn = document.getElementById('quickGithubBtn');
    if (ghBtn) ghBtn.href = cfg.github;
  }
}

// click to enter blackout screen
function setupBlackout() {
  const blackScreen = document.getElementById('blackScreen');
  if (!blackScreen) return;

  function unlock() {
    if (blackScreen.classList.contains('revealed')) return;
    blackScreen.classList.add('revealed');

    try {
      playAudio(0);
    } catch (e) {}

    setTimeout(() => {
      blackScreen.style.display = 'none';
    }, 650);
  }

  blackScreen.addEventListener('click', unlock);
}

// switch between profile & projects
function setupDeckSwitching() {
  const openBtn = document.getElementById('openPortfolioBtn');
  const backBtn = document.getElementById('portfolioBackBtn');
  const deckProfile = document.getElementById('deckProfile');
  const deckPortfolio = document.getElementById('deckPortfolio');

  if (openBtn && deckProfile && deckPortfolio) {
    openBtn.addEventListener('click', () => {
      deckProfile.classList.remove('active');
      deckPortfolio.classList.add('active');
    });
  }

  if (backBtn && deckProfile && deckPortfolio) {
    backBtn.addEventListener('click', () => {
      deckPortfolio.classList.remove('active');
      deckProfile.classList.add('active');
    });
  }
}

// audio engine (Web Audio API with html5 fallback)
let audioCtx = null;
let audioBuffer = null;
let audioSource = null;
let gainNode = null;
let isPlaying = false;
let startTime = 0;
let pauseOffset = 0;

function setupAudio() {
  const toggleBtn = document.getElementById('audioToggle');
  const bgAudio = document.getElementById('bgAudio');
  if (!toggleBtn) return;

  const audioUrl = (window.CONFIG && window.CONFIG.audio && window.CONFIG.audio.track) || 'audio.mp3';
  const AudioCtx = window.AudioContext || window.webkitAudioContext;

  if (AudioCtx) {
    fetch(audioUrl)
      .then(res => (res.ok ? res.arrayBuffer() : null))
      .then(buf => {
        if (!buf) return;
        audioCtx = new AudioCtx();
        return audioCtx.decodeAudioData(buf);
      })
      .then(decoded => {
        audioBuffer = decoded;
      })
      .catch(() => {});
  }

  toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  });

  if (bgAudio) {
    bgAudio.addEventListener('ended', () => {
      if (!audioBuffer) {
        bgAudio.currentTime = 0;
        bgAudio.play().catch(() => {});
      }
    });
  }
}

function playAudio(offset) {
  const toggleBtn = document.getElementById('audioToggle');
  const bgAudio = document.getElementById('bgAudio');

  if (audioCtx && audioBuffer) {
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      if (audioSource) {
        try { audioSource.stop(); } catch(e) {}
        audioSource.disconnect();
      }

      audioSource = audioCtx.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.loop = true;

      if (!gainNode) {
        gainNode = audioCtx.createGain();
        gainNode.gain.value = (window.CONFIG && window.CONFIG.audio && window.CONFIG.audio.volume) || 0.5;
        gainNode.connect(audioCtx.destination);
      }

      audioSource.connect(gainNode);
      const startAt = (typeof offset === 'number') ? offset : pauseOffset;
      audioSource.start(0, startAt);
      startTime = audioCtx.currentTime - startAt;

      isPlaying = true;
      if (toggleBtn) toggleBtn.classList.add('playing');
      return;
    } catch(e) {}
  }

  if (bgAudio) {
    if (typeof offset === 'number') {
      try { bgAudio.currentTime = offset; } catch(e) {}
    }
    bgAudio.volume = (window.CONFIG && window.CONFIG.audio && window.CONFIG.audio.volume) || 0.5;
    bgAudio.play().then(() => {
      isPlaying = true;
      if (toggleBtn) toggleBtn.classList.add('playing');
    }).catch(() => {});
  }
}

function pauseAudio() {
  const toggleBtn = document.getElementById('audioToggle');
  const bgAudio = document.getElementById('bgAudio');

  if (audioCtx && audioSource) {
    try {
      pauseOffset = (audioCtx.currentTime - startTime) % (audioBuffer ? audioBuffer.duration : 1);
      audioSource.stop();
      audioSource.disconnect();
      audioSource = null;
    } catch (e) {}
  }

  if (bgAudio) {
    try { bgAudio.pause(); } catch(e) {}
  }

  isPlaying = false;
  if (toggleBtn) toggleBtn.classList.remove('playing');
}

// 24fps film grain
function setupGrainCanvas() {
  const canvas = document.getElementById('filmGrain');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth / 2);
  let h = (canvas.height = window.innerHeight / 2);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth / 2;
    h = canvas.height = window.innerHeight / 2;
  });

  const imgData = ctx.createImageData(w, h);
  const buf32 = new Uint32Array(imgData.data.buffer);
  let last = 0;
  const fpsInterval = 1000 / 24;

  function loop(now) {
    requestAnimationFrame(loop);
    if (now - last < fpsInterval) return;
    last = now;

    const len = buf32.length;
    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.12) {
        const c = (Math.random() * 255) | 0;
        buf32[i] = (22 << 24) | (c << 16) | (c << 8) | c;
      } else {
        buf32[i] = 0;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  requestAnimationFrame(loop);
}

// card 3d tilt
function setupTilt() {
  const wrapper = document.getElementById('tiltWrapper');
  const card = document.getElementById('cyberConsole');
  if (!wrapper || !card || window.matchMedia('(pointer: coarse)').matches) return;

  let rect = wrapper.getBoundingClientRect();
  window.addEventListener('resize', () => {
    rect = wrapper.getBoundingClientRect();
  });

  wrapper.addEventListener('mousemove', (e) => {
    rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 5;

    card.style.transform = `perspective(1200px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`;
    card.style.setProperty('--mouse-x', `${Math.round((x / rect.width) * 100)}%`);
    card.style.setProperty('--mouse-y', `${Math.round((y / rect.height) * 100)}%`);
  });

  wrapper.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)';
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.setProperty('--mouse-x', '50%');
    card.style.setProperty('--mouse-y', '50%');
  });
}

// typewriter bio
function setupTypewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;

  const phrases = (window.CONFIG && window.CONFIG.bio) || [
    'DEVELOPER // TRUSTED',
    'FULL-STACK DEVELOPER',
    'CYBERSECURITY ENTHUSIAST',
    'BUILDING COOL SHIT'
  ];

  let pIdx = 0;
  let cIdx = phrases[0].length;
  let deleting = true;

  function step() {
    const cur = phrases[pIdx];

    if (deleting) {
      cIdx--;
      el.textContent = cur.substring(0, cIdx);
    } else {
      cIdx++;
      el.textContent = cur.substring(0, cIdx);
    }

    let delay = deleting ? 40 : 80;

    if (!deleting && cIdx === cur.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      delay = 350;
    }

    setTimeout(step, delay);
  }

  setTimeout(step, 1500);
}

// animated browser tab title
function setupTabTitle() {
  const frames = ['[ b ]', '[ bi ]', '[ bio ]', '[ biol ]', '[ bioli ]', '[ biolin ]', '[ biolink ]', '[ biolin ]', '[ bioli ]', '[ biol ]', '[ bio ]', '[ bi ]'];
  let i = 0;
  setInterval(() => {
    document.title = frames[i];
    i = (i + 1) % frames.length;
  }, 350);
}

// copy to clipboard & toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function copyText(str, cb) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(str).then(cb).catch(() => {
      fallbackCopy(str);
      if (cb) cb();
    });
  } else {
    fallbackCopy(str);
    if (cb) cb();
  }
}

function fallbackCopy(str) {
  const ta = document.createElement('textarea');
  ta.value = str;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
}

function setupCopyButtons() {
  const discordBtn = document.getElementById('quickDiscordBtn');
  const ltcBtn = document.getElementById('ltcCopyBtn');
  const ltcLabel = document.getElementById('ltcBtnLabel');

  const discordTag = (window.CONFIG && window.CONFIG.discord) || 'your_discord';
  const ltcAddr = (window.CONFIG && window.CONFIG.ltc) || 'YOUR_LTC_WALLET_ADDRESS';

  if (discordBtn) {
    discordBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyText(discordTag, () => showToast(`Copied Discord: @${discordTag}`));
    });
  }

  if (ltcBtn) {
    ltcBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyText(ltcAddr, () => {
        if (ltcLabel) {
          ltcBtn.classList.add('copied');
          ltcLabel.textContent = 'COPIED! ✓';
          setTimeout(() => {
            ltcBtn.classList.remove('copied');
            ltcLabel.textContent = 'Copy LTC';
          }, 2000);
        }
        showToast('Copied LTC Address');
      });
    });
  }
}

// client views counter
function setupViews() {
  const el = document.getElementById('viewsCount');
  if (!el) return;

  let views = parseInt(localStorage.getItem('biolink_views') || '1420', 10) + 1;
  localStorage.setItem('biolink_views', views.toString());

  el.textContent = views >= 1000 ? `${(views / 1000).toFixed(1)}k views` : `${views} views`;
}
