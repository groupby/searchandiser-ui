/// <reference path="../typings/index.d.ts" />

import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from './fixtures';
import '../src/tags/gb-record-count.tag';

const TAG = 'gb-record-count';

describe('gb-record-count tag', () => {
  let html: Element;
  beforeEach(() => {
    document.body.appendChild(html = document.createElement(TAG));
    const template = document.createElement('h1');
    html.appendChild(template);
    template.innerHTML = '{ first } - { last } of { total }';
  });
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();
    expect(tag).to.be.ok;
    expect(html.querySelector('h1')).to.be.ok;
  });

  it('should register for results', (done) => {
    mount({
      on: (event) => {
        expect(event).to.eq(Events.RESULTS);
        done();
      }
    });
  });

  it('should update the provided template', (done) => {
    mount({
      on: (event, cb) => cb({
        pageInfo: {
          recordStart: 4,
          recordEnd: 19
        },
        totalRecordCount: 408
      })
    }).on('updated', () => {
      expect(html.querySelector('h1').textContent).to.eq('4 - 19 of 408');
      done();
    });
  });
});

function mount(options: any = {}): Riot.Tag.Instance {
  return riot.mount(TAG, { flux: mockFlux(options) })[0];
}
