import { FluxCapacitor, Events } from 'groupby-api';
import { fluxTag } from '../../utils/tags';
import { Reset } from '../../../src/tags/reset/gb-reset';
import { expect } from 'chai';

describe('gb-reset logic', () => {
  let tag: Reset,
    flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Reset(), {
    root: { addEventListener: () => null }
  })));

  it('should listen for mount event', () => {
    tag.on = (event, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(tag.setSearchBox);
    };
    tag.init();
  });

  it('should register click listener', () => {
    tag.root = <HTMLElement>{
      addEventListener: (event, cb): any => {
        expect(event).to.eq('click');
        expect(cb).to.eq(tag.clearQuery);
      }
    };
    tag.init();
  });

  it('should clear query', () => {
    flux.reset = (value): any => expect(value).to.eq('');

    tag.searchBox = <HTMLInputElement & any>{ value: 'something' };
    tag.init();

    tag.clearQuery();
    expect(tag.searchBox.value).to.eq('');
  });
});
