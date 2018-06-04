const {
	buildGeoTile,
	getCenterCoord
} = require('./lib/geo-tile.utils.js');


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

module.exports = {
	mapCoordsToGeoTiles
};
