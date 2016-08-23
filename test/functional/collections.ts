import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { Collections } from '../../src/tags/collections/gb-collections';
import '../../src/tags/collections/gb-collections.tag';

const TAG = 'gb-collections';

describe(`${TAG} tag`, () => {
  let html: HTMLElement,
    flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`gb-list.${TAG}`)).to.be.ok;
  });

  it('renders without collections', () => {
    mount();
    expect(html.querySelector('.gb-collection')).to.not.be.ok;
  });

  it('renders with collections', () => {
    const tag = mount();
    tag.collections = ['first', 'second', 'third'];
    tag.counts = { first: 344, second: 453, third: 314 };

    tag.update();
    expect(labels().length).to.eq(3);
    expect(labels()[1].textContent).to.eq('second');
    expect(counts()[1].textContent).to.eq('453');
  });

  it('renders with collection labels', () => {
    const tag = mount();
    tag.collections = ['first', 'second', 'third'];
    tag.labels = { first: '1', second: '2', third: '3' };

    tag.update();
    expect(labels().length).to.eq(3);
    expect(labels()[1].textContent).to.eq('2');
  });

  it('renders without collection counts', () => {
    const tag = mount();
    tag.fetchCounts = false;
    tag.collections = ['first', 'second', 'third'];

    tag.update();
    expect(counts().length).to.eq(0);
  });

  it('switches collection on click', () => {
    const collections = ['a', 'b', 'c'];
    const tag = mount();
    tag.collections = collections;

    flux.switchCollection = (collection): any => expect(collection).to.eq(collections[1]);

    tag.update();
    (<HTMLAnchorElement>html.querySelectorAll('.gb-collection')[1]).click();
  });

  function labels() {
    return <NodeListOf<HTMLSpanElement>>html.querySelectorAll('.gb-collection__name');
  }

  function counts() {
    return <NodeListOf<HTMLSpanElement>>html.querySelectorAll('gb-badge');
  }

  function mount(options: any[] = []) {
    return <Collections>riot.mount(TAG)[0];
  }
});
