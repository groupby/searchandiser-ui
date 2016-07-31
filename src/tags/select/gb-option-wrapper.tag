<gb-option-wrapper>
  <yield/>

  <script>
    import { Option } from './gb-option';
    this.mixin(new Option().__proto__);
  </script>
</gb-option-wrapper>
