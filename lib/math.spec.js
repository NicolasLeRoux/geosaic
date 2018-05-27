const expect = require('expect.js');
const {
	degToRad,
	calculEarthGeodesic
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

});
