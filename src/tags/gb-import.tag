<gb-import>

	<div>
		{ responseText }
	</div>

	<script>
		const { unless } = require('../utils');
    const isRaw = unless(opts.raw, false);
    const loadFile = () => {
      const req = new XMLHttpRequest();
      req.onload = () => {
        const { responseText } = req;
        if (isRaw) {
					this.root.innerHTML = responseText;
        } else {
					this.update({ responseText });
				}
      };
      req.open('get', opts.url, true);
      req.send();
    };

    this.on('mount', () => loadFile());
	</script>

</gb-import>
