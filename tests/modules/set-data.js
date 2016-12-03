// @flow

const { assert } = require('chai');
const { set, setMultiple } = require('../../dist/modules/set-data');

describe('Set Data', () => {
	it('Set Object', () => {
		return set('testpath', { 'email': 'test'})
		.then((data) => {
			assert.typeOf(data, 'object', 'Type of data is not an object');
			assert.typeOf(data.key, 'string', 'Returned key is a string');
			assert.typeOf(data.value, 'object', 'Returned value is an object');
			assert(Object.keys(data).length > 0, 'Length of data is greater than 0');
		});
	});

	it('Set Primitive', () => {
		return set('testpath', 'test')
		.then((data) => {
			assert.typeOf(data, 'object', 'Type of data is not an object');
			assert.typeOf(data.key, 'string', 'Returned key is a string');
			assert.typeOf(data.value, 'string', 'Returned value is a string');
			assert(Object.keys(data).length > 0, 'Length of data is greater than 0');
		});
	});
});

describe('Set Multiple Data', () => {
	it('Set Object', () => {
		return setMultiple('testpath', [{ 'email': 'test'}, { 'email': 'test'}])
		.then((data) => {
			assert.typeOf(data, 'array', 'Type of data is not an array');
			assert(Object.keys(data).length === 2, 'Length of data is equal to 2');
		});
	});
});