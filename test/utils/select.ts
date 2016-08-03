export function clearOption() {
  return <HTMLLIElement>document.querySelector('.gb-select__option.clear gb-option');
}

export function selectOptions() {
  return <NodeListOf<HTMLLIElement>>document.querySelectorAll('.gb-select__option:not(.clear) gb-option');
}
