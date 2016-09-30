import { Navigation } from '../../src/tags/navigation/gb-navigation';
import suite from './_suite';
import { expect } from 'chai';

suite<Navigation>('gb-navigation', ({ flux, html, mount }) => {
  it.only('mounts tag', () => {
    const tag = mount();

    // tag.processed = <any>[{
    //   displayName: 'Main',
    //   refinements: [
    //     { value: 'Pick up', type: 'Value', count: 12345 },
    //     { value: 'Deliver', type: 'Value', count: 123 }]
    // },
    // {
    //   displayName: 'Category',
    //   refinements: [
    //     { value: 'Health', type: 'Value', count: 200 },
    //     { value: 'Items', type: 'Value', count: 59234 }]
    // }];
    // tag.update();
    // console.log(tag.processed);
    console.log(html());
    expect(tag).to.be.ok;
    // expect(html().querySelector('gb-side-nav')).to.eq('idk');
  });
});
