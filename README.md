GroupBy Searchandiser UI
========


The following instructions assume that you are creating a search & merch single page app using the
GroupBy commerce platform.  
For instructions to integrate with an existing NodeJS application please read this file.
[README.nodejs.md](README.nodejs.md)

There are two ways to implement in an existing website, the preferred way is to have the searchandiser
API generate the HTML on your page and hookup the eventing for you.  This way you will inherit
all the best practices for your website in seconds.

Implementing on an existing website
---

###Step 1

Ensure that there are `div` tags on your site with IDs that correspond to the elements will be
displayed.

```html
<html>
  <head>...</head>
  <body>

    <!-- the search box -->
    <div class="query"></div>
    <!-- Optionally inject into an input element directly 
    <input type="text" class="raw-query">
    -->
    <div>
      <!-- Selected navigations that represent the
           filters selected by the user -->
      <div class="breadcrumbs"></div>
      <!-- Record start, end and total -->
      <div class="recordCount"></div>
      <!-- Page size selector -->
      <div class="page-size"></div>
      <!-- Paging elements -->
      <div class="paging"></div>
    </div>
    <div>
      <!-- Spelling suggestions from the engine -->
      <div class="didYouMean"></div>
      <!-- Related searches defined by the merchandisers -->
      <div class="relatedSearches"></div>
    </div>
    <!-- Template from activated Rule -->
    <div class="spotlightTemplate">
      <!-- template content will be conditionally rendered -->
    </div>
    <div>
      <!-- Based on the current search and navigation state
           these are the available filters that can be used -->
      <div class="availableNavigation"></div>
      <!-- Records that match the search and nav state -->
      <div class="results"></div>
      <!-- Optionally construct your own product template -->
      <div class="raw-results">
        <a href="#">
          <img src="{ allMeta['image'] }" alt="" />
        </a>
        <a href="#">
          <p>{ allMeta['title'] }</p>
          <p>{ allMeta['price'] }</p>
        </a>
      </div>
    </div>

  </body>
</html>
```

###Step 2

Add the JavaScript that will attach the service to the `div`s above.

```html
<html>
  <head>
    <script src="http://cdn.groupbycloud.com/dist/searchandiser-ui-0.0.9.js"></script>
  </head>
  <body>

    <div class="query"></div>
    <input type="text" class="raw-query">
    <div>
      <div class="breadcrumbs"></div>
      <div class="recordCount"></div>
      <div class="page-size"></div>
      <div class="paging"></div>
    </div>
    <div>
      <div class="didYouMean"></div>
      <div class="relatedSearches"></div>
    </div>
    <div class="spotlightTemplate">
      <!-- template content -->
    </div>
    <div>
      <div class="availableNavigation"></div>
      <div class="results"></div>
      <div class="raw-results">
        <!-- product template -->
      </div>
    </div>

    <script>
      searchandiser({
        customerId: '<customer id>',
        // collection: 'default',
        // area: 'Production',

        // default page size
        // pageSize: 20,

        // page size options
        // pageSizes: [10, 20, 50],

        structure: {
          title: 'title',
          image: 'wideImage',
          price: 'price'
        },

        sayt: {
          products: 4,
          queries: 5,

          // disable auto-search behaviour
          // autoSearch: false,
          //
          // disable highlighting in autocomplete
          // highlight: false,
          //
          // the field in your data which represents product categories
          // categoryField: 'productCategory',
          //
          // filter the navigations returned
          // navigationNames: {
          //  brand: 'Brand'
          // }
        },

        // enable some default styling
        // stylish: true
      });
      searchandiser.search('');

      // Usage of the attach method looks like the following:
      // The callback his passed a single parameter, a tag instance representing the mounted component
      // See the riot.js documentation (http://riotjs.com/guide/#mounting) for available lifecycle events
      // searchandiser.attach(<tag name>, [<css selector>], [<argument dictionary>], [<callback>]);

      // In order to call some code once the component is rendered:
      // searchandiser.attach('query', '.query', {}, function(tag) {
      //   tag.on('mount', function() {
      //     operate on the rendered elements
      //   });
      // });

      searchandiser.attach('query', '.query');

      // Elements can also be found automatically if their
      // class name matches the component name.
      // e.g. to attach the query component to '.query':
      // searchandiser.attach('query');

      // Attach the query field functionality directly to
      // an <input> element
      searchandiser.attach('raw-query', '.raw-query');

      searchandiser.attach('paging', '.paging');
      searchandiser.attach('page-size', '.page-size');
      searchandiser.attach('results', '.results');

      // Use a custom template for rendering search results
      searchandiser.attach('raw-results', '.raw-results', {
        css: {
          results: 'my-results-class',
          resultsItem: 'my-resultsItem-class',
          product: 'my-product-class'
        }
      });

      searchandiser.attach('available-navigation', '.availableNavigation', {
        // hide the refinement count
        // badge: false,
        // hide selected refinements
        // showSelected: false
      });
      searchandiser.attach('breadcrumbs', '.breadcrumbs');
      searchandiser.attach('did-you-mean', '.didYouMean');
      searchandiser.attach('related-searches', '.relatedSearches');

      // To register templates use the name of the template
      // and a css selector
      searchandiser.template('My Spotlight Template', '.spotlightTemplate');
    </script>

  </body>
</html>
```

###Step 3

To theme the results use CSS for each of the elements.  For a complete style reference see this
document: [docs/css-reference.md](docs/css-reference.md)

## Components:

 - `query`
 - `raw-query`
 - `paging`
 - `results`
 - `raw-results`
 - `record-count`
 - `available-navigation`
 - `breadcrumbs`
 - `did-you-mean`
 - `related-searches`
 - `template`
