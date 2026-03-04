const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

// --- LOGIC 1: Custom Node Proxy (Simple/Fast) ---
app.get('/proxy', async (req, res) => {
    try {
        const target = req.query.url;
        const response = await axios.get(target, { responseType: 'text' });
        let html = response.data;
        const origin = new URL(target).origin;
        // Rewrite basic paths
        html = html.replace(/(src|href)="\/([^"]+)"/g, `$1="/proxy?url=${origin}/$2"`);
        res.send(html);
    } catch (e) { res.status(500).send("Error"); }
});

// --- LOGIC 2: Ultraviolet (Advanced) ---
// In a real production setup, you would serve UV files from node_modules
// For this demo, we assume uv.config.js and uv.bundle.js are in /public/uv/

app.listen(PORT, () => console.log(`Proxy running: http://localhost:${PORT}`));
