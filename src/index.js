#!/usr/bin/env node
// @flow

const { get } = require('./modules/get-data');
const { compose, composeP } = require('ramda');
const process = require('./modules/process-orders');
const database = require('./modules/firebase').database();

// validateOrders :: [ Orders ] -> [ Orders ]
const validateOrders = (orders) => orders ?
	Promise.resolve(orders) : Promise.reject('No orders available');

// getOrders :: [ Path ] -> [ Orders ]
const getOrders = composeP(get);

// processOrders :: [ Orders ] -> [ OrderWithStripdDetails ]
const processOrders = composeP(process);

const closeDatabase = () => database.goOffline();

const error = compose(closeDatabase, console.error);

const showOrders = (orders) => console.log(orders);

const success = compose(closeDatabase, (() => console.log('Orders Processed!')));

// run :: [ Path ] -> [ Orders ] -> [ Orders ] -> [ OrderWithStripdDetails ]
const run = composeP(closeDatabase, showOrders, processOrders, validateOrders, getOrders);

run('orders').then(success).catch(error);