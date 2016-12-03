// @flow

const { assert } = require('chai');
const { get } = require('../../dist/modules/get-data');
const process = require('../../dist/modules/process-orders');

describe('Process Orders', () => {
	it('Process', () => {
		return get('orders')
		.then(process)
		.then((data) => {
			assert.typeOf(data, 'array', 'Type of data is not an array');
			assert(Object.keys(data).length === 2, 'Length of data is equal to 2');
			data.forEach((order) => {
				assert.typeOf(order, 'object', 'Type of order should be an object');
				assert.typeOf(order.key, 'string', 'Type of order key should be a string');
				assert.typeOf(order.value, 'object', 'Type of order value should be an object');
				assert.typeOf(order.value.payment, 'object', 'Type of order payment should be an object');
				assert.typeOf(order.value.payment, 'object', 'Type of order payment should be an object');
			});
		});
	});
});