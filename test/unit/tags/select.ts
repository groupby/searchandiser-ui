import { Select } from '../../../src/tags/select/gb-select';
import suite from './_suite';
import { expect } from 'chai';

const SCOPE = { _config: {} };

suite('gb-select', Select, { _scope: SCOPE }, ({ tag }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag().iconUrl).to.eql(tag().iconUrl);
    expect(tag().label).to.eql('Select');
    expect(tag().clearOption).to.eql({ label: 'Unselect', clear: true });
    expect(tag().options).to.eql([]);
    expect(tag().callback).to.be.undefined;
    expect(tag().selectedOption).to.be.undefined;
    expect(tag().selected).to.be.undefined;
    expect(tag().focused).to.be.undefined;
    expect(tag().default).to.be.true;
    expect(tag()._scope).to.eq(SCOPE);
    expect(tag()._config).to.eql({});
  });

  it('should accept override from _scope', () => {
    const options = [
      { label: 'Value Descending', value: { field: 'value', order: 'Descending' } },
      { label: 'Value Ascending', value: { field: 'value', order: 'Ascending' } }
    ];
    const onselect = () => null;

    tag()._scope = <any>{
      _config: {
        hover: true,
        native: false,
        clear: 'None selected',
        label: 'Choice'
      },
      options,
      onselect
    };
    tag().init();

    expect(tag().label).to.eql('Choice');
    expect(tag().clearOption).to.eql({ label: 'None selected', clear: true });
    expect(tag().options).to.eql(options);
    expect(tag().callback).to.eq(onselect);
    expect(tag()._config).to.eql(tag()._scope._config);
  });

  it('should override selectedOption with first label when options set and clear undefined', () => {
    const options = [
      { label: 'Value Descending', value: { field: 'value', order: 'Descending' } },
      { label: 'Value Ascending', value: { field: 'value', order: 'Ascending' } }
    ];

    tag()._scope = <any>{ options, _config: {} };
    tag().init();

    expect(tag().default).to.be.true;
    expect(tag().selectedOption).to.eq(options[0].label);
  });
});
