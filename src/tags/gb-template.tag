<gb-template>
  <div class="gb-template { opts.style() }" if={ isActive }>
    <yield/>
    <gb-import if={ url } url={ url } raw={ raw }></gb-import>
  </div>

  <script>
    require('./gb-import.tag');
    this.isActive = false;
    this.url = opts.url;
    this.raw = opts.raw === undefined ? false : opts.raw;
    opts.flux.on(opts.flux.RESULTS, res => this.update({ isActive: res.template.name === opts.templateName }));
  </script>

  <style scoped>
    .gb-stylish.gb-template {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</gb-template>
