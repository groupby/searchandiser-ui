import { FluxCapacitor, Events } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Results } from '../../src/tags/results/gb-results';
import '../../src/tags/results/gb-results.tag';

const TAG = 'gb-results';

describe(`${TAG} tag`, () => {
  const structure = { title: 'title' };
  let html: HTMLElement;

  beforeEach(() => {
    mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('gb-raw-results')).to.be.ok;
  });

  it('renders from records', () => {
    const tag = mount(),
      rawTag = tag.tags['gb-raw-results'];

    rawTag.updateRecords([{}, {}, {}]);
    expect(products().length).to.eq(3);
  });

  it('renders product info', () => {
    const title = 'Red Sneakers',
      tag = mount(),
      rawTag = tag.tags['gb-raw-results'];

    rawTag.updateRecords([{ allMeta: { title } }])

    expect(products()[0].querySelector('.gb-product__title').textContent).to.eq(title);
  });

  function products() {
    return html.querySelectorAll('gb-product');
  }

  function mount() {
    return <Results>riot.mount(TAG)[0];
  }
});
