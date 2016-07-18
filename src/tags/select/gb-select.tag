<gb-select>
  <select if={ native } name="nativeSelect" onchange={ selectNative }>
    <option if={ !hasDefault } value="" selected disabled>{ selectLabel() }</option>
    <option each={ option in options } value={ optionValue(option) }>{ optionLabel(option) }</option>
  </select>
  <div if={ !native } class="gb-select { hover ? 'hoverable' : 'clickable' }">
    <button type="button" class="gb-select__button" name="selectButton" onfocus={ prepFocus } onclick={ unFocus }>
      <span>{ selectLabel() }</span>
      <img class="gb-select__arrow" src={ iconUrl } alt="" />
    </button>
    <div class="gb-select__content">
      <a if={ !hasDefault && selectedOption } onclick={ clearSelection } value="">{ clear }</a>
      <a each={ option in options } onclick={ selectCustom } value={ optionValue(option) }>{ optionLabel(option) }</a>
    </div>
  </div>

  <script>
    import { Select } from './gb-select';
    this.mixin(new Select());
  </script>

  <style scoped>
    .gb-select {
      position: relative;
      display: inline-block;
    }
    .gb-select.hoverable:hover .gb-select__content,
    .gb-select.clickable .gb-select__button:focus + .gb-select__content,
    .gb-select__content:hover {
      display: block;
    }
    .gb-select:hover .gb-select__button,
    .gb-select .gb-select__button:focus {
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
      margin-top: 2px;
      height: 24px;
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
