

searchandiser({
  customerId: 'golfsmith',
  pageSize: 20,
  pageSizes: [10, 25, 50],

  structure: {
    title: 'title',
    image: 'Image_URL',
    price: 'Regular_Price',
    manufacturer: 'Mfr_Name',
    salePrice: 'Sale_Price',
    buyUrl: 'Buy_URL' 
  },
  sayt: {
  products: 12,
  queries: 8,
  // autoSearch: false,
  // highlight: false,
  categoryField: 'QtopRatedType',
  navigationNames: {
  brand: 'Brand'
  },
  allowedNavigations: ['brand']
  },
  stylish: true
});

searchandiser.search('TaylorMade');

searchandiser.attach('raw-results', '#test');