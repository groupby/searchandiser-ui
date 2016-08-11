<gb-terminal-pager>
  <div class="gb-terminal-pager { _style }">
    <a class="gb-terminal__link first { disabled: _scope.backDisabled }" if={ _scope.terminals } onclick={ _scope.pager.first }>
      <span if={ _scope.icons } class="gb-paging__icon">&larr;</span>
      { _scope.numeric ? 1 : first_label }
    </a>
    <yield/>
    <a class="gb-terminal__link last { disabled: _scope.forwardDisabled }" if={ _scope.terminals } onclick={ _scope.pager.last }>
      { _scope.numeric ? _scope.lastPage : last_label }
      <span if={ _scope.icons } class="gb-paging__icon">&rarr;</span>
    </a>
  </div>

  <script>
    this.last_label = this._scope.last_label || 'Last';
    this.first_label = this._scope.first_label || 'First';
  </script>

  <style scoped>
    .gb-stylish a {
      cursor: pointer;
    }

    .gb-stylish.gb-terminal-pager {
      display: flex;
      width: 100%;
    }

    .gb-stylish .gb-terminal__link {
      text-decoration: none;
      color: #888;
      padding: 5px 14px;
    }

    .gb-stylish .gb-terminal__link:hover {
      color: black;
    }

    .gb-stylish .gb-terminal__link.disabled {
      color: #ddd;
      cursor: not-allowed;
    }

    .gb-stylish gb-pager {
      flex: 1;
    }
  </style>
</gb-terminal-pager>
