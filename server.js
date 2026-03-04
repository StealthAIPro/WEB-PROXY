const express = require('express');
const { createServer } = require('node:http');
const { createBareServer } = require('@tomphttp/bare-server-node');
const path = require('path');

const app = express();
const bare = createBareServer('/bare/');
const server = createServer();

// Optional: Simple Password Protection (Replace 'mypassword' with yours)
const PASSWORD = process.env.PROXY_PASSWORD || 'admin123';

app.use((req, res, next) => {
    // Basic Auth check for the UI and Proxy logic
    const auth = { login: 'admin', password: PASSWORD };
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login && password && login === auth.login && password === auth.password) {
        return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
});

app.use(express.static(path.join(__dirname, 'public')));

// Health check for Northflank
app.get('/health', (req, res) => res.status(200).send('OK'));

// Route requests
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
server.listen(PORT, '0.0.0.0', () => {
    console.log(`ShadowBrowse running on port ${PORT}`);
});
