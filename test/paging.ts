/// <reference path="../typings/index.d.ts" />

import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mockFlux } from './fixtures';
import '../src/tags/paging/gb-paging.tag';

const TAG = 'gb-paging';

describe('gb-paging tag', () => {
  let html: Element;
  beforeEach(() => document.body.appendChild(html = document.createElement(TAG)));
  afterEach(() => document.body.removeChild(html));

  it('mounts tag', () => {
    const tag = mount();
    expect(tag).to.be.ok;
    expect(html.querySelector(`div.${TAG}`)).to.be.ok;
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
    expect(tag['firstPage']).to.be.ok;
    expect(tag['nextPage']).to.be.ok;
    expect(tag['prevPage']).to.be.ok;
    expect(tag['lastPage']).to.be.ok;
    expect(tag['isFirst']).to.be.ok;
    expect(tag['isLast']).to.be.ok;
  });

  it('should be able to page backward', () => {
    const tag = mount({ page: { hasPrevious: true } });
    expect(tag['isFirst']()).to.be.false;
    expect(pagingLink('first')).to.be.ok;
    expect(pagingLink('prev')).to.be.ok;
  });

  it('should not be able to page backward', () => {
    const tag = mount({ page: { hasPrevious: false } });
    expect(tag['isFirst']()).to.be.true;
    expect(pagingLink('first', true)).to.be.ok;
    expect(pagingLink('prev', true)).to.be.ok;
  });

  it('should be able to page forward', () => {
    const tag = mount({ page: { hasNext: true } });
    expect(tag['isLast']()).to.be.false;
    expect(pagingLink('last')).to.be.ok;
    expect(pagingLink('next')).to.be.ok;
  });

  it('should not be able to page forward', () => {
    const tag = mount({ page: { hasNext: false } });
    expect(tag['isLast']()).to.be.true;
    expect(pagingLink('last', true)).to.be.ok;
    expect(pagingLink('next', true)).to.be.ok;
  });

  it('should go to first page', (done) => {
    const tag = mount({
      page: {
        reset: () => done(),
        hasPrevious: true
      }
    });
    tag['firstPage']();
  });

  it('should go to previous page', (done) => {
    const tag = mount({
      page: {
        prev: () => done(),
        hasPrevious: true
      }
    });
    tag['prevPage']();
  });

  it('should go to last page', (done) => {
    const tag = mount({
      page: {
        last: () => done(),
        hasNext: true
      }
    });
    tag['lastPage']();
  });

  it('should go to next page', (done) => {
    const tag = mount({
      page: {
        next: () => done(),
        hasNext: true
      }
    });
    tag['nextPage']();
  });

  function pagingLink(action: string, disabled: boolean = false): HTMLAnchorElement {
    return <HTMLAnchorElement>html.querySelector(`.gb-paging__link.${action}${disabled ? '.disabled' : ':not(.disabled)'}`);
  }
});

function mount(options: any = {}): Riot.Tag.Instance {
  return riot.mount(TAG, { flux: mockFlux(options) })[0];
}
