function testInBrowserOnly (context) {
  return function(testFn) {
    if (window.navigator.userAgent.indexOf('PhantomJS') < 0) {
      testFn.call(context);
    } else {
      return;
    }
  };
};

module.exports = testInBrowserOnly;
