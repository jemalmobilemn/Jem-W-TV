
"use strict";

/* =========================================
   JEM TV — IPTV PLAYER + FAVORITES
   ========================================= */

const I18N = {
  am: {
    search: "ቻናል ፈልግ...",
    all: "ሁሉም ምድቦች",
    news: "ዜና",
    sports: "ስፖርት",
    entertainment: "መዝናኛ",
    ready: "● ዝግጁ",
    loading: "● በመጫን ላይ...",
    live: "● LIVE",
    error: "● ስህተት",
    choose: "ቻናል ይምረጡ።",
    loadingChannels: "ቻናሎችን በመጫን ላይ...",
    noChannels: "ቻናል አልተገኘም።",
    noFavorites: "Favorite ያደረግከው ቻናል የለም።",
    failed: "ስርጭቱ አልተከፈተም። ሌላ ቻናል ሞክር።",
    pressPlay: "በቪዲዮው ላይ ▶ ተጫን።",
    count: "ቻናሎች",
    unsupported: "ይህ ስርጭት አይደገፍም።",
    favorites: "⭐ Favorites",
    allChannels: "📺 ሁሉም ቻናሎች",
    addFavorite: "ወደ Favorites ጨምር",
    removeFavorite: "ከ Favorites አስወግድ",
    networkError: "የኔትወርክ ወይም የስርጭት ችግር አለ።"
  },
  en: {
    search: "Search channels...",
    all: "All Categories",
    news: "News",
    sports: "Sports",
    entertainment: "Entertainment",
    ready: "● Ready",
    loading: "● Loading...",
    live: "● LIVE",
    error: "● Error",
    choose: "Choose a channel.",
    loadingChannels: "Loading channels...",
    noChannels: "No channels found.",
    noFavorites: "You have no favorite channels yet.",
    failed: "Stream failed. Please try another channel.",
    pressPlay: "Press ▶ on the video.",
    count: "channels",
    unsupported: "This stream is not supported.",
    favorites: "⭐ Favorites",
    allChannels: "📺 All Channels",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove from favorites",
    networkError: "A network or stream error occurred."
  }
};

const SOURCES = [
  ["https://iptv-org.github.io/iptv/categories/sports.m3u", "SPORTS"],
  ["https://iptv-org.github.io/iptv/categories/news.m3u", "NEWS"],
  ["https://iptv-org.github.io/iptv/categories/entertainment.m3u", "ENTERTAINMENT"],
  ["https://iptv-org.github.io/iptv/countries/et.m3u", ""],
  ["https://iptv-org.github.io/iptv/index.m3u", ""]
];

const FALLBACK = [
  {
    name: "Al Jazeera English",
    group: "NEWS",
    url: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8"
  },
  {
    name: "DW English",
    group: "NEWS",
    url: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"
  },
  {
    name: "France 24 English",
    group: "NEWS",
    url: "https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8"
  },
  {
    name: "NASA TV",
    group: "ENTERTAINMENT",
    url: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8"
  }
];

const $ = id => document.getElementById(id);

const player = $("tv-player");
const playlist = $("channels-playlist");
const search = $("search-input");
const filter = $("category-filter");
const count = $("channel-count");
const title = $("playing-title");
const category = $("playing-category");
const code = $("playing-code");
const status = $("player-status");
const message = $("player-message");

if (!player || !playlist || !search || !filter) {
  throw new Error(
    "Missing HTML IDs: tv-player, channels-playlist, search-input, category-filter"
  );
}

const FAVORITES_KEY = "jem-tv-favorites-v1";

let channels = [];
let activeChannel = null;
let hls = null;
let hlsPromise = null;
let requestNumber = 0;
let recoveryAttempts = 0;
let showFavoritesOnly = false;
let favoriteChannels = loadFavorites();

const settings = {
  language: "am",
  darkMode: true,
  autoplay: false,
  lowData: false
};

/* ---------- LANGUAGE ---------- */

function tr(key) {
  return I18N[settings.language]?.[key] || I18N.en[key] || key;
}

function setStatus(key) {
  if (status) status.textContent = tr(key);
}

function setMessage(key) {
  if (!message) return;
  message.textContent = tr(key);
  message.style.display = "block";
}

function hideMessage() {
  if (message) message.style.display = "none";
}

/* ---------- FAVORITES ---------- */

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify([...favoriteChannels])
    );
  } catch (error) {
    console.warn("Favorites could not be saved:", error);
  }
}

function isFavorite(channel) {
  return favoriteChannels.has(channel.url);
}

