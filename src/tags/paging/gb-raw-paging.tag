<gb-raw-paging>
  <div class="gb-raw-paging { style() }">
    <yield/>
  </div>

  <script>
    const { Paging } = require('./gb-paging');
    this.mixin(new Paging());
  </script>
</gb-raw-paging>
