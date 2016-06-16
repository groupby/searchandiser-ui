<gb-paging>
  <div class="gb-paging { opts.style() }">
    <a class="gb-paging__link prev { isFirst() ? 'disabled' : '' }" href="#" onclick="{ prevPage }"><span class="gb-paging__icon">←</span> Prev</a>
    <a class="gb-paging__link next { isLast() ? 'disabled' : '' }" href="#" onclick="{ nextPage }">Next <span class="gb-paging__icon">→</span></a>
  </div>

  <script>
    opts.flux.on(opts.flux.RESULTS, () => this.update());

    this.nextPage = () => !this.isLast() && opts.flux.nextPage();
    this.prevPage = () => !this.isFirst() && opts.flux.lastPage();
    this.isFirst = () => opts.flux.results.pageInfo.recordStart === 1;
    this.isLast = () => opts.flux.results.pageInfo.recordEnd === opts.flux.results.totalRecordCount;
  </script>

  <style scoped>
    .gb-stylish .gb-paging__link {
      padding: 5px 14px;
      text-decoration: none;
      color: #888;
    }

    .gb-stylish .gb-paging__link:hover {
      color: black;
    }

    .gb-stylish .gb-paging__link.disabled {
      color: #ddd;
      cursor: not-allowed;
    }
  </style>
</gb-paging>
