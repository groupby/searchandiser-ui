import { Reset } from '../../src/tags/reset/gb-reset';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

suite<Reset>('gb-reset', ({ flux, mount, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render reset link', () => {
      const model = new Model(mount());

      expect(model.link).to.be.ok;
      expect(model.link.textContent).to.eq('×');
    });

    it('should call flux.reset() on click', (done) => {
      const tag = mount();
      tag.searchBox = <any>{ value: 'old' };
      flux().reset = (): any => done();

      tag.root.click();
    });
  });
});

class Model extends BaseModel<Reset> {
  get link() {
    return this.element(this.html, 'a');
  }
}
