<gb-raw-paging>
  <div class="gb-raw-paging { style() }">
    <yield/>
  </div>

  <script>
    const limit = opts.limit === undefined ? 5 : opts.limit;
    this.style = this.parent ? this.parent.style : opts.style;
    this.pages = opts.pages === undefined ? false : opts.pages;
    this.terminals = opts.terminals === undefined ? true : opts.terminals;
    this.numeric = opts.numeric === undefined ? true : opts.numeric;
    this.icons = opts.icons === undefined ? true : opts.icons;

    this.prev_label = this.parent ? this.parent.prev_label : opts.prev_label;
    this.next_label = this.parent ? this.parent.next_label : opts.next_label;
    this.first_label = this.parent ? this.parent.first_label : opts.first_label;
    this.last_label = this.parent ? this.parent.last_label : opts.last_label;

    this.pager = {
      first: () => !this.backDisabled && opts.flux.page.reset(),
      prev: () => !this.backDisabled && opts.flux.page.prev(),
      next: () => !this.forwardDisabled && opts.flux.page.next(),
      last: () => !this.forwardDisabled && opts.flux.page.last(),
      jump: (page) => opts.flux.page.jump(page)
    };

    opts.flux.on(opts.flux.PAGE_CHANGED, (pageInfo) => {
      const pageNumbers = opts.flux.page.pageNumbers(limit);
      this.update({
        pageNumbers,
        currentPage: pageInfo.pageIndex + 1,
        lastPage: pageInfo.finalPage + 1,
        lowOverflow: pageNumbers[0] !== 1,
        highOverflow: pageNumbers[pageNumbers.length - 1] !== pageInfo.finalPage + 1,
        backDisabled: pageInfo.pageIndex === 0,
        forwardDisabled: pageInfo.pageIndex === pageInfo.finalPage
      });
    });
  </script>
</gb-raw-paging>
