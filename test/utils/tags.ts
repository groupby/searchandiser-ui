import { FluxCapacitor } from 'groupby-api';
import { FluxTag } from '../../src/tags/tag';

// for functional tests

export function mixinFlux(obj: any = {}): FluxCapacitor {
  const flux = new FluxCapacitor('');
  riot.mixin('test', Object.assign({}, { flux }, obj));
  return flux;
}

export function createTag(tag: string): HTMLElement {
  const html = document.createElement(tag)
  document.body.appendChild(html);
  return html;
}

export function removeTag(html: HTMLElement) {
  document.body.removeChild(html);
}


// for unit tests

export function fluxTag<T extends FluxTag>(tag: T, obj: any = {}): { flux: FluxCapacitor, tag: T } {
  const flux = new FluxCapacitor('');
  Object.assign(tag, { flux, opts: {}, config: {}, on: () => null }, obj);
  return { flux, tag };
}
