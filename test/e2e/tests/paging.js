module.exports = {
  'initial state': (browser) => {
    browser.url('http://localhost:8080')
      // .waitForRiot()
      .waitForElementVisible('.gb-pager__link.next', 100)
      .pause(500) // wait for riot to render results
      .expect.element('.gb-pager__link.prev.disabled').to.be.present;
    browser.expect.element('.gb-terminal__link.first.disabled').to.be.present;
    browser.expect.element('.gb-terminal__link.last:not(.disabled)').to.be.present;
    browser.expect.element('.gb-pager__link.next:not(.disabled)').to.be.present;
    browser.expect.element('.gb-pages__page.selected').text.to.eq('1');
    browser.end();
  },

  'go to next page': (browser) => {
    browser.url('http://localhost:8080')
      .waitForElementVisible('.gb-pager__link.next', 100)
      .pause(500) // wait for riot to render results
      .click('.gb-pager__link.next')
      .expect.element('.gb-pager__link.prev:not(.disabled)').to.be.present.before(1000);
    browser.expect.element('.gb-terminal__link.first:not(.disabled)').to.be.present;
    browser.expect.element('.gb-pages__page.selected').text.to.eq('2');
    browser.end();
  },

  'go to previous page': '' + function(browser) {
    browser.url('http://localhost:8080')
      .waitForElementVisible('.gb-pager__link.prev', 100)
      .pause(500) // wait for riot to render results
      .click('.gb-pager__link.prev')
      .expect.element('.gb-pager__link.prev.disabled').to.be.present.before(1000);
    browser.expect.element('.gb-terminal__link.first.disabled').to.be.present;
    browser.end();
  },

  'go to last page': (browser) => {
    browser.url('http://localhost:8080')
      .waitForElementVisible('.gb-terminal__link.last', 100)
      .pause(500) // wait for riot to render results
      .click('.gb-terminal__link.last')
      .expect.element('.gb-pager__link.next.disabled').to.be.present.before(1000);
    browser.expect.element('.gb-terminal__link.last.disabled').to.be.present;
    browser.expect.element('.gb-pages__page.selected').text.to.eq('833');
    browser.expect.element('.gb-pages__ellipsis:nth-child(1)').to.be.visible;
    browser.expect.element('.gb-pages__ellipsis:nth-child(6)').to.not.be.present;
    browser.end();
  },

  'go to first page': '' + function(browser) {
    browser.url('http://localhost:8080')
      .waitForElementVisible('.gb-terminal__link.first', 100)
      .pause(500) // wait for riot to render results
      .click('.gb-terminal__link.first')
      .expect.element('.gb-pager__link.prev.disabled').to.be.present.before(1000);
    browser.expect.element('.gb-terminal__link.first.disabled').to.be.present;
    browser.end();
  },

  'display pages': (browser) => {
    browser.url('http://localhost:8080')
      .waitForElementVisible('.gb-pages__page', 100)
      .pause(500) // wait for riot to render results
      .expect.element('.gb-pages li:nth-of-type(1) .gb-pages__page').text.to.eq('1');
    browser.expect.element('.gb-pages li:nth-of-type(5) .gb-pages__page').text.to.eq('5');
    browser.elements('css selector', '.gb-pages__page', (result) => {
      browser.assert.equal(result.value.length, 5);
    });
    browser.expect.element('.gb-pages__ellipsis:nth-child(1)').to.not.be.present;
    browser.expect.element('.gb-pages__ellipsis:nth-child(6)').to.be.visible;
    browser.end();
  },

  'jump to page': (browser) => {
    browser.url('http://localhost:8080')
      .waitForElementVisible('.gb-pages__page', 100)
      .pause(500) // wait for riot to render results
      .click('.gb-pages li:nth-of-type(4) .gb-pages__page')
      .expect.element('.gb-pages__page.selected').text.to.eq('4');
    browser.expect.element('.gb-pages__ellipsis:nth-child(1)').to.be.visible.before(1000);
    browser.expect.element('.gb-pages__ellipsis:nth-child(7)').to.be.visible;
    browser.end();
  }
};
