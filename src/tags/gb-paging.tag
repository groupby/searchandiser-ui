<gb-paging>
  <div class="gb-paging { opts.style() }">
    <a class="gb-paging__link first { isFirst() ? 'disabled' : '' }" href="#" onclick={ firstPage }><span class="gb-paging__icon">←</span> First</a>
    <a class="gb-paging__link prev { isFirst() ? 'disabled' : '' }" href="#" onclick={ prevPage }><span class="gb-paging__icon">&lt;</span> Prev</a>
    <a class="gb-paging__link next { isLast() ? 'disabled' : '' }" href="#" onclick={ nextPage }>Next <span class="gb-paging__icon">&gt;</span></a>
    <a class="gb-paging__link last { isLast() ? 'disabled' : '' }" href="#" onclick={ lastPage }>Last <span class="gb-paging__icon">→</span></a>
  </div>

  <script>
    opts.flux.on(opts.flux.RESULTS, () => this.update());

    this.firstPage = () => !this.isFirst() && opts.flux.page.reset();
    this.nextPage = () => !this.isLast() && opts.flux.page.next();
    this.prevPage = () => !this.isFirst() && opts.flux.page.prev();
    this.lastPage = () => !this.isLast() && opts.flux.page.last();
    this.isFirst = () => !opts.flux.page.hasPrevious;
    this.isLast = () => !opts.flux.page.hasNext;
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
