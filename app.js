
"use strict";

const baseStreams = [
  // AL JAZEERA
  {name:"Al Jazeera English HD",country:"Qatar",category:"NEWS",streamUrl:"https://live-hls-apps-aje-fa.getaj.net/AJE/index.m3u8"},
  {name:"Al Jazeera Arabic HD",country:"Qatar",category:"NEWS",streamUrl:"https://live-hls-apps-aja-fa.getaj.net/AJA/index.m3u8"},
  {name:"Al Jazeera Mubasher",country:"Qatar",category:"NEWS",streamUrl:"https://live-hls-apps-ajm-fa.getaj.net/AJM/index.m3u8"},
  {name:"Al Jazeera Mubasher 24",country:"Qatar",category:"NEWS",streamUrl:"https://live-hls-apps-ajm24-fa.getaj.net/AJM24/index.m3u8"},
  {name:"Al Jazeera Documentary",country:"Qatar",category:"ENTERTAINMENT",streamUrl:"https://live-hls-apps-ajd-fa.getaj.net/AJD/index.m3u8"},

  // INTERNATIONAL NEWS
  {name:"DW English",country:"Germany",category:"NEWS",streamUrl:"https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8"},
  {name:"DW Arabic",country:"Germany",category:"NEWS",streamUrl:"https://dwamdstream103.akamaized.net/hls/live/2015526/dwstream103/index.m3u8"},
  {name:"France 24 English",country:"France",category:"NEWS",streamUrl:"https://live.france24.com/hls/live/2037218/F24_EN_HI_HLS/master.m3u8"},
  {name:"France 24 Arabic",country:"France",category:"NEWS",streamUrl:"https://live.france24.com/hls/live/2037222/F24_AR_HI_HLS/master.m3u8"},
  {name:"France 24 French",country:"France",category:"NEWS",streamUrl:"https://live.france24.com/hls/live/2037179/F24_FR_HI_HLS/master.m3u8"},
  {name:"CGTN English",country:"China",category:"NEWS",streamUrl:"https://news.cgtn.com/resource/live/english/cgtn-news.m3u8"},
  {name:"CGTN Arabic",country:"China",category:"NEWS",streamUrl:"https://news.cgtn.com/resource/live/arabic/cgtn-a.m3u8"},
  {name:"TRT World",country:"Turkey",category:"NEWS",streamUrl:"https://tv-trtworld.medya.trt.com.tr/master.m3u8"},
  {name:"Al Arabiya",country:"UAE",category:"NEWS",streamUrl:"https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8"},
  {name:"ABC News Live",country:"USA",category:"NEWS",streamUrl:"https://abcnews-streams.akamaized.net/hls/live/2023560/abcnewshudson1/master.m3u8"},
  {name:"LiveNOW from FOX",country:"USA",category:"NEWS",streamUrl:"https://fox-foxnewsnow-vizio.amagi.tv/playlist.m3u8"},
  {name:"CBC News",country:"Canada",category:"NEWS",streamUrl:"https://dai2.xumo.com/amagi_hls_data_xumo1212A-redboxcbcnews/CDN/playlist.m3u8"},
  {name:"Euronews English",country:"Europe",category:"NEWS",streamUrl:"https://rakuten-euronews-1-gb.samsung.wurl.tv/playlist.m3u8"},
  {name:"Africanews English",country:"Africa",category:"NEWS",streamUrl:"https://africanews-eng-samsungafrica.amagi.tv/playlist.m3u8"},
  {name:"VOA TV",country:"USA",category:"NEWS",streamUrl:"https://voa-ingest.akamaized.net/hls/live/2033874/tvmc06/playlist.m3u8"},
  {name:"Alhurra",country:"USA",category:"NEWS",streamUrl:"https://mbn-ingest-worldsafe.akamaized.net/hls/live/2038900/MBN_Alhurra_Worldsafe_HLS/master.m3u8"},
  {name:"CNA News",country:"Singapore",category:"NEWS",streamUrl:"https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8"},
  {name:"Reuters TV",country:"International",category:"NEWS",streamUrl:"https://amg00453-reuters-amg00453c1-rakuten-uk-2110.playouts.now.amagi.tv/playlist/amg00453-reuters-reuters-rakutenuk/playlist.m3u8"},

  // SPORTS
  {name:"Red Bull TV",country:"International",category:"SPORTS",streamUrl:"https://e7c8f7d5.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWdiX1JlZEJ1bGxUVi0xX0hMUw/playlist.m3u8"},
  {name:"FIFA+",country:"International",category:"SPORTS",streamUrl:"https://a62dad94.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0ZJRkFQbHVzRW5nbGlzaF9ITFM/playlist.m3u8"},
  {name:"FIFA+ Women",country:"International",category:"SPORTS",streamUrl:"https://cffda8ff.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/U2Ftc3VuZy1nYl9GSUZBUGx1c3dvbWVuX0hMUw/playlist.m3u8"},
  {name:"Motorsport TV",country:"International",category:"SPORTS",streamUrl:"https://25dee28f.wurl.com/master/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X01vdG9yc3BvcnR0di0xX0hMUw/playlist.m3u8"},
  {name:"L'Équipe",country:"France",category:"SPORTS",streamUrl:"https://dshn8inoshngm.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-gac2i63dmu8b7/LEquipe_FR.m3u8"},
  {name:"Esport3",country:"Spain",category:"SPORTS",streamUrl:"https://directes-tv-int.3catdirectes.cat/live-content/esport3-hls/master.m3u8"},
  {name:"Teledeporte",country:"Spain",category:"SPORTS",streamUrl:"https://d1cctoeg0n48w5.cloudfront.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-mnixw9wn5ugmv/TeledeporteES.m3u8"},
  {name:"Trace Sport Stars",country:"International",category:"SPORTS",streamUrl:"https://lightning-tracesport-samsungau.amagi.tv/playlist.m3u8"},
  {name:"Africa 24 Sport",country:"Africa",category:"SPORTS",streamUrl:"https://africa24.vedge.infomaniak.com/livecast/ik:africa24sport/manifest.m3u8"},

  // DOCUMENTARY & ENTERTAINMENT
  {name:"NASA TV",country:"USA",category:"ENTERTAINMENT",streamUrl:"https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8"},
  {name:"CGTN Documentary",country:"China",category:"ENTERTAINMENT",streamUrl:"https://news.cgtn.com/resource/live/document/cgtn-doc.m3u8"},
  {name:"Fashion TV",country:"International",category:"ENTERTAINMENT",streamUrl:"http://fash1043.cloudycdn.services/slive/_definst_/ftv_paris_adaptive.smil/chunklist.m3u8"},
  {name:"Trace Urban",country:"International",category:"MUSIC",streamUrl:"https://lightning-traceurban-samsungau.amagi.tv/playlist.m3u8"},
  {name:"Outside TV",country:"USA",category:"ENTERTAINMENT",streamUrl:"https://outsidetvplus-xumo.amagi.tv/playlist.m3u8"}
];

