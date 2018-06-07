const expect = require('expect.js');
const {
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
	run
} = require('./index.js');
const {
	calculEarthGeodesic,
	calculNextLatitude,
	calculNextLongitude
} = require('./lib/math.js');

describe(`In the index module,`, () => {
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

	describe(`The method 'run',`, () => {
		it(`Should ...`, (done) => {
			const start = {
				lat: 51.509,
				lon: -0.08
			};
			const end = {
				lat: 51.503,
				lon: -0.06
			};
			const step = 100;

			run(start, end, step).subscribe(tiles => {
				done();
			});
		})
	});
});
