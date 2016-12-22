import { FluxTag } from '../tag';
import { PagingConfig } from './gb-paging';

export interface Pager extends FluxTag<PagingConfig> { }

export class Pager {

  onMount() {
    console.log(this.$computed);
  }

  onUpdate() {
    console.log(this.$computed);
  }
}
