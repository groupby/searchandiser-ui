module.exports = {
  'initial state': (browser) => {
    browser.url('http://localhost:9090/details.html?id=234381')
      .waitForElementVisible('div', 1000)
      .pause()
  }
};
