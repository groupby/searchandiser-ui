<gb-available-refinement>
  <li class="gb-ref { parentOpts.style() }">
    <a class="gb-ref__link" href="#" onclick={ send }>
      <span class="gb-ref__title">{ toView(ref) }</span>
      <span class="gb-filler"></span>
      <span class="gb-ref__badge" if={ badge }>{ ref.count }</span>
    </a>
  </li>

  <script>
    import { AvailableRefinement } from './gb-refinement';
    this.mixin(new AvailableRefinement().__proto__);
  </script>

  <style scoped>
    .gb-stylish {
      list-style: none;
    }

    .gb-stylish .gb-filler {
      flex-grow: 1;
    }

    .gb-stylish .gb-ref__link {
      display: flex;
      padding: 4px 6px;
      border-radius: 4px;
      color: black;
      font-size: 14px;
      text-decoration: none;
      align-items: baseline;
    }

    .gb-stylish .gb-ref__link:hover {
      background-color: #ddd;
    }

    .gb-stylish .gb-ref__badge {
      display: inline-block;
      min-width: 10px;
      max-height: 20px;
      padding: 4px 7px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: bold;
      line-height: 1;
      color: #fff;
      background-color: #ccc;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
    }
  </style>
</gb-available-refinement>
