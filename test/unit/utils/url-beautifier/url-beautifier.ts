import * as sinonChai from 'sinon-chai';
import { sandbox as sinonSandbox } from 'sinon';
import { expect, use } from 'chai';
import { Query } from 'groupby-api';
import { UrlBeautifier, QueryUrlGenerator, QueryUrlParser } from '../../../../src/utils/url-beautifier';
import { refinement } from '../../../utils/fixtures';

use(sinonChai);

describe.only('URL beautifier', () => {
  let beautifier: UrlBeautifier;
  let sandbox;
  let stub;

  beforeEach(() => {
    beautifier = new UrlBeautifier();
    sandbox = sinonSandbox.create();
    stub = (...args) => sandbox.stub(..args);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('generator', () => {

    it('should call query url generator', () => {
      const query: Query = new Query();
      const build = stub(QueryUrlGenerator, 'build');

      beautifier.buildQueryUrl(query);

      expect(build).to.have.been.calledWith(query);
    });
  });
});
