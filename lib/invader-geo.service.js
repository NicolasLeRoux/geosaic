const { Subject } = require('rxjs');
const request = require('request');
const fs = require('fs');
const path = require('path');

const url = 'http://space-invaders.com/api/v1/queries/';
/**
 * TODO...
 */
module.exports = class InvaderGeoService {
	constructor(opts) {

	}

	query(coord) {
		const sbj = new Subject();
		const formData = {
			source_description: `${coord.lat},${coord.lon},undefined`,
			source: 'NONE',
			image: {
				value: fs.createReadStream(path.join(__dirname, '../assets/samurai.png')),
				options: {
					filename: 'samurai.png',
					contentType: 'image/png'
				}
			}
		};

		request.post({url, formData}, (err, httpResponse, body) => {
			if (err) {
				console.error('upload failed:', err);
				return sbj.error(err);
			}

			const data = JSON.parse(body);
			console.log('Upload successful!  Server responded with:', data.source);

			let state = !data.source.includes('NO INVADER AROUND YOU');
			sbj.next({
				coord,
				state
			});
			sbj.complete();
		});

		return sbj.asObservable();
	}
};
