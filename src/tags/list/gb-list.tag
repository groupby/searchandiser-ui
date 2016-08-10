<gb-list>
  <ul class="{ _style } { inline: 'inline' in opts }">
    <li each={ item, i in opts.items } class={ active: isActive(i) }>
      <yield/>
    </li>
  </ul>

  <style>
    gb-list > ul.gb-stylish {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    gb-list > ul.gb-stylish > li {
      margin: 0 10px;
    }
    gb-list > ul.gb-stylish.inline > li {
      display: inline-block;
    }
    gb-list > ul.gb-stylish a {
      color: #888;
      cursor: pointer;
    }
    gb-list > ul.gb-stylish a:hover {
      color: black;
    }
  </style>

  <script>
    this.isActive = opts.activation;
  </script>
</gb-list>
