import { Product } from '../../src/tags/results/gb-product';
import { fluxTag } from '../utils/tags';
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
  let tag: Product;

  beforeEach(() => ({ tag } = fluxTag(new Product(), {
    parent: { struct, allMeta }
  })));

  it('should inherit values from parent', () => {
    tag.init();

    expect(tag.struct).to.eq(struct);
    expect(tag.allMeta).to.eq(allMeta);
    expect(tag.transform).to.be.a('function');
    expect(tag.getPath).to.be.a('function');
  });

  it('should allow default from config and opts', () => {
    const transform = () => null;
    const struct = { b: 'e', d: 'f', _transform: transform };
    const all_meta = { b: 'e', d: 'f' };

    tag.parent = null;
    tag.config = <any>{ structure: struct };
    tag.opts = <any>{ all_meta };
    tag.init();

    expect(tag.struct).to.eq(struct);
    expect(tag.transform).to.eq(transform);
    expect(tag.allMeta).to.eq(all_meta);
  });

  it('should listen for update', () => {
    tag.on = (event: string, cb: Function) => {
      expect(event).to.eq('update');
      expect(cb).to.eq(tag.transformRecord);
    };
    tag.init();
  });

  it('should perform transformation', () => {
    tag.allMeta = { a: 'b', c: 'd' };
    tag.transform = (obj) => Object.assign(obj, { e: 'f' });

    tag.transformRecord();
    expect(tag.allMeta.e).to.eq('f');
  });

  it('should return product url', () => {
    tag.init();
    expect(tag.link()).to.eq(`details.html?id=${allMeta.id}`)
  });

  it('should return url from data', () => {
    const url = 'some/url/for/product';

    tag.parent.allMeta.url = url;
    tag.init();

    expect(tag.link()).to.eq(url);
  });

  it('should access fields from allMeta', () => {
    tag.init();

    expect(tag.get('title')).to.eq(allMeta.title);
    expect(tag.get('nested.value')).to.eq(allMeta.nested.value);
  });

  it('should return image value', () => {
    const images = ['image1.png', 'image2.png'];

    tag.init();

    expect(tag.image(images[1])).to.eq(images[1]);
    expect(tag.image(images)).to.eq(images[0]);
  });
});
