<gb-did-you-mean>
  <h3>Did You Mean:</h3>
  <ul class="gb-list">
    <li each="{ dym in didYouMean }">
      <a href="#" onclick="{ send }">{ dym }</a>
    </li>
  </ul>

  <script>
    opts.flux.on(opts.flux.RESULTS, res => this.update({ didYouMean: res.didYouMean }));
    this.send = (event) => opts.flux.rewrite(event.target.text);
  </script>
</gb-did-you-mean>
