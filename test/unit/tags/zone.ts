import { Zone } from '../../../src/tags/template/gb-zone';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-zone', Zone, ({
  tag, spy,
  expectAliases
}) => {

  describe('init()', () => {
    it('should alias zone', () => {
      const zone = tag().zone = { a: 'b' };
      tag().root = <any>{ classList: { add: () => null } };

      expectAliases(() => tag().init(), { zone });
    });

    it('should add id to root', () => {
      const add = spy();
      tag().zone = { name: 'MyZone' };
      tag().root = <any>{ classList: { add } };

      tag().init();

      expect(add).to.have.been.calledWith('gb-zone-MyZone');
    });
  });
});
