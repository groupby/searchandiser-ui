<gb-paging>
  <div class="gb-paging { opts.stylish ? 'gb-stylish' : '' }">
    <a class="gb-paging__link prev" href="#" onclick="{ prevPage }"><span class="gb-paging__icon prev">←</span> Prev</a>
    <a class="gb-paging__link next" href="#" onclick="{ nextPage }">Next <span class="gb-paging__icon next">→</span></a>
  </div>

  <script>
    opts.srch.el.on('results', () => {
      this.update();
    });

    this.nextPage = () => {
      const step = this.step(true);
      if (this.hasNext()) this.paginate(step);
    };
    this.prevPage = () => {
      const step = this.step(false);
      if (this.hasPrev()) this.paginate(step);
    };

    this.hasNext = () => this.step(true) < opts.srch.results.totalRecordCount;
    this.hasPrev = () => opts.srch.state.lastStep !== 0;

    this.paginate = (step) => {
      if (step != opts.srch.state.lastStep) {
        opts.srch.state.lastStep = step;
        opts.srch.search(opts.srch.query.skip(step));
      }
    };

    this.step = (add) => {
      const records = opts.srch.results.records.length;
      const skip = opts.srch.state.lastStep + (add ? records : -records);
      return skip >= 0 ? skip : 0;
    };
  </script>

  <style scoped>
    .gb-stylish .gb-paging__link {
      padding: 5px 14px;
      text-decoration: none;
    }
  </style>
</gb-paging>
