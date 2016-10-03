import { UrlBeautifier, UrlGenerator, UrlParser } from '../../../src/utils/url-beautifier';
import { expect } from 'chai';
import { Query, SelectedRangeRefinement, SelectedValueRefinement } from 'groupby-api';

describe('URL beautifier', () => {
  let beautifier: UrlBeautifier;
  let query: Query;

  beforeEach(() => {
    beautifier = new UrlBeautifier();
    query = new Query();
  });

  describe('URL generator', () => {
    let generator: UrlGenerator;

    beforeEach(() => generator = new UrlGenerator(beautifier));

    it('should convert a simple query to a URL', () => {
      query.withQuery('red apples');

      expect(generator.build(query)).to.eq('/red+apples/q');
    });

    it('should convert query with a slash to a URL', () => {
      query.withQuery('red/apples');

      expect(generator.build(query)).to.eq('/red%2Fapples/q');
    });

    it('should convert query with a plus to a URL', () => {
      query.withQuery('red+apples');

      expect(generator.build(query)).to.eq('/red%2Bapples/q');
    });

    it('should convert a simple query to a URL with a custom token', () => {
      beautifier.config.queryToken = 'a';
      query.withQuery('sneakers');

      expect(generator.build(query)).to.eq('/sneakers/a');
    });

    it('should convert a value refinement query to a URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      query.withSelectedRefinements(refinement('brand', 'DeWalt'));

      expect(generator.build(query)).to.eq('/DeWalt/b');
    });

    it('should convert a multiple refinements on same field a URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      query.withSelectedRefinements(refinement('brand', 'DeWalt'), refinement('brand', 'Henson'));

      expect(generator.build(query)).to.eq('/DeWalt/Henson/bb');
    });

    it('should convert a refinement with a slash to a URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      query.withSelectedRefinements(refinement('brand', 'De/Walt'));

      expect(generator.build(query)).to.eq('/De%2FWalt/b');
    });

    it('should convert a refinement with a plus to a URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      query.withSelectedRefinements(refinement('brand', 'De+Walt'));

      expect(generator.build(query)).to.eq('/De%2BWalt/b');
    });

    it('should convert a multiple refinement query to a URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' }, { h: 'height' });
      query.withSelectedRefinements(refinement('brand', 'Farmer John'), refinement('height', '20in'));

      expect(generator.build(query)).to.eq('/Farmer+John/20in/bh');
    });

    it('should convert query and refinements to a URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      query.withQuery('cool sneakers')
        .withSelectedRefinements(refinement('colour', 'green'));

      expect(generator.build(query)).to.eq('/cool+sneakers/green/qc');
    });

    it('should not convert range refinements to a URL', () => {
      beautifier.config.refinementMapping.push({ p: 'price' });
      query.withSelectedRefinements(refinement('price', 20, 40));

      expect(() => generator.build(query)).to.throw('cannot map range refinements');
    });

    it('should convert unmapped refinements to a query parameter', () => {
      query.withSelectedRefinements(refinement('colour', 'dark purple'), refinement('price', 100, 220));

      expect(generator.build(query)).to.eq('/?refinements=colour%3Ddark+purple~price%3A100..220');
    });

    describe('canonical URLs', () => {
      const ref1 = refinement('colour', 'orange');
      const ref2 = refinement('brand', 'DeWalt');
      const ref3 = refinement('category', 'Drills');

      it('should create canonical URLs', () => {
        beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' }, { h: 'category' });
        query.withSelectedRefinements(ref1, ref2, ref3);
        const otherQuery = new Query()
          .withSelectedRefinements(ref3, ref1, ref2);

        expect(generator.build(query)).to.eq(generator.build(otherQuery));
      });

      it('should create canonical URLs with multiple refinements on same field', () => {
        beautifier.config.refinementMapping.push({ b: 'brand' });
        query.withSelectedRefinements(refinement('brand', 'Henson'), refinement('brand', 'DeWalt'));

        expect(generator.build(query)).to.eq('/DeWalt/Henson/bb');
      });

      it('should create canonical query parameters', () => {
        query.withSelectedRefinements(ref1, ref2, ref3);
        const otherQuery = new Query()
          .withSelectedRefinements(ref3, ref1, ref2);

        expect(generator.build(query)).to.eq(generator.build(otherQuery));
      });

      it('should combine mapped and unmapped refinements with query and suffix', () => {
        beautifier.config.refinementMapping.push({ b: 'brand' }, { c: 'category' });
        beautifier.config.queryToken = 's';
        beautifier.config.extraRefinementsParam = 'refs';
        beautifier.config.suffix = 'index.php';
        query.withQuery('power drill')
          .withSelectedRefinements(ref1, ref3, ref2);
        const otherQuery = new Query('power drill')
          .withSelectedRefinements(ref2, ref1, ref3);

        const url = generator.build(query);
        expect(url).to.eq('/power+drill/DeWalt/Drills/sbc/index.php?refs=colour%3Dorange');
        expect(url).to.eq(generator.build(otherQuery));
      });
    });
  });

  describe('URL parser', () => {
    let parser: UrlParser;

    beforeEach(() => parser = new UrlParser(beautifier));

    it('should parse simple query URL', () => {
      query.withQuery('apples');

      expect(parser.parse('/apples/q').build()).to.eql(query.build());
    });

    it('should parse URL with a slash in the query', () => {
      query.withQuery('red/apples');

      expect(parser.parse('/red%2Fapples/q').build()).to.eql(query.build());
    });

    it('should parse URL with a plus in the query', () => {
      query.withQuery('red+apples');

      expect(parser.parse('/red%2Bapples/q').build()).to.eql(query.build());
    });

    it('should parse simple query URL with custom token', () => {
      beautifier.config.queryToken = 'c';

      expect(parser.parse('/sneakers/c').build()).to.eql(new Query('sneakers').build());
    });

    it('should extract a value refinement from URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      query.withSelectedRefinements(refinement('colour', 'green'));

      expect(parser.parse('/green/c').build()).to.eql(query.build());
    });

    it('should extract a multiple value refinements for field from URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      query.withSelectedRefinements(refinement('colour', 'green'), refinement('colour', 'blue'));

      expect(parser.parse('/green/blue/cc').build()).to.eql(query.build());
    });

    it('should extract a value refinement with a slash from URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      query.withSelectedRefinements(refinement('brand', 'De/Walt'));

      expect(parser.parse('/De%2FWalt/b').build()).to.eql(query.build());
    });

    it('should extract a value refinement with a plus from URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      query.withSelectedRefinements(refinement('brand', 'De+Walt'));

      expect(parser.parse('/De%2BWalt/b').build()).to.eql(query.build());
    });

    it('should extract multiple refinements from URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour', b: 'brand' });
      query.withSelectedRefinements(refinement('colour', 'dark purple'), refinement('brand', 'Wellingtons'));

      expect(parser.parse('/dark+purple/Wellingtons/cb').build()).to.eql(query.build());
    });

    it('should extract a query and refinement from URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      query.withQuery('sneakers')
        .withSelectedRefinements(refinement('colour', 'green'));

      expect(parser.parse('/sneakers/green/qc').build()).to.eql(query.build());
    });

    it('should extract unmapped query from URL parameters', () => {
      query.withSelectedRefinements(refinement('height', '20in'), refinement('price', 20, 30));

      expect(parser.parse('/?refinements=height%3D20in~price%3A20..30').build()).to.eql(query.build());
    });

    it('should ignore suffix', () => {
      beautifier.config.refinementMapping.push({ h: 'height' });
      beautifier.config.suffix = 'index.html';
      query.withSelectedRefinements(refinement('height', '20in'), refinement('price', 20, 30));

      expect(parser.parse('/20in/h/index.html?refinements=price%3A20..30').build()).to.eql(query.build());
    });

    it('should extract mapped and unmapped refinements with query and suffix', () => {
      beautifier.config.refinementMapping.push({ s: 'colour' }, { c: 'category' });
      beautifier.config.extraRefinementsParam = 'nav';
      beautifier.config.queryToken = 'n';
      beautifier.config.suffix = 'index.html';
      const refs = [refinement('category', 'Drills'), refinement('brand', 'DeWalt'), refinement('colour', 'orange')];

      const request = parser.parse('/power+drill/orange/Drills/nsc/index.html?nav=brand%3DDeWalt').build();
      expect(request.query).to.eql('power drill');
      expect(request.refinements).to.have.deep.members(refs);
    });

    it('should extract deeply nested URL', () => {
      const request = parser.parse('http://example.com/my/nested/path/power+drill/q').build();
      expect(request.query).to.eql('power drill');
    });

    it('should use existing configuration to create a query', () => {
      const collection = 'mycollection';
      const area = 'MyArea';
      Object.assign(beautifier.searchandiserConfig, { area, collection });
      query.withQuery('drills').withConfiguration({ area, collection });

      expect(parser.parse('/drills/q').build()).to.eql(query.build());
    });

    describe('error states', () => {
      it('should error on invalid reference keys', () => {
        beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' });

        expect(() => parser.parse('/power+drill/orange/Drills/qccb').build()).to.throw('token reference is invalid');
      });

      it('should error on unrecognized key', () => {
        beautifier.config.refinementMapping.push({ c: 'colour' });

        expect(() => parser.parse('/Drills/b').build()).to.throw('unexpected token \'b\' found in reference');
      });
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

    it('should convert from query to a URL and back', () => {
      query.withQuery('duvet cover')
        .withSelectedRefinements(
        refinement('brand', 'Duvet King'),
        refinement('fabric', 'linen'),
        refinement('price', 10, 40));

      const origRequest = query.build();
      const convertedRequest = beautifier.parse(beautifier.build(query)).build();
      expect(convertedRequest.query).to.eql(origRequest.query);
      expect(convertedRequest.refinements).to.have.deep.members(origRequest.refinements);
    });

    it('should convert from URL to a query and back', () => {
      const url = '/duvet+cover/Duvet+King/linen/kbf/index.html?refs=price%3A10..40';

      const convertedUrl = beautifier.build(beautifier.parse(url));
      expect(convertedUrl).to.eq(url);
    });
  });

  describe('configuration errors', () => {
    it('should not allow refinement mapping with non-character tokens', () => {
      const config: any = { url: { beautifier: { refinementMapping: [{ br: 'brand' }] } } };

      expect(() => new UrlBeautifier(config)).to.throw('refinement mapping token must be a single character');
    });

    it('should not allow refinement mapping with vowel tokens', () => {
      const config: any = { url: { beautifier: { refinementMapping: [{ u: 'brand' }] } } };

      expect(() => new UrlBeautifier(config)).to.throw('refinement mapping token must not be a vowel');
    });

    it('should not allow duplicate refinement tokens', () => {
      const config: any = {
        url: {
          beautifier: {
            refinementMapping: [
              { u: 'brand' },
              { u: 'price' }
            ]
          }
        }
      };

      expect(() => new UrlBeautifier(config)).to.throw('refinement mapping token must not be a vowel');
    });

    it('should not allow non-character query token', () => {
      const config: any = { url: { beautifier: { queryToken: 'qu' } } };

      expect(() => new UrlBeautifier(config)).to.throw('query token must be a single character');
    });

    it('should not allow vowel query token', () => {
      const config: any = { url: { beautifier: { queryToken: 'e' } } };

      expect(() => new UrlBeautifier(config)).to.throw('query token must not be a vowel');
    });

    it('should not allow duplicates between query and refinement tokens', () => {
      const config: any = {
        url: {
          beautifier: {
            queryToken: 'k',
            refinementMapping: [{ k: 'brand' }]
          }
        }
      };

      expect(() => new UrlBeautifier(config)).to.throw('query token must be unique from refinement tokens');
    });
  });

  function refinement(field: string, value: string): SelectedValueRefinement;
  function refinement(field: string, low: number, high: number): SelectedRangeRefinement;
  function refinement(navigationName: string, valueOrLow: any, high?: number): any {
    if (high) {
      return { navigationName, low: valueOrLow, high, type: 'Range' };
    } else {
      return { navigationName, value: valueOrLow, type: 'Value' };
    }
  }
});
