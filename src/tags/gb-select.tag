<gb-select>
  <select if={ native } name="nativeSelect" onchange={ updateSelection }>
    <option value="" selected disabled>{ label() }</option>
    <option each={ options } value={ JSON.stringify(value) }>{ label }</option>
  </select>
  <div if={ !native } class="gb-select">
    <button type="button" class="gb-select__button">
      <span>{ label() }</span>
      <img class="gb-select__arrow" src="assets/arrow-down.svg" alt="" />
    </button>
    <div class="gb-select__content">
      <a value="" if={ selectedOption } onclick={ clearSelection }>{ clear }</a>
      <a each={ options } onclick={ selectOption } value={ JSON.stringify(value) }>{ label }</a>
    </div>
  </div>

  <script>
    const label = opts.label || 'Select';
    const updateCb = opts.update;
    const updateOptions = (selected) => {
      this.nativeSelect.options[0].disabled = !selected;
      this.update({ selected });
    };

    this.clear = opts.clear === undefined ? 'Unselect' : opts.clear;
    this.label = () => this.selectedOption ? this.selectedOption : (this.selected ? this.clear : label);
    this.native = opts.native === undefined ? false : true;
    this.options = opts.options || [];
    this.updateSelection = (event) => {
      updateOptions(event.target.value !== '');
      if (updateCb) updateCb(event.target.value ? JSON.parse(event.target.value) : '*');
    };
    this.selectOption = (event) => this.update({ selectedOption: event.target.text });
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
      padding: 16px;
      width: 100%;
      background-color: #eee;
      border: 2px solid #ddd;
      border-radius: 4px;
      white-space: nowrap;
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
    }
    .gb-select__content a {
      cursor: pointer;
      display: block;
      text-decoration: none;
      color: black;
      padding: 4px 6px;
    }
    .gb-select__content a:hover {
      background-color: #f1f1f1;
    }
  </style>
</gb-select>
