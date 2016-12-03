// @flow

const fs = require('fs');
const path = require('path');
const config = require('../config');
const inquirer = require('inquirer');
const { composeP, compose, curry } = require('ramda');
const serviceAccountKeyPath = '../../secrets/service-account-key.json';

const questions = [{
	type: 'input',
	name: 'stripe_api_key',
	message: 'Enter Stripe Key:'
}, {
	type: 'input',
	name: 'firebase_database_url',
	message: 'Enter Firebase Database URL:'
}, {
	type: 'editor',
	name: 'service_account_key',
	message: 'Enter Service Account Key JSON:'
}, {
	type: 'confirm',
	name: 'initialize_database',
	message: 'Do you want to initialize the database? (** NOTE: this will wipe the database first **):'
}];

const exit = () => process.exit(0);

const showPrompt = () => inquirer.prompt(questions);

const writeToFile = curry((filePath, data) => fs.writeFileSync(path.join(__dirname, filePath), data));

const renameFile = curry((oldPath, newPath) => fs.renameSync(path.join(__dirname, oldPath), path.join(__dirname, newPath)));

const writeConfig = ({ config, answers }) => {
	writeToFile('../config.json', config);
	return answers;
};

const writeKey = (answers) => {
	writeToFile(serviceAccountKeyPath, answers.service_account_key || '{}');
	return answers;
};

const backupConfig = () => {
	try { renameFile('../config.js', '../config.js.bak'); } catch(e) { console.log(e); }
};

const createConfig = (answers) => {
	Object.assign(config, {
		stripe: { apiKey: answers.stripe_api_key },
		firebase: { databaseURL: answers.firebase_database_url, serviceAccountKeyPath }
	});
	return {
		answers,
		config: JSON.stringify(config, null, 4)
	};
};

const initializeDatabase = (answers) => {
	if(!answers.initialize_database) { return; }
	return require('./initialize');
};

const apply = (answers = {}) => {
	compose(backupConfig, writeKey, writeConfig, createConfig)(answers);
	return initializeDatabase(answers);
};

const run = composeP(exit, apply, showPrompt);

run();
