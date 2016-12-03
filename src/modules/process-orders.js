// @flow

const stripe = require('./stripe');
const { composeP, compose } = require('ramda');
const { chainP, toArray } = require('../utils/ramda-utils');
const database = require('./firebase').database();
const { get } = require('../modules/get-data');

// chargeCard ::  { OrderWithStripeDetails } -> { OrderWithStripeDetails }
const orderUpdate = order => database.ref('orders')
	.child(order.key).update(order.value).then(() => order);

// chargeCard ::  { Order, CardSource, CardCharge } -> { OrderWithStripeDetails }
const createUpdate = ({ order, source, charge }) => {
	let chargeID = charge.id;
	let customerID = source.customer;
	Object.assign(order.value, { stripe: { chargeID, customerID } });
	return Promise.resolve(order);
};

// chargeCard ::  { Order, CardSource, Product } -> { Order, CardSource, CardCharge }
const chargeCard = ({ order, source, product }) => stripe.charges
	.create({
		customer: source.customer,
		amount: product.amount,
		currency: product.currency
	}).then(charge => ({ order, source, charge }));

// addCardDetails ::  { Order, Customer, Product } -> { Order, CardSource, Product }
const addCardDetails = ({ order, customer, product }) => stripe.customers
	.createSource(customer.id, { source: order.value.payment })
	.then(source => ({ order, source, product }));

// getUser ::  { Order } -> { Order, User }
const getUser = order => get(`users/${ order.value.userID }`)
	.then(user => ({ order, user }));

// getProduct ::  { Order, Customer } -> { Order, Customer, Product }
const getProduct = ({ order, customer }) => get(`products/${ order.value.productID }`)
	.then(product => ({ order, customer, product }));

// createCustomer ::  { Order, User } -> { Order, Customer }
const createCustomer = ({ order, user }) => stripe.customers
	.create({ email: user.email })
	.then(customer => ({ order, customer }));

// updateOrder ::  { Order, CardSource, CardCharge } -> { OrderWithStripeDetails } -> { OrderWithStripeDetails }
const updateOrder = composeP(orderUpdate, createUpdate);

// processPayment :: { Order, Customer } -> { Order, Customer, Product } -> { Order, CardSource, Product } -> { Order, CardSource, CardCharge }
const processPayment = composeP(chargeCard, addCardDetails, getProduct);

// handleOrder :: Order -> { Order, User } -> { Order, Customer } -> { Order, CardSource, CardCharge } -> { OrderWithStripeDetails }
const handleOrder = composeP(updateOrder, processPayment, createCustomer, getUser);

// process :: { Orders } -> [ Orders ] -> Promise [ OrderWithStripdDetails ]
const process = compose(chainP(handleOrder), toArray);

module.exports = process;