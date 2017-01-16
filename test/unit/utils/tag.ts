import { FluxTag } from '../../../src/tags/tag';
import * as utils from '../../../src/utils/common';
import {
  addDollarSigns,
  camelizeTagName,
  configure,
  setAliases,
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

      setAliases(tag);

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
      const tag: any = { onConfigure: (config) => config({ services }), opts: {} };
      sandbox.stub(utils, 'coerceAttributes');

      configure(tag);

      expect(collectServiceConfigs).to.have.been.calledWith(tag, services);
    });

    it('should call collectServiceConfigs() default to empty services list', () => {
      const collectServiceConfigs = sandbox.stub(utils, 'collectServiceConfigs');
      const tag: any = { onConfigure: (config) => config({}), opts: {} };
      sandbox.stub(utils, 'coerceAttributes');

      configure(tag);

      expect(collectServiceConfigs).to.have.been.calledWith(tag, []);
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
