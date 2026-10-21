"use strict";
/* =========================================================
   JEM TV — Complete app.js
   Channel list, search, favorites, themes, settings, HLS
   ========================================================= */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const STORAGE = {
  favorites: "jemtv-favorites",
  theme: "jemtv-theme",
  lowData: "jemtv-low-data",
  autoplay: "jemtv-autoplay",
  language: "jemtv-language"
};
const FALLBACK_CHANNELS = [
  {
    name: "Al Jazeera English",
    category: "News",
    url: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8",
    logo: "",
    country: "International"
  },
  {
    name: "Al Jazeera Arabic",
    category: "News",
    url: "https://live-hls-web-ajm.getaj.net/AJM/index.m3u8",
    logo: "",
    country: "International"
  },
  {
    name: "France 24 English",
    category: "News",
    url: "https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8",
    logo: "",
    country: "International"
  },
  {
    name: "NASA TV",
    category: "Documentary",
    url: "https://ntv1.akamaized.net/hls/live/2016990/ntv1/master.m3u8",
    logo: "",
    country: "International"
  }
];
const PLAYLIST_SOURCES = [
  {
    name: "IPTV Org — Ethiopia",
    url: "https://iptv-org.github.io/iptv/countries/et.m3u"
  },
  {
    name: "IPTV Org — News",
    url: "https://iptv-org.github.io/iptv/categories/news.m3u"
  },
  {
    name: "IPTV Org — Sports",
    url: "https://iptv-org.github.io/iptv/categories/sports.m3u"
  },
  {
    name: "IPTV Org — General",
    url: "https://iptv-org.github.io/iptv/categories/general.m3u"
  }
];
const translations = {
  en: {
    all: "All channels",
    favorites: "Favorites",
    search: "Search channels...",
    loading: "Loading channels...",
    ready: "Choose a channel to start watching.",
    failed: "Unable to play this channel.",
    noChannels: "No channels found.",
    retry: "Retry",
    home: "Home",
    settings: "Settings",
    light: "Light mode",
    dark: "Dark mode",
    lowData: "Low data mode",
    autoplay: "Autoplay",
    channels: "Channels",
    nowPlaying: "Now playing",
    favoritesOnly: "Show favorites only",
    loadingSource: "Loading channel lists...",
    sourceError: "Some channel lists could not be loaded.",
    openVLC: "Open in VLC"
  },
  am: {
    all: "ሁሉም ቻናሎች",
    favorites: "ተወዳጆች",
    search: "ቻናል ፈልግ...",
    loading: "ቻናሎች በመጫን ላይ...",
    ready: "ለማየት ቻናል ይምረጡ።",
    failed: "ይህን ቻናል ማጫወት አልተቻለም።",
    noChannels: "ምንም ቻናል አልተገኘም።",
    retry: "እንደገና ሞክር",
    home: "መነሻ",
    settings: "ቅንብሮች",
    light: "Light mode",
    dark: "Dark mode",
    lowData: "ዝቅተኛ ዳታ ሁነታ",
    autoplay: "በራስ-ሰር አጫውት",
    channels: "ቻናሎች",
    nowPlaying: "አሁን እየተጫወተ ያለው",
    favoritesOnly: "ተወዳጆችን ብቻ አሳይ",
    loadingSource: "የቻናል ዝርዝሮች በመጫን ላይ...",
    sourceError: "አንዳንድ የቻናል ዝርዝሮች መጫን አልቻሉም።",
    openVLC: "በ VLC ክፈት"
  }
};
let channels = [];
let activeChannel = null;
let hlsInstance = null;
let favorites = loadJSON(STORAGE.favorites, []);
let favoritesOnly = false;
let currentLanguage = localStorage.getItem(STORAGE.language) || "am";
let isLoading = false;
function loadJSON(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Unable to save settings:", error);
  }
}
function t(key) {
  return (translations[currentLanguage] || translations.am)[key]
    || translations.am[key]
    || key;
}
function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}
function channelId(channel) {
  return `${channel.name}|${channel.url}`;
}
/* ---------------------- Theme and layout ---------------------- */
function injectAppStyles() {
  if ($("#jemtv-app-styles")) return;
  const style = document.createElement("style");
  style.id = "jemtv-app-styles";
  style.textContent = `
    :root {
      color-scheme: dark;
      --jem-bg: #0b1120;
      --jem-panel: #131d30;
      --jem-panel-2: #1b2940;
      --jem-text: #f4f7fb;
      --jem-muted: #a9b7ca;
      --jem-border: #293951;
      --jem-accent: #18b879;
      --jem-accent-text: #04150d;
      --jem-shadow: 0 8px 28px rgba(0,0,0,.22);
    }
    html[data-theme="light"] {
      color-scheme: light;
      --jem-bg: #f3f6fa;
      --jem-panel: #ffffff;
      --jem-panel-2: #e9eff6;
      --jem-text: #182235;
      --jem-muted: #617086;
      --jem-border: #d8e1ec;
      --jem-accent: #078c5b;
      --jem-accent-text: #ffffff;
      --jem-shadow: 0 8px 24px rgba(30,50,80,.08);
    }
    body {
      background: var(--jem-bg) !important;
      color: var(--jem-text) !important;
      transition: background .2s ease, color .2s ease;
    }
    body, button, input, select, textarea {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Arial, sans-serif;
    }
    button, input, select {
      max-width: 100%;
    }
    button {
      cursor: pointer;
    }
    #tv-view, #settings-view {
      color: var(--jem-text);
    }
    #tv-view {
      width: 100%;
      max-width: 1500px;
      margin-inline: auto;
      padding: 12px;
      box-sizing: border-box;
    }
    .jemtv-main-layout {
      display: grid !important;
      grid-template-columns: minmax(0, 1.7fr) minmax(270px, 1fr);
      align-items: start;
      gap: 16px;
      width: 100%;
    }
    .jemtv-player-column, .jemtv-channels-column {
      min-width: 0;
      width: 100%;
    }
    #tv-player {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      max-height: 70vh;
      background: #000;
      object-fit: contain;
      border-radius: 14px;
    }
    #channels-playlist {
      min-width: 0;
      width: 100%;
      box-sizing: border-box;
    }
    #channels-playlist .channel-card,
    #channels-playlist .channel-item,
    #channels-playlist [data-channel-id] {
      min-width: 0;
      box-sizing: border-box;
    }
    .jemtv-channel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
      gap: 10px;
    }
    .jemtv-channel-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 0;
      min-height: 105px;
      padding: 12px 8px;
      gap: 8px;
      border: 1px solid var(--jem-border);
      border-radius: 12px;
      background: var(--jem-panel);
      color: var(--jem-text);
      text-align: center;
      overflow-wrap: anywhere;
      transition: border-color .18s ease, transform .18s ease;
    }
    .jemtv-channel-card:hover {
      border-color: var(--jem-accent);
      transform: translateY(-2px);
    }
    .jemtv-channel-card.is-active {
      border: 2px solid var(--jem-accent);
      background: var(--jem-panel-2);
    }
    .jemtv-channel-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      object-fit: contain;
      background: var(--jem-panel-2);
      color: var(--jem-text);
      font-weight: 800;
    }
    .jemtv-channel-name {
      max-width: 100%;
      font-size: 13px;
      line-height: 1.35;
      font-weight: 650;
      overflow-wrap: anywhere;
    }
    .jemtv-channel-category {
      font-size: 11px;
      color: var(--jem-muted);
    }
    .jemtv-toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-block: 12px;
    }
    .jemtv-toolbar input,
    .jemtv-toolbar select,
    #search-input,
    #category-filter {
      min-width: 0;
      padding: 10px 12px;
      border: 1px solid var(--jem-border);
      border-radius: 10px;
      background: var(--jem-panel);
      color: var(--jem-text);
    }
    .jemtv-toolbar input {
      flex: 1 1 170px;
    }
    .jemtv-button,
    #favorites-toggle,
    #retry-btn,
    #toggle-dark,
    #toggle-lowdata,
    #toggle-autoplay,
    #home-btn,
    #settings-btn,
    #back-btn,
    #vlc-btn {
      border: 1px solid var(--jem-border);
      border-radius: 10px;
      padding: 9px 12px;
      background: var(--jem-panel);
      color: var(--jem-text);
    }
    .jemtv-button:hover,
    #favorites-toggle:hover,
    #retry-btn:hover,
    #toggle-dark:hover,
    #toggle-lowdata:hover,
    #toggle-autoplay:hover,
    #home-btn:hover,
    #settings-btn:hover,
    #back-btn:hover,
    #vlc-btn:hover {
      border-color: var(--jem-accent);
    }
    #player-message, #player-status {
      color: var(--jem-muted);
      overflow-wrap: anywhere;
    }
    #settings-view {
      max-width: 900px;
      margin-inline: auto;
      padding: 16px;
    }
    #settings-view label {
      color: var(--jem-text);
    }
    html[data-low-data="true"] #tv-player {
      max-height: 50vh;
    }
    @media (max-width: 760px) {
      #tv-view {
        padding: 8px;
      }
      .jemtv-main-layout {
        grid-template-columns: minmax(0, 1fr) !important;
        gap: 12px;
      }
      .jemtv-player-column,
      .jemtv-channels-column {
        width: 100%;
      }
      #tv-player {
        max-height: none;
        border-radius: 10px;
      }
      .jemtv-channel-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 7px;
      }
      .jemtv-channel-card {
        min-height: 95px;
        padding: 8px 4px;
      }
      .jemtv-channel-logo {
        width: 38px;
        height: 38px;
      }
      .jemtv-channel-name {
        font-size: 11px;
      }
      .jemtv-toolbar > * {
        max-width: 100%;
      }
    }
    @media (max-width: 380px) {
      .jemtv-channel-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `;
  document.head.appendChild(style);
}
function applyTheme(theme) {
  const chosen = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = chosen;
  document.documentElement.style.colorScheme = chosen;
  localStorage.setItem(STORAGE.theme, chosen);
  const toggle = $("#toggle-dark");
  if (toggle) {
    toggle.textContent = chosen === "dark" ? t("light") : t("dark");
    toggle.setAttribute("aria-pressed", String(chosen === "dark"));
  }
}
function toggleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
}
function applyLowData(enabled) {
  document.documentElement.dataset.lowData = String(Boolean(enabled));
  localStorage.setItem(STORAGE.lowData, String(Boolean(enabled)));
  const button = $("#toggle-lowdata");
  if (button) {
    button.setAttribute("aria-pressed", String(Boolean(enabled)));
  }
}
function applyAutoplay(enabled) {
  localStorage.setItem(STORAGE.autoplay, String(Boolean(enabled)));
  const button = $("#toggle-autoplay");
  if (button) {
    button.setAttribute("aria-pressed", String(Boolean(enabled)));
  }
}
function setupLayout() {
  const player = $("#tv-player");
  const playlist = $("#channels-playlist");
  if (!player || !playlist) return;
  const playerArea = player.closest(
    ".player-area, .video-container, .player-container, #player-area"
  ) || player.parentElement;
  const channelArea = playlist.closest(
    ".channels-area, .playlist-container, .channel-list, #channels-area"
  ) || playlist.parentElement;
  if (!playerArea || !channelArea || playerArea === channelArea) return;
  let layout = $(".jemtv-main-layout");
  if (!layout) {
    layout = document.createElement("div");
    layout.className = "jemtv-main-layout";
    const parent = playerArea.parentElement;
    if (parent && channelArea.parentElement === parent) {
      parent.insertBefore(layout, playerArea);
      const playerColumn = document.createElement("section");
      playerColumn.className = "jemtv-player-column";
      const channelColumn = document.createElement("section");
      channelColumn.className = "jemtv-channels-column";
      layout.append(playerColumn, channelColumn);
      playerColumn.appendChild(playerArea);
      channelColumn.appendChild(channelArea);
    }
  }
  if (layout) {
    const playerColumn = $(".jemtv-player-column", layout);
    const channelColumn = $(".jemtv-channels-column", layout);
    if (playerColumn && channelColumn) {
      playerColumn.style.minWidth = "0";
      channelColumn.style.minWidth = "0";
    }
  }
}
/* ---------------------- Playlist parsing ---------------------- */
function parseM3U(text) {
  const lines = String(text || "").replace(/^\uFEFF/, "").split(/\r?\n/);
  const result = [];
  let metadata = null;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("#EXTINF")) {
      const name = line.includes(",")
        ? line.slice(line.lastIndexOf(",") + 1).trim()
        : "Unknown channel";
      const attr = key => {
        const match = line.match(
          new RegExp(`${key}=["']([^"']*)["']`, "i")
        );
        return match ? match[1] : "";
      };
      metadata = {
        name: name || "Unknown channel",
        category: attr("group-title") || "General",
        logo: attr("tvg-logo"),
        country: attr("tvg-country"),
        language: attr("tvg-language"),
        id: attr("tvg-id")
      };
      continue;
    }
    if (line.startsWith("#")) continue;
    if (/^https?:\/\//i.test(line)) {
      const item = metadata || {};
      result.push({
        name: item.name || line,
        category: item.category || "General",
        logo: item.logo || "",
        country: item.country || "",
        language: item.language || "",
        id: item.id || "",
        url: line
      });
      metadata = null;
    }
  }
  return result;
}
function normalizeChannel(channel) {
  if (!channel || !channel.url || !/^https?:\/\//i.test(channel.url)) {
    return null;
  }
  return {
    name: String(channel.name || "Unknown channel").trim(),
    category: String(channel.category || "General").trim(),
    logo: String(channel.logo || "").trim(),
    country: String(channel.country || "").trim(),
    language: String(channel.language || "").trim(),
    url: String(channel.url).trim()
  };
}
function dedupeChannels(items) {
  const seen = new Set();
  const result = [];
  for (const raw of items) {
    const channel = normalizeChannel(raw);
    if (!channel) continue;
    const key = channel.url;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(channel);
  }
  return result;
}
async function fetchPlaylist(source) {
  const response = await fetch(source.url, {
    method: "GET",
    cache: "no-cache"
  });
  if (!response.ok) {
    throw new Error(`${source.name}: HTTP ${response.status}`);
  }
  const body = await response.text();
  return parseM3U(body);
}
async function loadChannels() {
  if (isLoading) return;
  isLoading = true;
  setPlayerMessage(t("loadingSource"));
  updateCount();
  const results = await Promise.allSettled(
    PLAYLIST_SOURCES.map(fetchPlaylist)
  );
  const loaded = [];
  let successCount = 0;
  for (const result of results) {
    if (result.status === "fulfilled") {
      loaded.push(...result.value);
      successCount++;
    } else {
      console.warn("Playlist loading failed:", result.reason);
    }
  }
  channels = dedupeChannels([...loaded, ...FALLBACK_CHANNELS]);
  if (channels.length === 0) {
    setPlayerMessage(t("noChannels"));
  } else if (successCount === 0) {
    setPlayerMessage(t("sourceError"));
  } else {
    setPlayerMessage(t("ready"));
  }
  populateCategories();
  renderChannels();
  updateCount();
  isLoading = false;
}
/* ---------------------- Channel rendering ---------------------- */
function getVisibleChannels() {
  const query = ($("#search-input")?.value || "").trim().toLowerCase();
  const category = $("#category-filter")?.value || "all";
  return channels.filter(channel => {
    const matchesSearch =
      !query ||
      channel.name.toLowerCase().includes(query) ||
      channel.category.toLowerCase().includes(query) ||
      channel.country.toLowerCase().includes(query);
    const matchesCategory =
      category === "all" ||
      channel.category.toLowerCase() === category.toLowerCase();
    const matchesFavorite =
      !favoritesOnly || favorites.includes(channelId(channel));
    return matchesSearch && matchesCategory && matchesFavorite;
  });
}
function populateCategories() {
  const select = $("#category-filter");
  if (!select) return;
  const oldValue = select.value || "all";
  const categories = [...new Set(
    channels.map(channel => channel.category).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b));
  select.replaceChildren();
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = t("all");
  select.appendChild(allOption);
  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  }
  if ([...select.options].some(option => option.value === oldValue)) {
    select.value = oldValue;
  } else {
    select.value = "all";
  }
}
function renderChannels() {
  const playlist = $("#channels-playlist");
  if (!playlist) return;
  const visible = getVisibleChannels();
  playlist.replaceChildren();
  playlist.classList.add("jemtv-channel-grid");
  if (!visible.length) {
    const empty = document.createElement("p");
    empty.textContent = t("noChannels");
    empty.className = "jemtv-empty";
    playlist.appendChild(empty);
    updateCount(0);
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const channel of visible) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "jemtv-channel-card";
    card.setAttribute("aria-label", `Play ${channel.name}`);
    if (activeChannel && channelId(activeChannel) === channelId(channel)) {
      card.classList.add("is-active");
    }
    const logo = document.createElement("span");
    logo.className = "jemtv-channel-logo";
    if (channel.logo && /^https?:\/\//i.test(channel.logo)) {
      const image = document.createElement("img");
      image.src = channel.logo;
      image.alt = "";
      image.loading = "lazy";
      image.className = "jemtv-channel-logo";
      image.onerror = () => {
        image.replaceWith(makeInitial(channel.name));
      };
      logo.replaceWith(image);
      card.appendChild(image);
    } else {
      logo.textContent = getInitials(channel.name);
      card.appendChild(logo);
    }
    const name = document.createElement("span");
    name.className = "jemtv-channel-name";
    name.textContent = channel.name;
    const category = document.createElement("span");
    category.className = "jemtv-channel-category";
    category.textContent = channel.category;
    const favorite = document.createElement("span");
    favorite.className = "jemtv-channel-category";
    favorite.textContent = favorites.includes(channelId(channel)) ? "★" : "";
    card.append(name, category, favorite);
    card.addEventListener("click", () => playChannel(channel));
    fragment.appendChild(card);
  }
  playlist.appendChild(fragment);
  updateCount(visible.length);
}
function getInitials(name) {
  return String(name || "TV")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join("")
    .toUpperCase();
}
function makeInitial(name) {
  const span = document.createElement("span");
  span.className = "jemtv-channel-logo";
  span.textContent = getInitials(name);
  return span;
}
function updateCount(count) {
  const target = $("#channel-count");
  if (target) {
    target.textContent = String(count ?? getVisibleChannels().length);
  }
}
/* ---------------------- Player ---------------------- */
function setPlayerMessage(message) {
  const target = $("#player-message");
  if (target) target.textContent = message || "";
  const status = $("#player-status");
  if (status) status.textContent = message || "";
}
function destroyHls() {
  if (hlsInstance) {
    try {
      hlsInstance.destroy();
    } catch (error) {
      console.warn("HLS cleanup failed:", error);
    }
    hlsInstance = null;
  }
}
function setPlayerInfo(channel) {
  const title = $("#playing-title");
  const category = $("#playing-category");
  const code = $("#playing-code");
  if (title) title.textContent = channel?.name || "JEM TV";
  if (category) category.textContent = channel?.category || "";
  if (code) code.textContent = channel?.id || channel?.country || "";
}
function playChannel(channel) {
  if (!channel || !channel.url) return;
  const video = $("#tv-player");
  if (!video) {
    console.error("Missing #tv-player element in index.html");
    return;
  }
  activeChannel = channel;
  setPlayerInfo(channel);
  renderChannels();
  setPlayerMessage(`Connecting to ${channel.name}...`);
  destroyHls();
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.onplaying = () => setPlayerMessage(`Playing: ${channel.name}`);
  video.onerror = () => {
    setPlayerMessage(`${t("failed")} (${channel.name})`);
  };
  const autoplay = localStorage.getItem(STORAGE.autoplay) !== "false";
  video.autoplay = autoplay;
  video.playsInline = true;
  video.controls = true;
  const isHls = /\.m3u8($|\?)/i.test(channel.url);
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = channel.url;
    video.load();
    if (autoplay) {
      video.play().catch(() => {
        setPlayerMessage("Press Play to start this channel.");
      });
    }
    return;
  }
  if (isHls && window.Hls && window.Hls.isSupported()) {
    hlsInstance = new window.Hls({
      enableWorker: true,
      lowLatencyMode: !(
        localStorage.getItem(STORAGE.lowData) === "true"
      ),
      capLevelToPlayerSize: true
    });
    hlsInstance.loadSource(channel.url);
    hlsInstance.attachMedia(video);
    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
      if (autoplay) {
        video.play().catch(() => {
          setPlayerMessage("Press Play to start this channel.");
        });
      }
    });
    hlsInstance.on(window.Hls.Events.ERROR, (_event, data) => {
      if (data?.fatal) {
        setPlayerMessage(t("failed"));
        destroyHls();
      }
    });
    return;
  }
  video.src = channel.url;
  video.load();
  if (autoplay) {
    video.play().catch(() => {
      setPlayerMessage("This stream may not be supported by this browser.");
    });
  }
}
function retryChannel() {
  if (activeChannel) playChannel(activeChannel);
}
function openInVLC() {
  if (!activeChannel?.url) {
    setPlayerMessage("Choose a channel first.");
    return;
  }
  const vlcURL = `vlc://${activeChannel.url}`;
  window.location.href = vlcURL;
}
/* ---------------------- Favorites ---------------------- */
function toggleFavoriteMode() {
  favoritesOnly = !favoritesOnly;
  const button = $("#favorites-toggle");
  if (button) {
    button.setAttribute("aria-pressed", String(favoritesOnly));
    button.textContent = favoritesOnly ? "★ " + t("favorites") : "☆ " + t("favorites");
  }
  renderChannels();
}
function toggleChannelFavorite(channel) {
  const id = channelId(channel);
  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }
  saveJSON(STORAGE.favorites, favorites);
  renderChannels();
}
/* ---------------------- Navigation and settings ---------------------- */
function showView(viewName) {
  const tvView = $("#tv-view");
  const settingsView = $("#settings-view");
  if (tvView) tvView.hidden = viewName !== "tv";
  if (settingsView) settingsView.hidden = viewName !== "settings";
}
function updateLanguage(language) {
  currentLanguage = language === "en" ? "en" : "am";
  localStorage.setItem(STORAGE.language, currentLanguage);
  const search = $("#search-input");
  if (search) search.placeholder = t("search");
  const darkButton = $("#toggle-dark");
  if (darkButton) {
    const theme = document.documentElement.dataset.theme || "dark";
    darkButton.textContent = theme === "dark" ? t("light") : t("dark");
  }
  const homeButton = $("#home-btn");
  if (homeButton) homeButton.textContent = t("home");
  const settingsButton = $("#settings-btn");
  if (settingsButton) settingsButton.textContent = t("settings");
  const retryButton = $("#retry-btn");
  if (retryButton) retryButton.textContent = t("retry");
  populateCategories();
  renderChannels();
}
function bindEvents() {
  $("#search-input")?.addEventListener("input", renderChannels);
  $("#category-filter")?.addEventListener("change", renderChannels);
  $("#favorites-toggle")?.addEventListener("click", toggleFavoriteMode);
  $("#retry-btn")?.addEventListener("click", retryChannel);
  $("#toggle-dark")?.addEventListener("click", toggleTheme);
  $("#toggle-lowdata")?.addEventListener("click", () => {
    const enabled = document.documentElement.dataset.lowData !== "true";
    applyLowData(enabled);
  });
  $("#toggle-autoplay")?.addEventListener("click", () => {
    const enabled = localStorage.getItem(STORAGE.autoplay) === "false";
    applyAutoplay(enabled);
  });
  $("#home-btn")?.addEventListener("click", () => showView("tv"));
  $("#settings-btn")?.addEventListener("click", () => showView("settings"));
  $("#back-btn")?.addEventListener("click", () => showView("tv"));
  $("#vlc-btn")?.addEventListener("click", openInVLC);
  $("#language-select")?.addEventListener("change", event => {
    updateLanguage(event.target.value);
  });
  // Supports existing HTML buttons that use data-favorite-url.
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite-url]");
    if (!button) return;
    const url = button.getAttribute("data-favorite-url");
    const channel = channels.find(item => item.url === url);
    if (channel) toggleChannelFavorite(channel);
  });
}
/* ---------------------- Initialization ---------------------- */
function initializeApp() {
  injectAppStyles();
  const savedTheme = localStorage.getItem(STORAGE.theme) || "dark";
  applyTheme(savedTheme);
  applyLowData(localStorage.getItem(STORAGE.lowData) === "true");
  applyAutoplay(localStorage.getItem(STORAGE.autoplay) !== "false");
  const languageSelect = $("#language-select");
  if (languageSelect) languageSelect.value = currentLanguage;
  const search = $("#search-input");
  if (search) search.placeholder = t("search");
  const favoritesButton = $("#favorites-toggle");
  if (favoritesButton) {
    favoritesButton.textContent = "☆ " + t("favorites");
    favoritesButton.setAttribute("aria-pressed", "false");
  }
  bindEvents();
  setupLayout();
  updateLanguage(currentLanguage);
  loadChannels();
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}
