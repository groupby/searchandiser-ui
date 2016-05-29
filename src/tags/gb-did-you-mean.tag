<gb-did-you-mean>
  <h3>Did You Mean:</h3>
  <ul class="gb-list">
    <li each="{ dym in didYouMean }">
      <a href="#" onclick="{ send }">{ dym }</a>
    </li>
  </ul>

  <script>
    opts.srch.el.on('results', () => {
      this.didYouMean = opts.srch.results.didYouMean;
      this.update();
    });

    this.send = (event) => opts.srch.search(event.target.text);
  </script>
</gb-did-you-mean>
