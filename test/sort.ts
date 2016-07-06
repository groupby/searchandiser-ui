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
    expect(html.querySelector(`select.${TAG}`)).to.be.ok;
  });

  it('should register for results', (done) => {
    mount({
      on: (event) => {
        expect(event).to.eq(Events.RESULTS);
        done();
      }
    });
  });

  it('should expose functions', () => {
    const tag = mount();
    expect(tag['updateSort']).to.be.ok;
  });

  it('should be able to sort results', (done) => {
    const tag = mount({
      sort: (value) => {
        expect(value).to.eql({ field: 'this', order: 'Ascending' });
        done();
      }
    });
    tag['updateSort']({ target: { value: JSON.stringify({ field: 'this', order: 'Ascending' }) } });
  });

  it('should be able to clear sort', (done) => {
    const tag = mount({
      query: {
        withoutSorts: (...sorts) => expect(sorts).to.eql([{ field: 'title', order: 'Descending' }, { field: 'title', order: 'Ascending' }])
      },
      search: () => done()
    });
    tag['updateSort']({ target: { value: '*' } });
  });
});

function mount(options: any = {}): Riot.Tag.Instance {
  return riot.mount(TAG, { flux: mockFlux(options) })[0];
}
