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
module.exports.buildGeoTile = function buildGeoTile (coord, step, id) {
	const coords = [coord];
	const nextLat = calculNextLatitude(coord, step)
	const nextLon = calculNextLongitude(coord, step);

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
		id,
		coords,
		step
	};
}

/**
 * Util to return an array of neighbors for a given GeoTile.
 * @param geoTiles An array of all GeoTile to compute
 * @param current The GoeTile to analyze
 * @return The array of neighbors
 */
module.exports.getNeighbors = function getNeighbors (geoTiles, current) {
    return geoTiles.filter(tile => {
        let result = false;

        // Remove current element
        if (current.id === tile.id) {
            return false;
        }

        // Tiles on the same longitude

        // Tiles on the same latitude

        return result;
    });
}

/**
 * Util to evaluate if the given tiles have a side on the same latitude.
 * @param tileA The first tile
 * @param tileB The second tile
 * @return A boolean...
 */
module.exports.isSameLatitude = function isSameLatitude (tileA, tileB) {
    return false;
}

/**
 * Util to evaluate if the given tiles have a side on the same longitude.
 * @param tileA The first tile
 * @param tileB The second tile
 * @return A boolean...
 */
module.exports.isSameLongitude = function isSameLongitude (tileA, tileB) {
    return false;
}
