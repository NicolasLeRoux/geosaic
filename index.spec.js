const expect = require('expect.js');
const {
	buildGrid,
	getRootNeighbors,
	buildGeoTile
} = require('./index.js');
const {
	calculEarthGeodesic
} = require('./lib/math.js');

describe(`In the index module,`, () => {
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

	describe(`The method 'getRootNeighbors',`, () => {
		const PARENT_NODE_01 = {
			id: 1,
			coord: {
				lat: 0,
				lon: 0
			},
			step: 100,
			parent: null,
			childs: [
			]
		};

		const PARENT_NODE_02 = {
			id: 2,
			coord: {
				lat: 0,
				lon: 0
			},
			step: 100,
			parent: null,
			childs: [
			]
		};

		const PARENT_NODE_03 = {
			id: 3,
			coord: {
				lat: 0,
				lon: 0
			},
			step: 100,
			parent: null,
			childs: [
			]
		};

		const PARENT_NODE_04 = {
			id: 4,
			coord: {
				lat: 0,
				lon: 0
			},
			step: 100,
			parent: null,
			childs: [
			]
		};

		it(`Should return 0 if the node doesn't have any root neighbors.`, () => {
			const neighbors = getRootNeighbors(PARENT_NODE_01, 0, [], 1);

			expect(neighbors.length).to.equal(0);
		});

		it(`Should return 2 root neighbors for the given node.`, () => {
			const neighbors = getRootNeighbors(PARENT_NODE_01, 0, [
				PARENT_NODE_01,
				PARENT_NODE_02,
				PARENT_NODE_03,
				PARENT_NODE_04
			], 2);

			expect(neighbors.length).to.equal(2);
			expect(neighbors[0].id).to.equal(3);
			expect(neighbors[1].id).to.equal(2);
		});

		it(`Should return 2 root neighbors for the given node (bis).`, () => {
			const neighbors = getRootNeighbors(PARENT_NODE_03, 2, [
				PARENT_NODE_01,
				PARENT_NODE_02,
				PARENT_NODE_03,
				PARENT_NODE_04
			], 2);

			expect(neighbors.length).to.equal(2);
			expect(neighbors[0].id).to.equal(4);
			expect(neighbors[1].id).to.equal(1);
		});
	});

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
	});
});
