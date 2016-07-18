<gb-raw-sort>
  <gb-raw-select class="gb-sort" passthrough={ passthrough }>
    <yield/>
  </gb-raw-select>

  <script>
    const { checkNested } = require('../../utils');
    const parentOpts = opts.passthrough || opts;
    const options = checkNested(parentOpts.config, 'tags', 'sort', 'options') ? parentOpts.config.tags.sort.options
      : parentOpts.options
      || [
        { label: 'Name Descending', value: { field: 'title', order: 'Descending' } },
        { label: 'Name Ascending', value: { field: 'title', order: 'Ascending' } }
      ];
    const sortValues = () => options.map(option => option.value);
    
    this.updateValues = (value) => parentOpts.flux.sort(value, sortValues());
    
    this.passthrough = Object.assign({}, parentOpts.__proto__, {
      options,
      update: this.updateValues,
      hover: parentOpts.onHover,
      default: true
    });
  </script>
</gb-raw-sort>