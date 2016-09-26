GroupBy Searchandiser UI
========


The following instructions assume that you are creating a search & merch single page app using the
GroupBy commerce platform.  

There are two ways to implement in an existing website, the preferred way is to have the searchandiser
API generate the HTML on your page and hookup the eventing for you.  This way you will inherit
all the best practices for your website in seconds.

[Integrate with an existing website](integration.md);

Implementing a simple website:
---

###Step 1

Add the searchandiser CDN to the head in your html file.

```html
<html>
  <head>
    <script src="http://cdn.groupbycloud.com/dist/searchandiser-ui-0.2.13.js"></script>
  </head>
  <body>
    ...
  </body>
</html>
```

###Step 2

Ensure that there are `div` tags on your site with IDs or classes that correspond to the elements that will be
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
    <div class="collections"></div>
    <div>
      <!-- Selected navigations that represent the
           filters selected by the user -->
      <div class="breadcrumbs"></div>
      <!-- Record start, end and total.
           This component allows you to provide your own template
           for displaying the record count-->
      <div class="recordCount">
        <h2>{ first } - { last } of { total } Products</h2>
      </div>
      <!-- Sort dropdown -->
      <div class="sort"></div>
      <!-- Page size selector -->
      <div class="page-size"></div>
      <!-- Paging elements -->
      <div class="paging"></div>
    </div>
    <div>
      <!-- Spelling suggestions from the engine -->
      <div class="didYouMean"></div>
      <!-- Related searches defined by the merchandisers -->
      <div class="relatedQueries"></div>
      <!-- A static refinement dropdown for a single navigation.
           Uses a semi-detached search state. -->
      <div class="filter"></div>
    </div>
    <!-- Template from activated Rule -->
    <div class="spotlightTemplate">
      <!-- template content will be conditionally rendered -->
    </div>
    <div>
      <!-- Based on the current search and navigation state
           these are the available filters that can be used -->
      <div class="navigation"></div>
      <!-- Records that match the search and nav state -->
      <div class="results"></div>
      <!-- Optionally construct your own product template by using the raw-results class -->
      <!-- <div class="raw-results">
            <a href="#">
              // Using 'riot-src' ensures that there are no errors
              // loading invalid image urls
              // getPath fetches the property at the specified path, so
              // you can use nested paths like 'deep.nested.image'
            <img riot-src="{ getPath(allMeta,'image') }" alt="" />
            </a>
            <a href="#">
              <p>{ getPath(allMeta,'title') }</p>
              <p>{ getPath(allMeta,'price') }</p>
            </a>
          </div>
      -->
    </div>
    <script>...</script>
  </body>
