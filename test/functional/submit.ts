import { Submit } from '../../src/tags/submit/gb-submit';
import suite from './_suite';
import { expect } from 'chai';

suite<Submit>('gb-submit', ({ flux, html, mount, sandbox }) => {
  it('mounts tag', () => {
    const tag = mount();

    expect(tag).to.be.ok;
    expect(html().querySelector('.gb-submit')).to.be.ok;
    expect(html().querySelector('.gb-submit').textContent).to.eq('🔍');
  });

  it('should reset query', (done) => {
    const tag = mount();
    const stub = sandbox().stub(flux(), 'reset', (value): any => {
      expect(value).to.eq('old');
      done();
    });
    tag.searchBox = <any>{ value: 'old' };

    tag.root.click();

    expect(stub.called).to.be.true;
  });
});
