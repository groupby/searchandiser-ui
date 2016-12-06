import { Toggle } from '../../src/tags/toggle/gb-toggle';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

suite<Toggle>('gb-toggle', ({ mount, itMountsTag }) => {

  itMountsTag();

  describe('render', () => {
    it('should render input and slider', () => {
      const model = new Model(mount());

      expect(model.input).to.be.ok;
      expect(model.slider).to.be.ok;
      expect(model.style).to.be.ok;
    });

    it('should set dimensions dynamically', () => {
      const model = new Model(mount({ height: 40, switchHeight: 30 }));

      const sliderInner = model.slider.querySelector('span');
      expect(model.label.clientHeight).to.eq(40);
      expect(model.label.clientWidth).to.eq(80);
      expect(sliderInner.clientWidth).to.eq(30);
      expect(sliderInner.clientHeight).to.eq(30);
    });
  });
});

class Model extends BaseModel<Toggle> {
  get label() {
    return this.element(this.html, 'label');
  }

  get input() {
    return this.element(this.html, 'input');
  }

  get slider() {
    return this.element(this.html, 'div');
  }

  get style() {
    return this.element(this.html, 'style');
  }
}
