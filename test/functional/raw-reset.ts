import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Reset } from '../../src/tags/reset/gb-reset';
import '../../src/tags/reset/gb-raw-reset.tag';

const TAG = 'gb-raw-reset';

describe(`${TAG} tag`, () => {
  let html: HTMLElement,
    flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

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
    return <Reset>riot.mount(TAG)[0];
  }
});
