<gb-pager>
  <div class="gb-pager { style() }">
    <a class="gb-pager__link prev { disabled: backDisabled }" onclick={ pager.prev }><span if={ icons } class="gb-paging__icon">&lt;</span> { prev_label }</a>
    <yield/>
    <a class="gb-pager__link next { disabled: forwardDisabled }" onclick={ pager.next }>{ next_label } <span if={ icons } class="gb-paging__icon">&gt;</span></a>
  </div>

  <script>
    this.style = this.parent.style;
    this.terminals = this.parent.terminals;
    this.numeric = this.parent.numeric;
    this.icons = this.parent.icons;
    this.prev_label = this.parent.prev_label || 'Prev';
    this.next_label = this.parent.next_label || 'Next';
    this.first_label = this.parent.first_label;
    this.last_label = this.parent.last_label;
    this.pages = this.parent.pages;
    this.pager = this.parent.pager;
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
