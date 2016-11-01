exports.command = function(cb) {

  this.execute(function() {
    return Object.keys(this.window.riot);
  }, [], (riot) => {
    console.log(riot);
    // riot.once('updated', () => {
    //   if (typeof cb === 'function') {
    //     cb.call(this, riot);
    //   }
    // });
  });

  return this;
};
