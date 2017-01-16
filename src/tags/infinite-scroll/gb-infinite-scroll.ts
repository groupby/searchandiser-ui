import { WINDOW } from '../../utils/common';
import { FluxTag, TagConfigure } from '../tag';
import { Renderer } from './renderer';
import { Events, Record } from 'groupby-api';
import * as riot from 'riot';

export const MIN_REQUEST_SIZE = 25;
export const MAX_REQUEST_SIZE = 120;

export interface InfiniteScrollConfig {
  maxRecords?: number;
}

export const DEFAULTS = {
  maxRecords: 500
};

export class InfiniteScroll extends FluxTag<InfiniteScrollConfig>  {
  refs: {
    scroller: HTMLUListElement;
    runway: HTMLElement;
  };

  maxRecords: number;

  tombstoneLayout: { height: number; width: number; };
  items: ScrollItem[];
  loadedItems: number;
  updating: boolean;
  oldScroll: number;

  // must be kept here to preserve state
  runwayEnd: number;
  anchor: ScrollAnchor;
  anchorScrollTop: number;

  init() {
    WINDOW.addEventListener('resize', this.onResize);
    this.flux.on(Events.QUERY_CHANGED, this.reset);
    this.flux.on(Events.REFINEMENTS_CHANGED, this.reset);
    this.flux.on(Events.SORT, this.reset);
    this.flux.on(Events.COLLECTION_CHANGED, this.reset);
    this.on('mount', this.onMount);
  }

  onConfigure(configure: TagConfigure) {
    configure({ defaults: DEFAULTS });

    this.items = [];
    this.loadedItems = 0;
    this.runwayEnd = 0;
  }

  onMount() {
    this.refs.scroller.addEventListener('scroll', this.onScroll);
    this.onResize();
  }

  reset() {
    this.items = [];
    this.loadedItems = 0;
    this.runwayEnd = 0;
    this.anchorScrollTop = 0;
    this.oldScroll = 0;
    while (this.refs.scroller.hasChildNodes()) {
      this.refs.scroller.removeChild(this.refs.scroller.lastChild);
    }
    this.attachRenderer();
  }

  onScroll() {
    if (this.oldScroll !== this.refs.scroller.scrollTop) {
      this.attachRenderer();
    }
    this.oldScroll = this.refs.scroller.scrollTop;
  }

  attachRenderer() {
    new Renderer(this).attachToView();
  }

  onResize() {
    const tombstone = Renderer.createTombstone(this.config.structure);
    this.refs.scroller.appendChild(tombstone);
    this.tombstoneLayout = {
      height: tombstone.offsetHeight,
      width: tombstone.offsetWidth
    };
    tombstone._tag.unmount();
    this.items.forEach((item) => item.height = item.width = 0);
    this.attachRenderer();
  }

  capRecords(items: number) {
    if (this.flux.results) {
      return Math.min(items, this.flux.results.totalRecordCount);
    } else {
      return items;
    }
  }

  maybeRequestContent(renderer: Renderer) {
    const itemsNeeded = this.capRecords(renderer.lastItem) - this.loadedItems;
    if (itemsNeeded <= 0) { return; }

    if (this.updating) { return; }
    this.updating = true;

    this.fetch(itemsNeeded)
      .then((records) => this.updateItems(records, renderer));
  }

  fetch(count: number): Promise<Record[]> {
    const request = this.flux.query.build();
    request.pageSize = Math.min(MAX_REQUEST_SIZE, Math.max(MIN_REQUEST_SIZE, count));
    request.skip = this.loadedItems;

    return this.flux.bridge.search(request)
      // start lazy loading images here?
      .then((res) => res.records);
  }

  updateItems(records: Record[], renderer: Renderer) {
    records.forEach((record) => {
      if (this.items.length <= this.loadedItems) {
        this.addBlankItem();
      }
      this.items[this.loadedItems++].data = record;
    });
    this.updating = false;
    renderer.attachToView();
  }

  addBlankItem() {
    this.items.push({
      data: null,
      node: null,
      height: 0,
      width: 0,
      top: 0,
    });
  }
}

export interface ScrollItem {
  node: riot.TagElement;
  data: any;
  top: number;
  height: number;
  width: number;
}

export interface ScrollAnchor {
  index: number;
  offset: number;
}
