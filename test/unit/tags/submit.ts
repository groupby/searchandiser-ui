import { META, Submit } from '../../../src/tags/submit/gb-submit';
import * as utils from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';
import { Query } from 'groupby-api';

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
      const reset = stub(flux(), 'reset').resolves();
      tag().searchBox = <HTMLInputElement>{ value: query };
      tag().services = <any>{ tracker: { search } };

      tag().submitQuery()
        .then(() => {
          expect(tag().searchBox.value).to.eq(query);
          expect(reset).to.be.called;
          expect(search).to.be.called;
          done();
        });
    });

    it('should check for tracker service', (done) => {
      stub(flux(), 'reset').resolves();
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
      tag().staticSearch = true;
      tag().searchBox = <HTMLInputElement>{ value: query };
      tag().services = <any>{ url: { update, isActive: () => true } };

      tag().submitQuery()
        .then(() => {
          expect(update).to.be.calledWith(sinon.match.instanceOf(Query));
          expect(update).to.be.calledWithMatch({
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
