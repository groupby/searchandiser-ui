import { WINDOW } from '../../utils/common';
import { FluxTag } from '../tag';
import { Renderer } from './renderer';
import { Events, Record } from 'groupby-api';
import * as riot from 'riot';

export const MIN_REQUEST_SIZE = 25;
export const MAX_REQUEST_SIZE = 120;

export interface InfiniteScrollConfig {
  maxRecords?: number;
}

export const DEFAULT_CONFIG: InfiniteScrollConfig = {
  maxRecords: 500
};

export interface InfiniteScroll extends FluxTag<InfiniteScrollConfig> { }

export class InfiniteScroll extends FluxTag<InfiniteScrollConfig>  {

  scroller: HTMLUListElement;
  runway: HTMLElement;
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
    this.configure(DEFAULT_CONFIG);

    this.scroller.addEventListener('scroll', this.onScroll);
    WINDOW.addEventListener('resize', this.onResize);
    this.flux.on(Events.QUERY_CHANGED, this.reset);
    this.flux.on(Events.REFINEMENTS_CHANGED, this.reset);
    this.flux.on(Events.SORT, this.reset);
    this.flux.on(Events.COLLECTION_CHANGED, this.reset);

    this.items = [];
    this.loadedItems = 0;
    this.runwayEnd = 0;
    this.onResize();
  }

  reset() {
    this.items = [];
    this.loadedItems = 0;
    this.runwayEnd = 0;
    this.anchorScrollTop = 0;
    this.oldScroll = 0;
    while (this.scroller.hasChildNodes()) {
      this.scroller.removeChild(this.scroller.lastChild);
    }
    this.attachRenderer();
  }

  onScroll() {
    if (this.oldScroll !== this.scroller.scrollTop) {
      this.attachRenderer();
    }
    this.oldScroll = this.scroller.scrollTop;
  }

  attachRenderer() {
    new Renderer(this).attachToView();
  }

  onResize() {
    return Renderer.createTombstone(this.config.structure)
      .then((tombstone) => {
        this.scroller.appendChild(tombstone);
        this.tombstoneLayout = {
          height: tombstone.offsetHeight,
          width: tombstone.offsetWidth
        };
        (<riot.TagElement>tombstone)._tag.unmount();
        this.items.forEach((item) => item.height = item.width = 0);
        this.attachRenderer();
      });
  }

  maybeRequestContent(renderer: Renderer) {
    const itemsNeeded = renderer.lastItem - this.loadedItems;
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

  // new blank item
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
  node: HTMLElement;
  data: any;
  top: number;
  height: number;
  width: number;
}

export interface ScrollAnchor {
  index: number;
  offset: number;
}
