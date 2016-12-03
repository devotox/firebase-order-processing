// @flow

const config = require('../config');

// Initialize Firebase
// Using admin since we need to update users and retrieve orders
const firebase = require('firebase-admin');

// $FlowFixMe
const serviceAccount = require(config.firebase.serviceAccountKeyPath);

firebase.initializeApp({
	databaseURL: config.firebase.databaseURL,
	credential: firebase.credential.cert(serviceAccount),
});

module.exports = firebase;