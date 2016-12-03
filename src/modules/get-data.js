// @flow

const { composeP } = require('ramda');

const { chainP } = require('../utils/ramda-utils');

const database = require('./firebase').database();

// returnData :: Snapshot -> Data
const returnData = snapshot => snapshot.val();

// getData :: Path -> Promise Snapshot
const getData = path => database.ref(path).once('value');

// get :: Path -> Data
const get = composeP(returnData, getData);

// getMultiple :: [Paths] -> Promise [Data]
const getMultiple = chainP(get);

module.exports = { get, getMultiple };