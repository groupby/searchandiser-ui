/**
 * Suite Helpers
 */

export function baseSuite(modifier: SuiteModifier, description: string, suite: (utils: SuiteUtils) => void) {
  getDescribe(modifier)(description, () => {
    let _sandbox: Sinon.SinonSandbox;

    suite({
      init,
      teardown,
      spy: (obj?, method?) => _sandbox.spy(obj, method),
      stub: (obj?, method?, func?) => _sandbox.stub(obj, method, func)
    });

    function init() {
      _sandbox = sinon.sandbox.create();
    }
    function teardown() {
      _sandbox.restore();
    }
  });
}

export interface SuiteUtils {
  init: () => void;
  teardown: () => void;
  spy: Sinon.SinonSpyStatic;
  stub: Sinon.SinonStubStatic;
}

export enum SuiteModifier {
  Only, Skip
}

export function getDescribe(modifier: SuiteModifier) {
  switch (modifier) {
    case SuiteModifier.Only: return describe.only;
    case SuiteModifier.Skip: return describe.skip;
    default: return describe;
  }
}

export function buildSuite<T>(_suite: Function): T {
  const baseSuite: T & { skip: any; only: any; } = _suite.bind(null, null);
  baseSuite.only = _suite.bind(null, SuiteModifier.Only);
  baseSuite.skip = _suite.bind(null, SuiteModifier.Skip);

  return baseSuite;
}
