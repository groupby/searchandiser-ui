import { DetailUrlGenerator, DetailUrlParser, UrlBeautifier } from '../../../../src/utils/url-beautifier';
import { refinement } from '../../../utils/fixtures';
import { expect } from 'chai';
import * as parseUri from 'parseUri';

describe('detail URL beautifier', () => {
  let beautifier: UrlBeautifier;
  let generator: DetailUrlGenerator;
  let parser: DetailUrlParser;

  beforeEach(() => {
    beautifier = new UrlBeautifier();
  });

  describe('detail URL generator', () => {

    beforeEach(() => generator = new DetailUrlGenerator(beautifier));

    it('should convert a simple detail to a URL', () => {
      expect(generator.build({
        productTitle: 'red and delicious apples',
        productId: '1923',
        refinements: []
      }))
        .to.eq('/red-and-delicious-apples/1923');
    });

    it('should encode special characters + in detail', () => {
      expect(generator.build({
        productTitle: 'red+and+delicious+apples',
        productId: '1923',
        refinements: []
      }))
        .to.eq('/red%2Band%2Bdelicious%2Bapples/1923');
    });

    it('should encode special characters / in detail', () => {
      expect(generator.build({
        productTitle: 'red/and/delicious/apples',
        productId: '1923',
        refinements: []
      }))
        .to.eq('/red%2Fand%2Fdelicious%2Fapples/1923');
    });

    it('should convert a detail with refinements to a URL without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      const url = generator.build({
        productTitle: 'satin shiny party dress',
        productId: '293014',
        refinements: [ refinement('colour', 'red') ]
      });

      expect(url).to.eq('/satin-shiny-party-dress/red/colour/293014');
    });

    it('should convert detail with refinements to a URL and encode special characters without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      const url = generator.build({
        productTitle: 'satin shiny party dress',
        productId: '293014',
        refinements: [refinement('colour', 'red+green/blue')]
      });

      expect(url).to.eq('/satin-shiny-party-dress/red%2Bgreen%2Fblue/colour/293014');
    });

    it('should convert a detail with a single refinement to a URL with a reference key', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      const url = generator.build({
        productTitle: 'dress',
        productId: '293014',
        refinements: [refinement('colour', 'red')]
      });

      expect(url).to.eq('/dress/red/c/293014');
    });

    it('should convert a detail with multiple refinements to a URL with reference keys', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' });
      const url = generator.build({
        productTitle: 'dress',
        productId: '293014',
        refinements: [refinement('colour', 'red'), refinement('brand', 'h&m') ]
      });

      expect(url).to.eq('/dress/h%26m/red/bc/293014');
    });

    describe('error states', () => {
      it('should throw an error if no reference key found for refinement navigation name', () => {
        const build = () => generator.build({
          productTitle: 'dress',
          productId: '293014',
          refinements: [refinement('colour', 'red')]
        });

        expect(build).to.throw('no mapping found for navigation "colour"');
      });
    });
  });

  describe('detail URL parser', () => {
    beforeEach(() => {
      parser = new DetailUrlParser(beautifier);
    });

    it('should parse a simple URL and return a detail object', () => {
      const expectedDetail = {
        productTitle: 'apples',
        productID: '1923',
        refinements: []
      };

      expect(parser.parse(parseUri('/apples/1923'))).to.eql(expectedDetail);
    });

    it('should parse a simple URL, replace \'-\' with \' \' and return a detail object', () => {
      const expectedDetail = {
        productTitle: 'red and delicious apples',
        productID: '1923',
        refinements: []
      };

      expect(parser.parse(parseUri('/red-and-delicious-apples/1923'))).to.eql(expectedDetail);
    });

    it('should parse a simple URL, decode special characters and return a detail object', () => {
      const expectedDetail = {
        productTitle: 'red+and+delicious+apples',
        productID: '1923',
        refinements: []
      };

      expect(parser.parse(parseUri('/red%2Band%2Bdelicious%2Bapples/1923'))).to.eql(expectedDetail);
    });

    it('should parse a URL with navigation names and values and return a detail object without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      const expectedDetail = {
        productTitle: 'satin shiny party dress',
        productID: '293014',
        refinements: [refinement('colour', 'blue')]
      };

      expect(parser.parse(parseUri('/satin-shiny-party-dress/blue/colour/293014'))).to.eql(expectedDetail);
    });

    it('should decode special characters in navigation name and values', () => {
      beautifier.config.useReferenceKeys = false;
      const url = '/satin-shiny-party-dress/h%26m/brand/blue/colour/red/colour/293014';
      const expectedDetail = {
        productTitle: 'satin shiny party dress',
        productID: '293014',
        refinements: [refinement('brand', 'h&m'), refinement('colour', 'blue'), refinement('colour', 'red')]
      };

      expect(parser.parse(parseUri(url))).to.eql(expectedDetail);
    });

    it('should parse a URL with reference keys', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' });
      const expectedDetail = {
        productTitle: 'dress',
        productID: '293014',
        refinements: [refinement('brand', 'h&m'), refinement('colour', 'blue'), refinement('colour', 'red')]
      };

      expect(parser.parse(parseUri('/dress/h%26m/blue/red/bcc/293014'))).to.eql(expectedDetail);
    });

    describe('error states', () => {
      it('should throw an error if the path has less than two parts', () => {
        expect(() => parser.parse(parseUri('/dress'))).to.throw('path has less than two parts');
      });

      it('should throw an error if the path without reference keys has an odd number of parts', () => {
        beautifier.config.useReferenceKeys = false;

        expect(() => parser.parse(parseUri('/dress/blue/colour/red/293014')))
          .to.throw('path has an odd number of parts');
      });

      it('should throw an error if the path has wrong number of parts', () => {
        expect(() => parser.parse(parseUri('/shoe/blue/colour'))).to.throw('path has wrong number of parts');
      });

      it('should throw an error if token reference is invalid', () => {
        expect(() => parser.parse(parseUri('/apples/green/cs/2931'))).to.throw('token reference is invalid');
      });
    });
  });

  describe('compatibility', () => {
    const obj = {
      productTitle: 'dress',
      productID: '293014',
      refinements: [
        refinement('brand', 'h&m'),
        refinement('colour', 'blue'),
        refinement('colour', 'red')
      ]
    };

    beforeEach(() => {
      generator = new DetailUrlGenerator(beautifier);
      parser = new DetailUrlParser(beautifier);
    });

    it('should convert from detail object to a URL and back with reference keys', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' });

      expect(parser.parse(parseUri(generator.build(obj)))).to.eql(obj);
    });

    it('should convert from URL to a detail and back with reference keys', () => {
      const url = '/dress/h%26m/blue/red/bcc/293014';
      beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' });

      expect(generator.build(parser.parse(parseUri(url)))).to.eq(url);
    });

    it('should convert from detail object to a URL and back without reference keys', () => {
      beautifier.config.useReferenceKeys = false;

      expect(parser.parse(parseUri(generator.build(obj)))).to.eql(obj);
    });

    it('should convert from URL to a detail and back without reference keys', () => {
      const url = '/dress/h%26m/brand/blue/colour/red/colour/293014';
      beautifier.config.useReferenceKeys = false;

      expect(generator.build(parser.parse(parseUri(url)))).to.eq(url);
    });
  });
});
