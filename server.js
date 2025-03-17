const express = require("express");
const scrapePages = require("./scraper");

const app = express();
const port = 3000;

app.get("/scrape", async (req, res) => {
    const data = await scrapePages();
    res.json(data);
});

app.get("/search", async (req, res) => {
    const query = req.query.q || "";
    const data = await scrapePages();
    const filtered = data.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );
    res.json(filtered);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
