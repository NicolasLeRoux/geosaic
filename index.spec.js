const expect = require('expect.js');
const {
	buildGrid
} = require('./index.js');

describe(`The method 'buildGrid',`, () => {
	it(`Should have the first grid `, () => {
		const coordStart = {
			lat: 50.000000,
			lon: 2.000000
		};
		const coordEnd = {
			lat: 48.853489,
			lon: 2.349937
		};
		const grid = buildGrid(coordStart, coordEnd);

		expect(grid[0].coord).to.equal({
			lat: 48.853489,
			lon: 2.349937
		});
	});
});
