"use strict";

// ============================================================
// 0. አስተዳደር ማስታወሻ
// - የድሮው ኮድ 2050 "ቻናሎች" ከ18 URL ብቻ በራሬ ብዛት ፈጥሮ ነበር። አዲሱ ኮድ playlists ከኔትወርክ ጫንቶ እውነተኛ stream URLs ይለያል።
// - በአሳሽ ውስጥ DRM/RTMP/RTSP/አገር-ተከልካይ ስትሪሞች ሊጫወቱ አይችሉም። እነዚህ ለVLC ብቻ ናቸው።
// ============================================================

// ============================================================
// 1. የትርጉም መረጃ (i18n)
// ============================================================
const i18n = {
  am: {
    appTitle: "📺 IPTV ቀጥታ ስርጭት",
    searchPlaceholder: "ቻናል ፈልግ...",
    allCategories: "ሁሉም ምድቦች",
    categoryNews: "ዜና",
    categorySports: "ስፖርት",
    categoryEntertainment: "መዝናኛ",
    homeBtn: "🏠 ቤት",
    settingsBtn: "⚙️ ቅንብሮች",
    defaultChannelTitle: "ምንም የተመረጠ ቻናል የለም",
    statusReady: "● ዝግጁ",
    statusLoading: "● በመጫን ላይ...",
    statusLive: "● LIVE",
    statusWaiting: "● በመጠበቅ ላይ...",
    statusError: "● ስህተት",
    statusNotSupported: "● አይደገፍም",
    msgChooseChannel: "ቻናል ይምረጡ...",
    msgLoading: "ስርጭቱ በመጫን ላይ ነው።",
    msgPlayPress: "ለመጀመር በቪዲዮው ላይ ▶ ይጫኑ።",
    msgLive: "ስርጭቱ በቀጥታ እየተጫወተ ነው።",
    msgWaiting: "ኔትወርክ እየጠበቀ ነው...",
    msgStreamError: "ሊንኩ ሊለወጥ ይችላል፣ ሌላ ቻናል ይምረጡ ወይም እንደገና ይሞክሩ።",
    msgVideoError: "ቪዲዮው አልተከፈተም። ኢንተርኔትዎን ይፈትሹ ወይም ሌላ ቻናል ይምረጡ።",
    msgNoResults: "ምንም ቻናል አልተገኘም።",
    msgNotSupported: "ይህ አሳሽ HLS ማጫወትን አይደግፍም።",
    msgAllFailed: "ሁሉም ስትሪሞች አልተሳኩም። እባክዎ ሌላ ቻናል ይምረጡ።",
    msgSelectFirst: "መጀመሪያ ቻናል ይምረጡ።",
    msgVlcOpened: "በVLC ለመክፈት የሚሞክር...",
    msgLoadingChannels: "ቻናሎችን በመጫን ላይ...",
    msgChannelsLoaded: "ቻናሎች ዝግጁ ናቸው።",
    showingFirst: "የመጀመሪያዎቹ 150 ውጤቶች ከ",
    showingRest: "ውስጥ ይታያሉ። ልዩ ቻናሎችን ለማግኘት ፍለጋ ይጠቀሙ።",
    channelsCount: "ቻናሎች",
    settingsTitle: "⚙️ ቅንብሮች",
    settingsAppearance: "🎨 መልክ",
    settingsDarkMode: "ጨለማ ሁነታ (Dark Mode)",
    settingsDarkModeDesc: "የገጹን ቀለም ወደ ጨለማ ይቀይሩ",
    settingsLanguage: "ቋንቋ (Language)",
    settingsLanguageDesc: "የገጹን ቋንቋ ይምረጡ",
    settingsPlayer: "▶️ አጫዋች",
    settingsAutoplay: "ራስ-ሰር ማጫወት (Autoplay)",
    settingsAutoplayDesc: "ገጹ ሲከፈት የመጀመሪያው ቻናል በራስ-ሰር እንዲጫወት",
    settingsLowData: "ዝቅተኛ ውሂብ ሁኔታ (Low Data)",
    settingsLowDataDesc: "የቪዲዮ ጥራትን በመቀነስ ዳታ ይቆጥቡ",
    settingsVLC: "🎬 በVLC ክፈት",
    settingsVLCDesc: "የአሁኑን ቻናል በVLC ሚዲያ ፕሌየር ይክፈቱ",
    settingsGeneral: "🌍 አጠቃላይ",
    settingsDefaultCategory: "ነባሪ ምድብ",
    settingsDefaultCategoryDesc: "ሲከፈት የሚታየው የቻናል ምድብ",
    settingsAll: "ሁሉም",
    backBtn: "⬅️ ወደ ቻናሎች ተመለስ",
    liveStream: "የቀጥታ ስርጭት",
    vlcButton: "🎬 በVLC ክፈት",
  },
  en: {
    appTitle: "📺 IPTV Live",
    searchPlaceholder: "Search channels...",
    allCategories: "All Categories",
    categoryNews: "News",
    categorySports: "Sports",
    categoryEntertainment: "Entertainment",
    homeBtn: "🏠 Home",
    settingsBtn: "⚙️ Settings",
    defaultChannelTitle: "No channel selected",
    statusReady: "● Ready",
    statusLoading: "● Loading...",
    statusLive: "● LIVE",
    statusWaiting: "● Waiting...",
    statusError: "● Error",
    statusNotSupported: "● Not Supported",
    msgChooseChannel: "Choose a channel...",
    msgLoading: "Stream is loading.",
    msgPlayPress: "Press ▶ on the video to start.",
    msgLive: "Stream is playing live.",
    msgWaiting: "Waiting for network...",
    msgStreamError: "The link may have changed. Try another channel or retry.",
    msgVideoError: "Video could not load. Check your internet or choose another channel.",
    msgNoResults: "No channels found.",
    msgNotSupported: "This browser does not support HLS playback.",
    msgAllFailed: "All streams failed. Please choose another channel.",
    msgSelectFirst: "Please select a channel first.",
    msgVlcOpened: "Trying to open in VLC...",
    msgLoadingChannels: "Loading channels...",
    msgChannelsLoaded: "Channels are ready.",
    showingFirst: "Showing first 150 of",
    showingRest: "results. Use search to find specific channels.",
    channelsCount: "channels",
    settingsTitle: "⚙️ Settings",
    settingsAppearance: "🎨 Appearance",
    settingsDarkMode: "Dark Mode",
    settingsDarkModeDesc: "Switch the page to dark colors",
    settingsLanguage: "Language",
    settingsLanguageDesc: "Choose the page language",
    settingsPlayer: "▶️ Player",
    settingsAutoplay: "Autoplay",
    settingsAutoplayDesc: "Automatically play the first channel on load",
    settingsLowData: "Low Data Mode",
    settingsLowDataDesc: "Save data by reducing video quality",
    settingsVLC: "🎬 Open in VLC",
    settingsVLCDesc: "Open the current channel in VLC media player",
    settingsGeneral: "🌍 General",
    settingsDefaultCategory: "Default Category",
    settingsDefaultCategoryDesc: "The channel category shown on load",
    settingsAll: "All",
    backBtn: "⬅️ Back to Channels",
    liveStream: "Live Stream",
    vlcButton: "🎬 Open in VLC",
  }
};

