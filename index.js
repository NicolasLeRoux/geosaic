const {
	calculNextLatitude,
	calculNextLongitude,
    buildGrid
} = require('./lib/math.js');
const {
	from,
	of,
	interval
} = require('rxjs');
const {
	withLatestFrom,
	mergeMap,
	take,
	map,
	tap,
	reduce,
    filter
} = require('rxjs/operators');
const {
	mapCoordsToGeoTiles,
	mergeMapGeoTileWithService,
	mapArrayToValuefromIndex,
    accumulateGeoTile,
    splitGeoTileAtBorder
} = require('./lib/reactive.js');
const FakeGeoService = require('./lib/fake-geo.service.js');
const {
	buildGeoTile,
    splitGeoTile,
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
	isSmallerTileInsideTileBandLongitude
} = require('./lib/geo-tile.utils.js');

/**
 * Runner !
 */
const run = function run (coordStart, coordEnd, step) {
	// 3. Map GeoTile to service
	const fakeSrv = new FakeGeoService({
		radius: 200,
		points: [
			{
				lat: 51.505,
				lon: -0.069
			}
		]
	});

	const array = buildGrid(coordStart, coordEnd, step);

	return interval(0)
		.pipe(
			mapArrayToValuefromIndex(array),
			take(array.length),
			map(coord => {
				return buildGeoTile(coord, step, `${coord.lat}_${coord.lon}_${step}`);
			}),
			mergeMap(geoTile => {
				return mergeMapGeoTileWithService(geoTile, fakeSrv);
			}),
            accumulateGeoTile(),
            splitGeoTileAtBorder(),
            mergeMap(array => from(array)),
			mergeMap(geoTile => {
				return mergeMapGeoTileWithService(geoTile, fakeSrv);
			}),
            accumulateGeoTile()
		);
};

module.exports = {
	run
};
