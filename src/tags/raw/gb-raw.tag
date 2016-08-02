<gb-raw>
  <span></span>

  <script>
    this.updateContent = () => this.root.innerHTML = opts.content;
    this.on('update', () => this.updateContent());
    this.updateContent();
  </script>
</gb-raw>
