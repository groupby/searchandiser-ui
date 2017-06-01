import { expect } from 'chai';
import { Query } from 'groupby-api';
import { UrlBeautifier, DetailUrlGenerator, DetailUrlParser, Detail } from '../../../../src/utils/url-beautifier';
import { refinement } from '../../../utils/fixtures';

describe('detail URL beautifier', () => {
  let beautifier: UrlBeautifier;
  let query: Query;

  beforeEach(() => {
    beautifier = new UrlBeautifier();
    query = new Query();
  });

  describe('detail URL generator', () => {
    let generator: DetailUrlGenerator;

    beforeEach(() => generator = new DetailUrlGenerator(beautifier));

    it('should convert a simple detail to a URL', () => {
      expect(generator.build({ productTitle: 'red and delicious apples', productID: '1923' })).to.be.eq('/red-and-delicious-apples/1923');
    });

    it('should encode special characters + in detail', () => {
      expect(generator.build({ productTitle: 'red+and+delicious+apples', productID: '1923' })).to.be.eq('/red%2Band%2Bdelicious%2Bapples/1923');
    });

    it('should encode special characters / in detail', () => {
      expect(generator.build({ productTitle: 'red/and/delicious/apples', productID: '1923' })).to.be.eq('/red%2Fand%2Fdelicious%2Fapples/1923');
    });

    it('should convert a detail with refinements to a URL without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      expect(generator.build({ productTitle: 'satin shiny party dress', productID: '293014', refinements: [ refinement('colour', 'red') ] })).to.be.eq('/satin-shiny-party-dress/red/colour/293014');
    });

    it('should convert a detail with refinements to a URL and encode special characters without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      expect(generator.build({ productTitle: 'satin shiny party dress', productID: '293014', refinements: [ refinement('colour', 'red+green/blue') ] })).to.be.eq('/satin-shiny-party-dress/red%2Bgreen%2Fblue/colour/293014');
    });
  });

  describe('query URL parser', () => {
    let parser: DetailUrlParser;

    beforeEach(() => {
      parser = new DetailUrlParser(beautifier);
    });

    describe('error states', () => {

    });
  });
});
