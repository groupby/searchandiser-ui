import { SearchandiserConfig } from '../../../src/searchandiser';
import { Services } from '../../../src/services/init';
import { DIRECT_MAPPINGS, REFINE_EVENT, RESET_EVENT, Search } from '../../../src/services/search';
import { expectSubscriptions } from '../../utils/expectations';
import suite from './_suite';
import { expect } from 'chai';
import { FluxCapacitor } from 'groupby-api';

suite('search', ({ spy, stub }) => {
  let search: Search;
  let flux: FluxCapacitor;
  let config: SearchandiserConfig;
  let services: Services;

  beforeEach(() => {
    flux = <any>{};
    config = <any>{};
    services = <any>{};
    search = new Search(flux, config, services);
  });

  describe('constructor()', () => {
    it('should pass through values', () => {
      const baseConfig: any = DIRECT_MAPPINGS.reduce((base, prop) =>
        Object.assign(base, { [prop]:  Math.random() }), {});

      const service = new Search(<any>{}, baseConfig, <any>{});

      expect(service._config).to.eql(baseConfig);
    });

    it('should use config.pageSize', () => {
      const service = new Search(<any>{}, <any>{ pageSize: 30}, <any>{});

      expect(service._config.pageSize).to.eq(30);
    });

    it('should use first of config.pageSizes', () => {
      const service = new Search(<any>{}, <any>{ pageSizes: [40] }, <any>{});

      expect(service._config.pageSize).to.eq(40);
    });

    it('should use first of config.sort', () => {
      const sort = { field: 'brand', value: 'Zipper' };

      const service = new Search(<any>{}, <any>{ sort: [sort] }, <any>{});

      expect(service._config.sort).to.eq(sort);
    });

    it('should use first sort component item', () => {
      const sort = { field: 'brand', value: 'Zipper' };

      const service = new Search(<any>{}, <any>{
        tags: { sort: { items: [{ value: sort }] } }
      }, <any>{});

      expect(service._config.sort).to.eq(sort);
    });

    it('should remove undefined and null values', () => {
      const baseConfig: any = {
        area: 'b',
        collection: null,
        language: undefined,
        fields: 0,
        visitorId: false,
        sessionId: ''
      };

      const service = new Search(<any>{}, baseConfig, <any>{});

      expect(service._config).to.eql({
        area: 'b',
        fields: 0,
        visitorId: false,
        sessionId: ''
      });
    });
  });

  describe('init()', () => {
    it('should subscribe to events', () => {
      const newQuery = 'banana';
      const reset = search.reset = spy();
      const refine = search.refine = spy();

      expectSubscriptions(() => search.init(), {
        [RESET_EVENT]: {
          test: (listener) => {
            listener(newQuery);

            expect(reset).to.be.calledWith(newQuery);
          }
        },
        [REFINE_EVENT]: {
          test: (listener) => {
            listener(newQuery);

            expect(refine).to.be.calledWith(newQuery);
          }
        }
      }, flux);
    });
  });

  describe('reset()', () => {
    it('should call flux.reset()', () => {
      const newQuery = 'apple';
      const reset = flux.reset = stub().resolves();

      search.reset(newQuery)
        .then(() => expect(reset).to.be.calledWith(newQuery));
    });

    it('should call tracker.search() if tracker is available', () => {
      const searchBeacon = spy();
      flux.reset = stub().resolves();
      services.tracker = <any>{ search: searchBeacon };

      search.reset('')
        .then(() => expect(searchBeacon).to.be.called);
    });
  });
});
