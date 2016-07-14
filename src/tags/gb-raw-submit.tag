<gb-raw-submit>
  <yield/>

  <script>
    const label = opts.label || 'Search';
    if (this.root.tagName === 'INPUT') this.root.value = label;
    this.root.addEventListener('click', () => opts.flux.search(document.querySelector('[riot-tag="gb-raw-query"]').value));
  </script>
</gb-raw-submit>
