/// <reference path="../typings/index.d.ts" />

import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from './fixtures';
import '../src/tags/gb-did-you-mean.tag';

const TAG = 'gb-did-you-mean';

describe('gb-did-you-mean tag', () => {
  let html: Element;
  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();
    expect(tag).to.be.ok;
    expect(html.querySelector(`ul.${TAG}`)).to.be.ok;
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
    expect(tag['send']).to.be.ok;
  });

  it('renders from results', (done) => {
    const flux = mockFlux({
      on: (event, cb) => cb({ didYouMean: ['first', 'second', 'third'] })
    });
    const [tag] = riot.mount(TAG, { flux });
    tag.on('updated', () => {
      expect(dymLinks().length).to.eq(3);
      expect(dymLinks()[0].textContent).to.eq('first');
      done();
    });
  });

  it('rewrites on option selected', (done) => {
    const flux = mockFlux({
      on: (event, cb) => cb({ didYouMean: ['first', 'second', 'third'] }),
      rewrite: (query) => {
        expect(query).to.eq('second');
        done();
      }
    });
    const [tag] = riot.mount(TAG, { flux });
    tag.on('updated', () => dymLinks()[1].dispatchEvent(new Event('click')));
  });

  function dymLinks(): NodeListOf<HTMLAnchorElement> {
    return <NodeListOf<HTMLAnchorElement>>html.querySelectorAll('li > a');
  }
});

function mount(options: any = {}): Riot.Tag.Instance {
  return riot.mount(TAG, { flux: mockFlux(options) })[0];
}
