import { FluxTag } from '../tag';
import { Events, Results } from 'groupby-api';

export interface TemplateConfig {
  target: string;
}

export interface Template extends FluxTag<TemplateConfig> { }

export class Template {

  isActive: boolean;
  zones: any[];
  zoneMap: any;

  init() {
    this.configure();

    this.flux.on(Events.RESULTS, this.updateActive);
  }

  updateActive({ template }: Results) {
    this.update({
      isActive: template.name === this._config.target,
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
