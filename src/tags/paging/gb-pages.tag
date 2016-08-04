<gb-pages>
  <ul class="gb-pages { _style }" if={ pages }>
    <span class="gb-pages__ellipsis" if={ lowOverflow }>&hellip;</span>
    <li each={ pageNumber in pageNumbers }>
      <a class="gb-pages__page { selected: currentPage === pageNumber }" onclick={ jumpTo }>{ pageNumber }</a>
    </li>
    <span class="gb-pages__ellipsis" if={ highOverflow }>&hellip;</span>
  </ul>

  <script>
    this.pages = this.parent.pages;
    this.jumpTo = ({ target }) => this.parent.pager.jump(Number(target.text) - 1);
  </script>

  <style scoped>
    .gb-stylish a {
      cursor: pointer;
    }

    .gb-stylish.gb-pages {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    .gb-stylish.gb-pages li {
      display: inline;
    }

    .gb-stylish .gb-pages__page,
    .gb-stylish .gb-pages__ellipsis {
      text-decoration: none;
      color: #888;
    }

    .gb-stylish .gb-pages__page {
      padding: 0 4px;
    }

    .gb-stylish .gb-pages__page:hover,
    .gb-stylish .gb-pages__page.selected {
      color: black;
    }
  </style>
</gb-pages>
