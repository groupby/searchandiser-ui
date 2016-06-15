export function toRefinement(ref, nav) {
  const refinement = Object.assign({}, ref, { navigationName: nav.name });
  delete refinement['count'];
  return refinement;
}
