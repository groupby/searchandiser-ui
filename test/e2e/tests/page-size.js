module.exports = {
  'initial state': (browser) => {
    browser.url('http://localhost:9090')
      .waitForElementVisible('gb-results', 1000)
      .pause(500)
    browser.expect.element('gb-page-size li:nth-of-type(1) a').to.be.present;
    browser.expect.element('gb-page-size gb-option-list li:nth-of-type(2) gb-option a').text.to.eq('24');
    browser.expect.element('gb-page-size gb-option-list li:nth-of-type(3) gb-option a').text.to.eq('50');
    browser.end();
  }
};
