import { FluxCapacitor, Events } from 'groupby-api';
import { Template } from '../../../src/tags/template/gb-template';
import { fluxTag } from '../../utils/tags';
import { expect } from 'chai';

describe('gb-template logic', () => {
  const target = 'My Spotlight Template';
  let tag: Template;
  let flux: FluxCapacitor;

  beforeEach(() => ({ tag, flux } = fluxTag(new Template())));

  it('should have default values', () => {
    tag.init();

    expect(tag.target).to.not.be.ok;
    expect(tag.isActive).to.not.be.ok;
    expect(tag.zones).to.not.be.ok;
    expect(tag.zoneMap).to.not.be.ok;
  });

  it('should get default from opts', () => {
    tag.opts = { target }
    tag.init();

    expect(tag.target).to.eq(target);
  });

  it('should listen for events', () => {
    flux.on = (event: string, cb: Function): any => {
      expect(event).to.eq(Events.RESULTS);
      expect(cb).to.eq(tag.updateActive);
    };

    tag.init();
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

    tag.update = (obj: any) => {
      expect(obj.isActive).to.be.true;
      expect(obj.zones.map((zone) => zone.name)).to.eql(['b', 'a', 'c'])
      expect(obj.zoneMap).to.eq(zones);
    };
    tag.init();
    tag.target = target

    tag.updateActive(<any>{
      template: {
        name: target,
        zones
      }
    });
  });
});
