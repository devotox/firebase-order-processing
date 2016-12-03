// @flow

const stripe = require('./stripe');
const { composeP, compose } = require('ramda');
const { chainP, toArray } = require('../utils/ramda-utils');
const database = require('./firebase').database();
const { get } = require('../modules/get-data');

const orderUpdate = order => database.ref('orders').child(order.key).update(order.value);

const createUpdate = ({ order, source, charge }) => {
	let chargeID = charge.id;
	let customerID = source.customer;
	Object.assign(order.value, { stripe: { chargeID, customerID }});
	return Promise.resolve(order);
};

const chargeCard = ({ order, source, product }) => stripe.charges
	.create({
		customer: source.customer,
		amount: product.amount,
		currency: product.currency
	}).then((charge) => ({ order, source, charge }));

const addCardDetails = ({ order, customer, product }) => stripe.customers
	.createSource(customer.id, { source: order.value.payment })
	.then((source) => ({ order, source, product }));

const getUser = order => get(`users/${order.value.userID}`)
		.then(user => ({ order, user }));

const getProduct = ({ order, customer }) => get(`products/${order.value.productID}`)
		.then(product => ({ order, customer, product }));

const createCustomer = ({ order, user }) => stripe.customers
	.create({ email: user.email })
	.then((customer) => ({ order, customer }));

const updateOrder = composeP(orderUpdate, createUpdate);

const processPayment = composeP(chargeCard, addCardDetails, getProduct);

const handleOrder = composeP(updateOrder, processPayment, createCustomer, getUser);

const process = compose(chainP(handleOrder), toArray);

module.exports = process;