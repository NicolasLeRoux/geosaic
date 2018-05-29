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

/**
 * TODO...
 */
module.exports.getRootNeighbors = function getRootNeighbors (node, index, array, nbRow) {
	const response = [];

	// Top neighbor
	if (!!array[index - 1] && index % nbRow !== 0) {
		response.push(array[index - 1]);
	}

	// Right neighbor
	if (!!array[index + nbRow]) {
		response.push(array[index + nbRow]);
	}


	// Bottom neighbor
	if (!!array[index + 1] && (index + 1) % nbRow !== 0) {
		response.push(array[index + 1]);
	}

	// Left neighbor
	if (!!array[index - nbRow]) {
		response.push(array[index - nbRow]);
	}

	return response;
}

/**
 * Util to build a GeoTile from a coordinate and a step.
 *
 * Example of GeoTile:
 * {
 *	 coords: [
 *		 {}, // Top Left
 *		 {}, // Top Right
 *		 {}, // Bottom Right
 *		 {}  // Bottom Left
 *	 ],
 *	 step: 100,
 *	 parent: '',
 *	 childs: []
 * }
 * @param coord The coordinate of the top left corne.
 * @param step The size of the side of the geographic square
 * @return A GeoTile for the given inputs
 */
module.exports.buildGeoTile = function buildGeoTile (coord, step) {
	const coords = [coord];
	const nextLat = +calculNextLatitude(coord, step).toFixed(6);
	const nextLon = +calculNextLongitude(coord, step).toFixed(6);

	// Top Right
	coords.push({
		lat: coord.lat,
		lon: nextLon
	});
	// Bottom Right
	coords.push({
		lat: nextLat,
		lon: nextLon
	});
	// Bottom Left
	coords.push({
		lat: nextLat,
		lon: coord.lon
	});

	return {
		coords,
		step
	};
}
