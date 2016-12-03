// @flow
// jshint ignore: start

const Future = require('fluture');

const { compose, chain, curry, map, assoc, prop, zipObj, toPairs, indexBy } = require('ramda');

// chainP :: ( a -> b ) -> [ Promise e a ] -> Promise [b]
const chainP = curry((fn, arr) => Promise.all(chain(fn, arr)));

// toArray :: { a: b } -> [{ k: a, v: b }]
const toArray = compose(map(zipObj(['key', 'value'])), toPairs);

// FutureFromPromise :: ( () -> Promise e a ) -> Future e a
const FutureFromPromise = (fn: (*) => Future) => Future((reject, resolve) => {
	fn().then(resolve, reject);
	return () => {};
});

// innerJoin :: String -> String -> [a] -> [b] -> [{ String: a }]
const innerJoin = curry((k1, k2, l1, l2) => {
	let list2Map = indexBy(prop(k2), l2);
	return map(l1v => assoc(k1, list2Map[l1v[k1]], l1v), l1);
});

// log :: String -> a -> a
const log = curry((msg, v) => {
    console.log(msg, v);
    return v;
});

module.exports = { log, chainP, toArray, innerJoin, Future, FutureFromPromise };
