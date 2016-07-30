<gb-submit>
  <gb-raw-submit flux={ opts.flux } class={ opts.stylish() }>
    <a class="gb-submit">&#128269;</a>
  </gb-raw-submit>

  <script>
    import './gb-raw-submit.tag';
  </script>

  <style scoped>
    .gb-stylish .gb-submit {
      color: #888;
      padding: 4px;
    }
    .gb-stylish .gb-submit:hover {
      color: black;
      cursor: pointer;
    }
  </style>
</gb-submit>
