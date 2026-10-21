"use strict";

// ============================================================
// 1. የትርጉም መረጃ (i18n)
// ============================================================
const i18n = {
  am: {
    appTitle: "📺 የዓለም ቻናሎች",
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
    settingsLowData: "ዝቅተኛ ውሂብ ሁነታ (Low Data)",
    settingsLowDataDesc: "የቪዲዮ ጥራትን በመቀነስ ዳታ ይቆጥቡ",
    settingsGeneral: "🌍 አጠቃላይ",
    settingsDefaultCategory: "ነባሪ ምድብ",
    settingsDefaultCategoryDesc: "ሲከፈት የሚታየው የቻናል ምድብ",
    settingsAll: "ሁሉም",
    backBtn: "⬅️ ወደ ቻናሎች ተመለስ",
    liveStream: "የቀጥታ ስርጭት",
  },
  en: {
    appTitle: "📺 World Channels",
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
    settingsGeneral: "🌍 General",
    settingsDefaultCategory: "Default Category",
    settingsDefaultCategoryDesc: "The channel category shown on load",
    settingsAll: "All",
    backBtn: "⬅️ Back to Channels",
    liveStream: "Live Stream",
  }
};

// ============================================================
// 2. የተረጋገጡ የ HLS ስትሪም አድራሻዎች
// ============================================================
const baseStreams = [
  // ==================== ዜና (NEWS) ====================
  {
    name: "Al Jazeera English HD",
    country: "Qatar",
    category: "NEWS",
    streamUrl: "https://live-hls-web-aje.getaj.net/AJE/index.m3u8",
    altUrls: [
      "https://d1cy85syyhvqz5.cloudfront.net/v1/master/7b67fbda7ab859400a821e9aa0deda20ab7ca3d2/aljazeeraLive/AJE/index.m3u8"
    ]
  },
  { name: "DW English HD", country: "Germany", category: "NEWS", streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { name: "France 24 English", country: "France", category: "NEWS", streamUrl: "https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8" },
  { name: "BBC World News", country: "UK", category: "NEWS", streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221303/f24_en_hls/master.m3u8" },
  { name: "TRT World", country: "Turkey", category: "NEWS", streamUrl: "https://trtworldlive.medya.trt.com.tr/master.m3u8" },
  { name: "NHK World Japan", country: "Japan", category: "NEWS", streamUrl: "https://nhkworld-1.akamaized.net/hls/live/2018785/nhkworld/master.m3u8" },
  { name: "Arirang TV", country: "South Korea", category: "NEWS", streamUrl: "https://amdlive.ctnd.com.edgesuite.net/arirang_1ch/smil:arirang_1ch.smil/playlist.m3u8" },

  // ==================== ስፖርት (SPORTS) ====================
  { name: "beIN Sports 5 HD", country: "Qatar", category: "SPORTS", streamUrl: "https://95.179.168.179/bein5/index.m3u8" },
  { name: "beIN Sports XTRA", country: "USA", category: "SPORTS", streamUrl: "http://cors.tundracast.com:2000/https://bein-esp-klowdtv.amagi.tv/playlist.m3u8" },
  { name: "Sky Sports Premium", country: "UK", category: "SPORTS", streamUrl: "http://178.33.239.54:8080/509/index.m3u8" },
  { name: "Sky Sports Football", country: "UK", category: "SPORTS", streamUrl: "http://alienstreams.fi:8080/live/asdfasdf/asdfasdf/271197.m3u8" },
  { name: "Sky Sports Premier League", country: "UK", category: "SPORTS", streamUrl: "http://145.239.5.177/566a/index.m3u8" },
  { name: "DAZN Ringside", country: "Global", category: "SPORTS", streamUrl: "https://aegis-cloudfront-1.tubi.video/bfad29e2-5bee-44f3-8256-127324e8b106/playlist.m3u8" },
  { name: "EDGEsport", country: "Global", category: "SPORTS", streamUrl: "https://edgesports-plex.amagi.tv/playlist.m3u8" },
  { name: "FOX Sports Australia", country: "Australia", category: "SPORTS", streamUrl: "https://austchannel-live.akamaized.net/hls/live/2002736/austchannel-sport/master.m3u8" },

  // ==================== የኢትዮጵያ ቻናሎች ====================
  { name: "Addis TV", country: "Ethiopia", category: "ENTERTAINMENT", streamUrl: "https://live.ebstv.tv/addis/addis.m3u8" },
  { name: "EBS HD", country: "Ethiopia", category: "ENTERTAINMENT", streamUrl: "https://live.ebstv.tv/ebs/ebs.m3u8" },
  { name: "Mereja TV", country: "Ethiopia", category: "NEWS", streamUrl: "https://live.ebstv.tv/mereja/mereja.m3u8" },
  { name: "Nesiha TV", country: "Ethiopia", category: "ENTERTAINMENT", streamUrl: "https://live.ebstv.tv/nesiha/nesiha.m3u8" },
  { name: "EBC 1", country: "Ethiopia", category: "NEWS", streamUrl: "https://iptv-org.github.io/iptv/countries/et.m3u" },
  { name: "Fana TV", country: "Ethiopia", category: "ENTERTAINMENT", streamUrl: "https://iptv-org.github.io/iptv/countries/et.m3u" },

  // ==================== መዝናኛ (ENTERTAINMENT) ====================
  { name: "NASA TV HD", country: "USA", category: "ENTERTAINMENT", streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8" },
  { name: "Red Bull TV", country: "Global", category: "ENTERTAINMENT", streamUrl: "https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8" },
  { name: "Fashion TV", country: "France", category: "ENTERTAINMENT", streamUrl: "https://fash1043.cloudycdn.services/slive/_definst_/ftv_ftv_paris_pg_4dg_ap.smil/playlist.m3u8" }
];

// ============================================================
// 3. ሀገሮች እና ምድቦች
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
// 4. ቻናሎችን ማመንጨት
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
    streamUrl: s.streamUrl,
    altUrls: s.altUrls || []
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
    streamUrl: base.streamUrl,
    altUrls: []
  });
  idCounter++;
}

