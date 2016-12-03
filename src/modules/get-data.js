// @flow

const { composeP } = require('ramda');

const { chainP } = require('../utils/ramda-utils');

const database = require('./firebase').database();

const returnData = snapshot => snapshot.val();

const getData = path => database.ref(path).once('value');

const get = composeP(returnData, getData);

const getMultiple = chainP(get);

module.exports = { get, getMultiple };