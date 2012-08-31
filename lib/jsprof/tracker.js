
var Tracker = function () {
  this.count = 0;
  this.total = 0.0;
};

Tracker.prototype.report = function () {
  return {
    count: this.count,
    total: this.total,
    avg: this.count === 0 ? undefined : this.total / this.count
  };
};

Tracker.prototype.reportString = function () {
  return JSON.stringify(this.report());
};

Tracker.prototype.track = function (el) {
  this.total += el;
  this.count += 1;
};

module.exports = Tracker;
