import { DEFAULTS, Select, TYPES } from '../../../src/tags/select/gb-select';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-select', Select, ({
  tag, spy, stub,
  itShouldAlias
}) => {

  describe('init()', () => {
    itShouldAlias('select');

    it('should transform selectable to listable, linkable', () => {
      const transform = tag().transform = spy();

      tag().init();

      expect(transform).to.have.been.calledWith('selectable', ['linkable', 'listable'], {
        defaults: DEFAULTS,
        types: TYPES
      });
    });
  });

  describe('onConfigure()', () => {
    it('should override selectedOption with first label when items set and clear undefined', () => {
      const items = [
        { label: 'Value Descending' },
        { label: 'Value Ascending' }
      ];
      tag().$selectable = <any>{ items };

      tag().onConfigure();

      expect(tag().default).to.be.true;
      expect(tag().selectedItem).to.eq(items[0].label);
    });

    it('should override selectedOption with first option when items set and clear undefined', () => {
      const items = ['first', 'second'];
      tag().$selectable = <any>{ items };

      tag().onConfigure();

      expect(tag().default).to.be.true;
      expect(tag().selectedItem).to.eq(items[0]);
    });
  });

  describe('selectLabel()', () => {
    it('should return selectedItem', () => {
      const selectedItem = tag().selectedItem = { a: 'b' };

      const item = tag().selectLabel();

      expect(item).to.eq(selectedItem);
    });

    it('should return clearItem', () => {
      const clearItem = tag().clearItem = <any>{ a: 'b' };
      tag().selected = true;

      const item = tag().selectLabel();

      expect(item).to.eq(clearItem);
    });

    it('should return label', () => {
      const label = <any>{ a: 'b' };
      tag().$selectable = <any>{ label };

      const item = tag().selectLabel();

      expect(item).to.eq(label);
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
      tag().$selectable = <any>{ hover: true };

      tag().unfocus();

      expect(tag().focused).to.be.true;
    });

    it('should set switch focused to true', () => {
      tag().$selectable = <any>{};

      tag().unfocus();

      expect(tag().focused).to.be.true;
    });

    it('should set switch focused to false and blur button', () => {
      const blur = spy();
      tag().$selectable = <any>{};
      tag().focused = true;
      tag().selectButton = () => <any>({ blur });

      tag().unfocus();

      expect(tag().focused).to.be.false;
      expect(blur).to.have.been.called;
    });
  });

  describe('selectItem()', () => {
    it('should update selectedItem', () => {
      const selectedItem = 'a';
      const update = tag().update = spy();
      tag().$selectable = <any>{};

      tag().selectItem(selectedItem, {});

      expect(update.calledWith({ selectedItem })).to.be.true;
    });

    it('should return JSON parsed value', () => {
      const opts = { a: 'b' };
      const onSelect = spy();
      tag().$selectable = <any>{ onSelect };
      tag().update = () => null;

      tag().selectItem('', JSON.stringify(opts));

      expect(onSelect).to.have.been.calledWith(opts);
    });

    it('should return value', () => {
      const opts = { a: 'b' };
      const onSelect = spy();
      tag().$selectable = <any>{ onSelect };
      tag().update = () => null;

      tag().selectItem('', opts);

      expect(onSelect).to.have.been.calledWith(opts);
    });

    it('should return \'*\'', () => {
      const onSelect = spy();
      tag().$selectable = <any>{ onSelect };
      tag().update = () => null;

      tag().selectItem('', undefined);

      expect(onSelect).to.have.been.calledWith('*');
    });
  });

  describe('selectNative()', () => {
    it('should call update() with selected', () => {
      const item = { value: 'hat', text: 'Hat' };
      const options = [{ disabled: true }];
      const update = tag().update = spy();
      const selectItem = stub(tag(), 'selectItem');
      tag().nativeSelect = () => <any>({ options });

      tag().selectNative(<any>{ target: { selectedOptions: [item] } });

      expect(options[0].disabled).to.be.false;
      expect(update).to.have.been.calledWith({ selected: item.value });
      expect(selectItem).to.have.been.calledWith(item.text, item.value);
    });

    it('should set first item enabled', () => {
      const item = { text: 'Hat' };
      const options = [{ disabled: true }];
      const nativeSelect = stub(tag(), 'nativeSelect').returns({ options });
      const update = tag().update = spy();
      const selectItem = stub(tag(), 'selectItem');

      tag().selectNative(<any>{ target: { selectedOptions: [item] } });

      expect(options[0].disabled).to.be.true;
      expect(nativeSelect).to.have.been.called;
      expect(update).to.have.been.called;
      expect(selectItem).to.have.been.called;
    });
  });

  describe('selectCustom()', () => {
    it('should select item', () => {
      const item = { value: 'hat', label: 'Hat' };
      const selectItem = stub(tag(), 'selectItem');
      const blur = spy();
      tag().selectButton = () => <any>({ blur });

      tag().selectCustom(item);

      expect(blur).to.have.been.called;
      expect(selectItem).to.have.been.calledWith(item.label, item.value);
    });
  });

  describe('clearSelection()', () => {
    it('should call selectItem()', () => {
      const selectItem = stub(tag(), 'selectItem');

      tag().clearSelection();

      expect(selectItem).to.have.been.calledWith(undefined, '*');
    });
  });
});
