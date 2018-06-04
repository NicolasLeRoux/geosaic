const expect = require('expect.js');
const FakeGeoService = require('./fake-geo.service.js');

describe(`In the fake-geo-service module,`, () => {
	let geoSrv;

	describe(`The method 'query' with only one interest point,`, () => {

		beforeEach(() => {
			geoSrv = new FakeGeoService({
				radius: 100,
				points: [
					{
						lat: 48.853489,
						lon: 2.349937
					}
				]
			});
		});

		const suite = [
			{
				// Same geographic coordinate
				coord: {
					lat: 48.853489,
					lon: 2.349937
				},
				expected: true
			},
			{
				// Around 10 meter
				coord: {
					lat: 48.853420,
					lon: 2.349937
				},
				expected: true
			},
			{
				// Around 50 meter
				coord: {
					lat: 48.853000,
					lon: 2.349937
				},
				expected: true
			},
			{
				// A little less than 100 meter
				coord: {
					lat: 48.852600,
					lon: 2.349937
				},
				expected: true
			},
			{
				// A little more than 100 meter
				coord: {
					lat: 48.852580,
					lon: 2.349937
				},
				expected: false
			},
			{
				// Around 150 meter
				coord: {
					lat: 48.852100,
					lon: 2.349937
				},
				expected: false
			}
		];

		suite.forEach((test) => {
			it(`Should return ${test.expected} for the given input.`, (done) => {
				geoSrv.query(test.coord)
					.subscribe(val => {
						expect(val).to.equal(test.expected);
						done();
					});
			});
		});
	});
});
