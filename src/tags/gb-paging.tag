<gb-paging>
  <a href="#" onclick="{ prevPage }">Prev</a>
  <a href="#" onclick="{ nextPage }">Next</a>

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
</gb-paging>
