import { FluxCapacitor, Events } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Results } from '../../src/tags/results/gb-results';
import '../../src/tags/results/gb-raw-results.tag';

const TAG = 'gb-raw-results';

describe(`${TAG} tag`, () => {
  let html: HTMLElement;

  beforeEach(() => {
    mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('ul.gb-results')).to.be.ok;
  });

  it('renders from records', () => {
    const tag = mount();

    tag.updateRecords([{}, {}, {}]);
    expect(html.querySelectorAll('.gb-results__item').length).to.eq(3);
  });

  function mount() {
    return <Results>riot.mount(TAG)[0];
  }
});
