import { LazyImage } from '../../../src/tags/lazy-image/gb-lazy-image';
import { WINDOW } from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-lazy-image', LazyImage, ({
  tag, stub, spy,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should call lazyLoad() if src provided', () => {
      const lazyLoad = stub(tag(), 'lazyLoad');
      const src = 'example.com/image.png';
      tag().opts = { src };

      tag().init();

      expect(lazyLoad).to.have.been.calledWith(src);
    });

    it('should not call lazyLoad()', () => {
      const lazyLoad = stub(tag(), 'lazyLoad');

      tag().init();

      expect(lazyLoad).to.not.have.been.called;
    });

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        mount: tag().maybeLoadImage,
        update: tag().maybeLoadImage
      }, tag());
    });
  });

  describe('maybeLoadImage()', () => {
    it('should load image', () => {
      const image = 'example.com/image.png';
      const lazyLoad = stub(tag(), 'lazyLoad');
      tag().$product = <any>{ imageLink: () => image };

      tag().maybeLoadImage();

      expect(lazyLoad.calledWith(image)).to.be.true;
    });

    it('should not load blank image', () => {
      const lazyLoad = stub(tag(), 'lazyLoad');
      tag().$product = <any>{ imageLink: () => null };

      tag().maybeLoadImage();

      expect(lazyLoad.called).to.be.false;
    });

    it('should not load existing image', () => {
      const image = 'example.com/image.png';
      const lazyLoad = stub(tag(), 'lazyLoad');
      tag().$product = <any>{ imageLink: () => image };
      tag().refs.lazyImage = <any>{ src: image };

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
      const processImage = tag().processImage = spy(() => Promise.resolve());
      stub(WINDOW, 'Image', () => image);

      tag().lazyLoad('example.com/someimage.jpg')
        .then((loadedImage: any) => {
          expect(processImage.calledWith(image)).to.be.true;
          done();
        });
    });
  });
});
