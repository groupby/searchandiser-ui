import { Product } from '../../../src/tags/product/gb-product';
import { ProductMeta, ProductTransformer } from '../../../src/utils/product-transformer';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-product', Product, ({ tag, sandbox }) => {

  describe('init()', () => {
    beforeEach(() => {
      tag()._scope = {};
      tag().transformRecord = () => null;
    });

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
      const all_meta = { a: 'b' };
      const stub = sandbox().stub(tag(), 'transformRecord', (allMeta) => expect(allMeta).to.eq(all_meta));
      tag().opts = { all_meta };

      tag().init();

      expect(stub.called).to.be.true;
    });

    describe('struct', () => {
      it('should inherit from _scope', () => {
        const struct = { a: 'b' };
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
  });

  describe('transformRecord()', () => {
    const ALL_META = {
      title: 'Red Sneakers',
      price: '$12.45',
      image: 'image.png',
      id: '1340',
      nested: {
        value: '6532'
      }
    };

    it('should perform transformation', () => {
      const remappedMeta = { e: 'f', g: 'h' };
      const variants = ['a', 'b', 'c'];
      const spy =
        tag().update =
        sinon.spy((obj) => {
          expect(obj.allMeta).to.eq(ALL_META);
          expect(obj.productMeta()).to.eq(remappedMeta);
          expect(obj.variants).to.eq(variants);
        });
      tag().transformer = <any>new MockTransformer(ALL_META, remappedMeta, variants);

      tag().transformRecord(ALL_META);

      expect(spy.called).to.be.true;
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
    const IMAGES = ['image1.png', 'image2.png'];

    it('should return image value', () => {
      expect(tag().image(IMAGES[1])).to.eq(IMAGES[1]);
    });

    it('should return image value from array', () => {
      expect(tag().image(IMAGES)).to.eq(IMAGES[0]);
    });
  });

  describe('switchVariant()', () => {
    it('should update variantIndex', () => {
      const index = 12;
      const spy =
        tag().update =
        sinon.spy((obj) => expect(obj.variantIndex).to.eq(index));

      tag().switchVariant(<any>{ target: { dataset: { index } } });

      expect(spy.called).to.be.true;
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
