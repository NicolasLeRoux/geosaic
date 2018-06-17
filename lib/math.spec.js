const expect = require('expect.js');
const {
	degToRad,
	radToDeg,
	calculEarthGeodesic,
	calculNextLatitude,
	calculNextLongitude,
	getSmallestDivisor,
	getBiggestDivisor,
	calculCenterErrorOnGivenCicle,
	buildGrid,
	calculMaxStep
} = require('./math.js');

describe(`In the math module,`, () => {
	describe(`The method 'degToRad',`, () => {
		const suite = [
			{
				angle: 1,
				expected: 0.017
			},
			{
				angle: 30,
				expected: 0.524
			},
			{
				angle: 45,
				expected: 0.785
			},
			{
				angle: 60,
				expected: 1.047
			},
			{
				angle: 90,
				expected: 1.571
			}
		];

		suite.forEach(test => {
			it(`Should return ~${test.expected}rad for ${test.angle}°.`, () => {
				const rad = degToRad(test.angle);

				expect(+rad.toFixed(3)).to.equal(test.expected);
			});
		});
	});

	describe(`The method 'radToDeg',`, () => {
		const suite = [
			{
				angle: 0.017,
				expected: 1
			},
			{
				angle: 0.524,
				expected: 30
			},
			{
				angle: 0.785,
				expected: 45
			},
			{
				angle: 1.047,
				expected: 60
			},
			{
				angle: 1.571,
				expected: 90
			}
		];

		suite.forEach(test => {
			it(`Should return ~${test.expected}° for ${test.angle}rad.`, () => {
				const deg = radToDeg(test.angle);

				expect(Math.round(deg)).to.equal(test.expected);
			});
		});
	});

	describe(`The method 'calculEarthGeodesic',`, () => {
		const suite = [
			{
				coordA: {
					lat: 48.827182,
					lon: 2.235062
				},
				coordB: {
					lat: 48.827179,
					lon: 2.235075
				},
				expected: 1
			},
			{
				coordA: {
					lat: 48.829727,
					lon: 2.249323
				},
				coordB: {
					lat: 48.829531,
					lon: 2.249522
				},
				expected: 26
			},
			{
				coordA: {
					lat: 48.847929,
					lon: 2.205667
				},
				coordB: {
					lat: 48.847463,
					lon: 2.211067
				},
				expected: 399
			}
		];

		suite.forEach(test => {
			it(`Should return ${test.expected}m for the given coordinates.`, () => {
				const dist = calculEarthGeodesic(test.coordA, test.coordB);

				expect(dist).to.equal(test.expected);
			});
		});
	});

	describe(`The method 'calculNextLatitude',`, () => {
		const suite = [
			{
				coord: {
					lat: 48.847000,
					lon: 2.205667
				},
				step: 56,
				expected: 48.846497
			}
		];

		suite.forEach((test) => {
			it(`Should return ${test.expected}° latitude for the given inputs.`, () => {
				const lat = calculNextLatitude(test.coord, test.step);

				expect(lat).to.equal(test.expected);
			});
		});
	});

	describe(`The method 'calculNextLongitude',`, () => {
		const suite = [
			{
				coord: {
					lat: 48.847929,
					lon: 2.205000
				},
				step: 73,
				expected: 2.205997
			}
		];

		suite.forEach((test) => {
			it(`Should return ${test.expected}° longitude for the given inputs.`, () => {
				const lon = calculNextLongitude(test.coord, test.step);

				expect(lon).to.equal(test.expected);
			});
		});
	});

	describe(`The method 'getSmallestDivisor',`, () => {
		const suite = [
			{
				number: 10,
				expected: 2
			},
			{
				number: 15,
				expected: 3
			},
			{
				number: 17,
				expected: 17
			}
		];

		suite.forEach((test) => {
			it(`Should return ${test.expected} for the number ${test.number}.`, () => {
				expect(getSmallestDivisor(test.number)).to.equal(test.expected);
			});
		});
	});

	describe(`The method 'getBiggestDivisor',`, () => {
		const suite = [
			{
				number: 10,
				expected: 5
			},
			{
				number: 15,
				expected: 5
			},
			{
				number: 17,
				expected: 1
			}
		];

		suite.forEach((test) => {
			it(`Should return ${test.expected} for the number ${test.number}.`, () => {
				expect(getBiggestDivisor(test.number)).to.equal(test.expected);
			});
		});
	});

	describe(`The method 'calculCenterErrorOnGivenCicle',`, () => {
		const CENTER_COORD = {
			lat: 0,
			lon: 0
		};

		const COORD_01 = {
			lat: 0.0009,
			lon: 0
		};

		const COORD_02 = {
			lat: -0.0009,
			lon: 0
		};

		const COORD_03 = {
			lat: 0,
			lon: 0.0009
		};

		const COORD_04 = {
			lat: 0,
			lon: -0.0009
		};

		it(`Should return 0 if the given center is at radius meter of the given coord.`, () => {
			const error = calculCenterErrorOnGivenCicle([
				COORD_01
			], CENTER_COORD, 100);

			expect(error).to.equal(0);
		});

		it(`Should return 0 if the given center is in the middle of the given coords.`, () => {
			const error = calculCenterErrorOnGivenCicle([
				COORD_01,
				COORD_02,
				COORD_03,
				COORD_04
			], CENTER_COORD, 100);

			expect(error).to.equal(0);
		});

		it(`Should return 2 if the given center is 1m away of the real center.`, () => {
			const error = calculCenterErrorOnGivenCicle([
				COORD_01,
				COORD_02,
				COORD_03,
				COORD_04
			], {
				lat: 0.00001,
				lon: 0.00001
			}, 100);

			expect(error).to.equal(2);
		});
	});

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

	describe(`The method 'calculMaxStep',`, () => {
		it(`Should return 180m for a given radius of 130m.`, () => {
			const step = calculMaxStep(130);

			expect(step).to.equal(180);
		});

		it(`Should return 180m for a given radius of 130m.`, () => {
			const step = calculMaxStep(100);

			expect(step).to.equal(140);
		});

		it(`Should return 180m for a given radius of 130m.`, () => {
			const step = calculMaxStep(140);

			expect(step).to.equal(190);
		});
	});
});
