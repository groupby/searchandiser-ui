import {
  addDollarSigns,
  configure,
  setAliases,
  setParents,
  setScope,
  setTagName,
  FluxTag,
  MixinFlux
} from '../../../src/tags/tag';
import { expect } from 'chai';

describe('base tag logic', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  describe('FluxTag', () => {
    let tag: FluxTag<any>;

    beforeEach(() => {
      tag = new FluxTag();
    });

    describe('init()', () => {

      beforeEach(() => {
        tag.root = <any>{ tagName: 'gb-test-tag' };
        tag.opts = {};
        tag.config = {};
      });

      it('should not set _style empty', () => {
        tag.init();

        expect(tag._style).to.eq('');
      });

      it('should set _style', () => {
        tag.config = { stylish: true };

        tag.init();

        expect(tag._style).to.eq('gb-stylish');
      });
    });

    describe('alias()', () => {

      beforeEach(() => {
        tag._aliases = {};
      });

      it('should accept alias name as a string', () => {
        const alias = 'item';

        tag.alias(alias);

        expect(tag._aliases[alias]).to.eq(tag);
      });

      it('should accept alias name as a array of strings', () => {
        const aliases = ['item', 'item2', 'item3'];

        tag.alias(aliases);

        aliases.forEach((alias) => expect(tag._aliases[alias]).to.eq(tag));
      });

      it('should alias provided object from name', () => {
        const alias = 'item';
        const obj = { a: 'b' };

        tag.alias(alias, obj);

        expect(tag._aliases[alias]).to.eq(obj);
      });

      it('should alias provided object from names', () => {
        const aliases = ['item', 'item2', 'item3'];
        const obj = { a: 'b' };

        tag.alias(aliases, obj);

        aliases.forEach((alias) => expect(tag._aliases[alias]).to.eq(obj));
      });
    });

    describe('unalias()', () => {
      it('should remove alias from _aliases', () => {
        const alias = 'item';
        tag._aliases = { [alias]: {} };

        tag.unalias(alias);

        expect(tag._aliases).to.not.have.property(alias);
      });
    });

    describe('_mixin()', () => {
      it('should call mixin() with the __proto__ of every new instance', () => {
        const proto = { a: 'b' };
        class Mixin {
          constructor() {
            return { __proto__: proto };
          }
        }
        const mixin = tag.mixin = sinon.spy();

        tag._mixin(Mixin, Mixin, Mixin);

        expect(mixin).to.have.been.calledWith(proto, proto, proto);
      });
    });

    describe('_scopeTo()', () => {
      it('should set _scope to the parent specified', () => {
        const scopeName = 'my-parent';
        const scope = { a: 'b' };
        tag._parents = { [scopeName]: scope };

        tag._scopeTo(scopeName);

        expect(tag._scope).to.eq(scope);
      });
    });
  });

  describe('setTagName()', () => {
    it('should not set _tagName', () => {
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'SOMENAME',
          dataset: {},
          getAttribute: () => null
        }
      };

      setTagName(tag);

      expect(tag._tagName).to.not.be.ok;
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

      expect(tag._tagName).to.eq('my-some-name');
    });

    it('should set _tagName from root.tagName', () => {
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'GB-TEST-TAG'
        }
      };

      setTagName(tag);

      expect(tag._tagName).to.eq('gb-test-tag');
    });

    it('should set _tagName from dataset.is', () => {
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'SOMENAME',
          dataset: {
            is: 'gb-test-tag'
          }
        }
      };

      setTagName(tag);

      expect(tag._tagName).to.eq('gb-test-tag');
    });
  });

  describe('setParents()', () => {
    it('should set empty _parents', () => {
      const tag: FluxTag<any> = <any>{};

      setParents(tag);

      expect(tag._parents).to.eql({});
    });

    it('should inherit _parents', () => {
      const _parents = { a: 'b' };
      const tag: FluxTag<any> = <any>{ parent: { _parents } };

      setParents(tag);

      expect(tag._parents).to.eql(_parents);
    });

    it('should register self in _parents', () => {
      const _tagName = 'gb-test-tag';
      const tag: FluxTag<any> = <any>{ _tagName };

      setParents(tag);

      expect(tag._parents).to.eql({ [_tagName]: tag });
    });

    it('should register self and inherit _parents', () => {
      const _tagName = 'gb-test-tag';
      const _parents = { a: 'b' };
      const tag: FluxTag<any> = <any>{ _tagName, parent: { _parents } };

      setParents(tag);

      expect(tag._parents).to.eql(Object.assign({ [_tagName]: tag }, _parents));
    });
  });

  describe('setScope()', () => {
    it('should set scope from the configured parent tag', () => {
      const parentScope = { a: 'b' };
      const tag: FluxTag<any> = <any>{
        _parents: { parentScope },
        opts: { scope: 'parentScope' }
      };

      setScope(tag);

      expect(tag._scope).to.eq(parentScope);
    });

    it('should set scope from parent tag', () => {
      const parentScope = { a: 'b' };
      const tag: FluxTag<any> = <any>{ _scope: parentScope, opts: {} };

      setScope(tag);

      expect(tag._scope).to.eq(parentScope);
    });

    it('should search for the highest _scope', () => {
      const topParent = { a: 'b' };
      const tag: FluxTag<any> = <any>{
        opts: {},
        parent: {
          parent: {
            parent: {
              parent: {
                parent: topParent
              }
            }
          }
        }
      };

      setScope(tag);

      expect(tag._scope).to.eq(topParent);
    });
  });

  describe('setAliases()', () => {
    it('should inherit parent aliases', () => {
      const tag: any = {
        parent: {
          _aliases: {
            c: 'd'
          }
        },
        opts: {}
      };

      setAliases(tag);

      expect(tag._aliases).to.eql({ c: 'd' });
    });

    it('should expose alias from opts', () => {
      const tag: any = {
        opts: {
          alias: 'idk'
        }
      };

      setAliases(tag);

      expect(tag._aliases).to.eql({ idk: tag });
    });

    it('should override alias from parent', () => {
      const tag: any = {
        parent: {
          _aliases: {
            a: 'b',
            c: 'd'
          }
        },
        opts: {
          alias: 'a'
        }
      };

      setAliases(tag);

      expect(tag._aliases).to.eql({ a: tag, c: 'd' });
    });

    it('should expose aliases on scope', () => {
      const tag: any = {
        parent: {
          _aliases: {
            a: 'b',
            c: 'd'
          }
        },
        opts: {}
      };

      setAliases(tag);

      expect(tag.$a).to.eq('b');
      expect(tag.$c).to.eq('d');
    });
  });

  describe('addDollarSigns()', () => {
    it('should add dollar sign prefix to every key', () => {
      expect(addDollarSigns({ a: 1, b: 2 })).to.eql({ $a: 1, $b: 2 });
    });
  });

  describe('configure()', () => {
    it('should mix together configuration sources', () => {
      const tag: any = {
        _tagName: 'gb-my-tag',
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

      expect(tag._config).to.eql({
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
      const tag: any = { opts: {}, _tagName: '' };

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

      expect(tag._config).to.eql({
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
