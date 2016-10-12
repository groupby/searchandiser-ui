import { Filter } from '../../../src/services/filter';
import { expectSubscriptions } from '../../utils/expectations';
import { expect } from 'chai';
import { Events, FluxCapacitor, Query } from 'groupby-api';

describe('filter service', () => {
  let sandbox: Sinon.SinonSandbox;
  let service: Filter;

  beforeEach(() => {
    service = new Filter(<any>{}, <any>{});
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => sandbox.restore());

  it('should initialize flux clone', () => {
    expect(service.fluxClone).to.be.an.instanceof(FluxCapacitor);
  });

  it('should extract configuration', () => {
    const filterConfig = { a: 'b' };
    service = new Filter(<any>{}, <any>{ tags: { filter: filterConfig } });

    expect(service.filterConfig).to.eq(filterConfig);
  });

  it('should default to empty configuration', () => {
    expect(service.filterConfig).to.eql({});
  });

  describe('init()', () => {
    it('should listen for results', () => {
      const flux: any = {};
      service = new Filter(flux, <any>{});

      expectSubscriptions(() => service.init(), {
        [Events.RESULTS]: null
      }, flux);
    });
  });

  describe('isTargetNav()', () => {
    it('should match navigation', () => {
      const navName = 'Brand';
      const config: any = { tags: { filter: { field: navName } } };
      service = new Filter(<any>{}, config);

      expect(service.isTargetNav(navName)).to.be.true;
    });

    it('should not match navigation', () => {
      const config: any = { tags: { filter: { field: 'Brand' } } };
      service = new Filter(<any>{}, config);

      expect(service.isTargetNav('Price')).to.be.false;
    });
  });

  describe('clone()', () => {
    it('should return a FluxCapacitor', () => {
      const collection = 'otherProducts';
      service = new Filter(<any>{}, <any>{ collection });

      const fluxClone = service.clone();

      expect(fluxClone).to.be.an.instanceof(FluxCapacitor);
      expect(fluxClone.query.raw.collection).to.eq(collection);
    });
  });

  describe('updateFluxClone()', () => {
    it('should update fluxClone state', () => {
      const parentQuery = 'red sneakers';
      service = new Filter(<any>{ query: new Query(parentQuery) }, <any>{});

      service.fluxClone.search = (query: string): any => {
        expect(query).to.eq(parentQuery);
        return { then: (cb: Function) => expect(cb).to.be.a('function') };
      };

      service.updateFluxClone();
      expect(service.fluxClone.query.raw.refinements).to.eql([]);
    });

    it('should update fluxClone state with refinements', () => {
      const parentQuery = 'red sneakers';
      const refinements: any = { a: 'b', c: 'd' };
      service = new Filter(<any>{
        query: new Query(parentQuery)
          .withSelectedRefinements(refinements)
      }, <any>{});

      service.fluxClone.search = (query: string): any => {
        expect(query).to.eq(parentQuery);
        return { then: (cb: Function) => expect(cb).to.be.a('function') };
      };

      service.isTargetNav = () => false;

      service.updateFluxClone();
      expect(service.fluxClone.query.raw.refinements).to.eql([refinements]);
    });
  });
});
