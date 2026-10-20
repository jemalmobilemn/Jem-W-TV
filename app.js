
"use strict";

/*
  እዚህ ያሉት የስርጭት ሊንኮች ምሳሌዎች ናቸው።
  ከመጠቀምህ በፊት እያንዳንዱን ሊንክ አረጋግጥ።
  ለስፖርት ቻናሎች የተፈቀደ የስርጭት URL አስገባ።
*/

const tvChannels = [
  {
    id: 1,
    code: "AJE",
    name: "Al Jazeera English",
    country: "Qatar",
    category: "NEWS",
    streamUrl: "https://live-hls-web-aje.getaj.net/AJE/04.m3u8"
  },
  {
    id: 2,
    code: "DW",
    name: "DW English",
    country: "Germany",
    category: "NEWS",
    streamUrl: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"
  },
  {
    id: 3,
    code: "NASA",
    name: "NASA TV",
    country: "USA",
    category: "ENTERTAINMENT",
    streamUrl: "https://ntv1.akamaized.net/hls/live/2012981/ntv1/master.m3u8"
  },
  {
    id: 4,
    code: "F24",
    name: "France 24 English",
    country: "France",
    category: "NEWS",
    streamUrl: "https://live.france24.com/hls/live/2037222/F24_EN_HI_HLS/master.m3u8"
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
  }
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
    const searchable =
      `${channel.name} ${channel.country} ${channel.code}`.toLowerCase();

    const matchesSearch = searchable.includes(term);
    const matchesCategory =
      category === "all" || channel.category === category;

    return matchesSearch && matchesCategory;
  });
}

function renderPlaylist() {
  const data = getFilteredChannels();
  playlist.replaceChildren();
  channelCount.textContent = `${data.length} ቻናሎች`;

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
    button.className =
      "playlist-item" +
      (channel.id === currentActiveId ? " active" : "");

    const code = document.createElement("span");
    code.className = "playlist-code";
    code.textContent = channel.code;

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
}

async function playChannel(channel) {
  activeChannel = channel;
  currentActiveId = channel.id;

  playingTitle.textContent = channel.name;
  playingCategory.textContent =
    `${channel.country} • ${channel.category}`;
  playingCode.textContent = channel.code;

  playerStatus.textContent = "● በመጫን ላይ...";
  playerMessage.textContent = "ስርጭቱ በመጫን ላይ ነው።";

  stopPlayer();
  renderPlaylist();

  // Safari / iPhone native HLS support.
  if (player.canPlayType("application/vnd.apple.mpegurl")) {
    player.src = channel.streamUrl;
    player.load();

    try {
      await player.play();
    } catch (error) {
      playerMessage.textContent =
        "ለመጀመር በቪዲዮው ላይ ▶ ይጫኑ።";
    }
    return;
  }

  // HLS.js for supported desktop and Android browsers.
  if (window.Hls && Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 30
    });

    hlsInstance.on(Hls.Events.MANIFEST_PARSED, async () => {
      try {
        await player.play();
      } catch (error) {
        playerMessage.textContent =
          "ለማጫወት በቪዲዮው ላይ ▶ ይጫኑ።";
      }
    });

    hlsInstance.on(Hls.Events.ERROR, (event, data) => {
      if (!data.fatal) return;

      playerStatus.textContent = "● የስርጭት ስህተት";
      playerMessage.textContent =
        "ሊንኩ ሊዘጋ ይችላል፣ ወይም አገልጋዩ ይህን ድረ-ገጽ ላይ ማጫወት አይፈቅድም።";

      hlsInstance.destroy();
      hlsInstance = null;
    });

    hlsInstance.loadSource(channel.streamUrl);
    hlsInstance.attachMedia(player);
    return;
  }

  playerStatus.textContent = "● አይደገፍም";
  playerMessage.textContent =
    "ይህ አሳሽ HLS ማጫወትን አይደግፍም። Safari ወይም ዘመናዊ Chrome ይጠቀሙ።";
}

player.addEventListener("playing", () => {
  playerStatus.textContent = "● LIVE";
  playerMessage.textContent = "ስርጭቱ እየተጫወተ ነው።";
});

player.addEventListener("waiting", () => {
  playerStatus.textContent = "● በመጠበቅ ላይ...";
});

player.addEventListener("error", () => {
  playerStatus.textContent = "● ስህተት";
  playerMessage.textContent =
    "ቪዲዮው አልተከፈተም። ኢንተርኔትንና የስርጭት ሊንኩን ያረጋግጡ።";
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

// Settings navigation
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

// Dark / Light theme
$("theme-toggle").addEventListener("click", () => {
  const root = document.documentElement;
  root.dataset.theme =
    root.dataset.theme === "dark" ? "light" : "dark";
});

// Initial render: user chooses a channel to start playback.
renderPlaylist();
