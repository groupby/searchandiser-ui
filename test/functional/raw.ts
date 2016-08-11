import { expect } from 'chai';
import { createTag, removeTag } from '../utils/tags';
import { Raw } from '../../src/tags/raw/gb-raw';
import '../../src/tags/raw/gb-raw.tag';

const TAG = 'gb-raw';

describe(`${TAG} tag`, () => {
  let html: HTMLElement;
  const content = '<div>red sneakers</div>';

  beforeEach(() => html = createTag(TAG));
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector('div')).to.be.ok;
  });

  describe('render behaviour', () => {
    it('should not render content as html', () => {
      const tag = mount();

      expect(html.querySelector('div').textContent).to.eq('red sneakers');
    });
  });

  function mount() {
    return <Raw>riot.mount(TAG, { content })[0];
  }
});
