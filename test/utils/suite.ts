import { expect } from 'chai';

/**
 * Suite Helpers
 */

export function base<T>(suite: (utils: Utils, tests: (utils: T) => void, opts?: any) => any) {
  return (tests, opts) => {
    let sandbox: Sinon.SinonSandbox;

    return suite({
      init: () => sandbox = sinon.sandbox.create(),
      teardown: () => sandbox.restore(),

      expect,
      spy: (...args: any[]) => (<any>sandbox.spy)(...args),
      stub: (...args: any[]) => (<any>sandbox.stub)(...args)
    }, tests, opts);
  };
}

export interface Utils {
  init?: () => void;
  teardown?: () => void;
  expect: Chai.ExpectStatic;
  spy: Sinon.SinonSpyStatic;
  stub: Sinon.SinonStubStatic;
}
