<gb-raw-paging>
  <div class="gb-raw-paging { style() }">
    <yield/>
  </div>

  <script>
    const { unless } = require('../../utils');
    const limit = unless(opts.limit, 5);
    this.style = unless(opts.style, this.parent.style);
    this.pages = unless(opts.pages, false);
    this.numeric = unless(opts.numeric, false);
    this.terminals = unless(opts.terminals, true);
    this.icons = unless(opts.icons, true);

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

    opts.flux.on(opts.flux.PAGE_CHANGED, ({ pageIndex, finalPage }) => {
      const pageNumbers = opts.flux.page.pageNumbers(limit);
      const lastPage = finalPage + 1;
      this.update({
        pageNumbers,
        currentPage: pageIndex + 1,
        lastPage,
        lowOverflow: pageNumbers[0] !== 1,
        highOverflow: pageNumbers[pageNumbers.length - 1] !== lastPage,
        backDisabled: pageIndex === 0,
        forwardDisabled: pageIndex === finalPage
      });
    });
  </script>
</gb-raw-paging>
