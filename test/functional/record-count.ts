import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { RecordCount } from '../../src/tags/record-count/gb-record-count';
import '../../src/tags/record-count/gb-record-count.tag';

const TAG = 'gb-record-count';

describe(`${TAG} tag`, () => {
  let html: HTMLElement;

  beforeEach(() => {
    mixinFlux();
    html = createTag(TAG);
    const template = document.createElement('div');
    template.innerHTML = '{ first } - { last } of { total } Products';
    html.appendChild(template);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('div')).to.be.ok;
  });

  it('renders template', () => {
    const tag = mount();
    tag.updatePageInfo({
      pageInfo: {
        recordStart: 10,
        recordEnd: 40
      },
      totalRecordCount: 300
    });

    expect(tag.root.textContent).to.eq('10 - 40 of 300 Products');
  });

  function mount() {
    return <RecordCount>riot.mount(TAG)[0];
  }
});
