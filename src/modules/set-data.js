// @flow

const { composeP, curry } = require('ramda');

const { chainP } = require('../utils/ramda-utils');

const database = require('./firebase').database();

const returnData = ({ path, snapshot }) => database.ref(path).child(snapshot.key).once('value')
	.then(snapshot => ({ key: snapshot.key, value: snapshot.val() }));

const setData = (path, data) => database.ref(path).push(data)
	.then(snapshot => ({ path, snapshot }));

const add = composeP(returnData, setData);

const set = curry((path, data) => add(path, data));

const setMultiple = curry((path, data) => chainP(set(path), data));

module.exports = { set, setMultiple };