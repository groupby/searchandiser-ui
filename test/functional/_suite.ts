import '../../src/tags/index';
import { FluxTag, MixinFlux } from '../../src/tags/tag';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';

function suite<T extends FluxTag>(tagName: string, mixin: any, cb: (suite: FunctionalSuite<T>) => void);
function suite<T extends FluxTag>(tagName: string, cb: (suite: FunctionalSuite<T>) => void);
function suite<T extends FluxTag>(tagName: string, mixinOrCb: any, cb?: Function) {
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
      mount
    });
  });

  function mount(opts: any = {}) {
    return <T>riot.mount(tagName, opts)[0];
  }
}

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

export interface FunctionalSuite<T> {
  flux: () => FluxCapacitor;
  html: () => HTMLElement;
  sandbox: () => Sinon.SinonSandbox;
  mount: (opts?: any) => T;
  tagName: string;
}
