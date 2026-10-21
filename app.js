
"use strict";

/* JEM TV — Improved IPTV Player
   Native Safari HLS first, HLS.js fallback,
   safer playback, retries, playlist loading and filters.
*/

const I18N = {
  am: {
    title: "📺 Jem TV",
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
    failed: "ስርጭቱ አልተከፈተም። እንደገና ይሞክሩ ወይም ሌላ ቻናል ይምረጡ።",
    pressPlay: "ስርጭቱ ተዘጋጅቷል። በቪዲዮው ላይ ▶ ይጫኑ።",
    count: "ቻናሎች",
    unsupported: "ይህ ስትሪም በዚህ አሳሽ አይደገፍም።",
    networkError: "የኢንተርኔት ወይም የስርጭት ችግር አለ።",
    loadingLibrary: "የቪዲዮ ማጫወቻውን በመጫን ላይ..."
  },
  en: {
    title: "📺 Jem TV",
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
    failed: "Stream failed. Retry or choose another channel.",
    pressPlay: "Stream is ready. Press ▶ on the video.",
    count: "channels",
    unsupported: "This stream is not supported by this browser.",
    networkError: "A network or stream error occurred.",
    loadingLibrary: "Loading video player..."
  }
};

const SOURCES = [
  ["https://iptv-org.github.io/iptv/categories/sports.m3u", "SPORTS"],
  ["https://iptv-org.github.io/iptv/categories/news.m3u", "NEWS"],
  ["https://iptv-org.github.io/iptv/categories/entertainment.m3u", "ENTERTAINMENT"],
  ["https://iptv-org.github.io/iptv/countries/et.m3u", ""],
  ["https://iptv-org.github.io/iptv/index.m3u", ""]
];

/* Public streams can change or become unavailable.
   These are extra sources, not guaranteed permanent links. */
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
    "Missing required HTML IDs: tv-player, channels-playlist, search-input, category-filter"
  );
}

let channels = [];
let activeChannel = null;
let hls = null;
let requestNumber = 0;
let hlsPromise = null;
let recoveryAttempts = 0;

const settings = {
  language: "am",
  darkMode: true,
  autoplay: false,
  lowData: false
};

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
      const name = comma >= 0 ? line.slice(comma + 1).trim() : "Channel";

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
      result.push({
        ...current,
        url: normalizeURL(line)
      });
    }

    current = null;
  }

  return result;
}

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

  /* Always include fallback entries, then deduplicate by URL. */
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

  if (!channels.length) {
    setStatus("error");
    setMessage("noChannels");
    return;
  }

  setStatus("ready");
  setMessage("choose");

  if (settings.autoplay) playChannel(channels[0]);
}

function filteredChannels() {
  const query = search.value.trim().toLowerCase();
  const selected = filter.value;

  return channels.filter(channel => {
    const text = `${channel.name} ${channel.group} ${channel.country}`.toLowerCase();
    const matchesText = text.includes(query);
    const matchesCategory = selected === "all" || channel.category === selected;

    return matchesText && matchesCategory;
  });
}

function categoryLabel(value) {
  if (value === "SPORTS") return tr("sports");
  if (value === "NEWS") return tr("news");
  return tr("entertainment");
}

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
    empty.textContent = tr("noChannels");
    playlist.appendChild(empty);
    return;
  }

  for (const channel of data.slice(0, 250)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "playlist-item";

    if (activeChannel?.id === channel.id) {
      button.classList.add("active");
    }

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

    const info = document.createElement("span");
    info.className = "playlist-text";

    const strong = document.createElement("strong");
    strong.textContent = channel.name;

    const small = document.createElement("small");
    small.textContent = categoryLabel(channel.category);

    info.append(strong, small);

    const playIcon = document.createElement("span");
    playIcon.className = "play-icon";
    playIcon.textContent = "▶";

    button.append(logo, info, playIcon);
    button.addEventListener("click", () => playChannel(channel));
    fragment.appendChild(button);
  }

  playlist.appendChild(fragment);
}

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
        reject(new Error("HLS library unavailable"));
      }
    };

    script.onerror = () => {
      hlsPromise = null;
      reject(new Error("Unable to load HLS library"));
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

  /*
   * iPhone Safari supports HLS natively.
   * Try native playback first; use HLS.js only when needed.
   */
  const nativeHls = player.canPlayType("application/vnd.apple.mpegurl");

  if (nativeHls) {
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

  try {
    setMessage("loadingLibrary");
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

      if (data.type === HlsClass.ErrorTypes.NETWORK_ERROR && recoveryAttempts < 2) {
        recoveryAttempts++;
        hls.startLoad();
        return;
      }

      if (data.type === HlsClass.ErrorTypes.MEDIA_ERROR && recoveryAttempts < 2) {
        recoveryAttempts++;
        hls.recoverMediaError();
        return;
      }

      showPlaybackError(
        myRequest,
        data.type === HlsClass.ErrorTypes.NETWORK_ERROR ? "networkError" : "failed"
      );
    });

    hls.attachMedia(player);
    hls.loadSource(channel.url);
  } catch (error) {
    if (myRequest !== requestNumber) return;

    console.error("Playback setup failed:", error);
    showPlaybackError(myRequest, "failed");
  }
}

/* Playback events */
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

/* Search and category filters */
search.addEventListener("input", renderPlaylist);
filter.addEventListener("change", renderPlaylist);

/* Retry current channel */
$("retry-btn")?.addEventListener("click", () => {
  if (activeChannel) playChannel(activeChannel);
  else setMessage("choose");
});

/* Theme */
$("toggle-dark")?.addEventListener("click", () => {
  settings.darkMode = !settings.darkMode;
  document.documentElement.dataset.theme = settings.darkMode ? "dark" : "light";
});

/* Low-data mode */
$("toggle-lowdata")?.addEventListener("click", () => {
  settings.lowData = !settings.lowData;
  if (activeChannel) playChannel(activeChannel);
});

/* Autoplay preference */
$("toggle-autoplay")?.addEventListener("click", () => {
  settings.autoplay = !settings.autoplay;
});

/* Navigation */
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

/* Language */
$("language-select")?.addEventListener("change", event => {
  settings.language = event.target.value === "en" ? "en" : "am";
  document.documentElement.lang = settings.language;
  search.placeholder = tr("search");
  renderPlaylist();

  if (activeChannel && status) {
    const current = status.textContent;
    if (current.includes("LIVE") || current.includes("LIVE")) setStatus("live");
  }
});

/* Open current stream in VLC, if VLC is installed and supports the URL */
$("vlc-btn")?.addEventListener("click", () => {
  if (!activeChannel) {
    setMessage("choose");
    return;
  }

  window.location.href = "vlc://" + activeChannel.url;
});

/* Initial state */
document.documentElement.dataset.theme = "dark";
search.placeholder = tr("search");
setStatus("ready");
setMessage("loadingChannels");

loadChannels().catch(error => {
  console.error("Channel loading failed:", error);
  setStatus("error");
  setMessage("failed");
});
