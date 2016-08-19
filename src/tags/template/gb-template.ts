import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';
import { unless } from '../../utils';

export interface Template extends FluxTag { }

export class Template {

  isActive: boolean;
  target: string;
  zones: any[];
  zoneMap: any;

  init() {
    this.target = this.opts.target;
    this.flux.on(Events.RESULTS, this.updateActive);
  }

  updateActive({ template }: Results) {
    this.update({
      isActive: template.name === this.target,
      zoneMap: template.zones,
      zones: Object.keys(template.zones).map((key) => template.zones[key])
        .reduce((list, zone) => {
          if (zone.type === 'Record') {
            list.push(zone);
          } else {
            list.unshift(zone);
          }
          return list;
        }, [])
    });
  }
}
