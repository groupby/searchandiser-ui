import { Collections } from '../../src/tags/collections/gb-collections';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

const SERVICES = {
  collections: {}
};

suite<Collections>('gb-collections', { services: SERVICES }, ({ flux, html, mount, sandbox }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
  });

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
    expect(html().querySelector('gb-custom-select')).to.be.ok;
    expect(html().querySelector('gb-option-list')).to.be.ok;
  });

  it('renders without collections', () => {
    mount();

    expect(html().querySelector('.gb-collection')).to.not.be.ok;
  });

  it('renders with collections', () => {
    const tag = mount();
    const model = new Model(tag);
    tag.collections = ['first', 'second', 'third'];
    tag.counts = { first: 344, second: 453, third: 314 };

    tag.update();

    expect(model.labels).to.have.length(3);
    expect(model.labels[1].textContent).to.eq('second');
    expect(model.counts[1].textContent).to.eq('453');
  });

  it('renders with collection labels', () => {
    const tag = mount();
    const model = new Model(tag);
    tag.collections = ['first', 'second', 'third'];
    tag.labels = { first: '1', second: '2', third: '3' };

    tag.update();

    expect(model.labels).to.have.length(3);
    expect(model.labels[1].textContent).to.eq('2');
  });

  it('renders without collection counts', () => {
    const tag = mount();
    const model = new Model(tag);
    tag._config = <any>{ counts: false };
    tag.collections = ['first', 'second', 'third'];

    tag.update();

    expect(model.counts).to.have.length(0);
  });

  it('renders as list with collection', () => {
    const collections = ['a', 'b', 'c'];
    const tag = mount();

    tag.update({ collections });

    expect(html().querySelector('gb-list')).to.be.ok;
    expect(html().querySelector('gb-select')).to.not.be.ok;
    expect(html().querySelector('gb-collection-item')).to.be.ok;
    expect(html().querySelector('a.gb-collection')).to.be.ok;
  });

  it('renders as dropdown with collection', () => {
    const options = [{ label: 'a', value: 'b' }, { label: 'c', value: 'd' }];
    const collections = ['b', 'd'];
    const labels = ['a', 'c'];
    const tag = mount();
    tag._config = <any>{ dropdown: true };

    tag.update({ options, collections, labels });

    expect(html().querySelector('gb-list')).to.not.be.ok;
    expect(html().querySelector('gb-select')).to.be.ok;
    expect(html().querySelector('gb-custom-select')).to.be.ok;
    expect(html().querySelector('gb-option-list')).to.be.ok;
    expect(html().querySelector('gb-collection-dropdown-item a')).to.be.ok;
  });

  it('switches collection on click', () => {
    const collections = ['a', 'b', 'c'];
    const tag = mount();
    tag.collections = collections;
    const spy = sandbox().spy(tag, 'onselect');
    flux().switchCollection = (collection): any => expect(collection).to.eq(collections[1]);

    tag.update();

    (<HTMLAnchorElement>html().querySelectorAll('.gb-collection')[1]).click();
    expect(spy.calledWith(collections[1])).to.be.true;
  });

  it('switches dropdown collection on click', () => {
    const collections = ['b', 'd'];
    const options = [{ label: 'a', value: 'b' }, { label: 'c', value: 'd' }];
    const tag = mount();
    tag._config = <any>{ dropdown: true };
    flux().switchCollection = (collection): any => {
      expect(collection).to.eq(options[1].value);
    };

    tag.update({ options, collections });

    (<HTMLAnchorElement>html().querySelectorAll('gb-collection-dropdown-item a')[1]).click();
  });
});

class Model extends BaseModel<Collections> {

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
