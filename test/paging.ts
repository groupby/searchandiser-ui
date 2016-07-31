/// <reference path="../typings/index.d.ts" />

import riot = require('riot');
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
        expect(event).to.eq(Events.PAGE_CHANGED);
        done();
      }
    });
  });

  it('should expose functions and properties', () => {
    const rawTag: Element = raw(mount());
    expect(rawTag['pager']).to.be.ok;
    expect(rawTag['pager']['first']).to.be.ok;
    expect(rawTag['pager']['prev']).to.be.ok;
    expect(rawTag['pager']['next']).to.be.ok;
    expect(rawTag['pager']['last']).to.be.ok;
    expect(rawTag['pager']['jump']).to.be.ok;

    expect(rawTag['terminals']).to.be.true;
    expect(rawTag['icons']).to.be.true;
    expect(rawTag['pages']).to.be.false;
  });

  it('should expose more properties on update', (done) => {
    const tag = mount({
      page: {
        pageNumbers: (limit) => {
          expect(limit).to.eq(5);
          return [2, 3, 4, 5, 6];
        }
      },
      on: (event, cb) => cb({
        pageIndex: 3,
        finalPage: 7
      })
    });
    tag.on('updated', () => {
      const rawTag = (<Element>tag.root).querySelector('gb-raw-paging')['_tag'];
      expect(rawTag.pageNumbers).to.eql([2, 3, 4, 5, 6]);
      expect(rawTag.currentPage).to.eq(4);
      expect(rawTag.lastPage).to.eq(8);
      expect(rawTag.lowOverflow).to.be.true;
      expect(rawTag.highOverflow).to.be.true;
      expect(rawTag.backDisabled).to.be.false;
      expect(rawTag.forwardDisabled).to.be.false;
      done();
    });
  });

  describe('allowed paging behvaiour', () => {
    function mountPaging(pageIndex: number, finalPage?: number): Element & any {
      return mount({
        page: { pageNumbers: () => [] },
        on: (event, cb) => cb({ pageIndex, finalPage })
      });
    }

    it('should be able to page backward', (done) => {
      const tag = mountPaging(1);
      tag.on('updated', () => {
        expect(raw(tag).backDisabled).to.be.false;
        done();
      });
    });

    it('should not be able to page backward', (done) => {
      const tag = mountPaging(0);
      tag.on('updated', () => {
        expect(raw(tag).backDisabled).to.be.true;
        done();
      });
    });

    it('should be able to page forward', (done) => {
      const tag = mountPaging(7, 8);
      tag.on('updated', () => {
        expect(raw(tag).forwardDisabled).to.be.false;
        done();
      });
    });

    it('should not be able to page forward', (done) => {
      const tag = mountPaging(8, 8);
      tag.on('updated', () => {
        expect(raw(tag).forwardDisabled).to.be.true;
        done();
      });
    });
  });

  describe('paging actions behvaiour', () => {
    function mountPaging(action: string, done): Element & any {
      const tag = mount({
        page: {
          pageNumbers: () => [],
          [action]: () => done()
        },
        on: (event, cb) => cb({ pageIndex: 1, finalPage: 7 })
      });
      return raw(tag);
    }

    it('should go to first page', (done) => {
      const rawTag = mountPaging('reset', done);
      rawTag.pager.first();
    });

    it('should go to previous page', (done) => {
      const rawTag = mountPaging('prev', done);
      rawTag.pager.prev();
    });

    it('should go to next page', (done) => {
      const rawTag = mountPaging('next', done);
      rawTag.pager.next();
    });

    it('should go to last page', (done) => {
      const rawTag = mountPaging('last', done);
      rawTag.pager.last();
    });
  });

  function raw(tag): any {
    return tag.root.querySelector('gb-raw-paging')._tag;
  }
});

function mount(options: any = {}) {
  return riot.mount(TAG, { flux: mockFlux(options) })[0];
}
