import { META } from '../../../src/tags/tag';
import { meta } from '../../../src/utils/decorators';
import { expect } from 'chai';

describe('decorators', () => {
  describe('meta()', () => {
    it('should return a function', () => {
      expect(meta(<any>{})).to.be.a('function');
    });

    it('should set META on object', () => {
      const tagClass = {};
      const metadata = { a: 'b' };

      meta(metadata)(tagClass);

      expect(tagClass[META]).to.eq(metadata);
    });
  });
});
