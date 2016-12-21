import {
  configure,
  convertSchema,
  inherit,
  setParents,
  setScope,
  setTagName,
  FluxTag,
  MixinFlux
} from '../../../src/tags/tag';
import * as utils from '../../../src/utils/common';
import { expect } from 'chai';

describe('base tag logic', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('FluxTag', () => {
    describe('init()', () => {
      let tag: FluxTag<any>;

      beforeEach(() => {
        tag = new FluxTag();
        tag.root = <any>{ tagName: 'gb-test-tag' };
        tag.opts = {};
        tag.config = {};
      });

      it('should listen for mount', () => {
        const on = tag.on = sinon.spy();

        tag.init();

        expect(on).to.have.been.calledWithMatch('mount', sinon.match.func);
      });
    });
  });

  describe('setTagName()', () => {
    it('should not set tag name', () => {
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'SOMENAME',
          dataset: {},
          getAttribute: () => null
        }
      };

      setTagName(tag);

      expect(tag.$tagName).to.not.be.ok;
    });

    it('should fall back to root.tagName', () => {
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'MY-SOME-NAME',
          dataset: {},
          getAttribute: () => null
        }
      };

      setTagName(tag);

      expect(tag.$tagName).to.eq('my-some-name');
    });

    it('should set tag names from root.tagName', () => {
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'GB-TEST-TAG'
        }
      };

      setTagName(tag);

      expect(tag.$tagName).to.eq('gb-test-tag');
    });

    it('should set tag names from dataset.is', () => {
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'SOMENAME',
          dataset: {
            is: 'gb-test-tag'
          }
        }
      };

      setTagName(tag);

      expect(tag.$tagName).to.eq('gb-test-tag');
    });
  });

  describe('setParents()', () => {
    it('should set empty $parents', () => {
      const tag: FluxTag<any> = <any>{};

      setParents(tag);

      expect(tag.$parents).to.eql({});
    });

    it('should inherit $parents', () => {
      const $parents = { a: 'b' };
      const tag: FluxTag<any> = <any>{ parent: { $parents } };

      setParents(tag);

      expect(tag.$parents).to.eql($parents);
    });

    it('should register self in $parents', () => {
      const $tagName = 'gb-test-tag';
      const tag: FluxTag<any> = <any>{ $tagName };

      setParents(tag);

      expect(tag.$parents).to.eql({ [$tagName]: tag });
    });

    it('should register self and inherit $parents', () => {
      const $tagName = 'gb-test-tag';
      const $parents = { a: 'b' };
      const tag: FluxTag<any> = <any>{ $tagName, parent: { $parents } };

      setParents(tag);

      expect(tag.$parents).to.eql(Object.assign({ [$tagName]: tag }, $parents));
    });

    it('should add all parents to $parents', () => {
      const parent3 = { a: 'b' };
      const parent2 = { parent: parent3 };
      const parent1 = { $parents: { e: 'e' }, parent: parent2 };
      const tag: FluxTag<any> = <any>{ parent: parent1 };

      setParents(tag);

      expect(tag.$parents).to.eql(parent1.$parents);
    });
  });

  describe('setScope()', () => {
    it('should set scope from the configured parent tag', () => {
      const parentScope = { a: 'b' };
      const tag: FluxTag<any> = <any>{
        $parents: { parentScope },
        opts: { scope: 'parentScope' }
      };

      setScope(tag);

      expect(tag.$scope).to.eq(parentScope);
    });

    it('should set scope from parent tag', () => {
      const parentScope = { a: 'b' };
      const tag: FluxTag<any> = <any>{ $scope: parentScope, opts: {} };

      setScope(tag);

      expect(tag.$scope).to.eq(parentScope);
    });
  });

  describe('configure()', () => {
    it('should mix together configuration sources', () => {
      const tag: any = {
        $tagName: 'gb-my-tag',
        config: { tags: { myTag: { a: 'B', i: 'j', k: 'l', m: 'n' } } },
        opts: {
          __proto__: { c: 'D', i: 'J', o: 'p', q: 'r' },
          e: 'F',
          k: 'L',
          o: 'P',
          s: 't'
        }
      };

      configure({ a: 'b', c: 'd', e: 'f', g: 'h' }, tag);

      expect(tag.$config).to.eql({
        a: 'B',
        c: 'D',
        e: 'F',
        g: 'h',
        i: 'J',
        k: 'L',
        m: 'n',
        o: 'P',
        q: 'r',
        s: 't'
      });
    });

    it('should convert boolean values', () => {
      const tag: any = { opts: {}, $tagName: 'gb-my-tag' };

      configure({
        a: 'false',
        b: false,
        c: 'true',
        d: true,
        e: undefined,
        f: null,
        g: [],
        h: {},
        i: '',
        j: ' ',
        k: 'other',
        l: -1,
        m: 0,
        n: 1
      }, tag);

      expect(tag.$config).to.eql({
        a: 'false',
        b: false,
        c: 'true',
        d: true,
        e: undefined,
        f: null,
        g: [],
        h: {},
        i: true,
        j: true,
        k: 'other',
        l: -1,
        m: 0,
        n: 1
      });
    });
  });

  describe('convertSchema()', () => {
    it('should convert schema into scoped buckets', () => {
      const root = { a: 'b' };

      const converted = convertSchema(<any>{ root }, {
        height: {
          value: 23,
          for: 'some-tag'
        },
        width: {
          value: 12,
          for: 'other-tag'
        }
      });

      expect(converted).to.eql([
        {
          cssSelector: 'some-tag',
          from: root,
          values: {
            height: 23
          }
        }, {
          cssSelector: 'other-tag',
          from: root,
          values: {
            width: 12
          }
        }
      ]);
    });

    it('should add multiple values to the same bucket', () => {
      const root = { a: 'b' };

      const converted = convertSchema(<any>{ root }, {
        height: {
          value: 23,
          for: 'some-tag'
        },
        width: {
          value: 12,
          for: 'some-tag'
        }
      });

      expect(converted).to.eql([
        {
          cssSelector: 'some-tag',
          from: root,
          values: {
            height: 23,
            width: 12
          }
        }
      ]);
    });

    it('should not expose internals', () => {
      const root = { a: 'b' };

      const converted = convertSchema(<any>{ root }, {
        height: {
          value: 23,
          for: 'some-tag'
        },
        width: {
          value: 12
        }
      });

      expect(converted).to.eql([
        {
          cssSelector: 'some-tag',
          from: root,
          values: {
            height: 23
          }
        }
      ]);
    });
  });

  describe.only('inherit()', () => {
    it('should set computed to empty object if no scope found', () => {
      const tag: any = {};
      sandbox.stub(utils, 'findClosestScope').returns(null);

      inherit(tag);

      expect(tag.$computed).to.eql({});
    });

    it('should', () => {

    });
  });

  describe('MixinFlux()', () => {
    it('should return a new FluxTag', () => {
      const flux: any = {};
      const config: any = {};
      const services: any = {};

      const fluxTag = MixinFlux(flux, config, services);

      expect(fluxTag).to.be.ok;
      expect(fluxTag.flux).to.be.eq(flux);
      expect(fluxTag.config).to.be.eq(config);
      expect(fluxTag.services).to.be.eq(services);
    });
  });
});
