import { expectSubscriptions } from '../../utils/expectations';
import { base, Utils } from '../../utils/suite';
import { FluxCapacitor } from 'groupby-api';
import * as suite from 'mocha-suite';

export function serviceSuite({ init, teardown, expect, spy, stub }: Utils, tests: (utils: ServiceUtils) => void) {
  let _flux: FluxCapacitor;

  beforeEach(() => {
    _flux = new FluxCapacitor('');
    init();
  });
  afterEach(() => teardown());

  tests({
    flux: () => _flux,
    expect,
    spy,
    stub,

    expectSubscriptions: _expectSubscriptions
  });

  function _expectSubscriptions(func: Function, subscriptions: any, emitter: any = _flux) {
    expectSubscriptions(func, subscriptions, emitter);
  }
}

export default (serviceName: string, tests?: (utils: ServiceUtils) => void) =>
  suite(base(serviceSuite))(`${serviceName} service`, tests);

export interface ServiceUtils extends Utils {
  flux: () => FluxCapacitor;

  expectSubscriptions: (func: Function, subscriptions: any, emitter?: any) => void;
}
