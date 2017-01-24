import { DEFAULTS, Toggle, TYPES } from '../../../src/tags/toggle/gb-toggle';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-toggle', Toggle, ({
  tag, stub, spy,
  expectSubscriptions
}) => {

  describe('init()', () => {
    it('should inherits on toggleable', () => {
      const inherits = tag().inherits = spy();

      tag().init();

      expect(inherits).to.be.calledWith('toggleable', { defaults: DEFAULTS, types: TYPES });
    });

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        'before-mount': tag().addStyleTag,
        mount: tag().onMount
      }, tag());
    });
  });

  describe('onMount()', () => {
    it('should set input checked', () => {
      const input = tag().refs.input = <any>{};
      tag().$toggleable = { checked: true };

      tag().onMount();

      expect(input.checked).to.be.true;
    });
  });

  describe('onClick()', () => {
    it('should not error on missing trigger method', () => {
      tag().$toggleable = {};

      expect(() => tag().onClick()).not.to.throw();
    });

    it('should call the configured trigger method', () => {
      const onToggle = spy();
      tag().$toggleable = { onToggle };
      tag().refs.input = <any>{ checked: true };

      tag().onClick();

      expect(onToggle).to.have.been.calledWith(true);
    });
  });

  describe('calculateSwitchHeight()', () => {
    it('should force height difference to be even', () => {
      tag().$toggleable = { switchHeight: 40 };

      const switchHeight = tag().calculateSwitchHeight(41);

      expect(switchHeight).to.eq(39);
    });

    it('should not alter switchHeight', () => {
      tag().$toggleable = { switchHeight: 40 };

      const switchHeight = tag().calculateSwitchHeight(42);

      expect(switchHeight).to.eq(40);
    });

    it('should not allow switchHeight > height', () => {
      tag().$toggleable = { switchHeight: 50 };

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
      tag().$toggleable = {
        switchHeight: 20,
        height: 30,
        animationSpeed: 0.5
      };

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
});

function expectCss(actual: string, expected: string) {
  expect(actual.replace(/\s+/g, ' ')).to.contain(expected.replace(/\s+/g, ' '));
}
