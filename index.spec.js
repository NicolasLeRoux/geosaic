const expect = require('expect.js');
const {
	run
} = require('./index.js');

describe(`In the index module,`, () => {
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
