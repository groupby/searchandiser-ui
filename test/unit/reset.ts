import { FluxCapacitor, Events } from 'groupby-api';
import { Reset } from '../../src/tags/reset/gb-reset';
import { expect } from 'chai';

describe('gb-reset logic', () => {
  let reset: Reset,
    flux: FluxCapacitor;

  beforeEach(() => reset = Object.assign(new Reset(), {
    flux: flux = new FluxCapacitor(''),
    opts: {},
    root: { addEventListener: () => null },
    on: () => null
  }));

  it('should listen for mount event', () => {
    reset.on = (event, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(reset.findSearchBox);
    };
    reset.init();
  });

  it('should register click listener', () => {
    reset.root = <HTMLElement>{
      addEventListener: (event, cb): any => {
        expect(event).to.eq('click');
        expect(cb).to.eq(reset.clearQuery);
      }
    };
    reset.init();
  });

  it('should find search box', () => {
    const queryTag = document.createElement('div');
    document.body.appendChild(queryTag);
    queryTag.setAttribute('riot-tag', 'gb-raw-query');

    reset.init();
    reset.findSearchBox();

    expect(reset.searchBox).to.eq(queryTag);

    document.body.removeChild(queryTag);
  });

  it('should clear query', () => {
    flux.reset = (value): any => expect(value).to.eq('');

    reset.searchBox = <HTMLInputElement & any>{ value: 'something' };
    reset.init();

    reset.clearQuery();
    expect(reset.searchBox.value).to.eq('');
  });
});
