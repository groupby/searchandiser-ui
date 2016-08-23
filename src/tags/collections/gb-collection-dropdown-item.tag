<gb-collection-dropdown-item>
  <a class="gb-collection" onclick={ selectDropdown }>
    <span class="gb-collection__name">{ option.label || option }</span>
    <gb-badge>{ _scope.counts[option.value || option] }</gb-badge>
  </a>

  <script>
    this.selectDropdown = () => {
      if (typeof this.option === 'object') {
        this._scope.selectCustom(this.option);
      } else {
        this._scope.selectCustom({
          label: this.option,
          value: this.option
        });
      }
    };
  </script>
</gb-collection-dropdown-item>
