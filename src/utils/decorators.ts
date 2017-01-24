import { META, TagMeta } from '../tags/tag';

export function meta(meta: TagMeta) {
  return function(tagClass: any) {
    tagClass[META] = meta;
  };
}
