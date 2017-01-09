import { checkBooleanAttr } from '../../utils/common';
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

export interface FluxPager {
  first: () => void;
  prev: () => void;
  next: () => void;
  last: () => void;
  switchPage: (page: number) => void;
}

export interface Paging extends FluxTag<any> { }

export class Paging {
  limit: number;
  pages: boolean;
  numeric: boolean;
  terminals: boolean;
  labels: boolean;
  icons: boolean;
  prev_label: string;
  next_label: string;
  first_label: string;
  last_label: string;
  prev_icon: string;
  next_icon: string;
  first_icon: string;
  last_icon: string;

  forwardDisabled: boolean;
  backDisabled: boolean;
  lowOverflow: boolean;
  highOverflow: boolean;
  currentPage: number;
  finalPage: number;
  pageNumbers: number[];
  pager: FluxPager;

  init() {
    this.alias('pageable');

    this.limit = this.opts.limit || 5;
    this.pages = checkBooleanAttr('pages', this.opts);
    this.numeric = checkBooleanAttr('numeric', this.opts);
    this.terminals = checkBooleanAttr('terminals', this.opts, true);
    this.labels = checkBooleanAttr('labels', this.opts, true);
    this.icons = checkBooleanAttr('icons', this.opts, true);
    this.first_label = this.opts.first_label || 'First';
    this.prev_label = this.opts.prev_label || 'Prev';
    this.next_label = this.opts.next_label || 'Next';
    this.last_label = this.opts.last_label || 'Last';
    this.first_icon = this.opts.first_icon || require('./double-arrow-left.png');
    this.prev_icon = this.opts.prev_icon || require('./arrow-left.png');
    this.next_icon = this.opts.next_icon || require('./arrow-right.png');
    this.last_icon = this.opts.last_icon || require('./double-arrow-right.png');

    // default initial state
    this.backDisabled = true;
    this.currentPage = 1;

    this.pager = this.wrapPager(this.flux.page);

    this.flux.on(Events.PAGE_CHANGED, this.updateCurrentPage);
    this.flux.on(Events.RESULTS, this.pageInfo);
  }

  pageInfo() {
    const pageNumbers = this.flux.page.pageNumbers(this._config.limit);
    const finalPage = this.flux.page.finalPage;
    const currentPage = this.flux.page.currentPage;
    this.updatePageInfo(pageNumbers, currentPage, finalPage);
  }

  updatePageInfo(pageNumbers: number[], currentPage: number, finalPage: number) {
    this.update({
      pageNumbers,
      currentPage,
      finalPage,
      lowOverflow: pageNumbers[0] !== 1,
      highOverflow: pageNumbers[pageNumbers.length - 1] !== finalPage,
      backDisabled: currentPage === 1,
      forwardDisabled: currentPage === finalPage
    });
  }

  updateCurrentPage({ pageNumber }: { pageNumber: number }) {
    this.update({ currentPage: pageNumber });
  }

  wrapPager(pager: Pager): any {
    return {
      first: () => !this.backDisabled && pager.reset().then(this.emitEvent),
      prev: () => !this.backDisabled && pager.prev().then(this.emitEvent),
      next: () => !this.forwardDisabled && pager.next().then(this.emitEvent),
      last: () => !this.forwardDisabled && pager.last().then(this.emitEvent),
      switchPage: (page) => pager.switchPage(page).then(this.emitEvent)
    };
  }

  firstPage() {
    if (!this.backDisabled) {
      this.flux.page.reset().then(this.emitEvent);
    }
  }

  prevPage() {
    if (!this.backDisabled) {
      this.flux.page.prev().then(this.emitEvent);
    }
  }

  nextPage() {
    if (!this.forwardDisabled) {
      this.flux.page.next().then(this.emitEvent);
    }
  }

  lastPage() {
    if (!this.forwardDisabled) {
      this.flux.page.last().then(this.emitEvent);
    }
  }

  switchPage({ target }: { target: HTMLAnchorElement }) {
    this.flux.page.switchPage(Number(target.text)).then(this.emitEvent);
  }

  emitEvent() {
    if (this.services.tracker) {
      this.services.tracker.search();
    }
  }
}
