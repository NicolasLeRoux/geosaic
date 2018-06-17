/**
 * TODO
 */
const insertProcessedCoord = function (item) {
	return `INSERT
		INTO \`geosaic-207514.invaders.processed_coords\`
		(latitude, longitude, state)
		VALUES (${item.coord.lat}, ${item.coord.lon}, ${item.state})`;
};

/**
 * TODO
 */
const deleteCoordToProcess = function (item) {
	return `DELETE
		FROM \`geosaic-207514.invaders.coords_to_process\`
		WHERE latitude=${item.coord.lat}
		AND longitude=${item.coord.lon}
		`;
};

module.exports = {
	insertProcessedCoord,
	deleteCoordToProcess
};
