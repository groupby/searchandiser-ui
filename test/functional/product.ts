import { FluxCapacitor, Events } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Product } from '../../src/tags/results/gb-product';
import '../../src/tags/results/gb-product.tag';

const TAG = 'gb-product';

describe(`${TAG} tag`, () => {
  const structure = { title: 'title', price: 'price', image: 'image' },
    all_meta = { title: 'Red Sneakers', price: '$12.45', image: 'image.png', id: '13323' };
  let html: HTMLElement;

  beforeEach(() => {
    mixinFlux({ config: { structure }, _scope: { opts: {} } });
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`div.${TAG}`)).to.be.ok;
  });

  it('renders product info', () => {
    const tag = mount();

    expect(html.querySelector('.gb-product')).to.be.ok;
    expect(html.querySelector('.gb-product__title').textContent).to.eq(all_meta.title);
    expect(html.querySelector('.gb-product__price').textContent).to.eq(all_meta.price);
    expect(html.querySelector('img').src).to.include(all_meta.image);
    expect(html.querySelector('a').href).to.include(`details.html?id=${all_meta.id}`);
  });

  function mount() {
    return <Product>riot.mount(TAG, { all_meta })[0];
  }
});
