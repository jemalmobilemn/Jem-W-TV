// የተረጋጉ እና ወዲያውኑ የሚከፈቱ የቀጥታ ስርጭት ሊንኮች
const tvChannels = [
  {
    id: 1,
    code: "AJE",
    name: "Al Jazeera English HD",
    country: "Qatar",
    category: "NEWS",
    streamUrl: "https://live-hls-web-aje.getaj.net/AJE/04.m3u8"
  },
  {
    id: 2,
    code: "DW",
    name: "Deutsche Welle TV",
    country: "Germany",
    category: "NEWS",
    streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"
  },
  {
    id: 3,
    code: "NASA",
    name: "NASA TV HD",
    country: "USA",
    category: "ENTERTAINMENT",
    streamUrl: "https://nasa-i.akamaihd.net/hls/live/511564/live_iserv_01/index.m3u8"
  },
  {
    id: 4,
    code: "F24",
    name: "France 24 English",
    country: "France",
    category: "NEWS",
    streamUrl: "https://f24hls-i.akamaihd.net/hls/live/221303/f24_en_hls/master.m3u8"
  },
  {
    id: 5,
    code: "TRT",
    name: "TRT World",
    country: "Turkey",
    category: "NEWS",
    streamUrl: "https://trtworldlive.medya.trt.com.tr/master.m3u8"
  },
  {
    id: 6,
    code: "UN",
    name: "UN Web TV",
    country: "Global",
    category: "NEWS",
    streamUrl: "https://un-webtv-live.akamaized.net/hls/live/597332/webtv/index.m3u8"
  },
  {
    id: 7,
    code: "SP1",
    name: "Champions League Stream 1",
    country: "Europe",
    category: "SPORTS",
    streamUrl: "https://un-webtv-live.akamaized.net/hls/live/597332/webtv/index.m3u8"
  },
  {
    id: 8,
    code: "SP2",
    name: "Premier League Live TV",
    country: "UK",
    category: "SPORTS",
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

const tvAppView = document.getElementById("tv-app-view");
const settingsView = document.getElementById("settings-view");
const settingsTabBtn = document.getElementById("settings-tab-btn");
const backToTvBtn = document.getElementById("back-to-tv-btn");
const themeToggleBtn = document.getElementById("theme-toggle-btn");

let hlsInstance = null;
let currentActiveId = null;

// Render Playlist
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

// Instant Play Channel Function
function playChannel(channel) {
  currentActiveId = channel.id;
  playingTitle.textContent = channel.name;
  playingCategory.textContent = `${channel.country} • ${channel.category}`;
  playingCode.textContent = channel.code;

  renderPlaylist(getFilteredChannels());

  if (Hls.isSupported()) {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
    hlsInstance = new Hls({
      liveSyncDurationCount: 3,
      lowLatencyMode: true,
      backBufferLength: 30
    });
    hlsInstance.loadSource(channel.streamUrl);
    hlsInstance.attachMedia(videoPlayer);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      videoPlayer.play().catch(err => console.log("Playback error:", err));
    });
  } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayer.src = channel.streamUrl;
    videoPlayer.addEventListener('loadedmetadata', () => {
      videoPlayer.play().catch(err => console.log("Playback error:", err));
    });
  }
}

// Filtering
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

// Navigation
settingsTabBtn.addEventListener("click", (e) => {
  e.preventDefault();
  tvAppView.style.display = "none";
  settingsView.style.display = "flex";
  settingsTabBtn.classList.add("active");
});

backToTvBtn.addEventListener("click", () => {
  settingsView.style.display = "none";
  tvAppView.style.display = "grid";
  settingsTabBtn.classList.remove("active");
});

// Theme Toggle
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

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  renderPlaylist(tvChannels);
  if (tvChannels.length > 0) {
    playChannel(tvChannels[0]);
  }
});
