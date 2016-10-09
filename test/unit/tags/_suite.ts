import { FluxTag } from '../../../src/tags/tag';
import { expect } from 'chai';
import { FluxCapacitor } from 'groupby-api';

/* tslint:disable:max-line-length */
function suite<T extends FluxTag<any>>(tagName: string, clazz: { new (): T }, mixin: any, cb: (suite: UnitSuite<T>) => void);
function suite<T extends FluxTag<any>>(tagName: string, clazz: { new (): T }, cb: (suite: UnitSuite<T>) => void);
function suite<T extends FluxTag<any>>(tagName: string, clazz: { new (): T }, mixinOrCb: any, cb?: Function) {
  /* tslint:enable:max-line-length */
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
      expectSubscriptions,
      itShouldConfigure,
      tagName
    });

    function expectSubscriptions(func: Function, subscriptions: any, emitter: any = _flux) {
      const events = Object.keys(subscriptions);
      const listeners = {};

      emitter.on = (event, handler): any => {
        if (events.includes(event)) {
          listeners[event] = expect(handler).to.eq(subscriptions[event]);
        } else {
          expect.fail();
        }
      };

      func();

      const subscribedEvents = Object.keys(listeners);
      expect(subscribedEvents).to.have.members(events);
    }

    function itShouldConfigure(defaultConfig?: any) {
      it(`should configure itself ${defaultConfig ? 'with defaults' : ''}`, (done) => {
        _tag.configure = (config) => {
          if (defaultConfig) {
            expect(config).to.eq(defaultConfig);
          } else {
            expect(config).to.be.undefined;
          }
          done();
        };

        _tag.init();
      });
    }
  });
}

export default suite;

export function fluxTag<T extends FluxTag<any>>(tag: T, obj: any = {}): { flux: FluxCapacitor, tag: T } {
  const flux = new FluxCapacitor('');
  Object.assign(tag, {
    flux,
    opts: {},
    config: {},
    _config: {},
    configure: (cfg = {}) => tag._config = Object.assign({}, cfg, tag.opts),
    on: () => null
  }, obj);
  return { flux, tag };
}

export interface UnitSuite<T> {
  flux: () => FluxCapacitor;
  tag: () => T;
  sandbox: () => Sinon.SinonSandbox;
  mount: (opts?: any) => T;
  expectSubscriptions: (func: Function, subscriptions: any, emitter?: any) => void;
  itShouldConfigure: (defaultConfig?: any) => void;
  tagName: string;
}
