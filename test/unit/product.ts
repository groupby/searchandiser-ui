import { Product } from '../../src/tags/results/gb-product';
import { expect } from 'chai';

describe('gb-product logic', () => {
  const struct = { title: 'title', price: 'price', image: 'image', url: 'url' },
    allMeta = {
      title: 'Red Sneakers',
      price: '$12.45',
      image: 'image.png',
      id: '1340',
      nested: {
        value: '6532'
      }
    };
  let product: Product;

  beforeEach(() => product = Object.assign(new Product(), {
    opts: {},
    parent: { struct, allMeta },
    on: () => null
  }));

  it('should inherit values from parent', () => {
    product.init();

    expect(product.struct).to.eq(struct);
    expect(product.allMeta).to.eq(allMeta);
    expect(product.transform).to.be.a('function');
    expect(product.getPath).to.be.a('function');
  });

  it('should allow default from config and opts', () => {
    const transform = () => null;
    const struct = { b: 'e', d: 'f', _transform: transform };
    const all_meta = { b: 'e', d: 'f' };

    product.parent = null;
    product.config = <any>{ structure: struct };
    product.opts = <any>{ all_meta };
    product.init();

    expect(product.struct).to.eq(struct);
    expect(product.transform).to.eq(transform);
    expect(product.allMeta).to.eq(all_meta);
  });

  it('should listen for update', () => {
    product.on = (event: string, cb: Function) => {
      expect(event).to.eq('update');
      expect(cb).to.eq(product.transformRecord);
    };
    product.init();
  });

  it('should perform transformation', () => {
    product.allMeta = { a: 'b', c: 'd' };
    product.transform = (obj) => Object.assign(obj, { e: 'f' });

    product.transformRecord();
    expect(product.allMeta.e).to.eq('f');
  });

  it('should return product url', () => {
    product.init();
    expect(product.link()).to.eq(`details.html?id=${allMeta.id}`)
  });

  it('should return url from data', () => {
    const url = 'some/url/for/product';

    product.parent.allMeta.url = url;
    product.init();

    expect(product.link()).to.eq(url);
  });

  it('should access fields from allMeta', () => {
    product.init();

    expect(product.get('title')).to.eq(allMeta.title);
    expect(product.get('nested.value')).to.eq(allMeta.nested.value);
  });

  it('should return image value', () => {
    const images = ['image1.png', 'image2.png'];

    product.init();

    expect(product.image(images[1])).to.eq(images[1]);
    expect(product.image(images)).to.eq(images[0]);
  });
});
