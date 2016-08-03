<gb-template>
  <div class="gb-template { opts.style() }" if={ isActive }>
    <yield/>
    <gb-snippet if={ url } url={ url } raw={ raw }></gb-snippet>
  </div>

  <script>
    import { Template } from './gb-template';
    this.mixin(new Template().__proto__);
  </script>

  <style scoped>
    .gb-stylish.gb-template {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</gb-template>
