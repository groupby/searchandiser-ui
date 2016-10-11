import { Paging } from '../../src/tags/paging/gb-paging';
import suite from './_suite';
import { expect } from 'chai';

suite<Paging>('gb-paging', ({ html, mount }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('gb-terminal-pager')).to.be.ok;
    expect(html().querySelector('gb-pager')).to.be.ok;
    expect(html().querySelector('gb-pages')).to.be.ok;
  });

  it('should render labels and icons', () => {
    mount();

    expect(html().querySelector('.gb-terminal__link.first span').textContent).to.eq('First');
    expect((<HTMLImageElement>html().querySelector('.gb-terminal__link.first img')).src).to.contain('data:image/png');

    expect(html().querySelector('.gb-terminal__link.last span').textContent).to.eq('Last');
    expect((<HTMLImageElement>html().querySelector('.gb-terminal__link.last img')).src).to.contain('data:image/png');

    expect(html().querySelector('.gb-pager__link.prev span').textContent).to.eq('Prev');
    expect((<HTMLImageElement>html().querySelector('.gb-pager__link.prev img')).src).to.contain('data:image/png');

    expect(html().querySelector('.gb-pager__link.next span').textContent).to.eq('Next');
    expect((<HTMLImageElement>html().querySelector('.gb-pager__link.next img')).src).to.contain('data:image/png');
  });

  it('should not render terminal pager', () => {
    mount({ terminals: false });

    expect(html().querySelector('gb-terminal-pager')).to.be.ok;
    expect(html().querySelectorAll('.gb-terminal__link').length).to.eq(0);
  });

  it('should not render labels', () => {
    mount({ labels: false });

    expect(html().querySelectorAll('.gb-terminal__link span').length).to.eq(0);
    expect(html().querySelectorAll('.gb-pager__link span').length).to.eq(0);
  });

  it('should render alternate labels', () => {
    const next_label = 'next page!';
    const first_label = 'first page!';
    mount({ next_label, first_label });

    expect(html().querySelector('.gb-terminal__link.first span').textContent).to.eq(first_label);
    expect(html().querySelector('.gb-pager__link.next span').textContent).to.eq(next_label);
  });

  it('should not render icons', () => {
    mount({ icons: false });

    expect(html().querySelectorAll('gb-icon').length).to.eq(0);
  });

  it('should render icons with classes', () => {
    mount({ prev_icon: 'fa fa-backward', last_icon: 'fa fa-double-forward' });

    expect(html().querySelector('.gb-terminal__link.last img')).to.not.be.ok;
    expect(html().querySelector('.gb-terminal__link.last i').className).to.eq('fa fa-double-forward');
    expect(html().querySelector('.gb-pager__link.prev img')).to.not.be.ok;
    expect(html().querySelector('.gb-pager__link.prev i').className).to.eq('fa fa-backward');
  });

  it('should render icons with URLs', () => {
    const prev_icon = 'images/back.svg';
    const last_icon = 'images/end.svg';
    mount({ prev_icon, last_icon });

    expect(html().querySelector('.gb-terminal__link.last i')).to.not.be.ok;
    expect((<HTMLImageElement>html().querySelector('.gb-terminal__link.last img')).src).to.contain(last_icon);
    expect(html().querySelector('.gb-pager__link.prev i')).to.not.be.ok;
    expect((<HTMLImageElement>html().querySelector('.gb-pager__link.prev img')).src).to.contain(prev_icon);
  });

  describe('allowed paging behaviour', () => {
    it('should be able to page backward', () => {
      const tag = mount();

      tag.updatePageInfo([1, 2, 3, 4], 2, 6);
      expect(html().querySelector('.gb-pager__link.prev:not(.disabled)')).to.be.ok;
      expect(html().querySelector('.gb-terminal__link.first:not(.disabled)')).to.be.ok;
    });

    it('should not be able to page backward', () => {
      const tag = mount();

      tag.updatePageInfo([1, 2, 3, 4], 1, 6);
      expect(html().querySelector('.gb-pager__link.prev.disabled')).to.be.ok;
      expect(html().querySelector('.gb-terminal__link.first.disabled')).to.be.ok;
    });

    it('should be able to page forward', () => {
      const tag = mount();

      tag.updatePageInfo([1, 2, 3, 4], 1, 6);
      expect(html().querySelector('.gb-pager__link.next:not(.disabled)')).to.be.ok;
      expect(html().querySelector('.gb-terminal__link.last:not(.disabled)')).to.be.ok;
    });

    it('should not be able to page forward', () => {
      const tag = mount();

      tag.updatePageInfo([1, 2, 3, 4], 4, 4);
      expect(html().querySelector('.gb-pager__link.next.disabled')).to.be.ok;
      expect(html().querySelector('.gb-terminal__link.last.disabled')).to.be.ok;
    });
  });

  describe('paging actions behvaiour', () => {
    it('should go to first page', (done) => {
      const tag = mount();

      tag.update({
        backDisabled: false,
        pager: { first: () => done() }
      });
      (<HTMLAnchorElement>html().querySelector('.gb-terminal__link.first')).click();
    });

    it('should go to previous page', (done) => {
      const tag = mount();

      tag.update({
        backDisabled: false,
        pager: { prev: () => done() }
      });
      (<HTMLAnchorElement>html().querySelector('.gb-pager__link.prev')).click();
    });

    it('should go to next page', (done) => {
      const tag = mount();

      tag.update({
        forwardDisabled: false,
        pager: { next: () => done() }
      });
      (<HTMLAnchorElement>html().querySelector('.gb-pager__link.next')).click();
    });

    it('should go to last page', (done) => {
      const tag = mount();

      tag.update({
        forwardDisabled: false,
        pager: { last: () => done() }
      });
      (<HTMLAnchorElement>html().querySelector('.gb-terminal__link.last')).click();
    });
  });
});
