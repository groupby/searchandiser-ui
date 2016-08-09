<gb-collections>
  <ul class="gb-collections { _style }">
    <li each={ collection in collections } class={ active: selected(collection) }>
      <a class="gb-collection" onclick={ switchCollection } data-collection={ collection }>
        <span class="gb-collection__name">{ labels[collection] || collection }</span>
        <span if={ badge } class="gb-collection__count">{ counts[collection] }</span>
      </a>
    </li>
  </ul>

  <script>
    import { Collections } from './gb-collections';
    this.mixin(new Collections().__proto__);
  </script>

  <style scoped>
    .gb-stylish .gb-collection {
      cursor: pointer;
    }
  </style>
</gb-collections>
