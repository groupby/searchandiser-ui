import { Template } from '../../../src/tags/template/gb-template';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-template', Template, ({ tag, itShouldConfigure, expectSubscriptions }) => {
  const target = 'My Spotlight Template';

  describe('init()', () => {
    itShouldConfigure();

    it('should have default values', () => {
      tag().init();

      expect(tag().isActive).to.not.be.ok;
      expect(tag().zones).to.not.be.ok;
      expect(tag().zoneMap).to.not.be.ok;
    });

    it('should listen for events', () => {
      expectSubscriptions(() => tag().init(), {
        [Events.RESULTS]: tag().updateActive
      });
    });
  });

  describe('updateActive()', () => {
    it('should update active on RESULTS', () => {
      const sortedZones = [{ a: 'b' }];
      const zones = { a: 'b' };
      const spy =
        tag().update =
        sinon.spy((obj) => {
          expect(obj.isActive).to.be.true;
          expect(obj.zones).to.eq(sortedZones);
          expect(obj.zoneMap).to.eq(zones);
        });
      tag()._config = { target };
      tag().sortZones = (zoneMap) => {
        expect(zoneMap).to.eq(zones);
        return sortedZones;
      };

      tag().updateActive(<any>{
        template: {
          name: target,
          zones
        }
      });

      expect(spy.called).to.be.true;
    });
  });

  describe('sortZones()', () => {
    it('should map zones to a list', () => {
      const zone1 = { a: 'b' };
      const zone2 = { c: 'd' };
      const zone3 = { e: 'f' };
      const zones = { a: zone1, b: zone2, c: zone3 };

      const zoneArray = tag().sortZones(zones);

      expect(zoneArray).to.have.members([zone1, zone2, zone3]);
    });

    it('should push Record zones to the bottom', () => {
      const zone1 = { a: 'b', type: 'Record' };
      const zone2 = { c: 'd' };
      const zone3 = { e: 'f' };
      const zones = { a: zone1, b: zone2, c: zone3 };

      const zoneArray = tag().sortZones(zones);

      expect(zoneArray).to.have.length(3);
      expect(zoneArray[2]).to.eq(zone1);
    });
  });
});
