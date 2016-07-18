<gb-option-wrapper>
  <yield/>

  <script>
    import { optionLabel, optionValue } from './gb-select';
    this.label = optionLabel(opts.option);
    this.value = optionValue(opts.option);
  </script>
</gb-option-wrapper>
