import { DEFAULT_CONFIG, Submit } from '../../../src/tags/submit/gb-submit';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Query } from 'groupby-api';

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

      expect(addEventListener).to.have.been.calledWith('click', tag().submitQuery);
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
      const search = spy();
      const reset = stub(flux(), 'reset').returns(Promise.resolve());
      tag().searchBox = <HTMLInputElement>{ value: query };
      tag().services = <any>{ tracker: { search } };

      tag().submitQuery()
        .then(() => {
          expect(tag().searchBox.value).to.eq(query);
          expect(reset).to.have.been.called;
          expect(search).to.have.been.called;
          done();
        });
    });

    it('should check for tracker service', (done) => {
      stub(flux(), 'reset').returns(Promise.resolve());
      tag().searchBox = <HTMLInputElement>{ value: 'something' };
      tag().services = <any>{};

      tag().submitQuery()
        .then(() => done());
    });

    it('should submit static query', (done) => {
      const query = 'something';
      const update = spy();
      flux().query = new Query('other')
        .withSelectedRefinements({ navigationName: 'colour', type: 'Value', value: 'blue' })
        .skip(20);
      tag()._config.staticSearch = true;
      tag().searchBox = <HTMLInputElement>{ value: query };
      tag().services = <any>{ url: { update, isActive: () => true } };

      tag().submitQuery()
        .then(() => {
          expect(update).to.have.been.calledWith(sinon.match.instanceOf(Query));
          expect(update).to.have.been.calledWithMatch({
            raw: {
              query,
              refinements: [],
              skip: 20
            }
          });
          done();
        });
    });
  });
});
