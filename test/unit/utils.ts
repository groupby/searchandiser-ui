import utils = require('../../src/utils');
import { WINDOW } from '../../src/utils';
import { expect } from 'chai';
import { Navigation } from 'groupby-api';

describe('utils', () => {
  let sandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('findSearchBox()', () => {
    it('should find the input element in the search box', () => {
      const el = document.createElement('gb-query');
      document.body.appendChild(el);
      el['_tag'] = { searchBox: 'searchBox' };

      expect(utils.findSearchBox()).to.eq('searchBox');
    });
  });

  describe('findTag()', () => {
    it('should return tag', () => {
      const el = document.createElement('gb-test');
      document.body.appendChild(el);
      const el2 = document.createElement('div');
      document.body.appendChild(el2);
      el2.dataset['is'] = 'gb-sayt';
      const el3 = document.createElement('div');
      document.body.appendChild(el3);
      const attr = document.createAttribute('riot-tag');
      attr.value = 'gb-breadcrumbs';
      el3.setAttributeNode(attr);

      expect(utils.findTag('gb-test')).to.eq(el);
      expect(utils.findTag('gb-sayt')).to.eq(el2);
      expect(utils.findTag('gb-breadcrumbs')).to.eq(el3);
    });
  });

  describe('toRefinement()', () => {
    it('should return refinement', () => {
      let ref: utils.SelectedRefinement = Object.assign({}, { type: 'Value', value: 'High' });
      let nav: Navigation = Object.assign({}, { name: 'Type' });
      let ref2: utils.SelectedRefinement = Object.assign({}, { type: 'Range', high: '5', low: '4' });

      const refinement = utils.toRefinement(ref, nav);
      const refinement2 = utils.toRefinement(ref2, nav);

      expect(refinement).to.eql({ type: ref.type, value: ref.value, navigationName: nav.name });
      expect(refinement2).to.eql({ type: ref2.type, high: ref2.high, low: ref2.low, navigationName: nav.name });
    });
  });

  describe('displayRefinement()', () => {
    it('should return string to display for refinement', () => {
      let ref: utils.SelectedRefinement = Object.assign({}, { type: 'Value', value: 'Rugs' });
      let ref2: utils.SelectedRefinement = Object.assign({}, { type: 'Range', high: '5', low: '4' });

      expect(utils.displayRefinement(ref)).to.eq(ref.value);
      expect(utils.displayRefinement(ref2)).to.eq('4 - 5');
    });
  });

  describe('checkNested()', () => {
    const obj = { tags: { sort: { options: {} } } };
    const obj2 = {};
    it('should return true if has nested objects', () => {
      expect(utils.checkNested(obj, 'tags', 'sort', 'options')).to.be.true;
    });

    it('should return false if does not have nested objects', () => {
      expect(utils.checkNested(obj2, 'tags', 'sort', 'options')).to.be.false;
    });
  });

  describe('updateLocation()', () => {
    it('should update window location', () => {
      sandbox.stub(WINDOW, 'pathname', () => 'www.google.ca');
      sandbox.stub(WINDOW, 'setSearch', (search) => {
        expect(search).to.eq('?query=shoes&refinements=%5B1%2C2%2C3%5D');
      });
      sandbox.stub(WINDOW, 'replace', (url) => {
        expect(url).to.eq('www.amazon.ca?query=shoes&refinements=%5B1%2C2%2C3%5D');
      });

      utils.updateLocation('www.google.ca', 'query', 'shoes', [1, 2, 3]);
      utils.updateLocation('www.amazon.ca', 'query', 'shoes', [1, 2, 3]);
    });
  });

  describe('unless()', () => {
    it('should return next param if first is undefined', () => {
      let empty;
      const notEmpty = 'Existence';
      expect(utils.unless(notEmpty, [])).to.eq(notEmpty);
      expect(utils.unless(empty, notEmpty)).to.eq(notEmpty);
      expect(utils.unless(empty, empty, empty, notEmpty)).to.eq(notEmpty);
    });
  });

  describe('getPath()', () => {
    it('should return object at path given', () => {
      const obj = { tags: { collections: { options: { a: 'b', c: 'd' } } } };
      const path = 'tags.collections';
      expect(utils.getPath(obj, path)).to.eq(obj.tags.collections);
    });
  });

  describe('remap()', () => {
    it('should removes keys that do not appear in the mapping', () => {
      expect(utils.remap({ b: 'a', c: 'test' }, { a: 'b', d: 'c' })).to.eql({ a: 'a', d: 'test' });
    });
  });

  describe('checkBooleanAttr()', () => {
    it('should process strings as booleans', () => {
      const options = { attr1: true, attr2: 'true', attr3: false, attr4: 'false' };

      expect(utils.checkBooleanAttr('attr1', options)).to.be.true;
      expect(utils.checkBooleanAttr('attr2', options)).to.be.true;
      expect(utils.checkBooleanAttr('attr3', options)).to.be.false;
      expect(utils.checkBooleanAttr('attr4', options)).to.be.false;
      expect(utils.checkBooleanAttr('attr5', options)).to.be.false;
    });
  });
});
