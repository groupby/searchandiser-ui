import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface TemplateConfig {
  target: string;
}

export interface Template extends FluxTag<TemplateConfig> { }

export class Template {

  target: string;

  isActive: boolean;
  zones: any[];
  zoneMap: any;

  init() {
    this.alias('template');

    this.flux.on(Events.RESULTS, this.updateActive);
  }

  updateActive({ template }: Results) {
    this.update({
      isActive: template.name === this.target,
      zoneMap: template.zones,
      zones: this.sortZones(template.zones)
    });
  }

  sortZones(zones: any) {
    return Object.keys(zones).map((key) => zones[key])
      .reduce((list, zone) => {
        if (zone.type === 'Record') {
          list.push(zone);
        } else {
          list.unshift(zone);
        }
        return list;
      }, []);
  }
}
