var replacementPreparer = function (error, trace) {
  return trace;
};

module.exports = function () {
  var capture;
  var oldPreparer = Error.prepareStackTrace;
  Error.prepareStackTrace = replacementPreparer;
  try { capture.error } catch (e) {
    capture = e.stack;
  }
  Error.prepareStackTrace = oldPreparer;
  return capture;
};
