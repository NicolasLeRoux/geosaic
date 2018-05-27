/** Earth radius in meter */
const EARTH_RADIUS = 6378137;

/**
 * TODO...
 */
const degToRad = module.exports.degToRad = function degToRad (angle) {
	return angle * Math.PI / 180;
}

/**
 * TODO...
 */
const radToDeg = module.exports.radToDeg = function radToDeg (angle) {
	return angle * 180 / Math.PI;
}

/**
 * TODO...
 */
module.exports.calculEarthGeodesic = function calculGeodesic (coordA, coordB) {
	const alphaA = degToRad(coordA.lat);
	const alphaB = degToRad(coordB.lat);
	const betaA = degToRad(coordA.lon);
	const betaB = degToRad(coordB.lon);

	const angle = Math.acos(Math.sin(alphaA) * Math.sin(alphaB) +
		Math.cos(alphaA) * Math.cos(alphaB) * Math.cos(betaB - betaA));

	return Math.round(EARTH_RADIUS * angle);
};
