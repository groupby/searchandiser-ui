import {
  checkBooleanAttr,
  checkNested,
  displayRefinement,
  findSearchBox,
  findTag,
  getPath,
  remap,
  toRefinement,
  unless
} from '../../../src/utils/common';
import { expect } from 'chai';

describe('utils', () => {
  let sandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('findSearchBox()', () => {
    it('should find the input element in the search box', () => {
      const el = document.createElement('gb-query');
      document.body.appendChild(el);
      el['_tag'] = { searchBox: 'searchBox' };

      expect(findSearchBox()).to.eq('searchBox');
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

      expect(findTag('gb-test')).to.eq(el);
      expect(findTag('gb-sayt')).to.eq(el2);
      expect(findTag('gb-breadcrumbs')).to.eq(el3);
    });
  });

  describe('toRefinement()', () => {
    it('should return refinement', () => {
      const ref1: any = { type: 'Value', value: 'High' };
      const ref2: any = { type: 'Range', high: '5', low: '4' };
      const nav: any = { name: 'Type' };
      const refinement1 = toRefinement(ref1, nav);
      const refinement2 = toRefinement(ref2, nav);

      expect(refinement1).to.eql({
        type: ref1.type,
        value: ref1.value,
        navigationName: nav.name
      });
      expect(refinement2).to.eql({
        type: ref2.type,
        high: ref2.high,
        low: ref2.low,
        navigationName: nav.name
      });
    });
  });

  describe('displayRefinement()', () => {
    it('should return string to display for refinement', () => {
      const ref1: any = { type: 'Value', value: 'Rugs' };
      const ref2: any = { type: 'Range', high: '5', low: '4' };

      expect(displayRefinement(ref1)).to.eq(ref1.value);
      expect(displayRefinement(ref2)).to.eq('4 - 5');
    });
  });

  describe('checkNested()', () => {
    it('should return true if has nested objects', () => {
      const obj = { tags: { sort: { options: {} } } };

      expect(checkNested(obj, 'tags', 'sort', 'options')).to.be.true;
    });

    it('should return false if does not have nested objects', () => {
      expect(checkNested({}, 'tags', 'sort', 'options')).to.be.false;
    });
  });

  describe('unless()', () => {
    it('should return next param if first is undefined', () => {
      let empty;
      const notEmpty = 'Existence';

      expect(unless(notEmpty, [])).to.eq(notEmpty);
      expect(unless(empty, notEmpty)).to.eq(notEmpty);
      expect(unless(empty, empty, empty, notEmpty)).to.eq(notEmpty);
    });
  });

  describe('getPath()', () => {
    it('should return object at path given', () => {
      const obj = { tags: { collections: { options: { a: 'b', c: 'd' } } } };
      const path = 'tags.collections';

      expect(getPath(obj, path)).to.eq(obj.tags.collections);
    });
  });

  describe('remap()', () => {
    it('should removes keys that do not appear in the mapping', () => {
      expect(remap({ b: 'a', c: 'test' }, { a: 'b', d: 'c' })).to.eql({ a: 'a', d: 'test' });
    });
  });

  describe('checkBooleanAttr()', () => {
    it('should process strings as booleans', () => {
      const options = { attr1: true, attr2: 'true', attr3: false, attr4: 'false' };

      expect(checkBooleanAttr('attr1', options)).to.be.true;
      expect(checkBooleanAttr('attr2', options)).to.be.true;
      expect(checkBooleanAttr('attr3', options)).to.be.false;
      expect(checkBooleanAttr('attr4', options)).to.be.false;
      expect(checkBooleanAttr('attr5', options)).to.be.false;
    });
  });
});
