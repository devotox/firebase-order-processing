// @flow

const { assert } = require('chai');
const { get, getMultiple } = require('../../dist/modules/get-data');

describe('Get Data', () => {
	it('Data Exists', () => {
		return get('users')
		.then((data) => {
			assert.typeOf(data, 'object', 'Type of data is not an object');
			assert(Object.keys(data).length > 0, 'Length of data is greater than 0');
		});
	});

	it('Data Not Exists', () => {
		return get('fakepath')
		.then((data) => {
			assert.equal(data, null, 'Data is equal to null');
			assert.typeOf(data, 'null', 'Type of data is not an object');
		});
	});
});

describe('Get Multiple Data', () => {
	it('Data Exists', () => {
		return getMultiple(['users', 'products'])
		.then((data) => {
			assert.typeOf(data, 'array', 'Type of data is not an array');
			assert(Object.keys(data).length === 2, 'Length of data is equal to 2');
		});
	});

	it('Data Not Exists', () => {
		return getMultiple(['fakepath', 'fakepath'])
		.then((data) => {
			assert.typeOf(data, 'array', 'Type of data is not an array');
			assert(Object.keys(data).length === 2, 'Length of data is equal to 2');
			assert.equal(data[0], null, 'Data is equal to null');
			assert.typeOf(data[0], 'null', 'Type of data is not object');
			assert.equal(data[1], null, 'Data is equal to null');
			assert.typeOf(data[1], 'null', 'Type of data is not object');
		});
	});

	it('Mixed Data', () => {
		return getMultiple(['fakepath', 'users'])
		.then((data) => {
			assert.typeOf(data, 'array', 'Type of data is not an array');
			assert(Object.keys(data).length === 2, 'Length of data is equal to 2');
			assert.equal(data[0], null, 'Data is equal to null');
			assert.typeOf(data[0], 'null', 'Type of data is not object');
			assert.typeOf(data[1], 'object', 'Type of data is not object');
			assert(Object.keys(data[1]).length > 0, 'Length of data is greater than 0');
		});
	});
});