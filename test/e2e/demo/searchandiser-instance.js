function configureSearchandiser () {
  searchandiser({
    customerId: 'gbipoccvspilot',
    area: 'ProductionSemanticDemo',
    collection: 'products2',
    fields: ['*'],

    pageSizes: [
      12,
      24,
      50
    ],

    bridge: {
      https: true
    },

    structure: {
      title: 'title',
      variants: 'child',
      _transform: transformRecord,
      _variantStructure: {
        id: 'id',
        image: 'image',
        price: 'CUSTOMER_PRICE',
        shortName: 'PRODUCT_SHORTNAME',
        productReview: 'PRODUCT_REVIEW',
        productRating: 'PRODUCT_RATING',
        productSize: 'PRODUCT_SIZE',
        productAvailability: 'PRODUCT_AVAILABILITY',
        rating: 'gbietl_sku_rating_rounded_0'
      },
      image: 'wideImage',
      price: 'price'
    },

    tags: {

      collections: {
        items: [{
          label: 'Products',
          value: 'products2'
        }, {
          label: 'Drug Information',
          value: 'drug'
        }]
      },

      filter: {
        field: 'category1',
        matchAll: 'All Categories'
      },

      paging: {
        pages: true
      },

      query: {
        autoSearch: false
      },

      sayt: {
        area: 'Production',
        collection: 'products2',

        structure: {
          image: 'image_url'
        },

        products: 12,
        queries: 9,
        categoryField: 'child.PRODUCT_SUBCATEGORYNAME',
        navigationNames: {
          'child.PRODUCT_BRAND': 'Brand'
        },
        allowedNavigations: ['child.PRODUCT_BRAND']
      },

      sort: {
        items: [{
          label: 'Relevance',
          value: {
            field: '_relevance',
            order: 'Descending'
          }
        }, {
          label: 'Price Low to High',
          value: {
            field: 'child.CUSTOMER_PRICE',
            order: 'Ascending'
          }
        }, {
          label: 'Price High to Low',
          value: {
            field: 'child.CUSTOMER_PRICE',
            order: 'Descending'
          }
        }, {
          label: 'Most Reviewed',
          value: {
            field: 'child.PRODUCT_REVIEW',
            order: 'Descending'
          }
        }, {
          label: 'Name A-Z',
          value: {
            field: 'title',
            order: 'Ascending'
          }
        }, {
          label: 'Name Z-A',
          value: {
            field: 'title',
            order: 'Descending'
          }
        }]
      }
    },

    initialSearch: false,
    stylish: true
  });

  function transformRecord (record) {
    if (record.child) {
      record.child = record.child.map(
        function (child) {
          child.image = 'http://www.cvs.com/bizcontent/merchandising/productimages/large/' + child.PRODUCT_UPCNUMBER + '.jpg';
          return child;
        }
      );
    }
    return record;
  }

  searchandiser.compile();

  searchandiser.attach('collections');

  searchandiser.attach('query');

  searchandiser.attach('paging');

  searchandiser.attach('page-size');

  searchandiser.attach('results');

  searchandiser.attach('filter');

  searchandiser.attach('sort');

  searchandiser.attach('record-count');

  searchandiser.attach('navigation');

  searchandiser.attach('breadcrumbs');

  searchandiser.attach('did-you-mean');

  searchandiser.attach('related-queries');

  searchandiser.attach('template');
}
