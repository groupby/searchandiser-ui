GroupBy Search API
========

![license](https://img.shields.io/github/license/groupby/api-javascript.svg)
[![npm](https://img.shields.io/npm/dm/groupby-api.svg)](https://www.npmjs.com/package/groupby-api)
[![npm](https://img.shields.io/npm/v/groupby-api.svg)](https://www.npmjs.com/package/groupby-api)

Please follow the steps carefully to ensure a successful build.

Before running the install steps, ensure `node` and `npm` are installed on your system.

### Install global dependencies:

    npm i -g gulp typings

### To install:

    npm i

This will by default install the typings as well.


### To test:

    npm test

This will install the project and run all tests.


### Add this library as a dependency to your project:
The Uber JAR must be used to ensure shaded dependencies are included correctly.

#### NPM

    npm i --save groupby-api

### Examples

#### Searching (typescript)

```javascript
import { CloudBridge, Query, Results } from 'groupby-api';

let bridge = new CloudBridge('<client-key>', '<customer-id>');
let query = new Query('dvd');
bridge.search(query)
  .then(results: Results => {
    // operate on results
  });

// OR

bridge.search(query, results: Results => {
    // operate on results
  });
```

#### Searching (ES5/CommonJS)

```javascript
var groupby = require('groupby-api');
var CloudBridge = groupby.CloudBridge,
  Query = groupby.Query,
  Results = groupby.Results;

var bridge = new CloudBridge('<client-key>', '<customer-id>');
var query = new Query('dvd');
bridge.search(query)
  .then(function(results) {
    // operate on results
  });

// OR

bridge.search(query, function(results) {
    // operate on results
  });
```
