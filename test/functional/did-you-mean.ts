import { DidYouMean } from '../../src/tags/did-you-mean/gb-did-you-mean';
import suite, { BaseModel } from './_suite';

suite<DidYouMean>('gb-did-you-mean', ({ flux, mount, expect, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('renders list', () => {
      const model = new Model(mount());

      expect(model.optionList).to.be.ok;
    });
  });

  describe('render with didYouMean', () => {
    const DID_YOU_MEAN = ['first', 'second', 'third'];
    let tag: DidYouMean;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
      tag.updateDidYouMean(<any>{ didYouMean: DID_YOU_MEAN });
    });

    it('renders links', () => {
      expect(model.links).to.have.length(3);
      expect(model.links[0].textContent).to.eq(DID_YOU_MEAN[0]);
    });

    it('rewrites on option selected', (done) => {
      flux().rewrite = (query): any => {
        expect(query).to.eq(DID_YOU_MEAN[1]);
        done();
      };

      model.links[1].click();
    });
  });
});

class Model extends BaseModel<DidYouMean> {

  get optionList() {
    return this.element(this.html, 'gb-list');
  }

  get links() {
    return this.list(this.html, 'li[data-is="gb-list-item"] > a');
  }
}