</html>
```

###Step 3

Use the searchandiser method to set up your configurations in a script tag at the bottom of your body.

```html
<html>
  <head>...</head>
  <body>
    ...

    <script>
      searchandiser({
        customerId: '<customer id>',
        // collection: 'default',
        // area: 'Production',

        // default page size
        // pageSize: 20,

        // page size options
        // pageSizes: [10, 20, 50],

        // The paths for structure elements can be any nested
        // paths within allMeta like 'deep.nested.wideImage[0]'
        structure: {
          title: 'title',
          image: 'wideImage',
          price: 'price'
        },

        tags: {

          sayt: {
            products: 4,
            queries: 5,

            // disable auto-search behaviour
            // autoSearch: false,
            //
            // disable highlighting in autocomplete
            // highlight: false,
            //
            // SAYT specific product structure
            // structure: { ... },
            //
            // the field in your data which represents product categories
            // categoryField: 'productCategory',
            //
            // rename navigations on the fly
            // navigationNames: {
            //   brand: 'Brand'
            // },
            //
            // filter the navigations returned
            // allowedNavigations: [ 'brand' ],
            //
            // select minimum characters at which to start autocomplete
            // minimumCharacters: 3,
            //
            // select delay to start autocomplete
            // delay: 300
          },

          collections: {
            options: [{
              // how the collection will be displayed
              label: 'Products',
              // the collection in Searchandiser
              value: 'default'
            }, {
              label: 'Sales',
              value: 'productsonsale'
            }]
          },

          sort: {
            options: [{
              label: 'Relevance',
              value: {
                // default relevance sort
                field: '_relevance'
              }
            }, {
              label: 'Price Low to High',
              value: {
                // field to sort upon
                field: 'price',
                // order of sort
                order: 'Ascending'
              }
            }],

            // The label that will be displayed when
            // no sort is selected
            // default: 'Sort',
            //
            // The label that will be displayed as
            // an option to clear the sort
            // clear: 'Unsorted'
          }

        },

        // enable some default styling
        // stylish: true,
        //
        // disable a default empty search at page load
        // if set to false, query & raw-query tags will inspect the current URL to do a search
        // initialSearch: false
      });

      // Manually make your own query, all components will update accordingly.
      // Make sure to disable 'initialSearch'.
      // searchandiser.search('red shoes');

      // Usage of the attach method looks like the following:
      // The callback has passed a single parameter, a tag instance representing the mounted component
      // See the riot.js documentation (http://riotjs.com/guide/#mounting) for available lifecycle events
      // searchandiser.attach(<tag name>, [<css selector>], [<argument dictionary>], [<callback>]);

      // In order to call some code once the component is rendered:
      // searchandiser.attach('query', '.query', {}, function(tag) {
      //   tag.on('mount', function() {
      //     operate on the rendered elements
      //   });
      // });
      searchandiser.attach('query', '.query', {
        // disable Searchandise-As-You-Type
        // sayt: false,
        //
        // disable updating results as you type
        // autoSearch: false,
        //
        // when 'autoSearch' is off and staticSearch is on, searches
        // redirect to 'searchUrl' and append query parameters
        // staticSearch: false,
        // searchUrl: '/my/search/path',
        //
        // the query parameter to hold the search field
        // value when redirecting
        // defaults to 'q'
        // queryParam: 'queryString'
        //
        // e.g. searching for 'shoes' with:
        // - autoSearch: false
        // - staticSearch: true
        // - searchUrl: '/my/search/path'
        //
        // would redirect to the URL
        // 'example.com/my/search/path?queryString=shoes'
      });

      // Elements can also be found automatically if their
      // class name matches the component name.
      // e.g. to attach the query component to '.query':
      // searchandiser.attach('query');

      // Attach the query field functionality directly to
      // an <input> element. The 'raw-query' component accepts
      // the same options as 'query'
      searchandiser.attach('raw-query', '.raw-query');

      // Attach to a pre-existing submit button
      // The 'raw-submit' component accepts the same options as
      // 'query' but ignores the 'sayt' property.
      // The options should be the same as 'query' or 'raw-query' to ensure
      // consistent behaviour.
      searchandiser.attach('raw-submit', '.raw-submit');

      searchandiser.attach('collections');

      searchandiser.attach('paging', '.paging', {
        // show page selection links
        // showPages: true,
        //
        // set the limit of visible page selection links
        // limit: 7,
        //
        // hide 'first' and 'last' links
        // showTerminals: false
        //
        // use first and last page numbers as terminal labels; overrides first_label, last_label
        // numeric: false
      });
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

      searchandiser.attach('navigation', '.navigation', {
        // hide the refinement count
        // badge: false,
        //
        // hide selected refinements
        // showSelected: false
      });
      searchandiser.attach('filter', '.filter', {
        // the field to draw refinements from
        // field: 'categories',
        //
        // adds an option that clears the refinement
        // matchAll: 'All Categories'
      });
      searchandiser.attach('sort', '.sort', {
        // overrides the values in main tag config
      });
      searchandiser.attach('breadcrumbs', '.breadcrumbs', {
        // hide the current query from the breadcrumbs
        // hideQuery: true,
        //
        // hide refinements from the breadcrumbs
        // hideRefinements: true
      });
      searchandiser.attach('did-you-mean', '.didYouMean');
      searchandiser.attach('related-searches', '.relatedQueries');

      // To register templates use the name of the template
      // and a css selector
      searchandiser.template('My Spotlight Template', '.spotlightTemplate');
    </script>
  </body>
</html>
```

## Components:

 - `query`
 - `raw-query`
 - `paging`
 - `results`
 - `raw-results`
 - `record-count`
 - `navigation`
 - `breadcrumbs`
 - `did-you-mean`
 - `related-queries`
 - `template`
