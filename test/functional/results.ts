import { Results } from '../../src/tags/results/gb-results';
import { createTag, mixinFlux, removeTag } from './_suite';
import { expect } from 'chai';

const TAG = 'gb-results';

describe(`${TAG} tag`, () => {
  const structure = { title: 'title' };
  let html: HTMLElement;

  beforeEach(() => {
    mixinFlux({ config: { structure } });
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('gb-list')).to.be.ok;
  });

  it('renders from records', () => {
    const tag = mount();

    tag.updateRecords(<any>[{}, {}, {}]);
    expect(products().length).to.eq(3);
    expect(html.querySelectorAll('gb-list li').length).to.eq(3);
  });

  it('renders product info', () => {
    const title = 'Red Sneakers';
    const tag = mount();

    tag.updateRecords(<any>[{ allMeta: { title } }]);

    expect(products()[0].querySelector('.gb-product__title').textContent).to.eq(title);
  });

  function products() {
    return html.querySelectorAll('gb-product');
  }

  function mount() {
    return <Results>riot.mount(TAG)[0];
  }
});
