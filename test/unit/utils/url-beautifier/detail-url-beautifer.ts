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
      expect(generator.build({ productTitle: 'red and delicious apples', productID: '1923' })).to.eq('/red-and-delicious-apples/1923');
    });

    it('should encode special characters + in detail', () => {
      expect(generator.build({ productTitle: 'red+and+delicious+apples', productID: '1923' })).to.eq('/red%2Band%2Bdelicious%2Bapples/1923');
    });

    it('should encode special characters / in detail', () => {
      expect(generator.build({ productTitle: 'red/and/delicious/apples', productID: '1923' })).to.eq('/red%2Fand%2Fdelicious%2Fapples/1923');
    });

    it('should convert a detail with refinements to a URL without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      const url = generator.build({ productTitle: 'satin shiny party dress', productID: '293014', refinements: [ refinement('colour', 'red') ] });
      expect(url).to.eq('/satin-shiny-party-dress/red/colour/293014');
    });

    it('should convert a detail with refinements to a URL and encode special characters without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      const url = generator.build({ productTitle: 'satin shiny party dress', productID: '293014', refinements: [ refinement('colour', 'red+green/blue') ] });
      expect(url).to.eq('/satin-shiny-party-dress/red%2Bgreen%2Fblue/colour/293014');
    });

    it('should convert a detail with a single refinement to a URL with a reference key', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      const url = generator.build({ productTitle: 'dress', productID: '293014', refinements: [ refinement('colour', 'red') ] });
      expect(url).to.eq('/dress/red/c/293014');
    });

    it('should convert a detail with multiple refinements to a URL with reference keys', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' });
      const url = generator.build({ productTitle: 'dress', productID: '293014', refinements: [ refinement('colour', 'red'), refinement('brand', 'h&m') ] });
      expect(url).to.eq('/dress/h%26m/red/bc/293014');
    });

    describe('error states', () => {
      it('should throw an error if no reference key found for refinement navigation name', () => {
        const build = () => generator.build({ productTitle: 'dress', productID: '293014', refinements: [ refinement('colour', 'red') ] });
        expect(build).to.throw('no mapping found for navigation "colour"');
      });
    });
  });

  describe('detail URL parser', () => {
    let parser: DetailUrlParser;

    beforeEach(() => {
      parser = new DetailUrlParser(beautifier);
    });

    it('should parse a simple URL and return a detail object', () => {
      const expectedDetail = { productTitle: 'apples', productID: '1923' };
      expect(parser.parse('/apples/1923')).to.eql(expectedDetail);
    });

    it('should parse a simple URL, replace \'-\' with \' \' and return a detail object', () => {
      const expectedDetail = { productTitle: 'red and delicious apples', productID: '1923' };
      expect(parser.parse('/red-and-delicious-apples/1923')).to.eql(expectedDetail);
    });

    it('should parse a simple URL, decode special characters and return a detail object', () => {
      const expectedDetail = { productTitle: 'red+and+delicious+apples', productID: '1923' };
      expect(parser.parse('/red%2Band%2Bdelicious%2Bapples/1923')).to.eql(expectedDetail);
    });

    it('should parse a URL with navigation names and values and return a detail object without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      const expectedDetail = { productTitle: 'satin shiny party dress', productID: '293014', refinements: [ refinement('colour', 'blue') ] };
      expect(parser.parse('/satin-shiny-party-dress/blue/colour/293014')).to.eql(expectedDetail);
    });

    it('should decode special characters in navigation name and values', () => {
      beautifier.config.useReferenceKeys = false;
      const expectedDetail = { productTitle: 'satin shiny party dress', productID: '293014', refinements: [ refinement('brand', 'h&m'), refinement('colour', 'blue'), refinement('colour', 'red') ] };
      expect(parser.parse('/satin-shiny-party-dress/h%26m/brand/blue/colour/red/colour/293014')).to.eql(expectedDetail);
    });

    it('should parse a URL with reference keys', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' })
      const expectedDetail = { productTitle: 'dress', productID: '293014', refinements: [ refinement('brand', 'h&m'), refinement('colour', 'blue'), refinement('colour', 'red') ] };
      expect(parser.parse('/dress/h%26m/blue/red/bcc/293014')).to.eql(expectedDetail);
    });

    describe('error states', () => {
      it('should throw an error if the path has less than two parts', () => {
        expect(() => parser.parse('/dress')).to.throw('path has less than two parts');
      });

      it('should throw an error if the path without reference keys has an odd number of parts', () => {
        beautifier.config.useReferenceKeys = false;
        expect(() => parser.parse('/dress/blue/colour/red/293014')).to.throw('path has an odd number of parts');
      });

      it('should throw an error if the path has wrong number of parts', () => {
        expect(() => parser.parse('/shoe/blue/colour')).to.throw('path has wrong number of parts');
      });

      it('should throw an error if token reference is invalid', () => {
        expect(() => parser.parse('/apples/green/cs/2931')).to.throw('token reference is invalid');
      })
    });
  });
});
