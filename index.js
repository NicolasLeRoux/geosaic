const {
	calculNextLatitude,
	calculNextLongitude,
	getBiggestDivisor
} = require('./lib/math.js');

/**
 * Method to build a grid from 2 geolocations.
 * @param coordStart The up left corner of the rectangle
 * @param coordEnd The bottom right corner of the rectangle
 * @param length The length of the square side
 * @return A grid of square
 */
const buildGrid = function buildGrid (coordStart, coordEnd, step) {
	const result = [];
	let lat = coordStart.lat,
		lon = coordStart.lon,
		coord;

	while (lon < coordEnd.lon) {
		while (lat > coordEnd.lat) {
			coord = {
				lat,
				lon
			};
			result.push(coord);

			lat = calculNextLatitude(coord, step);
		}
		lon = calculNextLongitude(coord, step);
		lat = coordStart.lat;
	}

	return result;
};

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
 * Util to return an array of neighbors for a given GeoTile.
 * @param geoTiles An array of all GeoTile to compute
 * @param current The GoeTile to analyze
 * @return The array of neighbors
 */
const getNeighbors = function getNeighbors (geoTiles, current) {
	return geoTiles.filter(tile => {
		// Remove current element
		if (current.id === tile.id) {
			return false;
		}

		// Tiles on the same longitude
		if (isAdjacentLatitude(current, tile)) {
			if (isLeftCornerInsideTileBandLongitude(current, tile) ||
				isRightCornerInsideTileBandLongitude(current, tile) ||
				isTileBandLongitudeInsideBiggerTile(current, tile) ||
				isSmallerTileInsideTileBandLongitude(current, tile)) {
					return true;
				}
		}

		// Tiles on the same latitude
		if (isAdjacentLongitude(current, tile)) {
			if (isTopCornerInsideTileBandLatitude(current, tile) ||
				isBottomCornerInsideTileBandLatitude(current, tile) ||
				isTileBandLatitudeInsideBiggerTile(current, tile) ||
				isSmallerTileInsideTileBandLatitude(current, tile)) {
					return true;
				}
		}

		return false;
	});
};

/**
 * Util to evaluate if the given tiles have a side on an adjacent latitude.
 * @param tileA The first tile
 * @param tileB The second tile
 * @return A state for the test
 */
const isAdjacentLatitude = function isAdjacentLatitude (tileA, tileB) {
	return tileA.coords[0].lat === tileB.coords[3].lat ||
		tileA.coords[3].lat === tileB.coords[0].lat;
};

/**
 * Util to evaluate if the given tiles have a side on an adjacent longitude.
 * @param tileA The first tile
 * @param tileB The second tile
 * @return A state for the test
 */
const isAdjacentLongitude = function isAdjacentLongitude (tileA, tileB) {
	return tileA.coords[0].lon === tileB.coords[1].lon ||
		tileA.coords[1].lon === tileB.coords[0].lon;
};

/**
 * Util to evaluate if the target tile has a top corner inside the latitude band
 * of the reference tile.
 * @param refTile The first tile used to simulate the band
 * @param targetTile The second tile, aka tile to evaluate
 * @return A state for the test
 */
const isTopCornerInsideTileBandLatitude = function isTopCornerInsideTileBandLatitude (refTile, targetTile) {
	return refTile.coords[0].lat <= targetTile.coords[0].lat &&
		refTile.coords[3].lat > targetTile.coords[0].lat;
};

/**
 * Util to evaluate if the target tile has a bottom corner inside the latitude band
 * of the reference tile.
 * @param refTile The first tile used to simulate the band
 * @param targetTile The second tile, aka tile to evaluate
 * @return A state for the test
 */
const isBottomCornerInsideTileBandLatitude = function isBottomCornerInsideTileBandLatitude (refTile, targetTile) {
	return refTile.coords[0].lat < targetTile.coords[3].lat &&
		refTile.coords[3].lat >= targetTile.coords[3].lat;
};

/**
 * Util to evaluate if the target tile has a left corner inside the longitude band
 * of the reference tile.
 * @param refTile The first tile used to simulate the band
 * @param targetTile The second tile, aka tile to evaluate
 * @return A state for the test
 */
const isLeftCornerInsideTileBandLongitude = function isLeftCornerInsideTileBandLongitude (refTile, targetTile) {
	return refTile.coords[0].lon <= targetTile.coords[0].lon &&
		refTile.coords[1].lon > targetTile.coords[0].lon;
};

/**
 * Util to evaluate if the target tile has a right corner inside the longitude band
 * of the reference tile.
 * @param refTile The first tile used to simulate the band
 * @param targetTile The second tile, aka tile to evaluate
 * @return A state for the test
 */
const isRightCornerInsideTileBandLongitude = function isRightCornerInsideTileBandLongitude (refTile, targetTile) {
	return refTile.coords[0].lon < targetTile.coords[1].lon &&
		refTile.coords[1].lon >= targetTile.coords[1].lon;
};

/**
 * Util to evaluate if the target tile has the latitude band of the reference tile
 * inside it.
 * @param refTile The first tile used to simulate the band
 * @param targetTile The second tile, aka tile to evaluate
 * @return A state for the test
 */
const isTileBandLatitudeInsideBiggerTile = function isTileBandLatitudeInsideBiggerTile (refTile, targetTile) {
	return refTile.coords[0].lat <= targetTile.coords[0].lat &&
		refTile.coords[3].lat >= targetTile.coords[3].lat;
};

/**
 * Util to evaluate if the target tile has the longitude band of the reference tile
 * inside it.
 * @param refTile The first tile used to simulate the band
 * @param targetTile The second tile, aka tile to evaluate
 * @return A state for the test
 */
const isTileBandLongitudeInsideBiggerTile = function isTileBandLongitudeInsideBiggerTile (refTile, targetTile) {
	return refTile.coords[0].lon <= targetTile.coords[0].lon &&
		refTile.coords[1].lon >= targetTile.coords[1].lon;
};

/**
 * Util to evaluate if the target tile is inside the latitude band of the reference
 * tile.
 * @param refTile The first tile used to simulate the band
 * @param targetTile The second tile, aka tile to evaluate
 * @return A state for the test
 */
const isSmallerTileInsideTileBandLatitude = function isSmallerTileInsideTileBandLatitude (refTile, targetTile) {
	return refTile.coords[0].lat >= targetTile.coords[0].lat &&
		refTile.coords[3].lat <= targetTile.coords[3].lat;
};

/**
 * Util to evaluate if the target tile is inside the longitude band of the reference
 * tile.
 * @param refTile The first tile used to simulate the band
 * @param targetTile The second tile, aka tile to evaluate
 * @return A state for the test
 */
const isSmallerTileInsideTileBandLongitude = function isSmallerTileInsideTileBandLongitude (refTile, targetTile) {
	return refTile.coords[0].lon >= targetTile.coords[0].lon &&
		refTile.coords[1].lon <= targetTile.coords[1].lon;
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
}

module.exports = {
	buildGrid,
	buildGeoTile,
	getNeighbors,
	isAdjacentLatitude,
	isAdjacentLongitude,
	isTopCornerInsideTileBandLatitude,
	isBottomCornerInsideTileBandLatitude,
	isLeftCornerInsideTileBandLongitude,
	isRightCornerInsideTileBandLongitude,
	isTileBandLatitudeInsideBiggerTile,
	isTileBandLongitudeInsideBiggerTile,
	isSmallerTileInsideTileBandLatitude,
	isSmallerTileInsideTileBandLongitude,
	splitGeoTile,
	getCenterCoord
};
