import { RESET_EVENT } from '../../../src/services/search';
import { META, Submit } from '../../../src/tags/submit/gb-submit';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-submit', Submit, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldHaveMeta
}) => {
  itShouldHaveMeta(Submit, META);

  describe('init()', () => {
    const ROOT: any = { addEventListener: () => null };

    beforeEach(() => tag().root = ROOT);

    it('should listen for mount event', () => {
      expectSubscriptions(() => tag().init(), {
        mount: tag().setSearchBox
      }, tag());
    });

    it('should register click listener', () => {
      const addEventListener = spy();
      tag().root = <any>{ addEventListener };

      tag().init();

      expect(addEventListener).to.be.calledWith('click', tag().submitQuery);
    });
  });

  describe('setDefaults()', () => {
    it('should set root value when root is input tag', () => {
      const root = tag().root = <any>{ tagName: 'INPUT' };
      const label = tag().label = 'label';

      tag().setDefaults();

      expect(root.value).to.eq(label);
    });

    it('should not set root value', () => {
      const root = tag().root = <any>{ tagName: 'not input' };

      tag().setDefaults();

      expect(root.value).to.not.be.ok;
    });
  });

  describe('setSearchBox()', () => {
    it('should set the searchBox', () => {
      const searchBox = { a: 'b' };
      stub(utils, 'findSearchBox').returns(searchBox);

      tag().setSearchBox();

      expect(tag().searchBox).to.eq(searchBox);
    });
  });

  describe('submitQuery()', () => {
    it('should emit search:reset event', () => {
      const query = 'something';
      const emit = flux().emit = spy();
      tag().searchBox = <any>{ value: query };

      tag().submitQuery();

      expect(emit).to.be.calledWith(RESET_EVENT, query);
    });
  });
});
