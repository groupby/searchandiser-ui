<gb-template>
  <div class="gb-template { opts.style() }" if={ isActive }>
    <yield/>
  </div>

  <script>
    this.isActive = false;
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
