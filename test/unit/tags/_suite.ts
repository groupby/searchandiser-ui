import { FluxTag } from '../../../src/tags/tag';
import { FluxCapacitor } from 'groupby-api';
import * as riot from 'riot';

function suite<T extends FluxTag<any>>(tagName: string, clazz: { new (): T }, mixin: any, cb: (suite: UnitSuite<T>) => void);
function suite<T extends FluxTag<any>>(tagName: string, clazz: { new (): T }, cb: (suite: UnitSuite<T>) => void);
function suite<T extends FluxTag<any>>(tagName: string, clazz: { new (): T }, mixinOrCb: any, cb?: Function) {
  const hasMixin = typeof mixinOrCb === 'object';
  const mixin = hasMixin ? mixinOrCb : {};
  const tests = hasMixin ? cb : mixinOrCb;

  describe(`${tagName} logic`, () => {
    let _flux: FluxCapacitor;
    let _tag: T;
    let _sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
      // TODO: should be this vvv
      // ({ tag: _tag, flux: _flux } = fluxTag(new clazz(), mixin));
      let { tag, flux } = fluxTag(new clazz(), mixin);
      _tag = tag;
      _flux = flux;
      _sandbox = sinon.sandbox.create();
    });
    afterEach(() => _sandbox.restore());

    tests({
      flux: () => _flux,
      tag: () => _tag,
      sandbox: () => _sandbox,
      tagName,
      // mount
    });
  });
  //
  // function mount(opts: any = {}) {
  //   return <T>riot.mount(tagName, opts)[0];
  // }
}

export default suite;

export function fluxTag<T extends FluxTag<any>>(tag: T, obj: any = {}): { flux: FluxCapacitor, tag: T } {
  const flux = new FluxCapacitor('');
  Object.assign(tag, {
    flux,
    opts: {},
    config: {},
    configure: (cfg = {}) => tag._config = cfg,
    on: () => null
  }, obj);
  return { flux, tag };
}

export interface UnitSuite<T> {
  flux: () => FluxCapacitor;
  tag: () => T;
  sandbox: () => Sinon.SinonSandbox;
  mount: (opts?: any) => T;
  tagName: string;
}
