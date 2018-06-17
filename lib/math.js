/** Earth radius in meter */
const EARTH_RADIUS = 6378137;

/**
 * TODO...
 */
const degToRad = function degToRad (angle) {
	return angle * Math.PI / 180;
};

/**
 * TODO...
 */
const radToDeg = function radToDeg (angle) {
	return angle * 180 / Math.PI;
};

/**
 * TODO...
 */
const calculEarthGeodesic = function calculEarthGeodesic (coordA, coordB) {
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
const calculNextLatitude = function calculNextLatitude (coord, step) {
	return +radToDeg(degToRad(coord.lat) - step / EARTH_RADIUS).toFixed(6);
};

/**
 * TODO...
 */
const calculNextLongitude = function calculNextLongitude (coord, step) {
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
const getSmallestDivisor = function getSmallestDivisor (nb) {
	let i = 2,
		max = Math.ceil(Math.sqrt(nb));

	for (; i <= max; i++) {
		if (nb % i === 0) break;
	}

	return i !== max + 1 ? i : nb;
};

/**
 * Util to get the biggest divisor of a given number (Itseft being excluded).
 * @param nb The number to evaluate
 * @return The biggest divisor
 */
const getBiggestDivisor = function getBiggestDivisor (nb) {
	return nb / getSmallestDivisor(nb);
};

/**
 * Util to calcul the error on given the center position of a circle made
 * by the array of coords.
 */
const calculCenterErrorOnGivenCicle = function calculCenterErrorOnGivenCicle (coords, center, radius) {
	const squareError = coords.reduce((acc, coord) => {
		const dist = calculEarthGeodesic(coord, center);

		return acc + Math.pow(dist - radius, 2);
	}, 0);

	return Math.sqrt(squareError);
};

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
 * Method to calcul the maximun step between tow sample given a detection range.
 * @param range The radius of detection in meters
 * @return The step to use in meters
 */
const calculMaxStep = function calculMaxStep (range) {
	const raw = 2 * range / Math.sqrt(2);

	return Math.floor(raw / 10) * 10;
}

module.exports = {
	degToRad,
	radToDeg,
	calculEarthGeodesic,
	calculNextLatitude,
	calculNextLongitude,
	getSmallestDivisor,
	getBiggestDivisor,
	calculCenterErrorOnGivenCicle,
	buildGrid,
	calculMaxStep
};
