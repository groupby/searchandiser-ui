<gb-raw-submit>
  <yield/>

  <script>
    const ENTER_KEY = 13;
    this.root.addEventListener('click', (event) => opts.flux.search(document.querySelector('[riot-tag="gb-raw-query"]').value));
  </script>
</gb-raw-submit>
