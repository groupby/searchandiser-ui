<gb-select-option>
  <yield/>

  <script>
    this.value = typeof opts.option === 'object' ? JSON.stringify(opts.option.value) : opts.option;
    this.label = typeof opts.option === 'object' ? opts.option.label : opts.option;
  </script>
</gb-select-option>
