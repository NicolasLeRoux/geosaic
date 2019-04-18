const Geohash = require('latlon-geohash');

const hash = Geohash.encode(48.856555, 2.351520, 9);
console.log('Mon hash: ', hash);

const coord = Geohash.decode(hash);
console.log('Mes coord: ', coord);

const self = hash.slice(0, 7);
const neighboursObj = Geohash.neighbours(self);
const neighbours = [self, ...Object.keys(neighboursObj).map(key => neighboursObj[key])];
console.log('Mes Voisins: ', neighbours);