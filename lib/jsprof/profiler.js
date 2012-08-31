
var Profiler = function (session, context, key, original, contextName) {
  this.session = session;
  this.original = original;
  this.context = context;
  this.contextName = contextName;
  this.key = key;

  this.callSign = contextName + '.' + this.key;

  var that = this;
  this.runner = function () {
    session.track(that);
  };
};

Profiler.prototype.run = function () {
  this.original.bind(this.context)();
};

module.exports = Profiler;
