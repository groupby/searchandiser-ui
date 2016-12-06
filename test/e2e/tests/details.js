module.exports = {
  'initial state': '' + function(browser) {
    browser.url('http://localhost:9090/details.html?id=234381')
      .waitForRiot();
    browser.expect.element('.gb-details h1').text.to.eq('CVS Travel Toothbrush With Colgate Toothpaste');
    browser.expect.element('.gb-details h2').text.to.eq('1.99');
    browser.assert.attributeEquals('.gb-details img', 'src', 'http://www.cvs.com/bizcontent/merchandising/productimages/large/5042804753.jpg');
    browser.end();
  }
};
