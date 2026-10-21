"use strict";

/* =====================================================
   JEM TV — Complete app.js
   Fixed Al Jazeera streams, responsive layout, themes,
   channel search, favorites, settings and HLS playback.
   ===================================================== */

const $ = (s, root = document) => root.querySelector(s);

const STORAGE = {
  favorites: "jemtv-favorites",
  theme: "jemtv-theme",
  lowData: "jemtv-low-data",
  autoplay: "jemtv-autoplay",
  language: "jemtv-language"
};

/* ---------- Working stream URLs ---------- */

const AL_JAZEERA_ENGLISH =
  "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8";

const AL_JAZEERA_ARABIC =
  "https://live-hls-web-aja.getaj.net/AJA/index.m3u8";

const FALLBACK_CHANNELS = [
  {
    name: "Al Jazeera English",
    category: "News",
    url: AL_JAZEERA_ENGLISH,
    logo: "",
    country: "International"
  },
  {
    name: "Al Jazeera Arabic",
    category: "News",
    url: AL_JAZEERA_ARABIC,
    logo: "",
    country: "International"
  },
  {
    name: "France 24 English",
    category: "News",
    url: "https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8",
    logo: "",
    country: "International"
  }
];

const PLAYLIST_SOURCES = [
  {
    name: "Ethiopia",
    url: "https://iptv-org.github.io/iptv/countries/et.m3u"
  },
  {
    name: "News",
    url: "https://iptv-org.github.io/iptv/categories/news.m3u"
  },
  {
    name: "Sports",
    url: "https://iptv-org.github.io/iptv/categories/sports.m3u"
  },
  {
    name: "General",
    url: "https://iptv-org.github.io/iptv/categories/general.m3u"
  }
];

const TEXT = {
  en: {
    all: "All channels",
    favorites: "Favorites",
    search: "Search channels...",
    loading: "Loading channels...",
    ready: "Choose a channel to watch.",
    failed: "Unable to play this channel.",
    empty: "No channels found.",
    retry: "Retry",
    home: "Home",
    settings: "Settings",
    light: "Light mode",
    dark: "Dark mode",
    sourceError: "Online playlists could not load. Showing available channels."
  },
  am: {
    all: "ሁሉም ቻናሎች",
    favorites: "ተወዳጆች",
    search: "ቻናል ፈልግ...",
    loading: "ቻናሎች በመጫን ላይ...",
    ready: "ለማየት ቻናል ይምረጡ።",
    failed: "ይህን ቻናል ማጫወት አልተቻለም።",
    empty: "ምንም ቻናል አልተገኘም።",
    retry: "እንደገና ሞክር",
    home: "መነሻ",
    settings: "ቅንብሮች",
    light: "Light mode",
    dark: "Dark mode",
    sourceError: "የኢንተርኔት ዝርዝሮች አልተጫኑም።"
  }
};

let channels = [];
let activeChannel = null;
let hlsInstance = null;
let favorites = readJSON(STORAGE.favorites, []);
let favoritesOnly = false;
let loading = false;
let language = localStorage.getItem(STORAGE.language) || "am";

/* ---------- Storage and helpers ---------- */

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function t(key) {
  return (TEXT[language] || TEXT.am)[key] || TEXT.am[key] || key;
}

function saveFavorites() {
  try {
    localStorage.setItem(STORAGE.favorites, JSON.stringify(favorites));
  } catch (error) {
    console.warn("Could not save favorites", error);
  }
}

function channelKey(channel) {
  return `${channel.name}|${channel.url}`;
}

function initials(name) {
  return String(name || "TV")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0] || "")
    .join("")
    .toUpperCase();
}

function setMessage(message) {
  const a = $("#player-message");
  const b = $("#player-status");
  if (a) a.textContent = message || "";
  if (b) b.textContent = message || "";
}

/* ---------- Responsive layout and themes ---------- */

