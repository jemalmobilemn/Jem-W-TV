
/* =========================================
   JEM TV — RESPONSIVE CHANNEL LAYOUT
   DARK MODE + LIGHT MODE
   ========================================= */

:root {
  color-scheme: dark;
  --bg: #0b0f19;
  --surface: #151b2b;
  --surface-hover: #202a40;
  --text: #f3f6fc;
  --muted: #9ca9bf;
  --border: #29344a;
  --accent: #18c995;
  --accent-text: #061b15;
  --player-bg: #000;
}

html[data-theme="light"] {
  color-scheme: light;
  --bg: #f3f6fb;
  --surface: #ffffff;
  --surface-hover: #e9eef7;
  --text: #182235;
  --muted: #657189;
  --border: #dce3ee;
  --accent: #078b68;
  --accent-text: #ffffff;
  --player-bg: #101010;
}

html,
body {
  margin: 0;
  min-height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Arial, sans-serif;
  transition: background-color .2s ease, color .2s ease;
}

* {
  box-sizing: border-box;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

#tv-view,
#settings-view {
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
}

#settings-view[hidden],
#tv-view[hidden] {
  display: none !important;
}

/* Main responsive layout */
.tv-layout,
.player-layout,
.main-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
  gap: 18px;
  align-items: start;
  width: 100%;
  max-width: 1500px;
  margin-inline: auto;
  padding: 16px;
}

/* Player */
#tv-player,
video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: contain;
  background: var(--player-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
}

.player-message,
#player-message {
  color: var(--muted);
  padding: 10px 12px;
  background: var(--surface);
  border-radius: 10px;
  overflow-wrap: anywhere;
}

#playing-title {
  color: var(--text);
  font-size: 1.15rem;
  font-weight: 750;
  overflow-wrap: anywhere;
}

#playing-category,
#playing-code,
#player-status,
#channel-count {
  color: var(--muted);
}

/* Channel panel */
#channels-playlist {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  max-height: 72vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
}

.playlist-item {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) 36px 24px;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 66px;
  padding: 9px 10px;
  color: var(--text);
  text-align: left;
  background: var(--surface);
  border: 1px solid transparent;
  border-radius: 11px;
  transition: background .15s ease, border-color .15s ease;
}

.playlist-item:hover {
  background: var(--surface-hover);
}

.playlist-item.active {
  background: var(--surface-hover);
  border-color: var(--accent);
}

.playlist-code {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  overflow: hidden;
  color: var(--accent);
  font-weight: 800;
  background: var(--surface-hover);
  border: 1px solid var(--border);
  border-radius: 10px;
}

.playlist-code img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.playlist-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.playlist-text strong {
  color: var(--text);
  font-size: .93rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.playlist-text small {
  color: var(--muted);
  font-size: .76rem;
}

.favorite-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 40px;
  font-size: 1.25rem;
  border-radius: 8px;
  cursor: pointer;
}

.favorite-btn:hover {
  background: var(--surface-hover);
}

.favorite-btn:focus-visible,
.playlist-item:focus-visible,
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.play-icon {
  color: var(--accent);
  font-size: .95rem;
  text-align: center;
}

/* Search and category controls */
#search-input,
#category-filter,
#language-select,
input,
select {
  max-width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
}

#search-input {
  width: 100%;
}

#search-input::placeholder {
  color: var(--muted);
}

#category-filter,
#language-select {
  width: 100%;
}

button:not(.playlist-item) {
  transition: background-color .15s ease, color .15s ease;
}

#favorites-toggle,
#retry-btn,
#toggle-dark,
#toggle-lowdata,
#toggle-autoplay,
#home-btn,
#settings-btn,
#back-btn,
#vlc-btn {
  min-height: 42px;
  padding: 9px 14px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
}

#favorites-toggle:hover,
#retry-btn:hover,
#toggle-dark:hover,
#toggle-lowdata:hover,
#toggle-autoplay:hover,
#home-btn:hover,
#settings-btn:hover,
#back-btn:hover,
#vlc-btn:hover {
  background: var(--surface-hover);
}

/* Settings and other panels */
#settings-view > *,
.settings-panel,
.player-panel,
.channel-panel {
  color: var(--text);
}

header,
nav,
section,
aside,
footer {
  border-color: var(--border);
}

hr {
  border: 0;
  border-top: 1px solid var(--border);
}

/* Tablet and mobile */
@media (max-width: 850px) {
  .tv-layout,
  .player-layout,
  .main-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    padding: 12px;
  }

  #channels-playlist {
    max-height: none;
    overflow: visible;
  }
}

@media (max-width: 480px) {
  .tv-layout,
  .player-layout,
  .main-layout {
    padding: 8px;
    gap: 10px;
  }

  .playlist-item {
    grid-template-columns: 40px minmax(0, 1fr) 32px 20px;
    gap: 7px;
    min-height: 60px;
    padding: 7px;
  }

  .playlist-code {
    width: 38px;
    height: 38px;
  }

  .playlist-text strong {
    font-size: .86rem;
  }

  .playlist-text small {
    font-size: .7rem;
  }

  .favorite-btn {
    width: 32px;
    height: 36px;
  }
}
