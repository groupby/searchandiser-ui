import { FluxCapacitor, Events } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Product } from '../../src/tags/results/gb-product';
import '../../src/tags/results/gb-product.tag';

const TAG = 'gb-product';

describe(`${TAG} tag`, () => {
  describe('variant-free', () => {
    const structure = { title: 'title', price: 'price', image: 'image', id: 'id' },
      all_meta = { title: 'Red Sneakers', price: '$12.45', image: 'image.png', id: '13323' };
    let html: HTMLElement;

    beforeEach(() => {
      mixinFlux({ config: { structure } });
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

  describe('variants', () => {
    const structure = { title: 'title', variants: 'variants' };
    const variantStructure = { image: 'image', price: 'price', id: 'id' };
    const all_meta = {
      title: 'Sneaky Sneakers',
      variants: [
        {
          image: 'redsneaks.png',
          price: '$2000',
          id: '1.1'
        },
        {
          image: 'greensneaks.png',
          price: '$1',
          id: '1.2'
        }
      ]
    };
    let html: HTMLElement;

    beforeEach(() => {
      mixinFlux({ config: { structure, variantStructure } });
      html = createTag(TAG);
    });
    afterEach(() => removeTag(html));

    it('switches variants', () => {
      const tag = mount();
      expect(tag).to.be.ok;

      expect(html.querySelector('.gb-product__title').textContent).to.eq('Sneaky Sneakers');
      expect(html.querySelector('.gb-product__price').textContent).to.eq('$2000');
      expect(html.querySelector('img').src).to.include('redsneaks.png');
      expect(html.querySelector('a').href).to.include('details.html?id=1.1');

      expect(html.querySelectorAll('.gb-product__variant-link').length).to.eq(2);
      expect((<DOMStringMap & any>(<HTMLElement>html.querySelectorAll('.gb-product__variant-link')[0]).dataset).index).to.eq('0');
      expect((<DOMStringMap & any>(<HTMLElement>html.querySelectorAll('.gb-product__variant-link')[1]).dataset).index).to.eq('1');

      (<HTMLElement>html.querySelectorAll('.gb-product__variant-link')[0]).click();

      expect(html.querySelector('.gb-product__title').textContent).to.eq('Sneaky Sneakers');
      expect(html.querySelector('.gb-product__price').textContent).to.eq('$2000');
      expect(html.querySelector('img').src).to.include('redsneaks.png');
      expect(html.querySelector('a').href).to.include('details.html?id=1.1');

      (<HTMLElement>html.querySelectorAll('.gb-product__variant-link')[1]).click();

      expect(html.querySelector('.gb-product__title').textContent).to.eq('Sneaky Sneakers');
      expect(html.querySelector('.gb-product__price').textContent).to.eq('$1');
      expect(html.querySelector('img').src).to.include('greensneaks.png');
      expect(html.querySelector('a').href).to.include('details.html?id=1.2');

      (<HTMLElement>html.querySelectorAll('.gb-product__variant-link')[0]).click();

      expect(html.querySelector('.gb-product__title').textContent).to.eq('Sneaky Sneakers');
      expect(html.querySelector('.gb-product__price').textContent).to.eq('$2000');
      expect(html.querySelector('img').src).to.include('redsneaks.png');
      expect(html.querySelector('a').href).to.include('details.html?id=1.1');
    });

    function mount() {
      return <Product>riot.mount(TAG, {
        all_meta
      })[0];
    }
  });
});
