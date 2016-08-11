import { FluxCapacitor, Events, Results } from 'groupby-api';
import { expect } from 'chai';
import { mixinFlux, createTag, removeTag } from '../utils/tags';
import { findTag } from '../../src/utils';
import { Paging } from '../../src/tags/paging/gb-paging';
import '../../src/tags/paging/gb-paging.tag';

const TAG = 'gb-paging';

describe(`${TAG} tag`, () => {
  let html: HTMLElement,
    flux: FluxCapacitor;

  beforeEach(() => {
    flux = mixinFlux();
    html = createTag(TAG);
  });
  afterEach(() => removeTag(html));

  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html.querySelector(`div.${TAG}`)).to.be.ok;
    expect(html.querySelector('gb-raw-paging')).to.be.ok;
    expect(html.querySelector('gb-terminal-pager')).to.be.ok;
    expect(html.querySelector('gb-pager')).to.be.ok;
    expect(html.querySelector('gb-pages')).to.be.ok;
  });

  describe('allowed paging behvaiour', () => {
    it('should be able to page backward', () => {
      const tag = mount(),
        rawTag = tag.tags['gb-raw-paging'];

      rawTag.updatePages({ pageIndex: 2, finalPage: 4 });
      expect(html.querySelector('.gb-pager__link.prev:not(.disabled)')).to.be.ok;
      expect(html.querySelector('.gb-terminal__link.first:not(.disabled)')).to.be.ok;
    });

    it('should not be able to page backward', () => {
      const tag = mount(),
        rawTag = tag.tags['gb-raw-paging'];

      rawTag.updatePages({ pageIndex: 0, finalPage: 4 });
      expect(html.querySelector('.gb-pager__link.prev.disabled')).to.be.ok;
      expect(html.querySelector('.gb-terminal__link.first.disabled')).to.be.ok;
    });

    it('should be able to page forward', () => {
      const tag = mount(),
        rawTag = tag.tags['gb-raw-paging'];

      rawTag.updatePages({ pageIndex: 0, finalPage: 4 });
      expect(html.querySelector('.gb-pager__link.next:not(.disabled)')).to.be.ok;
      expect(html.querySelector('.gb-terminal__link.last:not(.disabled)')).to.be.ok;
    });

    it('should not be able to page forward', () => {
      const tag = mount(),
        rawTag = tag.tags['gb-raw-paging'];

      rawTag.updatePages({ pageIndex: 4, finalPage: 4 });
      expect(html.querySelector('.gb-pager__link.next.disabled')).to.be.ok;
      expect(html.querySelector('.gb-terminal__link.last.disabled')).to.be.ok;
    });
  });

  describe('paging actions behvaiour', () => {
    // function mountPaging(action: string, done): Element & any {
    //   const tag = mount({
    //     page: {
    //       pageNumbers: () => [],
    //       [action]: () => done()
    //     },
    //     on: (event, cb) => cb({ pageIndex: 1, finalPage: 7 })
    //   });
    //   return raw(tag);
    // }

    it('should go to first page', (done) => {
      const tag = mount(),
        rawTag: Paging = tag.tags['gb-raw-paging'];

      rawTag.update({
        backDisabled: false,
        pager: { first: () => done() }
      });
      (<HTMLAnchorElement>html.querySelector('.gb-terminal__link.first')).click();
    });

    it('should go to previous page', (done) => {
      const tag = mount(),
        rawTag = tag.tags['gb-raw-paging'];

      rawTag.update({
        backDisabled: false,
        pager: { prev: () => done() }
      });
      (<HTMLAnchorElement>html.querySelector('.gb-pager__link.prev')).click();
    });

    it('should go to next page', (done) => {
      const tag = mount(),
        rawTag = tag.tags['gb-raw-paging'];

      rawTag.update({
        forwardDisabled: false,
        pager: { next: () => done() }
      });
      (<HTMLAnchorElement>html.querySelector('.gb-pager__link.next')).click();
    });

    it('should go to last page', (done) => {
      const tag = mount(),
        rawTag = tag.tags['gb-raw-paging'];

      rawTag.update({
        forwardDisabled: false,
        pager: { last: () => done() }
      });
      (<HTMLAnchorElement>html.querySelector('.gb-terminal__link.last')).click();
    });
  });

  function dymLinks(): NodeListOf<HTMLAnchorElement> {
    return <NodeListOf<HTMLAnchorElement>>html.querySelectorAll('li > a');
  }

  function mount() {
    return <Paging>riot.mount(TAG)[0];
  }
});
