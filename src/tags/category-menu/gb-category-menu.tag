<gb-category-menu>
  <div class="gb-menu { _style }">
    <div class="gb-menu__item" each={ opts.sections }>
      <gb-category-dropdown class="gb-category-dropdown"></gb-category-dropdown>
    </div>
  </div>

  <script>
    import './gb-category-dropdown.tag';
    import './gb-category-section.tag';
  </script>

  <style scoped>
    .gb-stylish.gb-menu {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  </style>
</gb-category-menu>
