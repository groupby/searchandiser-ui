import { Option } from '../../../src/tags/select/gb-option';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-option', Option, ({ tag, spy }) => {

  describe('init()', () => {
    it('should add class clear to root', () => {
      const add = spy();
      tag().$item = { clear: true };
      tag().$select = <any>{ itemLabel: () => null, itemValue: () => null };
      tag().root = <any>{ classList: { add } };

      tag().init();
    });

    it('should set label and value', () => {
      const label = 'My Value';
      const value = 'my_value';
      const itemLabel = () => label;
      const itemValue = () => value;
      tag().$select = <any>{ itemLabel, itemValue };
      tag().$item = {};

      tag().init();

      expect(tag().label).to.eq(label);
      expect(tag().value).to.eq(value);
    });
  });

  describe('onSelect()', () => {
    it('should call $select.clearSelection()', () => {
      const clearSelection = spy();
      tag().$select = <any>{ clearSelection };
      tag().$item = { clear: true };

      tag().onSelect();

      expect(clearSelection).to.have.been.called;
    });

    it('should call $select.selectCustom()', () => {
      const selectCustom = spy();
      tag().$item = { clear: false };
      tag().$select = <any>{ selectCustom };

      tag().onSelect();

      expect(selectCustom).to.have.been.calledWith(tag());
    });
  });
});
