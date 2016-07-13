<gb-sort>
  <gb-select class="gb-sort" options={ sorts } native={ opts.native } label={ label } clear={ clear } update={ updateSort } hover={ opts.onHover }></gb-select>

  <script>
    require('./gb-select.tag');
    this.label = opts.label || 'Sort';
    this.clear = opts.clear || 'Unsorted';
    this.sorts = opts.options || [
      { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
      { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
    ];
    this.sortValues = () => this.sorts.map(sort => sort.value);
    this.updateSort = (value) => {
      if (value !== '*') {
        opts.flux.sort(value, this.sortValues());
      } else {
        opts.flux.query.withoutSorts(...this.sortValues());
        opts.flux.search();
      }
    };
  </script>
</gb-sort>
