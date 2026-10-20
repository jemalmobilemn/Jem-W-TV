"use strict";

// ጥሩ የሚሰሩ ቻናሎች (Al Jazeera ቤተሰብ + ሌሎች)
const baseStreams = [
  // Al Jazeera Family
  { name: "Al Jazeera English HD", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8" },
  { name: "Al Jazeera Arabic HD", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-apps-aja-fa.getaj.net/AJA/index.m3u8" },
  { name: "Al Jazeera Mubasher", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-apps-ajm-fa.getaj.net/AJM/index.m3u8" },
  { name: "Al Jazeera Mubasher 24", country: "Qatar", category: "NEWS", streamUrl: "https://live-hls-apps-ajm24-fa.getaj.net/AJM24/index.m3u8" },
  { name: "Al Jazeera Documentary", country: "Qatar", category: "ENTERTAINMENT", streamUrl: "https://live-hls-apps-ajd-fa.getaj.net/AJD/index.m3u8" },

  // Other strong public channels
  { name: "DW English HD", country: "Germany", category: "NEWS", streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { name: "DW Arabic", country: "Germany", category: "NEWS", streamUrl: "https://dwamdstream103.akamaized.net/hls/live/2015526/dwstream103/index.m3u8" },
  { name: "France 24 English", country: "France", category: "NEWS", streamUrl: "https://live.france24.com/hls/live/2037218/F24_EN_HI_HLS/master.m3u8" },
  { name: "France 24 Arabic", country: "France", category: "NEWS", streamUrl: "https://live.france24.com/hls/live/2037222/F24_AR_HI_HLS/master.m3u8" },
  { name: "CGTN English", country: "China", category: "NEWS", streamUrl: "https://news.cgtn.com/resource/live/english/cgtn-news.m3u8" },
  { name: "TRT World", country: "Turkey", category: "NEWS", streamUrl: "https://tv-trtworld.medya.trt.com.tr/master.m3u8" },
  { name: "Al Arabiya", country: "UAE", category: "NEWS", streamUrl: "https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8" },
  { name: "NASA TV Public", country: "USA", category: "ENTERTAINMENT", streamUrl: "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8" },
  { name: "Red Bull TV", country: "International", category: "SPORTS", streamUrl: "https://e7c8f7d5.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWdiX1JlZEJ1bGxUVi0xX0hMUw/playlist.m3u8" },
  { name: "FIFA+ English", country: "International", category: "SPORTS", streamUrl: "https://a62dad94.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0ZJRkFQbHVzRW5nbGlzaF9ITFM/playlist.m3u8" },
  { name: "ABC News Live", country: "USA", category: "NEWS", streamUrl: "https://abcnews-streams.akamaized.net/hls/live/2023560/abcnewshudson1/master.m3u8" }
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

// ========== M3U Parser ==========
function parseM3U(text) {
  const lines = text.split(/\r?\n/);
  const channels = [];
  let current = null;

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith("#EXTINF:")) {
      const nameMatch = line.match(/,(.+)$/);
      const name = nameMatch ? nameMatch[1].trim() : "Unknown";
      const groupMatch = line.match(/group-title="([^"]+)"/i);
      const group = groupMatch ? groupMatch[1] : "OTHER";

      let category = "ENTERTAINMENT";
      const g = group.toUpperCase();
      if (g.includes("NEWS") || g.includes("NEWS")) category = "NEWS";
      else if (g.includes("SPORT") || g.includes("SPORTS")) category = "SPORTS";

      current = {
        name: name,
        country: group || "World",
        category: category,
        streamUrl: null
      };
    } else if (line && !line.startsWith("#") && current) {
      current.streamUrl = line;
      channels.push(current);
      current = null;
    }
  }
  return channels;
}

async function loadExternalPlaylist(url) {
  try {
    playerMessage.textContent = "ውጫዊ ፕሌይሊስት በመጫን ላይ...";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load");
    const text = await res.text();
    const parsed = parseM3U(text);

    parsed.forEach(ch => {
      tvChannels.push({
        id: idCounter++,
        code: ch.name.substring(0, 3).toUpperCase(),
        name: ch.name,
        country: ch.country,
        category: ch.category,
        streamUrl: ch.streamUrl,
        isCustom: false,
        isExternal: true
      });
    });

    renderPlaylist();
    playerMessage.textContent = `${parsed.length} ተጨማሪ ቻናሎች ተጭነዋል።`;
  } catch (err) {
    playerMessage.textContent = "ፕሌይሊስቱ አልተጫነም። ሌላ ሊንክ ይሞክሩ።";
    console.error(err);
  }
}

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

  // ለፍጥነት የመጀመሪያ 300 ብቻ አሳይ (ፍለጋ ሲያደርጉ ሁሉም ይታያሉ)
  const displayLimit = 300;
  const slice = data.slice(0, displayLimit);

  slice.forEach(channel => {
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

  if (data.length > displayLimit) {
    const more = document.createElement("div");
    more.style.cssText = "text-align:center;padding:12px;color:var(--muted);font-size:13px;";
    more.textContent = `Showing first ${displayLimit} of ${data.length}. Use search to find more.`;
    playlist.appendChild(more);
  }
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
      lowLatencyMode: false,
      backBufferLength: 30,
      maxBufferLength: 60,
      startLevel: -1
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
      playerMessage.textContent = "ሊንኩ ሊለወጥ ይችላል። ሌላ ቻናል ይምረጡ።";
      hlsInstance.destroy();
      hlsInstance = null;
    });

    hlsInstance.loadSource(channel.streamUrl);
    hlsInstance.attachMedia(player);
    return;
  }

  playerStatus.textContent = "● አይደገፍም";
  playerMessage.textContent = "ይህ አሳሽ HLS አይደግፍም።";
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
  playerMessage.textContent = "ቪዲዮው አልተከፈተም።";
});

searchInput.addEventListener("input", renderPlaylist);
categoryFilter.addEventListener("change", renderPlaylist);

$("retry-btn").addEventListener("click", () => {
  if (activeChannel) playChannel(activeChannel);
  else playerMessage.textContent = "መጀመሪያ ቻናል ይምረጡ።";
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

// አዲስ ቻናል መጨመር
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

  const custom = loadCustomChannels();
  custom.push({
    name,
    streamUrl: url,
    category,
    country: "Custom",
    code: name.substring(0, 3).toUpperCase()
  });
  saveCustomChannels(custom);
  initChannels();
  renderPlaylist();

  $("new-channel-name").value = "";
  $("new-channel-url").value = "";
  msg.textContent = `✅ "${name}" ተጨምሯል!`;
  msg.style.color = "#22c55e";
});

// ========== ትልቅ ፕሌይሊስት መጫን ==========
// እነዚህን ሊንኮች መጠቀም ትችላለህ (በሺዎች ቻናል):
// https://iptv-org.github.io/iptv/index.m3u
// https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8

initChannels();
renderPlaylist();

// አውቶማቲክ ትልቅ ፕሌይሊስት መጫን (ከፈለግክ ብቻ ክፈት)
// loadExternalPlaylist("https://iptv-org.github.io/iptv/categories/news.m3u");
// loadExternalPlaylist("https://iptv-org.github.io/iptv/categories/sports.m3u");
