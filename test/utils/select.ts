export function selectOptions() {
  return <NodeListOf<HTMLLIElement>>document.querySelectorAll('.gb-select__option:not(.clear) gb-option a');
}

export function label() {
  return <HTMLSpanElement>document.querySelector('.gb-button__label');
}

export function clearOption() {
  return <HTMLLIElement>document.querySelector('.gb-select__option.clear gb-option a');
}
