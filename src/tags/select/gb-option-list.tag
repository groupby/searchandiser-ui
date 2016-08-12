<gb-option-list>
  <ul>
    <li each={ option in opts.options } class={ clear: option.clear }
      if={ !option.clear || !_scope.default && _scope.selectedOption }>
      <yield/>
    </li>
  </ul>

  <style scoped>
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    ul:hover {
      display: block;
    }
    a {
      cursor: pointer;
      display: block;
      text-decoration: none;
      color: black;
      padding: 10px 12px;
    }
    a:hover {
      background-color: #eee;
    }
  </style>
</gb-option-list>