function addStyles() {
  if ($("#jemtv-styles")) return;

  const style = document.createElement("style");
  style.id = "jemtv-styles";
  style.textContent = `
    :root {
      color-scheme: dark;
      --jem-bg: #0b1120;
      --jem-panel: #131d30;
      --jem-panel2: #1b2940;
      --jem-text: #f4f7fb;
      --jem-muted: #a9b7ca;
      --jem-border: #293951;
      --jem-accent: #18b879;
    }

    html[data-theme="light"] {
      color-scheme: light;
      --jem-bg: #f3f6fa;
      --jem-panel: #fff;
      --jem-panel2: #e9eff6;
      --jem-text: #182235;
      --jem-muted: #617086;
      --jem-border: #d8e1ec;
      --jem-accent: #078c5b;
    }

    body {
      background: var(--jem-bg) !important;
      color: var(--jem-text) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
        Arial, sans-serif;
    }

    #tv-view, #settings-view {
      color: var(--jem-text);
      box-sizing: border-box;
      width: 100%;
    }

    #tv-view {
      max-width: 1500px;
      margin: auto;
      padding: 12px;
    }

    #tv-player {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      max-height: 70vh;
      background: #000;
      object-fit: contain;
      border-radius: 12px;
    }

    #channels-playlist {
      display: grid !important;
      grid-template-columns: repeat(auto-fill, minmax(115px, 1fr));
      gap: 10px;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }

    .jemtv-card {
      min-width: 0;
      min-height: 110px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 6px;
      border: 1px solid var(--jem-border);
      border-radius: 12px;
      background: var(--jem-panel);
      color: var(--jem-text);
      cursor: pointer;
      text-align: center;
      overflow-wrap: anywhere;
    }

    .jemtv-card:hover,
    .jemtv-card.active {
      border-color: var(--jem-accent);
      background: var(--jem-panel2);
    }

    .jemtv-logo {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      object-fit: contain;
      background: var(--jem-panel2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }

    .jemtv-name {
      font-size: 12px;
      font-weight: 650;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }

    .jemtv-category {
      font-size: 11px;
      color: var(--jem-muted);
    }

    #search-input, #category-filter,
    #settings-view input, #settings-view select {
      max-width: 100%;
      box-sizing: border-box;
      background: var(--jem-panel);
      color: var(--jem-text);
      border: 1px solid var(--jem-border);
      border-radius: 9px;
      padding: 10px;
    }

    button {
      cursor: pointer;
    }

    #tv-view button, #settings-view button {
      max-width: 100%;
    }

    #player-message, #player-status {
      color: var(--jem-muted);
      overflow-wrap: anywhere;
    }

    #settings-view {
      max-width: 900px;
      margin: auto;
      padding: 16px;
    }

    html[data-low-data="true"] #tv-player {
      max-height: 48vh;
    }

    @media (max-width: 760px) {
      #tv-view { padding: 8px; }

      #channels-playlist {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 7px;
      }

      #tv-player {
        max-height: none;
        border-radius: 9px;
      }

      .jemtv-card {
        min-height: 90px;
        padding: 7px 3px;
      }

      .jemtv-logo {
        width: 36px;
        height: 36px;
      }

      .jemtv-name { font-size: 11px; }
    }

    @media (max-width: 360px) {
      #channels-playlist {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `;
  document.head.appendChild(style);
}

function setTheme(theme) {
  const selected = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = selected;
  localStorage.setItem(STORAGE.theme, selected);

  const button = $("#toggle-dark");
  if (button) {
    button.textContent = selected === "dark" ? t("light") : t("dark");
  }
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  setTheme(current === "dark" ? "light" : "dark");
}

function setupSettings() {
  const lowData = localStorage.getItem(STORAGE.lowData) === "true";
  const autoplay = localStorage.getItem(STORAGE.autoplay) !== "false";

  document.documentElement.dataset.lowData = String(lowData);

  $("#toggle-lowdata")?.setAttribute("aria-pressed", String(lowData));
  $("#toggle-autoplay")?.setAttribute("aria-pressed", String(autoplay));
}

/* ---------- Playlist parser ---------- */

