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
      const query = 'apple';
      const reset = flux.reset = stub().resolves();

      search.reset(query)
        .then(() => expect(reset).to.be.calledWith(query));
    });

    it('should emit tracker event', () => {
      const emit = stub(search, 'emit');
      flux.reset = stub().resolves();

      search.reset('')
        .then(() => expect(emit).to.be.calledWith('search'));
    });

    it('should allow overriding origin', () => {
      const origin = 'sayt';
      const emit = stub(search, 'emit');
      flux.reset = stub().resolves();

      search.reset({ query: '', origin })
        .then(() => expect(emit).to.be.calledWith(origin));
    });

    it('should update url', () => {
      const update = spy();
      const query: any = { a: 'b' };
      stub(search, 'emit');
      flux.reset = stub().resolves();
      flux.query = query;
      services.url = <any>{ update };

      search.reset('')
        .then(() => expect(update).to.be.calledWith(query));
    });
  });

  describe('refine()', () => {
    it('should call flux.rewrite()', (done) => {
      const query = 'apple';
      const rewrite = flux.rewrite = stub().resolves();
      stub(search, 'emit');
      flux.refine = (): any => expect.fail();
      services.url = <any>{ update: () => null };

      search.refine({ query })
        .then(() => {
          expect(rewrite).to.be.calledWith(query, { skipSearch: false });
          done();
        });
    });

    it('should call flux.refine()', (done) => {
      const query = 'apple';
      const refinement = { a: 'b' };
      const rewrite = flux.rewrite = stub().resolves();
      const refine = flux.refine = spy();
      stub(search, 'emit');
      services.url = <any>{ update: () => null };

      search.refine({ query, refinement })
        .then(() => {
          expect(rewrite).to.be.calledWith(query, { skipSearch: true });
          expect(refine).to.be.calledWith(refinement, { skipSearch: false });
          done();
        });
    });

    it('should call flux.refine() for each refinement', (done) => {
      const query = 'apple';
      const refinement1 = { a: 'b' };
      const refinement2 = { c: 'd' };
      const refinement3 = { e: 'f' };
      const rewrite = flux.rewrite = stub().resolves();
      const refine = flux.refine = spy();
      stub(search, 'emit');
      services.url = <any>{ update: () => null };

      search.refine({ query, refinements: [refinement1, refinement2, refinement3] })
        .then(() => {
          expect(rewrite).to.be.calledWith(query, { skipSearch: true });
          expect(refine).to.be.calledWith(refinement1, { skipSearch: true });
          expect(refine).to.be.calledWith(refinement2, { skipSearch: true });
          expect(refine).to.be.calledWith(refinement3, { skipSearch: false });
          done();
        });
    });

    it('should emit tracker event', (done) => {
      const emit = stub(search, 'emit');
      flux.rewrite = stub().resolves();
      flux.refine = spy();
      services.url = <any>{ update: () => null };

      search.refine({ query: '', refinement: {} })
        .then(() => {
          expect(emit).to.be.calledWith('search');
          done();
        });
    });

    it('should allow overriding origin', (done) => {
      const origin = 'sayt';
      const emit = stub(search, 'emit');
      flux.rewrite = stub().resolves();
      flux.refine = spy();
      services.url = <any>{ update: () => null };

      search.refine({ query: '', refinement: {}, origin })
        .then(() => {
          expect(emit).to.be.calledWith(origin);
          done();
        });
    });

    it('should update url', (done) => {
      const update = spy();
      const query: any = { a: 'b' };
      stub(search, 'emit');
      flux.rewrite = stub().resolves();
      flux.refine = spy();
      flux.query = query;
      services.url = <any>{ update };

      search.refine({ query: '', refinement: {}, origin: 'search' })
        .then(() => {
          expect(update).to.be.calledWith(query);
          done();
        });
    });
  });

  describe('emit()', () => {
    it('should call tracker.sayt()', () => {
      const sayt = spy();
      services.tracker = <any>{ sayt };

      search.emit('sayt');

      expect(sayt).to.have.been.called;
    });

    it('should fallback to tracker.sendSearchEvent()', () => {
      const sendSearchEvent = spy();
      services.tracker = <any>{ sendSearchEvent };

      search.emit('other');

      expect(sendSearchEvent).to.have.been.calledWith('other');
    });

    it('should only accept string events', () => {
      services.tracker = <any>{};

      expect(() => search.emit(<any>(() => null))).to.not.throw();
    });

    it('should check for the tracker service', () => {
      expect(() => search.emit('sayt')).to.not.throw();
    });
  });
});