// ============================================================
// 2. Fallback streams: direct playable URLs only (no .m3u playlists here)
// ============================================================
const baseStreams = [
  { name: "Al Jazeera English HD", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8", altUrls: ["https://d1cy85syyhvqz5.cloudfront.net/v1/master/7b67fbda7ab859400a821e9aa0deda20ab7ca3d2/aljazeeraLive/AJE/index.m3u8"] },
  { name: "Al Jazeera Arabic HD", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-v3-aja.getaj.net/AJA-V3/index.m3u8", altUrls: ["https://live-hls-web-aja.getaj.net/AJA/index.m3u8"] },
  { name: "DW English HD", country: "Germany", category: "NEWS", streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { name: "France 24 English", country: "France", category: "NEWS", streamUrl: "https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8" },
  { name: "TRT World", country: "Turkey", category: "NEWS", streamUrl: "https://trtworldlive.medya.trt.com.tr/master.m3u8" },
  { name: "NHK World Japan", country: "Japan", category: "NEWS", streamUrl: "https://nhkworld-1.akamaized.net/hls/live/2018785/nhkworld/master.m3u8" },
  { name: "beIN Sports XTRA", country: "USA", category: "SPORTS", streamUrl: "https://bein-esp-klowdtv.amagi.tv/playlist.m3u8" },
  { name: "EDGEsport", country: "Global", category: "SPORTS", streamUrl: "https://edgesports-plex.amagi.tv/playlist.m3u8" },
  { name: "FOX Sports Australia", country: "Australia", category: "SPORTS", streamUrl: "https://austchannel-live.akamaized.net/hls/live/2002736/austchannel-sport/master.m3u8" },
  { name: "NASA TV HD", country: "USA", category: "ENTERTAINMENT", streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8" },
  { name: "Red Bull TV", country: "Global", category: "ENTERTAINMENT", streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" }
];

const categoriesList = ["SPORTS", "NEWS", "ENTERTAINMENT"];

// Real public playlists. They are parsed into real stream URLs.
const PLAYLIST_SOURCES = [
  { url: "https://iptv-org.github.io/iptv/categories/sports.m3u", forceCategory: "SPORTS" },
  { url: "https://iptv-org.github.io/iptv/categories/news.m3u", forceCategory: "NEWS" },
  { url: "https://iptv-org.github.io/iptv/categories/entertainment.m3u", forceCategory: "ENTERTAINMENT" },
  { url: "https://iptv-org.github.io/iptv/countries/et.m3u", forceCategory: "" },
  { url: "https://iptv-org.github.io/iptv/index.m3u", forceCategory: "" }
];

const MAX_CHANNELS = 6000;
const DISPLAY_LIMIT = 150;
const HLS_CDN = "https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js";
const PROXIES = [
  (u) => u,
  (u) => "https://corsproxy.io/?url=" + encodeURIComponent(u),
  (u) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
  (u) => "https://cors.isomorphic-git.org/" + u
];

// ============================================================
// 3. DOM / state
// ============================================================
const $ = (id) => document.getElementById(id);
const player = $("tv-player");
const playlist = $("channels-playlist");
const searchInput = $("search-input");
const categoryFilter = $("category-filter");
const channelCount = $("channel-count");
const playingTitle = $("playing-title");
const playingCategory = $("playing-category");
const playingCode = $("playing-code");
const playerStatus = $("player-status");
const playerMessage = $("player-message");

let tvChannels = [];
let channelId = 1;
let hlsInstance = null;
let activeChannel = null;
let currentActiveId = null;
let userGestured = false;
let hlsPromise = null;

const settings = { darkMode: true, autoplay: true, lowData: false, defaultCategory: "all", language: "am" };

function t(key) {
  return (i18n[settings.language] && i18n[settings.language][key]) || i18n.en[key] || key;
}

function requiredEl(el, name) {
  if (!el) throw new Error("Missing element: #" + name);
  return el;
}
requiredEl(player, "tv-player");
requiredEl(playlist, "channels-playlist");
requiredEl(searchInput, "search-input");
requiredEl(categoryFilter, "category-filter");
requiredEl(channelCount, "channel-count");
requiredEl(playingTitle, "playing-title");
requiredEl(playingCategory, "playing-category");
requiredEl(playingCode, "playing-code");
requiredEl(playerStatus, "player-status");
requiredEl(playerMessage, "player-message");

// ============================================================
// 4. Settings
// ============================================================
function loadSettings() {
  try {
    const saved = localStorage.getItem("iptv-settings");
    if (saved) Object.assign(settings, JSON.parse(saved));
  } catch (e) {}

  if ($("toggle-dark")) $("toggle-dark").classList.toggle("active", settings.darkMode);
  if ($("toggle-autoplay")) $("toggle-autoplay").classList.toggle("active", settings.autoplay);
  if ($("toggle-lowdata")) $("toggle-lowdata").classList.toggle("active", settings.lowData);
  if ($("default-category")) $("default-category").value = settings.defaultCategory;
  if ($("language-select")) $("language-select").value = settings.language;
  document.documentElement.dataset.theme = settings.darkMode ? "dark" : "light";
  document.documentElement.lang = settings.language;
}

function saveSettings() {
  try { localStorage.setItem("iptv-settings", JSON.stringify(settings)); } catch (e) {}
}

// ============================================================
// 5. i18n/UI
// ============================================================
function applyLanguage() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  document.title = t("appTitle").replace("📺 ", "");
  const appTitleEl = $("app-title");
  if (appTitleEl) appTitleEl.textContent = t("appTitle");

  if (!activeChannel) {
    playingTitle.textContent = t("defaultChannelTitle");
    playerMessage.textContent = t("msgChooseChannel");
    playerStatus.textContent = t("statusReady");
  } else {
    updatePlayerStatus();
  }
  if (playerMessage.dataset.msgKey) playerMessage.textContent = t(playerMessage.dataset.msgKey);
  updateChannelCount();
  renderPlaylist();
}

function updateChannelCount() {
  const count = getFilteredChannels().length.toLocaleString();
  channelCount.textContent = `${count} ${t("channelsCount")}`;
}

function updatePlayerStatus() {
  const key = playerStatus.dataset.statusKey;
  if (key) playerStatus.textContent = t(key);
}

function setStatus(statusKey) {
  playerStatus.dataset.statusKey = statusKey;
  playerStatus.textContent = t(statusKey);
}

function setMessage(msgKey) {
  playerMessage.dataset.msgKey = msgKey;
  playerMessage.textContent = t(msgKey);
  playerMessage.style.display = "block";
}

// ============================================================
// 6. M3U loading/parsing
// ============================================================
function cleanUrl(url) {
  if (!url) return "";
  let u = String(url).trim();
  u = u.replace(/^vlc:\/\//i, "");
  if (u.startsWith("//")) u = "https:" + u;
  return u;
}

function isDirectPlayableUrl(url) {
  const u = cleanUrl(url).toLowerCase();
  if (!/^https?:\/\//.test(u)) return false;
  if (/rtmp:|rtsp:|mms:|mmsh:|drm:|youtube\.com|youtu\.be|facebook\.com|tiktok\.com/.test(u)) return false;
  if (/\.mpd($|\?)/.test(u)) return false; // DASH not handled by this player
  if (/\.(mkv|avi|mov|wmv|flv)($|\?)/.test(u)) return false;
  return true;
}

function isM3uPlaylistUrl(url) {
  return /\.m3u($|\?)/i.test(cleanUrl(url)) && !/\.m3u8($|\?)/i.test(cleanUrl(url));
}

function fetchText(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(new Error("timeout")), timeoutMs);
    fetch(url, { signal: ctl.signal, cache: "no-store" })
      .then((res) => {
        clearTimeout(timer);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(resolve)
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function parseAttrs(line) {
  const attrs = {};
  const re = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(line))) attrs[m[1]] = m[2];
  return attrs;
}

function parseM3U(text, forceCategory) {
  const lines = String(text).split(/\r?\n/);
  const out = [];
  let attrs = null;
  let duration = -1;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("#EXTINF:")) {
      const comma = line.lastIndexOf(",");
      attrs = parseAttrs(line.slice(0, comma >= 0 ? comma : undefined));
      const left = comma >= 0 ? line.slice(0, comma) : line;
      const durMatch = left.match(/#EXTINF:\s*(-?[\d.]+)/);
      duration = durMatch ? Number(durMatch[1]) : -1;
      attrs.__name = comma >= 0 ? line.slice(comma + 1).trim() : (attrs["tvg-id"] || "Unknown");
      if (forceCategory) attrs["group-title"] = forceCategory;
      continue;
    }

    if (line.startsWith("#EXTGRP:") && attrs) {
      attrs["group-title"] = line.replace("#EXTGRP:", "").trim();
      if (forceCategory) attrs["group-title"] = forceCategory;
      continue;
    }

    if (line.startsWith("#")) continue;

    const url = cleanUrl(line);
    if (!isDirectPlayableUrl(url)) { attrs = null; continue; }

    const name = (attrs && (attrs.__name || attrs["tvg-name"])) || "Channel";
    out.push({
      name,
      logo: (attrs && attrs["tvg-logo"]) || "",
      group: (attrs && attrs["group-title"]) || forceCategory || "",
      tvgId: (attrs && attrs["tvg-id"]) || "",
      duration,
      streamUrl: url,
      altUrls: [],
      rawAttrs: attrs || {}
    });
    attrs = null;
  }
  return out;
}

async function loadPlaylistSource(src) {
  const text = await fetchText(src.url, 20000);
  const parsed = parseM3U(text, src.forceCategory || "");
  if (!parsed.length) throw new Error("empty playlist");
  return parsed;
}

function mapCategory(group, fallback) {
  const g = String(group || fallback || "").toLowerCase();
  if (/(sport|football|soccer|nba|nfl|boxing|ufc|cricket|tennis|f1|racing)/.test(g)) return "SPORTS";
  if (/(news|current|business|weather|politic)/.test(g)) return "NEWS";
  return "ENTERTAINMENT";
}

function countryFromGroup(group, fallback) {
  if (fallback) return fallback;
  const g = String(group || "");
  const m = g.match(/\(([A-Za-z ,]+)\)\s*$/);
  return m ? m[1].trim() : "International";
}

function makeCode(ch) {
  const fromTvg = ch.tvgId ? ch.tvgId.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() : "";
  if (fromTvg) return fromTvg;
  return (ch.name || "CH").replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || `CH${String(channelId).padStart(3, "0")}`;
}

function normalizeLoadedChannel(ch) {
  return {
    id: channelId++,
    code: makeCode(ch),
    name: String(ch.name || "Channel").trim(),
    country: countryFromGroup(ch.group, ch.country),
    category: mapCategory(ch.group, ch.category),
    group: ch.group || "",
    logo: ch.logo || "",
    streamUrl: cleanUrl(ch.streamUrl),
    altUrls: (ch.altUrls || []).map(cleanUrl).filter(isDirectPlayableUrl)
  };
}

async function loadChannels() {
  setStatus("statusLoading");
  setMessage("msgLoadingChannels");

  const results = await Promise.allSettled(PLAYLIST_SOURCES.map(loadPlaylistSource));
  let loaded = results.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);

  if (!loaded.length) {
    loaded = baseStreams
      .filter((s) => isDirectPlayableUrl(s.streamUrl))
      .map((s) => ({ ...s, group: s.category }));
  }

  const seen = new Set();
  tvChannels = [];
  for (const ch of loaded) {
    const streamUrl = cleanUrl(ch.streamUrl);
    if (!isDirectPlayableUrl(streamUrl)) continue;
    const key = `${ch.name}|${streamUrl}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tvChannels.push(normalizeLoadedChannel({ ...ch, streamUrl }));
    if (tvChannels.length >= MAX_CHANNELS) break;
  }

  channelId = tvChannels.length + 1;
  updateChannelCount();
}

// ============================================================
// 7. Filter/render
// ============================================================
function getFilteredChannels() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  return tvChannels.filter((channel) => {
    const searchable = `${channel.name} ${channel.country} ${channel.code} ${channel.group}`.toLowerCase();
    const matchesSearch = searchable.includes(term);
    const matchesCategory = category === "all" || channel.category === category;
    return matchesSearch && matchesCategory;
  });
}

function renderPlaylist() {
  if (!playlist) return;
  const data = getFilteredChannels();
  playlist.replaceChildren();
  channelCount.textContent = `${data.length.toLocaleString()} ${t("channelsCount")}`;

  if (!data.length) {
    const empty = document.createElement("p");
    empty.className = "player-message";
    empty.textContent = t("msgNoResults");
    playlist.appendChild(empty);
    return;
  }

  const frag = document.createDocumentFragment();
  data.slice(0, DISPLAY_LIMIT).forEach((channel) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "playlist-item" + (channel.id === currentActiveId ? " active" : "");
    button.title = channel.streamUrl;

    const code = document.createElement("span");
    code.className = "playlist-code";
    code.textContent = channel.code.substring(0, 4);

    const info = document.createElement("span");
    info.className = "playlist-text";

    const name = document.createElement("strong");
    name.textContent = channel.name;

    const details = document.createElement("small");
    details.textContent = `${channel.country} • ${t("category" + channel.category.charAt(0) + channel.category.slice(1).toLowerCase())}`;

    info.append(name, details);

    const icon = document.createElement("span");
    icon.className = "play-icon";
    icon.textContent = "▶";

    button.append(code, info, icon);
    button.addEventListener("click", () => playChannel(channel));
    frag.appendChild(button);
  });
  playlist.appendChild(frag);

  if (data.length > DISPLAY_LIMIT) {
    const infoNode = document.createElement("div");
    infoNode.style.cssText = "text-align:center; padding:10px; color:var(--muted); font-size:12px;";
    infoNode.textContent = `${t("showingFirst")} ${data.length.toLocaleString()} ${t("showingRest")}`;
    playlist.appendChild(infoNode);
  }
}

// ============================================================
// 8. Playback engine
// ============================================================
function stopPlayer() {
  if (hlsInstance) {
    try { hlsInstance.destroy(); } catch (e) {}
    hlsInstance = null;
  }
  try {
    player.pause();
    player.removeAttribute("src");
    player.load();
  } catch (e) {}
}

function isNotAllowedError(err) {
  return err && (err.name === "NotAllowedError" || /user gesture|play\(\) failed|notallowed/i.test(String(err.message || err)));
}

function isNetworkishError(err) {
  return err && (err.kind === "network" || /network|timeout|manifestload|levelload|fragload|http|failed to fetch|cors/i.test(String(err.message || err)));
}

function ensureHls() {
  const nativeHls = !!player.canPlayType("application/vnd.apple.mpegurl");
  if (window.Hls && window.Hls.isSupported()) return Promise.resolve({ useHls: true, native: false });
  if (nativeHls) return Promise.resolve({ useHls: false, native: true });

  if (!hlsPromise) {
    hlsPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = HLS_CDN;
      s.async = true;
      const timer = setTimeout(() => reject(new Error("hls.js load timeout")), 10000);
      s.onload = () => {
        clearTimeout(timer);
        if (window.Hls && window.Hls.isSupported()) resolve({ useHls: true, native: false });
        else reject(new Error("hls.js not supported"));
      };
      s.onerror = () => {
        clearTimeout(timer);
        reject(new Error("hls.js failed to load"));
      };
      document.head.appendChild(s);
    });
    hlsPromise.catch(() => { hlsPromise = null; });
  }
  return hlsPromise;
}

function playNative(url) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const done = (fn, arg) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      fn(arg);
    };
    const onError = () => done(reject, Object.assign(new Error("native playback error"), { kind: "network" }));
    const timer = setTimeout(() => done(reject, new Error("native timeout")), 15000);
    const cleanup = () => player.removeEventListener("error", onError);
    player.addEventListener("error", onError);
    player.src = url;
    player.load();
    player.play().then(() => done(resolve)).catch((err) => {
      if (isNotAllowedError(err)) done(resolve);
      else done(reject, err);
    });
  });
}

function playWithHls(url) {
  return new Promise((resolve, reject) => {
    if (hlsInstance) {
      try { hlsInstance.destroy(); } catch (e) {}
      hlsInstance = null;
    }

    const config = {
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 30,
      maxBufferLength: settings.lowData ? 10 : 30,
      maxMaxBufferLength: settings.lowData ? 20 : 60,
      startLevel: settings.lowData ? 0 : -1,
      autoStartLoad: true,
      startPosition: -1,
      manifestLoadingTimeOut: 12000,
      manifestLoadingMaxRetry: 1,
      levelLoadingTimeOut: 12000,
      levelLoadingMaxRetry: 1,
      fragLoadingTimeOut: 20000,
      fragLoadingMaxRetry: 2,
      xhrSetup: (xhr) => { xhr.withCredentials = false; }
    };

    let settled = false;
    let recoveredMedia = false;

    const done = (fn, arg) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { hlsInstance && hlsInstance.off && hlsInstance.off(Hls.Events.ERROR, onError); } catch (e) {}
      fn(arg);
    };

    const timer = setTimeout(() => done(reject, new Error("playback timeout")), 18000);

    const onError = (event, data) => {
      if (!data || !data.fatal) return;
      const err = new Error(data.details || "fatal hls error");
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) err.kind = "network";
      if (data.type === Hls.ErrorTypes.MEDIA_ERROR && !recoveredMedia) {
        recoveredMedia = true;
        try { hlsInstance.recoverMediaError(); return; } catch (e) {}
      }
      if (hlsInstance) {
        try { hlsInstance.destroy(); } catch (e) {}
        hlsInstance = null;
      }
      done(reject, err);
    };

    try {
      hlsInstance = new Hls(config);
      hlsInstance.on(Hls.Events.ERROR, onError);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        player.play().then(() => done(resolve)).catch((err) => {
          if (isNotAllowedError(err)) done(resolve);
          else done(reject, err);
        });
      });
      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(player);
    } catch (err) {
      done(reject, err);
    }
  });
}

function tryPlayUrl(url) {
  const u = cleanUrl(url);
  if (!isDirectPlayableUrl(u)) return Promise.reject(new Error("unsupported url"));

  return ensureHls().then((mode) => {
    player.muted = settings.autoplay && !userGestured;
    if (mode.native && !mode.useHls) return playNative(u);
    return playWithHls(u);
  });
}

function buildCandidates(channel) {
  const urls = [];
  const add = (u) => {
    const c = cleanUrl(u);
    if (isDirectPlayableUrl(c) && !urls.includes(c)) urls.push(c);
  };
  add(channel.streamUrl);
  (channel.altUrls || []).forEach(add);

  const expanded = [];
  const seenProxied = new Set();
  for (const u of urls) {
    expanded.push(u);
    for (let i = 1; i < PROXIES.length; i++) {
      const p = PROXIES[i](u);
      if (!seenProxied.has(p) && p.length < 2000) {
        seenProxied.add(p);
        expanded.push(p);
      }
    }
  }
  return expanded.slice(0, 10);
}

async function playChannel(channel) {
  activeChannel = channel;
  currentActiveId = channel.id;

  playingTitle.textContent = channel.name;
  playingCategory.textContent = `${channel.country} • ${channel.category}`;
  playingCode.textContent = channel.code.substring(0, 4);

  setStatus("statusLoading");
  setMessage("msgLoading");
  stopPlayer();
  renderPlaylist();
  toggleVlcButton(true);

  const candidates = buildCandidates(channel);
  if (!candidates.length) {
    setStatus("statusError");
    setMessage("msgAllFailed");
    return;
  }

  let lastErr = null;
  for (const url of candidates) {
    try {
      await tryPlayUrl(url);
      return;
    } catch (err) {
      lastErr = err;
      console.warn("Stream attempt failed:", url, err);
      if (!isNetworkishError(err) && !/unsupported|hls\.js|not supported/i.test(String(err && err.message))) {
        break;
      }
    }
  }

  if (lastErr && /unsupported|not supported|hls\.js|DASH/i.test(String(lastErr.message || lastErr))) {
    setStatus("statusNotSupported");
    setMessage("msgNotSupported");
  } else {
    setStatus("statusError");
    setMessage("msgAllFailed");
  }
}

// ============================================================
// 9. VLC
// ============================================================
function toggleVlcButton(show) {
  const vlcBtn = $("vlc-btn");
  if (vlcBtn) vlcBtn.style.display = show ? "inline-block" : "none";
}

function openInVlc() {
  if (!activeChannel) {
    setMessage("msgSelectFirst");
    return;
  }
  const url = cleanUrl(activeChannel.streamUrl);
  const link = document.createElement("a");
  link.href = `vlc://${url}`;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setMessage("msgVlcOpened");
  console.log(`VLC command: vlc "${url}"`);
}

// ============================================================
// 10. Player events
// ============================================================
player.addEventListener("playing", () => {
  setStatus("statusLive");
  if (player.muted && !userGestured) {
    setMessage("msgPlayPress");
  } else {
    setMessage("msgLive");
    playerMessage.style.display = "none";
  }
});

player.addEventListener("waiting", () => {
  setStatus("statusWaiting");
  setMessage("msgWaiting");
});

player.addEventListener("error", () => {
  if (!activeChannel) return;
  setStatus("statusError");
  setMessage("msgVideoError");
});

window.addEventListener("pointerdown", () => {
  userGestured = true;
  try { player.muted = false; } catch (e) {}
}, { passive: true });

// ============================================================
// 11. Search/filter/settings events
// ============================================================
searchInput.addEventListener("input", renderPlaylist);
categoryFilter.addEventListener("change", renderPlaylist);

$("retry-btn")?.addEventListener("click", () => {
  if (activeChannel) playChannel(activeChannel);
  else setMessage("msgSelectFirst");
});

$("settings-btn")?.addEventListener("click", () => {
  $("tv-view").hidden = true;
  $("settings-view").hidden = false;
  $("settings-btn").classList.add("active");
  $("home-btn").classList.remove("active");
});

function showTV() {
  $("settings-view").hidden = true;
  $("tv-view").hidden = false;
  $("settings-btn").classList.remove("active");
  $("home-btn").classList.add("active");
}
$("back-btn")?.addEventListener("click", showTV);
$("home-btn")?.addEventListener("click", showTV);

$("toggle-dark")?.addEventListener("click", () => {
  settings.darkMode = !settings.darkMode;
  $("toggle-dark").classList.toggle("active", settings.darkMode);
  document.documentElement.dataset.theme = settings.darkMode ? "dark" : "light";
  saveSettings();
});

$("toggle-autoplay")?.addEventListener("click", () => {
  settings.autoplay = !settings.autoplay;
  $("toggle-autoplay").classList.toggle("active", settings.autoplay);
  saveSettings();
});

$("toggle-lowdata")?.addEventListener("click", () => {
  settings.lowData = !settings.lowData;
  $("toggle-lowdata").classList.toggle("active", settings.lowData);
  saveSettings();
  if (activeChannel) playChannel(activeChannel);
});

$("default-category")?.addEventListener("change", (e) => {
  settings.defaultCategory = e.target.value;
  categoryFilter.value = e.target.value;
  renderPlaylist();
  saveSettings();
});

$("language-select")?.addEventListener("change", (e) => {
  settings.language = e.target.value;
  document.documentElement.lang = settings.language;
  applyLanguage();
  saveSettings();
});

const vlcBtn = $("vlc-btn");
if (vlcBtn) vlcBtn.addEventListener("click", openInVlc);

// ============================================================
// 12. Boot
// ============================================================
loadSettings();
categoryFilter.value = settings.defaultCategory;
applyLanguage();

(async function boot() {
  try {
    await loadChannels();
    applyLanguage();
    if (settings.autoplay && tvChannels.length) playChannel(tvChannels[0]);
  } catch (err) {
    console.error(err);
    setStatus("statusError");
    setMessage("msgVideoError");
  }
})();
