# jsprof

This is a simple JavaScript profiler written in JavaScript.

## Usage

You start by opening a session, and telling `jsprof` which objects you want
to follow in this session.  You give each a name which it will be referred to
as in reports:

``` javascript
var session = new Session({
  'Thing': Thing,
  'Thing.prototype': Thing.prototype
});
```

Once you do that, you're free to use `profile` as many times as you'd like, to
collect data about important parts of your code.  Each time you use `profile`,
your JavaScript functions will be wrapped in profiler calls, and then unwrapped
to remove unnecessary overhead in the places where you choose to not profile.

``` javascript
session.profile(function () {
	Thing.doSomething();
});
```

When you're done, you can generate some reports with that session object:

``` javascript
session.printCallTimes(); // call time breakdown
session.printDrillTimes(); // drilldown breakdown
```
