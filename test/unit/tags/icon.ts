import { Icon } from '../../../src/tags/icon/gb-icon';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-icon', Icon, ({
  tag, spy,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should listen for update', () => {
      tag().opts = { img: '' };

      expectSubscriptions(() => tag().init(), { update: tag().setImage }, tag());
    });
  });

  describe('setDefaults()', () => {
    it('should call setImage()', () => {
      const setImage = tag().setImage = spy();

      tag().setDefaults();

      expect(setImage).to.be.called;
    });
  });

  describe('setImage', () => {
    it('should set url and remove classes', () => {
      const dataUri = 'myImage.png';
      const isImage = tag().isImage = spy(() => true);
      tag().opts = { img: dataUri };
      tag().classes = 'these classes';

      tag().setImage();

      expect(isImage).to.be.calledWith(dataUri);
      expect(tag().url).to.eq(dataUri);
      expect(tag()).to.not.have.property('classes');
    });

    it('should set classes and remove url', () => {
      const classes = 'these classes';
      tag().isImage = () => false;
      tag().opts = { img: classes };
      tag().url = 'myImage.png';

      tag().setImage();

      expect(tag().classes).to.eq(classes);
      expect(tag()).to.not.have.property('url');
    });
  });

  describe('isImage()', () => {
    it('should match image pattern', () => {
      expect(tag().isImage('this.that')).to.be.true;
    });

    it('should match data uri pattern', () => {
      expect(tag().isImage('data:image/base64_encoded')).to.be.true;
    });

    it('should not match other data', () => {
      expect(tag().isImage('these classes')).to.be.false;
    });
  });
});
