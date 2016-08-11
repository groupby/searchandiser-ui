import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../utils/tags';
import { Submit } from '../../src/tags/submit/gb-submit';
import { expect } from 'chai';
import utils = require('../../src/utils');

describe('gb-submit logic', () => {
  let sandbox: Sinon.SinonSandbox,
    tag: Submit,
    flux: FluxCapacitor;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    ({ tag, flux } = fluxTag(new Submit(), {
      root: <HTMLElement & any>{ addEventListener: () => null }
    }));
  });
  afterEach(() => sandbox.restore());

  it('should have default values', () => {
    tag.init();

    expect(tag.label).to.eq('Search');
    expect(tag.queryParam).to.eq('q');
    expect(tag.searchUrl).to.eq('search');
    expect(tag.staticSearch).to.be.false;
  });

  it('should allow override from opts', () => {
    const label = 'Submit query';
    const queryParam = 'query';
    const searchUrl = 'search.html';
    tag.opts = { label, queryParam, searchUrl, staticSearch: true };
    tag.init();

    expect(tag.label).to.eq(label);
    expect(tag.queryParam).to.eq(queryParam);
    expect(tag.searchUrl).to.eq(searchUrl);
    expect(tag.staticSearch).to.be.true;
  });

  it('should set label for input tag', () => {
    Object.assign(tag.root, { tagName: 'INPUT' });
    tag.init();

    expect(tag.root.value).to.eq('Search');
  });

  it('should listen for mount event', () => {
    tag.on = (event, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(tag.findSearchBox);
    };
    tag.init();
  });

  it('should register click listener', () => {
    tag.root = <HTMLElement & any>{
      addEventListener: (event, cb): any => {
        expect(event).to.eq('click');
        expect(cb).to.eq(tag.submitQuery);
      }
    };
    tag.init();
  });

  it('should find search box', () => {
    const queryTag = document.createElement('div');
    document.body.appendChild(queryTag);
    queryTag.setAttribute('riot-tag', 'gb-raw-query');

    tag.init();
    tag.findSearchBox();

    expect(tag.searchBox).to.eq(queryTag);

    document.body.removeChild(queryTag);
  });

  it('should submit query', () => {
    const query = 'something';
    flux.reset = (value): any => expect(value).to.eq(query);

    tag.searchBox = <HTMLInputElement>{ value: query };
    tag.init();

    tag.submitQuery();
    expect(tag.searchBox.value).to.eq(query);
  });

  it('should submit static query', (done) => {
    const query = 'something';
    sandbox.stub(utils, 'updateLocation', (searchUrl, queryParam, queryString, refinements) => {
      expect(searchUrl).to.eq('search');
      expect(queryParam).to.eq('q');
      expect(queryString).to.eq(query);
      expect(refinements.length).to.eq(0);
      done();
    });

    tag.searchBox = <HTMLInputElement>{ value: query };
    tag.init();
    tag.staticSearch = true;

    tag.submitQuery();
  });
});
