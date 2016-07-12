<gb-did-you-mean>
  <ul class="gb-did-you-mean { opts.style() }">
    <li class="gb-did-you-mean__option" each="{ dym in didYouMean }">
      <a onclick="{ send }">{ dym }</a>
    </li>
  </ul>

  <script>
    opts.flux.on(opts.flux.RESULTS, res => this.update({ didYouMean: res.didYouMean }));
    this.send = (event) => opts.flux.rewrite(event.target.text);
  </script>

  <style scoped>
    .gb-stylish.gb-did-you-mean {
      display: flex;
      list-style: none;
    }
    .gb-stylish.gb-did-you-mean a {
      cursor: pointer;
    }
    .gb-stylish .gb-did-you-mean__option {
      flex: 1;
    }
  </style>
</gb-did-you-mean>
