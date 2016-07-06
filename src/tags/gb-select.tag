<gb-select>
  <select if={ native } name="nativeSelect" onchange={ updateSelection }>
    <option if={ !hasDefault } value="" selected disabled>{ label() }</option>
    <option each={ option in options } value={ optionValue(option) }>{ optionLabel(option) }</option>
  </select>
  <div if={ !native } class="gb-select">
    <button type="button" class="gb-select__button">
      <span>{ label() }</span>
      <img class="gb-select__arrow" src="assets/arrow-down.svg" alt="" />
    </button>
    <div class="gb-select__content">
      <a value="" if={ !hasDefault && selectedOption } onclick={ clearSelection }>{ clear }</a>
      <a each={ option in options } onclick={ selectOption } value={ optionValue(option) }>{ optionLabel(option) }</a>
    </div>
  </div>

  <script>
    const label = opts.label || 'Select';
    const updateCb = opts.update;
    const updateOptions = (selected) => {
      this.nativeSelect.options[0].disabled = !selected;
      this.update({ selected });
    };
    const sendUpdate = (value) => {
      if (updateCb) {
        try {
          updateCb(JSON.parse(value));
        } catch(e) {
          updateCb(value ? value : '*');
        }
      }
    };

    this.optionValue = (option) => typeof option === 'object' ? JSON.stringify(option.value) : option;
    this.optionLabel = (option) => typeof option === 'object' ? option.label : option;

    this.hasDefault = opts.default === undefined ? false : opts.default;
    this.options = opts.options || [];
    if (this.hasDefault) this.selectedOption = this.options[0];
    this.clear = opts.clear === undefined ? 'Unselect' : opts.clear;
    this.label = () => this.selectedOption ? this.selectedOption : (this.selected ? this.clear : label);
    this.native = opts.native === undefined ? false : opts.native;
    this.updateSelection = (event) => {
      updateOptions(event.target.value !== '');
      sendUpdate(event.target.value);
      this.update({ selectedOption: event.target.text });
    };
    this.selectOption = (event) => {
      this.update({ selectedOption: event.target.text });
      sendUpdate(event.target.value);
    };
    this.clearSelection = () => this.update({ selectedOption: undefined });
  </script>

  <style scoped>
    .gb-select {
      position: relative;
      display: inline-block;
    }
    .gb-select:hover .gb-select__content {
      display: block;
    }
    .gb-select:hover .gb-select__button {
      border-color: #aaa;
    }
    .gb-select__button {
      overflow-x: hidden;
      display: flex;
      align-items: center;
      font-size: 14px;
      border: none;
      cursor: pointer;
      padding: 8px 16px;
      width: 100%;
      background-color: #eee;
      border: 2px solid #ddd;
      border-radius: 4px;
      white-space: nowrap;
    }
    .gb-select__button:focus {
      outline: none;
    }
    .gb-select__arrow {
      margin-left: 10px;
      height: 6px;
    }
    .gb-select__content {
      display: none;
      position: absolute;
      min-width: 160px;
      background-color: #f6f6f6;
      box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
      z-index: 100;
      max-height: 300px;
      overflow-y: scroll;
    }
    .gb-select__content a {
      cursor: pointer;
      display: block;
      text-decoration: none;
      color: black;
      padding: 10px 12px;
    }
    .gb-select__content a:hover {
      background-color: #eee;
    }
  </style>
</gb-select>
