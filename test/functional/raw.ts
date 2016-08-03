import { expect } from 'chai';
import { mockFlux } from '../fixtures';
import { Raw } from '../../src/tags/raw/gb-raw';
import '../../src/tags/raw/gb-raw.tag';

const TAG = 'gb-raw';

describe('gb-snippet tag', () => {
  let html: Element;
  const content = '<div>red sneakers</div>';
  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

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
