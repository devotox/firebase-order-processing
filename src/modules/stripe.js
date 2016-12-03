// @flow

const config = require('../config');

// Initialize Stripe
const stripe = require('stripe')(config.stripe.apiKey);

module.exports = stripe;