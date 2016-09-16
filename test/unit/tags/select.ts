import { Select } from '../../../src/tags/select/gb-select';
import suite from './_suite';
import { expect } from 'chai';

suite('gb-select', Select, { _scope: { opts: {} } }, ({ tag }) => {
  it('should have default values', () => {
    tag().init();

    expect(tag().iconUrl).to.eql(tag().iconUrl);
    expect(tag().label).to.eql('Select');
    expect(tag().clearOption).to.eql({ label: 'Unselect', clear: true });
    expect(tag().options).to.eql([]);
    expect(tag().hover).to.be.false;
    expect(tag().native).to.be.false;
    expect(tag().callback).to.be.undefined;
    expect(tag().selectedOption).to.be.undefined;
    expect(tag().selected).to.be.undefined;
    expect(tag().focused).to.be.undefined;
    expect(tag().default).to.be.true;
    expect(tag()._scope).to.eql({ opts: {} });
  });

  it('should accept override from _scope', () => {
    const options = [
      { label: 'Value Descending', value: { field: 'value', order: 'Descending' } },
      { label: 'Value Ascending', value: { field: 'value', order: 'Ascending' } }
    ];
    const onselect = () => null;

    tag()._scope = {
      opts: { hover: true, native: false },
      clear: 'None selected', options, label: 'Choice', onselect
    };
    tag().init();

    expect(tag().label).to.eql('Choice');
    expect(tag().clearOption).to.eql({ label: 'None selected', clear: true });
    expect(tag().options).to.eql(options);
    expect(tag().hover).to.be.true;
    expect(tag().native).to.be.false;
    expect(tag().callback).to.be.a('function');
    expect(tag()._scope).to.eql({
      opts: { hover: true, native: false },
      clear: 'None selected', options, label: 'Choice', onselect
    });
  });

  it('should override selectedOption with first label when options set and clear undefined', () => {
    const options = [
      { label: 'Value Descending', value: { field: 'value', order: 'Descending' } },
      { label: 'Value Ascending', value: { field: 'value', order: 'Ascending' } }
    ];

    tag()._scope = { opts: {}, options };
    tag().init();

    expect(tag().default).to.be.true;
    expect(tag().selectedOption).to.eq(options[0].label);
  });

  it('should be native', () => {
    tag()._scope.opts.native = true;
    tag().init();

    expect(tag().native).to.be.true;
    tag()._scope.opts.native = 'true';
    tag().init();

    expect(tag().native).to.be.true;
  });

  it('should not be native', () => {
    tag()._scope.opts.native = false;
    tag().init();

    expect(tag().native).to.be.false;
    tag()._scope.opts.native = 'false';
    tag().init();

    expect(tag().native).to.be.false;
  });

  it('should allow hover', () => {
    tag()._scope.opts.hover = true;
    tag().init();

    expect(tag().hover).to.be.true;
    tag()._scope.opts.hover = 'true';
    tag().init();

    expect(tag().hover).to.be.true;
  });

  it('should not allow hover', () => {
    tag()._scope.opts.hover = false;
    tag().init();

    expect(tag().hover).to.be.false;
    tag()._scope.opts.hover = 'false';
    tag().init();

    expect(tag().hover).to.be.false;
  });
});
