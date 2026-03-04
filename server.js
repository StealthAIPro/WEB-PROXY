const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL provided.");

    try {
        const response = await axios.get(targetUrl, {
            responseType: 'text',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        let html = response.data;

        // Simple URL Rewriting: Redirect relative links through our proxy
        // This is a basic regex; advanced proxies use libraries like 'cheerio'
        const baseUrl = new URL(targetUrl).origin;
        html = html.replace(/(src|href)="(?!http|https)([^"]+)"/g, `$1="/proxy?url=${baseUrl}$2"`);

        res.send(html);
    } catch (error) {
        res.status(500).send("Error fetching the site: " + error.message);
    }
});

app.listen(PORT, () => console.log(`Proxy running at http://localhost:${PORT}`));