function toggleFavorite(channel) {
  if (isFavorite(channel)) {
    favoriteChannels.delete(channel.url);
  } else {
    favoriteChannels.add(channel.url);
  }

  saveFavorites();
  renderPlaylist();
}

function updateFavoritesButton() {
  const btn = $("favorites-toggle");
  if (!btn) return;

  btn.textContent = showFavoritesOnly
    ? tr("allChannels")
    : tr("favorites");

  btn.setAttribute("aria-pressed", String(showFavoritesOnly));
}

function toggleFavoritesView() {
  showFavoritesOnly = !showFavoritesOnly;
  updateFavoritesButton();
  renderPlaylist();
}

/* ---------- PLAYLIST PARSING ---------- */

function normalizeURL(url) {
  return String(url || "").trim();
}

function isPlayableURL(url) {
  const value = normalizeURL(url);

  return /^https?:\/\/\S+$/i.test(value) &&
    !/\.(mpd|mp4|mp3|mkv)(?:$|[?#])/i.test(value) &&
    !/(youtube\.com|youtu\.be|facebook\.com|tiktok\.com)/i.test(value);
}

function categoryOf(group) {
  const value = String(group || "").toLowerCase();

  if (/sport|football|soccer|basketball|cricket|tennis|boxing|racing/.test(value)) {
    return "SPORTS";
  }

  if (/news|weather|business|politic|current/.test(value)) {
    return "NEWS";
  }

  return "ENTERTAINMENT";
}

function parseM3U(text, forcedCategory = "") {
  const lines = String(text).split(/\r?\n/);
  const result = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF:")) {
      const comma = line.lastIndexOf(",");
      const info = comma >= 0 ? line.slice(0, comma) : line;
      const name = comma >= 0
        ? line.slice(comma + 1).trim()
        : "Channel";

      const attrs = {};
      const regex = /([\w-]+)="([^"]*)"/g;
      let match;

      while ((match = regex.exec(info)) !== null) {
        attrs[match[1]] = match[2];
      }

      current = {
        name: name || attrs["tvg-name"] || "Channel",
        logo: attrs["tvg-logo"] || "",
        group: forcedCategory || attrs["group-title"] || "",
        id: attrs["tvg-id"] || ""
      };
      continue;
    }

    if (line.startsWith("#EXTGRP:")) {
      if (current && !forcedCategory) {
        current.group = line.slice(8).trim();
      }
      continue;
    }

    if (line.startsWith("#")) continue;

    if (current && isPlayableURL(line)) {
      result.push({ ...current, url: normalizeURL(line) });
    }

    current = null;
  }

  return result;
}

/* ---------- LOAD CHANNELS ---------- */

