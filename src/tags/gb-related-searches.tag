<gb-related-searches>
  <ul class="gb-list">
    <li each="{ related in relatedSearches }">
      <a href="#" onclick="{ send }">{ related }</a>
    </li>
  </ul>

  <script>
    opts.flux.on(opts.flux.RESULTS, res => this.update({ relatedSearches: res.relatedQueries }));
    this.send = (event) => opts.flux.rewrite(event.target.text);
  </script>
</gb-related-searches>
