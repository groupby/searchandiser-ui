<gb-paging>
  <div class="gb-paging { opts.stylish ? 'gb-stylish' : '' }">
    <a class="gb-paging__link prev" href="#" onclick="{ prevPage }"><span class="gb-paging__icon prev">←</span> Prev</a>
    <a class="gb-paging__link next" href="#" onclick="{ nextPage }">Next <span class="gb-paging__icon next">→</span></a>
  </div>

  <script>
    opts.flux.on('results', () => this.update());

    this.nextPage = () => opts.flux.nextPage()
      .then(() => opts.srch.trigger());
    this.prevPage = () => opts.flux.lastPage()
      .then(() => opts.srch.trigger());
  </script>

  <style scoped>
    .gb-stylish .gb-paging__link {
      padding: 5px 14px;
      text-decoration: none;
    }
  </style>
</gb-paging>
