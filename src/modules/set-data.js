// @flow

const { composeP, curry } = require('ramda');

const { chainP } = require('../utils/ramda-utils');

const database = require('./firebase').database();

// returnData :: { Path, Snapshot } -> Promise { key: k, value: Data }
const returnData = ({ path, snapshot }) => database.ref(path).child(snapshot.key).once('value')
	.then(snapshot => ({ key: snapshot.key, value: snapshot.val() }));

// setData :: (Path, Data) -> Promise { Path, Snapshot }
const setData = (path, data) => database.ref(path).push(data)
	.then(snapshot => ({ path, snapshot }));

// add :: (Path, Data) -> { key: k, value: Data }
const add = composeP(returnData, setData);

// set :: Path -> Data -> { key: k, value: Data }
const set = curry((path, data) => add(path, data));

// setMultiple :: Path -> Data -> [{ key: k, value: Data }]
const setMultiple = curry((path, data) => chainP(set(path), data));

module.exports = { set, setMultiple };