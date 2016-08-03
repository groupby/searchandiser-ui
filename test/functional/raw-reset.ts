import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { Reset } from '../../src/tags/reset/gb-reset';
import '../../src/tags/reset/gb-raw-reset.tag';

const TAG = 'gb-raw-reset';

describe(`${TAG} tag`, () => {
  let html: Element;
  let flux: FluxCapacitor;
  beforeEach(() => {
    flux = new FluxCapacitor('');
    document.body.appendChild(html = document.createElement(TAG));
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
  });

  it('should clear query', (done) => {
    const tag = mount();
    tag.searchBox = <HTMLInputElement & any>{ value: 'old' };

    flux.reset = () => done();

    tag.root.click();
  });

  function mount() {
    return <Reset>riot.mount(TAG, { flux })[0];
  }
});
