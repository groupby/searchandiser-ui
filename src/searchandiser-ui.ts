/// <reference path="./all.d.ts" />

import { Searchandiser } from './core';
import './tags/gb-query.tag';
import './tags/gb-results.tag';
import './tags/gb-record-count.tag';
import './tags/gb-paging.tag';
import './tags/gb-related-searches.tag';
import './tags/gb-did-you-mean.tag';
import './tags/gb-available-navigation.tag';
import './tags/gb-selected-navigation.tag';

if (!window['searchandiser']) {
  window['searchandiser'] = Searchandiser;
}
