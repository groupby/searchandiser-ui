import { FluxCapacitor, Events } from 'groupby-api';
import { Paging } from '../../src/tags/paging/gb-paging';
import { expect } from 'chai';

describe('gb-paging logic', () => {
  const struct = { title: 'title', price: 'price', image: 'image', url: 'url' };
  const allMeta = {
    title: 'Red Sneakers',
    price: '$12.45',
    image: 'image.png',
    id: '1340',
    nested: {
      value: '6532'
    }
  };
  let paging: Paging;
  let flux: FluxCapacitor;
  beforeEach(() => {
    paging = Object.assign(new Paging(), { opts: { flux: flux = new FluxCapacitor('') }, parent: { struct, allMeta } });
  });

  it('should inherit values from parent', () => {
    paging.init();

    expect(paging.limit).to.eq(5);
    expect(paging.pages).to.be.false;
    expect(paging.numeric).to.be.false;
    expect(paging.terminals).to.be.true;
    expect(paging.icons).to.be.true;

    expect(paging.pager).to.be.ok;
    expect(paging.pager).to.have.all.keys('first', 'last', 'next', 'last', 'jump');

    expect(paging.style).to.not.be.ok;
    expect(paging.prev_label).to.not.be.ok;
    expect(paging.next_label).to.not.be.ok;
    expect(paging.first_label).to.not.be.ok;
    expect(paging.last_label).to.not.be.ok;
  });

  it('should allow override from opts', () => {
    const overrides = {
      limit: 7,
      pages: true,
      numeric: true,
      terminals: false,
      icons: false,
      style: () => null,
      prev_label: 'back',
      next_label: 'forward',
      first_label: 'beginning',
      last_label: 'end'
    };
    Object.assign(paging.opts, overrides);
    paging.init();

    expect(paging.limit).to.eq(overrides.limit);
    expect(paging.pages).to.be.true;
    expect(paging.numeric).to.be.true;
    expect(paging.terminals).to.be.false;
    expect(paging.icons).to.be.false;
    expect(paging.style).to.eq(overrides.style);
    expect(paging.prev_label).to.eq(overrides.prev_label);
    expect(paging.next_label).to.eq(overrides.next_label);
    expect(paging.first_label).to.eq(overrides.first_label);
    expect(paging.last_label).to.eq(overrides.last_label);
  });

  it('should fall back to parent', () => {
    const overrides = {
      style: () => null,
      prev_label: 'back',
      next_label: 'forward',
      first_label: 'beginning',
      last_label: 'end'
    };
    Object.assign(paging.parent, overrides);
    paging.init();

    expect(paging.style).to.eq(overrides.style);
    expect(paging.prev_label).to.eq(overrides.prev_label);
    expect(paging.next_label).to.eq(overrides.next_label);
    expect(paging.first_label).to.eq(overrides.first_label);
    expect(paging.last_label).to.eq(overrides.last_label);
  });

  it('should listen for events', () => {
    flux.on = (event: string): any => expect(event).to.be.oneOf([Events.RESULTS, Events.PAGE_CHANGED]);

    paging.init();
  });

  it('should update page position', (done) => {
    const pageNumbers = [1, 2, 3, 4, 5];
    const pager = {
      pageNumbers: (limit) => {
        expect(limit).to.eq(5);
        return pageNumbers;
      },
      finalPage: 16
    };

    Object.defineProperty(flux, 'page', { get: () => pager });

    paging.pageInfo = (pages, last): any => {
      expect(pages).to.eq(pageNumbers);
      expect(last).to.eq(17);
      done();
    };
    paging.init();

    paging.updatePageInfo();
  });

  it('should update page info', () => {
    paging.update = (obj: any) => {
      expect(obj.currentPage).to.eq(14);
      expect(obj.lastPage).to.eq(44);
      expect(obj.backDisabled).to.be.false;
      expect(obj.forwardDisabled).to.be.false;
    };
    paging.init();

    paging.updatePages({ pageIndex: 13, finalPage: 43 });
  });

  it('should generate page info', () => {
    const pageNumbers = [4, 5, 6, 7, 8];

    paging.init();

    const pageInfo = paging.pageInfo(pageNumbers, 14);
    expect(pageInfo.pageNumbers).to.eq(pageNumbers);
    expect(pageInfo.lowOverflow).to.be.true;
    expect(pageInfo.highOverflow).to.be.true;

    expect(paging.pageInfo([1], 2).lowOverflow).to.be.false;
    expect(paging.pageInfo([4, 5, 6], 6).highOverflow).to.be.false;
  });

  describe('page transition behaviour', () => {
    it('should not allow page forward', () => {
      const pager = {
        next: () => expect.fail(),
        last: () => expect.fail()
      };
      Object.defineProperty(flux, 'page', { get: () => pager });

      paging.init();
      paging.forwardDisabled = true;

      paging.pager.next();
      paging.pager.last();
    });
  });
});
