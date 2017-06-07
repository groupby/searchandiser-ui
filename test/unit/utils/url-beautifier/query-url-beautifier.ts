import { QueryUrlGenerator, QueryUrlParser, UrlBeautifier } from '../../../../src/utils/url-beautifier';
import { refinement } from '../../../utils/fixtures';
import { expect } from 'chai';
import { Query } from 'groupby-api';
import * as parseUri from 'parseUri';

describe('query URL beautifier', () => {
  let beautifier: UrlBeautifier;
  let query: Query;
  let generator: QueryUrlGenerator;
  let parser: QueryUrlParser;

  beforeEach(() => {
    beautifier = new UrlBeautifier();
    query = new Query();
  });

  describe('query URL generator', () => {
    beforeEach(() => generator = new QueryUrlGenerator(beautifier));

    it('should convert a simple query to a URL', () => {
      query.withQuery('red apples');

      expect(generator.build(query)).to.eq('/red-apples/q');
    });

    it('should convert a simple query to a URL without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      query.withQuery('red apples');

      expect(generator.build(query)).to.eq('/red-apples');
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

    it('should convert a multiple refinements on same field a URL without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      query.withQuery('tool')
        .withSelectedRefinements(refinement('brand', 'DeWalt'), refinement('brand', 'Henson'));

      expect(generator.build(query)).to.eq('/tool/DeWalt/brand/Henson/brand');
    });

    it('should convert a sorted refinements list on same field a URL without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      query.withQuery('shoe')
        .withSelectedRefinements(
          refinement('colour', 'blue'),
          refinement('Brand', 'nike'),
          refinement('Brand', 'adidas'),
          refinement('colour', 'red')
        );

      expect(generator.build(query)).to.eq('/shoe/adidas/Brand/nike/Brand/blue/colour/red/colour');
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

      expect(generator.build(query)).to.eq('/Farmer-John/20in/bh');
    });

    it('should convert query and refinements to a URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      query.withQuery('cool sneakers')
        .withSelectedRefinements(refinement('colour', 'green'));

      expect(generator.build(query)).to.eq('/cool-sneakers/green/qc');
    });

    it('should not convert range refinements to a URL', () => {
      beautifier.config.refinementMapping.push({ p: 'price' });
      query.withSelectedRefinements(refinement('price', 20, 40));

      expect(() => generator.build(query)).to.throw('cannot map range refinements');
    });

    it('should convert unmapped refinements to a query parameter', () => {
      query.withSelectedRefinements(refinement('colour', 'dark purple'), refinement('price', 100, 220));

      expect(generator.build(query)).to.eq('/?refinements=colour%3Adark-purple~price%3A100..220');
    });

    it('should convert pageSize to a query parameter', () => {
      query.withPageSize(24);

      expect(generator.build(query)).to.eq('/?page_size=24');
    });

    it('should convert skip to a query parameter', () => {
      const skip = 32;
      const page = 4;

      query.skip(skip);

      expect(generator.build(query)).to.eq(`/?page=${page}`);
    });

    it('should convert skip and pageSize to a query parameter', () => {
      const pageSize = 30;
      const skip = 32;
      const page = 2;

      query.withPageSize(pageSize);
      query.skip(skip);

      expect(generator.build(query)).to.eq(`/?page=${page}&page_size=${pageSize}`);
    });

    it('should convert query with skip, page size and unmapped refinements to a URL without reference keys', () => {
      const pageSize = 6;
      const skip = 6;
      const page = 2;

      beautifier.config.useReferenceKeys = false;
      query.withPageSize(pageSize);
      query.skip(skip);
      query.withQuery('red apples')
        .withSelectedRefinements(refinement('colour', 'dark purple'), refinement('price', 100, 220));

      expect(generator.build(query))
        .to.eq(`/red-apples/dark-purple/colour?page=${page}&page_size=${pageSize}&refinements=price%3A100..220`);
    });

    it('should convert query with unmapped refinements to a URL with reference keys', () => {
      beautifier.config.refinementMapping.push({ c: 'category' });
      query.withQuery('long red dress')
        .withSelectedRefinements(
          refinement('category', 'evening wear'),
          refinement('category', 'formal'),
          refinement('size', 'large'),
          refinement('shipping', 'true')
        );

      expect(generator.build(query))
        .to.eq(`/long-red-dress/evening-wear/formal/qcc?refinements=shipping%3Atrue~size%3Alarge`);
    });

    describe('canonical URLs', () => {
      const ref1 = refinement('colour', 'orange');
      const ref2 = refinement('brand', 'DeWalt');
      const ref3 = refinement('category', 'Drills');

      it('should create canonical URLs', () => {
        const otherQuery = new Query()
          .withSelectedRefinements(ref3, ref1, ref2);
        beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' }, { h: 'category' });
        query.withSelectedRefinements(ref1, ref2, ref3);

        expect(generator.build(query)).to.eq(generator.build(otherQuery));
      });

      it('should create canonical URLs with multiple refinements on same field', () => {
        beautifier.config.refinementMapping.push({ b: 'brand' });
        query.withSelectedRefinements(refinement('brand', 'Henson'), refinement('brand', 'DeWalt'));

        expect(generator.build(query)).to.eq('/DeWalt/Henson/bb');
      });

      it('should create canonical query parameters', () => {
        const otherQuery = new Query()
          .withSelectedRefinements(ref3, ref1, ref2);
        query.withSelectedRefinements(ref1, ref2, ref3);

        expect(generator.build(query)).to.eq(generator.build(otherQuery));
      });

      it('should combine mapped and unmapped refinements with query and suffix', () => {
        const otherQuery = new Query('power drill')
          .withSelectedRefinements(ref2, ref1, ref3);
        query.withQuery('power drill')
          .withSelectedRefinements(ref1, ref3, ref2);
        beautifier.config.refinementMapping.push({ b: 'brand' }, { c: 'category' });
        beautifier.config.queryToken = 's';
        beautifier.config.extraRefinementsParam = 'refs';
        beautifier.config.suffix = 'index.php';

        const url = generator.build(query);

        expect(url).to.eq('/power-drill/DeWalt/Drills/sbc/index.php?refs=colour%3Aorange');
        expect(url).to.eq(generator.build(otherQuery));
      });
    });
  });

  describe('query URL parser', () => {
    beforeEach(() => parser = new QueryUrlParser(beautifier));

    it('should parse simple query URL', () => {
      query.withQuery('apples');

      expect(parser.parse(parseUri('/apples/q')).build()).to.eql(query.build());
    });

    it('should parse URL with a slash in the query', () => {
      query.withQuery('red/apples');

      expect(parser.parse(parseUri('/red%2Fapples/q')).build()).to.eql(query.build());
    });

    it('should parse URL with a plus in the query', () => {
      query.withQuery('red+apples');

      expect(parser.parse(parseUri('/red%2Bapples/q')).build()).to.eql(query.build());
    });

    it('should parse simple query URL with dash and without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      query.withQuery('red apples');

      expect(parser.parse(parseUri('/red-apples')).build()).to.eql(query.build());
    });

    it('should parse simple query URL with custom token', () => {
      beautifier.config.queryToken = 'c';

      expect(parser.parse(parseUri('/sneakers/c')).build()).to.eql(new Query('sneakers').build());
    });

    it('should extract a value refinement from URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      query.withSelectedRefinements(refinement('colour', 'green'));

      expect(parser.parse(parseUri('/green/c')).build()).to.eql(query.build());
    });

    it('should extract a multiple value refinements for field from URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      query.withSelectedRefinements(refinement('colour', 'green'), refinement('colour', 'blue'));

      expect(parser.parse(parseUri('/green/blue/cc')).build()).to.eql(query.build());
    });

    it('should extract a value refinement with a slash from URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      query.withSelectedRefinements(refinement('brand', 'De/Walt'));

      expect(parser.parse(parseUri('/De%2FWalt/b')).build()).to.eql(query.build());
    });

    it('should extract a value refinement with a plus from URL', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      query.withSelectedRefinements(refinement('brand', 'De+Walt'));

      expect(parser.parse(parseUri('/De%2BWalt/b')).build()).to.eql(query.build());
    });

    it('should extract multiple refinements from URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour', b: 'brand' });
      query.withSelectedRefinements(refinement('colour', 'dark purple'), refinement('brand', 'Wellingtons'));

      expect(parser.parse(parseUri('/dark-purple/Wellingtons/cb')).build()).to.eql(query.build());
    });

    it('should extract a query and refinement from URL', () => {
      beautifier.config.refinementMapping.push({ c: 'colour' });
      query.withQuery('sneakers')
        .withSelectedRefinements(refinement('colour', 'green'));

      expect(parser.parse(parseUri('/sneakers/green/qc')).build()).to.eql(query.build());
    });

    it('should extract query and value refinements from URL without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      query.withQuery('shoe')
        .withSelectedRefinements(
          refinement('colour', 'blue'),
          refinement('colour', 'red'),
          refinement('Brand', 'adidas'),
          refinement('Brand', 'nike')
        );

      expect(parser.parse(parseUri('/shoe/blue/colour/red/colour/adidas/Brand/nike/Brand')).build())
        .to.eql(query.build());
    });

    it('should extract value refinements from URL without reference keys', () => {
      beautifier.config.useReferenceKeys = false;
      query.withSelectedRefinements(
        refinement('colour', 'blue'),
        refinement('colour', 'red'),
        refinement('Brand', 'adidas'),
        refinement('Brand', 'nike')
      );

      expect(parser.parse(parseUri('/blue/colour/red/colour/adidas/Brand/nike/Brand')).build()).to.eql(query.build());
    });

    it('should extract unmapped query from URL parameters', () => {
      query.withSelectedRefinements(refinement('height', '20in'), refinement('price', 20, 30));

      expect(parser.parse(parseUri('/?refinements=height%3A20in~price%3A20..30')).build()).to.eql(query.build());
    });

    it('should extract query and range refinements from URL without reference key', () => {
      const url = '/long-red-dress/evening-wear/category/formal/category?refinements=price:50..200';
      beautifier.config.useReferenceKeys = false;
      query.withQuery('long red dress')
        .withSelectedRefinements(
          refinement('category', 'evening wear'),
          refinement('category', 'formal'),
          refinement('price', 50, 200)
        );

      expect(parser.parse(parseUri(url)).build()).to.eql(query.build());
    });

    it('should extract page size from URL', () => {
      const pageSize = 5;
      query.withPageSize(pageSize);

      expect(parser.parse(parseUri(`/?page_size=${pageSize}`)).build()).to.eql(query.build());
    });

    it('should extract page from URL', () => {
      const skip = 10;
      const page = 2;
      query.skip(skip);

      expect(parser.parse(parseUri(`/?page=${page}`)).build()).to.eql(query.build());
    });

    it('should extract page and page size from URL', () => {
      const page = 3;
      const pageSize = 6;
      const skip = (page - 1) * pageSize;
      query.skip(skip)
        .withPageSize(pageSize);

      expect(parser.parse(parseUri(`/?page=${page}&page_size=${pageSize}`)).build()).to.eql(query.build());
    });

    it('should ignore suffix', () => {
      beautifier.config.refinementMapping.push({ h: 'height' });
      beautifier.config.suffix = 'index.html';
      query.withSelectedRefinements(refinement('height', '20in'), refinement('price', 20, 30));

      expect(parser.parse(parseUri('/20in/h/index.html?refinements=price%3A20..30')).build()).to.eql(query.build());
    });

    it('should extract mapped and unmapped refinements with query and suffix', () => {
      const refs = [refinement('category', 'Drills'), refinement('brand', 'DeWalt'), refinement('colour', 'orange')];
      beautifier.config.refinementMapping.push({ s: 'colour' }, { c: 'category' });
      beautifier.config.extraRefinementsParam = 'nav';
      beautifier.config.queryToken = 'n';
      beautifier.config.suffix = 'index.html';

      const request = parser.parse(parseUri('/power-drill/orange/Drills/nsc/index.html?nav=brand%3ADeWalt')).build();

      expect(request.query).to.eql('power drill');
      expect(request.refinements).to.have.deep.members(refs);
    });

    it('should extract mapped and unmapped refinements with query and suffix from URL without reference keys', () => {
      const url = '/power-drill/DeWalt/brand/Drills/category/orange/colour/index.html';
      beautifier.config.suffix = 'index.html';
      beautifier.config.useReferenceKeys = false;
      query.withQuery('power drill')
        .withSelectedRefinements(
          refinement('brand', 'DeWalt'),
          refinement('category', 'Drills'),
          refinement('colour', 'orange')
        );

      expect(parser.parse(parseUri(url)).build()).to.eql(query.build());
    });

    it('should extract deeply nested URL', () => {
      const request = parser.parse(parseUri('http://example.com/my/nested/path/power-drill/q')).build();

      expect(request.query).to.eql('power drill');
    });

    it('should use existing configuration to create a query', () => {
      const collection = 'mycollection';
      const area = 'MyArea';
      Object.assign(beautifier.searchandiserConfig, { area, collection });
      query.withQuery('drills').withConfiguration({ area, collection });

      expect(parser.parse(parseUri('/drills/q')).build()).to.eql(query.build());
    });

    describe('error states', () => {
      it('should error on invalid reference keys', () => {
        beautifier.config.refinementMapping.push({ c: 'colour' }, { b: 'brand' });

        expect(() => parser.parse(parseUri('/power-drill/orange/Drills/qccb')).build())
          .to.throw('token reference is invalid');
      });

      it('should error on unrecognized key', () => {
        beautifier.config.refinementMapping.push({ c: 'colour' });

        expect(() => parser.parse(parseUri('/Drills/b')).build()).to.throw('unexpected token \'b\' found in reference');
      });
    });
  });

  describe('compatibility', () => {

    beforeEach(() => {
      generator = new QueryUrlGenerator(beautifier);
      parser = new QueryUrlParser(beautifier);
      query = new Query();
      query.withQuery('dress')
        .withSelectedRefinements(refinement('brand', 'h&m'));
    });

    it('should convert from query object to a URL and back with reference keys', () => {
      beautifier.config.refinementMapping.push({ b: 'brand' });
      expect(parser.parse(parseUri(generator.build(query)))).to.eql(query);
    });

    it('should convert from URL to a query and back with reference keys', () => {
      const url = '/dress/h%26m/qb';
      beautifier.config.refinementMapping.push({ b: 'brand' });

      expect(generator.build(parser.parse(parseUri(url)))).to.eq(url);
    });

    it('should convert from query object to a URL and back without reference keys', () => {
      beautifier.config.useReferenceKeys = false;

      expect(parser.parse(parseUri(generator.build(query)))).to.eql(query);
    });

    it('should convert from URL to a query and back without reference keys', () => {
      const url = '/dress/h%26m/brand';
      beautifier.config.useReferenceKeys = false;

      expect(generator.build(parser.parse(parseUri(url)))).to.eq(url);
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
});
