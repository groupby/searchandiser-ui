import { Select } from '../../../src/tags/select/gb-select';
import suite from './_suite';
import { expect } from 'chai';

const SCOPE = { _config: {} };

suite('gb-select', Select, { _scope: SCOPE }, ({ tag }) => {

  describe('init()', () => {
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
      const config = {
        hover: true,
        native: false,
        clear: 'None selected',
        label: 'Choice'
      };
      const options = [{ a: 'b' }, { c: 'd' }];
      const onselect = () => null;
      tag()._scope = <any>{
        _config: config,
        options,
        onselect
      };

      tag().init();

      expect(tag().label).to.eql('Choice');
      expect(tag().clearOption).to.eql({ label: 'None selected', clear: true });
      expect(tag().options).to.eql(options);
      expect(tag().callback).to.eq(onselect);
      expect(tag()._config).to.eq(config);
    });

    it('should override selectedOption with first label when options set and clear undefined', () => {
      const options = [
        { label: 'Value Descending' },
        { label: 'Value Ascending' }
      ];
      tag()._scope = <any>{ options, _config: {} };

      tag().init();

      expect(tag().default).to.be.true;
      expect(tag().selectedOption).to.eq(options[0].label);
    });

    it('should override selectedOption with first option when options set and clear undefined', () => {
      const options = ['first', 'second'];
      tag()._scope = <any>{ options, _config: {} };

      tag().init();

      expect(tag().default).to.be.true;
      expect(tag().selectedOption).to.eq(options[0]);
    });
  });

  describe('updateOptions()', () => {
    it('should update options', () => {
      const opts = ['first', 'second'];
      tag().default = true;
      const spy = tag().update = sinon.spy(({options}) => expect(options).to.eq(opts));

      tag().updateOptions(opts);

      expect(spy.called).to.be.true;
    });

    it('should update options with clearOption', () => {
      const opts = ['first', 'second'];
      tag().default = false;
      const clearOption = tag().clearOption = { label: 'a', clear: true };
      const spy = tag().update = sinon.spy(({options}) => expect(options).to.eql([clearOption, ...opts]));

      tag().updateOptions(opts);

      expect(spy.called).to.be.true;
    });
  });

  describe('selectLabel()', () => {
    it('should return selectedOption if set', () => {
      const selectedOption = tag().selectedOption = 'option';

      tag().selectLabel();
      expect(tag().selectedOption).to.eq(selectedOption);
    });
  });
});
