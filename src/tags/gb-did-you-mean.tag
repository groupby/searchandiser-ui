<gb-did-you-mean>
  <h3>Did You Mean:</h3>
  <ul class="gb-list">
    <li each="{ dym in didYouMean }">
      <a href="#" onclick="{ send }">{ dym }</a>
    </li>
  </ul>

  <script>
    opts.flux.on('results', () => this.update({ didYouMean: opts.flux.results.didYouMean }));

    this.send = (event) => opts.srch.search(event.target.text)
      .then(() => opts.srch.trigger());
  </script>
</gb-did-you-mean>
