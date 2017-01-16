import { FluxTag } from '../../../src/tags/tag';
import * as utils from '../../../src/utils/tag';
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

      it('should call configure()', () => {
        const configure = sandbox.stub(utils, 'configure');

        tag.init();

        expect(configure).to.have.been.calledWith(tag);
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
  });
});
