
const channels = [
  {
    name: "Al Jazeera English",
    country: "Qatar",
    category: "News",
    initials: "AJ",
    description: "International news and world updates.",
    url: "https://www.aljazeera.com/"
  },
  {
    name: "NASA",
    country: "United States",
    category: "Science",
    initials: "NASA",
    description: "Space missions and science programs.",
    url: "https://www.nasa.gov/nasatv/"
  },
  {
    name: "DW",
    country: "Germany",
    category: "News",
    initials: "DW",
    description: "German and international news.",
    url: "https://www.dw.com/"
  },
  {
    name: "France 24",
    country: "France",
    category: "News",
    initials: "F24",
    description: "International news and current affairs.",
    url: "https://www.france24.com/en/"
  },
  {
    name: "BBC News",
    country: "United Kingdom",
    category: "News",
    initials: "BBC",
    description: "World news, reports and analysis.",
    url: "https://www.bbc.com/news"
  },
  {
    name: "Sky News",
    country: "United Kingdom",
    category: "News",
    initials: "SKY",
    description: "Breaking news and live coverage.",
    url: "https://news.sky.com/"
  },
  {
    name: "Euronews",
    country: "France",
    category: "News",
    initials: "EU",
    description: "European and international headlines.",
    url: "https://www.euronews.com/"
  },
  {
    name: "TRT World",
    country: "Türkiye",
    category: "News",
    initials: "TRT",
    description: "International news and reports.",
    url: "https://www.trtworld.com/"
  },
  {
    name: "CGTN",
    country: "China",
    category: "News",
    initials: "CGTN",
    description: "International news and features.",
    url: "https://www.cgtn.com/"
  },
  {
    name: "ESPN Soccer",
    country: "United States",
    category: "Football",
    initials: "ESPN",
    description: "Football news, scores and analysis.",
    url: "https://www.espn.com/soccer/"
  },
  {
    name: "FIFA+",
    country: "International",
    category: "Football",
    initials: "F+",
    description: "Official football videos and selected live matches.",
    url: "https://www.fifa.com/fifaplus/en"
  },
  {
    name: "Premier League",
    country: "United Kingdom",
    category: "Football",
    initials: "PL",
    description: "Premier League news and highlights.",
    url: "https://www.premierleague.com/"
  },
  {
    name: "UEFA",
    country: "Switzerland",
    category: "Football",
    initials: "UEFA",
    description: "Champions League and European competitions.",
    url: "https://www.uefa.com/"
  },
  {
    name: "CAF Online",
    country: "Africa",
    category: "Football",
    initials: "CAF",
    description: "African football competitions and news.",
    url: "https://www.cafonline.com/"
  },
  {
    name: "Olympics",
    country: "International",
    category: "General",
    initials: "OLY",
    description: "Olympic sports and official videos.",
    url: "https://olympics.com/"
  },
  {
    name: "PBS",
    country: "United States",
    category: "General",
    initials: "PBS",
    description: "Documentaries and public television programs.",
    url: "https://www.pbs.org/"
  },
  {
    name: "NHK World-Japan",
    country: "Japan",
    category: "News",
    initials: "NHK",
    description: "Japanese news, culture and documentaries.",
    url: "https://www3.nhk.or.jp/nhkworld/"
  }
];

const footballChannels = [
  {
    icon: "🌍",
    name: "FIFA+",
    description: "Official football videos and selected live matches.",
    url: "https://www.fifa.com/fifaplus/en"
  },
  {
    icon: "🏆",
    name: "UEFA",
    description: "Champions League and European football.",
    url: "https://www.uefa.com/"
  },
  {
    icon: "⚽",
    name: "Premier League",
    description: "Official match news and highlights.",
    url: "https://www.premierleague.com/"
  },
  {
    icon: "🌍",
    name: "CAF",
    description: "African football news and competitions.",
    url: "https://www.cafonline.com/"
  },
  {
    icon: "📺",
    name: "ESPN Soccer",
    description: "Football coverage and analysis.",
    url: "https://www.espn.com/soccer/"
  },
  {
    icon: "🎥",
    name: "OneFootball",
    description: "Football news, clips and match coverage.",
    url: "https://onefootball.com/"
  }
];

const grid = document.getElementById("channelGrid");
const searchInput = document.getElementById("searchInput");
const countryFilter = document.getElementById("countryFilter");
const categoryFilter = document.getElementById("categoryFilter");
const countLabel = document.getElementById("channelCount");
const emptyState = document.getElementById("emptyState");
const playerFrame = document.getElementById("playerFrame");
const playerMessage = document.getElementById("playerMessage");

