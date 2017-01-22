import { FluxTag, TagConfigure } from '../tag';
import { Events } from 'groupby-api';

export interface PagingOpts {
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

export const DEFAULTS = {
  limit: 5,
  terminals: true,
  labels: true,
  icons: true,
  firstLabel: 'First',
  nextLabel: 'Next',
  prevLabel: 'Prev',
  lastLabel: 'Last',
  firstIcon: require('./double-arrow-left.png'),
  nextIcon: require('./arrow-right.png'),
  prevIcon: require('./arrow-left.png'),
  lastIcon: require('./double-arrow-right.png')
};
export const TYPES = {
  pages: 'boolean',
  numeric: 'boolean',
  terminals: 'boolean',
  labels: 'boolean',
  icons: 'boolean'
};

export class Paging extends FluxTag<PagingOpts> {
  limit: number;
  pages: boolean;
  numeric: boolean;
  terminals: boolean;
  labels: boolean;
  icons: boolean;
  prevLabel: string;
  nextLabel: string;
  firstLabel: string;
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
    this.expose('paging');

    this.flux.on(Events.PAGE_CHANGED, this.updateCurrentPage);
    this.flux.on(Events.RESULTS, this.pageInfo);
  }

  onConfigure(configure: TagConfigure) {
    configure({ defaults: DEFAULTS, types: TYPES });

    // default initial state
    this.backDisabled = true;
    this.currentPage = 1;
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
