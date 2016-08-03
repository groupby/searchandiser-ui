<gb-selected-refinement>
  <li class="gb-ref { parentOpts.style() }">
    <a class="gb-ref__link" href="#" onclick={ remove }>&times;</a>
    <span class="gb-ref__value">{ toView(ref) }</span>
  </li>

  <script>
    import { SelectedRefinement } from './gb-refinement';
    this.mixin(new SelectedRefinement().__proto__);
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
