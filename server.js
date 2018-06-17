const path = require('path');
const express = require('express');
const http = require('http');
const {
	run
} = require('./index.js');
const {
	buildGeoTile
} = require('./lib/geo-tile.utils.js');
require('dotenv').config();

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
	const start = {
		lat: +req.params.latA,
		lon: +req.params.lonA
	};
	const end = {
		lat: +req.params.latB,
		lon: +req.params.lonB
	};
	const step = +req.params.step;

	return run(start, end, step)
		.toPromise()
		.then(items => {
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(items));
		}, () => {
			res.status(500)
				.send('Something broke!');
		});
});

/**
 * Starting server
 */
const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.info(`Server listening on port ${port}.`);
});