function validUrl(value) {
  try {
    const url = new URL(value);

    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch (error) {
    // Invalid URL.
  }

  return "#";
}

function populateCountries() {
  const countries = [
    ...new Set(channels.map(channel => channel.country))
  ].sort();

  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countryFilter.appendChild(option);
  });
}

function makeChannelCard(channel) {
  const card = document.createElement("article");
  card.className = "channel-card";

  const top = document.createElement("div");
  top.className = "channel-top";

  const logo = document.createElement("div");
  logo.className = "channel-logo";
  logo.textContent = channel.initials;

  const identity = document.createElement("div");
  identity.style.minWidth = "0";

  const name = document.createElement("div");
  name.className = "channel-name";
  name.textContent = channel.name;

  const country = document.createElement("div");
  country.className = "channel-country";
  country.textContent = channel.country;

  identity.append(name, country);
  top.append(logo, identity);

  const category = document.createElement("span");
  category.className = "tag";
  category.textContent = channel.category.toUpperCase();

  const description = document.createElement("p");
  description.className = "channel-desc";
  description.textContent = channel.description;

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const visit = document.createElement("a");
  visit.className = "small-btn primary";
  visit.href = validUrl(channel.url);
  visit.target = "_blank";
  visit.rel = "noopener noreferrer";
  visit.textContent = "Official site ↗";

  const watch = document.createElement("button");
  watch.className = "small-btn";
  watch.type = "button";
  watch.textContent = "Watch";

  watch.addEventListener("click", () => {
    selectChannel(channel);
  });

  actions.append(visit, watch);
  card.append(top, category, description, actions);

  return card;
}

function renderChannels() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCountry = countryFilter.value;
  const selectedCategory = categoryFilter.value;

  const filtered = channels.filter(channel => {
    const searchableText = [
      channel.name,
      channel.country,
      channel.category,
      channel.description
    ].join(" ").toLowerCase();

    const matchesSearch = searchableText.includes(query);
    const matchesCountry =
      selectedCountry === "all" ||
      channel.country === selectedCountry;

    const matchesCategory =
      selectedCategory === "all" ||
      channel.category === selectedCategory;

    return matchesSearch && matchesCountry && matchesCategory;
  });

  grid.replaceChildren(
    ...filtered.map(makeChannelCard)
  );

  countLabel.textContent =
    `${filtered.length} channel${filtered.length === 1 ? "" : "s"}`;

  emptyState.hidden = filtered.length > 0;
}

function selectChannel(channel) {
  playerFrame.replaceChildren();

  const placeholder = document.createElement("div");
  placeholder.className = "player-placeholder";

  const icon = document.createElement("span");
  icon.className = "play-symbol";
  icon.textContent = "↗";

  const title = document.createElement("b");
  title.textContent = channel.name + " selected";

  const message = document.createElement("small");
  message.textContent =
    "Use the official website to watch available programs.";

  const link = document.createElement("a");
  link.className = "primary-btn";
  link.href = validUrl(channel.url);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Open official website ↗";

  placeholder.append(icon, title, message, link);
  playerFrame.appendChild(placeholder);

  playerMessage.textContent =
    "Playback and availability are controlled by the channel provider.";

  document.getElementById("player").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function renderFootballChannels() {
  const target = document.getElementById("footballGrid");

  footballChannels.forEach(channel => {
    const link = document.createElement("a");
    link.className = "football-card";
    link.href = validUrl(channel.url);
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const icon = document.createElement("span");
    icon.className = "football-icon";
    icon.textContent = channel.icon;

    const copy = document.createElement("span");

    const name = document.createElement("b");
    name.textContent = channel.name;

    const description = document.createElement("small");
    description.textContent = channel.description;

    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.textContent = "↗";

    copy.append(name, description);
    link.append(icon, copy, arrow);
    target.appendChild(link);
  });
}

searchInput.addEventListener("input", renderChannels);
countryFilter.addEventListener("change", renderChannels);
categoryFilter.addEventListener("change", renderChannels);

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

document.querySelectorAll("#navLinks a").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("navLinks").classList.remove("open");
  });
});

document.getElementById("year").textContent =
  new Date().getFullYear();

populateCountries();
renderChannels();
renderFootballChannels();
