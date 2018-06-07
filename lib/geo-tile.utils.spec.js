const expect = require('expect.js');
const {
	buildGeoTile,
	getCenterCoord,
    splitGeoTile
} = require('./geo-tile.utils.js');
const {
	calculNextLatitude,
	calculNextLongitude
} = require('./math.js');

describe(`In the geo-tile utilities module,`, () => {
	describe(`The method 'buildGeoTile',`, () => {
		it(`Should have the first item in coords array same as the given coord.`, () => {
			const tile = buildGeoTile({
				lat: 40,
				lon: 2
			}, 100);

			expect(tile.coords[0].lat).to.equal(40);
			expect(tile.coords[0].lon).to.equal(2);
		});

		it(`Should have the step value same as the given step.`, () => {
			const tile = buildGeoTile({
				lat: 40,
				lon: 2
			}, 113);

			expect(tile.step).to.equal(113);
		});

		const suite = [
			{
				lat: 0,
				lon: 0,
				step: 100,
				idx: 1,
				expectedLat: 0,
				expectedLon: 0.000898,
			},
			{
				lat: 0,
				lon: 0,
				step: 100,
				idx: 2,
				expectedLat: -0.000898,
				expectedLon: 0.000898
			},
			{
				lat: 0,
				lon: 0,
				step: 100,
				idx: 3,
				expectedLat: -0.000898,
				expectedLon: 0,
			},
			{
				lat: 50,
				lon: 2,
				step: 130,
				idx: 2,
				expectedLat: 49.998832,
				expectedLon: 2.001817
			}
		];

		suite.forEach(test => {
			it(`Should have lat=${test.expectedLat} & lon=${test.expectedLon} at the index ${test.idx}.`, () => {
				const tile = buildGeoTile({
					lat: test.lat,
					lon: test.lon
				}, test.step);

				expect(tile.coords[test.idx].lat).to.equal(test.expectedLat);
				expect(tile.coords[test.idx].lon).to.equal(test.expectedLon);
			});
		});

		it(`Should have the given ID in params.`, () => {
			const tile = buildGeoTile({
				lat: 40,
				lon: 2
			}, 100, 33);

			expect(tile.id).to.equal(33);
		});
	});

	describe(`The method 'getCenterCoord',`, () => {
		const GEO_TILE_CENTER = {
			step: 100,
			coords: [
				{
					lat: 0.05,
					lon: 0.05
				}
			]
		};

		it(`Should return the center coord of the tile.`, () => {
			const coord = getCenterCoord(GEO_TILE_CENTER);

			expect(coord).to.eql({
				lat: calculNextLatitude(GEO_TILE_CENTER.coords[0], 50),
				lon: calculNextLongitude(GEO_TILE_CENTER.coords[0], 50)
			});
		});
	});

	describe(`The method 'splitGeoTile',`, () => {
		const step_100 = 100;
		const step_25 = 25;
		const coordStart = {
			lat: 0.05,
			lon: 0.05
		};

		const GEO_TILE_TO_SPLIT_01 = {
			id: 'step_100',
			step: step_100,
			coords: [
				coordStart,
				null,
				{
					lat: calculNextLatitude(coordStart, step_100),
					lon: calculNextLongitude(coordStart, step_100)
				}
			]
		};

		const GEO_TILE_TO_SPLIT_02 = {
			id: 'step_25',
			step: step_25,
			coords: [
				coordStart,
				null,
				{
					lat: calculNextLatitude(coordStart, step_25),
					lon: calculNextLongitude(coordStart, step_25)
				}
			]
		};

		it(`Should split the tile in 4 elements.`, () => {
			const array = splitGeoTile(GEO_TILE_TO_SPLIT_01);

			expect(array.length).to.equal(4);
		});

		it(`Should split the tile in element with a step of 50.`, () => {
			const array = splitGeoTile(GEO_TILE_TO_SPLIT_01);

			expect(array[0].step).to.equal(50);
		});

		it(`Should have the same bottom right corner.`, () => {
			const array = splitGeoTile(GEO_TILE_TO_SPLIT_01);

			expect(array[3].coords[2]).to.eql(GEO_TILE_TO_SPLIT_01.coords[2]);
		});

		it(`Should split the tile in 25 elements.`, () => {
			const array = splitGeoTile(GEO_TILE_TO_SPLIT_02);

			expect(array.length).to.equal(25);
		});

		it(`Should split the tile in element with a step of 5.`, () => {
			const array = splitGeoTile(GEO_TILE_TO_SPLIT_02);

			expect(array[0].step).to.equal(5);
		});
	});
});
