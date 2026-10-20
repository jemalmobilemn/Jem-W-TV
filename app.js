// የብዙ ሃገራት እና የተለያዩ ቻናሎች ዝርዝር (በድር ላይ በቀጥታ የሚከፈቱ ዩአርኤሎች ያሉት)
const channels = [
  {
    id: 1,
    code: "AJ",
    name: "Al Jazeera English",
    country: "Qatar",
    category: "NEWS",
    description: "International news and world updates live from Qatar.",
    streamUrl: "https://www.youtube.com/embed/kJQnZcghp3I",
    officialUrl: "https://www.aljazeera.com"
  },
  {
    id: 2,
    code: "NASA",
    name: "NASA TV",
    country: "United States",
    category: "SCIENCE",
    description: "Space missions, rocket launches, and science programs.",
    streamUrl: "https://www.youtube.com/embed/21X5lGlDOfg",
    officialUrl: "https://www.nasa.gov"
  },
  {
    id: 3,
    code: "DW",
    name: "Deutsche Welle",
    country: "Germany",
    category: "NEWS",
    description: "German public international broadcaster offering global news.",
    streamUrl: "https://www.youtube.com/embed/4xcw5WfSST0",
    officialUrl: "https://www.dw.com"
  },
  {
    id: 4,
    code: "BBC",
    name: "BBC News",
    country: "UK",
    category: "NEWS",
    description: "24-hour global news and information channel.",
    streamUrl: "https://www.youtube.com/embed/hTWKbfoikeg",
    officialUrl: "https://www.bbc.com"
  },
  {
    id: 5,
    code: "FR24",
    name: "France 24 English",
    country: "France",
    category: "NEWS",
    description: "International news channel broadcasting from Paris.",
    streamUrl: "https://www.youtube.com/embed/hJW_UvXgLmA",
    officialUrl: "https://www.france24.com"
  },
  {
    id: 6,
    code: "SKY",
    name: "Sky News",
    country: "UK",
    category: "NEWS",
    description: "Breaking news, analysis, and UK headlines.",
    streamUrl: "https://www.youtube.com/embed/9Auq9mYxFEE",
    officialUrl: "https://news.sky.com"
  },
  {
    id: 7,
    code: "UN",
    name: "UN Web TV",
    country: "United States",
    category: "DOCUMENTARY",
    description: "United Nations official meetings and global issues documentary.",
    streamUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    officialUrl: "https://webtv.un.org"
  },
  {
    id: 8,
    code: "TRT",
    name: "TRT World",
    country: "Turkey",
    category: "NEWS",
    description: "Turkish international news channel focused on global stories.",
    streamUrl: "https://www.youtube.com/embed/rcw5yZkO_Qo",
    officialUrl: "https://www.trtworld.com"
  },
  {
    id: 9,
    code: "NHK",
    name: "NHK WORLD-JAPAN",
    country: "Japan",
    category: "ENTERTAINMENT",
    description: "Japanese public broadcaster providing updates on Japanese culture and news.",
    streamUrl: "https://www.youtube.com/embed/XyWz66A_3i8",
    officialUrl: "https://www3.nhk.or.jp"
  }
];

// DOM Elements
const channelsGrid = document.getElementById("channels-grid");
const searchInput = document.getElementById("search-input");
const countryFilter = document.getElementById("country-filter");
const categoryFilter = document.getElementById("category-filter");
const totalCount = document.getElementById("total-count");

const streamModal = document.getElementById("stream-modal");
const streamIframe = document.getElementById("stream-iframe");
const modalChannelTitle = document.getElementById("modal-channel-title");
const closeModalBtn = document.getElementById("close-modal-btn");

// Populate Filter Options Dynamically
function initFilters() {
  const countries = [...new Set(channels.map(c => c.country))];
  const categories = [...new Set(channels.map(c => c.category))];

  countries.forEach(country => {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    countryFilter.appendChild(opt);
  });

  categories.forEach(category => {
    const opt = document.createElement("option");
    opt.value = category;
    opt.textContent = category;
    categoryFilter.appendChild(opt);
  });
}

// Render Channels to DOM
function renderChannels(data) {
  channelsGrid.innerHTML = "";
  totalCount.textContent = data.length;

  if (data.length === 0) {
    channelsGrid.innerHTML = `<p style="grid-column: 1/-1; color: #64748b; text-align:center; padding: 2rem;">No channels found matching your criteria.</p>`;
    return;
  }

  data.forEach((channel) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <div class="card-header">
          <div class="channel-icon">${channel.code}</div>
          <div class="channel-info">
            <h3>${channel.name}</h3>
            <span>${channel.country}</span>
          </div>
        </div>
        <div class="category-tag">${channel.category}</div>
        <p class="card-desc">${channel.description}</p>
      </div>
      <div class="card-actions">
        <a href="${channel.officialUrl}" target="_blank" class="btn-visit">Web</a>
        <button class="btn-watch" onclick="openStream('${channel.name}', '${channel.streamUrl}')">
          <i class="fa-solid fa-play"></i> Watch Live
        </button>
      </div>
    `;
    channelsGrid.appendChild(card);
  });
}

// Open Live Stream Modal
window.openStream = function(name, url) {
  modalChannelTitle.textContent = `Live: ${name}`;
  streamIframe.src = url;
  streamModal.style.display = "flex";
};

// Close Modal
function closeStreamModal() {
  streamIframe.src = ""; // Stops video playback
  streamModal.style.display = "none";
}

closeModalBtn.addEventListener("click", closeStreamModal);
streamModal.addEventListener("click", (e) => {
  if (e.target === streamModal) {
    closeStreamModal();
  }
});

// Filter Functionality
function filterChannels() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCountry = countryFilter.value;
  const selectedCategory = categoryFilter.value;

  const filtered = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm) || 
                          channel.description.toLowerCase().includes(searchTerm) ||
                          channel.country.toLowerCase().includes(searchTerm);
    const matchesCountry = selectedCountry === "all" || channel.country === selectedCountry;
    const matchesCategory = selectedCategory === "all" || channel.category === selectedCategory;

    return matchesSearch && matchesCountry && matchesCategory;
  });

  renderChannels(filtered);
}

// Event Listeners
searchInput.addEventListener("input", filterChannels);
countryFilter.addEventListener("change", filterChannels);
categoryFilter.addEventListener("change", filterChannels);

// Initial Load
document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  renderChannels(channels);
});
