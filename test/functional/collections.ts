import { Collections } from '../../src/tags/collections/gb-collections';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

const SERVICES = {
  collections: {}
};

suite<Collections>('gb-collections', { services: SERVICES }, ({
  flux, mount, sandbox,
  itMountsTag
}) => {

  itMountsTag();

  describe('render', () => {
    it('renders as list by default', () => {
      const model = new Model(mount());

      expect(model.collectionList).to.be.ok;
      expect(model.collectionSelect).to.not.be.ok;
    });

    it('renders as dropdown when configured', () => {
      const tag = mount({ dropdown: true });
      const model = new Model(tag);

      expect(model.collectionList).to.not.be.ok;
      expect(model.collectionSelect).to.be.ok;
      expect(model.customSelect).to.be.ok;
      expect(model.optionList).to.be.ok;
    });

    it('does not render collections', () => {
      const tag = mount();

      expect(tag.root.querySelector('.gb-collection')).to.not.be.ok;
    });
  });

  describe('render with collections', () => {
    const OPTIONS = [
      { label: '1', value: 'first' },
      { label: '2', value: 'second' },
      { label: '3', value: 'third' }
    ];
    const COLLECTIONS = ['first', 'second', 'third'];
    const COUNTS = { first: 344, second: 453, third: 314 };
    const LABELS = { first: '1', second: '2', third: '3' };
    let tag: Collections;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
      tag.collections = COLLECTIONS;
    });

    it('renders collections as list', () => {
      tag.update();

      expect(tag.root.querySelector('gb-list')).to.be.ok;
      expect(tag.root.querySelector('gb-select')).to.not.be.ok;
      expect(tag.root.querySelector('gb-collection-item')).to.be.ok;
      expect(tag.root.querySelector('a.gb-collection')).to.be.ok;
    });

    it('renders collections as dropdown', () => {
      tag._config = <any>{ dropdown: true };
      tag.labels = LABELS;

      tag.update({ options: OPTIONS });

      expect(tag.root.querySelector('gb-list')).to.not.be.ok;
      expect(tag.root.querySelector('gb-select')).to.be.ok;
      expect(model.customSelect).to.be.ok;
      expect(model.optionList).to.be.ok;
      expect(tag.root.querySelector('gb-collection-dropdown-item a')).to.be.ok;
    });

    it('renders collection labels and counts', () => {
      tag.counts = COUNTS;

      tag.update();

      expect(model.labels).to.have.length(3);
      expect(model.labels[1].textContent).to.eq('second');
      expect(model.counts[1].textContent).to.eq('453');
    });

    it('renders collection labels', () => {
      tag.labels = LABELS;

      tag.update();

      expect(model.labels).to.have.length(3);
      expect(model.labels[1].textContent).to.eq('2');
    });

    it('renders without collection counts', () => {
      tag._config = <any>{ counts: false };

      tag.update();

      expect(model.counts).to.have.length(0);
    });

    describe('gb-collection-item', () => {
      it('switches collection on click', () => {
        const spy = sandbox().spy(tag, 'onselect');
        const stub = sandbox().stub(flux(), 'switchCollection');
        tag.update();

        (<HTMLAnchorElement>tag.root.querySelectorAll('.gb-collection')[1]).click();

        expect(spy.calledWith(COLLECTIONS[1])).to.be.true;
        expect(stub.calledWith(COLLECTIONS[1])).to.be.true;
      });
    });

    describe('gb-collection-dropdown-item', () => {
      it('switches dropdown collection on click', () => {
        tag._config = <any>{ dropdown: true };
        const stub = sandbox().stub(flux(), 'switchCollection');
        tag.update({ options: OPTIONS });

        (<HTMLAnchorElement>tag.root.querySelectorAll('gb-collection-dropdown-item a')[1]).click();

        expect(stub.calledWith(OPTIONS[1].value)).to.be.true;
      });
    });
  });
});

class Model extends BaseModel<Collections> {

  get customSelect() {
    return this.element(this.html, 'gb-custom-select');
  }

  get optionList() {
    return this.element(this.html, 'gb-option-list');
  }

  get collectionList() {
    return this.element(this.html, '.gb-collections');
  }

  get collectionSelect() {
    return this.element(this.html, 'gb-select');
  }

  get labels() {
    return this.list(this.html, '.gb-collection__name');
  }

  get counts() {
    return this.list(this.html, 'gb-badge');
  }
}