async function fetchPlaylist(url, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    if (!text.includes("#EXTM3U")) {
      throw new Error("Invalid M3U playlist");
    }

    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function loadChannels() {
  setStatus("loading");
  setMessage("loadingChannels");

  const results = await Promise.allSettled(
    SOURCES.map(async ([url, forcedCategory]) => {
      const text = await fetchPlaylist(url);
      return parseM3U(text, forcedCategory);
    })
  );

  let rows = results
    .filter(result => result.status === "fulfilled")
    .flatMap(result => result.value);

  /* Keep fallback streams even when some playlists load successfully. */
  rows = rows.concat(FALLBACK.map(channel => ({ ...channel })));

  const seen = new Set();
  channels = [];

  for (const row of rows) {
    if (!isPlayableURL(row.url)) continue;

    const key = normalizeURL(row.url).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    channels.push({
      id: channels.length + 1,
      name: String(row.name || "Channel").trim(),
      logo: row.logo || "",
      group: row.group || "",
      category: categoryOf(row.group),
      url: normalizeURL(row.url),
      country: "International"
    });

    if (channels.length >= 5000) break;
  }

  renderPlaylist();
  updateFavoritesButton();

  if (!channels.length) {
    setStatus("error");
    setMessage("noChannels");
    return;
  }

  setStatus("ready");
  setMessage("choose");

  if (settings.autoplay) {
    playChannel(channels[0]);
  }
}

/* ---------- FILTERING ---------- */

function filteredChannels() {
  const query = search.value.trim().toLowerCase();
  const selected = filter.value;

  return channels.filter(channel => {
    const searchable = [
      channel.name,
      channel.group,
      channel.country
    ].join(" ").toLowerCase();

    const matchesText = searchable.includes(query);
    const matchesCategory =
      selected === "all" || channel.category === selected;
    const matchesFavorite =
      !showFavoritesOnly || isFavorite(channel);

    return matchesText && matchesCategory && matchesFavorite;
  });
}

function categoryLabel(value) {
  if (value === "SPORTS") return tr("sports");
  if (value === "NEWS") return tr("news");
  return tr("entertainment");
}

/* ---------- RENDER CHANNELS ---------- */

function renderPlaylist() {
  const data = filteredChannels();
  const fragment = document.createDocumentFragment();

  playlist.replaceChildren();

  if (count) {
    count.textContent = `${data.length.toLocaleString()} ${tr("count")}`;
  }

  if (!data.length) {
    const empty = document.createElement("p");
    empty.className = "player-message";
    empty.textContent = showFavoritesOnly
      ? tr("noFavorites")
      : tr("noChannels");

    playlist.appendChild(empty);
    return;
  }

  for (const channel of data.slice(0, 250)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "playlist-item";

    if (activeChannel?.url === channel.url) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => playChannel(channel));

    /* Channel logo */
    const logo = document.createElement("span");
    logo.className = "playlist-code";

    if (channel.logo) {
      const img = document.createElement("img");
      img.src = channel.logo;
      img.alt = "";
      img.loading = "lazy";
      img.onerror = () => {
        img.remove();
        logo.textContent = channel.name.slice(0, 2).toUpperCase();
      };
      logo.appendChild(img);
    } else {
      logo.textContent = channel.name.slice(0, 2).toUpperCase();
    }

    /* Channel title and category */
    const info = document.createElement("span");
    info.className = "playlist-text";

    const strong = document.createElement("strong");
    strong.textContent = channel.name;

    const small = document.createElement("small");
    small.textContent = categoryLabel(channel.category);

    info.append(strong, small);

    /* Favorite star */
    const favoriteBtn = document.createElement("span");
    favoriteBtn.className = "favorite-btn";
    favoriteBtn.textContent = isFavorite(channel) ? "⭐" : "☆";
    favoriteBtn.setAttribute(
      "role",
      "button"
    );
    favoriteBtn.setAttribute(
      "aria-label",
      isFavorite(channel) ? tr("removeFavorite") : tr("addFavorite")
    );
    favoriteBtn.setAttribute("tabindex", "0");

    const handleFavorite = event => {
      event.stopPropagation();
      toggleFavorite(channel);
    };

    favoriteBtn.addEventListener("click", handleFavorite);

    favoriteBtn.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleFavorite(event);
      }
    });

    /* Play indicator */
    const playIcon = document.createElement("span");
    playIcon.className = "play-icon";
    playIcon.textContent = "▶";

    button.append(logo, info, favoriteBtn, playIcon);
    fragment.appendChild(button);
  }

  playlist.appendChild(fragment);
}

/* ---------- VIDEO PLAYER ---------- */

function destroyPlayer() {
  if (hls) {
    hls.destroy();
    hls = null;
  }

  player.pause();
  player.removeAttribute("src");
  player.load();
}

function loadHlsJS() {
  if (window.Hls) return Promise.resolve(window.Hls);
  if (hlsPromise) return hlsPromise;

  hlsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js";
    script.async = true;

    script.onload = () => {
      if (window.Hls) resolve(window.Hls);
      else {
        hlsPromise = null;
        reject(new Error("HLS.js unavailable"));
      }
    };

    script.onerror = () => {
      hlsPromise = null;
      reject(new Error("Could not load HLS.js"));
    };

    document.head.appendChild(script);
  });

  return hlsPromise;
}

function showPlaybackError(myRequest, key = "failed") {
  if (myRequest !== requestNumber) return;
  setStatus("error");
  setMessage(key);
}

