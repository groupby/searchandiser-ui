import { Option } from '../../../src/tags/select/gb-option';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-option', Option, ({ tag, spy, expectAliases }) => {

  describe('init()', () => {
    it('should set label and value', () => {
      const label = 'My Value';
      const value = 'my_value';
      const optionLabel = () => label;
      const optionValue = () => value;
      tag().$select = <any>{ optionLabel, optionValue };

      tag().init();

      expect(tag().label).to.eq(label);
      expect(tag().value).to.eq(value);
    });
  });

  describe('onSelect()', () => {
    it('should call $select.clearSelection()', () => {
      const clearSelection = spy();
      tag().$select = <any>{ clearSelection };
      tag().$option = { clear: true };

      tag().onSelect();

      expect(clearSelection).to.have.been.called;
    });

    it('should call $select.selectCustom()', () => {
      const selectCustom = spy();
      tag().$option = { clear: false };
      tag().$select = <any>{ selectCustom };

      tag().onSelect();

      expect(selectCustom).to.have.been.calledWith(tag());
    });
  });
});
