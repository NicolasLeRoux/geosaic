const expect = require('expect.js');
const {
	buildGrid
} = require('./index.js');
const {
	calculEarthGeodesic
} = require('./lib/math.js');

describe(`The method 'buildGrid',`, () => {
	const coordStart01 = {
		lat: 50.001000,
		lon: 2.000000
	};
	const coordEnd01 = {
		lat: 50.000000,
		lon: 2.002000
	};

	it(`Should contain the starting coordinate as first element.`, () => {
		const grid = buildGrid(coordStart01, coordEnd01, 200);

		expect(grid[0]).to.eql(coordStart01);
	});

	it(`Should only contain 1 element with a step of 200 meter.`, () => {
		const grid = buildGrid(coordStart01, coordEnd01, 200);

		expect(grid.length).to.equal(1);
	});

	it(`Should only contain 9 element with a step of 50 meter.`, () => {
		const grid = buildGrid(coordStart01, coordEnd01, 50);

		expect(grid.length).to.equal(9);
	});

	it(`Should have a distance of 100 meter between the 1th and 3th element.`, () => {
		const grid = buildGrid(coordStart01, coordEnd01, 50);
		const dist = calculEarthGeodesic(grid[0], grid[2]);

		expect(dist).to.equal(100);
	});

	it(`Should have a distance of 100 meter between the 1th and 7th element.`, () => {
		const grid = buildGrid(coordStart01, coordEnd01, 50);
		const dist = calculEarthGeodesic(grid[0], grid[6]);

		expect(dist).to.equal(100);
	});

	it(`Should return an empty grid if the coord are inverted.`, () => {
		const grid = buildGrid(coordEnd01, coordStart01, 50);

		expect(grid.length).to.equal(0);
	});
});
