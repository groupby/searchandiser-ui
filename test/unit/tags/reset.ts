import { Reset } from '../../../src/tags/reset/gb-reset';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-reset', Reset, ({ flux, tag, expectSubscriptions }) => {

  describe('init()', () => {
    it('should listen for mount event', () => {
      tag().root = <any>{ addEventListener: () => null };
      expectSubscriptions(() => tag().init(), {
        mount: tag().setSearchBox
      }, tag());
    });

    it('should register click listener', () => {
      tag().root = <any>{
        addEventListener: (event, cb): any => {
          expect(event).to.eq('click');
          expect(cb).to.eq(tag().clearQuery);
        }
      };

      tag().init();
    });
  });

  describe('clearQuery()', () => {
    it('should clear query', () => {
      flux().reset = (value): any => expect(value).to.eq('');

      tag().searchBox = <any>{ value: 'something' };

      tag().clearQuery();
      expect(tag().searchBox.value).to.eq('');
    });
  });
});
