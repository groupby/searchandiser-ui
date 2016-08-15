<gb-available-refinement>
  <li class="gb-ref { _style }">
    <a class="gb-ref__link" onclick={ send }>
      <span class="gb-ref__title">{ toView(ref) }</span>
      <span class="gb-filler"></span>
      <gb-badge if={ badge }>{ ref.count }</gb-badge>
    </a>
  </li>

  <script>
    import '../badge/gb-badge.tag';
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
  </style>
</gb-available-refinement>
