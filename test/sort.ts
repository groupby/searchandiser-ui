/// <reference path="../typings/index.d.ts" />

import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from './fixtures';
import '../src/tags/gb-sort.tag';

const TAG = 'gb-sort';

describe('gb-sort tag', () => {
  let html: Element;
  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();
    expect(tag).to.be.ok;
    expect(html.querySelector(`gb-select.${TAG}`)).to.be.ok;
  });

  it('should expose properties', () => {
    const tag = mount();
    expect(tag['sorts']).to.be.ok;
    expect(tag['updateSort']).to.be.ok;
  });

  it('should be able to sort results', (done) => {
    const tag = mount({
      sort: (value) => {
        expect(value).to.eql({ field: 'this', order: 'Ascending' });
        done();
      }
    });
    tag['updateSort']({ field: 'this', order: 'Ascending' });
  });
});

function mount(options: any = {}, native: boolean = false): Riot.Tag.Instance {
  return riot.mount(TAG, { flux: mockFlux(options), native })[0];
}
