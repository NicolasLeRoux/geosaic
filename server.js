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
const Datastore = require('@google-cloud/datastore');

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
		keyFilename: 'keyfiles/bigquery.json'
	});
	const datastore = new Datastore({
		projectId: process.env.PROJECT_ID,
		keyFilename: 'keyfiles/datastore.json'
	});

	// Only process from appengine cron
	if (isCron || true) {
		const query = datastore.createQuery('coord-to-process')
			.limit(1);

		datastore
			.runQuery(query)
			.then(results => {
				const rows = results[0];

				if (!!rows.length) {
					const key = rows[0][datastore.KEY];
					const srv = new InvaderGeoService();
					return srv.query({
							lat: +rows[0].lat,
							lon: +rows[0].lng,
							key
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
						console.info(`The coord ${point.lat}, ${point.lon} have been save in processed data.`);
						return point;
					});
			})
			// Delete coord to process
			.then(point => {
				return datastore
					.delete(point.key);
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

app.get('/api/process-given-coord/:lat/:lng/', (req, res) => {
	const coord = {
		lat: +req.params.lat,
		lon: +req.params.lng
	};
	const srv = new InvaderGeoService();
	const bigquery = new BigQuery({
		projectId: process.env.PROJECT_ID,
		keyFilename: 'keyfiles/bigquery.json'
	});

	srv.query(coord)
		.toPromise()
		.then(point => {
			return bigquery
				.query({
					query: insertProcessedCoord(point),
					useLegacySql: false
				})
				.then(results => {
					console.info(`The coord ${point.lat}, ${point.lon} have been save in processed data.`);
					return point;
				});
		})
		.then(results => {
			console.info('\n---');
		})
		.catch(err => {
			console.error('ERROR:', err);
		});

	res.status(202)
		.send('Done!');
});

app.get('/api/processed/:latA/:lonA/:latB/:lonB', (req, res) => {
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
		keyFilename: 'keyfiles/bigquery.json'
	});
	const sqlQuery = `SELECT
		latitude,longitude,state
		FROM \`geosaic-207514.invaders.processed_coords\`
		WHERE latitude<=${start.lat}
		AND latitude>=${end.lat}
		AND longitude>=${start.lon}
		AND longitude<=${end.lon}
		LIMIT 1000`;
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

app.get('/api/hits', (req, res) => {
	const bigquery = new BigQuery({
		projectId: process.env.PROJECT_ID,
		keyFilename: 'keyfiles/bigquery.json'
	});
	const sqlQuery = `SELECT
		latitude,longitude,state
		FROM \`geosaic-207514.invaders.processed_coords\`
		WHERE state=true
		LIMIT 1000`;
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

app.get('/api/test', (req, res) => {
    const datastore = new Datastore({
		projectId: process.env.PROJECT_ID,
		keyFilename: 'keyfiles/datastore.json'
    });
    const taskKey = datastore.key('coord-to-process');
    const entity = {
        key: taskKey,
        data: [
            {
                name: 'lat',
                value: 48.777562
            },
            {
                name: 'lng',
                value: 2.284789
            }
        ]
    };
    const query = datastore.createQuery('Coord');

    datastore
    .runQuery(query)
    .then(results => {
      const tasks = results[0];

      console.log('Tasks:', tasks);
	  console.log('\n');
      tasks.forEach(task => {
        const taskKey = task[datastore.KEY];
        console.log(taskKey.id, task);
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

    datastore
        .save(entity)
        .then(() => {
            console.log(`Task ${taskKey.id} created successfully.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });

	res.status(202)
		.send('Done!');
});

/**
 * Starting server
 */
const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.info(`Server listening on port ${port}.`);
});
