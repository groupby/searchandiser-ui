import { FluxTag } from '../tag';
import { Events, Pager } from 'groupby-api';

export interface PagingConfig {
  limit?: number;
  pages?: boolean;
  numeric?: boolean;
  terminals?: boolean;
  labels?: boolean;
  icons?: boolean;

  prev_label?: string;
  next_label?: string;
  first_label?: string;
  last_label?: string;

  prev_icon?: string;
  next_icon?: string;
  first_icon?: string;
  last_icon?: string;
}

export const DEFAULT_CONFIG: PagingConfig = {
  limit: 5,
  pages: false,
  numeric: false,
  terminals: true,
  labels: true,
  icons: true,

  first_label: 'First',
  prev_label: 'Prev',
  next_label: 'Next',
  last_label: 'Last',

  first_icon: require('./double-arrow-left.png'),
  prev_icon: require('./arrow-left.png'),
  next_icon: require('./arrow-right.png'),
  last_icon: require('./double-arrow-right.png')
};

export interface FluxPager {
  first: () => void;
  prev: () => void;
  next: () => void;
  last: () => void;
  switchPage: (page: number) => void;
}

export interface Paging extends FluxTag<PagingConfig> { }

export class Paging {

  forwardDisabled: boolean;
  backDisabled: boolean;
  lowOverflow: boolean;
  highOverflow: boolean;
  currentPage: number;
  lastPage: number;
  pageNumbers: number[];
  pager: FluxPager;

  init() {
    this.configure(DEFAULT_CONFIG);

    // default initial state
    this.backDisabled = true;
    this.currentPage = 1;

    this.pager = this.wrapPager(this.flux.page);

    this.flux.on(Events.PAGE_CHANGED, this.updateCurrentPage);
    this.flux.on(Events.RESULTS, this.pageInfo);
  }

  pageInfo() {
    const pageNumbers = this.flux.page.pageNumbers(this._config.limit);
    const lastPage = this.flux.page.finalPage;
    const currentPage = this.flux.page.currentPage;
    this.updatePageInfo(pageNumbers, currentPage, lastPage);
  }

  updatePageInfo(pageNumbers: number[], currentPage: number, lastPage: number) {
    this.update({
      pageNumbers,
      currentPage,
      lastPage,
      lowOverflow: pageNumbers[0] !== 1,
      highOverflow: pageNumbers[pageNumbers.length - 1] !== lastPage,
      backDisabled: currentPage === 1,
      forwardDisabled: currentPage === lastPage
    });
  }

  updateCurrentPage({ pageNumber }: { pageNumber: number }) {
    this.update({ currentPage: pageNumber });
  }

  wrapPager(pager: Pager): any {
    return {
      first: () => !this.backDisabled && pager.reset(),
      prev: () => !this.backDisabled && pager.prev(),
      next: () => !this.forwardDisabled && pager.next(),
      last: () => !this.forwardDisabled && pager.last(),
      switchPage: (page) => pager.switchPage(page)
    };
  }
}
