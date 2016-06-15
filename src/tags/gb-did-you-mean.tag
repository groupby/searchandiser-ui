<gb-did-you-mean>
  <h3>Did You Mean:</h3>
  <ul class="gb-list">
    <li each="{ dym in didYouMean }">
      <a href="#" onclick="{ send }">{ dym }</a>
    </li>
  </ul>

  <script>
    opts.flux.on(opts.flux.RESULTS, () => this.update({ didYouMean: opts.flux.results.didYouMean }));
    this.send = (event) => opts.flux.search(event.target.text)
      .then(() => opts.flux.emit('override_query'));
  </script>
</gb-did-you-mean>
