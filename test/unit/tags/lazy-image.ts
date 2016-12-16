import { LazyImage } from '../../../src/tags/lazy-image/gb-lazy-image';
import { WINDOW } from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-lazy-image', LazyImage, ({
  tag, stub, spy,
  itShouldConfigure
}) => {

  describe('init()', () => {
    beforeEach(() => tag().$scope = { on: () => null });

    itShouldConfigure();

    it('should listen for update and mount on $scope', () => {
      const on = spy();
      tag().$scope = { on };

      tag().init();

      expect(on.calledWith('update', tag().maybeLoadImage)).to.be.true;
      expect(on.calledWith('mount', tag().maybeLoadImage)).to.be.true;
    });
  });

  describe('maybeLoadImage()', () => {
    it('should load image', () => {
      const image = 'example.com/image.png';
      const lazyLoad = stub(tag(), 'lazyLoad');
      tag().$scope = { productMeta: () => ({ image }) };

      tag().maybeLoadImage();

      expect(lazyLoad.calledWith(image)).to.be.true;
    });

    it('should default to config', () => {
      const image = 'example.com/image.png';
      const lazyLoad = stub(tag(), 'lazyLoad');
      tag().$scope = { productMeta: () => ({ image }) };
      tag().$config = { src: image };

      tag().maybeLoadImage();

      expect(lazyLoad.calledWith(image)).to.be.true;
    });

    it('should not load blank image', () => {
      const lazyLoad = stub(tag(), 'lazyLoad');
      tag().$scope = { productMeta: () => ({}) };

      tag().maybeLoadImage();

      expect(lazyLoad.called).to.be.false;
    });
  });

  describe('lazyLoad()', () => {
    it('should return a Promise', () => {
      const promise = tag().lazyLoad('');

      expect(promise).to.be.an.instanceof(Promise);
    });

    it('should create a new Image and listen for load', (done) => {
      const url = 'example.com/someimage.jpg';
      const addEventListener = spy((event, cb) => {
        if (event === 'load') {
          cb();
        }
      });
      const image = { addEventListener };
      stub(WINDOW, 'Image', () => image);
      tag().processImage = (img) => Promise.resolve(img);

      tag().lazyLoad(url)
        .then((loadedImage: any) => {
          expect(loadedImage).to.eq(image);
          expect(loadedImage.src).to.eq(url);
          done();
        });
    });

    it('should create a new Image and listen for error', (done) => {
      const url = 'example.com/someimage.jpg';
      const addEventListener = spy((event, cb) => {
        if (event === 'error') {
          cb();
        }
      });
      const image: any = { addEventListener };
      stub(WINDOW, 'Image', () => image);
      tag().processImage = (img) => Promise.resolve(img);

      tag().lazyLoad(url)
        .then((loadedImage) => {
          expect(loadedImage).to.eq('');
          expect(image.src).to.eq(url);
          done();
        });
    });

    it('should call processImage()', (done) => {
      const image = { addEventListener: (event, cb) => cb() };
      const processImage = tag().processImage = spy();
      stub(WINDOW, 'Image', () => image);

      tag().lazyLoad('example.com/someimage.jpg')
        .then((loadedImage: any) => {
          expect(processImage.calledWith(image)).to.be.true;
          done();
        });
    });

    it('should cancel image listeners on before-unmount', (done) => {
      const removeEventListener = spy();
      const on = tag().on = spy((event, cb) => {
        expect(event).to.eq('unmount');
        cb();
        expect(removeEventListener).to.have.been.calledTwice;
        expect(removeEventListener).to.have.been.calledWith('load');
        expect(removeEventListener).to.have.been.calledWith('error');
      });
      const image = { addEventListener: () => null, removeEventListener };
      tag().processImage = spy();
      stub(WINDOW, 'Image', () => image);

      tag().lazyLoad('example.com/someimage.jpg')
        .then((loadedImage: any) => {
          expect(on).to.have.been.called;
          done();
        });
    });
  });

  describe('processImage()', () => {
    it('should not process a falsy image', () => {
      expect(() => tag().processImage(null)).to.not.throw();
    });

    it('should not load into unrendered image', () => {
      expect(() => tag().processImage(<any>{})).to.not.throw();
    });

    it('should not load existing image', () => {
      const src = 'example.com/image.png';
      const height = 13;
      const width = 20;
      const lazyImage: any = { src };
      tag().refs = <any>{ lazyImage };

      tag().processImage(<any>{ src, height, width });

      expect(lazyImage.height).to.not.eq(height);
      expect(lazyImage.width).to.not.eq(width);
    });

    it('should load image', () => {
      const src = 'example.com/image.png';
      const height = 13;
      const width = 20;
      const lazyImage: any = {};
      tag().refs = <any>{ lazyImage };

      tag().processImage(<any>{ src, height, width });

      expect(lazyImage.src).to.eq(src);
      expect(lazyImage.height).to.eq(height);
      expect(lazyImage.width).to.eq(width);
    });
  });
});
