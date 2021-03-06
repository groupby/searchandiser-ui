import {
  checkBooleanAttr,
  checkNested,
  coerceAttributes,
  collectServiceConfigs,
  debounce,
  displayRefinement,
  findSearchBox,
  findTag,
  getParam,
  getPath,
  refinementMatches,
  remap,
  scopeCss,
  toRefinement,
  unless,
  LOCATION
} from '../../../src/utils/common';
import { expect } from 'chai';
import * as origDebounce from 'debounce';
import * as queryString from 'query-string';

describe('utils', () => {
  let sandbox: Sinon.SinonSandbox;

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

      expect(findTag('gb-test')).to.eq(el);
      expect(findTag('gb-sayt')).to.eq(el2);
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

  describe('refinementMatches()', () => {
    it('should not match if different types', () => {
      expect(refinementMatches(<any>{ type: 'a' }, <any>{ type: 'b' })).to.be.false;
    });

    it('should match Value refinements if same value', () => {
      const ref1: any = { type: 'Value', value: 'abc' };
      const ref2: any = { type: 'Value', value: 'abc' };

      expect(refinementMatches(ref1, ref2)).to.be.true;
    });

    it('should not match Value refinements if different value', () => {
      const ref1: any = { type: 'Value', value: 'abc' };
      const ref2: any = { type: 'Value', value: 'def' };

      expect(refinementMatches(ref1, ref2)).to.be.false;
    });

    it('should match Range refinements if same low and high', () => {
      const ref1: any = { type: 'Range', low: 10, high: 20 };
      const ref2: any = { type: 'Range', low: 10, high: 20 };

      expect(refinementMatches(ref1, ref2)).to.be.true;
    });

    it('should not match Range refinements if different low or high', () => {
      const ref1: any = { type: 'Range', low: 10, high: 20 };
      const ref2: any = { type: 'Range', low: 10, high: 30 };
      const ref3: any = { type: 'Range', low: 5, high: 20 };

      expect(refinementMatches(ref1, ref2)).to.be.false;
      expect(refinementMatches(ref1, ref3)).to.be.false;
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
      const original = { b: 'a', c: 'test' };
      const mapping = { a: 'b', d: 'c' };

      expect(remap(original, mapping)).to.eql({ a: 'a', d: 'test' });
    });

    it('should return original object', () => {
      const original = { b: 'a', c: 'test' };

      expect(remap(original)).to.eq(original);
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

    it('should accept defaultValue', () => {
      expect(checkBooleanAttr('test', {}, true)).to.be.true;
      expect(checkBooleanAttr('test', {}, false)).to.be.false;
    });
  });

  describe('getParam()', () => {
    it('should parse query string and return the requested parameter', () => {
      const query = '?a=b&c=d';
      const param = 'size';
      const value = 'Medium';
      sandbox.stub(LOCATION, 'getSearch').returns(query);
      sandbox.stub(queryString, 'parse').returns({ [param]: value });

      expect(getParam(param)).to.eq(value);
    });
  });

  describe('debounce()', () => {
    it('should export debounce', () => {
      expect(debounce).to.eq(origDebounce);
    });
  });

  describe('LOCATION', () => {
    it('should have properties', () => {
      expect(LOCATION.href()).to.eq(window.location.href);
      expect(LOCATION.getSearch()).to.eq(window.location.search);
      expect(LOCATION.pathname()).to.eq(window.location.pathname);
    });

    it('should call window.location.replace()', () => {
      const url = 'http://example.com/search';
      const replace = sandbox.stub(window.location, 'replace');

      LOCATION.replace(url);

      expect(replace).to.be.calledWith(url);
    });

    it('should call window.location.assign()', () => {
      const url = 'http://example.com/search';
      const assign = sandbox.stub(window.location, 'assign');

      LOCATION.assign(url);

      expect(assign).to.be.calledWith(url);
    });
  });

  describe('scopeCss()', () => {
    it('should generate multiple scoped CSS selectors', () => {
      const scopedSelector = scopeCss('gb-target', '.my > #selector');

      expect(scopedSelector).to.eq('gb-target .my > #selector, [data-is="gb-target"] .my > #selector'); // tslint:disable-line:max-line-length
    });
  });

  describe('coerceAttributes()', () => {
    it('should only coerce specified attributes', () => {
      const opts = { length: 'idk', table: 'idk' };
      const types: any = { length: 'boolean' };

      const coercedAttributes = coerceAttributes(opts, types);

      expect(coercedAttributes).to.eql({ length: true, table: 'idk' });
    });
  });

  describe('collectServiceConfigs()', () => {
    it('should collect service configs', () => {
      const config1 = { a: 'b' };
      const config2 = { c: 'd' };
      const tag: any = {
        services: {
          service1: { _config: config1 },
          service2: { _config: config2 }
        }
      };

      const configs = collectServiceConfigs(tag, ['service1', 'service2']);

      expect(configs).to.eql([config1, config2]);
    });

    it('should skip nonexistent service configs', () => {
      const serviceConfig = { a: 'b' };
      const tag: any = {
        services: {
          service1: { _config: serviceConfig },
          service2: {}
        }
      };

      const configs = collectServiceConfigs(tag, ['service1', 'service2', 'service3']);

      expect(configs).to.eql([serviceConfig]);
    });
  });
});
