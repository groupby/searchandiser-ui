<gb-template>
  <div class="gb-template" if={ isActive }>
    <yield/>
  </div>

  <script>
    this.isActive = false;
    opts.flux.on(opts.flux.RESULTS, res => this.update({ isActive: res.template.name === opts.templateName }));
  </script>
</gb-template>
