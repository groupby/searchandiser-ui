<gb-paging>
  <yield>
    <gb-terminal-pager>
      <gb-pager>
        <gb-pages></gb-pages>
      </gb-pager>
    </gb-terminal-pager>
  </yield>

  <script>
    import './gb-terminal-pager.tag';
    import './gb-pager.tag';
    import './gb-pages.tag';
    import { Paging } from './gb-paging';
    this._mixin(Paging);
  </script>
</gb-paging>
