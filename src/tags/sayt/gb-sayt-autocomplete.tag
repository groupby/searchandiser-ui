<gb-sayt-autocomplete>
  <gb-sayt-categories></gb-sayt-categories>
  <gb-sayt-divider></gb-sayt-divider>
  <gb-sayt-search-terms></gb-sayt-search-terms>
  <gb-sayt-divider></gb-sayt-divider>
  <gb-sayt-refinements each={ navigations }></gb-sayt-refinements>

  <script>
    import './gb-sayt-categories.tag';
    import './gb-sayt-search-terms.tag';
    import './gb-sayt-refinements.tag';
    import './gb-sayt-divider.tag';
  </script>

  <style scoped>
  .gb-stylish :scope {
    min-width: 210px;
  }
  </style>
</gb-sayt-autocomplete>
