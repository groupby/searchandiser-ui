import { Product } from '../../src/tags/results/gb-product';
import { fluxTag } from '../utils/tags';
import { expect } from 'chai';

describe('gb-product logic', () => {
  const struct = { title: 'title', price: 'price', image: 'image', url: 'url' };
  const all_meta = {
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
    _scope: { struct },
    opts: { all_meta }
  })));

  it('should inherit values from _scope', () => {
    tag.init();

    expect(tag.struct).to.eq(struct);
    expect(tag.allMeta).to.eq(all_meta);
    expect(tag.transform).to.be.a('function');
    expect(tag.getPath).to.be.a('function');
  });

  it('should allow default from config', () => {
    const transform = () => null;
    const struct = { b: 'e', d: 'f', _transform: transform };

    tag._scope = {};
    tag.config = <any>{ structure: struct };
    tag.init();

    expect(tag.struct).to.eq(struct);
    expect(tag.transform).to.eq(transform);
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
    expect(tag.link()).to.eq(`details.html?id=${all_meta.id}`)
  });

  it('should return url from data', () => {
    const url = 'some/url/for/product';

    tag.opts.all_meta.url = url;
    tag.init();

    expect(tag.link()).to.eq(url);
  });

  it('should access fields from allMeta', () => {
    tag.init();

    expect(tag.get('title')).to.eq(all_meta.title);
    expect(tag.get('nested.value')).to.eq(all_meta.nested.value);
  });

  it('should return image value', () => {
    const images = ['image1.png', 'image2.png'];

    tag.init();

    expect(tag.image(images[1])).to.eq(images[1]);
    expect(tag.image(images)).to.eq(images[0]);
  });
});
