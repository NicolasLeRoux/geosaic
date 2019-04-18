const Geohash = require('latlon-geohash');
const Firebase = require('firebase');
const Firestore = require('@google-cloud/firestore');

// Geohash
const hash = Geohash.encode(48.856555, 2.351520, 9);
console.log('Mon hash: ', hash);

const coord = Geohash.decode(hash);
console.log('Mes coord: ', coord);

const self = hash.slice(0, 7);
const neighboursObj = Geohash.neighbours(self);
const neighbours = [self, ...Object.keys(neighboursObj).map(key => neighboursObj[key])];
console.log('Mes Voisins: ', neighbours);

// Firestore
const firestore = new Firestore();
Firebase.initializeApp({
    apiKey: 'AIzaSyDROG404YrALqZaEKu1-N6tjDBphbnjde8',
    authDomain: 'geosaic.firebaseapp.com',
    projectId: 'geosaic'
});
const db = Firebase.firestore();

db.collection('mosaics')
    .where('neighboursAndSelf', 'array-contains', 'u09tvw1')
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log('Data: ', doc.id, doc.data());
        });
    });