GroupBy Searchandiser UI
========

![license](https://img.shields.io/github/license/groupby/searchandiser-ui.svg)
[![npm](https://img.shields.io/npm/dm/searchandiser-ui.svg)](https://www.npmjs.com/package/searchandiser-ui)
[![npm](https://img.shields.io/npm/v/searchandiser-ui.svg)](https://www.npmjs.com/package/searchandiser-ui)

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
    <div class="gb-bar">
      <!-- Selected navigations that represent the
           filters selected by the user -->
      <div class="selectedNavigation"></div>
      <!-- Paging elements -->
      <div class="paging"></div>
    </div>
    <div class="gb-bar">
      <!-- Spelling suggestions from the engine -->
      <div class="didYouMean"></div>
      <!-- Related searches defined by the merchandisers -->
      <div class="relatedSearches"></div>
    </div>
    <div class="gb-main">
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

Add the JavaScript that will attach the service to the div's above.

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/riot/2.4/riot.min.js"></script>
    <script src="http://cdn.groupbycloud.com/dist/searchandiser-ui-0.0.1.js"></script>
  </head>
  <body>

    <div class="query"></div>
    <div class="gb-bar">
      <div class="selectedNavigation"></div>
      <div class="paging"></div>
    </div>
    <div class="gb-bar">
      <div class="didYouMean"></div>
      <div class="relatedSearches"></div>
    </div>
    <div class="gb-main">
      <div class="availableNavigation"></div>
      <div class="results"></div>
    </div>

    <script>
      searchandiser({
        customerId: 'crateandbarreldemo',
        // collection: 'default',
        // area: 'Production',

        structure: {
          title: 'title',
          image: 'wideImage',
          price: 'price'
        },

        // stylish: true
      });
      searchandiser.search('');
      searchandiser.attach('query', '.query');
      searchandiser.attach('paging', '.paging');
      searchandiser.attach('results', '.results');
      searchandiser.attach('available-navigation', '.availableNavigation', {
        // badge: false
      });
      searchandiser.attach('selected-navigation', '.selectedNavigation');
      searchandiser.attach('did-you-mean', '.didYouMean');
      searchandiser.attach('related-searches', '.relatedSearches');
    </script>

  </body>
</html>
```

###Step 3

To theme the results use CSS for each of the elements.  For a complete style reference see this
document: [docs/css-reference.md](docs/css-reference.md)

## Components:

 - `query`
 - `paging`
 - `results`
 - `record-count`
 - `available-navigation`
 - `selected-navigation`
 - `did-you-mean`
 - `related-searches`
