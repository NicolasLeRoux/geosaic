const path = require('path');
const express = require('express');
const http = require('http');
const {
	buildGrid
} = require('./index.js');
const {
	buildGeoTile
} = require('./lib/geo-tile.utils.js');

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

app.get('/api/grid/:latA/:lonA/:latB/:lonB/:step', (req, res) => {
	const coordA = {
		lat: +req.params.latA,
		lon: +req.params.lonA
	};
	const coordB = {
		lat: +req.params.latB,
		lon: +req.params.lonB
	};
	const step = +req.params.step;
	const grid = buildGrid(coordA, coordB, step)
		.map((coord, idx) => {
			return buildGeoTile(coord, step, idx);
		});

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(grid));
});

/**
 * Starting server
 */
const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.info(`Server listening on port ${port}.`);
});
