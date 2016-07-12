<gb-related-searches>
  <ul class="gb-related-searches { opts.style() }">
    <li class="gb-related-search" each="{ related in relatedSearches }">
      <a class="gb-related-search__link" onclick="{ send }">{ related }</a>
    </li>
  </ul>

  <script>
    opts.flux.on(opts.flux.RESULTS, res => this.update({ relatedSearches: res.relatedQueries }));
    this.send = (event) => opts.flux.rewrite(event.target.text);
  </script>

  <style scoped>
    .gb-stylish.gb-related-searches a {
      cursor: pointer;
    }
  </style>
</gb-related-searches>
