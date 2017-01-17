import { FluxTag } from '../../../src/tags/tag';
import * as utils from '../../../src/utils/common';
import {
  addDollarSigns,
  camelizeTagName,
  configure,
  exposeAliases,
  setTagName,
  MixinFlux
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

  describe('exposeAliases()', () => {
    it('should inherit parent aliases', () => {
      const tag: any = {
        parent: {
          _aliases: {
            c: 'd'
          }
        },
        opts: {}
      };

      exposeAliases(tag);

      expect(tag._aliases).to.eql({ c: 'd' });
    });

    it('should expose alias from opts', () => {
      const tag: any = {
        opts: {
          alias: 'idk'
        }
      };

      exposeAliases(tag);

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

      exposeAliases(tag);

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

      exposeAliases(tag);

      expect(tag.$a).to.eq('b');
      expect(tag.$c).to.eq('d');
    });
  });

  describe('configure()', () => {
    it('should pass function to onConfigure()', () => {
      const onConfigure = sinon.spy();
      const tag: any = { onConfigure };

      configure(tag);

      expect(onConfigure).to.have.been.calledWith(sinon.match.func);
    });

    it('should not call onConfigure() if it does not exist', () => {
      expect(() => configure(<any>{})).to.not.throw;
    });

    it('should call collectServiceConfigs()', () => {
      const collectServiceConfigs = sandbox.stub(utils, 'collectServiceConfigs');
      const services = ['a', 'b'];
      const tag: any = { onConfigure: (config) => config({ services }), opts: {}, _tagName: '' };
      sandbox.stub(utils, 'coerceAttributes');

      configure(tag);

      expect(collectServiceConfigs).to.have.been.calledWith(tag, services);
    });

    it('should call collectServiceConfigs() default to empty services list', () => {
      const collectServiceConfigs = sandbox.stub(utils, 'collectServiceConfigs');
      const tag: any = { onConfigure: (config) => config({}), opts: {}, _tagName: '' };
      sandbox.stub(utils, 'coerceAttributes');

      configure(tag);

      expect(collectServiceConfigs).to.have.been.calledWith(tag, []);
    });

    it('should call coerceAttributes() with opts and types', () => {
      const coerceAttributes = sandbox.stub(utils, 'coerceAttributes');
      const types = { a: 'b' };
      const tag: any = { onConfigure: (config) => config({ types }), opts: {}, _tagName: '' };

      configure(tag);

      expect(coerceAttributes).to.have.been.calledWith(tag.opts, types);
    });

    it('should call coerceAttributes() with opts and empty types', () => {
      const coerceAttributes = sandbox.stub(utils, 'coerceAttributes');
      const tag: any = { onConfigure: (config) => config({}), opts: {}, _tagName: '' };

      configure(tag);

      expect(coerceAttributes).to.have.been.calledWith(tag.opts, {});
    });

    it('should find global tag configuration', () => {
      const globalConfig = { a: 'b', c: 'd' };
      const tag: any = {
        _tagName: 'gb-my-tag',
        config: { tags: { myTag: globalConfig } },
        opts: {},
        onConfigure: (config) => {
          const finalConfig = config({});
          expect(finalConfig).to.eql(globalConfig);
        }
      };

      configure(tag);
    });

    it('should use provided defaults', () => {
      const defaults = { a: 'b', c: 'd' };
      const tag: any = {
        _tagName: '',
        opts: {},
        onConfigure: (config) => {
          const finalConfig = config({ defaults });
          expect(finalConfig).to.eql(defaults);
        }
      };

      configure(tag);
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
        },
        onConfigure: (config) => {
          const finalConfig = config({ defaults, types, services });
          expect(finalConfig).to.eql({ a: 'b', c: 'd1', e: 'f2', g: 'h3', i: 'j4', k: true });
        }
      };

      configure(tag);
    });

    it('should mix configuration into tag', () => {
      const tag: any = {
        _tagName: '',
        opts: { a: 'b', c: 'd' },
        onConfigure: (config) => {
          config({});
          expect(tag).to.have.property('a', 'b');
          expect(tag).to.have.property('c', 'd');
        }
      };

      configure(tag);
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
