const static = require('node-static');

const fileServer = new static.Server('./test/e2e/demo');
let server = null;

module.exports = {
  before(done) {
    // try {
    //   server = require('http').createServer((request, response) => {
    //     request.addListener('end', () => fileServer.serve(request, response))
    //     .resume();
    //   });
    //   server.listen(8080);
    // } catch (e) {
    //   console.log('server is already up', e);
    // }
    done();
  },

  after(done) {
    // try {
    //   server.close();
    // } catch (e) {
    //   console.log('server is already up', e);
    // }
    done();
  }
};
