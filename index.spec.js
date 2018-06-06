const expect = require('expect.js');
const {
	buildGrid,
	getNeighbors,
	isAdjacentLatitude,
	isAdjacentLongitude,
	isTopCornerInsideTileBandLatitude,
	isBottomCornerInsideTileBandLatitude,
	isLeftCornerInsideTileBandLongitude,
	isRightCornerInsideTileBandLongitude,
	isTileBandLatitudeInsideBiggerTile,
	isTileBandLongitudeInsideBiggerTile,
	isSmallerTileInsideTileBandLatitude,
	isSmallerTileInsideTileBandLongitude,
	splitGeoTile,
	run
} = require('./index.js');
const {
	calculEarthGeodesic,
	calculNextLatitude,
	calculNextLongitude
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

	const GEO_TILE_01_01 = {
		id: '01_01',
		coords: [
			{
				lat: 0.05,
				lon: 0.05
			},
			{
				lat: 0.05,
				lon: 0.06
			},
			{
				lat: 0.06,
				lon: 0.06
			},
			{
				lat: 0.06,
				lon: 0.05
			}
		]
	};

	const GEO_TILE_01_02 = {
		id: '01_02',
		coords: [
			{
				lat: 0.05,
				lon: 0.06
			},
			{
				lat: 0.05,
				lon: 0.07
			},
			{
				lat: 0.06,
				lon: 0.07
			},
			{
				lat: 0.06,
				lon: 0.06
			}
		]
	};

	const GEO_TILE_01_03 = {
		id: '01_03',
		coords: [
			{
				lat: 0.05,
				lon: 0.07
			},
			{
				lat: 0.05,
				lon: 0.08
			},
			{
				lat: 0.06,
				lon: 0.08
			},
			{
				lat: 0.06,
				lon: 0.07
			}
		]
	};

	const GEO_TILE_02_01 = {
		id: '02_01',
		coords: [
			{
				lat: 0.06,
				lon: 0.05
			},
			{
				lat: 0.06,
				lon: 0.06
			},
			{
				lat: 0.07,
				lon: 0.06
			},
			{
				lat: 0.07,
				lon: 0.05
			}
		]
	};

	const GEO_TILE_02_02 = {
		id: '02_02',
		coords: [
			{
				lat: 0.06,
				lon: 0.06
			},
			{
				lat: 0.06,
				lon: 0.07
			},
			{
				lat: 0.07,
				lon: 0.07
			},
			{
				lat: 0.07,
				lon: 0.06
			}
		]
	};

	const GEO_TILE_02_03 = {
		id: '02_03',
		coords: [
			{
				lat: 0.06,
				lon: 0.07
			},
			{
				lat: 0.06,
				lon: 0.08
			},
			{
				lat: 0.07,
				lon: 0.08
			},
			{
				lat: 0.07,
				lon: 0.07
			}
		]
	};

	const GEO_TILE_03_01 = {
		id: '03_01',
		coords: [
			{
				lat: 0.07,
				lon: 0.05
			},
			{
				lat: 0.07,
				lon: 0.06
			},
			{
				lat: 0.08,
				lon: 0.06
			},
			{
				lat: 0.08,
				lon: 0.05
			}
		]
	};

	const GEO_TILE_03_02 = {
		id: '03_02',
		coords: [
			{
				lat: 0.07,
				lon: 0.06
			},
			{
				lat: 0.07,
				lon: 0.07
			},
			{
				lat: 0.08,
				lon: 0.07
			},
			{
				lat: 0.08,
				lon: 0.06
			}
		]
	};

	const GEO_TILE_03_03 = {
		id: '03_03',
		coords: [
			{
				lat: 0.07,
				lon: 0.07
			},
			{
				lat: 0.07,
				lon: 0.08
			},
			{
				lat: 0.08,
				lon: 0.08
			},
			{
				lat: 0.08,
				lon: 0.07
			}
		]
	};

	const GEO_TILE_2x_01_01 = {
		id: '2x_01_01',
		coords: [
			{
				lat: 0.05,
				lon: 0.05
			},
			{
				lat: 0.05,
				lon: 0.07
			},
			{
				lat: 0.07,
				lon: 0.07
			},
			{
				lat: 0.07,
				lon: 0.05
			}
		]
	};

	const GEO_TILE_3x_01_03 = {
		id: '3x_01_03',
		coords: [
			{
				lat: 0.05,
				lon: 0.07
			},
			{
				lat: 0.05,
				lon: 0.10
			},
			{
				lat: 0.08,
				lon: 0.10
			},
			{
				lat: 0.08,
				lon: 0.07
			}
		]
	};

	describe(`The method 'getNeighbors',`, () => {
		it(`Should return an empty array other geoTile.`, () => {
			const array = getNeighbors([
				GEO_TILE_01_01
			], GEO_TILE_01_01);

			expect(array.length).to.equal(0);
		});

		it(`Should return one element if there is a tile is on the right.`, () => {
			const array = getNeighbors([
				GEO_TILE_02_03
			], GEO_TILE_02_02);

			expect(array.length).to.equal(1);
			expect(array[0].id).to.equal('02_03');
		});

		it(`Should return one element if there is a tile is on the bottom.`, () => {
			const array = getNeighbors([
				GEO_TILE_03_02
			], GEO_TILE_02_02);

			expect(array.length).to.equal(1);
			expect(array[0].id).to.equal('03_02');
		});

		it(`Should return one element if there is a tile is on the left.`, () => {
			const array = getNeighbors([
				GEO_TILE_02_01
			], GEO_TILE_02_02);

			expect(array.length).to.equal(1);
			expect(array[0].id).to.equal('02_01');
		});

		it(`Should return one element if there is a tile is on the top.`, () => {
			const array = getNeighbors([
				GEO_TILE_01_02
			], GEO_TILE_02_02);

			expect(array.length).to.equal(1);
			expect(array[0].id).to.equal('01_02');
		});

		it(`Should return only 4 éléments for a full grid.`, () => {
			const array = getNeighbors([
				GEO_TILE_01_01,
				GEO_TILE_01_02,
				GEO_TILE_01_03,
				GEO_TILE_02_01,
				GEO_TILE_02_02,
				GEO_TILE_02_03,
				GEO_TILE_03_01,
				GEO_TILE_03_02,
				GEO_TILE_03_03
			], GEO_TILE_02_02);

			expect(array.length).to.equal(4);
			expect(array[0].id).to.equal('01_02');
			expect(array[1].id).to.equal('02_01');
			expect(array[2].id).to.equal('02_03');
			expect(array[3].id).to.equal('03_02');
		});

		it(`Should return 4 éléments for a big tile.`, () => {
			const array = getNeighbors([
				GEO_TILE_2x_01_01,
				GEO_TILE_01_03,
				GEO_TILE_02_03,
				GEO_TILE_03_01,
				GEO_TILE_03_02,
				GEO_TILE_03_03
			], GEO_TILE_2x_01_01);

			expect(array.length).to.equal(4);
			expect(array[0].id).to.equal('01_03');
			expect(array[1].id).to.equal('02_03');
			expect(array[2].id).to.equal('03_01');
			expect(array[3].id).to.equal('03_02');
		});

		it(`Should return 3 éléments for a bigger tile.`, () => {
			const array = getNeighbors([
				GEO_TILE_3x_01_03,
				GEO_TILE_01_01,
				GEO_TILE_01_02,
				GEO_TILE_02_01,
				GEO_TILE_02_02,
				GEO_TILE_03_01,
				GEO_TILE_03_02
			], GEO_TILE_3x_01_03);

			expect(array.length).to.equal(3);
			expect(array[0].id).to.equal('01_02');
			expect(array[1].id).to.equal('02_02');
			expect(array[2].id).to.equal('03_02');
		});
	});

	describe(`The method 'isAdjacentLatitude',`, () => {
		it(`Should be true if the top side are on the same latitude.`, () => {
			expect(isAdjacentLatitude(GEO_TILE_02_02, GEO_TILE_01_01)).to.be.ok();
		});

		it(`Should be true if the bottom side are on the same latitude.`, () => {
			expect(isAdjacentLatitude(GEO_TILE_02_02, GEO_TILE_03_03)).to.be.ok();
		});

		it(`Should be false if the top or the bottom side are on different latitude.`, () => {
			expect(isAdjacentLatitude(GEO_TILE_01_01, GEO_TILE_03_03)).not.to.be.ok();
		});
	});

	describe(`The method 'isAdjacentLongitude',`, () => {
		it(`Should be true if the top side are on the same latitude.`, () => {
			expect(isAdjacentLongitude(GEO_TILE_02_02, GEO_TILE_01_01)).to.be.ok();
		});

		it(`Should be true if the bottom side are on the same latitude.`, () => {
			expect(isAdjacentLongitude(GEO_TILE_02_02, GEO_TILE_03_03)).to.be.ok();
		});

		it(`Should be false if the top or the bottom side are on different latitude.`, () => {
			expect(isAdjacentLongitude(GEO_TILE_01_01, GEO_TILE_03_03)).not.to.be.ok();
		});
	});

	describe(`The method 'isTopCornerInsideTileBandLatitude',`, () => {
		it(`Should be true for 2 GeoTiles on the same latitude.`, () => {
			expect(isTopCornerInsideTileBandLatitude(GEO_TILE_01_01, GEO_TILE_01_02)).to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different latitude.`, () => {
			expect(isTopCornerInsideTileBandLatitude(GEO_TILE_01_01, GEO_TILE_02_02)).not.to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different latitude (by far).`, () => {
			expect(isTopCornerInsideTileBandLatitude(GEO_TILE_01_01, GEO_TILE_03_03)).not.to.be.ok();
		});
	});

	describe(`The method 'isBottomCornerInsideTileBandLatitude',`, () => {
		it(`Should be true for 2 GeoTiles on the same latitude.`, () => {
			expect(isBottomCornerInsideTileBandLatitude(GEO_TILE_01_01, GEO_TILE_01_02)).to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different latitude.`, () => {
			expect(isBottomCornerInsideTileBandLatitude(GEO_TILE_01_01, GEO_TILE_02_02)).not.to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different latitude  (by far).`, () => {
			expect(isBottomCornerInsideTileBandLatitude(GEO_TILE_01_01, GEO_TILE_03_03)).not.to.be.ok();
		});
	});

	describe(`The method 'isLeftCornerInsideTileBandLongitude',`, () => {
		it(`Should be true for 2 GeoTiles on the same longitude.`, () => {
			expect(isLeftCornerInsideTileBandLongitude(GEO_TILE_01_01, GEO_TILE_02_01)).to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different longitude.`, () => {
			expect(isLeftCornerInsideTileBandLongitude(GEO_TILE_01_01, GEO_TILE_02_02)).not.to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different longitude (by far).`, () => {
			expect(isLeftCornerInsideTileBandLongitude(GEO_TILE_01_01, GEO_TILE_03_03)).not.to.be.ok();
		});
	});

	describe(`The method 'isRightCornerInsideTileBandLongitude',`, () => {
		it(`Should be true for 2 GeoTiles on the same longitude.`, () => {
			expect(isRightCornerInsideTileBandLongitude(GEO_TILE_01_01, GEO_TILE_02_01)).to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different longitude.`, () => {
			expect(isRightCornerInsideTileBandLongitude(GEO_TILE_01_01, GEO_TILE_02_02)).not.to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different longitude  (by far).`, () => {
			expect(isRightCornerInsideTileBandLongitude(GEO_TILE_01_01, GEO_TILE_03_03)).not.to.be.ok();
		});
	});

	describe(`The method 'isTileBandLatitudeInsideBiggerTile',`, () => {
		it(`Should be true for 2 GeoTiles on the same longitude.`, () => {
			expect(isTileBandLatitudeInsideBiggerTile(GEO_TILE_01_01, GEO_TILE_01_02)).to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different longitude.`, () => {
			expect(isTileBandLatitudeInsideBiggerTile(GEO_TILE_01_01, GEO_TILE_02_02)).not.to.be.ok();
		});
	});

	describe(`The method 'isTileBandLongitudeInsideBiggerTile',`, () => {
		it(`Should be true for 2 GeoTiles on the same longitude.`, () => {
			expect(isTileBandLongitudeInsideBiggerTile(GEO_TILE_01_01, GEO_TILE_02_01)).to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different longitude.`, () => {
			expect(isTileBandLongitudeInsideBiggerTile(GEO_TILE_01_01, GEO_TILE_02_02)).not.to.be.ok();
		});
	});

	describe(`The method 'isSmallerTileInsideTileBandLatitude',`, () => {
		it(`Should be true for 2 GeoTiles on the same longitude.`, () => {
			expect(isSmallerTileInsideTileBandLatitude(GEO_TILE_01_01, GEO_TILE_01_02)).to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different longitude.`, () => {
			expect(isSmallerTileInsideTileBandLatitude(GEO_TILE_01_01, GEO_TILE_02_02)).not.to.be.ok();
		});
	});

	describe(`The method 'isSmallerTileInsideTileBandLongitude',`, () => {
		it(`Should be true for 2 GeoTiles on the same longitude.`, () => {
			expect(isSmallerTileInsideTileBandLongitude(GEO_TILE_01_01, GEO_TILE_02_01)).to.be.ok();
		});

		it(`Should be false for 2 GeoTiles on different longitude.`, () => {
			expect(isSmallerTileInsideTileBandLongitude(GEO_TILE_01_01, GEO_TILE_02_02)).not.to.be.ok();
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

	describe(`The method 'run',`, () => {
		it(`Should ...`, (done) => {
			run().subscribe(tiles => {
				done();
			});
		})
	});
});
