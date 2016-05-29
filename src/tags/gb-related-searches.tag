<gb-related-searches>
  <h3>Related Queries:</h3>
  <ul class="gb-list">
    <li each="{ related in relatedSearches }">
      <a href="#" onclick="{ send }">{ related }</a>
    </li>
  </ul>

  <script>
    opts.srch.el.on('results', () => {
      this.relatedSearches = opts.srch.results.relatedQueries;
      this.update();
    });

    this.send = (event) => opts.srch.search(event.target.text);
  </script>
</gb-related-searches>
