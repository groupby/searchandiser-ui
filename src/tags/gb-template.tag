<gb-template>
  <div class="gb-template { opts.style() }" if={ isActive }>
    <yield/>
    <gb-import if={ url } url={ url } raw={ raw }></gb-import>
  </div>

  <script>
    import './gb-import.tag';
    import { unless } from '../utils';
    this.isActive = false;
    this.url = opts.url;
    this.raw = unless(opts.raw, false);
    opts.flux.on(opts.flux.RESULTS, ({ template }) => this.update({ isActive: template.name === opts.templateName }));
  </script>

  <style scoped>
    .gb-stylish.gb-template {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</gb-template>
