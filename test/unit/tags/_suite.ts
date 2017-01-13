import { FluxTag } from '../../../src/tags/tag';
import { expectAliases, expectSubscriptions, ExpectedAliases } from '../../utils/expectations';
import { baseSuite, buildSuite, SuiteModifier } from '../../utils/suite';
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
      expectAliases: _expectAliases,
      spy,
      stub,
      itShouldAlias,
      tagName
    });

    function _expectAliases(func: Function, aliases: ExpectedAliases) {
      expectAliases(func, _tag, aliases);
    }

    function _expectSubscriptions(func: Function, subscriptions: any, emitter: any = _flux) {
      expectSubscriptions(func, subscriptions, emitter);
    }

    function itShouldAlias(aliases: ExpectedAliases) {
      it('should expose aliases', () => {
        _expectAliases(() => _tag.init(), aliases);
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
    _tagName: tagName,
    alias: () => null,
    unalias: () => null,
    mixin: () => null,
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
  expectAliases: (func: Function, aliases: ExpectedAliases) => void;
  itShouldAlias: (aliases: ExpectedAliases) => void;
  tagName: string;
}
