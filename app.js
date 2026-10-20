
const channels = [
  {
    name: "Al Jazeera English",
    country: "Qatar",
    category: "NEWS",
    initials: "AJ",
    description: "International news and world updates.",
    url: "https://www.aljazeera.com/"
  },
  {
    name: "NASA",
    country: "United States",
    category: "SCIENCE",
    initials: "NASA",
    description: "Space exploration and science programming.",
    url: "https://www.nasa.gov/nasatv/"
  },
  {
    name: "DW",
    country: "Germany",
    category: "NEWS",
    initials: "DW",
    description: "News and documentaries from Deutsche Welle.",
    url: "https://www.dw.com/"
  },
  {
    name: "BBC News",
    country: "United Kingdom",
    category: "NEWS",
    initials: "BBC",
    description: "Global reporting and breaking news.",
    url: "https://www.bbc.com/news"
  },
  {
    name: "France 24",
    country: "France",
    category: "NEWS",
    initials: "F24",
    description: "International news and world updates.",
    url: "https://www.france24.com/en/"
  },
  {
    name: "Sky News",
    country: "United Kingdom",
    category: "NEWS",
    initials: "SKY",
    description: "UK and world news coverage.",
    url: "https://news.sky.com/"
  },
  {
    name: "CGTN",
    country: "China",
    category: "NEWS",
    initials: "CG",
    description: "International news and current affairs.",
    url: "https://www.cgtn.com/"
  },
  {
    name: "TRT World",
    country: "Türkiye",
    category: "NEWS",
    initials: "TRT",
    description: "Global news and current affairs.",
    url: "https://www.trtworld.com/"
  },
  {
    name: "PBS",
    country: "United States",
    category: "GENERAL",
    initials: "PBS",
    description: "Public television, culture and documentaries.",
    url: "https://www.pbs.org/"
  },
  {
    name: "ABC News",
    country: "United States",
    category: "NEWS",
    initials: "ABC",
    description: "News, analysis and special reports.",
    url: "https://abcnews.go.com/"
  },
  {
    name: "CBS News",
    country: "United States",
    category: "NEWS",
    initials: "CBS",
    description: "News coverage and live reports.",
    url: "https://www.cbsnews.com/"
  },
  {
    name: "NBC News",
    country: "United States",
    category: "NEWS",
    initials: "NBC",
    description: "News, reports and live coverage.",
    url: "https://www.nbcnews.com/"
  },
  {
    name: "Al Arabiya",
    country: "Saudi Arabia",
    category: "NEWS",
    initials: "AA",
    description: "Arabic-language news and regional updates.",
    url: "https://english.alarabiya.net/"
  },
  {
    name: "Euronews",
    country: "France",
    category: "NEWS",
    initials: "EU",
    description: "European and international news.",
    url: "https://www.euronews.com/"
  },
  {
    name: "Olympics",
    country: "International",
    category: "SPORTS",
    initials: "OLY",
    description: "Olympic sports news and event information.",
    url: "https://olympics.com/"
  },
  {
    name: "FIFA+",
    country: "International",
    category: "SPORTS",
    initials: "FIFA",
    description: "Official football content and selected free matches.",
    url: "https://www.plus.fifa.com/"
  },
  {
    name: "Red Bull TV",
    country: "Austria",
    category: "SPORTS",
    initials: "RB",
    description: "Sports, adventure and event videos.",
    url: "https://www.redbull.com/int-en/tv"
  }
];

const grid = document.getElementById("channelGrid");
const search = document.getElementById("search");
const country = document.getElementById("country");
const category = document.getElementById("category");
const count = document.getElementById("count");
const empty = document.getElementById("empty");

const countries = [...new Set(channels.map(channel => channel.country))].sort();

countries.forEach(name => {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  country.appendChild(option);
});

function renderChannels() {
  const term = search.value.trim().toLowerCase();

  const filtered = channels.filter(channel => {
    const matchesSearch = (
      channel.name + " " +
      channel.country + " " +
      channel.category + " " +
      channel.description
    ).toLowerCase().includes(term);

    const matchesCountry =
      country.value === "all" || channel.country === country.value;

    const matchesCategory =
      category.value === "all" || channel.category === category.value;

    return matchesSearch && matchesCountry && matchesCategory;
  });

  count.textContent =
    `${filtered.length} channel${filtered.length === 1 ? "" : "s"}`;

  grid.replaceChildren();

  filtered.forEach(channel => {
    const card = document.createElement("article");
    card.className = "channel-card";

    const top = document.createElement("div");
    top.className = "card-top";

    const logo = document.createElement("div");
    logo.className = "channel-logo";
    logo.textContent = channel.initials;

    const info = document.createElement("div");

    const name = document.createElement("div");
    name.className = "channel-name";
    name.textContent = channel.name;

    const location = document.createElement("div");
    location.className = "channel-country";
    location.textContent = channel.country;

    info.append(name, location);
    top.append(logo, info);

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = channel.category;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = channel.description;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const official = document.createElement("a");
    official.className = "official-link";
    official.href = channel.url;
    official.target = "_blank";
    official.rel = "noopener noreferrer";
    official.textContent = "Official site ↗";

    const watch = document.createElement("a");
    watch.className = "watch-button";
    watch.href = channel.url;
    watch.target = "_blank";
    watch.rel = "noopener noreferrer";
    watch.textContent = "Watch / Visit";

    actions.append(official, watch);
    card.append(top, tag, description, actions);
    grid.appendChild(card);
  });

  empty.hidden = filtered.length !== 0;
}

search.addEventListener("input", renderChannels);
country.addEventListener("change", renderChannels);
category.addEventListener("change", renderChannels);

const menuButton = document.getElementById("menuButton");
const nav = document.getElementById("nav");

menuButton.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

document.getElementById("year").textContent = new Date().getFullYear();

renderChannels();
