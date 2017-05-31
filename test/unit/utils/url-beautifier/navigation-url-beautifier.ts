import { expect } from 'chai';
import { Query } from 'groupby-api';
import { UrlBeautifier, NavigationUrlGenerator, NavigationUrlParser } from '../../../../src/utils/url-beautifier';
import { refinement } from '../../../utils/fixtures';

describe('navigation URL beautifier', () => {
  let beautifier: UrlBeautifier;
  let query: Query;

  beforeEach(() => {
    beautifier = new UrlBeautifier();
    query = new Query();
  });

  describe('navigation URL generator', () => {
    let generator: NavigationUrlGenerator;

    beforeEach(() => generator = new NavigationUrlGenerator(beautifier));

    it('should convert a simple navigation name to a URL');
  });

  describe('query URL parser', () => {
    let parser: NavigationUrlParser;

    beforeEach(() => {
      parser = new NavigationUrlParser(beautifier)
      beautifier.config.navigations = {
        Apples: query
      };
    });

    it('should parse URL and return the associated query', () => {
      expect(parser.parse('/Apples')).to.be.eql(query);
    });

    describe('error states', () => {
      it('should parse URL and throw an error if associated query is not found', () => {
        expect(() => parser.parse('/Orange')).to.throw('no navigation mapping found for Orange');
      });

      it('should parse URL and throw an error if the path has more than one part', () => {
        expect(() => parser.parse('/Apples/Orange')).to.throw('path contains more than one part');
      })
    });
  });

  describe('compatibility', () => {

    beforeEach(() => beautifier = new UrlBeautifier(<any>{
      url: {
        beautifier: {
          refinementMapping: [{ b: 'brand' }, { f: 'fabric' }],
          queryToken: 'k',
          extraRefinementsParam: 'refs',
          suffix: 'index.html'
        }
      }
    }));

  });

  describe('configuration errors', () => {

  });
});
