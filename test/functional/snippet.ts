import { Snippet } from '../../src/tags/snippet/gb-snippet';
import suite from './_suite';
import { expect } from 'chai';

suite<Snippet>('gb-snippet', ({ mount, tagName, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render snippet', () => {
      const tag = mount();

      expect(tag.root.querySelector(`div.${tagName}`)).to.be.ok;
    });
  });
});
