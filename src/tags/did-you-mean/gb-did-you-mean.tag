<gb-did-you-mean>
  <yield>
    <gb-list class="gb-did-you-mean { _style }" items={ didYouMean } inline>
      <a onclick={ _scope.send }>{ item }</a>
    </gb-list>
  </yield>

  <script>
    import '../list/gb-list.tag';
    import { DidYouMean } from './gb-did-you-mean';
    this._mixin(DidYouMean);
  </script>
</gb-did-you-mean>