const $ = id => document.getElementById(id);

const player = $("tv-player");
const playlist = $("channels-playlist");
const searchInput = $("search-input");
const categoryFilter = $("category-filter");

let hlsInstance = null;
let activeChannel = null;
let currentActiveId = null;
let tvChannels = [];
let idCounter = 1;
let playAttempt = 0;

function loadCustomChannels() {
  try {
    const saved = localStorage.getItem("jw_custom_channels");
    const list = saved ? JSON.parse(saved) : [];
    return Array.isArray(list)
      ? list.filter(c => c && typeof c.name === "string" &&
          typeof c.streamUrl === "string")
      : [];
  } catch {
    return [];
  }
}

function saveCustomChannels(list) {
  try {
    localStorage.setItem("jw_custom_channels", JSON.stringify(list));
    return true;
  } catch {
    $("add-channel-msg").textContent =
      "ማስቀመጥ አልተቻለም። የአሳሹን storage ያረጋግጡ።";
    return false;
  }
}

function initChannels() {
  tvChannels = [];
  idCounter = 1;

  for (const channel of baseStreams) {
    tvChannels.push({
      ...channel,
      id: idCounter++,
      code: channel.name.substring(0, 3).toUpperCase(),
      isCustom: false
    });
  }

  for (const channel of loadCustomChannels()) {
    tvChannels.push({
      ...channel,
      id: idCounter++,
      country: channel.country || "Custom",
      category: channel.category || "NEWS",
      code: channel.code || channel.name.substring(0, 3).toUpperCase(),
      isCustom: true
    });
  }
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
    const searchable =
      `${channel.name} ${channel.country} ${channel.code}`.toLowerCase();

    return searchable.includes(term) &&
      (category === "all" || channel.category === category);
  });
}

