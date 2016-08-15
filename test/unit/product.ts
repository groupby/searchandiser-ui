import { Product } from '../../src/tags/results/gb-product';
import { fluxTag } from '../utils/tags';
import { expect } from 'chai';

describe('gb-product logic', () => {
  const struct = { title: 'title', price: 'price', image: 'image', url: 'url', id: 'id' },
    allMeta = {
      title: 'Red Sneakers',
      price: '$12.45',
      image: 'image.png',
      id: '1340',
      nested: {
        value: '6532'
      }
    };
  let tag: Product;

  beforeEach(() => ({ tag } = fluxTag(new Product(), {
    parent: { struct, allMeta }
  })));

  it('should inherit values from parent', () => {
    tag.init();

    expect(tag.struct).to.eq(struct);
    expect(tag.allMeta).to.eq(allMeta);
    expect(tag.transform).to.be.a('function');
    expect(tag.getPath).to.be.a('function');
  });

  it('should allow default from config and opts', () => {
    const transform = () => null;
    const struct = { b: 'e', d: 'f', _transform: transform };
    const all_meta = { b: 'e', d: 'f' };

    tag.parent = null;
    tag.config = <any>{ structure: struct };
    tag.opts = <any>{ all_meta };
    tag.init();

    expect(tag.struct).to.eq(struct);
    expect(tag.transform).to.eq(transform);
    expect(tag.allMeta).to.eq(all_meta);
  });

  it('should listen for update', () => {
    tag.on = (event: string, cb: Function) => {
      expect(event).to.eq('update');
      expect(cb).to.eq(tag.transformRecord);
    };
    tag.init();
  });

  it('should perform transformation', () => {
    tag.allMeta = { a: 'b', c: 'd' };
    tag.transform = (obj) => Object.assign(obj, { e: 'f' });

    tag.transformRecord();
    expect(tag.allMeta.e).to.eq('f');
  });

  it('should return product url', () => {
    tag.init();
    expect(tag.link()).to.eq(`details.html?id=${allMeta.id}`)
  });

  it('should return url from data', () => {
    const url = 'some/url/for/product';

    tag.parent.allMeta = { url };
    tag.init();

    expect(tag.link()).to.eq(url);
  });

  it('should access fields from allMeta', () => {
    tag.init();

    expect(tag.get('title')).to.eq(allMeta.title);
    expect(tag.get('nested.value')).to.eq(allMeta.nested.value);
  });

  it('should return image value', () => {
    const images = ['image1.png', 'image2.png'];

    tag.init();

    expect(tag.image(images[1])).to.eq(images[1]);
    expect(tag.image(images)).to.eq(images[0]);
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

    it('should return the sole implicit variant', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'title',
              price: 'price',
              image: 'image'
            },
            allMeta: {
              title: 'Green Shoes',
              price: '$1',
              image: 'image.tiff'
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff'
      });
    });


    it('should return the sole explicit variant', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              variants: 'variants',
              title: 'title',
              price: 'price',
              image: 'image',
              url: 'url'
            },
            allMeta: {
              variants: [{
                title: 'Green Shoes',
                price: '$1',
                image: 'image.tiff',
                url: 'about:blank'
              }]
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();
      expect(p.variant(0)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    it('should return a particular explicit variant', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'title',
              price: 'price',
              image: 'image',
              url: 'url',
              variants: 'variants'
            },
            allMeta: {
              variants: [{
                title: 'Green Shoes',
                price: '$1',
                image: 'image.tiff',
                url: 'about:blank'
              },
              {
                title: 'Green Shoes',
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
                title: 'Green Shoes',
                price: '$1',
                image: 'image.tiff',
                url: 'about:blank'
              }]
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(p.variant(1)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(p.variant(2)).to.eql({
        title: 'Green Moccasins',
        price: '$2',
        image: 'image.svg',
        url: 'about:mozilla'
      });
      expect(p.variant(3)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    it('should return null if variants is not configured properly', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'title',
              price: 'price',
              image: 'image',
              url: 'url',
              variants: 'varieties' // The typo
            },
            allMeta: {
              title: 'Orange Chili',
              price: '$3',
              image: 'image.bmp',

              variants: [{
                title: 'Green Shoes',
                price: '$1',
                image: 'image.tiff',
                url: 'about:blank'
              },
              {
                title: 'Green Shoes',
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
                title: 'Green Shoes',
                price: '$1',
                image: 'image.tiff',
                url: 'about:blank'
              }]
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.be.null;
      expect(p.variant(1)).to.be.null;
    });

    it('should ignore variants if variants is not configured', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'title',
              price: 'price',
              image: 'image',
              url: 'url',
            },
            allMeta: {
              title: 'Orange Chili',
              price: '$3',
              image: 'image.bmp',

              variants: [{
                title: 'Green Shoes',
                price: '$1',
                image: 'image.tiff',
                url: 'about:blank'
              },
              {
                title: 'Green Shoes',
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
                title: 'Green Shoes',
                price: '$1',
                image: 'image.tiff',
                url: 'about:blank'
              }]
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.be.eql({
        title: 'Orange Chili',
        price: '$3',
        image: 'image.bmp'
      });
      expect(p.variant(1)).to.be.null;
    });

    it('should vary only the specified fields over the variants', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'title',
              price: 'price',
              image: 'image',
              url: 'url',
              variants: 'varieties',
            },
            variantStruct: {
              title: 'title'
            },
            allMeta: {
              title: 'Orange Chili',
              price: '$3',
              image: 'image.bmp',

              varieties: [{
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
              }]
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.be.eql({
        title: 'Green Shoes',
        price: '$3',
        image: 'image.bmp'
      });
      expect(p.variant(1)).to.be.eql({
        title: 'Purple Shoes',
        price: '$3',
        image: 'image.bmp'
      });
      expect(p.variant(2)).to.be.eql({
        title: 'Green Moccasins',
        price: '$3',
        image: 'image.bmp'
      });
      expect(p.variant(3)).to.be.eql({
        title: 'Yellow Shoes',
        price: '$3',
        image: 'image.bmp'
      });
    });

    it('should support alternately named fields in struct and remap them to match the keynames in Searchandiser.ProductStructure', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'titre',
              price: 'prix',
              image: 'image',
              url: 'url'
            },
            allMeta: {
              titre: 'Chicken Dance',
              prix: '$30',
              image: 'image.apng',
              url: 'about:blank',
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.eql({
        title: 'Chicken Dance',
        price: '$30',
        image: 'image.apng',
        url: 'about:blank',
      });
    });

    it('should support alternately named fields in variants', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'titre',
              price: 'prix',
              image: 'image',
              url: 'url',
              variants: 'genres'
            },
            allMeta: {
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
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();
      expect(p.variant(0)).to.eql({
        title: 'Chicken Dance',
        price: '$30',
        image: 'image.apng',
        url: 'about:blank',
      });
      expect(p.variant(1)).to.eql({
        title: 'Safari Trip',
        price: '$30',
        image: 'image.ico',
        url: 'about:chrome'
      });
    });

    it('should support alternately named fields in variants with variant remapping', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
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
            },
            allMeta: {
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
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.eql({
        title: 'Chicken Dance',
        price: '$50',
        image: 'image.apng',
        url: 'about:mozilla',
      });
      expect(p.variant(1)).to.eql({
        title: 'Safari Trip',
        price: '$50',
        image: 'image.ico',
        url: 'about:mozilla'
      });
    });

    it('should support nested fields and sole implicit variant', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'titre.second',
              price: 'prix',
              image: 'image',
              url: 'url'
            },
            allMeta: {
              titre: {
                premier: 'Oiseau Rebel',
                second: 'La Boheme'
              },
              prix: '$50',
              image: 'image.dvi',
              url: 'about:mozilla',
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.eql({
        title: 'La Boheme',
        price: '$50',
        image: 'image.dvi',
        url: 'about:mozilla',
      });
    });

    it('should support variants having a nested location', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'title',
              price: 'price',
              image: 'image',
              url: 'url',
              variants: 'variants[me][0][0]'
            },
            allMeta: {
              variants: {
                me: [[[{
                  title: 'Green Shoes',
                  price: '$1',
                  image: 'image.tiff',
                  url: 'about:blank'
                },
                {
                  title: 'Green Shoes',
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
                  title: 'Green Shoes',
                  price: '$1',
                  image: 'image.tiff',
                  url: 'about:blank'
                }]]]
              }
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(p.variant(1)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(p.variant(2)).to.eql({
        title: 'Green Moccasins',
        price: '$2',
        image: 'image.svg',
        url: 'about:mozilla'
      });
      expect(p.variant(3)).to.eql({
        title: 'Green Shoes',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    it('should support nested structure fields', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'title.second',
              price: 'price',
              image: 'image',
              url: 'url',
              variants: 'variants[me][0][0]'
            },
            allMeta: {
              variants: {
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
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(p.variant(1)).to.eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(p.variant(2)).to.eql({
        title: 'Verdant Socks',
        price: '$2',
        image: 'image.svg',
        url: 'about:mozilla'
      });
      expect(p.variant(3)).to.eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
    });

    it('should support varying over nested variantStructure fields', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
            struct: {
              title: 'a[2].b',
              price: 'price',
              image: 'image',
              url: 'url',
              variants: 'variants[me][0][0]'
            },
            variantStruct: {
              title: 'title.second'
            },
            allMeta: {
              a: [
                'delete',
                'me',
                { b: 'Green Peppers' },
                'please'
              ],
              variants: {
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
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).to.eql({
        title: 'Verdant Clogs'
      });
      expect(p.variant(1)).to.eql({
        title: 'Verdant Clogs'
      });
      expect(p.variant(2)).to.eql({
        title: 'Verdant Socks'
      });
      expect(p.variant(3)).to.eql({
        title: 'Verdant Clogs'
      });
    });

    it('should restore original field when a variant happens to lack it', () => {
      const p = Object.assign(new Product(),
        {
          opts: {},
          parent: {
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
            },
            allMeta: {
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
            }
          }
        },
        {
          on: (_) => null
        });

      p.init();

      expect(p.variant(0)).eql({
        title: 'Green Peppers',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(p.variant(1)).eql({
        title: 'Green Peppers',
        price: '$999',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(p.variant(2)).eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.tiff',
        url: 'about:blank'
      });
      expect(p.variant(3)).eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.gs',
        url: 'about:blank'
      });
      expect(p.variant(4)).eql({
        title: 'Verdant Clogs',
        price: '$1',
        image: 'image.tiff',
        url: 'about:preferences'
      });
    });
  });
});
