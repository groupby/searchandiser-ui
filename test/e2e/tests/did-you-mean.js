module.exports = {
  'initial state': (browser) => {
    browser.url('http://localhost:9090/?q=tabless')
      .waitForRiot();
    browser.expect.element('gb-did-you-mean li:nth-of-type(1) a').text.to.eq('tables');
    browser.expect.element('gb-did-you-mean li:nth-of-type(2) a').text.to.eq('table _');
    browser.end();
  }
};
