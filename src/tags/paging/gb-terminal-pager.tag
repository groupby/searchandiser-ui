<gb-terminal-pager>
  <div class="gb-terminal-pager { style() }">
    <a class="gb-terminal__link first { backDisabled ? 'disabled' : '' }" if={ terminals } onclick={ pager.first }><span if={ icons } class="gb-paging__icon">&larr;</span> { first_label }</a>
    <yield/>
    <a class="gb-terminal__link last { forwardDisabled ? 'disabled' : '' }" if={ terminals } onclick={ pager.last }>{ last_label } <span if={ icons } class="gb-paging__icon">&rarr;</span></a>
  </div>

  <script>
    this.style = this.parent.style;
    this.terminals = this.parent.terminals;
    this.icons = this.parent.icons;
    this.prev_label = this.parent.prev_label;
    this.next_label = this.parent.next_label;
    this.first_label = this.parent.first_label || 'First';
    this.last_label = this.parent.last_label || 'Last';
    this.pages = this.parent.pages;
    this.pager = this.parent.pager;
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
