import { Raw } from '../../src/tags/raw/gb-raw';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

const OPTS = { content: '<div>red sneakers</div>' };

suite<Raw>('gb-raw', ({ mount, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render inner div', () => {
      const model = new Model(mount(OPTS));

      expect(model.content).to.be.ok;
    });

    it('should not render content as html', () => {
      const model = new Model(mount(OPTS));

      expect(model.content.textContent).to.eq('red sneakers');
    });
  });
});

class Model extends BaseModel<Raw> {
  get content() {
    return this.element(this.html, 'div');
  }
}
