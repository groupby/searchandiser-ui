import { configure, FluxTag } from '../../../src/tags/tag';
import { expectSubscriptions } from '../../utils/expectations';
import { baseSuite, buildSuite, SuiteModifier } from '../../utils/suite';
import { expect } from 'chai';
import { FluxCapacitor } from 'groupby-api';

function _suite<T extends FluxTag<any>>(modifier: SuiteModifier, tagName: string, clazz: { new (): T }, mixinOrCb: any, cb?: Function) { // tslint:disable-line:max-line-length
  const hasMixin = typeof mixinOrCb === 'object';
  const mixin = hasMixin ? mixinOrCb : {};
  const tests: (suiteUtils: UnitUtils<T>) => void = hasMixin ? cb : mixinOrCb;

  baseSuite(modifier, `${tagName} logic`, ({ init, teardown, spy, stub }) => {
    let _flux: FluxCapacitor;
    let _tag: T;

    beforeEach(() => {
      // TODO: should be this vvv
      // ({ tag: _tag, flux: _flux } = fluxTag(new clazz(), mixin));
      let { tag, flux } = fluxTag(tagName, new clazz(), mixin);
      _tag = tag;
      _flux = flux;
      init();
    });
    afterEach(() => teardown());

    tests({
      flux: () => _flux,
      tag: () => _tag,
      expectSubscriptions: _expectSubscriptions,
      spy,
      stub,
      itShouldConfigure,
      tagName
    });

    function _expectSubscriptions(func: Function, subscriptions: any, emitter: any = _flux) {
      expectSubscriptions(func, subscriptions, emitter);
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

export interface BaseSuite extends Suite {
  skip?: Suite;
  only?: Suite;
}

export interface Suite {
  <T extends FluxTag<any>>(tagName: string, clazz: { new (): T }, mixin: any, cb: (suite: UnitUtils<T>) => void);
  <T extends FluxTag<any>>(tagName: string, clazz: { new (): T }, cb: (suite: UnitUtils<T>) => void);
}

const suite = buildSuite<BaseSuite>(_suite);

export default suite;

// tslint:disable-next-line:max-line-length
export function fluxTag<T extends FluxTag<any>>(tagName: string, tag: T, obj: any = {}): { flux: FluxCapacitor, tag: T } {
  const flux = new FluxCapacitor('');
  Object.assign(tag, {
    flux,
    opts: {},
    refs: {},
    config: {},
    $tagName: tagName,
    $config: {},
    configure: (cfg = {}) => configure(cfg, tag),
    $schema: () => null,
    on: () => null
  }, obj);
  return { flux, tag };
}

export interface UnitUtils<T> {
  flux: () => FluxCapacitor;
  tag: () => T;
  spy: Sinon.SinonSpyStatic;
  stub: Sinon.SinonStubStatic;
  expectSubscriptions: (func: Function, subscriptions: any, emitter?: any) => void;
  itShouldConfigure: (defaultConfig?: any) => void;
  tagName: string;
}
