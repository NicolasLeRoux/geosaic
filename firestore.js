const Geohash = require('latlon-geohash');
const Firebase = require('firebase');
const Firestore = require('@google-cloud/firestore');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

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

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1bwTDS7VRvD95OUkoIEHelb9Obh-dLsHg5efmmJFxtaI',
    range: 'Sheet1!A2:C',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      console.log('Name, Lat, lon:');
      // Print columns A and E, which correspond to indices 0 and 4.
      rows.map((row) => {
        console.log(`${row[0]}, ${row[1]}, ${row[2]}`);
      });
    } else {
      console.log('No data found.');
    }
  });
}
