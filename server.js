const express = require('express');
const { createServer } = require('node:http');
const { createBareServer } = require('@tomphttp/bare-server-node');
const path = require('path');

const app = express();
const bare = createBareServer('/bare/');
const server = createServer();

// Static files (Your UI)
app.use(express.static(path.join(__dirname, 'public')));

// Health check for Northflank
app.get('/health', (req, res) => res.status(200).send('OK'));

// Route requests: If it's a Bare request, send to Bare. Otherwise, send to Express.
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

// Handle WebSocket upgrades for Ultraviolet
server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`ShadowBrowse is now OPEN at http://0.0.0.0:${PORT}`);
});
