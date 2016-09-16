import { Submit } from '../../../src/tags/submit/gb-submit';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-submit', Submit, { root: <any>{ addEventListener: () => null } }, ({ flux, tag }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag().label).to.eq('Search');
    expect(tag().staticSearch).to.be.false;
  });

  it('should allow override from opts', () => {
    const label = 'Submit query';
    tag().opts = { label, staticSearch: true };
    tag().init();

    expect(tag().label).to.eq(label);
    expect(tag().staticSearch).to.be.true;
  });

  it('should set label for input tag', () => {
    Object.assign(tag().root, { tagName: 'INPUT' });
    tag().init();

    expect(tag().root.value).to.eq('Search');
  });

  it('should listen for mount event', () => {
    tag().on = (event, cb) => {
      expect(event).to.eq('mount');
      expect(cb).to.eq(tag().setSearchBox);
    };
    tag().init();
  });

  it('should register click listener', () => {
    tag().root = <any>{
      addEventListener: (event, cb): any => {
        expect(event).to.eq('click');
        expect(cb).to.eq(tag().submitQuery);
      }
    };
    tag().init();
  });

  it('should submit query', () => {
    const query = 'something';
    flux().reset = (value): any => expect(value).to.eq(query);

    tag().searchBox = <HTMLInputElement>{ value: query };
    tag().init();

    tag().submitQuery();
    expect(tag().searchBox.value).to.eq(query);
  });

  it('should submit static query', () => {
    const newQuery = 'something';

    tag().searchBox = <HTMLInputElement>{ value: newQuery };
    tag().services = <any>{
      url: {
        active: () => true,
        update: (query, refinements) => {
          expect(query).to.eq(newQuery);
          expect(refinements.length).to.eq(0);
        }
      }
    };
    tag().init();
    tag().staticSearch = true;

    tag().submitQuery();
  });
});
