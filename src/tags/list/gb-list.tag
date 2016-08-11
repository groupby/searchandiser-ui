<gb-list>
  <ul class={ _style }>
    <li each={ item in opts.items } class={ active: opts.activation(item) }>
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
      display: inline-block;
      margin: 0 10px;
    }
    gb-list > ul.gb-stylish a {
      color: #888;
      cursor: pointer;
    }
    gb-list > ul.gb-stylish a:hover {
      color: black;
    }
  </style>
</gb-list>
