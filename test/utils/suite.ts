/**
 * Suite Helpers
 */

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
