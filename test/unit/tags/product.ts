import { Product } from '../../../src/tags/product/gb-product';
import suite, { fluxTag } from './_suite';
import { expect } from 'chai';

const struct = { title: 'title', price: 'price', image: 'image', url: 'url' };
const all_meta = {
  title: 'Red Sneakers',
  price: '$12.45',
  image: 'image.png',
  id: '1340',
  nested: {
    value: '6532'
  }
};

suite('gb-product', Product, { _scope: { struct }, opts: { all_meta } }, ({ tag }) => {
  it('should inherit values from _scope', () => {
    tag().init();

    expect(tag().struct).to.eql(Object.assign({ id: 'id' }, struct));
    expect(tag().allMeta).to.eq(all_meta);
    expect(tag().transform).to.be.a('function');
    expect(tag().getPath).to.be.a('function');
  });

  it('should override struct defaults', () => {
    const overrideStruct = {
      id: 'MY_ID'
    };
    tag()._scope = { struct: overrideStruct };
    tag().init();

    expect(tag().struct).to.eql(overrideStruct);
  });

  it('should allow default from config', () => {
    const transform = () => null;
    const structure = { b: 'e', d: 'f', _transform: transform };

    tag()._scope = {};
    tag().config = <any>{ structure };
    tag().init();

    expect(tag().struct).to.eql(Object.assign({ id: 'id' }, structure));
    expect(tag().transform).to.eq(transform);
  });

  it('should listen for update', () => {
    tag().on = (event: string, cb: Function) => {
      expect(event).to.eq('update');
      expect(cb).to.eq(tag().transformRecord);
    };
    tag().init();
  });

  it('should perform transformation', () => {
    const _transform = (obj) => Object.assign(obj, { e: 'f' });

    tag().opts.all_meta = { a: 'b', c: 'd' };
    tag()._scope.struct = Object.assign({}, struct, { _transform });
    tag().init();

    tag().transformRecord();
    expect(tag().allMeta.e).to.eq('f');
  });

  it('should not transform multiple times', () => {
    const _transform = (obj) => {
      obj.a += obj.a;
      return obj;
    };

    tag().opts.all_meta = { a: 'b', c: 'd' };
    tag()._scope.struct = Object.assign({}, struct, { _transform });
    tag().init();

    tag().transformRecord();
    expect(tag().allMeta.a).to.eq('bb');
    tag().transformRecord();
    expect(tag().allMeta.a).to.eq('bb');
  });

  it('should return url from data', () => {
    const url = 'some/url/for/product';

    tag().opts.all_meta = { url };
    tag().init();

    expect(tag().link()).to.eq(url);
  });

  it('should return image value', () => {
    const images = ['image1.png', 'image2.png'];

    tag().init();

    expect(tag().image(images[1])).to.eq(images[1]);
    expect(tag().image(images)).to.eq(images[0]);
  });

  describe('variant logic', () => {
    const structWithVariants = {
      variants: 'variants',
      title: 'title',
      price: 'price',
      image: 'image',
      url: 'url'
    };
    const variants = [{
      title: 'Green Shoes',
      price: '$1',
      image: 'image.tiff',
      url: 'about:blank'
    },
    {
      title: 'Purple Shoes',
      price: '$1',
      image: 'image.tiff',
      url: 'about:blank'
    },
    {
      title: 'Green Moccasins',
      price: '$2',
      image: 'image.svg',
      url: 'about:mozilla'
    },
    {
      title: 'Yellow Shoes',
      price: '$1',
      image: 'image.tiff',
      url: 'about:blank'
    }];
    const variantMeta = {
      title: 'Orange Chili',
      price: '$3',
      image: 'image.bmp',

      variants
    };

    it('should allow variantStructure from struct', () => {
      const _variantStructure = { g: 'h' };
      const structure = { b: 'e', d: 'f', _variantStructure };

      tag()._scope = {};
      tag().config = <any>{ structure };
      tag().init();

      expect(tag().struct).to.eql(Object.assign({ id: 'id' }, structure));
      expect(tag().variantStruct).to.eq(_variantStructure);
    });

    it('should return the sole explicit variant', () => {
      tag()._scope = { struct: structWithVariants };
      tag().opts.all_meta = {
        variants: [variants[0]]
      };

      tag().init();

      expect(tag().variant(0)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    it('should return a particular explicit variant', () => {
      tag()._scope = { struct: structWithVariants };
      tag().opts.all_meta = variantMeta;

      tag().init();

      expect(tag().variant(0)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(tag().variant(1)).to.eql({
        title: 'Purple Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(tag().variant(2)).to.eql({
        title: 'Green Moccasins',
        price: '$2',
        image: 'image.svg',
        url: 'about:mozilla'
      });
      expect(tag().variant(3)).to.eql({
        title: 'Yellow Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    it('should return null if variants is not configured properly', () => {
      tag()._scope = {
        struct: {
          variants: 'varieties'
        }
      };
      tag().opts.all_meta = variantMeta;

      tag().init();

      expect(tag().variant(0)).to.be.null;
      expect(tag().variant(1)).to.be.null;
    });

    it('should ignore variants if variants is not configured', () => {
      tag().opts.all_meta = variantMeta;

      tag().init();

      expect(tag().variant(0)).to.be.eql({
        title: 'Orange Chili',
        price: '$3',
        image: 'image.bmp'
      });
      expect(tag().variant(1)).to.be.null;
    });

    it('should vary only the specified fields over the variants', () => {
      tag()._scope = {
        struct: structWithVariants,
        variantStruct: {
          title: 'title'
        }
      };
      tag().opts.all_meta = variantMeta;

      tag().init();

      expect(tag().variant(0)).to.be.eql({
        title: 'Green Shoes',
        price: '$3',
        image: 'image.bmp'
      });
      expect(tag().variant(1)).to.be.eql({
        title: 'Purple Shoes',
        price: '$3',
        image: 'image.bmp'
      });
      expect(tag().variant(2)).to.be.eql({
        title: 'Green Moccasins',
        price: '$3',
        image: 'image.bmp'
      });
      expect(tag().variant(3)).to.be.eql({
        title: 'Yellow Shoes',
        price: '$3',
        image: 'image.bmp'
      });
    });

    it('should support alternately named fields in struct and remap them to match the keynames in Searchandiser.ProductStructure', () => {
      tag()._scope = {
        struct: {
          title: 'titre',
          price: 'prix',
          image: 'image',
          url: 'url'
        }
      };
      tag().opts.all_meta = {
        titre: 'Chicken Dance',
        prix: '$30',
        image: 'image.apng',
        url: 'about:blank',
      };

      tag().init();

      expect(tag().variant(0)).to.eql({
        title: 'Chicken Dance',
        price: '$30',
        image: 'image.apng',
        url: 'about:blank',
      });
    });

    it('should support alternately named fields in variants', () => {
      tag()._scope = {
        struct: {
          title: 'titre',
          price: 'prix',
          image: 'image',
          url: 'url',
          variants: 'genres'
        }
      };
      tag().opts.all_meta = {
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
      };

      tag().init();

      expect(tag().variant(0)).to.eql({
        title: 'Chicken Dance',
        price: '$30',
        image: 'image.apng',
        url: 'about:blank',
      });
      expect(tag().variant(1)).to.eql({
        title: 'Safari Trip',
        price: '$30',
        image: 'image.ico',
        url: 'about:chrome'
      });
    });

    it('should support alternately named fields in variants with variant remapping', () => {
      tag()._scope = {
        struct: {
          title: 'titre',
          price: 'prix',
          image: 'image',
          url: 'url',
          variants: 'genres'
        },
        variantStruct: {
          title: 'soustitre',
          image: 'sousimage'
        }
      };
      tag().opts.all_meta = {
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
      };

      tag().init();

      expect(tag().variant(0)).to.eql({
        title: 'Chicken Dance',
        price: '$50',
        image: 'image.apng',
        url: 'about:mozilla',
      });
      expect(tag().variant(1)).to.eql({
        title: 'Safari Trip',
        price: '$50',
        image: 'image.ico',
        url: 'about:mozilla'
      });
    });

    it('should support nested fields and sole implicit variant', () => {
      tag()._scope = {
        struct: {
          title: 'titre.second',
          price: 'prix',
          image: 'image',
          url: 'url'
        }
      };
      tag().opts.all_meta = {
        titre: {
          premier: 'Oiseau Rebel',
          second: 'La Boheme'
        },
        prix: '$50',
        image: 'image.dvi',
        url: 'about:mozilla',
      };

      tag().init();

      expect(tag().variant(0)).to.eql({
        title: 'La Boheme',
        price: '$50',
        image: 'image.dvi',
        url: 'about:mozilla',
      });
    });

    it('should support variants having a nested location', () => {
      tag()._scope = {
        struct: {
          title: 'title',
          price: 'price',
          image: 'image',
          url: 'url',
          variants: 'variants[me][0][0]'
        }
      };
      tag().opts.all_meta = {
        variants: {
          me: [[variants]]
        }
      };

      tag().init();

      expect(tag().variant(0)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(tag().variant(1)).to.eql({
        title: 'Purple Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    describe('nested fields in variants', () => {
      const nestedVariantMeta = {
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
        tag()._scope = {
          struct: {
            title: 'title.second',
            price: 'price',
            image: 'image',
            url: 'url',
            variants: 'variants[me][0][0]'
          }
        };
        tag().opts.all_meta = nestedVariantMeta;

        tag().init();

        expect(tag().variant(0)).to.eql({
          title: 'Verdant Clogs',
          price: '$1',
          image: 'image.tiff',
          url: 'about:blank'
        });
        expect(tag().variant(1)).to.eql({
          title: 'Verdant Clogs',
          price: '$1',
          image: 'image.tiff',
          url: 'about:blank'
        });
      });

      it('should support varying over nested variantStructure fields', () => {
        tag()._scope = {
          struct: {
            title: 'a[2].b',
            price: 'price',
            image: 'image',
            url: 'url',
            variants: 'variants[me][0][0]'
          },
          variantStruct: {
            title: 'title.second'
          }
        };
        tag().opts.all_meta = nestedVariantMeta;

        tag().init();

        expect(tag().variant(0)).to.eql({
          title: 'Verdant Clogs'
        });
        expect(tag().variant(1)).to.eql({
          title: 'Verdant Clogs'
        });
        expect(tag().variant(2)).to.eql({
          title: 'Verdant Socks'
        });
        expect(tag().variant(3)).to.eql({
          title: 'Verdant Clogs'
        });
      });
    });

    it('should restore original field when a variant happens to lack it', () => {
      tag()._scope = {
        struct: {
          title: 'a[2].b',
          price: 'prix',
          image: 'image',
          url: 'url',
          variants: 'variants[me][0][0]'
        },
        variantStruct: {
          title: 'title.second',
          price: 'price',
          image: 'image',
          url: 'url'
        }
      };
      tag().opts.all_meta = {
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
          },
          {
            image: 'image.tiff',
            url: 'about:blank'
          },
          {
            title: {
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
            url: 'about:blank'
          },
          {
            title: {
              first: 'Green Shoes',
              second: 'Verdant Clogs'
            },
            price: '$1',
            image: 'image.tiff'
          }]]]
        }
      };

      tag().init();

      expect(tag().variant(0)).eql({
        title: 'Green Peppers',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(tag().variant(1)).eql({
        title: 'Green Peppers',
        price: '$999',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(tag().variant(2)).eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(tag().variant(3)).eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.gs',
        url: 'about:blank'
      });
      expect(tag().variant(4)).eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.tiff',
        url: 'about:preferences'
      });
    });
  });
});

// move these into the suite
describe('gb-product logic', () => {
  let tag: Product;

  beforeEach(() => ({ tag } = fluxTag(new Product(), {
    _scope: { struct },
    opts: { all_meta }
  })));

  it('should return product url', () => {
    tag.init();
    expect(tag.link()).to.eq(`details.html?id=${all_meta.id}`);
  });

  it('should access fields from allMeta', () => {
    tag.init();

    expect(tag.get('title')).to.eq(all_meta.title);
    expect(tag.get('nested.value')).to.eq(all_meta.nested.value);
  });

  describe('variant logic', () => {
    it('should return the sole implicit variant', () => {
      tag.init();

      expect(tag.variant(0)).to.eql({
        title: 'Red Sneakers',
        price: '$12.45',
        image: 'image.png',
        id: '1340'
      });
    });
  });
});
