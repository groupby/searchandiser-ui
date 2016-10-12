import { Reset } from '../../../src/tags/reset/gb-reset';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-reset', Reset, ({
  flux, tag, sandbox,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should listen for mount event', () => {
      tag().root = <any>{ addEventListener: () => null };

      expectSubscriptions(() => tag().init(), {
        mount: tag().setSearchBox
      }, tag());
    });

    it('should register click listener', () => {
      const addEventListener = sinon.spy((event, cb) => {
        expect(event).to.eq('click');
        expect(cb).to.eq(tag().clearQuery);
      });
      tag().root = <any>{ addEventListener };

      tag().init();

      expect(addEventListener.called).to.be.true;
    });
  });

  describe('clearQuery()', () => {
    it('should clear query', () => {
      const stub = sandbox().stub(flux(), 'reset', (value) => expect(value).to.eq(''));
      tag().searchBox = <any>{ value: 'something' };

      tag().clearQuery();

      expect(tag().searchBox.value).to.eq('');
      expect(stub.called).to.be.true;
    });
  });
});
