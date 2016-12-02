module.exports = {
  'initial state': (browser) => {
    browser.url('http://localhost:9090')
      .pause(1000);
    browser.getLog(function(logEntriesArray) {
      console.log('Log length: ' + logEntriesArray.length);
      logEntriesArray.forEach(function(log) {
        console.log('[' + log.level + '] ' + log.timestamp + ' : ' + log.message);
      });
      console.log(logEntriesArray)
    });
    // .waitForElementVisible('.gb-pager__link.next', 100)
    // .pause(500); // wait for riot to render results
    browser.expect.element('gb-breadcrumbs div.gb-breadcrumbs gb-query-crumb').to.be.visible;
    browser.expect.element('gb-breadcrumbs div.gb-breadcrumbs gb-list ul').to.be.visible;
    browser.expect.element('gb-breadcrumbs .gb-query-label').to.not.be.present;
    browser.expect.element('gb-breadcrumbs .gb-original-query').to.not.be.present;
    browser.end();
  },

  'from a link': (browser) => {
    browser.url('http://localhost:9090/?q=table&refinements=%5B%7B%22type%22%3A%20%22Value%22%2C%20%22value%22%3A%20%22Household%20%26%20Grocery%22%2C%20%22navigationName%22%3A%20%22category1%22%7D%2C%20%7B%22type%22%3A%20%22Value%22%2C%20%22value%22%3A%20%22School%20%26%20Office%20Supplies%22%2C%20%22navigationName%22%3A%20%22category2%22%7D%2C%20%7B%22type%22%3A%20%22Value%22%2C%20%22value%22%3A%20%22Binders%20%26%20Folders%22%2C%20%22navigationName%22%3A%20%22category3%22%7D%5D')
      // .waitForRiot()
      .waitForElementVisible('.gb-pager__link.next', 100)
      .pause(500); // wait for riot to render results
    browser.expect.element('gb-breadcrumbs div.gb-breadcrumbs gb-query-crumb div .gb-query-label').text.to.eq('Results for:');
    browser.expect.element('gb-breadcrumbs div.gb-breadcrumbs gb-query-crumb div .gb-original-query').text.to.eq('table');
    browser.elements('css selector', 'gb-breadcrumbs div.gb-breadcrumbs > gb-list > ul > li', (result) => {
      browser.assert.equal(result.value.length, 3);
    });
    browser.expect.element('gb-breadcrumbs div.gb-breadcrumbs li:nth-of-type(1) gb-refinement-crumb b').text.to.eq('Main Category: Household & Grocery');
    browser.expect.element('gb-breadcrumbs div.gb-breadcrumbs li:nth-of-type(2) gb-refinement-crumb b').text.to.eq('Category: School & Office Supplies');
    browser.expect.element('gb-breadcrumbs div.gb-breadcrumbs li:nth-of-type(3) gb-refinement-crumb b').text.to.eq('Sub Category: Binders & Folders');
    browser.end();
  }
}
