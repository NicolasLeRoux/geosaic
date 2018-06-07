const {
	calculNextLatitude,
	calculNextLongitude,
	getBiggestDivisor,
    buildGrid
} = require('./math.js');

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
const buildGeoTile = function buildGeoTile (coord, step, id) {
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
};

/**
 * Util to get the center of a GeoTile.
 * @param tile The GeoTile to evaluate
 * @return The coord of the center of the GeoTile
 */
const getCenterCoord = function getCenterCoord (tile) {
	const step = Math.round(tile.step / 2);

	return {
		lat: calculNextLatitude(tile.coords[0], step),
		lon: calculNextLongitude(tile.coords[0], step),
	};
};

/**
 * Util to split a GeoTile in an array of smaller GeoTile.
 * @param tile The GeoTile to split
 * @return An array of smaller GeoTile
 */
const splitGeoTile = function splitGeoTile (tile) {
	const step = getBiggestDivisor(tile.step);
	const array = buildGrid(tile.coords[0], tile.coords[2], step);

	return array.map(coord => {
		return buildGeoTile(coord, step);
	});
};


module.exports = {
	buildGeoTile,
	getCenterCoord,
    splitGeoTile
};
