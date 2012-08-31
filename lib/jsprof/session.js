var Tracker = require('./tracker');
var Profiler = require('./profiler');

var Session = function (profs) {
  this.profs = profs;
  this.profilers = {};
  this.callTimes = {}; // how much for each method
  this.drillTimes = { __tracker: new Tracker() }; // how much for each
  this.callStack = [];
};

Session.prototype = {

  track: function (profiler) {
    var start = new Date().getTime();

    // Run the original and record the times
    this.callStack.push(profiler.callSign);
    profiler.run();
    var elapsed = new Date().getTime() - start;

    // Add for the drillTimes
    var d = this.drillTimes;
    this.callStack.forEach(function (c) {
      d[c] = d[c] || {};
      d = d[c];
    });
    d.__tracker = d.__tracker || new Tracker();
    d.__tracker.track(elapsed);

    this.callStack.pop();

    // Add for the callTimes
    var context = profiler.contextName;
    var key = profiler.key;
    var contextTimes = this.callTimes[context] = this.callTimes[context] || {};
    var tracker = contextTimes[key] = contextTimes[key] || new Tracker();
    tracker.track(elapsed);
  },

  profile: function (cb) {
    var profiler, that = this;
    var prof, profName;
    // Add the profilers
    for (profName in this.profs) {
      prof = this.profs[profName];
      this.profilers[prof] = this.profilers[prof] || {};
      Object.getOwnPropertyNames(prof).forEach(function (prop) {
        if (typeof prof[prop] === 'function') {
          profiler = new Profiler(that, prof, prop, prof[prop], profName);
          that.profilers[prof][prop] = profiler;
          prof[prop] = profiler.runner;
        }
      });
    };
    // Call the callback
    cb();
    // Remove the profilers
    for (profName in this.profs) {
      prof = this.profs[profName];
      Object.getOwnPropertyNames(prof).forEach(function (prop) {
        profiler = that.profilers[prof][prop];
        if (profiler) {
          prof[prop] = profiler.original;
        }
      });
    };
  },

  printCallTimes: function () {

    for (var contextName in this.callTimes) {
      console.log(contextName);
      for (var key in this.callTimes[contextName]) {
        console.log(
          '\t' +
          key + ': ' +
          this.callTimes[contextName][key].reportString()
        );
      }
    }

  },

  printDrillTimes: function (profiler, object, indent, drill) {

    indent = indent || 0;
    drill = drill || [];
    object = object || this.drillTimes;

    var space = new Array(indent).join('\t');

    var tracker = object.__tracker;
    if (profiler) {
      console.log(space + profiler + ': ' + tracker.reportString());
    }

    for (var nprof in object) {
      if (nprof === '__tracker') continue;
      this.printDrillTimes(nprof, object[nprof], indent + 1);
    }
  }

};

module.exports = Session;
