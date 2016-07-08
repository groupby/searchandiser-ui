<gb-paging>
  <div class="gb-paging { opts.style() }">
    <a class="gb-paging__link first { isFirst() ? 'disabled' : '' }" if={ showTerminals } onclick={ firstPage }><span class="gb-paging__icon">&larr;</span> First</a>
    <a class="gb-paging__link prev { isFirst() ? 'disabled' : '' }" onclick={ prevPage }><span class="gb-paging__icon">&lt;</span> Prev</a>
    <ul class="gb-paging__pages" if={ showPages }>
      <span class="gb-paging__ellipsis" if={ !isFirst() && this.currentPage() > this.halfOffset }>&hellip;</span>
      <li each={ page in pages() }>
        <a class="gb-paging__page { currentPage() + 1 === page ? 'selected' : '' }" onclick={ jumpTo }>{ page }</a>
      </li>
      <span class="gb-paging__ellipsis" if={ !isLast() && this.currentPage() < this.totalPages() - this.halfOffset }>&hellip;</span>
    </ul>
    <a class="gb-paging__link next { isLast() ? 'disabled' : '' } { !showPages ? 'expand' : '' }" onclick={ nextPage }>Next <span class="gb-paging__icon">&gt;</span></a>
    <a class="gb-paging__link last { isLast() ? 'disabled' : '' }" if={ showTerminals } onclick={ lastPage }>Last <span class="gb-paging__icon">&rarr;</span></a>
  </div>

  <script>
    opts.flux.on(opts.flux.RESULTS, (res) => this.update({ total: res.totalRecordCount }));
    const limit = opts.limit === undefined ? 5 : opts.limit;
    this.showPages = opts.showPages === undefined ? false : opts.showPages;
    this.showTerminals = opts.showTerminals === undefined ? true : opts.showTerminals;
    this.currentPage = () => opts.flux.page.current;
    this.totalPages = () => opts.flux.page.total;
    this.halfOffset = Math.floor(limit / 2);

    const offsetPages = (value) => {
      value++;
      if (this.currentPage() <= this.halfOffset) {
        return value;
      } else if (this.currentPage() > this.totalPages() - this.halfOffset) {
        return ++value + this.totalPages() - limit;
      } else {
        return value + this.currentPage() - this.halfOffset;
      }
    };
    this.pages = () => [...Array(limit).keys()].map(offsetPages);
    this.firstPage = () => !this.isFirst() && opts.flux.page.reset();
    this.nextPage = () => !this.isLast() && opts.flux.page.next();
    this.prevPage = () => !this.isFirst() && opts.flux.page.prev();
    this.lastPage = () => !this.isLast() && opts.flux.page.last();
    this.jumpTo = (event) => opts.flux.page.jump(new Number(event.target.text) - 1);
    this.isFirst = () => !opts.flux.page.hasPrevious;
    this.isLast = () => !opts.flux.page.hasNext;
  </script>

  <style scoped>
    .gb-stylish a {
      cursor: pointer;
    }

    .gb-stylish.gb-paging {
      display: flex;
    }

    .gb-stylish .gb-paging__link,
    .gb-stylish .gb-paging__page,
    .gb-stylish .gb-paging__ellipsis {
      text-decoration: none;
      color: #888;
    }

    .gb-stylish .gb-paging__link {
      padding: 5px 14px;
    }

    .gb-stylish .gb-paging__link.next.expand {
      margin-left: auto;
    }

    .gb-stylish .gb-paging__pages {
      margin: auto;
      list-style: none;
    }

    .gb-stylish .gb-paging__pages li {
      display: inline;
    }

    .gb-stylish .gb-paging__page {
      padding: 0 4px;
    }

    .gb-stylish .gb-paging__link:hover,
    .gb-stylish .gb-paging__page:hover,
    .gb-stylish .gb-paging__page.selected {
      color: black;
    }

    .gb-stylish .gb-paging__link.disabled {
      color: #ddd;
      cursor: not-allowed;
    }
  </style>
</gb-paging>
