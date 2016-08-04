<gb-paging>
  <div class="gb-paging">
    <gb-raw-paging flux={ opts.flux } limit={ opts.limit } terminals={ opts.terminals } pages={ opts.pages } icons={ opts.icons } numeric={ opts.numeric }>
      <gb-terminal-pager>
        <gb-pager>
          <gb-pages></gb-pages>
        </gb-pager>
      </gb-terminal-pager>
    </gb-raw-paging>
  </div>

  <script>
    import './gb-raw-paging.tag';
    import './gb-terminal-pager.tag';
    import './gb-pager.tag';
    import './gb-pages.tag';
    this.prev_label = opts.prev_label;
    this.next_label = opts.next_label;
    this.first_label = opts.first_label;
    this.last_label = opts.last_label;
  </script>
</gb-paging>
