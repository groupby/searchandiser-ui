import { Reset } from '../../../src/tags/reset/gb-reset';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-reset', Reset, { root: { addEventListener: () => null } }, ({ flux, tag }) => {
  it('should listen for mount event', () => {
    tag().on = (event, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(tag().setSearchBox);
    };
    tag().init();
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

  it('should clear query', () => {
    flux().reset = (value): any => expect(value).to.eq('');

    tag().searchBox = <any>{ value: 'something' };
    tag().init();

    tag().clearQuery();
    expect(tag().searchBox.value).to.eq('');
  });
});
