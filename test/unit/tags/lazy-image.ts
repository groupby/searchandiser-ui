import { LazyImage } from '../../../src/tags/lazy-image/gb-lazy-image';
import { WINDOW } from '../../../src/utils/common';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-lazy-image', LazyImage, ({
  tag, stub, spy,
  itShouldConfigure
}) => {

  describe('init()', () => {
    beforeEach(() => tag()._scope = { on: () => null });

    itShouldConfigure();

    it('should call lazyLoad() if src provided', () => {
      const lazyLoad = stub(tag(), 'lazyLoad');
      const src = 'example.com/image.png';
      tag().opts = { src };

      tag().init();

      expect(lazyLoad.calledWith(src)).to.be.true;
    });

    it('should not call lazyLoad()', () => {
      const lazyLoad = stub(tag(), 'lazyLoad');

      tag().init();

      expect(lazyLoad.called).to.be.false;
    });

    it('should listen for update on _scope', () => {
      const on = spy();
      tag()._scope = { on };

      tag().init();

      expect(on.calledWith('update', tag().maybeLoadImage)).to.be.true;
    });
  });

  describe('maybeLoadImage()', () => {
    it('should load image', () => {
      const image = 'example.com/image.png';
      const lazyLoad = stub(tag(), 'lazyLoad');
      tag()._scope = { productMeta: () => ({ image }) };

      tag().maybeLoadImage();

      expect(lazyLoad.calledWith(image)).to.be.true;
    });

    it('should not load blank image', () => {
      const lazyLoad = stub(tag(), 'lazyLoad');
      tag()._scope = { productMeta: () => ({}) };

      tag().maybeLoadImage();

      expect(lazyLoad.called).to.be.false;
    });

    it('should not load existing image', () => {
      const image = 'example.com/image.png';
      const lazyLoad = stub(tag(), 'lazyLoad');
      tag()._scope = { productMeta: () => ({ image }) };
      tag().lazyImage = <any>{ src: image };

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