// ============================================================
// 5. DOM ኤለመንቶች
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
// 6. የቅንብሮች ሁኔታ
// ============================================================
const settings = {
  darkMode: true,
  autoplay: true,
  lowData: false,
  defaultCategory: "all",
  language: "am"
};

function t(key) {
  return (i18n[settings.language] && i18n[settings.language][key]) || i18n.en[key] || key;
}

function loadSettings() {
  try {
    const saved = localStorage.getItem("iptv-settings");
    if (saved) Object.assign(settings, JSON.parse(saved));
  } catch (e) {}
  $("toggle-dark").classList.toggle("active", settings.darkMode);
  $("toggle-autoplay").classList.toggle("active", settings.autoplay);
  $("toggle-lowdata").classList.toggle("active", settings.lowData);
  $("default-category").value = settings.defaultCategory;
  $("language-select").value = settings.language;
  document.documentElement.dataset.theme = settings.darkMode ? "dark" : "light";
  document.documentElement.lang = settings.language;
}

function saveSettings() {
  try {
    localStorage.setItem("iptv-settings", JSON.stringify(settings));
  } catch (e) {}
}

// ============================================================
// 7. የቋንቋ ትግበራ
// ============================================================
function applyLanguage() {
  // data-i18n ያላቸውን ኤለመንቶች ትርጉም መፈጸም
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });

  // data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    el.placeholder = t(key);
  });

  // የገጽ አርዕስት
  document.title = t("appTitle").replace("📺 ", "");

  // የቻናል ቆጠራ (dynamic)
  updateChannelCount();

  // የማጫወቻ ሁኔታ (dynamic)
  if (!activeChannel) {
    playingTitle.textContent = t("defaultChannelTitle");
    playerMessage.textContent = t("msgChooseChannel");
    playerStatus.textContent = t("ርstatusReady");
  } else {
    // ቻናልጉ ካለ የስቴቱን ትርጉም ብቻ እናድስ
    updatePlayerStatus();
  }

  // ንቁ ያልሆነ መልእክት ካለ ትሙን እናድስ
  if (playerMessage.dataset.msgKey) {
    playerMessage.textContent = t(playerMessage.dataset.msgKey);
  }

  // ፕሌይሊስቱን እንደገና አሳይ
  renderPlaylist();
}

function updateChannelCount() {
  const count = getFilteredChannels().length.toLocaleString();
  channelCount.textContent = `${count} ${t("channelsCount")}`;
}

