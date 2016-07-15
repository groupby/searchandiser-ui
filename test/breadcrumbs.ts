/// <reference path="../typings/index.d.ts" />

import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from './fixtures';
import '../src/tags/breadcrumbs/gb-breadcrumbs.tag';

const TAG = 'gb-breadcrumbs';

describe('gb-breadcrumbs tag', () => {
  let html: Element;
  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();
    expect(tag).to.be.ok;
    expect(html.querySelector(`ul.${TAG}`)).to.be.ok;
  });

  it('should register for reset and refinements_changed', (done) => {
    let count = 0;
    mount({
      on: (event) => {
        expect(event).to.be.oneOf([Events.REFINEMENTS_CHANGED, Events.RESET, Events.RESULTS]);
        if (++count === 3) done();
      }
    });
  });

  describe('with refinements', () => {
    let selected = [
      {
        name: 'first',
        displayName: 'First',
        refinements: [
          { type: 'Value', value: 'A' },
          { type: 'Value', value: 'B' },
          { type: 'Value', value: 'C' }
        ]
      }
    ];

    it('renders from refinements changing', (done) => {
      const flux = mockFlux({
        on: (event, cb) => {
          switch (event) {
            case Events.REFINEMENTS_CHANGED:
              return cb({ selected });
          }
        }
      });

      const [tag] = riot.mount(TAG, { flux });
      tag.on('updated', () => {
        expect(tag['selected'].length).to.eq(1);
        expect(html.querySelectorAll('.gb-nav-crumb').length).to.eq(1);
        expect(html.querySelectorAll('.gb-nav-crumb gb-refinement-crumb').length).to.eq(3);
        done();
      });
    });

    it('renders from reset', (done) => {
      const flux = mockFlux({
        on: (event, cb) => {
          switch (event) {
            case Events.RESET:
              return cb();
          }
        }
      });

      const [tag] = riot.mount(TAG, { flux });
      tag.on('updated', () => {
        expect(tag['selected'].length).to.eq(0);
        expect(html.querySelectorAll('.gb-nav-crumb').length).to.eq(0);
        done();
      });
    });
  });
});

function mount(options: any = {}): Riot.Tag.Instance {
  return riot.mount(TAG, { flux: mockFlux(options) })[0];
}
