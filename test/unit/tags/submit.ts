import { DEFAULT_CONFIG, Submit } from '../../../src/tags/submit/gb-submit';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

const ROOT: any = { addEventListener: () => null };

suite('gb-submit', Submit, { root: ROOT }, ({
  flux, tag, sandbox,
  expectSubscriptions,
  itShouldConfigure
}) => {

  describe('init()', () => {
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
      const addEventListener = sinon.spy((event, cb): any => {
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
    it('should submit query', () => {
      const query = 'something';
      flux().reset = (value): any => expect(value).to.eq(query);
      tag().searchBox = <HTMLInputElement>{ value: query };

      tag().submitQuery();

      expect(tag().searchBox.value).to.eq(query);
    });

    it('should submit static query', () => {
      const newQuery = 'something';
      tag()._config.staticSearch = true;
      tag().searchBox = <HTMLInputElement>{ value: newQuery };
      tag().services = <any>{
        url: {
          active: () => true,
          update: (query, refinements) => {
            expect(query).to.eq(newQuery);
            expect(refinements.length).to.eq(0);
          }
        }
      };

      tag().submitQuery();
    });
  });
});
