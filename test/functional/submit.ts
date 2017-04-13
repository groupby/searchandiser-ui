import { Submit } from '../../src/tags/submit/gb-submit';
import suite, { BaseModel } from './_suite';

suite<Submit>('gb-submit', ({ flux, mount, expect, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render submit link', () => {
      const model = new Model(mount());

      expect(model.link).to.be.ok;
      expect(model.link.textContent).to.eq('🔍');
    });

    it('should call flux.reset() on click', (done) => {
      const tag = mount();
      flux().reset = (value): any => {
        expect(value).to.eq('old');
        done();
      };
      tag.searchBox = <any>{ value: 'old' };

      tag.root.click();
    });
  });
});

class Model extends BaseModel<Submit>  {
  get link() {
    return this.element(this.html, '.gb-submit');
  }
}
