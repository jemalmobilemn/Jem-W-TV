"use strict";

// የሚሰሩ የሕዝብ ቀጥታ ስርጭቶች (2025/2026)
const baseStreams = [
  { name: "Al Jazeera English HD", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8" },
  { name: "Al Jazeera Arabic HD", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-web-aja.getaj.net/AJA/index.m3u8" },
  { name: "DW English HD", country: "Germany", category: "NEWS", streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { name: "France 24 English", country: "France", category: "NEWS", streamUrl: "https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8" },
  { name: "CGTN English", country: "China", category: "NEWS", streamUrl: "https://news.cgtn.com/resource/live/english/cgtn-news.m3u8" },
  { name: "ABC News Live", country: "USA", category: "NEWS", streamUrl: "https://abcnews-streams.akamaized.net/hls/live/2023560/abcnewshudson1/master.m3u8" },
  { name: "NASA TV Public", country: "USA", category: "ENTERTAINMENT", streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8" },
  { name: "Sky News", country: "UK", category: "NEWS", streamUrl: "https://linear417-gb-hls1-prd-ak.cdn.zencdn.net/d/3/1/3/3131637140001/3131637140001_1.m3u8" },
  { name: "Euronews English", country: "Europe", category: "NEWS", streamUrl: "https://rakuten-euronews-1-gb.samsung.wurl.tv/playlist.m3u8" },
  { name: "Bloomberg TV", country: "USA", category: "NEWS", streamUrl: "https://bloomberg-bloomberg-1-us.secdn.net/bloomberg-bloomberg-1-us/vod/playlist.m3u8" }
];

const $ = id => document.getElementById(id);

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

let hlsInstance = null;
let activeChannel = null;
let currentActiveId = null;
let tvChannels = [];
let idCounter = 1;

// ከ localStorage የተጨመሩ ቻናሎችን ጫን
function loadCustomChannels() {
  try {
    const saved = localStorage.getItem("jw_custom_channels");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveCustomChannels(customList) {
  localStorage.setItem("jw_custom_channels", JSON.stringify(customList));
}

function initChannels() {
  tvChannels = [];
  idCounter = 1;

  // መሰረታዊ ቻናሎች
  baseStreams.forEach(s => {
    tvChannels.push({
      id: idCounter++,
      code: s.name.substring(0, 3).toUpperCase(),
      name: s.name,
      country: s.country,
      category: s.category,
      streamUrl: s.streamUrl,
      isCustom: false
    });
  });

  // የተጨመሩ ቻናሎች
  const custom = loadCustomChannels();
  custom.forEach(c => {
    tvChannels.push({
      id: idCounter++,
      code: c.code || ("CH" + idCounter),
      name: c.name,
      country: c.country || "Custom",
      category: c.category || "NEWS",
      streamUrl: c.streamUrl,
      isCustom: true
    });
  });
}

function stopPlayer() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
  player.pause();
  player.removeAttribute("src");
  player.load();
}

function getFilteredChannels() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  return tvChannels.filter(channel => {
    const searchable = `${channel.name} ${channel.country} ${channel.code}`.toLowerCase();
    const matchesSearch = searchable.includes(term);
    const matchesCategory = category === "all" || channel.category === category;
    return matchesSearch && matchesCategory;
  });
}

function renderPlaylist() {
  const data = getFilteredChannels();
  playlist.replaceChildren();
  channelCount.textContent = `${data.length.toLocaleString()} ቻናሎች`;

  if (!data.length) {
    const empty = document.createElement("p");
    empty.className = "player-message";
    empty.textContent = "ምንም ቻናል አልተገኘም።";
    playlist.appendChild(empty);
    return;
  }

  data.forEach(channel => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "playlist-item" + (channel.id === currentActiveId ? " active" : "");

    const code = document.createElement("span");
    code.className = "playlist-code";
    code.textContent = channel.code.substring(0, 4);

    const info = document.createElement("span");
    info.className = "playlist-text";

    const name = document.createElement("strong");
    name.textContent = channel.name + (channel.isCustom ? " ⭐" : "");

    const details = document.createElement("small");
    details.textContent = `${channel.country} • ${channel.category}`;

    info.append(name, details);

    const icon = document.createElement("span");
    icon.className = "play-icon";
    icon.textContent = "▶";

    button.append(code, info, icon);
    button.addEventListener("click", () => playChannel(channel));

    playlist.appendChild(button);
  });
}

async function playChannel(channel) {
  activeChannel = channel;
  currentActiveId = channel.id;

  playingTitle.textContent = channel.name;
  playingCategory.textContent = `${channel.country} • ${channel.category}`;
  playingCode.textContent = channel.code.substring(0, 4);

  playerStatus.textContent = "● በመጫን ላይ...";
  playerMessage.textContent = "ስርጭቱ በመጫን ላይ ነው...";

  stopPlayer();
  renderPlaylist();

  // Safari / iOS native HLS
  if (player.canPlayType("application/vnd.apple.mpegurl")) {
    player.src = channel.streamUrl;
    player.load();
    try {
      await player.play();
    } catch (error) {
      playerMessage.textContent = "ለመጀመር በቪዲዮው ላይ ▶ ይጫኑ።";
    }
    return;
  }

  // HLS.js for Chrome, Firefox, Edge
  if (window.Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 30,
      maxBufferLength: 60,
      startLevel: -1,
      xhrSetup: function (xhr) {
        xhr.withCredentials = false;
      }
    });

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, async () => {
      playerStatus.textContent = "● LIVE";
      try {
        await player.play();
      } catch (error) {
        playerMessage.textContent = "ለማጫወት በቪዲዮው ላይ ▶ ይጫኑ።";
      }
    });

    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      if (!data.fatal) return;

      playerStatus.textContent = "● የስርጭት ስህተት";
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        playerMessage.textContent = "ኔትወርክ ስህተት። እንደገና ይሞክሩ ወይም ሌላ ቻናል ይምረጡ።";
        hlsInstance.startLoad();
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        playerMessage.textContent = "ሚዲያ ስህተት። እየሞከርኩ ነው...";
        hlsInstance.recoverMediaError();
      } else {
        playerMessage.textContent = "ሊንኩ ሊለወጥ ይችላል። ሌላ ቻናል ይምረጡ።";
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });

    hlsInstance.loadSource(channel.streamUrl);
    hlsInstance.attachMedia(player);
    return;
  }

  playerStatus.textContent = "● አይደገፍም";
  playerMessage.textContent = "ይህ አሳሽ HLS ማጫወትን አይደግፍም። Chrome ወይም Safari ይሞክሩ።";
}

