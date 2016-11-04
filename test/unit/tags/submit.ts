import { DEFAULT_CONFIG, Submit } from '../../../src/tags/submit/gb-submit';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-submit', Submit, ({
  flux, tag, spy, stub,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
    const ROOT: any = { addEventListener: () => null };

    beforeEach(() => tag().root = ROOT);

    itShouldConfigure(DEFAULT_CONFIG);

    it('should set label for input tag', () => {
      tag().root = Object.assign({}, ROOT, { tagName: 'INPUT' });

      tag().init();

      expect(tag().root.value).to.eq('Search');
    });

    it('should not set label for input tag', () => {
      tag().init();

      expect(tag().root.value).to.be.undefined;
    });

    it('should listen for mount event', () => {
      expectSubscriptions(() => tag().init(), {
        mount: tag().setSearchBox
      }, tag());
    });

    it('should register click listener', () => {
      const addEventListener = spy();
      tag().root = <any>{ addEventListener };

      tag().init();

      expect(addEventListener.calledWith('click', tag().submitQuery)).to.be.true;
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
    it('should submit query', (done) => {
      const query = 'something';
      flux().reset = (value): any => {
        expect(value).to.eq(query);
        done();
      };
      tag().searchBox = <HTMLInputElement>{ value: query };

      tag().submitQuery();
    });

    it('should emit tracker event', (done) => {
      const query = 'something';
      const reset = stub(flux(), 'reset').returns(Promise.resolve());
      tag().searchBox = <HTMLInputElement>{ value: query };
      tag().services = <any>{
        tracker: {
          search: () => {
            expect(tag().searchBox.value).to.eq(query);
            expect(reset.called).to.be.true;
            done();
          }
        }
      };

      tag().submitQuery();
    });

    it('should submit static query', () => {
      const query = 'something';
      const update = spy();
      tag()._config.staticSearch = true;
      tag().searchBox = <HTMLInputElement>{ value: query };
      tag().services = <any>{ url: { update, isActive: () => true } };

      tag().submitQuery();

      expect(update.calledWith(query, [])).to.be.true;
    });
  });
});
