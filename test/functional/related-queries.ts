import { RelatedQueries } from '../../src/tags/related-queries/gb-related-queries';
import suite, { BaseModel } from './_suite';

suite<RelatedQueries>('gb-related-queries', ({ flux, mount, expect, stub, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render list', () => {
      const tag = mount();

      expect(tag.root.querySelector('gb-list')).to.be.ok;
    });
  });

  describe('render with related queries', () => {
    const RELATED_QUERIES = ['first', 'second', 'third'];
    let tag: RelatedQueries;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
      tag.updatedRelatedQueries(<any>{ relatedQueries: RELATED_QUERIES });
    });

    it('should render related queries', () => {
      expect(model.relatedLinks.length).to.eq(3);
      expect(model.relatedLinks[0].textContent).to.eq(RELATED_QUERIES[0]);
    });

    it('rewrites on option selected', () => {
      const rewrite = stub(flux(), 'rewrite');

      model.relatedLinks[1].click();

      expect(rewrite).to.be.calledWith(RELATED_QUERIES[1]);
    });
  });
});

class Model extends BaseModel<RelatedQueries> {
  get relatedLinks() {
    return this.list(this.html, 'li > a');
  }
}
