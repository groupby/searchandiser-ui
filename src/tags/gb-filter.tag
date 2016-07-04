<gb-filter>
  <select class="gb-navigation-dropdown { opts.style() }" name="navigationDropdown" onchange={ navigate } placeholder={ title }>
    <option if={ opts.matchAll } value="*">{ opts.matchAll }</option>
    <option each={ navigation.refinements } value={ value } data-count={ count } selected={ value === selectedRefinement().value }>{ value }</option>
  </select>

  <script>
    const navField = opts.field;
    const utils = require('../utils');
    const flux = opts.clone();
    const isTargetNav = (nav) => nav.name === navField;

    this.selectedRefinement = () => this.selected ? this.selected.refinements[0] : {};
    this.navigate = (event) => {
      if (this.selected) opts.flux.unrefine(utils.toRefinement(this.selectedRefinement(), this.selected), { skipSearch: true });
      if (event.target.value === '*') {
        opts.flux.reset();
      } else {
        opts.flux.refine({ navigationName: navField, type: 'Value', value: event.target.value });
      }
    };

    opts.flux.on(opts.flux.RESULTS, res => {
      const searchRequest = opts.flux.query.build();
      flux.query.withConfiguration({ refinements: [] });
      if (searchRequest.refinements) flux.query.withSelectedRefinements(...searchRequest.refinements.filter(ref => ref.navigationName !== navField));
      flux.search(searchRequest.query)
        .then(res => this.update({ navigation: res.availableNavigation.find(isTargetNav) }));
      this.update({  selected: res.selectedNavigation.find(isTargetNav) });
    });

    if (!opts.native) {
      require('tether-select/dist/css/select-theme-default.css');
      this.on('mount', () => new (require('tether-select'))({ el: this.navigationDropdown }));
    }
  </script>

  <style scoped>
    .gb-stylish .gb-ref__badge {
      display: inline-block;
      min-width: 10px;
      max-height: 12px;
      padding: 3px 7px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: bold;
      line-height: 1;
      color: #fff;
      background-color: #ccc;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
    }
  </style>
</gb-filter>
