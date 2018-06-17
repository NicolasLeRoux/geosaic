const {
	buildGrid,
	calculMaxStep
} = require('./lib/math.js');
const path = require('path');
const fs = require('fs');

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

console.info(`There is ${array.length} to process for this request !`);

const rate = 10;
const timeNeededInDays = array.length * rate / (60 * 60 * 24);
console.info(`At a ${rate}s rate, it will take ${timeNeededInDays.toFixed(2)} days.`);

const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)){
	fs.mkdirSync(tmpDir);
}

const stream = fs.createWriteStream(path.join(__dirname, './tmp/coords_to_process.csv'));
stream.once('open', () => {
	array.forEach(coord => {
		stream.write(`${coord.lat},${coord.lon}\n`);
	});

	stream.end();
});

fs.unlink(path.join(__dirname, './tmp/coords_to_process.csv'), (err) => {
	if (err) console.error(err);
	console.log('The temporary file has been deleted!');
});
