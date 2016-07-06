<gb-sort>
  <select class="gb-sort" name="select" onchange={ updateSort }>
    <option if={ !selected.length } value="*" selected disabled>{ default }</option>
    <option if={ selected.length } value="*">{ clear }</option>
    <option each={ sorts } value={ JSON.stringify(value) }>{ label }</option>
  </select>

  <script>
    this.selected = [];
    this.default = opts.default || 'Sort';
    this.clear = opts.clear || 'Unsorted';
    this.sorts = opts.options || [
      { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
      { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
    ];
    opts.flux.on(opts.flux.RESULTS, () => this.update({ selected: opts.flux.query.rawRequest.sort }));
    this.updateSort = event => {
      const value = event.target.value
      if (value !== '*') {
        opts.flux.sort(JSON.parse(value));
      } else {
        opts.flux.query.withoutSorts(...this.sorts.map(sort => sort.value));
        opts.flux.search();
      }
    };

    if (!opts.native) {
      require('tether-select/dist/css/select-theme-default.css');
      this.on('mount', () => new (require('tether-select'))({ el: this.select }));
    }
  </script>
</gb-sort>
