import '../../src/tags/index';
import { FluxTag } from '../../src/tags/tag';
import { MixinFlux } from '../../src/utils/tag';
import { baseSuite, buildSuite, SuiteModifier } from '../utils/suite';
import { expect } from 'chai';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';

function _suite<T extends FluxTag<any>>(modifier: SuiteModifier, description: string, mixinOrCb: any, cb?: Function) {
  const tagName = description.split(' ')[0];
  const hasMixin = typeof mixinOrCb === 'object';
  const mixin = hasMixin ? mixinOrCb : {};
  const tests: (suiteUtils: FunctionalUtils<T>) => void = hasMixin ? cb : mixinOrCb;

  baseSuite(modifier, `${description} behaviour`, ({ init, teardown, spy, stub }) => {
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
      flux: () => _flux,
      html: () => _html,
      spy,
      stub,
      tagName,
      mount,
      itMountsTag
    });
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

export interface BaseSuite extends Suite {
  skip?: Suite;
  only?: Suite;
}

export interface Suite {
  <T extends FluxTag<any>>(tagName: string, mixin: any, cb: (suite: FunctionalUtils<T>) => void);
  <T extends FluxTag<any>>(tagName: string, cb: (suite: FunctionalUtils<T>) => void);
}

const suite = buildSuite<BaseSuite>(_suite);

export default suite;

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

export interface FunctionalUtils<T> {
  flux: () => FluxCapacitor;
  html: () => HTMLElement;
  spy: Sinon.SinonSpyStatic;
  stub: Sinon.SinonStubStatic;
  mount: (opts?: any) => T;
  itMountsTag: () => void;
  tagName: string;
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
