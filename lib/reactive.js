const {
	buildGeoTile,
	getCenterCoord,
    getNeighbors,
    splitGeoTile
} = require('./geo-tile.utils.js');
const { of, pipe } = require('rxjs');
const {
	map,
	tap,
    reduce
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
    let obs;

    if (tile.isSomethingHere === undefined) {
        obs = srv.query(coord)
            .pipe(
                map(resp => {
                    return Object.assign({}, tile, {
                        isSomethingHere: resp
                    });
                })
            );
    } else {
        obs = of(tile);
    }

    return obs;
}

/**
 * Util to map an Array to a value at a given index.
 * @param array An array of coords
 * @return A map operator
 */
const mapArrayToValuefromIndex = function mapArrayToValuefromIndex (array) {
	return map(idx => array[idx]);
};

/**
 * TODO...
 */
const accumulateGeoTile = function accumulateGeoTile () {
    return reduce((acc, geoTile) => {
        return [...acc, geoTile];
    }, []);
};

/**
 * TODO...
 */
const splitGeoTileAtBorder = function splitGeoTileAtBorder () {
    return pipe(
        map(geoTiles => {
            const borders = geoTiles.filter((tile, idx, array) => {
                const neighbors = getNeighbors(array, tile);
                const state = neighbors.find(item => item.isSomethingHere !== tile.isSomethingHere);

                return !!state;
            });

            return [borders, geoTiles];
        }),
        map(([borders, geoTiles]) => {
            const notBorders = geoTiles.filter(tile => {
                return !borders.includes(tile);
            });

            return [borders, notBorders];
        }),
        map(([borders, notBorders]) => {
            const splitted = borders.map(tile => {
                return splitGeoTile(tile);
            })
            .reduce((acc, smallerTiles) => {
                return [...acc, ...smallerTiles];
            }, []);

            return [...notBorders, ...splitted];
        })
    );
};

module.exports = {
	mapCoordsToGeoTiles,
	mergeMapGeoTileWithService,
	mapArrayToValuefromIndex,
    accumulateGeoTile,
    splitGeoTileAtBorder
};
