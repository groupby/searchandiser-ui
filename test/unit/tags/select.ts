import { Select } from '../../../src/tags/select/gb-select';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-select', Select, ({ tag, spy, stub }) => {

  describe('init()', () => {
    it('should have default values', () => {
      const scope = tag()._scope = <any>{ _config: {} };

      tag().init();

      expect(tag().iconUrl).to.eql(tag().iconUrl);
      expect(tag().label).to.eql('Select');
      expect(tag().clearOption).to.eql({ label: 'Unselect', clear: true });
      expect(tag().options).to.eql([]);
      expect(tag().callback).to.be.undefined;
      expect(tag().selectedOption).to.be.undefined;
      expect(tag().selected).to.be.undefined;
      expect(tag().focused).to.be.undefined;
      expect(tag().default).to.be.true;
      expect(tag()._scope).to.eq(scope);
      expect(tag()._config).to.eql({});
    });

    it('should accept override from _scope', () => {
      const _config = {
        hover: true,
        native: false,
        clear: 'None selected',
        label: 'Choice'
      };
      const options = [{ a: 'b' }, { c: 'd' }];
      const onselect = () => null;
      tag()._scope = <any>{ _config, options, onselect };

      tag().init();

      expect(tag().label).to.eql('Choice');
      expect(tag().clearOption).to.eql({ label: 'None selected', clear: true });
      expect(tag().options).to.eql(options);
      expect(tag().callback).to.eq(onselect);
      expect(tag()._config).to.eq(_config);
    });

    it('should override selectedOption with first label when options set and clear undefined', () => {
      const options = [
        { label: 'Value Descending' },
        { label: 'Value Ascending' }
      ];
      tag()._scope = <any>{ options, _config: {} };

      tag().init();

      expect(tag().default).to.be.true;
      expect(tag().selectedOption).to.eq(options[0].label);
    });

    it('should override selectedOption with first option when options set and clear undefined', () => {
      const options = ['first', 'second'];
      tag()._scope = <any>{ options, _config: {} };

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
      tag().tags = <any>{ 'gb-native-select': { selector } };

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
      tag()._config = { hover: true };

      tag().unfocus();

      expect(tag().focused).to.be.true;
    });

    it('should set switch focused to true', () => {
      tag()._config = {};

      tag().unfocus();

      expect(tag().focused).to.be.true;
    });

    it('should set switch focused to false and blur button', () => {
      const blur = spy();
      tag()._config = {};
      tag().focused = true;
      tag().selectButton = () => ({ blur });

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
      const callback = tag().callback = spy();
      tag().update = () => null;

      tag().selectOption('', JSON.stringify(opts));

      expect(callback).to.have.been.calledWith(opts);
    });

    it('should return value', () => {
      const opts = { a: 'b' };
      const callback = tag().callback = spy();
      tag().update = () => null;

      tag().selectOption('', opts);

      expect(callback).to.have.been.calledWith(opts);
    });

    it('should return \'*\'', () => {
      const callback = tag().callback = spy();
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
      tag().nativeSelect = () => ({ options });

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
      tag().selectButton = () => ({ blur });

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
