import '../../src/tags/index';
import { SelectTag } from '../../src/tags/select/gb-select';
import { FluxTag, MixinFlux } from '../../src/tags/tag';
import { expect } from 'chai';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';

function suite<T extends FluxTag<any>>(tagName: string, mixin: any, cb: (suite: FunctionalSuite<T>) => void);
function suite<T extends FluxTag<any>>(tagName: string, cb: (suite: FunctionalSuite<T>) => void);
function suite<T extends FluxTag<any>>(tagName: string, mixinOrCb: any, cb?: Function) {
  const hasMixin = typeof mixinOrCb === 'object';
  const mixin = hasMixin ? mixinOrCb : {};
  const tests = hasMixin ? cb : mixinOrCb;

  describe(`${tagName} behaviour`, () => {
    let _flux: FluxCapacitor;
    let _html: HTMLElement;
    let _sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
      _sandbox = sinon.sandbox.create();
      _flux = mixinFlux(mixin);
      _html = createTag(tagName);
    });
    afterEach(() => {
      removeTag(_html);
      _sandbox.restore();
    });

    tests({
      flux: () => _flux,
      html: () => _html,
      sandbox: () => _sandbox,
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
    });
  }
}

export default suite;

export function mixinFlux(obj: any = {}): FluxCapacitor {
  const flux = new FluxCapacitor('');
  riot.mixin('test', Object.assign(MixinFlux(flux, {}, {}), {
    configure(cfg: any = {}) {
      this._config = Object.assign({}, cfg, this.opts['__proto__'], this.opts);
    }
  }, obj));
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

export interface FunctionalSuite<T> {
  flux: () => FluxCapacitor;
  html: () => HTMLElement;
  sandbox: () => Sinon.SinonSandbox;
  mount: (opts?: any) => T;
  itMountsTag: () => null;
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

export abstract class SelectModel<T extends SelectTag<any>> extends BaseModel<T> {

  get label() {
    return this.element(this.html, '.gb-button__label');
  }

  get options() {
    return this.list(this.html, '.gb-select__option:not(.clear) gb-option a');
  }

  get clearOption() {
    return this.element(this.html, '.gb-select__option.clear gb-option a');
  }
}
