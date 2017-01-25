import { FluxTag, META, STYLISH } from '../../../src/tags/tag';
import * as utils from '../../../src/utils/common';
import {
  addDollarSigns,
  addMeta,
  buildConfiguration,
  camelizeTagName,
  configure,
  inheritAliases,
  setStylish,
  setTagName,
  updateDependency,
  MixinFlux,
  STYLISH_CLASS
} from '../../../src/utils/tag';
import { expect } from 'chai';

describe('tag utils', () => {
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

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

  describe('inheritAliases()', () => {
    it('should inherit parent aliases', () => {
      const tag: any = {
        parent: {
          _aliases: {
            c: 'd'
          }
        },
        opts: {}
      };

      inheritAliases(tag);

      expect(tag._aliases).to.eql({ c: 'd' });
    });

    it('should expose alias from opts', () => {
      const tag: any = {
        opts: {
          alias: 'idk'
        }
      };

      inheritAliases(tag);

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

      inheritAliases(tag);

      expect(tag._aliases).to.eql({ a: tag, c: 'd' });
    });

    it('should expose aliases', () => {
      const tag: any = {
        parent: {
          _aliases: {
            a: 'b',
            c: 'd'
          }
        },
        opts: {}
      };

      inheritAliases(tag);

      expect(tag.$a).to.eq('b');
      expect(tag.$c).to.eq('d');
    });
  });

  describe('configure()', () => {
    it('should mix configuration into tag', () => {
      const tag: any = { opts: { a: 'b', c: 'd' } };

      configure(tag);

      expect(tag).to.have.property('a', 'b');
      expect(tag).to.have.property('c', 'd');
    });

    it('should configure if tag[META] available', () => {
      const defaults = { a: 'b' };
      const types = { c: 'd' };
      const services = ['e', 'f'];
      const tag: any = {
        opts: {},
        [META]: { defaults, types, services }
      };
      const collectServiceConfigs = sandbox.stub(utils, 'collectServiceConfigs');
      const coerceAttributes = sandbox.stub(utils, 'coerceAttributes');

      const config = configure(tag);

      expect(config).to.eql(defaults);
      expect(collectServiceConfigs).to.be.calledWith(tag, services);
      expect(coerceAttributes).to.be.calledWith(sinon.match.any, types);
    });

    it('should call setDefaults() if it exists', () => {
      const setDefaults = sinon.spy();
      const tag: any = { opts: {}, setDefaults };

      configure(tag);

      expect(setDefaults).to.be.calledWith(sinon.match.object);
    });
  });

  describe('buildConfiguration()', () => {
    it('should call collectServiceConfigs()', () => {
      const collectServiceConfigs = sandbox.stub(utils, 'collectServiceConfigs');
      const services = ['a', 'b'];
      const tag: any = { opts: {} };
      sandbox.stub(utils, 'coerceAttributes');

      buildConfiguration(tag, { services });

      expect(collectServiceConfigs).to.be.calledWith(tag, services);
    });

    it('should call collectServiceConfigs() default to empty services list', () => {
      const collectServiceConfigs = sandbox.stub(utils, 'collectServiceConfigs');
      const tag: any = { opts: {} };
      sandbox.stub(utils, 'coerceAttributes');

      buildConfiguration(tag, {});

      expect(collectServiceConfigs).to.be.calledWith(tag, []);
    });

    it('should call coerceAttributes() with opts and types', () => {
      const coerceAttributes = sandbox.stub(utils, 'coerceAttributes');
      const types = { a: 'b' };
      const tag: any = { opts: {} };

      buildConfiguration(tag, { types });

      expect(coerceAttributes).to.be.calledWith(tag.opts, types);
    });

    it('should call coerceAttributes() with opts and empty types', () => {
      const coerceAttributes = sandbox.stub(utils, 'coerceAttributes');
      const tag: any = { opts: {} };

      buildConfiguration(tag, {});

      expect(coerceAttributes).to.be.calledWith(tag.opts, {});
    });

    it('should find global tag configuration', () => {
      const globalConfig = { a: 'b', c: 'd' };
      const tag: any = {
        _tagName: 'gb-my-tag',
        config: { tags: { myTag: globalConfig } },
        opts: {}
      };

      const finalConfig = buildConfiguration(tag, {});

      expect(finalConfig).to.eql(globalConfig);
    });

    it('should use provided defaults', () => {
      const defaults = { a: 'b', c: 'd' };
      const tag: any = { opts: {} };

      const finalConfig = buildConfiguration(tag, { defaults });
      expect(finalConfig).to.eql(defaults);
    });

    it('should return combined config', () => {
      const defaults = { a: 'b', c: 'd', e: 'f', g: 'h', i: 'j', k: 'l' };
      const types = { k: 'boolean' };
      const services = ['service1', 'service2'];
      const tag: any = {
        _tagName: 'gb-my-tag',
        services: {
          service1: { _config: { c: 'd1', e: 'f1', g: 'h1', i: 'j1', k: 'l1' } },
          service2: { _config: { e: 'f2', g: 'h2', i: 'j2', k: 'l2' } }
        },
        config: { tags: { myTag: { g: 'h3', i: 'j3', k: 'l3' } } },
        opts: {
          __proto__: { i: 'j4', k: 'l4' },
          k: 'l5'
        }
      };

      const finalConfig = buildConfiguration(tag, { defaults, types, services });
      expect(finalConfig).to.eql({ a: 'b', c: 'd1', e: 'f2', g: 'h3', i: 'j4', k: true });
    });
  });

  describe('updateDependency()', () => {
    it('should inherit from parent._aliases', () => {
      const untransformed = { bb: 'c' };
      const transformed = { bb: 'd' };
      const transform = sinon.spy(() => transformed);
      const expose = sinon.spy();
      const alias = 'a';
      const realias = 'b';
      const tag: any = {
        parent: {
          _aliases: { [alias]: untransformed }
        },
        expose
      };
      sandbox.stub(utils, 'coerceAttributes');

      updateDependency(tag, { alias, realias, transform });

      expect(transform).to.be.calledWith(untransformed);
      expect(expose).to.be.calledWith(realias, transformed);
    });

    it('should call coerceAttributes()', () => {
      const opts = { a: 'b' };
      const types = { c: 'd' };
      const tag: any = {
        opts,
        _types: types,
        _dependencies: { a: () => expect.fail() },
        expose: () => null
      };
      const coerceAttributes = sandbox.stub(utils, 'coerceAttributes');

      updateDependency(tag, { alias: 'a', realias: 'a', transform: () => null }, { types });

      expect(coerceAttributes).to.be.calledWith(opts, types);
    });

    it('should use defaults if provided', () => {
      const defaults = { a: 'b' };
      const expose = sinon.spy();
      const alias = 'a';
      const tag: any = { expose };
      sandbox.stub(utils, 'coerceAttributes');

      updateDependency(tag, { alias, realias: alias, transform: (obj) => obj }, { defaults });

      expect(expose).to.be.calledWith(alias, defaults);
    });

    it('should combine defaults, dependency and attributes', () => {
      const coerced = { e: 'f2' };
      const expose = sinon.spy();
      const alias = 'a';
      const tag: any = {
        parent: {
          _aliases: { [alias]: { c: 'd1', e: 'f1' } }
        },
        expose
      };
      sandbox.stub(utils, 'coerceAttributes', () => coerced);

      updateDependency(tag, {
        alias,
        realias: alias,
        transform: (obj) => obj
      }, { defaults: { a: 'b', c: 'd', e: 'f' } });

      expect(expose).to.be.calledWith(alias, { a: 'b', c: 'd1', e: 'f2' });
    });
  });

  describe('addMeta()', () => {
    it('should create a META property if it does not exist', () => {
      const tag: any = {};

      addMeta(tag, {});

      expect(tag[META]).to.eql({});
    });

    it('should not set META property if already exists', () => {
      const meta = { a: 'b' };
      const tag: any = { [META]: meta };

      addMeta(tag, {});

      expect(tag[META]).to.eq(meta);
    });

    it('should add every existing property parameter', () => {
      const tag: any = {};
      const prop1 = { a: 'b' };
      const prop2 = { c: 'd' };

      addMeta(tag, { prop1, prop2 }, 'prop1', 'prop3');

      expect(tag[META]).to.eql({ prop1 });
    });
  });

  describe('setStylish()', () => {
    const ROOT = { classList: { add: () => null } };

    it('should set from config', () => {
      const tag: any = {
        root: ROOT,
        config: { stylish: true },
        opts: {}
      };

      setStylish(tag);

      expect(tag[STYLISH]).to.be.true;
    });

    it('should set from opts', () => {
      const tag: any = {
        root: ROOT,
        config: { stylish: true },
        opts: { stylish: null }
      };
      const checkBooleanAttr = sandbox.stub(utils, 'checkBooleanAttr', () => 'this');

      setStylish(tag);

      expect(tag[STYLISH]).to.be.true;
      expect(checkBooleanAttr).to.be.calledWith('stylish', tag.opts, true);
    });

    it('should set from parent', () => {
      const tag: any = {
        root: ROOT,
        config: { stylish: true },
        parent: { [STYLISH]: 'this' },
        opts: {}
      };

      setStylish(tag);

      expect(tag[STYLISH]).to.be.true;
    });

    it('should add class to root', () => {
      const add = sinon.spy();
      const tag: any = {
        root: { classList: { add } },
        config: { stylish: true },
        opts: {}
      };

      setStylish(tag);

      expect(add).to.be.calledWith(STYLISH_CLASS);
    });
  });

  describe('addDollarSigns()', () => {
    it('should add dollar sign prefix to every key', () => {
      expect(addDollarSigns({ a: 1, b: 2 })).to.eql({ $a: 1, $b: 2 });
    });
  });

  describe('camelizeTagName()', () => {
    it('should remove prefix and camelcase string', () => {
      expect(camelizeTagName('gb-my-tag')).to.eq('myTag');
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
