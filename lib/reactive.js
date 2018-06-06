const {
	buildGeoTile,
	getCenterCoord
} = require('./geo-tile.utils.js');
const {
	map,
	tap
} = require('rxjs/operators');

/**
 * Util to map an array of coords to an array of GeoTile.
 * @param coords An array of geographic coordinate
 * @param step The step to apply between each tile
 * @return An array of GeoTile
 */
const mapCoordsToGeoTiles = function mapCoordsToGeoTiles (coords, step) {
	return coords.map((coord, idx) => {
		return buildGeoTile(coords, step, `${idx}_@${step}`);
	});
}

/**
 * Util to compute an array of GeoTile with the given service.
 * @param tile The GeoTile to compute
 * @param srv The service to use to compute the GeoTile
 * @param An Observable of the computed GeoTile
 */
const mergeMapGeoTileWithService = function mergeMapGeoTileWithService (tile, srv) {
	const coord = getCenterCoord(tile);

	return srv.query(coord)
		.pipe(
			map(resp => {
				return Object.assign({}, tile, {
					isSomethingHere: resp
				});
			})
		);
}

/**
 * Util to map an Array to a value at a given index.
 * @param array An array of coords
 * @return A map operator
 */
const mapArrayToValuefromIndex = function mapArrayToValuefromIndex (array) {
	return map(idx => array[idx]);
};

module.exports = {
	mapCoordsToGeoTiles,
	mergeMapGeoTileWithService,
	mapArrayToValuefromIndex
};
