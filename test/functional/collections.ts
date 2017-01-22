import { Collections } from '../../src/tags/collections/gb-collections';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

const MIXIN = { services: { collections: { _config: {} } } };

suite<Collections>('gb-collections', MIXIN, ({
  flux, mount, spy, stub,
  itMountsTag
}) => {

  itMountsTag();

  describe('render', () => {
    it('renders as list by default', () => {
      const model = new Model(mount());

      expect(model.collectionList).to.be.ok;
      expect(model.select).to.not.be.ok;
    });

    it('renders as dropdown when configured', () => {
      const tag = mount({ dropdown: true });
      const model = new Model(tag);

      expect(model.collectionList).to.not.be.ok;
      expect(model.select).to.be.ok;
      expect(model.customSelect).to.be.ok;
      expect(model.selectList).to.be.ok;
    });

    it('does not render collections', () => {
      const model = new Model(mount());

      expect(model.collectionItems).to.have.length(0);
    });
  });

  describe('render with items', () => {
    const ITEMS = [
      { label: '1', value: 'first' },
      { label: '2', value: 'second' },
      { label: '3', value: 'third' }
    ];
    const COUNTS = { first: 344, second: 453, third: 314 };
    let tag: Collections;
    let model: Model;

    beforeEach(() => {
      tag = mount();
      model = new Model(tag);
      tag.update({ items: ITEMS });
    });

    it('renders collections as list', () => {
      expect(model.collectionList).to.be.ok;
      expect(model.select).to.not.be.ok;
      expect(tag.root.querySelector('gb-collection-item')).to.be.ok;
      expect(tag.root.querySelector('a.gb-collection')).to.be.ok;
    });

    it('renders collections as dropdown', () => {
      tag.update({ dropdown: true });

      expect(model.collectionList).to.not.be.ok;
      expect(model.select).to.be.ok;
      expect(model.customSelect).to.be.ok;
      expect(model.selectList).to.be.ok;
      expect(tag.root.querySelector('gb-collection-dropdown-item a')).to.be.ok;
    });

    it('renders collection labels and counts', () => {
      tag.update({ counts: COUNTS });

      expect(model.counts[1].textContent).to.eq('453');
    });

    it('renders collection labels', () => {
      expect(model.labels).to.have.length(3);
      expect(model.labels[1].textContent).to.eq('2');
    });

    it('renders without collection counts', () => {
      tag.update({ showCounts: false });

      expect(model.counts).to.have.length(0);
    });

    describe('gb-collection-item', () => {
      it('switches collection on click', () => {
        const onSelect = spy(tag, 'onSelect');

        (<HTMLAnchorElement>tag.root.querySelectorAll('.gb-collection')[1]).click();

        expect(onSelect).to.have.been.calledWith(ITEMS[1].value);
      });
    });

    describe('gb-collection-dropdown-item', () => {
      it('switches dropdown collection on click', () => {
        const switchCollection = stub(flux(), 'switchCollection');
        tag.update({ dropdown: true });

        (<HTMLAnchorElement>tag.root.querySelectorAll('gb-collection-dropdown-item a')[1]).click();

        expect(switchCollection).to.have.been.calledWith(ITEMS[1].value);
      });
    });
  });
});

class Model extends BaseModel<Collections> {

  get customSelect() {
    return this.element(this.html, 'gb-custom-select');
  }

  get selectList() {
    return this.element(this.customSelect, 'gb-list');
  }

  get collectionList() {
    return this.element(this.html, 'gb-list.gb-collections');
  }

  get collectionItems() {
    return this.list(this.collectionList, 'gb-collection');
  }

  get select() {
    return this.element(this.html, 'gb-select');
  }

  get labels() {
    return this.list(this.html, '.gb-collection__name');
  }

  get counts() {
    return this.list(this.html, 'gb-badge');
  }
}
