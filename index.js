const {
	calculNextLatitude,
	calculNextLongitude,
	buildGrid,
	calculMaxStep
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
const run = function run (coordStart, coordEnd, radius) {
	const fakeSrv = new FakeGeoService({
		radius,
		points: [
			{
				lat: 13.750288,
				lon: 100.504059
			}
		]
	});
	const step = calculMaxStep(radius);

	const array = buildGrid(coordStart, coordEnd, step);

	return from(array)
		.pipe(
			take(array.length),
			mergeMap(coord => {
				return fakeSrv.query(coord)
					.pipe(
						map(resp => {
							return {
								coord,
								isSomethingHere: resp
							}
						})
					);
			}),
			accumulateGeoTile()
		);
};

module.exports = {
	run
};
