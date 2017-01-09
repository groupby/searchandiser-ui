import { Select } from '../../../src/tags/select/gb-select';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-select', Select, ({ tag, spy, stub }) => {

  describe('init()', () => {
    it('should have default values', () => {
      tag().init();

      expect(tag().options).to.eql([]);
      expect(tag().onSelect).to.be.undefined;
      expect(tag().iconUrl).to.eq(tag().iconUrl);
      expect(tag().label).to.eq('Select');
      expect(tag().hover).to.be.false;
      expect(tag().native).to.be.false;

      expect(tag().clearOption).to.eql({ label: 'Unselect', clear: true });
      expect(tag().default).to.be.true;
      expect(tag().selectedOption).to.be.undefined;
      expect(tag().selected).to.be.undefined;
      expect(tag().focused).to.be.undefined;
    });

    it('should set properties from selectable', () => {
      const options = [{ a: 'b' }, { c: 'd' }];
      const iconUrl = 'image.png';
      const label = 'Choice';
      const clear = 'None selected';
      const onSelect = () => null;
      tag().selectable = () => ({
        options,
        onSelect,
        iconUrl,
        label,
        clear,
        hover: true,
        native: true
      });

      tag().init();

      expect(tag().options).to.eql(options);
      expect(tag().onSelect).to.eq(onSelect);
      expect(tag().iconUrl).to.eq(iconUrl);
      expect(tag().label).to.eq(label);
      expect(tag().hover).to.be.true;
      expect(tag().native).to.be.true;

      expect(tag().clearOption).to.eql({ label: clear, clear: true });
      expect(tag().default).to.be.false;
    });

    it('should override selectedOption with first label when options set and clear undefined', () => {
      const options = [
        { label: 'Value Descending' },
        { label: 'Value Ascending' }
      ];
      tag().selectable = () => ({ options });

      tag().init();

      expect(tag().default).to.be.true;
      expect(tag().selectedOption).to.eq(options[0].label);
    });

    it('should override selectedOption with first option when options set and clear undefined', () => {
      const options = ['first', 'second'];
      tag().selectable = () => ({ options });

      tag().init();

      expect(tag().default).to.be.true;
      expect(tag().selectedOption).to.eq(options[0]);
    });
  });

  describe('updateOptions()', () => {
    it('should update options', () => {
      const options = ['first', 'second'];
      const update = tag().update = spy();
      tag().default = true;

      tag().updateOptions(options);

      expect(update).to.have.been.calledWith({ options });
    });

    it('should update options with clearOption', () => {
      const options = ['first', 'second'];
      const clearOption = tag().clearOption = { label: 'a', clear: true };
      const update = tag().update = spy();
      tag().default = false;

      tag().updateOptions(options);

      expect(update).to.have.been.calledWith({ options: [clearOption, ...options] });
    });
  });

  describe('selectLabel()', () => {
    it('should return selectedOption', () => {
      const selectedOption = tag().selectedOption = { a: 'b' };

      const option = tag().selectLabel();

      expect(option).to.eq(selectedOption);
    });

    it('should return clearOption', () => {
      const clearOption = tag().clearOption = <any>{ a: 'b' };
      tag().selected = true;

      const option = tag().selectLabel();

      expect(option).to.eq(clearOption);
    });

    it('should return label', () => {
      const label = tag().label = <any>{ a: 'b' };

      const option = tag().selectLabel();

      expect(option).to.eq(label);
    });
  });

  describe('prepFocus()', () => {
    it('should set focused to false', () => {
      tag().focused = true;

      tag().prepFocus();

      expect(tag().focused).to.be.false;
    });
  });

  describe('selectButton()', () => {
    it('should return the select button', () => {
      const root = { a: 'b' };
      tag().tags = <any>{
        'gb-custom-select': {
          tags: {
            'gb-select-button': { root }
          }
        }
      };

      const button = tag().selectButton();

      expect(button).to.eq(root);
    });
  });

  describe('nativeSelect()', () => {
    it('should return selector', () => {
      const selector = { a: 'b' };
      tag().tags = <any>{ 'gb-native-select': { refs: { selector } } };

      const select = tag().nativeSelect();

      expect(select).to.eq(selector);
    });

    it('should select element', () => {
      const selector = { a: 'b' };
      tag().tags = <any>{};
      tag().root = <any>{
        querySelector: (cssSelector) => {
          expect(cssSelector).to.eq('select');
          return selector;
        }
      };

      const select = tag().nativeSelect();

      expect(select).to.eq(selector);
    });
  });

  describe('unfocus()', () => {
    it('should set focused true', () => {
      tag().hover = true;

      tag().unfocus();

      expect(tag().focused).to.be.true;
    });

    it('should set switch focused to true', () => {

      tag().unfocus();

      expect(tag().focused).to.be.true;
    });

    it('should set switch focused to false and blur button', () => {
      const blur = spy();
      tag().focused = true;
      tag().selectButton = () => <any>({ blur });

      tag().unfocus();

      expect(tag().focused).to.be.false;
      expect(blur).to.have.been.called;
    });
  });

  describe('selectOption()', () => {
    it('should update selectedOption', () => {
      const selectedOption = 'a';
      const update = tag().update = spy();

      tag().selectOption(selectedOption, {});

      expect(update.calledWith({ selectedOption })).to.be.true;
    });

    it('should return JSON parsed value', () => {
      const opts = { a: 'b' };
      const callback = tag().onSelect = spy();
      tag().update = () => null;

      tag().selectOption('', JSON.stringify(opts));

      expect(callback).to.have.been.calledWith(opts);
    });

    it('should return value', () => {
      const opts = { a: 'b' };
      const callback = tag().onSelect = spy();
      tag().update = () => null;

      tag().selectOption('', opts);

      expect(callback).to.have.been.calledWith(opts);
    });

    it('should return \'*\'', () => {
      const callback = tag().onSelect = spy();
      tag().update = () => null;

      tag().selectOption('', undefined);

      expect(callback).to.have.been.calledWith('*');
    });
  });

  describe('selectNative()', () => {
    it('should call update() with selected', () => {
      const option = { value: 'hat', text: 'Hat' };
      const options = [{ disabled: true }];
      const update = tag().update = spy();
      const selectOption = stub(tag(), 'selectOption');
      tag().nativeSelect = () => <any>({ options });

      tag().selectNative(<any>{
        target: {
          selectedOptions: [option]
        }
      });

      expect(options[0].disabled).to.be.false;
      expect(update).to.have.been.calledWith({ selected: option.value });
      expect(selectOption).to.have.been.calledWith(option.text, option.value);
    });

    it('should set first option enabled', () => {
      const option = { text: 'Hat' };
      const options = [{ disabled: true }];
      const nativeSelect = stub(tag(), 'nativeSelect').returns({ options });
      const update = tag().update = spy();
      const selectOption = stub(tag(), 'selectOption');

      tag().selectNative(<any>{ target: { selectedOptions: [option] } });

      expect(options[0].disabled).to.be.true;
      expect(nativeSelect).to.have.been.called;
      expect(update).to.have.been.called;
      expect(selectOption).to.have.been.called;
    });
  });

  describe('selectCustom()', () => {
    it('should select option', () => {
      const option = { value: 'hat', label: 'Hat' };
      const selectOption = stub(tag(), 'selectOption');
      const blur = spy();
      tag().selectButton = () => <any>({ blur });

      tag().selectCustom(option);

      expect(blur).to.have.been.called;
      expect(selectOption).to.have.been.calledWith(option.label, option.value);
    });
  });

  describe('clearSelection()', () => {
    it('should call selectOption()', () => {
      const selectOption = stub(tag(), 'selectOption');

      tag().clearSelection();

      expect(selectOption).to.have.been.calledWith(undefined, '*');
    });
  });
});
