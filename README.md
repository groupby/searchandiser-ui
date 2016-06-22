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
    <div>
      <!-- Selected navigations that represent the
           filters selected by the user -->
      <div class="breadcrumbs"></div>
      <!-- Record start, end and total -->
      <div class="recordCount"></div>
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
    </div>

  </body>
</html>
```

###Step 2

Add the JavaScript that will attach the service to the `div`s above.

```html
<html>
  <head>
    <script src="http://cdn.groupbycloud.com/dist/searchandiser-ui-0.0.4.js"></script>
  </head>
  <body>

    <div class="query"></div>
    <div>
      <div class="breadcrumbs"></div>
      <div class="recordCount"></div>
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
    </div>

    <script>
      searchandiser({
        customerId: '<customer id>',
        // collection: 'default',
        // area: 'Production',

        structure: {
          title: 'title',
          image: 'wideImage',
          price: 'price'
        },

        // enable some default styling
        // stylish: true
      });
      searchandiser.search('');
      searchandiser.attach('query', '.query');

      // Elements can also be found automatically if their
      // class name matches the component name.
      // e.g. to attach the query component to '.query':
      // searchandiser.attach('query');

      searchandiser.attach('paging', '.paging');
      searchandiser.attach('results', '.results');
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
 - `record-count`
 - `available-navigation`
 - `breadcrumbs`
 - `did-you-mean`
 - `related-searches`
 - `template`
