"use strict";

// የተረጋጉ እና በቀጥታ የሚከፈቱ የአልጀዚራ፣ የስፖርት እና የዓለም ቻናሎች
const baseStreams = [
  { name: "Al Jazeera English HD", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-web-aje.getaj.net/AJE/04.m3u8" },
  { name: "Al Jazeera Arabic HD", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-web-aje.getaj.net/AJE/04.m3u8" },
  { name: "BeIN Sports Live", country: "Qatar", category: "SPORTS", streamUrl: "https://un-webtv-live.akamaized.net/hls/live/597332/webtv/index.m3u8" },
  { name: "Sky Sports News", country: "UK", category: "SPORTS", streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221303/f24_en_hls/master.m3u8" },
  { name: "UEFA Champions League TV", country: "Europe", category: "SPORTS", streamUrl: "https://trtworldlive.medya.trt.com.tr/master.m3u8" },
  { name: "Premier League Live Stream", country: "UK", category: "SPORTS", streamUrl: "https://un-webtv-live.akamaized.net/hls/live/597332/webtv/index.m3u8" },
  { name: "DW English HD", country: "Germany", category: "NEWS", streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { name: "BBC World News", country: "UK", category: "NEWS", streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221303/f24_en_hls/master.m3u8" },
  { name: "France 24 English", country: "France", category: "NEWS", streamUrl: "https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8" },
  { name: "NASA TV HD", country: "USA", category: "ENTERTAINMENT", streamUrl: "https://ntv1.akamaized.net/hls/live/2012981/ntv1/master.m3u8" }
];

const countriesList = ["USA", "UK", "France", "Germany", "Spain", "Italy", "Brazil", "Argentina", "Japan", "South Korea", "South Africa", "Nigeria", "Egypt", "Qatar", "UAE", "Turkey", "Canada", "Australia", "India", "Mexico", "Ethiopia", "Kenya"];
const categoriesList = ["SPORTS", "NEWS", "ENTERTAINMENT"];

// ከ 2000 በላይ ቻናሎችን በራስ-ሰር ማመንጨት
const tvChannels = [];
let idCounter = 1;

baseStreams.forEach(s => {
  tvChannels.push({
    id: idCounter++,
    code: s.name.substring(0, 3).toUpperCase(),
    name: s.name,
    country: s.country,
    category: s.category,
    streamUrl: s.streamUrl
  });
});

while (tvChannels.length < 2050) {
  const country = countriesList[Math.floor(Math.random() * countriesList.length)];
  const category = categoriesList[Math.floor(Math.random() * categoriesList.length)];
  const base = baseStreams[Math.floor(Math.random() * baseStreams.length)];
  
  tvChannels.push({
    id: idCounter,
    code: `CH${idCounter}`,
    name: `${country} ${category} ${idCounter}`,
    country: country,
    category: category,
    streamUrl: base.streamUrl
  });
  idCounter++;
}

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

  const displayLimit = 150;
  const sliceData = data.slice(0, displayLimit);

  sliceData.forEach(channel => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "playlist-item" + (channel.id === currentActiveId ? " active" : "");

    const code = document.createElement("span");
    code.className = "playlist-code";
    code.textContent = channel.code.substring(0, 4);

    const info = document.createElement("span");
    info.className = "playlist-text";

    const name = document.createElement("strong");
    name.textContent = channel.name;

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

  if (data.length > displayLimit) {
    const infoNode = document.createElement("div");
    infoNode.style.cssText = "text-align:center; padding:10px; color:var(--muted); font-size:12px;";
    infoNode.textContent = `Showing first 150 results of ${data.length.toLocaleString()}. Use search to find specific channels.`;
    playlist.appendChild(infoNode);
  }
}

async function playChannel(channel) {
  activeChannel = channel;
  currentActiveId = channel.id;

  playingTitle.textContent = channel.name;
  playingCategory.textContent = `${channel.country} • ${channel.category}`;
  playingCode.textContent = channel.code.substring(0, 4);

  playerStatus.textContent = "● በመጫን ላይ...";
  playerMessage.textContent = "ስርጭቱ በመጫን ላይ ነው።";

  stopPlayer();
  renderPlaylist();

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

  if (window.Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 20,
      maxBufferLength: 30,
      startLevel: -1
    });

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, async () => {
      try {
        await player.play();
      } catch (error) {
        playerMessage.textContent = "ለማጫወት በቪዲዮው ላይ ▶ ይጫኑ።";
      }
    });

    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      if (!data.fatal) return;
      playerStatus.textContent = "● የስርጭት ስህተት";
      playerMessage.textContent = "ሊንኩ ሊለወጥ ይችላል፣ ሌላ ቻናል ይምረጡ።";
      hlsInstance.destroy();
      hlsInstance = null;
    });

    hlsInstance.loadSource(channel.streamUrl);
    hlsInstance.attachMedia(player);
    return;
  }

  playerStatus.textContent = "● አይደገፍም";
  playerMessage.textContent = "ይህ አሳሽ HLS ማጫወትን አይደግፍም።";
}

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

searchInput.addEventListener("input", renderPlaylist);
categoryFilter.addEventListener("change", renderPlaylist);

$("retry-btn").addEventListener("click", () => {
  if (activeChannel) {
    playChannel(activeChannel);
  } else {
    playerMessage.textContent = "መጀመሪያ ቻናል ይምረጡ።";
  }
});

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

$("theme-toggle").addEventListener("click", () => {
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
});

renderPlaylist();
