import { DidYouMean } from '../../src/tags/did-you-mean/gb-did-you-mean';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

suite<DidYouMean>('gb-did-you-mean', ({ flux, html, mount, itMountsTag }) => {

  itMountsTag();

  it('renders list', () => {
    mount();

    expect(html().querySelector('gb-list')).to.be.ok;
  });

  describe('render behaviour', () => {
    const didYouMean = ['first', 'second', 'third'];

    it('renders from results', () => {
      const tag = mount();
      const model = new Model(tag);

      tag.updateDidYouMean(<any>{ didYouMean });

      expect(model.links).to.have.length(3);
      expect(model.links[0].textContent).to.eq(didYouMean[0]);
    });

    it('rewrites on option selected', (done) => {
      const tag = mount();
      const model = new Model(tag);
      flux().rewrite = (query): any => {
        expect(query).to.eq(didYouMean[1]);
        done();
      };

      tag.updateDidYouMean(<any>{ didYouMean });

      tag.on('updated', () => model.links[1].click());
    });
  });
});

class Model extends BaseModel<DidYouMean> {

  get links() {
    return this.list(this.html, 'li > a');
  }

}
