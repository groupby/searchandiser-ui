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
    expect(html.querySelector(`gb-select`)).to.be.ok;
  });

  it('should expose properties', () => {
    const tag = mount();
    expect(tag['label']).to.be.ok;
    expect(tag['clear']).to.be.ok;
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

  it('should be able to clear sort', (done) => {
    const tag = mount({
      query: {
        withoutSorts: (...sorts) => expect(sorts).to.eql([{ field: 'title', order: 'Descending' }, { field: 'title', order: 'Ascending' }])
      },
      search: () => done()
    });
    tag['updateSort']('*');
  });
});

function mount(options: any = {}, native: boolean = false): Riot.Tag.Instance {
  return riot.mount(TAG, { flux: mockFlux(options), native })[0];
}
