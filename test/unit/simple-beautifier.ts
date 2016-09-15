import { SimpleBeautifier } from '../../src/simple-beautifier';
import { expect } from 'chai';
import { Query } from 'groupby-api';

describe('simple beautifier', () => {
  const urlConfig = { queryParam: 'q', searchUrl: 'search' };
  let beautifier: SimpleBeautifier;

  beforeEach(() => {
    beautifier = new SimpleBeautifier(<any>{ url: urlConfig });
  });

  describe('parse()', () => {
    it('should extract query from simple url', () => {
      const query = beautifier.parse('http://example.com/my/path?that=thing&q=hats&this=something');

      expect(query).to.be.an.instanceof(Query);
      expect(query.raw.query).to.eq('hats');
    });

    it('should extract query url with refinements', () => {
      const query = beautifier.parse('http://example.com/my/path?that=thing&q=hats&refinements=%5B%7B"type"%3A"Value"%2C"value"%3A"Baby"%7D%2C%7B"value"%3A"Red"%7D%5D');

      expect(query.raw.refinements).to.eql([
        { type: 'Value', value: 'Baby' },
        { value: 'Red' }
      ]);
    });

    it('should pass configuration with mask', () => {
      const query = new SimpleBeautifier(<any>{
        url: {},
        area: 'Prod',
        collection: 'onsale',
        other: 'blank'
      }).parse('example.com?q=this');

      expect(query.raw.area).to.eq('Prod');
      expect(query.raw.collection).to.eq('onsale');
      expect(query.raw['other']).to.not.be.ok;
    });
  });

  describe('build', () => {
    it('should build a simple query url', () => {
      const url = beautifier.build(new Query('my qüery'));
      expect(url).to.eq('search?q=my%20q%C3%BCery');
    });

    it('should build a url with refinements', () => {
      const query = new Query('my query')
        .withSelectedRefinements({ navigationName: 'brand', value: 'DeWalt', type: 'Value' });

      const url = beautifier.build(query);
      expect(url).to.eq('search?q=my%20query&refinements=%5B%7B%22navigationName%22%3A%22brand%22%2C%22value%22%3A%22DeWalt%22%2C%22type%22%3A%22Value%22%7D%5D');
    });
  });
});