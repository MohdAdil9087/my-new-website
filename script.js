
// GNews API Key
const API_KEY = "";
// Current category
let currentCategory = "All";
// Load News
let currentLanguage = "hi";

// Change Website Language

function changeLanguage() {
    currentLanguage = currentLanguage === "hi" ? "en" : "hi";

    const button = document.getElementById("languageBtn");

    button.textContent =
        currentLanguage === "hi" ? "English" : "हिंदी";

    loadNews(currentCategory);
}

async function loadNews(category = "All", query = "") {
    const grid = document.getElementById("newsGrid");
    const message = document.getElementById("message");
    grid.innerHTML = "";
    message.textContent = "Loading news...";
    let url =
        'https://gnews.io/api/v4/top-headlines?' +
         `country=in&lang=${currentLanguage}&max=10&apikey=${API_KEY}`;
    if (category !== "All") {
        const categories = {
            National: "nation",
            International: "world",
            Technology: "technology",
            Sports: "sports",
            Business: "business",
            Education: "nation"
        };
        url += `&category=${categories[category] || "general"}`;
    }
    if (query.trim() !== "") {
        url =
            `https://gnews.io/api/v4/search?` +
            `q=${encodeURIComponent(query)}` +
            `&lang=${currentLanguage}&country=in&max=10&apikey=${API_KEY}`;
    }
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(
                data.errors
                    ? data.errors.join(", ")
                    : "Unable to fetch news"
            );
        }
        displayNews(data.articles || []);
        message.textContent =
            data.articles.length === 0
                ? "No news found."
                : "";
    } catch (error) {
        console.error(error);
        message.textContent =
            "News load nahi hui. API key aur internet check karo.";
    }
}
// Display News
function displayNews(articles) {
    const grid = document.getElementById("newsGrid");
    grid.innerHTML = "";
    articles.forEach(news => {
        const card = document.createElement("article");
        card.className = "news-card";
        const image = document.createElement("img");
        image.src = news.image ||
            "https://placehold.co/600x350?text=News";
        image.alt = news.title;
        image.onerror = function () {
            this.onerror = null;
            this.src =
                "https://placehold.co/600x350?text=News";
        };
        const content = document.createElement("div");
        content.className = "news-content";
        const title = document.createElement("h3");
        title.textContent = news.title;
        const description = document.createElement("p");
        description.textContent =
            news.description || "Read the full story.";
        const source = document.createElement("p");
        source.textContent =
            "Source: " + (news.source?.name || "News");
        const link = document.createElement("a");
        link.href = news.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Read More";
        content.append(title, description, source, link);
        card.append(image, content);
        grid.appendChild(card);
    });
}
// Category Filter
function filterNews(category, button) {
    currentCategory = category;
    document.querySelectorAll("#categories button")
        .forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    document.getElementById("sectionTitle").textContent =
        category === "All" ? "Latest News" : category + " News";
    const query = document.getElementById("searchInput").value;
    loadNews(category, query);
}
// Search News
function searchNews() {
    const query =
        document.getElementById("searchInput").value.trim();
    loadNews(currentCategory, query);
}
// Search on Enter
document.getElementById("searchInput")
    .addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            searchNews();
        }
    });
// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
// Load news when website opens
loadNews();
