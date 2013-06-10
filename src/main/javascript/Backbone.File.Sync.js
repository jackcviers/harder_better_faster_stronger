var when = require('when');
var callbacks = require('when/callbacks');
var LocalFileSystem = require('./LocalFileSystem');
var uuid = require('node-uuid');

module.exports = {
  File: { 
    // for this sync, we are assuming that models
    // exist in collections modeling
    // a file system. Therefore, we
    // check for the Collection's fs
    // instance before doing anything
    // and reject the promise if something
    // is amiss.
    sync: function(method, model, options){
      var deferred, promise, methodMap, fs;
      deferred = when.defer();
      promise = deferred.promise;
      if(
        (typeof model === 'undefined' || model === null) || 
          (typeof model.collection === 'undefined' || model.collection === null) || 
          (typeof model.collection.filesystem === 'undefined' || 
           model.collection.filesystem === null)
      ) {
        deferred.reject(new TypeError('Your model must belong to a collection of files, and that collection must have a filesystem instance.'));
      } else {
        fs = model.collection.filesystem;
      }
      var createUpdate = function(model, options) {
        var deferred, promise;
        deferred = when.defer();
        promise = deferred.promise;
        LocalFileSystem.requestPersistentFileSystem(model.collection.sizeInMB * 1.50).then(
          function(filesystem){
            return LocalFileSystem.getFileEntry(filesystem)(true);
          },
          function(err){ return err; }).then(function(fileEntry){
            var deferred, promise;
            deferred = when.defer();
            promise = deferred.promise;
            fileEntry.createWriter(function(writer){
              deferred.resolve([writer, fileEntry.toURL()]);
            }, function(err){
              deferred.reject(err);
            });
            return promise;
        }, function(err){ return err; }).then(function(writerAndUrl){
          var deferred, promise, writer;
          deferred = when.defer();
          promise = deferred.promise;
          writer = writerAndUrl[0];
          writer.onwriteend = function(event){
            deferred.resolve(writerAndUrl[1]);
          };
          writer.onerror = function(err){
            deferred.reject(err);
          };
          writer.write(model.toSerialized());
          return promise;
        }, function(err){ return err; }).then(function(url){
          model.filesystemUrl = url;
          deferred.resolve(model, options);
        }, function(err){ deferred.reject(err); });
        return promise;
      };
      methodMap = {
        'create': createUpdate,
        'read': function(model, options) {
          var deferred, promise;
          deferred = when.defer();
          promise = deferred.promise;
          LocalFileSystem.resolveLocalFileSystemURL(model.filesystemUrl).then(function(fileEntry){
            return callbacks.call(fileEntry.file);
          }, function(err) { return err; }).then(function(file){
            var reader, deferred, promise;
            deferred = when.defer();
            promise = deferred.promise;
            reader = new FileReader();
            reader.onloadedend = function(event) { deferred.resolve(event); };
            reader.onerror = function(err) { deferred.reject(err); };
            reader.onprogress = function(event) { deferred.notify(event); };
            reader.readAsArrayBuffer(file);
            return promise;
          }, function(err){ return err; }).then(function(event){
            deferred.resolve(event.target);
          }, function(err){ 
            deferred.reject(err);
          }, function(event){
            deferred.notify(event.target);
          });
          return promise;
        },
        'update': createUpdate,
        'delete': function(model, options) {
          var deferred, promise;
          deferred = when.defer();
          promise = deferred.promise;
          LocalFileSystem.resolveLocalFileSystemURL(model.filesystemUrl).then(function(fileEntry){
            return callbacks.call(fileEntry.remove);
          }, function(err){ return err; }).then(function() {
            deferred.resolve("Deleted.");
          }, function(err) {
            deferred.reject(err);
          });
          return promise;
        }
      };
      return methodMap[method](model, options);
    }
  }
};
