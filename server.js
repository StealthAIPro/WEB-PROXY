const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL provided.");

    try {
        const response = await axios({
            method: 'get',
            url: targetUrl,
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            responseType: 'text'
        });

        let html = response.data;
        const origin = new URL(targetUrl).origin;

        // Basic URL rewrite for relative paths
        html = html.replace(/(href|src)="\/([^"]+)"/g, `$1="/proxy?url=${origin}/$2"`);
        
        // Privacy: Strip out tracking scripts (basic example)
        html = html.replace(/<script.*googletagmanager.*<\/script>/g, '');

        res.send(html);
    } catch (error) {
        res.status(500).send("Error loading page. Some sites block proxying via headers.");
    }
});

app.listen(PORT, () => console.log(`Private Proxy active on port ${PORT}`));
