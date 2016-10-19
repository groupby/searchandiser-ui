import { debounce } from '../../utils/common';
import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export const SCROLL_UPDATE_PERCENT = 0.5;

export interface InfiniScrollConfig {
  maxRecords?: number;
}

export const DEFAULT_CONFIG: InfiniScrollConfig = {
  maxRecords: 500
};

export interface InfiniScroll extends FluxTag<InfiniScrollConfig> { }

export class InfiniScroll extends FluxTag<InfiniScrollConfig>  {

  updating: boolean;
  updateHeight: number;

  init() {
    this.configure(DEFAULT_CONFIG);

    // debouncing this function
    this.root.addEventListener('scroll', (event) => {
      if (!this.updating && this._config.maxRecords > this.tags['gb-results'].records.length) {
        const scrollableHeight = this.root.scrollHeight - this.root.clientHeight;
        if (!this.updateHeight) {
          this.updateHeight = SCROLL_UPDATE_PERCENT * scrollableHeight;
        }
        if (scrollableHeight - this.root.scrollTop < this.updateHeight) {
          this.updating = true;
          this.flux.page.next();
        }
      }
    });
    this.flux.on(Events.RESULTS, this.updateRecords);
  }

  updateRecords({ records: newRecords }: Results) {
    const resultsTag = this.tags['gb-results'];
    const records = resultsTag.records || [];
    records.push(...newRecords);
    resultsTag.update({ records, collection: this.flux.query.raw.collection });
    this.updating = false;
  }
}
