import { Product } from '../../../src/tags/product/gb-product';
import { ProductMeta, ProductTransformer } from '../../../src/utils/product-transformer';
import suite from './_suite';
import { expect } from 'chai';

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

suite('gb-product', Product, { _scope: {} }, ({ tag }) => {

  describe('init()', () => {
    beforeEach(() => tag().transformRecord = () => null);

    it('should set default values', () => {
      tag().init();

      expect(tag().variantIndex).to.eq(0);
      expect(tag().detailsUrl).to.eq('details.html');
      expect(tag().transformer).to.be.an.instanceof(ProductTransformer);
    });

    it('should set detailsUrl from url service config', () => {
      const detailsUrl = 'mydetails.php';
      tag().services = <any>{ url: { urlConfig: { detailsUrl } } };

      tag().init();

      expect(tag().detailsUrl).to.eq(detailsUrl);
    });

    it('should call transformRecord()', () => {
      tag().transformRecord = (allMeta) => expect(allMeta).to.eq(all_meta);
      tag().opts = { all_meta };

      tag().init();
    });

    it('should inherit values from _scope', () => {
      tag()._scope = { struct };

      tag().init();

      expect(tag().struct).to.eq(struct);
    });

    it('should default to config', () => {
      const structure = { b: 'e', d: 'f' };

      tag()._scope = {};
      tag().config = <any>{ structure };

      tag().init();

      expect(tag().struct).to.eq(structure);
    });

    it('should fallback to empty object', () => {
      tag()._scope = {};
      tag().config = <any>{};

      tag().init();

      expect(tag().struct).to.eql({});
    });
  });

  describe('transformRecord()', () => {
    it('should perform transformation', () => {
      const remappedMeta = { e: 'f', g: 'h' };
      const variants = ['a', 'b', 'c'];

      tag().transformer = <any>new MockTransformer(all_meta, remappedMeta, variants);
      tag().update = (obj) => {
        expect(obj.allMeta).to.eq(all_meta);
        expect(obj.productMeta()).to.eq(remappedMeta);
        expect(obj.variants).to.eq(variants);
      };

      tag().transformRecord(all_meta);
    });
  });

  describe('link()', () => {
    it('should return url from data', () => {
      const url = 'some/url/for/product';

      tag().productMeta = () => ({ url });

      expect(tag().link()).to.eq(url);
    });

    it('should return url built from id', () => {
      const id = 1423;
      const detailsUrl = 'productDetails.html';

      tag().productMeta = () => ({ id });
      tag().detailsUrl = detailsUrl;

      expect(tag().link()).to.eq(`${detailsUrl}?id=${id}`);
    });
  });

  describe('image()', () => {
    it('should return image value', () => {
      const images = ['image1.png', 'image2.png'];

      expect(tag().image(images[1])).to.eq(images[1]);
      expect(tag().image(images)).to.eq(images[0]);
    });
  });

  describe('switchVariant()', () => {
    it('should update variantIndex', () => {
      const index = 12;
      tag().update = (obj) => expect(obj.variantIndex).to.eq(index);

      tag().switchVariant(<any>{ target: { dataset: { index } } });
    });
  });
});

class MockTransformer {
  constructor(private transformedMeta: any, private remappedMeta?: any, private variants?: any[]) { }

  transform() {
    const productMeta: ProductMeta = () => this.remappedMeta;
    productMeta.variants = this.variants;
    productMeta.transformedMeta = this.transformedMeta;
    return productMeta;
  }
}
