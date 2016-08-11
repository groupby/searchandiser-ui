<gb-pager>
  <div class="gb-pager { _style }">
    <a class="gb-pager__link prev { disabled: _scope.backDisabled }" onclick={ _scope.pager.prev }>
      <span if={ _scope.icons } class="gb-paging__icon">&lt;</span>
      { prev_label }
    </a>
    <yield/>
    <a class="gb-pager__link next { disabled: _scope.forwardDisabled }" onclick={ _scope.pager.next }>
      { next_label }
      <span if={ _scope.icons } class="gb-paging__icon">&gt;</span>
    </a>
  </div>

  <script>
    this.prev_label = this._scope.prev_label || 'Prev';
    this.next_label = this._scope.next_label || 'Next';
  </script>

  <style scoped>
    .gb-stylish a {
      cursor: pointer;
    }

    .gb-stylish.gb-pager {
      display: flex;
    }

    .gb-stylish .gb-pager__link {
      text-decoration: none;
      color: #888;
    }

    .gb-stylish .gb-pager__link {
      padding: 5px 14px;
    }

    .gb-stylish .gb-pager__link:hover {
      color: black;
    }

    .gb-stylish .gb-pager__link.disabled {
      color: #ddd;
      cursor: not-allowed;
    }

    .gb-stylish gb-pages {
      flex: 1;
    }
  </style>
</gb-pager>