function renderPlaylist() {
  const data = getFilteredChannels();
  playlist.replaceChildren();

  $("channel-count").textContent =
    `${data.length.toLocaleString()} ቻናሎች`;

  if (!data.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "ምንም ቻናል አልተገኘም።";
    playlist.appendChild(empty);
    return;
  }

  for (const channel of data) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "playlist-item" +
      (channel.id === currentActiveId ? " active" : "");
    button.setAttribute("aria-label", `Play ${channel.name}`);

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
  }
}

function setMessage(status, message) {
  $("player-status").textContent = status;
  $("player-message").textContent = message;
}

async function playChannel(channel) {
  const attempt = ++playAttempt;
  activeChannel = channel;
  currentActiveId = channel.id;

  $("playing-title").textContent = channel.name;
  $("playing-category").textContent =
    `${channel.country} • ${channel.category}`;
  $("playing-code").textContent = channel.code.substring(0, 4);
  $("player-placeholder").hidden = true;

  setMessage("● LOADING", "ስርጭቱ በመጫን ላይ ነው...");
  stopPlayer();
  renderPlaylist();

  player.onerror = () => {
    if (attempt !== playAttempt) return;
    $("player-placeholder").hidden = false;
    setMessage("● ERROR",
      "ቪዲዮው አልተከፈተም። ኔትወርክዎን ያረጋግጡ ወይም ሌላ ቻናል ይሞክሩ።");
  };

  if (player.canPlayType("application/vnd.apple.mpegurl")) {
    player.src = channel.streamUrl;
    player.load();

    try {
      await player.play();
    } catch {
      if (attempt !== playAttempt) return;
      setMessage("● READY",
        "ለመጀመር በቪዲዮው ላይ ▶ ይጫኑ።");
    }
    return;
  }

  if (window.Hls && Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 30,
      maxBufferLength: 60
    });

    hlsInstance = hls;

    hls.on(Hls.Events.MANIFEST_PARSED, async () => {
      if (attempt !== playAttempt) return;

      try {
        await player.play();
      } catch {
        if (attempt === playAttempt) {
          setMessage("● READY", "ለማጫወት ▶ ይጫኑ።");
        }
      }
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (attempt !== playAttempt || !data.fatal) return;

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        setMessage("● NETWORK ERROR",
          "የስርጭት ኔትወርክ ስህተት። እንደገና ይሞክሩ።");
        hls.destroy();
        if (hlsInstance === hls) hlsInstance = null;
      } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        setMessage("● MEDIA ERROR", "ሚዲያውን ለማስተካከል እየሞከርን ነው...");
        hls.recoverMediaError();
      } else {
        setMessage("● STREAM ERROR",
          "የስርጭት ሊንኩ ላይሰራ ይችላል። ሌላ ቻናል ይምረጡ።");
        hls.destroy();
        if (hlsInstance === hls) hlsInstance = null;
      }
    });

    hls.loadSource(channel.streamUrl);
    hls.attachMedia(player);
    return;
  }

  $("player-placeholder").hidden = false;
  setMessage("● NOT SUPPORTED",
    "ይህ አሳሽ ይህን የቪዲዮ ቅርጸት አይደግፍም። Safari ወይም Chrome ይሞክሩ።");
}

player.addEventListener("playing", () => {
  $("player-placeholder").hidden = true;
  setMessage("● LIVE", "ስርጭቱ በቀጥታ እየተጫወተ ነው።");
});

player.addEventListener("waiting", () => {
  setMessage("● BUFFERING", "ኔትወርኩን እየጠበቀ ነው...");
});

