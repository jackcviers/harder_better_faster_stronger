var global = (typeof window !== 'undefined' && window != null) ? window : global;
var _ = require('underscore');
var when = require('when');
var TEMP = global.TEMPORARY;
var PERM = global.PERSISTENT;
var LocalFileSystem;
var requestPersistentQuota;
if (window.navigator.userAgent.indexOf('PhantomJS') < 0) {
  var requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem;
  if(global.webkitStorageInfo.requestQuota) {
    requestPersistentQuota = function(type, sizeInMB, requestQuotaSuccess, requestQuotaFailure) {
      global.webkitStorageInfo.requestQuota(type, sizeInMB, requestQuotaSuccess, requestQuotaFailure);
    };
  } else {
      global.webkitStorageInfo.requestQuota = function() {
        throw new Error("Persistent storage not available in this browser. Try a webkit browser.");
      };
  }
  LocalFileSystem = function(name){
    return {
      name: name,
      requestTemporaryFileSystem: function(sizeInMB) {
        var deferred, promise, success, failure;
        deferred = when.defer();
        promise = deferred.promise;
        success = (function(that) { return function(fs) {
          that.filesystem = fs;
          deferred.resolve(fs);
        };}(this));
        failure = function(error) {
          deferred.reject(error);
        };
        requestFileSystem(TEMP, sizeInMB * 1024 * 1024, success, failure);
        return promise;
      },
      requestPersistentFileSystem: function(sizeInMB) {
        var deferred, promise, success, failure, type, requestQuota, sizeInBytes;
        deferred = when.defer();
        promise = deferred.promise;
        type = PERM;
        sizeInBytes = sizeInMB * 1024 * 1024;
        requestQuota = function(type, sizeInBytes){
          var requestQuotaDeferred, requestQuotaPromise, requestQuotaSuccess, requestQuotaFailure;
          requestQuotaDeferred = when.defer();
          requestQuotaPromise = requestQuotaDeferred.promise;
          requestQuotaSuccess = function(sizeGranted) {
            requestQuotaDeferred.resolve(sizeGranted);
          };
          requestQuotaFailure = function(error) {
            requestQuotaDeferred.reject(error);
          };
          try{
            requestPersistentQuota(type, sizeInMB, requestQuotaSuccess, requestQuotaFailure);
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
n        return promise;
      },
      Nothing: {},
      getPathAndFilenameFromFilename: function(filename) {
        var filepathAndFilename, filepath, file;
        if(filename.indexOf('/') !== -1) {
          filepathAndFilename = filename.split('/');
          filepath = _.split(filepathAndFilename);
          file = _.last(filepathAndFilename);
        } else {
          filepath = '/';
          file = filename;
        }
        return [filepath, file];
      },
      // this returns an either, which is a function with a left
      // containing an Error of some type, or right, which contains
      // a value. Lefts and Rights are themselves Eithers, which
      // means that they are mapable objects. In this case
      // the Either returned contains an Left(Error) or a 
      // Right(PromiseOfDirectory)
      createDirectoryFromPath: function(filepath) {
        
      },
      getFileEntry: function(filesystem){
        return function(filename){
          var pathAndFilename = this.getPathAndFilenameFromFilename(filename);
          
        };        
      }
    };
  };
} else {
  LocalFileSystem = function(name) {
    return {
      name: name,
      requestTemporaryFileSystem: function(sizeInMB) {
        var deferred, promise;
        deferred = when.defer();
        deferred.reject('filesystem is browser only!');
        return promise;
      },
      requestPersistentFileSystem: function(sizeInMB) {
        var deferred, promise;
        deferred = when.defer();
        deferred.reject('filesystem is browser only!');
        return promise;
      },
      Nothing: {}
    };
  };
}

module.exports = LocalFileSystem;

