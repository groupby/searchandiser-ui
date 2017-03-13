import { Details } from '../../src/tags/details/gb-details';
import suite from './_suite';

const MIXIN = { config: { structure: {} } };

suite<Details>('gb-details', MIXIN, ({ itMountsTag }) => {

  itMountsTag();
});
