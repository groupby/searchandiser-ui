import { Select } from '../../../src/tags/select/gb-select';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-select', Select, ({ tag, sandbox }) => {

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
      const config = {
        hover: true,
        native: false,
        clear: 'None selected',
        label: 'Choice'
      };
      const options = [{ a: 'b' }, { c: 'd' }];
      const onselect = () => null;
      tag()._scope = <any>{
        _config: config,
        options,
        onselect
      };

      tag().init();

      expect(tag().label).to.eql('Choice');
      expect(tag().clearOption).to.eql({ label: 'None selected', clear: true });
      expect(tag().options).to.eql(options);
      expect(tag().callback).to.eq(onselect);
      expect(tag()._config).to.eq(config);
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
      const opts = ['first', 'second'];
      const spy =
        tag().update =
        sinon.spy(({options}) => expect(options).to.eq(opts));
      tag().default = true;

      tag().updateOptions(opts);

      expect(spy.called).to.be.true;
    });

    it('should update options with clearOption', () => {
      const opts = ['first', 'second'];
      const clearOption = tag().clearOption = { label: 'a', clear: true };
      const spy =
        tag().update =
        sinon.spy(({options}) => expect(options).to.eql([clearOption, ...opts]));
      tag().default = false;

      tag().updateOptions(opts);

      expect(spy.called).to.be.true;
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
      const blur = sinon.spy();
      tag()._config = {};
      tag().focused = true;
      tag().selectButton = () => ({ blur });

      tag().unfocus();

      expect(tag().focused).to.be.false;
      expect(blur.called).to.be.true;
    });
  });

  describe('selectOption()', () => {
    it('should update selectedOption', () => {
      const opts = 'a';
      const spy =
        tag().update =
        sinon.spy(({selectedOption}) => expect(selectedOption).to.eq(opts));

      tag().selectOption(opts, {});

      expect(spy.called).to.be.true;
    });

    it('should return JSON parsed value', () => {
      const opts = { a: 'b' };
      const spy =
        tag().callback =
        sinon.spy((value) => expect(value).to.eql(opts));
      tag().update = () => null;

      tag().selectOption('', JSON.stringify(opts));

      expect(spy.called).to.be.true;
    });

    it('should return value', () => {
      const opts = { a: 'b' };
      const spy =
        tag().callback =
        sinon.spy((value) => expect(value).to.eql(opts));
      tag().update = () => null;

      tag().selectOption('', opts);

      expect(spy.called).to.be.true;
    });

    it('should return \'*\'', () => {
      const spy =
        tag().callback =
        sinon.spy((value) => expect(value).to.eql('*'));
      tag().update = () => null;

      tag().selectOption('', undefined);

      expect(spy.called).to.be.true;
    });
  });

  describe('selectNative()', () => {
    it('should call update() with selected', () => {
      const option = { value: 'hat', text: 'Hat' };
      const options = [{ disabled: true }];
      const spy =
        tag().update =
        sinon.spy(({ selected }) => expect(selected).to.eq(option.value));
      const stub = sandbox().stub(tag(), 'selectOption', (text, selected) => {
        expect(text).to.eq(option.text);
        expect(selected).to.eq(option.value);
      });
      tag().nativeSelect = () => ({ options });

      tag().selectNative(<any>{
        target: {
          selectedOptions: [option]
        }
      });

      expect(options[0].disabled).to.be.false;
      expect(spy.called).to.be.true;
      expect(stub.called).to.be.true;
    });

    it('should set first option enabled', () => {
      const option = { text: 'Hat' };
      const options = [{ disabled: true }];
      const stub = sandbox().stub(tag(), 'nativeSelect', () => ({ options }));
      tag().update = () => null;
      tag().selectOption = () => null;

      tag().selectNative(<any>{ target: { selectedOptions: [option] } });

      expect(options[0].disabled).to.be.true;
      expect(stub.called).to.be.true;
    });
  });

  describe('selectCustom()', () => {
    it('should select option', () => {
      const option = { value: 'hat', label: 'Hat' };
      const blur = sinon.spy();
      const stub = sandbox().stub(tag(), 'selectOption', (label, value) => {
        expect(label).to.eq(option.label);
        expect(value).to.eq(option.value);
      });
      tag().selectButton = () => ({ blur });

      tag().selectCustom(option);

      expect(blur.called).to.be.true;
      expect(stub.called).to.be.true;
    });
  });

  describe('clearSelection()', () => {
    it('should call selectOption()', () => {
      const stub = sandbox().stub(tag(), 'selectOption', (label, value) => {
        expect(label).to.be.undefined;
        expect(value).to.eq('*');
      });

      tag().clearSelection();

      expect(stub.called).to.be.true;
    });
  });
});
