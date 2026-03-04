const express = require('express');
const { createServer } = require('node:http');
const { createBareServer } = require('@tomphttp/bare-server-node');
const axios = require('axios');
const path = require('path');

const app = express();
const bare = createBareServer('/bare/'); // This is your private bare endpoint
const server = createServer();

app.use(express.static(path.join(__dirname, 'public')));

// Logic 1: Simple Proxy (Node-based)
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("No URL provided.");
    try {
        const response = await axios.get(targetUrl, { responseType: 'text' });
        let html = response.data;
        const origin = new URL(targetUrl).origin;
        html = html.replace(/(src|href)="\/([^"]+)"/g, `$1="/proxy?url=${origin}/$2"`);
        res.send(html);
    } catch (e) {
        res.status(500).send("Error fetching site.");
    }
});

// Integration: Connect Express and Bare Server
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`ShadowBrowse is running on http://localhost:${PORT}`);
});