function updatePlayerStatus() {
  // የአሁኑን የስቴት ቁልፍ ከ data attribute አንብበን እንተርጉም
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
// 8. የHLS አጫዋች ተግባራት
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
  channelCount.textContent = `${data.length.toLocaleString()} ${t("channelsCount")}`;

  if (!data.length) {
    const empty = document.createElement("p");
    empty.className = "player-message";
    empty.textContent = t("msgNoResults");
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
    infoNode.textContent = `${t("showingFirst")} ${data.length.toLocaleString()} ${t("showingRest")}`;
    playlist.appendChild(infoNode);
  }
}

// ============================================================
// 9. የስትሪም ማጫወት
// ============================================================
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

  const urlsToTry = [channel.streamUrl, ...(channel.altUrls || [])];

  for (let i = 0; i < urlsToTry.length; i++) {
    const url = urlsToTry[i];
    try {
      await tryPlayUrl(url);
      return;
    } catch (err) {
      console.warn(`Attempt ${i + 1} failed: ${url}`, err);
      if (i === urlsToTry.length - 1) {
        setStatus("statusError");
        setMessage("msgAllFailed");
      }
    }
  }
}

function tryPlayUrl(url) {
  return new Promise((resolve, reject) => {
    if (player.canPlayType("application/vnd.apple.mpegurl")) {
      player.src = url;
      player.load();
      player.play().then(resolve).catch(reject);
      return;
    }

    if (window.Hls && Hls.isSupported()) {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }

      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 20,
        maxBufferLength: 30,
        startLevel: settings.lowData ? 0 : -1,
        xhrSetup: function(xhr) {
          xhr.withCredentials = false;
        },
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 1,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 1
      });

      let settled = false;
      const timeout = setTimeout(() => {
        if (!settled) {
          settled = true;
          reject(new Error("Timeout"));
        }
      }, 15000);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        player.play().then(() => {
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            resolve();
          }
        }).catch(err => {
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
            reject(err);
          }
        });
      });

      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal && !settled) {
          settled = true;
          clearTimeout(timeout);
          hlsInstance.destroy();
          hlsInstance = null;
          reject(new Error(data.details));
        }
      });

      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(player);
      return;
    }

    reject(new Error("HLS not supported"));
  });
}

// ============================================================
// 10. የማጫወቻ ክስተቶች
// ============================================================
player.addEventListener("playing", () => {
  setStatus("statusLive");
  setMessage("msgLive");
  playerMessage.style.display = "none";
});

player.addEventListener("waiting", () => {
  setStatus("statusWaiting");
  setMessage("msgWaiting");
});

player.addEventListener("error", () => {
  setStatus("statusError");
  setMessage("msgVideoError");
});

// ============================================================
// 11. የፍለጋ እና ማጣሪያ ክስተቶች
// ============================================================
searchInput.addEventListener("input", renderPlaylist);
categoryFilter.addEventListener("change", renderPlaylist);

$("retry-btn")?.addEventListener("click", () => {
  if (activeChannel) {
    playChannel(activeChannel);
  } else {
    setMessage("msgSelectFirst");
  }
});

// ============================================================
// 12. የቅንብሮች ገጽ አስተዳደር
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

$("toggle-dark").addEventListener("click", () => {
  settings.darkMode = !settings.darkMode;
  $("toggle-dark").classList.toggle("active", settings.darkMode);
  document.documentElement.dataset.theme = settings.darkMode ? "dark" : "light";
  saveSettings();
});

$("toggle-autoplay").addEventListener("click", () => {
  settings.autoplay = !settings.autoplay;
  $("toggle-autoplay").classList.toggle("active", settings.autoplay);
  saveSettings();
});

$("toggle-lowdata").addEventListener("click", () => {
  settings.lowData = !settings.lowData;
  $("toggle-lowdata").classList.toggle("active", settings.lowData);
  saveSettings();
  if (activeChannel) playChannel(activeChannel);
});

$("default-category").addEventListener("change", (e) => {
  settings.defaultCategory = e.target.value;
  categoryFilter.value = e.target.value;
  renderPlaylist();
  saveSettings();
});

// የቋንቋ መቀየሪያ
$("language-select").addEventListener("change", (e) => {
  settings.language = e.target.value;
  document.documentElement.lang = settings.language;
  applyLanguage();
  saveSettings();
});

// ============================================================
// 13. ገጹ ሲጫን
// ============================================================
loadSettings();
categoryFilter.value = settings.defaultCategory;
applyLanguage();

window.addEventListener("load", () => {
  if (settings.autoplay && tvChannels.length > 0) {
    playChannel(tvChannels[0]);
  }
});
