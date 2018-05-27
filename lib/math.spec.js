const expect = require('expect.js');
const {
	degToRad,
	radToDeg,
	calculEarthGeodesic,
	calculNextLatitude,
	calculNextLongitude
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

				expect(+lat.toFixed(6)).to.equal(test.expected);
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

				expect(+lon.toFixed(6)).to.equal(test.expected);
			});
		});
	});
});
