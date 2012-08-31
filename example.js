var Session = require('./lib/jsprof/session');
var backtrace = require('./lib/jsprof/helpers');

var Thing = function () { };

Thing.doIt = function () {
  var t = new Thing();
  t.doThings();
  t.doThing();

  backtrace().forEach(function (frame) {
    console.log(frame.getFileName() + ':' + frame.getLineNumber());
  });
};

Thing.prototype.doThings = function () {
  for (var i = 0; i < 10; i++) {
    this.doThing();
    this.doOtherThing();
    this.doOtherThing();
  }
};

Thing.prototype.doOtherThing = function () {
};

Thing.prototype.doThing = function () {
};

//////

var session = new Session({
  'Thing': Thing,
  'Thing.prototype': Thing.prototype
});
session.profile(function () {
  Thing.doIt();
});

session.printCallTimes();
console.log();
session.printDrillTimes();
