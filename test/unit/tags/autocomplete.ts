import { Autocomplete, AUTOCOMPLETE_HIDE_EVENT } from '../../../src/tags/sayt/autocomplete';
import * as utils from '../../../src/utils/common';
import { expect } from 'chai';

describe('Autocomplete', () => {
  let sandbox: Sinon.SinonSandbox;
  let autocomplete: Autocomplete;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    autocomplete = new Autocomplete(<any>{});
  });
  afterEach(() => sandbox.restore());

  describe('on construction', () => {
    it('should set default values', () => {
      const searchBox = { a: 'b' };
      sandbox.stub(utils, 'findSearchBox').returns(searchBox);

      autocomplete = new Autocomplete(<any>{});

      expect(autocomplete.searchInput).to.eq(searchBox);
      expect(autocomplete.selected).to.eq(searchBox);
    });
  });

  describe('indexOfSelected()', () => {
    it('should return index of selected', () => {
      const selected = autocomplete.selected = <any>{ a: 'b' };
      const selectedIndex = 13;
      const indexOf = sandbox.spy(() => selectedIndex);
      autocomplete.links = (): any => ({ indexOf });

      const index = autocomplete.indexOfSelected();

      expect(index).to.eq(selectedIndex);
      expect(indexOf.calledWith(selected)).to.be.true;
    });
  });

  describe('selectLink()', () => {
    it('should not select link', () => {
      const selected = autocomplete.selected = <any>{ a: 'b' };

      autocomplete.selectLink(undefined);

      expect(autocomplete.selected).to.eq(selected);
    });

    it('should set selected', () => {
      const selected: any = { a: 'b' };
      const selection: any = { c: 'd' };
      const swapAttributes = sandbox.stub(autocomplete, 'swapAttributes')
        .returns(selected);

      autocomplete.selectLink(selection);

      expect(autocomplete.selected).to.eq(selected);
      expect(swapAttributes.calledWith(selection)).to.be.true;
    });
  });

  describe('linkAbove()', () => {
    it('should return the previous link', () => {
      const selected: any = { a: 'b' };
      const indexOfSelected = sandbox.stub(autocomplete, 'indexOfSelected')
        .returns(1);
      autocomplete.links = (): any => [selected];

      const link = autocomplete.linkAbove();

      expect(link).to.eq(selected);
      expect(indexOfSelected.called).to.be.true;
    });
  });

  describe('linkBelow()', () => {
    it('should return the previous link', () => {
      const selected: any = { a: 'b' };
      const indexOfSelected = sandbox.stub(autocomplete, 'indexOfSelected')
        .returns(0);
      autocomplete.links = (): any => [undefined, selected];

      const link = autocomplete.linkBelow();

      expect(link).to.eq(selected);
      expect(indexOfSelected.called).to.be.true;
    });
  });

  describe('links()', () => {
    it('should return the previous link', () => {
      const linkNodes = ['a', 'b', 'c'];
      const querySelectorAll = sandbox.spy(() => linkNodes);
      autocomplete = new Autocomplete(<any>{ root: { querySelectorAll } });

      const links = autocomplete.links();

      expect(links).to.eql(linkNodes);
      expect(querySelectorAll.calledWith('gb-sayt-autocomplete gb-sayt-link')).to.be.true;
    });
  });

  describe('isSelectedInAutocomplete()', () => {
    it('should should return false', () => {
      const selected = autocomplete.selected = <any>{ a: 'b' };
      const indexOf = sandbox.spy(() => -1);
      autocomplete.links = (): any => ({ indexOf });

      const isSelected = autocomplete.isSelectedInAutocomplete();

      expect(isSelected).to.be.false;
      expect(indexOf.calledWith(selected)).to.be.true;
    });

    it('should should return true', () => {
      const selected = autocomplete.selected = <any>{ a: 'b' };
      const indexOf = sandbox.spy(() => 12);
      autocomplete.links = (): any => ({ indexOf });

      const isSelected = autocomplete.isSelectedInAutocomplete();

      expect(isSelected).to.be.true;
      expect(indexOf.calledWith(selected)).to.be.true;
    });
  });

  describe('swapAttributes()', () => {
    it('should set active and call removeActiveClass()', () => {
      autocomplete = new Autocomplete(<any>{ notifier: () => expect.fail() });
      const removeActiveClass = sandbox.stub(autocomplete, 'removeActiveClass');
      const add = sandbox.spy();
      const nextLink: any = { classList: { add }, dataset: {} };

      const link = autocomplete.swapAttributes(nextLink);

      expect(link).to.eq(nextLink);
      expect(removeActiveClass.called).to.be.true;
      expect(add.calledWith('active')).to.be.true;
    });

    it('should call notifier', () => {
      const notifier = sandbox.spy();
      const nextLink: any = { classList: { add: () => null }, dataset: { value: 'thing' } };
      autocomplete = new Autocomplete(<any>{ notifier });
      sandbox.stub(autocomplete, 'removeActiveClass');

      const link = autocomplete.swapAttributes(nextLink);

      expect(link).to.eq(nextLink);
      expect(notifier.called).to.be.true;
    });
  });

  describe('resetSelected()', () => {
    it('should set selected to searchInput', () => {
      const searchInput = autocomplete.searchInput = <any>{ a: 'b' };

      autocomplete.resetSelected();

      expect(autocomplete.selected).to.eq(searchInput);
    });
  });

  describe('removeActiveClass()', () => {
    it('should remove class from all links', () => {
      const spy1 = sandbox.spy();
      const spy2 = sandbox.spy();
      const spy3 = sandbox.spy();
      autocomplete.links = () => <any[]>[
        { classList: { remove: spy1 } },
        { classList: { remove: spy2 } },
        { classList: { remove: spy3 } }
      ];

      autocomplete.removeActiveClass();

      expect(spy1.calledWith('active')).to.be.true;
      expect(spy2.calledWith('active')).to.be.true;
      expect(spy3.calledWith('active')).to.be.true;
    });
  });

  describe('reset()', () => {
    it('should call resetSelected() and removeActiveClass()', () => {
      const resetSelected = sandbox.stub(autocomplete, 'resetSelected');
      const removeActiveClass = sandbox.stub(autocomplete, 'removeActiveClass');

      autocomplete.reset();

      expect(resetSelected.called).to.be.true;
      expect(removeActiveClass.called).to.be.true;
    });
  });

  describe('keyboardListener()', () => {
    describe('KEY_UP', () => {
      let preventDefault: Sinon.SinonSpy;
      let event: KeyboardEvent;

      beforeEach(() => {
        preventDefault = sandbox.spy();
        event = <any>{ preventDefault, keyCode: 38 };
      });

      it('should emit autocomplete:hide event', () => {
        const emit = sandbox.spy();
        autocomplete = new Autocomplete(<any>{ flux: { emit } });
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(false);

        autocomplete.keyboardListener(event, () => null);

        expect(isSelectedInAutocomplete.called).to.be.true;
        expect(preventDefault.called).to.be.true;
        expect(emit.calledWith(AUTOCOMPLETE_HIDE_EVENT)).to.be.true;
      });

      it('should reset autocomplete', () => {
        const originalValue = autocomplete.preautocompleteValue = 'red shoes';
        const reset = sandbox.stub(autocomplete, 'reset');
        const linkAbove = sandbox.stub(autocomplete, 'linkAbove').returns(false);
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(true);
        autocomplete.searchInput = <any>{ a: 'b' };

        autocomplete.keyboardListener(event, () => null);

        expect(autocomplete.searchInput.value).to.eq(originalValue);
        expect(isSelectedInAutocomplete.called).to.be.true;
        expect(preventDefault.called).to.be.true;
        expect(linkAbove.called).to.be.true;
        expect(reset.called).to.be.true;
      });

      it('should select next link', () => {
        const link = { a: 'b' };
        const selectLink = sandbox.stub(autocomplete, 'selectLink');
        const linkAbove = sandbox.stub(autocomplete, 'linkAbove').returns(link);
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(true);

        autocomplete.keyboardListener(event, () => null);

        expect(isSelectedInAutocomplete.called).to.be.true;
        expect(preventDefault.called).to.be.true;
        expect(linkAbove.called).to.be.true;
        expect(selectLink.calledWith(link)).to.be.true;
      });
    });

    describe('KEY_DOWN', () => {
      let event: KeyboardEvent;

      beforeEach(() => event = <any>{ keyCode: 40 });

      it('should select link below and set preautocompleteValue', () => {
        const link = { a: 'b' };
        const linkBelow = sandbox.stub(autocomplete, 'linkBelow').returns(link);
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(false);
        const selectLink = sandbox.stub(autocomplete, 'selectLink');
        const query = 'red boots';
        autocomplete.searchInput = <any>{ value: query };

        autocomplete.keyboardListener(event, () => null);

        expect(autocomplete.preautocompleteValue).to.eq(query);
        expect(isSelectedInAutocomplete.called).to.be.true;
        expect(linkBelow.called).to.be.true;
        expect(selectLink.calledWith(link)).to.be.true;
      });

      it('should select link below and not set preautocompleteValue', () => {
        const link = { a: 'b' };
        const linkBelow = sandbox.stub(autocomplete, 'linkBelow').returns(link);
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(true);
        const selectLink = sandbox.stub(autocomplete, 'selectLink');

        autocomplete.keyboardListener(event, () => null);

        expect(autocomplete.preautocompleteValue).to.be.undefined;
        expect(isSelectedInAutocomplete.called).to.be.true;
        expect(linkBelow.called).to.be.true;
        expect(selectLink.calledWith(link)).to.be.true;
      });
    });

    describe('KEY_ENTER', () => {
      let event: KeyboardEvent;

      beforeEach(() => event = <any>{ keyCode: 13 });

      it('should call callback', () => {
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(false);
        const callback = sandbox.spy();

        autocomplete.keyboardListener(event, callback);

        expect(isSelectedInAutocomplete.called).to.be.true;
        expect(callback.called).to.be.true;
      });

      it('should select link below and not set preautocompleteValue', () => {
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(true);
        const reset = sandbox.stub(autocomplete, 'reset');
        const click = sandbox.spy();
        const querySelector = sinon.spy(() => ({ click }));
        autocomplete.selected = <any>{ querySelector };

        autocomplete.keyboardListener(event, () => null);

        expect(isSelectedInAutocomplete.called).to.be.true;
        expect(querySelector.calledWith('a')).to.be.true;
        expect(click.called).to.be.true;
        expect(reset.called).to.be.true;
      });
    });

    describe('KEY_ESCAPE', () => {
      let event: KeyboardEvent;

      beforeEach(() => event = <any>{ keyCode: 27 });

      it('should emit autocomplete:hide', () => {
        const emit = sandbox.spy();
        autocomplete = new Autocomplete(<any>{ flux: { emit } });

        autocomplete.keyboardListener(event, () => null);

        expect(emit.calledWith(AUTOCOMPLETE_HIDE_EVENT)).to.be.true;
      });
    });
  });
});
