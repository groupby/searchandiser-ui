<gb-sort>
  <gb-select class="gb-sort" options={ sorts } native={ opts.native } label={ label } clear={ clear } update={ updateSort }></gb-select>

  <script>
    require('./gb-select.tag');
    this.label = opts.label || 'Sort';
    this.clear = opts.clear || 'Unsorted';
    this.sorts = opts.options || [
      { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
      { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
    ];
    this.updateSort = (value) => {
      if (value !== '*') {
        opts.flux.sort(value);
      } else {
        opts.flux.query.withoutSorts(...this.sorts.map(sort => sort.value));
        opts.flux.search();
      }
    };
  </script>
</gb-sort>
