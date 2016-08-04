import { FluxCapacitor, Events } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { Product } from '../../src/tags/results/gb-product';
import '../../src/tags/results/gb-product.tag';

const TAG = 'gb-product';

describe(`${TAG} tag`, () => {
  const struct = { title: 'title', price: 'price', image: 'image' };
  const all_meta = { title: 'Red Sneakers', price: '$12.45', image: 'image.png', id: '13323' };
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
    return <Product>riot.mount(TAG, { flux, struct, all_meta })[0];
  }
});