<gb-paging>
  <yield>
    <gb-terminal-pager scope="gb-paging">
      <gb-pager scope="gb-paging">
        <gb-pages scope="gb-paging"></gb-pages>
      </gb-pager>
    </gb-terminal-pager>
  </yield>

  <script>
    import './gb-terminal-pager.tag';
    import './gb-pager.tag';
    import './gb-pages.tag';
    import { Paging } from './gb-paging';
    this.mixin(new Paging().__proto__);
  </script>
</gb-paging>
