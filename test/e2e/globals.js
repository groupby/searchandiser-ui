const static = require('node-static');
const chromedriver = require('chromedriver');

const fileServer = new static.Server('./test/e2e/demo');
let server = null;

module.exports = {
  before(done) {
    chromedriver.start();
    server = require('http').createServer((request, response) => {
      request.addListener('end', () => fileServer.serve(request, response))
        .resume();
    });
    server.listen(8080);
    done();
  },

  after(done) {
    chromedriver.stop();
    server.close();
    done();
  }
};
