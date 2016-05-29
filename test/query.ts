/// <reference path="../lib/all.d.ts" />

import chai = require('chai');
import { Query } from '../lib/core/query';
import {
  ComplexRequest,
  CombinedRefinements,
  CustomParamsFromString
} from './fixtures';

const CLIENT_KEY = 'XXX-XXX-XXX-XXX';
const CUSTOMER_ID = 'services';
let expect = chai.expect;

describe('Query', function() {
  let query;

  beforeEach(() => {
    query = new Query('test');
  });

  afterEach(() => {
    query = null;
  });

  it('should be defined', () => {
    expect(query).to.be.ok;
  });

  it('should build a simple request with defaults', () => {
    let request = query.build();
    expect(request).to.eql({
      query: 'test',
      wildcardSearchEnabled: false,
      pruneRefinements: true
    });
  });

  it('should build a complex request', () => {
    let request = new Query('complex')
      .withConfiguration({
        userId: '13afasd',
        language: 'en',
        collection: 'dev',
        area: 'Development',
        biasingProfile: 'boost top brands'
      })
      .withCustomUrlParams([{ key: 'banner', value: 'nike_landing' }, { key: 'style', value: 'branded' }])
      .withFields('title', 'description')
      .withOrFields('brand', 'colour')
      .withIncludedNavigations('brand', 'size')
      .withExcludedNavigations('_meta', 'originalPrice')
      .withQueryParams({
        attrs: 'size,brand',
        id: ''
      })
      .withSorts({ field: 'price', order: 'Ascending' }, { field: 'boost', order: 'Descending' })
      .withPageSize(300)
      .skip(40)
      .restrictNavigation({
        name: 'brand',
        count: 10
      })
      .withMatchStrategy({
        rules: [{ terms: 5, termsGreaterThan: 7 }]
      })
      .withBiasing({
        augmentBiases: true,
        biases: [{ name: 'popularity', strength: 'Strong_Decrease' }]
      })
      .enableWildcardSearch()
      .disableAutocorrection()
      .allowPrunedRefinements()
      .disableBinaryPayload()
      .build();

    expect(request).to.eql(ComplexRequest);
  });

  it('should allow multiple methods of setting refinements', () => {
    let request = new Query('refinements')
      .withSelectedRefinements(
      {
        navigationName: 'size',
        type: 'Range',
        low: 1,
        high: 13,
        exclude: false
      }, {
        navigationName: 'brand',
        type: 'Value',
        value: 'Nike',
        exclude: true
      })
      .withRefinements('material', {
        type: 'Value',
        value: 'wool'
      })
      .withRefinements('year', {
        type: 'Range',
        low: 2000,
        high: 2009,
        exclude: false
      }, {
        type: 'Range',
        low: 2010,
        high: 2011
      })
      .withNavigations(
      {
        name: 'rating',
        refinements: [{ type: 'Value', value: '***' }]
      }, {
        name: 'price',
        refinements: [
          { type: 'Range', low: 31, high: 44 },
          { type: 'Range', low: 89, high: 100 }
        ]
      })
      .refineByValue('rating', '****', true)
      .refineByRange('price', 122, 413)
      .build();

    expect(request.refinements).to.eql(CombinedRefinements);
  });

  it('should convert custom URL params', () => {
    let request = new Query('parameters')
      .withCustomUrlParams('banner=nike_landing&style=branded')
      .withCustomUrlParams('defaults')
      .withCustomUrlParams('others=&something=as_well')
      .build();

    expect(request.customUrlParams).to.eql(CustomParamsFromString);
  });

});
