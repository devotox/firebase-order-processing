// @flow

const { composeP, compose, curry } = require('ramda');
const { chainP } = require('../utils/ramda-utils');
const database = require('../modules/firebase').database();
const { set } = require('../modules/set-data');

const products = require('../../data/products.json');
const orders = require('../../data/orders.json');
const users = require('../../data/users.json');

const combineUserProductOrder = ([users, products]) => {
	if(!users || !products) { return; }
	return orders.map((order, idx) => {
		order.userID = (users[idx] || users[0]).key;
		order.productID = (products[idx] || products[0]).key;
		return order;
	}).filter(order => order.userID && order.productID && order.payment);
};

const closeDatabase = () => database.goOffline();

const cleanDatabase = () => database.ref('/').remove();

const addToDatabase = curry((path, data) => chainP(set(path), data));

const populateUsers = () => addToDatabase('users', users);

const populateProducts = () => addToDatabase('products', products);

const populateStatic = () => Promise.all([ populateUsers(), populateProducts() ]);

const populateOrders = compose(addToDatabase('orders'), combineUserProductOrder);

const initialize = composeP(closeDatabase, populateOrders, populateStatic, cleanDatabase);

const success = compose(closeDatabase, (() => console.log('Database Initialized!')));

const error = compose(closeDatabase, console.error);

initialize().then(success).catch(error);
