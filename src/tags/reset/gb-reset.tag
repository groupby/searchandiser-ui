<gb-reset>
  <gb-raw-reset flux={ opts.flux } class={ _style }>
    <a class="gb-reset">&times;</a>
  </gb-raw-reset>

  <script>
    import './gb-raw-reset.tag';
  </script>

  <style scoped>
    .gb-stylish .gb-reset {
      color: #888;
      padding: 4px;
    }
    .gb-stylish .gb-reset:hover {
      color: black;
      cursor: pointer;
    }
  </style>
</gb-reset>
