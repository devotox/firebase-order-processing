// @flow
// jshint ignore: start

const path = require('path');

// Data can also be set from environment variables
process.env.STRIPE_API_KEY = process.env.STRIPE_API_KEY || '';
process.env.FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL || '';

// config type declared
// for flow to validate config object
type configType = {
	stripe: {
		apiKey:string
	},
	firebase: {
		databaseURL:string,
		serviceAccountKeyPath:string
	}
};

// holds configuration secrets
// needed throughout application
const config:configType = {
	stripe: {
		apiKey: process.env.STRIPE_API_KEY,
	},
	firebase: {
		databaseURL: process.env.FIREBASE_DATABASE_URL,
		serviceAccountKeyPath: '../../secrets/service-account-key.json'
	}
};

module.exports = config;