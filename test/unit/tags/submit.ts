import { DEFAULT_CONFIG, Submit } from '../../../src/tags/submit/gb-submit';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-submit', Submit, ({
  flux, tag, sandbox,
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
      const addEventListener = sinon.spy((event, cb) => {
        expect(event).to.eq('click');
        expect(cb).to.eq(tag().submitQuery);
      });
      tag().root = <any>{ addEventListener };

      tag().init();

      expect(addEventListener.called).to.be.true;
    });
  });

  describe('setSearchBox()', () => {
    it('should set the searchBox', () => {
      const searchBox = { a: 'b' };
      sandbox().stub(utils, 'findSearchBox', () => searchBox);

      tag().setSearchBox();

      expect(tag().searchBox).to.eq(searchBox);
    });
  });

  describe('submitQuery()', () => {
    it('should submit query', (done) => {
      const query = 'something';
      const spy = flux().reset = sinon.spy((value): any =>
        Promise.resolve(expect(value).to.eq(query)));
      tag().searchBox = <HTMLInputElement>{ value: query };
      tag().services = <any>{
        tracker: {
          search: () => {
            expect(tag().searchBox.value).to.eq(query);
            expect(spy.called).to.be.true;
            done();
          }
        }
      };

      tag().submitQuery();
    });

    it('should submit static query', () => {
      const newQuery = 'something';
      const update = sinon.spy((query, refinements) => {
        expect(query).to.eq(newQuery);
        expect(refinements).to.eql([]);
      });
      tag()._config.staticSearch = true;
      tag().searchBox = <HTMLInputElement>{ value: newQuery };
      tag().services = <any>{ url: { update, active: () => true } };

      tag().submitQuery();

      expect(update.called).to.be.true;
    });
  });
});