function parseM3U(content) {
  const lines = String(content || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/);

  const list = [];
  let current = {};

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF")) {
      const comma = line.lastIndexOf(",");
      const name = comma >= 0 ? line.slice(comma + 1).trim() : "";

      const attr = key => {
        const match = line.match(
          new RegExp(`${key}=["']([^"']*)["']`, "i")
        );
        return match ? match[1] : "";
      };

      current = {
        name: name || "Unknown channel",
        category: attr("group-title") || "General",
        logo: attr("tvg-logo") || "",
        country: attr("tvg-country") || "",
        id: attr("tvg-id") || ""
      };
    } else if (!line.startsWith("#") && /^https?:\/\//i.test(line)) {
      list.push({
        ...current,
        url: line,
        name: current.name || line,
        category: current.category || "General"
      });
      current = {};
    }
  }

  return list;
}

/* Normalize known Al Jazeera channel names and URLs.
   This also replaces outdated URLs from remote playlists. */

function normalizeChannel(raw) {
  if (!raw || !raw.url || !/^https?:\/\//i.test(raw.url)) {
    return null;
  }

  let name = String(raw.name || "Unknown channel").trim();
  let url = String(raw.url).trim();
  const lower = name.toLowerCase();

  if (
    lower.includes("al jazeera english") ||
    lower.includes("aljazeeraenglish")
  ) {
    name = "Al Jazeera English";
    url = AL_JAZEERA_ENGLISH;
  } else if (
    lower.includes("al jazeera arabic") ||
    lower.includes("aljazeera arabic") ||
    lower.includes("aljazeerachannel.qa")
  ) {
    name = "Al Jazeera Arabic";
    url = AL_JAZEERA_ARABIC;
  }

  return {
    name,
    url,
    category: raw.category || "General",
    logo: raw.logo || "",
    country: raw.country || "",
    id: raw.id || ""
  };
}

function combineChannels(items) {
  const result = [];
  const byUrl = new Map();
  const byName = new Map();

  for (const raw of items) {
    const channel = normalizeChannel(raw);
    if (!channel) continue;

    const nameKey = channel.name.toLowerCase();
    const urlKey = channel.url;

    // Do not show duplicate entries for the same stream or channel.
    if (byName.has(nameKey)) {
      const existing = byName.get(nameKey);
      if (!existing.logo && channel.logo) existing.logo = channel.logo;
      continue;
    }

    if (byUrl.has(urlKey)) continue;

    byName.set(nameKey, channel);
    byUrl.set(urlKey, channel);
    result.push(channel);
  }

  return result;
}

async function fetchSource(source) {
  const response = await fetch(source.url, { cache: "no-cache" });
  if (!response.ok) throw new Error(`${source.name}: ${response.status}`);
  return parseM3U(await response.text());
}

async function loadChannels() {
  if (loading) return;
  loading = true;
  setMessage(t("loading"));

  const results = await Promise.allSettled(
    PLAYLIST_SOURCES.map(fetchSource)
  );

  const combined = [];
  let loadedAtLeastOne = false;

  for (const result of results) {
    if (result.status === "fulfilled") {
      combined.push(...result.value);
      loadedAtLeastOne = true;
    } else {
      console.warn("Could not load playlist:", result.reason);
    }
  }

  // Put fixed fallback channels first so their current stream URLs win.
  channels = combineChannels([...FALLBACK_CHANNELS, ...combined]);

  buildCategories();
  renderChannels();
  setMessage(loadedAtLeastOne ? t("ready") : t("sourceError"));

  loading = false;
}

/* ---------- Search, categories and channel list ---------- */

function visibleChannels() {
  const query = ($("#search-input")?.value || "").trim().toLowerCase();
  const category = $("#category-filter")?.value || "all";

  return channels.filter(channel => {
    const searchMatch =
      !query ||
      channel.name.toLowerCase().includes(query) ||
      channel.category.toLowerCase().includes(query) ||
      channel.country.toLowerCase().includes(query);

    const categoryMatch =
      category === "all" ||
      channel.category.toLowerCase() === category.toLowerCase();

    const favoriteMatch =
      !favoritesOnly || favorites.includes(channelKey(channel));

    return searchMatch && categoryMatch && favoriteMatch;
  });
}

function buildCategories() {
  const select = $("#category-filter");
  if (!select) return;

  const previous = select.value || "all";
  select.replaceChildren();

  const all = document.createElement("option");
  all.value = "all";
  all.textContent = t("all");
  select.appendChild(all);

  const categories = [...new Set(
    channels.map(channel => channel.category).filter(Boolean)
  )].sort();

  for (const category of categories) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  }

  select.value = categories.includes(previous) ? previous : "all";
}

