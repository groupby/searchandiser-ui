import * as utils from '../../../src/utils/common';
import { ProductTransformer } from '../../../src/utils/product-transformer';
import { expect } from 'chai';

const STRUCT = {
  price: 'productPrice',
  brand: 'brand',
  image: 'child.image'
};

describe('ProductTransformer', () => {
  let transformer: ProductTransformer;
  let sandbox: Sinon.SinonSandbox;

  beforeEach(() => {
    transformer = new ProductTransformer(STRUCT);
    sandbox = sinon.sandbox.create();
  });
  afterEach(() => sandbox.restore());

  describe('on construction', () => {
    it('should have default values', () => {
      expect(transformer.structure.id).to.eql('id');
      expect(transformer.productTransform).to.be.a('function');
      expect(transformer.hasVariants).to.be.false;
      expect(transformer.variantStructure).to.eq(transformer.structure);
      expect(transformer.variantTransform).to.be.a('function');
      expect(transformer.idField).to.eq('id');
    });

    it('should be able to override default values', () => {
      const struct = Object.assign({ id: 'productId' }, STRUCT);

      transformer = new ProductTransformer(struct);

      expect(transformer.structure).to.eql(struct);
    });

    it('should accept tranform override from struct', () => {
      const struct = Object.assign({ _transform: () => null }, STRUCT);

      transformer = new ProductTransformer(struct);

      expect(transformer.productTransform).to.eq(struct._transform);
    });

    it('should recognize configured variants', () => {
      const _variantStructure = { title: 'innerTitle' };
      const struct = Object.assign({ variants: 'child', _variantStructure }, STRUCT);

      transformer = new ProductTransformer(struct);

      expect(transformer.hasVariants).to.be.true;
      expect(transformer.variantStructure).to.eq(_variantStructure);
      expect(transformer.variantTransform).to.be.a('function');
      expect(transformer.idField).to.eq('id');
    });

    it('should recognize variant _transform', () => {
      const _transform = (meta) => meta;
      const struct = Object.assign({ variants: 'child', _variantStructure: { _transform } }, STRUCT);

      transformer = new ProductTransformer(struct);

      expect(transformer.variantTransform).to.eq(_transform);
    });

    it('should recognize configured variants with unique id', () => {
      const struct = Object.assign({
        variants: 'child',
        _variantStructure: { id: 'variantId' }
      }, STRUCT);

      transformer = new ProductTransformer(struct);

      expect(transformer.idField).to.eq('child.variantId');
    });
  });

  describe('transform()', () => {
    const VARIANTS = [{
      title: 'Green Shoes',
      price: '$1',
      image: 'image.tiff',
      url: 'about:blank'
    }, {
      title: 'Purple Shoes',
      price: '$1',
      image: 'image.tiff',
      url: 'about:blank'
    }, {
      title: 'Green Moccasins',
      price: '$2',
      image: 'image.svg',
      url: 'about:mozilla'
    }, {
      title: 'Yellow Shoes',
      price: '$1',
      image: 'image.tiff',
      url: 'about:blank'
    }];
    const VARIANT_META = {
      title: 'Orange Chili',
      price: '$3',
      image: 'image.bmp',
      variants: VARIANTS
    };

    beforeEach(() => transformer = new ProductTransformer({
      title: 'title',
      price: 'price',
      image: 'image'
    }));

    it('should return default values', () => {
      const allMeta = {
        title: 'Red Slippers',
        price: '$12',
        image: 'thumbnail.png'
      };

      const variants = transformer.transform(allMeta);

      expect(variants).to.eql([allMeta]);
    });

    it('should call productTransform()', () => {
      const transformedMeta = { a: 'b', c: 'd' };
      const productTransform = transformer.productTransform = sinon.spy(() => transformedMeta);

      transformer.transform(VARIANT_META);

      expect(productTransform).to.be.calledWith(VARIANT_META);
    });

    it('should call unpackVariants()', () => {
      const variants = [{ a: 'b' }, { c: 'd' }];
      const unpackVariants = transformer.unpackVariants = sinon.spy(() => variants);

      transformer.transform(VARIANT_META);

      expect(unpackVariants).to.be.calledWith(VARIANT_META);
    });
  });

  describe('unpackVariants()', () => {
    const STRUCT_WITH_VARIANTS = {
      variants: 'variants',
      title: 'title',
      price: 'price',
      image: 'image',
      url: 'url'
    };
    const VARIANTS = [{
      title: 'Green Shoes',
      price: '$1',
      image: 'image.tiff',
      url: 'about:blank'
    }, {
      title: 'Purple Shoes',
      price: '$1',
      image: 'image.tiff',
      url: 'about:blank'
    }, {
      title: 'Green Moccasins',
      price: '$2',
      image: 'image.svg',
      url: 'about:mozilla'
    }, {
      title: 'Yellow Shoes',
      price: '$1',
      image: 'image.tiff',
      url: 'about:blank'
    }];
    const VARIANT_META = {
      title: 'Orange Chili',
      price: '$3',
      image: 'image.bmp',
      variants: VARIANTS
    };

    it('should unpack single variant', () => {
      transformer = new ProductTransformer(STRUCT_WITH_VARIANTS);

      const variants = transformer.unpackVariants({ variants: [VARIANTS[0]] });

      expect(variants).to.have.length(1);
      expect(variants[0]).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    it('should unpack multiple variants', () => {
      transformer = new ProductTransformer(STRUCT_WITH_VARIANTS);

      const variants = transformer.unpackVariants(VARIANT_META);

      expect(variants).to.have.length(4);
      expect(variants[0]).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(variants[1]).to.eql({
        title: 'Purple Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(variants[2]).to.eql({
        title: 'Green Moccasins',
        price: '$2',
        image: 'image.svg',
        url: 'about:mozilla'
      });
      expect(variants[3]).to.eql({
        title: 'Yellow Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    it('should only vary the specified fields', () => {
      transformer = new ProductTransformer(Object.assign({
        _variantStructure: {
          title: 'title'
        }
      }, STRUCT_WITH_VARIANTS));

      const variants = transformer.unpackVariants(VARIANT_META);

      expect(variants[0]).to.be.eql({
        title: 'Green Shoes',
        price: '$3',
        image: 'image.bmp'
      });
      expect(variants[1]).to.be.eql({
        title: 'Purple Shoes',
        price: '$3',
        image: 'image.bmp'
      });
      expect(variants[2]).to.be.eql({
        title: 'Green Moccasins',
        price: '$3',
        image: 'image.bmp'
      });
      expect(variants[3]).to.be.eql({
        title: 'Yellow Shoes',
        price: '$3',
        image: 'image.bmp'
      });
    });

    it(`should support alternately named fields in struct and remap them to match
          the keynames in Searchandiser.ProductStructure`, () => {
        transformer = new ProductTransformer({
          title: 'titre',
          price: 'prix',
          image: 'image',
          url: 'url'
        });

        const variants = transformer.unpackVariants({
          titre: 'Chicken Dance',
          prix: '$30',
          image: 'image.apng',
          url: 'about:blank',
        });

        expect(variants[0]).to.eql({
          title: 'Chicken Dance',
          price: '$30',
          image: 'image.apng',
          url: 'about:blank',
        });
      });

    it('should support alternately named fields in variants', () => {
      transformer = new ProductTransformer({
        title: 'titre',
        price: 'prix',
        image: 'image',
        url: 'url',
        variants: 'genres'
      });

      const variants = transformer.unpackVariants({
        genres: [{
          titre: 'Chicken Dance',
          prix: '$30',
          image: 'image.apng',
          url: 'about:blank'
        }, {
          titre: 'Safari Trip',
          prix: '$30',
          image: 'image.ico',
          url: 'about:chrome'
        }]
      });

      expect(variants[0]).to.eql({
        title: 'Chicken Dance',
        price: '$30',
        image: 'image.apng',
        url: 'about:blank',
      });
      expect(variants[1]).to.eql({
        title: 'Safari Trip',
        price: '$30',
        image: 'image.ico',
        url: 'about:chrome'
      });
    });

    it('should support alternately named fields in variants with variant remapping', () => {
      transformer = new ProductTransformer({
        title: 'titre',
        price: 'prix',
        image: 'image',
        url: 'url',
        variants: 'genres',
        _variantStructure: {
          title: 'soustitre',
          image: 'sousimage'
        }
      });

      const variants = transformer.unpackVariants({
        titre: 'Ingenue',
        prix: '$50',
        image: 'image.dvi',
        url: 'about:mozilla',

        genres: [{
          soustitre: 'Chicken Dance',
          prix: '$39',
          sousimage: 'image.apng',
          url: 'about:blank'
        }, {
          soustitre: 'Safari Trip',
          prix: '$30',
          sousimage: 'image.ico',
          url: 'about:chrome'
        }]
      });

      expect(variants[0]).to.eql({
        title: 'Chicken Dance',
        price: '$50',
        image: 'image.apng',
        url: 'about:mozilla',
      });
      expect(variants[1]).to.eql({
        title: 'Safari Trip',
        price: '$50',
        image: 'image.ico',
        url: 'about:mozilla'
      });
    });

    it('should support nested fields and sole implicit variant', () => {
      transformer = new ProductTransformer({
        title: 'titre.second',
        price: 'prix',
        image: 'image',
        url: 'url'
      });

      const variants = transformer.unpackVariants({
        titre: {
          premier: 'Oiseau Rebel',
          second: 'La Boheme'
        },
        prix: '$50',
        image: 'image.dvi',
        url: 'about:mozilla',
      });

      expect(variants[0]).to.eql({
        title: 'La Boheme',
        price: '$50',
        image: 'image.dvi',
        url: 'about:mozilla',
      });
    });

    it('should support variants having a nested location', () => {
      transformer = new ProductTransformer({
        title: 'title',
        price: 'price',
        image: 'image',
        url: 'url',
        variants: 'variants[me][0][0]'
      });

      const variants = transformer.unpackVariants({
        variants: {
          me: [[VARIANTS]]
        }
      });

      expect(variants[0]).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(variants[1]).to.eql({
        title: 'Purple Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    describe('nested fields in variants', () => {
      const NESTED_VARIANT_META = {
        variants: {
          a: [
            'delete',
            'me',
            { b: 'Green Peppers' },
            'please'
          ],
          me: [[[{
            title: {
              first: 'Green Shoes',
              second: 'Verdant Clogs'
            },
            price: '$1',
            image: 'image.tiff',
            url: 'about:blank'
          },
          {
            title: {
              first: 'Green Shoes',
              second: 'Verdant Clogs'
            },
            price: '$1',
            image: 'image.tiff',
            url: 'about:blank'
          },
          {
            title: {
              first: 'Green Moccasins',
              second: 'Verdant Socks'
            },
            price: '$2',
            image: 'image.svg',
            url: 'about:mozilla'
          },
          {
            title: {
              first: 'Green Shoes',
              second: 'Verdant Clogs'
            },
            price: '$1',
            image: 'image.tiff',
            url: 'about:blank'
          }]]]
        }
      };

      it('should support nested structure fields', () => {
        transformer = new ProductTransformer({
          title: 'title.second',
          price: 'price',
          image: 'image',
          url: 'url',
          variants: 'variants[me][0][0]'
        });

        const variants = transformer.unpackVariants(NESTED_VARIANT_META);

        expect(variants[0]).to.eql({
          title: 'Verdant Clogs',
          price: '$1',
          image: 'image.tiff',
          url: 'about:blank'
        });
        expect(variants[1]).to.eql({
          title: 'Verdant Clogs',
          price: '$1',
          image: 'image.tiff',
          url: 'about:blank'
        });
      });

      it('should support varying over nested variantStructure fields', () => {
        transformer = new ProductTransformer({
          title: 'a[2].b',
          price: 'price',
          image: 'image',
          url: 'url',
          variants: 'variants[me][0][0]',
          _variantStructure: {
            title: 'title.second'
          }
        });

        const variants = transformer.unpackVariants(NESTED_VARIANT_META);

        expect(variants[0]).to.eql({
          title: 'Verdant Clogs'
        });
        expect(variants[1]).to.eql({
          title: 'Verdant Clogs'
        });
        expect(variants[2]).to.eql({
          title: 'Verdant Socks'
        });
        expect(variants[3]).to.eql({
          title: 'Verdant Clogs'
        });
      });

    });

    it('should restore original field when a variant happens to lack it', () => {
      transformer = new ProductTransformer({
        title: 'a[2].b',
        price: 'prix',
        image: 'image',
        url: 'url',
        variants: 'variants[me][0][0]',
        _variantStructure: {
          title: 'title.second',
          price: 'price',
          image: 'image',
          url: 'url'
        }
      });

      const variants = transformer.unpackVariants({
        a: [
          'delete',
          'me',
          { b: 'Green Peppers' },
          'please'
        ],
        prix: '$999',
        image: 'image.gs',
        url: 'about:preferences',
        variants: {
          me: [[[{
            title: {
              first: 'Green Shoes'
            },
            price: '$1',
            image: 'image.tiff',
            url: 'about:blank'
          }, {
            image: 'image.tiff',
            url: 'about:blank'
          }, {
            title: {
              second: 'Verdant Clogs'
            },
            price: '$1',
            image: 'image.tiff',
            url: 'about:blank'
          }, {
            title: {
              first: 'Green Shoes',
              second: 'Verdant Clogs'
            },
            price: '$1',
            url: 'about:blank'
          }, {
            title: {
              first: 'Green Shoes',
              second: 'Verdant Clogs'
            },
            price: '$1',
            image: 'image.tiff'
          }]]]
        }
      });

      expect(variants[0]).eql({
        title: 'Green Peppers',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(variants[1]).eql({
        title: 'Green Peppers',
        price: '$999',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(variants[2]).eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(variants[3]).eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.gs',
        url: 'about:blank'
      });
      expect(variants[4]).eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.tiff',
        url: 'about:preferences'
      });
    });
  });

  describe('remapVariant()', () => {
    it('should return a mapping function', () => {
      const mapping = transformer.remapVariant({}, {});

      expect(mapping).to.be.a('function');
    });

    it('should return a remapped variant when called', () => {
      const originalVariant = { mainColour: 'blue', size: '12.5' };
      const remap = sandbox.stub(utils, 'remap').returns({ a: 'b', c: 'd' });

      const mapping = transformer.remapVariant({ price: '$14', brand: 'nike' },
        { colour: 'mainColour', size: 'usSize' });

      const variant = mapping(originalVariant);
      expect(variant).to.eql({
        price: '$14',
        brand: 'nike',
        a: 'b',
        c: 'd'
      });

      expect(remap).to.be.calledWith(originalVariant);
    });

    it('should apply variantTransform', () => {
      const remapped = { a: 'b', c: 'd' };
      const transformed = { e: 'f', g: 'h' };
      const variantTransform = transformer.variantTransform = sandbox.spy(() => transformed);
      sandbox.stub(utils, 'remap').returns(remapped);

      const mapping = transformer.remapVariant({}, { colour: 'mainColour', size: 'usSize' });

      expect(mapping({ mainColour: 'blue', size: '12.5' })).to.eql(transformed);
      expect(variantTransform).to.be.calledWith(remapped);
    });

    it('should not apply variantTransform if the same function as productTransform', () => {
      const transform = transformer.productTransform = sandbox.spy();
      const variantTransform = transformer.variantTransform = transform;
      sandbox.stub(utils, 'remap');

      transformer.remapVariant({}, {})({});

      expect(variantTransform).to.not.be.called;
    });
  });

  describe('extractIdField()', () => {
    it('should return root id', () => {
      expect(transformer.extractIdField()).to.eq('id');

      transformer.hasVariants = true;

      expect(transformer.extractIdField()).to.eq('id');

      transformer.structure = { id: 'id', _variantStructure: {} };
      transformer.variantStructure = {};

      expect(transformer.extractIdField()).to.eq('id');
    });

    it('should return variant id', () => {
      const _variantStructure = { id: 'childId' };
      transformer.hasVariants = true;
      transformer.structure = { id: 'baseId', variants: 'child', _variantStructure };
      transformer.variantStructure = _variantStructure;

      expect(transformer.extractIdField()).to.eq('child.childId');
    });
  });

  describe('static', () => {
    describe('getTransform()', () => {
      it('should return structure._transform if a function', () => {
        const _transform = (meta) => meta;

        const transform = ProductTransformer.getTransform({ _transform });

        expect(transform).to.eq(_transform);
      });

      it('should return a simple mapping function if no _transform', () => {
        const meta = {};

        const transform = ProductTransformer.getTransform({});

        expect(transform(meta)).to.eq(meta);
      });

      it('should return a simple mapping function if invalid _transform', () => {
        const meta = {};

        const transform = ProductTransformer.getTransform({ _transform: 's' });

        expect(transform(meta)).to.eq(meta);
      });
    });
  });
});
