import { FluxCapacitor, Events } from 'groupby-api';
import { Submit } from '../../src/tags/submit/gb-submit';
import { expect } from 'chai';
import utils = require('../../src/utils');

describe('gb-submit logic', () => {
  let sandbox: Sinon.SinonSandbox;
  let submit: Submit;
  let flux: FluxCapacitor;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    submit = new Submit();
    flux = new FluxCapacitor('');
    submit.opts = { flux };
    submit.root = <HTMLElement & any>{ addEventListener: () => null };
    submit.on = () => null;
  });
  afterEach(() => sandbox.restore());

  it('should have default values', () => {
    submit.init();

    expect(submit.label).to.eq('Search');
    expect(submit.queryParam).to.eq('q');
    expect(submit.searchUrl).to.eq('search');
    expect(submit.staticSearch).to.be.false;
  });

  it('should allow override from opts', () => {
    const label = 'Submit query';
    const queryParam = 'query';
    const searchUrl = 'search.html';
    submit.opts = { label, queryParam, searchUrl, staticSearch: true };
    submit.init();

    expect(submit.label).to.eq(label);
    expect(submit.queryParam).to.eq(queryParam);
    expect(submit.searchUrl).to.eq(searchUrl);
    expect(submit.staticSearch).to.be.true;
  });

  it('should set label for input tag', () => {
    Object.assign(submit.root, { tagName: 'INPUT' });
    submit.init();

    expect(submit.root.value).to.eq('Search');
  });

  it('should listen for mount event', () => {
    submit.on = (event, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(submit.findSearchBox);
    };
    submit.init();
  });

  it('should register click listener', () => {
    submit.root = <HTMLElement & any>{
      addEventListener: (event, cb): any => {
        expect(event).to.eq('click');
        expect(cb).to.eq(submit.submitQuery);
      }
    };
    submit.init();
  });

  it('should find search box', () => {
    const queryTag = document.createElement('div');
    document.body.appendChild(queryTag);
    queryTag.setAttribute('riot-tag', 'gb-raw-query');

    submit.init();
    submit.findSearchBox();

    expect(submit.searchBox).to.eq(queryTag);

    document.body.removeChild(queryTag);
  });

  it('should submit query', () => {
    const query = 'something';
    flux.reset = (value): any => expect(value).to.eq(query);

    submit.searchBox = <HTMLInputElement>{ value: query };
    submit.init();

    submit.submitQuery();
    expect(submit.searchBox.value).to.eq(query);
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

    submit.searchBox = <HTMLInputElement>{ value: query };
    submit.init();
    submit.staticSearch = true;

    submit.submitQuery();
  });
});
