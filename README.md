# ⚡ Dark Biolink & Developer Portfolio Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> A modern, ultra-clean dark cyberpunk biolink and developer portfolio template. Designed with high-performance glassmorphism, 3D specular tilt physics, 35mm analog film grain, zero-latency Web Audio API player, live views counter, and dual-deck sliding panels.

---

## ✨ Features

- **🎬 Cinematic Blackout Shutter**: Minimalist `"click to enter_"` start screen with smooth parting doors animation.
- **💎 Obsidian Glass Card**: Dual-wing console layout with real-time mouse-tracking 3D specular reflections and tilt physics.
- **🎵 Zero-Latency Web Audio API Engine**: Floating audio equalizer widget with volume control and instant play on unlock.
- **📁 Dynamic Dual-Deck System**: Seamlessly flip between the main **Profile Deck** and the **Projects Deck** without page reloads or ugly scrollbars.
- **🪙 Dedicated Litecoin (LTC) Copy Button**: Instant tactile clipboard copy with visual checkmark feedback.
- **💬 Quick Discord & GitHub Integration**: One-click Discord handle copying and direct GitHub repository links.
- **⚡ Live Views Counter**: Client-side persistent counter styled with clean live indicator.
- **⌨️ Monospace Typewriter Loop**: Smooth typing and deleting animation cycling through customizable developer bio tags.
- **⚙️ 60-Second Setup via `config.js`**: Easily customize your entire biolink without needing to touch complex HTML or CSS.

---

## 📁 File Structure & Naming Convention

```
dark-biolink-template/
├── index.html            # Main site structure & layout
├── style.css             # Cyberpunk glass styling & responsive design
├── script.js             # Blackout opening, Web Audio API, tilt, copy engine
├── config.js             # Central configuration file for your details
├── INSTRUCTIONS.txt      # Quick setup guide
├── LICENSE               # MIT Open Source License
├── README.md             # Repository documentation
├── avatar.jpg            # (Drop your profile picture here)
├── background.mp4        # (Drop your looping background video here)
└── audio.mp3             # (Drop your background music track here)
```

> [!TIP]
> **Media File Naming:**
> - `avatar.jpg` — Your square or circular profile avatar.
> - `background.mp4` — Your looping ambient video (e.g. anime, city lights, aesthetic vibes).
> - `audio.mp3` — Your background music track.
> *(If you don't add background or audio files, the site automatically renders an elegant obsidian dark background!)*

---

## 🚀 Quick Setup Guide

### 1. Customize `config.js`
Open `config.js` in any text editor and fill in your details:
```javascript
const CONFIG = {
  name: "yourname",
  avatar: "avatar.jpg",
  views: "1.4k views",
  bio: [
    "DEVELOPER // TRUSTED",
    "FULL-STACK DEVELOPER",
    "BUILDING COOL SHIT"
  ],
  discord: "your_discord",
  github: "https://github.com/yourusername",
  ltc: "YOUR_LTC_WALLET_ADDRESS",
  audio: {
    track: "audio.mp3",
    title: "TRACK TITLE",
    artist: "ARTIST",
    volume: 0.5
  }
};
```


## 📜 License
Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.
