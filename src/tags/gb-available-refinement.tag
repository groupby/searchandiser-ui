<gb-available-refinement>
  <li class="gb-ref { parent.stylish ? 'gb-stylish' : '' }">
    <a class="gb-ref__link" href="#" onclick={ send }>
      <span class="gb-ref__title">{ ref.type === 'Value' ? ref.value : ref.low + ' - ' + ref.high }</span>
      <span class="gb-filler"></span>
      <span class="gb-ref__badge" if={ parent.badge }>{ ref.count }</span>
    </a>
  </li>

  <script>
    this.send = () => opts.flux.refine(this.generateSelectedRefinement())
      .then(() => opts.srch.trigger());
    this.generateSelectedRefinement = () => {
      const refinement = Object.assign({}, opts.ref, { navigationName: this.parent.nav.name });
      delete refinement['count'];
      return refinement;
    };
  </script>

  <style scoped>
    .gb-stylish {
      list-style: none;
    }

    .gb-stylish .gb-filler {
      flex-grow: 1;
    }

    .gb-stylish .gb-ref__link {
      display: flex;
      padding: 4px 6px;
      border-radius: 4px;
      color: black;
      font-size: 14px;
      text-decoration: none;
      align-items: center;
    }

    .gb-stylish .gb-ref__link:hover {
      background-color: #ddd;
    }

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
</gb-available-refinement>
