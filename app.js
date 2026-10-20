// ትክክለኛ የቴሌቪዥን ቻናሎች ዝርዝር (በዓለም አቀፍ ደረጃ በነፃ ከሚለቀቁ IPTV / HLS Streams የተወሰዱ)
const tvChannels = [
  {
    id: 1,
    code: "AJ",
    name: "Al Jazeera English",
    country: "Qatar",
    category: "NEWS",
    streamUrl: "https://live-hls-web-aje.getaj.net/AJE/04.m3u8"
  },
  {
    id: 2,
    code: "DW",
    name: "Deutsche Welle (DW)",
    country: "Germany",
    category: "NEWS",
    streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"
  },
  {
    id: 3,
    code: "NASA",
    name: "NASA TV Public",
    country: "United States",
    category: "SCIENCE",
    streamUrl: "https://nasa-i.akamaihd.net/hls/live/511564/live_iserv_01/index.m3u8"
  },
  {
    id: 4,
    code: "FR24",
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
    country: "United States",
    category: "DOCUMENTARY",
    streamUrl: "https://un-webtv-live.akamaized.net/hls/live/597332/webtv/index.m3u8"
  }
];

// DOM Elements
const videoPlayer = document.getElementById("native-tv-player");
const channelsPlaylist = document.getElementById("channels-playlist");
const searchInput = document.getElementById("search-input");
const countryFilter = document.getElementById("country-filter");
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

// Initialize Filters
function initFilters() {
  const countries = [...new Set(tvChannels.map(c => c.country))];
  countries.forEach(country => {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    countryFilter.appendChild(opt);
  });
}

// Render Channels Playlist
function renderPlaylist(data) {
  channelsPlaylist.innerHTML = "";
  channelCount.textContent = `${data.length} Channels`;

  if (data.length === 0) {
    channelsPlaylist.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:2rem;">No channels found.</p>`;
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

// Play Selected TV Channel
function playChannel(channel) {
  currentActiveId = channel.id;
  playingTitle.textContent = channel.name;
  playingCategory.textContent = `${channel.country} • ${channel.category}`;
  playingCode.textContent = channel.code;

  renderPlaylist(getFilteredChannels());

  // Stream using HLS.js or Native HTML5 Player
  if (Hls.isSupported() && channel.streamUrl.includes('.m3u8')) {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
    hlsInstance = new Hls();
    hlsInstance.loadSource(channel.streamUrl);
    hlsInstance.attachMedia(videoPlayer);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      videoPlayer.play().catch(e => console.log("Auto-play blocked:", e));
    });
  } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
    videoPlayer.src = channel.streamUrl;
    videoPlayer.addEventListener('loadedmetadata', () => {
      videoPlayer.play().catch(e => console.log("Auto-play blocked:", e));
    });
  } else {
    videoPlayer.src = channel.streamUrl;
    videoPlayer.play().catch(e => console.log("Auto-play blocked:", e));
  }
}

// Filtering Logic
function getFilteredChannels() {
  const term = searchInput.value.toLowerCase();
  const country = countryFilter.value;

  return tvChannels.filter(ch => {
    const matchSearch = ch.name.toLowerCase().includes(term) || ch.country.toLowerCase().includes(term);
    const matchCountry = country === "all" || ch.country === country;
    return matchSearch && matchCountry;
  });
}

function filterChannels() {
  renderPlaylist(getFilteredChannels());
}

searchInput.addEventListener("input", filterChannels);
countryFilter.addEventListener("change", filterChannels);

// Tab Switching (TV vs Settings)
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

// Initial Page Load - Play first channel automatically
document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  renderPlaylist(tvChannels);
  if (tvChannels.length > 0) {
    playChannel(tvChannels[0]);
  }
});