// Player events
player.addEventListener("playing", () => {
  playerStatus.textContent = "● LIVE";
  playerMessage.textContent = "ስርጭቱ በቀጥታ እየተጫወተ ነው።";
});

player.addEventListener("waiting", () => {
  playerStatus.textContent = "● በመጠበቅ ላይ...";
  playerMessage.textContent = "ኔትወርክ እየጠበቀ ነው...";
});

player.addEventListener("error", () => {
  playerStatus.textContent = "● ስህተት";
  playerMessage.textContent = "ቪዲዮው አልተከፈተም። ኢንተርኔትዎን ይፈትሹ ወይም ሌላ ቻናል ይምረጡ።";
});

// Search & filter
searchInput.addEventListener("input", renderPlaylist);
categoryFilter.addEventListener("change", renderPlaylist);

// Retry
$("retry-btn").addEventListener("click", () => {
  if (activeChannel) {
    playChannel(activeChannel);
  } else {
    playerMessage.textContent = "መጀመሪያ ቻናል ይምረጡ።";
  }
});

// Navigation
$("settings-btn").addEventListener("click", () => {
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

$("back-btn").addEventListener("click", showTV);
$("home-btn").addEventListener("click", showTV);

// Theme toggle
$("theme-toggle").addEventListener("click", () => {
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
});

// ===== አዲስ ቻናል መጨመር =====
$("add-channel-btn").addEventListener("click", () => {
  const name = $("new-channel-name").value.trim();
  const url = $("new-channel-url").value.trim();
  const category = $("new-channel-category").value;
  const msg = $("add-channel-msg");

  if (!name || !url) {
    msg.textContent = "ስም እና m3u8 ሊንክ ያስገቡ።";
    msg.style.color = "#f87171";
    return;
  }

  if (!url.includes(".m3u8") && !url.includes("m3u")) {
    msg.textContent = "ትክክለኛ m3u8 ሊንክ ያስገቡ።";
    msg.style.color = "#f87171";
    return;
  }

  const custom = loadCustomChannels();
  const newChannel = {
    name: name,
    streamUrl: url,
    category: category,
    country: "Custom",
    code: name.substring(0, 3).toUpperCase()
  };

  custom.push(newChannel);
  saveCustomChannels(custom);

  // ድጋሚ ጫን
  initChannels();
  renderPlaylist();

  $("new-channel-name").value = "";
  $("new-channel-url").value = "";
  msg.textContent = `✅ "${name}" ተጨምሯል!`;
  msg.style.color = "#22c55e";
});

// ጀምር
initChannels();
renderPlaylist();
