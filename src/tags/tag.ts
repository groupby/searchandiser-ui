import { FluxCapacitor } from 'groupby-api';
import { expect } from 'chai';
import { initCapacitor } from '../searchandiser';

export interface FluxTag extends Riot.Tag.Instance {
  root: HTMLElement;
  parent: Riot.Tag.Instance & FluxTag & any;

  flux: FluxCapacitor;
  config: any;
}

export class FluxTag {

  _tagName: string;
  _parents: any;
  _scope: FluxTag & any;
  _top: FluxTag & any;
  _style: string;

  init() {
    this._style = this.config.stylish ? 'gb-stylish' : '';
    this.setTagName();
    this.setParents();
    this.setScope();
  }

  _clone() {
    return initCapacitor(Object.assign({}, this.config, { initialSearch: false }));
  }

  _scopeTo(scope: string) {
    this._scope = this._parents[scope];
  }

  findParent(tag: Riot.Tag.Instance, name: string) {
    let parentTag: Riot.Tag.Instance = tag;
    while (parentTag.root.localName !== name && parentTag.parent) parentTag = parentTag.parent;
    return parentTag;
  }

  private setTagName() {
    const htmlTagName = this.root.tagName.toLowerCase();
    const tagName = htmlTagName.startsWith('gb-') ?
      htmlTagName :
      this.root.dataset['is'] || this.root.getAttribute('riot-tag');

    if (tagName) this._tagName = tagName;
  }

  private setParents() {
    this._parents = this.parent ? Object.assign({}, this.parent['_parents']) : {};
    if (this._tagName) {
      this._parents[this._tagName] = this;
    }
  }

  // somehow this function isn't working for the gb-select inside gb-sort
  private setScope() {
    if (this.opts.scope in this._parents) {
      this._scope = this._parents[this.opts.scope];
    } else if (this.parent && this.parent._scope) {
      this._scope = this.parent._scope;
    } else {
      let parent: any = this;
      while (parent.parent) this._scope = parent = parent.parent;
      this._top = this._scope;
    }
  }
}

export function MixinFlux(flux: FluxCapacitor, config: any) {
  return Object.assign(new FluxTag()['__proto__'], { flux, config });
}
