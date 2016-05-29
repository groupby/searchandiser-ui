export let ComplexRequest = {
  query: 'complex',
  sort: [
    { field: 'price', order: 'Ascending' },
    { field: 'boost', order: 'Descending' }
  ],
  fields: ['title', 'description'],
  orFields: ['brand', 'colour'],
  customUrlParams: [
    { key: 'banner', value: 'nike_landing' },
    { key: 'style', value: 'branded' }
  ],
  includedNavigations: ['brand', 'size'],
  excludedNavigations: ['_meta', 'originalPrice'],
  wildcardSearchEnabled: true,
  pruneRefinements: false,
  userId: '13afasd',
  language: 'en',
  collection: 'dev',
  area: 'Development',
  biasingProfile: 'boost top brands',
  pageSize: 300,
  skip: 40,
  restrictNavigation: {
    name: 'brand',
    count: 10
  },
  matchStrategy: {
    rules: [{ terms: 5, termsGreaterThan: 7 }]
  },
  biasing: {
    augmentBiases: true,
    biases: [{ name: 'popularity', strength: 'Strong_Decrease' }]
  },
  disableAutocorrection: true,
  returnBinary: false
}

export let BulkRequest = {
  query: 'bulk',
  sort: [
    { field: 'price', order: 'Ascending' },
    { field: 'boost', order: 'Descending' }
  ],
  fields: ['title', 'description'],
  orFields: ['brand', 'colour'],
  customUrlParams: [
    { key: 'banner', value: 'nike_landing' },
    { key: 'style', value: 'branded' }
  ],
  includedNavigations: ['brand', 'size'],
  excludedNavigations: ['_meta', 'originalPrice'],
  wildcardSearchEnabled: false,
  pruneRefinements: true
}

export let CombinedRefinements = [
  {
    navigationName: 'size',
    type: 'Range',
    low: 1,
    high: 13,
    exclude: false
  },
  {
    navigationName: 'brand',
    type: 'Value',
    value: 'Nike',
    exclude: true
  },
  { type: 'Value', value: 'wool', navigationName: 'material' },
  {
    type: 'Range',
    low: 2000,
    high: 2009,
    exclude: false,
    navigationName: 'year'
  },
  { type: 'Range', low: 2010, high: 2011, navigationName: 'year' },
  { type: 'Value', value: '****', navigationName: 'rating', exclude: true },
  {
    navigationName: 'price',
    low: 122,
    high: 413,
    exclude: false,
    type: 'Range'
  },
  { type: 'Value', value: '***', navigationName: 'rating' },
  { type: 'Range', low: 31, high: 44, navigationName: 'price' },
  { type: 'Range', low: 89, high: 100, navigationName: 'price' }
]

export let CustomParamsFromString = [
  { key: 'banner', value: 'nike_landing' },
  { key: 'style', value: 'branded' },
  { key: 'defaults', value: '' },
  { key: 'others', value: '' },
  { key: 'something', value: 'as_well' }
]
