import { FluxTag } from '../tag';

export interface List extends FluxTag<any> { }

export class List {
  inline: boolean;
  activation: (index: number) => boolean;

  init() {

  }
}
