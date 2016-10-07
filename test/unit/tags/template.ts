import { Template } from '../../../src/tags/template/gb-template';
import suite from './_suite';
import { expect } from 'chai';
import { Events } from 'groupby-api';

suite('gb-template', Template, ({ flux, tag, itShouldConfigure, expectSubscriptions }) => {
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

  it('should update active on RESULTS', () => {
    const zones = {
      a: {
        name: 'a',
        type: 'Content'
      },
      b: {
        name: 'b',
        type: 'Rich_Content'
      },
      c: {
        name: 'c',
        type: 'Record'
      }
    };

    tag().update = (obj: any) => {
      expect(obj.isActive).to.be.true;
      expect(obj.zones.map((zone) => zone.name)).to.eql(['b', 'a', 'c']);
      expect(obj.zoneMap).to.eq(zones);
    };
    tag().init();
    tag()._config = { target };

    tag().updateActive(<any>{
      template: {
        name: target,
        zones
      }
    });
  });
});
