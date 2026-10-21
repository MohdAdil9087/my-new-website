
export default async function handler(req, res) {
  const API_KEY = process.env.GNEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      error: "GNews API key is not configured"
    });
  }

  const {
    category = "All",
    query = "",
    lang = "hi"
  } = req.query;

  const categories = {
    National: "nation",
    International: "world",
    Technology: "technology",
    Sports: "sports",
    Business: "business",
    Education: "nation"
  };

  const params = new URLSearchParams({
    country: "in",
    lang: lang === "en" ? "en" : "hi",
    max: "10",
    apikey: API_KEY
  });

  let endpoint = "top-headlines";

  if (query.trim()) {
    endpoint = "search";
    params.set("q", query.trim());
  } else if (category !== "All") {
    params.set("category", categories[category] || "general");
  }

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/${endpoint}?${params}`
    );

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Unable to fetch news"
    });
  }
}
