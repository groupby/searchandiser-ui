import { FluxTag } from '../../../src/tags/tag';
import * as utils from '../../../src/utils/tag';
import { expectSubscriptions } from '../../utils/expectations';
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
        tag.config = <any>{};
        tag.on = () => null;
      });

      it('should not set _style empty', () => {
        tag.init();

        expect(tag._style).to.eq('');
      });

      it('should set _style', () => {
        tag.config = <any>{ stylish: true };

        tag.init();

        expect(tag._style).to.eq('gb-stylish');
      });

      it('should call setTagName()', () => {
        const setTagName = sandbox.stub(utils, 'setTagName');

        tag.init();

        expect(setTagName).to.have.been.calledWith(tag);
      });

      it('should call inheritAliases()', () => {
        const inheritAliases = sandbox.stub(utils, 'inheritAliases');

        tag.init();

        expect(inheritAliases).to.have.been.calledWith(tag);
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

    describe('inherits()', () => {
      it('should call transform()', () => {
        const alias = 'alias';
        const options = { a: 'b' };
        const transform = tag.transform = sinon.spy();

        tag.inherits(alias, options, transform);

        expect(transform).to.be.calledWith(alias, alias, options, transform);
      });
    });

    describe('transform()', () => {
      it('should listen for update and before-mount', () => {
        const alias = 'alias';
        const realias = 'realias';
        const options = { a: 'b' };
        const updateDependency = sandbox.stub(utils, 'updateDependency');
        const test = (cb) => {
          updateDependency.reset();
          cb();
          expect(updateDependency).to.be.calledWith(tag, {
            alias, realias,
            transform: sinon.match.func
          }, options);
        };

        expectSubscriptions(() => tag.transform(alias, realias, options),
          {
            'before-mount': { test },
            update: { test }
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
