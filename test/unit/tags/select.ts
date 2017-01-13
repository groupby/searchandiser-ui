import { Select } from '../../../src/tags/select/gb-select';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-select', Select, ({
  tag, spy, stub,
  expectAliases, expectSubscriptions
}) => {

  describe('init()', () => {
    it('should alias self and re-alias selectable', () => {
      const selectable = { a: 'b' };
      tag().selectable = () => selectable;

      expectAliases(() => tag().init(), {
        select: undefined,
        linkable: selectable,
        listable: selectable
      });
    });

    it('should have default values', () => {
      tag().init();

      expect(tag().onSelect).to.be.undefined;
      expect(tag().iconUrl).to.eq(tag().iconUrl);
      expect(tag().label).to.eq('Select');
      expect(tag().hover).to.be.false;
      expect(tag().native).to.be.false;

      expect(tag().clearItem).to.eql({ label: 'Unselect', clear: true });
      expect(tag().default).to.be.true;
      expect(tag().selectedItem).to.be.undefined;
      expect(tag().selected).to.be.undefined;
      expect(tag().focused).to.be.undefined;
    });

    it('should set properties from selectable', () => {
      const iconUrl = 'image.png';
      const label = 'Choice';
      const clear = 'None selected';
      const onSelect = () => null;
      tag().selectable = () => ({
        onSelect,
        iconUrl,
        label,
        clear,
        hover: true,
        native: true
      });

      tag().init();

      expect(tag().onSelect).to.eq(onSelect);
      expect(tag().iconUrl).to.eq(iconUrl);
      expect(tag().label).to.eq(label);
      expect(tag().hover).to.be.true;
      expect(tag().native).to.be.true;

      expect(tag().clearItem).to.eql({ label: clear, clear: true });
      expect(tag().default).to.be.false;
    });

    it('should override selectedOption with first label when items set and clear undefined', () => {
      const items = [
        { label: 'Value Descending' },
        { label: 'Value Ascending' }
      ];
      tag().selectable = () => ({ items });

      tag().init();

      expect(tag().default).to.be.true;
      expect(tag().selectedItem).to.eq(items[0].label);
    });

    it('should override selectedOption with first option when items set and clear undefined', () => {
      const items = ['first', 'second'];
      tag().selectable = () => ({ items });

      tag().init();

      expect(tag().default).to.be.true;
      expect(tag().selectedItem).to.eq(items[0]);
    });

    it('should listen for update', () => {
      expectSubscriptions(() => tag().init(), { update: tag().updateAliases }, tag());
    });
  });

  describe('updateAliases()', () => {
    it('should call selectable() with $linkable', () => {
      const linkable = tag().$linkable = <any>{ a: 'b' };
      const selectable = tag().selectable = spy();

      tag().updateAliases();

      expect(selectable).to.have.been.calledWith(linkable);
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
      const label = tag().label = <any>{ a: 'b' };

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

  describe('selectItem()', () => {
    it('should update selectedItem', () => {
      const selectedItem = 'a';
      const update = tag().update = spy();

      tag().selectItem(selectedItem, {});

      expect(update.calledWith({ selectedItem })).to.be.true;
    });

    it('should return JSON parsed value', () => {
      const opts = { a: 'b' };
      const callback = tag().onSelect = spy();
      tag().update = () => null;

      tag().selectItem('', JSON.stringify(opts));

      expect(callback).to.have.been.calledWith(opts);
    });

    it('should return value', () => {
      const opts = { a: 'b' };
      const callback = tag().onSelect = spy();
      tag().update = () => null;

      tag().selectItem('', opts);

      expect(callback).to.have.been.calledWith(opts);
    });

    it('should return \'*\'', () => {
      const callback = tag().onSelect = spy();
      tag().update = () => null;

      tag().selectItem('', undefined);

      expect(callback).to.have.been.calledWith('*');
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
