import { Paging } from '../../src/tags/paging/gb-paging';
import suite, { BaseModel } from './_suite';
import { expect } from 'chai';

suite<Paging>('gb-paging', ({ html, mount, itMountsTag }) => {

  itMountsTag();

  it('renders nested components', () => {
    mount();

    expect(html().querySelector('gb-terminal-pager')).to.be.ok;
    expect(html().querySelector('gb-pager')).to.be.ok;
    expect(html().querySelector('gb-pages')).to.be.ok;
  });

  it('should render labels and icons', () => {
    const model = new Model(mount());

    expect(model.terminalSpan('first').textContent).to.eq('First');
    expect(model.terminalImage('first').src).to.contain('data:image/png');

    expect(model.terminalSpan('last').textContent).to.eq('Last');
    expect(model.terminalImage('last').src).to.contain('data:image/png');

    expect(model.pagerSpan('prev').textContent).to.eq('Prev');
    expect(model.pagerImage('prev').src).to.contain('data:image/png');

    expect(model.pagerSpan('next').textContent).to.eq('Next');
    expect(model.pagerImage('next').src).to.contain('data:image/png');
  });

  it('should not render terminal pager', () => {
    mount({ terminals: false });

    expect(html().querySelector('gb-terminal-pager')).to.be.ok;
    expect(html().querySelectorAll('.gb-terminal__link')).to.have.length(0);
  });

  it('should not render labels', () => {
    mount({ labels: false });

    expect(html().querySelectorAll('.gb-terminal__link span')).to.have.length(0);
    expect(html().querySelectorAll('.gb-pager__link span')).to.have.length(0);
  });

  it('should render alternate labels', () => {
    const next_label = 'next page!';
    const first_label = 'first page!';
    const model = new Model(mount({ next_label, first_label }));

    expect(model.terminalSpan('first').textContent).to.eq(first_label);
    expect(model.pagerSpan('next').textContent).to.eq(next_label);
  });

  it('should not render icons', () => {
    mount({ icons: false });

    expect(html().querySelectorAll('gb-icon')).to.have.length(0);
  });

  it('should render icons with classes', () => {
    const prev_icon = 'fa fa-backward';
    const last_icon = 'fa fa-double-forward';
    const model = new Model(mount({ prev_icon, last_icon }));

    expect(model.terminalImage('last')).to.not.be.ok;
    expect(model.terminalIcon('last').className).to.eq(last_icon);
    expect(model.pagerImage('prev')).to.not.be.ok;
    expect(model.pagerIcon('prev').className).to.eq(prev_icon);
  });

  it('should render icons with URLs', () => {
    const prev_icon = 'images/back.svg';
    const last_icon = 'images/end.svg';
    const model = new Model(mount({ prev_icon, last_icon }));

    expect(model.terminalIcon('last')).to.not.be.ok;
    expect(model.terminalImage('last').src).to.contain(last_icon);
    expect(model.pagerIcon('prev')).to.not.be.ok;
    expect(model.pagerImage('prev').src).to.contain(prev_icon);
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
      const model = new Model(tag);
      tag.update({ pager: { first: () => done() } });

      model.terminalLink('first').click();
    });

    it('should go to previous page', (done) => {
      const tag = mount();
      const model = new Model(tag);
      tag.update({ pager: { prev: () => done() } });

      model.pagerLink('prev').click();
    });

    it('should go to next page', (done) => {
      const tag = mount();
      const model = new Model(tag);
      tag.update({ pager: { next: () => done() } });

      model.pagerLink('next').click();
    });

    it('should go to last page', (done) => {
      const tag = mount();
      const model = new Model(tag);
      tag.update({ pager: { last: () => done() } });

      model.terminalLink('last').click();
    });
  });
});

class Model extends BaseModel<Paging> {
  terminalLink(link: 'last' | 'first') {
    return this.element(this.html, `.gb-terminal__link.${link}`);
  }

  terminalIcon(link: 'last' | 'first') {
    return this.element(this.terminalLink(link), 'i');
  }

  terminalSpan(link: 'last' | 'first') {
    return this.element(this.terminalLink(link), 'span');
  }

  terminalImage(link: 'last' | 'first') {
    return this.element<HTMLImageElement>(this.terminalLink(link), 'img');
  }

  pagerLink(link: 'prev' | 'next') {
    return this.element(this.html, `.gb-pager__link.${link}`);
  }

  pagerIcon(link: 'prev' | 'next') {
    return this.element(this.pagerLink(link), 'i');
  }

  pagerSpan(link: 'prev' | 'next') {
    return this.element(this.pagerLink(link), 'span');
  }

  pagerImage(link: 'prev' | 'next') {
    return this.element<HTMLImageElement>(this.pagerLink(link), 'img');
  }
}
