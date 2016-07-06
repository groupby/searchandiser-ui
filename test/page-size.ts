/// <reference path="../typings/index.d.ts" />

import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from './fixtures';
import '../src/tags/gb-select.tag';
import '../src/tags/gb-page-size.tag';

const TAG = 'gb-page-size';

describe('gb-page-size tag', () => {
  let html: Element;
  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();
    expect(tag).to.be.ok;
    expect(html.querySelector(`gb-select.${TAG}`)).to.be.ok;
    expect(html.querySelectorAll('option').length).to.eq(4);
  });

  it('should expose functions', () => {
    const tag = mount();
    expect(tag['updatePageSize']).to.be.ok;
  });

  it('should have default options', () => {
    mount();
    const select = selectElement();
    expect(select.options.length).to.eq(4);
    expect(select.options[0].value).to.eq('10');
    expect(select.options[1].value).to.eq('25');
    expect(select.options[2].value).to.eq('50');
    expect(select.options[3].value).to.eq('100');
  });

  it('should accept override options', () => {
    mount({}, { config: { pageSizes: [8, 16, 30, 60, 100] } });
    const select = selectElement();
    expect(select.options.length).to.eq(5);
    expect(select.options[0].value).to.eq('8');
    expect(select.options[1].value).to.eq('16');
    expect(select.options[2].value).to.eq('30');
    expect(select.options[3].value).to.eq('60');
    expect(select.options[4].value).to.eq('100');
  });

  it('should not reset paging by default', (done) => {
    const tag = mount({
      resize: (newSize, reset) => {
        expect(newSize).to.eq(50);
        expect(reset).to.be.undefined;
        done();
      }
    });
    selectIndex(2);
  });

  it('should allow reset paging', (done) => {
    const tag = mount({
      resize: (newSize, reset) => {
        expect(reset).to.eq(0);
        done();
      }
    }, { resetOffset: true });
    selectIndex(1);
  });

  function selectIndex(index: number) {
    const select = selectElement();
    select.selectedIndex = index;
    select.dispatchEvent(new Event('change'));
  }

  function selectElement(): HTMLSelectElement {
    return <HTMLSelectElement>html.querySelector('select');
  }
});

function mount(options: any = {}, additional: any = {}, native: boolean = true): Riot.Tag.Instance {
  return riot.mount(TAG, Object.assign({ flux: mockFlux(options), config: {}, native }, additional))[0];
}
