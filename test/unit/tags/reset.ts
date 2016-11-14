import { Reset } from '../../../src/tags/reset/gb-reset';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-reset', Reset, ({ flux, tag, spy, expectSubscriptions }) => {

  describe('init()', () => {
    it('should listen for mount event', () => {
      tag().root = <any>{ addEventListener: () => null };

      expectSubscriptions(() => tag().init(), {
        mount: tag().setSearchBox
      }, tag());
    });

    it('should register click listener', () => {
      const addEventListener = spy();
      tag().root = <any>{ addEventListener };

      tag().init();

      expect(addEventListener.calledWith('click', tag().clearQuery)).to.be.true;
    });
  });

  describe('clearQuery()', () => {
    it('should clear query', (done) => {
      flux().reset = (value): any => {
        expect(value).to.eq('');
        done();
      };
      tag().searchBox = <any>{ value: 'something' };

      tag().clearQuery();
    });

    it('should emit tracker event', (done) => {
      const search = spy();
      flux().reset = (): any => Promise.resolve();
      tag().searchBox = <any>{ value: 'something' };
      tag().services = <any>{ tracker: { search } };

      tag().clearQuery()
        .then(() => {
          expect(tag().searchBox.value).to.eq('');
          expect(search.called).to.be.true;
          done();
        });
    });

    it('should check for tracker service', (done) => {
      flux().reset = (): any => Promise.resolve();
      tag().searchBox = <any>{ value: 'something' };
      tag().services = <any>{};

      tag().clearQuery()
        .then(() => done());
    });
  });
});
