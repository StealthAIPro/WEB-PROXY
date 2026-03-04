const express = require('express');
const { createServer } = require('node:http');
const { createBareServer } = require('@tomphttp/bare-server-node');
const admin = require('firebase-admin');
const path = require('path');

// 1. Initialize Firebase Admin
// Replace with the path to your downloaded JSON key
const serviceAccount = require("./firebase-admin.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const bare = createBareServer('/bare/');
const server = createServer();

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to verify Firebase ID Token
const validateFirebaseToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send('No token provided');
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(403).send('Invalid token');
    }
};

// Simple Proxy Route (Protected)
app.get('/proxy', validateFirebaseToken, async (req, res) => {
    const targetUrl = req.query.url;
    // ... (Your axios fetching logic from previous steps)
});

// Route requests to Bare Server (UV) or Express
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

server.listen(3000, () => console.log('Secured Proxy on port 3000'));
