import '../../src/tags/index';
import { FluxTag } from '../../src/tags/tag';
import { MixinFlux } from '../../src/utils/tag';
import { base, Utils } from '../utils/suite';
import { FluxCapacitor } from 'groupby-api';
import * as suite from 'mocha-suite';
import * as riot from 'riot';

// tslint:disable-next-line max-line-length
export function tagSuite<T extends FluxTag<any>>({ init, teardown, expect, spy, stub }: Utils, tests: (utils: TagUtils<T>) => void, { tagName, mixin }: TagOptions<T>) {
  let _flux: FluxCapacitor;
  let _html: HTMLElement;

  beforeEach(() => {
    _flux = mixinFlux(mixin);
    _html = createTag(tagName);
    init();
  });
  afterEach(() => {
    teardown();
    removeTag(_html);
  });

  tests({
    tagName,
    flux: () => _flux,
    html: () => _html,

    expect,
    spy,
    stub,

    mount,
    itMountsTag
  });

  function mount(opts: any = {}) {
    return <T>riot.mount(tagName, opts)[0];
  }

  function itMountsTag() {
    it('mounts tag', () => {
      const tag = mount();

      expect(tag).to.be.ok;
      expect(tag.root).to.be.ok;
    });
  }
}

// tslint:disable-next-line max-line-length
export default <T extends FluxTag<any>>(description: string, mixin: ((utils: TagUtils<T>) => void) | { [key: string]: any }, tests?: (utils: TagUtils<T>) => void) => {
  const tagName = description.split(' ')[0];
  [mixin, tests] = tests ? [mixin, tests] : [undefined, <any>mixin];
  suite<TagUtils<T>>(base<TagUtils<T>>(tagSuite))(`${description} behaviour`, { tagName, mixin }, tests);
};

export function mixinFlux(obj: any = {}): FluxCapacitor {
  const flux = new FluxCapacitor('');
  riot.mixin('test', Object.assign(MixinFlux(flux, {}, {}), obj));
  return flux;
}

export function createTag(tag: string): HTMLElement {
  const html = document.createElement(tag);
  document.body.appendChild(html);
  return html;
}

export function removeTag(html: HTMLElement) {
  document.body.removeChild(html);
}

export interface TagUtils<T> extends Utils {
  tagName: string;
  flux: () => FluxCapacitor;
  html: () => HTMLElement;
  mount: (opts?: any) => T;

  itMountsTag: () => void;
}

export interface TagOptions<T> {
  tagName: string;
  mixin?: any;
}

export abstract class BaseModel<T extends FluxTag<any>> {
  constructor(protected tag: T) { }

  protected get html() {
    return this.tag.root;
  }

  protected element<T extends HTMLElement>(tag: HTMLElement, selector: string) {
    return <T & HTMLElement>tag.querySelector(selector);
  }

  protected list<T extends HTMLElement>(tag: HTMLElement, selector: string) {
    return <NodeListOf<T & HTMLElement>>tag.querySelectorAll(selector);
  }
}

export abstract class SelectModel extends BaseModel<any> {

  get label() {
    return this.element(this.html, '.gb-button__label');
  }

  get items() {
    return this.list(this.html, 'gb-option:not(.clear) a');
  }

  get clearItem() {
    return this.element(this.html, 'gb-option.clear a');
  }
}
