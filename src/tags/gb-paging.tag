<gb-paging>
  <div class="gb-paging { opts.stylish ? 'gb-stylish' : '' }">
    <a class="gb-paging__link prev" href="#" onclick="{ prevPage }"><span class="gb-paging__icon prev">←</span> Prev</a>
    <a class="gb-paging__link next" href="#" onclick="{ nextPage }">Next <span class="gb-paging__icon next">→</span></a>
  </div>

  <script>
    opts.flux.on(opts.flux.RESULTS, () => this.update());

    this.nextPage = () => opts.flux.nextPage().catch(this.handleErr);
    this.prevPage = () => opts.flux.lastPage().catch(this.handleErr);
    this.handleErr = err => console.error(err.message);
  </script>

  <style scoped>
    .gb-stylish .gb-paging__link {
      padding: 5px 14px;
      text-decoration: none;
    }
  </style>
</gb-paging>
