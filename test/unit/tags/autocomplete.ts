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
      expect(indexOf).to.have.been.calledWith(selected);
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
      expect(swapAttributes).to.have.been.calledWith(selection);
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
      expect(indexOfSelected).to.have.been.called;
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
      expect(indexOfSelected).to.have.been.called;
    });
  });

  describe('links()', () => {
    it('should return the previous link', () => {
      const linkNodes = ['a', 'b', 'c'];
      const querySelectorAll = sandbox.spy(() => linkNodes);
      autocomplete = new Autocomplete(<any>{ root: { querySelectorAll } });

      const links = autocomplete.links();

      expect(links).to.eql(linkNodes);
      expect(querySelectorAll).to.have.been.calledWith('gb-sayt-autocomplete gb-sayt-link');
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
      expect(indexOf).to.have.been.calledWith(selected);
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
      expect(add).to.have.been.calledWith('active');
    });

    describe('notifier()', () => {
      const VALUE = 'thing';
      const REFINEMENT = 'Medium';
      const FIELD = 'size';
      let notifier: Sinon.SinonSpy;
      let nextLink: any & { dataset: any };

      beforeEach(() => {
        notifier = sandbox.spy();
        autocomplete = new Autocomplete(<any>{ notifier });
        autocomplete.removeActiveClass = () => null;
        nextLink = { classList: { add: () => null } };
      });

      it('should call notifier with value', () => {
        nextLink.dataset = { value: VALUE };

        const link = autocomplete.swapAttributes(nextLink);

        expect(link).to.eq(nextLink);
        expect(notifier).to.have.been.calledWith(VALUE, undefined, undefined);
      });

      it('should call notifier with value and refinement', () => {
        nextLink.dataset = { value: VALUE, refinement: REFINEMENT };

        const link = autocomplete.swapAttributes(nextLink);

        expect(link).to.eq(nextLink);
        expect(notifier).to.have.been.calledWith(VALUE, REFINEMENT, undefined);
      });

      it('should call notifier with just refinement', () => {
        nextLink.dataset = { refinement: REFINEMENT };

        const link = autocomplete.swapAttributes(nextLink);

        expect(link).to.eq(nextLink);
        expect(notifier).to.have.been.calledWith(undefined, REFINEMENT, undefined);
      });

      it('should call notifier with value, refinement and field', () => {
        nextLink.dataset = { value: VALUE, refinement: REFINEMENT, field: FIELD };

        const link = autocomplete.swapAttributes(nextLink);

        expect(link).to.eq(nextLink);
        expect(notifier).to.have.been.calledWith(VALUE, REFINEMENT, FIELD);
      });

      it('should not call notifier with just field', () => {
        nextLink.dataset = { field: FIELD };

        const link = autocomplete.swapAttributes(nextLink);

        expect(link).to.eq(nextLink);
        expect(notifier).to.not.have.been.called;
      });
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
      const remove = sandbox.spy();
      autocomplete.links = () => <any[]>[
        { classList: { remove } },
        { classList: { remove } },
        { classList: { remove } }
      ];

      autocomplete.removeActiveClass();

      expect(remove).to.have.been.calledThrice;
      expect(remove).to.always.have.been.calledWith('active');
    });
  });

  describe('reset()', () => {
    it('should call resetSelected() and removeActiveClass()', () => {
      const resetSelected = sandbox.stub(autocomplete, 'resetSelected');
      const removeActiveClass = sandbox.stub(autocomplete, 'removeActiveClass');

      autocomplete.reset();

      expect(resetSelected).to.have.been.called;
      expect(removeActiveClass).to.have.been.called;
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

        expect(isSelectedInAutocomplete).to.have.been.called;
        expect(preventDefault).to.have.been.called;
        expect(emit).to.have.been.calledWith(AUTOCOMPLETE_HIDE_EVENT);
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
        expect(isSelectedInAutocomplete).to.have.been.called;
        expect(preventDefault).to.have.been.called;
        expect(linkAbove).to.have.been.called;
        expect(reset).to.have.been.called;
      });

      it('should select next link', () => {
        const link = { a: 'b' };
        const selectLink = sandbox.stub(autocomplete, 'selectLink');
        const linkAbove = sandbox.stub(autocomplete, 'linkAbove').returns(link);
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(true);

        autocomplete.keyboardListener(event, () => null);

        expect(isSelectedInAutocomplete).to.have.been.called;
        expect(preventDefault).to.have.been.called;
        expect(linkAbove).to.have.been.called;
        expect(selectLink).to.have.been.calledWith(link);
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
        expect(isSelectedInAutocomplete).to.have.been.called;
        expect(linkBelow).to.have.been.called;
        expect(selectLink).to.have.been.calledWith(link);
      });

      it('should select link below and not set preautocompleteValue', () => {
        const link = { a: 'b' };
        const linkBelow = sandbox.stub(autocomplete, 'linkBelow').returns(link);
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(true);
        const selectLink = sandbox.stub(autocomplete, 'selectLink');

        autocomplete.keyboardListener(event, () => null);

        expect(autocomplete.preautocompleteValue).to.be.undefined;
        expect(isSelectedInAutocomplete).to.have.been.called;
        expect(linkBelow).to.have.been.called;
        expect(selectLink).to.have.been.calledWith(link);
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

        expect(isSelectedInAutocomplete).to.have.been.called;
        expect(callback).to.have.been.called;
      });

      it('should select link below and not set preautocompleteValue', () => {
        const isSelectedInAutocomplete = sandbox.stub(autocomplete, 'isSelectedInAutocomplete')
          .returns(true);
        const reset = sandbox.stub(autocomplete, 'reset');
        const click = sandbox.spy();
        const querySelector = sinon.spy(() => ({ click }));
        autocomplete.selected = <any>{ querySelector };

        autocomplete.keyboardListener(event, () => null);

        expect(isSelectedInAutocomplete).to.have.been.called;
        expect(querySelector).to.have.been.calledWith('a');
        expect(click).to.have.been.called;
        expect(reset).to.have.been.called;
      });
    });

    describe('KEY_ESCAPE', () => {
      let event: KeyboardEvent;

      beforeEach(() => event = <any>{ keyCode: 27 });

      it('should emit autocomplete:hide', () => {
        const emit = sandbox.spy();
        autocomplete = new Autocomplete(<any>{ flux: { emit } });

        autocomplete.keyboardListener(event, () => null);

        expect(emit).to.have.been.calledWith(AUTOCOMPLETE_HIDE_EVENT);
      });
    });
  });
});
