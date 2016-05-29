/// <reference path="../lib/all.d.ts" />

import chai = require('chai');
import sinon = require('sinon');
import nock = require('nock');

import { CloudBridge } from '../lib/core/bridge';
import { BrowserBridge } from '../lib/core/bridge';
import { Query } from '../lib/core/query';

const CLIENT_KEY = 'XXX-XXX-XXX-XXX';
const CUSTOMER_ID = 'services';
let expect = chai.expect;

describe('Bridge', function() {
  let bridge,
    query;

  beforeEach(() => {
    bridge = new CloudBridge(CLIENT_KEY, CUSTOMER_ID);
    query = new Query('test');
  });

  afterEach(() => {
    bridge = null;
    query = null;
  });

  it('should be defined', () => {
    expect(bridge).to.be.ok;
  });

  it('should handle invalid query types', done => {
    bridge.search(12331)
      .catch(err => expect(err.message).to.equal('query was not of a recognised type'))
      .then(() => bridge.search(true, (err, res) => {
        expect(err.message).to.equal('query was not of a recognised type');
        expect(res).to.not.be.ok;
        done();
      }));
  });

  it('should be accept a direct query string', done => {
    let mock = nock(`https://${CUSTOMER_ID}.groupbycloud.com`)
      .post('/api/v1/search', {
        query: 'skirts',
        clientKey: CLIENT_KEY
      })
      .reply(200, 'success');

    bridge.search('skirts')
      .then(results => {
        expect(results).to.equal('success');
        mock.done();
        done();
      });
  });

  it('should be accept a raw request', done => {
    let mock = nock(`https://${CUSTOMER_ID}.groupbycloud.com`)
      .post('/api/v1/search', {
        query: 'skirts',
        fields: ['title', 'description'],
        clientKey: CLIENT_KEY
      })
      .twice()
      .reply(200, 'success');

    bridge.search(new Query('skirts').withFields('title', 'description').build())
      .then(results => expect(results).to.equal('success'))
      .then(() => bridge.search({ query: 'skirts', fields: ['title', 'description'] }))
      .then(results => {
        expect(results).to.equal('success');
        mock.done();
        done();
      });
  });

  it('should be reuseable', done => {
    let mock = nock(`https://${CUSTOMER_ID}.groupbycloud.com`)
      .post('/api/v1/search')
      .twice()
      .reply(200, 'success');

    query = new Query('skirts');

    bridge.search(query)
      .then(results => expect(results).to.equal('success'))
      .then(() => bridge.search(query))
      .then(results => {
        expect(results).to.equal('success');
        mock.done();
        done();
      });
  });

  it('should send a search query and return a promise', done => {
    let queryParams = {
      size: 20,
      syle: 'branded',
      other: ''
    };
    let mock = nock(`https://${CUSTOMER_ID}.groupbycloud.com`)
      .post('/api/v1/search', {
        query: 'skirts',
        clientKey: CLIENT_KEY
      })
      .query(queryParams)
      .reply(200, 'success');

    query = new Query('skirts')
      .withQueryParams(queryParams);

    bridge.search(query)
      .then(results => {
        expect(results).to.equal('success');
        mock.done();
        done();
      });
  });

  it('should send a search query and take a callback', done => {
    let mock = nock(`https://${CUSTOMER_ID}.groupbycloud.com`)
      .post('/api/v1/search', {
        query: 'shoes',
        clientKey: CLIENT_KEY
      })
      .query({
        size: 20,
        style: 'branded'
      })
      .reply(200, 'success');

    query = new Query('shoes')
      .withQueryParams('size=20&style=branded');

    bridge.search(query, (err, results) => {
      expect(results).to.equal('success');
      mock.done();
      done();
    });
  });

  it('should send requests to the CORS supported endpoint', done => {
    let mock = nock('http://ecomm.groupbycloud.com')
      .post(`/semanticSearch/${CUSTOMER_ID}`, { query: 'shoes' })
      .query({
        size: 20,
        style: 'branded'
      })
      .reply(200, 'success');

    query = new Query('shoes')
      .withQueryParams('size=20&style=branded');

    new BrowserBridge(CUSTOMER_ID)
      .search(query, (err, results) => {
        expect(results).to.equal('success');
        mock.done();
        done();
      });
  });

});