async function playChannel(channel) {
  const myRequest = ++requestNumber;
  recoveryAttempts = 0;

  activeChannel = channel;
  renderPlaylist();

  if (title) title.textContent = channel.name;
  if (category) category.textContent = categoryLabel(channel.category);
  if (code) code.textContent = String(channel.id).padStart(3, "0");

  setStatus("loading");
  setMessage("loadingChannels");
  destroyPlayer();

  if (!isPlayableURL(channel.url)) {
    showPlaybackError(myRequest, "unsupported");
    return;
  }

  /* Native HLS first for iPhone Safari. */
  if (player.canPlayType("application/vnd.apple.mpegurl")) {
    player.src = channel.url;
    player.load();

    if (settings.autoplay) {
      try {
        await player.play();
      } catch {
        if (myRequest === requestNumber) {
          setStatus("ready");
          setMessage("pressPlay");
        }
      }
    } else {
      setStatus("ready");
      setMessage("pressPlay");
    }

    return;
  }

  /* HLS.js for browsers that need Media Source Extensions. */
  try {
    const HlsClass = await loadHlsJS();
    if (myRequest !== requestNumber) return;

    if (!HlsClass.isSupported()) {
      showPlaybackError(myRequest, "unsupported");
      return;
    }

    hls = new HlsClass({
      enableWorker: true,
      lowLatencyMode: false,
      maxBufferLength: settings.lowData ? 10 : 30,
      startLevel: settings.lowData ? 0 : -1,
      manifestLoadingTimeOut: 20000,
      manifestLoadingMaxRetry: 3,
      levelLoadingTimeOut: 20000,
      fragLoadingTimeOut: 30000,
      fragLoadingMaxRetry: 3
    });

    hls.on(HlsClass.Events.MANIFEST_PARSED, async () => {
      if (myRequest !== requestNumber) return;

      if (settings.autoplay) {
        try {
          await player.play();
        } catch {
          if (myRequest === requestNumber) {
            setStatus("ready");
            setMessage("pressPlay");
          }
        }
      } else {
        setStatus("ready");
        setMessage("pressPlay");
      }
    });

    hls.on(HlsClass.Events.ERROR, (_, data) => {
      if (myRequest !== requestNumber || !data.fatal) return;

      if (
        data.type === HlsClass.ErrorTypes.NETWORK_ERROR &&
        recoveryAttempts < 2
      ) {
        recoveryAttempts++;
        hls.startLoad();
        return;
      }

      if (
        data.type === HlsClass.ErrorTypes.MEDIA_ERROR &&
        recoveryAttempts < 2
      ) {
        recoveryAttempts++;
        hls.recoverMediaError();
        return;
      }

      showPlaybackError(
        myRequest,
        data.type === HlsClass.ErrorTypes.NETWORK_ERROR
          ? "networkError"
          : "failed"
      );
    });

    hls.attachMedia(player);
    hls.loadSource(channel.url);
  } catch (error) {
    if (myRequest !== requestNumber) return;

    console.error("Playback setup error:", error);
    showPlaybackError(myRequest, "failed");
  }
}

/* ---------- VIDEO EVENTS ---------- */

player.addEventListener("playing", () => {
  setStatus("live");
  hideMessage();
});

player.addEventListener("waiting", () => {
  if (activeChannel) setStatus("loading");
});

player.addEventListener("error", () => {
  if (!activeChannel) return;
  setStatus("error");
  setMessage("failed");
});

/* ---------- UI EVENTS ---------- */

search.addEventListener("input", renderPlaylist);
filter.addEventListener("change", renderPlaylist);

$("retry-btn")?.addEventListener("click", () => {
  if (activeChannel) playChannel(activeChannel);
  else setMessage("choose");
});

$("favorites-toggle")?.addEventListener("click", toggleFavoritesView);

$("toggle-dark")?.addEventListener("click", () => {
  settings.darkMode = !settings.darkMode;
  document.documentElement.dataset.theme =
    settings.darkMode ? "dark" : "light";
});

$("toggle-lowdata")?.addEventListener("click", () => {
  settings.lowData = !settings.lowData;
  if (activeChannel) playChannel(activeChannel);
});

$("toggle-autoplay")?.addEventListener("click", () => {
  settings.autoplay = !settings.autoplay;
});

$("home-btn")?.addEventListener("click", () => {
  if ($("tv-view")) $("tv-view").hidden = false;
  if ($("settings-view")) $("settings-view").hidden = true;
});

$("settings-btn")?.addEventListener("click", () => {
  if ($("tv-view")) $("tv-view").hidden = true;
  if ($("settings-view")) $("settings-view").hidden = false;
});

$("back-btn")?.addEventListener("click", () => {
  if ($("tv-view")) $("tv-view").hidden = false;
  if ($("settings-view")) $("settings-view").hidden = true;
});

$("language-select")?.addEventListener("change", event => {
  settings.language = event.target.value === "en" ? "en" : "am";
  document.documentElement.lang = settings.language;

  search.placeholder = tr("search");
  updateFavoritesButton();
  renderPlaylist();
});

$("vlc-btn")?.addEventListener("click", () => {
  if (!activeChannel) {
    setMessage("choose");
    return;
  }

  window.location.href = "vlc://" + activeChannel.url;
});

/* ---------- START ---------- */

document.documentElement.dataset.theme = "dark";
search.placeholder = tr("search");
setStatus("ready");
setMessage("loadingChannels");
updateFavoritesButton();

loadChannels().catch(error => {
  console.error("Channel loading failed:", error);
  setStatus("error");
  setMessage("failed");
});
