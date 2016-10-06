# Integration with an existing site

### Step 1

Add the latest `searchandiser-ui` javascript file to the `<head>` of your page.

```html
<html>
  <head>
    ...
    <script src="http://cdn.groupbycloud.com/dist/searchandiser-ui-0.2.15.js"></script>
  </head>

  ...
</html>
```

### Step 2

Add a javascript file to your project to consolidate configuration of `searchandiser-ui`.
We have added `defer` to ensure it's run after the DOM has loaded

```html
<html>
  <head>
    ...
    <script src="http://cdn.groupbycloud.com/dist/searchandiser-ui-0.2.15.js"></script>
    <script src="js/searchandiser-instance.js" defer></script>
  </head>

  ...
</html>
```

### Step 3

Configure `searchandiser-ui` to take your `customerId` and optionally your
`area` and `collection` as well. In the newly created `searchandiser-instance.js`:

```js
searchandiser({
  customerId: 'mycustomerid',

  // optional
  area: 'myarea',
  collection: 'mycollection'
});
```

### Step 4

Next we will attach to the search `<input>` on your site. Add the following to
the bottom of `searchandiser-instance.js` and replace `.mySearchInput` with a
CSS selector for your search input.

```js
searchandiser.attach('raw-query', '.mySearchInput');
```

### Step 5

Finally, in order to begin seeing results we will attach the results component.
This component is a simple view of the results for any search, and can be
customized by using the `raw-results` component in its place. `.myResultsContainer`
should point to the element on your page which holds records.

```js
searchandiser.attach('results', '.myResultsContainer');
```

### Step 6

Start typing in your search box and watch your results update live. This is a
very simple implementation of the `searchandiser-ui` framework, but should serve
as a good jumping off point for a full-fledged implementation. Be sure to check
out the [README](../README.md) for additional configuration options.
