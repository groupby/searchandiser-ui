import { FluxTag } from '../tag';

export class Zone extends FluxTag<any> {

  zone: any;

  init() {
    this.alias('zone', this.zone);

    this.root.classList.add(`gb-zone-${this.zone.name}`);
  }
}
