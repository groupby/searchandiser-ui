/**
 * Data Helpers
 */

import { SelectedRangeRefinement, SelectedValueRefinement } from 'groupby-api';

export function refinement(field: string, value: any): SelectedValueRefinement;
export function refinement(field: string, low: number, high: number): SelectedRangeRefinement;
export function refinement(navigationName: string, valueOrLow: any, high?: number): any {
  if (high) {
    return { navigationName, low: valueOrLow, high, type: 'Range' };
  } else {
    return { navigationName, value: valueOrLow, type: 'Value' };
  }
}