player.addEventListener("pause", () => {
  if (!player.ended && activeChannel) {
    $("player-status").textContent = "● PAUSED";
  }
});

player.addEventListener("error", () => {
  $("player-placeholder").hidden = false;
  setMessage("● ERROR",
    "ቪዲዮው አልተከፈተም። ሌላ ቻናል ይሞክሩ።");
});

searchInput.addEventListener("input", renderPlaylist);
categoryFilter.addEventListener("change", renderPlaylist);

$("retry-btn").addEventListener("click", () => {
  if (activeChannel) playChannel(activeChannel);
  else setMessage("● READY", "መጀመሪያ ቻናል ይምረጡ።");
});

function showTV() {
  $("settings-view").hidden = true;
  $("tv-view").hidden = false;
}

$("home-btn").addEventListener("click", event => {
  event.preventDefault();
  showTV();
});

$("back-btn").addEventListener("click", showTV);

$("settings-btn").addEventListener("click", () => {
  $("tv-view").hidden = true;
  $("settings-view").hidden = false;
  $("storage-message").textContent =
    `${loadCustomChannels().length} በእጅ የተጨመሩ ቻናሎች።`;
});

$("theme-toggle").addEventListener("click", () => {
  const root = document.documentElement;
  root.dataset.theme =
    root.dataset.theme === "dark" ? "light" : "dark";

  try {
    localStorage.setItem("jw_tv_theme", root.dataset.theme);
  } catch {}
});

try {
  const savedTheme = localStorage.getItem("jw_tv_theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch {}

$("add-channel-btn").addEventListener("click", () => {
  const name = $("new-channel-name").value.trim();
  const url = $("new-channel-url").value.trim();
  const category = $("new-channel-category").value;
  const msg = $("add-channel-msg");

  if (!name || !url) {
    msg.textContent = "የቻናል ስም እና URL ያስገቡ።";
    return;
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    msg.textContent = "ትክክለኛ URL ያስገቡ።";
    return;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    msg.textContent = "http ወይም https ሊንክ ብቻ ይጠቀሙ።";
    return;
  }

  if (!/\.m3u8?($|[?#])/i.test(parsed.pathname + parsed.search)) {
    msg.textContent =
      "የቀጥታ HLS ስርጭት .m3u8 ሊንክ ያስገቡ።";
    return;
  }

  const custom = loadCustomChannels();
  const duplicate = custom.some(c =>
    c.streamUrl === url || c.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate || baseStreams.some(c =>
    c.name.toLowerCase() === name.toLowerCase()
  )) {
    msg.textContent = "ይህ ቻናል አስቀድሞ ተጨምሯል።";
    return;
  }

  custom.push({
    name,
    streamUrl: url,
    category,
    country: "Custom",
    code: name.substring(0, 3).toUpperCase()
  });

  if (!saveCustomChannels(custom)) return;

  initChannels();
  renderPlaylist();

  $("new-channel-name").value = "";
  $("new-channel-url").value = "";
  msg.textContent = `✅ ${name} ተጨምሯል።`;
  $("storage-message").textContent =
    `${custom.length} በእጅ የተጨመሩ ቻናሎች።`;
});

$("clear-custom-btn").addEventListener("click", () => {
  if (!confirm("ሁሉንም በእጅ የጨመሯቸውን ቻናሎች ማጥፋት ይፈልጋሉ?")) {
    return;
  }

  try {
    localStorage.removeItem("jw_custom_channels");
  } catch {
    $("storage-message").textContent = "ማጥፋት አልተቻለም።";
    return;
  }

  if (activeChannel && activeChannel.isCustom) {
    stopPlayer();
    activeChannel = null;
    currentActiveId = null;
    $("playing-title").textContent = "Jemal W TV";
    $("playing-category").textContent = "Live television";
    $("playing-code").textContent = "JW";
    $("player-placeholder").hidden = false;
    setMessage("● READY", "ቻናል ይምረጡ።");
  }

  initChannels();
  renderPlaylist();
  $("storage-message").textContent = "የተጨመሩ ቻናሎች ተጥፈዋል።";
  $("add-channel-msg").textContent = "";
});

initChannels();
renderPlaylist();
