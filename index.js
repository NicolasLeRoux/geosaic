module.exports.sum = function sum (a, b) {
    return a + b;
};

/**
 * I need a method to build a grid from 2 geolocations.
 * @param coordStart The up left corner of the rectangle
 * @param coordEnd The bottom right corner of the rectangle
 * @return A grid of square
 */
// TODO

/**
 * Geographic coordinate sample: 48.815295, 2.251483 (Latitude, Longitude)
 * The structure to contain coordinate will be:
 * {
 *     lat: 48.815295,
 *     lon: 2.251483
 * }
 * __Question ?__ Should i use a specialized object ?
 * I need a method to get the distance between tow geographic coordinate.
 */
module.exports.calculDistance = function calculDistance (coordA, coordB) {
    return 0;
};

/**
 * The grid need to be store in order to restart from where it was the last time.
 * What structure do I need ?
 * [
 *     {
 *         coord: {...}, // Position of the top left, the middle coord need to be
 *         // calculed...
 *         step: 80, // Distance in meter. Or side of the square
 *         //...
 *     }
 * ]
 */
