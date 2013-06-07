var global = (typeof window !== 'undefined' && window != null) ? window : global;
var _ = require('underscore');
var when = require('when');
var _ref = require('./Either'), left = _ref.left, right = _ref.right;
var TEMP = global.TEMPORARY;
var PERM = global.PERSISTENT;
var LocalFileSystem;
var requestPersistentQuota;
function getPathAndFilenameFromFilename(filename) {
  var splitFilename = filename.split('/');
  return [_.rest(_.initial(splitFilename)), _.last(splitFilename)];
}
function createDirectoryFromPath(filesystem) {
  return function(filepath){
    var loop, promise, promisesAndResolversAndSegments;
    // create a promise and a resolver for each segment
    promisesAndResolversAndSegments = _.map(filepath, function(pathSegment){
      var segmentDeferred = when.defer();
      return [segmentDeferred.promise, segmentDeferred.resolver, pathSegment];
    });
    //join all the promises into one via when.all
    promise = when.all(_.reduce(promisesAndResolversAndSegments, function(promises, promiseAndResolver){
      return promises.concat(_.head(promiseAndResolver));
    }, []));
    //loops through the promises and resolvers. when one is created, resolve
    // its promise and then loop through the rest.
    loop = function(directory, promisesAndResolvers){
      var success, failure, headPromiseAndResolver, rest;
      if(promisesAndResolvers.length > 0){
        headPromiseAndResolver = _.head(promisesAndResolvers);
        rest = promisesAndResolvers.length > 1 ? _.rest(promisesAndResolvers) : [];
        success = function(directory){
          headPromiseAndResolver[1].resolve(directory);
          loop(directory, rest);
        };
        failure = function(err){
          headPromiseAndResolver[1].reject(err);
        };
        //the segment to create is the third element in the array
        directory.getDirectory(headPromiseAndResolver[2], {create: true}, success, failure);
        return;
      }else{
        return directory;
      }
    };
    loop(filesystem.root, promisesAndResolversAndSegments);
    return promise;
  };
}
function getFileEntry (filesystem) {
  return function(filepath){
    return function(create){
      var deferred, promise, pathAndFilename, file, filepaths, getFileEntry, rejectPromise, directoriesSuccess;
      pathAndFilename = getPathAndFilenameFromFilename(filepath);
      filepaths = pathAndFilename[0];
      file = pathAndFilename[1];
      deferred = when.defer();
      promise = deferred.promise;
      getFileEntry = function(){
        filesystem.root.getFile(filepaths, {create: create}, function(fileEntry){
          deferred.resolve(fileEntry);
        }, function(err){
          deferred.reject(err);
        });
      };
      directoriesSuccess = function(directories){
        deferred.notify("directories created.");
        getFileEntry();
      };
      rejectPromise = function(err) {
        deferred.reject(err);
      };
      if(create === true) {
        createDirectoryFromPath(filesystem)(filepaths).then(getFileEntry, rejectPromise);
      } else {
        getFileEntry();
      }
      return promise;
    };
  };
}

var base = {
  getPathAndFilenameFromFilename: getPathAndFilenameFromFilename,
  createDirectoryFromPath: createDirectoryFromPath,
  getFileEntry: getFileEntry
};
if (window.navigator.userAgent.indexOf('PhantomJS') < 0) {
  var requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem;
  var requestPersistentQuota = function(type, sizeInMB, requestQuotaSuccess, requestQuotaFailure) {
    try{
      return right(global.webkitStorageInfo.requestQuota(type, sizeInMB, requestQuotaSuccess, requestQuotaFailure));
    } catch (e) {
      return left("Persistent storage not available in this browser. Try a webkit browser");
    }
  };
  LocalFileSystem = function(name){
    return _.extend(base, {
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
          requestPersistentQuota(type, sizeInMB, requestQuotaSuccess, requestQuotaFailure).left().foreach(function(str){ requestQuotaFailure(str); });
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
      },
      Nothing: {}
    });
  };
} else {
  LocalFileSystem = function(name) {
    return _.extend(base, {
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
    });
  };
}

module.exports = LocalFileSystem;

