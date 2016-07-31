import riot = require('riot');
import { FluxTag } from '../tag';
import { unless } from '../../utils';
import { Events } from 'groupby-api';

export interface Labeled {
  prev_label: string;
  next_label: string;
  first_label: string;
  last_label: string;
}

export interface Paging extends FluxTag, Labeled {
  parent: riot.Tag.Instance & Labeled & { style: Function };
}

export class Paging {

  limit: number;
  pages: boolean;
  numeric: boolean;
  terminals: boolean;
  icons: boolean;
  forwardDisabled: boolean;
  backDisabled: boolean;
  style: Function;

  pageNumbers: number[];
  currentPage: number;
  lastPage: number;
  lowOverflow: boolean;
  highOverflow: boolean;

  pager: {
    first: () => void;
    prev: () => void;
    next: () => void;
    last: () => void;
    jump: (number) => void;
  }

  init() {
    this.limit = unless(this.opts.limit, 5);
    this.style = unless(this.opts.style, this.parent.style);
    this.pages = unless(this.opts.pages, false);
    this.numeric = unless(this.opts.numeric, false);
    this.terminals = unless(this.opts.terminals, true);
    this.icons = unless(this.opts.icons, true);

    this.prev_label = this.parent ? this.parent.prev_label : this.opts.prev_label;
    this.next_label = this.parent ? this.parent.next_label : this.opts.next_label;
    this.first_label = this.parent ? this.parent.first_label : this.opts.first_label;
    this.last_label = this.parent ? this.parent.last_label : this.opts.last_label;

    this.pager = {
      first: () => !this.backDisabled && this.opts.flux.page.reset(),
      prev: () => !this.backDisabled && this.opts.flux.page.prev(),
      next: () => !this.forwardDisabled && this.opts.flux.page.next(),
      last: () => !this.forwardDisabled && this.opts.flux.page.last(),
      jump: (page) => this.opts.flux.page.jump(page)
    };

    this.opts.flux.on(Events.PAGE_CHANGED, this.updatePages);
    this.opts.flux.on(Events.RESULTS, this.updatePageDisplay);
  }

  updatePageDisplay() {
    const pageNumbers = this.opts.flux.page.pageNumbers(this.limit);
    const lastPage = this.opts.flux.page.finalPage + 1;
    this.update({
      pageNumbers,
      lowOverflow: pageNumbers[0] !== 1,
      highOverflow: pageNumbers[pageNumbers.length - 1] !== lastPage
    });
  }

  updatePages({ pageIndex, finalPage }) {
    this.update({
      currentPage: pageIndex + 1,
      lastPage: finalPage + 1,
      backDisabled: pageIndex === 0,
      forwardDisabled: pageIndex === finalPage
    });
  }
}
