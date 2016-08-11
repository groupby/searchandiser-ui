<gb-collection-item>
  <a class="gb-collection" data-collection={ opts.item } onclick={ _scope.switchCollection }>
    <span class="gb-collection__name">{ _scope.labels[opts.item] || opts.item }</span>
    <span if={ _scope.fetchCounts } class="gb-collection__count">{ _scope.counts[opts.item] }</span>
  </a>
</gb-collection-item>
