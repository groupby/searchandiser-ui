<gb-import>

	<div>
		{ responseText }
	</div>

	<script>
    const isRaw = opts.raw === undefined ? false : opts.raw;
    const loadFile = () => {
      const req = new XMLHttpRequest();
      req.onload = () => {
        const { responseText } = req;
        if (isRaw) this.root.innerHTML = responseText;
        else this.update({ responseText });
      };
      console.log(opts);
      req.open('get', opts.url, true);
      req.send();
    };

    this.on('mount', () => loadFile());
	</script>

</gb-import>
