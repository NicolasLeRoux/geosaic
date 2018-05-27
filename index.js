const {
	calculNextLatitude,
	calculNextLongitude
} = require('./lib/math.js');

/**
 * Method to build a grid from 2 geolocations.
 * @param coordStart The up left corner of the rectangle
 * @param coordEnd The bottom right corner of the rectangle
 * @param length The length of the square side
 * @return A grid of square
 */
module.exports.buildGrid = function buildGrid (coordStart, coordEnd, step) {
	const result = [];
	let lat = coordStart.lat,
		lon = coordStart.lon,
		coord;

	while (lat >= coordEnd.lat) {
		while (lon <= coordEnd.lon) {
			coord = {
				lat,
				lon
			};
			result.push(coord);

			lon = calculNextLongitude(coord, step);
		}
		lat = calculNextLatitude(coord, step);
		lon = coordStart.lon;
	}

	return result;
}
