<gb-select>
  <yield>
    <gb-native-select if={ native }/>
    <gb-custom-select if={ !native }/>
  </yield>

  <script>
    import './gb-native-select.tag';
    import './gb-custom-select.tag';
    import { Select } from './gb-select';
    this.mixin(new Select().__proto__);
  </script>
</gb-select>
