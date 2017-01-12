import { Product } from '../../../src/tags/product/gb-product';
import { ProductMeta, ProductTransformer } from '../../../src/utils/product-transformer';
import suite from './_suite';
import { expect } from 'chai';

const ALL_META = {
  title: 'Red Sneakers',
  price: '$12.45',
  image: 'image.png',
  id: '1340',
  nested: {
    value: '6532'
  }
};

suite('gb-product', Product, ({
  tag, spy, stub,
  itShouldAlias
}) => {

  describe('init()', () => {
    beforeEach(() => tag().updateRecord = () => null);

    itShouldAlias('product');

    it('should set default values', () => {
      tag().init();

      expect(tag().lazy).to.be.true;
      expect(tag().infinite).to.be.false;
      expect(tag().tombstone).to.be.false;
      expect(tag().variantIndex).to.eq(0);
      expect(tag().detailsUrl).to.eq('details.html');
      expect(tag().transformer).to.be.an.instanceof(ProductTransformer);
    });

    it('should set properties from productable()', () => {
      tag().productable = () => ({ lazy: false, infinite: true, tombstone: true });
      tag().styleProduct = () => null;

      tag().init();

      expect(tag().lazy).to.be.false;
      expect(tag().infinite).to.be.true;
      expect(tag().tombstone).to.be.true;
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

    it('should call updateRecord()', () => {
      const allMeta = { a: 'b' };
      const updateRecord = stub(tag(), 'updateRecord');
      tag().productable = () => ({ allMeta, structure: {} });

      tag().init();

      expect(updateRecord).to.have.been.calledWith(allMeta);
    });

    it('should set structure from opts and productable()', () => {
      tag().config = { structure: { a: 'b', c: 'd' } };
      tag().productable = () => ({ structure: { a: 'e' } });

      tag().init();

      expect(tag().structure).to.eql({ a: 'e', c: 'd' });
    });
  });

  describe('styleProduct()', () => {
    it('should add class gb-infinite', () => {
      const add = spy();
      tag().root = <any>{ classList: { add } };
      tag().infinite = true;

      tag().styleProduct();

      expect(add.calledWith('gb-infinite')).to.be.true;
    });

    it('should add class tombstone', () => {
      const add = spy();
      tag().root = <any>{ classList: { add } };
      tag().tombstone = true;

      tag().styleProduct();

      expect(add.calledWith('tombstone')).to.be.true;
    });
  });

  describe('updateRecord()', () => {
    it('should update variants and metadata', () => {
      const remappedMeta = { e: 'f', g: 'h' };
      const variants = ['a', 'b', 'c'];
      tag().transformer = <any>new MockTransformer(ALL_META, remappedMeta, variants);

      tag().updateRecord(ALL_META);

      expect(tag().variants).to.eq(variants);
      expect(tag().metadata).to.eq(variants[0]);
    });
  });

  describe('transformRecord()', () => {
    it('should perform transformation', () => {
      const obj = { a: 'b' };
      const transform = spy(() => obj);
      tag().transformer = <any>{ transform };

      const transformation = tag().transformRecord(ALL_META);

      expect(transformation).to.eq(obj);
      expect(transform).to.have.been.calledWith(ALL_META);
    });
  });

  describe('link()', () => {
    it('should return url from data', () => {
      const url = 'some/url/for/product';
      tag().variant = () => ({ url });

      expect(tag().link()).to.eq(url);
    });

    it('should return url built from id', () => {
      const id = 1423;
      const detailsUrl = 'productDetails.html';
      tag().variant = () => ({ id });
      tag().detailsUrl = detailsUrl;

      expect(tag().link()).to.eq(`${detailsUrl}?id=${id}`);
    });
  });

  describe('imageLink()', () => {
    const IMAGES = ['image1.png', 'image2.png'];

    it('should return image value', () => {
      tag().variant = () => ({ image: IMAGES[1] });

      expect(tag().imageLink()).to.eq(IMAGES[1]);
    });

    it('should return image value from array', () => {
      tag().variant = () => ({ image: IMAGES });

      expect(tag().imageLink()).to.eq(IMAGES[0]);
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
