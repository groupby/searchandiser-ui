import { Filter } from '../../../src/services/filter';
import { expect } from 'chai';
import { Events, FluxCapacitor, Query } from 'groupby-api';

describe('filter service', () => {
  let sandbox: Sinon.SinonSandbox;
  let filterService: Filter;

  beforeEach(() => {
    filterService = new Filter(<any>{}, <any>{});
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => sandbox.restore());

  it('should initialize flux clone', () => {
    expect(filterService.fluxClone).to.be.an.instanceof(FluxCapacitor);
  });

  it('should extract configuration', () => {
    const filterConfig = { a: 'b' };
    filterService = new Filter(<any>{}, <any>{ tags: { filter: filterConfig } });

    expect(filterService.filterConfig).to.eq(filterConfig);
  });

  it('should default to empty configuration', () => {
    expect(filterService.filterConfig).to.eql({});
  });

  describe('init()', () => {
    it('should listen for results', () => {
      const flux: any = {
        on: (event, cb) => {
          expect(event).to.eq(Events.RESULTS);
          expect(cb).to.be.a('function');
        }
      };
      filterService = new Filter(flux, <any>{});

      filterService.init();
    });
  });

  describe('isTargetNav()', () => {
    it('should match navigation', () => {
      const navName = 'Brand';
      filterService = new Filter(<any>{}, <any>{ tags: { filter: { field: navName } } });

      expect(filterService.isTargetNav(navName)).to.be.true;
    });

    it('should not match navigation', () => {
      filterService = new Filter(<any>{}, <any>{ tags: { filter: { field: 'Brand' } } });

      expect(filterService.isTargetNav('Price')).to.be.false;
    });
  });

  describe('clone()', () => {
    it('should return a FluxCapacitor', () => {
      const collection = 'otherProducts';
      filterService = new Filter(<any>{}, <any>{ collection });

      const fluxClone = filterService.clone();

      expect(fluxClone).to.be.an.instanceof(FluxCapacitor);
      expect(fluxClone.query.raw.collection).to.eq(collection);
    });
  });

  describe('updateFluxClone()', () => {
    it('should update fluxClone state', () => {
      const parentQuery = 'red sneakers';
      filterService = new Filter(<any>{ query: new Query(parentQuery) }, <any>{});

      filterService.fluxClone.search = (query: string): any => {
        expect(query).to.eq(parentQuery);
        return { then: (cb: Function) => expect(cb).to.be.a('function') };
      };

      filterService.updateFluxClone();
      expect(filterService.fluxClone.query.raw.refinements).to.eql([]);
    });

    it('should update fluxClone state with refinements', () => {
      const parentQuery = 'red sneakers';
      const refinements: any = { a: 'b', c: 'd' };
      filterService = new Filter(<any>{
        query: new Query(parentQuery)
          .withSelectedRefinements(refinements)
      }, <any>{});

      filterService.fluxClone.search = (query: string): any => {
        expect(query).to.eq(parentQuery);
        return { then: (cb: Function) => expect(cb).to.be.a('function') };
      };

      filterService.isTargetNav = () => false;

      filterService.updateFluxClone();
      expect(filterService.fluxClone.query.raw.refinements).to.eql([refinements]);
    });
  });
});
