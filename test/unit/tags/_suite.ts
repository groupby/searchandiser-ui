import { FluxTag } from '../../../src/tags/tag';
import { FluxCapacitor } from 'groupby-api';

function suite<T extends FluxTag>(tagName: string, clazz: { new (): T }, mixin: any, cb: (suite: UnitSuite<T>) => void);
function suite<T extends FluxTag>(tagName: string, clazz: { new (): T }, cb: (suite: UnitSuite<T>) => void);
function suite<T extends FluxTag>(tagName: string, clazz: { new (): T }, mixinOrCb: any, cb?: Function) {
  const hasMixin = typeof mixinOrCb === 'object';
  const mixin = hasMixin ? mixinOrCb : {};
  const tests = hasMixin ? cb : mixinOrCb;

  describe(`${tagName} logic`, () => {
    let _flux: FluxCapacitor;
    let _tag: T;
    let _sandbox: Sinon.SinonSandbox;

    beforeEach(() => {
      ({ tag: _tag, flux: _flux } = fluxTag(new clazz(), mixin));
      _sandbox = sinon.sandbox.create();
    });
    afterEach(() => _sandbox.restore());

    tests({
      flux() {
        return _flux;
      },
      tag() {
        return _tag;
      },
      sandbox() {
        return _sandbox;
      },
      tagName,
      mount
    });
  });

  function mount(opts: any = {}) {
    return <T>riot.mount(tagName, opts)[0];
  }
}

export default suite;

export function fluxTag<T extends FluxTag>(tag: T, obj: any = {}): { flux: FluxCapacitor, tag: T } {
  const flux = new FluxCapacitor('');
  Object.assign(tag, { flux, opts: {}, config: {}, on: () => null }, obj);
  return { flux, tag };
}

export interface UnitSuite<T> {
  flux: () => FluxCapacitor;
  tag: () => T;
  sandbox: () => Sinon.SinonSandbox;
  mount: (opts?: any) => T;
  tagName: string;
}
