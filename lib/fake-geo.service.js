const { calculEarthGeodesic } = require('./math.js');
const { of } = require('rxjs');

/**
 * TODO...
 */
module.exports = class FakeGeoService {
	constructor(opts) {
		this.radius = opts.radius;
		this.points = opts.points;
	}

	query(coord) {
		let result = false;

		for (let i = 0, length = this.points.length; i < length; i++) {
			const dist = calculEarthGeodesic(this.points[i], coord);

			if (dist <= this.radius) {
				result = true;

				break;
			}
		}

		return of(result);
	}
};
