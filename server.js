const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const {
	run
} = require('./index.js');
const {
	buildGeoTile
} = require('./lib/geo-tile.utils.js');
require('dotenv').config();
const BigQuery = require('@google-cloud/bigquery');
const InvaderGeoService = require('./lib/invader-geo.service.js');
const {
	insertProcessedCoord,
	deleteCoordToProcess
} = require('./lib/query.js');
require('dotenv').config();

let app = express(),
	server = http.createServer(app);

app.get('/', (req, res) => {
	//res.sendFile(path.join(__dirname, 'index.html'));
	fs.readFile(path.join(__dirname, 'index.html'), 'utf8', function (err, data) {
		const result = data.replace(/%%LEAFLET_TOKEN%%/g, process.env.LEAFLET_TOKEN);

		res.send(result);
	});
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

app.get('/api/process-next-coord', (req, res) => {
	const isCron = req.get('X-Appengine-Cron');
	const bigquery = new BigQuery({
		projectId: process.env.PROJECT_ID,
		keyFilename: 'keyfile.json'
	});
	const sqlQuery = `SELECT
		latitude,longitude
		FROM \`geosaic-207514.invaders.coords_to_process\`
		LIMIT 1`;
	const readOptions = {
		query: sqlQuery,
		useLegacySql: false
	};

	// Only process from appengine cron
	if (isCron || true) {
		bigquery
		.query(readOptions)
		.then(results => {
			const rows = results[0];
			console.info(rows);

			if (!!rows.length) {
				const srv = new InvaderGeoService();
				return srv.query({
						lat: +rows[0].latitude,
						lon: +rows[0].longitude
					})
					.toPromise();
			}

			return undefined;
		})
		// Insert new coord in processed table
		.then(point => {
			return bigquery
				.query({
					query: insertProcessedCoord(point),
					useLegacySql: false
				})
				.then(results => {
					console.info('A new coord have been save in processed data.');
					return point;
				});
		})
		// Delete coord to process
		.then(point => {
			return bigquery
				.query({
					query: deleteCoordToProcess(point),
					useLegacySql: false
				});
		})
		.then(results => {
			console.info('The processed coord have been remove from the coord to process.\n---');
		})
		.catch(err => {
			console.error('ERROR:', err);
		});
	}

	res.status(202)
		.send('Done!');
});

app.get('/api/hits/:latA/:lonA/:latB/:lonB', (req, res) => {
	const start = {
		lat: +req.params.latA,
		lon: +req.params.lonA
	};
	const end = {
		lat: +req.params.latB,
		lon: +req.params.lonB
	};

	const bigquery = new BigQuery({
		projectId: process.env.PROJECT_ID,
		keyFilename: 'keyfile.json'
	});
	const sqlQuery = `SELECT
		latitude,longitude,state
		FROM \`geosaic-207514.invaders.processed_coords\`
		WHERE latitude<=${start.lat}
		AND latitude>=${end.lat}
		AND longitude>=${start.lon}
		AND longitude<=${end.lon}
		LIMIT 100`;
	const readOptions = {
		query: sqlQuery,
		useLegacySql: false
	};

	bigquery
		.query(readOptions)
		.then(results => {
			const rows = results[0];

			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(rows));
		})
		.catch(err => {
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