function renderChannels() {
  const list = $("#channels-playlist");
  if (!list) return;

  list.replaceChildren();
  const visible = visibleChannels();

  if (!visible.length) {
    const empty = document.createElement("p");
    empty.textContent = t("empty");
    list.appendChild(empty);
    updateCount(0);
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const channel of visible) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "jemtv-card";
    card.setAttribute("aria-label", `Play ${channel.name}`);

    if (activeChannel && channelKey(activeChannel) === channelKey(channel)) {
      card.classList.add("active");
    }

    if (channel.logo && /^https?:\/\//i.test(channel.logo)) {
      const img = document.createElement("img");
      img.className = "jemtv-logo";
      img.src = channel.logo;
      img.alt = "";
      img.loading = "lazy";
      img.onerror = () => {
        const span = document.createElement("span");
        span.className = "jemtv-logo";
        span.textContent = initials(channel.name);
        img.replaceWith(span);
      };
      card.appendChild(img);
    } else {
      const logo = document.createElement("span");
      logo.className = "jemtv-logo";
      logo.textContent = initials(channel.name);
      card.appendChild(logo);
    }

    const name = document.createElement("span");
    name.className = "jemtv-name";
    name.textContent = channel.name;

    const category = document.createElement("span");
    category.className = "jemtv-category";
    category.textContent = channel.category;

    const star = document.createElement("span");
    star.className = "jemtv-category";
    star.textContent = favorites.includes(channelKey(channel)) ? "★ Favorite" : "";

    card.append(name, category, star);
    card.addEventListener("click", () => playChannel(channel));
    fragment.appendChild(card);
  }

  list.appendChild(fragment);
  updateCount(visible.length);
}

function updateCount(count) {
  const target = $("#channel-count");
  if (target) target.textContent = String(count ?? visibleChannels().length);
}

/* ---------- Video playback ---------- */

function stopHls() {
  if (!hlsInstance) return;
  try {
    hlsInstance.destroy();
  } catch (error) {
    console.warn("HLS cleanup error:", error);
  }
  hlsInstance = null;
}

function updatePlayerInfo(channel) {
  const title = $("#playing-title");
  const category = $("#playing-category");
  const code = $("#playing-code");

  if (title) title.textContent = channel?.name || "JEM TV";
  if (category) category.textContent = channel?.category || "";
  if (code) code.textContent = channel?.id || channel?.country || "";
}

function playChannel(channel) {
  const video = $("#tv-player");

  if (!video || !channel?.url) {
    setMessage("Video player is missing or the channel URL is invalid.");
    return;
  }

  activeChannel = channel;
  updatePlayerInfo(channel);
  renderChannels();
  setMessage(`Connecting to ${channel.name}...`);

  stopHls();

  video.pause();
  video.removeAttribute("src");
  video.load();

  video.controls = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.autoplay = localStorage.getItem(STORAGE.autoplay) !== "false";

  video.onplaying = () => setMessage(`Playing: ${channel.name}`);
  video.onerror = () => setMessage(`${t("failed")} — ${channel.name}`);

  const isHls = /\.m3u8($|\?)/i.test(channel.url);

  // Safari and iPhone usually support HLS natively.
  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = channel.url;
    video.load();

    if (video.autoplay) {
      video.play().catch(() => {
        setMessage("Press the Play button to start the channel.");
      });
    }
    return;
  }

  // Other browsers need hls.js loaded by index.html.
  if (isHls && window.Hls && window.Hls.isSupported()) {
    hlsInstance = new window.Hls({
      enableWorker: true,
      capLevelToPlayerSize: true,
      lowLatencyMode:
        localStorage.getItem(STORAGE.lowData) !== "true"
    });

    hlsInstance.loadSource(channel.url);
    hlsInstance.attachMedia(video);

    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => {
      if (video.autoplay) {
        video.play().catch(() => {
          setMessage("Press the Play button to start the channel.");
        });
      }
    });

    hlsInstance.on(window.Hls.Events.ERROR, (_event, data) => {
      if (data?.fatal) {
        setMessage(`${t("failed")} — check the stream or internet connection.`);
        stopHls();
      }
    });

    return;
  }

  video.src = channel.url;
  video.load();

  if (video.autoplay) {
    video.play().catch(() => {
      setMessage("This stream may not be supported by your browser.");
    });
  }
}

