import { DEFAULTS, Product, TYPES } from '../../../src/tags/product/gb-product';
import * as transformer from '../../../src/utils/product-transformer';
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

    it('should inherits on $productable', () => {
      const inherits = tag().inherits = spy();

      tag().init();

      expect(inherits).to.be.calledWith('productable', {
        defaults: DEFAULTS,
        types: TYPES
      }, tag().transformProductable);
    });

    it('should set structure and initialize ProductTransformer', () => {
      const transformerInstance = { e: 'f' };
      const productTransformer = stub(transformer, 'ProductTransformer', () => transformerInstance);
      tag().config = <any>{ structure: { a: 'b', c: 'd' } };
      tag().$productable = <any>{ structure: { a: 'e' } };

      tag().init();

      expect(tag().structure).to.eql({ a: 'e', c: 'd' });
      expect(tag().transformer).to.eq(transformerInstance);
      expect(productTransformer).to.be.calledWith(tag().structure);
    });
  });

  describe('setDefaults()', () => {
    it('should set default values', () => {
      tag().setDefaults();

      expect(tag().variantIndex).to.eq(0);
      expect(tag().detailsUrl).to.eq('details.html');
    });

    it('should set detailsUrl from url service', () => {
      const detailsUrl = 'myurl.html';
      tag().services = <any>{ url: { urlConfig: { detailsUrl } } };

      tag().setDefaults();

      expect(tag().detailsUrl).to.eq(detailsUrl);
    });
  });

  describe('styleProduct()', () => {
    it('should add class gb-infinite', () => {
      const add = spy();
      tag().root = <any>{ classList: { add } };
      tag().$productable = <any>{ infinite: true };

      tag().styleProduct();

      expect(add.calledWith('gb-infinite')).to.be.true;
    });

    it('should add class tombstone', () => {
      const add = spy();
      tag().root = <any>{ classList: { add } };
      tag().$productable = <any>{ tombstone: true };

      tag().styleProduct();

      expect(add.calledWith('tombstone')).to.be.true;
    });
  });

  describe('updateRecord()', () => {
    it('should update variants and metadata', () => {
      const variants = ['a', 'b', 'c'];
      tag().transformer = <any>new MockTransformer(variants);

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
      expect(transform).to.be.calledWith(ALL_META);
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

      expect(update).to.be.calledWith({ variantIndex: index });
    });
  });
});

class MockTransformer {
  constructor(private variants?: any[]) { }

  transform() {
    return this.variants;
  }
}
