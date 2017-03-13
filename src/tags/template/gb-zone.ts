import { FluxTag } from '../tag';

export class Zone extends FluxTag<any> {

  zone: any;

  init() {
    this.expose('zone', this.zone);

    this.root.classList.add(`gb-zone-${this.zone.name}`);
  }
}
