const expect = require('expect.js');
const {
	mapCoordsToGeoTiles
} = require('./reactive.js');

describe(`In the reactive module,`, () => {
	describe(`The method 'mapCoordsToGeoTiles',`, () => {
		it(`Should map to an array of GeoTile.`, () => {
			const step = 100;
			const array = mapCoordsToGeoTiles([
				{
					lat: 0.5,
					lon: 0.5
				}
			], step);

			expect(array.length).to.equal(1);
			expect(array[0].coords.length).to.equal(4);
			expect(array[0].step).to.equal(step);
		})
	});
});
