import { Toggle } from '../../../src/tags/toggle/gb-toggle';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-toggle', Toggle, ({
  tag, stub, spy,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should set default values', () => {
      tag().addStyleTag = () => null;

      tag().init();

      expect(tag().height).to.eq(30);
      expect(tag().switchHeight).to.eq(22);
      expect(tag().animationSpeed).to.eq(0.4);
      expect(tag().checked).to.be.false;
    });

    it('should set properties from toggleable()', () => {
      const height = 40;
      const switchHeight = 10;
      const animationSpeed = 0.4;
      const checked = true;
      tag().addStyleTag = () => null;
      tag().toggleable = () => ({ height, switchHeight, animationSpeed, checked });

      tag().init();

      expect(tag().height).to.eq(height);
      expect(tag().switchHeight).to.eq(switchHeight);
      expect(tag().animationSpeed).to.eq(animationSpeed);
      expect(tag().checked).to.be.true;
    });

    it('should listen for mount', () => {
      tag().addStyleTag = () => null;

      expectSubscriptions(() => tag().init(), {
        mount: tag().onMount
      }, tag());
    });

    it('should call addStyleTag()', (done) => {
      tag().refs.input = <any>{};
      tag().addStyleTag = () => done();

      tag().init();
    });
  });

  describe('onMount()', () => {
    it('should set input checked', () => {
      const input = tag().refs.input = <any>{};
      tag().checked = true;

      tag().onMount();

      expect(input.checked).to.be.true;
    });
  });

  describe('onClick()', () => {
    it('should not error on missing trigger method', () => {
      expect(() => tag().onClick()).not.to.throw();
    });

    it('should call the configured trigger method', () => {
      const trigger = spy();
      tag().opts = { trigger };
      tag().refs.input = <any>{ checked: true };

      tag().onClick();

      expect(trigger).to.have.been.calledWith(true);
    });
  });

  describe('calculateSwitchHeight()', () => {
    it('should force height difference to be even', () => {
      tag().switchHeight = 40;

      const switchHeight = tag().calculateSwitchHeight(41);

      expect(switchHeight).to.eq(39);
    });

    it('should not alter switchHeight', () => {
      tag().switchHeight = 40;

      const switchHeight = tag().calculateSwitchHeight(42);

      expect(switchHeight).to.eq(40);
    });

    it('should not allow switchHeight > height', () => {
      tag().switchHeight = 50;

      const switchHeight = tag().calculateSwitchHeight(40);

      expect(switchHeight).to.eq(40);
    });
  });

  describe('addStyleTag()', () => {
    it('should add style tag', () => {
      const node: any = {};
      const appendChild = spy();
      const createElement = stub(document, 'createElement').returns(node);
      tag().root = <any>{ appendChild };
      tag().switchHeight = 20;
      tag().height = 30;
      tag().animationSpeed = 0.5;

      tag().addStyleTag();

      expectCss(node.textContent, `
        gb-toggle label,
        [data-is="gb-toggle"] label {
          height: 30px;
          width: 60px;
        }
      `);
      expectCss(node.textContent, `
         gb-toggle div,
         [data-is="gb-toggle"] div {
           transition: 0.5s;
         }
      `);
      expectCss(node.textContent, `
         gb-toggle span,
         [data-is="gb-toggle"] span {
           height: 20px;
           width: 20px;
           left: 5px;
           bottom: 5px;
           transition: 0.5s;
         }
      `);
      expectCss(node.textContent, `
         gb-toggle input:checked + div > span,
         [data-is="gb-toggle"] input:checked + div > span {
           transform: translateX(30px);
         }
      `);
      expect(createElement).to.have.been.calledWith('style');
      expect(appendChild).to.have.been.calledWith(node);
    });
  });

  describe('toggleable()', () => {
    it('should mix $toggleable with opts', () => {
      tag().$toggleable = <any>{ a: 'b', c: 'd' };
      tag().opts = { a: 'e' };

      expect(tag().toggleable()).to.eql({ a: 'e', c: 'd' });
    });
  });
});

function expectCss(actual: string, expected: string) {
  expect(actual.replace(/\s+/g, ' ')).to.contain(expected.replace(/\s+/g, ' '));
}
