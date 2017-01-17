import { FluxTag } from '../../../src/tags/tag';
import * as utils from '../../../src/utils/tag';
import { expectSubscriptions } from '../../utils/expectations';
import { expect } from 'chai';

describe.only('base tag logic', () => {
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
        tag.on = () => null;
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

      it('should call setTagName()', () => {
        const setTagName = sandbox.stub(utils, 'setTagName');

        tag.init();

        expect(setTagName).to.have.been.calledWith(tag);
      });

      it('should call setAliases()', () => {
        const setAliases = sandbox.stub(utils, 'setAliases');

        tag.init();

        expect(setAliases).to.have.been.calledWith(tag);
      });

      it('should listen for before-mount', () => {
        const configure = sandbox.stub(utils, 'configure');

        expectSubscriptions(() => tag.init(), {
          'before-mount': {
            test: (cb) => {
              cb();
              expect(configure).to.have.been.calledWith(tag);
            }
          }
        }, tag);
      });
    });

    describe('expose()', () => {

      beforeEach(() => {
        tag._aliases = {};
      });

      it('should accept alias name as a string', () => {
        const alias = 'item';

        tag.expose(alias);

        expect(tag._aliases[alias]).to.eq(tag);
      });

      it('should accept alias name as a array of strings', () => {
        const aliases = ['item', 'item2', 'item3'];

        tag.expose(aliases);

        aliases.forEach((alias) => expect(tag._aliases[alias]).to.eq(tag));
      });

      it('should alias provided object from name', () => {
        const alias = 'item';
        const obj = { a: 'b' };

        tag.expose(alias, obj);

        expect(tag._aliases[alias]).to.eq(obj);
      });

      it('should alias provided object from names', () => {
        const aliases = ['item', 'item2', 'item3'];
        const obj = { a: 'b' };

        tag.expose(aliases, obj);

        aliases.forEach((alias) => expect(tag._aliases[alias]).to.eq(obj));
      });
    });

    describe('unexpose()', () => {
      it('should remove alias from _aliases', () => {
        const alias = 'item';
        tag._aliases = { [alias]: {} };

        tag.unexpose(alias);

        expect(tag._aliases).to.not.have.property(alias);
      });
    });

    describe('depend()', () => {
      it('should set types, dependencies, and call updateDependencies', () => {
        const alias = 'alias';
        const options = { types: { bb: 'd' }, defaults: { a: 'b' } };
        const transform = () => null;
        const updateDependencies = sandbox.stub(utils, 'updateDependencies');
        tag._dependencies = {};
        tag.on = () => null;

        tag.depend(alias, options, transform);

        expect(tag._types).to.eq(options.types);
        expect(tag._dependencies[alias]).to.eq(transform);
        expect(updateDependencies).to.be.calledWith(tag, options.defaults);
      });

      it('should default to empty types', () => {
        sandbox.stub(utils, 'updateDependencies');
        tag._dependencies = {};
        tag.on = () => null;

        tag.depend('alias', {});

        expect(tag._types).to.eql({});
      });

      it('should listen for update', () => {
        const options = { defaults: { a: 'b' } };
        const updateDependencies = sandbox.stub(utils, 'updateDependencies');
        tag._dependencies = {};

        expectSubscriptions(() => tag.depend('alias', options),
          {
            update: {
              test: (cb) => {
                updateDependencies.reset();
                cb();
                expect(updateDependencies).to.be.calledWith(tag, options.defaults);
              }
            }
          }, tag);
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
  });
});
