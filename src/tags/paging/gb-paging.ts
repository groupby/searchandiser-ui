import { FluxTag } from '../tag';
import { Events, Pager } from 'groupby-api';

export interface PagingConfig {
  limit?: number;
  pages?: boolean;
  numeric?: boolean;
  terminals?: boolean;
  labels?: boolean;
  icons?: boolean;

  prevLabel?: string;
  nextLabel?: string;
  firstLabel?: string;
  lastLabel?: string;

  prevIcon?: string;
  nextIcon?: string;
  firstIcon?: string;
  lastIcon?: string;
}

export const SCHEMA = {
  limit: { value: 5 },

  // TODO: should maybe allow array shorthand for multiple matches
  forwardDisabled: { value: false, for: 'gb-pager, gb-terminal-pager' },
  backDisabled: { value: true, for: 'gb-pager, gb-terminal-pager' },
  icons: { value: true, for: 'gb-pager, gb-terminal-pager' },
  labels: { value: true, for: 'gb-pager, gb-terminal-pager' },

  prevLabel: { value: 'Prev', for: 'gb-pager' },
  nextLabel: { value: 'Next', for: 'gb-pager' },
  prevIcon: { value: require('./arrow-left.png'), for: 'gb-pager' },
  nextIcon: { value: require('./arrow-right.png'), for: 'gb-pager' },

  finalPage: { value: 1, for: 'gb-terminal-pager' },
  firstLabel: { value: 'First', for: 'gb-terminal-pager' },
  lastLabel: { value: 'Last', for: 'gb-terminal-pager' },
  firstIcon: { value: require('./double-arrow-left.png'), for: 'gb-terminal-pager' },
  lastIcon: { value: require('./double-arrow-right.png'), for: 'gb-terminal-pager' },
  terminals: { value: true, for: 'gb-terminal-pager' },
  numeric: { value: false, for: 'gb-terminal-pager' },

  pages: { value: false, for: 'gb-pages' },
  lowOverflow: { value: true, for: 'gb-pages' },
  highOverflow: { value: true, for: 'gb-pages' },
  pageNumbers: { value: [], for: 'gb-pages' },

  currentPage: { value: 1, for: 'gb-page-number' }
};

export interface Paging extends FluxTag<PagingConfig> { }

export class Paging {

  init() {
    this.$schema(Object.assign(this.wrapPager(this.flux.page), SCHEMA));

    this.flux.on(Events.PAGE_CHANGED, this.updateCurrentPage);
    this.flux.on(Events.RESULTS, this.pageInfo);
  }

  pageInfo() {
    const pageNumbers = this.flux.page.pageNumbers(this.$internal.limit);
    const finalPage = this.flux.page.finalPage;
    const currentPage = this.flux.page.currentPage;
    this.updatePageInfo(pageNumbers, currentPage, finalPage);
  }

  updatePageInfo(pageNumbers: number[], currentPage: number, finalPage: number) {
    this.$update({
      pageNumbers,
      currentPage,
      finalPage,
      lowOverflow: pageNumbers[0] !== 1,
      highOverflow: pageNumbers[pageNumbers.length - 1] !== finalPage,
      backDisabled: currentPage === 1,
      forwardDisabled: currentPage === finalPage
    });
  }

  updateCurrentPage({ pageNumber: currentPage }: { pageNumber: number }) {
    this.$update({ currentPage });
  }

  wrapPager(pager: Pager): any {
    // tslint:disable:max-line-length
    return {
      prevPage: { value: () => !this.$internal.backDisabled && pager.prev().then(this.emitEvent), for: 'gb-pager' },
      nextPage: { value: () => !this.$internal.forwardDisabled && pager.next().then(this.emitEvent), for: 'gb-pager' },
      firstPage: { value: () => !this.$internal.backDisabled && pager.reset().then(this.emitEvent), for: 'gb-terminal-pager' },
      lastPage: { value: () => !this.$internal.forwardDisabled && pager.last().then(this.emitEvent), for: 'gb-terminal-pager' },
      switchPage: { value: ({ target }) => pager.switchPage(Number(target.text)).then(this.emitEvent), for: 'gb-page-number' }
    };
    // tslint:enable:max-line-length
  }

  emitEvent() {
    if (this.services.tracker) {
      this.services.tracker.search();
    }
  }
}
