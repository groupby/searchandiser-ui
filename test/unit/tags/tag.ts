import { setParents, setScope, setTagName, FluxTag, MixinFlux } from '../../../src/tags/tag';
import { expect } from 'chai';

describe('base tag logic', () => {

  describe('FluxTag', () => {
    describe('init()', () => {
      let tag: FluxTag<any>;

      beforeEach(() => {
        tag = new FluxTag();
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
  });

  describe('setTagName()', () => {
    it('should not set tag names', () => {
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'SOMENAME',
          dataset: {},
          getAttribute: () => null
        }
      };

      setTagName(tag);

      expect(tag._tagName).to.not.be.ok;
      expect(tag._simpleTagName).to.not.be.ok;
      expect(tag._camelTagName).to.not.be.ok;
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
      expect(tag._simpleTagName).to.eq('some-name');
      expect(tag._camelTagName).to.eq('someName');
    });

    it('should set tag names from root.tagName', () => {
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'GB-TEST-TAG'
        }
      };

      setTagName(tag);

      expect(tag._tagName).to.eq('gb-test-tag');
      expect(tag._simpleTagName).to.eq('test-tag');
      expect(tag._camelTagName).to.eq('testTag');
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

      expect(tag._tagName).to.eq('gb-test-tag');
      expect(tag._simpleTagName).to.eq('test-tag');
      expect(tag._camelTagName).to.eq('testTag');
    });

    it('should set tag names from riot-tag', () => {
      const getAttribute = sinon.spy(() => 'gb-test-tag');
      const tag: FluxTag<any> = <any>{
        root: {
          tagName: 'SOMENAME',
          dataset: {},
          getAttribute
        }
      };

      setTagName(tag);

      expect(tag._tagName).to.eq('gb-test-tag');
      expect(tag._simpleTagName).to.eq('test-tag');
      expect(tag._camelTagName).to.eq('testTag');
      expect(getAttribute).to.have.been.calledWith('riot-tag');
    });
  });

  describe('setParents()', () => {
    it('should set empty _parents and _parentsList', () => {
      const tag: FluxTag<any> = <any>{};

      setParents(tag);

      expect(tag._parents).to.eql({});
      expect(tag._parentsList).to.eql([]);
    });

    it('should inherit _parents', () => {
      const _parents = { a: 'b' };
      const tag: FluxTag<any> = <any>{ parent: { _parents } };

      setParents(tag);

      expect(tag._parents).to.eql(_parents);
      expect(tag._parentsList).to.eql([{ _parents }]);
    });

    it('should register self in _parents', () => {
      const _tagName = 'gb-test-tag';
      const tag: FluxTag<any> = <any>{ _tagName };

      setParents(tag);

      expect(tag._parents).to.eql({ [_tagName]: tag });
      expect(tag._parentsList).to.eql([]);
    });

    it('should register self and inherit _parents', () => {
      const _tagName = 'gb-test-tag';
      const _parents = { a: 'b' };
      const tag: FluxTag<any> = <any>{ _tagName, parent: { _parents } };

      setParents(tag);

      expect(tag._parents).to.eql(Object.assign({ [_tagName]: tag }, _parents));
      expect(tag._parentsList).to.eql([{ _parents }]);
    });

    it('should add all parents to _parentsList', () => {
      const parent3 = { a: 'b' };
      const parent2 = { parent: parent3 };
      const parent1 = { _parents: { e: 'e' }, parent: parent2 };
      const tag: FluxTag<any> = <any>{ parent: parent1 };

      setParents(tag);

      expect(tag._parents).to.eql(parent1._parents);
      expect(tag._parentsList).to.eql([parent1, parent2, parent3]);
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
      expect(tag._top).to.eq(topParent);
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
