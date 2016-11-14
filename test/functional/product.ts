import { Product } from '../../src/tags/product/gb-product';
import suite from './_suite';
import { BaseModel } from './_suite';
import { expect } from 'chai';

const STRUCTURE = { title: 'title', price: 'price', image: 'image' };
const VARIANT_STRUCTURE = { image: 'image', price: 'price', id: 'id' };
const STRUCTURE_WITH_VARIANTS = {
  title: 'title',
  variants: 'variants',
  _variantStructure: VARIANT_STRUCTURE
};

suite<Product>('gb-product', {
  config: { structure: STRUCTURE },
  _scope: { on: () => null }
}, ({ mount, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render product image', () => {
      const tag = mount();

      expect(tag.root.querySelector('gb-product-image')).to.be.ok;
    });
  });

  describe('render with product', () => {
    const ALL_META = { title: 'Red Sneakers', price: '$12.45', image: 'image.png', id: '13323' };
    let tag: Product;
    let model: Model;

    beforeEach(() => {
      tag = mount({ all_meta: ALL_META });
      model = new Model(tag);
    });

    it('should render product info', () => {
      expect(tag.root.querySelector('gb-product-info')).to.be.ok;
      expect(model.title.textContent).to.eq(ALL_META.title);
      expect(model.price.textContent).to.eq(ALL_META.price);
      expect(model.image.getAttribute('src')).to.include(ALL_META.image);
      expect(model.link.href).to.include(`details.html?id=${ALL_META.id}`);
    });
  });
});

suite<Product>('gb-product with variants', {
  config: { structure: STRUCTURE_WITH_VARIANTS },
  _scope: { on: () => null }
}, ({
  mount, itMountsTag
}) => {

    itMountsTag();

    describe('render with product', () => {
      const ALL_META = {
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
      let tag: Product;
      let model: Model;

      beforeEach(() => {
        tag = mount({ all_meta: ALL_META });
        model = new Model(tag);
      });

      it('should switch variant on click', () => {
        expect(model.title.textContent).to.eq('Sneaky Sneakers');
        expect(model.price.textContent).to.eq('$2000');
        expect(model.image.getAttribute('src')).to.include('redsneaks.png');
        expect(model.link.href).to.include('details.html?id=1.1');

        expect(model.variantLinks).to.have.length(2);
        expect(model.variantLinks[0].dataset['index']).to.eq('0');
        expect(model.variantLinks[1].dataset['index']).to.eq('1');

        model.variantLinks[0].click();

        expect(model.title.textContent).to.eq('Sneaky Sneakers');
        expect(model.price.textContent).to.eq('$2000');
        expect(model.image.getAttribute('src')).to.include('redsneaks.png');
        expect(model.link.href).to.include('details.html?id=1.1');

        model.variantLinks[1].click();

        expect(model.title.textContent).to.eq('Sneaky Sneakers');
        expect(model.price.textContent).to.eq('$1');
        expect(model.image.getAttribute('src')).to.include('greensneaks.png');
        expect(model.link.href).to.include('details.html?id=1.2');

        model.variantLinks[0].click();

        expect(model.title.textContent).to.eq('Sneaky Sneakers');
        expect(model.price.textContent).to.eq('$2000');
        expect(model.image.getAttribute('src')).to.include('redsneaks.png');
        expect(model.link.href).to.include('details.html?id=1.1');
      });
    });
  });

class Model extends BaseModel<Product> {

  get title() {
    return this.element(this.html, '.gb-product__title');
  }

  get price() {
    return this.element(this.html, '.gb-product__price');
  }

  get image() {
    return this.element<HTMLImageElement>(this.html, 'gb-lazy-image');
  }

  get link() {
    return this.element<HTMLAnchorElement>(this.html, 'a');
  }

  get variantLinks() {
    return this.list(this.html, '.gb-product__variant-link');
  }
}
