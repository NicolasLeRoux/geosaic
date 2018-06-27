const {
	buildGrid,
	calculMaxStep
} = require('./lib/math.js');
const path = require('path');
const fs = require('fs');
const { of, from, Subject } = require('rxjs');
const { concatMap, mergeMap, reduce, tap } = require('rxjs/operators');
const BigQuery = require('@google-cloud/bigquery');
const Datastore = require('@google-cloud/datastore');
require('dotenv').config();

const coordStart = {
	lat: +process.argv[2],
	lon: +process.argv[3]
};

const coordEnd = {
	lat: +process.argv[4],
	lon: +process.argv[5]
};

const radius = +process.argv[6];

if (!coordStart.lat || !coordStart.lon || !coordEnd.lat || !coordEnd.lon || !radius) {
	throw new Error('Missing input parameters...');
}

const step = calculMaxStep(radius);
const array = buildGrid(coordStart, coordEnd, step);

console.info(`There is ${array.length} point to process for this request !`);

const rate = 30;
const timeNeededInDays = array.length * rate / (60 * 60 * 24);
console.info(`At a ${rate}s rate, it will take ${timeNeededInDays.toFixed(2)} days.`);

const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)){
	fs.mkdirSync(tmpDir);
}

/*
const stream = fs.createWriteStream(path.join(__dirname, './tmp/coords_to_process.csv'));
stream.once('open', () => {
	array.forEach(coord => {
		stream.write(`${coord.lat},${coord.lon}\n`);
	});

	stream.end();
});

const datasetId = 'invaders';
const tableId = 'coords_to_process';
const filename = './tmp/coords_to_process.csv';

// Creates a client
const bigquery = new BigQuery({
	projectId: process.env.PROJECT_ID,
	keyFilename: 'keyfile.json'
});

bigquery
	.dataset(datasetId)
	.table(tableId)
	.load(filename)
	.then(results => {
		const job = results[0];

		// load() waits for the job to finish
		console.log(`Job ${job.id} completed.`);

		// Check the job's status for errors
		const errors = job.status.errors;
		if (errors && errors.length > 0) {
			throw errors;
		} else {
			fs.unlink(path.join(__dirname, filename), (err) => {
				if (err) console.error(err);
				console.log('The temporary file has been deleted!');
			});
		}
	})
	.catch(err => {
		console.error('ERROR:', err);
	});
*/

const saveToDataStore = function (coord) {
    const sbj = new Subject();
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
                value: coord.lat
            },
            {
                name: 'lng',
                value: coord.lon
            }
        ]
    };

    datastore
        .save(entity)
        .then(() => {
            sbj.next(coord);
        })
        .catch(err => {
            sbj.error(err);
        });

    return sbj.asObservable();
};

from(array)
    .pipe(
        concatMap(coord => saveToDataStore(coord)),
        tap(coord => console.info(`The coord ${coord.lat}, ${coord.lon} have been saved.`))
    )
    .subscribe(coord => {
        console.info('--- END ---');
    },
    err => {
        console.error(err);
    });
