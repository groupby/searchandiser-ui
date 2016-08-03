<gb-import>
	<div class="gb-import">
		{ responseText }
	</div>

	<script>
		const { Import } = require('./gb-import');
		this.mixin(new Import().__proto__);
	</script>
</gb-import>
