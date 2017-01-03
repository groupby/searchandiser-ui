import { DEFAULT_CONFIG, Product } from '../../../src/tags/product/gb-product';
import { ProductMeta, ProductTransformer } from '../../../src/utils/product-transformer';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-product', Product, ({
  tag, spy, stub,
  itShouldConfigure
}) => {

  describe('init()', () => {
    itShouldConfigure(DEFAULT_CONFIG);

    beforeEach(() => {
      tag().$scope = {};
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

    it('should call styleProduct()', (done) => {
      tag().styleProduct = () => done();

      tag().init();
    });

    it('should call transformRecord()', () => {
      const all_meta = { a: 'b' };
      const transformRecord = stub(tag(), 'transformRecord');
      tag().opts = { all_meta };

      tag().init();

      expect(transformRecord).to.have.been.calledWith(all_meta);
    });

    describe('struct', () => {
      it('should inherit from opts', () => {
        const structure = { a: 'b' };
        tag().opts = { structure };

        tag().init();

        expect(tag().struct).to.eq(structure);
      });

      it('should inherit from $scope', () => {
        const struct = { a: 'b' };
        tag().$scope = { struct };

        tag().init();

        expect(tag().struct).to.eq(struct);
      });

      it('should default to config', () => {
        const structure = { b: 'e', d: 'f' };

        tag().$scope = {};
        tag().config = <any>{ structure };

        tag().init();

        expect(tag().struct).to.eq(structure);
      });

      it('should fallback to empty object', () => {
        tag().$scope = {};
        tag().config = <any>{};

        tag().init();

        expect(tag().struct).to.eql({});
      });
    });
  });

  describe('styleProduct()', () => {
    it('should add class gb-infinite', () => {
      const add = spy();
      tag().root = <any>{ classList: { add } };
      tag().$config = { infinite: true };

      tag().styleProduct();

      expect(add.calledWith('gb-infinite')).to.be.true;
    });

    it('should add class tombstone', () => {
      const add = spy();
      tag().root = <any>{ classList: { add } };
      tag().$config = { tombstone: true };

      tag().styleProduct();

      expect(add.calledWith('tombstone')).to.be.true;
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

    it('should perform transformation on empty object', () => {
      tag().update = () => null;
      tag().transformer = <any>new MockTransformer(ALL_META, {}, []);
      const transform = tag().transformer.transform = sinon.spy(() => () => null);

      tag().transformRecord();

      expect(transform.calledWith({})).to.be.true;
    });

    it('should perform transformation', () => {
      const remappedMeta = { e: 'f', g: 'h' };
      const variants = ['a', 'b', 'c'];
      const update = tag().update = spy();
      tag().transformer = <any>new MockTransformer(ALL_META, remappedMeta, variants);

      tag().transformRecord(ALL_META);

      expect(update).to.have.been.calledWith({
        allMeta: ALL_META,
        variants,
        productMeta: sinon.match((meta) => meta() === remappedMeta)
      });
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
      const update = tag().update = spy();

      tag().switchVariant(<any>{ target: { dataset: { index } } });

      expect(update).to.have.been.calledWith({ variantIndex: index });
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
