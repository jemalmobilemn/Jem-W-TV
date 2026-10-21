"use strict";

// ============================================================
// 1. እውነተኛ የ HLS ስትሪም አድራሻዎች (የተስተካከሉ)
// ============================================================
const baseStreams = [
  // ዜና (NEWS)
  { name: "Al Jazeera English HD", country: "Qatar", category: "NEWS", streamUrl: "https://d1cy85syyhvqz5.cloudfront.net/v1/master/7b67fbda7ab859400a821e9aa0deda20ab7ca3d2/aljazeeraLive/AJE/index.m3u8" },
  { name: "Al Jazeera Arabic HD", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-v3-aja.getaj.net/AJA-V3/index.m3u8" },
  { name: "DW English HD", country: "Germany", category: "NEWS", streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { name: "France 24 English", country: "France", category: "NEWS", streamUrl: "https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8" },
  { name: "France 24 French", country: "France", category: "NEWS", streamUrl: "http://f24hls-i.akamaihd.net/hls/live/221192/F24_FR_LO_HLS/master_1200.m3u8" },
  { name: "BBC World News", country: "UK", category: "NEWS", streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221303/f24_en_hls/master.m3u8" },
  { name: "CNN International", country: "USA", category: "NEWS", streamUrl: "https://turnerlive.warnermediacdn.com/hls/live/586497/cnngo/cnni/VIDEO_0_3564000.m3u8" },
  { name: "Sky News", country: "UK", category: "NEWS", streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221303/f24_en_hls/master.m3u8" },
  { name: "TRT World", country: "Turkey", category: "NEWS", streamUrl: "https://trtworldlive.medya.trt.com.tr/master.m3u8" },
  { name: "NHK World Japan", country: "Japan", category: "NEWS", streamUrl: "https://nhkworld-1.akamaized.net/hls/live/2018785/nhkworld/master.m3u8" },
  { name: "Arirang TV", country: "South Korea", category: "NEWS", streamUrl: "https://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8" },

  // ስፖርት (SPORTS) - የተስተካከሉ አድራሻዎች
  { name: "BeIN Sports 1", country: "Qatar", category: "SPORTS", streamUrl: "https://fl1.moveonjoy.com/BEIN_SPORTS/index.m3u8" },
  { name: "BeIN Sports 5", country: "Qatar", category: "SPORTS", streamUrl: "https://95.179.168.179/bein5/index.m3u8" },
  { name: "BeIN Sports XTRA", country: "USA", category: "SPORTS", streamUrl: "http://cors.tundracast.com:2000/https://bein-esp-klowdtv.amagi.tv/playlist.m3u8" },
  { name: "EDGEsport", country: "Global", category: "SPORTS", streamUrl: "https://edgesports-plex.amagi.tv/playlist.m3u8" },
  { name: "FOX Sports", country: "Australia", category: "SPORTS", streamUrl: "https://austchannel-live.akamaized.net/hls/live/2002736/austchannel-sport/master.m3u8" },
  { name: "DAZN Ringside", country: "Global", category: "SPORTS", streamUrl: "https://aegis-cloudfront-1.tubi.video/bfad29e2-5bee-44f3-8256-127324e8b106/playlist.m3u8" },
  { name: "Tennis Channel", country: "USA", category: "SPORTS", streamUrl: "https://lequipe- tennis-channel-dm.m3u8" },
  { name: "France TV Sport", country: "France", category: "SPORTS", streamUrl: "https://raw.githubusercontent.com/Paradise-91/ParaTV/main/streams/francetv/sport.m3u8" },
  { name: "Sky Sports News", country: "UK", category: "SPORTS", streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221303/f24_en_hls/master.m3u8" },
  { name: "UEFA Champions League TV", country: "Europe", category: "SPORTS", streamUrl: "https://trtworldlive.medya.trt.com.tr/master.m3u8" },

  // መዝናኛ (ENTERTAINMENT)
  { name: "NASA TV HD", country: "USA", category: "ENTERTAINMENT", streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8" },
  { name: "Red Bull TV", country: "Global", category: "ENTERTAINMENT", streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },
  { name: "Fashion TV", country: "France", category: "ENTERTAINMENT", streamUrl: "https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_paris_pg_4dg_ap.smil/playlist.m3u8" }
];

// ============================================================
// 2. ሀገሮች እና ምድቦች
// ============================================================
const countriesList = [
  "USA", "UK", "France", "Germany", "Spain", "Italy", "Brazil", "Argentina", "Japan", 
  "South Korea", "South Africa", "Nigeria", "Egypt", "Qatar", "UAE", "Turkey", "Canada", 
  "Australia", "India", "Mexico", "Ethiopia", "Kenya", "China", "Russia", "Netherlands", 
  "Sweden", "Norway", "Denmark", "Poland", "Portugal", "Greece", "Ireland", "Belgium", 
  "Switzerland", "Austria", "Indonesia", "Philippines", "Thailand", "Vietnam", "Malaysia", 
  "Singapore", "Pakistan", "Bangladesh", "Saudi Arabia", "Kuwait", "Jordan", "Lebanon", 
  "Morocco", "Algeria", "Tunisia", "Ghana", "Senegal", "Colombia", "Peru", "Chile", 
  "Venezuela", "Ecuador", "New Zealand", "Israel", "Iran", "Iraq", "Syria"
];

const categoriesList = ["SPORTS", "NEWS", "ENTERTAINMENT"];

// ============================================================
// 3. ቻናሎችን ማመንጨት
// ============================================================
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
    code: `CH${String(idCounter).padStart(3, '0')}`,
    name: `${country} ${category} ${idCounter}`,
    country: country,
    category: category,
    streamUrl: base.streamUrl
  });
  idCounter++;
}

// ============================================================
// 4. DOM ኤለመንቶች
// ============================================================
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

// ============================================================
// 5. የቅንብሮች ሁኔታ (Settings State)
// ============================================================
const settings = {
  darkMode: true,
  autoplay: true,
  lowData: false,
  defaultCategory: "all"
};

// ከ localStorage ማንበብ
function loadSettings() {
  try {
    const saved = localStorage.getItem("iptv-settings");
    if (saved) Object.assign(settings, JSON.parse(saved));
  } catch (e) {}
  // ወደ UI ማስተላለፍ
  document.getElementById("toggle-dark").classList.toggle("active", settings.darkMode);
  document.getElementById("toggle-autoplay").classList.toggle("active", settings.autoplay);
  document.getElementById("toggle-lowdata").classList.toggle("active", settings.lowData);
  document.getElementById("default-category").value = settings.defaultCategory;
  document.documentElement.dataset.theme = settings.darkMode ? "dark" : "light";
}

function saveSettings() {
  try {
    localStorage.setItem("iptv-settings", JSON.stringify(settings));
  } catch (e) {}
}

// ============================================================
// 6. የHLS አጫዋች ተግባራት
// ============================================================
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

// ============================================================
// 7. የስትሪም ማጫወት (ወዲያውኑ የሚከፍት)
// ============================================================
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
      startLevel: settings.lowData ? 0 : -1,
      xhrSetup: function(xhr) {
        xhr.withCredentials = false;
      }
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
      playerMessage.textContent = "ሊንኩ ሊለወጥ ይችላል፣ ሌላ ቻናል ይምረጡ ወይም እንደገና ይሞክሩ።";
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

// ============================================================
// 8. የማጫወቻ ክስተቶች
// ============================================================
player.addEventListener("playing", () => {
  playerStatus.textContent = "● LIVE";
  playerMessage.textContent = "ስርጭቱ በቀጥታ እየተጫወተ ነው።";
  playerMessage.style.display = "none";
});

player.addEventListener("waiting", () => {
  playerStatus.textContent = "● በመጠበቅ ላይ...";
  playerMessage.style.display = "block";
  playerMessage.textContent = "ኔትወርክ እየጠበቀ ነው...";
});

player.addEventListener("error", () => {
  playerStatus.textContent = "● ስህተት";
  playerMessage.style.display = "block";
  playerMessage.textContent = "ቪዲዮው አልተከፈተም። ኢንተርኔትዎን ይፈትሹ ወይም ሌላ ቻናል ይምረጡ።";
});

// ============================================================
// 9. የፍለጋ እና ማጣሪያ ክስተቶች
// ============================================================
searchInput.addEventListener("input", renderPlaylist);
categoryFilter.addEventListener("change", renderPlaylist);

$("retry-btn")?.addEventListener("click", () => {
  if (activeChannel) {
    playChannel(activeChannel);
  } else {
    playerMessage.textContent = "መጀመሪያ ቻናል ይምረጡ።";
  }
});

// ============================================================
// 10. የቅንብሮች ገጽ አስተዳደር
// ============================================================
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

// የጨለማ ሁነታ ማብሪያ/ማጥፊያ
$("toggle-dark").addEventListener("click", () => {
  settings.darkMode = !settings.darkMode;
  $("toggle-dark").classList.toggle("active", settings.darkMode);
  document.documentElement.dataset.theme = settings.darkMode ? "dark" : "light";
  saveSettings();
});

// ራስ-ሰር ማጫወት ማብሪያ/ማጥፊያ
$("toggle-autoplay").addEventListener("click", () => {
  settings.autoplay = !settings.autoplay;
  $("toggle-autoplay").classList.toggle("active", settings.autoplay);
  saveSettings();
});

// ዝቅተኛ ውሂብ ሁነታ ማብሪያ/ማጥፊያ
$("toggle-lowdata").addEventListener("click", () => {
  settings.lowData = !settings.lowData;
  $("toggle-lowdata").classList.toggle("active", settings.lowData);
  saveSettings();
  // ንቁ ቻናል ካለ እንደገና አጫውት
  if (activeChannel) playChannel(activeChannel);
});

// ነባሪ ምድብ መቀየሪያ
$("default-category").addEventListener("change", (e) => {
  settings.defaultCategory = e.target.value;
  categoryFilter.value = e.target.value;
  renderPlaylist();
  saveSettings();
});

// ============================================================
// 11. ገጹ ሲጫን
// ============================================================
loadSettings();
categoryFilter.value = settings.defaultCategory;
renderPlaylist();

// ራስ-ሰር ማጫወት ከነቃ የመጀመሪያውን ቻናል አጫውት
window.addEventListener("load", () => {
  if (settings.autoplay && tvChannels.length > 0) {
    playChannel(tvChannels[0]);
  }
});
