<gb-selected-refinement>
  <li class="gb-ref { parentOpts.style() }">
    <a class="gb-ref__link" href="#" onclick={ remove }>×</a>
    <span class="gb-ref__value">{ ref.type === 'Value' ? ref.value : ref.low + ' - ' + ref.high }</span>
  </li>

  <script>
    const utils = require('../../utils');
    this.parentOpts = this.parent.parent.opts;
    this.remove = () => this.parentOpts.flux.unrefine(utils.toRefinement(this.ref, this.nav));
  </script>

  <style scoped>
    .gb-stylish {
      position: relative;
      list-style: none;
      padding: 4px 6px;
      font-size: 14px;
    }

    .gb-stylish .gb-ref__link {
      left: -8px;
      position: absolute;
      color: black;
      text-decoration: none;
    }

    .gb-stylish .gb-ref__link:hover {
      color: red;
      font-weight: bold;
    }
  </style>
</gb-selected-refinement>
