import { checkBooleanAttr } from '../../utils/common';
import { FluxTag } from '../tag';
import { Events } from 'groupby-api';

export interface PagingConfig {
  limit?: number;
  pages?: boolean;
  numeric?: boolean;
  terminals?: boolean;
  labels?: boolean;
  icons?: boolean;

  prevLabel?: string;
  nextLabel?: string;
  fistLabel?: string;
  lastLabel?: string;

  prevIcon?: string;
  nextIcon?: string;
  firstIcon?: string;
  lastIcon?: string;
}

export interface Paging extends FluxTag<any> { }

export class Paging {
  limit: number;
  pages: boolean;
  numeric: boolean;
  terminals: boolean;
  labels: boolean;
  icons: boolean;
  prevLabel: string;
  nextLabel: string;
  fistLabel: string;
  lastLabel: string;
  prevIcon: string;
  nextIcon: string;
  firstIcon: string;
  lastIcon: string;

  forwardDisabled: boolean;
  backDisabled: boolean;
  lowOverflow: boolean;
  highOverflow: boolean;
  currentPage: number;
  finalPage: number;
  pageNumbers: number[];

  init() {
    this.alias('pageable');

    this.limit = this.opts.limit || 5;
    this.pages = checkBooleanAttr('pages', this.opts);
    this.numeric = checkBooleanAttr('numeric', this.opts);
    this.terminals = checkBooleanAttr('terminals', this.opts, true);
    this.labels = checkBooleanAttr('labels', this.opts, true);
    this.icons = checkBooleanAttr('icons', this.opts, true);
    this.fistLabel = this.opts.fistLabel || 'First';
    this.prevLabel = this.opts.prevLabel || 'Prev';
    this.nextLabel = this.opts.nextLabel || 'Next';
    this.lastLabel = this.opts.lastLabel || 'Last';
    this.firstIcon = this.opts.firstIcon || require('./double-arrow-left.png');
    this.prevIcon = this.opts.prevIcon || require('./arrow-left.png');
    this.nextIcon = this.opts.nextIcon || require('./arrow-right.png');
    this.lastIcon = this.opts.lastIcon || require('./double-arrow-right.png');

    // default initial state
    this.backDisabled = true;
    this.currentPage = 1;

    this.flux.on(Events.PAGE_CHANGED, this.updateCurrentPage);
    this.flux.on(Events.RESULTS, this.pageInfo);
  }

  pageInfo() {
    const pageNumbers = this.flux.page.pageNumbers(this.limit);
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
