<gb-paging>
  <div class="gb-paging">
    <gb-raw-paging flux={ opts.flux } limit={ opts.limit } terminals={ opts.terminals } pages={ opts.pages } icons={ opts.icons }>
      <gb-terminal-pager>
        <gb-pager>
          <gb-pages></gb-pages>
        </gb-pager>
      </gb-terminal-pager>
    </gb-raw-paging>
  </div>

  <script>
    this.style = opts.style;
    this.prev_label = opts.prev_label;
    this.next_label = opts.next_label;
    this.first_label = opts.first_label;
    this.last_label = opts.last_label;
    require('./gb-raw-paging.tag');
    require('./gb-pager.tag');
    require('./gb-terminal-pager.tag');
    require('./gb-pages.tag');
  </script>
</gb-paging>
