import { LinkList } from '../../../src/tags/link-list/gb-link-list';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-link-list', LinkList, ({ tag, spy }) => {

  describe('init()', () => {
    it('should transform $linkable to $listable', () => {
      const transform = tag().transform = spy();

      tag().init();

      expect(transform).to.be.calledWith('linkable', ['listable']);
    });
  });
});
