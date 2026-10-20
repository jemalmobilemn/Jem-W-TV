// Sample Channels Data
const channels = [
  {
    id: 1,
    code: "AJ",
    name: "Al Jazeera English",
    country: "Qatar",
    category: "NEWS",
    description: "International news and world updates.",
    url: "https://www.aljazeera.com"
  },
  {
    id: 2,
    code: "NASA",
    name: "NASA TV",
    country: "United States",
    category: "SCIENCE",
    description: "Space mission and science programs.",
    url: "https://www.nasa.gov/multimedia/nasatv"
  },
  {
    id: 3,
    code: "DW",
    name: "Deutsche Welle",
    country: "Germany",
    category: "NEWS",
    description: "German public international broadcaster offering news and analysis.",
    url: "https://www.dw.com"
  },
  {
    id: 4,
    code: "BBC",
    name: "BBC World News",
    country: "UK",
    category: "NEWS",
    description: "24-hour news and information channel provided by the BBC.",
    url: "https://www.bbc.com/news"
  }
];

// DOM Elements
const channelsGrid = document.getElementById("channels-grid");
const searchInput = document.getElementById("search-input");
const countryFilter = document.getElementById("country-filter");
const categoryFilter = document.getElementById("category-filter");
const totalCount = document.getElementById("total-count");

// Render Channels to DOM
function renderChannels(data) {
  channelsGrid.innerHTML = "";
  totalCount.textContent = data.length;

  if (data.length === 0) {
    channelsGrid.innerHTML = `<p style="grid-column: 1/-1; color: #64748b;">No channels found matching your search.</p>`;
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
        <a href="${channel.url}" target="_blank" class="btn-visit">
          Official site <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
        <button class="btn-watch" onclick="alert('Opening stream for ${channel.name}')">Watch</button>
      </div>
    `;
    channelsGrid.appendChild(card);
  });
}

// Filter Functionality
function filterChannels() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCountry = countryFilter.value;
  const selectedCategory = categoryFilter.value;

  const filtered = channels.filter((channel) => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm) || 
                          channel.description.toLowerCase().includes(searchTerm);
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
  renderChannels(channels);
});
