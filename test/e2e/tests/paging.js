module.exports = {
  'go to next page': (browser) => {
    browser.url('http://localhost:8080')
      // .setValue('input[type=text]', 'nightwatch')
      .waitForElementVisible('.gb-pager__link.next', 1000)
      .pause(500)
      .click('.gb-pager__link.next')
      // .assert.containsText('#main', 'Night Watch')
      .pause(500)
      .assert.cssClassNotPresent('.gb-pager__link.prev', 'disabled')
      .end();
  }
};
