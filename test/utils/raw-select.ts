export function label() {
  return <HTMLSpanElement>document.querySelector('.gb-select__label');
}

export function clearOption() {
  return <HTMLLIElement>document.querySelector('.gb-select__option.clear > gb-option-wrapper');
}

export function selectOptions() {
  return <NodeListOf<HTMLLIElement>>document.querySelectorAll('.gb-select__option:not(.clear) > gb-option-wrapper');
}
