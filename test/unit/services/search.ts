import { SearchandiserConfig } from '../../../src/searchandiser';
import { Services } from '../../../src/services/init';
import { Search, RESET_EVENT } from '../../../src/services/search';
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

  describe('init()', () => {
    it('should subscribe to events', () => {
      const newQuery = 'banana';
      const reset = search.reset = spy();

      expectSubscriptions(() => search.init(), {
        [RESET_EVENT]: {
          test: (listener) => {
            listener(newQuery);

            expect(reset).to.be.calledWith(newQuery);
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
