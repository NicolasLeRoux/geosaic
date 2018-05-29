const path = require('path');
const express = require('express');
const http = require('http');

let app = express(),
	server = http.createServer(app);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/src/**/*', (req, res) => {
	res.sendFile(path.join(__dirname, req.url));
});

app.get('/node_modules/**/*', (req, res) => {
	res.sendFile(path.join(__dirname, req.url));
});

app.get('/api/test', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({a: 1}));
});

/**
 * Starting server
 */
const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.info(`Server listening on port ${port}.`);
});
