var global = (typeof window !== 'undefined' && window != null) ? window : global;
var when = require('when');
var TEMP = global.TEMPORARY;
var PERM = global.PERSISTENT;
function LocalFileSystem(name){
  this.name = name;
  this.filesystem = LocalFileSystem.Nothing;
}
// all tests will fail using the file system on phantom js. Luckilly we aren't
// testing file saving or anything outside of the browser.
// ALSO MUSΤ HAVE SERVER!!!!
if (window.navigator.userAgent.indexOf('PhantomJS') < 0) {
  var requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem;
  var requestPersistentQuota = global.webkitStorageInfo.requestQuota || function() {
    throw new Error("Persistent storage not available in this browser. Try a webkit browser.");
  };

  LocalFileSystem.Nothing = {};

  LocalFileSystem.prototype = (function() {return {};})();

  LocalFileSystem.prototype.requestTemporaryFileSystem = function(sizeInMB) {
    var deferred, promise, success, failure;
    console.log(sizeInMB);
    deferred = when.defer();
    promise = deferred.promise;
    success = (function(that) {
      return function(fs) {
        that.filesystem = fs;
        deferred.resolve(fs);
      };
    }(this));
    failure = function(error) {
      deferred.reject(error);
    };
    requestFileSystem(TEMP, sizeInMB * 1024 * 1024, success, failure);
    return promise;
  };

  LocalFileSystem.prototype.requestPersistentFileSystem = function(sizeInMB) {
    var deferred, promise, success, failure, type, requestQuota, sizeInBytes;
    type = PERM;
    sizeInBytes = sizeInMB * 1024 * 1024;
    requestQuota = function(type, sizeInBytes){
      var requestQuotaDeferred, requestQuotaPromise, requestQuotaSuccess, requestQuotaFailure;
      requestQuotaDeferred = when.defer();
      requestQuotaPromise = requestQuotaSuccess.promise;
      requestQuotaSuccess = function(sizeGranted) {
        requestQuotaDeferred.resolve(sizeGranted);
      };
      requestQuotaFailure = function(error) {
        requestQuotaDeferred.reject(error);
      };
      try{
        requestPersistentQuota(type, sizeInBytes, requestQuotaSuccess, requestQuotaFailure);
      } catch(e) {
        requestQuotaFailure(e);
      }
      return requestQuotaPromise;
    };
    success = (function(that){
      return function(fs) {
        that.filesystem = fs;
        deferred.resolve(fs);
      };
    })(this);
    failure = function(error) {
      deferred.reject(error);
    };
    requestQuota(type, sizeInBytes).then(function(sizeGranted){
      requestFileSystem(type, sizeInBytes, success, failure);
    }, function(error){deferred.reject(error);});
    return promise;
  };

  module.exports = LocalFileSystem;
} else {

  LocalFileSystem.Nothing = {};

  LocalFileSystem.prototype = (function() {return {};})();

  LocalFileSystem.prototype.requestTemporaryFileSystem = function(sizeInMB) {
    var deferred, promise;
    deferred = when.defer();
    deferred.reject('filesystem is browser only!');
    return promise;
  };

  LocalFileSystem.prototype.requestPersistentFileSystem = function(sizeInMB) {
    var deferred, promise;
    deferred = when.defer();
    deferred.reject('filesystem is browser only!');
    return promise;
  };

  module.exports = LocalFileSystem;
}
