import { expectSubscriptions } from '../../utils/expectations';
import { baseSuite, buildSuite, SuiteModifier } from '../../utils/suite';
import { FluxCapacitor } from 'groupby-api';

function _suite(modifier: SuiteModifier, serviceName: string, tests: (suite: ServiceUtils) => void) { // tslint:disable-line:max-line-length

  baseSuite(modifier, `${serviceName} service`, ({ init, teardown, spy, stub }) => {
    let _flux: FluxCapacitor;

    beforeEach(() => {
      _flux = new FluxCapacitor('');
      init();
    });
    afterEach(() => teardown());

    tests({
      flux: () => _flux,
      expectSubscriptions: _expectSubscriptions,
      spy,
      stub
    });

    function _expectSubscriptions(func: Function, subscriptions: any, emitter: any = _flux) {
      expectSubscriptions(func, subscriptions, emitter);
    }
  });
}

export interface BaseSuite extends Suite {
  skip?: Suite;
  only?: Suite;
}

export interface Suite {
  (serviceName: string, cb: (suite: ServiceUtils) => void);
}

const suite = buildSuite<BaseSuite>(_suite);

export default suite;

export interface ServiceUtils {
  flux: () => FluxCapacitor;
  spy: Sinon.SinonSpyStatic;
  stub: Sinon.SinonStubStatic;
  expectSubscriptions: (func: Function, subscriptions: any, emitter?: any) => void;
}
