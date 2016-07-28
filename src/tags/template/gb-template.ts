import '../gb-import.tag';
import { FluxTag } from '../tag';
import { Events } from 'groupby-api';
import { unless } from '../../utils';

export interface Template extends FluxTag { }

export class Template {

  isActive: boolean = false;
  raw: boolean;
  url: string;

  init() {
    this.url = this.opts.url;
    this.raw = unless(this.opts.raw, false);
    this.opts.flux.on(Events.RESULTS, ({ template }) => this.update({ isActive: template.name === this.opts.templateName }));
  }
}
