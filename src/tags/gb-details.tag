<gb-details>
  <div class="gb-details">
    <yield/>
  </div>

  <script>
    const utils = require('../utils');
    const idParam = opts.idParam || 'id';
    const query = utils.getParam(idParam);

    this.struct = opts.config.structure;
    opts.flux.on(opts.flux.DETAILS, (record) => this.update({ record }));
    if (query) opts.flux.details(query);
  </script>
</gb-details>
