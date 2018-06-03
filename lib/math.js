/** Earth radius in meter */
const EARTH_RADIUS = 6378137;

/**
 * TODO...
 */
const degToRad = module.exports.degToRad = function degToRad (angle) {
	return angle * Math.PI / 180;
};

/**
 * TODO...
 */
const radToDeg = module.exports.radToDeg = function radToDeg (angle) {
	return angle * 180 / Math.PI;
};

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

/**
 * TODO...
 */
module.exports.calculNextLatitude = function calculNextLatitude (coord, step) {
	return +radToDeg(degToRad(coord.lat) - step / EARTH_RADIUS).toFixed(6);
};

/**
 * TODO...
 */
module.exports.calculNextLongitude = function calculNextLongitude (coord, step) {
	const alphaA = degToRad(coord.lat);
	const betaA = degToRad(coord.lon);
	const dividend = Math.cos(step / EARTH_RADIUS) - Math.pow(Math.sin(alphaA), 2);
	const divisor = Math.pow(Math.cos(alphaA), 2);

	return +radToDeg(Math.acos(dividend / divisor) + betaA).toFixed(6);
};

/**
 * Util to get the smallest divisor of a given number (One being excluded).
 * @param nb The number to evaluate
 * @return The smallest divisor
 */
const getSmallestDivisor = module.exports.getSmallestDivisor = function getSmallestDivisor (nb) {
	let i = 2,
		max = Math.ceil(Math.sqrt(nb));

	for (; i <= max; i++) {
		if (nb % i === 0) break;
	}

	return i !== max + 1 ? i : nb;
}

/**
 * Util to get the biggest divisor of a given number (Itseft being excluded).
 * @param nb The number to evaluate
 * @return The biggest divisor
 */
module.exports.getBiggestDivisor = function getBiggestDivisor (nb) {
	return nb / getSmallestDivisor(nb);
}
