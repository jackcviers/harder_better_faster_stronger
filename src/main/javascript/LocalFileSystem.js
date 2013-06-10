var global = (typeof window !== 'undefined' && window != null) ? window : global;
var _ = require('underscore');
var when = require('when');
var callbacks = require('when/callbacks');
var _ref = require('./Either'), left = _ref.left, right = _ref.right;
var TEMP = global.TEMPORARY;
var PERM = global.PERSISTENT;
var LocalFileSystem;
var requestPersistentQuota;

// split the path into segments and filename
function getPathAndFilenameFromFilename(filename) {
  var splitFilename = filename.split('/');
  //segments array is first, filename is last
  return [_.rest(_.initial(splitFilename)), _.last(splitFilename)];
}

// create each direcotry in turn, and return the last directory created in
// a promise
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

// changes a filesystem url (filesystem:protocol://domain/filepath) into a 
// fileEntry for reading or writing. uses the when callbacks module
// to lift the callback func to a promise.
function resolveLocalFileSystemURL(filesystem){
  return function(url){
    var resolver;
    // webkit and firefox have different url resolvers.
    resolver = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
    return callbacks.call(resolver, url);
  };
}
// getFileEntry lifts native into a promise
function getFileEntry (filesystem) {
  return function(filepath){
    return function(create){
      var pathAndFilename, getFileEntry;
      pathAndFilename = getPathAndFilenameFromFilename(filepath);
      getFileEntry = function(arrOfDir) {
        var deferred, promise;
        deferred = when.defer();
        promise = deferred.promise;
        if(create === true){
          _.last(arrOfDir).getFile(pathAndFilename[1], {create: create}, function(fileEntry){deferred.resolve(fileEntry); }, function(err){ deferred.reject(err); });
        } else {
          _.last(arrOfDir).getFile(pathAndFilename[1], function(fileEntry){deferred.resolve(fileEntry); }, function(err){ deferred.reject(err); });
        }        
        return promise;
      };
      if(create === true){
        return createDirectoryFromPath(filesystem)(pathAndFilename[0]).then(getFileEntry, function(err){ return err; });
      } else {
        return getFileEntry([filesystem.root]);
      }
    };
  };
}

// not directly in LocalFileSystem so that we can call them internally
// without the object reference
var base = {
  getPathAndFilenameFromFilename: getPathAndFilenameFromFilename,
  createDirectoryFromPath: createDirectoryFromPath,
  getFileEntry: getFileEntry
};
// filesystem doesn't work in phantomjs, so expose the same
// api, but reject the promises.
if (window.navigator.userAgent.indexOf('PhantomJS') < 0) {
  var requestFileSystem = global.requestFileSystem || global.webkitRequestFileSystem;
  var requestPersistentQuota = function(type, sizeInMB, requestQuotaSuccess, requestQuotaFailure) {
    try{
      return right(global.webkitStorageInfo.requestQuota(type, sizeInMB, requestQuotaSuccess, requestQuotaFailure));
    } catch (e) {
      return left("Persistent storage not available in this browser. Try a webkit browser");
    }
  };
  LocalFileSystem = _.extend(base, {
      requestTemporaryFileSystem: function(sizeInMB) {
        return callbacks.call(requestFileSystem, TEMP, sizeInMB * 1024 * 1024);
      },
      requestPersistentFileSystem: function(sizeInMB) {
        return callbacks.call(requestPersistentQuota, PERM, sizeInMB * 1024 * 1024).then(
          function(sizeGranted){
            return callbacks.call(requestFileSystem, PERM, sizeInMB * 1024 * 1024);
          }, function(err) {
            return err;
          });
      },
      Nothing: {}
    });
} else {
  LocalFileSystem = _.extend(base, {
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
}

module.exports = LocalFileSystem;