function retryChannel() {
  if (activeChannel) playChannel(activeChannel);
}

/* ---------- Favorites ---------- */

function toggleFavorites() {
  favoritesOnly = !favoritesOnly;

  const button = $("#favorites-toggle");
  if (button) {
    button.textContent = `${favoritesOnly ? "★" : "☆"} ${t("favorites")}`;
    button.setAttribute("aria-pressed", String(favoritesOnly));
  }

  renderChannels();
}

function toggleFavorite(channel) {
  const key = channelKey(channel);

  if (favorites.includes(key)) {
    favorites = favorites.filter(item => item !== key);
  } else {
    favorites.push(key);
  }

  saveFavorites();
  renderChannels();
}

/* ---------- Navigation and language ---------- */

function showView(name) {
  const tv = $("#tv-view");
  const settings = $("#settings-view");

  if (tv) tv.hidden = name !== "tv";
  if (settings) settings.hidden = name !== "settings";
}

function setLanguage(value) {
  language = value === "en" ? "en" : "am";
  localStorage.setItem(STORAGE.language, language);

  const search = $("#search-input");
  if (search) search.placeholder = t("search");

  const dark = $("#toggle-dark");
  if (dark) {
    const theme = document.documentElement.dataset.theme || "dark";
    dark.textContent = theme === "dark" ? t("light") : t("dark");
  }

  const home = $("#home-btn");
  if (home) home.textContent = t("home");

  const settings = $("#settings-btn");
  if (settings) settings.textContent = t("settings");

  const retry = $("#retry-btn");
  if (retry) retry.textContent = t("retry");

  buildCategories();
  renderChannels();
}

function bindEvents() {
  $("#search-input")?.addEventListener("input", renderChannels);
  $("#category-filter")?.addEventListener("change", renderChannels);

  $("#favorites-toggle")?.addEventListener("click", toggleFavorites);
  $("#retry-btn")?.addEventListener("click", retryChannel);
  $("#toggle-dark")?.addEventListener("click", toggleTheme);

  $("#toggle-lowdata")?.addEventListener("click", () => {
    const enabled =
      document.documentElement.dataset.lowData !== "true";

    document.documentElement.dataset.lowData = String(enabled);
    localStorage.setItem(STORAGE.lowData, String(enabled));
    $("#toggle-lowdata")?.setAttribute("aria-pressed", String(enabled));
  });

  $("#toggle-autoplay")?.addEventListener("click", () => {
    const enabled = localStorage.getItem(STORAGE.autoplay) === "false";
    localStorage.setItem(STORAGE.autoplay, String(enabled));
    $("#toggle-autoplay")?.setAttribute("aria-pressed", String(enabled));
  });

  $("#home-btn")?.addEventListener("click", () => showView("tv"));
  $("#settings-btn")?.addEventListener("click", () => showView("settings"));
  $("#back-btn")?.addEventListener("click", () => showView("tv"));

  $("#language-select")?.addEventListener("change", event => {
    setLanguage(event.target.value);
  });

  // Optional favorite buttons in compatible HTML.
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-favorite-url]");
    if (!button) return;

    const url = button.getAttribute("data-favorite-url");
    const channel = channels.find(item => item.url === url);
    if (channel) toggleFavorite(channel);
  });
}

/* ---------- Start the application ---------- */

function initializeApp() {
  addStyles();

  setTheme(localStorage.getItem(STORAGE.theme) || "dark");
  setupSettings();

  const languageSelect = $("#language-select");
  if (languageSelect) languageSelect.value = language;

  const search = $("#search-input");
  if (search) search.placeholder = t("search");

  const favoritesButton = $("#favorites-toggle");
  if (favoritesButton) favoritesButton.textContent = `☆ ${t("favorites")}`;

  bindEvents();
  setLanguage(language);
  loadChannels();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp, { once: true });
} else {
  initializeApp();
}
