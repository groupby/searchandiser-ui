import { FluxTag, META, TagMeta } from '../../../src/tags/tag';
import { expectAliases, expectSubscriptions, ExpectedAliases } from '../../utils/expectations';
import { base, Utils } from '../../utils/suite';
import { FluxCapacitor } from 'groupby-api';
import * as suite from 'mocha-suite';

// tslint:disable-next-line max-line-length
export function tagSuite<T extends FluxTag<any>>({ init, teardown, expect, spy, stub }: Utils, tests: (utils: TagUtils<T>) => void, { tagName, class: clazz, mixin }: TagOptions<T>) {
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
    tagName,
    tag: () => _tag,
    flux: () => _flux,

    expect,
    spy,
    stub,

    itShouldAlias,
    itShouldHaveMeta,

    expectSubscriptions: _expectSubscriptions,
    expectAliases: _expectAliases
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

  function itShouldHaveMeta(tagClass: { new (): FluxTag<any> }, meta: TagMeta) {
    it('should have meta', () => {
      expect(tagClass[META]).to.eq(meta);
    });
  }
}

// tslint:disable-next-line max-line-length
export default <T>(tagName: string, clazz: { new (): T }, mixin: ((utils: TagUtils<T>) => void) | { [key: string]: any }, tests?: (utils: TagUtils<T>) => void) => {
  [mixin, tests] = tests ? [mixin, tests] : [undefined, <any>mixin];
  suite(base(tagSuite))(`${tagName} logic`, { tagName, mixin, class: clazz }, tests);
};

// tslint:disable-next-line:max-line-length
export function fluxTag<T extends FluxTag<any>>(tagName: string, tag: T, obj: any = {}): { flux: FluxCapacitor, tag: T } {
  const flux = new FluxCapacitor('');
  Object.assign(tag, {
    flux,
    opts: {},
    refs: {},
    config: {},
    _tagName: tagName,
    expose: () => null,
    inherits: () => null,
    transform: () => null,
    unexpose: () => null,
    register: () => null,
    mixin: () => null,
    on: () => null
  }, obj);
  return { flux, tag };
}

export interface TagOptions<T> {
  tagName: string;
  class: { new (): T };
  mixin?: any;
}

export interface TagUtils<T> extends Utils {
  tagName: string;
  tag: () => T;
  flux: () => FluxCapacitor;

  itShouldAlias: (aliases: ExpectedAliases) => void;
  itShouldHaveMeta: (tagClass: { new (): FluxTag<any> }, meta: TagMeta) => void;

  expectSubscriptions: (func: Function, subscriptions: any, emitter?: any) => void;
  expectAliases: (func: Function, aliases: ExpectedAliases) => void;
}
