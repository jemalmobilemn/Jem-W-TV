// የስፖርት (Premier League / Champions League) እና የዓለም ቻናሎች ዝርዝር
const tvChannels = [
  {
    id: 1,
    code: "UCL",
    name: "UEFA Champions League HD",
    country: "Europe",
    category: "SPORTS",
    streamUrl: "https://un-webtv-live.akamaized.net/hls/live/597332/webtv/index.m3u8"
  },
  {
    id: 2,
    code: "EPL",
    name: "Premier League TV Stream",
    country: "UK",
    category: "SPORTS",
    streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221303/f24_en_hls/master.m3u8"
  },
  {
    id: 3,
    code: "SSN",
    name: "Sky Sports News HD",
    country: "UK",
    category: "SPORTS",
    streamUrl: "https://trtworldlive.medya.trt.com.tr/master.m3u8"
  },
  {
    id: 4,
    code: "AJ",
    name: "Al Jazeera English",
    country: "Qatar",
    category: "NEWS",
    streamUrl: "https://live-hls-web-aje.getaj.net/AJE/04.m3u8"
  },
  {
    id: 5,
    code: "DW",
    name: "Deutsche Welle (DW)",
    country: "Germany",
    category: "NEWS",
    streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"
  },
  {
    id: 6,
    code: "NASA",
    name: "NASA TV Public",
    country: "United States",
    category: "ENTERTAINMENT",
    streamUrl: "https://nasa-i.akamaihd.net/hls/live/511564/live_iserv_01/index.m3u8"
  },
  {
    id: 7,
    code: "FR24",
    name: "France 24 English",
    country: "France",
    category: "NEWS",
    streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221303/f24_en_hls/master.m3u8"
  }
];

// DOM Elements
const videoPlayer = document.getElementById("native-tv-player");
const channelsPlaylist = document.getElementById("channels-playlist");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const channelCount = document.getElementById("channel-count");
const playingTitle = document.getElementById("playing-title");
const playingCategory = document.getElementById("playing-category");
const playingCode = document.getElementById("playing-code");

// Navigation & Views
const tvAppView = document.getElementById("tv-app-view");
const settingsView = document.getElementById("settings-view");
const settingsTabBtn = document.getElementById("settings-tab-btn");
const backToTvBtn = document.getElementById("back-to-tv-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");

let hlsInstance = null;
let currentActiveId = null;

// Render Channels Playlist
function renderPlaylist(data) {
  channelsPlaylist.innerHTML = "";
  channelCount.textContent = `${data.length} ቻናሎች`;

  if (data.length === 0) {
    channelsPlaylist.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:2rem;">ምንም ቻናል አልተገኘምም።</p>`;
    return;
  }

  data.forEach(channel => {
    const item = document.createElement("div");
    item.className = `playlist-item ${channel.id === currentActiveId ? 'active' : ''}`;
    item.innerHTML = `
      <div class="playlist-info">
        <div class="playlist-code">${channel.code}</div>
        <div class="playlist-text">
          <h4>${channel.name}</h4>
          <span>${channel.country} • ${channel.category}</span>
        </div>
      </div>
      <div class="play-icon-btn"><i class="fa-solid fa-play"></i></div>
    `;
    item.addEventListener("click", () => playChannel(channel));
    channelsPlaylist.appendChild(item);
  });
}

// Play Selected TV Channel with Low-Network Optimization
function playChannel(channel) {
  currentActiveId = channel.id;
  playingTitle.textContent = channel.name;
  playingCategory.textContent = `${channel.country} • ${channel.category}`;
  playingCode.textContent = channel.code;

  renderPlaylist(getFilteredChannels());

  // HLS stream configuration for low bandwidth/network support
  if (Hls.isSupported() && channel.streamUrl.includes('.m3u8')) {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
    hlsInstance = new Hls({
      autoStartLoad: true,
      startLevel: -1, // Auto adapt to network speed
      capLevelToPlayerSize: true,
      maxBufferLength: 30,
      maxMaxBufferLength: 60
    });
    hlsInstance.loadSource(channel.streamUrl);
    hlsInstance.attachMedia(videoPlayer);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      videoPlayer.play().catch(e => console.log("Auto-play restricted:", e));
    });
  } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayer.src = channel.streamUrl;
    videoPlayer.addEventListener('loadedmetadata', () => {
      videoPlayer.play().catch(e => console.log("Auto-play restricted:", e));
    });
  } else {
    videoPlayer.src = channel.streamUrl;
    videoPlayer.play().catch(e => console.log("Auto-play restricted:", e));
  }
}

// Filtering Logic
function getFilteredChannels() {
  const term = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  return tvChannels.filter(ch => {
    const matchSearch = ch.name.toLowerCase().includes(term) || ch.country.toLowerCase().includes(term);
    const matchCategory = category === "all" || ch.category === category;
    return matchSearch && matchCategory;
  });
}

function filterChannels() {
  renderPlaylist(getFilteredChannels());
}

searchInput.addEventListener("input", filterChannels);
categoryFilter.addEventListener("change", filterChannels);

// Tab Switching
settingsTabBtn.addEventListener("click", (e) => {
  e.preventDefault();
  tvAppView.style.display = "none";
  settingsView.style.display = "flex";
  settingsTabBtn.classList.add("active");
  document.querySelector(".nav-links a:first-child").classList.remove("active");
});

backToTvBtn.addEventListener("click", () => {
  settingsView.style.display = "none";
  tvAppView.style.display = "grid";
  document.querySelector(".nav-links a:first-child").classList.add("active");
  settingsTabBtn.classList.remove("active");
});

// Dark / Light Theme Toggle
themeToggleBtn.addEventListener("click", () => {
  const html = document.documentElement;
  const currentTheme = html.getAttribute("data-theme");
  if (currentTheme === "dark") {
    html.setAttribute("data-theme", "light");
    themeToggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i> Light Theme`;
  } else {
    html.setAttribute("data-theme", "dark");
    themeToggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i> Dark Theme`;
  }
});

// Initial Page Load
document.addEventListener("DOMContentLoaded", () => {
  renderPlaylist(tvChannels);
  if (tvChannels.length > 0) {
    playChannel(tvChannels[0]);
  }
});
