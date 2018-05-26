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
module.exports.calculGeodesic = function calculGeodesic (coordA, coordB) {
	const alphaA = degToRad(coordA.lat);
	const alphaB = degToRad(coordB.lat);
	const betaA = degToRad(coordA.lon);
	const betaB = degToRad(coordB.lon);

	const angle = Math.acos(Math.sin(alphaA) * Math.sin(alphaB) +
		Math.cos(alphaA) * Math.cos(alphaB) * Math.cos(betaB - betaA));

	return Math.round(EARTH_RADIUS * angle);
};
