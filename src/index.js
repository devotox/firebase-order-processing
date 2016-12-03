#!/usr/bin/env node
// @flow

const { get } = require('./modules/get-data');
const { compose, composeP } = require('ramda');
const process = require('./modules/process-orders');
const database = require('./modules/firebase').database();

const validateOrders = (orders) => orders ?
	Promise.resolve(orders) : Promise.reject('No orders available');

const getOrders = composeP(get);

const processOrders = composeP(process);

const closeDatabase = () => database.goOffline();

const error = compose(closeDatabase, console.error);

const run = composeP(closeDatabase, processOrders, validateOrders, getOrders);

const success = compose(closeDatabase, (() => console.log('Orders Processed!')));

run('orders').then(success).catch(error);