<gb-sort>
  <gb-select class="gb-sort" options={ sorts } native={ opts.native } update={ updateSort } hover={ opts.onHover } default="true"></gb-select>

  <script>
    const { checkNested } = require('../utils');
    this.sorts = checkNested(opts.config, 'tags', 'sort', 'options') ? opts.config.tags.sort.options
      : opts.options
      || [
        { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
        { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
      ];
    this.sortValues = () => this.sorts.map(sort => sort.value);
    this.updateSort = (value) => opts.flux.sort(value, this.sortValues());
  </script>
</gb-sort>
