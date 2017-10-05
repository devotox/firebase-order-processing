# Firebase Order Processing

[![Greenkeeper badge](https://badges.greenkeeper.io/devotox/firebase-order-processing.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/devotox/firebase-order-processing.svg?branch=master)](https://travis-ci.org/devotox/firebase-order-processing)
[![Coverage Status](https://coveralls.io/repos/github/devotox/firebase-order-processing/badge.svg?branch=master)](https://coveralls.io/github/devotox/firebase-order-processing?branch=master)

Order processing in a firebase database.

## Database structure
- Users, Products, Orders
- Data is structured as 3 seperate entities
- No IDs will be stored in the entities themselves
- Firebase will auto generate all IDs

### User
```
{
    "name": "John Smith",
    "email": "john@smith.com"
}
```

### Products
```
{
    "name": "Item1",
    "amount": "399",
    "currency": "gbp"
}
```

### Orders
```
{
    "userID":  "<firebase-generated-user-id>",
    "productID": "<firebase-generated-product-id>",
    "payment": {
        "cvc": "222",
        "object": "card",
        "exp_month": "10",
        "exp_year": "2020",
        "number": "5200 8282 8282 8210"
    }
}
```

## Commands
### Docker
`docker build -t firebase-order-processing . && docker run -it --rm firebase-order-processing`
- builds application
- installs packages
- runs `npm run all`

### Install
`npm install`
- install packages

### Start
`npm start`
- cleans `dist/` folder
- builds application
- runs setup
- runs test
- starts process ordering

### Clean
`npm run clean`
- removes `dist/` folder and creates a new one

### Build
`npm run build`
- converts flow types into regular es6
- puts newly built application into `dist/` folder

### Setup
`npm run setup`
- enter stripe key
- enter database url
- enter secrets
- initialize database

### Populate
`npm run initialize`
- reinitializes the database to the test data

### Test
`npm test`
- sidekick
	- jshint
	- security issues
	- check for TODOs
	- outdated dependencies
- mocha
- istanbul coverage
- flow

### Cover
`npm run cover`
- runs test
- runs istanbul coverage checks to make  sure most lines are hit

### Process
`npm run process`
- connects to firebase database
- starts process ordering