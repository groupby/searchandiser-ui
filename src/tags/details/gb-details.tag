<gb-details>
  <div class="gb-details">
    <yield/>
  </div>

  <script>
    import { Details } from './gb-details';
    this.mixin(new Details().__proto__);
  </script>
</gb-details>
